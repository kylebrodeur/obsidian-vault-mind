> **Alpha — not yet in the Obsidian community-plugin store.**
> Install via [BRAT](https://github.com/TfTHacker/obsidian42-brat) for now.

# Vault Mind

A right-hand side panel for Obsidian that connects to the local
[`pi-vault-mind`](https://github.com/kylebrodeur/pi-vault-mind) extension.

It gives you three dockable views:

- **Vault Mind Queue** — live list of pending / running / done / failed /
  cancelled agent dispatch jobs, with retry / cancel buttons.
- **Vault Mind Status** — pi running state, watcher toggle, embedding
  provider/model, and a search box.
- **Vault Mind Chat** — a chat surface that talks to `pi` directly via the
  existing RPC mode.

## Views

![Vault Mind Status](screenshots/status.png)
*Status view — connection state, token mode, watcher toggle, and vault search.*

![Vault Mind Queue](screenshots/queue.png)
*Queue view — live job list with count chips and keyboard-focusable rows.*

![Vault Mind Setup](screenshots/setup.png)
*Setup view — pre-filled from `~/.pi/agent/vault-mind.config.json`.*

![Vault Mind Chat](screenshots/chat.png)
*Chat view — message history, tool calls, and composer.*

## Requirements

- Obsidian 1.5.0+ desktop (Electron-based; mobile is not supported).
- `pi-vault-mind` extension running in a local `pi` session (or headless).
- A `PVM_API_TOKEN` configured in env, `~/.pi/agent/vault-mind.env`, or the
  extension config. The plugin imports the token from the dotenv file and
  seals it in the OS keychain via Electron `safeStorage`.

## Install

### Manual (alpha)

1. Download `obsidian-pi-vault-mind.zip` from the latest
   [GitHub release](https://github.com/kylebrodeur/pi-vault-mind/releases).
2. Extract it into your vault:
   `<vault>/.obsidian/plugins/obsidian-pi-vault-mind/`.
3. The folder must contain `main.js`, `styles.css`, `manifest.json`, and
   `versions.json`.
4. Restart Obsidian, then enable **Vault Mind** in Settings → Community Plugins.

### BRAT

1. Install the `obsidian42-brat` plugin and enable it.
2. Open BRAT settings → **Add Beta plugin with frozen version**.
3. Enter the repository URL: `https://github.com/kylebrodeur/pi-vault-mind`.
4. Pick the latest release that starts with `obsidian-v`. BRAT will download
   the `obsidian-pi-vault-mind.zip` asset.
5. Enable **Vault Mind** in Settings → Community Plugins.

## Usage

Open the command palette and choose one of:

- `Vault Mind: Open Queue`
- `Vault Mind: Open Status`
- `Vault Mind: Open Chat`

On first run, the plugin will prompt you to import the bearer token from
`~/.pi/agent/vault-mind.env`. It then connects to
`http://127.0.0.1:11435` by default (configurable in settings) and opens the
setup wizard if the extension is not yet configured.

## Development

```bash
# from repo root
pnpm install
pnpm --filter obsidian-pi-vault-mind dev   # watch build
pnpm --filter obsidian-pi-vault-mind build  # production build
```

Production build outputs `packages/obsidian/main.js`, which Obsidian loads
from the plugin directory.

## Attribution

- Plugin scaffold patterns inspired by
  [`RAIT-09/obsidian-agent-client`](https://github.com/RAIT-09/obsidian-agent-client)
  (Apache-2.0).
- Chat view forked from
  [`gengyabc/obsidian-pi-plugin`](https://github.com/gengyabc/obsidian-pi-plugin)
  (MIT). See `THIRD_PARTY_NOTICES.md`.

## License

MIT
