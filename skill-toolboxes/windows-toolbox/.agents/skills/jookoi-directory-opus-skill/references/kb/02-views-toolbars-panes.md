# View modes, dual display, toolbars, panes, layouts, styles, themes

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- view.modes: View modes
- view.dual: Dual display
- view.navlock: Navigation Lock
- toolbars.concept: Toolbars and menus (concept)
- toolbars.default: The default toolbars
- toolbars.menu: Menu toolbar
- toolbars.operations: Operations toolbar
- toolbars.filedisplay: File Display toolbar
- toolbars.images: Images toolbar
- toolbars.dynamic: Toolbars that appear automatically
- toolbars.sets: Toolbar sets
- find.fayt: Find-as-you-type (FAYT) field
- panes.viewer: Viewer pane
- panes.metadata: Metadata pane
- panes.utility: Utility panel
- layouts.concept: Lister layouts
- layouts.styles: Lister styles
- themes.concept: Themes
- panes.statusbar: Status bar
- concept.explorer-replacement: Explorer Replacement
- concept.sourcedest: Source and destination
- select.commands: Selecting files automatically
<!-- contents:end -->

## view.modes | View modes
src: 0025 | area: view
ui: View menu (Menu toolbar); Preferences / File Display Modes / (Details, Power Mode, Thumbnails, Tiles)
user-words: icons view, list view, details, thumbnails, tiles, big icons
what: Modes: Large icons (Windows size, normally 32px), Small icons (16px), List (small icons in columns that scroll horizontally, most files on screen), Details (table with columns, Ctrl+mouse wheel changes font size), Details+Thumbnails (Details with a Thumbnail column, the column width sets thumbnail size, default aspect 16:9), Power, Thumbnails, Tiles. Three quick buttons on the Menu toolbar: Details, Details + Thumbnails, Thumbnails.
notes: Details+Thumbnails is not a separate mode, it is Details plus the Thumbnail column (default width: File Display Columns / Appearance / Default width). A Thumbnail column next to Name is treated as one column for selection. Details and Power pages set the thumbnail aspect ratio, border, and hiding the file icon when the Thumbnail column is shown.
notes: Power mode looks like Details (a small dot in the Name header marks it) but mouse/keyboard behaviour is far more configurable and it keeps selection when clicking empty space (persistent selection, changeable). Power mode appears in menus only if `Display Power mode toolbar buttons` is on.
notes: Thumbnails mode: size/appearance on File Display Modes / Thumbnails, optional size and image dimensions under each thumbnail, Images toolbar auto-shows, Ctrl+mouse wheel resizes. Files without a thumbnail show their type icon. Tiles: large icons or thumbnails plus extra info per file type (set in File Types, see Tiles Mode page). Info tips show on hover in modes without info columns (configured in File Types).
cmd: `Set VIEW=Details` (also LargeIcons, SmallIcons, List)
see: formats.concept, prefs.modes.overview

## view.dual | Dual display
src: 0026 | area: view
ui: Menu toolbar buttons Dual Horizontal / Dual Vertical; F6; Preferences / File Displays / Options
user-words: two panels, split window, side by side, second pane, commander style
what: Two independent file displays in one Lister, each with its own folder and tabs. One is source, the other destination. F6 toggles single/dual in the last used layout (horizontal = one above the other, vertical = side by side). On entering dual display the current folder is duplicated into the new display by default (option: always a given folder or tab group, on File Displays / Options).
notes: Copy/move between displays with drag and drop, copy and paste, or `Copy Files` (source to destination).
cmd: `Set DUAL=toggle`, `Go OPENINDUAL`

## view.navlock | Navigation Lock
src: 0027 | area: view
ui: Navigation Lock button on the Menu toolbar; Folder menu
user-words: sync navigation, mirror browsing, navlock, lock panes together
what: In dual display, records the two current folders as bases. Navigation on one side is replayed on the other when possible (same structure on two drives, local vs FTP).
notes: If the other side has no matching folder the displays go out of sync and a message offers: ignore, navigate back manually, reset the sync position (current folders become the new bases, NavLock stays on), or turn it off. NavLock is per Lister, not per tab pair: switching tabs resets the bases. For multi-tab use, linked tabs (a Navigation Lock mode exists for linked tabs only).
see: tabs.link, nav.pairedfolders

