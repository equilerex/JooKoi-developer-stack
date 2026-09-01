# File formats — canonical spec

Every rule here is enforced by `scripts/jookoi-doc.js`. This document is the specification the script implements and the fallback when Node is unavailable.

Paths are given for the shared layer. The private layer is identical with the `_jookoi-` prefix: `_jookoi-architecture/`, `_jookoi-CONTEXT.md`. Both layers may exist side by side.

---

## Universal rules

**Entry grammar.** Every dated entry, in every file that has them:

```markdown
## YYYY-MM-DD — Title
```

Em dash `—`, spaced. Title is a sentence fragment, no trailing period. Body follows after one blank line: prose paragraphs, optional bullets. No other heading level is used for entries; `###` is permitted inside an entry body.

This grammar is identical in `current-state.md`'s session log, `progress.md`, and `archive/YYYY-MM.md`. That is what makes flush and rotate verbatim block moves.

**Ordering.** Newest first in every dated file.

**Policy comment.** Line 2 of every managed file is an HTML comment stating what the file is and who maintains it. It is the only thing a cold agent has to identify the file from its contents alone.

**Dates.** `YYYY-MM-DD`, always. Never relative ("yesterday", "last session"). The script supplies the date; never hand-write one.

**Line width.** No hard wrap. One paragraph is one line.

**Duplicate detection.** An entry whose body matches an existing entry in the same file at ≥95% is rejected, not appended.

---

## `_architecture/current-state.md`

The live session. Two blocks with different behaviours; both always present.

```markdown
# Current state
<!-- Live session. `jookoi-doc flush` empties the session log into progress.md. See AGENTS.md. -->

## Standing summary

Where things stand right now and why. Rewritten in place, never appended to.

## Session log

## YYYY-MM-DD — What happened

Prose.
```

**Standing summary** — rewritten wholesale at each flush. Present tense. Answers "what does a cold session need to know to not re-derive it". Target 5–20 lines. Never dated, never accumulates, never contains a history of its own prior states.

**Session log** — append-only during a session, emptied by `flush`. Entries use the universal grammar. Survives compaction; this is the file's reason to exist separately from `progress.md`.

**Cap:** none. The file empties at every flush, so it cannot grow.

**Does not go in:** finished-work history (that is `progress.md`, reached by flush, never written directly); forward plans (`next-steps.md`); anything that belongs to one folder (`CONTEXT.md`).

---

## `_architecture/progress.md`

Accumulated finished sessions. Written only by `flush` and `rotate` — never a direct destination.

```markdown
# Progress — finished sessions
<!-- Written by `jookoi-doc flush`. Rolls into archive/ at the line cap. See AGENTS.md. -->

## YYYY-MM-DD — Session title

Merged body of that session's log entries.
```

One entry per session. A session that flushes twice merges into its existing dated entry rather than creating a second one.

**Cap: 200 lines.** On exceeding it, `rotate` moves whole oldest entries — never a partial entry — into `archive/YYYY-MM.md` until the file is at or under the cap.

**Does not go in:** anything written by hand. If content needs to reach this file, it goes into the session log and flushes.

---

## `_architecture/archive/YYYY-MM.md`

Rolled-off `progress.md` entries. Written only by `rotate`.

```markdown
# Archive — YYYY-MM
<!-- Rolled off progress.md. Do not read unless history is explicitly requested. See AGENTS.md. -->

## YYYY-MM-DD — Title

Body, byte-identical to what progress.md held.
```

The month in the filename is the month of the entries it holds, not the month rotation ran. Entries are moved unchanged: no summarising, no reformatting, no merging.

**Cap:** none.

**Does not go in:** anything not previously in `progress.md`.

---

## `_architecture/archive/index.md`

Readable without opening any archived file.

```markdown
# Archive index
<!-- Readable without opening archived files. jookoi-doc maintains this. See AGENTS.md. -->

- **`YYYY-MM.md`** — YYYY-MM-DD to YYYY-MM-DD: one-line summary of what the file covers.
```

One pointer per archive file, newest first. The date range is the span of entries actually in that file, recomputed on every rotation.

**Does not go in:** prose outside the pointer list. Rotation status is `jookoi-doc status`, not a sentence here.

---

## `_architecture/next-steps.md`

Forward-looking only, sequenced.

```markdown
# Next steps
<!-- Forward-looking only; jookoi-doc owns the mechanics. See AGENTS.md. -->

## Now

1. **Item** — what it is, what it depends on.

## Then

2. **Item** — what it is.
```

