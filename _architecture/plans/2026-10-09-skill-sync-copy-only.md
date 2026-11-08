# Skill sync is copy-only from an indexed source

Session: 09-10-2026 22:52. Status: build steps 5 to 14 and 16 to 18 implemented; step 13 passed on the user's run; step 15 partly done, with the copy runs and the final check still to do.

## Context

`sync:skill` (`utility-scripts/sync-skill.js`) chose a canonical copy per skill: the marketplace when the skill existed there, otherwise this repo. It copied the marketplace into `toolboxes/my-global-setup`, then symlinked `~/.agents/skills` and `~/.claude/skills` to that canonical copy. Direction was unclear, overwrites were silent, and some harnesses do not follow symlinks. The symlink approach has proven too inefficient and is dropped everywhere.

Intended outcome: one interactive command that copies real files. The user picks a source, the skills, and the destinations, reviews a plan, and confirms. Each copy replaces the destination skill folder in full, so files the source no longer has are removed too. Nothing global is canonical, and no symlinks or junctions are created by any script, skill or rule in this repo.

Tracked as store item kx3n Finish skill sync cleanup: copy-only, no links.

## Locations

The script does not scan the disk. It reads a local index file, `_jookoi-skill-locations.json` at the repo root. The `_jookoi-` prefix keeps it gitignored, because it holds local paths. Adding a location means adding an entry to that file, by hand or by asking the assistant. The script has no add command in this build.

Index format:

```json
{
  "sources": [
    { "label": "developer-stack/global", "path": "D:/repos/Serenity/JooKoi-developer-stack/toolboxes/my-global-setup/.agents/skills" },
    { "label": "developer-stack/repo", "path": "D:/repos/Serenity/JooKoi-developer-stack/my-repo-setup/.agents/skills" },
    { "label": "ai-market/jookoi-dev", "path": "D:/repos/Serenity/jookoi-ai-market/plugins/jookoi-dev/skills" }
  ],
  "destinations": [
    { "label": "developer-stack/repo", "path": "D:/repos/Serenity/JooKoi-developer-stack/my-repo-setup/.agents/skills" }
  ],
  "global": ["~/.agents/skills", "~/.claude/skills"]
}
```

- A skill folder is a folder with a `SKILL.md`. Only the skills folder's direct children are read.
- Organizational folders such as `angular/.agents/skills` are added as their own source entries. The folder path is the type. No type registry.
- `global` is the only personal global scope. It holds exactly the two home folders above. Other harness folders are not global targets.
- An entry whose path does not exist is shown as a warning in step 1 and is not offered.

## Interaction flow

```
copy:skill
├─ 1 Source        select: indexed sources
├─ 2 Skills        multiselect, type to filter; collision hint per skill
├─ 3 Destinations  multiselect, none preselected: indexed destinations | global
├─ 4 Plan          one line per skill x destination folder: status and path
│                  statuses: new | same (skipped) | differs | replace link | blocked
└─ 5 Confirm       default No. Shows copies and how many existing folders are replaced in full
   ├─ yes  → execute
   └─ no or Ctrl+C → exit; nothing has been written
```

- `global` expands to `~/.agents/skills` and `~/.claude/skills`. Choosing it writes the same skill to both, one plan row each.
- A name present in more than one source is allowed. The skill prompt marks it `also in <labels>`. A copy never merges sources: the destination gets the copy of the source picked in that run.
- A destination is never the source of the same run. The picked source is removed from the destination list.
- `same`: every file in source and destination is byte-identical, and the destination has no extra files. Skipped.
- `differs`: a file differs, or the destination has files the source does not. Replaced in full.
- `blocked`: the destination path exists and is a file, or it is a folder that cannot be read. The copy is not attempted.
- `replace link`: the destination is a junction or symlink. It is unlinked, never followed, then replaced by real files.
- A source with no skills stops at step 2 with a message.
- One source per run. To copy from another source, run again.

## Lifecycle

1. **Read phase (steps 1 to 4).** Index read, comparison and status. No writes.
2. **Write phase (step 5, yes).** For each copy: stage the whole source skill folder into `<dest>.copy-tmp`, remove the old destination (a junction or symlink is unlinked, never followed), rename the staged folder into place. Because the old folder is removed as a whole, files the source no longer has do not survive. A failed stage leaves the old destination untouched and removes the staged folder.
3. **Result.** One line per copy, `ok` or the error. Exit code 1 if any copy failed. Successful copies are not rolled back.
4. **Test switch.** `--dry-run` prints the read phase and exits. It exists for testing the build, not as a user feature.

