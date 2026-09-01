# jookoi-doc redesign: TODO.md replaces current-state.md + next-steps.md, progress.md retired

Session: 2026-09-02. Status: built.

## Context

The original pipeline (`current-state.md` + `next-steps.md` + `progress.md` + `archive/`) created real friction in practice: a per-session flush that felt mandatory, a `next-steps.md` that had to be kept continuously re-sequenced, and a `progress.md` middle stage that added a stage without adding value. The user flagged this directly and dictated the replacement across two messages, quoted in full below since they're the actual spec.

## The confirmed spec

- `_architecture/TODO.md` replaces `current-state.md` and `next-steps.md`: a short durable-context header (`## Context`, rewritten wholesale, the old "standing summary") plus a checklist (`## Checklist`, `- [ ]`/`- [x]`) mixing done, in-progress and pending items. It persists across sessions untouched by default — no forced per-session flush. In the user's own words: "wouldn't be more natural if current state is the general source of truth for the whole session. And we do not really clear it. Until the user decides to... start a new session."
- Flush triggers on model judgement only: a chunk of work finished, or the checklist runs dry. Never on a cadence.
- `progress.md` is retired entirely. Flush writes straight into `archive/YYYY-MM.md`. Archive stays uncapped and becomes explicitly human-facing — the AI avoids reading it unless asked or genuinely needing history. Enforced by a written rule in `AGENTS.md`/`SKILL.md` prose, not tooling — nothing actually reads a `.aiignore`-style file, so a proposed one was dropped in favor of prose.
- `BACKLOG.md` stays deliberately unordered — a wishlist/idea bin. Curation/sequencing happens only at the point of deliberately pulling an item into a fresh `TODO.md`, never maintained continuously.
- Unfinished-but-relevant items go to `BACKLOG.md` before a flush, at the model's judgement, either item-by-item or via a full wipe plus a small optional resume/context summary (for the context-pressure use case: clearing a session without losing the ability to resume an unfinished task). The script does not try to detect or enforce this split.

Scope, per the user's explicit instruction ("yes, there are many interconnected files along with the global agents.md and jookoi-doc, so it need a wholistic plan - also for the readme and papertrace docs"): the `jookoi-doc` skill in full, global `AGENTS.md`, `README.md`, the papertrail docs, and this repo's own live migration.

## Design calls made during planning

- **`doc-gate.sh` stops demanding flush.** Forcing a flush every `Stop` was exactly the friction being removed. Its new job: if the tree is dirty and `TODO.md` hasn't been touched this session, nudge an *update* (check off, add, rewrite Context) — never a flush. Flush stays entirely model-judgement, ungated.
- **The checklist is not script-mediated.** Adding or checking off items is plain-text editing with no drift risk, unlike dated headings — the model edits `TODO.md` directly with a normal edit. The script only touches `TODO.md` during `flush`.
- **`flush` takes the entire current `TODO.md` verbatim as the archive entry body.** It does not parse checkbox state or split done from pending. The model's job before calling it: move anything still relevant to `BACKLOG.md`, rewrite Context if worth keeping, then call `flush --title "<t>"`.
- **Trigram-similarity dedup and the `note`/`rotate` commands are dropped, not repointed.** `note` existed to append to a log that flush drained every session; that cadence is gone. `rotate` existed to move `progress.md` past its cap; there is no more cap or middle stage. This also shrinks the script, answering a standing backlog item flagging `jookoi-doc` as possibly too large.
- **This repo's existing `progress.md` content was migrated, not discarded** — its dated entries moved into `archive/2026-08.md` and a new `archive/2026-09.md`, respecting "never split an entry," then the file was deleted.
- **The redesign got its own dated plan file** (this one) rather than a rewrite of the 2026-08-30 design record, which stays the historical record of the original build and gets one pointer line forward to this file.

## Build order

1. Rewrote `scripts/jookoi-doc.js`: removed `CAP`, `cmdNote`, `cmdRotate`, `trigrams()`/`similarity()`, `splitCurrentState()`/`joinCurrentState()`; added `splitTodo()`/`joinTodo()`; rewrote `cmdFlush`, `cmdStatus`, `cmdCheck`; trimmed the command table to `backlog`, `flush`, `status`, `stale`, `check`, `new-decision`, `new-plan`.
2. Added `assets/templates/todo.md`; deleted `current-state.md`, `next-steps.md`, `progress.md` templates.
3. Rewrote `references/file-formats.md`, `references/pipeline.md`, `references/operations.md`, `references/hooks.md` to the new shape.
4. Rewrote `hooks/doc-gate.sh` (dirty-tree-but-TODO.md-untouched check, no flush demand) and `hooks/rehydrate.sh` (injects `TODO.md`'s Context + Checklist). Left `hooks/preserve.sh` and `hooks/_common.sh` unchanged — neither referenced the retired files.
5. Rewrote `SKILL.md` in full: when-this-runs, pipeline diagram, routing tree, script table, before-flush checklist, bundled-assets table.
6. Edited `README.md` (merged table rows, updated pointer lines) and `jookoi-paper-trail.md` (folder layout, pipeline section, tooling command list).
7. Added one pointer line in `_architecture/plans/2026-08-30-jookoi-paper-trail.md`'s Implementation deviations.
8. Migrated this repo's own live files onto the new shape: built `_architecture/TODO.md`, migrated `progress.md`'s entries into `archive/2026-08.md` and a new `archive/2026-09.md`, updated `archive/index.md`, deleted `current-state.md`, `next-steps.md`, `progress.md`, and cleared `_jookoi-architecture/session-log.md`.

## Implementation deviations

None yet identified during the build — this section stays open if verification surfaces a divergence.
