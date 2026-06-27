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
var import_node_child_process6 = require("node:child_process");
var import_node_fs5 = require("node:fs");
var import_node_path5 = __toESM(require("node:path"), 1);
var import_node_util2 = require("node:util");
var import_view = require("@codemirror/view");
var import_obsidian9 = require("obsidian");

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
      const t = keychainGet();
      if (t) return t;
    } else if (backend === "1password") {
      const t = opGet();
      if (t) return t;
    } else if (backend === "envfile") {
      const t = this.readVaultEnv();
      if (t) return t;
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
  async httpJson(method, path8, body) {
    const res = await fetch(`${this.baseUrl}${path8}`, {
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
  async serverConfig() {
    return await this.httpJson("GET", "/vault-mind/config");
  }
  async listQueue(status) {
    const query = status ? `?status=${status}` : "";
    return await this.httpJson("GET", `/agent/queue${query}`);
  }
  async getJob(id) {
    return await this.httpJson("GET", `/agent/jobs/${encodeURIComponent(id)}`);
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
  async append(entry, collection = "main") {
    return await this.httpJson("POST", "/vm/append", {
      collection,
      entry
    });
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

// src/modals/install-extension.ts
var import_node_child_process3 = require("node:child_process");
var import_node_fs2 = __toESM(require("node:fs"), 1);
var import_node_os2 = __toESM(require("node:os"), 1);
var import_node_path2 = __toESM(require("node:path"), 1);
var import_node_util = require("node:util");
var import_obsidian2 = require("obsidian");

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

// src/modals/install-extension.ts
var execAsync = (0, import_node_util.promisify)(import_node_child_process3.exec);
function getGlobalPackageJsonPath() {
  return import_node_path2.default.join(import_node_os2.default.homedir(), ".pi/agent/npm/node_modules/pi-vault-mind/package.json");
}
function getLocalPackageJsonPath(cwd) {
  return import_node_path2.default.join(cwd, ".pi/agent/npm/node_modules/pi-vault-mind/package.json");
}
function loginShell() {
  return process.env.SHELL || (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
}
async function checkVaultMindInstalled(piBinaryPath, cwd) {
  if (cwd && import_node_fs2.default.existsSync(getLocalPackageJsonPath(cwd))) {
    return true;
  }
  if (import_node_fs2.default.existsSync(getGlobalPackageJsonPath())) {
    return true;
  }
  const resolvedPi = detectPiBinary(piBinaryPath, cwd) ?? piBinaryPath;
  try {
    const { stdout, stderr } = await execAsync(`${resolvedPi} list`, {
      shell: loginShell(),
      timeout: 1e4,
      env: buildExecEnv()
    });
    const output = `${stdout}
${stderr}`;
    return output.includes("pi-vault-mind");
  } catch {
    return false;
  }
}
var InstallVaultMindExtensionModal = class extends import_obsidian2.Modal {
  options;
  statusEl = null;
  installButton = null;
  copyButton = null;
  laterButton = null;
  constructor(app, options) {
    super(app);
    this.options = options;
  }
  onOpen() {
    const { contentEl } = this;
    this.setTitle("Install pi-vault-mind extension");
    contentEl.empty();
    contentEl.createEl("p", {
      text: "The Vault Mind Obsidian plugin needs the pi-vault-mind pi extension installed in your pi session. Install it now to enable indexing, search, and chat."
    });
    const command = `${this.options.piBinaryPath} install npm:pi-vault-mind -l`;
    const commandRow = contentEl.createEl("div", {
      cls: "vault-mind-install-command-row"
    });
    commandRow.createEl("code", {
      cls: "vault-mind-install-command",
      text: command
    });
    const buttons = contentEl.createEl("div", { cls: "vault-mind-install-buttons" });
    this.installButton = buttons.createEl("button", {
      cls: "mod-cta",
      text: "Install now"
    });
    this.installButton.addEventListener("click", () => void this.runInstall(command));
    this.copyButton = buttons.createEl("button", {
      text: "Copy command"
    });
    this.copyButton.addEventListener("click", () => void this.copyCommand(command));
    this.laterButton = buttons.createEl("button", {
      text: "Later"
    });
    this.laterButton.addEventListener("click", () => this.close());
    this.statusEl = contentEl.createEl("div", {
      cls: "vault-mind-install-status"
    });
  }
  onClose() {
    this.contentEl.empty();
    this.statusEl = null;
    this.installButton = null;
    this.copyButton = null;
    this.laterButton = null;
  }
  setButtonsDisabled(disabled) {
    if (this.installButton) this.installButton.disabled = disabled;
    if (this.copyButton) this.copyButton.disabled = disabled;
    if (this.laterButton) this.laterButton.disabled = disabled;
  }
  setStatus(text) {
    if (this.statusEl) {
      this.statusEl.textContent = text;
    }
  }
  async runInstall(command) {
    this.setButtonsDisabled(true);
    this.setStatus("Installing pi-vault-mind\u2026");
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 12e4,
        shell: loginShell()
      });
      const output = `${stdout}
${stderr}`.trim();
      if (output) {
        this.setStatus(output);
      }
      const installed = await checkVaultMindInstalled(this.options.piBinaryPath);
      if (installed) {
        new import_obsidian2.Notice("Vault Mind: pi-vault-mind installed");
        this.close();
      } else {
        this.setStatus(
          "Install command finished, but pi-vault-mind was not detected. Try running the command manually."
        );
        this.setButtonsDisabled(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.setStatus(`Install failed: ${message}`);
      this.setButtonsDisabled(false);
    }
  }
  async copyCommand(command) {
    try {
      await navigator.clipboard.writeText(command);
      new import_obsidian2.Notice("Vault Mind: command copied to clipboard");
    } catch {
      new import_obsidian2.Notice("Vault Mind: failed to copy command");
    }
  }
};

// src/protocol.ts
var import_obsidian3 = require("obsidian");
var isString = (value) => typeof value === "string";
var DiffModal = class extends import_obsidian3.Modal {
  path;
  oldContent;
  newContent;
  onAccept;
  constructor(app, { path: path8, old, new: newContent }, onAccept) {
    super(app);
    this.path = path8;
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
    new import_obsidian3.Setting(this.contentEl).addButton(
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
    const path8 = params?.path;
    if (!isString(path8)) {
      new import_obsidian3.Notice("Vault Mind: missing path parameter");
      return;
    }
    plugin.app.workspace.openLinkText(path8, "", true);
  });
  plugin.registerObsidianProtocolHandler("vault-mind/show-diff", (params) => {
    const path8 = params?.path;
    const oldContent = params?.old;
    const newContent = params?.new;
    if (!isString(path8) || !isString(oldContent) || !isString(newContent)) {
      new import_obsidian3.Notice("Vault Mind: missing path, old, or new parameter");
      return;
    }
    new DiffModal(plugin.app, { path: path8, old: oldContent, new: newContent }, async () => {
      const file = plugin.app.vault.getAbstractFileByPath(path8);
      if (!(file instanceof import_obsidian3.TFile)) {
        new import_obsidian3.Notice(`Vault Mind: file not found: ${path8}`);
        return;
      }
      try {
        await plugin.app.vault.modify(file, newContent);
        new import_obsidian3.Notice(`Vault Mind: accepted changes to ${path8}`);
      } catch (err) {
        new import_obsidian3.Notice(`Vault Mind: failed to write ${path8}: ${err.message}`);
      }
    }).open();
  });
  plugin.registerObsidianProtocolHandler("vault-mind/notify", (params) => {
    const message = params?.message;
    if (!isString(message)) {
      new import_obsidian3.Notice("Vault Mind: missing message parameter");
      return;
    }
    new import_obsidian3.Notice(message);
  });
  plugin.registerObsidianProtocolHandler("vault-mind/search", async (params) => {
    const query = params?.query;
    if (!isString(query)) {
      new import_obsidian3.Notice("Vault Mind: missing query parameter");
      return;
    }
    const searchLeaf = await plugin.app.workspace.ensureSideLeaf("search", "left");
    if (searchLeaf.view?.setQuery) {
      searchLeaf.view.setQuery(query);
    }
  });
}

// src/views/chat.ts
var import_node_child_process4 = require("node:child_process");
var import_node_fs3 = require("node:fs");
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_readline = require("node:readline");
var import_obsidian4 = require("obsidian");
var nextId = 1;
function errorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}
function getStringParam(params, key) {
  const value = params?.[key];
  return typeof value === "string" ? value : "";
}
function getRpcString(event, key) {
  const value = event[key];
  return typeof value === "string" ? value : "";
}
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
  /** Extensions considered safe to read as text. */
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
  /** Max file size for attachments: 1 MB. */
  static MAX_FILE_SIZE = 1024 * 1024;
  constructor(app) {
    this.app = app;
  }
  /**
   * Open the file picker modal. On selection, reads the file and returns an
   * attachment via the callback. Only shows text files to avoid binary corruption.
   */
  trigger(onAttach) {
    const allFiles = this.app.vault.getFiles();
    const files = allFiles.filter(
      (f) => _AttachmentPicker.TEXT_EXTENSIONS.has(f.extension.toLowerCase())
    );
    const modal = new FileSuggestModal(this.app, files, async (file) => {
      try {
        const stat = await this.app.vault.adapter.stat(file.path);
        if (stat && stat.size > _AttachmentPicker.MAX_FILE_SIZE) {
          const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
          new import_obsidian4.Notice(`File too large (${sizeMB}MB). Max 1MB.`);
          return;
        }
        const content = await this.app.vault.cachedRead(file);
        onAttach({
          type: "file",
          name: file.name,
          content,
          size: stat?.size
        });
      } catch (err) {
        new import_obsidian4.Notice(`Failed to read file: ${err.message}`);
      }
    });
    modal.open();
  }
};
var CommandSuggestModal = class extends import_obsidian4.FuzzySuggestModal {
  commands;
  onSelect;
  constructor(app, commands, onSelect) {
    super(app);
    this.commands = commands;
    this.onSelect = onSelect;
    this.setPlaceholder("Select a command...");
  }
  getItems() {
    return this.commands;
  }
  getItemText(item) {
    return `/${item.name}`;
  }
  renderSuggestion(value, el) {
    const { item } = value;
    const wrapper = el.createDiv({ cls: "vault-mind-command-suggest-item" });
    wrapper.createDiv({ cls: "vault-mind-command-name", text: `/${item.name}` });
    if (item.description) {
      wrapper.createDiv({ cls: "vault-mind-command-desc", text: item.description });
    }
  }
  onChooseItem(item, _evt) {
    this.onSelect(item);
  }
};
var CommandSuggest = class {
  app;
  constructor(app) {
    this.app = app;
  }
  /**
   * Open the command suggest modal. On selection, calls the callback with the
   * full command text (for example "/plan ").
   */
  trigger(onSelect) {
    const commands = this.getFallbackCommands();
    if (commands.length === 0) {
      return;
    }
    const modal = new CommandSuggestModal(this.app, commands, (cmd) => {
      onSelect(`/${cmd.name} `);
    });
    modal.open();
  }
  getFallbackCommands() {
    return [
      { name: "plan", description: "Create an implementation plan" },
      { name: "report", description: "Write a session report" },
      { name: "catchup", description: "Verify project state" },
      { name: "loop", description: "Execute plan-implement-review cycle" },
      { name: "swarm", description: "Multi-agent task execution" },
      { name: "search", description: "Search the web" }
    ];
  }
};
var ChatView = class extends import_obsidian4.ItemView {
  deps;
  root = null;
  messages = null;
  input = null;
  attachmentList = null;
  sendBtn = null;
  abortBtn = null;
  process = null;
  readline = null;
  chat = [];
  current = null;
  streaming = false;
  statusBar = null;
  pendingRpc = /* @__PURE__ */ new Map();
  attachments = [];
  filePicker;
  slashCommands;
  pendingToolCalls = /* @__PURE__ */ new Map();
  activeToolCalls = /* @__PURE__ */ new Map();
  constructor(leaf, deps) {
    super(leaf);
    this.deps = deps;
    this.filePicker = new AttachmentPicker(this.app);
    this.slashCommands = new CommandSuggest(this.app);
  }
  getViewType() {
    return "vault-mind-chat";
  }
  getDisplayText() {
    return "Vault Mind Chat";
  }
  getIcon() {
    return "vault-mind";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    await this.mount(container);
  }
  async onClose() {
    this.unmount();
  }
  /** Mount view content into the given container. Used by VaultMindPanel for tabbed embedding. */
  async mount(container) {
    this.root = container.createEl("div", { cls: "vault-mind-container vault-mind-chat" });
    this.render();
    this.connect();
  }
  /** Tear down connections. Used by VaultMindPanel on tab/panel close. */
  unmount() {
    this.disconnect();
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    const header = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    header.createEl("span", { cls: "vault-mind-status-dot" });
    header.createEl("span", { text: "Chat" });
    this.abortBtn = header.createEl("button", { text: "Abort" });
    this.abortBtn.disabled = true;
    this.registerDomEvent(this.abortBtn, "click", () => this.abort());
    this.messages = this.root.createEl("div", { cls: "vault-mind-messages" });
    const composer = this.root.createEl("div", { cls: "vault-mind-composer" });
    this.attachmentList = composer.createEl("div", { cls: "vault-mind-attachment-list" });
    const inputRow = composer.createEl("div", { cls: "vault-mind-composer-row" });
    this.input = inputRow.createEl("textarea", { placeholder: "Ask Pi\u2026" });
    this.registerDomEvent(this.input, "keydown", (e) => this.handleKeydown(e));
    this.sendBtn = inputRow.createEl("button", { text: "Send" });
    this.registerDomEvent(this.sendBtn, "click", () => void this.send());
    const note = this.root.createEl("p", {
      cls: "vault-mind-empty",
      text: `Desktop only. Requires pi installed at "${this.deps.piBinaryPath}".`
    });
    if (!import_obsidian4.Platform.isDesktop) {
      note.textContent = "Chat is only available on Obsidian desktop.";
    }
  }
  handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void this.send();
      return;
    }
    if (this.deps.includeSlashCommands && e.key === "/" && this.input) {
      const input = this.input;
      activeWindow.setTimeout(() => {
        if (input.value.startsWith("/")) {
          this.slashCommands.trigger((text) => {
            input.value = text;
            input.focus();
          });
        }
      }, 0);
    }
    if (this.deps.includeFilePicker && e.key === "@") {
      activeWindow.setTimeout(() => {
        this.filePicker.trigger((attachment) => this.addAttachment(attachment));
      }, 0);
    }
  }
  addAttachment(attachment) {
    this.attachments.push(attachment);
    this.renderAttachmentChip(attachment, this.attachments.length - 1);
  }
  removeAttachment(index) {
    this.attachments.splice(index, 1);
    this.attachmentList?.empty();
    for (let i = 0; i < this.attachments.length; i++) {
      this.renderAttachmentChip(this.attachments[i], i);
    }
  }
  renderAttachmentChip(attachment, index) {
    if (!this.attachmentList) return;
    const chip = this.attachmentList.createEl("div", { cls: "vault-mind-attachment-chip" });
    chip.createEl("span", { cls: "vault-mind-attachment-chip-name", text: attachment.name });
    if (attachment.size !== void 0) {
      const sizeKB = (attachment.size / 1024).toFixed(1);
      chip.createEl("span", {
        cls: "vault-mind-attachment-chip-size",
        text: `${sizeKB} KB`
      });
    }
    const remove = chip.createEl("button", {
      cls: "vault-mind-attachment-chip-remove",
      attr: { "aria-label": "Remove attachment" }
    });
    remove.setText("\xD7");
    this.registerDomEvent(remove, "click", () => this.removeAttachment(index));
  }
  async send() {
    if (!this.input) return;
    const text = this.input.value.trim();
    const attachmentsSnapshot = [...this.attachments];
    if (!text && attachmentsSnapshot.length === 0) return;
    this.input.value = "";
    this.attachments = [];
    this.attachmentList?.empty();
    this.addMessage({ id: `u-${nextId++}`, role: "user", content: text, timestamp: Date.now() });
    let rpcContent = text;
    const contextParts = [];
    if (this.deps.includeEditorContext && this.deps.editorContext.filePath) {
      const selectionLength = this.deps.editorContext.selection?.length ?? 0;
      contextParts.push(
        `<!-- context: file=${this.deps.editorContext.filePath}, selection=${selectionLength} chars -->`
      );
    }
    for (const attachment of attachmentsSnapshot) {
      contextParts.push(`<!-- attachment: ${attachment.name} -->
${attachment.content}`);
    }
    if (contextParts.length > 0 && text) {
      rpcContent = `${contextParts.join("\n\n")}

${text}`;
    } else if (contextParts.length > 0) {
      rpcContent = contextParts.join("\n\n");
    }
    this.current = {
      id: `a-${nextId++}`,
      role: "assistant",
      content: "",
      thinking: "",
      timestamp: Date.now(),
      isStreaming: true
    };
    this.chat.push(this.current);
    this.renderMessage(this.current);
    if (!this.process) {
      this.connect();
    }
    if (!this.process?.stdin?.writable) {
      new import_obsidian4.Notice("Vault Mind: pi RPC not connected");
      return;
    }
    this.process.stdin.write(
      `${JSON.stringify({ type: "message", id: `m-${nextId++}`, content: rpcContent })}
`
    );
    this.setStreaming(true);
  }
  connect() {
    if (!import_obsidian4.Platform.isDesktop) return;
    this.disconnect();
    const cwd = this.deps.vaultPath || ".";
    const piConfigDir = import_node_path3.default.join(cwd, ".pi", "agent");
    try {
      (0, import_node_fs3.mkdirSync)(piConfigDir, { recursive: true });
    } catch {
    }
    this.process = (0, import_node_child_process4.spawn)(this.deps.piBinaryPath, ["--mode", "rpc", "--no-session"], {
      shell: true,
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
      env: {
        ...buildExecEnv(),
        PI_CODING_AGENT_DIR: piConfigDir,
        HOME: process.env.HOME || process.env.USERPROFILE || ""
      }
    });
    const stdout = this.process.stdout;
    if (!stdout) {
      throw new Error("Failed to spawn pi process");
    }
    this.readline = (0, import_node_readline.createInterface)({ input: stdout });
    this.readline.on("line", (line) => this.handleLine(line));
    this.process.stderr?.on("data", () => {
    });
    this.process.on("error", (err) => {
      new import_obsidian4.Notice(`Vault Mind chat: ${errorMessage(err)}`);
      this.setStreaming(false);
    });
    this.process.on("close", () => {
      this.rejectPending("pi process closed");
      this.process = null;
      this.readline = null;
      this.setStreaming(false);
    });
  }
  disconnect() {
    this.rejectPending("pi process disconnected");
    if (this.readline) {
      this.readline.close();
      this.readline = null;
    }
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    this.setStreaming(false);
  }
  abort() {
    if (this.current?.isStreaming) {
      this.current.isStreaming = false;
      this.disconnect();
      this.addMessage({
        id: `s-${nextId++}`,
        role: "assistant",
        content: "_Aborted._",
        timestamp: Date.now()
      });
    }
  }
  handleLine(line) {
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      return;
    }
    if (typeof event.id === "string") {
      const pending = this.pendingRpc.get(event.id);
      if (pending) {
        this.pendingRpc.delete(event.id);
        activeWindow.clearTimeout(pending.timer);
        if (typeof event.error === "string") {
          pending.reject(new Error(event.error));
        } else {
          pending.resolve(event.data);
        }
        return;
      }
    }
    switch (event.type) {
      case "message_start": {
        const msg = event.message;
        if (msg && getStringParam(msg, "role") === "assistant") {
          this.current = {
            id: `a-${nextId++}`,
            role: "assistant",
            content: "",
            thinking: "",
            timestamp: Date.now(),
            isStreaming: true
          };
          this.chat.push(this.current);
          this.pendingToolCalls.clear();
          this.activeToolCalls.clear();
          this.renderMessage(this.current);
          this.setStreaming(true);
        }
        break;
      }
      case "message_update": {
        const ame = event.assistantMessageEvent;
        if (!this.current || !ame) return;
        switch (ame.type) {
          case "text_delta": {
            this.current.content += ame.delta ?? "";
            break;
          }
          case "thinking_delta": {
            this.current.thinking = (this.current.thinking ?? "") + (ame.delta ?? "");
            break;
          }
          case "toolcall_start": {
            const contentIndex = String(ame.contentIndex ?? "");
            const partial = ame.partial;
            const toolName = partial ? getStringParam(partial, "name") : "";
            this.pendingToolCalls.set(contentIndex, { name: toolName, arguments: "" });
            break;
          }
          case "toolcall_delta": {
            const contentIndex = String(ame.contentIndex ?? "");
            const delta = ame.delta ?? "";
            const pending = this.pendingToolCalls.get(contentIndex);
            if (pending) {
              pending.arguments += delta;
            }
            break;
          }
          case "toolcall_end": {
            const contentIndex = String(ame.contentIndex ?? "");
            const toolCall = ame.toolCall;
            if (toolCall) {
              this.pendingToolCalls.set(contentIndex, {
                name: getStringParam(toolCall, "name"),
                arguments: JSON.stringify(toolCall.arguments ?? {})
              });
            }
            break;
          }
          case "done":
          case "start":
          case "text_start":
          case "text_end":
          case "thinking_start":
          case "thinking_end":
          case "error":
            break;
        }
        this.renderMessage(this.current);
        break;
      }
      case "message_end": {
        if (this.current) {
          this.current.isStreaming = false;
          this.renderMessage(this.current);
          this.current = null;
        }
        this.setStreaming(false);
        break;
      }
      case "tool_execution_start": {
        const toolCallId = getRpcString(event, "toolCallId");
        const toolName = getRpcString(event, "toolName");
        if (!toolCallId || !toolName || !this.current) return;
        const argsObj = event.args ?? {};
        const args = typeof argsObj === "object" ? JSON.stringify(argsObj, null, 2) : String(argsObj);
        const state = {
          toolCallId,
          toolName,
          args,
          result: "",
          isError: false,
          el: null
        };
        if (!this.current.toolCalls) {
          this.current.toolCalls = [];
        }
        this.current.toolCalls.push(state);
        this.activeToolCalls.set(toolCallId, state);
        this.renderToolCall(state);
        break;
      }
      case "tool_execution_update": {
        const toolCallId = getRpcString(event, "toolCallId");
        const state = this.activeToolCalls.get(toolCallId);
        if (!state) return;
        state.result += this.extractResultText(event.partialResult);
        this.updateToolCallResult(state);
        break;
      }
      case "tool_execution_end": {
        const toolCallId = getRpcString(event, "toolCallId");
        const state = this.activeToolCalls.get(toolCallId);
        if (!state) return;
        state.isError = event.isError === true;
        state.result = this.extractResultText(event.result);
        this.updateToolCallResult(state, true);
        this.activeToolCalls.delete(toolCallId);
        break;
      }
      case "error": {
        new import_obsidian4.Notice(`Vault Mind chat: ${event.error ?? "unknown error"}`);
        this.setStreaming(false);
        break;
      }
    }
  }
  addMessage(msg) {
    this.chat.push(msg);
    this.renderMessage(msg);
  }
  renderMessage(msg) {
    if (!this.messages) return;
    let el = this.messages.querySelector(`[data-msg-id="${msg.id}"]`);
    if (!el) {
      el = this.messages.createEl("div", { cls: `vault-mind-message role-${msg.role}` });
      el.setAttribute("data-msg-id", msg.id);
      el.createEl("div", { cls: "vault-mind-message-role", text: msg.role });
      el.createEl("div", { cls: "vault-mind-message-content" });
      el.createEl("div", { cls: "vault-mind-message-tools" });
    }
    const contentEl = el.querySelector(".vault-mind-message-content");
    if (contentEl) {
      contentEl.empty();
      void import_obsidian4.MarkdownRenderer.render(
        this.app,
        msg.content || (msg.isStreaming ? "_Thinking\u2026_" : "_Empty_"),
        contentEl,
        "",
        this
      );
      if (msg.thinking) {
        const thinking = contentEl.createEl("details", { cls: "vault-mind-thinking" });
        thinking.createEl("summary", { text: "Thinking" });
        thinking.createEl("pre", { text: msg.thinking });
      }
    }
    if (msg.toolCalls) {
      for (const tool of msg.toolCalls) {
        if (!tool.el) {
          this.renderToolCall(tool);
        }
      }
    }
    this.messages.scrollTo({ top: this.messages.scrollHeight, behavior: "smooth" });
  }
  renderToolCall(state) {
    if (!this.messages || !this.current) return;
    const msgEl = this.messages.querySelector(
      `[data-msg-id="${this.current.id}"]`
    );
    if (!msgEl) return;
    const toolsEl = msgEl.querySelector(".vault-mind-message-tools");
    if (!toolsEl) return;
    const details = toolsEl.createEl("details", {
      cls: `vault-mind-tool-call${state.isError ? " vault-mind-tool-error" : ""}`
    });
    details.setAttribute("data-tool-call-id", state.toolCallId);
    details.open = true;
    const summary = details.createEl("summary");
    summary.createSpan({ text: `\u2699 ${state.toolName}`, cls: "vault-mind-tool-name" });
    if (state.isError) {
      summary.createSpan({ text: " \u2717", cls: "vault-mind-tool-error-indicator" });
    }
    const body = details.createDiv({ cls: "vault-mind-tool-body" });
    if (state.args) {
      const argsSection = body.createDiv({ cls: "vault-mind-tool-args" });
      argsSection.createEl("div", { text: "Arguments", cls: "vault-mind-tool-section-label" });
      const pre = argsSection.createEl("pre");
      pre.createEl("code", { text: state.args });
    }
    const resultSection = body.createDiv({ cls: "vault-mind-tool-result" });
    resultSection.createEl("div", { text: "Result", cls: "vault-mind-tool-section-label" });
    resultSection.createDiv({ cls: "vault-mind-tool-result-content" });
    state.el = details;
    this.messages.scrollTo({ top: this.messages.scrollHeight, behavior: "smooth" });
  }
  updateToolCallResult(state, final = false) {
    if (!state.el) return;
    const contentEl = state.el.querySelector(
      ".vault-mind-tool-result-content"
    );
    if (!contentEl) return;
    contentEl.empty();
    if (!state.result) return;
    if (final && this.looksLikeMarkdown(state.result)) {
      try {
        void import_obsidian4.MarkdownRenderer.render(this.app, state.result, contentEl, "", this);
      } catch {
        const pre = contentEl.createEl("pre");
        pre.createEl("code", { text: state.result });
      }
    } else {
      const pre = contentEl.createEl("pre");
      pre.createEl("code", { text: state.result });
    }
    if (state.isError) {
      state.el.classList.add("vault-mind-tool-error");
    }
  }
  looksLikeMarkdown(text) {
    return /```|^#{1,6}\s|^\s*[-*]\s|\[.*\]\(|\!\[|> |^\|.*\|/m.test(text);
  }
  extractResultText(result) {
    if (!result) return "";
    const content = result.content;
    if (!Array.isArray(content)) return "";
    return content.filter((block) => typeof block === "object" && block !== null).map((block) => getStringParam(block, "text")).join("");
  }
  setStreaming(active) {
    this.streaming = active;
    if (this.sendBtn) this.sendBtn.disabled = active;
    if (this.abortBtn) this.abortBtn.disabled = !active;
    const dot = this.root?.querySelector(".vault-mind-status-dot");
    dot?.classList.toggle("connected", active);
    this.statusBar?.setStreaming(active);
    if (active) {
      void this.statusBar?.refreshState();
    } else {
      void this.statusBar?.refreshStats();
    }
  }
  sendRpc(type) {
    return new Promise((resolve, reject) => {
      if (!this.process?.stdin?.writable) {
        resolve(void 0);
        return;
      }
      const id = `r-${nextId++}`;
      const timer = activeWindow.setTimeout(() => {
        this.pendingRpc.delete(id);
        reject(new Error("RPC timeout"));
      }, 5e3);
      this.pendingRpc.set(id, { resolve, reject, timer });
      this.process.stdin.write(`${JSON.stringify({ type, id })}
`);
    });
  }
  rejectPending(reason) {
    for (const [id, pending] of this.pendingRpc) {
      activeWindow.clearTimeout(pending.timer);
      pending.reject(new Error(reason));
      this.pendingRpc.delete(id);
    }
  }
};

// src/views/panel.ts
var import_node_fs4 = require("node:fs");
var import_node_path4 = __toESM(require("node:path"), 1);
var import_obsidian8 = require("obsidian");

// src/views/queue.ts
var import_obsidian5 = require("obsidian");
var QueueView = class extends import_obsidian5.ItemView {
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
  constructor(leaf, deps) {
    super(leaf);
    this.deps = deps;
  }
  getViewType() {
    return "vault-mind-queue";
  }
  getDisplayText() {
    return "Vault Mind Queue";
  }
  getIcon() {
    return "vault-mind";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    await this.mount(container);
  }
  async onClose() {
    this.unmount();
  }
  /** Mount view content into the given container. Used by VaultMindPanel for tabbed embedding. */
  async mount(container) {
    this.root = container.createEl("div", { cls: "vault-mind-container" });
    this.render();
    await this.connect();
  }
  /** Tear down connections. Used by VaultMindPanel on tab/panel close. */
  unmount() {
    this.disconnect();
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    const header = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    header.createEl("span", { cls: "vault-mind-status-dot" });
    header.createEl("span", { text: "Queue" });
    const refresh = header.createEl("button", { title: "Refresh" });
    (0, import_obsidian5.setIcon)(refresh, "refresh-cw");
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
        new import_obsidian5.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
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
      const message = this.explicitError || "Connection lost. Retrying...";
      const li = this.list.createEl("li", {
        cls: "vault-mind-empty vault-mind-queue-error-state"
      });
      li.createEl("span", { text: message });
      if (!this.explicitError) {
        const retryBtn = li.createEl("button", {
          title: "Retry now",
          attr: { "aria-label": "Retry connection" }
        });
        (0, import_obsidian5.setIcon)(retryBtn, "refresh-cw");
        retryBtn.addEventListener("click", () => this.connect());
      }
      return;
    }
    if (this.connectionState.reconnecting) {
      const li = this.list.createEl("li", {
        cls: "vault-mind-empty vault-mind-queue-reconnecting-state"
      });
      const spinner = li.createEl("span", { cls: "vault-mind-spinner" });
      (0, import_obsidian5.setIcon)(spinner, "loader");
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
      detail.createEl("div", { cls: "vault-mind-job-meta-line", text: `File: ${job.filePath}` });
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
      const chip = this.chips.createEl("span", { cls: `vault-mind-count-chip status-${status}` });
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
    const menu = new import_obsidian5.Menu();
    menu.addItem(
      (item) => item.setTitle("Retry").setIcon("rotate-cw").onClick(async () => {
        try {
          await this.client?.retryJob(job.id);
        } catch (err) {
          new import_obsidian5.Notice(`Vault Mind: ${err.message}`);
        }
      })
    );
    menu.addItem(
      (item) => item.setTitle("Cancel").setIcon("x").onClick(async () => {
        try {
          await this.client?.cancelJob(job.id);
        } catch (err) {
          new import_obsidian5.Notice(`Vault Mind: ${err.message}`);
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
    new import_obsidian5.Notice(`Vault Mind: ${message}`);
  }
};

// src/views/status.ts
var import_node_child_process5 = require("node:child_process");
var import_obsidian7 = require("obsidian");

// src/modals/libsecret.ts
var import_obsidian6 = require("obsidian");
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
var InstallLibsecretModal = class extends import_obsidian6.Modal {
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
    if (import_obsidian6.Platform.isMacOS && label.startsWith("macOS")) return true;
    if (import_obsidian6.Platform.isWin && label.startsWith("Windows")) return true;
    if (import_obsidian6.Platform.isLinux && !import_obsidian6.Platform.isMacOS && !import_obsidian6.Platform.isWin) {
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
      new import_obsidian6.Notice("Vault Mind: failed to copy command");
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
      new import_obsidian6.Notice("Vault Mind: confirmation did not match. Token will not be stored in plaintext.");
      return;
    }
    new import_obsidian6.Notice("Vault Mind: plaintext opt-in enabled. Import or paste a token to continue.");
    this.options.onOptIn?.();
    this.close();
  }
};

// src/views/status.ts
function shellQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
function winQuote(value) {
  return `"${value.replace(/"/g, '""')}"`;
}
var StatusView = class extends import_obsidian7.ItemView {
  deps;
  client = null;
  root = null;
  statusBar = null;
  providerEl = null;
  modelEl = null;
  watcherBtn = null;
  resultsBox = null;
  unsubState = null;
  unsubEvents = null;
  discoveredConfig = null;
  constructor(leaf, deps) {
    super(leaf);
    this.deps = deps;
  }
  getViewType() {
    return "vault-mind-status";
  }
  getDisplayText() {
    return "Vault Mind Status";
  }
  getIcon() {
    return "vault-mind";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    await this.mount(container);
  }
  async onClose() {
    this.unmount();
  }
  /** Mount view content into the given container. Used by VaultMindPanel for tabbed embedding. */
  async mount(container) {
    this.root = container.createEl("div", { cls: "vault-mind-container" });
    this.render();
    await this.connect();
  }
  /** Tear down connections. Used by VaultMindPanel on tab/panel close. */
  unmount() {
    this.disconnect();
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
        () => new InstallLibsecretModal(this.app, {
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
    this.watcherBtn = detailsBar.createEl("button", {
      text: "Start watcher",
      attr: { "aria-label": "Toggle file watcher" }
    });
    this.watcherBtn.addEventListener("click", () => this.toggleWatcher());
    const launchBtn = this.root.createEl("button", {
      text: import_obsidian7.Platform.isMacOS ? "Open in Terminal" : "Open in Console",
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
    (0, import_obsidian7.setIcon)(searchBtn, "search");
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
    this.deps.plugin.updateStatusBar(state.connected, Boolean(state.error));
  }
  handleEvent(event) {
    switch (event.type) {
      case "vault-edit-proposed": {
        new import_obsidian7.Notice(`Vault Mind: proposed edit for ${event.path}`);
        const file = this.app.vault.getAbstractFileByPath(event.path);
        if (file) {
          new DiffModal(
            this.app,
            { path: event.path, old: event.oldContent, new: event.newContent },
            async () => {
              if (!(file instanceof import_obsidian7.TFile)) {
                new import_obsidian7.Notice(`Vault Mind: file not found: ${event.path}`);
                return;
              }
              try {
                await this.app.vault.modify(file, event.newContent);
                new import_obsidian7.Notice(`Vault Mind: accepted changes to ${event.path}`);
              } catch (err) {
                new import_obsidian7.Notice(`Vault Mind: failed to write ${event.path}: ${err.message}`);
              }
            }
          ).open();
        }
        break;
      }
      case "job-notification":
        new import_obsidian7.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
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
    if (this.watcherBtn) {
      this.watcherBtn.textContent = status.watcher ? "Stop watcher" : "Start watcher";
      this.watcherBtn.classList.toggle("connected", status.watcher);
    }
  }
  setError(message) {
    this.resultsBox?.empty();
    this.resultsBox?.createEl("p", { cls: "vault-mind-empty", text: message });
    new import_obsidian7.Notice(`Vault Mind: ${message}`);
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
      const source = String(hit.source || "");
      const fact = String(hit.fact || "");
      const display = (fact || source).replace(/\|/g, "\\|").replace(/\]\]/g, "");
      const markdown = source ? `[[${source}|${display}]]` : display || JSON.stringify(hit);
      const li = list.createEl("li");
      await import_obsidian7.MarkdownRenderer.render(this.app, markdown, li, "", this);
    }
  }
  async toggleWatcher() {
    if (!this.client) return;
    try {
      const res = await this.client.toggleWatcher();
      new import_obsidian7.Notice(`Vault Mind: watcher ${res.watcher ? "started" : "stopped"}`);
      await this.refreshStatus();
    } catch (err) {
      this.setError(`Watcher toggle failed: ${err.message}`);
    }
  }
  async importToken() {
    const ok = await this.deps.tokenStore.importFromDotenv();
    if (!ok) {
      new import_obsidian7.Notice("Vault Mind: token not found in ~/.pi/agent/vault-mind.env");
      return;
    }
    new import_obsidian7.Notice("Vault Mind: token imported");
    await this.connect();
  }
  async forgetToken() {
    await this.deps.tokenStore.forgetToken();
    new import_obsidian7.Notice("Vault Mind: token forgotten");
    this.disconnect();
  }
  launchPiTui() {
    if (!import_obsidian7.Platform.isDesktop) {
      new import_obsidian7.Notice("Vault Mind: TUI launcher is only available on desktop");
      return;
    }
    const cwd = this.deps.vaultPath;
    const piConfigDir = this.deps.piConfigDir;
    const piBinary = this.deps.piBinaryPath;
    const env = { ...process.env, PI_CODING_AGENT_DIR: piConfigDir };
    try {
      if (import_obsidian7.Platform.isMacOS) {
        const script = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        const appleScript = `tell application "Terminal" to do script "${script.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
        (0, import_node_child_process5.spawn)("osascript", ["-e", appleScript]);
      } else if (import_obsidian7.Platform.isLinux) {
        const cmd = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        (0, import_node_child_process5.spawn)("x-terminal-emulator", ["-e", "bash", "-c", cmd], { env });
      } else if (import_obsidian7.Platform.isWin) {
        const cmd = `cd /d ${winQuote(cwd)} && set PI_CODING_AGENT_DIR=${winQuote(piConfigDir)} && ${piBinary} --cwd ${winQuote(cwd)}`;
        (0, import_node_child_process5.spawn)("cmd", ["/c", "start", "cmd", "/k", cmd], { env, shell: false });
      } else {
        new import_obsidian7.Notice("Vault Mind: unsupported platform for TUI launcher");
      }
    } catch (err) {
      new import_obsidian7.Notice(`Vault Mind: failed to launch pi TUI: ${err.message}`);
    }
  }
};

// src/views/panel.ts
var VIEW_TYPE_PANEL = "vault-mind-panel";
var TAB_CONFIG = [
  { id: "chat", label: "Chat", icon: "message-circle" },
  { id: "queue", label: "Queue", icon: "list" },
  { id: "status", label: "Status", icon: "activity" }
];
var VaultMindPanel = class extends import_obsidian8.ItemView {
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
    const content = this.containerEl.children[1];
    content.empty();
    content.addClass("vault-mind-panel");
    const hasExtensions = (0, import_node_fs4.existsSync)(
      import_node_path4.default.join(this.deps.vaultPath, ".pi", "agent", "npm", "node_modules", "pi-vault-mind")
    );
    if (!hasExtensions) {
      this.renderSetupPrompt(content);
      return;
    }
    const tabBar = content.createEl("div", { cls: "vault-mind-tab-bar" });
    for (const cfg of TAB_CONFIG) {
      const container = content.createEl("div", { cls: "vault-mind-tab-content" });
      container.style.display = "none";
      const button = tabBar.createEl("button", {
        cls: "vault-mind-tab-button",
        attr: {
          "aria-label": cfg.label,
          "aria-selected": "false",
          role: "tab"
        }
      });
      (0, import_obsidian8.setIcon)(button, cfg.icon);
      button.createEl("span", { text: cfg.label });
      const entry = {
        id: cfg.id,
        label: cfg.label,
        icon: cfg.icon,
        container,
        button,
        view: null,
        mounted: false
      };
      this.tabs.push(entry);
      button.addEventListener("click", () => {
        void this.switchTab(cfg.id);
      });
    }
    await this.switchTab(this.activeTab);
  }
  renderSetupPrompt(content) {
    const prompt = content.createEl("div", { cls: "vault-mind-setup-prompt" });
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
  async onClose() {
    for (const tab of this.tabs) {
      if (tab.view) {
        tab.view.unmount();
        this.removeChild(tab.view);
        tab.view = null;
        tab.mounted = false;
      }
    }
    this.tabs = [];
  }
  /** Switch to a specific tab by ID. Called by the panel and by external commands. */
  async switchTab(id) {
    this.activeTab = id;
    for (const tab of this.tabs) {
      const isActive = tab.id === id;
      tab.container.style.display = isActive ? "" : "none";
      tab.button.classList.toggle("is-active", isActive);
      tab.button.setAttribute("aria-selected", String(isActive));
      if (isActive && !tab.mounted) {
        tab.view = this.createView(tab.id);
        this.addChild(tab.view);
        await tab.view.mount(tab.container);
        tab.mounted = true;
      }
    }
  }
  createView(id) {
    const { deps } = this;
    switch (id) {
      case "queue":
        return new QueueView(this.leaf, {
          settings: deps.settings,
          tokenStore: deps.tokenStore,
          vaultPath: deps.vaultPath
        });
      case "status":
        return new StatusView(this.leaf, {
          settings: deps.settings,
          tokenStore: deps.tokenStore,
          vaultPath: deps.vaultPath,
          piConfigDir: deps.piConfigDir,
          systemMdPath: deps.systemMdPath,
          piBinaryPath: deps.piBinaryPath,
          plugin: deps.plugin
        });
      case "chat":
        return new ChatView(this.leaf, {
          vaultPath: deps.vaultPath,
          piConfigDir: deps.piConfigDir,
          systemMdPath: deps.systemMdPath,
          piBinaryPath: deps.piBinaryPath,
          includeEditorContext: deps.includeEditorContext,
          includeFilePicker: deps.includeFilePicker,
          includeSlashCommands: deps.includeSlashCommands,
          editorContext: deps.editorContext
        });
    }
  }
};

// src/main.ts
var execAsync2 = (0, import_node_util2.promisify)(import_node_child_process6.exec);
var VIEW_TYPE_QUEUE = "vault-mind-queue";
var VIEW_TYPE_STATUS = "vault-mind-status";
var VIEW_TYPE_CHAT = "vault-mind-chat";
var VAULT_MIND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><path d="M9 21h6"/><path d="M10 9a2 2 0 0 1 4 0"/><path d="M8 12h1"/><path d="M15 12h1"/><circle cx="12" cy="6" r="1"/></svg>`;
var DEFAULT_SETTINGS = {
  host: "127.0.0.1",
  port: 11435,
  piBinaryPath: "pi",
  checkExtensionOnStartup: true,
  includeEditorContext: true,
  includeFilePicker: true,
  includeSlashCommands: true
};
var VaultMindSettingTab = class extends import_obsidian9.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const piDir = import_node_path5.default.join(this.plugin.vaultPath, ".pi");
    const hasExtensions = (0, import_node_fs5.existsSync)(
      import_node_path5.default.join(piDir, "agent", "npm", "node_modules", "pi-vault-mind")
    );
    if (!hasExtensions) {
      this.renderInitSection(containerEl);
    }
    new import_obsidian9.Setting(containerEl).setName("Connection").setHeading();
    new import_obsidian9.Setting(containerEl).setName("Host").setDesc("HTTP server host").addText(
      (text) => text.setPlaceholder("127.0.0.1").setValue(this.plugin.settings.host).onChange(async (value) => {
        this.plugin.settings.host = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Port").setDesc("HTTP server port").addText(
      (text) => text.setPlaceholder("11435").setValue(String(this.plugin.settings.port)).onChange(async (value) => {
        const n = Number.parseInt(value, 10);
        this.plugin.settings.port = Number.isNaN(n) ? 11435 : n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Pi binary path").setDesc("Path to the pi executable for the chat view").addText(
      (text) => text.setPlaceholder("pi").setValue(this.plugin.settings.piBinaryPath).onChange(async (value) => {
        this.plugin.settings.piBinaryPath = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Check extension on startup").setDesc("Detect whether pi-vault-mind is installed in your pi session when Obsidian starts").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.checkExtensionOnStartup).onChange(async (value) => {
        this.plugin.settings.checkExtensionOnStartup = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Include editor context").setDesc("Send the active note path and selection with chat messages").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeEditorContext).onChange(async (value) => {
        this.plugin.settings.includeEditorContext = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Include file picker").setDesc("Allow @ references in the chat input to attach vault files as context").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeFilePicker).onChange(async (value) => {
        this.plugin.settings.includeFilePicker = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Include slash commands").setDesc("Allow / references in the chat input to run Pi commands").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeSlashCommands).onChange(async (value) => {
        this.plugin.settings.includeSlashCommands = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Folder layout").setHeading();
    new import_obsidian9.Setting(containerEl).setName("Inbox").setDesc("Agent input folder (default: Agent/Inbox)").addText(
      (text) => text.setPlaceholder("Agent/Inbox").onChange(async (value) => {
        await this.saveFolderSetting("inbox", value);
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Library").setDesc("Knowledge output folder (default: Agent/Library)").addText(
      (text) => text.setPlaceholder("Agent/Library").onChange(async (value) => {
        await this.saveFolderSetting("library", value);
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Presentations").setDesc("Broadcaster output folder (default: Agent/Presentations)").addText(
      (text) => text.setPlaceholder("Agent/Presentations").onChange(async (value) => {
        await this.saveFolderSetting("presentations", value);
      })
    );
    new import_obsidian9.Setting(containerEl).setName("Journal").setDesc("Audit/checkpoint trail folder (default: Agent/Journal)").addText(
      (text) => text.setPlaceholder("Agent/Journal").onChange(async (value) => {
        await this.saveFolderSetting("journal", value);
      })
    );
    const token = this.plugin.tokenStore;
    const backends = token.availableBackends();
    const currentMode = token.getMode();
    new import_obsidian9.Setting(containerEl).setName("Token storage").setHeading();
    new import_obsidian9.Setting(containerEl).setName("Backend").setDesc(`Current: ${currentMode === "none" ? "not configured" : currentMode}`).addDropdown((dropdown) => {
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
          new import_obsidian9.Notice(`Vault Mind: token moved to ${value}`);
        }
        this.display();
      });
    });
    new import_obsidian9.Setting(containerEl).setName("Import token").setDesc("Load from ~/.pi/agent/vault-mind.env into the selected backend.").addButton(
      (btn) => btn.setButtonText("Import from dotenv").onClick(async () => {
        const ok = await token.importFromDotenv();
        new import_obsidian9.Notice(ok ? "Vault Mind: token imported" : "Vault Mind: no token found in dotenv");
        this.display();
      })
    ).addButton(
      (btn) => btn.setButtonText("Forget").onClick(async () => {
        await token.forgetToken();
        new import_obsidian9.Notice("Vault Mind: token forgotten");
        this.display();
      })
    );
  }
  async saveFolderSetting(key, value) {
    const token = await this.plugin.tokenStore.getToken();
    if (!token) {
      new import_obsidian9.Notice("Vault Mind: no API token configured");
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
      new import_obsidian9.Notice(`Vault Mind: ${key} folder saved`);
    } catch (err) {
      new import_obsidian9.Notice(`Vault Mind: failed to save ${key} folder \u2014 ${err.message}`);
    }
  }
  renderInitSection(containerEl) {
    new import_obsidian9.Setting(containerEl).setName("Vault initialization").setHeading();
    const piBinary = detectPiBinary(this.plugin.settings.piBinaryPath, this.plugin.vaultPath);
    if (!piBinary) {
      containerEl.createEl("p", {
        cls: "setting-item-description",
        text: "Could not find the pi binary. Install pi first, then reopen settings."
      });
      return;
    }
    const initSection = containerEl.createEl("div");
    new import_obsidian9.Setting(initSection).setName("Initialize vault").setDesc(
      "Install pi-vault-mind and pi-context extensions, scaffold config, and write the system prompt."
    ).addButton((btn) => {
      btn.setButtonText("Initialize vault").setIcon("plus-circle").setCta().onClick(async () => {
        btn.setButtonText("Initializing...");
        btn.setDisabled(true);
        const progress = initSection.createEl("div", {
          cls: "vault-mind-init-progress"
        });
        try {
          await this.runInit(piBinary, progress);
          this.addStep(progress, "done", "Vault initialized \u2713 \u2014 opening chat...");
          new import_obsidian9.Notice("Vault Mind: vault initialized \u2014 launching pi");
          await new Promise((r) => activeWindow.setTimeout(r, 1e3));
          this.app.setting?.close();
          await this.plugin.openPanel("chat");
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          this.addStep(progress, "error", `Failed: ${message}`);
          new import_obsidian9.Notice(`Vault Mind: ${message}`);
          btn.setButtonText("Retry");
          btn.setDisabled(false);
        }
      });
    });
  }
  async runInit(piBinary, progress) {
    const vaultPath = this.plugin.vaultPath;
    const agentDir = import_node_path5.default.join(vaultPath, ".pi", "agent");
    const shell = process.env.SHELL || (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
    const options = {
      shell,
      timeout: 12e4,
      env: buildExecEnv()
    };
    const step1 = this.addStep(progress, "active", "Creating .pi/agent...");
    await execAsync2(`mkdir -p '${agentDir.replace(/'/g, "'\\''")}'`, options);
    this.markDone(step1);
    const step2 = this.addStep(progress, "active", "Installing pi-vault-mind...");
    const q = (s) => `'${s.replace(/'/g, "'\\''")}'`;
    await execAsync2(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-vault-mind`,
      options
    );
    this.markDone(step2);
    const step3 = this.addStep(progress, "active", "Installing pi-context...");
    await execAsync2(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-context`,
      options
    );
    this.markDone(step3);
    const step4 = this.addStep(progress, "active", "Scaffolding config...");
    this.scaffoldConfig(vaultPath);
    this.markDone(step4);
    const step5 = this.addStep(progress, "active", "Writing system prompt...");
    this.seedPiConfig(vaultPath, agentDir);
    this.markDone(step5);
  }
  scaffoldConfig(vaultPath) {
    const configPath = import_node_path5.default.join(vaultPath, "pi-vault-mind.config.json");
    const collectionsDir = import_node_path5.default.join(vaultPath, "collections");
    if (!(0, import_node_fs5.existsSync)(configPath)) {
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
      (0, import_node_fs5.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
    }
    if (!(0, import_node_fs5.existsSync)(collectionsDir)) (0, import_node_fs5.mkdirSync)(collectionsDir, { recursive: true });
    const mainJsonl = import_node_path5.default.join(collectionsDir, "main.jsonl");
    if (!(0, import_node_fs5.existsSync)(mainJsonl)) (0, import_node_fs5.writeFileSync)(mainJsonl, "", "utf-8");
  }
  seedPiConfig(vaultPath, agentDir) {
    const vaultName = this.app.vault.getName();
    const systemMdPath = import_node_path5.default.join(agentDir, "system.md");
    (0, import_node_fs5.mkdirSync)(agentDir, { recursive: true });
    if (!(0, import_node_fs5.existsSync)(systemMdPath)) {
      (0, import_node_fs5.writeFileSync)(
        systemMdPath,
        `You are an AI assistant working inside the ${vaultName} Obsidian vault. Use search and context tools to ground your answers in vault content whenever relevant.`,
        "utf-8"
      );
    }
    const configYamlPath = import_node_path5.default.join(agentDir, "config.yaml");
    if (!(0, import_node_fs5.existsSync)(configYamlPath)) {
      (0, import_node_fs5.writeFileSync)(
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
    (0, import_obsidian9.setIcon)(iconEl, icon);
    step.createEl("span", { text });
    return step;
  }
  markDone(step) {
    step.classList.replace("vault-mind-init-step-active", "vault-mind-init-step-done");
    const icon = step.querySelector(".vault-mind-init-step-icon");
    if (icon) (0, import_obsidian9.setIcon)(icon, "check");
  }
};
var VaultMindPlugin = class extends import_obsidian9.Plugin {
  editorContext = { filePath: null, cursor: null, selection: null };
  connectionState = { connected: false, error: false };
  statusBarItem = null;
  contextPushTimer = null;
  async onload() {
    (0, import_obsidian9.addIcon)("vault-mind", VAULT_MIND_ICON);
    await this.loadSettings();
    const savedData = await this.loadData() ?? {};
    this.tokenStore = new TokenStore(
      savedData.token ?? {},
      async (data) => {
        const existing = await this.loadData() ?? {};
        await this.saveData({ ...existing, token: data });
      }
    );
    this.registerEditorExtension(
      import_view.EditorView.updateListener.of((update) => {
        if (!update.selectionSet) return;
        const info = update.state.field(import_obsidian9.editorInfoField, false);
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
        const active = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
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
    if (this.settings.piBinaryPath === "pi" || !this.settings.piBinaryPath) {
      const detected = detectPiBinary(this.settings.piBinaryPath, vaultPath);
      if (detected && detected !== this.settings.piBinaryPath) {
        this.settings.piBinaryPath = detected;
        void this.saveSettings();
      }
    }
    const piConfigDir = (0, import_obsidian9.normalizePath)(`${vaultPath}/.pi/agent`);
    const systemMdPath = (0, import_obsidian9.normalizePath)(`${piConfigDir}/system.md`);
    const viewDeps = {
      settings: this.settings,
      tokenStore: this.tokenStore,
      vaultPath
    };
    const statusDeps = {
      ...viewDeps,
      piConfigDir,
      systemMdPath,
      piBinaryPath: this.settings.piBinaryPath,
      plugin: this
    };
    const chatDeps = {
      vaultPath,
      piConfigDir,
      systemMdPath,
      piBinaryPath: this.settings.piBinaryPath,
      includeEditorContext: this.settings.includeEditorContext,
      includeFilePicker: this.settings.includeFilePicker,
      includeSlashCommands: this.settings.includeSlashCommands,
      editorContext: this.editorContext
    };
    const panelDeps = {
      ...viewDeps,
      ...statusDeps,
      ...chatDeps
    };
    this.registerView(VIEW_TYPE_PANEL, (leaf) => new VaultMindPanel(leaf, panelDeps));
    this.registerView(VIEW_TYPE_QUEUE, (leaf) => new QueueView(leaf, viewDeps));
    this.registerView(VIEW_TYPE_STATUS, (leaf) => new StatusView(leaf, statusDeps));
    this.registerView(VIEW_TYPE_CHAT, (leaf) => new ChatView(leaf, chatDeps));
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
    (0, import_obsidian9.setIcon)(ribbonIconEl, "vault-mind");
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
  async checkExtension() {
    const installed = await checkVaultMindInstalled(this.settings.piBinaryPath, this.vaultPath);
    if (!installed) {
      new InstallVaultMindExtensionModal(this.app, {
        piBinaryPath: this.settings.piBinaryPath
      }).open();
    }
  }
  onunload() {
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
