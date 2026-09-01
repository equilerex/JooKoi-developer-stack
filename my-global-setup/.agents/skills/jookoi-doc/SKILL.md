---
name: jookoi-doc
description: Maintain the jookoi-paper-trail context files — feature-level CONTEXT.md, and the project-level current-state.md / progress.md / next-steps.md / backlog.md / architecture.md / plans / archive pipeline. Invoke after any change that makes an existing context file wrong, when starting real work in a folder that has none, and at session end to flush the session log.
---

# jookoi-doc

Concept: `jookoi-paper-trail.md` (repo root of `JooKoi-developer-stack`). Design: `_architecture/plans/2026-08-30-jookoi-paper-trail.md`. Build plan: `_architecture/plans/2026-09-01-jookoi-doc-full-skill.md`.

Two things move information through this system: a **script** that owns every mechanical decision, and **you**, who own what happened and where it belongs. Do not do by hand what the script does — that is where the format drifts.

## When this runs

- **After a change that makes an existing context file wrong.** Immediately, before continuing the original task.
- **First real work in a folder with no context file.** Create one. Never bulk-generate them across a folder tree — the design's adoption rule forbids it.
- **At session end**, or when the `Stop` gate fires: `jookoi-doc flush`. See `references/pipeline.md`.
- **At session start**, if `status` reports an unflushed session log from a session that died: flush it with its own dates, not today's.

## The pipeline

```
current-state.md ──flush──▶ progress.md ──rotate──▶ archive/YYYY-MM.md
  live session               finished sessions          old sessions
       │
       └── unfinished / newly surfaced ──▶ next-steps.md (sequenced)
                                        └▶ backlog.md    (unscoped)
```

Three time horizons, not three content types. `progress.md` and `archive/` are **never** written directly — only by `flush` and `rotate`.

## Routing tree

Top to bottom, first match wins.

| Ask | Destination |
|---|---|
| Folder-local context for code, needed by whoever works in that folder? | `CONTEXT.md` in that folder |
| A call that was made — picked, rejected, deferred — with reasoning that will be asked about later? | `plans/decisions/NNN-slug.md` (`new-decision`) |
| The record of a design or planning session, multi-part, one sitting? | `plans/YYYY-MM-DD-topic.md` (`new-plan`) |
| Durable and structural — why the repo is shaped this way? | `architecture.md` |
| Intended work, sequenced? | `next-steps.md` |
| Intended work, not yet scoped or ordered? | `backlog.md` (`backlog`) |
| Something that happened this session? | `current-state.md` session log (`note`) |
| A standing fact that is now different? | `current-state.md` standing summary — **rewrite, don't append** |

No match: ask. Do not pick the closest bucket — wrong-bucket content is worse than absent content, because it is found later and trusted.

Private variants (`_jookoi-CONTEXT.md`, `_jookoi-architecture/`) are the same tree with `--private`. Use them when the repo cannot be committed to, or the content itself should not be shared.

## The script

```
node scripts/jookoi-doc.js <command> [args] [--private] [--dry-run]

note "<text>" [--title "<t>"]      append a dated entry to the session log
backlog "<title>" "<body>" [--status OPEN]
flush [--title "<t>"]              session log -> progress.md, then report what you still owe
rotate                             progress.md -> archive/, update index
status                             line counts, cap headroom, pending flush
stale                              updated: vs each folder's last commit
check                              validate managed files against the spec
new-decision "<title>"             next free NNN from template
new-plan "<topic>"                 dated plan file from template
```

It owns dating, heading grammar, newest-first insertion, duplicate rejection, the 200-line cap on `progress.md`, roll-off, archive-index pointers, `NNN` allocation, and template instantiation.

It refuses rather than guesses: a file that does not match its expected shape is reported with a line number and left untouched. Fix it by hand, then re-run.

No Node available? `references/file-formats.md` specifies every rule the script enforces, and `references/pipeline.md` has the manual order.

## Flush — what you still owe after the script runs

The script moves entries and empties the log. Two steps stay yours, and it prints both:

1. **Rewrite the standing summary.** Not an append. Present tense, 5–20 lines: what a cold session needs in order not to re-derive it. Prior states are gone on purpose — `progress.md` holds them.
2. **Route the unfinished half.** Started-and-unfinished plus newly-surfaced work goes through the routing tree. Remove `next-steps.md` items the flushed entries show as done. Skipping this is exactly how the forward plan goes stale.

## Hard rules

- **Never regenerate a file to change one section.** Target the heading, rewrite between it and the next, leave every other byte alone, bump `updated:`. The one exception is the standing summary, which is meant to be replaced wholesale.
- **Never write a secret.** API key, token, credential, connection string — flag it, do not record it.
- **Never leave a placeholder.** `TBD` / `TODO` / `[...]` — fill it or drop the section.
- **Never restate what the code shows**, document parameters (belongs in code), log a changelog (git has it), or explain framework behaviour (the model has it). If removing a line would not slow a newcomer down, cut it.
- **Never carry a wiped name forward.** Once something is removed or rejected, live docs stop naming it. The decision record holds the name and the reasoning, and that is where a reader goes. Name it outside that record only when the reader has to act on it: they might still have it installed, they will hit it in someone else's setup, or the reason it failed is a rule that now binds other choices. "We considered X" is not a lesson.
- **Never duplicate across levels.** Keep content at the more specific level; delete the copy.
- **Never bulk-generate `CONTEXT.md`.**
- **A folder's `CONTEXT.md` dies with the folder** — but check inbound references and promote anything durable first (`references/operations.md`).

## Bundled assets

| Load when | File |
|---|---|
| Writing or validating any managed file | `references/file-formats.md` |
| Flushing, rotating, recovering a dead session, handling compaction | `references/pipeline.md` |
| Finding, removing, staleness, section-surgical edits | `references/operations.md` |
| Wiring the session-end gate on any harness | `references/hooks.md` |
| Creating a file that does not exist yet | `assets/templates/<type>.md` |
| Any mechanical operation | `scripts/jookoi-doc.js` |
