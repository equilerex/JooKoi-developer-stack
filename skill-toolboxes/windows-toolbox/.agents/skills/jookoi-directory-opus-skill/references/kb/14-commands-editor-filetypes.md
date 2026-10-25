# Command syntax, command editor modes, hotkey control, File Types

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- commands.simpleeditor: Simple Command Editor
- commands.advancededitor: Advanced Command Editor
- customize.hotkeycontrol: Hotkey control (entering keys)
- commands.userdefined: User-defined commands (summary)
- commands.syncasync: Synchronous vs asynchronous functions
- commands.argtypes: Internal command arguments and templates
- commands.codes: Passing files to external programs (control codes)
- commands.modifiers.intro: Command modifiers
- commands.dosbatch: MS-DOS Batch functions
- commands.wsl: WSL commands
- commands.renamescript: Embedded rename scripts
- commands.dde: DDE functions
- commands.embedded: Embedded functions
- filetypes.concept: File types and groups
- filetypes.actions: Actions tab (global verbs)
- filetypes.events: Events tab (double-click, drag and drop)
- filetypes.contextmenu: Context Menu tab (file and folder menus)
- filetypes.dropmenu: Drop Menu and Replace Menu tabs
- filetypes.infotip: Info Tip tab (tooltip definition)
- filetypes.tiles: Tiles Mode tab
<!-- contents:end -->

## commands.simpleeditor | Simple Command Editor
src: 0341 | area: customize
ui: Command Editor (Simple mode)
user-words: one line function, browse for program, start in
what: Single-line `Function` field. Three ways to fill it: dropdown of predefined commands (writes the underlying command, for example Viewer Pane = `Set VIEWPANE=Toggle`), type an internal command with arguments, or `Browse` for a program and append control codes (for example pass the first selected file to Notepad). `Start in` and `Run` become active for external programs. `Advanced` button switches mode.

