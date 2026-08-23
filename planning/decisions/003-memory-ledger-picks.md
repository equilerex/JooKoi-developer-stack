# Decision 003 — Personal cross-project memory/ledger (topic 10)

Date: 2026-08-23
Status: NOT PICKED. Candidates ruled out/scoped down below; no candidate chosen. User explicitly said there isn't enough information yet to pick — this file records the rejects and the open research question, not a decision.

Source: user's read-through notes on `planning/memory-and-progress-ledgers.md`, logged in `planning/local/review-status.md`.

## Rejected

- **Claude Code's own built-in memory system** — not usable as the dev-stack's memory system. Reasons: write timing/contents are non-deterministic (model decides when/what to save, sometimes without the user realizing), no overview/audit of what's stored, not portable (disabled at work), and it's really scoped for high-level harness-support instructions ("never commit on your own"), not project-level knowledge. Fine for Claude itself to keep using it internally — just not something this stack relies on.
- **Plain dated journal files, hand-written** — hard veto. No structure, no meaning, doesn't scale.

## Undecided - binary files, or Linux files, pluck it on more lockdown corporate environments I could investigate forking it. Then maybe seeing, if we can have a clean version without the problematic ones, they are mainly part of dependencies 

- **Obsidian vault** — worth leaving in the docs as a documented option, but the MCP requirement (+ typically needing binaries blocked by firewall) rules it out for the corporate-environment requirement, which is a hard constraint for this stack. Might try at home for personal use, but not the universal/portable pick.

## undecided,  scoped down

- **Periodic extraction scripts mining session transcripts / branch-naming patterns** — not a memory system by itself, but legitimate as an environment-diagnostic helper utility: pattern-match branch names for ticket numbers, mine logs for general takeaways. Useful, keep as a supporting utility, not the core answer.

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
- Research: vault/storage alternatives to Obsidian that work without linux binaries /MCP in a locked-down environment.
- Prototype: what the generated-reference-file skill would actually look like (trigger via hook, file naming convention, mirrored folder structure) — this is a Stage 4 design task once the storage question is answered.
- Once both are resolved, revisit topics 1 and 3 for their own decision files.

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

