var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => VaultMindPlugin
});
module.exports = __toCommonJS(main_exports);
var import_node_child_process3 = require("node:child_process");
var import_node_fs3 = require("node:fs");
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_util = require("node:util");
var import_view2 = require("@codemirror/view");
var import_obsidian19 = require("obsidian");

// src/chat/message-store.ts
var MAX_MESSAGES_PER_SESSION = 500;
var MessageStore = class {
  data;
  dirty = false;
  constructor() {
    this.data = { sessions: {} };
  }
  /**
   * Load from serialized data (call with plugin.loadData() result).
   */
  load(raw) {
    if (raw && typeof raw === "object" && raw.sessions) {
      this.data = raw;
    } else {
      this.data = { sessions: {} };
    }
    this.dirty = false;
  }
  /**
   * Get serializable data (pass to plugin.saveData()).
   */
  serialize() {
    this.dirty = false;
    return this.data;
  }
  /**
   * Check if there are unsaved changes.
   */
  isDirty() {
    return this.dirty;
  }
  /**
   * Get messages for a session.
   */
  getMessages(sessionPath) {
    return this.data.sessions[sessionPath] || [];
  }
  /**
   * Set all messages for a session (e.g. on save/clear).
   */
  setMessages(sessionPath, messages) {
    this.data.sessions[sessionPath] = messages.slice(-MAX_MESSAGES_PER_SESSION);
    this.dirty = true;
  }
  /**
   * Append a single message to a session.
   */
  appendMessage(sessionPath, message) {
    if (!this.data.sessions[sessionPath]) {
      this.data.sessions[sessionPath] = [];
    }
    this.data.sessions[sessionPath].push(message);
    if (this.data.sessions[sessionPath].length > MAX_MESSAGES_PER_SESSION) {
      this.data.sessions[sessionPath] = this.data.sessions[sessionPath].slice(
        -MAX_MESSAGES_PER_SESSION
      );
    }
    this.dirty = true;
  }
  /**
   * Remove a session's messages.
   */
  removeSession(sessionPath) {
    delete this.data.sessions[sessionPath];
    this.dirty = true;
  }
  /**
   * Get the last active session path.
   */
  getLastSession() {
    return this.data.lastSession;
  }
  /**
   * Set the last active session path.
   */
  setLastSession(sessionPath) {
    this.data.lastSession = sessionPath;
    this.dirty = true;
  }
  /**
   * List all session paths that have stored messages, sorted by most recent message.
   */
  listSessions() {
    return Object.keys(this.data.sessions).filter((key) => this.data.sessions[key].length > 0).sort((a, b) => {
      const aLast = this.data.sessions[a].slice(-1)[0]?.timestamp ?? 0;
      const bLast = this.data.sessions[b].slice(-1)[0]?.timestamp ?? 0;
      return bLast - aLast;
    });
  }
};

// src/client.ts
var VaultMindClient = class {
  config;
  ws = null;
  reconnectTimer = null;
  reconnectDelay = 1e3;
  intentionalClose = false;
  eventHandlers = /* @__PURE__ */ new Set();
  stateHandlers = /* @__PURE__ */ new Set();
  _state = { connected: false };
  constructor(config) {
    this.config = config;
  }
  get baseUrl() {
    return `http://${this.config.host}:${this.config.port}`;
  }
  get wsUrl() {
    return `ws://${this.config.host}:${this.config.port}/agent/stream`;
  }
  get authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.token}`
    };
  }
  setState(state) {
    this._state = state;
    for (const h of this.stateHandlers) h(state);
  }
  get state() {
    return this._state;
  }
  subscribeEvents(handler) {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }
  subscribeState(handler) {
    this.stateHandlers.add(handler);
    return () => this.stateHandlers.delete(handler);
  }
  emit(event) {
    for (const h of this.eventHandlers) {
      try {
        h(event);
      } catch {
      }
    }
  }
  connect() {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(this.wsUrl, [`Authorization: Bearer ${this.config.token}`]);
    } catch (err) {
      this.setState({ connected: false, error: String(err), reconnecting: true });
      this.scheduleReconnect();
      return;
    }
    this.ws.onopen = () => {
      this.reconnectDelay = 1e3;
      this.setState({ connected: true, reconnecting: false });
    };
    this.ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        this.emit(parsed);
      } catch {
      }
    };
    this.ws.onclose = (event) => {
      this.ws = null;
      if (this.intentionalClose) {
        this.setState({ connected: false, error: void 0, reconnecting: false });
        return;
      }
      const wasConnected = this._state.connected;
      this.setState({ connected: false, error: `closed ${event.code}`, reconnecting: true });
      if (wasConnected || event.code !== 4401) {
        this.scheduleReconnect();
      }
    };
    this.ws.onerror = () => {
      this.setState({ connected: this.ws?.readyState === WebSocket.OPEN, error: "socket error" });
    };
  }
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.intentionalClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setState({ connected: false, error: void 0, reconnecting: false });
    this.intentionalClose = false;
  }
  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectDelay);
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 3e4);
  }
  async httpJson(method, path6, body) {
    const res = await fetch(`${this.baseUrl}${path6}`, {
      method,
      headers: this.authHeaders,
      body: body ? JSON.stringify(body) : void 0
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${text}`);
    return text ? JSON.parse(text) : void 0;
  }
  async status() {
    return await this.httpJson("GET", "/vm/status");
  }
  async init(vaultPath) {
    return await this.httpJson("POST", "/vm/init", vaultPath ? { vaultPath } : void 0);
  }
  async setup(body) {
    return await this.httpJson("POST", "/vm/setup", body);
  }
  async startServer() {
    return await this.httpJson("POST", "/server/start");
  }
  async toggleWatcher() {
    return await this.httpJson("POST", "/vm/watcher/toggle");
  }
  async listQueue(status) {
    const query = status ? `?status=${status}` : "";
    return await this.httpJson("GET", `/agent/queue${query}`);
  }
  async retryJob(id) {
    return await this.httpJson("POST", `/agent/jobs/${encodeURIComponent(id)}/retry`);
  }
  async cancelJob(id) {
    return await this.httpJson(
      "POST",
      `/agent/jobs/${encodeURIComponent(id)}/cancel`
    );
  }
  async search(query, collection = "main", limit = 5) {
    return await this.httpJson("POST", "/vm/search", {
      collection,
      query,
      limit
    });
  }
  async ftsSearch(query, collection = "main", limit = 10) {
    const res = await this.httpJson("POST", "/vm/fts-search", { query, collection, limit });
    return res.hits;
  }
  async graphQuery(entity, depth = 1) {
    const res = await this.httpJson("POST", "/vm/graph", { entity, depth });
    return res.results;
  }
  async listPending() {
    const res = await this.httpJson("GET", "/vm/pending");
    return res.pending;
  }
  async approveEntry(id, collection, action) {
    await this.httpJson("POST", "/vm/approve", { id, collection, action });
  }
  async pushContext(filePath, selection, cursor2) {
    return await this.httpJson("POST", "/vault-mind/context", {
      filePath,
      selection,
      cursor: cursor2
    });
  }
  async scan(file, vault) {
    try {
      return await this.httpJson("POST", "/vault-mind/scan", { file, vault });
    } catch (err) {
      return { error: String(err) };
    }
  }
  async dispatch(role, instruction, file, vault) {
    try {
      return await this.httpJson("POST", "/vault-mind/dispatch", {
        role,
        instruction,
        file,
        vault
      });
    } catch (err) {
      return { error: String(err) };
    }
  }
};

// src/config.ts
var import_node_fs = require("node:fs");
var import_node_os = require("node:os");
var import_node_path = __toESM(require("node:path"), 1);
function extractConfigLayer(cfg) {
  const wiki = cfg.wiki ?? {};
  const vaultMind = cfg.vaultMind ?? {};
  const source = Object.keys(wiki).length > 0 ? wiki : vaultMind;
  const embedding = source.embedding ?? {};
  const modal = embedding.modal ?? {};
  const ollamaHost = typeof embedding.ollamaHost === "string" ? embedding.ollamaHost : void 0;
  const ollamaModel = typeof embedding.ollamaModel === "string" ? embedding.ollamaModel : void 0;
  return {
    remoteUrl: typeof embedding.remoteUrl === "string" ? embedding.remoteUrl : void 0,
    localUrl: typeof embedding.localUrl === "string" ? embedding.localUrl : ollamaHost ? `${ollamaHost.replace(/\/$/, "")}/v1` : void 0,
    model: typeof embedding.model === "string" ? embedding.model : ollamaModel,
    dim: typeof embedding.dim === "number" ? embedding.dim : void 0,
    collections: typeof cfg.collections === "object" && cfg.collections !== null ? Object.keys(cfg.collections) : void 0,
    workspace: typeof modal.workspace === "string" ? modal.workspace : void 0,
    useTransformers: typeof embedding.useTransformers === "boolean" ? embedding.useTransformers : void 0
  };
}
function mergeConfigLayers(globalCfg, projectCfg) {
  const global = extractConfigLayer(globalCfg);
  const project = extractConfigLayer(projectCfg);
  return {
    remoteUrl: project.remoteUrl ?? global.remoteUrl,
    localUrl: project.localUrl ?? global.localUrl,
    model: project.model ?? global.model,
    dim: project.dim ?? global.dim,
    collections: project.collections ?? global.collections,
    workspace: project.workspace ?? global.workspace,
    useTransformers: project.useTransformers ?? global.useTransformers
  };
}
function readExtensionConfig(vaultPath) {
  const globalPath = import_node_path.default.join((0, import_node_os.homedir)(), ".pi", "agent", "vault-mind.config.json");
  const projectPath = import_node_path.default.join(vaultPath, "pi-vault-mind.config.json");
  let globalCfg = {};
  let projectCfg = {};
  try {
    globalCfg = JSON.parse((0, import_node_fs.readFileSync)(globalPath, "utf-8"));
  } catch {
  }
  try {
    projectCfg = JSON.parse((0, import_node_fs.readFileSync)(projectPath, "utf-8"));
  } catch {
  }
  const merged = mergeConfigLayers(globalCfg, projectCfg);
  return Object.keys(merged).length > 0 ? merged : null;
}
function readServerPort(vaultPath) {
  const serverJsonPath = import_node_path.default.join(vaultPath, ".vault-mind", "server.json");
  try {
    const raw = (0, import_node_fs.readFileSync)(serverJsonPath, "utf-8");
    const data = JSON.parse(raw);
    const port = data.port;
    return typeof port === "number" && port > 0 ? port : void 0;
  } catch {
    return void 0;
  }
}

