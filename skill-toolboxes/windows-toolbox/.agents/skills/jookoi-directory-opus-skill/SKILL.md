---
name: jookoi-directory-opus-skill
description: Use when the user asks whether or how Directory Opus (DOpus, Opus) can do something, or wants it configured, customized or scripted, such as toolbars, buttons, hotkeys, folder formats, rename, file types, evaluator or script add-ins.
compatibility: Windows with Directory Opus 13. Helper script needs only built-in Windows PowerShell 5.1.
metadata:
  version: 0.1.0
  written-against: Directory Opus 13 manual 2026-01-23, tested on 13.11
---

# Directory Opus 13

Help a person configure and extend Directory Opus. Translate what they see and say into DOpus concepts, say whether and how it can be done, explain it, ask, then apply it safely on a yes.

## Local paths

Edit these if the install is non-standard. Leave `auto` to detect.

```
program: auto    # default C:\Program Files\GPSoftware\Directory Opus (dopus.exe, dopusrt.exe), also read from registry App Paths
config:  auto    # default %APPDATA%\GPSoftware\Directory Opus  (= /dopusdata)
backups: auto    # default %LOCALAPPDATA%\jookoi-directory-opus-skill\backups
```

The helper takes the same values as `-ProgramDir`, `-ConfigDir` or env `DOPUS_PROGRAM_DIR`, `DOPUS_CONFIG_DIR`, `DOPUS_BACKUP_DIR`.

## Running the helper (PowerShell only)

`scripts/dopus.ps1` is a PowerShell script. It cannot run from bash, cmd or by its name alone. Always start the command with `powershell`:

```
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill>\scripts\dopus.ps1" <action> [options]
```

- `<skill>` is the folder that holds this `SKILL.md`. Give `-File` a Windows path with backslashes.
- From Git Bash or WSL on Windows: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w <skill>/scripts/dopus.ps1)" <action>` (WSL: `wslpath -w`).
- Where this skill writes `dopus.ps1 <action>`, it means this full command.
- Run it with no action (or `help`) to print every action and option. It never prompts. Errors go to stderr with exit code 1, data to stdout.
- No PowerShell available (the helper is Windows-only): use `grep -rn -i "<words>" references/` and read the matching entry only.

## First call in a session

```
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill>\scripts\dopus.ps1" info
```

Returns program dir, version, running state, config dir. If program or config is null, ask whether DOpus is installed and where (portable installs and shared-config mode live elsewhere). DOpus is Windows-only. Remember the version: answers depend on it.

When the user invokes the skill generally ("what can this skill do?", "help me set up or optimize Opus") or asks for workflow suggestions, run `dopus.ps1 audit` and load `references/onboarding-and-optimization.md`. Print only its short opening screen (Setup Wizard, Optimization Wizard, Ask or Build Directly). Never dump internal script flags or KB counts on the opening screen, run each wizard screen as one question popup (`AskUserQuestion` / `ask_question`) copied from that file's spec with no chat table, mark `(Recommended)` only per its recommendation rule, and apply wizard selections in one pass via `dopus.ps1 apply-wizard -ConfigFile <json>`.

## Request pipeline

1. **Triage.** How-to config, build a command/button/script, not possible natively, bug or crash, third-party or Windows conflict, shell integration (Win+E, desktop double-click, Open/Save dialogs), licensing/install. Not every question is a config question. Bugs get no invented fix. See `references/limits-and-triage.md`.
2. **Translate.** User words to the DOpus name ("address bar" = Location field in the location bar, "split view" = dual display, "preview" = viewer pane). Load `references/ui-map.md` whenever the user describes the screen. Two things on screen can look alike (the icon inside the Location field vs the Location Bar icon): check the row for the exact one before answering.
3. **Mechanism.** Pick the least powerful thing that works, in this order: a Preferences option, a folder format, an internal command on a button or hotkey, an evaluator expression, a script. Staff answers on the official forum follow this order.
4. **Change.** The exact setting path, command line, button XML or script.
5. **Explain, then ask.** Tell the user what is possible, how to do it by hand, and what you would change. This is their review. Ask "Want me to implement this?" and act only on an explicit yes.
6. **Apply.** Back up first, apply through the safest route, then tell the user how to check it and how to revert. See Apply rules.

## Mental model

