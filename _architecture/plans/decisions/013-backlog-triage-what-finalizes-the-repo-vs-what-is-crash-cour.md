# Decision 013 — Backlog triage — what finalizes the repo vs. what is crash-course content

Date: 2026-09-02

Status: DECIDED

## Problem

`BACKLOG.md` had grown to 17 entries with no ordering, mixing three unrelated kinds of work: holes in the repo's own structure, research/writing for the crash-course, and speculative new tooling. Read flat, a missing pillar and an optional deep-dive topic looked equally load-bearing, so "what comes next" could not be answered from the file.

## Options considered

- Order the whole backlog by a single priority number.
- Split by which of `ARCHITECTURE.md`'s three non-colliding layers an item belongs to, and only order within the layer that is currently unfinished.
- Leave the backlog unordered and pick ad hoc each session (status quo).

## Decision

Split by layer, then order only the shippable-stack layer. The test applied to each entry: **does the repo's own stated architecture claim something that is not actually true yet?** Those are finalization work. Everything else is content or future tooling and waits.

Picked, in order:

1. **Reusable-prompts research pass, then populate `prompts/`.** `ARCHITECTURE.md` names `prompts/` as one of three shippable pillars; it holds a single file (`base-persona.md`). A named pillar that is empty is the largest gap between the doc and the repo. The research gap is the blocker, not the folder — and it leads with highest-gain prompts and the real workflows people run them in, not with taxonomy.
2. **Current best practice for agent instruction files.** A research pass on what a good `AGENTS.md` looks like as of August 2026, folded into the global instance — the file read every session in every repo, so the widest blast radius available. Absorbs the over-read-phrasing guardrail (`deep research` taken as academic-grade); drops the token-waste/looping angle as legacy framing.
3. **Automating the graphify re-run.** Replaces the planned prose rule about which repos earn a pass. The repo has had several extraction passes already and keeps drifting, so a written cadence rule would be re-read and re-judged rather than followed.
4. **`_jookoi-architecture/` scaffolding**, kept open but reshaped into a `jookoi-paper-trail.js` subcommand rather than a new standalone script — it is the last piece of the convention still resting on model judgement, and the script that would own it already exists.

Rejected during the pass: **how the three `AGENTS.md` instances compose** — see "Why not the alternatives".

Deferred, explicitly, as crash-course content rather than repo structure: crash-course reorg, the 101 overview blocked behind it, the blueprint evidence fold-in, hooks/dotfiles deep-dive, where-agents-work-outside-the-project, session/token economics.

Deferred as speculative tooling with no demonstrated need yet: paste sanitizers, `JooKoi-commit-message`.

Deferred as already answered elsewhere: multi-checkout sync (the vault design covers it; its durability half is gated on the graphify portability check already in `TODO.md`).

## Why not the alternatives

A single global ordering forces false comparisons — a research pass on prompts and a paragraph in a bundle README are not on one scale. Leaving it unordered is what produced the problem: the file was being re-read and re-triaged from scratch each time, and the empty `prompts/` pillar survived several passes unnoticed because it sat next to items that read as equally urgent.

The `AGENTS.md` composition item is not deferred, it is void. Global `AGENTS.md` and a repo's own root `AGENTS.md` do different jobs and share no file; the seed template is read by no agent at all, being inert content that travels by git and goes live only once copied into a new repo's root, where it becomes that repo's own instance. Three instances, three non-overlapping jobs, no inheritance or override to define. This also removes the premise of `stack-distribution.md`'s open question 2, closed there on the same date. Only repo-flavour variants survive in `BACKLOG.md`, still gated on a second real flavour.

Two items were rewritten rather than picked as stated. "When a repo earns a graphify pass" was a documentation task; documenting a judgement the model then re-makes every time is the failure mode, so it became automation. The scaffolding item asked for a new script next to `jookoi-paper-trail.js`, which owns exactly this class of mechanical work already — a second script would split the convention across two entry points.

## Next step

Items 1 and 2 need cowork research passes before anything is written. Items 3 and 4 are buildable now. Terminal backlog entries were moved to `archive/2026-09.md` in the same pass — `BACKLOG.md` holds intended work only, never a record of finished work.
