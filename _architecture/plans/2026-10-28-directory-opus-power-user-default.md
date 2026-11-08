# Directory Opus: one power-user default

Session: 28-10-2026 21:25. Status: in progress.

## Context

The skill's Setup Wizard offers three layout profiles (Explorer-like, Commander, Photos and video) plus a custom route. Test run on 28-10-2026: the result was layouts with opinions about panel placement and little else. What makes Directory Opus worth using is the tooling: toolbar buttons, shortcuts, column and sort toggles, colour cues. The profiles did not deliver that.

Calls made by the user in chat:

- Replace the profile picker with one opinionated power-user default. No profiles, no custom route, no extra configuration questions.
- Stop calling it a wizard. The opening screen offers "set up a power-user default", with the other two entries (Optimization Wizard, Ask or Build Directly) left as they are.
- Content comes from the user's own pain points (focus is hard to see, toolbars full of dead buttons, rigid columns, batch work needing external tools), the earlier column-preset dropdown, and forum scripts the user has already collected.

Source material: the Gemini conversation the user pasted on 28-10-2026. It is opinion, not evidence. Every button, hotkey and command it names must be checked against `references/` and `kb` before use (skill evidence bar).

## The default (proposal, to review)

Layout: folder tree on the left, two file displays, side by side. One toggle button flips to stacked. Standard row spacing.

Toolbar, kept short, one `Favorites Bar`:

- Flatten toggle, with a Group by type toggle beside it
- Column presets dropdown and Extra Columns toggle (already built)
- Advanced Rename
- Copy Path menu (full, slashes, name)
- Terminal Here, Smart Paste, Sync Panes
- Select by pattern dropdown
- Find Files
- App buttons for installed apps
- One View mode dropdown instead of separate view icons

Removed from stock toolbars: standalone view-mode icons, Print or Export listing, the Windows search box, New Lister and Close Lister buttons. Back, Forward and Up stay unless the user says otherwise.

Focus visibility: high-contrast active tab and header colours so the source pane is obvious, plus a hotkey to switch panes if the stock one is not enough.

Folder views: Downloads newest first, photo and video folders switch view automatically, file-type colours, fresh-file colours. Pins and staging triage still come from usage history.

Keep from before: type to filter, double-click empty space goes up, Smart Paste hotkey, instant sizes with Everything.

## Research so far (local only)

Sources: the skill's own `references/` and `kb`, which already carry forum-derived notes. No raw forum scrape exists in the repo, the vault or `D:\repos\Serenity`. Web research on the forum goes through cowork (standing rule), so the live-forum pass is a separate step, see deliverable 1.

Selection test for "out of the box": a first-time user understands the button from its label, it saves clicks daily, and it needs no external tool or niche file type.

Verified in the skill references (command exists on 13.11):

- Flat View toggle: `Set FLATVIEW=toggle`, also `mixed`, `grouped`, `keepformat` (`commands.md:689`).
- Group by: `Set GROUPBY=<column>|toggle|off|grouplist` (`commands.md:707`). `grouplist` gives a menu of columns, so one button can offer type, date and size.
- Select by pattern: `Select PATTERN=…` (`commands.md:601`).
- Quick filter flags such as flat view on, regex on (`commands.md:748`).
- Active-pane cue: Preferences colours have selection opacity for `Inactive file display` and `Inactive folder tree`, and the tree can highlight the active path (`kb/08`, `kb/01`). Tab colour: `Set Tab Color`. Clicking the status bar swaps source and destination.
- Context menu cleanup recipe (`file-types.md:128`): block heavy shell extensions, hide Windows items, group them under a `More` sub-menu, Shift+right-click still shows everything. Fits the "bloated right-click menu" pain point and needs no script.
- Rename: forum presets (`.orp`) import in the Rename dialog. The built-in regex covers bracket stripping and extension handling (`rename.md:229`, `rename.md:329`). Forum scripts "Add a Unique Number while renaming" and "Script to perform multiple Regular Expressions" fill real gaps but are scripts: read before shipping.

Tiers for the default:

- Core, on the bar: Flatten toggle, Group by menu, Advanced Rename, Copy Path menu, Terminal Here, Select by pattern, Find Files, Columns presets and toggle, Smart Paste, app buttons, Sync Panes.
- Core, no button: context menu cleanup, active-pane contrast, file-type and fresh-file colours, type to filter, Downloads newest first.
- Optional extras, not in the default: ExifTool and MediaInfo columns, Ctrl+drop image convert, right-drag softlink (needs admin), Beyond Compare on overwrite. Each is niche or needs an external tool.

## Deliverables

1. Research pass. For each proposed item, confirm the command or setting exists in Opus 13.11 and note where (`dopus.ps1 kb`, `commands.md`, `customize.md`). Read any forum script before including it, per skill rules. Drop what cannot be verified.
2. `profiles/power-user.json` replaces `base.json`, `explorer.json`, `commander.json`, `media.json`, `keep.json`.
3. `dopus.ps1`: new apply keys for the buttons, hotkeys and active-pane colours that `apply-wizard` does not handle yet. `profile-config` and `restore-original` keep working.
4. `SKILL.md` and `references/onboarding-and-optimization.md`: new opening screen, delete the profile screen, custom route and profile-switching text. Keep Optimization Wizard and Ask or Build.
5. Test on a reset Opus: apply, check each item on screen, run `restore-original`.
6. Sync both skill copies (`.agents` and `.claude`) as copies, per `kx3n Finish skill sync cleanup: copy-only, no links`.

## Decisions (28-10-2026)

- Telemetry is not offered or mentioned in the default (the skill may be shared). `telemetry-on` and `telemetry-off` stay for anyone who asks. The only prompt left is the Apply confirmation, because Opus restarts.
- Back, Forward and Up buttons stay.
- Re-applying only adds. The default never removes a button it did not create.
- Stock buttons are not edited one by one. `cleanTopToolbar` (verified key) hides the stock `Operations` toolbar and the curated set lives on `Favorites Bar`. This replaces the "removed from stock toolbars" list above.
- Smart Paste keeps `Ctrl+Shift+V` and loses its bar button. A "Paste as file" right-click entry is added only if the live `Buttons\` file for that menu can be identified for certain, otherwise dropped.
- Active-pane contrast and context-menu cleanup have no verified config key. Each ships as a printed manual step under `skipped`, unless the user sets the option once and `diff` reveals the key.
- Pins and staging triage are left to the Optimization Wizard (they depend on usage history).
- `explorerReplacement` and `middleClickNewTab` stay optional manual steps. No system-wide change in a shared default.
- The live forum pass (cowork) is a parked item. The build uses what is verified locally.

## Fold-out

- `SKILL.md`: opening screen and request pipeline text.
- `references/onboarding-and-optimization.md`: default description replaces profile section.
- A `CONTEXT.md` in `toolboxes/windows-toolbox` if the apply keys need explaining.

## Implementation deviations

Built 28-10-2026 in `toolboxes/windows-toolbox/.agents/skills/jookoi-directory-opus-skill/`. `.claude/skills` is a symlink to `.agents/skills`, so there was one copy to edit. Not yet applied to a live Opus (needs the user's go, Opus restarts).

- Bar buttons added: Flatten, Group By, Select (menu buttons) and Batch Rename. Command syntax comes from `commands.md` (`Set FLATVIEW=toggle,mixednofolders`, `Set GROUPBY=<column>,toggle`, `Select`, `Rename ADVANCED`). The bare `Select` call opening the Select dialog is taken from the manual's description and not yet tested on screen.
- Find Files left off the bar: `Ctrl+F` already covers it.
- `cleanTopToolbar` is false, not true as first decided. The `Operations` toolbar holds basic buttons (copy, delete, new folder) a first-time user expects. Hiding it can be a later opt-in.
- `tree` is `single` (one tree on the left, as the user described), not `dual`.
- "Paste as file" right-click entry dropped: right-click menus live in file type config, not `Buttons\`, and no identified file was certain. `Ctrl+Shift+V` stays.
- Smart Paste bar button code removed from `dopus.ps1`. A Smart Paste button created by an earlier run stays on the bar.
- `profile-config` takes no profile argument (only `power-user` is accepted), and no longer adds pins or staging triage.
- Active-pane contrast and context-menu cleanup not implemented (no verified key). Described as unsupported in the onboarding doc.