## toolbars.concept | Toolbars and menus (concept)
src: 0028 | area: toolbars
ui: Settings / Customize Toolbars and Keys...; Settings / Toolbars
user-words: toolbar, menu bar, buttons, ribbon, customise buttons
what: Toolbars and menus are the same thing, all configurable via Customize. Buttons run internal commands, scripts or external programs and can pass selected files. Buttons can have hotkeys (can be always enabled even when the toolbar is closed). Toolbars can be in the Lister, floating, or both (multiple floating copies possible). Buttons show a label, an image, or both. Toolbars can auto-appear for view modes or folders. Toolbars can be saved as sets. Layouts can store their own toolbars.
notes: Default Toolbar Set = the toolbars a Lister opens with when its layout does not define its own. Update it with `Settings / Toolbars / Set As Default Toolbar Set` (13.11 menu: `Set As Default Toolbar Set` under Settings > Toolbars). Opus ships five factory default toolbars (cannot be deleted). Turn toolbars on/off from the Customize list, Settings / Toolbars, or the toolbar's empty-space context menu.
see: toolbars.default, toolbars.sets, toolbars.dynamic, customize.concept

## toolbars.default | The default toolbars
src: 0029 | area: toolbars
ui: right-click empty toolbar space > Factory reset this toolbar; Customize > Toolbars tab
user-words: reset toolbar, restore default buttons, toolbar missing
what: Five hard-coded toolbars: Menu, Operations, Favorites Bar, File Display, Images. Created on disk on first run and re-created if deleted. Cannot be deleted or renamed, can be edited or turned off. The installer also creates "example" toolbars (for example Drives) that you may delete.
notes: Factory reset one toolbar: toolbar context menu `Factory reset this toolbar`. Reset all: `Toolbars` submenu > `Factory Reset Toolbars` (command `Toolbar RESETDEFAULTS`). A Lister's initial toolbars come from the saved layout if it stores toolbars, else the Default Toolbar Set.
see: toolbars.menu, toolbars.operations, toolbars.filedisplay, toolbars.images

## toolbars.menu | Menu toolbar
src: 0030 | area: toolbars
ui: top bar of a Lister: File Edit FTP Tools Settings | View Details Details+Thumbnails Thumbnails Folder FlatView NavLock Lister DualH DualV Metadata Viewer Search
user-words: menu bar, top menu, file menu, settings menu
what: Left drop-downs: File (open Lister, close, exit, selected-file context menu), Edit (clipboard, copy names/paths, Calculate Folder Sizes, select commands), FTP (address book, ad-hoc connection), Tools (Find Files, Synchronize, Find Duplicate Files, Join/Split files, Print/Export Folder Listing incl. CSV, image conversion), Settings (Preferences, Customize, File Types, Script Management). Right side: View (view modes, sort and group submenus), shortcut buttons for Details / Details+Thumbnails / Thumbnails, Folder (Folder Options dialog, Folder Formats, favorite formats, folder tabs, Flat View, Checkbox Mode, Navigation Lock, filters), Flat View button (click 1 = grouped, 2 = mixed, 3 = off, right-click adds Mixed (No Folders)), Navigation Lock button, Lister menu (toggle folder tree, metadata panel, status bar, list of Lister Styles), Dual Horizontal / Dual Vertical toggles, Metadata Pane toggle, Viewer Pane toggle, search field (quick search of the current folder).
notes: Real labels in the 13.11 install differ slightly, for example `Customize Toolbars and Keys...` and `Set Lister Defaults`. Look up with `dopus.ps1 ui`.

