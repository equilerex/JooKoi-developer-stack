# Plan — full `jookoi-doc` skill (memory-system build step 8)

## Context

`jookoi-doc` maintains the file set defined by the jookoi-paper-trail design (`_architecture/plans/2026-08-30-jookoi-paper-trail.md`). The design deferred the full skill to build step 8, to be written once the MVP had been dogfooded. That has happened.

Current state: one 69-line `SKILL.md`, two byte-identical copies — `my-global-setup/.agents/skills/jookoi-doc/SKILL.md` (source) and `~/.agents/skills/jookoi-doc/SKILL.md` (deployed). No scripts, no references, no templates.

**Two root causes, found during this planning session.**

**1. The design never defined `current-state.md` vs `progress.md`.** Every definition that exists describes both as done-work logs — design doc lines 77–78 (`rolling, hard line cap (~200)` / `short-lived; done work awaiting archive`) and `AGENTS.md` (`rolling, capped log of what happened and why` / `short-lived done-work log, awaiting archive`). Checked the retired `TODO-LIST.md` in git history: it is a stage-based project plan and defines neither. With no distinguishing test, routing was improvised per session, and the two files now hold near-duplicate content — `progress.md:4` restates the `current-state.md` 2026-08-30 entry.

The missing definition is a **time horizon**, not a content type: `current-state.md` is the live session, `progress.md` is accumulated finished sessions, `archive/` is old `progress.md`. This also explains why nothing has ever rotated — no flush step between the stages was ever specified, so the pipeline had no way to move.

**2. Every defect in the repo is a bookkeeping defect, not a judgement defect.** Seven format divergences, a verbatim duplicated entry, a rotation that never ran. None required judgement to get right; all of them required an LLM to track state across sessions, which it does badly. So mechanics move to a deterministic script and the model keeps only what needs judgement: what happened, and where it belongs.

Intended outcome: a pipeline that moves on its own at session boundaries, with format enforced by code rather than by instruction.

---

## Evidence

Measured across `_architecture/` on 2026-09-01.

**Unowned file types (4 of 8).** `plans/`, `plans/decisions/`, `BACKLOG.md`, `archive/YYYY-MM.md` appear nowhere in `SKILL.md`.

**Format divergence (7 points).**

| # | Divergence | Where |
|---|---|---|
| 1 | Entry heading grammar: `## YYYY-MM-DD — Title` vs `## Title (YYYY-MM-DD)` vs flat `- [x] DATE — text` vs undated `## Topic` | `current-state.md` / `archive/2026-08.md` / `progress.md` / `BACKLOG.md` |
| 2 | Date direction: newest-first vs mixed — `progress.md` lines 4–7 are newest-first, then the file becomes append-at-bottom | `current-state.md` vs `progress.md` |
| 3 | Verbatim duplicate entry | `progress.md` lines 19 and 23, identical text |
| 4 | Policy HTML comment present in 3 of 5 files | absent from `BACKLOG.md`, `archive/2026-08.md` |
| 5 | Unmodeled trailing prose outside the pointer list | `archive/index.md:6` |
| 6 | Backlog status in heading suffix, 6 different styles | `(resolved design, not built)`, `— moved`, `— confirmed research gap`, `— not currently relevant`, `— explicitly do NOT start yet`, `— designed, not built` |
| 7 | Decision-record `Status:` in 3 styles; `## Next step` in 5 of 7, dropped by the newest (007) | `plans/decisions/001`–`007` |

**Pipeline never ran.** `current-state.md` is 18/200 lines. `progress.md` has never been cleared and has grown to 25 lines with individual entries near 1000 characters. `archive/2026-08.md`'s single entry is a hand-authored retirement narrative, not a rolled-off entry — so no archived entry has ever existed, and the archive's heading grammar contradicts the file it will receive entries from.

**`next-steps.md` went stale in the way this predicts.** It listed step 8 as pending on "the MVP and dogfooding in this repo" — work `progress.md` records as finished on 2026-08-30. Nothing routes the unfinished half of a session anywhere, so the forward plan drifts.

**Doc staleness.** Three documents describe hooks that do not exist as described: the design doc (lines 166–167), `SKILL.md:14`, and the deployed `~/.agents/AGENTS.md`, which still points the memory design at the deleted path `personal-guidelines/jookoi-folder-memory-dinosaur.md`.

**Convention collision, unarbitrated.** Folders that would want a `CONTEXT.md` carry `README.md` instead (`my-global-setup/README.md`, `utility-scripts/jookoi-graphify-setup/README.md`, `my-global-setup/.agents/skills/README.md`). Nothing says which wins.