| Object | What it is | Configured in |
|---|---|---|
| Lister | A main window. Holds file display(s), folder tree, toolbars, panes, tabs | Layouts, styles, Default Lister |
| File display | The file list. One or two per Lister (dual display: source and destination) | Folder formats, Preferences / File Displays |
| Folder format | View mode, columns, sort, group, filters for a folder or class of folders | Folder Options, Preferences / Folders / Folder Formats |
| Toolbar | Toolbars and menus are the same thing: a list of buttons. Includes the context menus | Customize mode, `Buttons\*.dop` |
| Button | Label/icon plus one or more functions (left/right/middle click) | Customize, button XML |
| Function | One or more command lines: internal commands, external programs, `@script`, MS-DOS batch | Command editor |
| Internal command | `Set`, `Go`, `Copy`, `Rename`, `Select`, `Prefs`, `Toolbar`… with arguments | `references/commands.md` |
| Codes | `{filepath}`-style codes in command lines, status bar, info tips | `references/codes.md` |
| Evaluator | v13 expression language for columns, labels, filters, button state, rename | `references/evaluator.md` |
| Hotkey | Key bound to a function. Lister, global (system-wide), tree, viewer | Customize / Keys |
| File type | Per-type actions, context menu items, info tips | File Types dialog |
| Script add-in | `.js`/`.vbs` in `Script AddIns`. Adds commands, columns, events | `references/scripting.md` |
| Layout / Style | Layout = saved set of Listers. Style = saved arrangement applied to the current Lister | Preferences / Layouts and Styles |

## Where to look

All paths in this skill are relative to the skill folder (`references/...`, `scripts/...`). A bare `dopus.ps1` means `scripts/dopus.ps1`. Files in `references/` do not need loading through each other: everything they point to is listed in this table.

| Topic | File |
|---|---|
| Screen parts, user wording, toggle commands | `references/ui-map.md` |
| Toolbars, buttons, menus, hotkeys, user commands, button XML, sharing | `references/customize.md` |
| File types, context menus, double-click actions, info tips | `references/file-types.md` |
| Why a folder looks like it does, making views stick | `references/folder-formats.md` |
| Which Preferences page controls what | `references/preferences-map.md` |
| Rename, regex, presets, metadata in names | `references/rename.md` |
| Codes for command lines, status bar, info tips, wildcards | `references/codes.md` |
| Evaluator expressions and functions | `references/evaluator.md` |
| Scripts, add-ins, events, object model, debugging | `references/scripting.md` |
| Internal command arguments (grep `## <Command>` or the argument name) | `references/commands.md` |
| Config files, apply routes, backup, running commands from outside | `references/config-files.md` |
| Triage, v13 changes, limits, companion tools | `references/limits-and-triage.md` |
| Writing click-by-click steps, exact menu and Preferences labels | `references/ui-instructions.md` |
| Any feature, Preferences page or option not covered above: about 340 distilled manual entries (where it is, exact labels, control types, defaults, gotchas). Search with `dopus.ps1 kb -Query "<words>"`. Entry format: `references/kb/README.md`. Never read an area file whole | the area files in the table below |
| Initial setup wizard, usage history audit, live telemetry optimization | `references/onboarding-and-optimization.md` |


Knowledge base area files (`references/kb/`), each starts with a contents list:

| File | Covers |
|---|---|
| `references/kb/01-concepts-navigation.md` | Lister, Default Lister, tree, location bar, favorites, aliases, paired folders, tabs |
| `references/kb/02-views-toolbars-panes.md` | view modes, dual display, toolbars, FAYT, panes, layouts, styles, themes, selection commands |
| `references/kb/03-selection-filter-find.md` | selection, checkbox mode, Filter Bar, quick search, Find Files |
| `references/kb/04-sorting-formats-virtual-folders.md` | sort, group, columns, folder formats, Flat View, collections, libraries, archives |
| `references/kb/05-fileops-rename.md` | copy, drag and drop, queues, replace dialog, Synchronize, delete, rename |
| `references/kb/06-rename-archives-metadata-filters.md` | rename options, archives, undo, attributes, labels, metadata, filters, UAC |
| `references/kb/07-ftp-viewer-tools.md` | FTP, standalone viewer, image tools, duplicates, links, floating toolbars |
| `references/kb/08-prefs-appearance-displays.md` | Preferences: dialog, colors, fonts, file displays, columns, display modes |
| `references/kb/09-prefs-fileoperations.md` | Preferences: File Operations |
| `references/kb/10-prefs-filter-folders-tabs-tree-paths.md` | Preferences: filtering, folders, tabs, tree, favorites/aliases, labels |
| `references/kb/11-prefs-launching-layouts-locationbar.md` | Preferences: Launching Opus, Layouts and Styles, Location Bar |
| `references/kb/12-prefs-misc-advanced-toolbars-viewer-archives.md` | Preferences: Miscellaneous incl. every Advanced option, Toolbars, Viewer, Archives |
| `references/kb/13-customize-buttons-fields.md` | Customize dialog, button kinds, field buttons |
| `references/kb/14-commands-editor-filetypes.md` | command editor, argument syntax, File Types |
| `references/kb/15-scripting-development.md` | script kinds, add-ins, dialogs, examples |
| `references/kb/16-evaluator-and-patterns.md` | evaluator language and contexts, wildcards, regex |
| `references/kb/17-statusbar-codes.md` | status bar codes |
| `references/kb/18-control-codes-modifiers.md` | `{codes}` and `@modifiers` |