## toolbars.operations | Operations toolbar
src: 0031 | area: toolbars
ui: Operations toolbar (default, below the Menu toolbar)
user-words: copy button, move, delete button, new folder button, archive button, slideshow, properties
what: Top-level buttons with drop-downs. Use the source/destination concept (destination = non-active display in dual mode, else a prompt for a folder).
options:
- `Copy Files` ▾: Copy As (new names, one at a time or batch wildcard), Duplicate (copy in the same folder, you give new names), Update All (copy if missing or newer), Update Existing (only if present and newer), Send To, Copy Filter (toggle recursive copy filter)
- `Move Files` ▾: Move As
- `Rename` ▾: Use Simple Rename (toggle: Rename button opens the simple dialog), Capitalize Words, Make Web-safe (keeps only - 0-9 a-z A-Z . _ ] +), Number Files (VBScript example), Time-Stamp Names, Underscores to Spaces
- `New Folder` ▾: New Archive, New Text Document, New (system New menu), New Dated Folder, Move into Dated Folder. In the File Collections root it makes a collection, in the Libraries root a library
- `Delete` ▾: Secure Wipe, Remove From Collection (Delete on a collection item deletes real files), Delete Filter (toggle recursive delete filter)
- `Admin`: turn on Administrator Mode in this Lister
- `Archive Files` ▾: Files to Separate Archives (ZIP by default, edit `Copy ARCHIVE=single` to `Copy ARCHIVE=.7z,single` for 7z), Files to Destination Archives, ZIP And Email Files, Extract to Folders, Extract to Destination, Extract to Destination Folders
- `Properties` ▾: Attributes (Change Attributes & Times), Description, Edit Metadata, Set Label
- `Slideshow` ▾: Show Pictures (standalone viewer), Play Sounds. No selection = all images in the folder
- `Help` ▾: support links, Resource Centre, check for updates, Secure Screenshot
notes: Delete uses the Recycle Bin by default (Preferences / File Operations / Deleting Files). Most buttons need a selection.
see: fileops.copybuttons, fileops.delete, rename.overview

## toolbars.filedisplay | File Display toolbar
src: 0033 | area: toolbars
ui: Preferences / Location Bar / Toolbars (on/off); Buttons\File Display.dop
user-words: back forward up refresh home, path bar toolbar, location toolbar
what: Top of each file display. Buttons Back, Forward, Up, Refresh, Home, then the breadcrumbs path field. Duplicate/Swap/Close are part of the File Display border, not the toolbar.
see: nav.locationbar

## toolbars.images | Images toolbar
src: 0034 | area: toolbars
ui: Preferences / Toolbars / View Mode Toolbars
user-words: thumbnail toolbar, rotate images, convert images, thumbnail size slider
what: Auto-shows in Thumbnails mode. Rotate Left/Right (90°), Convert (opens Image Conversion, drop-down converts to JPG/PNG/BMP/GIF), Show (standalone viewer), Set Wallpaper, Sort by name / date / date taken (non-images and missing date go last), thumbnail size slider (max 256px by default, change `max_thumbnail_size` on Miscellaneous / Advanced; double-click resets to the default from the Thumbnails page) plus four buttons for 32, 64, 128, 256px.

## toolbars.dynamic | Toolbars that appear automatically
src: 0035 | area: toolbars
ui: Preferences / Toolbars / View Mode Toolbars; folder format settings
user-words: toolbar per folder, toolbar for pictures folder, show toolbar when
what: A toolbar or toolbar set can open when the view mode changes (for example Images toolbar in Thumbnails mode) or when you visit a folder or a folder of mostly one content type (set through the Folder Formats system).
see: formats.concept, toolbars.sets