// src/modals.ts
var import_obsidian = require("obsidian");
var VAULT_MIND_ROLES = [
  "Manager",
  "Miner",
  "Broadcaster",
  "Heavy-Lifter",
  "Watcher"
];
var RolePickerModal = class extends import_obsidian.FuzzySuggestModal {
  onChooseRole;
  constructor(app, onChooseRole) {
    super(app);
    this.onChooseRole = onChooseRole;
    this.setPlaceholder("Pick a Vault Mind agent role");
    this.setInstructions([
      { command: "\u2191\u2193", purpose: "navigate" },
      { command: "\u21B5", purpose: "select" }
    ]);
  }
  getItems() {
    return [...VAULT_MIND_ROLES];
  }
  getItemText(role) {
    return role;
  }
  onChooseItem(role) {
    this.onChooseRole(role);
  }
};
var InstructionInputModal = class extends import_obsidian.Modal {
  titleText;
  onSubmit;
  constructor(app, title, onSubmit) {
    super(app);
    this.titleText = title;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.titleText });
    const textarea = new import_obsidian.TextAreaComponent(contentEl);
    textarea.setPlaceholder("Describe what the agent should do...");
    textarea.inputEl.rows = 8;
    textarea.inputEl.addClass("vault-mind-instruction-input");
    textarea.inputEl.style.width = "100%";
    const buttonRow = contentEl.createDiv({ cls: "vault-mind-modal-buttons" });
    buttonRow.style.display = "flex";
    buttonRow.style.justifyContent = "flex-end";
    buttonRow.style.gap = "0.5rem";
    buttonRow.style.marginTop = "1rem";
    new import_obsidian.ButtonComponent(buttonRow).setButtonText("Cancel").onClick(() => {
      this.onSubmit(null);
      this.close();
    });
    new import_obsidian.ButtonComponent(buttonRow).setButtonText("Dispatch").setCta().onClick(() => {
      this.onSubmit(textarea.getValue());
      this.close();
    });
    textarea.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.onSubmit(textarea.getValue());
        this.close();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        this.onSubmit(null);
        this.close();
      }
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/pi-detect.ts
var import_node_child_process = require("node:child_process");
var fs = __toESM(require("node:fs"), 1);
var os = __toESM(require("node:os"), 1);
var path2 = __toESM(require("node:path"), 1);
function resolvePnpmHome() {
  if (process.env.PNPM_HOME) return process.env.PNPM_HOME;
  if (process.platform === "darwin") return path2.join(os.homedir(), "Library", "pnpm");
  return path2.join(os.homedir(), ".local", "share", "pnpm");
}
function detectFnm() {
  const fnmRoot = path2.join(os.homedir(), ".local", "share", "fnm");
  if (!fs.existsSync(fnmRoot)) return null;
  const binDir = path2.join(fnmRoot, "aliases", "default", "bin");
  const node = path2.join(binDir, "node");
  if (!fs.existsSync(node)) return null;
  return {
    node,
    pnpm: fs.existsSync(path2.join(binDir, "pnpm")) ? path2.join(binDir, "pnpm") : null,
    binDir,
    source: "fnm",
    pnpmHome: resolvePnpmHome()
  };
}
function detectNvm() {
  const nvmDir = process.env.NVM_DIR || path2.join(os.homedir(), ".nvm");
  const aliasFile = path2.join(nvmDir, "alias", "default");
  let version;
  try {
    version = fs.readFileSync(aliasFile, "utf-8").trim();
  } catch {
    return null;
  }
  if (!version.startsWith("v") && /^\d/.test(version)) version = `v${version}`;
  if (!version.startsWith("v")) return null;
  const binDir = path2.join(nvmDir, "versions", "node", version, "bin");
  if (!fs.existsSync(path2.join(binDir, "node"))) return null;
  return {
    node: path2.join(binDir, "node"),
    pnpm: fs.existsSync(path2.join(binDir, "pnpm")) ? path2.join(binDir, "pnpm") : null,
    binDir,
    source: `nvm (${version})`,
    pnpmHome: resolvePnpmHome(),
    nvmDir,
    nvmBin: binDir
  };
}
function detectFallback() {
  const pnpmHome = resolvePnpmHome();
  if (fs.existsSync(path2.join(pnpmHome, "pnpm")) || fs.existsSync(path2.join(pnpmHome, "pi"))) {
    return {
      pnpm: path2.join(pnpmHome, "pnpm"),
      node: null,
      binDir: pnpmHome,
      source: "PNPM_HOME",
      pnpmHome
    };
  }
  return null;
}
function detectRuntime() {
  return detectFnm() || detectNvm() || detectFallback();
}
function buildExecPath() {
  const dirs = [];
  const runtime = detectRuntime();
  if (runtime) {
    dirs.push(runtime.binDir);
    if (runtime.pnpmHome && runtime.pnpmHome !== runtime.binDir) {
      dirs.push(runtime.pnpmHome);
    }
  }
  const pnpmHome = resolvePnpmHome();
  if (!dirs.includes(pnpmHome)) dirs.push(pnpmHome);
  const homeLocalBin = path2.join(os.homedir(), ".local", "bin");
  dirs.push(
    homeLocalBin,
    "/opt/homebrew/bin",
    "/usr/local/bin",
    "/usr/bin",
    "/bin",
    "/usr/sbin",
    "/sbin"
  );
  const existing = (process.env.PATH || "").split(":");
  for (const p of existing) {
    if (p && !dirs.includes(p)) dirs.push(p);
  }
  return dirs.join(":");
}
function buildExecEnv() {
  const env = { ...process.env, PATH: buildExecPath() };
  const runtime = detectRuntime();
  if (runtime) {
    env.PNPM_HOME = runtime.pnpmHome;
    if (runtime.nvmDir) env.NVM_DIR = runtime.nvmDir;
    if (runtime.nvmBin) env.NVM_BIN = runtime.nvmBin;
  }
  return env;
}
function detectModalBinary() {
  const candidates = [
    path2.join(os.homedir(), ".local", "bin", "modal"),
    "/opt/homebrew/bin/modal",
    "/usr/local/bin/modal"
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  try {
    const result = (0, import_node_child_process.execSync)(`${process.env.SHELL || "/bin/zsh"} -lc "which modal 2>/dev/null"`, {
      timeout: 3e3,
      env: buildExecEnv()
    }).toString().trim();
    return result || null;
  } catch {
    return null;
  }
}
function detectOpBinary() {
  const candidates = [
    path2.join(os.homedir(), ".local", "bin", "op"),
    "/opt/homebrew/bin/op",
    "/usr/local/bin/op",
    "/usr/bin/op"
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  try {
    const result = (0, import_node_child_process.execSync)(`${process.env.SHELL || "/bin/zsh"} -lc "which op 2>/dev/null"`, {
      timeout: 3e3,
      env: buildExecEnv()
    }).toString().trim();
    return result || null;
  } catch {
    return null;
  }
}
function resolveNodeBinDir() {
  return detectRuntime()?.binDir ?? null;
}
function detectPiBinary(configured, vaultPath) {
  if (path2.isAbsolute(configured) && fs.existsSync(configured)) {
    return configured;
  }
  const shellPath = whichPi(configured);
  if (shellPath) return shellPath;
  const home = os.homedir();
  const pnpmHome = process.env.PNPM_HOME || (process.platform === "darwin" ? path2.join(home, "Library", "pnpm") : path2.join(home, ".local", "share", "pnpm"));
  const candidates = [
    // System npm global installs (base case — no version manager)
    "/usr/local/bin/pi",
    "/opt/homebrew/bin/pi",
    path2.join(home, ".npm-global", "bin", "pi"),
    path2.join(home, ".local", "bin", "pi"),
    // pnpm global (PNPM_HOME)
    path2.join(pnpmHome, "pi")
  ];
  const nodeBin = resolveNodeBinDir();
  if (nodeBin && nodeBin !== "/usr/local/bin" && nodeBin !== "/opt/homebrew/bin") {
    candidates.push(path2.join(nodeBin, "pi"));
  }
  candidates.push(
    // Less common locations
    path2.join(home, ".pi", "bin", "pi")
  );
  if (vaultPath) {
    candidates.unshift(path2.join(vaultPath, "node_modules", ".bin", "pi"));
  }
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}
function whichPi(name) {
  const shell = process.env.SHELL || (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
  const cmd = process.platform === "win32" ? `where ${name}` : `which ${name}`;
  try {
    const result = (0, import_node_child_process.execSync)(cmd, {
      encoding: "utf-8",
      shell,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5e3,
      env: { ...process.env }
    });
    const resolved = result.trim().split("\n")[0];
    if (resolved && fs.existsSync(resolved)) {
      return resolved;
    }
  } catch {
  }
  return null;
}

// src/protocol.ts
var import_obsidian2 = require("obsidian");
var isString = (value) => typeof value === "string";
var DiffModal = class extends import_obsidian2.Modal {
  path;
  oldContent;
  newContent;
  onAccept;
  constructor(app, { path: path6, old, new: newContent }, onAccept) {
    super(app);
    this.path = path6;
    this.oldContent = old;
    this.newContent = newContent;
    this.onAccept = onAccept;
  }
  onOpen() {
    this.titleEl.setText(`Proposed edit: ${this.path}`);
    const oldSection = this.contentEl.createEl("div");
    oldSection.createEl("h3", { text: "Current content" });
    const oldPre = oldSection.createEl("pre", { cls: "vault-mind-diff vault-mind-diff-old" });
    oldPre.textContent = this.oldContent;
    const newSection = this.contentEl.createEl("div");
    newSection.createEl("h3", { text: "Proposed content" });
    const newPre = newSection.createEl("pre", { cls: "vault-mind-diff vault-mind-diff-new" });
    newPre.textContent = this.newContent;
    new import_obsidian2.Setting(this.contentEl).addButton(
      (btn) => btn.setButtonText("Accept").setCta().onClick(() => {
        this.onAccept();
        this.close();
      })
    ).addButton(
      (btn) => btn.setButtonText("Reject").onClick(() => {
        this.close();
      })
    );
  }
};
function registerVaultMindProtocolHandlers(plugin) {
  plugin.registerObsidianProtocolHandler("vault-mind/open-file", (params) => {
    const path6 = params?.path;
    if (!isString(path6)) {
      new import_obsidian2.Notice("Vault Mind: missing path parameter");
      return;
    }
    plugin.app.workspace.openLinkText(path6, "", true);
  });
  plugin.registerObsidianProtocolHandler("vault-mind/show-diff", (params) => {
    const path6 = params?.path;
    const oldContent = params?.old;
    const newContent = params?.new;
    if (!isString(path6) || !isString(oldContent) || !isString(newContent)) {
      new import_obsidian2.Notice("Vault Mind: missing path, old, or new parameter");
      return;
    }
    new DiffModal(plugin.app, { path: path6, old: oldContent, new: newContent }, async () => {
      const file = plugin.app.vault.getAbstractFileByPath(path6);
      if (!(file instanceof import_obsidian2.TFile)) {
        new import_obsidian2.Notice(`Vault Mind: file not found: ${path6}`);
        return;
      }
      try {
        await plugin.app.vault.modify(file, newContent);
        new import_obsidian2.Notice(`Vault Mind: accepted changes to ${path6}`);
      } catch (err) {
        new import_obsidian2.Notice(`Vault Mind: failed to write ${path6}: ${err.message}`);
      }
    }).open();
  });
  plugin.registerObsidianProtocolHandler("vault-mind/notify", (params) => {
    const message = params?.message;
    if (!isString(message)) {
      new import_obsidian2.Notice("Vault Mind: missing message parameter");
      return;
    }
    new import_obsidian2.Notice(message);
  });
  plugin.registerObsidianProtocolHandler("vault-mind/search", async (params) => {
    const query = params?.query;
    if (!isString(query)) {
      new import_obsidian2.Notice("Vault Mind: missing query parameter");
      return;
    }
    const searchLeaf = await plugin.app.workspace.ensureSideLeaf("search", "left");
    if (searchLeaf.view?.setQuery) {
      searchLeaf.view.setQuery(query);
    }
  });
}

// src/token.ts
var PVM_TOKEN_SECRET_ID = "vault-mind-pvm-token";
async function resolveToken(app) {
  const envToken = process.env.PVM_API_TOKEN;
  if (envToken) return envToken;
  return app.secretStorage.getSecret(PVM_TOKEN_SECRET_ID) ?? void 0;
}

// src/views/panel.ts
var import_node_fs2 = require("node:fs");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_obsidian18 = require("obsidian");

// src/chat/rpc.ts
var import_obsidian3 = require("obsidian");
var spawn;
var createInterface;
if (import_obsidian3.Platform.isDesktop) {
  const childProcessModule = require("node:child_process");
  const readlineModule = require("node:readline");
  spawn = childProcessModule.spawn;
  createInterface = readlineModule.createInterface;
}
var PiConnection = class {
  piBinaryPath;
  cwd;
  extraArgs;
  timeout;
  apiKeys;
  piConfigDir;
  buildEnv;
  process = null;
  readline = null;
  handlers = [];
  disconnectHandler = null;
  connected = false;
  requestId = 0;
  pendingRequests = /* @__PURE__ */ new Map();
  intentionallyDestroyed = false;
  constructor(opts) {
    this.piBinaryPath = opts.piBinaryPath;
    this.cwd = opts.cwd;
    this.extraArgs = opts.extraArgs ?? [];
    this.apiKeys = opts.apiKeys ?? {};
    this.timeout = opts.timeout ?? 6e4;
    this.piConfigDir = opts.piConfigDir ?? null;
    this.buildEnv = opts.buildEnv ?? null;
  }
  /**
   * Spawn the Pi process and set up JSON line parsing on stdout.
   */
  connect() {
    if (this.process) {
      this.destroy();
    }
    this.intentionallyDestroyed = false;
    if (!this.piBinaryPath || this.piBinaryPath.trim() === "") {
      throw new Error("Pi binary path is not configured. Please set the path in plugin settings.");
    }
    const baseEnv = this.buildEnv ? this.buildEnv() : { PATH: process.env.PATH || "/usr/bin:/bin" };
    const env = { ...baseEnv };
    for (const [envVarName, key] of Object.entries(this.apiKeys)) {
      if (key?.trim()) {
        env[envVarName] = key;
      }
    }
    if (this.piConfigDir) {
      env.PI_CODING_AGENT_DIR = this.piConfigDir;
    }
    this.process = spawn(this.piBinaryPath, ["--mode", "rpc", ...this.extraArgs], {
      cwd: this.cwd,
      stdio: ["pipe", "pipe", "pipe"],
      env
    });
    this.connected = true;
    const stderrBuffer = [];
    if (this.process.stdout) {
      this.readline = createInterface({
        input: this.process.stdout,
        crlfDelay: Number.POSITIVE_INFINITY
      });
      this.readline.on("line", (line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        try {
          const event = JSON.parse(trimmed);
          this.dispatch(event);
        } catch {
          console.warn("[Pi RPC] Non-JSON line from stdout:", trimmed);
        }
      });
      this.readline.on("close", () => {
        if (this.intentionallyDestroyed) return;
      });
    }
    if (this.process.stderr) {
      this.process.stderr.on("data", (data) => {
        const text = data.toString();
        stderrBuffer.push(text);
        console.warn("[Pi RPC] stderr:", text);
      });
    }
    this.process.on("exit", (code, signal) => {
      if (this.intentionallyDestroyed) {
        this.connected = false;
        this.cleanup();
        return;
      }
      if (code !== 0) {
        console.warn("[Pi RPC] Process exited with code", code, "signal", signal);
        if (stderrBuffer.length > 0) {
          console.warn("[Pi RPC] stderr output:", stderrBuffer.join(""));
        }
      }
      this.connected = false;
      this.dispatch({
        type: "error",
        error: `Pi process exited (code=${code}, signal=${signal})`
      });
      this.cleanup();
    });
    this.process.on("error", (err) => {
      this.connected = false;
      console.error("[Pi RPC] Process error:", err.message);
      if (stderrBuffer.length > 0) {
        console.error("[Pi RPC] stderr output:", stderrBuffer.join(""));
      }
      this.dispatch({
        type: "error",
        error: `Pi process error: ${err.message}`
      });
      this.cleanup();
    });
  }
  /**
   * Send a command to Pi via stdin as a JSON line.
   * Automatically injects a request ID and returns a Promise that resolves
   * when Pi sends a matching response (type === "response" with same id).
   * Streaming events still go to onEvent handlers.
   */
  send(command) {
    if (!this.process || !this.process.stdin || !this.connected) {
      throw new Error("Pi is not connected");
    }
    const id = `req-${this.requestId++}`;
    const line = `${JSON.stringify({ ...command, id })}
`;
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request ${id} timed out after ${this.timeout / 1e3}s`));
        }
      }, this.timeout);
      this.pendingRequests.set(id, {
        resolve: (value) => {
          window.clearTimeout(timeoutId);
          resolve(value);
        },
        reject: (reason) => {
          window.clearTimeout(timeoutId);
          reject(reason);
        },
        timeoutId
      });
      this.process?.stdin?.write(line);
    });
  }
  /**
   * Send a raw JSON line without request tracking.
   * Used for extension UI responses in RPC mode.
   */
  sendRaw(command) {
    if (!this.process || !this.process.stdin || !this.connected) {
      throw new Error("Pi is not connected");
    }
    this.process.stdin.write(`${JSON.stringify(command)}
`);
  }
  /**
   * Register a handler for events received from Pi.
   * Each JSON line parsed from stdout is dispatched to all handlers.
   */
  onEvent(handler) {
    this.handlers.push(handler);
  }
  /**
   * Remove a previously registered event handler.
   */
  offEvent(handler) {
    const idx = this.handlers.indexOf(handler);
    if (idx !== -1) {
      this.handlers.splice(idx, 1);
    }
  }
  /**
   * Register a handler called when the Pi process disconnects unexpectedly.
   */
  onDisconnect(handler) {
    this.disconnectHandler = handler;
  }
  /**
   * Kill the child process and clean up.
   */
  destroy() {
    this.intentionallyDestroyed = true;
    this.disconnectHandler = null;
    this.handlers = [];
    if (this.process) {
      this.process.kill();
    }
    this.cleanup();
  }
  /**
   * Check if the Pi process is alive.
   */
  isConnected() {
    return this.connected;
  }
  dispatch(event) {
    if (this.intentionallyDestroyed && this.handlers.length === 0) {
      return;
    }
    if (event.type === "error" && this.intentionallyDestroyed) {
      return;
    }
    if (event.type === "response" && typeof event.id === "string") {
      const pending = this.pendingRequests.get(event.id);
      if (pending) {
        this.pendingRequests.delete(event.id);
        if (event.success === false) {
          pending.reject(new Error(String(event.error || "Request failed")));
        } else {
          pending.resolve(event);
        }
        return;
      }
    }
    for (const handler of this.handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error("[Pi RPC] Handler error:", err);
      }
    }
  }
  cleanup() {
    const wasConnected = this.connected;
    this.connected = false;
    if (this.readline) {
      this.readline.close();
      this.readline = null;
    }
    this.process = null;
    for (const [, pending] of this.pendingRequests) {
      window.clearTimeout(pending.timeoutId);
      pending.reject(new Error("Pi connection closed"));
    }
    this.pendingRequests.clear();
    if (wasConnected && this.disconnectHandler) {
      this.disconnectHandler();
    }
  }
};

// src/chat/view.ts
var import_obsidian15 = require("obsidian");

// ../../node_modules/.pnpm/@arrow-js+core@1.0.6/node_modules/@arrow-js/core/dist/chunks/internal-DchK7S7v.mjs
var queueMarker = Symbol();
var queueStack = [];
var nextTicks = [];
var cleanupCollector = null;
function nextTick(fn) {
  return !queueStack.length ? Promise.resolve(fn?.()) : new Promise((resolve) => nextTicks.push(() => {
    fn?.();
    resolve();
  }));
}
function isTpl(template) {
  return typeof template === "function" && !!template.isT;
}
function isO(obj) {
  return obj !== null && typeof obj === "object";
}
function isR(obj) {
  return isO(obj) && "$on" in obj;
}
function isChunk(chunk) {
  return isO(chunk) && "ref" in chunk;
}
function queue(fn) {
  const queued = fn;
  return (newValue, oldValue) => {
    if (!queued[queueMarker]) {
      queued[queueMarker] = true;
      queued._n = newValue;
      queued._o = oldValue;
      if (!queueStack.length) {
        queueMicrotask(executeQueue);
      }
      queueStack.push(queued);
    }
  };
}
function executeQueue() {
  const queue2 = queueStack;
  queueStack = [];
  const ticks = nextTicks;
  nextTicks = [];
  for (let i = 0; i < queue2.length; i++) {
    const fn = queue2[i];
    const newValue = fn._n;
    const oldValue = fn._o;
    fn._n = void 0;
    fn._o = void 0;
    fn[queueMarker] = false;
    fn(newValue, oldValue);
  }
  for (let i = 0; i < ticks.length; i++)
    ticks[i]();
  if (queueStack.length) {
    queueMicrotask(executeQueue);
  }
}
function swapCleanupCollector(collector) {
  const previous = cleanupCollector;
  cleanupCollector = collector;
  return previous;
}
function registerCleanup(fn) {
  cleanupCollector?.push(fn);
}
function setAttr(node, attrName, value) {
  if (attrName === ".innerhtml")
    attrName = ".innerHTML";
  const isIDL = attrName === "value" && "value" in node || attrName === "checked" || attrName[0] === "." && (attrName = attrName.slice(1));
  if (isIDL) {
    node[attrName] = value;
    if (node.getAttribute(attrName) != value)
      value = false;
  }
  value !== false ? node.setAttribute(attrName, value) : node.removeAttribute(attrName);
}
var expressionPool = [];
var expressionObservers = [];
var expressionObserverAttrs = [];
var freeExpressionPointers = [];
var cursor = 0;
function createExpressionBlock(len) {
  const bucket = freeExpressionPointers[len];
  const pointer = bucket?.length ? bucket.pop() : cursor;
  expressionPool[pointer] = len;
  if (pointer === cursor)
    cursor += len + 1;
  return pointer;
}
function writeExpressions(expSlots, pointer, offset = 0) {
  const len = expressionPool[pointer];
  for (let i = 1; i <= len; i++) {
    const nextValue = expSlots[offset + i - 1];
    const target = pointer + i;
    if (Object.is(expressionPool[target], nextValue))
      continue;
    expressionPool[target] = nextValue;
    const observer = expressionObservers[target];
    if (!observer)
      continue;
    const attr = expressionObserverAttrs[target];
    if (attr !== void 0)
      setAttr(observer, attr, nextValue);
    else if (typeof observer === "function")
      observer(nextValue);
    else
      observer.data = nextValue || nextValue === 0 ? nextValue : "";
  }
}
function onExpressionUpdate(pointer, observer, attrName) {
  expressionObservers[pointer] = observer;
  expressionObserverAttrs[pointer] = attrName;
}
function releaseExpressions(pointer) {
  const len = expressionPool[pointer];
  if (len === void 0)
    return;
  for (let i = 0; i <= len; i++) {
    expressionPool[pointer + i] = void 0;
    expressionObservers[pointer + i] = void 0;
    expressionObserverAttrs[pointer + i] = void 0;
  }
  (freeExpressionPointers[len] ??= []).push(pointer);
}
var ids = /* @__PURE__ */ new WeakMap();
var computedIds = [];
var listeners = [];
var getId = (target) => ids.get(target);
var index = -1;
var watchIndex = 0;
var trackKey = 0;
var trackedDependencies = [];
var watchedDependencies = [];
var dependencyPool = [];
var arrayMutationWrappers = [];
var arrayMutations = {
  push: 1,
  pop: 1,
  shift: 1,
  unshift: 1,
  splice: 1,
  sort: 1,
  copyWithin: 1,
  fill: 1,
  reverse: 1
};
var parents = [];
function reactive(data) {
  if (typeof data === "function") {
    const state = reactive({
      value: void 0
    });
    computedIds[getId(state)] = true;
    watch(data, (value) => state.value = value);
    return state;
  }
  if (isR(data))
    return data;
  if (!isO(data))
    throw Error("Expected object");
  const id = ++index;
  listeners[id] = {};
  const proxy = new Proxy(data, proxyHandler);
  ids.set(data, id).set(proxy, id);
  return proxy;
}
function trackArray(id, key, target, value) {
  if (typeof value === "function" && arrayMutations[key]) {
    let wrappers = arrayMutationWrappers[id];
    if (!wrappers)
      wrappers = arrayMutationWrappers[id] = {};
    let wrapper = wrappers[key];
    if (!wrapper) {
      wrapper = (...args) => {
        const result = Reflect.apply(value, target, args);
        emitParents(id);
        return result;
      };
      wrappers[key] = wrapper;
    }
    return wrapper;
  }
  if (isComputed(value))
    return readComputed(value, id, key);
  if (key !== "length" && typeof value !== "function") {
    track(id, key);
  }
  return value;
}
var proxyHandler = {
  has(target, key) {
    if (key in api)
      return true;
    track(getId(target), key);
    return key in target;
  },
  get(target, key, receiver) {
    const id = getId(target);
    if (key in api)
      return api[key];
    const result = Reflect.get(target, key, receiver);
    let child;
    if (isO(result) && !isR(result)) {
      child = createChild(result, id, key);
      target[key] = child;
    }
    const value = child ?? result;
    if (Array.isArray(target))
      return trackArray(id, key, target, value);
    if (isComputed(value))
      return readComputed(value, id, key);
    track(id, key);
    return value;
  },
  set(target, key, value, receiver) {
    const id = getId(target);
    const isNewProperty = !(key in target);
    const newReactive = isO(value) && !isR(value) ? createChild(value, id, key) : null;
    const oldValue = target[key];
    const newValue = newReactive ?? value;
    if (isR(newValue) && computedIds[getId(newValue)]) {
      linkParent(getId(newValue), id, key);
    }
    const didSucceed = Reflect.set(target, key, newValue, receiver);
    if (oldValue !== newValue && isR(oldValue) && isR(newValue)) {
      const oldParents = parents[getId(oldValue)];
      if (oldParents) {
        let index2 = -1;
        for (let i = 0; i < oldParents.length; i++) {
          const [parent, property] = oldParents[i];
          if (parent == id && property == key) {
            index2 = i;
            break;
          }
        }
        if (index2 > -1)
          oldParents.splice(index2, 1);
      }
      linkParent(getId(newValue), id, key);
    }
    emit(id, key, value, oldValue, isNewProperty || key === "value" && computedIds[id]);
    if (Array.isArray(target) && key === "length") {
      emitParents(id);
    }
    return didSucceed;
  }
};
function createChild(child, parentId, key) {
  const r = reactive(child);
  linkParent(getId(child), parentId, key);
  return r;
}
function isComputed(value) {
  return isR(value) && computedIds[getId(value)];
}
function readComputed(value, parentId, key) {
  const computedId = getId(value);
  track(parentId, key);
  linkParent(computedId, parentId, key);
  track(computedId, "value");
  return value.value;
}
function linkParent(childId, parentId, key) {
  const entries = parents[childId];
  if (entries) {
    for (let i = 0; i < entries.length; i++) {
      const [parent, property] = entries[i];
      if (parent === parentId && property === key)
        return;
    }
  } else {
    parents[childId] = [];
  }
  parents[childId].push([parentId, key]);
}
function emit(id, key, newValue, oldValue, notifyParents) {
  const targetListeners = listeners[id];
  const propertyListeners = targetListeners[key];
  if (propertyListeners) {
    if (Array.isArray(propertyListeners)) {
      for (let i = 0; i < propertyListeners.length; i++) {
        propertyListeners[i](newValue, oldValue);
      }
    } else {
      propertyListeners(newValue, oldValue);
    }
  }
  if (notifyParents) {
    emitParents(id);
  }
}
function emitParents(id) {
  const parentEntries = parents[id];
  if (!parentEntries)
    return;
  for (let i = 0; i < parentEntries.length; i++) {
    const [parentId, property] = parentEntries[i];
    emit(parentId, property);
  }
}
function reactiveOn(property, callback) {
  addListener(listeners[getId(this)], property, callback);
}
function reactiveOff(property, callback) {
  removeListener(listeners[getId(this)], property, callback);
}
var api = {
  $on: reactiveOn,
  $off: reactiveOff
};
function track(id, property) {
  if (!trackKey)
    return;
  trackedDependencies[trackKey].push(id, property);
}
function startTracking() {
  trackedDependencies[++trackKey] = dependencyPool.pop() ?? [];
}
function stopTracking(watchKey, callback) {
  const key = trackKey--;
  const deps = trackedDependencies[key];
  const previousDeps = watchedDependencies[watchKey];
  const previousLength = previousDeps?.length;
  if (previousLength && previousLength === deps.length) {
    let matched = true;
    for (let i = 0; i < previousLength; i++) {
      if (previousDeps[i] === deps[i])
        continue;
      matched = false;
      break;
    }
    if (matched) {
      watchedDependencies[watchKey] = previousDeps;
      deps.length = 0;
      dependencyPool.push(deps);
      trackedDependencies[key] = void 0;
      return;
    }
  }
  flushListeners(previousDeps, callback);
  for (let i = 0; i < deps.length; i += 2) {
    addListener(listeners[deps[i]], deps[i + 1], callback);
  }
  watchedDependencies[watchKey] = deps;
  trackedDependencies[key] = void 0;
}
function flushListeners(deps, callback) {
  if (!deps)
    return;
  for (let i = 0; i < deps.length; i += 2) {
    removeListener(listeners[deps[i]], deps[i + 1], callback);
  }
  deps.length = 0;
  dependencyPool.push(deps);
}
function addListener(targetListeners, key, callback) {
  const slot = targetListeners[key];
  if (!slot) {
    targetListeners[key] = callback;
    return;
  }
  if (Array.isArray(slot)) {
    if (!slot.includes(callback))
      slot.push(callback);
    return;
  }
  if (slot !== callback)
    targetListeners[key] = [slot, callback];
}
function removeListener(targetListeners, key, callback) {
  const slot = targetListeners[key];
  if (!slot)
    return;
  if (Array.isArray(slot)) {
    const index2 = slot.indexOf(callback);
    if (index2 < 0)
      return;
    if (slot.length === 2) {
      targetListeners[key] = slot[index2 ? 0 : 1];
      return;
    }
    slot.splice(index2, 1);
    return;
  }
  if (slot === callback) {
    delete targetListeners[key];
  }
}
function watch(effect, afterEffect) {
  const watchKey = ++watchIndex;
  const isPointer = typeof effect === "number";
  let rerun = queue(runEffect);
  function runEffect() {
    startTracking();
    const effectValue = isPointer ? expressionPool[effect]() : effect();
    stopTracking(watchKey, rerun);
    return afterEffect ? afterEffect(effectValue) : effectValue;
  }
  const stop = () => {
    flushListeners(watchedDependencies[watchKey], rerun);
    watchedDependencies[watchKey] = void 0;
    if (isPointer)
      onExpressionUpdate(effect);
    rerun = null;
  };
  if (!isPointer)
    registerCleanup(stop);
  if (isPointer)
    onExpressionUpdate(effect, runEffect);
  return [runEffect(), stop];
}
var AsyncFunction = (async () => {
}).constructor;
var propsProxyHandler = {
  get(target, key) {
    return target[0]?.[key];
  },
  has(target, key) {
    return key in (target[0] || {});
  },
  ownKeys(target) {
    return Reflect.ownKeys(target[0] || {});
  },
  getOwnPropertyDescriptor(target, key) {
    const source = target[0];
    return source && {
      configurable: true,
      enumerable: true,
      writable: true,
      value: source[key]
    };
  },
  set(target, key, value) {
    return !!target[0] && Reflect.set(target[0], key, value);
  }
};
function isCmp(value) {
  return !!value && typeof value === "object" && "h" in value;
}
function createPropsProxy(source, factory, events) {
  const box = reactive({ 0: source, 1: factory, 2: events });
  const emit2 = ((event, payload) => {
    const handler = box[2]?.[event];
    if (typeof handler === "function")
      handler(payload);
  });
  return [
    new Proxy(box, propsProxyHandler),
    emit2,
    box
  ];
}
var hydrationCaptureProvider = null;
function getHydrationCapture() {
  return hydrationCaptureProvider?.() ?? null;
}
function registerHydrationHook(chunk, hook) {
  const capture = getHydrationCapture();
  if (!capture)
    return;
  const hooks = capture.hooks.get(chunk);
  if (hooks) {
    hooks.push(hook);
  } else {
    capture.hooks.set(chunk, [hook]);
  }
}
function adoptCapturedChunk(capture, chunk, map, visited = /* @__PURE__ */ new WeakSet()) {
  if (visited.has(chunk))
    return;
  visited.add(chunk);
  const ref = chunk.ref;
  if (ref.f)
    ref.f = map.get(ref.f) ?? ref.f;
  if (ref.l)
    ref.l = map.get(ref.l) ?? ref.l;
  capture.hooks.get(chunk)?.forEach((hook) => hook(map, visited));
}

// ../../node_modules/.pnpm/@arrow-js+core@1.0.6/node_modules/@arrow-js/core/dist/index.mjs
var eventBindingsKey = Symbol();
var bindingStackPos = -1;
var bindingStack = [];
var nodeStack = [];
var delimiter = "\xA4";
var delimiterComment = `<!--${delimiter}-->`;
var initialChunkPoolSize = 1024;
var chunkMemo = /* @__PURE__ */ new WeakMap();
var chunkMemoByRef = /* @__PURE__ */ new WeakMap();
var staleById = /* @__PURE__ */ new Map();
var staleBySignature = /* @__PURE__ */ new Map();
var chunkPoolHead;
var renderedMark = 0;
growChunkPool(initialChunkPoolSize);
function moveDOMRef(ref, parent, before) {
  let node = ref.f;
  if (!parent || !node)
    return;
  const last = ref.l;
  while (true) {
    const next = node === last ? null : node.nextSibling;
    parent.insertBefore(node, before || null);
    if (!next)
      return;
    node = next;
  }
}
function canSyncTemplateChunk(template, chunk) {
  return chunk.g === getChunkProto(template).g;
}
function getChunkProto(template) {
  const cached = template._p;
  if (cached)
    return cached;
  return template._p = resolveChunkProto(template._s);
}
function resolveChunkProto(rawStrings, svg) {
  const doc = document;
  let memoByRef = svg ? void 0 : chunkMemoByRef.get(rawStrings);
  const cachedByRef = memoByRef?.get(doc);
  if (cachedByRef)
    return cachedByRef;
  const signature = rawStrings.join(delimiterComment);
  const cacheKey = svg ? `${delimiter}${signature}` : signature;
  let signatureMemo = chunkMemo.get(doc);
  if (!signatureMemo) {
    signatureMemo = {};
    chunkMemo.set(doc, signatureMemo);
  }
  const cached = signatureMemo[cacheKey];
  if (cached) {
    if (!svg) {
      memoByRef ??= /* @__PURE__ */ new WeakMap();
      memoByRef.set(doc, cached);
      chunkMemoByRef.set(rawStrings, memoByRef);
    }
    return cached;
  }
  const template = document.createElement("template");
  if (svg) {
    template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${signature}</svg>`;
    const root = template.content.firstChild;
    if (root) {
      const content = template.content;
      while (root.firstChild)
        content.appendChild(root.firstChild);
      content.removeChild(root);
    }
  } else {
    template.innerHTML = signature;
  }
  const paths = createPaths(template.content);
  normalizeNodePlaceholders(template.content);
  const expressions = rawStrings.length - 1;
  let count = 0;
  for (let i = 0; i < paths[0].length; ) {
    i += (paths[0][i + 1] ?? 0) + 3;
    count++;
  }
  if (count !== expressions) {
    throw Error("Invalid HTML position");
  }
  const created = {
    template,
    paths,
    g: cacheKey,
    expressions
  };
  if (!svg) {
    memoByRef ??= /* @__PURE__ */ new WeakMap();
    memoByRef.set(doc, created);
    chunkMemoByRef.set(rawStrings, memoByRef);
  }
  signatureMemo[cacheKey] = created;
  return created;
}
function syncTemplateToChunk(template, chunk, mounted = false) {
  if (chunk._t === template) {
    chunk.k = template._k;
    chunk.i = template._i;
    template._h = chunk;
    template._m = mounted;
    return;
  }
  if (chunk._t && chunk._t !== template) {
    const current = chunk._t;
    if (current._h === chunk) {
      current._m = false;
      current._h = void 0;
    }
  }
  chunk._t = template;
  chunk.k = template._k;
  chunk.i = template._i;
  template._h = chunk;
  template._m = mounted;
  writeExpressions(template._a, chunk.e);
}
function releaseTemplate(chunk) {
  const template = chunk._t;
  if (template._h === chunk) {
    template._m = false;
    template._h = void 0;
  }
}
function growChunkPool(size) {
  let head;
  let tail;
  for (let i = 0; i < size; i++) {
    const chunk = {
      paths: [[], []],
      dom: null,
      ref: { f: null, l: null },
      _t: null,
      e: -1,
      g: "",
      b: false,
      r: true,
      st: false,
      u: null,
      v: null,
      s: void 0,
      k: void 0,
      i: void 0,
      bkn: void 0,
      next: void 0
    };
    if (tail)
      tail.next = chunk;
    else
      head = chunk;
    tail = chunk;
  }
  if (tail)
    tail.next = chunkPoolHead;
  chunkPoolHead = head;
}
function freeChunk(chunk) {
  chunk.next = chunkPoolHead;
  chunkPoolHead = chunk;
}
function configureChunk(chunk, proto, template) {
  chunk.paths = proto.paths;
  chunk.g = proto.g;
  chunk.dom = proto.template.content.cloneNode(true);
  chunk.ref.f = chunk.dom.firstChild;
  chunk.ref.l = chunk.dom.lastChild;
  chunk.e = createExpressionBlock(proto.expressions);
  chunk.b = chunk.st = false;
  chunk.r = true;
  chunk.u = chunk.v = null;
  chunk.s = chunk.bkn = void 0;
  syncTemplateToChunk(template, chunk);
}
function acquireChunk(template) {
  const proto = getChunkProto(template);
  const exact = staleById.get(template._i);
  if (exact) {
    if (exact.g !== proto.g)
      throw Error("shape mismatch");
    if (exact.r) {
      removeStaleChunk(exact);
      syncTemplateToChunk(template, exact);
      return exact;
    }
  }
  const bucket = staleBySignature.get(proto.g);
  const reused = bucket?.h;
  if (reused) {
    removeStaleChunk(reused);
    syncTemplateToChunk(template, reused);
    return reused;
  }
  if (!chunkPoolHead)
    growChunkPool(initialChunkPoolSize);
  const chunk = chunkPoolHead;
  chunkPoolHead = chunk.next;
  chunk.next = void 0;
  configureChunk(chunk, proto, template);
  return chunk;
}
function removeStaleChunk(chunk) {
  if (!chunk.st)
    return;
  const bucket = staleBySignature.get(chunk.g);
  if (bucket) {
    let previous;
    let current = bucket.h;
    while (current && current !== chunk) {
      previous = current;
      current = current.bkn;
    }
    if (current) {
      if (previous)
        previous.bkn = current.bkn;
      else
        bucket.h = current.bkn;
      if (!bucket.h)
        staleBySignature.delete(chunk.g);
    }
  }
  if (chunk.i !== void 0 && staleById.get(chunk.i) === chunk) {
    staleById.delete(chunk.i);
  }
  chunk.st = false;
  chunk.bkn = void 0;
}
function dispatchChunkEvent(evt) {
  const binding = this[eventBindingsKey]?.[evt.type];
  if (!binding)
    return;
  const chunk = binding.c;
  if (!chunk._t._m)
    return;
  expressionPool[binding.p]?.(evt);
}
function getRenderableKey(renderable) {
  return isCmp(renderable) ? renderable.k : renderable._k;
}
function html(strings2, ...expSlots) {
  const template = ((el) => renderTemplate(template, el));
  template.isT = true;
  template._a = expSlots;
  template._c = ensureChunk;
  template._m = false;
  template._s = strings2;
  template.key = setTemplateKey;
  template.id = setTemplateId;
  return template;
}
function ensureChunk() {
  let chunk = this._h;
  if (!chunk) {
    chunk = acquireChunk(this);
    this._h = chunk;
  }
  return chunk;
}
function setTemplateKey(key) {
  this._k = key;
  if (this._h)
    this._h.k = key;
  return this;
}
function setTemplateId(id) {
  this._i = id;
  if (this._h)
    this._h.i = id;
  return this;
}
function renderTemplate(template, el) {
  const chunk = template._c();
  if (!template._m) {
    template._m = true;
    if (!chunk.b) {
      return createBindings(chunk, el);
    }
    moveDOMRef(chunk.ref, el ?? chunk.dom);
    return el ?? chunk.dom;
  }
  moveDOMRef(chunk.ref, chunk.dom);
  return el ? el.appendChild(chunk.dom) : chunk.dom;
}
function createBindings(chunk, el) {
  const expressionPointer = chunk.e;
  const totalPaths = expressionPool[expressionPointer];
  const [pathTape, attrNames] = chunk.paths;
  const stackStart = bindingStackPos + 1;
  let tapePos = 0;
  nodeStack[0] = chunk.dom;
  for (let i = 0; i < totalPaths; i++) {
    const sharedDepth = pathTape[tapePos++];
    let remaining = pathTape[tapePos++];
    let depth = sharedDepth;
    let node = nodeStack[depth];
    while (remaining--) {
      node = node.childNodes[pathTape[tapePos++]];
      nodeStack[++depth] = node;
    }
    bindingStack[++bindingStackPos] = node;
    bindingStack[++bindingStackPos] = pathTape[tapePos++];
  }
  const stackEnd = bindingStackPos;
  for (let s = stackStart, e = expressionPointer + 1; s < stackEnd; s++, e++) {
    const node = bindingStack[s];
    const segment = bindingStack[++s];
    if (segment)
      createAttrBinding(node, attrNames[segment - 1], e, chunk);
    else
      createNodeBinding(node, e, chunk);
  }
  bindingStack.length = stackStart;
  bindingStackPos = stackStart - 1;
  chunk.b = true;
  return el ? el.appendChild(chunk.dom) && el : chunk.dom;
}
function createNodeBinding(node, expressionPointer, parentChunk) {
  let fragment;
  const expression = expressionPool[expressionPointer];
  const capture = getHydrationCapture();
  const textNode = node.nodeType === 3 ? node : null;
  if (isCmp(expression) || isTpl(expression) || Array.isArray(expression)) {
    parentChunk.r = false;
    const render = createRenderFn(capture);
    fragment = render(expression);
    if (capture) {
      registerHydrationHook(parentChunk, (map, visited) => {
        render.adopt(map, visited);
      });
    }
  } else if (typeof expression === "function") {
    let target = textNode;
    let render = null;
    const [frag, stop] = watch(expressionPointer, (value) => {
      if (!render) {
        if (isCmp(value) || isTpl(value) || Array.isArray(value)) {
          parentChunk.r = false;
          render = createRenderFn(capture);
          const next2 = render(value);
          if (target) {
            target.parentNode?.replaceChild(next2, target);
            target = null;
          }
          return next2;
        }
        if (!target)
          target = document.createTextNode("");
        const next = renderText(value);
        if (target.nodeValue !== next)
          target.nodeValue = next;
        return target;
      }
      return render(value);
    });
    (parentChunk.u ??= []).push(stop);
    fragment = frag;
    if (capture) {
      registerHydrationHook(parentChunk, (map, visited) => {
        if (target) {
          const adopted = map.get(target);
          if (adopted)
            target = adopted;
        }
        render?.adopt(map, visited);
      });
    }
  } else {
    let target = textNode ?? document.createTextNode("");
    target.data = renderText(expression);
    fragment = target;
    if (capture) {
      onExpressionUpdate(expressionPointer, (value) => target.data = renderText(value));
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (adopted)
          target = adopted;
      });
    } else {
      onExpressionUpdate(expressionPointer, target);
    }
  }
  if (node === parentChunk.ref.f || node === parentChunk.ref.l) {
    const last = fragment.nodeType === 11 ? fragment.lastChild : fragment;
    if (node === parentChunk.ref.f) {
      parentChunk.ref.f = fragment.nodeType === 11 ? fragment.firstChild : fragment;
    }
    if (node === parentChunk.ref.l)
      parentChunk.ref.l = last;
  }
  if (fragment !== node)
    node.parentNode?.replaceChild(fragment, node);
}
function createAttrBinding(node, attrName, expressionPointer, parentChunk) {
  if (node.nodeType !== 1)
    return;
  let target = node;
  const expression = expressionPool[expressionPointer];
  const capture = getHydrationCapture();
  if (attrName[0] === "@") {
    const event = attrName.slice(1);
    const bindings = target[eventBindingsKey] ??= {};
    bindings[event] = { c: parentChunk, p: expressionPointer };
    const record = [target, event];
    target.addEventListener(event, dispatchChunkEvent);
    target.removeAttribute(attrName);
    (parentChunk.v ??= []).push(record);
    if (capture) {
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (!adopted)
          return;
        const previousTarget = target;
        const previousBindings = previousTarget[eventBindingsKey];
        if (previousBindings) {
          delete previousBindings[event];
          let hasBindings = false;
          for (const key in previousBindings) {
            hasBindings = true;
            break;
          }
          if (!hasBindings)
            delete previousTarget[eventBindingsKey];
        }
        target.removeEventListener(event, dispatchChunkEvent);
        target = adopted;
        record[0] = target;
        const nextBindings = target[eventBindingsKey] ??= {};
        nextBindings[event] = { c: parentChunk, p: expressionPointer };
        target.addEventListener(event, dispatchChunkEvent);
        target.removeAttribute(attrName);
      });
    }
  } else if (typeof expression === "function" && !isTpl(expression)) {
    const [, stop] = watch(expressionPointer, (value) => setAttr(target, attrName, value));
    (parentChunk.u ??= []).push(stop);
    if (capture) {
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (adopted)
          target = adopted;
      });
    }
  } else {
    setAttr(target, attrName, expression);
    if (capture) {
      onExpressionUpdate(expressionPointer, (value) => setAttr(target, attrName, value));
    } else {
      onExpressionUpdate(expressionPointer, target, attrName);
    }
  }
}
function createRenderFn(capture) {
  let previous;
  let keyedChunks = /* @__PURE__ */ Object.create(null);
  const render = function render2(renderable) {
    if (!previous) {
      if (isCmp(renderable)) {
        const [fragment, chunk] = renderComponent(renderable);
        previous = mountChunkFragment(fragment, chunk);
        return fragment;
      }
      if (isTpl(renderable)) {
        const fragment = renderable();
        previous = mountChunkFragment(fragment, renderable._h);
        return fragment;
      }
      if (Array.isArray(renderable)) {
        const [fragment, rendered] = renderList(renderable);
        previous = rendered;
        return fragment;
      }
      return previous = document.createTextNode(renderText(renderable));
    }
    if (Array.isArray(renderable)) {
      if (!Array.isArray(previous)) {
        const [fragment, nextList] = renderList(renderable);
        getNode(previous).after(fragment);
        forgetChunk(previous);
        unmount(previous);
        previous = nextList;
      } else {
        let i = 0;
        const renderableLength = renderable.length;
        const previousLength = previous.length;
        if (renderableLength && previousLength === 1 && !isChunk(previous[0]) && !previous[0].data) {
          const [fragment, rendered] = renderList(renderable);
          previous[0].replaceWith(fragment);
          previous = rendered;
          return;
        }
        if (renderableLength === previousLength) {
          const renderedList2 = new Array(renderableLength);
          for (; i < renderableLength; i++) {
            const item = renderable[i];
            if (isCmp(item) && item.k !== void 0 || isTpl(item) && item._k !== void 0) {
              i = -1;
              break;
            }
            const prev = previous[i];
            if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
              renderedList2[i] = prev;
              continue;
            }
            if (isTpl(item) && isChunk(prev)) {
              const template = item;
              const proto = template._p ?? getChunkProto(template);
              if (prev.g === proto.g) {
                syncTemplateToChunk(template, prev, true);
                renderedList2[i] = prev;
                continue;
              }
            }
            renderedList2[i] = patch(item, prev);
          }
          if (i === renderableLength) {
            previous = renderedList2;
            return;
          }
          i = 0;
        }
        const keyedList = patchKeyedList(renderable, previous);
        if (keyedList) {
          previous = keyedList;
          return;
        }
        if (renderableLength > previousLength && previousLength) {
          for (; i < previousLength; i++) {
            const item = renderable[i];
            const prev = previous[i];
            if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
              continue;
            }
            i = -1;
            break;
          }
          if (i === previousLength) {
            const fragment = document.createDocumentFragment();
            const renderedList2 = previous.slice();
            for (i = previousLength; i < renderableLength; i++) {
              renderedList2[i] = mountItem(renderable[i], fragment);
            }
            getNode(previous[previousLength - 1]).after(fragment);
            previous = renderedList2;
            return;
          }
          i = 0;
        }
        let anchor;
        const renderedList = [];
        const mark = ++renderedMark;
        const updaterFrag = renderableLength > previousLength ? document.createDocumentFragment() : null;
        for (; i < renderableLength; i++) {
          let item = renderable[i];
          const prev = previous[i];
          let key;
          if (isTpl(item) && (key = item._k) !== void 0 && key in keyedChunks) {
            const keyedChunk = keyedChunks[key];
            if (canSyncTemplateChunk(item, keyedChunk)) {
              syncTemplateToChunk(item, keyedChunk, true);
              item = keyedChunk._t;
            }
          }
          if (i > previousLength - 1) {
            renderedList[i] = mountItem(item, updaterFrag);
            continue;
          }
          if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
            anchor = getNode(prev);
            renderedList[i] = prev;
            prev.mk = mark;
            continue;
          }
          const used = patch(item, prev, anchor);
          anchor = getNode(used);
          renderedList[i] = used;
          used.mk = mark;
        }
        if (!renderableLength) {
          const placeholder = renderedList[0] = document.createTextNode("");
          const sync = canSyncUnmount(previous);
          const detached = sync && replaceListWithPlaceholder(previous, placeholder);
          if (!detached)
            getNode(previous).after(placeholder);
          keyedChunks = /* @__PURE__ */ Object.create(null);
          if (sync)
            removeUnmounted(previous, detached);
          else
            unmount(previous);
          previous = renderedList;
          return;
        } else if (renderableLength > previousLength) {
          anchor?.after(updaterFrag);
        }
        for (i = 0; i < previousLength; i++) {
          const stale = previous[i];
          if (stale.mk === mark)
            continue;
          forgetChunk(stale);
          unmount(stale);
        }
        previous = renderedList;
      }
    } else {
      if (Array.isArray(previous))
        keyedChunks = /* @__PURE__ */ Object.create(null);
      previous = patch(renderable, previous);
    }
  };
  render.adopt = capture ? (map, visited) => {
    previous = adoptRenderedValue(previous, capture, map, visited);
  } : () => {
  };
  function renderList(renderable) {
    const fragment = document.createDocumentFragment();
    if (!renderable.length) {
      const placeholder = document.createTextNode("");
      fragment.appendChild(placeholder);
      return [fragment, [placeholder]];
    }
    const renderedItems = new Array(renderable.length);
    for (let i = 0; i < renderable.length; i++) {
      renderedItems[i] = mountItem(renderable[i], fragment);
    }
    return [fragment, renderedItems];
  }
  function syncComponentChunk(renderable, chunk) {
    if (chunk.s?.[1] !== renderable.h)
      return false;
    if (chunk.s[0] !== renderable.p)
      chunk.s[0] = renderable.p;
    if (chunk.s[2] !== renderable.e)
      chunk.s[2] = renderable.e;
    return true;
  }
  function syncKeyedRenderable(renderable, chunk) {
    if (isCmp(renderable))
      return syncComponentChunk(renderable, chunk);
    if (!canSyncTemplateChunk(renderable, chunk))
      return false;
    syncTemplateToChunk(renderable, chunk, true);
    return true;
  }
  function moveChunkIntoPlace(chunk, prev, anchor) {
    if (anchor) {
      moveDOMRef(chunk.ref, anchor.parentNode, anchor.nextSibling);
      return;
    }
    const target = getNode(prev, void 0, true);
    moveDOMRef(chunk.ref, target.parentNode, target);
  }
  function patchKeyedList(renderable, previousList) {
    const renderableLength = renderable.length;
    const previousLength = previousList.length;
    if (!renderableLength) {
      const placeholder = document.createTextNode("");
      const sync = canSyncUnmount(previousList);
      const detached = sync && replaceListWithPlaceholder(previousList, placeholder);
      if (!detached)
        getNode(previousList).after(placeholder);
      keyedChunks = /* @__PURE__ */ Object.create(null);
      if (sync)
        removeUnmounted(previousList, detached);
      else
        unmount(previousList);
      return [placeholder];
    }
    const renderedList = new Array(renderableLength);
    const parent = getNode(previousList[0]).parentNode;
    if (!parent)
      return null;
    let sharedPrefix = 0;
    const sharedPrefixKeys = /* @__PURE__ */ Object.create(null);
    for (; sharedPrefix < previousLength && sharedPrefix < renderableLength; sharedPrefix++) {
      const rendered = previousList[sharedPrefix];
      if (!isChunk(rendered) || rendered.k === void 0)
        return null;
      const item = renderable[sharedPrefix];
      if (!isCmp(item) && !isTpl(item))
        return null;
      const key = getRenderableKey(item);
      if (key === void 0 || key !== rendered.k)
        break;
      sharedPrefixKeys[key] = 1;
      if (!(isTpl(item) && rendered._t === item && item._h === rendered && item._m) && !syncKeyedRenderable(item, rendered)) {
        return null;
      }
      renderedList[sharedPrefix] = rendered;
    }
    if (sharedPrefix === previousLength) {
      if (sharedPrefix === renderableLength)
        return renderedList;
      const fragment = document.createDocumentFragment();
      for (let i = sharedPrefix; i < renderableLength; i++) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        const key = getRenderableKey(item);
        if (key === void 0 || key in sharedPrefixKeys)
          return null;
        sharedPrefixKeys[key] = 1;
        renderedList[i] = mountItem(item, fragment);
      }
      parent.insertBefore(fragment, previousLength ? getNode(previousList[previousLength - 1]).nextSibling : null);
      return renderedList;
    }
    if (sharedPrefix === renderableLength) {
      for (let i = sharedPrefix; i < previousLength; i++) {
        const stale = previousList[i];
        forgetChunk(stale);
        unmount(stale);
      }
      return renderedList;
    }
    let oldStart = sharedPrefix;
    let newStart = sharedPrefix;
    let oldEnd = previousLength - 1;
    let newEnd = renderableLength - 1;
    while (oldStart <= oldEnd && newStart <= newEnd) {
      const startChunk = previousList[oldStart];
      const endChunk = previousList[oldEnd];
      const startKey = startChunk.k;
      const endKey = endChunk.k;
      const nextStart = renderable[newStart];
      const nextEnd = renderable[newEnd];
      const nextStartKey = isCmp(nextStart) || isTpl(nextStart) ? getRenderableKey(nextStart) : void 0;
      const nextEndKey = isCmp(nextEnd) || isTpl(nextEnd) ? getRenderableKey(nextEnd) : void 0;
      if (nextStartKey === void 0 || nextEndKey === void 0)
        return null;
      if (startKey === nextStartKey) {
        if (!(isTpl(nextStart) && startChunk._t === nextStart && nextStart._h === startChunk && nextStart._m) && !syncKeyedRenderable(nextStart, startChunk)) {
          return null;
        }
        renderedList[newStart++] = startChunk;
        oldStart++;
        continue;
      }
      if (endKey === nextEndKey) {
        if (!(isTpl(nextEnd) && endChunk._t === nextEnd && nextEnd._h === endChunk && nextEnd._m) && !syncKeyedRenderable(nextEnd, endChunk)) {
          return null;
        }
        renderedList[newEnd--] = endChunk;
        oldEnd--;
        continue;
      }
      if (startKey === nextEndKey) {
        if (!(isTpl(nextEnd) && startChunk._t === nextEnd && nextEnd._h === startChunk && nextEnd._m) && !syncKeyedRenderable(nextEnd, startChunk)) {
          return null;
        }
        moveDOMRef(startChunk.ref, parent, getNode(endChunk).nextSibling);
        renderedList[newEnd--] = startChunk;
        oldStart++;
        continue;
      }
      if (endKey === nextStartKey) {
        if (!(isTpl(nextStart) && endChunk._t === nextStart && nextStart._h === endChunk && nextStart._m) && !syncKeyedRenderable(nextStart, endChunk)) {
          return null;
        }
        moveDOMRef(endChunk.ref, parent, getNode(startChunk, void 0, true));
        renderedList[newStart++] = endChunk;
        oldEnd--;
        continue;
      }
      break;
    }
    if (newStart > newEnd) {
      for (let i = oldStart; i <= oldEnd; i++) {
        const stale = previousList[i];
        forgetChunk(stale);
        unmount(stale);
      }
      return renderedList;
    }
    if (oldStart > oldEnd) {
      const fragment = document.createDocumentFragment();
      for (let i = newStart; i <= newEnd; i++) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        renderedList[i] = mountItem(item, fragment);
      }
      parent.insertBefore(fragment, newEnd + 1 < renderableLength ? getNode(renderedList[newEnd + 1], void 0, true) : null);
      return renderedList;
    }
    const previousIndexByKey = /* @__PURE__ */ Object.create(null);
    for (let i = oldStart; i <= oldEnd; i++) {
      const rendered = previousList[i];
      if (!isChunk(rendered) || rendered.k === void 0)
        return null;
      const key = rendered.k;
      if (key in previousIndexByKey)
        return null;
      previousIndexByKey[key] = i + 1;
    }
    const middleIndexByKey = /* @__PURE__ */ Object.create(null);
    let overlaps = 0;
    for (let i = newStart; i <= newEnd; i++) {
      const item = renderable[i];
      const key = isCmp(item) || isTpl(item) ? getRenderableKey(item) : void 0;
      if (key === void 0 || key in middleIndexByKey)
        return null;
      middleIndexByKey[key] = i + 1;
      if (key in previousIndexByKey)
        overlaps++;
    }
    if (!overlaps) {
      const first = getNode(previousList[oldStart], void 0, true);
      const last = getNode(previousList[oldEnd]);
      const fragment = document.createDocumentFragment();
      for (let i = newStart; i <= newEnd; i++) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        renderedList[i] = mountItem(item, fragment);
      }
      const parent2 = first.parentNode;
      if (parent2 && first === parent2.firstChild && last === parent2.lastChild) {
        parent2.replaceChildren(fragment);
      } else {
        const range = document.createRange();
        range.setStartBefore(first);
        range.setEndAfter(last);
        range.deleteContents();
        range.insertNode(fragment);
      }
      for (let i = oldStart; i <= oldEnd; i++) {
        const stale = previousList[i];
        forgetChunk(stale);
        destroyChunk(stale, true);
      }
      return renderedList;
    }
    for (let i = oldStart; i <= oldEnd; i++) {
      const stale = previousList[i];
      const nextIndex = middleIndexByKey[stale.k];
      if (nextIndex === void 0) {
        forgetChunk(stale);
        unmount(stale);
        continue;
      }
      const item = renderable[nextIndex - 1];
      if (!syncKeyedRenderable(item, stale))
        return null;
      renderedList[nextIndex - 1] = stale;
    }
    let before = newEnd + 1 < renderableLength ? getNode(renderedList[newEnd + 1], void 0, true) : getNode(previousList[previousLength - 1]).nextSibling;
    for (let i = newEnd; i >= newStart; i--) {
      const existing = renderedList[i];
      if (!existing) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        const fragment = document.createDocumentFragment();
        const mounted = mountItem(item, fragment);
        renderedList[i] = mounted;
        parent.insertBefore(fragment, before);
        before = getNode(mounted, void 0, true);
        continue;
      }
      const start = getNode(existing, void 0, true);
      if (start.parentNode !== parent || start.nextSibling !== before) {
        moveDOMRef(existing.ref, parent, before);
      }
      before = start;
    }
    return renderedList;
  }
  function patch(renderable, prev, anchor) {
    const nodeType = prev.nodeType ?? 0;
    if (isCmp(renderable)) {
      const key = renderable.k;
      if (key !== void 0 && key in keyedChunks) {
        const keyedChunk = keyedChunks[key];
        if (syncComponentChunk(renderable, keyedChunk)) {
          if (keyedChunk === prev)
            return prev;
          moveChunkIntoPlace(keyedChunk, prev, anchor);
          return keyedChunk;
        }
      } else if (isChunk(prev) && syncComponentChunk(renderable, prev)) {
        if (prev.k !== renderable.k) {
          forgetChunk(prev);
          prev.k = renderable.k;
          rememberKeyedChunk(prev);
        }
        return prev;
      }
      const [fragment, chunk] = renderComponent(renderable);
      const mounted = mountChunkFragment(fragment, chunk);
      getNode(prev, anchor).after(fragment);
      forgetChunk(prev);
      unmount(prev);
      rememberKeyedChunk(chunk);
      return mounted;
    }
    if (!isTpl(renderable) && nodeType === 3) {
      const value = renderText(renderable);
      if (prev.data !== value)
        prev.data = value;
      return prev;
    }
    if (isTpl(renderable)) {
      const template = renderable;
      const key = template._k;
      if (key !== void 0 && key in keyedChunks) {
        const keyedChunk = keyedChunks[key];
        if (canSyncTemplateChunk(template, keyedChunk)) {
          syncTemplateToChunk(template, keyedChunk, true);
          if (keyedChunk === prev)
            return prev;
          moveChunkIntoPlace(keyedChunk, prev, anchor);
          return keyedChunk;
        }
      }
      const proto = getChunkProto(template);
      if (isChunk(prev) && prev.g === proto.g) {
        syncTemplateToChunk(template, prev, true);
        return prev;
      }
      const fragment = renderable();
      const chunk = template._h;
      const mounted = mountChunkFragment(fragment, chunk);
      getNode(prev, anchor).after(fragment);
      forgetChunk(prev);
      unmount(prev);
      rememberKeyedChunk(chunk);
      return mounted;
    }
    const text = document.createTextNode(renderText(renderable));
    getNode(prev, anchor).after(text);
    forgetChunk(prev);
    unmount(prev);
    return text;
  }
  function mountItem(item, fragment) {
    if (isCmp(item)) {
      const [inner, chunk] = renderComponent(item);
      fragment.appendChild(inner);
      rememberKeyedChunk(chunk);
      return mountChunkFragment(fragment, chunk);
    }
    if (isTpl(item)) {
      item(fragment);
      const chunk = item._h;
      rememberKeyedChunk(chunk);
      return mountChunkFragment(fragment, chunk);
    }
    const node = document.createTextNode(renderText(item));
    fragment.appendChild(node);
    return node;
  }
  function mountChunkFragment(fragment, chunk) {
    if (chunk.ref.f)
      return chunk;
    const placeholder = document.createTextNode("");
    fragment.appendChild(placeholder);
    return placeholder;
  }
  function rememberKeyedChunk(chunk) {
    if (chunk.k !== void 0)
      keyedChunks[chunk.k] = chunk;
  }
  function forgetChunk(item) {
    if (isChunk(item) && item.k !== void 0 && keyedChunks[item.k] === item) {
      delete keyedChunks[item.k];
    }
  }
  function renderComponent(renderable) {
    const [props, emit2, box] = createPropsProxy(renderable.p, renderable.h, renderable.e);
    const cleanups = [];
    const previousCollector = swapCleanupCollector(cleanups);
    let template;
    let fragment;
    try {
      template = renderable.h(props, emit2);
      fragment = template();
    } finally {
      swapCleanupCollector(previousCollector);
    }
    const chunk = template._c();
    if (cleanups.length) {
      (chunk.u ??= []).push(...cleanups);
    }
    chunk.r = false;
    chunk.s = box;
    chunk.k = renderable.k;
    return [fragment, chunk];
  }
  return render;
}
var unmountStack = [];
function destroyChunk(chunk, detached = false) {
  if (chunk.st)
    removeStaleChunk(chunk);
  releaseTemplate(chunk);
  if (chunk.v) {
    for (let i = 0; i < chunk.v.length; i++) {
      const [target, event] = chunk.v[i];
      const bindings = target[eventBindingsKey];
      if (bindings) {
        delete bindings[event];
        let hasBindings = false;
        for (const key in bindings) {
          hasBindings = true;
          break;
        }
        if (!hasBindings)
          delete target[eventBindingsKey];
      }
      target.removeEventListener(event, dispatchChunkEvent);
    }
  }
  if (chunk.u) {
    for (let i = 0; i < chunk.u.length; i++)
      chunk.u[i]();
    chunk.u = null;
  }
  if (chunk.e + 1) {
    releaseExpressions(chunk.e);
    chunk.e = -1;
  }
  let node = chunk.ref.f;
  if (!detached && node) {
    const last = chunk.ref.l;
    if (node === last)
      node.remove();
    else {
      while (node) {
        const next = node === last ? null : node.nextSibling;
        node.remove();
        if (!next)
          break;
        node = next;
      }
    }
  }
  chunk.dom.textContent = "";
  chunk.ref.f = chunk.ref.l = null;
  chunk.k = chunk.i = chunk.s = void 0;
  chunk.u = chunk.v = null;
  chunk.b = chunk.st = false;
  chunk.r = true;
  chunk.g = "";
  freeChunk(chunk);
}
function recycleChunk(chunk, detached = false) {
  if (!detached)
    moveDOMRef(chunk.ref, chunk.dom);
  releaseTemplate(chunk);
  if (chunk.st || !chunk.r)
    return;
  chunk.st = true;
  let bucket = staleBySignature.get(chunk.g);
  if (!bucket) {
    bucket = {};
    staleBySignature.set(chunk.g, bucket);
  }
  chunk.bkn = bucket.h;
  bucket.h = chunk;
  if (chunk.i !== void 0)
    staleById.set(chunk.i, chunk);
}
var unmountQueued = false;
function canSyncUnmount(chunk) {
  for (let i = 0; i < chunk.length; i++) {
    const item = chunk[i];
    if (isChunk(item) && !item.r)
      return false;
  }
  return true;
}
function replaceListWithPlaceholder(chunk, placeholder) {
  if (!chunk.length)
    return false;
  const first = getNode(chunk[0], void 0, true);
  const last = getNode(chunk[chunk.length - 1]);
  const parent = first.parentNode;
  if (!parent || first !== parent.firstChild || last !== parent.lastChild) {
    return false;
  }
  parent.replaceChildren(placeholder);
  return true;
}
function removeUnmounted(chunk, detached = false) {
  if (isChunk(chunk)) {
    if (chunk.r)
      recycleChunk(chunk, detached);
    else
      destroyChunk(chunk, detached);
    return;
  }
  if (Array.isArray(chunk)) {
    if (!detached && chunk.length) {
      const first = getNode(chunk[0], void 0, true);
      const last = getNode(chunk[chunk.length - 1]);
      const parent = first.parentNode;
      if (parent) {
        if (first === parent.firstChild && last === parent.lastChild) {
          parent.textContent = "";
        } else {
          const range = document.createRange();
          range.setStartBefore(first);
          range.setEndAfter(last);
          range.deleteContents();
        }
        detached = true;
      }
    }
    let bucket;
    let signature = "";
    for (let i = 0; i < chunk.length; i++) {
      const item = chunk[i];
      if (isChunk(item)) {
        if (!item.r) {
          destroyChunk(item, detached);
          continue;
        }
        if (!detached)
          moveDOMRef(item.ref, item.dom);
        releaseTemplate(item);
        if (item.st)
          continue;
        item.st = true;
        if (signature !== item.g) {
          signature = item.g;
          bucket = staleBySignature.get(signature);
          if (!bucket) {
            bucket = {};
            staleBySignature.set(signature, bucket);
          }
        }
        item.bkn = bucket.h;
        bucket.h = item;
        if (item.i !== void 0)
          staleById.set(item.i, item);
      } else if (!detached) {
        item.remove();
      }
    }
    return;
  }
  if (!detached)
    chunk.remove();
}
function drainUnmountStack() {
  unmountQueued = false;
  const stack = unmountStack;
  unmountStack = [];
  for (let i = 0; i < stack.length; i++)
    removeUnmounted(stack[i]);
  if (unmountStack.length)
    scheduleUnmountDrain();
}
function scheduleUnmountDrain() {
  if (unmountQueued)
    return;
  unmountQueued = true;
  queueMicrotask(drainUnmountStack);
}
function unmount(chunk) {
  if (!chunk)
    return;
  unmountStack.push(chunk);
  scheduleUnmountDrain();
}
function renderText(value) {
  return value || value === 0 ? value : "";
}
function getNode(chunk, anchor, first) {
  if (isChunk(chunk)) {
    return first ? chunk.ref.f : chunk.ref.l;
  }
  if (Array.isArray(chunk)) {
    return getNode(chunk[first ? 0 : chunk.length - 1], anchor, first);
  }
  return chunk;
}
function adoptRenderedValue(value, capture, map, visited) {
  if (!value)
    return value;
  if (isChunk(value)) {
    adoptCapturedChunk(capture, value, map, visited);
    return value;
  }
  if (Array.isArray(value)) {
    const next = new Array(value.length);
    for (let i = 0; i < value.length; i++) {
      next[i] = adoptRenderedValue(value[i], capture, map, visited);
    }
    return next;
  }
  return map.get(value) ?? value;
}
function createPaths(dom) {
  const pathTape = [];
  const attrNames = [];
  const path6 = [];
  const previous = [];
  const pushPath = (attrName) => {
    const pathLen = path6.length;
    const previousLen = previous.length;
    const limit = pathLen < previousLen ? pathLen : previousLen;
    let sharedDepth = 0;
    while (sharedDepth < limit && previous[sharedDepth] === path6[sharedDepth]) {
      sharedDepth++;
    }
    pathTape.push(sharedDepth, pathLen - sharedDepth);
    for (let i = sharedDepth; i < pathLen; i++)
      pathTape.push(path6[i]);
    pathTape.push(attrName ? attrNames.push(attrName) : 0);
    previous.length = pathLen;
    for (let i = 0; i < pathLen; i++)
      previous[i] = path6[i];
  };
  const walk = (node) => {
    if (node.nodeType === 1) {
      const attrs = node.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.value === delimiterComment)
          pushPath(attr.name);
      }
    } else if (node.nodeType === 8) {
      pushPath();
    } else if (node.nodeType === 3 && node.nodeValue === delimiterComment) {
      pushPath();
    }
    const children2 = node.childNodes;
    for (let i = 0; i < children2.length; i++) {
      path6.push(i);
      walk(children2[i]);
      path6.pop();
    }
  };
  const children = dom.childNodes;
  for (let i = 0; i < children.length; i++) {
    path6.push(i);
    walk(children[i]);
    path6.pop();
  }
  return [pathTape, attrNames];
}
function normalizeNodePlaceholders(dom) {
  const walk = (node) => {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === 8 && child.data === delimiter) {
        node.replaceChild(document.createTextNode(""), child);
        continue;
      }
      if (child.nodeType === 3 && child.nodeValue === delimiterComment) {
        child.nodeValue = "";
      }
      if (child.firstChild)
        walk(child);
    }
  };
  walk(dom);
}

