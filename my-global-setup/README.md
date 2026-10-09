# my-global-setup

Literal copy of what belongs under the user's home directory (`~/.agents/`, `~/.claude/`) on this machine. **Inert source, not live config** — Claude Code, or any harness, never reads from inside this repo folder. It's tracked here purely so machine-local setup survives a reinstall or travels to a new machine; applying it is always a manual copy-out step (below), never automatic.

## Layout

```
my-global-setup/
├── .agents/
│   ├── AGENTS.md       global behavior ruleset — copy to ~/.agents/AGENTS.md
│   └── skills/         global skills, copied out with `npm run copy:skill`
├── .claude/
│   └── settings.json   portable copy of ~/.claude/settings.json permission grants — copy-source only, not read live by Claude Code
└── .gitignore          literal file — merge into, or use as, ~/.gitignore
```

`.claude/settings.json` carries `permissions.allow` entries (Bash rules that would otherwise need re-approving per machine) between machines. Not `_jookoi-`-prefixed — that prefix means "private, gitignored," and the whole point of this folder is the opposite: tracked, so it survives across machines. Merge its content into the real `~/.claude/settings.json` by hand; nothing in this repo does it automatically.

## To apply on a machine

1. Copy `.agents/` to `~/.agents/`, and merge `.claude/settings.json` into `~/.claude/settings.json` (`cp -r .agents ~/.agents` on the target machine, or the Windows equivalent).
2. Merge this folder's `.gitignore` lines into `~/.gitignore` (or point `core.excludesFile` straight at a copy of it, if `~/.gitignore` doesn't exist yet).
3. `git config --global core.excludesFile ~/.gitignore`.

All three steps are manual, on purpose — no setup script. If `~/.agents/AGENTS.md` or `~/.claude/settings.json` already exist and diverge, diff by hand and merge; don't blind-overwrite.

## Copying skills

Skills are copied as real files. Nothing is linked and no folder is canonical.

```bash
npm run copy:skill
```

The command reads `_jookoi-skill-locations.json` at the repo root, which lists the source and destination folders. Nothing is scanned. Then it asks for:

1. A source.
2. The skills to copy from that source.
3. The destinations: any indexed folder, or `global`, which writes the same skill to `~/.agents/skills` and `~/.claude/skills`.
4. A plan, one row per skill and folder, with a status: `new`, `same` (skipped), `differs`, `replace link`, or `blocked` (a file is in the way).
5. A confirm, default No.

Each copy replaces the destination skill folder in full. Files the source no longer has are removed. A failed copy leaves the old folder in place.

`--dry-run` prints the plan and stops before the confirm. It is a testing aid.

## LLM read access to `_jookoi-` files

`_jookoi-*` being gitignored does **not** block Claude Code (or other agents) from reading these files — a gitignore only controls what `git` tracks, and Claude's `Read` tool reads by explicit path regardless of gitignore status. Confirmed 2026-09-01: no settings.json key or pattern-based override exists (or is needed) for this.

The one real gap: `Glob`/`Grep` (ripgrep-backed) skip gitignored paths by default, so a broad directory search won't surface `_jookoi-*` files on its own. Workaround: reference `_jookoi-` paths directly (they're named in `AGENTS.md`/`CONTEXT.md` at the folders that have them) rather than relying on a glob/grep sweep to find them. There is no global, pattern-scoped flag to make Glob/Grep include them — the only override (`CLAUDE_CODE_GLOB_NO_IGNORE=false`) is all-or-nothing across every path, not just `_jookoi*`, so it's not used here.

## To bring hand-edits back

If you edit `~/.agents/AGENTS.md` directly on a machine, copy it back here and commit from `JooKoi-developer-stack` — this folder is the source of truth, not the live `~/.agents/`.
