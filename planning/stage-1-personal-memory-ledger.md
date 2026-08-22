# Stage 1 — Personal Cross-Project Memory/Ledger

Deeper curation on baseline topic #10: a private, cross-repo record of what was worked on and why — independent of git log, not visible to colleagues, not tied to any single repo. Four candidates from Stage 0, evaluated here on setup/maintenance cost, the provider-independence test ("if Claude disappeared tomorrow, how much of this would still be usable"), and automation potential. No winner picked — this is options plus trade-offs, for you to choose from.

---

## 1. Claude Code's built-in memory system

**What it is.** Since Claude Code 2.1.59 (Feb 2026), Auto Memory ships on by default: Claude writes and maintains its own Markdown files under `~/.claude/projects/<project>/memory/`, loading an index (`MEMORY.md`) at session start that points to topic-specific files (this session used exactly this mechanism to store the "no commits" preference). Claude treats its own memory as a hint to verify against real code, not a fact to act on blindly.

**Setup/maintenance cost.** Effectively zero setup — it's on by default and self-writing. Maintenance is passive: you read/edit/delete files like any Markdown, but the system populates itself as you work and correct it.

**Provider independence.** Weak on this specific axis. The files themselves are plain Markdown and readable/portable by hand, but the *mechanism that decides what to write and when* is Claude Code's own harness logic — nothing else currently reads or writes this format automatically. If Claude disappeared, the accumulated files would survive as inert notes; the "occasionally auto-log a ledger entry" behavior would not.

**Automation potential.** Highest of the four, and already built — no scripting required. This directly answers the "can it write itself as I go" want from Stage 0: it already does, today, for free.

**Sourcing.** Official Claude Code docs (`code.claude.com/docs/en/memory`), and independent write-ups confirming the same architecture (Ian Paterson's blog on the MEMORY.md/topic-file structure; Claude Directory's auto-memory guide). Consistent across primary docs and independent coverage — solid.

---

## 2. Plain dated journal files

**What it is.** A flat folder of dated Markdown files (`~/.agents-journal/YYYY-MM-DD.md`), written by hand or with light AI assistance, no special tooling.

**Setup/maintenance cost.** Lowest possible setup (a folder). Maintenance cost is entirely discipline — nothing populates it for you, so it only has value if you (or a prompted AI) actually writes to it each session.

**Provider independence.** Strongest of the four by construction — it's just files, no vendor mechanism involved at all. Trivially passes "if Claude disappeared tomorrow."

**Automation potential.** Not self-populating on its own, but easy to bolt automation onto: a base prompt instruction ("append a dated entry summarizing this session's work to `~/.agents-journal/`") turns this into a semi-automated version of option 1, minus the vendor lock-in, at the cost of it only firing when you remember to trigger it (or wire a session-end hook to do so — see baseline topic #6).

**Sourcing.** This is closer to a general documentation practice than a named tool — the search results here are mostly generic "Markdown+Git for docs" advice rather than a specific practitioner-endorsed "personal engineering journal" pattern. Weakest sourcing of the four; treat this as a well-understood pattern rather than a named, widely-cited practice.

---

## 3. Personal notes vault (Obsidian-class)

**What it is.** A dedicated, local-first Markdown vault (Obsidian being the practitioner-standard example) used as a "second brain" — linked notes, backlinks, search, and increasingly AI-assisted querying over your own vault.

**Setup/maintenance cost.** Highest of the four — a real tool to learn (linking conventions, folder structure, plugin choices if you go that route). Pays off if you want search/cross-linking across years of notes; overkill if you just want a log.

**Provider independence.** Very strong: vault contents are local Markdown files, independent of any AI account or model, and switching between Claude, GPT, or local models doesn't lose notes. This is explicitly called out as a selling point by current coverage, not just an incidental property.

**Automation potential.** Real, but requires setup: 2026 coverage points to connecting Claude Code to an Obsidian vault via MCP, turning the vault into a live workspace Claude can read/search/modify — and separately, structured note types plus encoded agent skills are reported to cut knowledge-management overhead from 30–40% of time to under 10% for at least one practitioner. This is the most capable automation path of the four, but also the only one requiring you to build the MCP/skill wiring yourself; it doesn't come free like option 1.

**Sourcing.** Reasonably well-sourced for the general pattern (Obsidian's own long track record, multiple 2026 write-ups on Obsidian+AI integration, the MCP-to-Obsidian pattern specifically). One source cited a specific 30–40%→10% overhead claim from a named practitioner blog — treat that number as one person's report, not a benchmark.

---

## 4. Periodic extraction scripts from session logs

**What it is.** A script that walks the local JSONL session logs every AI coding tool already writes (`~/.claude/projects/*.jsonl` for Claude Code, equivalents for Codex CLI, etc.) and compiles a summary ledger — prompts, tool calls, changed files — into Markdown.

**Setup/maintenance cost.** Real but bounded: multiple sources describe this as roughly a 20-line script (walk each JSONL file, emit a heading per user turn, format tool calls as fenced code blocks). Existing prior art includes purpose-built tools (`codeburn`, `tokscale` for token/cost tracking across 37+ tools; a `parse-sessions.py` pattern that takes a project slug and date range and produces a Markdown work summary) as well as roll-your-own scripts covered on DEV Community for browsing Claude Code/Codex CLI logs specifically.

**Provider independence.** Strong on the *output* (plain Markdown ledger, yours to keep), weaker on the *input* (each tool's JSONL log format is vendor-specific, so a script written against Claude Code's schema needs adjustting — not rewriting from scratch — for Copilot/Gemini equivalents). Better independence than option 1, worse than options 2/3.

**Automation potential.** This *is* the automation, run on a schedule (cron/scheduled task) rather than triggered per-session — the "occasional local endpoint call" idea from Stage 0 maps most directly onto this option. Doesn't require you to remember anything mid-session, unlike option 2's manual/hook-triggered version.

**Sourcing.** Genuinely well-attested — multiple independent tools and write-ups (GitHub repos, DEV Community posts) converge on the same underlying approach, and the JSONL log locations are documented by Claude Code itself. Solid.

---

## What still needs a real trial, not just research

Which of these actually sticks is not decidable from research alone — Stage 0 already flagged this as "legitimately unclear which wins until you've tried logging into one for a few weeks," and nothing found here overturns that. Two things are decidable now, though: option 1 (built-in memory) costs nothing to keep running regardless of what else gets adopted, since it's already on; and option 2 (plain journal) is the cheapest to trial in parallel with anything else, since it's a folder and a prompt instruction. The real fork is between "accept vendor coupling for zero-effort automation" (1) and "own the pipeline for stronger independence" (3 or 4) — that's a judgment call on how much the provider-independence constraint should weigh against setup effort, not a research question.

---

## Sources

Claude Code official docs (`code.claude.com/docs/en/memory`); Ian Paterson, "Claude Code Memory System: MEMORY.md & Topic Files"; Claude Directory, "Claude Code's Auto-Memory" guide; Eric J. Ma, "Mastering Personal Knowledge Management with Obsidian and AI" (2026); multiple 2026 Obsidian+AI/MCP integration write-ups (eesel AI, NxCode, dsebastien.net); `codeburn` and `tokscale` GitHub repos (session-log/token tracking across AI coding tools); DEV Community posts on parsing Claude Code/Codex CLI JSONL session logs; labuladong.online on Claude Code session storage locations.