// src/chat/arrow/input.ts
var import_obsidian6 = require("obsidian");

// src/chat/strings.ts
var strings = {
  "attachment.attached": "Attached: {{names}}",
  "attachment.imagesAttached": "{{count}} image(s) attached",
  "commands.browseSessions": "Browse sessions",
  "commands.newSession": "New session",
  "commands.openChat": "Open chat",
  "commands.piPrefix": "Pi: /{{name}}{{desc}}",
  "commands.saveSession": "Save conversation",
  "commands.sendPrompt": "Send prompt",
  "commands.switchModel": "Switch model",
  "modals.cancel": "Cancel",
  "modals.confirmNo": "No",
  "modals.confirmYes": "Yes",
  "modals.selectCommand": "Select a command\u2026",
  "modals.selectModel": "Select a model\u2026",
  "modals.submit": "Submit",
  "notices.abortConnectionLost": "Connection lost \u2014 resetting the view",
  "notices.cannotRewind": "Cannot rewind a saved session",
  "notices.compacted": "Pi conversation compacted",
  "notices.copied": "Copied to clipboard",
  "notices.copyFailed": "Failed to copy the message",
  "notices.deleteFailed": "Failed to delete session",
  "notices.deletedSession": "Deleted session: {{name}}",
  "notices.disconnected": "Pi disconnected. Use the send prompt command to reconnect.",
  "notices.exportFailed": "Export failed \u2014 persistence may be disabled",
  "notices.exportFailedGeneral": "Export failed",
  "notices.exportedTo": "Exported to {{path}}",
  "notices.fileReadFailed": "Failed to read the file",
  "notices.loadFailed": "Failed to load session: {{msg}}",
  "notices.loadedSession": "Loaded session: {{date}}",
  "notices.messagesLoadFailed": "Failed to load messages from Pi",
  "notices.mobileUnsupported": "Pi requires desktop Obsidian.",
  "notices.modelSwitchFailed": "Failed to switch the model: {{msg}}",
  "notices.modelSwitched": "Switched to {{name}}",
  "notices.modelsFetchFailed": "Failed to fetch models: {{msg}}",
  "notices.newSession": "New session started",
  "notices.newSessionCancelled": "New session was cancelled",
  "notices.newSessionFailed": "Failed to create a new session: {{msg}}",
  "notices.noActiveChat": "No active Pi chat",
  "notices.noConversation": "No conversation to save",
  "notices.noExportMessages": "No messages to export",
  "notices.noModels": "No models available",
  "notices.noSavedSessions": "No saved sessions found",
  "notices.noSession": "No active session",
  "notices.notConnected": "Not connected to Pi",
  "notices.notRewindable": "This message cannot be rewound",
  "notices.onlyUserRewind": "Only user messages can be rewound",
  "notices.piError": "Pi error: {{msg}}",
  "notices.readOnly": "This is a saved session (read-only). Start a new session to chat.",
  "notices.reconnected": "Pi reconnected.",
  "notices.renameFailed": "Failed to rename the session",
  "notices.renamedSession": "Renamed session to {{name}}",
  "notices.renderError": "\u26A0\uFE0F Failed to render the message",
  "notices.returnCancelled": "Return was cancelled",
  "notices.returnFailed": "Return failed: {{msg}}",
  "notices.returnSuccess": "Returned to latest",
  "notices.rewindCancelled": "Rewind was cancelled by Pi",
  "notices.rewindFailed": "Rewind failed: {{msg}}",
  "notices.rewindSuccess": "Rewound. Edit the message or return to latest.",
  "notices.saveDisabled": "Session not saved (persistence disabled or empty)",
  "notices.saveFailed": "Failed to save session: {{msg}}",
  "notices.savedTo": "Session saved to {{path}}",
  "notices.sendFailed": "Failed to send the message to Pi",
  "notices.sending": "Sending a prompt to Pi\u2026",
  "notices.startFailed": "Failed to start Pi: {{msg}}. Check the binary path in settings.",
  "notices.switchCancelled": "Session switch was cancelled",
  "notices.switchFailed": "Failed to switch session",
  "notices.switchedTo": "Switched to {{name}}",
  "notices.waitRewind": "Wait for Pi to finish before rewinding",
  "notices.waitReturn": "Wait for Pi to finish before returning",
  "renderer.errorLabel": "Error: ",
  "renderer.infoCost": "Cost",
  "renderer.infoModel": "Model",
  "renderer.infoTitle": "Message info",
  "renderer.infoTokens": "Tokens",
  "renderer.infoTooltip": "Info",
  "renderer.infoUnavailable": "No stats available",
  "renderer.result": "Result",
  "renderer.rewindTooltip": "Rewind to this message",
  "renderer.thinkingSummary": "Thinking\u2026",
  "sessionList.emptyPreview": "(Empty session)",
  "sessionList.placeholder": "Browse saved sessions\u2026",
  "sessionPanel.close.tooltip": "Close panel",
  "sessionPanel.confirmDelete": "Delete session '{{name}}'?\nThis cannot be undone.",
  "sessionPanel.delete.tooltip": "Delete session",
  "sessionPanel.empty": "No sessions found",
  "sessionPanel.export.tooltip": "Export to vault",
  "sessionPanel.failedLoad": "Failed to load sessions",
  "sessionPanel.filterPlaceholder": "Filter sessions\u2026",
  "sessionPanel.msgCount": "{{count}} messages",
  "sessionPanel.noMatch": "No matching sessions",
  "sessionPanel.rename.tooltip": "Rename session",
  "sessionPanel.title": "Sessions",
  "sessionPanel.today": "Today {{time}}",
  "sessionPanel.yesterday": "Yesterday {{time}}",
  "sessionPopover.cancel": "Cancel",
  "sessionPopover.confirmDelete": "Delete",
  "sessionPopover.current": "current",
  "sessionPopover.deleteConfirm": "Delete this session?",
  "sessionPopover.empty": "No sessions found",
  "sessionPopover.failedLoad": "Failed to load sessions",
  "sessionPopover.renamePlaceholder": "Session name",
  "sessionPopover.save": "Save name",
  "sessionPopover.title": "Sessions",
  "statusBar.default": "Pi",
  "statusBar.streaming": "\u23F3",
  "view.abort": "Abort",
  "view.newBtn.tooltip": "New session",
  "view.newSession": "New session",
  "view.readOnlyBanner": "\u{1F4D6} Viewing saved session",
  "view.returnBanner.button": "Return to latest",
  "view.returnBanner.text": "You are viewing a rewind fork.",
  "view.returnBanner.tooltip": "Return to the session state before rewind",
  "view.rewind": "Rewind",
  "view.sessionName.tooltip": "Click to rename the session",
  "view.sessionsBtn.tooltip": "Browse sessions",
  "view.thinking": "Thinking\u2026",
  "view.title": "Pi chat"
};
function t(key, vars) {
  let str = strings[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{{${k}}}`, String(v));
    }
  }
  return str;
}

// src/chat/attachment.ts
function formatAttachmentSize(bytes) {
  const kb = bytes / 1024;
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(1)} MB`;
  }
  return `${kb.toFixed(1)} KB`;
}

// src/chat/arrow/reactive.ts
function createChatReactiveState(initial = {}) {
  return reactive({
    model: initial.model ?? "",
    thinkingLevel: initial.thinkingLevel ?? "medium",
    streaming: initial.streaming ?? false,
    tokens: initial.tokens ?? 0,
    cost: initial.cost ?? 0,
    mentionables: initial.mentionables ?? [],
    sessionName: initial.sessionName ?? "",
    text: initial.text ?? "",
    placeholder: initial.placeholder ?? "",
    statusText: initial.statusText ?? ""
  });
}
function addMentionable(state, mentionable) {
  state.mentionables = [...state.mentionables, mentionable];
}
function removeMentionable(state, index2) {
  state.mentionables = state.mentionables.filter((_, i) => i !== index2);
}
function resetComposer(state) {
  state.mentionables = [];
  state.tokens = 0;
  state.cost = 0;
}

// src/chat/arrow/mentionable-badges.ts
var activePreviewEl = null;
var activeOutsideListener = null;
function closePreview() {
  if (activePreviewEl) {
    activePreviewEl.remove();
    activePreviewEl = null;
  }
  if (activeOutsideListener) {
    document.removeEventListener("mousedown", activeOutsideListener);
    activeOutsideListener = null;
  }
}
function openPreview(attachment, anchor) {
  closePreview();
  const el = document.body.createDiv({ cls: "pi-mentionable-preview" });
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", `Preview of ${attachment.name}`);
  el.createDiv({ cls: "pi-mentionable-preview-title", text: attachment.name });
  if (attachment.type === "image") {
    const src = `data:${attachment.mimeType ?? "image/png"};base64,${attachment.content}`;
    el.createEl("img", {
      cls: "pi-mentionable-preview-image",
      attr: { src, alt: attachment.name }
    });
  } else {
    const body = el.createDiv({ cls: "pi-mentionable-preview-body" });
    const lines = attachment.content.split(/\r?\n/).slice(0, 3);
    for (const line of lines) {
      body.createEl("p", { text: line });
    }
    if (lines.length === 0) {
      body.createEl("p", { cls: "pi-mentionable-preview-empty", text: "(empty file)" });
    }
  }
  document.body.appendChild(el);
  const rect = anchor.getBoundingClientRect();
  const gap = 4;
  let top = rect.bottom + gap;
  let left = rect.left;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const previewRect = el.getBoundingClientRect();
  if (left + previewRect.width > viewportWidth) {
    left = Math.max(8, viewportWidth - previewRect.width - 8);
  }
  if (top + previewRect.height > viewportHeight) {
    top = Math.max(8, rect.top - previewRect.height - gap);
  }
  el.style.position = "fixed";
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.style.zIndex = "1000";
  activePreviewEl = el;
  activeOutsideListener = (e) => {
    if (!activePreviewEl?.contains(e.target)) {
      closePreview();
    }
  };
  document.addEventListener("mousedown", activeOutsideListener);
}
function handleChipClick(attachment, e) {
  openPreview(attachment, e.currentTarget);
}
function handleRemove(state, index2, e) {
  e.stopPropagation();
  removeMentionable(state, index2);
}
function MentionableBadges(props) {
  return html`<div class="pi-attachments">
		${() => props.state.mentionables.length > 0 ? props.state.mentionables.map(
    (attachment, index2) => html`<div
							class="pi-attachment-chip pi-mentionable-chip"
							title="${() => attachment.name}"
							@click="${(e) => handleChipClick(attachment, e)}"
						>
							${() => attachment.type === "image" ? html`<img
											class="pi-attachment-thumb"
											src="data:${() => attachment.mimeType ?? "image/png"};base64,${() => attachment.content}"
											alt="${() => attachment.name}"
										/>` : ""}
							<span class="pi-attachment-name">${() => attachment.name}</span>
							${() => attachment.size != null ? html`<span class="pi-attachment-size"
										> (${() => formatAttachmentSize(attachment.size)})</span
									>` : ""}
							<button
								class="pi-attachment-remove"
								type="button"
								aria-label="Remove attachment"
								@click="${(e) => handleRemove(props.state, index2, e)}"
							>
								×
							</button>
						</div>`.key(`${attachment.name}-${index2}`)
  ) : ""}
	</div>`;
}

// src/chat/arrow/model-select.ts
var import_obsidian5 = require("obsidian");

// src/chat/pi-config-reader.ts
var import_obsidian4 = require("obsidian");
var fs2;
var os2;
var path3;
var JSON5;
if (import_obsidian4.Platform.isDesktop) {
  fs2 = require("node:fs");
  os2 = require("node:os");
  path3 = require("node:path");
  JSON5 = require("json5");
}
function readPiModelsConfig(projectPath) {
  if (!import_obsidian4.Platform.isDesktop) {
    return { providers: [] };
  }
  const providers = {};
  let error;
  let configExists = false;
  try {
    const homeDir = os2.homedir();
    const userModelsPath = path3.join(homeDir, ".pi", "agent", "models.json");
    if (fs2.existsSync(userModelsPath)) {
      configExists = true;
      const content = fs2.readFileSync(userModelsPath, "utf-8");
      const userConfig = JSON5.parse(content);
      if (userConfig.providers) {
        Object.assign(providers, userConfig.providers);
      }
    }
  } catch (err) {
    error = `Failed to read ~/.pi/agent/models.json: ${err instanceof Error ? err.message : String(err)}`;
    console.warn("[Pi Plugin]", error);
  }
  if (projectPath) {
    try {
      const projectModelsPath = path3.join(projectPath, ".pi", "models.json");
      if (fs2.existsSync(projectModelsPath)) {
        configExists = true;
        const content = fs2.readFileSync(projectModelsPath, "utf-8");
        const projectConfig = JSON5.parse(content);
        if (projectConfig.providers) {
          Object.assign(providers, projectConfig.providers);
        }
      }
    } catch (err) {
      error = `Failed to read project models.json: ${err instanceof Error ? err.message : String(err)}`;
      console.warn("[Pi Plugin]", error);
    }
  }
  if (configExists && Object.keys(providers).length === 0 && error) {
    return { providers: [], error };
  }
  const result = [];
  for (const [providerName, config] of Object.entries(providers)) {
    const models = (config.models || []).map((m) => ({
      id: m.id,
      name: m.name || m.id,
      reasoning: m.reasoning,
      contextWindow: m.contextWindow
    }));
    const rawApiKey = (config.apiKey || "").trim();
    const envVarName = rawApiKey.startsWith("$") ? rawApiKey.slice(1) : rawApiKey;
    result.push({
      name: providerName,
      envVarName,
      baseUrl: config.baseUrl,
      api: config.api,
      models
    });
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return { providers: result, error };
}
function readProviders(projectPath) {
  return readPiModelsConfig(projectPath).providers;
}

// src/chat/arrow/model-select.ts
function ModelSelect(props) {
  const local = reactive({
    open: false,
    loading: false,
    models: [],
    error: ""
  });
  async function loadModels() {
    if (local.models.length > 0) return;
    local.loading = true;
    local.error = "";
    try {
      const providers = readProviders(props.projectPath);
      const flat = [];
      for (const provider of providers) {
        for (const model of provider.models) {
          flat.push({ ...model, provider: provider.name });
        }
      }
      flat.sort((a, b) => a.name.localeCompare(b.name));
      local.models = flat;
      if (flat.length === 0) {
        local.error = t("notices.noModels");
      }
    } catch (err) {
      local.error = t("notices.modelsFetchFailed", {
        msg: err instanceof Error ? err.message : String(err)
      }) || t("notices.noModels");
      console.warn("[Pi Chat] Failed to load models:", err);
    } finally {
      local.loading = false;
    }
  }
  async function selectModel(model) {
    local.open = false;
    const conn = props.connection;
    if (!conn?.isConnected()) {
      new import_obsidian5.Notice(t("notices.notConnected"));
      return;
    }
    const previousModel = props.state.model;
    props.state.model = model.name;
    try {
      await conn.send({ type: "switch_model", model: model.id });
      new import_obsidian5.Notice(t("notices.modelSwitched", { name: model.name }));
    } catch (err) {
      props.state.model = previousModel;
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Pi Chat] switch_model failed:", err);
      new import_obsidian5.Notice(t("notices.modelSwitchFailed", { msg }));
    }
  }
  function chipLabel() {
    const model = props.state.model || t("notices.noModels");
    const thinking = props.state.thinkingLevel;
    if (thinking && thinking !== "off") {
      return `${model} :${thinking}`;
    }
    return model;
  }
  function toggleOpen() {
    if (!import_obsidian5.Platform.isDesktop) {
      new import_obsidian5.Notice(t("notices.mobileUnsupported"));
      return;
    }
    if (!local.open) {
      void loadModels();
    }
    local.open = !local.open;
  }
  return html`<div class="pi-model-select">
		<button
			class="pi-model-chip"
			type="button"
			@click="${toggleOpen}"
			disabled="${() => local.loading}"
			aria-haspopup="listbox"
			aria-expanded="${() => local.open}"
		>
			${() => chipLabel()}
			<span class="pi-model-chip-caret">▾</span>
		</button>
		${() => local.open ? html`<div class="pi-model-dropdown" role="listbox">
						${() => local.error ? html`<div class="pi-model-dropdown-error">${() => local.error}</div>` : local.models.map(
    (model) => html`<button
												class="pi-model-dropdown-item"
												type="button"
												role="option"
												@click="${() => selectModel(model)}"
											>
												<span class="pi-model-dropdown-name">${() => model.name}</span>
												<span class="pi-model-dropdown-provider">${() => model.provider}</span>
											</button>`.key(model.id)
  )}
				  </div>` : false}
	</div>`;
}

