# Preferences: Launching Opus, Layouts and Styles, Location Bar

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- prefs.launching.overview: Launching Opus category
- prefs.launching.explorerreplacement: Explorer Replacement page
- prefs.launching.triggers: From the Desktop, From the Taskbar Icon, From the Win + E hotkey
- prefs.launching.startup: Startup page
- prefs.launching.shutdown: Shutdown page
- prefs.layouts.defaultlister: Default Lister page
- prefs.layouts.layouts: Layouts page
- prefs.layouts.styles: Styles page
- prefs.locationbar.overview: Location Bar category
- prefs.locationbar.options: Location Bar Options page
- prefs.locationbar.pathfields: Path Fields page (breadcrumbs behaviour)
- prefs.locationbar.appearance: Appearance, Components, Menus pages
- prefs.locationbar.completion: Path Completion page
- prefs.locationbar.toolbars: Location Bar Toolbars page
<!-- contents:end -->

## prefs.launching.overview | Launching Opus category
src: 0264 | area: prefs
ui: Preferences / Launching Opus / (Explorer Replacement, From the Desktop, From the Taskbar Icon, From the Win + E hotkey, Startup, Shutdown)
user-words: how opus starts, open windows from outside
see: prefs.launching.startup

## prefs.launching.explorerreplacement | Explorer Replacement page
src: 0265 | area: prefs
ui: Preferences / Launching Opus / Explorer Replacement
user-words: replace explorer, open folders in opus, open new tab instead of new window, exclude folder from replacement
options (radio group): `Don't replace Explorer`, `Replace Explorer for all file system folders` (virtual folders like Recycle Bin still open in Explorer), `Replace Explorer for all folders`, `Replace Explorer for all but the following folders` (list)
options:
- `Open a new tab instead of a new window` (when intercepting an action that would open Explorer)
- `Open all Default Lister tabs when opening a new window` (opens the whole Default Lister first, then an extra tab for the folder)
notes: Does not affect system Open/Save dialogs. Win+E has its own page on Windows 10+. Any choice except `Don't replace Explorer` activates replacement.
see: concept.explorer-replacement

## prefs.launching.triggers | From the Desktop, From the Taskbar Icon, From the Win + E hotkey
src: 0266, 0267, 0268 | area: prefs
ui: Preferences / Launching Opus / (From the Desktop, From the Taskbar Icon, From the Win + E hotkey)
user-words: double click desktop opens opus, tray icon double click, win e opens explorer, win e opens opus, dopusrt restart
what: Each page is a radio group choosing the action for that trigger.
options:
- From the Desktop: `Disable`, `Bring the last active Lister to the front` (opens Default Lister if none), `Open the Default Lister`, `Open a saved Lister layout` (+ `Close existing Listers`, `Close Listers on all virtual desktops`), `Run a command` (any button/hotkey command, or a user command name). Works even when Opus is not running via helper `DOpusRT.exe` (hooks Explorer by code injection, anti-virus may block it). `Restart DOpusRT.exe` button (also warns if Opus runs elevated, which blocks messages from Explorer), `Delay DOpusRT.exe` (seconds, for startup conflicts)
- From the Taskbar Icon: `Add icon to taskbar notification area` (Windows may hide it in overflow, pin it visible), then double-click action: `Do nothing on double-click`, `Bring the last active Lister to the front`, `Open the Default Lister`, `Open a saved Lister layout`, `Run a command`. Right-click menu is editable
- From the Win + E hotkey (Windows 10+ only, needs Explorer Replacement available): `Open File Explorer as normal`, `Bring the last active Lister to the front`, `Open the Default Lister`, `Open a saved Lister layout`, `Run a command`
notes: Before Windows 10, Win+E opens This PC in the default file manager; customise with a System-Wide Hotkey instead. Do not use both methods on Windows 10+.

