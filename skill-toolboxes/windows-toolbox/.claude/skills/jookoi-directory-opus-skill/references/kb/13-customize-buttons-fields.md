# Customize: dialog, editing toolbars, button kinds, fields, command editor

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- customize.concept: Customize mode and the Customize dialog
- customize.toolbarspage: Customize / Toolbars page
- customize.contextmenus: Customize / Context Menus page
- customize.keys: Customize / Keys page (hotkeys)
- customize.commands: Customize / Commands page
- customize.usercommands: Customize / User Commands page
- customize.defaulttoolbars: Customize / Default Toolbars page
- customize.buttons: Buttons: what they are
- customize.editing: Editing the toolbar (add, move, copy, delete)
- customize.launchoptions: Launch Options dialog (drop a program on a toolbar)
- customize.contextmenus.buttons: Customize-mode context menus (button, menu, field, toolbar)
- customize.threebutton: Multiple-function (three-button) buttons
- customize.dropdown: Drop-down buttons: menu vs menu button
- customize.dynamic: Dynamic buttons
- customize.drivebuttons: Go DRIVEBUTTONS configuration
- customize.fields: Field buttons
- ui.breadcrumbs: Breadcrumbs location field and the icons around it
- customize.sharing: Sharing buttons and toolbars
- customize.commandeditor: Command Editor (button/hotkey properties)
<!-- contents:end -->

## customize.concept | Customize mode and the Customize dialog
src: 0321 | area: customize
ui: Settings > Customize Toolbars and Keys...; right-click empty toolbar space > Customize; Lister window icon (top-left) > Customize; desktop context menu (Windows Integration option); `Prefs CUSTOMIZE`
user-words: edit toolbar, edit menu, add a button, change hotkeys, customise opus
what: Modal: while in Customize mode all toolbars are editable and normal Lister work is suspended. Make edits, leave Customize (OK), then test. Manual references describe default toolbars only. While in Customize mode a mini-toolbar in each Lister title bar returns to the dialog (label brings it forward, check/cross = OK/Cancel).
options:
- tabs: `Toolbars`, `Context Menus`, `Keys`, `Commands`, `User Commands`, `Default Toolbars`
- page menu (top-right): `Import`, `Export` (depend on the page), `Save Floating Toolbars`, `Factory Reset`, `Undo Changes` (selection on the page), `Undo All Changes` (same as Cancel)
- reset defaults: toolbar context menu `Factory Reset this Toolbar`, `Toolbars` submenu > `Factory Reset Toolbars`, Settings > Toolbars > Factory Reset Toolbars, or the Toolbars page
notes: Edits are saved when the Customize dialog is closed with OK, and discarded with Cancel (reverts all toolbar changes made since entering).
cmd: `Prefs CUSTOMIZE`
see: customize.toolbarspage, customize.editing