## toolbars.sets | Toolbar sets
src: 0036 | area: toolbars
ui: Settings / Toolbars / Toolbar Sets; Preferences / Toolbars / Sets (`Prefs PAGE=toolbarsets`)
user-words: save toolbars, switch toolbar layout, toolbar profile
what: A set is one or more toolbars saved as a group. Load from Settings / Toolbars or the toolbar context menu, or auto-load per view mode or folder.
options:
- `Save Toolbar Set`: Settings / Toolbars / Toolbar Sets, saves the Lister's open toolbars
- default behaviour when loading (choose per set): `Add toolbars to existing toolbars` (turn on missing ones), `Replace existing toolbars` (close all, load set), `Toggle existing toolbars` (if all are on, swap back to the default set, else turn missing ones on)
notes: The default behaviour can be overridden by arguments of the `Toolbar` command. The Default Toolbar Set is not a normal set: update it with `Set As Default Toolbar Set`.
cmd: `Toolbar SAVESET`, `Toolbar SETDEFAULT`, `Toolbar !default LOADSET=replace`

## find.fayt | Find-as-you-type (FAYT) field
src: 0037 | area: find
ui: Preferences / Filtering and Sorting / Find-As-You-Type / (Filter Mode, Find Mode, Folders Mode) and Quick Keys
user-words: type to jump to file, quick find, type in file list, command line in opus, quick select, go to folder by typing
what: Text field at the bottom of the file display that pops up when you type a key that has no hotkey. Default mode is Find. The first key can switch mode (shown by background colour). Mode keys and default mode are on the Quick Keys page.
options:
- Find (default): jump to first matching name, matches anywhere in the name by default (option: start only, option: ignore diacritics). Next match F3, previous Shift+F3 (option to behave like Explorer where repeating a letter cycles; Ctrl+T in the field toggles it)
- Go: a folder path or alias typed in Find mode switches to Go mode (path completion, Enter navigates). Lets you remove the path field from the toolbar
- Command (key `>`): run any internal command or program without a button. Ctrl+Enter inserts selected file names. Up/Down = history. Pin button keeps it open (Ctrl+Shift+PageDown / PageUp toggle pin)
- DOS Command (key `?`): runs in a DOS window to show output
- Everything local (`-`) / global (`+`): needs voidtools Everything
- Filter: not on by default (the Filter Bar is used instead), assign a key on Quick Keys. A leading `~` inverts. Esc clears
- Opus search (`'`): quick Find Files below the current folder. Text or wildcard = name match, text starting with `=` is evaluated (for example `=size>100kb`)
- Range (`#`): Details/Power mode only, adds an Index column. `#5-10`, `#5`, `#12,14,16-18`, `#+10` next 10, `#-5` previous 5, `#-5+5` five either side
- Folders (`]`): popup of recent, favorites, aliases (sources set on the Folders Mode page)
- Windows Search (`=`): indexed Windows Search below the current folder
- Select (`:`): select by wildcard, partial match by default (`:.jpg`, `:*.jpg`), leading `~` inverts
- Tabs (`@`): search open folder tabs by path or title, pick from a popup
- WSL Command (`|`): run a Linux command via WSL
notes: Keys listed are defaults.
see: filter.bar, find.quicksearch

## panes.viewer | Viewer pane
src: 0038 | area: panes
ui: Viewer Pane button on the Menu toolbar, F7, Lister menu > Viewer Pane; Preferences / Viewer / Viewer Pane
user-words: preview pane, preview, image preview, pdf preview
what: Shows the last selected file (images natively, many formats via viewer plugins incl. Word and PDF through installed viewers). Title bar: Previous/Next File, Rotate Left/Right (display only, not saved to disk; use Image Conversion to rotate the file), Zoom In/Out (Ctrl+wheel), Original Size, Fit To Window (shrinks only), Grow To Window (also enlarges), Toggle Layout (right or bottom), Close. Wheel scrolls, Alt+wheel scrolls sideways.
options:
- `Show control bar` (Viewer / Viewer Pane): adds a bottom bar with the title bar buttons plus Hex View, Slideshow (speed on the same page), Full Screen (reopens in standalone viewer; Enter leaves full screen but stays in the viewer, Esc closes it), Print, Settings
- `Scroll with left mouse button` (same page): when off, select an image region without holding Shift
notes: Context menu (varies by plugin): View Size (presets, fit modes, Tile), Rotate View, Gamma Correction, Background Color (for transparency), Select All, Reselect, Copy All / Copy (selected area), Print, Set As Desktop Wallpaper, Properties, Refresh (for files changing on disk, such as logs), Use Plugin (switch plugin, order on Viewer / Viewer Plugins), File (system context menu). Not every plugin supports every function.
cmd: `Set VIEWPANE=toggle`
see: prefs.viewer.standalone