## Build order

Every step that touches `copy-skill.js` is verified against throwaway folders under the session scratchpad, never against `~/.agents/skills` or `~/.claude/skills`, until step 15.

### Done

1. Rewire `package.json`: `sync:skill` becomes `copy:skill`. Done.
2. Update the `copy:skill` description in `utility-scripts/npm-help.js`. Done.
3. Delete `utility-scripts/sync-skill.js`. Done.
4. First draft of `utility-scripts/copy-skill.js` with source, skills, destinations, plan and confirm prompts. Written and passes `node --check`. It does not match this design: discovery is fixed-path, the write is not staged or full-folder, there is no `blocked` status, and there is no `global` target. Steps 5 to 11 close the gap.

### copy-skill.js to design

5. **Staged write.** Implemented. The swap is tested in a scratch run. The failed-stage case is not tested. Today `removeDest` runs before `cpSync`, so a failed copy deletes the destination. Replace with the staged write in Lifecycle step 2.
   Verify: in a scratch destination holding a skill with a known file, make the stage fail (a source file locked open or unreadable). Confirm the old destination is byte-identical afterwards and no `.copy-tmp` folder remains. Then run a normal copy and confirm the destination matches the source and exit code is 0. A run with one failing copy exits 1.
6. **No links reach a destination.** Implemented. Tested: a file symlink in the source arrives as a real file. `cpSync` copies symlinks inside the source as links. Pass `dereference: true` so link targets are copied as real files.
   Verify: put a junction or file symlink inside a scratch source skill, copy it, and confirm with `Get-ChildItem -Force | Where-Object LinkType` that the destination has no link entries and the linked content is present as real files.
7. **`blocked` status.** Implemented. Tested through the status function: a file in the way returns `blocked`. The scratch `--dry-run` run is not done. `statusOf` calls `listFiles` on a destination that is a file, which throws `ENOTDIR` before the plan is shown. Check `lstat` first. A file returns `blocked`, and a folder whose read throws returns `blocked`. Blocked rows are shown and excluded from the write set.
   Verify: create a file named like a skill in a scratch destination, run `--dry-run`, and confirm the plan prints `blocked` for that row and the run does not throw.
8. **Index-based locations.** Implemented. `_jookoi-skill-locations.json` created with three sources, three destinations and the `global` pair, gitignored by the `_jookoi-*` rule. The index read is not run interactively. Remove `skillRootsInRepo` and `findRepoSkillRoots`. Read `_jookoi-skill-locations.json` from the repo root. Warn and skip entries whose path does not exist. Add the collision hint to step 2. Create the index file with the current known locations listed above, and add it to `.gitignore` coverage (the existing `_jookoi-*` rule should already cover it; confirm with `git check-ignore`).
   Verify: `--dry-run` lists exactly the indexed sources. A missing path prints a warning and is not offered. A skill present in two sources shows `also in <label>`.
9. **Windows path comparison.** Implemented as `samePath`, used at every comparison. The "Other folder..." prompt is gone under the index design, so the verify case no longer occurs; `samePath` is tested directly for case-insensitivity. Four comparisons are case-sensitive: the source filter on the destination list, the destination dedupe `findIndex`, the `Set` dedupe of picked destinations, and the `src === dest` guard. Add one `samePath(a, b)` helper that compares `path.resolve` results lowercased on `win32`, and use it at all four places.
   Verify: in a scratch index, add a destination equal to the source in different case. Confirm the row is dropped and the source folder is unchanged.
10. **Full-folder replace.** Implemented. Tested: an extra destination file is removed and the destination equals the source. Make `statusOf` return `differs` when the destination holds files the source lacks, and make the write phase remove them (Lifecycle step 2).
    Verify: in a scratch destination add an extra file that is not in the source. Run a copy. Confirm the extra file is gone and the destination equals the source.
11. **`global` target.** Implemented: the option expands to both home folders. Not run interactively. Expand `global` into `~/.agents/skills` and `~/.claude/skills`, one plan row per skill per folder.
    Verify: with the `global` destination and a scratch skill, `--dry-run` shows two rows. Run a copy against scratch stand-ins for the two folders set in a scratch index, and confirm both receive the same files.
12. **`--dry-run` test switch.** Implemented. Not run: it needs the interactive prompts. Runs the read phase and prints the plan, then exits 0 without the confirm prompt.
    Verify: run with `--dry-run` against a scratch destination and confirm no files or `.copy-tmp` folders were created.
