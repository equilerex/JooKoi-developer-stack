# Paper-trail v2.1: remove TODO.md, YAML store, decision-history

Session: 24-09-2026. Status: done 24-09-2026. Decision sweep ran first, the build followed. Amends decision 7 of `2026-09-19-paper-trail-v2-keyed-store-todo-backlog-decisions-decision-l.md`, which kept `TODO.md` as a `## Context` header.

Read this file top to bottom before touching anything. It is the full spec.

## Goal

Make the `jookoi-paper-trail` skill ready for a trial in other repos. The trial replaces the old markdown-file approach in one or two working repos, not this whole repository. Three changes are bundled because they touch the same files, so doing them separately means rewriting the same docs twice.

1. **Remove `TODO.md`.** Each kind of information has one home (table below).
2. **Move the working set from `items.json` to YAML**, with random repo-prefixed IDs and monthly archive files.
3. **Demote decision files** to background history under a less authoritative folder name, and stop agents reading them proactively.

| Information | Home |
|---|---|
| Work item (now, parked, done, dropped) | `items.yaml`, script only |
| A call made inside a planning session | that plan, `plans/YYYY-MM-DD-topic.md` |
| A call made outside a planning session | `plans/decision-history/NNN-slug.md` |
| Finished planning session | `plans/implemented/` |
| Durable facts about the repo | `ARCHITECTURE.md` |
| Rules agents follow every session | repo `AGENTS.md` |
| Folder-local context | `CONTEXT.md` |

## Rules for this work

- **Never show a bare ID to the user.** Every user-facing mention of an item is `id title`, for example "k4f9 Migrate the store to YAML". This covers the agent's replies, script output, hook output and the docs. The user cannot act on "start t041" without cross-referencing. It goes into `SKILL.md` and both `AGENTS.md` files.
- Never run `git commit` or `git push`. The user commits.
- No changelog wording in live docs ("changed X because Y"). Reasoning lives in this plan.
- Mechanics belong to the script, judgement to the model. Unchanged.

## What is already done (uncommitted in the working tree)

- Script: `TODO.md` check removed from `check`. Hooks: `rehydrate.sh` and `doc-gate.sh` no longer read `TODO.md`. `assets/templates/todo.md` deleted.
- `SKILL.md` and `references/{store-format,flush-prompt,hooks,operations,pipeline,file-formats}.md` cleaned of `TODO.md`. `SKILL.md` gained the `AGENTS.md` routing row.
- `_architecture/ARCHITECTURE.md`: layout and memory-system sections rewritten without `TODO.md`. New "Dependencies" section. The graphify two-mechanisms paragraph moved there.
- `_architecture/TODO.md` and `my-repo-setup/_architecture/TODO.md` deleted.
- Decision 009 deleted. Its content is in `ARCHITECTURE.md` § Dependencies. Inbound links in `README.md`, `ai-tooling-crash-course-for-developers/topic-index.md` and decision 014 repointed.
- Running skill copies (`~/.agents/skills/jookoi-paper-trail`, marketplace copy) still hold the old skill. The repo source is ahead of them until the sync step.

## Decisions

Problems that prompted them:
1. JSON has no multi-line strings, so markdown bodies are arrays of quoted, escaped lines. Authors can't copy text in or out, and items read as a task list instead of a scratchpad. Rich text is the preferred use.
2. IDs come from a global counter (`next_id`). That breaks across parallel repos and branches and doesn't suit backlog and todo sharing one system.
3. Agents read every file in `plans/decisions/`. The name and the "don't relitigate" framing read as a rule set, but a decision is background on why a rule exists. The rule lives in `ARCHITECTURE.md`, `AGENTS.md` or `CONTEXT.md`.
4. The old decision 009 was misread as "no dependencies". The intent was: conservative about binaries (blocked on corporate machines), intentional about everything else.

