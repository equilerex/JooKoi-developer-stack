# Decision 002 — Crash-course folder naming

Date: 2026-08-23

Status: DECIDED

## Problem

The staged research docs read as a genuinely useful, general-purpose AI-tooling crash course for any developer — not just internal process notes for this repo. The folder holding them was named `education/`, which says nothing about that, and the user was mid-way through a review pass over the same files.

## Options considered

- Rename and restructure immediately.
- Name the destination now, execute the move after the review pass finishes.
- Leave `education/` alone until the content settles.

## Decision

Name it now, move later. The folder becomes **`ai-tooling-crash-course-for-developers`** once the review pass is done.

The eventual restructuring should cover:

- Rename `education/` → `ai-tooling-crash-course-for-developers/` (or promote select `stage-1-*.md` docs into it, TBD which).
- Keep it maintained over time, not a one-shot snapshot — the user's stated intent is to keep it current as the field moves.
- Explain the "Personal Developer Stack" concept clearly enough to be shareable with others, not just self-referential.
- Cover the basics (the crash-course framing), not just the deep-dive topics.

## Why not the alternatives

Moving files immediately would churn paths mid-review for no real benefit — the user was actively reading the staged docs, and a local status tracker and continuation prompt had just been built against the current paths. Leaving the folder unnamed indefinitely was the worse failure: the naming call was already clear, and deferring it too would have meant re-deriving it later.

Related workflow point settled alongside this decision: the user does not want file annotations that create git-log noise for pure "do I need to re-review this" status. Content changes go into the tracked files as before; review status (read/unread, needs-deeper-dive) lives in a gitignored tracker (now `_jookoi-architecture/review-status.md`), one row per file, updated freely without touching git history.

## Next step

Execute the rename and decide, per file, which staged docs earn a spot in the polished crash-course version and which stay as raw planning trail. Structural follow-on work is tracked as "crash-course structure reorg" in `_architecture/BACKLOG.md`.