13. **Interactive run.** Open. The user runs `npm run copy:skill` by hand against a scratch destination through all five steps: once answering No, once Yes, once Ctrl+C at step 5.
    Verify: No and Ctrl+C leave the scratch destination unchanged. Yes produces the copies listed in the plan. The user runs this step, not the assistant.

### Symlink removal

14. **Remove the link script.** Implemented. `link-skill-folders.ps1` deleted, `setup:skills:link` removed from `package.json`. Delete `utility-scripts/link-skill-folders.ps1` and the `setup:skills:link` entry in `package.json`. `npm-help.js` has no entry for it.
    Verify: a search for `link-skill-folders` and `setup:skills:link` outside `_architecture/` returns nothing, and `npm run` no longer lists `setup:skills:link`.
15. **Unlink broken links and convert live links to real copies.** Partly done: broken links unlinked (step a), and `~/.agents/skills` added to the index as a source (step c). Live links still to convert, by copy runs the user makes (steps b, c and d below). Part of the implementation, not a separate decision. A read-only listing on 09-10-2026 found:
    - `~/.agents/skills`: 15 link entries. Live: `frontend-design`, `jookoi-vault`, `jookoi-vault-triage` (into `JooKoi-developer-stack/toolboxes/my-global-setup/.agents/skills`), `jookoi-agents-md-expert`, `jookoi-create-skill`, `jookoi-write-like-a-person` (into `jookoi-ai-market/plugins/jookoi-dev/skills`). Broken, target missing: `animate`, `animation-vocabulary`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `review-animations`, `corporate-assistant`, `jookoi-brain-api`, `jookoi-brain-mcp`.
    - `~/.claude/skills`: 97 link entries. 81 live junctions into `~/.agents/skills`. 4 live links into repos: `jookoi-agents-md-expert`, `jookoi-create-skill` (marketplace), `jookoi-vault`, `jookoi-vault-triage` (`toolboxes/my-global-setup`). 12 broken: `angular-component`, `angular-routing`, `angular-signals`, `animate`, `animation-vocabulary`, `find-animation-opportunities`, `improve-animations`, `jookoi-casual-writer`, `jookoi-note`, `mobile-native`, `review-animations`, `using-superpowers`.
    
    Live state at the start of the run differed from the 09-10-2026 snapshot. `~/.agents/skills` had 5 live links, 9 broken, 88 real folders. `~/.claude/skills` had 84 live links, 12 broken, 11 real folders. Step a removed the 21 broken links: the 9 in `~/.agents/skills` (including `corporate-assistant`, `jookoi-brain-api`, `jookoi-brain-mcp`, which pointed into `jookoi-corporate-env-personal-assistant`) and the 12 in `~/.claude/skills`. No live link was touched.

    Order:
    a. Unlink the broken entries in both folders. Unlink only, never follow. Done.
    Copy runs, in this order. Each is one `npm run copy:skill` session, run by the user:
    b1. Source `developer-stack/toolboxes/my-global-setup`, skills `frontend-design`, `jookoi-vault`, `jookoi-vault-triage`, destination `global`. Converts their links in both home folders.
    b2. Source `jookoi-ai-market/jookoi-dev`, skill `jookoi-write-like-a-person`, destination `global`. Converts its link in `~/.agents/skills`, and the link in `~/.claude/skills` that points into it.
    b3. Source `developer-stack/toolboxes/my-global-setup`, skill `jookoi-create-skill`, destinations `jookoi-ai-market/jookoi-dev` and `global`. The marketplace copy is the one the links point at. It differs from the repo copy only in `SKILL.md` and the deleted `scripts/sync_personal_skill.py`, so this run replaces it. The marketplace folder then shows as modified in its own git repo, for the user to commit there.
    c. Source `home/.agents` (`~/.agents/skills`), all skills that are now real folders, destination `global`. The filter removes `~/.agents/skills` from the destinations, so only `~/.claude/skills` is written. This replaces the 81 junctions there. It also adds any skill that `~/.claude/skills` does not have yet; the plan shows those as `new`.
    d. Verify with the re-list. No link entries should remain in either folder.
    
    Verify: rerun `Get-ChildItem -Force | Where-Object LinkType` on both folders and confirm it returns nothing. Spot-check that a converted skill's `SKILL.md` matches its source.