## prefs.launching.startup | Startup page
src: 0269 | area: prefs
ui: Preferences / Launching Opus / Startup
user-words: start with windows, stop opening windows at boot, reopen previous windows, restore session, run on startup
what: Two checkboxes then a radio group.
options:
- checkbox `Launch Directory Opus automatically on system startup` (Start menu Startup group shortcut)
- checkbox `Don't open any Listers` (no windows at Windows boot; applies to boot only, the group below still applies when Opus is started manually later)
- group `What happens when Opus starts up` (radio): `Open the Default Lister`; `Open the Listers that were open when the program was last closed` (+ checkboxes `Backup open Listers automatically` on a schedule and at shutdown, `Restore each Lister to its original virtual desktop`); `Open a saved Lister layout`; `Run a command`
- checkbox `Always perform startup action` (also when Opus is started to open a given folder)
notes: Session restore comes from `State Data\openlisters.oll` under /dopuslocaldata. To get exactly one window at boot choose `Open the Default Lister` and set the Default Lister (see lister.defaultlister). Windows adds a startup delay for Startup-folder programs (Miscellaneous / Windows Startup Delay).
see: lister.defaultlister, prefs.layouts.defaultlister, prefs.misc.windowsintegration

## prefs.launching.shutdown | Shutdown page
src: 0270 | area: prefs
ui: Preferences / Launching Opus / Shutdown
user-words: exit when last window closes, keep opus in background
options:
- `Shutdown Directory Opus when all functions finish` (exits after the last Lister closes and no background function runs; breaks system-wide hotkeys and floating toolbars)

## prefs.layouts.defaultlister | Default Lister page
src: 0272 | area: prefs
ui: Preferences / Layouts and Styles / Default Lister
user-words: new window opens on last folder, fixed starting folder, where new windows appear, virtual desktops
options:
- `Ignore folder format of Default Lister`, `Ignore toolbars of Default Lister` (use Default Toolbar Set, update via `Settings / Toolbars / Set As Default Toolbar Set`), `Update Default Lister automatically when closing a Lister`
- positioning: `In a fixed position relative to the monitor the mouse is on`, `Always in the same position`, `Always over the mouse pointer`
- virtual desktops: `Always open Default Lister on the current desktop`, `Avoid switching desktops to find existing Listers`
notes: Set the default manually from a Lister: Settings menu command (manual: `Set As Default Lister`, 13.11 menu: `Set Lister Defaults`, `Prefs SETLISTERDEFAULTS`).
cmd: `Prefs SETLISTERDEFAULTS`
see: lister.defaultlister

## prefs.layouts.layouts | Layouts page
src: 0273 | area: prefs
ui: Preferences / Layouts and Styles / Layouts (`Prefs PAGE=layouts`, `Prefs LAYOUTEDIT`)
user-words: manage layouts, layout flags, update layout, layout shortcut on desktop
what: List of saved layouts with preview. Toolbar: `New Layout` (saves all open Listers; same name overwrites), `New Folder`, `Edit`, `Rename`, `Delete`, `Insert Separator`, Move Up/Down/Sort (order used in menus), Create shortcut (or drag to desktop). Flag letters shown per layout: `C` close existing, `A` close on all virtual desktops, `F` use saved folder formats, `T` use saved toolbars, `M` relative to mouse monitor, `V` restore virtual desktop, `H` hidden.
options:
- Edit Layout: `Name`, `Description`, the seven load options (same as layouts.concept), `Update` button (closes your Listers temporarily, opens the layout for changes, OK saves it, previous Listers return)
notes: Hidden layouts still load with `Prefs LAYOUT`. Desktop shortcut name template: Advanced option `layout_string` (contains `%1`).
see: layouts.concept