## customize.toolbarspage | Customize / Toolbars page
src: 0322 | area: customize
ui: Customize / Toolbars tab (`Prefs PAGE=toolbarsets` is the sets page)
user-words: turn toolbar on off, hide toolbar, float toolbar, toolbar background, format painter, always enable keys
what: List of toolbars grouped as standard (cannot delete or rename) and user. Checkbox on/off, buttons to create, delete, float (separate floating copy). Right-click = context menu (standard toolbars: reset). Double-click flashes the toolbar instances to locate them.
options:
- per toolbar: `Image size` (small/large/default), `Image state`, `Label state`, `Highlight border` (on/off/default override each button), `Label color`, `Font`, `Always enable this toolbar's keys in Listers` (used by Menu and Operations so Ctrl+A etc. work when hidden)
- `Format painter`: copy icon/label/colour of one button to others (click source, drag over targets; also in a button's context menu). It clears conflicting override flags as needed
- custom background colour/image per toolbar, `Submenus inherit background`
- page menu: `Import Toolbar`, `Export Toolbar` (share)

## customize.contextmenus | Customize / Context Menus page
src: 0323 | area: customize
ui: Customize / Context Menus tab
user-words: edit column header menu, tab context menu, tray icon menu, file display background menu
what: Fixed set of editable menus (cannot create new): file display background menus (by folder type), `Column Header`, `Copy Highlighted Cells`, `Folder Tabs`, `Image Viewer`, `Tray Icon`; backups of menus replaced during an upgrade appear in a Backups category. File and folder item menus are NOT here: use File Types. Edit via double-click, right-click > Edit, or toolbar button. `Edit alongside default` shows a read-only default beside yours to drag commands back. Same Options as toolbars.
see: filetypes.contextmenu

## customize.keys | Customize / Keys page (hotkeys)
src: 0324 | area: customize
ui: Customize / Keys tab
user-words: change shortcut, keyboard shortcut conflicts, system-wide hotkey, export hotkeys, f4 location
what: Lists every key assignment (checkbox disables temporarily). Categories: Conflicts, Lister keys (Hotkeys, Toolbars, Inactive Toolbars, Folder Tree, Quick Keys, Favorite Folders), System-wide keys (Hotkeys, Floating Toolbars, Tray Menu), Viewer keys (Hotkeys, Toolbar). Filter fields by key and by command. Example: the Location field has three keys by default: `F4`, `Alt+D`, `Ctrl+L`.
options:
- `New` menu: `New Lister Hotkey`, `New System-wide Hotkey`, `New Folder Tree Hotkey`, `New Viewer Hotkey` (only these four can be created or deleted here; others are made in situ, for example on the button, or in Preferences for Quick Keys and Favorites)
- `Change Key` field edits most existing keys (not Quick Keys or Favorite Folders)
- page menu import/export: `Importable Hotkey Format` (keys + functions, only true hotkeys), `Comma-Separated List` (names and descriptions, all types), `Text Format`
see: customize.hotkeycontrol, hotkeys.systemwide

## customize.commands | Customize / Commands page
src: 0325 | area: customize
ui: Customize / Commands tab
user-words: add a pre-made button, find a command to add, drag command to toolbar
what: Pre-defined commands in categories (search field bottom). Selecting one shows description, origin and the underlying raw command. Drag to a toolbar or menu. The `New` category holds `New Button`, `New Menu`, `New Menu Button`, `Spacer`; field buttons are dragged from here too.
notes: These are only a starting point; any internal command can be typed in the Command Editor.

## customize.usercommands | Customize / User Commands page
src: 0326 | area: customize
ui: Customize / User Commands tab
user-words: make my own command, custom command alias, command with arguments
what: User-defined commands behave like internal commands (callable from buttons, menus, Preferences command fields). Fields: `Name` (raw name), `Label`, `Description` (default tooltip), `Template` (argument template, same syntax as internal commands), `Hide from Commands menu`.
options:
- arguments inserted with `&NAME&` in the function. Example: template `EXT`, function `Select *.&EXT&`, call `Select_Files_Of_Type txt` runs `Select *.txt`
- switch arguments: `/S` switch inserts 1 or 0, `&EXAMPLE1:yes:no&` chooses strings; `/O` option switch takes off, on, or a value (a passed value is used unchanged). Template `EXAMPLE/O[<default>,one,two,three]` lists values and default
- conditional: `@if:&&EXAMPLE&&=one C:\Program1.exe @if:&&EXAMPLE&&=two C:\Program2.exe @if:else C:\DummyProgram.exe`; evaluator `Arg("NAME")` (`@if:=(Arg("NAME")=="jon") echo Hi Jon! @if:else echo Who are you?`)
see: commands.argtypes

## customize.defaulttoolbars | Customize / Default Toolbars page
src: 0327 | area: customize
ui: Customize / Default Toolbars tab
user-words: new buttons since upgrade, get default button back, find where a command is in default toolbars
what: Shows the default toolbars (six listed here). Drag any button or menu out to your own toolbars. Slider on the left highlights buttons added or changed since a version (for example 13.0). `Turn on all button labels`, scroll arrows (highlighted if a new button is out of view), search field highlights matching commands.

## customize.buttons | Buttons: what they are
src: 0327 | area: customize
ui: n/a
user-words: how do buttons work, button function types
what: Every toolbar/menu button runs one or more commands: internal commands (with arguments), external commands (programs; codes pass selected file names), or scripts (VBScript/JScript buttons). Buttons and drop-down menus are the same thing (a menu is a vertical toolbar). Everything can be edited, deleted, or turned off. Reset: right-click any toolbar > reset to defaults.
see: commands.codes, scripting.concept

## customize.editing | Editing the toolbar (add, move, copy, delete)
src: 0328 | area: customize
ui: Customize mode; Preferences / Toolbars / Options (`Alt + left-click to edit toolbar buttons`)
user-words: add button, move button, delete button, copy button, separator, spacer, group
what: In Customize mode fields become frames (resizable grips, or no grips = Full Width) and hidden buttons (for example Toolbar Marker) appear. Shift+click runs a button without leaving Customize. Toolbars that overflow get scroll arrows at the right edge.
options:
- edit: double-click, or right-click > Edit (Command Editor). Menu buttons: right-click > Edit only; open the menu with one click to edit items
- add predefined: drag from Commands tab to a toolbar (hover over a menu to drop inside)
- add empty: Commands > New > `New Button`; or right-click toolbar empty space > New > New Button; or right-click a button > Insert New > New Button
- add program button: drag its .exe/shortcut onto the toolbar (Launch Options dialog; Ctrl while dropping forces it to appear). Add folder button: drag a folder
- copy: Ctrl+drag, or right-click > Copy then Paste on empty space (end of toolbar) or on a button
- move: drag, or Cut then Paste. Into/out of menus by hovering or via opened menu
- delete: drag button onto the Customize dialog, or right-click > Delete
- new menu: Commands > New > `New Menu` / `New Menu Button`, or right-click > New / Insert New
- separator: drag a button a few pixels right, or right-click > `Begin a Group` (toggle to remove; drag a few pixels left)
- gap/right-align: `Spacer` (Commands > New > Spacer, or Insert New > Spacer); right-click > `Full-width` to right-justify what follows
notes: If Customize Toolbars is unreachable use the Lister window icon menu > Customize.
notes: [unclear] Where Paste / Insert New puts the button relative to the right-clicked one: the editing page says immediately after it, the context-menu page says to the left of it. Check on screen, or place the XML in the `.dop` file yourself.
see: customize.fields, customize.sharing

## customize.launchoptions | Launch Options dialog (drop a program on a toolbar)
src: 0329 | area: customize
ui: appears when dropping a .exe or its shortcut on a toolbar in Customize mode
user-words: button to launch program, pass selected files to program, start in folder, run once per file
options:
- `Defaults`, `Send files and folders to the program`, `Only via drag and drop`, `Files only`, `Folders only`, `Require files/folders`, `Send everything on a single line` (off = one run per file), `Deselect files and folders after clicking the button` (no effect if `Deselect files used in functions` is off), `Pass current directory as the first argument`, `Asynchronous` (off = wait per file; add `@noprogress` to hide the progress dialog)
- `Start in`: `Current folder (least secure)`, `Program's folder (default)`, `System32 folder`; `Allow shortcuts to override`
- `Use options for future buttons` (Ctrl while dropping brings the dialog back)
- Command preview: read-only `Generated command`, `Test items` list, `Test Run`; OK keeps the button, Cancel deletes it
notes: Dialog does not appear if not in Customize mode (a drop then sends files to the button), if `Always use these settings` is on, for non-exe drops, or MSI shortcuts. Closing the toolbar or Customize while the dialog is open keeps the button in a default state.

## customize.contextmenus.buttons | Customize-mode context menus (button, menu, field, toolbar)
src: 0330 | area: customize
ui: right-click in Customize mode
what: Regular button: `Cut`, `Copy`, `Paste` (inserts left of the clicked button), `Delete`, `Edit`, `Three Buttons`, `Begin a Group`, `Format Painter`, `Insert New`. Drop-down menu: no Three Buttons, adds `Convert to Menu Button`. Menu button adds `Always Enable Drop-down` (arrow works even if the button part is disabled, used by Up) and `Hold or Right-Click to Drop Down` (hides the arrow). Field button: `Field Type`, `Full Width`, `Restore Focus`. Toolbar empty space: `Customize`, `Factory Reset this Toolbar`, `New`, `Paste` (to end), `Toolbars` (list, `Factory Reset Toolbars`), `Lock the Toolbars`, `Close`.

## customize.threebutton | Multiple-function (three-button) buttons
src: 0331 | area: customize
ui: Customize mode: right-click button > Three Buttons
user-words: right click button action, middle click button, different action per mouse button
what: Up to three functions: left click (primary), right click, middle click (Ctrl+left if `Simulate middle mouse click with Ctrl + left click` is on). Convert a single button; in Customize it opens like a menu where the first child is the left-click function; add up to two more. The tooltip shows LMB / RMB / MMB prefixes.

## customize.dropdown | Drop-down buttons: menu vs menu button
src: 0332 | area: customize
ui: Customize mode: right-click > Convert
user-words: submenu, split button, cascading menu
what: `Menu` (button that only shows a menu) and `Menu Button` (button part runs a function, arrow part opens the menu). Convert switches (first menu item becomes the button part and back). Edit only via right-click > Edit. Open the menu once to edit its items. Top-level `&` in a label marks an Alt accelerator (`Re&name` = Alt+N), `&&` for a literal ampersand; the button hotkey applies to the button part.

## customize.dynamic | Dynamic buttons
src: 0333 | area: customize
ui: Customize mode (shown as a normal button)
user-words: drive buttons generated, favorites list as buttons
what: A single button that, outside Customize mode, is replaced by generated items (drives, favorites, FTP sites, layouts, styles). Example `Go DRIVEBUTTONS`.
see: customize.drivebuttons

## customize.drivebuttons | Go DRIVEBUTTONS configuration
src: 0334 | area: customize
ui: edit the button that runs `Go DRIVEBUTTONS`
user-words: only usb drives, hide empty card readers, left and right drive buttons, drive letters on icons
what: `Go DRIVEBUTTONS=<params>` (comma separated).
options:
- which: `fixed`, `network`, `cdrom`, `removable`, `ramdisk`, `offline`, `online`, `hideempty`, `+<letters>` only those, `-<letters>` exclude (examples `Go DRIVEBUTTONS=removable,cdrom,-P`, `Go DRIVEBUTTONS=hideempty,removable`)
- target file display (combine with other Go args): `NEW`, `NEWTAB`, `OPENINDEST`, `OPENINDUAL`, `OPENINLEFT`, `OPENINRIGHT`, `USEQUALKEYS` (Ctrl dual, Shift new Lister, Alt new tab); `multifunc` (left = left display, right = right display, middle = new Lister), `multifunctabs` (open tabs); `CURDIR` (last used folder per drive, remembered across sessions; selecting current drive goes to root); `KEYARGS`
- appearance (inherits from the parent button; no icons: edit parent Show image): `iconletterson`, `iconlettersoff`, `labels`, `lettersbeforelabels`, `noletters`
notes: Typical two-sided set: `Go DRIVEBUTTONS=fixed OPENINLEFT`, `Go DRIVEBUTTONS=cdrom,network,removable,ramdisk OPENINLEFT`, spacer, then the same with `OPENINRIGHT`.
cmd: `Go DRIVEBUTTONS`

## customize.fields | Field buttons
src: 0335 | area: customize
ui: Customize / Commands tab (field entries, dragged only); right-click a field in Customize mode > Field Type
user-words: location field on toolbar, search box on toolbar, filter box, spacer, thumbnail slider, breadcrumbs field
what: Field buttons cannot be made from a new button; drag them from the Commands list, then change type via right-click. Options `Full Width` (fills spare space; several share it) and `Restore Focus` (Enter returns focus to the file display). Field types in XML are `field_type=`; for example the breadcrumbs field is `path_treepath` (observed in `File Display.dop`).
options:
- types: `Content Type` (shows/switches the content type format), `Drives` (drive list), `Filter`, `Label` (static text; bold left-aligned in menus), `Path (Basic)`, `Path (Breadcrumbs)`, `Path (Favorites List)`, `Path (Folder Tree)`, `Path (Recent List)`, `Search Field` (Windows Search), `Spacer`, `Thumbnail Size` (hidden outside thumbnails mode; Args `both`, `source`, `dest`, `left`, `right`; `preserve` keeps aspect ratio, comma separated like `left,preserve`)
- path fields Args (edit the button, Args field): `left`, `right`, `dest` (always control that display), `focus` (make it source when the folder changes). Breadcrumb appearance/behaviour: Preferences / Location Bar / Path Fields
- filter field Args: `files`, `folders`, `both`, `hide`, `nopartial`, `norealtime`, `noautocontent`
- drive list Args: `curdir` (default), `curdir,rootmode`, `left`, `right`, `dest`, `nofocus`, `labels`, plus the drive filters `fixed`, `network`, `cdrom`, `removable`, `ramdisk`, `offline`, `online`, `hideempty`, `+<letters>`, `-<letters>` (example `left,fixed,cdrom,-e,hideempty`)
notes: Many buttons change state dynamically (checked, enabled, hidden), for example a compatibility-files button appears only in matching folders.
see: ui.breadcrumbs

## ui.breadcrumbs | Breadcrumbs location field and the icons around it
src: 0013, 0276, 0335, 0336 | area: customize
ui: File Display toolbar; Preferences / Location Bar / (Path Fields, Options)
user-words: url bar, address bar, folder icon in address bar, path bar icon, copy path, click path
what: The breadcrumbs field is a toolbar field of type `Path (Breadcrumbs)`. Do not confuse two "icons": (1) the Location Bar `Icon` (Directory Opus icon at the left of the file display border; drag = shortcut to the current folder, right-click = folder context menu; setting Location Bar / Options / Icon), and (2) the current-folder icon inside the left edge of the breadcrumbs field. Manual pages have no setting or description for (2). Observed on 13.11: clicking it only highlights the path text; the staff forum says it cannot be hidden or rebound `[forum thread "Remove location/folder icon from Location Bar", not in manual]`.
notes: Copy path without selecting: add a separate button before the field with `Clipboard COPYNAMES=unc FILE {sourcepath}` (see references/customize.md recipe). Path-edit hotkeys by default: `F4`, `Alt+D`, `Ctrl+L`.
see: nav.locationbar, prefs.locationbar.options

## customize.sharing | Sharing buttons and toolbars
src: 0339 | area: customize
ui: Customize mode: right-click button > Copy
user-words: share button, paste button xml, send my toolbar to a friend
what: Copy a button or whole menu in Customize mode; the clipboard holds XML. Paste into a text editor or into a Lister (Edit > Paste creates a text file) to share. Receiver copies from `<?xml version="1.0"?>` through the final `</button>`, enters Customize mode and pastes (right-click toolbar > Paste). Toolbars: `Export Toolbar` / `Import Toolbar` on the Toolbars page.

## customize.commandeditor | Command Editor (button/hotkey properties)
src: 0340 | area: customize
ui: double-click a button in Customize mode; Customize / Keys or User Commands
user-words: edit button label icon tooltip hotkey, start in folder, run hidden
options:
- `Images` (primary and secondary with `Dual image` for hover), `Show image`, `Large image size`, `No highlight border`, `Colors` (text/background override; none for hotkeys), `Label` (`Show label`, position relative to image; `&` accelerator, `&&` literal, `\t` aligns a hint on the right, for example `&Paste\tCtrl+V`; the label does not define a key), `Tip` (`\n` = new line), `Hotkey`
- `Function` (simple = one line, `Advanced` button = multiple lines), `Start in` (external programs only), `Run` (`Normal Window`, `Minimized`, `Maximized`, `Hidden`; Hidden hides DOS flashes but risks invisible programs)
- hotkeys: button hotkeys in Lister toolbars are local, floating-toolbar hotkeys are global; a hotkey-only function has the `System-wide Hotkey` option; a hotkey on a menu opens it
- toolbar-level settings (Images & Labels on the Toolbars tab) can override Show image, Large image size and Show label
see: commands.simpleeditor, commands.advancededitor
