# Paper-trail plan-first lifecycle

Session: 09-10-2026 23:40. Status: in progress. Approved 09-10-2026, deliverables 1 to 5 built and awaiting owner review, deliverable 6 not started.

## Context

Across models and harnesses, agents misuse the paper trail the same way: plans and decision files get treated as general notes or as durable reference to read back, `items.yaml` fills with fine-grained entries, feature work starts without a plan, durable facts do not reach `ARCHITECTURE.md`, `CONTEXT.md`, `AGENTS.md` or `README.md`, and the end-of-turn hook interrupts agents far more often than it helps.

### Audit of the eight repos under `D:\repos\Serenity` that have `_architecture/`

- **Finished plans never move.** Every repo has built plans at `plans/` root: dev-stack (six), frontpage (`2026-09-29-landing-page-rss-feed`, "Status: Done"), GlitchGlimmer (five of 17). Some predate the `implemented/` folder, so part of this is backlog, not ongoing failure.
- **`implemented/` is read as "approved".** Frontpage has five plans in `implemented/` whose status says not started or awaiting go-ahead (`2026-09-15-angular-foundation-phase-1`).
- **Stale plans contradict read-path docs.** Frontpage `2026-09-16-phase-3-content-and-features` says "ready to implement, not started". `ARCHITECTURE.md` says phase 3 is built. A cold agent reading the plan gets it wrong.
- **`plans/` holds things that are not plans.** HANDOFF files duplicating their plan's status (GlitchGlimmer, three), research references filed as plans (GlitchGlimmer `2026-09-21-music-model-for-lighting-research`), a generated checklist (homelab `2026-10-08-ha-migration-checklist`, written by `build.mjs`), and non-standard docs at `_architecture/` root (GlitchGlimmer `VISUALIZER_UI.md`, `PROCESS-NOTES.md`).
- **Code and docs treat plans as reference.** Plan paths in source comments (GlitchGlimmer `src/scenes/SceneDirector.h`, homelab `ha-migration/build.mjs`), a README pointing at a plan as rebuild instructions (homelab), a skill README citing plans that no longer exist (frontpage), and this repo's script header citing a missing plan.
- **Items are over-granular.** Dev-stack has 63 items, titles like "Root README.md gained a 'Why this exists' section". Frontpage has 81.
- **Decision files are mixed.** Most frontpage decisions are real rule rationale. Some are ordinary implementation (034, 038, 039). Dev-stack 016 duplicates a rule already in global `AGENTS.md` and an item already recording the change. Homelab 001 and 002 are linked from nothing but `index.md`.
- **Read-path docs send agents into history.** Scraper `_architecture/page-redesign-prompt.md` tells agents to read every decision before designing. Scraper `ARCHITECTURE.md` and md-archive `AGENTS.md` point to `plans/decisions/` as reference.
- **`plans/` and `archive/` hold runnable artifacts.** Scraper `plans/` has `package.json`, `vitest.config.mjs`, mock `.html`/`.js` and a `node_modules/`. Scraper `archive/` has a mockup `.html` and a handoff note.
- **Decision status rots.** Scraper 005 still says DECIDED after 006 pivoted away from it. Scraper 018 is a CSS convention that belongs in a `CONTEXT.md`.
- **Legacy layout survives.** Three of eight repos have no `items.yaml`: ai-market and scraper run on `TODO.md`/`BACKLOG.md` plus `plans/decisions/`, md-archive also has `architecture.md` in lowercase. The live `~/.claude/CLAUDE.md` copy of global `AGENTS.md` still describes `TODO.md`/`BACKLOG.md`.
- **What works.** Corporate is the closest to the intended shape: milestone-sized items ("Build Repo A skeleton per plan"), finished plans in `implemented/` with `Status: done`, `AGENTS.md` pointing to `ARCHITECTURE.md` first. Its one slip is item mey7, whose body restates the plan's status and a separate `HANDOFF.md`.

### Four structural gaps behind these

