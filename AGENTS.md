## What this repo is

A curated personal AI-dev-tooling base of operations — harness-agnostic, plain markdown, adopted from demonstrated need rather than speculative completeness. See `_architecture/ARCHITECTURE.md` for the full reasoning.

## Where status actually lives

- `_architecture/ARCHITECTURE.md` — why the repo is shaped this way. Static.
- `_architecture/items.yaml` — the live working set, a keyed store of items with status `now`/`parked`/`done`/`dropped`. One item per implementation bubble, normally written through the `jookoi-paper-trail` script (`list`, `add`, `done`, ...), hand-editing allowed for cleanup (run `check` after). Format: `toolboxes/my-global-setup/.agents/skills/jookoi-paper-trail/references/store-format.md`. Never show a bare item ID to the user: always `id title`.
- `_architecture/archived-items/items-YYYY-MM.yaml` — roll-off of done and dropped items. Written only by `jookoi-paper-trail flush`, on model judgement, never on a cadence. Not read unless asked.
- `_architecture/plans/` — open plans only, one file per feature or design question. Closed plans move to `plans/archived-plans/` (`close-plan`), decision files live in `plans/archived-decisions/` as footnotes to a rule in a read-path doc. Anything named `archived-*` is read only when a doc links it, an item names it, or the user asks.

Three tiers: read-path docs (this file, `README.md`, `ARCHITECTURE.md`, `CONTEXT.md`), the working set (open plans, `items.yaml`), archived. Content moves between them on model judgement, never on a schedule. Anything durable must be findable from the read-path docs alone.

## jookoi-paper-trail

Behavior rules live in global `AGENTS.md` (`toolboxes/my-global-setup/.agents/AGENTS.md`) and apply here like everywhere else. This repo is where the concept doc and skill live: `jookoi-paper-trail.md` at root, design record `_architecture/plans/archived-plans/2026-08-30-jookoi-paper-trail.md`, skill at `toolboxes/my-global-setup/.agents/skills/jookoi-paper-trail/`.

## Repo-specific conventions

- **`_architecture/graphify/`** — graphify's knowledge-graph output. Tracked (not gitignored) — it costs real LLM-extraction time to rebuild and carries a hand-curated layer on top (`LESSONS.md`, learning overlay), not disposable. `.graphifyignore` excludes it from graphify's own future runs, and also excludes `_jookoi-*` — since this output is committed/shareable, it must never ingest private-prefixed content into the graph.
- **`_generated/` bucket** — gitignored home for genuinely disposable/cheap-to-rebuild tool output. Currently unoccupied — graphify moved out (see above) since its output turned out not to be disposable. Any future auto-writing tool whose output really is throwaway lands here, one subfolder per tool.
- **`EXPLORE.md` / `_jookoi-EXPLORE.md`** — root-level running list of topics/tech/articles worth a look later. Not a research queue, not the store's `parked` items (which are repo-construction work) — just pointers. Promote an item to `ai-tooling-crash-course-for-developers/topic-index.md` when it gets a real research pass.
- **`_jookoi-architecture/`** — personal, gitignored notes not meant to ship (`_jookoi-*` in `.gitignore`). Sibling to `_architecture/`, same prefix convention as `_jookoi-EXPLORE.md` above. Superseded `_architecture/local/`, which no longer exists.
- **`toolboxes/my-global-setup/`** — tracked copy of what belongs in `~/.agents/` and `~/.claude/`. Applying it is a deliberate manual step. `_jookoi-*` does not apply here: the folder exists to survive across machines via git.
- **`toolboxes/`** — copy-out and open-on-demand boxes: `angular-toolbox/`, `frontend-toolbox/` (skills for other repos), `repo-tooling/` (scripts run in place against another repo, only when invoked: graphify setup, WebStorm inspections), `windows-toolbox/` (skills; the Directory Opus skill is private), `my-global-setup/` (above) and personal shell tooling (`shortcuts/`: `jj` menu, `.bat` launchers, Git Bash welcome screen). Skills in a toolbox are not installed globally, the agent is started inside the box. `shortcuts/` is installed per machine with `npm run setup:jj`, which writes absolute paths into shell profiles and the user PATH, so re-run it after moving the repo. Concept: `toolboxes/README.md`. Mechanics: `toolboxes/shortcuts/CONTEXT.md`.
- **Workflow — web research routes through cowork, not inline.** Web-research passes on planning-doc topics are done in cowork mode; Claude's role here is organizing/curating research handed back and building artifacts from it, not running the searches itself.

## Standing rules (don't relitigate)

- Never end a turn on "resuming X" / "continuing with Y" as a bare statement — it's neither an action nor a question, and leaves the user unable to respond. Either take the next concrete step in the same turn, or stop and ask a real question.

- User does all git commits themselves. Never commit or offer to.
- No scope creep — if work branches into a new task, log it as a `parked` item (`jookoi-paper-trail add --status=parked`) or a decision file and report back; don't pursue it inline.
- Evidence bar for anything opinionated: named practitioner/checkable identity, current docs, or repo-health signals. De facto standards stated as fact. New-but-promising allowed as a labeled exception.

