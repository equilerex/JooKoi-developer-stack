# Global skills

Tracked mirror of the machine-wide skills at `~/.agents/skills/`. `~/.agents` is where global skills actually live and get used day to day — this folder exists so a curated subset is versioned/recoverable, not so this repo can author them.

Direction is per-skill:
- **`jookoi-paper-trail`** — authored here first (born from this repo's own memory-system design), then copied out to `~/.agents/skills/`. This repo is the source for it.
- **`jookoi-create-skill`** — adapted here from the installed `skill-creator` package, then copied out to `~/.agents/skills/`. This repo is the source for the personal version.
- **`jookoi-note`** — authored here first, then copied out to `~/.agents/skills/`. This repo is the source for it; invoke it manually to capture durable cross-project notes here from another project. Transient process observations belong in `jnote` instead.
- **`jookoi-vault-triage`** — authored here (extracted from the retired `jookoi-mobile-vault` triage pipeline), linked into `~/.agents/skills/` and `~/.claude/skills/`. This repo is the source for it. Heavy filing of dumps and Inbox captures, in a chat through a vault's MCP server or in Claude Code with its scripts. The vault's rules live in the vault itself (`_AI_INSTRUCTIONS.md`).
- **`jookoi-vault`** — authored here, linked into `~/.agents/skills/` and `~/.claude/skills/`. Day-to-day adds and lookups in a vault through its MCP server. Upload zips for claude.ai and ChatGPT of both vault skills are built into `_generated/skill-zips/`.
- **`find-docs`** — authored at `~/.agents/skills/` (Context7 docs lookup, already in daily use), copied in here as a backup. `~/.agents` is the source for it.

Add further skills here only once they've actually earned global scope and are in real use — don't populate speculatively, and don't mirror the full `~/.agents/skills/` library (47+ skills as of 2026-09-01) wholesale.