## commands.advancededitor | Advanced Command Editor
src: 0342 | area: customize
ui: Command Editor (Advanced button)
user-words: multi line button, comments in button, run button test, split long command
what: Multi-line function box. Opens automatically for multi-line functions. `Start in` becomes a `cd` line and `Run` becomes `@runmode`. Function type dropdown: `Standard Function`, `MS-DOS Batch Function`, `Script Function` (language dropdown), `WSL Script Function` (Windows 10 + WSL), `Evaluator Function`.
options:
- toolbar above the box: `Edit` (editor functions), `Commands` (internal + user commands), `Arguments` (context sensitive for the command on the cursor's line, plus external control codes), `Browse`, `Modifiers` (list with descriptions)
- lines starting with `//` (at column 0) are comments; a line starting with `[[` continues the previous command, for example `Find IN C:\ [[QUERY *.jpg]] [[ FILTERDEF size match > 100 kb and size match < 200 kb ]]`
- `Run` button (or F5) tests without closing; runs against the source tab of the Lister that opened the editor. Add `@nodeselect` near the top to keep the selection while testing. Script test-runs open an output panel (errors and `DOpus.Output` text, also in the Script Log). Saving happens only on OK in the editor and then OK in Customize
cmd: `@nodeselect`

## customize.hotkeycontrol | Hotkey control (entering keys)
src: 0343 | area: customize
ui: Command Editor Hotkey field; Customize / Keys
user-words: assign shortcut, two key shortcut, alternative shortcut, left side only hotkey, media key
what: Click the field and press the combination. Special keys via the dropdown.
options:
- dropdown: `Left` / `Right` (File Display toolbar buttons only: bind a key to the left/top or right/bottom display regardless of source), `Enter`, `Escape`, `Tab` (hold Ctrl first for Ctrl+Enter), `Original` / `Previous`, `Add Alternative` (extra key for the same command, for example Alt+D and F4), `Add To Sequence` (chord: press keys one after another, e.g. Alt+D then 1; Opus shows a small popup bottom-left while waiting), `Remove`, `Media keys` (hotkey functions only: Play button, mouse Back button)
- editing: only the current sequence (main field) is editable; other alternatives are removed with their `Remove` link and re-added
- example dual display: Shift+F4 = left Location field, Ctrl+F4 = right
see: customize.keys

## commands.userdefined | User-defined commands (summary)
src: 0344 | area: customize
ui: Customize / User Commands
what: Named commands (must not clash with Opus commands) others can call, optionally with arguments.
see: customize.usercommands

## commands.syncasync | Synchronous vs asynchronous functions
src: 0345 | area: customize
ui: n/a
user-words: open each file in own window, run one after another, multiple files notepad
what: Synchronous = commands one at a time, selected files one at a time. Asynchronous = no waiting. Example `notepad.exe {f}` with 3 files: sync = Notepad opens for file 1, then 2 after you close it; async = three at once. Defaults: single-command function async, two or more commands sync.
options:
- `@async` / `@sync` force a command; Advanced option `function_default_async` makes all async
notes: Internal commands always run synchronously. To run one asynchronously start it as an external program with `dopusrt /cmd` (then `@sync`/`@async` apply).
cmd: `@async`, `@sync`, `dopusrt /cmd`

## commands.argtypes | Internal command arguments and templates
src: 0346 | area: customize
ui: n/a
user-words: how do command arguments work, switch value optional, quotes in commands, equals sign
what: About thirty internal commands, each with arguments. Template qualifiers (never typed): `/S` switch (name alone turns it on, for example `Copy MOVE`), `/K` keyword value (name alone does nothing, needs a value, for example `Copy COPYATTR=yes`), `/O` optional (alone = default behaviour, or with value, for example `Copy ADDTOARCHIVE` then `Copy ADDTOARCHIVE=.7z`), `/N` numeric value, `/M` multiple values separated by spaces, `/R` raw (rest of the line is the value; only type that needs no quotes for spaces). The default argument (no qualifier, for example `FILE` of Copy) may be written without its name (`Copy C:\foo.txt TO D:\`). Synonyms exist (`ADDTOZIP` = `ADDTOARCHIVE`, `ZIP` = `ARCHIVE`).
notes: Values with spaces need quotes (`Copy AS "My Zip File.zip"`) because the parser would otherwise split on argument names. `""` inside quotes = literal quote (`SetAttr META "comment:This comment contains ""a quoted phrase""."`). The `=` is optional (`AS "x"` = `AS="x"`) except: required when the value is itself an argument name (`Copy CREATEFOLDER=sendmail`), forbidden for `/M` lists. Multiple values: `Copy FILE D:\data\pic*.jpg "J:\image files\pic*.jpg" TO "E:\image store"`. Some value arguments take comma keywords as one value (`Set VIEW=details,power` toggles between two modes), that is not `/M`.
see: commands.codes

## commands.codes | Passing files to external programs (control codes)
src: 0347 | area: customize
ui: Command Editor Function field
user-words: pass selected files to program, filename codes
what: Add codes to an external program's command line: for example `{allfilepath}` passes all selected files; files can also be dropped onto the button. Codes also pass the source folder, date/time strings and more (see codes.* entries and `references/codes.md`).
see: codes.filenames

## commands.modifiers.intro | Command modifiers
src: 0348 | area: customize
ui: Command Editor Advanced mode (Modifiers dropdown)
user-words: filesonly, async, keydown, modifier lines
what: A modifier is an option for how a function runs, on its own line (applies to the whole function) or on the same line as a command (applies to that command, for example `@async`). Needs the Advanced editor. Example: `@filesonly` + `@async` + `notepad.exe {f}` = Notepad per selected file, ignoring folders, without waiting.
see: modifiers.list

## commands.dosbatch | MS-DOS Batch functions
src: 0349 | area: customize
ui: Advanced editor > Function type `MS-DOS Batch Function`
user-words: run dir command, batch file in button, cmd output, hide dos window
what: Runs as a temporary .bat file. Needed for shell built-ins like `dir`. Example: `cd {sourcepath}` then `dir /w > {destpath} {sourcepath|nopath|noterm}.txt` (lines become `@echo off`, `chcp 1252 > nul`, drive letter, `cd`, command). Internal commands can be mixed in; names clashing with internal commands (`Set`, `Copy`) need `@externalonly`.
options:
- modifiers: `@leavedoswindowopen`, `@codepage`, `@externalonly`, `@nocall`, `@runbatch` / `@norunbatch`, `@runmode:hide`

## commands.wsl | WSL commands
src: 0350 | area: customize
ui: Advanced editor > Function type `WSL Script Function`
what: Manual page unfinished. WSL script functions exist (Advanced editor) and the FAYT has a `|` WSL command mode. Advanced option `wsl_distribution` picks the distribution.

## commands.renamescript | Embedded rename scripts
src: 0351 | area: customize
ui: button or hotkey function
user-words: rename script in button, rename without dialog
what: First line `Rename` (any `Rename` arguments pre-process, for example `Rename CASE=allwords`), then `@script` modifier naming the language (`vbscript`, `jscript`, others if installed), then the script text below.
cmd: `Rename`, `@script`

## commands.dde | DDE functions
src: 0352 | area: customize
ui: Advanced editor (multi-line DDE function)
what: Old DDE interface: Advanced editor lines `ddeexec` (message, `%1` = file), `ddeapp` (application name), `ddetopic`, then the program command line (often with a `/dde` flag). Explorer Replacement itself uses DDE.

## commands.embedded | Embedded functions
src: 0353 | area: customize
ui: button or hotkey function
user-words: open new tab and then run command, drive button also sets focus
what: A function in square brackets passed to the new element: `Go /mypictures NEW [Set VIEW=thumbnails]`, multi-line `Go NEW [ Go /mypictures Set VIEW=thumbnails ]`. `Go FINDTITLE` embeds run in all matching Listers (`RUNEMBEDDEDIFNOTFOUND` runs it in the current one if none). Dynamic buttons apply it per generated item: `Go DRIVEBUTTONS OPENINLEFT [ Set FOCUS=Left ]`.
options:
- commands supporting embedded functions: `Favorites` (dynamic), `Go NEW`, `Go NEWTAB`, `Go FINDTITLE`, `Go DRIVEBUTTONS`, `Go FTPSITELIST`, `Go FOLDERCONTENT`, `Prefs LAYOUT`, `Properties SETLABEL`, `Recent`, `Show`

## filetypes.concept | File types and groups
src: 0354 | area: filetypes
ui: Settings > File Types... (`Prefs FILETYPES`)
user-words: what happens on double click, change default program, context menu for file type, file type groups, extension list
what: File types group files by extension (`.txt` = Text Document) system-wide; Opus adds File Type Groups (Opus-only) and per-type settings: icon/description/MIME/extensions, `Actions`, `Events`, `Context Menu`, `Drop Menu`, `Info Tip`, `Tiles Mode`. Dialog lists extensions, description and group (hover the Group column to change). `New` (type or group), `Copy`, `Delete`, `Find` (by extension/description), type an extension to jump, `Edit`; bottom shows `Opens with` (change via right-click Open With).
options:
- setting scope: Global (extensions, icons, descriptions, Opens with, actions: affect Windows and other programs), Mixed (context menu items: global or Opus-only), Opus-only (events, drop menu, groups)
- pseudo types (top of the list): `All files`, `All files and folders` (Cut/Copy/Paste menu, drag-drop events), `All folders`, `Cloud item` (Always keep on this device / Free up space), `Collection item` (Remove from Collection), `Flat View item`, `Library item`, `No filename extension`, `Recognized images` (all image formats Opus knows; like but not identical to Images group), `Unknown file types`
- default groups: `Archives` (follows enabled archive plugins), `Documents`, `Images`, `Movies`, `Music`, `Programs`; reset one with right-click `Reset to Defaults`, all via right-click on the group header. Groups also drive Content Type formats
- File Type Editor (double-click a type): `Change Icon` (global; not for groups), `Description` (Type column text; for groups the group name), `Extensions` (add/remove; global for types), `MIME Type`; tabs `Info Tip`, `Tiles Mode`, `Actions`, `Events`, `Context Menu`, `Drop Menu`, `Replace Menu`
notes: Lookup order used by events, info tips and tiles: specific type, its group, `Recognized images`, `All files` (or `All folders`), `All files and folders`; the first with a function defined wins.
cmd: `Prefs FILETYPES`

## filetypes.actions | Actions tab (global verbs)
src: 0355 | area: filetypes
ui: File Type Editor / Actions
user-words: change open with command, print verb
what: Verbs `explore`, `find`, `open` (default; double-click), `print`, `printto`. Global (affects Windows). Not for groups. Display label can differ from the verb. Buttons: `Edit`, `Delete`, `Set Default` (bold = default), right-click Copy/Paste. Edit dialog: `Type` = `Run an application` (command line, `%1` is the file; `Action` = label with `&` accelerator) or `DDE command` (`Application`, `DDE Message`, `AppName`, `Topic`, `Not Running`). Cannot use internal Opus commands.

## filetypes.events | Events tab (double-click, drag and drop)
src: 0356 | area: filetypes
ui: File Type Editor / Events
user-words: shift double click, middle double click, different double click in opus than explorer, drag and drop convert
what: Events `Drag-and-drop`, `Left double-click`, `Middle double-click`, each with optional Alt, Ctrl, Shift variants (no right double-click). Opus-only. Editor is a command editor. Example for the Images group: Ctrl+drop `Image CONVERT=png`, double-click `Show`, Ctrl+double-click external editor with `%1`, middle double-click Windows photo viewer.
cmd: `Show`, `Image CONVERT=png`
see: fileops.dragdrop

## filetypes.contextmenu | Context Menu tab (file and folder menus)
src: 0357 | area: filetypes
ui: File Type Editor / Context Menu
user-words: add item to right click menu, remove context menu item, submenu in context menu, global vs opus-only
what: Menu = items from every matching type (for .jpg: JPEG Image, Images, Recognized images, All files, All files and folders). Two kinds: Global (registry, shows in Explorer too, must run an external program) and Opus-only (can use internal commands). Handler-based shell extension items cannot be configured here (see Preferences / Miscellaneous / Shell Extensions to block).
options:
- `New`, `Edit` (double-click), `Delete`, `Set Default` (global items only, becomes double-click action), right-click `Copy`/`Paste`, `Begin a group`, drag to reorder or drag between two open editors
- New item `Type`: `Run an application` (global), `DDE command` (global), `Run an Opus function` (Opus-only), `Sub-menu` (Opus-only; label and icon only). Type cannot be changed afterwards; groups only allow the Opus-only types
- `Action` = menu label (`&` accelerator), small box = icon (Opus only)
- sub-menus: items below a Sub-menu entry go inside it until you right-click `Decrease Indent`; nested allowed; `Button` option on the first child makes the sub-menu a menu button
notes: Example global item: Notepad with `%1`. Opus-only example: Images group `&Convert Image…` uses `Image`.

## filetypes.dropmenu | Drop Menu and Replace Menu tabs
src: 0358, 0359 | area: filetypes
ui: File Type Editor / Drop Menu, Replace Menu
user-words: right drag menu, add create softlink to drop menu, compare files from replace dialog
what: Drop Menu = menu after dragging with the right button (default: Copy Here, Move Here, Create Shortcut(s) Here via All files and folders). Opus-only items only. Example: Action `Create Softlink Here`, type `Run an Opus function`, function `Copy MAKELINK=softlink HERE` (needs admin, UAC prompt). Replace Menu = items on the context menu of file icons in the Confirm File Replace dialog, for example compare: `"C:\Program Files (x86)\Beyond Compare 4\BCompare.exe" {filepath$} {filepathdest$}`.
cmd: `Copy MAKELINK=softlink HERE`

## filetypes.infotip | Info Tip tab (tooltip definition)
src: 0360 | area: filetypes
ui: File Type Editor / Info Tip (buttons: `Insert Field` (also `{` key), `Samples`, `Clear`, `Never show an InfoTip for this File Type`)
user-words: customize tooltip, show image size in tooltip, folder size on hover, hide section in tooltip
what: One line per tooltip line using `{keyword}` codes (same keywords as columns / rename; list in references/codes.md or Keywords for Columns). A line whose codes are all empty is omitted. Resolution order same as events (specific type, group, Recognized images, All files/All folders, All files and folders).
options:
- special codes: `{foldersize}` (+ `:noprefix`), `{foldercontents}` with keywords `files`, `dirs`, `noprefix`, `singleline`, `indent=<text>` (must be last), `maxitems=N` (default 10 total, hard max 20 per category), `maxitemlength=N` (default 40, max 260); `{thumbnail}` with `:0` no border, `:1` normal (default), `:2` border only without alpha, `:3` files only; position letter `l`, `t`, `b` (`{thumbnailt}`); size `{thumbnail:1:512}`; `{infotip}` (system tooltip text)
- evaluator: `{=expr=}` value (`{=picwidth * picheight=}`), `{!=bool=}text{!}` conditional text
- hide sections: `{!picwidth&picheight}Size: {picwidth} x {picheight}{!}` (all fields must exist)
- markup: `<#RRGGBB>..</#>`, `<b>`, `<i>`, `<u>`
- tables: `\<tab>` ends a column (more `\` = bigger gap), `\` at end of line ends a table, `\\` / `\\\` at line end inherit 1 / 2 column widths
see: evaluator.ctx.infotips

## filetypes.tiles | Tiles Mode tab
src: 0361 | area: filetypes
ui: File Type Editor / Tiles Mode
user-words: customize tiles text
what: Same mechanism as info tips (one label line per row, same lookup order, `{keyword}` codes, `{foldersize}`, `{foldercontent}` (note spelling differs from info tip `{foldercontents}`), markup, evaluator codes, `Insert Field`, `Samples`, `Clear`). Tile size is set in Preferences / File Display Modes / Tiles.
