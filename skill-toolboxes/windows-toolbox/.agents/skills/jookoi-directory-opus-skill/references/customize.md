# Customize: toolbars, buttons, menus, hotkeys, user commands
Scope: building and editing toolbars, menus, buttons, hotkeys and user commands, installing forum buttons, debugging a button. File and folder right-click menus live in `references/file-types.md`. Where config files live and how to apply changes from outside Opus: `references/config-files.md`.

## User says → concept
| User words | DOpus concept | Where / how |
|---|---|---|
| "edit the toolbar", "add a button", "the bar on top" | Customize mode | Settings > Customize Toolbars and Keys..., or right-click empty toolbar space / Customize, or Lister window icon (top-left) / Customize |
| "the File / Edit / View menus" | Menu toolbar (a default toolbar, menus are toolbars) | edit in Customize mode like any toolbar |
| "the bar above each file list", "address bar" | File Display toolbar, Location field (a field button) | Customize mode |
| "right-click menu on the column header / folder tab / tray icon / empty background" | Customize / Context Menus tab | Customize dialog. Not for files and folders (those are File Types) |
| "keyboard shortcut", "shortcut key" | hotkey (Lister, system-wide, folder tree, viewer) | button's Hotkey field, or Customize / Keys |
| "shortcut that works when Opus is in the background / from anywhere" | System-wide hotkey | Customize / Keys / New / New System-wide Hotkey |
| "button does something else on right-click" | three-button (multiple-function) button | button context menu in Customize mode / Three Buttons |
| "button with a little arrow", "dropdown" | Menu or Menu Button | New Menu / New Menu Button |
| "list of drives/favorites as buttons" | dynamic button | `Go DRIVEBUTTONS`, `Favorites` etc. |
| "search box / filter box / path box on the toolbar" | field button | drag from Customize / Commands tab |
| "my own command name", "reusable command with parameters" | user command | Customize / User Commands |
| "different toolbars for photos", "toolbar when I'm in folder X" | view mode toolbar / folder toolbar | Preferences / Toolbars / View Mode Toolbars, Folder Formats |
| "save my toolbar layout", "switch toolbar setups" | toolbar set / Default Toolbar Set | Settings / Toolbars / Toolbar Sets, Settings / Toolbars / Set As Default Toolbar Set |
| "install this button from the forum", "paste this XML" | sharing buttons (clipboard XML) | Customize mode, right-click toolbar, Paste |
| "button only shows when ...", "greyed out unless" | `@hideif`, `@showif`, `@disablenosel`, `@hidenosel` | command modifiers |
| "my button passes the wrong path to the program" | external control codes, quoting | debug with `dopusrt /argsmsgbox` |

## Model
- Toolbars and menus are the same object. A drop-down menu is a vertical toolbar. Each toolbar is one `Buttons\<name>.dop` XML file.
- A button has appearance (label, tip, icons, colors), an optional hotkey, and a function. The function is a list of instruction lines plus a function type.
- Five factory-default toolbars (Menu, Operations, Favorites Bar, File Display, Images) can be edited and turned off, never deleted or renamed. Reset one with right-click / Factory reset this toolbar. Reset all from the toolbar context menu / Toolbars / Factory Reset Toolbars. Other toolbars are ordinary files.
- Customize is modal. Entering it turns every toolbar into edit mode and suspends normal Lister work. Changes are saved only when you click OK in the Customize dialog. Cancel or Undo All Changes reverts everything since entering.
- In Customize mode: double-click a button to edit, right-click for its context menu, Shift+click runs it. A mini-toolbar in each Lister title bar brings the dialog back or OK/Cancels it.
- Preferences / Toolbars / Options / Alt-Click to edit Toolbar buttons: Alt+click any button to jump straight into its editor.
- `Toolbar CLICKTOEDIT` puts toolbars in click-to-edit mode, so the next left-click opens that button's editor.