// src/chat/arrow/input.ts
var MAX_IMAGE_SIZE = 5 * 1024 * 1024;
function buildChatInput(props) {
  let textareaEl = null;
  let isComposing = false;
  const fileInputId = `pi-composer-file-${Math.random().toString(36).slice(2)}`;
  function adjustHeight() {
    if (!textareaEl) return;
    textareaEl.style.height = "auto";
    textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, 200)}px`;
  }
  function canSend() {
    return props.state.text.trim().length > 0 || props.state.mentionables.length > 0;
  }
  function focus() {
    textareaEl?.focus();
  }
  function send() {
    const text = props.state.text.trim();
    if (!text && props.state.mentionables.length === 0) return;
    props.onSend(text, [...props.state.mentionables]);
    resetComposer(props.state);
    props.state.text = "";
    adjustHeight();
    focus();
  }
  function handleInput(e) {
    const target = e.target;
    textareaEl = target;
    props.state.text = target.value;
  }
  function handleKeydown(e) {
    if (props.state.streaming) return;
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      send();
      return;
    }
    if (e.key === "/" && props.onSlashTyped) {
      window.setTimeout(() => {
        if (textareaEl?.value.startsWith("/")) {
          props.onSlashTyped?.();
        }
      }, 0);
    }
    if (e.key === "@" && props.onAtTyped) {
      window.setTimeout(() => props.onAtTyped?.(), 0);
    }
  }
  function startComposition() {
    isComposing = true;
  }
  function endComposition() {
    isComposing = false;
  }
  function handlePaste(e) {
    if (!e.clipboardData) return;
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          attachImage(file);
        }
        break;
      }
    }
  }
  function handleFileSelect(e) {
    const target = e.target;
    const files = target.files;
    if (!files) return;
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        attachImage(file);
      }
    }
    target.value = "";
  }
  function attachImage(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        console.error("[ChatInput] Failed to read image as data URL");
        return;
      }
      const parts = result.split(",");
      if (parts.length < 2) {
        console.error("[ChatInput] Invalid data URL format");
        return;
      }
      const base64 = parts[1];
      const sizeBytes = base64.length * 3 / 4;
      if (sizeBytes > MAX_IMAGE_SIZE) {
        new import_obsidian6.Notice(`Image too large (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB). Max 5MB.`);
        return;
      }
      addMentionable(props.state, {
        type: "image",
        name: file.name || `pasted-image-${Date.now()}.png`,
        content: base64,
        mimeType: file.type || "image/png",
        size: sizeBytes
      });
    };
    reader.onerror = () => {
      console.error("[ChatInput] FileReader error:", reader.error);
    };
    reader.readAsDataURL(file);
  }
  const [, stopWatchingText] = watch(() => props.state.text, adjustHeight);
  const template = html`<div class="pi-composer" @paste="${handlePaste}">
		<div class="pi-composer-attachments">
			${MentionableBadges({ state: props.state })}
		</div>

		<textarea
			class="${() => props.state.streaming ? "pi-composer-textarea pi-input-disabled" : "pi-composer-textarea"}"
			rows="1"
			.placeholder="${() => props.state.placeholder}"
			.disabled="${() => props.state.streaming}"
			@input="${handleInput}"
			@keydown="${handleKeydown}"
			@compositionstart="${startComposition}"
			@compositionend="${endComposition}"
			.value="${() => props.state.text}"
		></textarea>

		<div class="pi-composer-controls">
			<div class="pi-composer-left">
				${ModelSelect({
    state: props.state,
    connection: props.connection,
    projectPath: props.projectPath
  })}
			</div>
			<div class="pi-composer-right">
				<input
					id="${fileInputId}"
					type="file"
					accept="image/*"
					class="pi-composer-file-input"
					@change="${handleFileSelect}"
				/>
				<label
					class="pi-composer-upload"
					for="${fileInputId}"
					aria-label="Attach image"
					disabled="${() => props.state.streaming}"
				>
					🖼
				</label>
				${() => props.state.streaming ? html`<button
								class="pi-composer-abort"
								type="button"
								aria-label="${t("view.abort")}"
								@click="${() => props.onAbort?.()}"
							>
								${t("view.abort")}
							</button>` : html`<button
								class="pi-composer-send"
								type="button"
								disabled="${() => !canSend()}"
								@click="${send}"
							>
								Send
							</button>`}
			</div>
		</div>
	</div>`;
  return { template, stopWatch: stopWatchingText };
}
var ArrowChatInput = class {
  containerEl;
  unmount = null;
  stopWatch = null;
  textareaEl = null;
  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.containerEl.empty();
    const { template, stopWatch } = buildChatInput(props);
    this.stopWatch = stopWatch;
    const result = template(this.containerEl);
    this.unmount = typeof result === "function" ? result : null;
    this.textareaEl = this.containerEl.querySelector(".pi-composer-textarea");
  }
  /** Move focus to the composer textarea. */
  focus() {
    this.textareaEl?.focus();
  }
  /** Enable or disable the composer textarea. */
  setEnabled(enabled) {
    if (!this.textareaEl) return;
    this.textareaEl.disabled = !enabled;
    this.textareaEl.classList.toggle("pi-input-disabled", !enabled);
  }
  /** Tear down the Arrow component and clear the container. */
  destroy() {
    if (this.unmount) {
      this.unmount();
      this.unmount = null;
    }
    this.stopWatch?.();
    this.stopWatch = null;
    this.textareaEl = null;
    this.containerEl.empty();
  }
};

// src/chat/arrow/message-actions.ts
var import_obsidian7 = require("obsidian");
function mountMessageActions(container, options) {
  const state = reactive({
    content: options.content,
    tokens: options.tokens,
    cost: options.cost,
    model: options.model
  });
  const ui = reactive({ copied: false, infoOpen: false });
  let currentRewind = options.onRewind;
  let popoverEl = null;
  let outsideClose = null;
  function closeInfo() {
    if (popoverEl) {
      popoverEl.remove();
      popoverEl = null;
    }
    if (outsideClose) {
      document.removeEventListener("mousedown", outsideClose);
      outsideClose = null;
    }
    ui.infoOpen = false;
  }
  function openInfo(anchor) {
    closeInfo();
    popoverEl = document.body.createDiv({ cls: "pi-message-actions-popover" });
    popoverEl.setAttribute("role", "dialog");
    popoverEl.setAttribute("aria-label", "Message info");
    const title = popoverEl.createDiv({ cls: "pi-message-actions-popover-title" });
    title.setText(t("renderer.infoTitle"));
    const body = popoverEl.createDiv({ cls: "pi-message-actions-popover-body" });
    if (state.model) {
      body.createEl("p", {
        text: `${t("renderer.infoModel")}: ${state.model}`
      });
    }
    if (state.tokens > 0) {
      body.createEl("p", {
        text: `${t("renderer.infoTokens")}: ${state.tokens.toLocaleString()}`
      });
    }
    if (state.cost > 0) {
      body.createEl("p", {
        text: `${t("renderer.infoCost")}: $${state.cost.toFixed(4)}`
      });
    }
    if (!state.model && state.tokens === 0 && state.cost === 0) {
      body.createEl("p", { text: t("renderer.infoUnavailable") });
    }
    document.body.appendChild(popoverEl);
    const rect = anchor.getBoundingClientRect();
    const gap = 4;
    let top = rect.bottom + gap;
    let left = rect.left;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverRect = popoverEl.getBoundingClientRect();
    if (left + popoverRect.width > viewportWidth) {
      left = Math.max(8, viewportWidth - popoverRect.width - 8);
    }
    if (top + popoverRect.height > viewportHeight) {
      top = Math.max(8, rect.top - popoverRect.height - gap);
    }
    popoverEl.style.position = "fixed";
    popoverEl.style.left = `${left}px`;
    popoverEl.style.top = `${top}px`;
    popoverEl.style.zIndex = "1000";
    ui.infoOpen = true;
    outsideClose = (e) => {
      if (!popoverEl?.contains(e.target) && !container.contains(e.target)) {
        closeInfo();
      }
    };
    document.addEventListener("mousedown", outsideClose);
  }
  function toggleInfo(e) {
    const anchor = e.currentTarget;
    if (ui.infoOpen) {
      closeInfo();
    } else {
      openInfo(anchor);
    }
  }
  async function copyContent() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(state.content);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = state.content;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      ui.copied = true;
      window.setTimeout(() => {
        ui.copied = false;
      }, 1500);
    } catch (err) {
      console.warn("[Pi Chat] Failed to copy message:", err);
      new import_obsidian7.Notice(t("notices.copyFailed"));
    }
  }
  function handleRewind() {
    currentRewind?.();
  }
  const template = html`<div class="pi-message-action-row" role="toolbar" aria-label="Message actions">
		<button
			class="pi-message-action-btn pi-message-action-copy"
			type="button"
			aria-label="${() => ui.copied ? t("notices.copied") : t("renderer.copyTooltip")}"
			@click="${copyContent}"
		>
			${() => ui.copied ? "\u2713" : t("renderer.copyTooltip")}
		</button>
		<button
			class="pi-message-action-btn pi-message-action-info"
			type="button"
			aria-label="${t("renderer.infoTooltip")}"
			@click="${toggleInfo}"
		>
			${t("renderer.infoTooltip")}
		</button>
		${() => currentRewind ? html`<button
						class="pi-message-action-btn pi-message-action-rewind"
						type="button"
						aria-label="${t("renderer.rewindTooltip")}"
						@click="${handleRewind}"
					>
						${t("view.rewind")}
					</button>` : ""}
	</div>`;
  const result = template(container);
  const unmountFn = typeof result === "function" ? result : () => container.empty();
  return {
    update(opts) {
      if (opts.content !== void 0) state.content = opts.content;
      if (opts.tokens !== void 0) state.tokens = opts.tokens;
      if (opts.cost !== void 0) state.cost = opts.cost;
      if (opts.model !== void 0) state.model = opts.model;
      if (opts.onRewind !== void 0) currentRewind = opts.onRewind;
    },
    unmount() {
      closeInfo();
      unmountFn();
    }
  };
}

// src/chat/arrow/modals.ts
var import_obsidian8 = require("obsidian");
function moveFocusWithin(container, selector, direction) {
  const items = Array.from(container.querySelectorAll(selector));
  if (items.length === 0) return;
  const active = container.ownerDocument.activeElement;
  const index2 = active ? items.indexOf(active) : -1;
  let next = index2 + direction;
  if (next < 0) next = items.length - 1;
  if (next >= items.length) next = 0;
  items[next]?.focus();
}
var PermissionSelectModal = class extends import_obsidian8.Modal {
  titleText;
  options;
  onResponse;
  selectedOption = null;
  unmount = null;
  responded = false;
  constructor(app, title, options, onResponse) {
    super(app);
    this.titleText = title;
    this.options = options;
    this.onResponse = onResponse;
  }
  onOpen() {
    this.contentEl.addClass("pi-permission-modal");
    const state = reactive({ selected: null });
    const select = (option) => {
      state.selected = option;
      this.selectedOption = option;
      this.close();
    };
    const template = html`<h2>${this.titleText}</h2>
			<div class="pi-permission-options">
				${() => this.options.map(
      (option) => html`<button
							class="pi-permission-option-btn"
							type="button"
							aria-label="${option}"
							@click="${() => select(option)}"
							@keydown="${(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(option);
        }
      }}"
						>
							${option}
						</button>`.key(option)
    )}
			</div>
			<button
				class="pi-permission-cancel-btn"
				type="button"
				@click="${() => this.close()}"
			>
				${t("modals.cancel")}
			</button>`;
    const result = template(this.contentEl);
    this.unmount = typeof result === "function" ? result : null;
    const first = this.contentEl.querySelector(".pi-permission-option-btn");
    first?.focus();
    this.contentEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveFocusWithin(this.contentEl, ".pi-permission-option-btn, .pi-permission-cancel-btn", 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveFocusWithin(this.contentEl, ".pi-permission-option-btn, .pi-permission-cancel-btn", -1);
      }
    });
  }
  onClose() {
    this.unmount?.();
    this.contentEl.empty();
    if (this.responded) return;
    this.responded = true;
    if (this.selectedOption) {
      this.onResponse({ value: this.selectedOption });
    } else {
      this.onResponse({ cancelled: true });
    }
  }
};
var PermissionConfirmModal = class extends import_obsidian8.Modal {
  titleText;
  messageText;
  onResponse;
  confirmed = false;
  unmount = null;
  responded = false;
  constructor(app, title, message, onResponse) {
    super(app);
    this.titleText = title;
    this.messageText = message;
    this.onResponse = onResponse;
  }
  onOpen() {
    this.contentEl.addClass("pi-permission-modal");
    const confirm = () => {
      this.confirmed = true;
      this.close();
    };
    const template = html`<h2>${this.titleText}</h2>
			${() => this.messageText ? html`<p>${this.messageText}</p>` : false}
			<div class="pi-permission-buttons">
				<button
					class="pi-permission-confirm-btn"
					type="button"
					aria-label="${t("modals.confirmYes")}"
					@click="${confirm}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        confirm();
      }
    }}"
				>
					${t("modals.confirmYes")}
				</button>
				<button
					class="pi-permission-cancel-btn"
					type="button"
					aria-label="${t("modals.confirmNo")}"
					@click="${() => this.close()}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.close();
      }
    }}"
				>
					${t("modals.confirmNo")}
				</button>
			</div>`;
    const result = template(this.contentEl);
    this.unmount = typeof result === "function" ? result : null;
    const confirmBtn = this.contentEl.querySelector(
      ".pi-permission-confirm-btn"
    );
    confirmBtn?.focus();
  }
  onClose() {
    this.unmount?.();
    this.contentEl.empty();
    if (this.responded) return;
    this.responded = true;
    this.onResponse({ confirmed: this.confirmed });
  }
};
var PermissionInputModal = class extends import_obsidian8.Modal {
  titleText;
  messageText;
  placeholderText;
  initialValue;
  isEditor;
  onResponse;
  submittedValue = null;
  unmount = null;
  responded = false;
  constructor(app, title, message, placeholder, initialValue, onResponse, isEditor = false) {
    super(app);
    this.titleText = title;
    this.messageText = message;
    this.placeholderText = placeholder;
    this.initialValue = initialValue;
    this.isEditor = isEditor;
    this.onResponse = onResponse;
  }
  onOpen() {
    this.contentEl.addClass("pi-permission-modal");
    const state = reactive({ value: this.initialValue });
    const submit = () => {
      this.submittedValue = state.value;
      this.close();
    };
    const cancel = () => {
      this.submittedValue = null;
      this.close();
    };
    const template = html`<h2>${this.titleText}</h2>
			${() => this.messageText ? html`<p>${this.messageText}</p>` : false}
			<textarea
				class="pi-permission-input"
				rows="${this.isEditor ? 4 : 1}"
				placeholder="${this.placeholderText}"
				aria-label="${this.titleText}"
				.value="${() => state.value}"
				@input="${(e) => {
      state.value = e.target.value;
    }}"
				@keydown="${(e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit();
      } else if (e.key === "Enter" && !this.isEditor) {
        e.preventDefault();
        submit();
      }
    }}"
			></textarea>
			<div class="pi-permission-buttons">
				<button
					class="pi-permission-confirm-btn"
					type="button"
					aria-label="${t("modals.submit")}"
					@click="${submit}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        submit();
      }
    }}"
				>
					${t("modals.submit")}
				</button>
				<button
					class="pi-permission-cancel-btn"
					type="button"
					aria-label="${t("modals.cancel")}"
					@click="${cancel}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cancel();
      }
    }}"
				>
					${t("modals.cancel")}
				</button>
			</div>`;
    const result = template(this.contentEl);
    this.unmount = typeof result === "function" ? result : null;
    const input = this.contentEl.querySelector(
      ".pi-permission-input"
    );
    input?.focus();
  }
  onClose() {
    this.unmount?.();
    this.contentEl.empty();
    if (this.responded) return;
    this.responded = true;
    if (this.submittedValue !== null) {
      this.onResponse({ value: this.submittedValue });
    } else {
      this.onResponse({ cancelled: true });
    }
  }
};

// src/chat/arrow/session-list-popover.ts
var import_obsidian10 = require("obsidian");

// src/chat/session-scanner.ts
var import_obsidian9 = require("obsidian");
var _readFile;
var _readdir;
var _stat;
var _join;
var _basename;
var _homedir;
if (import_obsidian9.Platform.isDesktop) {
  const fsPromisesModule = require("node:fs/promises");
  const pathModule = require("node:path");
  const osModule = require("node:os");
  _readFile = (...args) => fsPromisesModule.readFile(...args);
  _readdir = (...args) => fsPromisesModule.readdir(...args);
  _stat = (...args) => fsPromisesModule.stat(...args);
  _join = (...args) => pathModule.join(...args);
  _basename = (...args) => pathModule.basename(...args);
  _homedir = () => osModule.homedir();
}
var SessionScanner = class {
  sessionsDir;
  constructor(sessionsDir) {
    this.sessionsDir = sessionsDir || (import_obsidian9.Platform.isDesktop ? _join(_homedir(), ".pi", "agent", "sessions") : "");
  }
  /**
   * Scan the sessions directory and return metadata for all sessions,
   * sorted by most recent first.
   */
  async scan() {
    const sessions = [];
    let cwdDirs;
    try {
      cwdDirs = await _readdir(this.sessionsDir);
    } catch {
      return [];
    }
    for (const cwdSlug of cwdDirs) {
      const cwdPath = _join(this.sessionsDir, cwdSlug);
      try {
        const cwdStat = await _stat(cwdPath);
        if (!cwdStat.isDirectory()) continue;
      } catch {
        continue;
      }
      let files;
      try {
        files = await _readdir(cwdPath);
      } catch {
        continue;
      }
      for (const file of files) {
        if (!file.endsWith(".jsonl")) continue;
        const filePath = _join(cwdPath, file);
        try {
          const session = await this.readSessionMetadata(filePath, cwdSlug);
          if (session) sessions.push(session);
        } catch (err) {
          console.warn(`[SessionScanner] Failed to read ${filePath}:`, err);
        }
      }
    }
    sessions.sort((a, b) => b.mtime - a.mtime);
    return sessions;
  }
  /**
   * Read metadata from a single .jsonl session file.
   */
  async readSessionMetadata(filePath, cwdSlug) {
    const fileStat = await _stat(filePath);
    if (fileStat.size === 0) return null;
    const content = await _readFile(filePath, "utf-8");
    const lines = content.split("\n").filter((l) => l.trim());
    if (lines.length === 0) return null;
    let name = _basename(filePath, ".jsonl");
    let preview = "";
    let cwd = this.unslugCwd(cwdSlug);
    let messageCount = 0;
    let sessionName = "";
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type === "session") {
          if (entry.cwd) cwd = entry.cwd;
          if (entry.id) name = entry.id;
          continue;
        }
        if (entry.type === "session_name" && entry.name) {
          sessionName = entry.name;
          continue;
        }
        if (entry.type === "message" && entry.message) {
          const msg = entry.message;
          if (msg.role === "user" || msg.role === "assistant") {
            messageCount++;
          }
          if (!preview && msg.role === "user") {
            preview = this.extractText(msg.content);
            if (preview.length > 80) {
              preview = `${preview.slice(0, 80)}\u2026`;
            }
          }
        }
      } catch {
      }
    }
    if (sessionName) {
      name = sessionName;
    } else {
      const dateMatch = _basename(filePath).match(/^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})/);
      if (dateMatch) {
        name = `${dateMatch[1]} ${dateMatch[2]}:${dateMatch[3]}`;
      }
    }
    return {
      path: filePath,
      name,
      cwd,
      mtime: fileStat.mtimeMs,
      messageCount,
      preview: preview || "(empty session)"
    };
  }
  /**
   * Extract plain text from a message content field.
   * Content can be a string or an array of content blocks.
   */
  extractText(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content.filter((b) => b.type === "text" && b.text).map((b) => b.text).join(" ");
    }
    return "";
  }
  /**
   * Convert a cwd slug back to a readable path.
   * Pi slugs: --home-user-Projects-- → /home/user/Projects
   */
  unslugCwd(slug) {
    let inner = slug;
    if (inner.startsWith("--")) inner = inner.slice(2);
    if (inner.endsWith("--")) inner = inner.slice(0, -2);
    const path6 = `/${inner.replace(/-/g, "/")}`;
    return path6;
  }
};

// src/chat/arrow/session-list-popover.ts
function formatSessionDate(mtime) {
  if (mtime <= 0) return "";
  try {
    return new Date(mtime).toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
}
function SessionRow(props) {
  return html`<div
		class="${() => [
    "pi-session-popover-item",
    props.isCurrent ? "is-current" : "",
    props.isSelected ? "is-selected" : ""
  ].join(" ")}"
		@click="${() => {
    if (!props.isEditing && !props.isDeleting) {
      props.onSelect();
    }
  }}"
	>
		<div class="pi-session-popover-item-main">
			${() => props.isEditing ? html`<div class="pi-session-popover-rename-row">
							<input
								class="pi-session-popover-rename-input"
								type="text"
								.value="${() => props.editName}"
								placeholder="${t("sessionPopover.renamePlaceholder")}"
								@input="${(e) => props.onEditInput(e.target.value)}"
								@keydown="${(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onCommitRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      props.onCancelRename();
    }
  }}"
							/>
							<button
								class="pi-session-popover-action-btn pi-session-popover-confirm-btn"
								type="button"
								aria-label="${t("sessionPopover.save")}"
								@click="${(e) => {
    e.stopPropagation();
    props.onCommitRename();
  }}"
							>
								✓
							</button>
							<button
								class="pi-session-popover-action-btn pi-session-popover-cancel-btn"
								type="button"
								aria-label="${t("sessionPopover.cancel")}"
								@click="${(e) => {
    e.stopPropagation();
    props.onCancelRename();
  }}"
							>
								×
							</button>
						  </div>` : html`<div class="pi-session-popover-name-row">
								<span class="pi-session-popover-name">${props.session.name}</span>
								${() => props.isCurrent ? html`<span class="pi-session-popover-current-badge">${t(
    "sessionPopover.current"
  )}</span>` : false}
							  </div>`}
			<div class="pi-session-popover-meta">
				${() => formatSessionDate(props.session.mtime)}
				${() => props.session.messageCount > 0 ? ` \xB7 ${t("sessionPanel.msgCount", { count: props.session.messageCount })}` : ""}
				${() => props.session.cwd ? ` \xB7 ${props.session.cwd}` : ""}
			</div>
			${() => props.isDeleting ? html`<div class="pi-session-popover-delete-confirm">
								<span class="pi-session-popover-delete-confirm-text">${t(
    "sessionPopover.deleteConfirm"
  )}</span>
								<button
									class="pi-session-popover-action-btn pi-session-popover-delete-confirm-btn"
									type="button"
									aria-label="${t("sessionPopover.confirmDelete")}"
									@click="${(e) => {
    e.stopPropagation();
    props.onConfirmDelete();
  }}"
								>
									✓
								</button>
								<button
									class="pi-session-popover-action-btn pi-session-popover-cancel-btn"
									type="button"
									aria-label="${t("sessionPopover.cancel")}"
									@click="${(e) => {
    e.stopPropagation();
    props.onCancelDelete();
  }}"
								>
									×
								</button>
							  </div>` : html`<div class="pi-session-popover-preview">${props.session.preview}</div>`}
		</div>
		${() => !props.isEditing && !props.isDeleting ? html`<div class="pi-session-popover-actions">
						${() => props.onExport ? html`<button
										class="pi-session-popover-action-btn pi-session-popover-export-btn"
										type="button"
										aria-label="${t("sessionPanel.export.tooltip")}"
										data-tooltip-position="top"
										@click="${(e) => {
    e.stopPropagation();
    props.onExport?.();
  }}"
									>
										⤓
									</button>` : false}
						<button
							class="pi-session-popover-action-btn pi-session-popover-rename-btn"
							type="button"
							aria-label="${t("sessionPanel.rename.tooltip")}"
							data-tooltip-position="top"
							@click="${(e) => {
    e.stopPropagation();
    props.onStartRename();
  }}"
						>
							✎
						</button>
						<button
							class="pi-session-popover-action-btn pi-session-popover-delete-btn"
							type="button"
							aria-label="${t("sessionPanel.delete.tooltip")}"
							data-tooltip-position="top"
							@click="${(e) => {
    e.stopPropagation();
    props.onStartDelete();
  }}"
						>
							🗑
						</button>
					  </div>` : false}
	</div>`;
}
var SessionListPopover = class {
  containerEl;
  anchorEl;
  callbacks;
  scanner;
  unmount = null;
  state;
  docClickHandler;
  docKeyHandler;
  constructor(parentEl, anchorEl, callbacks, sessionsDir) {
    this.anchorEl = anchorEl;
    this.callbacks = callbacks;
    this.scanner = new SessionScanner(sessionsDir);
    this.containerEl = parentEl.createDiv({ cls: "pi-session-popover is-hidden" });
    this.containerEl.setAttribute("role", "dialog");
    this.containerEl.setAttribute("aria-label", t("sessionPopover.title"));
    this.containerEl.tabIndex = -1;
    this.state = reactive({
      open: false,
      sessions: [],
      loading: false,
      error: null,
      currentPath: null,
      selectedIndex: -1,
      editingPath: null,
      editingName: "",
      deleteConfirmPath: null
    });
    this.docClickHandler = (e) => {
      const target = e.target;
      if (!this.containerEl.contains(target) && !this.anchorEl.contains(target)) {
        this.close();
      }
    };
    this.docKeyHandler = (e) => {
      if (!this.state.open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        if (this.state.editingPath) {
          this.cancelRename();
        } else if (this.state.deleteConfirmPath) {
          this.cancelDelete();
        } else {
          this.close();
        }
        return;
      }
      if (this.state.editingPath || this.state.deleteConfirmPath) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.moveSelection(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.moveSelection(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        void this.selectSelected();
      }
    };
    const { template } = this.buildTemplate();
    const result = template(this.containerEl);
    this.unmount = typeof result === "function" ? result : null;
    this.containerEl.addEventListener("keydown", this.docKeyHandler);
  }
  /**
   * Open the popover and refresh the session list.
   */
  async open() {
    if (this.state.open) {
      this.containerEl.focus();
      return;
    }
    this.state.open = true;
    this.containerEl.removeClass("is-hidden");
    this.anchorEl.addClass("is-active");
    await this.refreshSessions();
    this.state.selectedIndex = this.state.sessions.length > 0 ? 0 : -1;
    this.containerEl.focus();
    this.containerEl.ownerDocument.addEventListener("mousedown", this.docClickHandler);
  }
  /**
   * Close the popover without changing the session.
   */
  close() {
    if (!this.state.open) return;
    this.state.open = false;
    this.state.editingPath = null;
    this.state.deleteConfirmPath = null;
    this.containerEl.addClass("is-hidden");
    this.anchorEl.removeClass("is-active");
    this.containerEl.ownerDocument.removeEventListener("mousedown", this.docClickHandler);
    this.anchorEl.focus();
  }
  /**
   * Toggle open/closed.
   */
  toggle() {
    if (this.state.open) {
      this.close();
    } else {
      void this.open();
    }
  }
  /**
   * Set the path of the current session so it can be highlighted.
   */
  setCurrentPath(path6) {
    this.state.currentPath = path6;
  }
  /**
   * Re-scan the session directory and update the list.
   */
  async refreshSessions() {
    if (!import_obsidian10.Platform.isDesktop) {
      this.state.sessions = [];
      return;
    }
    this.state.loading = true;
    this.state.error = null;
    try {
      this.state.sessions = await this.scanner.scan();
    } catch (err) {
      console.error("[SessionPopover] Failed to scan sessions:", err);
      this.state.error = t("sessionPopover.failedLoad");
      this.state.sessions = [];
    } finally {
      this.state.loading = false;
    }
  }
  /**
   * Tear down the popover and remove it from the DOM.
   */
  destroy() {
    this.close();
    this.containerEl.removeEventListener("keydown", this.docKeyHandler);
    if (this.unmount) {
      this.unmount();
      this.unmount = null;
    }
    this.containerEl.remove();
  }
  buildTemplate() {
    const state = this.state;
    const container = this.containerEl;
    const template = html`<div class="pi-session-popover-header">
				<span class="pi-session-popover-title">${t("sessionPopover.title")}</span>
				${() => state.loading ? html`<span class="pi-session-popover-spinner" aria-label="Loading">⟳</span>` : false}
			</div>
			<div class="pi-session-popover-list" role="listbox" aria-label="${t("sessionPopover.title")}">
				${() => state.error ? html`<div class="pi-session-popover-empty">${state.error}</div>` : state.sessions.length === 0 && !state.loading ? html`<div class="pi-session-popover-empty">${t("sessionPopover.empty")}</div>` : state.sessions.map((session, index2) => {
      const isCurrent = session.path === state.currentPath;
      const isSelected = index2 === state.selectedIndex;
      const isEditing = state.editingPath === session.path;
      const isDeleting = state.deleteConfirmPath === session.path;
      return SessionRow({
        session,
        isCurrent,
        isSelected,
        isEditing,
        isDeleting,
        editName: isEditing ? state.editingName : session.name,
        onSelect: () => {
          state.selectedIndex = index2;
          void this.selectSession(session);
        },
        onStartRename: () => {
          state.editingPath = session.path;
          state.editingName = session.name;
          state.selectedIndex = index2;
          void nextTick().then(() => {
            const input = container.querySelector(
              ".pi-session-popover-rename-input"
            );
            input?.focus();
            input?.select();
          });
        },
        onCommitRename: () => {
          void this.commitRename(session);
        },
        onCancelRename: () => {
          this.cancelRename();
        },
        onStartDelete: () => {
          state.deleteConfirmPath = session.path;
          state.selectedIndex = index2;
        },
        onConfirmDelete: () => {
          void this.confirmDelete(session);
        },
        onCancelDelete: () => {
          this.cancelDelete();
        },
        onExport: this.callbacks.onExport ? () => {
          void this.callbacks.onExport?.(session);
        } : void 0,
        onEditInput: (value) => {
          state.editingName = value;
        }
      }).key(session.path);
    })}
			</div>`;
    return { template };
  }
  moveSelection(delta) {
    const length = this.state.sessions.length;
    if (length === 0) return;
    let next = this.state.selectedIndex + delta;
    if (next < 0) next = length - 1;
    if (next >= length) next = 0;
    this.state.selectedIndex = next;
    this.scrollSelectedIntoView();
  }
  scrollSelectedIntoView() {
    const item = this.containerEl.querySelector(
      ".pi-session-popover-item.is-selected"
    );
    item?.scrollIntoView({ block: "nearest" });
  }
  async selectSelected() {
    const session = this.state.sessions[this.state.selectedIndex];
    if (!session) return;
    await this.selectSession(session);
  }
  async selectSession(session) {
    try {
      await this.callbacks.onSelect(session);
      this.close();
    } catch (err) {
      console.error("[SessionPopover] Failed to switch session:", err);
      new import_obsidian10.Notice(t("notices.switchFailed"));
    }
  }
  async commitRename(session) {
    const newName = this.state.editingName.trim();
    if (!newName || newName === session.name) {
      this.cancelRename();
      return;
    }
    try {
      await this.callbacks.onRename(session, newName);
      this.state.editingPath = null;
      this.state.editingName = "";
      await this.refreshSessions();
    } catch (err) {
      console.error("[SessionPopover] Rename failed:", err);
      new import_obsidian10.Notice(t("notices.renameFailed"));
    }
  }
  cancelRename() {
    this.state.editingPath = null;
    this.state.editingName = "";
  }
  async confirmDelete(session) {
    try {
      await this.callbacks.onDelete(session);
      this.state.deleteConfirmPath = null;
      new import_obsidian10.Notice(t("notices.deletedSession", { name: session.name }));
      await this.refreshSessions();
      if (this.state.selectedIndex >= this.state.sessions.length) {
        this.state.selectedIndex = Math.max(0, this.state.sessions.length - 1);
      }
    } catch (err) {
      console.error("[SessionPopover] Delete failed:", err);
      new import_obsidian10.Notice(t("notices.deleteFailed"));
    }
  }
  cancelDelete() {
    this.state.deleteConfirmPath = null;
  }
};

// src/chat/arrow/statusbar.ts
function ChatStatusBar(state) {
  function renderText2() {
    const parts = [];
    if (state.model) {
      let modelText = state.model;
      if (state.thinkingLevel && state.thinkingLevel !== "off") {
        modelText += ` :${state.thinkingLevel}`;
      }
      parts.push(modelText);
    }
    if (state.streaming) {
      parts.push(t("statusBar.streaming"));
    }
    if (state.tokens > 0) {
      const tokenStr = state.tokens > 1e3 ? `${(state.tokens / 1e3).toFixed(1)}k tokens` : `${state.tokens} tokens`;
      parts.push(tokenStr);
    }
    if (state.cost > 0) {
      parts.push(`$${state.cost.toFixed(2)}`);
    }
    if (state.statusText) {
      parts.push(state.statusText);
    }
    return parts.join(" \xB7 ");
  }
  return html`<div class="pi-chat-statusbar" aria-live="polite">
		${() => renderText2()}
	</div>`;
}
function mountChatStatusBar(container, state) {
  const unmount2 = ChatStatusBar(state)(container);
  return typeof unmount2 === "function" ? unmount2 : () => container.empty();
}

// src/chat/attachments.ts
var import_obsidian11 = require("obsidian");
var FileSuggestModal = class extends import_obsidian11.FuzzySuggestModal {
  files;
  onSelect;
  constructor(app, files, onSelect) {
    super(app);
    this.files = files;
    this.onSelect = onSelect;
    this.setPlaceholder("Attach a file...");
  }
  getItems() {
    return this.files;
  }
  getItemText(item) {
    return item.path;
  }
  onChooseItem(item, _evt) {
    this.onSelect(item);
  }
};
var AttachmentPicker = class _AttachmentPicker {
  app;
  /** Extensions considered safe to read as text */
  static TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
    "md",
    "txt",
    "json",
    "js",
    "ts",
    "jsx",
    "tsx",
    "py",
    "css",
    "html",
    "yaml",
    "yml",
    "xml",
    "csv",
    "toml",
    "ini",
    "cfg",
    "sh",
    "bash",
    "zsh",
    "java",
    "c",
    "cpp",
    "h",
    "hpp",
    "rs",
    "go",
    "rb",
    "php",
    "sql",
    "lua",
    "r",
    "swift",
    "kt",
    "scala",
    "ex",
    "exs",
    "hs",
    "ml",
    "clj",
    "env",
    "gitignore",
    "dockerfile",
    "svg",
    "log"
  ]);
  /** Max file size for attachments: 1MB */
  static MAX_FILE_SIZE = 1024 * 1024;
  constructor(app) {
    this.app = app;
  }
  /**
   * Open the file picker modal. On selection, reads the file and
   * returns an Attachment via the callback.
   * Only shows text files to avoid binary corruption.
   */
  trigger(onAttach) {
    const allFiles = this.app.vault.getFiles();
    const files = allFiles.filter(
      (f) => _AttachmentPicker.TEXT_EXTENSIONS.has(f.extension.toLowerCase())
    );
    const modal = new FileSuggestModal(this.app, files, (file) => {
      void this.handleFileSelection(file, onAttach);
    });
    modal.open();
  }
  async handleFileSelection(file, onAttach) {
    try {
      const stat = await this.app.vault.adapter.stat(file.path);
      if (stat && stat.size > _AttachmentPicker.MAX_FILE_SIZE) {
        const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
        new import_obsidian11.Notice(t("notices.fileTooLarge", { size: sizeMB }));
        return;
      }
      const content = await this.app.vault.cachedRead(file);
      const attachment = {
        type: "file",
        name: file.name,
        content,
        size: stat?.size
      };
      onAttach(attachment);
    } catch (err) {
      console.error("[Pi Attachments] Failed to read file:", err);
      new import_obsidian11.Notice(t("notices.fileReadFailed"));
    }
  }
};

// src/chat/commands.ts
var import_obsidian12 = require("obsidian");
var CommandSuggestModal = class extends import_obsidian12.FuzzySuggestModal {
  commands;
  onSelect;
  constructor(app, commands, onSelect) {
    super(app);
    this.commands = commands;
    this.onSelect = onSelect;
    this.setPlaceholder(t("modals.selectCommand"));
  }
  getItems() {
    return this.commands;
  }
  getItemText(item) {
    return `/${item.name}`;
  }
  onChooseItem(item, _evt) {
    this.onSelect(item);
  }
  renderSuggestion(item, el) {
    const wrapper = el.createDiv({ cls: "pi-command-suggest-item" });
    const header = wrapper.createDiv({ cls: "pi-command-header" });
    header.createSpan({ text: `/${item.item.name}`, cls: "pi-command-name" });
    if (item.item.source) {
      header.createSpan({ text: item.item.source, cls: "pi-command-source" });
    }
    if (item.item.description) {
      wrapper.createDiv({ text: item.item.description, cls: "pi-command-desc" });
    }
  }
};
var CommandSuggest = class {
  app;
  connection = null;
  cachedCommands = null;
  constructor(app) {
    this.app = app;
  }
  /**
   * Set the RPC connection used to fetch commands.
   */
  setConnection(connection) {
    this.connection = connection;
    this.cachedCommands = null;
  }
  /**
   * Trigger the command suggest modal. Fetches commands from Pi and shows the picker.
   * On selection, calls the callback with the full command string (e.g. "/plan ").
   */
  async trigger(onSelect) {
    const commands = await this.fetchCommands();
    if (commands.length === 0) {
      return;
    }
    const modal = new CommandSuggestModal(this.app, commands, (cmd) => {
      onSelect(`/${cmd.name} `);
    });
    modal.open();
  }
  /**
   * Public access to fetch commands — used by command palette registration.
   */
  async getCommands() {
    return this.fetchCommands();
  }
  /**
   * Fetch commands from Pi. Uses cached list if available.
   * Cache is invalidated on each trigger to stay fresh.
   */
  async fetchCommands() {
    if (!this.connection || !this.connection.isConnected()) {
      return [];
    }
    try {
      const response = await this.connection.send({ type: "get_commands" });
      const commands = response.data?.commands;
      if (Array.isArray(commands)) {
        this.cachedCommands = commands.map((cmd) => ({
          name: typeof cmd.name === "string" ? cmd.name : "",
          description: typeof cmd.description === "string" ? cmd.description : "",
          source: typeof cmd.source === "string" ? cmd.source : ""
        })).filter((cmd) => cmd.name.length > 0);
        return this.cachedCommands;
      }
    } catch (err) {
      console.warn("[Pi Commands] Failed to fetch commands:", err);
    }
    return this.cachedCommands ?? [];
  }
};

// src/chat/message-types.ts
function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// src/chat/notices.ts
var import_obsidian13 = require("obsidian");
function showCriticalNotice(message) {
  new import_obsidian13.Notice(message, 0);
}

// src/chat/renderer.ts
var import_obsidian14 = require("obsidian");
var MessageRenderer = class {
  app;
  /** Debounce render error notices - only show once every 5 seconds */
  lastRenderErrorTime = 0;
  constructor(app) {
    this.app = app;
  }
  /** Show render error notice if debounce allows */
  showRenderError() {
    const now = Date.now();
    if (now - this.lastRenderErrorTime > 5e3) {
      this.lastRenderErrorTime = now;
      new import_obsidian14.Notice(t("notices.renderError"));
    }
  }
  /**
   * Render an assistant message as Obsidian-flavored markdown.
   * Returns the wrapper element for use by streaming logic.
   */
  renderAssistantMessage(container, markdown, sourcePath, component2, thinkingContent, error, actions) {
    const wrapper = container.createDiv({ cls: "pi-message pi-message-assistant" });
    const label = wrapper.createDiv({ cls: "pi-message-label" });
    label.createSpan({ text: "Pi", cls: "pi-message-label-text" });
    const actionRow = label.createSpan({ cls: "pi-message-action-row" });
    mountMessageActions(actionRow, {
      content: markdown,
      tokens: actions?.tokens ?? 0,
      cost: actions?.cost ?? 0,
      model: actions?.model ?? "",
      onRewind: actions?.onRewind
    });
    if (error) {
      const errorEl = wrapper.createDiv({ cls: "pi-message-error" });
      errorEl.createEl("strong", { text: t("renderer.errorLabel") });
      errorEl.createSpan({ text: error });
    }
    if (thinkingContent) {
      const thinkingEl = wrapper.createEl("details", { cls: "pi-thinking" });
      thinkingEl.createEl("summary", { text: t("renderer.thinkingSummary") });
      const thinkingContentEl = thinkingEl.createDiv({ cls: "pi-thinking-content" });
      import_obsidian14.MarkdownRenderer.render(
        this.app,
        thinkingContent,
        thinkingContentEl,
        sourcePath,
        component2
      ).catch((err) => {
        console.error("[Pi Chat] Thinking render error:", err);
        thinkingContentEl.setText(thinkingContent);
        this.showRenderError();
      });
    }
    const contentEl = wrapper.createDiv({ cls: "pi-message-content" });
    if (markdown) {
      import_obsidian14.MarkdownRenderer.render(this.app, markdown, contentEl, sourcePath, component2).catch((err) => {
        console.error("[Pi Chat] Markdown rendering error:", err);
        contentEl.setText(markdown);
        this.showRenderError();
      });
    }
    return wrapper;
  }
  /**
   * Render a user message in a styled container.
   * Optional actions parameter allows adding rewind button.
   */
  renderUserMessage(container, text, isSteering, actions) {
    const cls = isSteering ? "pi-message pi-message-user pi-message-steer" : "pi-message pi-message-user";
    const wrapper = container.createDiv({ cls });
    const label = wrapper.createDiv({ cls: "pi-message-label" });
    label.createSpan({
      text: isSteering ? "You (steer)" : "You",
      cls: "pi-message-label-text"
    });
    if (actions?.onRewind) {
      const actionBar = label.createSpan({ cls: "pi-message-actions" });
      this.addActionButton(actionBar, {
        cls: "pi-message-rewind-btn",
        text: t("view.rewind"),
        title: actions.rewindTitle ?? t("renderer.rewindTooltip"),
        disabled: actions.rewindDisabled,
        onClick: actions.onRewind
      });
    }
    const contentEl = wrapper.createDiv({ cls: "pi-message-content" });
    contentEl.createEl("p", { text });
    return wrapper;
  }
  /**
   * Render a tool call/result in a collapsible <details> element.
   * Shows the tool name in the summary, with args and result inside.
   */
  renderToolCall(container, toolName, args, result, isError, component2) {
    const wrapper = container.createDiv({
      cls: `pi-message pi-message-tool${isError ? " pi-message-tool-error" : ""}`
    });
    const details = wrapper.createEl("details");
    const summary = details.createEl("summary");
    summary.createSpan({ text: `\u2699 ${toolName}`, cls: "pi-tool-name" });
    if (isError) {
      summary.createSpan({ text: " \u2717", cls: "pi-tool-error-indicator" });
    }
    const body = details.createDiv({ cls: "pi-tool-body" });
    if (args) {
      const argsSection = body.createDiv({ cls: "pi-tool-args" });
      argsSection.createEl("div", { text: t("renderer.arguments"), cls: "pi-tool-section-label" });
      const argsCode = argsSection.createEl("pre");
      argsCode.createEl("code", { text: args });
    }
    if (result) {
      const resultSection = body.createDiv({ cls: "pi-tool-result" });
      resultSection.createEl("div", { text: t("renderer.result"), cls: "pi-tool-section-label" });
      const resultContent = resultSection.createDiv({ cls: "pi-tool-result-content" });
      if (this.looksLikeMarkdown(result)) {
        import_obsidian14.MarkdownRenderer.render(this.app, result, resultContent, "", component2).catch((err) => {
          console.error("[Pi Chat] Tool result render error:", err);
          const pre = resultContent.createEl("pre");
          pre.createEl("code", { text: result });
          this.showRenderError();
        });
      } else {
        const pre = resultContent.createEl("pre");
        pre.createEl("code", { text: result });
      }
    }
    return wrapper;
  }
  addActionButton(actionBar, options) {
    const btn = actionBar.createEl("button", {
      cls: options.cls,
      attr: {
        "aria-label": options.title,
        title: options.title,
        type: "button"
      }
    });
    btn.setText(options.text);
    if (options.disabled) {
      btn.setAttribute("disabled", "true");
      btn.addClass("is-disabled");
    } else if (options.onClick) {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        options.onClick?.();
      });
    }
    return btn;
  }
  /**
   * Simple heuristic to detect if content contains markdown.
   * Falls back to code block rendering for plain text.
   */
  looksLikeMarkdown(text) {
    return /```|^#{1,6}\s|^\s*[-*]\s|\[.*\]\(|!\[|> |^\|.*\|/m.test(text);
  }
};

