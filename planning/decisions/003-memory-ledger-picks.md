# Decision 003 — Personal cross-project memory/ledger (topic 10)

Date: 2026-08-23
Status: NOT PICKED. Candidates ruled out/scoped down below; no candidate chosen. User explicitly said there isn't enough information yet to pick — this file records the rejects and the open research question, not a decision.

Source: user's read-through notes on `planning/memory-and-progress-ledgers.md`, logged in `planning/local/review-status.md`.

## Rejected

- **Claude Code's own built-in memory system** — not usable as the dev-stack's memory system. Reasons: write timing/contents are non-deterministic (model decides when/what to save, sometimes without the user realizing), no overview/audit of what's stored, not portable (disabled at work), and it's really scoped for high-level harness-support instructions ("never commit on your own"), not project-level knowledge. Fine for Claude itself to keep using it internally — just not something this stack relies on.
- **Plain dated journal files, hand-written** — hard veto. No structure, no meaning, doesn't scale.

## Undecided - binary files, or Linux files, pluck it on more lockdown corporate environments I could investigate forking it. Then maybe seeing, if we can have a clean version without the problematic ones, they are mainly part of dependencies 

- **Obsidian vault** — corporate-environment blocker (Linux-only binary deps flagged by firewall) **resolved 2026-08-23**: user forked the repo, edited the dependency set to be compatible with the work system, and the npm lib itself was scanned and copied securely into the org's own Artifactory. No longer a hard veto for the corporate constraint — worth re-weighing as a real candidate again, not just a documented-but-ruled-out option. Still needs to be weighed against the opinion piece below and the other candidates on their merits, not just "no longer blocked."

## undecided,  scoped down

- **Periodic extraction scripts mining session transcripts / branch-naming patterns** — not a memory system by itself, but legitimate as an environment-diagnostic helper utility: pattern-match branch names for ticket numbers, mine logs for general takeaways. Useful, keep as a supporting utility, not the core answer.

## Research expansion pass, 2026-08-23 — still not a pick

`memory-and-progress-ledgers.md` was expanded per the user's flag that it was too thin and conflated three separate concerns (repo-scoped context files / personal cross-project second-brain / Graphify). Real market research now exists there: named memory-layer products (Mem0, Letta, Cognee, Zep/Graphiti — Zep dropped its self-hosted CE in 2026), the "does markdown scale" community debate (real, unsettled, sharpened against this project's specific small-curated-set scope), and a correction to Graphify's framing (it has a secondary ledger-adjacent layer, not purely separate). None of this constitutes a pick — the user has not yet read the expanded doc. See that file's "Scope clarification" section for the full three-way split.

## Still open — needs more research, not yet a real pick

User's proposed direction (not yet verified against the evidence bar — new idea, not sourced from `_ai-tooling-recommendations.md` or prior research):

- Centralized location (e.g. `~/.agents`) with a **skill** (possibly global) that generates a folder structure mirroring the user's actual repos/directories.
- Each mirrored folder holds a small set of curated reference files using conventional names (`architecture.md`, `decisions.md`, etc.) — the "must-haves that aren't obvious from code or context."
- Entries are AI-authored, not manually maintained — likely triggered via a session-start/session-end hook that tells the agent to log work done.
- Explicit contrast with raw session logs: those are rich but expensive to search/recover from; this is meant to be a small curated set, not a transcript dump.
- Open question the user flagged directly: what alternatives exist besides Obsidian for the vault/storage layer, and whether they'd work in a locked-down corporate environment — not yet checked.

## Why this is logged now

Per `TODO-LIST.md`, topic 10 blocks real picks for topic 1 (context/memory files) and topic 3 (session/token economics — ledger touches this via what gets bundled per session). The reject/accept calls above are decided enough to unblock those; the "still open" section is not — needs a dedicated research pass (candidate storage/vault options usable in a corporate/no-linux, no uv, no pipx/no-MCP environment) before promoting to `skills/`.

## Opinion piece read: "Stop Calling It Memory" (Obsidian-as-memory critique)

`planning/local/opinion-piece-mem.md` — argues markdown files (Obsidian, OpenClaw's `MEMORY.md`) aren't real memory at scale: no querying, no relationships, a hard scale ceiling (dumping the whole file into context vs. an actual query), no schema enforcement, no concurrent-write safety. Real alternatives named: SQLite for structured records, an embedded graph DB (Kuzu) for relationships, Supabase for a fuller stack.

**Relevance to the open proposal above:** doesn't kill the centralized-curated-reference-files idea, but sharpens it. The proposal is explicitly a *small, curated* set (architecture.md, decisions.md per repo) — not a growing personal database of thousands of records, which is the scale where this piece's failure modes actually bite. Markdown likely stays fine for that use case. But it's a real warning against letting it grow into something it was never a database for — if the ledger idea ever grows toward "queryable facts about hundreds of decisions," that's the point to revisit SQLite/graph-DB rather than scaling markdown past its ceiling.

## Next step
- [x] Research done 2026-08-23: vault/storage alternatives to Obsidian, checked against the corporate no-uv/no-pipx/no-native-binaries/no-MCP/Windows constraint — see `memory-and-progress-ledgers.md` §8. Short version: named vault products (Obsidian, Logseq, Trilium, Joplin, Anytype, Memos, Outline, Tana) mostly fail the filter or aren't plain files at all; Foam is the one that cleanly passes; the real answer is that the design doesn't need a vault product — the closest prior art is the Cline-style "Memory Bank" pattern (a fixed small set of markdown files, no database). Kuzu, the opinion piece's proposed graph-DB backend, is confirmed dead (archived Oct 2025) — that part of the earlier recommendation is stale; plain stdlib SQLite FTS5 is the one queryable backend that needs zero installs, if it's ever needed.
- Prototype: what the generated-reference-file skill would actually look like (trigger via hook, file naming convention, mirrored folder structure) — this is a Stage 4 design task, now unblocked on research grounds, still not started.
- Once read by the user and the pick is made, revisit topics 1 and 3 for their own decision files. (Topic 1 now separately has its own deep-dive doc, `base-instruction-files.md`, written 2026-08-23 independent of this pick.)

similat to the install issues here, we also have issues with graphiphy on corporate that needing to be investigated to see if there's a better alternative. or workaround for the fact that install requirex uv or pipx commands, which is not avaliable in the corporate environment (any way to fork it?)
 
`uv` and `pipx` are mainly **installation/isolation tools**, not core Graphify requirements. They make Python CLI installs cleaner and avoid dependency conflicts.

You can likely bypass them with plain Python:

```bash
python -m pip install graphifyy
python -m graphify
```

If corporate firewalls block PyPI itself, switching from `uv` to `pip` will not help. Then you'd need an internal package mirror, offline wheels, or vendored dependencies.

Forking is also viable, but probably unnecessary unless Graphify hardcodes `uv`/`pipx` somewhere in its installer.

do the dependencies inclued any binaries ?

Yes. The default Graphify dependency set includes packages with native compiled binaries, mainly:

numpy
rapidfuzz
tree-sitter
~30 tree-sitter-* language parsers

These normally come as prebuilt Python wheels, so you usually do not need a compiler, but corporate security can still treat them differently from pure-Python packages.

Some optional dependencies are heavier. For example faster-whisper, psycopg[binary], and graspologic can pull in additional native components. tree-sitter-dm explicitly requires compilation on Linux/macOS.

So yes, if your corporate environment restricts downloaded executables/native libraries, that may be the real obstacle, rather than uv itself.

