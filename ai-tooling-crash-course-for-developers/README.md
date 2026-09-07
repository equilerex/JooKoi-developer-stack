# AI Tooling Crash Course for Developers — self-study index

Entry point for catching up on current AI-assisted development practice. This is a reading path, not a reference manual — it points at the topic docs in `topics/` rather than duplicating them. Renamed from `education/` 2026-08-30 per `_architecture/plans/decisions/002-crash-course-naming.md`. General-education docs live here now; process/decision-trail docs live in `_architecture/plans/decisions/` instead. There's no `planning/` folder any more — everything redistributed into this file set.

## Start here

0. **`0-how-llms-actually-work-under-the-hood.md`** — the actual mechanism: tokenization, attention, pretraining vs. post-training (RLHF/RL), reasoning models, mixture-of-experts, why context windows aren't memory. Read this first if the internals are still fuzzy — the rest of this folder assumes this mental model already.
1. **`topic-index.md`** — the baseline survey: eleven-plus topics across AI-assisted dev workflow, local infra, and portability, each marked against real prior experience (known / new / disagree / wants deeper coverage). Read this first — it's the map of what's already settled vs. what's genuinely worth a deeper look, and the marks are the backlog driving everything else in this folder.
2. **`../_architecture/ARCHITECTURE.md`** — why this repo is structured the way it is, and the evidence bar used before anything gets adopted. Read this to understand *how* to judge anything that shows up later in `_inspiration-and-staying-current.md` and `_ai-tooling-recommendations.md`, not just what's in them.
3. **`_inspiration-and-staying-current.md`** (newsletters, named practitioners, communities) and **`_ai-tooling-recommendations.md`** (repos, products, protocols) — the curated, verified reference lists. Split into two files since they do different jobs: who/where to follow vs. what to actually use.

## Topic backlog (from Stage 0)

Marked `deeper` in the baseline — these became individual curation stages, each producing real options with trade-offs rather than a single pick:

- Context/memory files — base directives vs. per-feature/per-quirk architectural context (a real gap, not covered by existing conventions)
- Prompt & skill libraries — current `SKILL.md` best practice, what's changed, what not to build as a skill
- Session & token economics — compaction/session-boundary tooling beyond the basics, cross-session context handoff
- Subagents / multi-agent delegation — how this maps (or doesn't) onto Copilot/Gemini-class tools
- MCP — full curation pass, no hands-on use yet
- Local model use — beyond opportunistic batch jobs, what else is worth knowing
- Review discipline — the off-the-shelf/built-in review tooling landscape (IDE review buttons, open-source review agents), as opposed to the custom compound-skill side already well understood
- Security — verification practice for unfamiliar repos/authors, detecting compromise after the fact, dependency/version tracking tooling

Marked `new` — lighter passes, awareness-building rather than deep dives:

- Hooks / automation triggers
- Dotfiles / portability
- Personal cross-project memory/ledger
- Frontend debugging, browser interaction, AI integration tooling
- IDE inline completion and general tooling (WebStorm/VS Code)

Marked `correct`, open follow-up:

- Usage analytics / self-assessment tooling — confirmed tool identified, more options wanted

## Harness engineering, agent loops, context engineering, repository legibility

Surfaced later than the original Stage 0 topics (2026-08-23), via a well-sourced ChatGPT breakdown — see `topics/harness-engineering-vocabulary.md`. Not a pick, a vocabulary/completeness pass: names and connects things this repo already does in practice (task-state files, decision records, progressive-disclosure skills).

One real gap flagged for later: executable/automated convention-drift checking, once `skills/`/`prompts/` have enough real content to make it worthwhile. ACP and A2A protocols are a related but separate topic, covered below.

## Personal harness architecture

Companion to the entry above, build-oriented rather than a vocabulary check — see `topics/personal-harness-ARCHITECTURE.md`. Three components for the harness itself:

- Deterministic context bundling before model calls.
- Capability lifecycle management for skills/tools (discover → review → trust → install → scope → activate → update → remove).
- Task state as a dependency graph rather than a flat list (per `gastownhall/beads`, verified real, 26.5k★).

User confirmed running multiple instances of a graphing/knowledge tool (see Parked, below) is architecturally sound at two scopes — harness/global level and per-project — matching this repo's existing global-vs-seed split.

## Also covered (surfaced later, not yet in the reading order above)

- **Protocol landscape** (`topics/protocol-landscape-acp-a2a.md`) — ACP, A2A, and CLI-scripts-vs-MCP for local capabilities. Low priority for solo use right now; MCP-vs-CLI security nuance and a gap in `mcp-model-context-protocol.md`'s security citation are the actionable bits.
- **Dev-scoped "second brain"** (`topics/dev-scoped-second-brain-rag.md`) — RAG over your own codebase/ADRs/notes, not general life-organization (scope confirmed with the user). Includes the OpenClaw naming-collision resolution (real project, same one as the ClawHub security incident already in `security-and-supply-chain.md` — core project legit, third-party plugin marketplace still carries that risk).
- **Agent sandboxing** (`topics/agent-sandboxing.md`) — no cross-vendor standard yet (unlike MCP), but Claude Code has an opt-in `/sandbox` command not currently in use — actionable finding.

## Decisions made so far

- `../_architecture/plans/decisions/001-first-design-skill-picks.md` — trying Claude Design, MengTo/Skills, and `Adityaraj0421/naksha-studio` (user's own find, unverified) together.

## Local-only files (not in git)

- `../_jookoi-architecture/` is gitignored — currently holds the detailed corporate Copilot/Gemini feature audit. General takeaways from it are folded into `topics/session-and-token-economics.md`; the itemized detail stays local-only by design, not because it's sensitive.

## Parked

- **Graphify** (knowledge-graph-from-any-input) — user confirmed the harness-level and project-level instances are architecturally separate and both plausible (mirrors global-vs-seed). Project-level instances still wait for individual projects to accumulate real content, unchanged.

  The harness-level instance is worth reconsidering sooner than "not yet": this repo's former `planning/` staging area held 11+ stage-1 research docs (now redistributed — general topics into `topics/`, process/decisions into `_architecture/plans/decisions/`), a real accumulated corpus that could justify a first pass. Still not started; the "needs a real corpus" blocker is now partially satisfied rather than fully open.