// src/chat/sessions.ts
var SessionManager = class {
  /**
   * Save a conversation as a markdown note in the vault.
   * Returns the vault-relative path of the saved file, or null if skipped.
   */
  async saveSession(messages, settings, vault) {
    if (!settings.persistSessions) return null;
    if (!messages.some((m) => m.role === "assistant")) {
      return null;
    }
    const markdown = this.formatConversation(messages, settings);
    const filePath = this.generateFilePath(settings);
    await this.ensureDirectory(settings.sessionSaveDir, vault);
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const targetPath = attempt === 0 ? filePath : `${filePath.replace(/\.md$/, "")}-${Math.random().toString(36).slice(2, 6)}.md`;
      try {
        await vault.create(targetPath, markdown);
        return targetPath;
      } catch (err) {
        if (err instanceof Error && err.message.includes("already exists")) {
          if (attempt >= maxAttempts - 1) {
            throw new Error(`Failed to save session after ${maxAttempts} attempts: file collision`);
          }
          continue;
        }
        throw err;
      }
    }
    return null;
  }
  /**
   * Load a saved session from a markdown note.
   * Parses callout blocks back into ChatMessage array.
   */
  async loadSession(path6, vault) {
    const content = await vault.adapter.read(path6);
    return this.parseConversation(content);
  }
  /**
   * Format messages as Obsidian-friendly markdown.
   */
  formatConversation(messages, settings) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const model = settings.defaultModel || "unknown";
    let md = "";
    md += "---\n";
    md += "pi-session: true\n";
    md += `model: ${model}
`;
    md += `created: ${now}
`;
    md += "---\n\n";
    for (const msg of messages) {
      switch (msg.role) {
        case "user":
          md += this.formatUserMessage(msg);
          break;
        case "assistant":
          md += this.formatAssistantMessage(msg);
          break;
        case "tool":
          md += this.formatToolMessage(msg);
          break;
      }
    }
    return md;
  }
  /**
   * Parse markdown content back into ChatMessage array.
   */
  parseConversation(content) {
    const body = this.stripFrontmatter(content);
    const lines = body.split("\n");
    const messages = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("> [!user]")) {
        i++;
        const contentLines = [];
        while (i < lines.length && lines[i].startsWith(">")) {
          const stripped = lines[i].startsWith("> ") ? lines[i].slice(2) : lines[i].slice(1);
          contentLines.push(this.unescapeCalloutMarker(stripped));
          i++;
        }
        if (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("> [!")) {
          console.warn(
            `[Session Parser] Malformed user callout at line ${i + 1}: expected > prefix or blank line`
          );
        }
        messages.push({
          id: generateMessageId(),
          role: "user",
          content: contentLines.join("\n"),
          timestamp: 0
        });
      } else if (line.startsWith("> [!tool]")) {
        const toolName = this.parseToolName(line);
        i++;
        const contentLines = [];
        while (i < lines.length && lines[i].startsWith(">")) {
          const stripped = lines[i].startsWith("> ") ? lines[i].slice(2) : lines[i].slice(1);
          contentLines.push(this.unescapeCalloutMarker(stripped));
          i++;
        }
        if (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("> [!")) {
          console.warn(
            `[Session Parser] Malformed tool callout at line ${i + 1}: expected > prefix or blank line`
          );
        }
        messages.push({
          id: generateMessageId(),
          role: "tool",
          content: contentLines.join("\n"),
          timestamp: 0,
          toolName
        });
      } else if (line.trim() === "") {
        i++;
      } else {
        const contentLines = [];
        while (i < lines.length && !lines[i].startsWith("> [!user]") && !lines[i].startsWith("> [!tool]")) {
          contentLines.push(lines[i]);
          i++;
        }
        while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === "") {
          contentLines.pop();
        }
        if (contentLines.length > 0) {
          messages.push({
            id: generateMessageId(),
            role: "assistant",
            content: contentLines.join("\n"),
            timestamp: 0
          });
        }
      }
    }
    return messages;
  }
  // --- Formatting helpers ---
  formatUserMessage(msg) {
    const lines = msg.content.split("\n");
    const calloutBody = lines.map((l) => `> ${this.escapeCalloutMarker(l)}`).join("\n");
    return `> [!user]
${calloutBody}

`;
  }
  formatAssistantMessage(msg) {
    return `${msg.content}

`;
  }
  formatToolMessage(msg) {
    const name = msg.toolName || "tool";
    const lines = msg.content.split("\n");
    const calloutBody = lines.map((l) => `> ${this.escapeCalloutMarker(l)}`).join("\n");
    return `> [!tool]- ${name}
${calloutBody}

`;
  }
  generateFilePath(settings) {
    const dir = this.normalizeDir(settings.sessionSaveDir);
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const filename = `${[
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
      pad(now.getHours()),
      pad(now.getMinutes())
    ].join("-")}.md`;
    return `${dir}/${filename}`;
  }
  async ensureDirectory(dir, vault) {
    const normalized = this.normalizeDir(dir);
    if (!await vault.adapter.exists(normalized)) {
      await vault.createFolder(normalized);
    }
  }
  /**
   * Normalize a vault-relative directory path: strip leading/trailing
   * slashes and fall back to a default if empty.
   */
  normalizeDir(dir) {
    return dir.replace(/^\/+|\/+$/g, "") || "Pi-Sessions";
  }
  stripFrontmatter(content) {
    if (!content.startsWith("---")) return content;
    const endIdx = content.indexOf("---", 3);
    if (endIdx < 0) return content;
    return content.slice(endIdx + 3).trim();
  }
  /**
   * Parse tool name from callout header line.
   * Handles: "> [!tool]- bash" and "> [!tool]- bash: `ls src/`"
   */
  parseToolName(line) {
    const match = line.match(/> \[!tool\]-?\s*(\S+)/);
    if (match) {
      return match[1].replace(/:$/, "");
    }
    return "tool";
  }
  /**
   * Escape lines that start with [! so they won't be parsed as callout
   * boundaries when the content is reloaded. Uses \[! which is visible
   * but unambiguous.
   */
  escapeCalloutMarker(line) {
    if (line.startsWith("[!")) {
      return `\\${line}`;
    }
    return line;
  }
  /**
   * Reverse the escaping applied by escapeCalloutMarker.
   */
  unescapeCalloutMarker(line) {
    if (line.startsWith("\\[!")) {
      return line.slice(1);
    }
    return line;
  }
};

// src/chat/stream-handler.ts
var StreamHandler = class {
  currentMessage = null;
  currentText = "";
  currentThinking = "";
  callbacks;
  // Track tool calls the model is generating (from message_update toolcall events)
  pendingToolCalls = /* @__PURE__ */ new Map();
  constructor(callbacks) {
    this.callbacks = callbacks;
  }
  /**
   * Process a single RPC event from PiConnection.
   * Call this for every event received via PiConnection.onEvent().
   */
  handleEvent(event) {
    const type = event.type;
    switch (type) {
      case "message_start":
        this.handleMessageStart(event);
        break;
      case "message_update":
        this.handleMessageUpdate(event);
        break;
      case "message_end":
        this.handleMessageEnd(event);
        break;
      case "tool_execution_start":
        this.handleToolExecutionStart(event);
        break;
      case "tool_execution_update":
        this.handleToolExecutionUpdate(event);
        break;
      case "tool_execution_end":
        this.handleToolExecutionEnd(event);
        break;
      case "agent_end":
        break;
      case "auto_compaction_end":
        if (this.callbacks.onCompaction) {
          this.callbacks.onCompaction();
        }
        break;
      case "error":
        if (this.callbacks.onError) {
          this.callbacks.onError(String(event.error || "Unknown error"));
        }
        break;
    }
  }
  /**
   * Get the current in-progress message, if any.
   */
  getCurrentMessage() {
    return this.currentMessage ? { ...this.currentMessage } : null;
  }
  /**
   * Check if we're currently streaming a message.
   */
  isStreaming() {
    return this.currentMessage !== null && (this.currentMessage.isStreaming ?? false);
  }
  /**
   * Reset streaming state. Call this when aborting or starting a new session.
   */
  reset() {
    this.currentMessage = null;
    this.currentText = "";
    this.currentThinking = "";
    this.pendingToolCalls.clear();
  }
  // --- Event handlers ---
  handleMessageStart(event) {
    const message = event.message;
    if (message && message.role !== "assistant") return;
    this.currentText = "";
    this.currentThinking = "";
    this.pendingToolCalls.clear();
    this.currentMessage = {
      id: generateMessageId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true
    };
    this.callbacks.onMessageUpdate(this.buildCurrentMessage());
  }
  handleMessageUpdate(event) {
    if (!this.currentMessage) return;
    const ame = event.assistantMessageEvent;
    if (!ame) {
      console.warn(
        "[StreamHandler] Invalid message_update event: missing assistantMessageEvent",
        event
      );
      return;
    }
    const deltaType = ame.type;
    if (!deltaType) {
      console.warn("[StreamHandler] Invalid assistantMessageEvent: missing type", ame);
      return;
    }
    switch (deltaType) {
      case "text_delta": {
        const delta = ame.delta;
        if (delta) {
          this.currentText += delta;
          this.callbacks.onMessageUpdate(this.buildCurrentMessage());
        }
        break;
      }
      case "thinking_delta": {
        const delta = ame.delta;
        if (delta) {
          this.currentThinking += delta;
          this.callbacks.onMessageUpdate(this.buildCurrentMessage());
        }
        break;
      }
      case "toolcall_start": {
        const contentIndex = typeof ame.contentIndex === "number" ? String(ame.contentIndex) : "";
        const partial = ame.partial;
        const toolName = partial?.name ?? "";
        this.pendingToolCalls.set(contentIndex, { name: toolName, arguments: "" });
        break;
      }
      case "toolcall_delta": {
        const contentIndex = typeof ame.contentIndex === "number" ? String(ame.contentIndex) : "";
        const delta = ame.delta;
        const pending = this.pendingToolCalls.get(contentIndex);
        if (pending && delta) {
          pending.arguments += delta;
        }
        break;
      }
      case "toolcall_end": {
        const contentIndex = typeof ame.contentIndex === "number" ? String(ame.contentIndex) : "";
        const toolCall = ame.toolCall;
        if (toolCall) {
          const name = toolCall.name ?? "";
          this.pendingToolCalls.set(contentIndex, {
            name,
            arguments: JSON.stringify(toolCall.arguments ?? {})
          });
        }
        break;
      }
      case "done": {
        break;
      }
      case "error": {
        const reason = ame.reason;
        if (this.currentMessage) {
          this.currentMessage.isError = true;
          if (reason === "aborted") {
            this.currentText += "\n\n*[Aborted]*";
          } else {
            this.currentText += "\n\n*[Error]*";
          }
          this.currentMessage.isStreaming = false;
          this.currentMessage.content = this.currentText;
          this.currentMessage.thinkingContent = this.currentThinking || void 0;
          this.callbacks.onMessageComplete(this.buildCurrentMessage());
          this.currentMessage = null;
        }
        break;
      }
      case "start":
      case "text_start":
      case "text_end":
      case "thinking_start":
      case "thinking_end":
        break;
      default:
        console.warn("[StreamHandler] Unknown assistantMessageEvent type:", deltaType, ame);
    }
  }
  handleMessageEnd(event) {
    if (!this.currentMessage) return;
    this.currentMessage.isStreaming = false;
    if (!this.currentText) {
      const message2 = event.message;
      if (message2) {
        this.currentText = this.extractTextFromMessage(message2);
      }
    }
    this.currentMessage.content = this.currentText;
    const message = event.message;
    if (message?.errorMessage) {
      const errMsg = typeof message.errorMessage === "string" ? message.errorMessage : JSON.stringify(message.errorMessage);
      this.currentMessage.error = errMsg;
      if (this.callbacks.onError) {
        this.callbacks.onError(errMsg);
      }
    }
    let thinking = this.currentThinking;
    if (!thinking) {
      const message2 = event.message;
      if (message2) {
        thinking = this.extractThinkingFromMessage(message2);
      }
    }
    this.currentMessage.thinkingContent = thinking || void 0;
    this.callbacks.onMessageComplete(this.buildCurrentMessage());
    this.currentMessage = null;
  }
  handleToolExecutionStart(event) {
    const toolCallId = event.toolCallId;
    const toolName = event.toolName;
    if (!toolCallId || !toolName) {
      console.warn(
        "[StreamHandler] Invalid tool_execution_start: missing toolCallId or toolName",
        event
      );
      return;
    }
    const args = event.args ?? {};
    if (this.callbacks.onToolExecutionStart) {
      this.callbacks.onToolExecutionStart(toolCallId, toolName, args);
    }
  }
  handleToolExecutionUpdate(event) {
    const toolCallId = event.toolCallId;
    const toolName = event.toolName;
    if (!toolCallId || !toolName) {
      console.warn(
        "[StreamHandler] Invalid tool_execution_update: missing toolCallId or toolName",
        event
      );
      return;
    }
    const partialResult = event.partialResult;
    const resultText = this.extractResultText(partialResult);
    if (this.callbacks.onToolExecutionUpdate) {
      this.callbacks.onToolExecutionUpdate(toolCallId, toolName, resultText);
    }
  }
  handleToolExecutionEnd(event) {
    const toolCallId = event.toolCallId;
    const toolName = event.toolName;
    if (!toolCallId || !toolName) {
      console.warn(
        "[StreamHandler] Invalid tool_execution_end: missing toolCallId or toolName",
        event
      );
      return;
    }
    const isError = event.isError ?? false;
    const result = event.result;
    const resultText = this.extractResultText(result);
    const toolMessage = {
      id: generateMessageId(),
      role: "tool",
      content: resultText,
      timestamp: Date.now(),
      toolName,
      toolCallId,
      isError: isError || void 0
    };
    this.callbacks.onToolResult(toolMessage);
  }
  // --- Helpers ---
  /**
   * Build a snapshot of the current message with accumulated text.
   * Returns a copy so the view can safely store it.
   */
  buildCurrentMessage() {
    const base = this.currentMessage ?? {
      id: "",
      role: "assistant",
      content: "",
      timestamp: Date.now()
    };
    return {
      ...base,
      content: this.currentText,
      thinkingContent: this.currentThinking || void 0
    };
  }
  /**
   * Extract thinking content from a complete AssistantMessage.
   * The message's content array may include {type: "thinking", thinking: "..."} blocks
   * that weren't delivered via streaming thinking_delta events.
   */
  extractThinkingFromMessage(message) {
    const content = message.content;
    if (!Array.isArray(content)) return "";
    return content.filter((block) => block.type === "thinking").map((block) => block.thinking).filter(Boolean).join("\n\n");
  }
  /**
   * Extract text content from a complete AssistantMessage.
   * The message's content array includes {type: "text", text: "..."} blocks.
   */
  extractTextFromMessage(message) {
    const content = message.content;
    if (!Array.isArray(content)) return "";
    return content.filter((block) => block.type === "text").map((block) => block.text).filter(Boolean).join("\n\n");
  }
  /**
   * Extract text from a result/partialResult object.
   * Result content is an array of {type: "text", text: "..."} blocks.
   */
  extractResultText(result) {
    if (!result) return "";
    const content = result.content;
    if (!Array.isArray(content)) return "";
    return content.filter((block) => block.type === "text").map((block) => block.text).join("");
  }
};

