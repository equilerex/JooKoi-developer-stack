# paper-trail v2: an addressable working-set store

Session: 2026-09-19. Status: built 2026-09-19 (steps 1-6). Spec: `2026-09-19-paper-trail-v2-store-spec.md`.

## Context

Prompted by building `jnote`, which showed that a script-mediated write is cheap and frictionless. That raised the question of whether `TODO.md` and `BACKLOG.md` should get the same treatment.

`jnote` itself is out of scope here and stays as it is. It is agent self-telemetry, not a task list: an append-only event log where a session records harness and process findings for the user to review later. Inefficiencies, token waste, needless subagent spawns, a prompt fragment that keeps earning its keep and might belong in a global `AGENTS.md`. Append-only events, so JSONL is the right format and none of the addressing argument below applies to it. The two systems share no storage and should not be merged.

The session started from a hunch about token cost and ended somewhere else. Token savings on reads are real but small, roughly 5% of a session. The actual problem is that the working-set files have no addressing. Every item is identified by its own text, and everything downstream follows from that:

- Mutating an item needs an exact-match edit, which means reading the whole file first and risks mangling it.
- Timestamps get derived from git commit dates rather than stored, so `stale` silently does not work on `_jookoi-*` files, which have no commits.
- The skill spends most of `references/file-formats.md` on heading grammar, newest-first insertion, date formats and dedup, plus a hard rule against regenerating a file, all of it compensating for unsafe editing. Those instruction tokens are paid every time the skill loads, in every repo, which outweighs any per-read saving.
- `flush` archives `TODO.md` whole and wipes it, so live items must be moved to `BACKLOG.md` first or they are lost (`SKILL.md:16`). A destructive operation guarded by the agent remembering a rule.
- `Grep` and `Glob` run on ripgrep, which honours `.gitignore`, so `_jookoi-architecture/` is invisible to search. Agents burn turns discovering this.

One change fixes all of it: give items primary keys and let a script own every write.

### Decisions reached

1. **Items get IDs, the script becomes the only writer.** The LLM never writes the file format. It calls a CLI. This is what removes the format half of the skill from context, and it is the largest single win here.

2. **JSON store, not markdown.** The files are written by an LLM and read by a human, never hand-written. That removes the argument for keeping markdown as the storage layer. Decision 009 forbids installed dependencies, and `JSON.parse` is the only structured parser Node ships, which rules out TOML and YAML despite both reading better raw. Two mitigations for JSON's poor raw readability: store item content as an array of lines rather than one escaped string, and provide a `render` subcommand that prints markdown to the terminal. Those replace the HTML viewer the earlier draft called for, which only existed to fix a problem JSON creates.

3. **Item content stays markdown.** Only the container changes. Nothing about how notes are written or read changes.

4. **`BACKLOG.md` is absorbed into the store as a status.** The two-file split only existed because a file is the only filter markdown offers. Once status is a field, "backlog" is a status, not a location. Merging removes the move-between-files operation and its data-loss path, removes the flush hazard entirely, and collapses two file formats and a transfer protocol into one routing decision.

5. **Four statuses:** `now`, `parked`, `done`, `dropped`. `parked` covers both never-scoped backlog items and items that went dormant, since nothing treats those differently and whether an item was ever active is answerable from `ts_started`. `dropped` settles the open question about whether discarded items need a holding period. They do not, they need a status.

6. **Priority is one sparse integer, and the LLM never types it.** Priority and ordering are the same concept, so they are one field. Lower sorts first. Values are spaced (1000, 2000, 3000) so inserting between two items writes one field with no cascade rewrite. An LLM asked to pick a raw number would have to read the list first to know what is in use, which defeats the point, so the interface is `--after=<id>` / `--before=<id>` / `--first` / `--last`. It names a neighbour it already has from `list` and the script computes the value. Buckets were considered and rejected: they hit a ceiling once twenty items are all "high", and an integer does not.

7. **Prose stays prose.** `ARCHITECTURE.md`, `CONTEXT.md`, `plans/`, decision bodies and `TODO.md`'s `## Context` header are read start to finish and rewritten wholesale. Item collections go in the store, documents do not.

8. **Flush stops being urgent.** Once `done` items are excluded from the default read, having 95 of them costs nothing. Flush becomes archive tidying on judgement rather than a chore the agent must remember before the file degrades.

### Split out of this plan

**Decision lifecycle** (`active`/`superseded`/`rejected` status plus a `plans/decisions/index.md`, so a reversed decision stops misleading an agent that reads it) is a real problem and independent of the store. It gets its own decision file rather than being buried here.

**Promote durable content out of a decision before archiving it** is a process rule, also independent.

**Flush trigger** is settled, and it is not a hook. The agent may suggest a flush when it hits a natural boundary, a chunk of work finishing or the active set running dry. The user triggers it otherwise. Both paths run the same reusable prompt or slash command rather than free-form judgement, so the classification step (promote to `ARCHITECTURE.md`, park, drop, archive) happens the same way each time. Still judgement-gated, which decision 8 makes cheap: nothing degrades while a flush is deferred.

### Deferred

`blocked_by` dependencies between items. A different concept from priority, not asked for, and a dependency graph is its own design.

## Build order

1. **Store plus CLI for the working set.** Schema, ID allocation, the read and write commands in the spec. Everything else depends on this.
2. **Migration.** One-time conversion of the current `TODO.md` checklist and `BACKLOG.md` into the store. `BACKLOG.md` items land as `parked`.
3. **Skill rewrite.** Strip format rules from `references/file-formats.md`, collapse the routing table's two item rows into one, delete hard rule 1 (never regenerate to change a section) as it no longer applies to the store, fix the flush section.
4. **`stale` and `flush` rebuilt against stored timestamps.** `stale` starts working on the private layer. `flush` becomes non-destructive.
5. **`render`.** The human read path.
6. **Flush prompt.** A reusable prompt or slash command carrying the classification step, invoked by either the agent suggesting it or the user asking for it.

## Implementation deviations

<!-- Added once the build diverges from what this plan said. Future reads reconcile
     against this section, not just the sections above. -->

- `items.json` carries a top-level `last_flush` date, not in the spec, so `count` can report it without scanning archives.
- The `stale` command kept its CONTEXT.md git check and gained the `ts_touched` item check; `list --stale=<days>` covers the item side on its own.
- Flush no longer writes markdown archives or `archive/index.md`. Older `archive/YYYY-MM.md` files stay as history and `find` searches them.
- Migration was a one-off script, not a subcommand. Migrated items have `null` for dates never recorded; long checklist titles were shortened by hand with the full text kept as the body.
- Step 6 shipped as `references/flush-prompt.md`, not a slash command.
- Hooks changed: `rehydrate.sh` injects Context plus `list`, `doc-gate.sh` treats `items.json` as touching the working set.
- The concept doc `jookoi-paper-trail.md`, `ARCHITECTURE.md` and `stack-distribution.md` still describe the old layout (logged as a parked item).