Decided:
- **Format.** YAML with `|` block scalars. Plans, decisions, `CONTEXT.md`, `ARCHITECTURE.md` stay markdown. Rejected: JSON5 (still no multi-line string), a markdown file per item (thousands of files), TOML (no better than YAML here).
- **Files.** `items.yaml` is the active set (now, parked, and done or dropped items not yet flushed). `archive/items-YYYY-MM.yaml` holds flushed items, one file per month by `ts_done`. Existing `archive/YYYY-MM.md` files from the old format stay and remain searchable. Everything is a plain file that a script, a viewer or a human can read.
- **Flush.** Unflushed items load into every session. Flushed items are lookup-only and reading them is explicit and bounded: `list --archived --last N`, newest first. `find` and `show` resolve archived IDs so references never dead-end. Flush stays model judgement, at a stable point after which older items are unlikely to matter next session.
- **IDs.** Short random base36, git-style, no counter, collision-checked against the active file and every archive file. Existing `t001` to `t044` stay valid since an ID is an opaque string. Cross-repo references and exports carry the repo prefix (`stack:k4f9`), so an item stays traceable once it lives in the Obsidian vault. The prefix is a `repo:` key in the `items.yaml` header, written once when the file is created (default: the repo root's leaf folder name, lowercased) and never derived again. Deriving it from the folder on every run would give a worktree or a clone in a differently named folder a different prefix, and the prefix check would refuse valid IDs.
- **Authoring.** `add` and `edit` take an object payload (`title`, `body`, `status`, placement) from stdin or `--file`. The payload is YAML, which also accepts JSON, so no extra parser. `add --title "..."` remains for a title-only item.
- **Decision files.** A call made inside a planning session goes in that plan, not a separate file. Decision files are for calls made outside one. The folder is renamed `plans/decision-history/`. Agents do not read it proactively and open a file only when a doc cites it or the user asks why. A generated `index.md` gives one line per decision. A decision already reflected in `ARCHITECTURE.md` or `AGENTS.md` is folded in and deleted, with inbound links fixed. The decision template currently says a decision is never deleted, which contradicts this and must change.
- **Dependencies.** Minimal and intentional (see `ARCHITECTURE.md`). A YAML library is a plain-JS dependency and is allowed.
- **Migration is agent-driven, not scripted.** Few repos run the old system and each holds little history. A reference file tells the agent what goes where, the user approves, the agent applies. No `migrate` command. This repo's `items.json` conversion is a one-off `node -e` using the vendored library.

## Design details

### Item schema

```yaml
repo: stack
last_flush: 2026-09-19T08:00:00Z
items:
  k4f9:
    title: Walk-up root resolution for non-git folders
    status: now            # now | parked | done | dropped
    priority: 2000         # sparse number, lower first, unchanged from v2
    body: |
      Free-form markdown. Quotes, "double" and 'single', need no escaping.

      ## Sections and code blocks are fine

      ```js
      console.log("hello");
      ```
    ts_created: 2026-09-19T08:00:00Z
    ts_started: null
    ts_done: null
    ts_touched: 2026-09-19T08:00:00Z
```

- `next_id` is gone. `content` (array of lines) becomes `title` plus `body`: `title = content[0]`, `body = content.slice(1)` with one leading `""` dropped if present, joined with `\n`. `t035`, `t036` and `t037` have no blank line after the title, so a rule that expects one loses their bodies. Migration must round-trip every item.
- Timestamps stay full ISO 8601 UTC in the file (prose docs keep `DD-MM-YYYY HH:MM`).
- **YAML gotchas to design for.**
  - Some libraries turn an unquoted ISO timestamp into a `Date`. `js-yaml` 5 loads with `CORE_SCHEMA` by default, which has no timestamp type, so this is handled. Dump must use the same schema (see Library).
  - An ID like `1e5`, `true`, `null` or `0123` parses as a number, boolean or null. Generated IDs match `^[a-z][a-z0-9]*[0-9][a-z0-9]*$` (start with a letter, contain a digit). Legacy `t001` already fits.
  - Bodies with leading spaces, tabs, trailing spaces, a `---` line, or lines that look like YAML must survive a round trip. The library may fall back to a quoted string for some of these. The round-trip test (below) decides what is acceptable.

### Commands

Unchanged names: `list`, `find`, `show`, `count`, `render`, `add`, `done`, `park`, `start`, `drop`, `edit`, `move`, `flush`, `stale`, `check`, `new-decision`, `new-plan`. Changes:
- `list` default: `now` items plus the 3 latest done (unchanged). New `list --archived [--last N]` reads archive files newest first, capped.
- `add` / `edit`: payload from stdin (`add -`) or `--file`, or `--title` for title-only. Under PowerShell heredocs differ, so `--file` is the portable path.
- ID input accepts the bare ID, the legacy `t017` and `t17` forms, and `repo:id`. A prefix that does not match the `repo:` header is refused with the repo name it belongs to.
- **Every message that names an item prints `id title`.** Today's "t040 added (now)" becomes "k4f9 added (now): Migrate the store to YAML". `render` and any export print the repo prefix.
- `flush`: writes `archive/items-YYYY-MM.yaml`, removes items from `items.yaml`, sets `last_flush`. Refuses on an ID collision. The concurrent-writer compare in `saveStore` stays.
- `find`: searches active, all `archive/items-*.yaml`, and the old `archive/*.md`.
- `check`: validates `items.yaml` and archive files. When `decision-history/` exists, checks that `index.md` has one line per file and no line for a missing file.
- `new-decision`: path becomes `plans/decision-history/`, appends to `index.md`.

### Hooks

- `rehydrate.sh`: look for `items.yaml` instead of `items.json`. Output stays short: the `list` result plus pointers (`show <id>` for a body, `list --archived --last N` for older, `find` before adding, never hand-edit `items.yaml`, do not read `plans/decision-history/` unless a doc cites it or the user asks why). It injects no rules content.
- `doc-gate.sh`: the "already modified" test greps for `items\.yaml`.
- `README.md:63` claims the `TODO.md` Context header re-injects load-bearing rules after compaction. That mechanism is gone. New wording: standing rules live in `AGENTS.md`, which the harness reloads, and `rehydrate.sh` points the agent to `list` and lets it ask for older context. Verify the harness claim before writing it.

### Library

Needs a YAML library in the Node script. Node has no built-in one. Checked against the npm registry on 24-09-2026:

| | `js-yaml` | `yaml` (eemeli) |
|---|---|---|
| Version, last publish | 5.4.2, 13-09-2026 | 2.9.1, 11-09-2026 |
| Weekly downloads | about 222M | about 150M |
| License, repo | MIT, `nodeca/js-yaml` | ISC, `eemeli/yaml` |
| Dist layout | Single-file `dist/js-yaml.cjs.js` (136 kB) for Node, `dist/browser/js-yaml.umd.min.js` (62 kB) for browsers | 233 files in the package, multi-file `dist/` |
| Comments preserved | No | Yes |

Choice: `js-yaml`, vendored as the single CJS file in `scripts/vendor/` with its `LICENSE` and version noted. The store is script-written, so a hand-added comment is not expected to survive. The alternative is an install step in the setup script. The viewer is a browser page and loads the library from a CDN first, with a manual local or global override if a machine ever blocks it.

Confirmed from the 5.4.2 ESM bundle (`https://cdn.jsdelivr.net/npm/js-yaml@5.4.2/+esm`, built from `dist/js-yaml.mjs`): no imports, so `argparse` only serves the CLI. Exports `load`, `dump`, `CORE_SCHEMA`, `JSON_SCHEMA`, `YAML11_SCHEMA`, `DUMP_SCHEMA`. `load` defaults to `CORE_SCHEMA` (no timestamp type). `dump` defaults to `lineWidth: 80`, `noRefs: false`, `schema: DUMP_SCHEMA`, which has a timestamp type and so quotes ISO strings.

Dump with `{ schema: CORE_SCHEMA, lineWidth: -1, noRefs: true }` so dump matches load and long lines are never folded. Folded or double-quoted output round-trips but reads like the JSON arrays this change removes. Still to check at step 1: `dist/js-yaml.cjs.js` runs standalone under `require`, and `lineWidth: -1` still means no wrapping in v5.

### Decision-history rename

The files are moved by the decision sweep, which runs before this build (prerequisite in the header). That sweep also moves survivors to `plans/decision-history/`, writes `index.md`, repoints inbound links and updates the path in `AGENTS.md`, `ARCHITECTURE.md` and `README.md`. Until the build lands, `check` validates the old `plans/decisions/` path and `new-decision` writes there.

This build changes what reads and writes the folder: script paths in `check` and `new-decision`, the decision template (drop "never deleted"), `SKILL.md`, `references/file-formats.md`, and the `rehydrate.sh` pointer. If the sweep has not run, stop and run it first.

### Legacy migration

A new reference, `references/legacy-migration.md`, tells an agent how to bring a repo on the old system over to this one. Agent-driven with user approval, no support scripts (see Decisions). Sections:

- **Decisions:** the sweep prompt below, adapted to reference-file form.
- **`TODO.md`, `BACKLOG.md`, checklists:** `find` each entry, then `add` whatever is still live (`--status=parked` for backlog), fold standing context into `AGENTS.md` or `ARCHITECTURE.md`, and delete the files once the user approves.
- **`items.json` (v2 store):** convert to `items.yaml` using the rules under Item schema, and verify field by field.
- **Stale context files:** fix every mention of the old layout.

This repo's decision sweep runs before the build, using this prompt as written:

````markdown
# Decision sweep and relocation

Clean up this repo's decision records. Most should not survive as files. A decision records *why* a rule exists. The rule itself belongs in a live doc. Survivors move to `plans/decision-history/`, which agents do not read unless a doc cites it or the user asks why.

Never run `git commit`, `git push`, `git add` or `git mv`. The user stages and commits.

## 1. Locate

Find every decision folder in the repo. Check `_architecture/plans/decisions/`, `_jookoi-architecture/plans/decisions/`, and any other ADR-style folder (`docs/adr/`, `decisions/`, numbered `NNN-*.md` files). If you find none, stop and report. If the layout is ambiguous, ask before continuing.

Treat each layer separately. Content from a `_jookoi-` (private) layer is promoted only into private docs, never into shared ones.

## 2. Read the live docs

Read the docs a decision's content could already live in: `ARCHITECTURE.md`, the repo `AGENTS.md`/`CLAUDE.md`, `CONTEXT.md` files, the files under `plans/`, and any skill or reference docs the repo owns. Do not read `archive/`.

## 3. Classify (read-only)

Read each decision file in full. Assign it one class:

| Class | Meaning | Action |
|---|---|---|
| Integrated | The rule or fact is already stated in a live doc | Delete |
| Promote | Durable content not yet in any live doc | Move its essence into the right live doc, then delete |
| In a plan | The call and its reasoning are already recorded in a plan file | Delete, keep the plan |
| Redundant | Superseded, obsolete, or too trivial to matter | Delete |
| Keep | Non-obvious reasoning held nowhere else and likely to be asked about. Records of rejected options usually land here, since a rejected option leaves no trace in the live docs. | Move to `decision-history/` |

For each file, grep the whole repo for inbound links, including `archive/`, but only as grep hits. Also search the working-set store for mentions, using the paper-trail script's `find`.

Present one table and **stop**:

| # | Title | Class | Evidence (file:line where the content already lives) | Proposed action (Promote: target doc + section) | Inbound links |

Promote rows show the exact text you would add. Do nothing else until the user approves or changes each row.

## 4. Apply the approved rows

- **Promote:** write the essence as a present-tense fact or rule, with no changelog wording ("changed X because Y", "as of", "previously"). Place it in the section where it belongs. Don't append it at the end.
- **Before deleting a file:** repoint each inbound link to the live doc or plan that now holds the content. In `archive/` and historical plans, change only the link target and leave the prose alone. If no sensible target exists, remove the link and keep the text.
- **Store items** that mention a decision path: change them only through the script's `edit`. Never hand-edit the store.
- **Delete** the file.

## 5. Relocate the survivors

- Move the Keep files to `<layer>/plans/decision-history/`. Keep their filenames and numbers, and don't renumber (gaps are fine).
- Repoint every inbound link to the new path.
- Remove the old folder once it is empty.
- Write `decision-history/index.md`:

  ```markdown
  # Decision history

  Background on why rules exist. Not rules. Open a file only when a doc cites it or the user asks why.

  - [NNN Title](NNN-slug.md): one line on what it explains.
  ```

- In the live docs (`AGENTS.md`, `ARCHITECTURE.md`, README), update any mention of the old folder path. If a doc frames decisions as rules to follow ("don't relitigate", "read the decisions"), reword it to match the index header above.

## 6. Report

- The applied table (final class per file).
- The files edited for Promote, with section names.
- The links repointed, as file:line.
- Any references intentionally left in place, and why.
- Store items touched, written as `id title`, never a bare ID.
- A grep result for the old folder path. Expect hits only where you left them on purpose.
````

## Build order

0. **Prerequisite, own session: decision sweep.** Run the prompt in § Legacy migration and apply the rows the user approves. The build assumes `plans/decision-history/` and `index.md` exist.
1. **Vendor the library.** Add `dist/js-yaml.cjs.js` 5.4.2 to `scripts/vendor/` with its `LICENSE` and version noted. Confirm it loads standalone under `require` and that `lineWidth: -1` disables wrapping.
2. **Script.** Store load and save in YAML with the dump options from Library, `repo:` header, ID generation and normalization, `add`/`edit` payloads, `list --archived`, `flush` and `find` over YAML archives, titled output, `check` (validates `index.md` against the folder's files, only when `decision-history/` exists), `new-decision` path, `index.md` append. Keep `--dry-run`.
3. **Migration.** One-off `node -e` with the vendored library: convert `_architecture/items.json` to `items.yaml` using the title/body rule under Item schema, and set `repo: stack`. Verify every field of every item against the source. Convert any `archive/items-*.json`, then remove `items.json`.
4. **Hooks.** `rehydrate.sh`, `doc-gate.sh`, `hooks.md`.
5. **Skill docs.** `SKILL.md` (routing row for decisions, new-decision note, bare-ID rule), `references/store-format.md`, `file-formats.md`, `operations.md`, `pipeline.md` (the manual fallback no longer applies to hand-editing JSON, rewrite it), `flush-prompt.md`, templates (decision template drops "never deleted"), new `references/legacy-migration.md` (§ Legacy migration).
6. **Close the covering items.** Mark `t035` (decision lifecycle and `index.md`), `t036` (promote before archiving) and `t037` (refresh pre-store docs) done once steps 5 and 7 cover them, or drop them with a pointer to this plan.
7. **Repo docs.** `AGENTS.md` (lines 9 and 15 are stale, and the retirement history of `TODO-LIST.md` and friends breaks the no-changelog rule), `README.md` (lines 62, 124, 136), `jookoi-paper-trail.md` (still describes v1 with `TODO.md`, `BACKLOG.md` and flush snapshots, needs a rewrite), `ARCHITECTURE.md` (line 30 layout bullet names `items.json`, plus any remaining `BACKLOG.md` mention), `my-repo-setup/README.md`, `my-repo-setup/` seed files, `my-global-setup/.agents/AGENTS.md` (line 94, plus the decision-history and bare-ID rules), `jookoi-note/SKILL.md` (routes to dead `BACKLOG.md` and the `TODO.md` checklist), `.graphifyignore` and the graphify setup snippet (ignore `items.yaml` and `archive/`).
8. **Verify** (below).
9. **Sync out.** `~/.agents/skills/jookoi-paper-trail`, and the marketplace copy `jookoi-ai-market/plugins/jookoi-dev/skills/jookoi-paper-trail`. `~/.claude/skills/...` symlinks to `~/.agents`. This repo is the development source for this skill because it holds the context of the whole stack. The marketplace copy is refreshed from here when the skill is finished, then `~/.agents` is synced. That is a temporary arrangement. `utility-scripts/sync-skill.js` treats the marketplace as canonical once the skill exists there and would overwrite this repo's copy, so do not run it for this skill until the finished version has been copied to the marketplace. After syncing, grep the installed copies and the hook wiring in `~/.claude/settings.json` for `TODO.md` and `items.json`. A SessionStart hook still tells agents to "fold anything still relevant into TODO.md", and it is not the repo's `rehydrate.sh`.
10. **Move this plan** to `plans/implemented/` once its status says done.

## Verification

- Round-trip test on bodies containing: double and single quotes, backticks and code fences, leading spaces, tabs, trailing whitespace, blank lines, a `---` line, a `key: value` line, `|` and `>` at line start, unicode, an empty body. Write then read must return the exact string. A plain multi-line body and a title longer than 80 characters must also be written unfolded, the body as a `|` block.
- Migration check: item count equal, and per item title, body, status, priority and all four timestamps equal to the JSON source, including `t035` to `t037` (no blank line after the title).
- `check` passes here and in a scratch repo. `list`, `add` (stdin, `--file`, `--title`), `done`, `flush`, `list --archived --last 3`, `find` and `show` on an archived ID all work in the scratch repo.
- `sh -n` on all hooks. Run the hooks against a scratch repo and confirm output.
- Grep the live skill and docs for `items.json`, `next_id`, `TODO.md`, `BACKLOG.md`, `plans/decisions` and expect only historical plan files.
- Every script message that names an item includes the title.

## Trial criteria

Decide before the trial that it passes only if, in a real working repo over a few weeks:
- The agent uses the skill without prompting and nobody hand-edits `items.yaml`.
- Session start context stays small (the `list` output, not the archive).
- Agents do not read `plans/decision-history/` unprompted.
- Notes stay readable to the author, including long rich-text items.
- Total time spent fixing the system is lower than the old markdown approach cost.

## Open points for the reviewer

- Whether `check` should flag likely-duplicate decisions. A mechanical rule is hard (a decision is often still linked after its content is integrated), so the current plan leaves it to model judgement in a reference file, not a script warning.
- What `rehydrate.sh` injects after compaction, and whether the harness reloading `AGENTS.md` is enough. Confirm for Claude Code, Gemini CLI and Copilot CLI.
- Whether `items.yaml` conflicts across machines in one vault environment need more than the existing conflict report.

## Parked, not part of this build

- Local viewer over `items.yaml` and `archive/*.yaml` (search, filter, view, LLM-friendly copy).
- Obsidian export: a script rendering YAML items to markdown into the vault.
- Verify the migration in the first real adopting repo.

## Implementation deviations

- The vendored `js-yaml` file was copied in by the user, since the auto-mode classifier blocked the agent's copy. Version 5.4.2 confirmed from its header.
- `check` requires `decision-history/index.md` only when a decision file exists, and flags the placeholder summary `new-decision` writes.
- `flush` compares `items.yaml` against what it read before writing any archive file.
- Cross-platform pass, not in the plan: templates read as LF, section checks accept CRLF, printed paths use forward slashes, `new-decision` keeps the index's line endings, hooks call the script through a shell function so a path with spaces works.
- The README claim that the harness reloads `AGENTS.md` after compaction was dropped as unverified. Tracked as j5o6 Verify what survives compaction on Gemini CLI and Copilot CLI.
- Not done: the `my-repo-setup` seed `AGENTS.md` gets no paper-trail rules, and `BACKLOG.md` mentions remain in `stack-distribution.md` and crash-course topic docs (sm71 Fix remaining BACKLOG.md mentions in stack-distribution.md and crash-course topic docs).
- The agent-driven legacy migration was not exercised, since this repo had no legacy state left after the one-off `items.json` conversion (v75r Verify the legacy migration in the first real adopting repo).
- Skill sync to `~/.agents` and the marketplace was done by the user. Both copies carry a shortened frontmatter description that still names `TODO.md`.
