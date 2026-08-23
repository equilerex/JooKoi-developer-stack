# Decision 002 — Crash-course folder naming

Date: 2026-08-23
Status: named, restructuring deferred

## Decision

The `planning/stage-1-*.md` research docs read as a genuinely useful, general-purpose AI-tooling crash course for any developer — not just internal process notes for this repo. Once the user's review pass is done, `education/` gets renamed/expanded into a proper themed folder: **`ai-tooling-crash-course-for-developers`**.

## Why deferred, not done now

The user is actively reading through `planning/` and just had a local status tracker (`planning/local/review-status.md`) and continuation prompt (`planning/NEXT-SESSION-PROMPT.md`) built, both referencing current paths. Moving files now would churn paths mid-review for no real benefit — do the move once the reading pass is finished and it's clear which docs actually earn a spot in the polished crash-course version vs. stay as raw planning trail.

## What the eventual restructuring should cover

- Rename `education/` → `ai-tooling-crash-course-for-developers/` (or promote select `stage-1-*.md` docs into it, TBD which).
- Keep it maintained over time, not a one-shot snapshot — the user's stated intent is to keep it current as the field moves.
- Explains the "Personal Developer Stack" concept clearly enough to be shareable with others, not just self-referential.
- Covers the basics (the crash-course framing), not just the deep-dive topics.

## Review workflow note (recorded here since it came up alongside this decision)

The user does not want file annotations that create git-log noise for pure "do I need to re-review this" status. Actual content/substance changes go directly into the tracked files as before. Review-status tracking (read/unread, needs-deeper-dive, etc.) lives in `planning/local/review-status.md` instead — gitignored, one row per file, updated freely without touching git history.
