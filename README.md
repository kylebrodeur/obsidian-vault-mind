> **Alpha — not yet in the Obsidian community-plugin store.**
> Install via [BRAT](https://github.com/TfTHacker/obsidian42-brat) for now.

# Vault Mind

The Obsidian plugin for
[`pi-vault-mind`](https://github.com/kylebrodeur/pi-vault-mind).
It mounts the Vault Mind setup/configuration surfaces and the main working panel
for a single vault-local runtime.

## Current surfaces

- **Setup wizard** — first-run runtime/install/provider/folder/preferences/review flow.
- **Settings tab** — grouped configuration categories mounted in Obsidian Settings.
- **Vault Mind panel** — the main working surface after setup, including chat and the shipped panel tabs.

## Views

![Vault Mind Status](screenshots/status.png)
*Status-style runtime/configuration surface during setup and recovery.*

![Vault Mind Queue](screenshots/queue.png)
*Historical queue/status screenshot from the alpha period. Current product work is centered in the unified Vault Mind panel and Settings surfaces.*

![Vault Mind Setup](screenshots/setup.png)
*Setup view — hydrated from the vault-local Vault Mind configuration surface under `<vault>/.vault-mind/`.*

![Vault Mind Chat](screenshots/chat.png)
*Chat/work panel after setup and first-run handoff.*

## Requirements

- Obsidian desktop.
- `pi-vault-mind` available for the vault you are configuring.
- A runtime bearer token (`PVM_API_TOKEN`) available in env or
  `<vault>/.vault-mind/vault-mind.env` when required.

The plugin can import the vault-local dotenv token and seal it in the OS
keychain via Electron `safeStorage`.

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

Open the command palette and use:

- `Open Vault Mind`
- Obsidian **Settings → Vault Mind** when you need the setup/configuration surface

On first run, the plugin can import the bearer token from
`<vault>/.vault-mind/vault-mind.env`. It then connects to
`http://127.0.0.1:11435` by default (configurable in settings) and opens the
setup wizard if the extension is not yet configured.

After setup, the panel opens the normal chat/work surface. Personalization is a
separate first-run step in the panel; setup does not claim to run it
automatically.

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
- Chat view originally forked from
  [`gengyabc/obsidian-pi-plugin`](https://github.com/gengyabc/obsidian-pi-plugin)
  (MIT). See `THIRD_PARTY_NOTICES.md`.

## License

MIT