// src/chat/view.ts
var VIEW_TYPE_PI_CHAT = "pi-chat-view";
var PiChatView = class extends import_obsidian15.ItemView {
  plugin;
  renderer;
  streamHandler;
  sessionManager;
  headerBar = null;
  headerSessionName = null;
  headerCwd = null;
  isEditingName = false;
  sessionPopover = null;
  sessionsButton = null;
  headerRightEl = null;
  messagesContainer;
  inputContainer;
  chatInput = null;
  commandSuggest;
  attachmentPicker;
  statusBarContainer;
  statusBarUnmounted = null;
  chatState;
  projectPath;
  readOnlyBanner = null;
  messages = [];
  readOnly = false;
  streaming = false;
  /** Current Pi session file path (for message store keying) */
  currentSessionPath = null;
  /** Return checkpoint for navigating back to original session after rewind */
  returnCheckpoint = null;
  /** Banner element showing "Return to latest" */
  returnBannerEl = null;
  /** Flag to prevent concurrent rewind operations */
  rewindBusy = false;
  /** Chat body element (for inserting return banner above it) */
  chatBodyEl = null;
  /** Currently streaming assistant message element, used for live re-rendering */
  streamingMessageEl = null;
  /** Action row handle for the streaming message, updated as stats arrive. */
  streamingMessageActions = null;
  /** "Thinking" indicator shown while waiting for Pi's first response */
  thinkingIndicatorEl = null;
  /** Component for the final markdown render after streaming completes */
  streamingComponent = null;
  /** Debounce timer for live markdown re-rendering during streaming */
  streamRenderTimer = null;
  /** Latest streamed content waiting to be rendered */
  pendingStreamContent = null;
  rpcEventHandler = null;
  activeExtensionUiOwner = null;
  pendingRewindUiRequestIds = /* @__PURE__ */ new Set();
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.renderer = new MessageRenderer(this.app);
    this.sessionManager = new SessionManager();
    this.commandSuggest = new CommandSuggest(this.app);
    this.attachmentPicker = new AttachmentPicker(this.app);
    this.chatState = createChatReactiveState();
    this.streamHandler = new StreamHandler({
      onMessageUpdate: (msg) => this.handleStreamUpdate(msg),
      onMessageComplete: (msg) => this.handleStreamComplete(msg),
      onToolResult: (msg) => this.addMessage(msg),
      onCompaction: () => new import_obsidian15.Notice(t("notices.compacted")),
      onError: (err) => showCriticalNotice(t("notices.piError", { msg: err }))
    });
  }
  getViewType() {
    return VIEW_TYPE_PI_CHAT;
  }
  getDisplayText() {
    return t("view.title");
  }
  getIcon() {
    return "message-circle";
  }
  async onOpen(target) {
    const container = target ?? this.contentEl;
    container.empty();
    container.addClass("pi-chat-container");
    try {
      const path6 = await import("node:path");
      this.projectPath = path6.dirname(this.plugin.piConfigDir);
    } catch {
      this.projectPath = void 0;
    }
    this.headerBar = container.createDiv({ cls: "pi-header-bar" });
    this.buildHeaderBar(this.headerBar);
    const chatBody = container.createDiv({ cls: "pi-chat-body" });
    this.chatBodyEl = chatBody;
    if (this.headerRightEl && this.sessionsButton) {
      this.sessionPopover = new SessionListPopover(
        this.headerRightEl,
        this.sessionsButton,
        {
          onSelect: (session) => this.switchToSession(session),
          onDelete: (session) => this.deleteSession(session),
          onRename: (session, newName) => this.renameSession(session, newName),
          onExport: (session) => this.exportSession(session)
        },
        `${this.plugin.piConfigDir}/sessions`
      );
    }
    this.messagesContainer = chatBody.createDiv({ cls: "pi-messages" });
    this.inputContainer = container.createDiv({ cls: "pi-input-container" });
    this.chatInput = new ArrowChatInput(this.inputContainer, {
      state: this.chatState,
      connection: this.plugin.connection,
      projectPath: this.projectPath,
      onSend: (text, attachments) => {
        void this.sendMessage(text, attachments);
      },
      onSlashTyped: () => {
        void this.triggerCommandSuggest();
      },
      onAtTyped: () => {
        void this.triggerFilePicker();
      },
      onAbort: () => this.abortStream()
    });
    this.statusBarContainer = container.createDiv({
      cls: "pi-chat-statusbar-container"
    });
    this.statusBarUnmounted = mountChatStatusBar(this.statusBarContainer, this.chatState);
    this.chatInput.focus();
    this.messagesContainer.addEventListener("scroll", () => {
      const el = this.messagesContainer;
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      this.userScrolledUp = distFromBottom > 100;
    });
    void this.connectToRpc();
  }
  async onClose() {
    if (!this.readOnly) {
      try {
        await this.autoSave();
      } catch (err) {
        console.error("[Pi Chat] Failed to auto-save on close:", err);
      }
    }
    this.streamHandler.reset();
    this.removeThinkingIndicator();
    if (this.streamRenderTimer) {
      window.clearTimeout(this.streamRenderTimer);
      this.streamRenderTimer = null;
    }
    this.pendingStreamContent = null;
    if (this.streamingComponent) {
      this.streamingComponent.unload();
      this.streamingComponent = null;
    }
    if (this.chatInput) {
      this.chatInput.destroy();
      this.chatInput = null;
    }
    if (this.statusBarUnmounted) {
      this.statusBarUnmounted();
      this.statusBarUnmounted = null;
    }
    this.readOnlyBanner = null;
    this.returnBannerEl = null;
    this.headerBar = null;
    this.headerSessionName = null;
    this.headerCwd = null;
    this.sessionsButton = null;
    this.headerRightEl = null;
    if (this.sessionPopover) {
      this.sessionPopover.destroy();
      this.sessionPopover = null;
    }
    this.chatBodyEl = null;
    const conn = this.plugin.connection;
    if (conn && this.rpcEventHandler) {
      conn.offEvent(this.rpcEventHandler);
    }
    this.rpcEventHandler = null;
    this.activeExtensionUiOwner = null;
    this.pendingRewindUiRequestIds.clear();
    this.messages = [];
    this.readOnly = false;
    this.streamingMessageEl = null;
    this.streamingMessageActions?.unmount();
    this.streamingMessageActions = null;
    this.contentEl.empty();
  }
  /**
   * Add a message to the chat and render it.
   */
  addMessage(msg) {
    this.messages.push(msg);
    this.renderMessage(msg);
    this.scrollToBottom();
    this.persistMessage(msg);
  }
  /**
   * Get all messages in the conversation.
   */
  getMessages() {
    return [...this.messages];
  }
  /**
   * Get the messages container element (used by streaming logic to append live content).
   */
  getMessagesContainer() {
    return this.messagesContainer;
  }
  /** Whether the user has manually scrolled away from the bottom */
  userScrolledUp = false;
  /**
   * Scroll the messages container to the bottom unless the user has scrolled up.
   */
  scrollToBottom() {
    if (this.userScrolledUp) return;
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  /**
   * Wire this view to a PiConnection's event stream.
   *
   * Synchronous: just installs handlers and schedules a deferred refresh.
   * Kept as a regular method (not async) so the function shape doesn't lie
   * about doing async work and satisfies @typescript-eslint/require-await.
   */
  connectToRpc() {
    const conn = this.plugin.ensureConnection();
    if (this.rpcEventHandler) {
      conn.offEvent(this.rpcEventHandler);
    }
    this.rpcEventHandler = (event) => {
      if (event.type === "extension_ui_request") {
        this.handleExtensionUiRequest(event);
        return;
      }
      this.streamHandler.handleEvent(event);
      if (event.type === "agent_end") {
        void this.refreshHeader();
        void this.syncChatStats();
        window.setTimeout(() => {
          void this.syncForkStateAfterAgentEnd();
        }, 0);
      }
    };
    conn.onEvent(this.rpcEventHandler);
    this.commandSuggest.setConnection(conn);
    window.setTimeout(() => {
      void this.refreshHeader();
      void this.restoreSession();
    }, 1e3);
  }
  /**
   * Restore the current session's messages on startup.
   * Tries the local store first (fast), falls back to get_messages RPC.
   */
  async restoreSession() {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) return;
    try {
      const response = await conn.send({ type: "get_state" });
      const data = response.data;
      const sessionFile = data?.sessionFile;
      if (sessionFile) {
        this.currentSessionPath = sessionFile;
        this.plugin.messageStore.setLastSession(sessionFile);
        this.plugin.scheduleStoreFlush();
        this.sessionPopover?.setCurrentPath(sessionFile);
        if (this.messages.length === 0) {
          const stored = this.plugin.messageStore.getMessages(sessionFile);
          if (stored.length > 0) {
            this.displayMessages(stored, false);
            await this.syncForkEntryIds();
          } else {
            await this.loadMessagesFromPi();
            await this.syncForkEntryIds();
          }
        }
      }
    } catch {
    }
  }
  async syncForkStateAfterAgentEnd() {
    try {
      await this.updateCurrentSessionFromPi();
      await this.syncForkEntryIds();
    } catch (err) {
      console.warn("[Pi Chat] Failed to sync fork ids after agent_end:", err);
    }
  }
  /**
   * Build the header bar contents: session name, model badge, cwd, new session button.
   */
  buildHeaderBar(container) {
    const left = container.createDiv({ cls: "pi-header-left" });
    this.headerSessionName = left.createSpan({
      cls: "pi-header-session-name",
      text: t("view.newSession")
    });
    this.headerSessionName.setAttribute("title", t("view.sessionName.tooltip"));
    this.headerSessionName.addEventListener("click", () => this.startEditingSessionName());
    this.headerCwd = left.createSpan({
      cls: "pi-header-cwd",
      text: ""
    });
    const right = container.createDiv({ cls: "pi-header-right" });
    this.headerRightEl = right;
    const sessionsBtn = right.createEl("button", {
      cls: "pi-header-sessions-btn",
      attr: { "aria-label": t("view.sessionsBtn.tooltip") }
    });
    sessionsBtn.setText("\u{1F4CB}");
    sessionsBtn.addEventListener("click", () => this.sessionPopover?.toggle());
    this.sessionsButton = sessionsBtn;
    const newBtn = right.createEl("button", {
      cls: "pi-header-new-btn",
      attr: { "aria-label": t("view.newBtn.tooltip") }
    });
    newBtn.setText("+ new");
    newBtn.addEventListener("click", () => {
      void this.newSessionFromHeader();
    });
  }
  /**
   * Refresh the header bar with current session state from Pi.
   */
  async refreshHeader() {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) return;
    try {
      const response = await conn.send({ type: "get_state" });
      const data = response.data;
      if (!data) return;
      const sessionName = data.sessionName;
      const sessionFile = data.sessionFile;
      if (this.headerSessionName && !this.isEditingName) {
        const displayName = sessionName || (sessionFile ? sessionFile.replace(/^.*\//, "").replace(/\.jsonl$/, "") : null) || "New Session";
        this.headerSessionName.setText(displayName);
      }
      this.chatState.sessionName = sessionName || "";
      const model = data.model;
      const modelName = model?.name;
      const thinkingLevel = data.thinkingLevel;
      this.chatState.model = modelName || "";
      this.chatState.thinkingLevel = thinkingLevel || "off";
      const cwd = data.cwd;
      if (this.headerCwd) {
        const shortCwd = cwd ? cwd.replace(/^.*\//, "") : "";
        this.headerCwd.setText(shortCwd ? `\u{1F4C1} ${shortCwd}` : "");
        this.headerCwd.classList.toggle("is-hidden", !shortCwd);
        if (cwd) this.headerCwd.setAttribute("title", cwd);
      }
    } catch {
    }
  }
  /**
   * Pull token/cost stats from Pi and feed them into the reactive chat state.
   */
  async syncChatStats() {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) return;
    try {
      const response = await conn.send({ type: "get_session_stats" });
      const data = response.data;
      if (!data) return;
      const tokens = data.tokens;
      this.chatState.tokens = tokens?.total ?? 0;
      this.chatState.cost = data.cost ?? 0;
    } catch {
    }
  }
  /**
   * Start inline editing of the session name.
   */
  startEditingSessionName() {
    if (this.isEditingName || !this.headerSessionName) return;
    this.isEditingName = true;
    const currentName = this.headerSessionName.getText();
    this.headerSessionName.empty();
    const input = this.headerSessionName.createEl("input", {
      cls: "pi-header-name-input",
      attr: { type: "text", value: currentName, "aria-label": t("view.sessionName.tooltip") }
    });
    input.focus();
    input.select();
    const commit = () => {
      void this.commitSessionNameEdit(input, currentName);
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        input.blur();
      } else if (e.key === "Escape") {
        this.isEditingName = false;
        if (this.headerSessionName) {
          this.headerSessionName.empty();
          this.headerSessionName.setText(currentName);
        }
      }
    });
  }
  /**
   * Load messages from Pi's session via get_messages RPC and display them.
   */
  async commitSessionNameEdit(input, currentName) {
    const newName = input.value.trim();
    this.isEditingName = false;
    if (this.headerSessionName) {
      this.headerSessionName.empty();
      this.headerSessionName.setText(newName || currentName);
    }
    if (!newName || newName === currentName) {
      return;
    }
    try {
      const conn = this.plugin.ensureConnection();
      await conn.send({ type: "set_session_name", name: newName });
    } catch (err) {
      console.warn("[Pi Chat] Failed to rename session:", err);
      new import_obsidian15.Notice(t("notices.renameFailed"));
      if (this.headerSessionName) {
        this.headerSessionName.setText(currentName);
      }
    }
  }
  async loadMessagesFromPi() {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) return;
    try {
      const response = await conn.send({ type: "get_messages" });
      const data = response.data;
      const rawMessages = data?.messages;
      if (!Array.isArray(rawMessages) || rawMessages.length === 0) return;
      const chatMessages = [];
      for (const raw of rawMessages) {
        const msg = this.convertAgentMessage(raw);
        if (msg) chatMessages.push(msg);
      }
      if (chatMessages.length > 0) {
        for (const msg of chatMessages) {
          this.messages.push(msg);
          this.renderMessage(msg);
        }
        this.scrollToBottom();
        if (this.currentSessionPath) {
          this.plugin.messageStore.setMessages(this.currentSessionPath, this.messages);
          this.plugin.scheduleStoreFlush();
        }
      }
    } catch (err) {
      console.warn("[Pi Chat] get_messages failed:", err);
    }
  }
  /**
   * Convert a Pi AgentMessage to our ChatMessage format.
   * AgentMessages have: { role: "user"|"assistant"|"toolResult", content, ... }
   */
  convertAgentMessage(raw) {
    const role = raw.role;
    const timestamp = raw.timestamp || Date.now();
    if (role === "user") {
      const text = this.extractMessageText(raw.content);
      if (!text) return null;
      return {
        id: generateMessageId(),
        role: "user",
        content: text,
        timestamp
      };
    }
    if (role === "assistant") {
      const content = raw.content;
      if (!Array.isArray(content)) return null;
      const text = content.filter((b) => b.type === "text" && b.text).map((b) => b.text).join("\n");
      const thinking = content.filter((b) => b.type === "thinking" && b.thinking).map((b) => b.thinking).join("\n\n");
      if (!text && !thinking) return null;
      return {
        id: generateMessageId(),
        role: "assistant",
        content: text,
        timestamp,
        thinkingContent: thinking || void 0
      };
    }
    if (role === "toolResult") {
      const text = this.extractMessageText(raw.content);
      return {
        id: generateMessageId(),
        role: "tool",
        content: text,
        timestamp,
        toolName: raw.toolName || "tool",
        toolCallId: raw.toolCallId || void 0,
        isError: raw.isError || void 0
      };
    }
    return null;
  }
  /**
   * Public API for starting a new session (used by command palette).
   */
  startNewSession() {
    void this.newSessionFromHeader();
  }
  /**
   * Create a new session from the header button.
   */
  async newSessionFromHeader() {
    if (this.currentSessionPath && this.messages.length > 0) {
      this.plugin.messageStore.setMessages(this.currentSessionPath, this.messages);
    }
    if (this.hasMessages()) {
      try {
        await this.autoSave();
      } catch (err) {
        console.error("[Pi Chat] Auto-save before new session failed:", err);
      }
    }
    this.streamHandler.reset();
    this.setStreamingState(false);
    this.removeThinkingIndicator();
    this.clearMessages();
    this.currentSessionPath = null;
    const conn = this.plugin.connection;
    if (conn?.isConnected()) {
      try {
        const response = await conn.send({ type: "new_session" });
        const data = response.data;
        if (data?.cancelled) {
          new import_obsidian15.Notice(t("notices.newSessionCancelled"));
          return;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[Pi Chat] new_session RPC failed:", err);
        showCriticalNotice(t("notices.newSessionFailed", { msg }));
        return;
      }
    }
    try {
      const conn2 = this.plugin.connection;
      if (conn2?.isConnected()) {
        const state = await conn2.send({ type: "get_state" });
        const data = state.data;
        const sessionFile = data?.sessionFile;
        if (sessionFile) {
          this.currentSessionPath = sessionFile;
          this.plugin.messageStore.setLastSession(sessionFile);
          this.plugin.scheduleStoreFlush();
        }
      }
    } catch {
    }
    if (this.headerSessionName) this.headerSessionName.setText(t("view.newSession"));
    this.sessionPopover?.setCurrentPath(this.currentSessionPath);
    void this.plugin.statusBar?.refreshModel();
    void this.refreshHeader();
    new import_obsidian15.Notice(t("notices.newSession"));
  }
  /**
   * Switch to a Pi session by path.
   */
  async switchToSession(session) {
    if (this.currentSessionPath && this.messages.length > 0) {
      this.plugin.messageStore.setMessages(this.currentSessionPath, this.messages);
    }
    if (this.hasMessages()) {
      try {
        await this.autoSave();
      } catch (err) {
        console.error("[Pi Chat] Auto-save before switch failed:", err);
      }
    }
    this.streamHandler.reset();
    this.setStreamingState(false);
    this.clearMessages();
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) {
      new import_obsidian15.Notice(t("notices.notConnected"));
      return;
    }
    try {
      const response = await conn.send({ type: "switch_session", sessionPath: session.path });
      const data = response.data;
      if (data?.cancelled) {
        new import_obsidian15.Notice(t("notices.switchCancelled"));
        return;
      }
    } catch (err) {
      console.warn("[Pi Chat] switch_session RPC failed:", err);
      showCriticalNotice(t("notices.switchFailed"));
      return;
    }
    this.currentSessionPath = session.path;
    this.plugin.messageStore.setLastSession(session.path);
    this.plugin.scheduleStoreFlush();
    await this.loadMessagesFromPi();
    if (this.headerSessionName) {
      this.headerSessionName.setText(session.name);
    }
    this.sessionPopover?.setCurrentPath(session.path);
    void this.plugin.statusBar?.refreshModel();
    void this.plugin.statusBar?.refreshStats();
    void this.syncChatStats();
    new import_obsidian15.Notice(t("notices.switchedTo", { name: session.name }));
    void this.refreshHeader();
  }
  /**
   * Delete a Pi session file.
   */
  async deleteSession(session) {
    const { unlink } = await import("node:fs/promises");
    await unlink(session.path);
  }
  /**
   * Rename a Pi session by updating its session_name entry in the .jsonl file.
   */
  async renameSession(session, newName) {
    if (!newName || newName === session.name) return;
    try {
      const { readFile, writeFile } = await import("node:fs/promises");
      const content = await readFile(session.path, "utf-8");
      const lines = content.split("\n");
      let replaced = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        try {
          const entry = JSON.parse(line);
          if (entry.type === "session_name") {
            lines[i] = JSON.stringify({ type: "session_name", name: newName });
            replaced = true;
            break;
          }
        } catch {
        }
      }
      if (!replaced) {
        lines.splice(1, 0, JSON.stringify({ type: "session_name", name: newName }));
      }
      await writeFile(session.path, lines.join("\n"), "utf-8");
      new import_obsidian15.Notice(t("notices.renamedSession", { name: newName }));
      if (session.path === this.currentSessionPath && this.headerSessionName) {
        this.headerSessionName.setText(newName);
      }
    } catch (err) {
      console.error("[Pi Chat] Rename session failed:", err);
      new import_obsidian15.Notice(t("notices.renameFailed"));
      throw err;
    }
  }
  /**
   * Export a Pi session to the vault as a markdown note.
   * Reads Pi's .jsonl format (typed entries with { type: "message", message: {...} } wrappers).
   */
  async exportSession(session) {
    try {
      const { readFile } = await import("node:fs/promises");
      const content = await readFile(session.path, "utf-8");
      const lines = content.split("\n").filter((l) => l.trim());
      const messages = [];
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (entry.type !== "message" || !entry.message) continue;
          const msg = entry.message;
          const text = this.extractMessageText(msg.content);
          if (msg.role === "user" && text) {
            messages.push({
              id: generateMessageId(),
              role: "user",
              content: text,
              timestamp: msg.timestamp || Date.now()
            });
          } else if (msg.role === "assistant" && text) {
            messages.push({
              id: generateMessageId(),
              role: "assistant",
              content: text,
              timestamp: msg.timestamp || Date.now()
            });
          } else if (msg.role === "toolResult") {
            const resultText = this.extractMessageText(msg.content);
            if (resultText) {
              messages.push({
                id: generateMessageId(),
                role: "tool",
                content: resultText,
                toolName: msg.toolName || "tool",
                toolCallId: msg.toolCallId,
                isError: msg.isError,
                timestamp: msg.timestamp || Date.now()
              });
            }
          }
        } catch {
        }
      }
      if (messages.length === 0) {
        new import_obsidian15.Notice(t("notices.noExportMessages"));
        return;
      }
      const path6 = await this.sessionManager.saveSession(
        messages,
        this.plugin.settings,
        this.app.vault
      );
      if (path6) {
        new import_obsidian15.Notice(t("notices.exportedTo", { path: path6 }));
      } else {
        new import_obsidian15.Notice(t("notices.exportFailed"));
      }
    } catch (err) {
      console.error("[Pi Chat] Export failed:", err);
      new import_obsidian15.Notice(t("notices.exportFailedGeneral"));
    }
  }
  /**
   * Extract plain text from a Pi message content field.
   * Content can be a string or an array of content blocks.
   */
  extractMessageText(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content.filter((b) => b.type === "text" && b.text).map((b) => b.text).join("\n");
    }
    return "";
  }
  // --- Rewind/Return RPC Helpers ---
  /**
   * Get current Pi session state via get_state RPC.
   */
  async getPiState() {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) return null;
    try {
      const response = await conn.send({ type: "get_state" });
      return response.data ?? null;
    } catch {
      return null;
    }
  }
  /**
   * Update currentSessionPath from Pi and sync to store/popover.
   */
  async updateCurrentSessionFromPi() {
    const state = await this.getPiState();
    if (!state?.sessionFile) return;
    this.currentSessionPath = state.sessionFile;
    this.plugin.messageStore.setLastSession(state.sessionFile);
    this.plugin.scheduleStoreFlush();
    this.sessionPopover?.setCurrentPath(state.sessionFile);
    await this.refreshHeader();
  }
  /**
   * Fetch forkable user messages from Pi via get_fork_messages RPC.
   */
  async fetchForkMessages() {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) {
      return [];
    }
    try {
      const response = await conn.send({ type: "get_fork_messages" });
      const data = response.data;
      return Array.isArray(data?.messages) ? data.messages : [];
    } catch (err) {
      console.warn("[Pi Chat] fetchForkMessages error:", err);
      return [];
    }
  }
  /**
   * Normalize prompt text for comparison (strip whitespace and attachment markers).
   */
  normalizePromptText(text) {
    return text.replace(/\s+/g, " ").replace(/\bAttached:.*$/i, "").replace(/\b\d+ image\(s\) attached\b/i, "").trim();
  }
  /**
   * Sync fork entryIds from Pi to UI messages.
   * Called after agent_end, restore, switch, reload to bind rewind capability.
   */
  async syncForkEntryIds() {
    if (this.readOnly) {
      return;
    }
    const forkMessages = await this.fetchForkMessages();
    const userMessages = this.messages.filter((msg) => msg.role === "user" && !msg.isSteering);
    if (forkMessages.length !== userMessages.length) {
      console.warn("[Pi Chat] Fork message count mismatch", {
        userMessageCount: userMessages.length,
        forkMessageCount: forkMessages.length
      });
    }
    for (let i = 0; i < userMessages.length; i++) {
      const uiMsg = userMessages[i];
      const forkMsg = forkMessages[i];
      if (!forkMsg) {
        uiMsg.piEntryId = void 0;
        uiMsg.canRewind = false;
        uiMsg.piForkText = void 0;
        continue;
      }
      uiMsg.piEntryId = forkMsg.entryId;
      uiMsg.canRewind = true;
      uiMsg.piForkText = forkMsg.text;
      const uiText = this.normalizePromptText(uiMsg.content);
      const piText = this.normalizePromptText(forkMsg.text);
      if (uiText && piText && uiText !== piText && !uiText.startsWith(piText) && !piText.startsWith(uiText)) {
        console.debug("[Pi Chat] Fork text mismatch; using order mapping", {
          index: i,
          uiText,
          piText
        });
      }
    }
    if (this.currentSessionPath) {
      this.plugin.messageStore.setMessages(this.currentSessionPath, this.messages);
      this.plugin.scheduleStoreFlush();
    }
    this.rerenderMessages();
  }
  /**
   * Re-render all messages (used after syncForkEntryIds changes canRewind flags).
   */
  rerenderMessages() {
    this.messagesContainer.empty();
    for (const msg of this.messages) {
      this.renderMessage(msg);
    }
    this.renderReturnBanner();
    this.scrollToBottom();
  }
  updateRewindButtonState() {
    const disabled = this.streaming || this.rewindBusy;
    const buttons = this.messagesContainer.querySelectorAll(".pi-message-rewind-btn");
    for (const button of buttons) {
      button.disabled = disabled;
      button.classList.toggle("is-disabled", disabled);
    }
  }
  resetRewindState() {
    this.returnCheckpoint = null;
    this.activeExtensionUiOwner = null;
    this.pendingRewindUiRequestIds.clear();
    this.renderReturnBanner();
  }
  setRewindBusy(busy) {
    if (this.rewindBusy === busy) return;
    this.rewindBusy = busy;
    this.updateRewindButtonState();
  }
  /**
   * Reload messages from Pi (clear + reload), used after rewind/return/switch.
   */
  async reloadMessagesFromPi() {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) return;
    try {
      const response = await conn.send({ type: "get_messages" });
      const data = response.data;
      const rawMessages = data?.messages;
      this.messages = [];
      this.messagesContainer.empty();
      if (Array.isArray(rawMessages)) {
        for (const raw of rawMessages) {
          const msg = this.convertAgentMessage(raw);
          if (msg) this.messages.push(msg);
        }
      }
      for (const msg of this.messages) {
        this.renderMessage(msg);
      }
      if (this.currentSessionPath) {
        this.plugin.messageStore.setMessages(this.currentSessionPath, this.messages);
        this.plugin.scheduleStoreFlush();
      }
      await this.syncForkEntryIds();
      this.renderReturnBanner();
      this.scrollToBottom();
    } catch (err) {
      console.warn("[Pi Chat] get_messages failed:", err);
      showCriticalNotice(t("notices.messagesLoadFailed"));
    }
  }
  // --- Rewind/Return Core Logic ---
  /**
   * Rewind to a specific user message: fork before it and restore its text to input.
   */
  async rewindToMessage(msg) {
    if (this.readOnly) {
      new import_obsidian15.Notice(t("notices.cannotRewind"));
      return;
    }
    if (this.streaming) {
      new import_obsidian15.Notice(t("notices.waitRewind"));
      return;
    }
    if (this.rewindBusy) {
      return;
    }
    if (msg.role !== "user" || msg.isSteering) {
      new import_obsidian15.Notice(t("notices.onlyUserRewind"));
      return;
    }
    if (!msg.piEntryId) {
      new import_obsidian15.Notice(t("notices.notRewindable"));
      await this.syncForkEntryIds();
      return;
    }
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) {
      new import_obsidian15.Notice(t("notices.notConnected"));
      return;
    }
    this.setRewindBusy(true);
    this.activeExtensionUiOwner = "rewind";
    this.pendingRewindUiRequestIds.clear();
    let forkSucceeded = false;
    try {
      const before = await this.getPiState();
      if (!before?.sessionFile) {
        new import_obsidian15.Notice(t("notices.noSession"));
        return;
      }
      this.returnCheckpoint = {
        sessionPath: before.sessionFile,
        sessionId: before.sessionId,
        sessionName: before.sessionName,
        createdAt: Date.now(),
        fromMessageId: msg.id,
        fromEntryId: msg.piEntryId
      };
      if (this.currentSessionPath && this.messages.length > 0) {
        this.plugin.messageStore.setMessages(this.currentSessionPath, this.messages);
        this.plugin.scheduleStoreFlush();
      }
      const response = await conn.send({
        type: "fork",
        entryId: msg.piEntryId
      });
      const data = response.data;
      if (data?.cancelled) {
        this.resetRewindState();
        new import_obsidian15.Notice(t("notices.rewindCancelled"));
        return;
      }
      forkSucceeded = true;
      await this.updateCurrentSessionFromPi();
      await this.reloadMessagesFromPi();
      const restoredText = data?.text ?? msg.piForkText ?? msg.content;
      if (restoredText) {
        this.chatState.text = restoredText;
        this.chatInput?.focus();
      }
      this.renderReturnBanner();
      new import_obsidian15.Notice(t("notices.rewindSuccess"));
    } catch (err) {
      console.error("[Pi Chat] Rewind failed:", err);
      if (!forkSucceeded) {
        this.resetRewindState();
      } else {
        this.renderReturnBanner();
      }
      const message = err instanceof Error ? err.message : String(err);
      showCriticalNotice(t("notices.rewindFailed", { msg: message }));
    } finally {
      this.activeExtensionUiOwner = null;
      this.pendingRewindUiRequestIds.clear();
      this.setRewindBusy(false);
    }
  }
  /**
   * Return to the original session before rewind.
   */
  async returnToLatest() {
    if (!this.returnCheckpoint) return;
    if (this.streaming) {
      new import_obsidian15.Notice(t("notices.waitReturn"));
      return;
    }
    if (this.rewindBusy) return;
    const checkpoint = this.returnCheckpoint;
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) {
      new import_obsidian15.Notice(t("notices.notConnected"));
      return;
    }
    this.setRewindBusy(true);
    this.activeExtensionUiOwner = "return";
    try {
      const response = await conn.send({
        type: "switch_session",
        sessionPath: checkpoint.sessionPath
      });
      const data = response.data;
      if (data?.cancelled) {
        new import_obsidian15.Notice(t("notices.returnCancelled"));
        return;
      }
      this.resetRewindState();
      await this.updateCurrentSessionFromPi();
      await this.reloadMessagesFromPi();
      this.chatState.text = "";
      this.chatInput?.focus();
      this.renderReturnBanner();
      new import_obsidian15.Notice(t("notices.returnSuccess"));
    } catch (err) {
      console.error("[Pi Chat] Return to latest failed:", err);
      const message = err instanceof Error ? err.message : String(err);
      showCriticalNotice(t("notices.returnFailed", { msg: message }));
    } finally {
      this.activeExtensionUiOwner = null;
      this.setRewindBusy(false);
    }
  }
  /**
   * Handle extension UI requests that block RPC commands like fork().
   */
  handleExtensionUiRequest(event) {
    if (this.activeExtensionUiOwner === "rewind" && event.title === "Restore Options") {
      this.pendingRewindUiRequestIds.add(event.id);
    }
    switch (event.method) {
      case "select":
        this.respondToExtensionSelect(event);
        break;
      case "confirm":
        this.respondToExtensionConfirm(event);
        break;
      case "input":
      case "editor":
        this.respondToExtensionInput(event);
        break;
    }
  }
  respondToExtensionSelect(event) {
    const options = Array.isArray(event.options) ? event.options : [];
    if (options.length === 0) {
      this.cancelRewindAfterExtensionUi(event.id);
      return;
    }
    const conversationOnly = options.find((option) => /^Conversation only\b/i.test(option));
    if (event.title === "Restore Options" && conversationOnly) {
      this.sendExtensionUiResponse(event.id, { value: conversationOnly });
      return;
    }
    new PermissionSelectModal(this.app, event.title || "Choose an option", options, (response) => {
      if (response.cancelled) {
        this.cancelRewindAfterExtensionUi(event.id);
      } else {
        this.sendExtensionUiResponse(event.id, { value: response.value });
      }
    }).open();
  }
  respondToExtensionConfirm(event) {
    new PermissionConfirmModal(
      this.app,
      event.title || "Confirm",
      event.message || "",
      (response) => {
        this.sendExtensionUiResponse(event.id, { confirmed: response.confirmed ?? false });
      }
    ).open();
  }
  respondToExtensionInput(event) {
    new PermissionInputModal(
      this.app,
      event.title || "Input",
      event.message || "",
      event.placeholder || "",
      event.initialValue ?? "",
      (response) => {
        if (response.cancelled) {
          this.cancelRewindAfterExtensionUi(event.id);
        } else {
          this.sendExtensionUiResponse(event.id, { value: response.value ?? "" });
        }
      },
      event.method === "editor"
    ).open();
  }
  cancelRewindAfterExtensionUi(requestId) {
    this.sendExtensionUiResponse(requestId, { cancelled: true });
    if (this.pendingRewindUiRequestIds.has(requestId)) {
      this.pendingRewindUiRequestIds.delete(requestId);
      this.resetRewindState();
    }
  }
  sendExtensionUiResponse(id, payload) {
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) return;
    try {
      conn.sendRaw({ type: "extension_ui_response", id, ...payload });
    } catch (err) {
      console.warn("[Pi Chat] Failed to answer extension UI request:", err);
    }
  }
  /**
   * Render the "Return to latest" banner above the messages area.
   */
  renderReturnBanner() {
    if (this.returnBannerEl) {
      this.returnBannerEl.remove();
      this.returnBannerEl = null;
    }
    if (!this.returnCheckpoint) return;
    this.returnBannerEl = this.contentEl.createDiv({
      cls: "pi-return-banner"
    });
    if (this.chatBodyEl) {
      this.contentEl.insertBefore(this.returnBannerEl, this.chatBodyEl);
    }
    this.returnBannerEl.createSpan({
      cls: "pi-return-banner-text",
      text: t("view.returnBanner.text")
    });
    const btn = this.returnBannerEl.createEl("button", {
      cls: "pi-return-latest-btn",
      text: t("view.returnBanner.button"),
      attr: {
        type: "button",
        "aria-label": t("view.returnBanner.tooltip"),
        title: t("view.returnBanner.tooltip")
      }
    });
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void this.returnToLatest();
    });
  }
  /**
   * Send a user message to Pi, with optional attachments and images.
   */
  async sendMessage(text, attachments = []) {
    if (this.readOnly) {
      new import_obsidian15.Notice(t("notices.readOnly"));
      return;
    }
    this.userScrolledUp = false;
    const isSteering = this.streaming;
    const shouldClearReturnCheckpoint = !isSteering && this.returnCheckpoint !== null;
    let displayText = text;
    const fileAttachments = attachments.filter((a) => a.type === "file");
    if (fileAttachments.length > 0) {
      const names = fileAttachments.map((a) => a.name).join(", ");
      displayText += `

\u{1F4CE} ${t("attachment.attached", { names })}`;
    }
    const imageAttachments = attachments.filter((a) => a.type === "image");
    if (imageAttachments.length > 0) {
      displayText += `

\u{1F5BC} ${t("attachment.imagesAttached", { count: imageAttachments.length })}`;
    }
    const userMsg = {
      id: generateMessageId(),
      role: "user",
      content: displayText,
      timestamp: Date.now(),
      isSteering: isSteering || void 0
    };
    this.addMessage(userMsg);
    if (!isSteering) {
      this.setStreamingState(true);
    }
    let message = text;
    for (const att of fileAttachments) {
      message += `

<file path="${att.name}">
${att.content}
</file>`;
    }
    const conn = this.plugin.ensureConnection();
    const command = {
      type: isSteering ? "steer" : "prompt",
      message
    };
    if (imageAttachments.length > 0) {
      command.images = imageAttachments.map((img) => ({
        type: "image",
        data: img.content,
        mimeType: img.mimeType || "image/png"
      }));
    }
    try {
      if (!isSteering) {
        this.showThinkingIndicator();
      }
      await conn.send(command);
      if (shouldClearReturnCheckpoint) {
        this.resetRewindState();
      }
    } catch (err) {
      console.error("[Pi Chat] Failed to send message:", err);
      showCriticalNotice(t("notices.sendFailed"));
      this.removeThinkingIndicator();
      if (!isSteering) {
        this.setStreamingState(false);
      }
    }
  }
  /**
   * Persist a message to the message store (debounced flush).
   */
  persistMessage(msg) {
    if (this.readOnly || !this.currentSessionPath) return;
    this.plugin.messageStore.appendMessage(this.currentSessionPath, msg);
    this.plugin.scheduleStoreFlush();
  }
  /**
   * Check if the conversation has any messages worth saving.
   */
  hasMessages() {
    return this.messages.some((m) => m.role === "assistant");
  }
  /**
   * Auto-save the current conversation if it has content.
   */
  async autoSave() {
    if (!this.hasMessages()) return null;
    try {
      const path6 = await this.sessionManager.saveSession(
        this.messages,
        this.plugin.settings,
        this.app.vault
      );
      return path6;
    } catch (err) {
      console.error("[Pi Chat] Failed to auto-save session:", err);
      return null;
    }
  }
  /**
   * Clear all messages and reset the view for a new conversation.
   */
  clearMessages() {
    this.messages = [];
    this.readOnly = false;
    this.streamHandler.reset();
    this.resetRewindState();
    this.removeThinkingIndicator();
    if (this.streamingComponent) {
      this.streamingComponent.unload();
      this.streamingComponent = null;
    }
    this.streamingMessageEl = null;
    this.streamingMessageActions?.unmount();
    this.streamingMessageActions = null;
    this.messagesContainer.empty();
    if (this.readOnlyBanner) {
      this.readOnlyBanner.remove();
      this.readOnlyBanner = null;
    }
    this.setReadOnly(false);
  }
  /**
   * Reset view state after an RPC disconnect during streaming.
   * Re-enables input, clears streaming state, and annotates any
   * partial assistant message with a connection-lost marker.
   */
  handleDisconnect() {
    this.streamHandler.reset();
    this.setStreamingState(false);
    this.removeThinkingIndicator();
    if (this.streamingComponent) {
      this.streamingComponent.unload();
      this.streamingComponent = null;
    }
    if (this.streamingMessageEl) {
      const contentEl = this.streamingMessageEl.querySelector(".pi-message-content");
      if (contentEl) {
        const existing = contentEl.getText();
        contentEl.setText(`${existing}

*[Connection lost]*`);
      }
      this.streamingMessageEl = null;
      this.streamingMessageActions?.unmount();
      this.streamingMessageActions = null;
    }
    if (this.streamRenderTimer) {
      window.clearTimeout(this.streamRenderTimer);
      this.streamRenderTimer = null;
    }
    this.pendingStreamContent = null;
  }
  /**
   * Display a list of messages (e.g. from a loaded session).
   * Optionally marks the view as read-only.
   */
  displayMessages(messages, readOnly = false) {
    this.clearMessages();
    this.messages = [...messages];
    this.readOnly = readOnly;
    for (const msg of messages) {
      this.renderMessage(msg);
    }
    if (readOnly) {
      this.setReadOnly(true);
    }
    this.scrollToBottom();
  }
  /**
   * Set read-only mode — disables input and shows a banner.
   */
  setReadOnly(readOnly) {
    this.readOnly = readOnly;
    if (this.chatInput) {
      this.chatInput.setEnabled(!readOnly);
    }
    if (readOnly) {
      if (!this.readOnlyBanner) {
        this.readOnlyBanner = this.contentEl.createDiv({
          cls: "pi-readonly-banner"
        });
        this.contentEl.insertBefore(this.readOnlyBanner, this.inputContainer);
        this.readOnlyBanner.setText(t("view.readOnlyBanner"));
      }
    } else {
      if (this.readOnlyBanner) {
        this.readOnlyBanner.remove();
        this.readOnlyBanner = null;
      }
    }
  }
  /**
   * Show "thinking" indicator while waiting for Pi to start responding.
   */
  showThinkingIndicator() {
    if (this.thinkingIndicatorEl || this.messages.length === 0) return;
    this.thinkingIndicatorEl = this.messagesContainer.createDiv({
      cls: "pi-thinking-indicator"
    });
    const label = this.thinkingIndicatorEl.createDiv({ cls: "pi-message-label" });
    label.createSpan({ text: "Pi", cls: "pi-message-label-text" });
    const content = this.thinkingIndicatorEl.createDiv({ cls: "pi-thinking-indicator-content" });
    content.createSpan({ cls: "pi-thinking-dots" });
    content.createSpan({ text: t("view.thinking"), cls: "pi-thinking-text" });
    this.scrollToBottom();
  }
  /**
   * Remove the thinking indicator (called when Pi starts responding or on error).
   */
  removeThinkingIndicator() {
    if (this.thinkingIndicatorEl) {
      this.thinkingIndicatorEl.remove();
      this.thinkingIndicatorEl = null;
    }
  }
  /**
   * Toggle streaming state — shows/hides abort button, updates placeholder.
   * Input stays enabled so the user can send steering messages.
   */
  setStreamingState(streaming) {
    this.streaming = streaming;
    this.chatState.streaming = streaming;
    this.chatState.placeholder = streaming ? "Send a message to steer Pi\u2026" : "Message Pi\u2026 (/ for commands, @ for files)";
    this.updateRewindButtonState();
  }
  /**
   * Abort the current stream by sending abort command to Pi.
   */
  abortStream() {
    try {
      const conn = this.plugin.connection;
      if (conn) {
        void conn.send({ type: "abort" });
      }
    } catch (err) {
      console.warn("[Pi Chat] Failed to send abort:", err);
      new import_obsidian15.Notice(t("notices.abortConnectionLost"));
    } finally {
      this.setStreamingState(false);
    }
  }
  /**
   * Trigger the `/` command suggest modal.
   */
  triggerCommandSuggest() {
    try {
      const conn = this.plugin.connection;
      if (conn) {
        this.commandSuggest.setConnection(conn);
      }
    } catch {
    }
    void this.commandSuggest.trigger((commandText) => {
      this.chatState.text = commandText;
      this.chatInput?.focus();
    });
  }
  /**
   * Trigger the `@` file picker modal.
   */
  triggerFilePicker() {
    this.attachmentPicker.trigger((attachment) => {
      const current = this.chatState.text;
      if (current.endsWith("@")) {
        this.chatState.text = current.slice(0, -1);
      }
      addMentionable(this.chatState, attachment);
      this.chatInput?.focus();
    });
  }
  /**
   * Handle streaming text update — debounced live markdown rendering.
   */
  handleStreamUpdate(msg) {
    this.removeThinkingIndicator();
    if (!this.streamingMessageEl) {
      this.streamingMessageEl = this.messagesContainer.createDiv({
        cls: "pi-message pi-message-assistant"
      });
      const label = this.streamingMessageEl.createDiv({ cls: "pi-message-label" });
      label.createSpan({ text: "Pi", cls: "pi-message-label-text" });
      const actionRow = label.createSpan({ cls: "pi-message-action-row" });
      this.streamingMessageActions = mountMessageActions(actionRow, {
        content: msg.content,
        tokens: this.chatState.tokens,
        cost: this.chatState.cost,
        model: this.chatState.model,
        onRewind: () => {
          const target = this.findLastRewindableUserMessage();
          if (target) {
            void this.rewindToMessage(target);
          } else {
            new import_obsidian15.Notice(t("notices.notRewindable"));
          }
        }
      });
      this.streamingMessageEl.createDiv({ cls: "pi-message-content" });
    }
    const contentEl = this.streamingMessageEl.querySelector(".pi-message-content");
    if (!contentEl) return;
    if (msg.content) {
      const liveThinking = this.streamingMessageEl.querySelector(".pi-thinking-live");
      if (liveThinking?.instanceOf(HTMLDetailsElement)) {
        liveThinking.open = false;
        liveThinking.removeClass("pi-thinking-live");
      }
      this.pendingStreamContent = msg.content;
      if (!this.streamRenderTimer) {
        this.streamRenderTimer = window.setTimeout(() => {
          this.streamRenderTimer = null;
          this.renderStreamingMarkdown();
        }, 100);
      }
    } else if (msg.thinkingContent) {
      let thinkingEl = this.streamingMessageEl.querySelector(".pi-thinking-live");
      if (!thinkingEl?.instanceOf(HTMLDetailsElement)) {
        thinkingEl = createEl("details", { cls: "pi-thinking pi-thinking-live" });
        this.streamingMessageEl.insertBefore(thinkingEl, contentEl);
      }
      if (thinkingEl.instanceOf(HTMLDetailsElement)) {
        thinkingEl.open = true;
        if (!thinkingEl.querySelector("summary")) {
          thinkingEl.createEl("summary", { text: t("view.thinking") });
        }
        if (!thinkingEl.querySelector(".pi-thinking-content")) {
          thinkingEl.createDiv({ cls: "pi-thinking-content" });
        }
      }
      const thinkingContentEl = thinkingEl.querySelector(".pi-thinking-content");
      if (thinkingContentEl) {
        thinkingContentEl.setText(msg.thinkingContent);
      }
    }
    this.scrollToBottom();
  }
  /**
   * Render the latest streamed content as markdown.
   * Called on a debounce timer to avoid thrashing on every delta.
   */
  renderStreamingMarkdown() {
    if (!this.streamingMessageEl || !this.pendingStreamContent) return;
    const contentEl = this.streamingMessageEl.querySelector(".pi-message-content");
    if (!contentEl) return;
    if (this.streamingComponent) {
      this.streamingComponent.unload();
    }
    this.streamingComponent = new import_obsidian15.Component();
    this.streamingComponent.load();
    const safeContent = this.pendingStreamContent.replace(
      /```(mermaid|dataview|dataviewjs|query)/g,
      "```$1-preview"
    );
    contentEl.empty();
    import_obsidian15.MarkdownRenderer.render(
      this.app,
      safeContent,
      contentEl,
      "",
      this.streamingComponent
    ).catch((err) => {
      console.error("[Pi Chat] Streaming markdown render error:", err);
      contentEl.setText(this.pendingStreamContent ?? "");
    });
    this.scrollToBottom();
  }
  /**
   * Handle stream completion — do full markdown render and finalize the message.
   */
  handleStreamComplete(msg) {
    this.setStreamingState(false);
    if (this.chatInput) {
      this.chatInput.focus();
    }
    if (this.streamRenderTimer) {
      window.clearTimeout(this.streamRenderTimer);
      this.streamRenderTimer = null;
    }
    this.pendingStreamContent = null;
    if (this.streamingMessageEl) {
      if (this.streamingComponent) {
        this.streamingComponent.unload();
        this.streamingComponent = null;
      }
      const contentEl = this.streamingMessageEl.querySelector(".pi-message-content");
      if (contentEl) {
        contentEl.empty();
        if (msg.content) {
          this.streamingComponent = new import_obsidian15.Component();
          this.streamingComponent.load();
          import_obsidian15.MarkdownRenderer.render(
            this.app,
            msg.content,
            contentEl,
            "",
            this.streamingComponent
          ).catch((err) => {
            console.error("[Pi Chat] Markdown rendering error:", err);
            contentEl.setText(msg.content);
          });
        }
      }
      const liveThinking = this.streamingMessageEl.querySelector(".pi-thinking-live, .pi-thinking");
      if (liveThinking) liveThinking.remove();
      if (msg.thinkingContent) {
        if (!this.streamingComponent) {
          this.streamingComponent = new import_obsidian15.Component();
          this.streamingComponent.load();
        }
        const thinkingEl = createEl("details", { cls: "pi-thinking" });
        thinkingEl.createEl("summary", { text: t("renderer.thinkingSummary") });
        const thinkingContentEl = thinkingEl.createDiv({ cls: "pi-thinking-content" });
        import_obsidian15.MarkdownRenderer.render(
          this.app,
          msg.thinkingContent,
          thinkingContentEl,
          "",
          this.streamingComponent
        ).catch((err) => {
          console.error("[Pi Chat] Thinking render error:", err);
          thinkingContentEl.setText(msg.thinkingContent ?? "");
        });
        this.streamingMessageEl.insertBefore(thinkingEl, contentEl);
      }
      this.streamingMessageActions?.update({
        content: msg.content,
        tokens: this.chatState.tokens,
        cost: this.chatState.cost,
        model: this.chatState.model
      });
      this.streamingMessageEl = null;
      this.streamingMessageActions = null;
    }
    msg.tokens = this.chatState.tokens;
    msg.cost = this.chatState.cost;
    msg.model = this.chatState.model;
    this.messages.push(msg);
    this.scrollToBottom();
    this.persistMessage(msg);
  }
  findLastRewindableUserMessage() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const candidate = this.messages[i];
      if (candidate.role === "user" && !candidate.isSteering && candidate.piEntryId) {
        return candidate;
      }
    }
    return null;
  }
  findRewindTarget(msg) {
    const index2 = this.messages.findIndex((m) => m.id === msg.id);
    if (index2 < 0) return null;
    for (let i = index2 - 1; i >= 0; i--) {
      const candidate = this.messages[i];
      if (candidate.role === "user" && !candidate.isSteering && candidate.piEntryId) {
        return candidate;
      }
    }
    return null;
  }
  renderMessage(msg) {
    try {
      switch (msg.role) {
        case "user": {
          const canShowRewind = !this.readOnly && !msg.isSteering && !!msg.piEntryId;
          this.renderer.renderUserMessage(this.messagesContainer, msg.content, msg.isSteering, {
            onRewind: canShowRewind ? () => {
              void this.rewindToMessage(msg);
            } : void 0,
            rewindDisabled: this.streaming || this.rewindBusy,
            rewindTitle: msg.piEntryId ? t("renderer.rewindTooltip") : t("notices.notRewindable")
          });
          break;
        }
        case "assistant": {
          const rewindTarget = !this.readOnly ? this.findRewindTarget(msg) : null;
          this.renderer.renderAssistantMessage(
            this.messagesContainer,
            msg.content,
            "",
            this,
            msg.thinkingContent,
            msg.error,
            {
              onRewind: rewindTarget ? () => {
                void this.rewindToMessage(rewindTarget);
              } : void 0,
              tokens: msg.tokens ?? 0,
              cost: msg.cost ?? 0,
              model: msg.model ?? this.chatState.model
            }
          );
          break;
        }
        case "tool":
          this.renderer.renderToolCall(
            this.messagesContainer,
            msg.toolName ?? "tool",
            "",
            msg.content,
            msg.isError ?? false,
            this
          );
          break;
      }
    } catch (err) {
      console.error("[Pi Chat] Message render error:", err);
      const errorEl = this.messagesContainer.createDiv({ cls: "pi-message pi-render-error" });
      errorEl.createEl("p", { text: t("notices.renderError") });
      errorEl.createEl("pre", { text: msg.content });
    }
  }
};

// src/tabs/chat-tab.ts
var ChatTab = class {
  view = null;
  connection = null;
  messageStore;
  deps;
  constructor(deps) {
    this.deps = deps;
    this.messageStore = deps.messageStore ?? new MessageStore();
  }
  async mount(container) {
    const { deps } = this;
    const piBinary = detectPiBinary(deps.settings.piBinaryPath, deps.vaultPath) ?? deps.settings.piBinaryPath;
    const token = await resolveToken(deps.app);
    this.connection = new PiConnection({
      piBinaryPath: piBinary,
      cwd: deps.vaultPath,
      piConfigDir: deps.piConfigDir,
      buildEnv: () => buildExecEnv(),
      apiKeys: {
        PVM_API_TOKEN: token
      }
    });
    const pluginRef = {
      app: deps.app,
      settings: deps.settings,
      connection: this.connection,
      ensureConnection: () => {
        if (!this.connection) {
          this.connection = new PiConnection({
            piBinaryPath: piBinary,
            cwd: deps.vaultPath,
            piConfigDir: deps.piConfigDir,
            buildEnv: () => buildExecEnv(),
            apiKeys: {
              PVM_API_TOKEN: token
            }
          });
        }
        if (!this.connection.isConnected()) {
          this.connection.connect();
        }
        return this.connection;
      },
      messageStore: this.messageStore,
      scheduleStoreFlush: () => {
        void deps.onStoreFlush?.();
      },
      statusBar: null,
      piConfigDir: deps.piConfigDir
    };
    this.view = new PiChatView(deps.leaf, pluginRef);
    await this.view.onOpen(container);
    if (deps.initialCommand && this.connection) {
      const cmd = deps.initialCommand;
      const conn = this.connection;
      const view = this.view;
      const waitAndSend = async () => {
        try {
          await conn.send({ type: "get_state" });
          activeWindow.setTimeout(() => {
            if (view) void view.sendMessage(cmd, []);
          }, 3e3);
        } catch {
          activeWindow.setTimeout(() => void waitAndSend(), 2e3);
        }
      };
      activeWindow.setTimeout(() => void waitAndSend(), 3e3);
    }
  }
  destroy() {
    if (this.view) {
      void this.view.onClose();
      this.view = null;
    }
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
  }
};

