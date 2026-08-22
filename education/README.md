# Education — self-study index

Entry point for catching up on current AI-assisted development practice. This is a reading path, not a reference manual — it points at the working documents elsewhere in the repo rather than duplicating them.

## Start here

1. **`../planning/stage-0-baseline.md`** — the baseline survey: eleven-plus topics across AI-assisted dev workflow, local infra, and portability, each marked against real prior experience (known / new / disagree / wants deeper coverage). Read this first — it's the map of what's already settled vs. what's genuinely worth a deeper look, and the marks are the backlog driving everything else in this folder.
2. **`../docs/reasoning.md`** — why this repo is structured the way it is, and the evidence bar used before anything gets adopted. Read this to understand *how* to judge anything that shows up later in `../planning/sources.md`, not just what's in it.
3. **`../planning/sources.md`** — the curated, verified reading/watching/following list (newsletters, named practitioners, repos, communities). Empty until items clear the evidence bar in `docs/reasoning.md` — check back as curation stages complete.

## Topic backlog (from Stage 0)

Marked `deeper` in the baseline — these become individual curation stages, each producing real options with trade-offs rather than a single pick:

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

## Parked

- **Graphify** (knowledge-graph-from-any-input) — needs a real corpus to be worth curating. Revisit once a project has enough content to graph.
