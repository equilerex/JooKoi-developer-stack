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

1. **Reusable-prompts research pass, then populate `prompts/`.** `ARCHITECTURE.md` names `prompts/` as one of three shippable pillars; it holds a single file (`base-persona.md`). A named pillar that is empty is the largest gap between the doc and the repo. The research gap is the blocker, not the folder.
2. **How the three `AGENTS.md` instances compose.** Global, this-repo's-own, and seed all exist and are all in play now, with no stated inherit/override rule. Same question as `stack-distribution.md` open question 2 (root-file collision) — answer once, in one decision file, closing both.
3. **Guardrails section in the global `AGENTS.md`.** Cheapest item with the widest blast radius — global `AGENTS.md` is read every session in every repo.
4. **`_jookoi-architecture/` scaffolding script** (already live in `TODO.md`) — the last piece of `jookoi-paper-trail` still resting on model judgement.
5. **When a repo earns a graphify pass** — one paragraph in the setup-bundle README; finishes a folder that is otherwise complete.

Deferred, explicitly, as crash-course content rather than repo structure: crash-course reorg, the 101 overview blocked behind it, the blueprint evidence fold-in, hooks/dotfiles deep-dive, where-agents-work-outside-the-project, session/token economics.

Deferred as speculative tooling with no demonstrated need yet: paste sanitizers, `JooKoi-commit-message`.

Deferred as already answered elsewhere: multi-checkout sync (the vault design covers it; its durability half is gated on the graphify portability check already in `TODO.md`).

## Why not the alternatives

A single global ordering forces false comparisons — a research pass on prompts and a paragraph in a bundle README are not on one scale. Leaving it unordered is what produced the problem: the file was being re-read and re-triaged from scratch each time, and the empty `prompts/` pillar survived several passes unnoticed because it sat next to items that read as equally urgent.

## Next step

Items 1–3 land in `TODO.md`'s checklist alongside the in-flight graphify work. Item 1 needs a cowork research pass before anything is written into `prompts/`.
