# Pipeline — flush and rotate

The three stages move in one direction only:

```
current-state.md  ──flush──▶  progress.md  ──rotate──▶  archive/YYYY-MM.md
   live session                 finished sessions            old sessions
                                                             + archive/index.md pointer
        │
        └── unfinished / newly surfaced ──▶ next-steps.md (sequenced)
                                         └▶ backlog.md    (unscoped)
```

Entry grammar is identical at every stage (`references/file-formats.md`), so both moves are verbatim block transfers. Nothing is rewritten in transit.

---

## Flush

`jookoi-doc flush`. Runs at session end, or when the `Stop` gate fires.

**Script-owned steps** — no model judgement, no model call:

1. **Read** `_architecture/current-state.md`. Refuse if `## Standing summary` or `## Session log` is missing, or if any session-log entry fails to parse as `## YYYY-MM-DD — Title`.
2. **Collect** every entry under `## Session log`.
3. **Merge** them into one entry per date. Title is taken from the first entry of that date unless `--title` is given. Bodies concatenate in chronological order, separated by a blank line, unchanged.
4. **Insert** into `progress.md` at the newest-first position. If an entry for that date already exists — the session flushed earlier — append the new bodies to it rather than creating a second entry.
5. **Reject duplicates**: a body matching an existing `progress.md` body at ≥95% is dropped, and named in the report.
6. **Empty** the session log, leaving the `## Session log` heading in place.
7. **Rotate** if `progress.md` now exceeds 200 lines.
8. **Report** what moved, what was dropped as duplicate, and what still needs the model.

**Model-owned steps** — the report from step 8 names both:

9. **Rewrite the standing summary.** Not an append. Read the flushed entries, then restate where things stand now, in present tense, 5–20 lines. Prior states are not preserved — `progress.md` holds them.
10. **Route the unfinished half.** Work that was started and not finished, and work newly surfaced this session, goes through the routing tree in `SKILL.md`: sequenced → `next-steps.md`, unscoped → `backlog.md`. Remove `next-steps.md` items the flushed entries show as done.

Step 10 is the one that keeps the forward plan honest. Skipping it is how `next-steps.md` goes stale.

**Session marker.** On success, flush writes `_jookoi-architecture/.jookoi-doc-ran-<session_id>`. The `Stop` gate reads it to know the session is clean. It is not committed and is cleared by the next `SessionStart`.

---

## Rotate

`jookoi-doc rotate`. Runs automatically at the end of a flush that pushes `progress.md` over its cap, or on demand.

1. **Count** `progress.md`. If ≤ 200 lines, exit without change.
2. **Take whole entries from the oldest end** until the file is at or under 200 lines. Never split an entry to hit the number — if removing the next whole entry is the only way to get under, remove it; if a single entry alone exceeds the cap, refuse and report rather than splitting it.
3. **Group** the removed entries by the month in their own heading date, not by the month rotation ran.
4. **Append** each group to `_architecture/archive/YYYY-MM.md`, creating the file from `assets/templates/archive-month.md` if absent. Entries move byte-identical: no summarising, no reformatting, no merging.
5. **Recompute** that file's date range from the entries it now holds, and update or insert its pointer in `archive/index.md`, newest first.
6. **Report** which entries moved and to which files.

Rotation is deterministic and oldest-first. There is no relevance judgement in it — that is the property that makes it safe to run unattended.

---

## Recovery — a session that died before flushing

A crash, a killed terminal, or a harness that never fired its end-of-turn hook leaves entries in the session log. Nothing is lost: the session log is a file.

`SessionStart` reports an unflushed log. Flush it then, with the previous session's date preserved from the entry headings — never re-dated to today.

`_jookoi-architecture/session-log.md`, written by the `SessionEnd`/`PreCompact` hooks, is a separate and coarser record: timestamps, branch, and `git status --short`. It is raw material for reconstructing what happened when the session log itself is thin, not a pipeline stage. Drain it by reading it, routing anything still relevant through the tree, then clearing it.

---

## Compaction

`PreCompact` receives the full uncompacted transcript on stdin and writes to disk; it cannot inject context back. `SessionStart` with a `compact` source matcher fires after the context shrinks and can inject. The pair is what survives compaction:

- **Before**: preserve the session log and append anything from the transcript that has not reached it.
- **After**: re-inject the standing summary plus the current session log.

This is why `current-state.md` is a separate file rather than the top of `progress.md` — it is the thing read back in after context is lost. See `references/hooks.md` for the per-harness event names.

---

## Without Node

Every rule above is specified in `references/file-formats.md`, so the pipeline is executable by hand in a harness with no Node. The order matters more than the tooling:

1. Copy session-log entries into `progress.md`, newest-first, unchanged.
2. Empty the session log, keep its heading.
3. Rewrite the standing summary.
4. Route unfinished work.
5. Check `progress.md`'s line count; if over 200, move whole oldest entries into the right `archive/YYYY-MM.md` and update `archive/index.md`.

Doing it by hand is where the format defects come from — the script exists because this list is exactly the kind of bookkeeping that degrades across sessions. Prefer the script wherever Node is available.