## prefs.layouts.styles | Styles page
src: 0274 | area: prefs
ui: Preferences / Layouts and Styles / Styles (`Prefs PAGE=styles`, `Prefs STYLEEDIT`)
user-words: create style, style that hides tree, style opens tabs
what: Edit Lister Style: `Name`, `Description`; each element has a checkbox (off = style leaves it alone).
options:
- elements: `File Display` (Single, or Dual horizontal/vertical, optionally with Navigation Lock), `Folder Tree` (off/on, dual trees), `Viewer Pane` and `Metadata Pane` (off, or on horizontal/vertical), `Toolbar` (toolbar or set), `Utility Panel` (off/on and mode Find, Synchronize, Duplicates), `Status Bar`, `Format Lock`, `Filmstrip`
- per display (Left and Right File Display tabs): `Tab Group` (overrides the rest), `Close existing folder tabs`, `View Mode` (incl. `Auto` = folder's own default via Folder Formats), `Format`, `Flat View`, `Folder`
cmd: `Prefs STYLE="name"`
see: layouts.styles

## prefs.locationbar.overview | Location Bar category
src: 0275 | area: prefs
ui: Preferences / Location Bar / (Options, Path Fields, Appearance, Components, Menus, Path Completion, Toolbars)

## prefs.locationbar.options | Location Bar Options page
src: 0276 | area: prefs
ui: Preferences / Location Bar / Options
user-words: path bar icon, close button on location bar, copy swap buttons, header icon, layout toggle button
options:
- `Align other panel headings with the Location Bar` (not with several toolbars), `Close button`, `Close only closes active tab`, `File display Copy and Swap buttons` (Duplicate/Swap), `Horizontal/vertical Layout button`
- `Icon`: a Directory Opus icon at the left of the border (the border, not inside the breadcrumbs field). Drag it to create a shortcut to the current folder, right-click for the folder's context menu.
- `Left-click on destination Location Bar elements`: whether clicking a destination location bar makes it the source
notes: The folder icon inside the breadcrumbs field is a different element with no setting here.
see: ui.breadcrumbs

## prefs.locationbar.pathfields | Path Fields page (breadcrumbs behaviour)
src: 0277 | area: prefs
ui: Preferences / Location Bar / Path Fields
user-words: breadcrumbs drag, ghost crumbs, edit path cursor position, f2 breadcrumb
options:
- `Allow drag and drop from path field to itself`, `Allow drag and drop from path field without holding Ctrl or Shift` (off = drag makes shortcuts), `Append ghost components for previous folders after going up` (+ `Draw using italics`, `Keep matching sub-folders after navigation`), `Hotkey opens left-most menu instead of editing path` (for example F2), `Put cursor at end of path when editing begins` (off = whole path selected), `Select previous folder when going up`
notes: No option here controls the folder icon inside the breadcrumbs field.

## prefs.locationbar.appearance | Appearance, Components, Menus pages
src: 0278, 0279, 0280 | area: prefs
ui: Preferences / Location Bar / (Appearance, Components, Menus)
user-words: breadcrumb arrow width, show this pc in path, ftp name in path, hide hidden folders in breadcrumb menu
options:
- Appearance: `Arrow width`, `Icon padding left/right`, `Label padding left/right`, `Maximum label width` (DPI scaled)
- Components: `Show drive labels as`, `Insert Network component before UNC paths` (+ `Display as small icon`), `Insert This PC Component before drives` (+ `Display as small icon`), `Show FTP address book names` (+ `Show host details as well`)
- Menus (breadcrumb drop-downs; most default to the Folder Tree Contents setting): `Archives`, `Desktop sub-folders`, `Empty drives`, `Favorites`, `Hidden folders`, `System folders`, `Non-drive folders under This PC`

## prefs.locationbar.completion | Path Completion page
src: 0281 | area: prefs
ui: Preferences / Location Bar / Path Completion
user-words: autocomplete path, path suggestions popup, tilde shortcut path
options:
- `Path completion in path fields`, `Complete paths for local drives only`, `Complete network server names`, `Display popup list`, `Only complete when ↑ or ↓ are pressed`
notes: Accept completion with `:`, `/`, `\` or Enter, cycle with Up/Down. Also completes `%env%` variables, `/aliases`, URL paths (`coll://`, `ftp://`). At the very start of the field: `~` profile folder, `` ` `` desktop folder, `$` documents, `*` favorites, `}` Windows folder, `^` System folder, `#` Program Files.

## prefs.locationbar.toolbars | Location Bar Toolbars page
src: 0282 | area: prefs
ui: Preferences / Location Bar / Toolbars (`Prefs PAGE=fdbtoolbar`); Settings > Toolbars > Choose Location Bar Toolbars...
user-words: turn off file display toolbar, static header mode, dock listers by dragging, up button back
options:
- `Display as a toolbar` (default; choose one or more toolbars, factory is `File Display`) or `Display as a static header`
- static header options: `Allow docking of Listers` (drag one single-display Lister's title bar onto another to make dual display; drag from the location bar to split), `Clickable path components in headerborder`, `Header's Up button does "Up + Back"` (`Go UP BACK`), `Show header even in single display mode`
cmd: `Set FDBTOOLBAR=<name>`