// src/tabs/queue-tab.ts
var import_obsidian16 = require("obsidian");
var QueueTab = class {
  deps;
  client = null;
  root = null;
  chips = null;
  list = null;
  jobs = [];
  unsubState = null;
  unsubEvents = null;
  connectionState = { connected: false };
  explicitError = null;
  pendingContainer = null;
  pendingEntries = [];
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    this.root = container.createEl("div", { cls: "vault-mind-container" });
    this.render();
    await this.connect();
  }
  destroy() {
    this.disconnect();
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    const header = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    header.createEl("span", { cls: "vault-mind-status-dot" });
    header.createEl("span", { text: "Queue" });
    const refresh = header.createEl("button", { title: "Refresh" });
    (0, import_obsidian16.setIcon)(refresh, "refresh-cw");
    refresh.addEventListener("click", () => this.refresh());
    this.chips = this.root.createEl("div", { cls: "vault-mind-count-chips" });
    this.list = this.root.createEl("ul", { cls: "vault-mind-queue-list" });
    this.pendingContainer = this.root.createEl("div");
  }
  async connect() {
    this.disconnect();
    const token = await resolveToken(this.deps.app);
    if (!token) {
      this.setError("No token configured.");
      return;
    }
    this.client = new VaultMindClient({
      host: this.deps.settings.host,
      port: readServerPort(this.deps.vaultPath) ?? this.deps.settings.port,
      token
    });
    this.unsubState = this.client.subscribeState((state) => this.updateState(state));
    this.unsubEvents = this.client.subscribeEvents((event) => this.handleEvent(event));
    this.client.connect();
    await this.refresh();
  }
  disconnect() {
    if (this.unsubState) {
      this.unsubState();
      this.unsubState = null;
    }
    if (this.unsubEvents) {
      this.unsubEvents();
      this.unsubEvents = null;
    }
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
  updateState(state) {
    this.connectionState = state;
    if (state.connected || state.reconnecting) {
      this.explicitError = null;
    }
    const dot = this.root?.querySelector(".vault-mind-status-dot");
    if (dot) {
      dot.classList.remove("connected", "error", "reconnecting");
      if (state.connected) dot.classList.add("connected");
      else if (state.reconnecting) dot.classList.add("reconnecting");
      else if (state.error) dot.classList.add("error");
    }
    this.updateRootStateClasses();
    this.renderList();
  }
  updateRootStateClasses() {
    if (!this.root) return;
    this.root.classList.remove(
      "vault-mind-queue-empty",
      "vault-mind-queue-error",
      "vault-mind-queue-reconnecting"
    );
    if (this.connectionState.reconnecting) {
      this.root.classList.add("vault-mind-queue-reconnecting");
    } else if (this.connectionState.error && !this.connectionState.connected) {
      this.root.classList.add("vault-mind-queue-error");
    } else if (this.connectionState.connected && this.jobs.length === 0) {
      this.root.classList.add("vault-mind-queue-empty");
    }
  }
  handleEvent(event) {
    switch (event.type) {
      case "queue/snapshot":
        this.jobs = event.jobs;
        break;
      case "job-created":
        this.jobs.unshift(event.job);
        break;
      case "job-updated": {
        const idx = this.jobs.findIndex((j) => j.id === event.job.id);
        if (idx >= 0) this.jobs[idx] = event.job;
        break;
      }
      case "job-completed": {
        const idx = this.jobs.findIndex((j) => j.id === event.job.id);
        if (idx >= 0) this.jobs[idx] = event.job;
        break;
      }
      case "job-notification":
        new import_obsidian16.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
        break;
      case "vault-edit-proposed":
        break;
      case "context-request":
        break;
    }
    this.renderList();
  }
  async refresh() {
    if (!this.client) return;
    try {
      this.jobs = await this.client.listQueue();
      this.renderList();
    } catch (err) {
      this.setError(`Refresh failed: ${err.message}`);
      return;
    }
    try {
      this.pendingEntries = await this.client.listPending();
    } catch {
      this.pendingEntries = [];
    }
    this.renderPending();
  }
  renderList() {
    if (!this.list) return;
    this.list.empty();
    this.renderChips();
    this.updateRootStateClasses();
    if (this.explicitError || this.connectionState.error && !this.connectionState.connected && !this.connectionState.reconnecting) {
      const message = this.explicitError ?? "Connection lost. Retrying...";
      const li = this.list.createEl("li", {
        cls: "vault-mind-empty vault-mind-queue-error-state"
      });
      li.createEl("span", { text: message });
      if (!this.explicitError) {
        const retryBtn = li.createEl("button", {
          title: "Retry now",
          attr: { "aria-label": "Retry connection" }
        });
        (0, import_obsidian16.setIcon)(retryBtn, "refresh-cw");
        retryBtn.addEventListener("click", () => this.connect());
      }
      return;
    }
    if (this.connectionState.reconnecting) {
      const li = this.list.createEl("li", {
        cls: "vault-mind-empty vault-mind-queue-reconnecting-state"
      });
      const spinner = li.createEl("span", { cls: "vault-mind-spinner" });
      (0, import_obsidian16.setIcon)(spinner, "loader");
      li.createEl("span", { text: "Reconnecting..." });
      return;
    }
    if (!this.connectionState.connected) {
      this.list.createEl("li", { cls: "vault-mind-empty", text: "Connecting..." });
      return;
    }
    if (this.jobs.length === 0) {
      this.list.createEl("li", {
        cls: "vault-mind-empty",
        text: "No jobs queued. Add @agent markers to your notes to create jobs."
      });
      return;
    }
    for (const job of this.jobs) {
      const li = this.list.createEl("li", { cls: `vault-mind-job-row status-${job.status}` });
      li.setAttribute("tabindex", "0");
      li.setAttribute("role", "button");
      li.setAttribute("aria-label", `${job.role} job, ${job.status}: ${job.filePath}`);
      const header = li.createEl("div", { cls: "vault-mind-job-header" });
      header.createEl("span", { cls: "vault-mind-job-role", text: job.role });
      header.createEl("span", { cls: "vault-mind-job-status", text: job.status });
      header.createEl("span", { cls: "vault-mind-job-attempts", text: `${job.attempts}x` });
      li.createEl("div", { cls: "vault-mind-job-path", text: job.filePath });
      li.createEl("div", {
        cls: "vault-mind-job-instruction",
        text: this.truncate(job.instruction, 80)
      });
      const detail = li.createEl("div", { cls: "vault-mind-job-detail" });
      detail.createEl("div", { cls: "vault-mind-job-detail-section", text: job.instruction });
      if (job.lastError) {
        detail.createEl("div", { cls: "vault-mind-job-error", text: job.lastError });
      }
      detail.createEl("div", {
        cls: "vault-mind-job-meta-line",
        text: `File: ${job.filePath}`
      });
      detail.createEl("div", {
        cls: "vault-mind-job-meta-line",
        text: `Created: ${job.createdAt}`
      });
      if (job.dispatchedAt) {
        detail.createEl("div", {
          cls: "vault-mind-job-meta-line",
          text: `Dispatched: ${job.dispatchedAt}`
        });
      }
      if (job.completedAt) {
        detail.createEl("div", {
          cls: "vault-mind-job-meta-line",
          text: `Completed: ${job.completedAt}`
        });
      }
      li.addEventListener("click", () => {
        li.classList.toggle("vault-mind-job-expanded");
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          li.classList.toggle("vault-mind-job-expanded");
        }
      });
      li.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        this.showContextMenu(evt, job);
      });
    }
  }
  renderChips() {
    if (!this.chips) return;
    this.chips.empty();
    const counts = this.countByStatus();
    const statuses = ["pending", "running", "done", "failed", "cancelled"];
    for (const status of statuses) {
      const chip = this.chips.createEl("span", {
        cls: `vault-mind-count-chip status-${status}`
      });
      chip.createEl("span", { cls: "vault-mind-count-chip-label", text: status });
      chip.createEl("span", {
        cls: "vault-mind-count-chip-value",
        text: String(counts[status] ?? 0)
      });
    }
  }
  countByStatus() {
    const counts = {
      pending: 0,
      running: 0,
      done: 0,
      failed: 0,
      cancelled: 0
    };
    for (const job of this.jobs) {
      counts[job.status] = (counts[job.status] ?? 0) + 1;
    }
    return counts;
  }
  truncate(text, max) {
    if (text.length <= max) return text;
    return `${text.slice(0, max).trim()}\u2026`;
  }
  renderPending() {
    if (!this.pendingContainer) return;
    this.pendingContainer.empty();
    if (this.pendingEntries.length === 0) return;
    const section = this.pendingContainer.createEl("details", {
      cls: "vault-mind-pending-section"
    });
    section.setAttribute("open", "");
    section.createEl("summary", {
      cls: "vault-mind-pending-summary",
      text: `Pending Review (${this.pendingEntries.length})`
    });
    for (const item of this.pendingEntries) {
      const row = section.createEl("div", { cls: "vault-mind-pending-item" });
      row.createEl("span", { cls: "vault-mind-pending-collection", text: item.collection });
      const preview = String(item.entry.fact ?? item.entry.source ?? "");
      row.createEl("span", {
        cls: "vault-mind-pending-entry-text",
        text: this.truncate(preview, 80)
      });
      const actions = row.createEl("div", { cls: "vault-mind-pending-actions" });
      const approveBtn = actions.createEl("button", {
        text: "Approve",
        cls: "vault-mind-pending-approve"
      });
      approveBtn.addEventListener("click", async () => {
        try {
          await this.client?.approveEntry(item.id, item.collection, "approve");
          await this.refresh();
        } catch (err) {
          new import_obsidian16.Notice(`Vault Mind: ${err.message}`);
        }
      });
      const rejectBtn = actions.createEl("button", {
        text: "Reject",
        cls: "vault-mind-pending-reject"
      });
      rejectBtn.addEventListener("click", async () => {
        try {
          await this.client?.approveEntry(item.id, item.collection, "reject");
          await this.refresh();
        } catch (err) {
          new import_obsidian16.Notice(`Vault Mind: ${err.message}`);
        }
      });
    }
  }
  showContextMenu(evt, job) {
    const menu = new import_obsidian16.Menu();
    menu.addItem(
      (item) => item.setTitle("Retry").setIcon("rotate-cw").onClick(async () => {
        try {
          await this.client?.retryJob(job.id);
        } catch (err) {
          new import_obsidian16.Notice(`Vault Mind: ${err.message}`);
        }
      })
    );
    menu.addItem(
      (item) => item.setTitle("Cancel").setIcon("x").onClick(async () => {
        try {
          await this.client?.cancelJob(job.id);
        } catch (err) {
          new import_obsidian16.Notice(`Vault Mind: ${err.message}`);
        }
      })
    );
    menu.showAtMouseEvent(evt);
  }
  setError(message) {
    this.explicitError = message;
    this.connectionState = { connected: false, error: message };
    this.chips?.empty();
    if (!this.list) return;
    this.list.empty();
    this.renderList();
    new import_obsidian16.Notice(`Vault Mind: ${message}`);
  }
};