1. **The skill describes destinations, not a lifecycle.** `SKILL.md` is a routing table of peer buckets. Nothing describes the flow a feature goes through, so every bucket looks like a place to put notes.
2. **Plan and item have no stated purpose relative to each other.** Both can hold steps and reasoning, so agents duplicate between them and items end up one per small change.
3. **Names do not signal "don't read".** `implemented/` and `decision-history/` sit inside `plans/` and sound like reference. Nothing says "cold" in the name.
4. **Nothing closes the loop.** Finishing a plan does not require folding its durable outcome into the read-path docs, and nothing moves a finished plan when the agent notices it later.

## Model

### Three tiers

Defined by whether an agent reads them unprompted.

| Tier | Files | Read |
|---|---|---|
| Read-path (durable truth) | root `README.md`, `AGENTS.md`, `_architecture/ARCHITECTURE.md`, folder `CONTEXT.md` | whenever relevant. Always current, edited in place |
| Working set | open plans in `_architecture/plans/`, `items.yaml` | while the work is open. Recently done items too, for handoff |
| Archived | `plans/archived-plans/`, `plans/archived-decisions/`, `_architecture/archived-items/` | only a specific file, when the user asks or an item or doc names it. Never swept, no index |

Rule for agents: **anything durable must be findable from the read-path tier alone.** If a cold session needs an archived plan or decision to work correctly, the fold-out step was skipped.

Where durable facts go, most specific first: an inline comment beside the code it explains; then the folder's `CONTEXT.md`; then `ARCHITECTURE.md`, `AGENTS.md` or `README.md`. Dedicated files are for vital facts an agent could not infer without context, not for everything worth knowing.

Archived content has no index file. An agent reaches an archived file only by its exact path, from the user, an item body or a read-path doc, and does not search archives unless the user asks.

Naming rule: everything an agent should not read unprompted starts with `archived-`. The prefix is the instruction. Each archive sits inside the context it archives: closed plans in `plans/archived-plans/`, decisions in `plans/archived-decisions/`, flushed items beside `items.yaml` in `_architecture/archived-items/` (replacing `archive/`).

### Plan and item: different jobs

| | Plan | Item |
|---|---|---|
| Answers | what are we building, how, and how far along is it | what work is open, and what just finished |
| Holds | design, reasoning, deliverables, progress, deviations, fold-out targets | one or two lines of state and a pointer to the plan |
| Granularity | one per feature or design question | one per implementation bubble, typically one per plan. Never one per change |
| Updated | in bulk every so often during the build, not after each edit | at start and at finish, and when the state changes meaningfully |
| Read by | whoever builds this feature | any agent picking the work up, including after a harness or model swap |

The plan is the main file. Progress tracking (checkboxes, notes) inside the plan is allowed and often cheaper than splitting it into items. The item is the handoff marker: an agent arriving cold reads open and recently done items, learns which plan is in flight and roughly where, and does not need another harness's session logs. Design never gets copied into the item.

A plan's life in the store, typically:

- `add` "Implement <plan title>", body: plan path, one line of state. `start` it.
- `edit` the body when a milestone lands, if the plan's own progress section isn't enough for a cold reader to find the state.
- `done` with body "Implemented, plan moved to `plans/archived-plans/<file>`".

Work without a plan uses items the same way: one item per piece of work, body updated as it moves, a parked item for found-but-not-started work.

### Not plans

`plans/` holds plans only. Other things found there today go elsewhere:

- Handoff notes: into the plan's progress section or the item body, not a second file.
- Research and reference material: a `CONTEXT.md` beside the code it informs, a linked `<topic>.ARCHITECTURE.md`, or the repo's research folder.
- Generated files, mocks, prototypes and anything with its own dependencies: next to their generator, or in a normal source folder. Never under `_architecture/`.
- Prompts that brief an agent: cite read-path docs, never "read all decisions".
- Code comments: cite a read-path doc or nothing, never a plan path.

## Lifecycle of feature work