## panes.metadata | Metadata pane
src: 0039 | area: panes
ui: Metadata Pane button, F9, Lister menu > Metadata Pane; Preferences / File Operations / Metadata / Editor
user-words: file properties panel, exif panel, tag editor panel
what: Shows and edits metadata of selected file(s) (images, music, documents). Title bar: previous/next arrows. After edits, Apply and Cancel links appear. Shift+click next/previous saves and moves on. Checkbox next to Apply = `Apply changes automatically` on the Editor page.
see: metadata.editing

## panes.utility | Utility panel
src: 0040 | area: panes
ui: Tools menu; Help / Logs
user-words: find panel, bottom panel, log panel, script log
what: Bottom panel that hosts tools and logs, switch with the title bar dropdown. Tools (Tools menu): Find Files, Synchronize, Find Duplicate Files. Logs (Help / Logs): FTP Log, File Log (configure at File Operations / Logging), Undo Log (recent undoable actions), Email Log, Script Log (script and evaluator output).
notes: Shrink button (top right) collapses it to its title bar. Right-click it to auto-shrink when find, synchronize or find duplicates starts (set separately).
cmd: `Set UTILITY=find`

## layouts.concept | Lister layouts
src: 0041 | area: layouts
ui: Settings / Lister Layouts; Preferences / Layouts and Styles / Layouts (`Prefs PAGE=layouts`)
user-words: save my windows, restore workspace, saved window set, open several windows
what: A layout is a saved set of one or more Listers: position/size, single or dual display, tree and panes open, folders, tabs and active tab, folder formats, open toolbars. No layout editor: save current Listers.
options:
- `Save This Lister...` / `Save All Listers...` (Settings / Lister Layouts): `Prefs LAYOUTSAVE=single` / `Prefs LAYOUTSAVE`
- `Edit Layouts...`: opens the Layouts page (list, rename, reorder, delete; Update button in the Edit dialog re-saves)
- load: pick from the Settings / Lister Layouts list, or desktop context menu list (`Windows Integration` page option), or a layout shortcut dragged from the Layouts page to the desktop
- per-layout load options: `Close all existing Listers when loading this layout`; `Close Listers on all virtual desktops`; `Use folder formats saved within this lister`; `Use toolbars saved within this layout`; `Open layout relative to the monitor the mouse is currently on`; `Restore each Lister to its original virtual desktop`; `Hide this layout from layout lists` (load with `Prefs LAYOUT`)
notes: With virtual desktops only the current desktop's Listers are saved unless `Save Listers on all virtual desktops` is ticked. The list shows a code for each layout's options. Stored formats/toolbars override later changes: re-save the layout to refresh toolbars, and tick the option when saving a folder format to update it inside layouts.
cmd: `Prefs LAYOUT`, `Prefs LAYOUTEDIT`, `Prefs LAYOUTLIST`
see: lister.defaultlister, layouts.styles

## layouts.styles | Lister styles
src: 0042 | area: layouts
ui: Lister menu (style list); Preferences / Layouts and Styles / Styles (`Prefs PAGE=styles`)
user-words: switch window arrangement, hide tree, filmstrip view, preset arrangement
what: A style modifies the current Lister (panes, tree, toolbars, tabs, folder, format) without opening a new window.
options:
- predefined: `Commander` (dual display, no tree), `Dual Horizontal`, `Dual Vertical`, `Explorer` (single tree and display), `Filmstrip` (narrow thumbnail strip plus viewer pane), `Images`, `Metadata` (viewer and metadata panes), `Single`
- apply: Lister dropdown menu (right-click a style to update it from the current Lister), `Prefs STYLE="name"` (for hotkeys), or Style tabs (add the `Lister Styles - Tabs` command from Customize > Commands)
see: prefs.layouts.styles