Numbered because order is the point. An item that completes is removed, not struck through or annotated — its record is `progress.md`.

**Does not go in:** history of what was next before; done work; unscoped ideas (`backlog.md`); rationale for a decision already made (`plans/decisions/`).

---

## `_architecture/backlog.md`

Logged, not yet scoped or sequenced.

```markdown
# Backlog — logged, not yet scoped
<!-- Unordered. Promote to next-steps.md when an item gets a real slot. See AGENTS.md. -->

## Item title

Status: OPEN

Body.
```

`Status:` is one token from a closed set, on its own line under the heading:

| Token | Means |
|---|---|
| `OPEN` | Logged, nothing decided |
| `DESIGNED` | Design settled, not built |
| `BLOCKED` | Waiting on something named in the body |
| `MOVED` | Now lives elsewhere; body says where |
| `DROPPED` | Deliberately not doing it; body says why |

Headings are topic titles, undated and unnumbered. Status never appears in the heading.

**Does not go in:** sequenced work (`next-steps.md`); anything already started.

---

## `_architecture/plans/YYYY-MM-DD-topic.md`

One file per planning session. Kept permanently, never capped, never archived.

```markdown
# Title

Session: YYYY-MM-DD. Status: <one line>.

## Context
## <the design, in whatever sections it needs>
## Build order
## Implementation deviations
```

Only `Context` and the `Session:` line are required. `Implementation deviations` is added when the build diverges from what the plan said, and is the section future reads reconcile against.

**Does not go in:** running status (that drifts — it belongs in `current-state.md`); anything that will need editing as work proceeds, other than the deviations section.

---

## `_architecture/plans/decisions/NNN-slug.md`

One call, with its reasoning. `NNN` is zero-padded, allocated by `jookoi-doc new-decision`, never reused.

```markdown
# Decision NNN — Title

Date: YYYY-MM-DD

Status: DECIDED

## Problem
## Options considered
## Decision
## Why not the alternatives
## Next step
```

All five sections are required. `Status:` is one token from: `DECIDED`, `TRIAL`, `REJECTED`, `DEFERRED`, `SUPERSEDED`. A superseding decision gets its own number; the superseded file's status changes and its body gains a pointer — it is never edited away or deleted.

**Does not go in:** decisions still being made (they are not decisions yet); implementation detail.

---

## `CONTEXT.md` (any folder)

Feature-level context, at feature-area and component-folder granularity.

```markdown
# CONTEXT — folder-or-feature-name
updated: YYYY-MM-DD

## What this is

Scope, one or two lines.

## Why it's built this way

Decisions that don't self-explain.

## Gotchas

Glitches, footguns, surprises.

## Don't

Tried and rejected.
```

All four sections stay even when briefly empty — their absence is indistinguishable from an omission. `updated:` is bumped by the script on every write.

**Created** the first time real work happens in the folder, by whoever does that work. **Never** bulk-generated across a tree.

**Does not go in:** anything the code plainly shows; API or parameter documentation (that belongs in code); changelog or commit history (git has it); general framework or language behaviour (the model has it). Test: if removing a line would not slow a newcomer down, cut it.

**Against `README.md`:** `README.md` addresses a human arriving at the folder. `CONTEXT.md` addresses an agent about to change code in it. Both may exist. Agent-facing content already in a `README.md` moves rather than being duplicated. Never create a `CONTEXT.md` beside a `README.md` merely to have one.

---

## `_architecture/architecture.md`

Why the repo is shaped this way. Static — changed only when structure, patterns, module boundaries or key decisions change.

No fixed section set, no cap, no dated entries. Deep-dive detail goes to a linked `<feature>.architecture.md` rather than inline.

**Does not go in:** anything that changes per session; tutorials; status.

---

## Refusal conditions

The script refuses and reports rather than guessing when:

- A managed file's line 1 heading does not match its expected title.
- An entry heading does not parse as `## YYYY-MM-DD — Title`.
- `current-state.md` is missing either the `## Standing summary` or `## Session log` heading.
- A `Status:` value is outside its file's closed vocabulary.
- `rotate` would split an entry to meet the cap.
- A `CONTEXT.md` lacks any of its four sections.

A refusal names the file, the line, and what was expected. It never rewrites the file to fix it — that is the model's call, since a malformed file usually means content was placed by hand for a reason.