1. **Suggest a plan when the work warrants it.** Work touching architecture or lifecycle (a new module, folder, dependency or external service, an interface or path other code relies on, several deliverables) normally gets a plan. If the user has not asked for one, the agent suggests it or asks. "We're implementing feature X now" counts as asking. A small change, a fix or a doc tweak goes straight to work. The user decides.
2. **Draft in the repo.** `new-plan` creates `_architecture/plans/YYYY-MM-DD-topic.md` at the start of planning, and drafting happens in that file, whatever the harness. Changes the user asks for are edits to that file. On approval the `Status:` line changes to ready. Harness plan modes are not used for these plans: Claude Code's plan mode is read-only outside its own `~/.claude/plans/` file, which blocks edits to the repo plan during review rounds. The agent drafts in normal mode and changes no code until the plan is ready. If the user did start in plan mode, the approved text goes into the repo file right after leaving it. Implementation may start in a later session; the plan and its item are the handoff.
3. **Start.** One item, as above.
4. **Build.** Progress lives in the plan, updated in bulk. Calls the plan did not cover go into its `Implementation deviations`, not into decision files. If the plan changes, the plan is edited in place.
5. **Fold out.** Before closing, each durable outcome is written into its read-path home: structure into `ARCHITECTURE.md`, folder gotchas into `CONTEXT.md`, rules into `AGENTS.md`, usage into `README.md`. The plan's `Fold-out` section names each target.
6. **Close.** `close-plan <file>` sets `Status: done` and moves the plan to `plans/archived-plans/`, with no other edit. The item goes `done` pointing at the new path.

**Completion is explicit.** A plan is complete when the user says so or when every deliverable is built and fold-out is written. "Approved" is not complete.

**Any agent using the skill tidies.** On any paper-trail use, an agent that sees an open plan whose status, or the code, shows it is built folds it out and closes it. If the status is ambiguous, it asks rather than moving. An archived plan whose status says not started is moved back to `plans/` by hand. No command for that; it is rare.

## Items: lighter rules

- One item per implementation bubble, edited over its life. No item per small change. The store is a readable recent history: noise costs the owner in the viewer and the next agent in tokens.
- Done items say what was achieved at the level a returning reader cares about, not which files changed.
- The script is the cheap path: it adds and edits by ID without loading the whole file, and keeps the viewer working. Editing `items.yaml` by hand is allowed for cleanup, such as merging or removing redundant entries. Run `check` after.
- Consolidating over-granular items is a normal cleanup: merge siblings into one item whose body lists what they covered, drop the rest. Flush suggestions include it.

## Hooks: session boundaries, not every turn

Current wiring (Claude Code, `hooks/config/claude-code.json`): `Stop` runs `doc-gate.sh` at the end of every turn, `PreCompact` runs `preserve.sh`, `SessionStart` runs `rehydrate.sh`. The gate blocks whenever five or more files changed since the last store write and ten minutes have passed (`sweep --gate` in `jookoi-paper-trail.js`). In any long session that holds most of the time, so it fires turn after turn and pushes agents towards logging small changes to clear it. That is one direct cause of the over-granular store. Gemini (`AfterAgent`) and Copilot (`Stop`) are wired the same way.

New wiring, all three harnesses:

- `SessionStart`: `rehydrate.sh` shows open items and any uncurated notes, and now also runs plain `sweep` and prints its result, so unrecorded work from the previous session surfaces once, at the start of the next. Informational, never blocking.
- `PreCompact`: `preserve.sh`, unchanged.
- `SessionEnd`: new entry, `preserve.sh`. Added to each config only where the harness supports the event; confirm per harness from current docs during the build.
- `Stop` / `AfterAgent`: removed. `doc-gate.sh` and `sweep --gate` are deleted. No fallback: a harness without a session-end hook relies on `SessionStart` surfacing the leftovers.

## Decision files, narrowed

Kept, as the owner described them at the start of this session: longer context for a durable call that already lives in `AGENTS.md`, `README.md`, `ARCHITECTURE.md` or a `CONTEXT.md`, where that context would pollute the doc.

