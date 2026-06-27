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
var import_node_child_process4 = require("node:child_process");
var import_node_fs3 = require("node:fs");
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_util = require("node:util");
var import_view2 = require("@codemirror/view");
var import_obsidian18 = require("obsidian");

// src/auth.ts
var import_node_child_process = require("node:child_process");
var fs = __toESM(require("node:fs"), 1);
var os = __toESM(require("node:os"), 1);
var path = __toESM(require("node:path"), 1);
var import_obsidian = require("obsidian");
var ENV_VAR = "PVM_API_TOKEN";
var DOTENV_REL = path.join(".pi", "agent", "vault-mind.env");
var KEYCHAIN_SERVICE = "vault-mind";
var KEYCHAIN_ACCOUNT = "api-token";
var OP_ITEM = "vault-mind-api-token";
function keychainGet() {
  if (!import_obsidian.Platform.isMacOS) return void 0;
  try {
    const result = (0, import_node_child_process.execSync)(
      `security find-generic-password -s "${KEYCHAIN_SERVICE}" -a "${KEYCHAIN_ACCOUNT}" -w`,
      { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }
    );
    return result.trim() || void 0;
  } catch {
    return void 0;
  }
}
function keychainSet(token) {
  if (!import_obsidian.Platform.isMacOS) return false;
  try {
    try {
      (0, import_node_child_process.execSync)(
        `security delete-generic-password -s "${KEYCHAIN_SERVICE}" -a "${KEYCHAIN_ACCOUNT}"`,
        { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }
      );
    } catch {
    }
    (0, import_node_child_process.execSync)(
      `security add-generic-password -s "${KEYCHAIN_SERVICE}" -a "${KEYCHAIN_ACCOUNT}" -w "${token}"`,
      { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }
    );
    return true;
  } catch {
    return false;
  }
}
function keychainDelete() {
  if (!import_obsidian.Platform.isMacOS) return;
  try {
    (0, import_node_child_process.execSync)(`security delete-generic-password -s "${KEYCHAIN_SERVICE}" -a "${KEYCHAIN_ACCOUNT}"`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch {
  }
}
function opGet() {
  try {
    const result = (0, import_node_child_process.execSync)(`op item get "${OP_ITEM}" --fields password --format json`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    const parsed = JSON.parse(result);
    return parsed.value || void 0;
  } catch {
    return void 0;
  }
}
function opSet(token) {
  try {
    try {
      (0, import_node_child_process.execSync)(`op item edit "${OP_ITEM}" password="${token}"`, {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"]
      });
      return true;
    } catch {
      (0, import_node_child_process.execSync)(`op item create --category=password --title="${OP_ITEM}" password="${token}"`, {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"]
      });
      return true;
    }
  } catch {
    return false;
  }
}
function opAvailable() {
  try {
    (0, import_node_child_process.execSync)("op account list", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return true;
  } catch {
    return false;
  }
}
var readDotenvToken = () => {
  const home = os.homedir();
  if (!home) return void 0;
  const p = path.join(home, DOTENV_REL);
  if (!fs.existsSync(p)) return void 0;
  try {
    for (const line of fs.readFileSync(p, "utf-8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (key !== ENV_VAR) continue;
      let value = trimmed.slice(eq + 1).trim();
      if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      return value || void 0;
    }
  } catch {
  }
  return void 0;
};
var TokenStore = class {
  data;
  saveData;
  vaultPath = null;
  constructor(data, saveData) {
    this.data = data;
    this.saveData = saveData;
  }
  /** Set the vault path for local .env file operations. */
  setVaultPath(vaultPath) {
    this.vaultPath = vaultPath;
  }
  /** Current storage backend. */
  getMode() {
    return this.data.backend ?? "none";
  }
  /** List available backends for the current platform. */
  availableBackends() {
    const backends = [];
    if (import_obsidian.Platform.isMacOS) backends.push("keychain");
    if (opAvailable()) backends.push("1password");
    backends.push("envfile");
    return backends;
  }
  /** True when macOS Keychain is usable. */
  isKeychainAvailable() {
    return import_obsidian.Platform.isMacOS;
  }
  /**
   * Get the resolved token.
   * Order: configured backend → vault .env → global dotenv → env var.
   */
  async getToken() {
    const backend = this.data.backend;
    if (backend === "keychain") {
      const t2 = keychainGet();
      if (t2) return t2;
    } else if (backend === "1password") {
      const t2 = opGet();
      if (t2) return t2;
    } else if (backend === "envfile") {
      const t2 = this.readVaultEnv();
      if (t2) return t2;
    }
    const vaultEnv = this.readVaultEnv();
    if (vaultEnv) return vaultEnv;
    const dotenv = readDotenvToken();
    if (dotenv) return dotenv;
    return process.env[ENV_VAR] || void 0;
  }
  /** Store a token using the specified backend. */
  async setToken(token, backend) {
    const target = backend ?? this.data.backend ?? this.defaultBackend();
    if (target === "keychain") {
      if (!keychainSet(token)) return false;
      this.data = { backend: "keychain" };
    } else if (target === "1password") {
      if (!opSet(token)) return false;
      this.data = { backend: "1password" };
    } else {
      this.writeVaultEnv(token);
      this.data = { backend: "envfile" };
    }
    await this.saveData(this.data);
    return true;
  }
  /** Import from the global dotenv and store in the preferred backend. */
  async importFromDotenv() {
    const token = readDotenvToken();
    if (!token) return false;
    return this.setToken(token);
  }
  /** Remove the stored token. */
  async forgetToken() {
    if (this.data.backend === "keychain") keychainDelete();
    if (this.data.backend === "envfile") this.deleteVaultEnv();
    this.data = {};
    await this.saveData(this.data);
  }
  /**
   * Opt in to storing the token in plaintext (envfile backend) after user confirms.
   * Returns true if confirmation matches and the backend was switched.
   */
  async optInToInsecure(confirmation) {
    if (confirmation !== "INSECURE") return false;
    this.data = { backend: "envfile" };
    await this.saveData(this.data);
    return true;
  }
  defaultBackend() {
    if (import_obsidian.Platform.isMacOS) return "keychain";
    return "envfile";
  }
  vaultEnvPath() {
    if (!this.vaultPath) return null;
    return path.join(this.vaultPath, ".pi", "agent", "vault-mind.env");
  }
  readVaultEnv() {
    const p = this.vaultEnvPath();
    if (!p || !fs.existsSync(p)) return void 0;
    try {
      for (const line of fs.readFileSync(p, "utf-8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        if (key !== ENV_VAR) continue;
        let value = trimmed.slice(eq + 1).trim();
        if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        return value || void 0;
      }
    } catch {
      return void 0;
    }
    return void 0;
  }
  writeVaultEnv(token) {
    const p = this.vaultEnvPath();
    if (!p) return;
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, `${ENV_VAR}="${token}"
`, { encoding: "utf-8", mode: 384 });
  }
  deleteVaultEnv() {
    const p = this.vaultEnvPath();
    if (p && fs.existsSync(p)) fs.unlinkSync(p);
  }
};

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
  async pushContext(filePath, selection, cursor) {
    return await this.httpJson("POST", "/vault-mind/context", {
      filePath,
      selection,
      cursor
    });
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

// src/pi-detect.ts
var import_node_child_process2 = require("node:child_process");
var fs2 = __toESM(require("node:fs"), 1);
var os2 = __toESM(require("node:os"), 1);
var path3 = __toESM(require("node:path"), 1);
function resolvePnpmHome() {
  if (process.env.PNPM_HOME) return process.env.PNPM_HOME;
  if (process.platform === "darwin") return path3.join(os2.homedir(), "Library", "pnpm");
  return path3.join(os2.homedir(), ".local", "share", "pnpm");
}
function detectFnm() {
  const fnmRoot = path3.join(os2.homedir(), ".local", "share", "fnm");
  if (!fs2.existsSync(fnmRoot)) return null;
  const binDir = path3.join(fnmRoot, "aliases", "default", "bin");
  const node = path3.join(binDir, "node");
  if (!fs2.existsSync(node)) return null;
  return {
    node,
    pnpm: fs2.existsSync(path3.join(binDir, "pnpm")) ? path3.join(binDir, "pnpm") : null,
    binDir,
    source: "fnm",
    pnpmHome: resolvePnpmHome()
  };
}
function detectNvm() {
  const nvmDir = process.env.NVM_DIR || path3.join(os2.homedir(), ".nvm");
  const aliasFile = path3.join(nvmDir, "alias", "default");
  let version;
  try {
    version = fs2.readFileSync(aliasFile, "utf-8").trim();
  } catch {
    return null;
  }
  if (!version.startsWith("v") && /^\d/.test(version)) version = `v${version}`;
  if (!version.startsWith("v")) return null;
  const binDir = path3.join(nvmDir, "versions", "node", version, "bin");
  if (!fs2.existsSync(path3.join(binDir, "node"))) return null;
  return {
    node: path3.join(binDir, "node"),
    pnpm: fs2.existsSync(path3.join(binDir, "pnpm")) ? path3.join(binDir, "pnpm") : null,
    binDir,
    source: `nvm (${version})`,
    pnpmHome: resolvePnpmHome(),
    nvmDir,
    nvmBin: binDir
  };
}
function detectFallback() {
  const pnpmHome = resolvePnpmHome();
  if (fs2.existsSync(path3.join(pnpmHome, "pnpm")) || fs2.existsSync(path3.join(pnpmHome, "pi"))) {
    return {
      pnpm: path3.join(pnpmHome, "pnpm"),
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
  dirs.push("/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin", "/usr/sbin", "/sbin");
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
function resolveNodeBinDir() {
  return detectRuntime()?.binDir ?? null;
}
function detectPiBinary(configured, vaultPath) {
  if (path3.isAbsolute(configured) && fs2.existsSync(configured)) {
    return configured;
  }
  const shellPath = whichPi(configured);
  if (shellPath) return shellPath;
  const home = os2.homedir();
  const pnpmHome = process.env.PNPM_HOME || (process.platform === "darwin" ? path3.join(home, "Library", "pnpm") : path3.join(home, ".local", "share", "pnpm"));
  const candidates = [
    // System npm global installs (base case — no version manager)
    "/usr/local/bin/pi",
    "/opt/homebrew/bin/pi",
    path3.join(home, ".npm-global", "bin", "pi"),
    path3.join(home, ".local", "bin", "pi"),
    // pnpm global (PNPM_HOME)
    path3.join(pnpmHome, "pi")
  ];
  const nodeBin = resolveNodeBinDir();
  if (nodeBin && nodeBin !== "/usr/local/bin" && nodeBin !== "/opt/homebrew/bin") {
    candidates.push(path3.join(nodeBin, "pi"));
  }
  candidates.push(
    // Less common locations
    path3.join(home, ".pi", "bin", "pi")
  );
  if (vaultPath) {
    candidates.unshift(path3.join(vaultPath, "node_modules", ".bin", "pi"));
  }
  for (const candidate of candidates) {
    if (fs2.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}
function whichPi(name) {
  const shell = process.env.SHELL || (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
  const cmd = process.platform === "win32" ? `where ${name}` : `which ${name}`;
  try {
    const result = (0, import_node_child_process2.execSync)(cmd, {
      encoding: "utf-8",
      shell,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5e3,
      env: { ...process.env }
    });
    const resolved = result.trim().split("\n")[0];
    if (resolved && fs2.existsSync(resolved)) {
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

// src/views/panel.ts
var import_node_fs2 = require("node:fs");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_obsidian17 = require("obsidian");

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
var import_obsidian13 = require("obsidian");

// src/chat/attachments.ts
var import_obsidian4 = require("obsidian");

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
  "renderer.arguments": "Arguments",
  "renderer.copyTooltip": "Copy message",
  "renderer.errorLabel": "Error: ",
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
  "sessionPanel.title": "Sessions",
  "sessionPanel.today": "Today {{time}}",
  "sessionPanel.yesterday": "Yesterday {{time}}",
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

// src/chat/attachments.ts
var FileSuggestModal = class extends import_obsidian4.FuzzySuggestModal {
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
        new import_obsidian4.Notice(t("notices.fileTooLarge", { size: sizeMB }));
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
      new import_obsidian4.Notice(t("notices.fileReadFailed"));
    }
  }
};

// src/chat/commands.ts
var import_obsidian5 = require("obsidian");
var CommandSuggestModal = class extends import_obsidian5.FuzzySuggestModal {
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

// src/chat/input.ts
var import_obsidian6 = require("obsidian");
var ChatInput = class {
  containerEl;
  textareaEl;
  attachmentsEl;
  callbacks;
  attachments = [];
  enabled = true;
  isComposing = false;
  constructor(containerEl, callbacks) {
    this.containerEl = containerEl;
    this.callbacks = callbacks;
    this.containerEl.empty();
    this.attachmentsEl = this.containerEl.createDiv({ cls: "pi-attachments" });
    const inputArea = this.containerEl.createDiv({ cls: "pi-input-area" });
    this.textareaEl = inputArea.createEl("textarea", {
      cls: "pi-input-textarea",
      attr: {
        placeholder: "Message pi... (/ for commands, @ for files)",
        rows: "1"
      }
    });
    this.textareaEl.addEventListener("keydown", (e) => this.handleKeydown(e));
    this.textareaEl.addEventListener("input", () => this.autoResize());
    this.textareaEl.addEventListener("paste", (e) => this.handlePaste(e));
    this.textareaEl.addEventListener("compositionstart", () => {
      this.isComposing = true;
    });
    this.textareaEl.addEventListener("compositionend", () => {
      this.isComposing = false;
    });
  }
  /**
   * Focus the textarea.
   */
  focus() {
    this.textareaEl.focus();
  }
  /**
   * Enable or disable the input. Disabled during streaming.
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    this.textareaEl.disabled = !enabled;
    if (enabled) {
      this.textareaEl.classList.remove("pi-input-disabled");
    } else {
      this.textareaEl.classList.add("pi-input-disabled");
    }
  }
  /**
   * Get the current text value.
   */
  getValue() {
    return this.textareaEl.value;
  }
  /**
   * Update the placeholder text.
   */
  setPlaceholder(text) {
    this.textareaEl.placeholder = text;
  }
  /**
   * Set the textarea value programmatically (used by command completion).
   */
  setValue(text) {
    this.textareaEl.value = text;
    this.autoResize();
  }
  /**
   * Add an attachment (file or image) and show it as a chip.
   */
  addAttachment(attachment) {
    this.attachments.push(attachment);
    this.renderAttachments();
  }
  /**
   * Remove an attachment by index.
   */
  removeAttachment(index) {
    if (index >= 0 && index < this.attachments.length) {
      this.attachments.splice(index, 1);
      this.renderAttachments();
    }
  }
  /**
   * Get current attachments.
   */
  getAttachments() {
    return [...this.attachments];
  }
  /**
   * Clear all attachments.
   */
  clearAttachments() {
    this.attachments = [];
    this.renderAttachments();
  }
  /**
   * Get the input area element (for appending abort button, etc).
   */
  getInputAreaEl() {
    return this.textareaEl.parentElement ?? this.textareaEl;
  }
  /**
   * Clean up event listeners.
   */
  destroy() {
    this.containerEl.empty();
    this.attachments = [];
  }
  // --- Private ---
  handleKeydown(e) {
    if (!this.enabled) return;
    if (e.key === "Enter" && !e.shiftKey && !this.isComposing) {
      e.preventDefault();
      this.send();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && this.isComposing) {
      return;
    }
    if (e.key === "/" && this.callbacks.onSlashTyped) {
      window.setTimeout(() => {
        if (this.textareaEl.value.startsWith("/")) {
          this.callbacks.onSlashTyped?.();
        }
      }, 0);
    }
    if (e.key === "@" && this.callbacks.onAtTyped) {
      window.setTimeout(() => this.callbacks.onAtTyped?.(), 0);
    }
  }
  send() {
    const text = this.textareaEl.value.trim();
    if (!text && this.attachments.length === 0) return;
    this.callbacks.onSend(text, [...this.attachments]);
    this.textareaEl.value = "";
    this.attachments = [];
    this.renderAttachments();
    this.autoResize();
  }
  autoResize() {
    const el = this.textareaEl;
    el.setCssProps({ "--pi-input-height": "auto" });
    const computedHeight = Math.min(el.scrollHeight, 200);
    el.setCssProps({ "--pi-input-height": `${computedHeight}px` });
  }
  handlePaste(e) {
    if (!e.clipboardData) return;
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        const mimeType = item.type;
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
          if (sizeBytes > 5 * 1024 * 1024) {
            new import_obsidian6.Notice(`Image too large (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB). Max 5MB.`);
            return;
          }
          this.addAttachment({
            type: "image",
            name: `pasted-image-${Date.now()}.${mimeType.split("/")[1] || "png"}`,
            content: base64,
            mimeType,
            size: sizeBytes
          });
        };
        reader.onerror = () => {
          console.error("[ChatInput] FileReader error:", reader.error);
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  }
  renderAttachments() {
    this.attachmentsEl.empty();
    if (this.attachments.length === 0) {
      this.attachmentsEl.addClass("is-hidden");
      return;
    }
    this.attachmentsEl.removeClass("is-hidden");
    this.attachments.forEach((att, index) => {
      const chip = this.attachmentsEl.createDiv({ cls: "pi-attachment-chip" });
      if (att.type === "image") {
        chip.createEl("img", {
          cls: "pi-attachment-thumb",
          attr: {
            src: `data:${att.mimeType};base64,${att.content}`,
            alt: att.name
          }
        });
      }
      chip.createSpan({
        text: att.name,
        cls: "pi-attachment-name",
        attr: { title: att.name }
      });
      if (att.size != null) {
        const sizeKB = att.size / 1024;
        const sizeText = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(1)} KB`;
        chip.createSpan({ text: ` (${sizeText})`, cls: "pi-attachment-size" });
      }
      const removeBtn = chip.createSpan({
        text: "\xD7",
        cls: "pi-attachment-remove",
        attr: { "aria-label": "Remove attachment" }
      });
      removeBtn.addEventListener("click", () => {
        this.removeAttachment(index);
        this.focus();
      });
    });
  }
};

// src/chat/message-types.ts
function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// src/chat/notices.ts
var import_obsidian7 = require("obsidian");
function showCriticalNotice(message) {
  new import_obsidian7.Notice(message, 0);
}

// src/chat/permission-modal.ts
var import_obsidian8 = require("obsidian");
var PermissionSelectModal = class extends import_obsidian8.Modal {
  title;
  options;
  selectedOption = null;
  onResponse;
  constructor(app, title, options, onResponse) {
    super(app);
    this.title = title;
    this.options = options;
    this.onResponse = onResponse;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("pi-permission-modal");
    contentEl.createEl("h2", { text: this.title });
    const optionsContainer = contentEl.createDiv({ cls: "pi-permission-options" });
    for (const option of this.options) {
      const btn = optionsContainer.createEl("button", {
        cls: "pi-permission-option-btn",
        text: option,
        attr: { type: "button" }
      });
      btn.addEventListener("click", () => {
        this.selectedOption = option;
        this.close();
      });
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectedOption = option;
          this.close();
        }
      });
    }
    const cancelBtn = contentEl.createEl("button", {
      cls: "pi-permission-cancel-btn",
      text: t("modals.cancel"),
      attr: { type: "button" }
    });
    cancelBtn.addEventListener("click", () => {
      this.close();
    });
    cancelBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.close();
      }
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    if (this.selectedOption) {
      this.onResponse({ value: this.selectedOption });
    } else {
      this.onResponse({ cancelled: true });
    }
  }
};
var PermissionConfirmModal = class extends import_obsidian8.Modal {
  title;
  message;
  confirmed = false;
  onResponse;
  constructor(app, title, message, onResponse) {
    super(app);
    this.title = title;
    this.message = message;
    this.onResponse = onResponse;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("pi-permission-modal");
    contentEl.createEl("h2", { text: this.title });
    if (this.message) {
      contentEl.createEl("p", { text: this.message });
    }
    const buttonsContainer = contentEl.createDiv({ cls: "pi-permission-buttons" });
    const confirmBtn = buttonsContainer.createEl("button", {
      cls: "pi-permission-confirm-btn",
      text: t("modals.confirmYes"),
      attr: { type: "button" }
    });
    confirmBtn.addEventListener("click", () => {
      this.confirmed = true;
      this.close();
    });
    confirmBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.confirmed = true;
        this.close();
      }
    });
    const cancelBtn = buttonsContainer.createEl("button", {
      cls: "pi-permission-cancel-btn",
      text: t("modals.confirmNo"),
      attr: { type: "button" }
    });
    cancelBtn.addEventListener("click", () => {
      this.close();
    });
    cancelBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.close();
      }
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    this.onResponse({ confirmed: this.confirmed });
  }
};
var PermissionInputModal = class extends import_obsidian8.Modal {
  title;
  message;
  placeholder;
  initialValue;
  inputValue = null;
  onResponse;
  constructor(app, title, message, placeholder, initialValue, onResponse) {
    super(app);
    this.title = title;
    this.message = message;
    this.placeholder = placeholder;
    this.initialValue = initialValue;
    this.onResponse = onResponse;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("pi-permission-modal");
    contentEl.createEl("h2", { text: this.title });
    if (this.message) {
      contentEl.createEl("p", { text: this.message });
    }
    const inputEl = contentEl.createEl("input", {
      cls: "pi-permission-input",
      attr: {
        type: "text",
        placeholder: this.placeholder,
        value: this.initialValue,
        "aria-label": this.title
      }
    });
    inputEl.addEventListener("input", () => {
      this.inputValue = inputEl.value;
    });
    inputEl.focus();
    const buttonsContainer = contentEl.createDiv({ cls: "pi-permission-buttons" });
    const submitBtn = buttonsContainer.createEl("button", {
      cls: "pi-permission-confirm-btn",
      text: t("modals.submit"),
      attr: { type: "button" }
    });
    submitBtn.addEventListener("click", () => {
      this.inputValue = inputEl.value;
      this.close();
    });
    submitBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.inputValue = inputEl.value;
        this.close();
      }
    });
    const cancelBtn2 = buttonsContainer.createEl("button", {
      cls: "pi-permission-cancel-btn",
      text: t("modals.cancel"),
      attr: { type: "button" }
    });
    cancelBtn2.addEventListener("click", () => {
      this.inputValue = null;
      this.close();
    });
    cancelBtn2.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.inputValue = null;
        this.close();
      }
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    if (this.inputValue !== null) {
      this.onResponse({ value: this.inputValue });
    } else {
      this.onResponse({ cancelled: true });
    }
  }
};

// src/chat/renderer.ts
var import_obsidian9 = require("obsidian");
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
      new import_obsidian9.Notice(t("notices.renderError"));
    }
  }
  /**
   * Render an assistant message as Obsidian-flavored markdown.
   * Returns the wrapper element for use by streaming logic.
   */
  renderAssistantMessage(container, markdown, sourcePath, component, thinkingContent, error) {
    const wrapper = container.createDiv({ cls: "pi-message pi-message-assistant" });
    const label = wrapper.createDiv({ cls: "pi-message-label" });
    label.createSpan({ text: "Pi", cls: "pi-message-label-text" });
    if (error) {
      const errorEl = wrapper.createDiv({ cls: "pi-message-error" });
      errorEl.createEl("strong", { text: t("renderer.errorLabel") });
      errorEl.createSpan({ text: error });
    }
    if (thinkingContent) {
      const thinkingEl = wrapper.createEl("details", { cls: "pi-thinking" });
      thinkingEl.createEl("summary", { text: t("renderer.thinkingSummary") });
      const thinkingContentEl = thinkingEl.createDiv({ cls: "pi-thinking-content" });
      import_obsidian9.MarkdownRenderer.render(
        this.app,
        thinkingContent,
        thinkingContentEl,
        sourcePath,
        component
      ).catch((err) => {
        console.error("[Pi Chat] Thinking render error:", err);
        thinkingContentEl.setText(thinkingContent);
        this.showRenderError();
      });
    }
    const contentEl = wrapper.createDiv({ cls: "pi-message-content" });
    if (markdown) {
      import_obsidian9.MarkdownRenderer.render(this.app, markdown, contentEl, sourcePath, component).catch((err) => {
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
  renderToolCall(container, toolName, args, result, isError, component) {
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
        import_obsidian9.MarkdownRenderer.render(this.app, result, resultContent, "", component).catch((err) => {
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

// src/chat/session-panel.ts
var import_obsidian12 = require("obsidian");

// src/chat/session-list.ts
var import_obsidian10 = require("obsidian");
var EMPTY_PREVIEW = "__EMPTY_PREVIEW__";

// src/chat/session-scanner.ts
var import_obsidian11 = require("obsidian");
var _readFile;
var _readdir;
var _stat;
var _join;
var _basename;
var _homedir;
if (import_obsidian11.Platform.isDesktop) {
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
    this.sessionsDir = sessionsDir || (import_obsidian11.Platform.isDesktop ? _join(_homedir(), ".pi", "agent", "sessions") : "");
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

// src/chat/session-panel.ts
var SessionPanel = class {
  containerEl;
  listEl;
  searchEl;
  scanner;
  callbacks;
  app;
  sessions = [];
  visible = false;
  currentSessionPath = null;
  constructor(parentEl, callbacks, app, sessionsDir) {
    this.callbacks = callbacks;
    this.app = app;
    this.scanner = new SessionScanner(sessionsDir);
    this.containerEl = parentEl.createDiv({ cls: "pi-session-panel is-hidden" });
    const header = this.containerEl.createDiv({ cls: "pi-session-panel-header" });
    header.createSpan({ text: t("sessionPanel.title"), cls: "pi-session-panel-title" });
    const closeBtn = header.createEl("button", {
      cls: "pi-session-panel-close",
      attr: { "aria-label": t("sessionPanel.close.tooltip") }
    });
    closeBtn.setText("\xD7");
    closeBtn.addEventListener("click", () => this.hide());
    closeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.hide();
      }
    });
    this.searchEl = this.containerEl.createEl("input", {
      cls: "pi-session-panel-search",
      attr: {
        type: "text",
        placeholder: t("sessionPanel.filterPlaceholder"),
        "aria-label": t("sessionPanel.filterPlaceholder")
      }
    });
    this.searchEl.addEventListener("input", () => this.renderList());
    this.listEl = this.containerEl.createDiv({ cls: "pi-session-panel-list" });
  }
  /**
   * Toggle panel visibility.
   */
  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      void this.show();
    }
  }
  /**
   * Show the panel and refresh session list.
   */
  async show() {
    this.visible = true;
    this.containerEl.removeClass("is-hidden");
    await this.refresh();
    this.searchEl.focus();
  }
  /**
   * Hide the panel.
   */
  hide() {
    this.visible = false;
    this.containerEl.addClass("is-hidden");
  }
  /**
   * Check if the panel is visible.
   */
  isVisible() {
    return this.visible;
  }
  /**
   * Set the current active session path (highlights it in the list).
   */
  setCurrentSession(path6) {
    this.currentSessionPath = path6;
    if (this.visible) {
      this.renderList();
    }
  }
  /**
   * Refresh the session list from disk.
   */
  async refresh() {
    try {
      this.sessions = await this.scanner.scan();
      this.renderList();
    } catch (err) {
      console.error("[SessionPanel] Failed to scan sessions:", err);
      this.listEl.empty();
      this.listEl.createDiv({
        cls: "pi-session-panel-empty",
        text: t("sessionPanel.failedLoad")
      });
    }
  }
  /**
   * Clean up the panel.
   */
  destroy() {
    this.containerEl.remove();
  }
  // --- Private ---
  renderList() {
    this.listEl.empty();
    const filter = this.searchEl.value.trim().toLowerCase();
    const filtered = filter ? this.sessions.filter(
      (s) => s.name.toLowerCase().includes(filter) || s.preview.toLowerCase().includes(filter) || s.cwd.toLowerCase().includes(filter)
    ) : this.sessions;
    if (filtered.length === 0) {
      this.listEl.createDiv({
        cls: "pi-session-panel-empty",
        text: this.sessions.length === 0 ? t("sessionPanel.empty") : t("sessionPanel.noMatch")
      });
      return;
    }
    for (const session of filtered) {
      this.renderSessionEntry(session);
    }
  }
  renderSessionEntry(session) {
    const isCurrent = this.currentSessionPath === session.path;
    const entry = this.listEl.createDiv({
      cls: `pi-session-entry${isCurrent ? " pi-session-entry-active" : ""}`
    });
    const content = entry.createDiv({ cls: "pi-session-entry-content", attr: { tabindex: "0" } });
    content.addEventListener("click", () => {
      void this.callbacks.onSwitch(session);
    });
    content.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void this.callbacks.onSwitch(session);
      }
    });
    content.createDiv({
      cls: "pi-session-entry-name",
      text: session.name
    });
    const meta = content.createDiv({ cls: "pi-session-entry-meta" });
    meta.createSpan({ text: this.formatDate(session.mtime) });
    meta.createSpan({ text: ` \xB7 ${t("sessionPanel.msgCount", { count: session.messageCount })}` });
    if (session.cwd) {
      meta.createSpan({
        text: ` \xB7 ${session.cwd}`,
        cls: "pi-session-entry-cwd"
      });
    }
    if (session.preview && session.preview !== EMPTY_PREVIEW) {
      content.createDiv({
        cls: "pi-session-entry-preview",
        text: session.preview
      });
    }
    const actions = entry.createDiv({ cls: "pi-session-entry-actions" });
    const exportBtn = actions.createEl("button", {
      cls: "pi-session-action-btn",
      attr: {
        "aria-label": t("sessionPanel.export.tooltip"),
        title: t("sessionPanel.export.tooltip")
      }
    });
    exportBtn.setText("\u{1F4C4}");
    exportBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      void this.callbacks.onExport(session);
    });
    const deleteBtn = actions.createEl("button", {
      cls: "pi-session-action-btn pi-session-action-delete",
      attr: {
        "aria-label": t("sessionPanel.delete.tooltip"),
        title: t("sessionPanel.delete.tooltip")
      }
    });
    deleteBtn.setText("\u{1F5D1}");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      void this.confirmDelete(session);
    });
  }
  async confirmDelete(session) {
    const confirmed = await new Promise((resolve) => {
      const modal = new import_obsidian12.Modal(this.app);
      modal.titleEl.setText(t("sessionPanel.confirmDelete", { name: session.name }));
      const content = modal.contentEl.createDiv();
      content.createEl("p", {
        text: t("sessionPanel.confirmDeleteDesc", { name: session.name }) ?? "Are you sure you want to delete this session?"
      });
      new import_obsidian12.Setting(content).addButton(
        (btn) => btn.setButtonText("Cancel").onClick(() => {
          modal.close();
          resolve(false);
        })
      ).addButton(
        (btn) => btn.setButtonText("Delete").setCta().onClick(() => {
          modal.close();
          resolve(true);
        })
      );
      modal.open();
    });
    if (!confirmed) return;
    try {
      await this.callbacks.onDelete(session);
      this.sessions = this.sessions.filter((s) => s.path !== session.path);
      this.renderList();
      new import_obsidian12.Notice(t("notices.deletedSession", { name: session.name }));
    } catch (err) {
      console.error("[SessionPanel] Delete failed:", err);
      new import_obsidian12.Notice(t("notices.deleteFailed"));
    }
  }
  formatDate(mtime) {
    const d = new Date(mtime);
    const now = /* @__PURE__ */ new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const time = d.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    if (isToday) return t("sessionPanel.today", { time });
    if (isYesterday) return t("sessionPanel.yesterday", { time });
    return `${d.toLocaleDateString(void 0, {
      month: "short",
      day: "numeric"
    })} ${time}`;
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
var PiChatView = class extends import_obsidian13.ItemView {
  plugin;
  renderer;
  streamHandler;
  sessionManager;
  headerBar = null;
  headerSessionName = null;
  headerModel = null;
  headerCwd = null;
  isEditingName = false;
  sessionPanel = null;
  messagesContainer;
  inputContainer;
  chatInput = null;
  commandSuggest;
  attachmentPicker;
  abortBtn = null;
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
    this.streamHandler = new StreamHandler({
      onMessageUpdate: (msg) => this.handleStreamUpdate(msg),
      onMessageComplete: (msg) => this.handleStreamComplete(msg),
      onToolResult: (msg) => this.addMessage(msg),
      onCompaction: () => new import_obsidian13.Notice(t("notices.compacted")),
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
  onOpen(target) {
    const container = target ?? this.contentEl;
    container.empty();
    container.addClass("pi-chat-container");
    this.headerBar = container.createDiv({ cls: "pi-header-bar" });
    this.buildHeaderBar(this.headerBar);
    const chatBody = container.createDiv({ cls: "pi-chat-body" });
    this.chatBodyEl = chatBody;
    this.sessionPanel = new SessionPanel(
      chatBody,
      {
        onSwitch: (session) => this.switchToSession(session),
        onDelete: (session) => this.deleteSession(session),
        onExport: (session) => this.exportSession(session)
      },
      this.app
    );
    this.messagesContainer = chatBody.createDiv({ cls: "pi-messages" });
    this.inputContainer = container.createDiv({ cls: "pi-input-container" });
    this.chatInput = new ChatInput(this.inputContainer, {
      onSend: (text, attachments) => {
        void this.sendMessage(text, attachments);
      },
      onSlashTyped: () => {
        void this.triggerCommandSuggest();
      },
      onAtTyped: () => {
        void this.triggerFilePicker();
      }
    });
    this.abortBtn = this.chatInput.getInputAreaEl().createEl("button", {
      cls: "pi-abort-btn is-hidden",
      text: t("view.abort"),
      attr: {
        type: "button",
        "aria-label": t("view.abort")
      }
    });
    this.abortBtn.addEventListener("click", () => this.abortStream());
    this.chatInput.focus();
    this.messagesContainer.addEventListener("scroll", () => {
      const el = this.messagesContainer;
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      this.userScrolledUp = distFromBottom > 100;
    });
    void this.connectToRpc();
    return Promise.resolve();
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
    this.abortBtn = null;
    this.readOnlyBanner = null;
    this.returnBannerEl = null;
    this.headerBar = null;
    this.headerSessionName = null;
    this.headerModel = null;
    this.headerCwd = null;
    if (this.sessionPanel) {
      this.sessionPanel.destroy();
      this.sessionPanel = null;
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
    this.headerModel = left.createSpan({
      cls: "pi-header-model",
      text: ""
    });
    this.headerCwd = left.createSpan({
      cls: "pi-header-cwd",
      text: ""
    });
    const right = container.createDiv({ cls: "pi-header-right" });
    const sessionsBtn = right.createEl("button", {
      cls: "pi-header-sessions-btn",
      attr: { "aria-label": t("view.sessionsBtn.tooltip") }
    });
    sessionsBtn.setText("\u{1F4CB}");
    sessionsBtn.addEventListener("click", () => this.sessionPanel?.toggle());
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
      const model = data.model;
      const modelName = model?.name;
      const thinkingLevel = data.thinkingLevel;
      if (this.headerModel) {
        let modelText = modelName || "";
        if (thinkingLevel && thinkingLevel !== "off") {
          modelText += ` :${thinkingLevel}`;
        }
        this.headerModel.setText(modelText);
        this.headerModel.classList.toggle("is-hidden", !modelText);
      }
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
      new import_obsidian13.Notice(t("notices.renameFailed"));
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
          new import_obsidian13.Notice(t("notices.newSessionCancelled"));
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
    this.sessionPanel?.setCurrentSession(this.currentSessionPath);
    void this.plugin.statusBar?.refreshModel();
    void this.refreshHeader();
    new import_obsidian13.Notice(t("notices.newSession"));
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
      new import_obsidian13.Notice(t("notices.notConnected"));
      return;
    }
    try {
      const response = await conn.send({ type: "switch_session", sessionPath: session.path });
      const data = response.data;
      if (data?.cancelled) {
        new import_obsidian13.Notice(t("notices.switchCancelled"));
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
    this.sessionPanel?.setCurrentSession(session.path);
    this.sessionPanel?.hide();
    void this.plugin.statusBar?.refreshModel();
    void this.plugin.statusBar?.refreshStats();
    new import_obsidian13.Notice(t("notices.switchedTo", { name: session.name }));
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
        new import_obsidian13.Notice(t("notices.noExportMessages"));
        return;
      }
      const path6 = await this.sessionManager.saveSession(
        messages,
        this.plugin.settings,
        this.app.vault
      );
      if (path6) {
        new import_obsidian13.Notice(t("notices.exportedTo", { path: path6 }));
      } else {
        new import_obsidian13.Notice(t("notices.exportFailed"));
      }
    } catch (err) {
      console.error("[Pi Chat] Export failed:", err);
      new import_obsidian13.Notice(t("notices.exportFailedGeneral"));
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
   * Update currentSessionPath from Pi and sync to store/panel.
   */
  async updateCurrentSessionFromPi() {
    const state = await this.getPiState();
    if (!state?.sessionFile) return;
    this.currentSessionPath = state.sessionFile;
    this.plugin.messageStore.setLastSession(state.sessionFile);
    this.plugin.scheduleStoreFlush();
    this.sessionPanel?.setCurrentSession(state.sessionFile);
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
      new import_obsidian13.Notice(t("notices.cannotRewind"));
      return;
    }
    if (this.streaming) {
      new import_obsidian13.Notice(t("notices.waitRewind"));
      return;
    }
    if (this.rewindBusy) {
      return;
    }
    if (msg.role !== "user" || msg.isSteering) {
      new import_obsidian13.Notice(t("notices.onlyUserRewind"));
      return;
    }
    if (!msg.piEntryId) {
      new import_obsidian13.Notice(t("notices.notRewindable"));
      await this.syncForkEntryIds();
      return;
    }
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) {
      new import_obsidian13.Notice(t("notices.notConnected"));
      return;
    }
    this.setRewindBusy(true);
    this.activeExtensionUiOwner = "rewind";
    this.pendingRewindUiRequestIds.clear();
    let forkSucceeded = false;
    try {
      const before = await this.getPiState();
      if (!before?.sessionFile) {
        new import_obsidian13.Notice(t("notices.noSession"));
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
        new import_obsidian13.Notice(t("notices.rewindCancelled"));
        return;
      }
      forkSucceeded = true;
      await this.updateCurrentSessionFromPi();
      await this.reloadMessagesFromPi();
      const restoredText = data?.text ?? msg.piForkText ?? msg.content;
      if (this.chatInput && restoredText) {
        this.chatInput.setValue(restoredText);
        this.chatInput.focus();
      }
      this.renderReturnBanner();
      new import_obsidian13.Notice(t("notices.rewindSuccess"));
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
      new import_obsidian13.Notice(t("notices.waitReturn"));
      return;
    }
    if (this.rewindBusy) return;
    const checkpoint = this.returnCheckpoint;
    const conn = this.plugin.connection;
    if (!conn?.isConnected()) {
      new import_obsidian13.Notice(t("notices.notConnected"));
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
        new import_obsidian13.Notice(t("notices.returnCancelled"));
        return;
      }
      this.resetRewindState();
      await this.updateCurrentSessionFromPi();
      await this.reloadMessagesFromPi();
      if (this.chatInput) {
        this.chatInput.setValue("");
        this.chatInput.focus();
      }
      this.renderReturnBanner();
      new import_obsidian13.Notice(t("notices.returnSuccess"));
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
      }
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
      new import_obsidian13.Notice(t("notices.readOnly"));
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
    if (this.abortBtn) {
      this.abortBtn.classList.toggle("is-hidden", !streaming);
    }
    if (this.chatInput) {
      this.chatInput.setPlaceholder(
        streaming ? "Send a message to steer Pi\u2026" : "Message Pi\u2026 (/ for commands, @ for files)"
      );
    }
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
      new import_obsidian13.Notice(t("notices.abortConnectionLost"));
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
      if (this.chatInput) {
        this.chatInput.setValue(commandText);
        this.chatInput.focus();
      }
    });
  }
  /**
   * Trigger the `@` file picker modal.
   */
  triggerFilePicker() {
    this.attachmentPicker.trigger((attachment) => {
      if (this.chatInput) {
        const current = this.chatInput.getValue();
        if (current.endsWith("@")) {
          this.chatInput.setValue(current.slice(0, -1));
        }
        this.chatInput.addAttachment(attachment);
        this.chatInput.focus();
      }
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
    this.streamingComponent = new import_obsidian13.Component();
    this.streamingComponent.load();
    const safeContent = this.pendingStreamContent.replace(
      /```(mermaid|dataview|dataviewjs|query)/g,
      "```$1-preview"
    );
    contentEl.empty();
    import_obsidian13.MarkdownRenderer.render(
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
          this.streamingComponent = new import_obsidian13.Component();
          this.streamingComponent.load();
          import_obsidian13.MarkdownRenderer.render(
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
          this.streamingComponent = new import_obsidian13.Component();
          this.streamingComponent.load();
        }
        const thinkingEl = createEl("details", { cls: "pi-thinking" });
        thinkingEl.createEl("summary", { text: t("renderer.thinkingSummary") });
        const thinkingContentEl = thinkingEl.createDiv({ cls: "pi-thinking-content" });
        import_obsidian13.MarkdownRenderer.render(
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
      this.streamingMessageEl = null;
    }
    this.messages.push(msg);
    this.scrollToBottom();
    this.persistMessage(msg);
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
        case "assistant":
          this.renderer.renderAssistantMessage(
            this.messagesContainer,
            msg.content,
            "",
            this,
            msg.thinkingContent,
            msg.error
          );
          break;
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
    this.connection = new PiConnection({
      piBinaryPath: piBinary,
      cwd: deps.vaultPath,
      piConfigDir: deps.piConfigDir,
      buildEnv: () => buildExecEnv()
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
            buildEnv: () => buildExecEnv()
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
      statusBar: null
    };
    this.view = new PiChatView(deps.leaf, pluginRef);
    await this.view.onOpen(container);
    if (deps.initialCommand && this.view) {
      const cmd = deps.initialCommand;
      activeWindow.setTimeout(() => {
        if (this.view) {
          void this.view.sendMessage(cmd, []);
        }
      }, 2e3);
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
var import_obsidian14 = require("obsidian");
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
    (0, import_obsidian14.setIcon)(refresh, "refresh-cw");
    refresh.addEventListener("click", () => this.refresh());
    this.chips = this.root.createEl("div", { cls: "vault-mind-count-chips" });
    this.list = this.root.createEl("ul", { cls: "vault-mind-queue-list" });
  }
  async connect() {
    this.disconnect();
    const token = await this.deps.tokenStore.getToken();
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
        new import_obsidian14.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
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
    }
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
        (0, import_obsidian14.setIcon)(retryBtn, "refresh-cw");
        retryBtn.addEventListener("click", () => this.connect());
      }
      return;
    }
    if (this.connectionState.reconnecting) {
      const li = this.list.createEl("li", {
        cls: "vault-mind-empty vault-mind-queue-reconnecting-state"
      });
      const spinner = li.createEl("span", { cls: "vault-mind-spinner" });
      (0, import_obsidian14.setIcon)(spinner, "loader");
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
  showContextMenu(evt, job) {
    const menu = new import_obsidian14.Menu();
    menu.addItem(
      (item) => item.setTitle("Retry").setIcon("rotate-cw").onClick(async () => {
        try {
          await this.client?.retryJob(job.id);
        } catch (err) {
          new import_obsidian14.Notice(`Vault Mind: ${err.message}`);
        }
      })
    );
    menu.addItem(
      (item) => item.setTitle("Cancel").setIcon("x").onClick(async () => {
        try {
          await this.client?.cancelJob(job.id);
        } catch (err) {
          new import_obsidian14.Notice(`Vault Mind: ${err.message}`);
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
    new import_obsidian14.Notice(`Vault Mind: ${message}`);
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
    const token = await this.deps.tokenStore.getToken();
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
var import_node_child_process3 = require("node:child_process");
var import_obsidian16 = require("obsidian");

// src/modals/libsecret.ts
var import_obsidian15 = require("obsidian");
var INSECURE_CONFIRMATION = "INSECURE";
var PLATFORMS = [
  {
    label: "macOS",
    notes: ["Keychain is the OS keychain. No setup needed."],
    commands: []
  },
  {
    label: "Windows",
    notes: ["DPAPI is the OS keychain. No setup needed."],
    commands: []
  },
  {
    label: "Debian / Ubuntu (including WSL)",
    notes: ["Restart Obsidian after installing."],
    commands: ["sudo apt install libsecret-1-0 gnome-keyring"]
  },
  {
    label: "Fedora / RHEL",
    notes: ["Restart Obsidian after installing."],
    commands: ["sudo dnf install libsecret gnome-keyring"]
  },
  {
    label: "Arch / Manjaro",
    notes: ["Restart Obsidian after installing."],
    commands: ["sudo pacman -S libsecret gnome-keyring"]
  },
  {
    label: "Alpine",
    notes: ["Restart Obsidian after installing."],
    commands: ["sudo apk add libsecret gnome-keyring"]
  },
  {
    label: "Gentoo / Funtoo",
    notes: [
      "Install with the libsecret USE flag. kwallet is not supported by Electron's safeStorage on Linux.",
      "Start gnome-keyring-daemon on the session bus, then verify the D-Bus service is reachable.",
      "Launch Obsidian from the same shell so DBUS_SESSION_BUS_ADDRESS is inherited."
    ],
    commands: [
      "emerge --ask gnome-base/libsecret gnome-base/gnome-keyring",
      'eval "$(keychain --eval --agents ssh,gpg)"',
      "dbus-send --session --dest=org.freedesktop.secrets --type=method_call /org/freedesktop/secrets org.freedesktop.DBus.Introspectable.Introspect"
    ]
  },
  {
    label: "NixOS",
    notes: ["Add the service to configuration.nix, then restart Obsidian."],
    commands: ["services.gnome-keyring.enable = true;"]
  },
  {
    label: "Void / Solus",
    notes: [
      "See the upstream wiki for your distro. The requirement is libsecret plus a running gnome-keyring-daemon exposing org.freedesktop.secrets on the session bus."
    ],
    commands: []
  }
];
var KEYCHAIN_NOTE = "Note: keychain 2.8.5 (Funtoo) reuses an existing keyring across shells; it does not start one. In a headless WSL session the gnome-keyring-daemon may not auto-start, which is why the Funtoo/WSL instructions call out the explicit keychain --eval step.";
var InstallLibsecretModal = class extends import_obsidian15.Modal {
  options;
  confirmationEl = null;
  constructor(app, options) {
    super(app);
    this.options = options;
  }
  onOpen() {
    const { contentEl } = this;
    this.setTitle("Install libsecret / configure keyring");
    contentEl.empty();
    contentEl.createEl("p", {
      text: "Electron safeStorage needs an OS keychain to encrypt the Vault Mind API token. Choose your platform and run the command, then restart Obsidian."
    });
    for (const platform of PLATFORMS) {
      const isRelevant = this.isRelevantPlatform(platform.label);
      const section = contentEl.createEl("div", {
        cls: `vault-mind-libsecret-section${isRelevant ? " vault-mind-libsecret-relevant" : ""}`
      });
      section.createEl("h3", { text: platform.label });
      for (const note of platform.notes) {
        section.createEl("p", { text: note });
      }
      if (platform.commands.length > 0) {
        const list = section.createEl("div", { cls: "vault-mind-libsecret-commands" });
        for (const command of platform.commands) {
          const row = list.createEl("div", { cls: "vault-mind-libsecret-command-row" });
          const code = row.createEl("code", {
            cls: "vault-mind-libsecret-command",
            text: command
          });
          const copyBtn = row.createEl("button", {
            cls: "vault-mind-libsecret-copy",
            text: "Copy"
          });
          copyBtn.addEventListener("click", () => this.copyCommand(command, copyBtn));
        }
      }
    }
    contentEl.createEl("p", {
      cls: "vault-mind-libsecret-note",
      text: KEYCHAIN_NOTE
    });
    const divider = contentEl.createEl("hr", { cls: "vault-mind-libsecret-divider" });
    divider.style.margin = "var(--size-4-4) 0";
    const insecureContainer = contentEl.createEl("div", { cls: "vault-mind-libsecret-insecure" });
    insecureContainer.createEl("p", {
      cls: "vault-mind-warning",
      text: "If you cannot install libsecret, you can continue without encrypting the token. This stores the token in plaintext and is not recommended."
    });
    const revealBtn = insecureContainer.createEl("button", {
      cls: "mod-warning",
      text: "Continue without encryption (INSECURE)"
    });
    revealBtn.addEventListener("click", () => this.showConfirmation(insecureContainer, revealBtn));
    this.confirmationEl = insecureContainer.createEl("div", {
      cls: "vault-mind-libsecret-confirmation"
    });
    this.confirmationEl.style.display = "none";
  }
  onClose() {
    this.contentEl.empty();
  }
  isRelevantPlatform(label) {
    if (import_obsidian15.Platform.isMacOS && label.startsWith("macOS")) return true;
    if (import_obsidian15.Platform.isWin && label.startsWith("Windows")) return true;
    if (import_obsidian15.Platform.isLinux && !import_obsidian15.Platform.isMacOS && !import_obsidian15.Platform.isWin) {
      return !label.startsWith("macOS") && !label.startsWith("Windows");
    }
    return false;
  }
  async copyCommand(command, button) {
    try {
      await navigator.clipboard.writeText(command);
      const original = button.textContent ?? "Copy";
      button.textContent = "Copied";
      activeWindow.setTimeout(() => {
        button.textContent = original;
      }, 1500);
    } catch {
      new import_obsidian15.Notice("Vault Mind: failed to copy command");
    }
  }
  showConfirmation(container, revealBtn) {
    revealBtn.disabled = true;
    if (!this.confirmationEl) return;
    this.confirmationEl.style.display = "block";
    this.confirmationEl.empty();
    this.confirmationEl.createEl("p", {
      text: `Type "${INSECURE_CONFIRMATION}" to confirm you want to store the token without encryption.`
    });
    const input = this.confirmationEl.createEl("input", {
      type: "text",
      placeholder: INSECURE_CONFIRMATION
    });
    input.style.width = "100%";
    input.style.marginBottom = "var(--size-4-2)";
    const confirmBtn = this.confirmationEl.createEl("button", {
      cls: "mod-warning",
      text: "I understand \u2014 store token in plaintext"
    });
    confirmBtn.disabled = true;
    input.addEventListener("input", () => {
      confirmBtn.disabled = input.value !== INSECURE_CONFIRMATION;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value === INSECURE_CONFIRMATION) {
        void this.confirmInsecure();
      }
    });
    confirmBtn.addEventListener("click", () => void this.confirmInsecure());
  }
  async confirmInsecure() {
    const ok = await this.options.tokenStore.optInToInsecure(INSECURE_CONFIRMATION);
    if (!ok) {
      new import_obsidian15.Notice("Vault Mind: confirmation did not match. Token will not be stored in plaintext.");
      return;
    }
    new import_obsidian15.Notice("Vault Mind: plaintext opt-in enabled. Import or paste a token to continue.");
    this.options.onOptIn?.();
    this.close();
  }
};

// src/tabs/status-tab.ts
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
  providerEl = null;
  modelEl = null;
  watcherStatusEl = null;
  watcherBtn = null;
  resultsBox = null;
  unsubState = null;
  unsubEvents = null;
  discoveredConfig = null;
  component = null;
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    this.component = new import_obsidian16.Component();
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
    const mode = this.deps.tokenStore.getMode();
    tokenBar.createEl("span", { text: `Token: ${this.formatMode(mode)}` });
    if (!this.deps.tokenStore.isKeychainAvailable()) {
      const installBtn = tokenBar.createEl("button", {
        text: "Install libsecret",
        attr: { "aria-label": "Install libsecret for secure token storage" }
      });
      installBtn.addEventListener(
        "click",
        () => new InstallLibsecretModal(this.deps.app, {
          tokenStore: this.deps.tokenStore,
          onOptIn: () => this.render()
        }).open()
      );
    }
    const importBtn = tokenBar.createEl("button", {
      text: "Import from dotenv",
      attr: { "aria-label": "Import API token from dotenv file" }
    });
    importBtn.addEventListener("click", () => this.importToken());
    const forgetBtn = tokenBar.createEl("button", {
      text: "Forget",
      attr: { "aria-label": "Forget stored API token" }
    });
    forgetBtn.addEventListener("click", () => this.forgetToken());
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
    const launchBtn = this.root.createEl("button", {
      text: import_obsidian16.Platform.isMacOS ? "Open in Terminal" : "Open in Console",
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
    (0, import_obsidian16.setIcon)(searchBtn, "search");
    searchBtn.addEventListener("click", () => this.runSearch(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.runSearch(input.value);
    });
    this.resultsBox = this.root.createEl("div");
  }
  formatMode(mode) {
    switch (mode) {
      case "keychain":
        return "Keychain";
      case "1password":
        return "1Password";
      case "envfile":
        return "env file";
      default:
        return "none";
    }
  }
  async connect() {
    this.disconnect();
    this.discoveredConfig = readExtensionConfig(this.deps.vaultPath);
    const token = await this.deps.tokenStore.getToken();
    if (!token) {
      this.setError("No token configured. Import from ~/.pi/agent/vault-mind.env or paste one.");
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
        new import_obsidian16.Notice(`Vault Mind: proposed edit for ${event.path}`);
        const file = this.deps.app.vault.getAbstractFileByPath(event.path);
        if (file) {
          new DiffModal(
            this.deps.app,
            { path: event.path, old: event.oldContent, new: event.newContent },
            async () => {
              if (!(file instanceof import_obsidian16.TFile)) {
                new import_obsidian16.Notice(`Vault Mind: file not found: ${event.path}`);
                return;
              }
              try {
                await this.deps.app.vault.modify(file, event.newContent);
                new import_obsidian16.Notice(`Vault Mind: accepted changes to ${event.path}`);
              } catch (err) {
                new import_obsidian16.Notice(`Vault Mind: failed to write ${event.path}: ${err.message}`);
              }
            }
          ).open();
        }
        break;
      }
      case "job-notification":
        new import_obsidian16.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
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
  }
  setError(message) {
    this.resultsBox?.empty();
    this.resultsBox?.createEl("p", { cls: "vault-mind-empty", text: message });
    new import_obsidian16.Notice(`Vault Mind: ${message}`);
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
        await import_obsidian16.MarkdownRenderer.render(this.deps.app, markdown, li, "", this.component);
      }
    }
  }
  async toggleWatcher() {
    if (!this.client) return;
    try {
      const res = await this.client.toggleWatcher();
      new import_obsidian16.Notice(`Vault Mind: watcher ${res.watcher ? "started" : "stopped"}`);
      await this.refreshStatus();
    } catch (err) {
      this.setError(`Watcher toggle failed: ${err.message}`);
    }
  }
  async importToken() {
    const ok = await this.deps.tokenStore.importFromDotenv();
    if (!ok) {
      new import_obsidian16.Notice("Vault Mind: token not found in ~/.pi/agent/vault-mind.env");
      return;
    }
    new import_obsidian16.Notice("Vault Mind: token imported");
    await this.connect();
  }
  async forgetToken() {
    await this.deps.tokenStore.forgetToken();
    new import_obsidian16.Notice("Vault Mind: token forgotten");
    this.disconnect();
  }
  launchPiTui() {
    if (!import_obsidian16.Platform.isDesktop) {
      new import_obsidian16.Notice("Vault Mind: TUI launcher is only available on desktop");
      return;
    }
    const cwd = this.deps.vaultPath;
    const piConfigDir = this.deps.piConfigDir;
    const piBinary = this.deps.piBinaryPath;
    const env = { ...process.env, PI_CODING_AGENT_DIR: piConfigDir };
    try {
      if (import_obsidian16.Platform.isMacOS) {
        const script = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        const appleScript = `tell application "Terminal" to do script "${script.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
        (0, import_node_child_process3.spawn)("osascript", ["-e", appleScript]);
      } else if (import_obsidian16.Platform.isLinux) {
        const cmd = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        (0, import_node_child_process3.spawn)("x-terminal-emulator", ["-e", "bash", "-c", cmd], { env });
      } else if (import_obsidian16.Platform.isWin) {
        const cmd = `cd /d ${winQuote(cwd)} && set PI_CODING_AGENT_DIR=${winQuote(piConfigDir)} && ${piBinary} --cwd ${winQuote(cwd)}`;
        (0, import_node_child_process3.spawn)("cmd", ["/c", "start", "cmd", "/k", cmd], { env, shell: false });
      } else {
        new import_obsidian16.Notice("Vault Mind: unsupported platform for TUI launcher");
      }
    } catch (err) {
      new import_obsidian16.Notice(`Vault Mind: failed to launch pi TUI: ${err.message}`);
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
var VaultMindPanel = class extends import_obsidian17.ItemView {
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
      (0, import_obsidian17.setIcon)(button, cfg.icon);
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
          tokenStore: deps.tokenStore,
          settings: deps.chatSettings,
          messageStore: deps.messageStore,
          onStoreFlush: () => deps.plugin.flushMessageStore(),
          initialCommand: initialCommand ?? void 0
        });
      }
      case "queue":
        return new QueueTab({
          settings: deps.settings,
          tokenStore: deps.tokenStore,
          vaultPath: deps.vaultPath
        });
      case "status":
        return new StatusTab({
          app: this.app,
          settings: deps.settings,
          tokenStore: deps.tokenStore,
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
          settings: deps.settings,
          tokenStore: deps.tokenStore,
          vaultPath: deps.vaultPath
        });
    }
  }
};

// src/main.ts
var execAsync = (0, import_node_util.promisify)(import_node_child_process4.exec);
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
var VaultMindSettingTab = class extends import_obsidian18.PluginSettingTab {
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
    new import_obsidian18.Setting(containerEl).setName("Connection").setHeading();
    new import_obsidian18.Setting(containerEl).setName("Host").setDesc("HTTP server host").addText(
      (text) => text.setPlaceholder("127.0.0.1").setValue(this.plugin.settings.host).onChange(async (value) => {
        this.plugin.settings.host = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Port").setDesc("HTTP server port").addText(
      (text) => text.setPlaceholder("11435").setValue(String(this.plugin.settings.port)).onChange(async (value) => {
        const n = Number.parseInt(value, 10);
        this.plugin.settings.port = Number.isNaN(n) ? 11435 : n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Pi binary path").setDesc("Path to the pi executable for the chat view").addText(
      (text) => text.setPlaceholder("pi").setValue(this.plugin.settings.piBinaryPath).onChange(async (value) => {
        this.plugin.settings.piBinaryPath = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Check extension on startup").setDesc("Detect whether pi-vault-mind is installed in your pi session when Obsidian starts").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.checkExtensionOnStartup).onChange(async (value) => {
        this.plugin.settings.checkExtensionOnStartup = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Include editor context").setDesc("Send the active note path and selection with chat messages").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeEditorContext).onChange(async (value) => {
        this.plugin.settings.includeEditorContext = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Include file picker").setDesc("Allow @ references in the chat input to attach vault files as context").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeFilePicker).onChange(async (value) => {
        this.plugin.settings.includeFilePicker = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Include slash commands").setDesc("Allow / references in the chat input to run Pi commands").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeSlashCommands).onChange(async (value) => {
        this.plugin.settings.includeSlashCommands = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Resume session on startup").setDesc("Automatically resume the last chat session when opening the panel").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.resumeSession).onChange(async (value) => {
        this.plugin.settings.resumeSession = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Folder layout").setHeading();
    new import_obsidian18.Setting(containerEl).setName("Inbox").setDesc("Agent input folder (default: Agent/Inbox)").addText(
      (text) => text.setPlaceholder("Agent/Inbox").onChange(async (value) => {
        await this.saveFolderSetting("inbox", value);
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Library").setDesc("Knowledge output folder (default: Agent/Library)").addText(
      (text) => text.setPlaceholder("Agent/Library").onChange(async (value) => {
        await this.saveFolderSetting("library", value);
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Presentations").setDesc("Broadcaster output folder (default: Agent/Presentations)").addText(
      (text) => text.setPlaceholder("Agent/Presentations").onChange(async (value) => {
        await this.saveFolderSetting("presentations", value);
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Journal").setDesc("Audit/checkpoint trail folder (default: Agent/Journal)").addText(
      (text) => text.setPlaceholder("Agent/Journal").onChange(async (value) => {
        await this.saveFolderSetting("journal", value);
      })
    );
    const token = this.plugin.tokenStore;
    const backends = token.availableBackends();
    const currentMode = token.getMode();
    new import_obsidian18.Setting(containerEl).setName("Token storage").setHeading();
    new import_obsidian18.Setting(containerEl).setName("Backend").setDesc(`Current: ${currentMode === "none" ? "not configured" : currentMode}`).addDropdown((dropdown) => {
      for (const b of backends) {
        dropdown.addOption(
          b,
          b === "keychain" ? "macOS Keychain" : b === "1password" ? "1Password" : ".env file (vault-local)"
        );
      }
      dropdown.setValue(currentMode === "none" ? backends[0] : currentMode);
      dropdown.onChange(async (value) => {
        const existing = await token.getToken();
        if (existing) {
          await token.setToken(existing, value);
          new import_obsidian18.Notice(`Vault Mind: token moved to ${value}`);
        }
        this.display();
      });
    });
    new import_obsidian18.Setting(containerEl).setName("Import token").setDesc("Load from ~/.pi/agent/vault-mind.env into the selected backend.").addButton(
      (btn) => btn.setButtonText("Import from dotenv").onClick(async () => {
        const ok = await token.importFromDotenv();
        new import_obsidian18.Notice(ok ? "Vault Mind: token imported" : "Vault Mind: no token found in dotenv");
        this.display();
      })
    ).addButton(
      (btn) => btn.setButtonText("Forget").onClick(async () => {
        await token.forgetToken();
        new import_obsidian18.Notice("Vault Mind: token forgotten");
        this.display();
      })
    );
  }
  async saveFolderSetting(key, value) {
    const token = await this.plugin.tokenStore.getToken();
    if (!token) {
      new import_obsidian18.Notice("Vault Mind: no API token configured");
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
      new import_obsidian18.Notice(`Vault Mind: ${key} folder saved`);
    } catch (err) {
      new import_obsidian18.Notice(`Vault Mind: failed to save ${key} folder \u2014 ${err.message}`);
    }
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
    new import_obsidian18.Setting(containerEl).setName("Vault initialization").setHeading();
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
        new import_obsidian18.Notice("Vault Mind: could not find the pi binary");
        btn.setButtonText(configured ? "Reinitialize" : "Retry");
        btn.setDisabled(false);
        return;
      }
      try {
        await this.runInit(piBinary, progress);
        this.addStep(progress, "done", "Vault initialized \u2713 \u2014 opening chat...");
        new import_obsidian18.Notice("Vault Mind: vault initialized \u2014 launching pi");
        await new Promise((r) => activeWindow.setTimeout(r, 1e3));
        this.plugin.pendingChatMessage = "/vm setup";
        this.app.setting?.close();
        await this.plugin.openPanel("chat");
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.addStep(progress, "error", `Failed: ${message}`);
        new import_obsidian18.Notice(`Vault Mind: ${message}`);
        btn.setButtonText(configured ? "Reinitialize" : "Retry");
        btn.setDisabled(false);
      }
    };
    if (configured) {
      const version = this.getInstalledExtensionVersion();
      const statusDesc = version ? `\u2713 Initialized \u2014 extensions installed (pi-vault-mind v${version})` : "\u2713 Initialized \u2014 extensions installed";
      new import_obsidian18.Setting(initSection).setName("Vault status").setDesc(statusDesc).addButton((btn) => {
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
    new import_obsidian18.Setting(initSection).setName("Initialize vault").setDesc(
      "Install pi-vault-mind and pi-context extensions, scaffold config, and write the system prompt."
    ).addButton((btn) => {
      btn.setButtonText("Initialize vault").setIcon("plus-circle").setCta().onClick(async () => {
        await runInitialization(btn);
      });
    });
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
    const step4 = this.addStep(progress, "active", "Scaffolding config...");
    this.scaffoldConfig(vaultPath);
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
    (0, import_obsidian18.setIcon)(iconEl, icon);
    step.createEl("span", { text });
    return step;
  }
  markDone(step) {
    step.classList.replace("vault-mind-init-step-active", "vault-mind-init-step-done");
    const icon = step.querySelector(".vault-mind-init-step-icon");
    if (icon) (0, import_obsidian18.setIcon)(icon, "check");
  }
};
var VaultMindPlugin = class extends import_obsidian18.Plugin {
  editorContext = { filePath: null, cursor: null, selection: null };
  connectionState = { connected: false, error: false };
  statusBarItem = null;
  /** Message to auto-send in chat after next panel open (set by init flow) */
  pendingChatMessage = null;
  contextPushTimer = null;
  async onload() {
    (0, import_obsidian18.addIcon)("vault-mind", VAULT_MIND_ICON);
    await this.loadSettings();
    const savedData = await this.loadData() ?? {};
    this.tokenStore = new TokenStore(
      savedData.token ?? {},
      async (data) => {
        const existing = await this.loadData() ?? {};
        await this.saveData({ ...existing, token: data });
      }
    );
    this.messageStore = new MessageStore();
    this.messageStore.load(savedData.messages ?? null);
    this.registerEditorExtension(
      import_view2.EditorView.updateListener.of((update) => {
        if (!update.selectionSet) return;
        const info = update.state.field(import_obsidian18.editorInfoField, false);
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
        const active = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
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
    this.tokenStore.setVaultPath(vaultPath);
    const piConfigDir = import_node_path3.default.join(vaultPath, ".pi", "agent");
    const systemMdPath = import_node_path3.default.join(piConfigDir, "system.md");
    const panelDeps = {
      vaultPath,
      piConfigDir,
      systemMdPath,
      tokenStore: this.tokenStore,
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
    (0, import_obsidian18.setIcon)(ribbonIconEl, "vault-mind");
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
    this.addSettingTab(new VaultMindSettingTab(this.app, this));
    registerVaultMindProtocolHandlers(this);
  }
  onunload() {
    void this.flushMessageStore();
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
    const token = await this.tokenStore.getToken();
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
    const existing = await this.loadData() ?? {};
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
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    const existing = await this.loadData() ?? {};
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
