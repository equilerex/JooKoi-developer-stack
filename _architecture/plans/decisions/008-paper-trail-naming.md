# Decision 008 — naming the context-file convention

Date: 2026-09-01

Status: DECIDED

## Problem

The convention was called "JooKoi Folder Memory Dinosaur" — 29 characters, four words, appearing 40+ times across `AGENTS.md` instances, the skill bundle, hook headers and planning docs. Two costs: it is expensive in a string that ships in every session's instruction context, and it is not a recognisable identifier — nothing in it matches the file and folder names it governs (`jookoi-doc`, `_jookoi-*`).

Second problem, same root: "memory" is the wrong word for what this is. `decisions/003-memory-ledger-picks.md` accepts the "Stop Calling It Memory" critique — markdown files don't query, don't hold relationships, don't enforce a schema. Naming the convention after the thing it deliberately isn't invites an objection the design already sidesteps.

## Options considered

- `jookoi-filing-system`
- `jookoi-layered-memory`
- `jookoi-context-loop`
- `jookoi-persistent-llm-context`
- `jookoi-paper-trail`

## Decision

**`jookoi-paper-trail`**, lowercase, hyphenated, used verbatim everywhere. Matches the `jookoi-doc` / `_jookoi-` prefix family, so the name, the tool and the file prefix all read as one thing.

Separately: the concept gets its own doc at the repo root, `jookoi-paper-trail.md` — the manifesto, the five parts (privacy switch, folder layout, pipeline, behaviour rules, tooling), and adoption steps. `_architecture/plans/2026-08-30-jookoi-paper-trail.md` stays what it is: the design session and the build record, including where implementation diverged. One is what it is; the other is why and how it got built.

## Why not the alternatives

**Anything containing "memory"** (`jookoi-layered-memory`) — rejected on the 003 grounds above. The design's own argument is that this is not a memory system.

**`jookoi-filing-system`** — accurate but flat; describes the storage, not the practice. `paper-trail` carries the same filing sense plus the thing that actually matters: a record left behind deliberately, as work happens.

**`jookoi-context-loop`** — names the pipeline only, which is one of five parts.

**`jookoi-persistent-llm-context`** — longest of the set and tool-flavoured; the convention is meant to outlive whichever model reads it.

## Next step

None. Rename executed 2026-09-01 across the repo and `~/.agents/`; concept doc written; historic dated entries in `progress.md` and `archive/` keep their original wording where they quote what was said at the time.