Current trigger: "the user agrees to a call in chat, outside a planning session → `new-decision`". That turns every chat agreement into a file. New trigger: a decision file exists only as a footnote to a read-path rule whose reasoning would bloat that doc and is likely to be asked about again. Never for something a plan, an item or a deviation already covers, never for normal implementation. A call agreed in chat goes into the active plan, or straight into the read-path doc it changes. The decision template gets a `Linked from:` line naming that doc.

## Records are written to be read by anyone

The owner's repos are public on a personal account and double as a portfolio, and private notes get shared too. Every record, shared or private, keeps a professional tone. The owner may talk in frustration, swear or hold a controversial view in chat. The record keeps the substance in neutral wording, not the venting. No self-deprecation, no blame: a mistake is recorded as what happened, the fix and the rule that came out of it. Not stiff either: light humour and personality are fine where they read well to a stranger. Forward only; existing content is not re-audited, since it was reviewed at commit time. Applies to plans, items, decisions, `CONTEXT.md`, `ARCHITECTURE.md` and code comments.

## Compatibility during migration

The other seven repos keep their old layout until each is migrated. The script and the viewer read both old and new locations (`archive/` and `archived-items/`, `plans/implemented/` and `plans/archived-plans/`, `plans/decision-history/` and `plans/archived-decisions/`) and write only to the new ones. `check` reports old-layout paths as a single advisory line ("old layout, migrate when convenient"), not one finding per file. Repos without `items.yaml` stay a no-op for hooks and `check`, as now.

## Script changes

- `close-plan <file>`: sets `Status: done`, moves to `plans/archived-plans/`. Warns, does not refuse, when `Fold-out` is missing or empty. A `Fold-out` of "none: <reason>" is valid.
- `new-plan`: template status starts at `draft`.
- `new-decision` writes to `plans/archived-decisions/`, keeping `NNN`. No `index.md`; `new-decision` stops writing one and `check` stops validating it. `flush` stops writing `archive/index.md` too.
- `flush` writes to `_architecture/archived-items/`. `find`, `show`, `list --archived` read both locations.
- `check` adds three advisory findings: decision files no read-path doc links, open plans whose status says done, files in `plans/` root that are not plans. Plus the one-line old-layout notice.
- `sweep`: drop `--gate`. `RECORD_RE` excludes `archived-*`, so moving a file into an archive does not count as recording work.
- `hooks`: `HOOK_SCRIPTS.gate` and the `found.gate` checks removed, so a config without `Stop` is reported as complete. `SessionEnd` added to what it checks.
- Every hardcoded old path: header usage text, `cmdFind`, `cmdFlush`, the `cmdCheck` decision block, `new-decision`. Remove the dangling `// Design:` comment on line 3.
- Viewer `scripts/viewer/server.js`: read both archive locations, `layerSig` included.

## Doc changes

Every file below that names `plans/decision-history`, `plans/implemented`, `archive/` or the end-of-turn gate gets updated. Found by grep; re-grep before closing.

- `SKILL.md`: lead with the tier model, the plan-versus-item table and the lifecycle. The routing and trigger tables follow and point into them. Replace "call agreed in chat → decision". Relax the hand-edit rule. Cut the "end of turn → sweep" trigger row and "hooks check at the end of a turn". Add the tone rule as a general rule, not under "Shared or private".
- `assets/templates/plan-session.md`: rewritten, not renamed. Sections `Context`, design sections, `Deliverables` (progress allowed here), `Fold-out`, `Implementation deviations`. `Status:` starts at `draft`; draft → ready → in progress → done is a convention, not enforced. The comment saying running status belongs in the store is removed.
- `assets/templates/decision-record.md`: `Linked from:` line.
- `references/file-formats.md`, `store-format.md` (granularity, hand-edit allowance, consolidation), `pipeline.md`, `operations.md`, `flush-prompt.md`, `viewer.md`: paths and rules.
- `references/legacy-migration.md`: migration stays agent-driven, no `migrate` command. Add `plans/decision-history/`, `plans/decisions/`, `plans/implemented/`, `archive/` → their `archived-*` folders, checking each plan's status rather than trusting its folder.
- `references/hooks.md`, `hooks/config/*.json` (including the `//blocking` comments), `hooks/rehydrate.sh` text: new wiring, "Do not read `archived-*` unless a doc links the file or the user asks", hand-edit sentence.
- Global `AGENTS.md` (`toolboxes/my-global-setup/.agents/AGENTS.md`, the paper-trail section): replace the decision-history, "Never read `archive/`" and "its `index.md` exists so you can decide" lines with the `archived-` naming rule, add the suggest-a-plan default and the read-path rule. Short; the skill holds the detail.
- This repo's `AGENTS.md` and `ARCHITECTURE.md`: `_architecture/` layout description.