Load one or two files per question. Files over ~150 lines (`references/commands.md`, `references/customize.md`, `references/codes.md`, `references/scripting.md`, `references/evaluator.md`, `references/rename.md`): `grep -n '^## ' <file>`, then read only the section. `references/commands.md`: grep it, never read it whole.

## Lookup order

The skill is the first source of truth. The web is the last resort.

1. The routed reference file, section only.
2. **Knowledge base:** `dopus.ps1 kb -Query "<words>"` returns the best matching entries from `references/kb/` (feature, UI path, exact option labels with control type, commands, gotchas). Use the user's words and DOpus words, fewer words if nothing matches. Read only the entries returned. Labels in kb come from the manual, confirm them with step 4 before quoting.
3. **Grep all of `references/`** for the user's words and the DOpus synonyms (`references/ui-map.md` rows, command names, option text). The routing may be what failed, not the content.
4. **Install lookup:** `dopus.ps1 ui -Query ...` (menu and toolbar labels and paths), `dopus.ps1 prefs -Query ...` (Preferences page and option text), or read the user's own `Buttons\*.dop`.
5. Only then the web: fetch the page (docs.dopus.com manual, resource.dopus.com for bugs). A search-engine summary is not verification. Check the result against the installed version, mark it `[unverified]` until checked, and tell the user it was a skill gap so it can be added.

Forum tutorials often predate v13: confirm every command and option exists before relying on it.

Never describe what a click, icon or dialog does from memory. If no reference and not the install shows it, say so or ask the user to look.

## Apply rules

- **Back up first:** `dopus.ps1 backup -Label <what>`. Prints the backup folder.
- **Watch for dialogs.** Opus reports errors and prompts only as modal dialogs. `cmd` exits 2 and prints the dialog text when one opens. Then stop, tell the user what it says, and dismiss it with `dopus.ps1 dialogs -Close` (Abort or Cancel) or let them answer it. Never continue while a dialog is open. Run `dialogs` once before the first change in a session.
- **Live routes (Opus running):**
  - internal commands: `dopus.ps1 cmd -Command "<line>"`. A line with double quotes (`Toolbar NAME="File Display" RELOAD`) loses them through `powershell -File`: write the line to a temp file and use `-CommandFile <file>`. Never call `dopusrt.exe` directly. Always pass `,quiet` / `=force,quiet,toolbars,formats` on persistence commands (`Set SAVEFORMAT=all,replace,quiet`, `Prefs SETLISTERDEFAULTS=force,quiet,toolbars,formats`, `Toolbar SETDEFAULT=quiet`) so interactive dialogs do not open.
  - script add-ins: install with `install-script` (they auto-load and hot-reload, run their commands with `cmd`)
  - new toolbar files: write `.dop`, then `Toolbar NAME=… STATE=…`
  - single buttons: hand the user XML to paste in Customize mode, or place them on `Buttons\Favorites Bar.dop` during an offline XML cycle
- **Wizard & multi-file offline route (`dopus.ps1 apply-wizard -ConfigFile <json>`):** Backs up config, stops Opus, edits `prefs.oxc`, `default.off`, `contenttype.off`, `foldercolors.oxc`, `favorites.ofv`, `Favorites Bar.dop`, `foldertoolbars.xml`, and `lister_hotkeys.oxc` offline, restarts Opus, and runs silent persistence commands in ~5 seconds.
- **Offline route** (hotkeys, file types, Preferences, editing an existing toolbar's XML): only with the user's OK. Run `dopus.ps1 stop` (graceful, never kill the process), back up, edit, then `dopus.ps1 start`. Keep UTF-8 BOM, tab indentation and CRLF line endings.
- **Prefer file-level edits or telling the user the Preferences path.** Open the page with `Prefs PAGE=…` or point to its path. To learn which file a dialog change touched, run `backup`, have the user change it, then run `diff -From <backup>`.
- **After applying:** say what changed, how to see it, and how to revert: `dopus.ps1 restore -From <backup> [-File <relative path>]`, or the inverse command.
- **Never:** use GUI automation (`SendKeys`, `mouse_event`, coordinate clicking), kill `dopus.exe`, edit a toolbar that is open in Customize mode, run a full restore while Opus runs, or install third-party scripts without reading them and explaining what they do.

Details and tested behavior: `references/config-files.md`.

## Answer shape

Lead with yes/no/partly and the DOpus name of the feature. Then the manual steps, then the exact command/XML/script. Mark anything unverified. State a version gate when the feature needs a newer 13.x than installed. Offer to implement.

Manual steps are read by a tired person. Start from something visible on screen, put the location and the action on separate lines, use exact on-screen labels from the install lookup, and explain a DOpus word (Lister, Default Lister) at first use. These are guidelines, adapt them to the question. See `references/ui-instructions.md`.
