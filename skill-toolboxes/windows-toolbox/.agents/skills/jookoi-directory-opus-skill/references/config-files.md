# Config storage, backup, safe apply

Opus holds its config in memory and writes files on Apply/OK, when a Customize session ends, and on exit. An external edit to a file Opus currently has loaded can be lost or overwritten. Never kill `dopus.exe` (manual: config may be left unsaved or corrupted). Exit via File / Exit Directory Opus, or `dopusrt /acmd Close PROGRAM`.

## Where things live

`/dopusdata` = `%APPDATA%\GPSoftware\Directory Opus` (roaming config). `/dopuslocaldata` = `%LOCALAPPDATA%\GPSoftware\Directory Opus` (caches, state data). Type the alias into the Location field to open the folder. Shared-config mode moves config to a machine-wide location (Preferences menu / Change configuration mode).

| Path under /dopuslocaldata | Holds |
|---|---|
| `State Data\openlisters.oll` | Automatic backup of open Listers (session restore). `<lister_layout flags="1" />` with no children means nothing to restore |
| `State Data\prefs_search_cache.osd` | Preferences page and option labels, version-exact. Do not read it whole (54 KB): use `dopus.ps1 prefs -Query` |
| `State Data\*.osd` (others) | Dialog and window state, MRU lists. Opus-managed, leave alone |
| `Thumbnail Cache\`, `Icon Cache\`, `Help Cache\` | Binary caches. Never enumerate recursively (huge output) |

| Path under /dopusdata | Holds | Format |
|---|---|---|
| `Buttons\*.dop` | One toolbar each (incl. the 5 defaults: Menu, Operations, Favorites Bar, File Display, Images) | XML `<toolbar><buttons><button>…<function type="normal"><instruction>` |
| `Buttons\Menus\*.dop` | Context menus, tray menu, zip/FTP menus (listed in `ConfigFiles\menus.oxc`) | same as toolbars |
| `ConfigFiles\toolbars.oxc` | Default toolbar set: which `.dop` open where (`type="top"`…) | XML |
| `ConfigFiles\prefs.oxc` | Most Preferences options (`<flags>`, `<fayt defaultmode="%fayt_filter">`, `<dblclk><bg_commands>`) | XML (edit while Opus is stopped, or via `dopus.ps1 apply-wizard`) |
| `ConfigFiles\foldercolors.oxc`, `colorgroups.oxc` | Filter / Evaluator label assignments (`<path type="16"><filter><eval>`) and color group GUIDs | XML |
| `ConfigFiles\lister_hotkeys.oxc` | Lister hotkeys | XML `<key hotkey="ctrl+num+"><function>…` |
| `ConfigFiles\global_hotkeys.oxc` | System-wide hotkeys (work with no Lister open) | XML, same shape |
| `ConfigFiles\tree_hotkeys.oxc`, `viewer_hotkeys.oxc` | Folder tree / standalone viewer hotkeys | XML |
| `ConfigFiles\favorites.ofv`, `smartfav.osf` | Favorites (`<folder label="Favorites Bar"><path label="..."><dir><pathstring>...</pathstring></dir></path>`), SmartFavorites | XML |
| `ConfigFiles\foldertoolbars.xml` | Toolbars that auto-open for folders (`<entry pos="0" set="no" subfolders="yes" toolbar="Name" type="folder"><pathstring>...</pathstring></entry>`) or view modes | XML |
| `ConfigFiles\scriptaddins.oxc` | Script add-in id map and disabled list (Opus-managed) | XML |
| `FileTypes\*.oxr`, `FileTypes\Groups\` | File type actions, context menu entries, info tip/tile definitions | XML registry redirect |
| `Formats\*.off` | Saved folder formats | XML |
| `ListerStyles\*.osy`, `Layouts\` | Styles, saved layouts | XML |
| `Rename Presets\*.orp` | Rename presets | XML `<rename_preset type="normal|regexp|…"><from>*</from><to>*</to>` |
| `Toolbar Sets\*.ots` | Toolbar sets | XML |
| `UserCommands\` | User-defined commands (callable like internal commands) | XML |
| `Script AddIns\*.js|*.vbs|*.opusscriptinstall` | Script add-ins | script text |
| `Collections\*.col` | File collections | XML |

[tested 13.11] file names and shapes above. Meanings of files not listed: open them read-only before assuming.

## Apply routes, safest first

| Change | Route | Live? |
|---|---|---|
| Full Setup / Optimization Wizard bundle | `dopus.ps1 apply-wizard -ConfigFile <json>` (backs up, stops Opus, edits XML files offline, restarts, runs silent persistence commands) | ~5 s automated cycle |
| Lister state (panes, view mode, columns, sort, filters) | `dopusrt /acmd Set …` / `Go …` / `Toolbar …` | yes, immediate, persist silently via `Set SAVEFORMAT=all,replace,quiet` and `Prefs SETLISTERDEFAULTS=force,quiet,toolbars,formats` |
| Run any internal command | `dopusrt /acmd <command line>` (to the active Lister) | yes |
| Script add-in: new, edit, remove | write/edit/delete file in `Script AddIns\` | [tested 13.11] auto-loads on drop-in, hot-reloads on save, unloads on delete. Its commands run via `dopusrt /acmd <Name>` at once |
| Install a shared `.opusscriptinstall` / `.osp` | `dopusrt /acmd Prefs SCRIPTINSTALL "<path>"` (shows the installer) or copy a plain `.js`/`.vbs` into `Script AddIns\` | yes |
| New toolbar | write `Buttons\<name>.dop`, then `dopusrt /acmd Toolbar NAME="<name>" STATE=top` (or `STATE=float`) | [tested 13.11] picked up at once, no restart |
| Edit a toolbar that is always shown (File Display, Menu, Operations) | offline XML cycle below | [tested 13.11] |
| Edit an existing floating or optional toolbar file | close it first (`Toolbar NAME=… CLOSE`), edit, reopen | [tested 13.11] open toolbars are cached. `Toolbar RELOAD` did not refresh a floating toolbar. Close+reopen did. Never edit a toolbar that is open in Customize mode |
| Add a single button to an existing toolbar | hand the user the button XML: Customize mode, right-click toolbar, Paste | yes. Manual-documented sharing route |
| Hotkeys, file types, Preferences options, menus, favorites | guide the user through the dialog (`Prefs PAGE=…`, `Prefs CUSTOMIZE=keys`, `Prefs FILETYPES`) OR do the offline XML cycle below | dialog = live. XML edit only with Opus exited |
| Rename preset | write `Rename Presets\<name>.orp` | [tested 13.11] usable at once via `Rename PRESET="<name>"` |
| Theme | `Prefs THEMEIMPORT="<file>"` then `Prefs THEMELOAD THEMENAME=…` | yes |
| Layout / style | `Prefs LAYOUT="<name>"`, `Prefs STYLE="<name>"`, save via `Prefs LAYOUTSAVE`, `Prefs STYLESAVE` | yes |

Open a Preferences page directly: Preferences menu / Copy page shortcut gives the exact `Prefs PAGE="…"` string.

Offline XML cycle (only after the user agreed, unsaved work in Opus is the user's to close) [tested 13.11, adding a button to `Buttons\File Display.dop`]:
1. `dopus.ps1 backup`, then `dopus.ps1 stop` (sends `Close PROGRAM`, waits until no `dopus.exe` remains).
2. Edit the XML. Keep the UTF-8 BOM, tab indentation and CRLF line endings (toolbar files are CRLF). Match anchors with the file's own newline.
3. `dopus.ps1 start`. Opus loaded the edit and did not rewrite the file. Confirm the change on screen, offer revert.
`Close RESTART` restarts in one step, but leaves no window to edit files in between.

Every graceful exit rewrites `ConfigFiles\docks.oxc`, `ConfigFiles\smartfav.osf` and `Layouts\System\default.oll` (window and dock state, SmartFavorites counts). Expect them in `diff` after a stop/start and don't restore them as part of a revert.

## Remove entries from SmartFavorites

Opus has no per-folder remove and no exclusion list for SmartFavorites. `Clear` (Preferences / Frequently Used Paths / SmartFavorites, or `Favorites SMART=clear`) wipes everything. To drop specific folders, edit `ConfigFiles\smartfav.osf` [tested 13.11, removed all entries whose path contained a word]:
1. Ask which folders or which word to match. Read the list first (`<entry points=".." dest_points=".."><pathstring>…</pathstring></entry>`, one per folder). Do not print paths the user did not ask about.
2. `dopus.ps1 backup -Label <what>`, then `dopus.ps1 stop`. Opus rewrites this file on exit, so editing it while Opus runs is lost.
3. Delete the whole `<entry>…</entry>` block of each match. Keep the UTF-8 BOM and the file's line endings. A regex over the raw text that matches one `<entry>` block at a time works.
4. `dopus.ps1 start`, then re-read the file and confirm the removed paths did not come back and the entry count dropped.
5. Tell the user: matches the path text only (parent folders too). Opus can re-learn a folder on later visits. Recent List, location bar history and `funclog.dfl` can still hold the path. Revert: `dopus.ps1 restore -From <backup> -File ConfigFiles\smartfav.osf` with Opus stopped.

## Backup before every change

1. Copy the whole `/dopusdata` folder to a dated folder (manual: a file copy is a valid backup). For a single-file change, copying that file is enough.
2. Interactive full backup: `dopusrt /acmd Prefs BACKUPRESTORE` (wizard). Restore via the same wizard, merge or replace.
3. `Prefs BACKUP TO="<file>" QUIET` is documented for automation, but [tested 13.11] sent through `dopusrt /acmd` it produced no file. Do not rely on it from outside. It may work from a button inside Opus.

Revert: restore the copied file(s) with Opus exited, or for live routes run the inverse command (delete the script, close the toolbar, restore the `.dop`).

## Running commands from outside

`dopusrt.exe` lives in the program folder (default `C:\Program Files\GPSoftware\Directory Opus\`). Inside Opus buttons write just `dopusrt`.

| Call | Effect |
|---|---|
| `dopusrt /acmd <cmd>` | Run in the active (or last active) Lister. Opens a Lister if none |
| `dopusrt /cmd <cmd>` | Run in the source Lister |
| `dopusrt /cmd:viewer <cmd>` | Send to the active image viewer |
| `dopusrt /col <collection cmd>` | Manipulate file collections |
| `dopusrt /argsmsgbox …` / `/argstoclip …` | Show / copy the exact args Opus would pass. Debugging aid for buttons that call external programs |

Quoting limits on this route [tested 13.11]: backslash sequences such as regex back-references (`\1`) do not arrive intact, quoted or not, and a backslash right before a closing quote reads as an escaped quote. A command that then lacks a value can open its interactive dialog instead of failing, which leaves a modal window for the user to close. Keep commands with backslash sequences in a button, user command, rename preset or script, and use `dopusrt` only to trigger them by name.

`dopusrt` returns nothing about success. Errors (rename failures, evaluator syntax errors, "file exists") and prompts appear as modal dialogs (class `#32770`) owned by `dopus.exe`, and they block further work until answered. `dopus.ps1 cmd` waits 1.5 s after sending, lists any new dialog with its text and buttons, and exits 2 [tested 13.11]. On exit 2: tell the user what the dialog says, then let them answer it or run `dopus.ps1 dialogs -Close` (clicks Abort on error prompts so nothing half-finished continues, Cancel on the rest). Run `dopus.ps1 dialogs` before a session's first change too: leftover dialogs from earlier work make later commands misbehave. A slow command can open its dialog after the wait: raise `-WaitMs` or check `dialogs` again.

From Git Bash: `"/c/Program Files/GPSoftware/Directory Opus/dopusrt.exe" /acmd Go "C:\Temp"`. Shell quoting is consumed by bash, so DOpus-level quotes inside an argument need `'TO="C:\x y"'` style wrapping. PowerShell: `& "C:\Program Files\GPSoftware\Directory Opus\dopusrt.exe" /acmd …`.