## Applying to the live machine

Tracked copies change first. Then, as a separate step the owner confirms: copy global `AGENTS.md` to `~/.agents/AGENTS.md` and `~/.claude/CLAUDE.md`, copy the skill to `~/.agents/skills/`, and re-merge the hook config into `~/.claude/settings.json` (removing `Stop`, adding `SessionEnd`). Until the settings re-merge, the old gate keeps firing against the new skill.

The `jookoi-ai-market` plugin copy is updated after kx3n Finish skill sync cleanup: copy-only, no links lands, using `utility-scripts/copy-skill.js`. Not before, so the two copy mechanisms don't diverge.

## Migration

This repo first, as part of this plan. The other seven are each a separate pass, run when the owner next works in that repo, using the updated legacy migration. Not done inline here.

- Dev-stack: fold-out audit, then archive the five built plans and the v2 store spec (already graduated into `references/store-format.md`). Move `plans/implemented/` and `archive/items-*.yaml` to the new folders. Delete decision 016 per the existing fold rule. Audit 003, 014, 015, survivors to `plans/archived-decisions/` with a link from their rule's home doc. Consolidate items. Remove the stray `_architecture/_jookoi-persoal-notes` (directory) and `_architecture/_jookoi-personal-notes` (0-byte file) after checking both are empty. `2026-10-09-skill-sync-copy-only.md` stays open.
- Other repos: a parked item per repo listing what the audit found.

## Open questions

None. Resolved 09-10-2026: archives sit inside the context they archive; the `Stop` gate is dropped with no fallback; decision files are kept, narrowed.

## Deliverables

1. [x] Skill docs and templates, per Doc changes. Built, pending owner review.
2. [x] Script and viewer, per Script changes and Compatibility. Built, smoke-tested with `check`, `list`, `sweep`, `hooks`, `find`.
3. [x] Hooks: configs, `rehydrate.sh`, delete `doc-gate.sh`, `hooks.md`. Built. `SessionEnd` verified for all three harnesses.
4. [x] Global `AGENTS.md` and this repo's `AGENTS.md` and `ARCHITECTURE.md`. Built.
5. [x] This repo's migration, item consolidation, parked items for the other seven repos. Done.
6. [ ] Live machine and plugin copy, per Applying to the live machine, with owner confirmation. Not started, out of scope for this pass.

## Fold-out

- Tier model, plan-versus-item, lifecycle, `archived-` naming → `SKILL.md` (detail), global `AGENTS.md` (suggest-a-plan default, read-path rule, naming rule).
- Tone rule for all records → `SKILL.md`, one line in global `AGENTS.md`'s paper-trail section.
- Hook wiring → `references/hooks.md`.
- `_architecture/` layout → this repo's `ARCHITECTURE.md` and `AGENTS.md`.

## Implementation deviations

