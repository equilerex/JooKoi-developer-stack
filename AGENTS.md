## What this repo is

A curated personal AI-dev-tooling base of operations — harness-agnostic, plain markdown, adopted from demonstrated need rather than speculative completeness. See `_architecture/ARCHITECTURE.md` for the full reasoning.

## Where status actually lives

- `_architecture/ARCHITECTURE.md` — why the repo is shaped this way. Static.
- `_architecture/items.json` — the live working set, a keyed store of items with status `now`/`parked`/`done`/`dropped`, written only through the `jookoi-paper-trail` script (`list`, `add`, `done`, ...). Format: `my-global-setup/.agents/skills/jookoi-paper-trail/references/store-format.md`.
- `_architecture/TODO.md` — just a durable `## Context` header, rewritten wholesale when stale.
- `_architecture/archive/items-YYYY-MM.json` — roll-off of done and dropped items. Written only by `jookoi-paper-trail flush`, on model judgement, never on a cadence. Older `archive/YYYY-MM.md` files are history from the previous format.
- `_architecture/plans/` — one file per planning session, kept. `plans/decisions/NNN-slug.md` for individual calls.

Two time horizons, not three content types: live working set → archive. Content moves between them on model judgement, never on a schedule — which is why `archive/` is never written by hand. One entry grammar throughout: `## YYYY-MM-DD — Title`, newest first.

`TODO-LIST.md` is retired and deleted (2026-08-30) — see `_architecture/archive/2026-08.md` for what it split into. Don't recreate it. `current-state.md`/`next-steps.md`/`progress.md` are likewise retired in favor of `TODO.md` (2026-09-02) — see `_architecture/plans/2026-09-02-jookoi-doc-redesign.md`.

## jookoi-paper-trail

Behavior rules live in global `AGENTS.md` (`my-global-setup/.agents/AGENTS.md`) and apply here like everywhere else. This repo is where the concept doc and skill live: `jookoi-paper-trail.md` at root, design record `_architecture/plans/2026-08-30-jookoi-paper-trail.md`, skill at `my-global-setup/.agents/skills/jookoi-paper-trail/`.

## Repo-specific conventions

- **`_architecture/graphify/`** — graphify's knowledge-graph output. Tracked (not gitignored) — it costs real LLM-extraction time to rebuild and carries a hand-curated layer on top (`LESSONS.md`, learning overlay), not disposable. `.graphifyignore` excludes it from graphify's own future runs, and also excludes `_jookoi-*` — since this output is committed/shareable, it must never ingest private-prefixed content into the graph.
- **`_generated/` bucket** — gitignored home for genuinely disposable/cheap-to-rebuild tool output. Currently unoccupied — graphify moved out (see above) since its output turned out not to be disposable. Any future auto-writing tool whose output really is throwaway lands here, one subfolder per tool.
- **`EXPLORE.md` / `_jookoi-EXPLORE.md`** — root-level running list of topics/tech/articles worth a look later. Not a research queue, not the store's `parked` items (which are repo-construction work) — just pointers. Promote an item to `ai-tooling-crash-course-for-developers/topic-index.md` when it gets a real research pass.
- **`_jookoi-architecture/`** — personal, gitignored notes not meant to ship (`_jookoi-*` in `.gitignore`). Sibling to `_architecture/`, same prefix convention as `_jookoi-EXPLORE.md` above. Superseded `_architecture/local/`, which no longer exists.
- **`my-global-setup/` and `my-repo-setup/`** — tracked copies of what belongs outside this repo (`~/.agents/`, `~/.claude/`, or a new repo's starter tree). No harness reads from inside this repo, and nothing here runs on its own; applying any of it is always a deliberate manual step. Most of it is inert files copied out by hand (or by asking the assistant to do the copy). The exception is `my-repo-setup/setup-scripts/`, which holds scripts run in place against a target repo — still only when invoked, never automatically. Neither folder is where `_jookoi-*` applies, since that prefix means private/gitignored and these folders' whole point is the reverse — surviving across machines via git.

  `my-repo-setup/` is the container for anything concerning *another* repo, script or not. `utility-scripts/` is build tooling for *this* repo only.
- **Workflow — web research routes through cowork, not inline.** Web-research passes on planning-doc topics are done in cowork mode; Claude's role here is organizing/curating research handed back and building artifacts from it, not running the searches itself.

## Standing rules (don't relitigate)

- Never end a turn on "resuming X" / "continuing with Y" as a bare statement — it's neither an action nor a question, and leaves the user unable to respond. Either take the next concrete step in the same turn, or stop and ask a real question.

- User does all git commits themselves. Never commit or offer to.
- No scope creep — if work branches into a new task, log it as a `parked` item (`jookoi-paper-trail add --status=parked`) or a decision file and report back; don't pursue it inline.
- Evidence bar for anything opinionated: named practitioner/checkable identity, current docs, or repo-health signals. De facto standards stated as fact. New-but-promising allowed as a labeled exception.

