# JooKoi Developer Stack

Personal, cross-project AI dev-tooling stack — skills, prompts, conventions, and the curation research behind them. Not tied to any one product repo (see `JooKoi-frontpage-to-the-open-web` for that). Portable, versioned, recoverable if a machine is lost.

Two jobs, not one: (1) the global personal layer itself (what every session, everywhere, inherits), and (2) a **seed** — the base tooling/processes/skeleton meant to be copied or bootstrapped into a *new* individual project's own `.agents/`, not left global. Global and seed content live side by side here; which is which is marked per-item, not implied by location alone.

Start reading at `education/README.md`. The reasoning behind how this repo is put together lives in `docs/reasoning.md`.

## Layout

- `docs/` — the reasoning behind this repo's structure and process, not the tooling itself.
- `education/` — self-study index; where to start reading and the current topic backlog.

- `AGENTS.md` — the actual personal ruleset. Candidate replacement/merge target for `~/.agents/AGENTS.md`. Global — read every session, everywhere. Not yet finalized — see `planning/decisions/`.
- `skills/` — self-authored `SKILL.md` library. Mixed: some are global (used regardless of project), some are seed material meant to land in a new project's own `.agents/skills/`. Not yet split — do that once the library has enough entries to make the split real, not speculative.
- `prompts/` — reusable ad-hoc prompts. Same global/seed split question as `skills/`, same "not yet" answer.
- `seed/` — **not created yet.** Once a base project skeleton is worth naming (folder layout, starter `AGENTS.md` template, starter decision-log format) it goes here, versioned, so a new project bootstraps from a known-good copy instead of the ad-hoc port `JooKoi-frontpage-to-the-open-web` got. This is Layer 2 from the original dev-stack-plan research, deferred there for the same reason it's deferred here: extract from real project experience, don't build it speculatively.
- `planning/` — the curation process itself: staged research, red-lined baselines, decisions. Not distributed content — this is how the stack above got chosen, kept for the trail.
  - `topic-index.md` — consensus survey across 14 topics, each linking to the deep-dive doc that covers it. Personal raw notes/red-lines live in `local/` (gitignored), not here.
  - `_inspiration-and-staying-current.md` / `_ai-tooling-recommendations.md` — curated, verified reference lists (who to follow / what to use). **Verified only** — see each file's own header before adding to it.
  - `decisions/` — one file per curation-stage decision.
  - `local/` — gitignored: raw personal notes, and a review-status tracker. Not distributed, not sensitive, just not the kind of thing worth a git history entry per status change.

## Status

Baseline survey done, most deep-dive topics researched (14 docs in `planning/`, see `topic-index.md`). A few real picks made — see `decisions/`. Restructuring into a proper crash-course-style reference is planned (`decisions/002-crash-course-naming.md`) once the reading/review pass is finished.