- **`SessionEnd` on all three harnesses.** Docs checked 10-2026 via ctx7: Gemini CLI lists `hooks.SessionEnd`, Copilot CLI lists `sessionEnd` (once per interactive session). So `preserve.sh` is bound to `SessionEnd` in all three configs, not only in `claude-code.json`. The Copilot config binds `preserve.sh` to `sessionEnd` only, since it has no compaction event.
- **`hooks` checks `sessionEnd` as optional.** A config with `rehydrate.sh` but no `SessionEnd` entry counts as complete for the missing-hooks message, and prints one separate optional line. The plan said a config without `Stop` is reported as complete, and `SessionEnd` is "added to what it checks". Treating it as optional avoids flagging every existing install as broken.
- **`rehydrate.sh` runs `sweep` for the shared layer only.** The private layer is covered because `sweep` already compares against both layers' store writes.
- **`sweep` still reports missing hooks.** Only the `gate` job was removed from the check. `found.rehydrate` alone decides.
- **`check` advisories do not run in repos without `items.yaml`.** This keeps those repos a no-op, as the compatibility section requires. The decision-section checks still run everywhere, as before.
- **`close-plan` rewrites the whole `Session:` line's `Status:` text.** The status text after `Status:` on that line is replaced with `done.` (one line, no other edit). Older plans that had a longer status sentence lost it, with the relevant detail moved to a new `## Fold-out` section in each archived plan. `2026-09-01-jookoi-doc-full-skill` had no `Session:` line, so one was added (`Status: built`) before closing.
- **Decision 015 kept without a link.** Its rule (self-triggering skills carry event-triggered descriptions) is not stated in `jookoi-create-skill/SKILL.md`, whose current text says to keep descriptions minimal. It sits in `plans/archived-decisions/` with a `Linked from:` note naming the doc where the rule belongs, and `check` reports it as unlinked. Needs an owner call: fold the rule into `jookoi-create-skill`, or delete the file.
- **Decision 003 kept** as rationale for the plain-files-plus-git choice in `ARCHITECTURE.md` ("The memory system"), now linked from there. The crash-course topic docs that cite it were repointed.
- **Seed folder renamed.** `my-repo-setup/_architecture/plans/decision-history/` became `archived-decisions/`, and its README and ARCHITECTURE template text follow.
- **Item consolidation went further than sibling merges.** The store went from 65 items to 46, then gained seven parked migration items (53). Merges: the three README and AGENTS polish items, the three graphify location items, the v2 build and seven follow-ups, the viewer trio, the five trial-round enforcement items, the two migration-verification items, and the two scaffolding-script items. `check` passes.
- **Archived-plan fold-out sections.** Each archived plan got a short `## Fold-out` pointing at the read-path docs that hold its outcome, since the script warns when the section is missing. The v2 store spec has no `Session:` line and was moved by hand.
- Skill review (10-10-2026): description rewritten to trigger on plan lifecycle events (start, approve, finish, archive), since the old one only named recording events. Duplicate sentence and third hand-edit mention removed from `SKILL.md`. Plan-mode and tone wording made author- and harness-neutral.
- Decision 015 kept and linked from `jookoi-create-skill/SKILL.md`, whose description guidance now says: one or two sentences by default, trigger-rich only for skills that must fire on their own. `check` now counts tracked `SKILL.md` files as read-path docs, since a rule can live in a skill.
- **Stop hook brought back as a once-per-session reminder** (owner call, 10-10-2026). `SessionEnd` runs during shutdown and cannot prompt the agent, so dropping `Stop` removed the only pre-finish reminder. New `nudge.sh` on `Stop`/`AfterAgent`: fires at most once per session, only when this session changed 8+ files without a record (`JOOKOI_NUDGE_MIN_FILES`) or an open plan looks finished (status done, or all Deliverables ticked). `rehydrate.sh` marks the session start so earlier leftovers do not count. `sweep` and `check` report finished-looking plans too, so `SessionStart` picks up what the reminder missed. Script command `nudge`, docs in `references/hooks.md`.
- **Templates loosened, examples added** (owner call, 10-10-2026). Plan, decision and CONTEXT templates are now short skeletons whose headings are suggestions, each with a one-line comment pointing at the new `references/examples.md` (worked item, plan, decision and CONTEXT.md, plus a tone example). Decision template trimmed to Problem, Decision, Why not the alternatives. `check` no longer requires decision sections, only flags a missing `Linked from:` line as advisory. The "all four CONTEXT sections stay" rule is gone.