## Customize dialog tabs
| Tab | Holds |
|---|---|
| Toolbars | all toolbars, on/off checkboxes, create/delete/float. Per-toolbar Image size, Image state, Label state, Highlight border, Label color, Font, background. Option **Always enable this toolbar's keys in Listers** (keeps hotkeys alive when the toolbar is off, used by Menu and Operations). Format painter copies icon/label/color between buttons |
| Context Menus | fixed set of UI menus: file display background menus (per folder type), Column Header, Copy Highlighted Cells, Folder Tabs, Image Viewer, Tray Icon. Edit alongside default shows a read-only default copy to drag from. Not file/folder menus |
| Keys | every hotkey grouped by category. Conflicts category. Create the four standalone kinds here. Export as Importable Hotkey Format, CSV or text |
| Commands | pre-built commands to drag onto toolbars. **New** category holds New Button, New Menu, New Menu Button, Spacer and the field buttons |
| User Commands | your own named commands with argument templates |
| Default Toolbars | the factory toolbars, read-only. Drag buttons out. Time slider highlights buttons added per version |

Page menu (top-right): Import, Export (acts on the current tab), Save Floating Toolbars, Factory Reset, Undo Changes, Undo All Changes.

Open a tab directly: `Prefs CUSTOMIZE=keys`, `Prefs CUSTOMIZE=toolbars`. See `references/commands.md` / Prefs.

## Button anatomy (Command Editor)
| Field | Meaning |
|---|---|
| Label | text. `&` before a letter makes Alt+letter open a top-level menu/button. `&&` = literal `&`. `\t` right-aligns text in menus (convention for showing a key, does not bind it) |
| Tip | tooltip. `\n` = line break |
| Images | primary icon, optional second icon for mouse-over (Dual image). Show image, Large image size, No highlight border. Toolbar settings can override |
| Colors | text and background, buttons only |
| Hotkey | key for this button. Local in Lister toolbars, global on floating toolbars |
| Function | the instructions. Simple mode = one line. Advanced mode = multi-line plus function type drop-down |
| Start in / Run | simple mode only, for external programs. In advanced mode they become a `cd` line and `@runmode` |

Advanced editor extras: Commands / Arguments / Modifiers drop-downs insert syntax. Lines starting `//` at column 0 are comments. A line starting `[[` continues the previous command. Run button (F5) tests without closing the editor. It runs against the source tab of the Lister that opened the editor, so add `@nodeselect` while testing selection-based buttons.

## Function types
| Type (editor drop-down) | XML `function type=` | Runs | Users confuse it with |
|---|---|---|---|
| Standard Function | `normal` | Opus internal commands and external Windows programs, line by line | MS-DOS Batch when they paste `dir`, `echo`, `set`, `copy`: those are cmd.exe built-ins and need batch mode |
| Script Function | `script` | JScript or VBScript with `OnClick(clickData)`. XML stores the language as first line `@script jscript` / `@script vbscript` | pasting script code into a Standard function (shows as unknown commands). Pasting a Script Add-In (has `OnInit`) into a button: add-ins go in Preferences / Toolbars / Scripts |
| MS-DOS Batch Function | [unverified] | written to a temp `.bat` and run by cmd.exe. Internal Opus commands may be mixed in | Standard. Internal names (`Set`, `Copy`) win over cmd.exe ones unless `@externalonly` |
| WSL Script Function | [unverified] | a Bash script under WSL (only if WSL installed) | MS-DOS batch |
| Evaluator Function | [unverified] | whole button written in the Evaluator | see `evaluator` reference |

Inside an embedded function (`Go NEW [ ... ]`) set the type with `@functype:script` + `@script:vbscript`, `@functype:msdos`, `@functype:eval`.

MS-DOS batch specifics: `cd {sourcepath}` becomes drive + `cd` lines, code page defaults to 1252 (`@codepage:65001` to change), window closes at the end (`@leavedoswindowopen` keeps it), `@runmode:hide` hides the flash.

