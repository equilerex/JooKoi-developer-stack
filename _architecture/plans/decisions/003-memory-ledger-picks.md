# Decision 003 — Personal cross-project memory/ledger (topic 10)

Date: 2026-08-23

Status: TRIAL

Source: user's read-through notes on what is now `ai-tooling-crash-course-for-developers/topics/memory-and-progress-ledgers.md`, logged in `_jookoi-architecture/review-status.md`.

## Problem

Topic 10 blocks real picks for topic 1 (context/memory files) and topic 3 (session/token economics — the ledger touches this via what gets bundled per session). Nothing existed as a personal, cross-project memory layer, and the available options ranged from a harness's own built-in memory to full memory-layer products to plain files.

A separate concern was conflated with this one and has since been split out: **repo-scoped, feature-local context files** living beside the code they describe, discovered on demand rather than loaded every session, and moving or disappearing with the feature. That is "per-feature architectural context" in `ai-tooling-crash-course-for-developers/topic-index.md`, linked from here, not re-explained here. Prior art to check before inventing a convention: Malloy's [CONTEXT.md convention](https://docs.malloydata.dev/blog/2026-01-13-context-md-convention/), the [llm-context-md proposal](https://github.com/the-michael-toy/llm-context-md), and the [Codebase Context Specification](https://github.com/Agentic-Insights/codebase-context-spec).

## Options considered

- **Claude Code's own built-in memory system.**
- **Plain dated journal files, hand-written.**
- **Obsidian vault** — initially blocked by a corporate-environment constraint (Linux-only binary deps flagged by firewall), resolved 2026-08-23 when the user forked the repo, edited the dependency set for work-system compatibility, and had the npm lib scanned and copied into the org's own Artifactory.
- **Named memory-layer products** — Mem0, Letta, Cognee, Zep/Graphiti (Zep dropped its self-hosted CE in 2026).
- **Periodic extraction scripts** mining session transcripts and branch-naming patterns.
- **Plain local filesystem** — Markdown files, git-backed, as the storage layer with tooling on top.

## Decision

**Trial direction picked 2026-08-26:** plain local filesystem (Markdown files, git-backed) as the storage layer, with Graphify (confirmed working both at work and at home) and Obsidian both trialed on top of it. Not a final architecture pick — any of this can change as the trial plays out.

Obsidian is the first system being trialed rather than something custom: git-backed Markdown plus hooks is an attractive simple design on paper, but freshness and organization at scale are an open risk, so an existing maintained system gets tried first to see how well it consumes and coexists with this repo's own Markdown files.

The user's proposed shape for the personal/cross-project layer, still to be designed in detail:

- Centralized location (e.g. `~/.agents`) with a **skill** (possibly global) that generates a folder structure mirroring the user's actual repos/directories.
- Each mirrored folder holds a small set of curated reference files under conventional names (`architecture.md`, `decisions.md`) — the must-haves that aren't obvious from code or context.
- Entries are AI-authored, not hand-maintained — likely triggered by a session-start/session-end hook that tells the agent to log work done.
- Explicitly not a transcript dump: raw session logs are rich but expensive to search and recover from.

`periodic extraction scripts` are kept, but scoped down — not a memory system by itself, legitimate as an environment-diagnostic helper (pattern-match branch names for ticket numbers, mine logs for general takeaways).

## Why not the alternatives

**Claude Code's built-in memory** — not usable as the dev-stack's memory system: write timing and contents are non-deterministic (the model decides when and what to save, sometimes without the user realizing), there is no overview or audit of what is stored, it is not portable (disabled at work), and it is scoped for high-level harness-support instructions ("never commit on your own") rather than project-level knowledge. Fine for Claude to keep using internally; not something this stack relies on.

**Plain dated journal files, hand-written** — hard veto. No structure, no meaning, doesn't scale.

**Named memory-layer products** — real market research exists in `memory-and-progress-ledgers.md`, but none of it constituted a pick at the time and the products carry install and hosting requirements the corporate constraint rules out.

**A vault product at all** — research on 2026-08-23 checked the named vaults (Obsidian, Logseq, Trilium, Joplin, Anytype, Memos, Outline, Tana) against the corporate no-uv/no-pipx/no-native-binaries/no-MCP/Windows filter. Most fail it or aren't plain files at all; Foam is the one that cleanly passes. The real finding is that the design does not need a vault product — the closest prior art is the Cline-style "Memory Bank" pattern: a fixed small set of markdown files, no database.

**The "markdown isn't real memory" critique** (`_jookoi-architecture/opinion-piece-mem.md`, "Stop Calling It Memory") argues markdown files hit a hard scale ceiling — no querying, no relationships, no schema enforcement, no concurrent-write safety — and names SQLite, an embedded graph DB, and Supabase as alternatives. It does not kill the curated-reference-files idea, it sharpens it: the proposal is explicitly a *small curated set*, not a growing database of thousands of records, which is the scale where those failure modes bite. It is a real warning against letting it grow into something it was never a database for. Kuzu, the piece's proposed graph-DB backend, is confirmed dead (archived Oct 2025); plain stdlib SQLite FTS5 is the one queryable backend needing zero installs, if it is ever needed.

## Next step

- [x] Research done 2026-08-23: vault/storage alternatives checked against the corporate constraint — see `memory-and-progress-ledgers.md` §8.
- Prototype what the generated-reference-file skill actually looks like (hook trigger, file naming convention, mirrored folder structure). Unblocked on research grounds. *Superseded in practice by the jookoi-paper-trail design (`_architecture/plans/2026-08-30-jookoi-paper-trail.md`), which answers this and the vault question together — reconcile against it rather than designing independently.*
- Once read by the user and the pick is made, revisit topics 1 and 3 for their own decision files. Topic 1 separately has its own deep-dive doc, `base-instruction-files.md`, written 2026-08-23 independent of this pick.

## Open sub-question — Graphify under corporate install restrictions

Graphify's install path requires `uv` or `pipx`, neither available in the corporate environment. Needs its own investigation; captured here because it surfaced alongside the storage-layer question.

What is known so far: `uv` and `pipx` are installation/isolation tools, not core Graphify requirements — `python -m pip install graphifyy` then `python -m graphify` likely bypasses them. That does not help if the firewall blocks PyPI itself; that case needs an internal package mirror, offline wheels, or vendored dependencies. Forking is viable but probably unnecessary unless Graphify hardcodes `uv`/`pipx` in its installer.

The likelier real obstacle is native binaries, not `uv`. The default dependency set includes packages with native compiled components — `numpy`, `rapidfuzz`, `tree-sitter`, and ~30 `tree-sitter-*` language parsers. These normally ship as prebuilt wheels, so no compiler is needed, but corporate security can treat them differently from pure-Python packages. Heavier optional dependencies (`faster-whisper`, `psycopg[binary]`, `graspologic`) pull in more native components, and `tree-sitter-dm` explicitly requires compilation on Linux/macOS.