---

## Requirements

1. **A time-horizon pipeline** — current-state → progress → archive, with a defined flush at each boundary.
2. **One entry grammar across all three stages**, so flush and rotate are verbatim block moves rather than rewrites.
3. **Mechanics in code.** Ordering, dedup, dating, cap, roll-off, index maintenance, numbering, scaffolding — none of it model-decided.
4. **One destination per note**, resolved by a decision tree covering all eight file types.
5. **The four deferred capabilities** per the design's step-8 scope: find, remove, staleness, section-surgical updates.
6. **Negative tests per file type** — the design's stated defence against the bucket problem.
7. **Progressive disclosure**, matching `acquire-codebase-knowledge` house style.
8. **Stale docs reconciled**, not left as three mutually inconsistent descriptions.
9. **Existing files brought to canonical form**, so the repo becomes a correct example.

---

## Design

### The pipeline

```
  during session          at session end            when progress hits cap
┌──────────────────┐    ┌──────────────────┐      ┌──────────────────┐
│ current-state.md │───▶│   progress.md    │─────▶│ archive/YYYY-MM  │
│  · Standing      │    │  one entry per   │      │  oldest entries  │
│    summary       │    │  session,        │      │  roll off whole  │
│    (rewritten)   │    │  newest-first,   │      │                  │
│  · Session log   │    │  capped 200      │      │  index.md gains  │
│    (emptied)     │    │                  │      │  a pointer       │
└──────────────────┘    └──────────────────┘      └──────────────────┘
         │
         └── unfinished / newly surfaced ──▶ next-steps.md  (sequenced)
                                          └▶ BACKLOG.md     (unscoped)
```

**`current-state.md` — two blocks, two behaviours.**

```markdown
# Current state
<!-- Live session. `jookoi-doc flush` empties the session log into progress.md. See AGENTS.md. -->

## Standing summary

<Where things stand right now and why. Rewritten in place at each flush,
never appended to. This is what a cold session reads first.>

## Session log

## 2026-09-01 — <what happened>
<prose>
```

The standing summary is the answer to "what does a fresh session need to not re-derive". It is the only part of the system that is *rewritten* rather than accumulated, which is what keeps it short and true. The session log is the append target during a session and survives compaction — it is why `current-state.md` exists as a separate file at all rather than being the top of `progress.md`.

**Flush** (`jookoi-doc flush`), at session end:
1. Session-log entries move verbatim into `progress.md`, merged into one entry per session under `## YYYY-MM-DD — <session title>`.
2. Session log is emptied.
3. Model rewrites the standing summary against the new state.
4. Unfinished and newly-surfaced work routes to `next-steps.md` (sequenced) or `BACKLOG.md` (unscoped).
5. If `progress.md` now exceeds its cap, `rotate` runs.

Steps 1, 2 and 5 are script-only. Steps 3 and 4 need judgement and are the model's.

**Cap moves to `progress.md`.** Under the design as written, `current-state.md` was capped at 200 and rolled to archive. That was coherent only while `current-state.md` was an accumulating log. It is now a session buffer that empties on every flush, so it cannot accumulate; the 200-line cap and roll-off belong to `progress.md`, the file that actually grows. This is a deliberate change to the design, recorded as such.

### One entry grammar

`## YYYY-MM-DD — Title`, followed by prose and optional bullets. Used identically in `current-state.md`'s session log, in `progress.md`, and in `archive/YYYY-MM.md`. This is load-bearing: it is what makes flush and rotate pure `move`, implementable in a script with no reformatting and no model call.

`archive/2026-08.md`'s existing `## Title (YYYY-MM-DD)` heading is reshaped in the one-time pass. `progress.md`'s flat `- [x] DATE — text` bullets are promoted to headed entries.

### Routing tree — `SKILL.md`'s centrepiece

Evaluated top to bottom, first match wins.

