---
name: jookoi-paper-trail
description: Writes anything worth remembering into the repo's own files instead of losing it to the transcript — folder-level CONTEXT.md, and the project-level working-set store (items.json) / ARCHITECTURE.md / plans / decisions / archive pipeline. Use this whenever something durable just happened or is about to be written down: a decision got made or rejected, a design or planning session wrapped, a change made an existing doc wrong, real work started in a folder with no context file, an item is worth logging for later, or a chunk of work finished and the notes need archiving. Trigger it on phrasings like "write this down", "note that", "update the docs", "log it for later", "we settled on X", "docs are stale", "we're done with this chunk" — the user names the fact, not the file, so match on the intent rather than on a filename.
---

# jookoi-paper-trail

Every repo keeps its own written memory: `CONTEXT.md` beside the code it describes, and `_architecture/` at the root holding `items.json` (the live working set: now, parked, done, dropped items), `ARCHITECTURE.md`, `plans/`, and `archive/`. There is no separate status or context file: work items are in the store, calls in decisions, sessions in plans, durable facts in `ARCHITECTURE.md`, standing rules in `AGENTS.md`. This skill decides which of those a note lands in and keeps the formats intact.

Two things move information through this system: a **script** that owns every mechanical decision, and **you**, who own what happened and where it belongs. Items are written only through the script, by ID, with no prior read: never open or hand-edit `items.json`.

## When this runs

- **After a change that makes an existing context file wrong.** Immediately, before continuing the original task — a doc that is confidently wrong costs more than one that is absent.
  - **First real work in a folder with no context file.** Create one. Never bulk-generate across a tree: a context file earns its place the first time real work happens there, and mass-produced ones are wrong on arrival.
  - **Session start**: run `list` (bounded: `now` items plus the 3 latest done). `list --status=parked` when the `now` list is thin and you want something to pull in with `start`.
  - **As things happen**: `add`, `done`, `edit`, `park`, `drop` by ID. `find "<text>"` before `add` to avoid duplicates. Untouched across sessions is the steady state.
  - **When a chunk of work finishes, or `now` runs dry**: suggest a flush, following `references/flush-prompt.md`. Judgement only, never a cadence or a hook. Flush only moves `done` and `dropped` items to the archive, so nothing live is at risk and deferring it costs nothing.
  - **A plan's build finishes.** Move `plans/YYYY-MM-DD-topic.md` to `plans/implemented/YYYY-MM-DD-topic.md`, unchanged, once its `Status:` line says done. Keeps `plans/` root to what's still open, so a cold session isn't tempted to read finished plans it doesn't need. Details: `references/file-formats.md`.

## Routing

Top to bottom, first match wins.

| Ask | Destination |
|---|---|
| Folder-local context for code, needed by whoever works in that folder? | `CONTEXT.md` in that folder |
| A call that was made — picked, rejected, deferred — with reasoning that will be asked about later? | `plans/decisions/NNN-slug.md` (`new-decision`) |
| The record of a design or planning session, multi-part, one sitting? | `plans/YYYY-MM-DD-topic.md` (`new-plan`) |
| Durable and structural — why the repo is shaped this way, including standing facts a cold session would otherwise re-derive? | `ARCHITECTURE.md` |
| A rule agents must follow every session in this repo? | the repo's `AGENTS.md` |
| Work item: tracked now, or logged for later? | The store: `add` (`--status=parked` if not started) |

No match: ask. Don't pick the closest bucket — wrong-bucket content is worse than absent content, because it gets found later and trusted.

## Shared or private

Both layers can sit side by side in one folder — `CONTEXT.md` next to `_jookoi-CONTEXT.md`, `_architecture/` next to `_jookoi-architecture/`. The routing table picks the file *type*; this picks the layer, and it's a second question asked every time, not a fallback for when the first one fails. Same tree, same formats, `--private` on the script.

The test is audience, not secrecy. **Shared** (no prefix, committed) is what stays true for whoever works in this repo next, including when that isn't the user: how the code is built, why it's shaped this way, what breaks. **Private** (`_jookoi-` prefix, gitignored, mirrored to the personal vault) is what's true for this user or this machine rather than for this repo: local paths and environment, judgements about people, vendors or clients, opinions not ready to ship, cross-repo threads a contributor here has no stake in, and anything about the work rather than the code.

- **Split a note that straddles.** The technical half is shared and useful to everyone; the personal half is private. Writing the whole thing private hides the useful half from the repo — the more common failure than over-sharing.
  - **Shared files never link to private ones.** The link dangles for everyone but this user, and its filename leaks what was meant to stay unseen. Private → shared is fine.
  - **Repo you can't commit to → everything private.** No shared layer to write to, so `--private` is the whole answer there.
  - **Both present, conflicting? Private wins on read** (`references/operations.md`) — so a private note that contradicts a shared one silently overrides it. Correct the shared file instead of shadowing it, unless the contradiction is genuinely personal.

## The script

Run it from inside the target repo — it finds the root with `git rev-parse --show-toplevel`, else by walking up to a folder with `_architecture/`, so running it from the skill folder writes to the wrong place. `--root <path>` overrides.

```
node ~/.agents/skills/jookoi-paper-trail/scripts/jookoi-paper-trail.js <command> [args] [--root <path>] [--private] [--dry-run]

list [--status=S] [--stale=N]      now items + 3 latest done; or one status
find "<text>"  show <id>  count    search everything, one item, counts
add "<md>" [--status=parked] [--after=ID|--before=ID|--first|--last]
done|park|start|drop <id>          status changes
edit <id> "<md>"  move <id> <placement>
flush [--before=DATE]              done+dropped -> archive/items-YYYY-MM.json
render                             store as markdown, for a human
stale [days]  check                stale items and context files; validate
new-decision "<title>"  new-plan "<topic>"
```

Item format, IDs, placement and errors: `references/store-format.md`.

It owns IDs, dating, priorities, archiving, `NNN` allocation, and template instantiation. It refuses rather than guesses: an unknown ID or malformed store is reported and nothing is written.

No Node available? `references/pipeline.md` has the manual fallback.

## Hard rules

- **Never regenerate a prose file to change one section.** Target the heading, rewrite to the next one, leave every other byte alone.
  - **Never write a secret.** API key, token, credential, connection string — flag it, don't record it.
  - **Never leave a placeholder.** `TBD` / `TODO` / `[...]` — fill it or drop the section.
  - **Never restate what the code shows**, document parameters, log a changelog, or explain framework behaviour. If removing a line wouldn't slow a newcomer down, cut it.
  - **Never duplicate across levels.** Keep content at the more specific level; delete the copy.
  - **Never carry a wiped name forward.** Once something is removed or rejected, live docs stop naming it — the decision record holds the name and the reasoning. Full rule: `references/file-formats.md`.
  - **A folder's `CONTEXT.md` dies with the folder** — but check inbound references and promote anything durable first (`references/operations.md`).

## Bundled assets

| Load when | File |
|---|---|
| Writing or validating a prose file (CONTEXT, plan, decision) | `references/file-formats.md` |
| Item fields, commands, placement | `references/store-format.md` |
| Flushing | `references/flush-prompt.md` |
| Recovering a dead session, handling compaction | `references/pipeline.md` |
| Finding, removing, staleness, section-surgical edits | `references/operations.md` |
| Wiring the session-end gate on any harness | `references/hooks.md` |
| Creating a file that doesn't exist yet | `assets/templates/<type>.md` |
| Any mechanical operation | `scripts/jookoi-paper-trail.js` |