## Special button kinds
| Kind | How to make | Notes |
|---|---|---|
| Three-button (LMB/RMB/MMB) | Customize mode, right-click button / Three Buttons. It opens like a menu with up to 3 children: 1st = left click, 2nd = right click, 3rd = middle click | tooltip shows LMB/RMB/MMB. Preferences / Toolbars / Options / Simulate middle mouse click with control + left-click. XML: `type="three_button"` with child `<button>`s. Parent can take icon from children (Dynamic icon/label from child buttons, `@iconp:`) |
| Menu | New Menu | click opens the menu. XML `type="menu"` |
| Menu Button | New Menu Button | button part runs a function, arrow part opens the menu. XML `type="menu_button"`. Right-click / Convert switches between the two. Edit a drop-down via right-click / Edit (double-click does not work) |
| Dynamic button | a normal button whose command generates items: `Go DRIVEBUTTONS`, `Favorites`, `Go FTPSITELIST`, `Go FOLDERCONTENT`, `Recent`, `Toolbar LIST`, `FileType OPENWITHMENU`, `@ctx:=return "..."` | looks like one button in Customize mode, expands at runtime. Many accept an embedded function `[ ... ]` run per generated item |
| Field button | only by dragging from Commands tab (New category) | types: Content Type, Drives, Filter, Label, Path (Basic/Breadcrumbs/Favorites List/Folder Tree/Recent List), Search Field, Spacer, Thumbnail Size. Right-click: Full Width, Restore Focus, Field Type. XML attribute `field_type=` (e.g. `path_treepath`) and `size="full"` |
| Separator | drag a button a few pixels right, or right-click / Begin a Group | XML `separate="yes"` on the button after the gap |
| Gap / right-align | Spacer field with Full-width | |

## Command modifiers (most used)
One per line in advanced mode. Some apply to the whole function (own line), some to the next command (`@async:cmd`). Full list in the manual's Command modifier reference.

| Modifier | Meaning |
|---|---|
| `@admin` / `@admin:<cmd>` | elevate whole function (UAC) or just one command |
| `@async` / `@sync` | override sync mode for the next command |
| `@confirm:msg\|OK\|Cancel` | ask before continuing, cancel aborts |
| `@filesonly` / `@dirsonly` | use only selected files / only folders |
| `@firstfileonly` | only the first selected item |
| `@filesfromdroponly` | ignore selection, only items dropped on the button |
| `@nodeselect` | keep selection after the function |
| `@nodrop` | button refuses drops (must be first line) |
| `@runonce:<cmd>` | run the command once, not once per file |
| `@perfile:begin` ... `@perfile:end` | run the block once per file, in order |
| `@set name=value` | variable, read with `{$name}`. Scopes `src: dst: left: right: tab: lst: glob:`, `glob!:` persists to disk |
| `@if:<cmd>` / `@ifset:<Set arg>` / `@if:$var` / `@if:else` / `@if:common` | branch on a command's toggle state, a variable, or `@if:&&ARG&&=value` in user commands. `@if:=<evaluator>` also works |
| `@ifpath:<wildcard>` / `@ifpathr:<regex>` | branch on source path |
| `@ifsel:<test>` | branch on selection (same tests as `@disablenosel`) |
| `@ifexists:<path>` / `@ifrunning:<exe>` | branch on path existence / running process |
| `@keydown:shift` / `ctrl` / `alt` / `ctrlshift` / `none` / `any` / `common` | branch on held qualifier keys. `@keydown:shift:text` adds tooltip text |
| `@disablenosel[:files\|dirs\|numfiles=2\|type=*.jpg]` | grey out unless selection matches. `!` negates. `type=` must be last |
| `@hidenosel[...]` | same tests, hides instead |
| `@hideif:<cmd>` / `@showif:<cmd>` / `@disableif` / `@enableif` | hide/show/disable on a command state or `=<evaluator>` |
| `@hideifpath` / `@showifpath` (+`r` for regex) | hide/show by source path. Aliases like `/desktop` only with wildcards |
| `@hideblock:begin` / `@hideblock:end` | hide a run of buttons with one test |
| `@toggle:if <cmd>` / `@toggle:invert` / `@toggle:update` | control the highlighted state. `update` refreshes buttons after variable changes |
| `@icon:<icon>,<cmd>` | change icon when the command tests true |
| `@label:<evaluator>` | dynamic label (manual entry is TOBEDONE, shown with `@eval`) |
| `@eval:` / `@evalalways:` | evaluator code for dynamic tests, `evalalways` also on click |
| `@ctx:=<evaluator>` | dynamic button built by the evaluator |
| `@requires:<flags>` | declare needs: `S` source, `D` dest, `f` files, `F` folders, `N` need entries, `L` Lister |
| `@runmode:min\|max\|hide` | window state of launched programs |
| `@nofilenamequoting` | stop auto-quoting of `{filepath}` etc. |
| `@resolvelinks` | pass shortcut targets, not `.lnk` files |
| `@nolocalizefiles` | pass `ftp://` / archive paths as-is instead of temp copies |
| `@noexpandenv` | leave `%VAR%` unexpanded |
| `@useactivelister` | act on the active Lister, not the source one (hotkeys) |
| `@externalonly`, `@leavedoswindowopen`, `@codepage:<n>`, `@runbatch`, `@norunbatch`, `@nocall` | MS-DOS batch control |
| `@output <text>` / `@clearoutput` | write to / clear the Script Log |
| `@sendkey:win+v` | send a keystroke to the focused window |
| `@script:<language>` | language for embedded rename scripts |
| `@functype:` | type of an embedded function |