| Ask | Destination |
|---|---|
| Folder-local context for code, needed by whoever works in that folder? | `CONTEXT.md` in that folder |
| A call that was made — picked, rejected, deferred — with reasoning that will be asked about later? | `plans/decisions/NNN-slug.md` |
| The record of a design or planning session, multi-part, one sitting? | `plans/YYYY-MM-DD-topic.md` |
| Durable and structural — why the repo is shaped this way? | `ARCHITECTURE.md` |
| Intended work, sequenced? | `next-steps.md` |
| Intended work, not yet scoped or ordered? | `BACKLOG.md` |
| Something that happened this session? | `current-state.md` session log |
| A standing fact that is now different? | `current-state.md` standing summary (rewrite, don't append) |

`progress.md` and `archive/` are never destinations. They are written only by `flush` and `rotate`.

### The script — `scripts/jookoi-doc.js`

Node, matching `utility-scripts/vault-sync.js`. **Lives inside the skill bundle, not in `utility-scripts/`** — per `AGENTS.md`, `utility-scripts/` is build tooling for this repo, and anything meant to be copied to other repos ships from `my-global-setup/`. The script travels with the skill.

| Command | Owns |
|---|---|
| `note "<text>"` | Append a dated entry to the `current-state.md` session log |
| `add <file> "<text>"` | Append a dated entry to any accumulating file, correct grammar and position |
| `flush` | Move session log → `progress.md` (one merged entry), empty it, report what still needs the model |
| `rotate` | Roll oldest `progress.md` entries into `archive/YYYY-MM.md` over cap, update `archive/index.md` |
| `status` | Line counts, cap headroom, pending flush, session marker state |
| `stale` | `updated:` vs `git log -1 --format=%cd -- <folder>` across all context files |
| `new-decision "<title>"` | Next free `NNN`, scaffolded from template |
| `new-plan "<topic>"` | Dated plan file from template |

The script owns: dating, heading grammar, newest-first insertion, duplicate detection, line cap, roll-off, archive-index pointers, `NNN` numbering, `updated:` bumping, template instantiation, and the session marker. The model owns: what happened, where it belongs, and the standing-summary rewrite.

Failure behaviour: the script never reformats content it did not write, never deletes without printing what it moved, and refuses rather than guesses when a file does not match its expected shape — a malformed file is reported for the model to fix, not silently rewritten.

Portability: a harness without Node falls back to `references/file-formats.md`, which specifies every rule the script enforces. The script is the enforcement mechanism, not the only description.

### Bundle layout

Authored at `my-global-setup/.agents/skills/jookoi-doc/`, copied to `~/.agents/skills/jookoi-doc/` (repo is source for this skill, per the design doc's deviations section).

```
jookoi-doc/
├── SKILL.md                    triggers, routing tree, flush protocol, bundled-assets table
├── scripts/jookoi-doc.js
├── hooks/
│   ├── doc-gate.sh             flush gate (blocking where supported)
│   ├── preserve.sh             pre-compaction transcript preservation
│   ├── rehydrate.sh            post-compaction standing-summary re-injection
│   └── config/                 copy-in fragments: claude-code.json, gemini.json, copilot.json
├── references/
│   ├── file-formats.md         canonical spec + negative test per file type
│   ├── pipeline.md             flush and rotate in full, incl. the no-Node fallback
│   ├── hooks.md                the three lifecycle points, mapped across the three CLIs
│   └── operations.md           find / remove / staleness / section-surgical
└── assets/templates/
    ├── CONTEXT.md              current-state.md      progress.md
    ├── next-steps.md           BACKLOG.md            archive-index.md
    ├── archive-month.md        plan-session.md       decision-record.md
```

`SKILL.md` targets ~120 lines: when it runs, the routing tree, the flush protocol, the hard write rules, and a table mapping each bundled file to the operation that loads it.

### Canonical formats — `references/file-formats.md`

Resolved deliberately, one section per file type carrying template, grammar, ordering, cap and negative test:

- **Entry grammar** `## YYYY-MM-DD — Title` in all three pipeline stages, per above.
- **Newest-first everywhere** dated.
- **Policy HTML comment on line 2 of all five memory files**, including the two lacking one — it is what tells a cold agent which file it is holding.
- **Backlog status as a closed vocabulary** on its own `Status:` line: `OPEN` / `DESIGNED` / `BLOCKED` / `MOVED` / `DROPPED`. Replaces six ad-hoc heading suffixes, and matches the decision-record shape rather than inventing a second convention.
- **Decision records: fixed sections** — `Problem` / `Options considered` / `Decision` / `Why not the alternatives` / `Next step`, with `Status:` from `DECIDED` / `TRIAL` / `REJECTED` / `DEFERRED` / `SUPERSEDED`. Generalises 007's ADR shape, the cleanest and most recent of the seven.
- **`archive/index.md` pointer**: ``- **`YYYY-MM.md`** — <date range>: <one-line summary>``. The trailing free-prose line is dropped; rotation status is `jookoi-doc status`, not prose in the index.
- **`CONTEXT.md` vs `README.md`**: `README.md` addresses a human arriving at the folder; `CONTEXT.md` addresses an agent about to change code in it. They may coexist. Agent-facing content already sitting in a `README.md` moves rather than being duplicated. The skill never creates a `CONTEXT.md` merely to have one — no-bulk-generation still governs.

### The four deferred operations — `references/operations.md`

**Find.** Nearest-first: working folder's `CONTEXT.md`, then each parent to the repo root, then `_architecture/`. Shared and private (`_jookoi-`) files at the same level are both read, private last so it wins on conflict. Never walks outside the repo root.

**Remove.** A folder's `CONTEXT.md` dies with it. Before removing, the script reports inbound references rather than silently orphaning links, and durable content is offered for promotion to the standing summary — otherwise "delete with the code" destroys reasoning that was never folder-local.

**Staleness.** `jookoi-doc stale` compares `updated:` against `git log -1 --format=%cd -- <folder>`. Reporting only. No auto-fix: the design's rule is that when context contradicts code the code wins and the context is corrected *at the point of noticing*, which is contextual judgement, not a batch job.

**Section-surgical updates.** Every file type has a fixed section set, so an update targets one heading and rewrites only it, byte-identical elsewhere, `updated:` bumped. The skill never regenerates a file to change a section.

### Hooks — three harnesses, three lifecycle points

**Correction to this plan's first draft.** The earlier version said `PreCompact` "cannot do what the design describes" and dismissed it. That was too narrow. `PreCompact` cannot inject context *back into the model*, which is true — but it receives the **entire uncompacted transcript on stdin** and can write deterministically to disk. Preservation is exactly what it is for. The rehydration half is a separate event: `SessionStart` with a `compact` source matcher, which fires after the context shrinks and *can* inject. Together they are the pre/post-compaction pair the design asked for. The design doc's "highest-value trigger" claim stands; only its single-event implementation was wrong.

This also makes `current-state.md` the file the compaction cycle is built around: `PreCompact` preserves the session log, `SessionStart(compact)` re-injects the standing summary plus that log.

**Harness-agnostic by requirement.** The stack is harness-agnostic; hooks ship for all three CLIs the user runs. The lifecycle points are the same everywhere; only event names and config format differ.

| Purpose | Claude Code | Gemini CLI | GitHub Copilot CLI |
|---|---|---|---|
| Preserve before compaction | `PreCompact` | — (no separate pre event) | — (no auto-compaction loop) |
| Rehydrate after compaction | `SessionStart` + `source: compact` matcher | `SessionStart` + `source: compress` matcher | — |
| Recover a session that died unflushed | `SessionStart` | `SessionStart` | `SessionStart` / `onSessionStart` |
| Flush gate at turn end | `Stop` (blocking) | `AfterAgent` | `Stop` / `AgentStop` |
| Final log | `SessionEnd` | `AfterAgent` | `Stop` |

Copilot CLI has no background auto-compaction loop, so its memory story is turn-based: the `Stop` hook appends to the session log every turn and `onSessionStart` reads it back — a pseudo-memory stream rather than a compaction cycle. Config formats: Claude Code `settings.json`; Gemini CLI `hooks/hooks.json` (v0.26.0+, bundleable inside an extension); Copilot CLI `hooks.json` or `@github/copilot-sdk/extension` via `joinSession()`.

**Flush gate — the one hook that needs blocking.** Claude Code's `Stop` supports `additionalContext` and `decision: "block"`, which prevents the turn ending and injects instructions the model must act on. That is genuine in-session invocation, with full context, at the natural flush boundary.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "decision": "block",
    "additionalContext": "Session log has unflushed entries. Run `jookoi-doc flush`, then rewrite the standing summary and route any unfinished work."
  }
}
```

Loop prevention is mandatory: hook input carries `stop_hook_active: true` once the hook has already forced a continuation; the script must exit 0 on it or it blocks every turn to the 8-block cap. Gemini's `AfterAgent` and Copilot's `Stop`/`AgentStop` occupy the same slot; whether either supports a blocking decision is unverified and must be checked at build time rather than assumed — where it is not supported, the gate degrades to a written report plus a `SessionStart` reminder on the next run.

**Gating** — `doc-gate.sh` blocks only when all hold: `stop_hook_active` is not true; `git status --porcelain` is non-empty; `jookoi-doc status` reports an unflushed session log. Flush clears the third, so the gate is self-clearing.

**Portability of the scripts themselves.** All hook scripts are POSIX `sh` reading JSON from stdin, with the harness-specific output shape produced by a single `emit` function branching on which harness invoked it. One script body, three config files. They live in the skill bundle's `hooks/` folder so they travel with it, with the per-harness config snippets alongside as copy-in fragments — no installer, per the standing rejection of generated config.

**Existing hooks keep their jobs.** `session-log.sh` continues on `SessionEnd`/`PreCompact`; `session-start-reminder.sh` continues as the died-unflushed recovery path. The `Stop` gate and the `SessionStart(compact)` rehydrator are additions.

### Doc reconciliation

- **Design doc**: `current-state.md`/`progress.md` given the time-horizon definition they never had; the cap and roll-off moved to `progress.md`; the hooks section (166–167) expanded from one Claude-Code-shaped list to the three-harness lifecycle table, keeping its `PreCompact` claim but pairing it with `SessionStart(compact)` for rehydration; step 8 marked done; an "Implementation deviations" entry for each change.
- **`~/.agents/AGENTS.md`**: dead path `personal-guidelines/jookoi-folder-memory-dinosaur.md` repointed; re-synced from the repo copy so the two stop drifting.
- **Both `AGENTS.md` copies + repo root `AGENTS.md`**: the "where status actually lives" descriptions updated to the pipeline.
- **`my-repo-setup/AGENTS.md`**: mentions the convention only inside an HTML comment and never mentions `jookoi-doc`. Seeded with the four behaviour rules so a new repo starts conformant.
- **`_architecture/ARCHITECTURE.md`**: silent on the memory system despite it being the dominant thing `_architecture/` holds. Gains a short section pointing at the design doc and the skill.

---

## Build steps

1. `references/file-formats.md` — the canonical spec. Everything depends on it.
2. `assets/templates/*` — nine skeletons from that spec.
3. `references/pipeline.md` — flush, rotate, no-Node fallback.
4. `scripts/jookoi-doc.js` — all eight subcommands.
5. `references/operations.md` — find, remove, staleness, section-surgical.
6. `SKILL.md` — triggers, routing tree, flush protocol, bundled-assets table.
7. Hooks — `references/hooks.md`, then `hooks/{doc-gate,preserve,rehydrate}.sh` plus the three `hooks/config/` fragments. Register the Claude Code set in `.claude/settings.json`; existing three hooks untouched. Verify blocking support on Gemini `AfterAgent` and Copilot `Stop` before relying on it.
8. One-time canonicalisation of `_architecture/`: split `current-state.md` into standing summary + session log; promote `progress.md`'s flat bullets to headed entries and merge them into per-session entries; dedupe lines 19/23; normalise `archive/2026-08.md`'s heading; drop `archive/index.md`'s trailing prose; add `Status:` lines to `BACKLOG.md`; bring `decisions/001`–`007` onto the fixed section set; refresh `next-steps.md` against what `progress.md` says is actually done.
9. Copy the bundle to `~/.agents/skills/jookoi-doc/`; re-sync `~/.agents/AGENTS.md`.
10. Doc reconciliation per above.

Steps 1–6 are the skill. Step 8 is what makes the repo an example the skill can pattern-match against.

## Verification

- **Routing.** Route ten real notes from the last three sessions (they are already in `progress.md` and `current-state.md`) through the tree cold. Each must land where it lives today, or the difference must be a deliberate correction rather than a tree failure.
- **Flush, actually run.** Add three session-log entries, run `flush`, confirm: entries appear in `progress.md` byte-identical under one merged session heading, session log is empty, standing summary is the only part needing a model write.
- **Rotate, actually run.** `progress.md` will not trip the cap naturally. Pad a copy past 200 lines, run `rotate`, confirm oldest-first roll-off, archived entries byte-identical to originals, and a correct new pointer in `archive/index.md`.
- **Malformed input.** Hand-break a heading and run `flush` — must refuse and report, not rewrite.
- **Format reproducibility.** Regenerate one `CONTEXT.md` and one progress entry from templates in a fresh session; diff against committed versions. Differences must be content-only, never structural.
- **Staleness on the empty case.** `jookoi-doc stale` with zero `CONTEXT.md` files present must report zero flags and exit clean — the empty case is the one most likely to be wrong.
- **Stop gate, three cases.** Clean tree → no block. Dirty tree with unflushed log → blocks once, instruction acted on. `stop_hook_active` true → exits 0 immediately. The third hangs the session if wrong.
- **Deployment parity.** `diff -r` the repo bundle against `~/.agents/skills/jookoi-doc/` — empty. Same for `AGENTS.md`.

## Out of scope

Vault sync conflict resolution stays with `utility-scripts/vault-sync.js` (build order step 5). Bulk generation of `CONTEXT.md` remains forbidden. No setup script — manual copy, per the standing rejection of generated config.
