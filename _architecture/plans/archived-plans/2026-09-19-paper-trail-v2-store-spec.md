# paper-trail working-set store: spec

Companion to `2026-09-19-paper-trail-v2-keyed-store-todo-backlog-decisions-decision-l.md`. Graduates to `my-global-setup/.agents/skills/jookoi-paper-trail/references/store-format.md` once built.

## Files

```
_architecture/
  items.json              live store: now, parked, done, dropped
  archive/items-YYYY-MM.json   flushed items, one file per month
  TODO.md                 keeps only the `## Context` prose header
```

`_jookoi-architecture/` mirrors this for the private layer. `--private` picks the layer, same as today.

Root resolution: `git rev-parse --show-toplevel` from cwd, falling back to walking up for a directory containing `_architecture/` or `_jookoi-architecture/`, with `--root <path>` overriding both. The walk-up fallback is new and covers non-git folders.

## Schema

```json
{
  "next_id": 19,
  "items": {
    "t017": {
      "content": ["Rewrite flush so it stops wiping the file", "", "- live items no longer move"],
      "status": "now",
      "priority": 2000,
      "ts_created": "2026-09-12",
      "ts_started": "2026-09-14",
      "ts_done": null,
      "ts_touched": "2026-09-19"
    }
  }
}
```

`content` is markdown, stored as an array of lines so the file stays readable raw. Line 0 is the title for list output, the rest is body.

`status` is one of `now`, `parked`, `done`, `dropped`.

`priority` is a sparse integer, lower sorts first. New items are appended at `max + 1000`. Inserting between two items averages their values. Nothing renumbers, ever, and an item keeps its value when its status changes. Priority is a convenience, not a contract: approximate ordering is the whole requirement, so the script should stay liberal about values rather than defend a scheme.

`ts_started` distinguishes a parked item that was once active from one that was never scoped, which is why `parked` does not need to split into two statuses.

`next_id` is monotonic and never resets on flush. Archived `t001` and a fresh `t001` must never collide, because plan files reference IDs by name.

## IDs

`t` plus a zero-padded sequential number: `t017`. One namespace now that backlog is a status, so no second prefix.

Sequential digits survive LLM copying better than anything random. IDs are never reused after an item is dropped or archived.

## Commands

```
node ~/.agents/skills/jookoi-paper-trail/scripts/jookoi-paper-trail.js <command> [--root <path>] [--private] [--dry-run]
```

### Reads

| Command | Returns | Use case |
|---|---|---|
| `list` | `now` items in priority order, plus the 3 most recent `done` | Session start. The default read, always bounded |
| `list --status=parked` | Parked items in priority order | Checklist thin, looking for what to pull in |
| `list --status=done --since=<date>` | Done items in a window | Flush classification |
| `list --stale=<days>` | `now` items untouched for N days | Finding items that should be parked |
| `find "<text>"` | Matches across every status and the archive | Dedup check before adding |
| `show <id>` | Full content of one item | Following up on a list line |
| `count` | Counts per status, last flush date | Deciding whether to flush. Near-zero cost |
| `render [--status=...]` | The store printed as markdown | Human read path |

Archive is searched by `find` but never included in `list`. Same rule the archive already has.

### Writes

| Command | Effect |
|---|---|
| `add "<markdown>" [--status=now\|parked] [placement]` | New item, prints the assigned ID. Defaults to status `now`, appended last |
| `done <id>` | Status to `done`, sets `ts_done` |
| `park <id>` | Status to `parked` |
| `start <id>` | Status to `now`, sets `ts_started` if unset |
| `drop <id>` | Status to `dropped` |
| `edit <id> "<markdown>"` | Replaces content |
| `move <id> <placement>` | Reprioritise one item |
| `flush [--before=<date>]` | Moves `done` and `dropped` items to `archive/items-YYYY-MM.json`. Touches nothing else |

Every write is a single call with no prior read. That is the point of the ID.

**Placement** is `--after=<id>`, `--before=<id>`, `--first` or `--last`, defaulting to `--last`. The caller names a neighbour it already has from a `list` and the script computes the integer. A raw `--priority=<n>` exists for scripting but the LLM is never expected to use it, because picking a sane number would require reading the store first.

## Output format

List output is markdown lines with the ID inline, so it drops straight into the model's reasoning without translation:

```
- [ ] `t018` Walk-up root resolution for non-git folders
- [ ] `t017` Rewrite flush so it stops wiping the file
- [x] `t015` Global AGENTS.md gained a Naming section
```

Priority is not printed. It is positional, so the order of the lines already carries it, and printing the integer would just invite the model to reason about raw values.

Body lines are omitted from `list` and retrieved with `show`. This is what keeps the default read bounded when the store holds a hundred items.

## Error behaviour

An unknown or stale ID exits non-zero with a message naming the ID. Never a silent no-op, because the agent will otherwise report success on a write that did not happen.

A malformed store is reported and left untouched, matching the current script's refuse-rather-than-guess behaviour.

Concurrent writes from a terminal `jnote` and an agent session are possible but rare. Read-modify-write the whole file and compare against what was read. Fail loudly on a mismatch rather than merging.

## What this replaces

`BACKLOG.md` is absorbed and deleted. `TODO.md` keeps only `## Context`. The `backlog` subcommand goes away. `stale` moves from git commit dates to `ts_touched`, which is what makes it work on the private layer.