// src/tabs/search-tab.ts
var SearchTab = class {
  deps;
  client = null;
  root = null;
  modeBar = null;
  inputEl = null;
  collectionEl = null;
  resultsEl = null;
  mode = "vector";
  debounceTimer = null;
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    const token = await resolveToken(this.deps.app);
    const port = readServerPort(this.deps.vaultPath) ?? this.deps.settings.port;
    this.client = new VaultMindClient({
      host: this.deps.settings.host,
      port,
      token: token ?? ""
    });
    this.root = container.createEl("div", { cls: "vault-mind-search-container" });
    this.render();
  }
  destroy() {
    if (this.debounceTimer !== null) {
      activeWindow.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.client = null;
    this.root = null;
    this.modeBar = null;
    this.inputEl = null;
    this.collectionEl = null;
    this.resultsEl = null;
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    this.modeBar = this.root.createEl("div", { cls: "vault-mind-search-mode-bar" });
    const modeLabels = { vector: "Vector", fts: "FTS", graph: "Graph" };
    for (const mode of ["vector", "fts", "graph"]) {
      const btn = this.modeBar.createEl("button", {
        cls: `vault-mind-search-mode-btn${mode === this.mode ? " is-active" : ""}`,
        text: modeLabels[mode],
        attr: { "aria-label": `Switch to ${modeLabels[mode]} search mode` }
      });
      btn.addEventListener("click", () => {
        this.mode = mode;
        this.updateModeBar();
        void this.runSearch();
      });
    }
    const inputRow = this.root.createEl("div", { cls: "vault-mind-search-input-row" });
    this.collectionEl = inputRow.createEl("select", {
      cls: "vault-mind-search-collection",
      attr: { "aria-label": "Collection" }
    });
    this.collectionEl.createEl("option", { value: "main", text: "main" });
    this.inputEl = inputRow.createEl("input", {
      cls: "vault-mind-search-input",
      type: "text",
      placeholder: "Search\u2026",
      attr: { "aria-label": "Search query" }
    });
    this.inputEl.addEventListener("input", () => {
      if (this.debounceTimer !== null) {
        activeWindow.clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = activeWindow.setTimeout(() => {
        this.debounceTimer = null;
        void this.runSearch();
      }, 300);
    });
    this.resultsEl = this.root.createEl("div", { cls: "vault-mind-search-results" });
    this.showEmpty();
  }
  updateModeBar() {
    if (!this.modeBar) return;
    const modes = ["vector", "fts", "graph"];
    const btns = this.modeBar.querySelectorAll(".vault-mind-search-mode-btn");
    btns.forEach((btn, i) => {
      btn.classList.toggle("is-active", modes[i] === this.mode);
    });
  }
  showEmpty(message = "No results") {
    if (!this.resultsEl) return;
    this.resultsEl.empty();
    this.resultsEl.createEl("div", { cls: "vault-mind-search-empty", text: message });
  }
  showLoading() {
    if (!this.resultsEl) return;
    this.resultsEl.empty();
    this.resultsEl.createEl("div", { cls: "vault-mind-search-loading", text: "Searching\u2026" });
  }
  renderHits(hits) {
    if (!this.resultsEl) return;
    this.resultsEl.empty();
    if (hits.length === 0) {
      this.showEmpty();
      return;
    }
    for (const hit of hits) {
      const item = this.resultsEl.createEl("div", { cls: "vault-mind-search-result-item" });
      const source = hit.source ?? hit._source;
      const domain = hit.domain ?? hit._domain;
      const fact = hit.fact ?? hit._fact ?? hit.entity ?? hit._entity;
      const tags = hit.tags ?? hit._tags;
      if (source) {
        item.createEl("div", {
          cls: "vault-mind-search-result-source",
          text: String(source)
        });
      }
      if (domain) {
        item.createEl("div", {
          cls: "vault-mind-search-result-domain",
          text: String(domain)
        });
      }
      if (fact) {
        item.createEl("div", {
          cls: "vault-mind-search-result-fact",
          text: String(fact)
        });
      }
      if (Array.isArray(tags) && tags.length > 0) {
        const chipsRow = item.createEl("div", { cls: "vault-mind-search-tag-chips" });
        for (const tag of tags) {
          chipsRow.createEl("span", {
            cls: "vault-mind-search-tag-chip",
            text: String(tag)
          });
        }
      }
    }
  }
  async runSearch() {
    if (!this.client || !this.inputEl) return;
    const query = this.inputEl.value.trim();
    if (!query) {
      this.showEmpty();
      return;
    }
    const collection = this.collectionEl?.value ?? "main";
    this.showLoading();
    try {
      let result;
      if (this.mode === "vector") {
        result = await this.client.search(query, collection, 20);
      } else if (this.mode === "fts") {
        result = await this.client.ftsSearch(
          query,
          collection,
          20
        );
      } else {
        result = await this.client.graphQuery(query, 2);
      }
      this.renderHits(result.hits);
    } catch (err) {
      this.showEmpty(`Error: ${String(err)}`);
    }
  }
};

// src/tabs/status-tab.ts
var import_node_child_process2 = require("node:child_process");
var import_obsidian17 = require("obsidian");
function shellQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
function winQuote(value) {
  return `"${value.replace(/"/g, '""')}"`;
}
var StatusTab = class {
  deps;
  client = null;
  root = null;
  statusBar = null;
  tokenSourceEl = null;
  providerEl = null;
  modelEl = null;
  watcherStatusEl = null;
  watcherBtn = null;
  resultsBox = null;
  unsubState = null;
  unsubEvents = null;
  discoveredConfig = null;
  embeddingConfigEl = null;
  component = null;
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    this.component = new import_obsidian17.Component();
    this.component.load();
    this.root = container.createEl("div", { cls: "vault-mind-container" });
    this.render();
    await this.connect();
  }
  destroy() {
    this.disconnect();
    this.component?.unload();
    this.component = null;
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    this.statusBar = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    this.statusBar.createEl("span", { cls: "vault-mind-status-dot" });
    this.statusBar.createEl("span", { text: "Vault Mind" });
    this.statusBar.createEl("span", { cls: "vault-mind-version", text: "" });
    const tokenBar = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    this.tokenSourceEl = tokenBar.createEl("span", { text: "Token: checking..." });
    void this.refreshTokenSource();
    const detailsBar = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    this.providerEl = detailsBar.createEl("span", {
      cls: "vault-mind-provider",
      text: "Provider: \u2014"
    });
    this.modelEl = detailsBar.createEl("span", { cls: "vault-mind-model", text: "Model: \u2014" });
    this.watcherStatusEl = detailsBar.createEl("span", { text: "Watcher: \u2014" });
    this.watcherBtn = detailsBar.createEl("button", {
      text: "Start watcher",
      attr: { "aria-label": "Start file watcher" }
    });
    this.watcherBtn.addEventListener("click", () => this.toggleWatcher());
    const configSection = this.root.createEl("div", { cls: "vault-mind-config-section" });
    configSection.createEl("div", { cls: "vault-mind-config-heading", text: "Embedding config" });
    this.embeddingConfigEl = configSection.createEl("div", { cls: "vault-mind-config-details" });
    const launchBtn = this.root.createEl("button", {
      text: import_obsidian17.Platform.isMacOS ? "Open in Terminal" : "Open in Console",
      attr: { "aria-label": "Open pi TUI in external terminal" }
    });
    launchBtn.addEventListener("click", () => this.launchPiTui());
    const searchBox = this.root.createEl("div", { cls: "vault-mind-search-box" });
    const input = searchBox.createEl("input", {
      type: "text",
      placeholder: "Search vault...",
      attr: { "aria-label": "Search vault" }
    });
    const searchBtn = searchBox.createEl("button", {
      title: "Search",
      attr: { "aria-label": "Search vault" }
    });
    (0, import_obsidian17.setIcon)(searchBtn, "search");
    searchBtn.addEventListener("click", () => this.runSearch(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.runSearch(input.value);
    });
    this.resultsBox = this.root.createEl("div");
  }
  async connect() {
    this.disconnect();
    this.discoveredConfig = readExtensionConfig(this.deps.vaultPath);
    const token = await resolveToken(this.deps.app);
    if (!token) {
      this.setError(
        "No token configured. Set PVM_API_TOKEN or store one in Obsidian secret storage."
      );
      return;
    }
    this.client = new VaultMindClient({
      host: this.deps.settings.host,
      port: readServerPort(this.deps.vaultPath) ?? this.deps.settings.port,
      token
    });
    this.unsubState = this.client.subscribeState((state) => this.updateConnectionState(state));
    this.unsubEvents = this.client.subscribeEvents((event) => this.handleEvent(event));
    this.client.connect();
    await this.refreshStatus();
  }
  disconnect() {
    if (this.unsubState) {
      this.unsubState();
      this.unsubState = null;
    }
    if (this.unsubEvents) {
      this.unsubEvents();
      this.unsubEvents = null;
    }
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
  updateConnectionState(state) {
    const dot = this.statusBar?.querySelector(".vault-mind-status-dot");
    if (dot) {
      dot.classList.remove("connected", "error");
      if (state.connected) dot.classList.add("connected");
      else if (state.error) dot.classList.add("error");
    }
    this.deps.updateStatusBar(state.connected, Boolean(state.error));
  }
  handleEvent(event) {
    switch (event.type) {
      case "vault-edit-proposed": {
        new import_obsidian17.Notice(`Vault Mind: proposed edit for ${event.path}`);
        const file = this.deps.app.vault.getAbstractFileByPath(event.path);
        if (file) {
          new DiffModal(
            this.deps.app,
            { path: event.path, old: event.oldContent, new: event.newContent },
            async () => {
              if (!(file instanceof import_obsidian17.TFile)) {
                new import_obsidian17.Notice(`Vault Mind: file not found: ${event.path}`);
                return;
              }
              try {
                await this.deps.app.vault.modify(file, event.newContent);
                new import_obsidian17.Notice(`Vault Mind: accepted changes to ${event.path}`);
              } catch (err) {
                new import_obsidian17.Notice(`Vault Mind: failed to write ${event.path}: ${err.message}`);
              }
            }
          ).open();
        }
        break;
      }
      case "job-notification":
        new import_obsidian17.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
        break;
      case "context-request":
        break;
    }
  }
  async refreshStatus() {
    if (!this.client) return;
    try {
      const status = await this.client.status();
      this.renderStatus(status);
    } catch (err) {
      this.setError(`Status refresh failed: ${err.message}`);
    }
  }
  renderStatus(status) {
    const versionEl = this.statusBar?.querySelector(".vault-mind-version");
    if (versionEl) versionEl.textContent = `v${status.version}`;
    const model = this.discoveredConfig?.model ?? status.embedding?.model ?? "\u2014";
    if (this.providerEl) this.providerEl.textContent = `Model: ${model}`;
    if (this.modelEl) this.modelEl.textContent = `Dim: ${status.embedding?.dim ?? "\u2014"}`;
    if (this.watcherStatusEl) {
      this.watcherStatusEl.textContent = status.watcher ? "Watcher active" : "Watcher: stopped";
    }
    if (this.watcherBtn) {
      this.watcherBtn.textContent = status.watcher ? "Stop" : "Start watcher";
      this.watcherBtn.setAttribute(
        "aria-label",
        status.watcher ? "Stop file watcher" : "Start file watcher"
      );
      this.watcherBtn.classList.toggle("connected", status.watcher);
    }
    if (this.embeddingConfigEl) {
      this.embeddingConfigEl.empty();
      const embModel = this.discoveredConfig?.model ?? status.embedding?.model ?? "\u2014";
      const embDim = this.discoveredConfig?.dim ?? status.embedding?.dim ?? "\u2014";
      const localUrl = this.discoveredConfig?.localUrl ?? "\u2014";
      const serverText = status.server?.running ? `running on port ${status.server.port}` : "stopped";
      this.embeddingConfigEl.createEl("span", { text: `Model: ${embModel}` });
      this.embeddingConfigEl.createEl("span", { text: `Dim: ${embDim}` });
      this.embeddingConfigEl.createEl("span", { text: `Local: ${localUrl}` });
      this.embeddingConfigEl.createEl("span", { text: `Server: ${serverText}` });
    }
  }
  setError(message) {
    this.resultsBox?.empty();
    this.resultsBox?.createEl("p", { cls: "vault-mind-empty", text: message });
    new import_obsidian17.Notice(`Vault Mind: ${message}`);
  }
  async refreshTokenSource() {
    const token = await resolveToken(this.deps.app);
    const source = process.env.PVM_API_TOKEN ? "environment" : token ? "Obsidian secret storage" : "not configured";
    this.tokenSourceEl?.setText(`Token: ${source}`);
  }
  async runSearch(query) {
    if (!this.client || !query.trim()) return;
    this.resultsBox?.empty();
    try {
      const res = await this.client.search(query.trim());
      await this.renderSearchResults(res);
    } catch (err) {
      this.setError(`Search failed: ${err.message}`);
    }
  }
  async renderSearchResults(res) {
    this.resultsBox?.empty();
    if (res.hits.length === 0) {
      this.resultsBox?.createEl("p", { cls: "vault-mind-empty", text: "No results." });
      return;
    }
    const list = this.resultsBox?.createEl("ul");
    if (!list) return;
    for (const hit of res.hits) {
      const source = typeof hit.source === "string" ? hit.source : "";
      const fact = typeof hit.fact === "string" ? hit.fact : "";
      const display = (fact || source).replace(/\|/g, "\\|").replace(/\]\]/g, "");
      const markdown = source ? `[[${source}|${display}]]` : display || JSON.stringify(hit);
      const li = list.createEl("li");
      if (this.component) {
        await import_obsidian17.MarkdownRenderer.render(this.deps.app, markdown, li, "", this.component);
      }
    }
  }
  async toggleWatcher() {
    if (!this.client) return;
    try {
      const res = await this.client.toggleWatcher();
      new import_obsidian17.Notice(`Vault Mind: watcher ${res.watcher ? "started" : "stopped"}`);
      await this.refreshStatus();
    } catch (err) {
      this.setError(`Watcher toggle failed: ${err.message}`);
    }
  }
  launchPiTui() {
    if (!import_obsidian17.Platform.isDesktop) {
      new import_obsidian17.Notice("Vault Mind: TUI launcher is only available on desktop");
      return;
    }
    const cwd = this.deps.vaultPath;
    const piConfigDir = this.deps.piConfigDir;
    const piBinary = this.deps.piBinaryPath;
    const env = { ...process.env, PI_CODING_AGENT_DIR: piConfigDir };
    try {
      if (import_obsidian17.Platform.isMacOS) {
        const script = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        const appleScript = `tell application "Terminal" to do script "${script.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
        (0, import_node_child_process2.spawn)("osascript", ["-e", appleScript]);
      } else if (import_obsidian17.Platform.isLinux) {
        const cmd = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        (0, import_node_child_process2.spawn)("x-terminal-emulator", ["-e", "bash", "-c", cmd], { env });
      } else if (import_obsidian17.Platform.isWin) {
        const cmd = `cd /d ${winQuote(cwd)} && set PI_CODING_AGENT_DIR=${winQuote(piConfigDir)} && ${piBinary} --cwd ${winQuote(cwd)}`;
        (0, import_node_child_process2.spawn)("cmd", ["/c", "start", "cmd", "/k", cmd], { env, shell: false });
      } else {
        new import_obsidian17.Notice("Vault Mind: unsupported platform for TUI launcher");
      }
    } catch (err) {
      new import_obsidian17.Notice(`Vault Mind: failed to launch pi TUI: ${err.message}`);
    }
  }
};

// src/views/panel.ts
var VIEW_TYPE_PANEL = "vault-mind-panel";
var TAB_CONFIG = [
  { id: "chat", label: "Chat", icon: "message-circle" },
  { id: "queue", label: "Queue", icon: "list" },
  { id: "status", label: "Status", icon: "activity" },
  { id: "search", label: "Search", icon: "search" }
];
var VaultMindPanel = class extends import_obsidian18.ItemView {
  deps;
  tabs = [];
  activeTab = "chat";
  constructor(leaf, deps) {
    super(leaf);
    this.deps = deps;
  }
  getViewType() {
    return VIEW_TYPE_PANEL;
  }
  getDisplayText() {
    return "Vault Mind";
  }
  getIcon() {
    return "vault-mind";
  }
  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.addClass("vault-mind-panel");
    const hasExtensions = (0, import_node_fs2.existsSync)(
      import_node_path2.default.join(this.deps.vaultPath, ".pi", "agent", "npm", "node_modules", "pi-vault-mind")
    );
    if (!hasExtensions) {
      this.renderSetupPrompt(container);
      return;
    }
    const tabBar = container.createEl("div", { cls: "vault-mind-tab-bar" });
    for (const cfg of TAB_CONFIG) {
      const tabContainer = container.createEl("div", { cls: "vault-mind-tab-content" });
      tabContainer.style.display = "none";
      const button = tabBar.createEl("button", {
        cls: "vault-mind-tab-button",
        attr: {
          "aria-label": cfg.label,
          "aria-selected": "false",
          role: "tab"
        }
      });
      (0, import_obsidian18.setIcon)(button, cfg.icon);
      button.createEl("span", { text: cfg.label });
      const entry = {
        id: cfg.id,
        label: cfg.label,
        icon: cfg.icon,
        container: tabContainer,
        button,
        tab: null,
        mounted: false
      };
      this.tabs.push(entry);
      button.addEventListener("click", () => {
        void this.switchTab(cfg.id);
      });
    }
    await this.switchTab(this.activeTab);
  }
  async onClose() {
    for (const entry of this.tabs) {
      if (entry.tab) {
        entry.tab.destroy();
        entry.tab = null;
        entry.mounted = false;
      }
    }
    this.tabs = [];
  }
  /** Switch to a tab. Lazily mounts on first visit. */
  async switchTab(id) {
    this.activeTab = id;
    if (this.tabs.length === 0) {
      await this.onOpen();
      return;
    }
    for (const entry of this.tabs) {
      const isActive = entry.id === id;
      entry.container.style.display = isActive ? "" : "none";
      entry.button.classList.toggle("is-active", isActive);
      entry.button.setAttribute("aria-selected", String(isActive));
      if (isActive && !entry.mounted) {
        entry.tab = this.createTab(entry.id);
        await entry.tab.mount(entry.container);
        entry.mounted = true;
      }
    }
  }
  renderSetupPrompt(container) {
    const prompt = container.createEl("div", { cls: "vault-mind-setup-prompt" });
    prompt.createEl("h3", { text: "Vault Mind" });
    prompt.createEl("p", {
      text: "This vault hasn't been initialized yet. Open Settings to set up pi-vault-mind."
    });
    const btn = prompt.createEl("button", { text: "Open Settings", cls: "mod-cta" });
    btn.addEventListener("click", () => {
      const setting = this.app.setting;
      setting.open();
      setting.openTabById(this.deps.plugin.manifest.id);
    });
  }
  createTab(id) {
    const { deps } = this;
    switch (id) {
      case "chat": {
        const initialCommand = deps.plugin.pendingChatMessage;
        deps.plugin.pendingChatMessage = null;
        return new ChatTab({
          app: this.app,
          leaf: this.leaf,
          vaultPath: deps.vaultPath,
          piConfigDir: deps.piConfigDir,
          settings: deps.chatSettings,
          messageStore: deps.messageStore,
          onStoreFlush: () => deps.plugin.flushMessageStore(),
          initialCommand: initialCommand ?? void 0
        });
      }
      case "queue":
        return new QueueTab({
          app: this.app,
          settings: deps.settings,
          vaultPath: deps.vaultPath
        });
      case "status":
        return new StatusTab({
          app: this.app,
          settings: deps.settings,
          vaultPath: deps.vaultPath,
          piConfigDir: deps.piConfigDir,
          systemMdPath: deps.systemMdPath,
          piBinaryPath: deps.piBinaryPath,
          updateStatusBar: (connected, error) => {
            deps.plugin.updateStatusBar(connected, error);
          }
        });
      case "search":
        return new SearchTab({
          app: this.app,
          settings: deps.settings,
          vaultPath: deps.vaultPath
        });
    }
  }
};

// src/main.ts
var execAsync = (0, import_node_util.promisify)(import_node_child_process3.exec);
var DEFAULT_EMBEDDING_MODEL = "embeddinggemma";
var DEFAULT_OLLAMA_EMBEDDING_URL = "http://127.0.0.1:11434/v1";
var MODAL_APP_BASE_URL_SUFFIX = "--pi-vault-mind-embed-embeddingservice-fastapi-app.modal.run";
function defaultModelRouterChoices() {
  const isMacOS = process.platform === "darwin";
  return {
    primary: isMacOS ? "ollama/gemma4:12b-mlx" : "ollama/gemma4:12b",
    fallbackSequence: isMacOS ? ["ollama/gemma4:e4b", "ollama/gemma4:12b-mlx", "ollama/gemma3:4b", "ollama/*"] : ["ollama/gemma4:e4b", "ollama/gemma4:12b", "ollama/gemma3:4b", "ollama/*"]
  };
}
var modalRemoteUrlForWorkspace = (workspace) => `https://${workspace}${MODAL_APP_BASE_URL_SUFFIX}`;
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var VAULT_MIND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><path d="M9 21h6"/><path d="M10 9a2 2 0 0 1 4 0"/><path d="M8 12h1"/><path d="M15 12h1"/><circle cx="12" cy="6" r="1"/></svg>`;
var DEFAULT_SETTINGS = {
  host: "127.0.0.1",
  port: 11435,
  piBinaryPath: "pi",
  checkExtensionOnStartup: true,
  includeEditorContext: true,
  includeFilePicker: true,
  includeSlashCommands: true,
  resumeSession: true
};
var VaultMindSettingTab = class extends import_obsidian19.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const piDir = import_node_path3.default.join(this.plugin.vaultPath, ".pi");
    const hasExtensions = (0, import_node_fs3.existsSync)(
      import_node_path3.default.join(piDir, "agent", "npm", "node_modules", "pi-vault-mind")
    );
    this.renderInitSection(containerEl, hasExtensions);
    new import_obsidian19.Setting(containerEl).setName("Connection").setHeading();
    new import_obsidian19.Setting(containerEl).setName("Host").setDesc("HTTP server host").addText(
      (text) => text.setPlaceholder("127.0.0.1").setValue(this.plugin.settings.host).onChange(async (value) => {
        this.plugin.settings.host = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Port").setDesc("HTTP server port").addText(
      (text) => text.setPlaceholder("11435").setValue(String(this.plugin.settings.port)).onChange(async (value) => {
        const n = Number.parseInt(value, 10);
        this.plugin.settings.port = Number.isNaN(n) ? 11435 : n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Pi binary path").setDesc("Path to the pi executable for the chat view").addText(
      (text) => text.setPlaceholder("pi").setValue(this.plugin.settings.piBinaryPath).onChange(async (value) => {
        this.plugin.settings.piBinaryPath = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Check extension on startup").setDesc("Detect whether pi-vault-mind is installed in your pi session when Obsidian starts").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.checkExtensionOnStartup).onChange(async (value) => {
        this.plugin.settings.checkExtensionOnStartup = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Include editor context").setDesc("Send the active note path and selection with chat messages").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeEditorContext).onChange(async (value) => {
        this.plugin.settings.includeEditorContext = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Include file picker").setDesc("Allow @ references in the chat input to attach vault files as context").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeFilePicker).onChange(async (value) => {
        this.plugin.settings.includeFilePicker = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Include slash commands").setDesc("Allow / references in the chat input to run Pi commands").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeSlashCommands).onChange(async (value) => {
        this.plugin.settings.includeSlashCommands = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Resume session on startup").setDesc("Automatically resume the last chat session when opening the panel").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.resumeSession).onChange(async (value) => {
        this.plugin.settings.resumeSession = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Folder layout").setHeading();
    new import_obsidian19.Setting(containerEl).setName("Inbox").setDesc("Agent input folder (default: Agent/Inbox)").addText(
      (text) => text.setPlaceholder("Agent/Inbox").onChange(async (value) => {
        await this.saveFolderSetting("inbox", value);
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Library").setDesc("Knowledge output folder (default: Agent/Library)").addText(
      (text) => text.setPlaceholder("Agent/Library").onChange(async (value) => {
        await this.saveFolderSetting("library", value);
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Presentations").setDesc("Broadcaster output folder (default: Agent/Presentations)").addText(
      (text) => text.setPlaceholder("Agent/Presentations").onChange(async (value) => {
        await this.saveFolderSetting("presentations", value);
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Journal").setDesc("Audit/checkpoint trail folder (default: Agent/Journal)").addText(
      (text) => text.setPlaceholder("Agent/Journal").onChange(async (value) => {
        await this.saveFolderSetting("journal", value);
      })
    );
    new import_obsidian19.Setting(containerEl).setName("Token storage").setHeading();
    const tokenStatus = new import_obsidian19.Setting(containerEl).setName("API token").setDesc("Checking token source...");
    void this.getTokenSourceDescription().then((description) => {
      tokenStatus.setDesc(description);
    }).catch(() => {
      tokenStatus.setDesc("Not configured.");
    });
  }
  async saveFolderSetting(key, value) {
    const token = await resolveToken(this.app);
    if (!token) {
      this.plugin.showNotice("no API token configured");
      return;
    }
    const client = new VaultMindClient({
      host: this.plugin.settings.host,
      port: readServerPort(this.plugin.vaultPath) ?? this.plugin.settings.port,
      token
    });
    try {
      await client.setup({
        folders: { [key]: value || void 0 }
      });
      this.plugin.showNotice(`${key} folder saved`);
    } catch (err) {
      this.plugin.showNotice(`failed to save ${key} folder \u2014 ${err.message}`);
    }
  }
  async getTokenSourceDescription() {
    if (process.env.PVM_API_TOKEN) {
      return "Configured from PVM_API_TOKEN environment variable.";
    }
    if (await resolveToken(this.app)) {
      return "Configured in Obsidian keychain.";
    }
    if ((0, import_node_fs3.existsSync)(import_node_path3.default.join(this.plugin.vaultPath, ".env.1pass"))) {
      return ".env.1pass is present; pi-1password resolves the token when pi starts.";
    }
    return "Not configured. Set PVM_API_TOKEN, store a token in Obsidian keychain, or add .env.1pass.";
  }
  getInstalledExtensionVersion() {
    const packageJsonPath = import_node_path3.default.join(
      this.plugin.vaultPath,
      ".pi",
      "agent",
      "npm",
      "node_modules",
      "pi-vault-mind",
      "package.json"
    );
    if (!(0, import_node_fs3.existsSync)(packageJsonPath)) return null;
    try {
      const manifest = JSON.parse((0, import_node_fs3.readFileSync)(packageJsonPath, "utf-8"));
      return typeof manifest.version === "string" && manifest.version.length > 0 ? manifest.version : null;
    } catch {
      return null;
    }
  }
  renderInitSection(containerEl, configured) {
    new import_obsidian19.Setting(containerEl).setName("Vault initialization").setHeading();
    const piBinary = detectPiBinary(this.plugin.settings.piBinaryPath, this.plugin.vaultPath);
    if (!configured && !piBinary) {
      containerEl.createEl("p", {
        cls: "setting-item-description",
        text: "Could not find the pi binary. Install pi first, then reopen settings."
      });
      return;
    }
    const initSection = containerEl.createEl("div");
    const runInitialization = async (btn) => {
      btn.setButtonText("Initializing...");
      btn.setDisabled(true);
      const progress = initSection.createEl("div", {
        cls: "vault-mind-init-progress"
      });
      if (!piBinary) {
        this.addStep(
          progress,
          "error",
          "Could not find the pi binary. Install pi first, then reopen settings."
        );
        this.plugin.showNotice("could not find the pi binary");
        btn.setButtonText(configured ? "Reinitialize" : "Retry");
        btn.setDisabled(false);
        return;
      }
      try {
        await this.runInit(piBinary, progress);
        this.plugin.showNotice("vault initialized \u2014 configure embedding");
        const step6 = this.addStep(progress, "active", "Configure embedding...");
        this.renderInitConfigForm(progress, step6);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.addStep(progress, "error", `Failed: ${message}`);
        this.plugin.showNotice(`${message}`);
        btn.setButtonText(configured ? "Reinitialize" : "Retry");
        btn.setDisabled(false);
      }
    };
    if (configured) {
      const version = this.getInstalledExtensionVersion();
      const statusDesc = version ? `\u2713 Initialized \u2014 extensions installed (pi-vault-mind v${version})` : "\u2713 Initialized \u2014 extensions installed";
      new import_obsidian19.Setting(initSection).setName("Vault status").setDesc(statusDesc).addButton((btn) => {
        btn.setButtonText("Reinitialize").setIcon("refresh-cw").onClick(async () => {
          await runInitialization(btn);
        });
      }).addButton((btn) => {
        btn.setButtonText("Open Chat").setIcon("messages-square").onClick(async () => {
          this.app.setting?.close();
          await this.plugin.openPanel("chat");
        });
      });
      return;
    }
    new import_obsidian19.Setting(initSection).setName("Initialize vault").setDesc(
      "Install pi-vault-mind and pi-context extensions, scaffold config, and write the system prompt."
    ).addButton((btn) => {
      btn.setButtonText("Initialize vault").setIcon("plus-circle").setCta().onClick(async () => {
        await runInitialization(btn);
      });
    });
  }
  renderInitConfigForm(progress, step) {
    const configSection = progress.createEl("div", { cls: "vault-mind-init-config" });
    configSection.createEl("p", { text: "Configure embedding (optional):" });
    let provider = "ollama";
    let ollamaUrl = DEFAULT_OLLAMA_EMBEDDING_URL;
    let ollamaModel = DEFAULT_EMBEDDING_MODEL;
    let modalWorkspace = "";
    let modalRemoteUrl = "";
    let modalToken = "";
    let enableContextAutomation = true;
    const { primary: defaultPrimaryModel, fallbackSequence: defaultFallbackSequence } = defaultModelRouterChoices();
    let primaryModel = defaultPrimaryModel;
    let fallbackSequence = [...defaultFallbackSequence];
    const providerFields = configSection.createEl("div", {
      cls: "vault-mind-init-config-fields"
    });
    const renderProviderFields = () => {
      providerFields.empty();
      if (provider === "ollama") {
        new import_obsidian19.Setting(providerFields).setName("Ollama").setDesc("Local OpenAI-compatible endpoint and embedding model.").addText(
          (text) => text.setPlaceholder(DEFAULT_OLLAMA_EMBEDDING_URL).setValue(ollamaUrl).onChange((value) => {
            ollamaUrl = value;
          })
        ).addText(
          (text) => text.setPlaceholder(DEFAULT_EMBEDDING_MODEL).setValue(ollamaModel).onChange((value) => {
            ollamaModel = value;
          })
        );
        return;
      }
      if (provider === "modal") {
        const statusEl = providerFields.createEl("p", {
          cls: "setting-item-description vault-mind-modal-status",
          text: "Detecting Modal CLI..."
        });
        let workspaceSetting = null;
        new import_obsidian19.Setting(providerFields).setName("Workspace").setDesc("Your Modal workspace slug (auto-detected if modal CLI is available).").addText((text) => {
          workspaceSetting = text;
          text.setPlaceholder("workspace-slug").setValue(modalWorkspace).onChange((value) => {
            modalWorkspace = value;
            modalRemoteUrl = value.trim() ? modalRemoteUrlForWorkspace(value.trim()) : "";
          });
        });
        const tokenSection = providerFields.createEl("div");
        const testStatusEl = providerFields.createEl("p", {
          cls: "setting-item-description vault-mind-modal-app-status",
          text: ""
        });
        new import_obsidian19.Setting(providerFields).setName("").addButton(
          (btn) => btn.setButtonText("Test connection").onClick(async () => {
            const url = modalRemoteUrl || (modalWorkspace.trim() ? modalRemoteUrlForWorkspace(modalWorkspace.trim()) : "");
            if (!url) {
              testStatusEl.setText("Enter a workspace slug first.");
              testStatusEl.removeClass("vault-mind-status-ok");
              testStatusEl.addClass("vault-mind-status-warn");
              return;
            }
            if (!modalToken.trim()) {
              testStatusEl.setText("Enter an API token first.");
              testStatusEl.removeClass("vault-mind-status-ok");
              testStatusEl.addClass("vault-mind-status-warn");
              return;
            }
            btn.setDisabled(true);
            testStatusEl.setText("Testing...");
            let testToken = modalToken.trim();
            if (testToken.startsWith("op://")) {
              const resolved = await this.resolveOpReference(testToken);
              if (!resolved) {
                testStatusEl.setText(
                  "\u26A0 Could not resolve op:// reference. Check 1Password CLI is signed in."
                );
                testStatusEl.removeClass("vault-mind-status-ok");
                testStatusEl.addClass("vault-mind-status-warn");
                btn.setDisabled(false);
                return;
              }
              testToken = resolved;
            }
            try {
              const resp = await fetch(`${url}/models`, {
                headers: { Authorization: `Bearer ${testToken}` },
                signal: AbortSignal.timeout(5e3)
              });
              if (resp.ok) {
                testStatusEl.setText("\u2713 Connection successful");
                testStatusEl.removeClass("vault-mind-status-warn");
                testStatusEl.addClass("vault-mind-status-ok");
              } else {
                let detail = "";
                try {
                  const body = await resp.text();
                  if (body) detail = `: ${body.slice(0, 120)}`;
                } catch {
                }
                testStatusEl.setText(`\u26A0 Server responded ${resp.status}${detail}`);
                testStatusEl.removeClass("vault-mind-status-ok");
                testStatusEl.addClass("vault-mind-status-warn");
              }
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err);
              testStatusEl.setText(`\u26A0 Could not reach server: ${message}`);
              testStatusEl.removeClass("vault-mind-status-ok");
              testStatusEl.addClass("vault-mind-status-warn");
            } finally {
              btn.setDisabled(false);
            }
          })
        );
        void (async () => {
          try {
            const modalBin = detectModalBinary();
            if (modalBin) {
              try {
                const { stdout } = await execAsync(`"${modalBin}" token info`, {
                  timeout: 5e3,
                  env: buildExecEnv()
                });
                const workspace = /Workspace:\s+(\S+)/.exec(stdout)?.[1] ?? null;
                if (workspace) {
                  modalWorkspace = workspace;
                  modalRemoteUrl = modalRemoteUrlForWorkspace(workspace);
                  workspaceSetting?.setValue(workspace);
                  statusEl.setText(`\u2713 Modal CLI detected \u2014 workspace: ${workspace}`);
                  statusEl.addClass("vault-mind-status-ok");
                } else {
                  statusEl.setText("Modal CLI found \u2014 enter workspace slug manually.");
                }
              } catch {
                statusEl.setText(
                  "Modal CLI found but not authenticated \u2014 enter workspace slug manually."
                );
              }
            } else {
              statusEl.setText("Modal CLI not found \u2014 enter workspace slug manually.");
            }
            tokenSection.empty();
            const existingEnvToken = process.env.PVM_API_TOKEN;
            const existingResolvedToken = await resolveToken(this.app);
            if (existingEnvToken) {
              tokenSection.createEl("p", {
                cls: "setting-item-description vault-mind-status-ok",
                text: "\u2713 PVM_API_TOKEN found in environment \u2014 no token entry needed."
              });
            } else if (existingResolvedToken) {
              tokenSection.createEl("p", {
                cls: "setting-item-description vault-mind-status-ok",
                text: "\u2713 Token stored in Obsidian keychain."
              });
              new import_obsidian19.Setting(tokenSection).setName("Replace token").setDesc(
                "Enter a new token to replace the stored one, or leave blank. op:// references are resolved via 1Password and stored in the Obsidian keychain; raw tokens are stored directly in the keychain."
              ).addText((text) => {
                text.inputEl.type = "password";
                text.setPlaceholder("new token or op:// reference").setValue("").onChange((v) => {
                  modalToken = v;
                });
              });
            } else if (hasEnvFile) {
              tokenSection.createEl("p", {
                cls: "setting-item-description vault-mind-status-ok",
                text: "\u2713 op:// reference found in .env.1pass."
              });
            } else {
              const opBin = detectOpBinary();
              const pi1passDir = import_node_path3.default.join(
                this.plugin.vaultPath,
                ".pi",
                "agent",
                "npm",
                "node_modules",
                "pi-1password"
              );
              const pi1passInstalled = (0, import_node_fs3.existsSync)(pi1passDir);
              if (opBin) {
                new import_obsidian19.Setting(tokenSection).setName("API token").setDesc(
                  pi1passInstalled ? "Enter an op:// reference and it will be resolved via 1Password, with the actual token stored in the Obsidian keychain. Paste a raw PVM_API_TOKEN to store it directly in the keychain." : "1Password CLI detected. op:// references will be resolved and the token stored in the Obsidian keychain; raw tokens are stored directly. If 1Password is unavailable, the op:// reference falls back to .env.1pass."
                ).addText((text) => {
                  text.inputEl.type = "password";
                  text.setPlaceholder("op://Private/pi-vault-mind-auth/password").setValue(modalToken).onChange((v) => {
                    modalToken = v;
                  });
                });
              } else {
                new import_obsidian19.Setting(tokenSection).setName("API token").setDesc(
                  "Paste your PVM_API_TOKEN. Stored in Obsidian's secure keychain \u2014 never written to disk in plaintext."
                ).addText((text) => {
                  text.inputEl.type = "password";
                  text.setPlaceholder("PVM_API_TOKEN").setValue(modalToken).onChange((v) => {
                    modalToken = v;
                  });
                });
              }
            }
          } catch {
            tokenSection.empty();
            new import_obsidian19.Setting(tokenSection).setName("API token").setDesc("Paste your PVM_API_TOKEN.").addText((text) => {
              text.inputEl.type = "password";
              text.setPlaceholder("PVM_API_TOKEN").setValue(modalToken).onChange((v) => {
                modalToken = v;
              });
            });
          }
        })();
        return;
      }
      providerFields.createEl("p", {
        cls: "setting-item-description",
        text: "Embedding setup will be skipped for now."
      });
    };
    new import_obsidian19.Setting(configSection).setName("Embedding provider").setDesc("Choose where Vault Mind should send embedding requests.").addDropdown((dropdown) => {
      dropdown.addOption("ollama", "Local Ollama");
      dropdown.addOption("modal", "Modal (cloud)");
      dropdown.addOption("skip", "Skip for now");
      dropdown.setValue(provider);
      dropdown.onChange((value) => {
        provider = value;
        renderProviderFields();
      });
    });
    configSection.appendChild(providerFields);
    renderProviderFields();
    new import_obsidian19.Setting(configSection).setName("Chat models").setHeading();
    new import_obsidian19.Setting(configSection).setName("Primary chat model").setDesc(
      "Default model the model router will use for chat. Examples: ollama/gemma4:12b-mlx, ollama/gemma4:31b-cloud."
    ).addText(
      (text) => text.setPlaceholder(defaultPrimaryModel).setValue(primaryModel).onChange((value) => {
        primaryModel = value.trim() || defaultPrimaryModel;
      })
    );
    new import_obsidian19.Setting(configSection).setName("Fallback model sequence").setDesc(
      "Comma-separated fallback models used when the primary model is rate-limited or unavailable. The wildcard ollama/* means any available Ollama model."
    ).addTextArea((text) => {
      text.setPlaceholder(defaultFallbackSequence.join(", "));
      text.setValue(fallbackSequence.join(", "));
      text.onChange((value) => {
        fallbackSequence = value.split(",").map((m) => m.trim()).filter(Boolean);
      });
    });
    new import_obsidian19.Setting(configSection).setName("Context automation").setDesc("Enable pi-context ACM after setup.").addToggle(
      (toggle) => toggle.setValue(enableContextAutomation).onChange((value) => {
        enableContextAutomation = value;
      })
    ).addButton(
      (btn) => btn.setButtonText("Continue").setCta().onClick(async () => {
        btn.setDisabled(true);
        try {
          await this.writeInitEmbeddingConfig({
            provider,
            ollamaUrl,
            ollamaModel,
            modalWorkspace,
            modalRemoteUrl,
            modalToken,
            enableContextAutomation
          });
          this.writeModelRouterConfig(this.plugin.vaultPath, primaryModel, fallbackSequence);
          this.markDone(step);
          this.plugin.pendingChatMessage = null;
          this.plugin.showNotice("vault initialized \u2014 launching pi");
          this.app.setting?.close();
          await this.plugin.openPanel("chat");
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          this.addStep(progress, "error", `Failed to save config: ${message}`);
          this.plugin.showNotice(`failed to save config \u2014 ${message}`);
          btn.setDisabled(false);
        }
      })
    );
  }
  async writeInitEmbeddingConfig(options) {
    const configPath = import_node_path3.default.join(this.plugin.vaultPath, "pi-vault-mind.config.json");
    const config = (0, import_node_fs3.existsSync)(configPath) ? JSON.parse((0, import_node_fs3.readFileSync)(configPath, "utf-8")) : {};
    const vaultMind = isRecord(config.vaultMind) ? config.vaultMind : {};
    const embedding = {};
    if (options.provider === "ollama") {
      embedding.localUrl = options.ollamaUrl.trim() || DEFAULT_OLLAMA_EMBEDDING_URL;
      embedding.model = options.ollamaModel.trim() || DEFAULT_EMBEDDING_MODEL;
    } else if (options.provider === "modal") {
      const workspace = options.modalWorkspace.trim();
      const remoteUrl = options.modalRemoteUrl.trim() || (workspace ? modalRemoteUrlForWorkspace(workspace) : "");
      if (!remoteUrl) {
        throw new Error("Enter a Modal workspace slug or choose Skip for now.");
      }
      const modalToken = options.modalToken.trim();
      if (modalToken) await this.writeModalToken(modalToken);
      const modal = {
        baseUrl: remoteUrl,
        model: DEFAULT_EMBEDDING_MODEL
      };
      if (workspace) modal.workspace = workspace;
      embedding.remoteUrl = remoteUrl;
      embedding.modal = modal;
    }
    vaultMind.embedding = embedding;
    config.vaultMind = vaultMind;
    const extensionCompatibility = isRecord(config.extensionCompatibility) ? config.extensionCompatibility : {};
    const currentPiContext = isRecord(extensionCompatibility["pi-context"]) ? extensionCompatibility["pi-context"] : {};
    extensionCompatibility["pi-context"] = {
      tagPatterns: [],
      enhanceInjectors: false,
      autoEnableAcm: true,
      indexContextEvents: true,
      ...currentPiContext,
      enabled: options.enableContextAutomation
    };
    config.extensionCompatibility = extensionCompatibility;
    (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
  }
  async resolveOpReference(ref) {
    const opBin = detectOpBinary();
    if (!opBin) return void 0;
    try {
      const { stdout } = await execAsync(`"${opBin}" read "${ref}"`, {
        timeout: 1e4,
        env: buildExecEnv()
      });
      return stdout.trim() || void 0;
    } catch {
      return void 0;
    }
  }
  async writeModalToken(token) {
    const trimmed = token.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("op://")) {
      const resolved = await this.resolveOpReference(trimmed);
      if (resolved) {
        await this.app.secretStorage.setSecret(PVM_TOKEN_SECRET_ID, resolved);
        return;
      }
      this.appendEnvAssignment(
        import_node_path3.default.join(this.plugin.vaultPath, ".env.1pass"),
        "PVM_API_TOKEN",
        trimmed
      );
      return;
    }
    await this.app.secretStorage.setSecret(PVM_TOKEN_SECRET_ID, trimmed);
  }
  appendEnvAssignment(filePath, key, value) {
    const existing = (0, import_node_fs3.existsSync)(filePath) ? (0, import_node_fs3.readFileSync)(filePath, "utf-8") : "";
    const separator = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
    const escapedValue = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    (0, import_node_fs3.writeFileSync)(filePath, `${existing}${separator}${key}="${escapedValue}"
`, "utf-8");
  }
  async runInit(piBinary, progress) {
    const vaultPath = this.plugin.vaultPath;
    const agentDir = import_node_path3.default.join(vaultPath, ".pi", "agent");
    const shell = process.env.SHELL || (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
    const options = {
      shell,
      timeout: 12e4,
      env: buildExecEnv()
    };
    const step1 = this.addStep(progress, "active", "Creating .pi/agent...");
    await execAsync(`mkdir -p '${agentDir.replace(/'/g, "'\\''")}'`, options);
    this.markDone(step1);
    const step2 = this.addStep(progress, "active", "Installing pi-vault-mind...");
    const q = (s) => `'${s.replace(/'/g, "'\\''")}'`;
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-vault-mind`,
      options
    );
    this.markDone(step2);
    const step3 = this.addStep(progress, "active", "Installing pi-context...");
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-context`,
      options
    );
    this.markDone(step3);
    const step3b = this.addStep(progress, "active", "Installing model discovery...");
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:@kylebrodeur/pi-model-discovery`,
      options
    );
    this.markDone(step3b);
    const step3c = this.addStep(progress, "active", "Installing model router...");
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:@kylebrodeur/pi-model-router`,
      options
    );
    this.markDone(step3c);
    const pi1passDir = import_node_path3.default.join(agentDir, "npm", "node_modules", "pi-1password");
    if (!(0, import_node_fs3.existsSync)(pi1passDir)) {
      const opBin = detectOpBinary();
      if (opBin) {
        const step3d = this.addStep(progress, "active", "Installing 1Password support...");
        try {
          await execAsync(
            `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-1password`,
            options
          );
        } catch {
        }
        this.markDone(step3d);
      }
    }
    const step4 = this.addStep(progress, "active", "Scaffolding config...");
    this.scaffoldConfig(vaultPath);
    this.scaffoldModelRouterConfig(agentDir);
    this.markDone(step4);
    const step5 = this.addStep(progress, "active", "Writing system prompt...");
    this.seedPiConfig(vaultPath, agentDir);
    this.markDone(step5);
  }
  scaffoldConfig(vaultPath) {
    const configPath = import_node_path3.default.join(vaultPath, "pi-vault-mind.config.json");
    const collectionsDir = import_node_path3.default.join(vaultPath, "collections");
    if (!(0, import_node_fs3.existsSync)(configPath)) {
      const config = {
        version: 2,
        collections: {
          main: {
            path: "collections/main.jsonl",
            schema: ["id", "domain", "source", "fact", "tag", "artifact"],
            dedupField: "fact"
          }
        },
        vaultMind: {
          dataDir: ".lancedb",
          embedding: {},
          ftsEnabled: true,
          graph: { enabled: true, canvasSync: true }
        }
      };
      (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
    }
    if (!(0, import_node_fs3.existsSync)(collectionsDir)) (0, import_node_fs3.mkdirSync)(collectionsDir, { recursive: true });
    const mainJsonl = import_node_path3.default.join(collectionsDir, "main.jsonl");
    if (!(0, import_node_fs3.existsSync)(mainJsonl)) (0, import_node_fs3.writeFileSync)(mainJsonl, "", "utf-8");
  }
  scaffoldModelRouterConfig(agentDir) {
    const piDir = import_node_path3.default.dirname(agentDir);
    const configPath = import_node_path3.default.join(piDir, "model-router.json");
    if ((0, import_node_fs3.existsSync)(configPath)) return;
    const { primary: mediumModel, fallbackSequence } = defaultModelRouterChoices();
    const config = {
      defaultProfile: "auto",
      features: {
        rateLimitFallback: true,
        ollamaSync: false,
        scopeShim: true,
        perTurnRouting: false,
        intentClassifier: false,
        costBudgeting: false,
        phaseMemory: false,
        contextCompression: false
      },
      rateLimitFallback: {
        enabled: true,
        shortDelayThreshold: 30,
        autoFallback: true,
        autoRestore: true,
        restoreCheckInterval: 300,
        fallbackSequence
      },
      profiles: {
        auto: {
          high: { model: "ollama/gemma4:31b-cloud", thinking: "medium" },
          medium: { model: mediumModel, thinking: "low" },
          low: { model: "ollama/gemma4:e4b", thinking: "off" }
        }
      }
    };
    (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
  }
  /** Update `.pi/model-router.json` with the user's primary/fallback choices. */
  writeModelRouterConfig(vaultPath, primaryModel, fallbackSequence) {
    const configPath = import_node_path3.default.join(vaultPath, ".pi", "model-router.json");
    if (!(0, import_node_fs3.existsSync)(configPath)) return;
    const config = JSON.parse((0, import_node_fs3.readFileSync)(configPath, "utf-8"));
    const profiles = isRecord(config.profiles) ? config.profiles : {};
    const auto = isRecord(profiles.auto) ? profiles.auto : {};
    const medium = isRecord(auto.medium) ? auto.medium : {};
    medium.model = primaryModel;
    auto.medium = medium;
    profiles.auto = auto;
    config.profiles = profiles;
    const rateLimitFallback = isRecord(config.rateLimitFallback) ? config.rateLimitFallback : {};
    rateLimitFallback.fallbackSequence = fallbackSequence;
    config.rateLimitFallback = rateLimitFallback;
    (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
  }
  seedPiConfig(vaultPath, agentDir) {
    const vaultName = this.app.vault.getName();
    const systemMdPath = import_node_path3.default.join(agentDir, "system.md");
    (0, import_node_fs3.mkdirSync)(agentDir, { recursive: true });
    if (!(0, import_node_fs3.existsSync)(systemMdPath)) {
      (0, import_node_fs3.writeFileSync)(
        systemMdPath,
        `You are an AI assistant working inside the ${vaultName} Obsidian vault. Use search and context tools to ground your answers in vault content whenever relevant.`,
        "utf-8"
      );
    }
    const configYamlPath = import_node_path3.default.join(agentDir, "config.yaml");
    if (!(0, import_node_fs3.existsSync)(configYamlPath)) {
      (0, import_node_fs3.writeFileSync)(
        configYamlPath,
        `# pi configuration for the ${vaultName} vault
# Generated by the Vault Mind Obsidian plugin.
`,
        "utf-8"
      );
    }
  }
  addStep(container, status, text) {
    const step = container.createEl("div", {
      cls: `vault-mind-init-step vault-mind-init-step-${status}`
    });
    const iconEl = step.createEl("span", { cls: "vault-mind-init-step-icon" });
    const icon = status === "done" ? "check" : status === "error" ? "x" : "loader";
    (0, import_obsidian19.setIcon)(iconEl, icon);
    step.createEl("span", { text });
    return step;
  }
  markDone(step) {
    step.classList.replace("vault-mind-init-step-active", "vault-mind-init-step-done");
    const icon = step.querySelector(".vault-mind-init-step-icon");
    if (icon) (0, import_obsidian19.setIcon)(icon, "check");
  }
};
var VaultMindPlugin = class extends import_obsidian19.Plugin {
  editorContext = { filePath: null, cursor: null, selection: null };
  connectionState = { connected: false, error: false };
  statusBarItem = null;
  /** Message to auto-send in chat after next panel open (set by init flow) */
  pendingChatMessage = null;
  activeNotices = [];
  contextPushTimer = null;
  async onload() {
    (0, import_obsidian19.addIcon)("vault-mind", VAULT_MIND_ICON);
    for (const staleType of [
      "pi-chat-view",
      "vault-mind-chat",
      "vault-mind-queue",
      "vault-mind-status",
      "vault-mind-setup"
    ]) {
      this.app.workspace.detachLeavesOfType(staleType);
    }
    const existingPanels = this.app.workspace.getLeavesOfType("vault-mind-panel");
    for (let i = 1; i < existingPanels.length; i++) {
      existingPanels[i].detach();
    }
    for (const el of activeDocument.querySelectorAll(".notice")) {
      if (el.textContent?.includes("Vault Mind")) el.remove();
    }
    await this.loadSettings();
    const rawData = await this.loadData() ?? {};
    const savedData = this.withoutLegacyToken(rawData);
    if (isRecord(rawData) && "token" in rawData) {
      await this.saveData(savedData);
    }
    this.messageStore = new MessageStore();
    this.messageStore.load(savedData.messages ?? null);
    this.registerEditorExtension(
      import_view2.EditorView.updateListener.of((update) => {
        if (!update.selectionSet) return;
        const info = update.state.field(import_obsidian19.editorInfoField, false);
        const activeFile = this.app.workspace.getActiveFile();
        if (!info?.file || activeFile?.path !== info.file.path) {
          return;
        }
        const sel = update.state.selection.main;
        this.editorContext.filePath = info.file.path;
        this.editorContext.cursor = sel.from;
        this.editorContext.selection = update.state.doc.sliceString(sel.from, sel.to);
        this.scheduleContextPush();
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        const active = this.app.workspace.getActiveViewOfType(import_obsidian19.MarkdownView);
        if (!active?.file) {
          this.editorContext.filePath = null;
          this.editorContext.cursor = null;
          this.editorContext.selection = null;
          this.scheduleContextPush();
          return;
        }
        this.editorContext.filePath = active.file.path;
        this.editorContext.selection = active.editor.getSelection();
        const from = active.editor.getCursor("from");
        this.editorContext.cursor = active.editor.posToOffset(from);
        this.scheduleContextPush();
      })
    );
    const vaultPath = this.app.vault.adapter.getBasePath?.() || this.app.vault.getName();
    this.vaultPath = vaultPath;
    const piConfigDir = import_node_path3.default.join(vaultPath, ".pi", "agent");
    const systemMdPath = import_node_path3.default.join(piConfigDir, "system.md");
    const panelDeps = {
      vaultPath,
      piConfigDir,
      systemMdPath,
      settings: this.settings,
      piBinaryPath: this.settings.piBinaryPath,
      plugin: this,
      chatSettings: {
        piBinaryPath: this.settings.piBinaryPath,
        workingDirectory: vaultPath,
        defaultProvider: "",
        defaultModel: "",
        sessionSaveDir: "Pi-Sessions",
        persistSessions: true,
        thinkingLevel: "medium",
        rpcTimeout: 6e4
      },
      messageStore: this.messageStore,
      resumeSession: this.settings.resumeSession
    };
    this.registerView(VIEW_TYPE_PANEL, (leaf) => new VaultMindPanel(leaf, panelDeps));
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.addClass("vault-mind-status-bar-item");
    this.statusBarItem.setAttribute("tabindex", "0");
    this.statusBarItem.setAttribute("role", "button");
    this.statusBarItem.setAttribute("aria-label", "Open Vault Mind status");
    this.statusBarItem.createEl("span", { cls: "vault-mind-status-dot" });
    this.statusBarItem.createEl("span", { text: "Vault Mind" });
    this.statusBarItem.addEventListener("click", () => this.openPanel("status"));
    this.statusBarItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void this.openPanel("status");
      }
    });
    const ribbonIconEl = this.addRibbonIcon("vault-mind", "Vault Mind", () => {
      this.openPanel("chat");
    });
    ribbonIconEl.addClass("vault-mind-ribbon-icon");
    ribbonIconEl.setAttribute("tabindex", "0");
    ribbonIconEl.setAttribute("role", "button");
    ribbonIconEl.setAttribute("aria-label", "Open Vault Mind");
    ribbonIconEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void this.openPanel("chat");
      }
    });
    (0, import_obsidian19.setIcon)(ribbonIconEl, "vault-mind");
    this.addCommand({
      id: "open-panel",
      name: "Open panel",
      callback: () => this.openPanel("chat")
    });
    this.addCommand({
      id: "open-queue",
      name: "Open queue",
      callback: () => this.openPanel("queue")
    });
    this.addCommand({
      id: "open-status",
      name: "Open status",
      callback: () => this.openPanel("status")
    });
    this.addCommand({
      id: "open-chat",
      name: "Open chat",
      callback: () => this.openPanel("chat")
    });
    this.addCommand({
      id: "dispatch-agent",
      name: "Dispatch agent",
      callback: () => void this.runDispatchAgentFlow()
    });
    this.addCommand({
      id: "scan-current-file",
      name: "Scan current file for @agent markers",
      callback: () => void this.runScanCurrentFile()
    });
    this.addSettingTab(new VaultMindSettingTab(this.app, this));
    registerVaultMindProtocolHandlers(this);
  }
  onunload() {
    void this.flushMessageStore();
    for (const notice of this.activeNotices) notice.hide();
    this.activeNotices = [];
  }
  /** Create a Notice tracked for cleanup. Auto-dismisses after timeout (default 5s). */
  showNotice(message, timeout = 5e3) {
    const notice = new import_obsidian19.Notice(`Vault Mind: ${message}`, timeout);
    this.activeNotices.push(notice);
    activeWindow.setTimeout(() => {
      const idx = this.activeNotices.indexOf(notice);
      if (idx !== -1) this.activeNotices.splice(idx, 1);
    }, timeout + 200);
    return notice;
  }
  scheduleContextPush() {
    if (this.contextPushTimer) {
      clearTimeout(this.contextPushTimer);
    }
    this.contextPushTimer = activeWindow.setTimeout(() => {
      this.contextPushTimer = null;
      void this.flushContextPush();
    }, 100);
  }
  async flushContextPush() {
    const token = await resolveToken(this.app);
    if (!token) return;
    const client = new VaultMindClient({
      host: this.settings.host,
      port: readServerPort(this.vaultPath) ?? this.settings.port,
      token
    });
    try {
      await client.pushContext(
        this.editorContext.filePath,
        this.editorContext.selection,
        this.editorContext.cursor
      );
    } catch {
    }
  }
  async flushMessageStore() {
    if (!this.messageStore.isDirty()) return;
    const existing = this.withoutLegacyToken(await this.loadData());
    await this.saveData({ ...existing, messages: this.messageStore.serialize() });
  }
  /**
   * Opens the unified panel and switches to the given tab.
   */
  async openPanel(tabId) {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_PANEL);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (!leaf) {
        leaf = workspace.getLeaf(false);
      }
      await leaf.setViewState({ type: VIEW_TYPE_PANEL, active: true });
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
      if (leaf.view instanceof VaultMindPanel) {
        await leaf.view.switchTab(tabId);
      }
    }
  }
  /**
   * Builds a configured VaultMindClient using the current token, host and port.
   * Returns null if no token can be resolved.
   */
  async getVaultMindClient() {
    const token = await resolveToken(this.app);
    if (!token) {
      this.showNotice("No API token configured");
      return null;
    }
    return new VaultMindClient({
      host: this.settings.host,
      port: readServerPort(this.vaultPath) ?? this.settings.port,
      token
    });
  }
  /**
   * Command flow: pick a role, enter an instruction, and dispatch a manual
   * agent job for the active file.
   */
  async runDispatchAgentFlow() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      this.showNotice("No active file");
      return;
    }
    const client = await this.getVaultMindClient();
    if (!client) return;
    new RolePickerModal(this.app, async (role) => {
      const instruction = await new Promise((resolve) => {
        new InstructionInputModal(this.app, `Instruction for ${role}`, resolve).open();
      });
      if (instruction === null || instruction.trim() === "") {
        this.showNotice("No instruction provided");
        return;
      }
      const result = await client.dispatch(role, instruction, activeFile.path);
      if ("error" in result) {
        this.showNotice(`Dispatch failed: ${result.error}`);
      } else {
        this.showNotice(`Dispatched ${role}: ${result.jobId}`);
      }
    }).open();
  }
  /**
   * Command flow: scan the active file for @agent markers and report how many
   * groups were found.
   */
  async runScanCurrentFile() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      this.showNotice("No active file");
      return;
    }
    const client = await this.getVaultMindClient();
    if (!client) return;
    const result = await client.scan(activeFile.path);
    if ("error" in result) {
      this.showNotice(`Scan failed: ${result.error}`);
    } else if (result.groups === 0) {
      this.showNotice("No @agent markers found");
    } else {
      const roles = result.details.map((d) => d.role).join(", ");
      this.showNotice(`Found ${result.groups} @agent group(s): ${roles}`);
    }
  }
  withoutLegacyToken(data) {
    if (!isRecord(data)) return {};
    const existing = {};
    for (const [key, value] of Object.entries(data)) {
      if (key !== "token") existing[key] = value;
    }
    return existing;
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      this.withoutLegacyToken(await this.loadData())
    );
  }
  async saveSettings() {
    const existing = this.withoutLegacyToken(await this.loadData());
    await this.saveData({ ...existing, ...this.settings });
  }
  updateStatusBar(connected, error) {
    this.connectionState = { connected, error };
    const dot = this.statusBarItem?.querySelector(".vault-mind-status-dot");
    if (!dot) return;
    dot.classList.remove("connected", "error");
    if (connected) dot.classList.add("connected");
    else if (error) dot.classList.add("error");
  }
  async openView(type) {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(type);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({ type, active: true });
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
};