## Synchronous vs asynchronous
- Default: a function with one command runs asynchronously (one program instance per selected file, all at once). Two or more commands run synchronously (wait for each, files one at a time).
- `notepad.exe {f}` with 3 files: async = 3 Notepads at once. Sync = next opens when you close the previous one.
- Override per command with `@async` / `@sync`. Global: Preferences / Miscellaneous / Advanced / `function_default_async`.
- Internal commands are always synchronous. To run one asynchronously wrap it: `dopusrt /cmd <command>`.

## Internal command argument syntax
| Template qualifier | Type | Usage |
|---|---|---|
| `/S` | switch | presence turns it on: `Copy MOVE` |
| `/K` | value required | `Copy COPYATTR=yes` |
| `/O` | optional value | `Copy ADDTOARCHIVE` or `Copy ADDTOARCHIVE=.7z` |
| `/N` | numeric value | `Copy BUFSIZE 128000` |
| `/M` | multiple values, space separated, **no** `=` | `Copy FILE a.jpg "b c.jpg" TO D:\` |
| `/R` | raw, swallows rest of line, no quotes needed | `ContextMenu LABELRAW Open with X` |
| none on a value arg | default argument, name optional | `Copy C:\foo.txt TO D:\` |

Rules:
- Quote any value with spaces: `Copy AS "My Zip File.zip"`. Unquoted, `Zip` is parsed as the ZIP argument.
- `=` is optional, except it is required when the value is itself an argument name (`Copy CREATEFOLDER=sendmail`) and forbidden for `/M` lists.
- `""` inside quotes = literal quote.
- Comma lists are one value (`Set VIEW=details,power`), not `/M`.
- Argument names are case-insensitive. External control codes (`{filepath}`) are case-sensitive. `{{` = literal `{`.
- Full argument lists per command: `references/commands.md`.

## Passing files to external programs
- Put control codes in the command line: `"C:\Tools\app.exe" {allfilepath}` (all selected, one command line), `notepad.exe {f}` (one per file, `{f}` = `{filepath}`).
- Opus auto-quotes paths with spaces. Do not add your own quotes around `{filepath}` unless you also use `@nofilenamequoting`.
- Common codes: `{sourcepath}`, `{destpath}`, `{file}` (name only), `{sourcepath|nopath|noterm}` (current folder name), `{date|yyyyMMdd}`, `{dlgstring|prompt}`, `{$var}`. Full list: manual "External control codes".
- Files can also be dropped on the button: it receives the dropped items in place of the selection.
- Quickest route: drag a program's exe or shortcut onto a toolbar in Customize mode. The Launch Options dialog asks how to pass files (Ctrl while dropping forces the dialog). Dragging a folder makes a `Go` button.

## Hotkeys
| Kind | Works when | Create |
|---|---|---|
| Button hotkey on a Lister toolbar/menu | a Lister is active (if toolbar is off, only with Always enable this toolbar's keys) | button's Hotkey field |
| Lister hotkey (hotkey-only) | a Lister is active | Customize / Keys / New / New Lister Hotkey |
| System-wide hotkey | anywhere while Opus runs, no Lister needed | New System-wide Hotkey, or a button on a floating toolbar |
| Folder Tree hotkey | folder tree has focus | New Folder Tree Hotkey |
| Viewer hotkey | standalone image viewer | New Viewer Hotkey, or viewer toolbar button |
| Favorite Folders, Quick Keys | set in Preferences | change key on Keys tab |

Hotkey control drop-down: Enter/Escape/Tab, Left/Right (File Display toolbar only, bind to one side), Add Alternative (several keys, e.g. F4, Alt+D, Ctrl+L), Add To Sequence (chords like Alt+D then 1), Media keys (hotkey-only functions, including mouse Back).

Stored syntax (lowercase modifiers joined by `+`), read from real `.dop` files:
```xml
<button ... hotkey="ctrl+1" hotkey_label="yes">       <!-- one key -->
<hotkeys><key>alt+f4</key><key>shift+escape</key></hotkeys>  <!-- several -->
```
Standalone hotkeys live in `ConfigFiles\lister_hotkeys.oxc`, `global_hotkeys.oxc`, `tree_hotkeys.oxc`, `viewer_hotkeys.oxc` (`references/config-files.md`). Toolbars whose keys stay active are listed in `Buttons\alwaysactivekeys.xml`.

## User commands
Customize / User Commands. Fields: Name (what you type in buttons), Label, Description (default tooltip), Template, Hide from Commands menu.
```
Name:      Select_Files_Of_Type
Template:  EXT
Function:  Select *.&EXT&
Use:       Select_Files_Of_Type txt      → runs Select *.txt
```
- `&ARG&` inserts the argument value. Switches insert `1`/`0`, or custom text with `&ARG:yes:no&`.
- `/O[<default>,one,two]` gives a value list and a default.
- Branch with `@if:&&ARG&&=one` or evaluator `@if:=(Arg("NAME")=="jon")`.
- Name must be unique and not clash with an internal command. Usable anywhere internal commands are, including Preferences pages that take a command.

## Toolbar sets, default set, folder and view-mode toolbars
- **Default Toolbar Set**: toolbars a new Lister opens with unless its saved Layout has its own. Update it from the current Lister: Settings / Toolbars / Set As Default Toolbar Set (`Toolbar SETDEFAULT`). Stored in `ConfigFiles\toolbars.oxc`.
- **Toolbar sets**: Settings / Toolbars / Toolbar Sets / Save Toolbar Sets, or Preferences / Toolbars / Toolbar Sets. Load mode: Add, Replace, or Toggle (toggles between the set and the default set). `Toolbar NAME="My Set" LOADSET=replace`.
- **View mode toolbars**: Preferences / Toolbars / View Mode Toolbars. The Images toolbar opens in Thumbnails mode this way.
- **Folder toolbars**: set in a Folder Format (per folder or per content type). Stored in `ConfigFiles\foldertoolbars.xml`.
- **Lister Layouts** can save their own toolbars.
- Open/close from a button: `Toolbar NAME="Tools" STATE=top`, `Toolbar NAME="Tools" TOGGLE`, `Toolbar NAME="Tools" FLOAT`. Save floating toolbar positions: Customize page menu / Save Floating Toolbars.

## Sharing and installing buttons
Copy out: Customize mode, right-click button or menu / Copy, then paste into Notepad (or paste into a Lister to create a text file). Result is XML.

Install a forum button (XML):
1. Copy the whole code block, from `<?xml version="1.0"?>` to the final `</button>`.
2. Settings > Customize Toolbars and Keys....
3. Right-click the toolbar where it should go (empty space = append, on a button = insert after) / Paste. Works inside opened menus too.
4. OK in the Customize dialog.

Raw commands posted as text: New / New Button, edit it, paste into Function (multi-line: Advanced). Raw script with `OnClick`: same, then set Function to Script Function and pick JScript/VBScript. Script with `OnInit` is a Script Add-In, not a button.

Minimal valid button XML (forum-standard shape):
```xml
<?xml version="1.0"?>
<button display="both" separate="yes">
	<label>Install Font</label>
	<icon1>#otherplugins</icon1>
	<function type="normal">
		<instruction>Copy INSTALLFONT</instruction>
	</function>
</button>
```
Script button, as stored:
```xml
<button display="both" label_pos="right">
	<label>Hello</label>
	<function type="script">
		<instruction>@script jscript</instruction>
		<instruction>function OnClick(clickData)</instruction>
		<instruction>{ DOpus.Output("Hello"); }</instruction>
	</function>
</button>
```
Minimal `.dop` toolbar file (shape from `Buttons\Drives.dop`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<toolbar version="12.0">
	<buttons display="both" type="menu">
		<button display="both" label_pos="right">
			<label>Notepad</label>
			<tip>Open selected files in Notepad</tip>
			<function type="normal">
				<instruction>notepad.exe {f}</instruction>
			</function>
		</button>
	</buttons>
</toolbar>
```
- Menus nest: `<button type="menu">` with child `<button>`s. Icons `#name` are built-in icon set names.
- Whole toolbars: Customize / Toolbars page menu / Import Toolbar, Export Toolbar. Double-clicking a `.dop` imports it (dopusrt handles `.dop`). New file dropped in `Buttons\` and opened with `Toolbar NAME=... STATE=top` works live (`references/config-files.md`).
- `.dcf` = single button file, made by dragging a button to the desktop in Customize mode. Drag it onto a toolbar in Customize mode to add it. Double-clicking a `.dcf` **runs** it.
- Hotkeys: Keys tab page menu / Export (Importable Hotkey Format) and Import. Only true hotkeys are exported.

## Debugging a button
| Problem | Tool |
|---|---|
| what command line does my program get | replace the exe with `dopusrt /argsmsgbox`: `dopusrt /argsmsgbox {allfilepath}`. `/argstoclip` copies it instead |
| script errors, `@output` / `DOpus.Output` text | Utility Panel / Script Log. Also Help / Logs / Other Logs. Detail level: Preferences / Miscellaneous / Advanced / `script_output_level` |
| test while editing | advanced editor Run (F5), output panel opens under the editor. Add `@nodeselect` so selection survives |
| button never enables / hides | check `@disablenosel`, `@hideif` tests and `@requires` |
| DOS output vanishes | `@leavedoswindowopen` |

Forum alternative: DopTest (third-party, shows the generated command line in a console). `dopusrt /argsmsgbox` is built in and does the same, prefer it.

## Built-in icons and stock commands

Built-in icons are written `#name` in `<icon1>`. Seen in the default 13.11 toolbars: `#copyfilenames`, `#clipcopy`, `#clipcut`, `#clippaste`, `#copy`, `#delete`, `#makedir`, `#prefs`, `#customize`, `#home`, `#refresh`, `#favorites`, `#duplicate`, `#closetab`, `#closelister`. Full set: grep `Buttons\*.dop` for `<icon1>#`.

The stock "copy current folder path" command (Edit > Copy Other > Folder Path): `Clipboard COPYNAMES=unc FILE {sourcepath}`. Find any other stock command with `dopus.ps1 ui -Query <text>` and reuse its exact line.

## Recipes
**Copy the current folder's path with one click (button left of the Location field)**
The icon inside the Location field cannot do this (see `references/ui-map.md`). Add a separate button on the File Display toolbar:
```xml
<button backcol="none" display="icon" label_pos="right" no_label="yes" textcol="none">
	<label>Copy Folder Path</label>
	<tip>Copies the path of the current folder to the clipboard</tip>
	<icon1>#copyfilenames</icon1>
	<function type="normal">
		<instruction>Clipboard COPYNAMES=unc FILE {sourcepath}</instruction>
	</function>
</button>
```
Place it immediately before the `<button ... field_type="path_treepath">` element in `Buttons\File Display.dop`. By hand: Customize mode, copy the XML, right-click the toolbar spot left of the Location field, Paste. Check on screen which button is left of the Location field before naming it.

**Open selected files in an external editor**
```
"C:\Program Files\Notepad++\notepad++.exe" {allfilepath}
```
One instance with all files. Use `{f}` for one instance per file.

**Copy normally, move with Shift, make shortcuts with Ctrl+Shift**
```
@keydown:none
Copy
@keydown:shift
Copy MOVE
@keydown:ctrlshift
Copy MAKELINK
```

**Button only visible when images are selected**
```
@hidenosel:type=*.jpg
Image CONVERT=png
```

**Toggle button driven by a variable**
```
@toggle:if $glob:MyFlag
@if:$glob:MyFlag
@set glob:MyFlag
@if:else
@set glob:MyFlag=on
```

**Ask for a name, create folder, copy into it**
```
@set dir={dlgstring|Folder name}
CreateFolder ".\{$dir}"
Copy TO ".\{$dir}"
```

**Run an elevated cmd prompt in the current folder**
```
@admin
cmd.exe /k cd /d {sourcepath}
```

**New Lister in thumbnails mode (embedded function)**
```
Go /mypictures NEW
[Set VIEW=thumbnails]
```

**Same hotkey for both sides but bound per side**: in a File Display toolbar button's Hotkey control, press the key, choose Left, Add Alternative, press the second key, choose Right.

## Pitfalls
- Pasted XML does nothing → not in Customize mode, or only part of the XML was copied → copy from `<?xml` to the last `</button>`, right-click a toolbar in Customize mode / Paste.
- Edits lost → closed Customize with Cancel, or editor OK but not Customize OK → both OKs are needed.
- Edited a `.dop` on disk, no change → open toolbars are cached → close and reopen the toolbar, never edit one open in Customize mode (`references/config-files.md`).
- `dir`, `echo`, `del` fail as "unknown" → Standard function → switch to MS-DOS Batch Function.
- `copy` / `set` in a batch function run the Opus command instead → add `@externalonly`.
- Path with spaces breaks the program → manual quotes doubled with Opus auto-quoting → remove your quotes or use `@nofilenamequoting`. Check with `dopusrt /argsmsgbox`.
- Several Notepad windows open at once / one at a time → sync vs async defaults → `@sync` / `@async`.
- Hotkey works only in some places → it's a Lister key → make a System-wide hotkey (Keys / New / New System-wide Hotkey).
- Hotkey dead after hiding Menu/Operations toolbar → toolbar's Always enable this toolbar's keys in Listers is off.
- Hotkey conflicts → Keys tab / Conflicts category.
- Double-click on a menu button does not open its editor → right-click / Edit. To edit items inside a menu, click it once in Customize mode to open it.
- Lost the Customize command → Lister window icon (top-left) / Customize.
- Default toolbars cannot be deleted. Turn them off or reset them instead.
- `FileType OPENWITHMENU` on a top-level toolbar shows stale entries → put it inside a menu.
- `@label` is documented only as TOBEDONE in the manual. Copy patterns from the default toolbars (Customize / Default Toolbars) instead of guessing.
- WSL function page in the manual is TOBEDONE. Batch and WSL XML `type=` values not confirmed from local files [unverified].