16. **Rewrite the README section.** Implemented. "Copying skills" replaces the SIM section; line 11 changed. In `toolboxes/my-global-setup/README.md`, replace the whole "SIM pattern for toolchains" section (lines 27 to 50): the canonical and mirror wording, the source/integration/mirror list, the `link-skill-folders.ps1` and `setup:skills:link` blocks, and the closing line about the old `.agents -> .claude` idea. The new section describes `npm run copy:skill`, the five-step flow, the index file, the `global` target, and that copies are real files with no canonical global copy. Line 11 ("mirrored from ~/.agents/skills/") uses the same mirror wording and changes in the same edit.
    Verify: the README has no occurrence of `symlink`, `link-skill`, `mirror` or `canonical` in reference to skills.
17. **Strip linking and distribution logic from `jookoi-create-skill`.** Implemented. `scripts/sync_personal_skill.py` deleted. The skill now writes to the named folder. Propagation to the home folders waits for step 15. The user's call: the skill is general, for anyone, and it does not link, copy to targets, or name a canonical source. Linking is requested by the user after a skill is written, through `copy:skill`. In `toolboxes/my-global-setup/.agents/skills/jookoi-create-skill/`:
    - `SKILL.md`: remove the target-folder list, the "Prefer directory symlinks" paragraph, the canonical-source configuration paragraph, the personal/global scope bullet that names a canonical source and mirrors, and the step that runs `scripts/sync_personal_skill.py`. The skill creates the skill folder in the directory the user names, and reports where it wrote it.
    - `scripts/sync_personal_skill.py`: delete. Its only job is the marketplace copy and the directory symlinks. Remove any reference to it in the folder.
    - Keep the scope rules that choose a repository location versus a named directory. Drop the marketplace and plugin wording that only makes sense for this machine.
    Verify: a search of the skill folder for `symlink`, `os.symlink`, `sync_personal_skill`, `canonical`, `mirror` and `marketplace` returns nothing. The skill still validates with the skill-creator validator, and `copy:skill` can copy the folder as is.
18. **Remove the skill-install rule from the global `AGENTS.md`.** Implemented. The section and its config block are deleted from `toolboxes/my-global-setup/.agents/AGENTS.md`. The live `~/.agents/AGENTS.md` still needs copying from the tracked file, by the user. The user's call: the whole rule goes, not reworded. `toolboxes/my-global-setup/.agents/AGENTS.md` lines 126 to 135, the paragraph "When creating a personal or reusable skill..." including its `Shared skill source` / `Personal global skill directory` / `Optional host directory` / `Tracked setup mirrors` config block and the "Prefer symlinks" sentence, is deleted. No replacement text. The rule is not restated anywhere else in that file. The live `~/.agents/AGENTS.md` is updated from the tracked copy by the user, not by the assistant.
    Verify: `toolboxes/my-global-setup/.agents/AGENTS.md` contains no `symlink`, no `Shared skill source`, and no `Tracked setup mirrors`. The user confirms the live copy matches.
19. Move this plan to `plans/implemented/` unchanged once steps 5 to 18 are closed. Open.

## Implementation deviations

- Built without a plan. The request was for implementation, and the plan should have come first. This plan was written after the first draft of the code. Steps 1 to 4 record what was done, not what was agreed in advance.
- A decision record was written to `plans/decision-history/` and then removed. That was wrong: the call belongs to this plan, not to decision history. The decision-history index line was removed too.
- The historical plan `_architecture/plans/implemented/2026-09-24-remove-todo-md-route-by-information-type.md` still names `sync-skill.js`. Left as is: implemented plans are records.
- An earlier version of this plan marked the first `copy-skill.js` step as done while the code did not match the design. Step 4 now records what the draft is, and steps 5 to 13 carry the remaining work.
- Directory scanning was replaced by the index file. The user's call: the script reads a local index, and the index is maintained by hand or on request.
- Replacement is a full-folder sync, not a file merge. The user's call: skills drop reference files the source no longer has, so the destination folder must match the source exactly.
- Dry run is a test switch, not a user feature. The user's call.
- Symlinks and junctions are removed from all scripts, skills and rules, not only from `copy-skill.js`.
- Steps 5 to 11 were checked against scratch folders through a copy of the helper functions. The script starts its prompts when loaded, so it cannot be imported. The scratch test is not in the repo. Interactive checks are left to step 13.
- `sync_personal_skill.py` was deleted instead of rewritten, since its only job was the marketplace copy and the links. The user's call, step 17.

## Open questions

1. **Name collisions.** Copy only the source picked in that run. Recommended default, not yet confirmed by the user. Needed before step 8.
2. **Index file tracking.** Keep `_jookoi-skill-locations.json` gitignored, since it holds local paths. Recommended default. Needed before step 8.
