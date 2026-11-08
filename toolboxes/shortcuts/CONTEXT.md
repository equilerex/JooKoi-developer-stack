# CONTEXT — shortcuts
updated: 06-11-2026 01:10

## What this is

`jj`: a terminal menu (clack) for jumping to folders and projects, starting apps and running commands. Plus clickable `.bat` shortcuts, which the menu lists under Apps.

- Add or change menu entries in `jj.config.json`. Each entry has a `label`, an optional `hint`, and one action:
  - `cd` changes folder
  - `run` runs a command in the current terminal
  - `open` starts a file or URL in a new window
- Tokens in paths: `~`, `{repo}`, `{shortcuts}`.
- Machine-specific entries go in `_jookoi-jj.config.json`, which is gitignored. Its groups merge into same-label groups.
- Apps: any `.bat` in this folder shows up there. Its first `rem` line is the hint. No `start-` prefix in names.
- npm scripts: lists the scripts of the nearest `package.json` at or above the folder you ran `jj` from. A `"// name": "..."` key in `scripts` becomes that script's hint. Without one, the hint is the script command itself.
- Install once per machine with `npm install`, then `npm run setup:jj`. That adds a marked block to the PS 5.1, PS 7 and `~/.bashrc` profiles, loading `jj.ps1` / `jj.sh` from here. For CMD it puts this folder on the user PATH, which makes `jj.cmd` the command. It also adds a second `~/.bashrc` block that sources `terminal-welcome-screen.sh`.
- `terminal-welcome-screen.sh`: the Git Bash start banner. Lists only the agent CLIs found on this machine and the nearest `package.json` scripts. Git Bash only, PowerShell and CMD have no banner.

## Why it's built this way

A child process cannot change its parent shell's folder. So `jj.mjs` writes `cd` or `run` plus a payload to the temp file named in `JJ_RESULT_FILE`. The shell wrapper reads that file and applies it. `open` needs no shell, so node launches it directly.

## Gotchas

- The profile blocks and the PATH entry hold this folder's absolute path. After moving or renaming the repo or `toolboxes/`, re-run `npm run setup:jj`. A stale block fails silently (`Test-Path` / `[ -f ]` guards), `jj` just stops existing. Setup also removes an old `skill-toolboxes\shortcuts` PATH entry.
- Every `.bat` and `jj.cmd` here is on PATH after setup, so keep names free of clashes with real commands.
- `jj.cmd` reads the payload with a plain `for /f`, so `run` entries containing `!` or unbalanced quotes are not safe in CMD.
- `run` strings go through `Invoke-Expression` in PowerShell and `eval` in Git Bash. Keep them to syntax both shells accept, such as `git ...` and `npm ...`.
- Project discovery scans `projectRoots` 3 levels deep for `.git`, which can be a dir or a worktree file. Names ending in `-2` and similar are grouped as copies of one project.
