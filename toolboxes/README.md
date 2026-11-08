# Toolboxes

My opinionated sets of AI skills and personal tools that I want **some of the time**, not in every session and not tied to one repo.

---

## Why toolboxes

AI harnesses make skills close to **all or nothing**.

| Where a skill lives | What you get |
|---|---|
| `~/.agents/skills`, `~/.claude/skills`, `~/.gemini` | ❌ Loaded in every session, everywhere. Fills context with skills you don't need. |
| A repo's own `.agents/skills` | ❌ Only inside that repo. Wrong home for a tool you use across projects or for personal stuff. |
| A toolbox here | ✅ Pick and mix. Open the box when the work calls for it. |

The gap is the middle layer, which covers:

- 🔧 **Speciality apps.** Directory Opus, a Rust toolchain, LED firmware. Deep skills, needed a few days a month.
- 🧰 **Personal tooling.** Scripts and shortcuts that are mine and don't belong in any project repo.
- 🎯 **Task kits.** A set of skills for one kind of work, loaded only for that work.

## How a toolbox works

Each box is a folder that looks like a mini repo to the harness:

```text
toolboxes/
├── windows-toolbox/        # Windows apps (Directory Opus, private)
│   ├── .agents/skills/     # skills, loaded as project skills when you start an agent here
│   └── .claude/skills/     # same skills, for Claude Code
├── angular-toolbox/        # Angular skills, copied into Angular repos
├── frontend-toolbox/       # animation and component skills, any framework
├── repo-tooling/           # graphify setup, WebStorm inspections, run against another repo
├── my-global-setup/        # copy source for ~/.agents and ~/.claude, copied out, never opened as a session
└── shortcuts/              # jj menu and clickable .bat launchers, not skills
```

- **Use a box:** start the agent inside it (`cd toolboxes/windows-toolbox`, then `claude`). Its skills load as that session's project skills.
- **Need one skill everywhere for a while:** copy it into `~/.agents/skills`, then remove it when you're done.
- **New box:** a new folder with `.agents/skills/`. No registration, no installer.

---

## Shortcuts

`shortcuts/` is a terminal menu plus clickable launchers. Type `jj` in PowerShell, PowerShell 7, Git Bash or CMD.

| Group | What it does |
|---|---|
| Folders | Jump to a favourite folder |
| Projects | Every git repo under `projectRoots` (default: the folder two levels above this repo), type to filter |
| npm scripts | Scripts of the nearest `package.json`, run in place |
| Apps | Every `.bat` in `shortcuts/`, started in a new window |
| Utils | Your own commands |

- ✏️ **Add an entry** without code: one line in `shortcuts/jj.config.json`.

  ```json
  { "label": "Build the thing", "hint": "Shown next to the label", "run": "npm run build" }
  ```

- 🖱️ **Add an app:** drop a `.bat` in `shortcuts/`. Its first `rem` line becomes the hint. No `start-` prefix, so names stay quick to type.
- 🔒 **Machine-specific entries** go in `shortcuts/_jookoi-jj.config.json`, which is gitignored.
- 🔧 **Install once per machine:** `npm install`, then `npm run setup:jj`. It wires `jj` into the PowerShell profiles and `~/.bashrc`, and adds the `shortcuts/` folder to the user PATH so CMD finds `jj.cmd`. Re-run it after moving this folder, the profiles hold the absolute path.

How it works and its gotchas: [`shortcuts/CONTEXT.md`](./shortcuts/CONTEXT.md).

## Terminal welcome screen

`shortcuts/terminal-welcome-screen.sh` prints a short screen whenever a Git Bash window opens. `npm run setup:jj` adds the line to `~/.bashrc`. PowerShell and CMD don't show it yet.

- 📋 the npm scripts of the nearest `package.json`, up to 8, and `jrun <name>` to run one
- ⌨️ `jj` plus whichever of `claude`, `copilot`, `gemini`, `codex`, `jnote` are installed
- 💡 key bindings for the shell, Claude Code and Gemini CLI

It stays silent in non-interactive shells and inside agent sessions. `JOO_SKIP_WELCOME=1` turns it off, `JOO_WELCOME_LOGO=1` shows the ASCII logo.

Same idea as the rest of this folder: tooling you forget you have is tooling you don't use. The welcome screen keeps it in view.