## themes.concept | Themes
src: 0043, 0044 | area: themes
ui: Preferences / Colors and Fonts / Themes (`Prefs PAGE=themes`); Settings / Lister Themes...
user-words: color scheme, dark theme, change colors, share theme
what: A theme is the colour, font and image part of the configuration. Switch or share. Themes list on the Themes page, more from the Opus Resource Centre.
options:
- create (Themes page): `Theme Name`, `Description`, `Author Info`, `URL`, `Preview Image` (browse, paste, or snapshot a Lister with the crosshair), `Content` checkboxes choose which aspects the theme contains and changes when applied
see: prefs.colors.overview

## panes.statusbar | Status bar
src: 0045 | area: panes
ui: Preferences / File Displays / Status Bar
user-words: bottom bar, counts, free space, selected size
what: Default left to right: selected/total folders, selected/total files, selected extensions, hidden item count, selected/total size (folders count only if their size is calculated), format indicator and menu, free space, used-space bar.
notes: Config on the Status Bar page: custom sections with status bar codes, and `status bar at bottom of the Lister` instead of per file display. Hover hidden-item indicator = names of hidden items, click it toggles Show Everything. Hover format indicator = where the current format comes from, right-click = change format quickly. Clicking the status bar swaps source and destination.
see: codes.statusbar

## concept.explorer-replacement | Explorer Replacement
src: 0045 | area: concept
ui: Preferences / Launching Opus / Explorer Replacement
user-words: replace explorer, open folders in opus, win+e opens explorer, double click folder opens explorer
what: Any action that would open a File Explorer window opens a Lister instead. Active when any option other than `Don't replace Explorer` is chosen. Win+E is separate on Windows 10+ (own page From the Win + E hotkey) and can open Opus even without replacement mode.
notes: Get File Explorer anyway: Win+R `explorer.exe`, right-click folder > `Open in Explorer`, pinned taskbar icon. Limits: some folder types may not be replaced (setting dependent), programs calling Explorer specifically may bypass it, Control Panel always opens in Explorer, desktop and Open/Save dialogs are not replaced. USB (portable) installs generally cannot use it (an option temporarily applies the registry change, may fail).
see: prefs.launching.explorerreplacement

## concept.sourcedest | Source and destination
src: 0045 | area: concept
ui: Preferences / File Displays / Options (`Single display Listers have source/destination modes`)
user-words: which side is active, copy to other side, destination folder prompt
what: Dual display: the active (focused) display is the source, the other is destination. Title bar colour shows it: source blue by default, destination grey (light mode) or red (dark mode), colours configurable. Make a display source by clicking in it, clicking the status bar (no selection risk), or pressing Tab.
notes: Single display Lister: no destination, `Copy Files` prompts for a folder. With the option above, single Listers get source / destination / off states across Listers: clicking a Lister sets it to source, the previous source becomes destination, the previous destination goes off (not used).

## select.commands | Selecting files automatically
src: 0045 | area: select
ui: Edit menu / Select Other
user-words: select all, invert, select same extension, select duplicates, select empty folders
what: Edit menu: `Select All`, `Select by Pattern` (simple wildcards, can switch to advanced multi-criteria), `Invert Selection`. Edit / Select Other: `Reselect Files` (files used and deselected by the last command), `Select Same Extensions`, `Select Empty Folders`, `Select Zero-Byte Folders`, `Select Expanded Folder Items`, `Select Source to Destination` (same names as selected in source), `Select Source All to Destination`, `... (ignore extensions)`, `Select Source-not-in-Destination`, `Selection to Checkboxes`, `Checkboxes to Selection`, `Select Duplicates…`.
notes: Selected counts show on the status bar. Operation buttons use the selection.
cmd: `Select ...`
see: select.mouse
