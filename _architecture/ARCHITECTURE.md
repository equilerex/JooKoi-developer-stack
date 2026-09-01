# Architecture — what this repo is and why it's shaped this way

Read this at feature-build/modify time, not every session (that's `AGENTS.md`'s job). Short, non-obvious content only — skip anything a reader gets from the code/structure itself.

## What this repo is

A personal, cross-project AI dev-tooling stack — skills, prompts, conventions — built and owned by one person, not a generic template. Setup differs person to person even in the same role; there's no single "correct" stack to copy, only a personally curated one kept current.

## Why curation, not adoption

Staged deliberately, not "pick the popular tools and go":

1. **Baseline.** Survey what's genuinely agreed-upon vs. contested (`ai-tooling-crash-course-for-developers/topic-index.md`).
2. **Per-topic research.** Options and trade-offs presented as choices, never a pick — the person who owns the stack chooses.
3. **Adopt only after a real pick.** A tool/practice enters `skills/`, `prompts/`, or `AGENTS.md` after being chosen this way — never because one research pass mentioned it.

Failure mode being avoided: assembling a stack from whatever one research session surfaced, unchecked against real experience or sourcing.

## Evidence bar (two tiers)

- **De facto standards** (`SKILL.md`, the `AGENTS.md` convention) — stated as fact, no re-verification per stage.
- **Opinionated choices** — need real sourcing before being presented as an option: checkable practitioner identity, current docs, or repo-health signals. New-but-promising allowed only as a labeled exception.

## Repo layout — three things that must not collide

- **`_architecture/`** (this folder) — the repo's own internal metaspace: architecture docs, kept planning-session records (`plans/`), decision trail (`plans/decisions/`), backlog, `TODO.md` live working set. Everything about *building and evolving this repo*, grouped and kept visually out of the way of the distributable content below. Leading underscore sorts it first.
- **`personal-guidelines/`** — user's own opinions/manifesto/accumulated takes on this space. Explicitly labeled personal, not consensus — distinct from the researched content in `ai-tooling-crash-course-for-developers/`.
- **The shippable stack** — `prompts/`, `my-global-setup/`, `my-repo-setup/` at repo root. This is what's meant to be copied out into another context (machine or new project) — literal copy-out bundles, not generated. `utility-scripts/` is the opposite: build tooling for *this repo*, not shippable. `~/.agents/skills/` is where global skills actually live and get used (47+ as of 2026-09-01); `my-global-setup/.agents/skills/` is a tracked mirror of a curated subset, not the source of truth for skills in general. Direction is per-skill — `jookoi-paper-trail` was authored here first and shipped out to `~/.agents/`; `find-docs` was authored at `~/.agents/` and copied in here as a backup. There's no separate root `skills/` staging folder. Root `AGENTS.md` is **not** part of the shippable layer — it's this repo's own dev ruleset (2026-08-30 correction; see below). Global (`~/.agents/AGENTS.md`, read every session everywhere, canonical copy in `my-global-setup/.agents/`) vs. seed (`my-repo-setup/AGENTS.md`, copied into a *new* project's root, not read from here) are two further, separate instances — the seed one is a real, filled starter template as of 2026-09-01, not built speculatively ahead of need. Three AGENTS.md instances total, never conflated: global, this-repo's-own, seed-template. See `_architecture/BACKLOG.md` § AGENTS.md instances.

Open design questions on how the shippable layer itself should be organized/distributed (skill-sync tooling, drop-in-folder vs. installer, root `AGENTS.md` collision risk) live in `_architecture/stack-distribution.md` — not decided here.

## The memory system

Most of what `_architecture/` holds is maintained by one convention, the **jookoi-paper-trail** — plain markdown, harness-agnostic, two levels (project-level `_architecture/`, feature-level `CONTEXT.md`), with the `_jookoi-` prefix as the public/private switch. Concept doc: `jookoi-paper-trail.md` at the repo root. Full design and build record: `plans/2026-08-30-jookoi-paper-trail.md`. The skill that maintains it: `my-global-setup/.agents/skills/jookoi-paper-trail/`, deployed to `~/.agents/skills/`.

The one thing worth knowing without opening either: `TODO.md` and `archive/` are **two time horizons, not two content types** — live working set, roll-off. Content moves between them on model judgement (`jookoi-paper-trail flush`, fired when a chunk of work finishes or the checklist runs dry, never on a cadence), never on a schedule. `archive/` is therefore never written directly.

Mechanics belong to the script and judgement belongs to the model, deliberately: every defect the first dogfooding pass surfaced was bookkeeping (heading grammar, ordering, a duplicate entry, a rotation that never ran), which is the class of thing an LLM tracks badly across sessions.

## Where the trail lives

There is no separate `planning/` staging folder — it was redistributed 2026-08-30 into the designed file set: general-education research went to `ai-tooling-crash-course-for-developers/`, kept decision records to `_architecture/plans/decisions/`, open architecture questions to `_architecture/stack-distribution.md`. Someone using `AGENTS.md` or a skill shouldn't have to read the research trail to use it, but the trail stays available for anyone (including a future self) who wants to know why something is the way it is.
