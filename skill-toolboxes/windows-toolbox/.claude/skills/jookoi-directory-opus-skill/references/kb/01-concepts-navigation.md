# Concepts, navigation, tabs

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- concept.terms: Core terms (Lister, file display, source/destination, virtual file system)
- lister.parts: Parts of a Lister
- lister.start: Starting and quitting Opus
- lister.open: Ways a Lister opens
- lister.defaultlister: The Default Lister
- nav.methods: Ways to navigate
- nav.upbackforward: Up, Back, Forward, History
- nav.tree: Folder Tree
- nav.locationbar: Location Bar and default File Display toolbar
- nav.drives: Drive buttons and Drives dropdown
- nav.favorites: Favorites
- nav.smartfavorites: SmartFavorites
- nav.recent: Recent list and History list
- nav.aliases: Folder aliases
- nav.pairedfolders: Paired folders
- tabs.basics: Folder tabs: open, switch, close
- tabs.contextmenu: Folder tab context menu
- tabs.labels: Custom tab labels
- tabs.switcher: Tab Switcher
- tabs.lock: Locked tabs
- tabs.link: Linked tabs
- tabs.groups: Tab groups
<!-- contents:end -->

## concept.terms | Core terms (Lister, file display, source/destination, virtual file system)
src: 0006 | area: concept
ui: n/a
user-words: main window, explorer window, panel, pane, left and right side, two panels
what: Opus vocabulary. Lister = main window (any number can be open). File display = the file list inside a Lister (1 or 2). Source = the active file display for an operation, destination = the other one in a dual display Lister (or another Lister).
notes: Virtual file system = places not on a normal disk: File Collections, Libraries, Archives, FTP, MTP. Folder format = per-folder view/sort/group/filter settings. Flat View = show all sub-folder contents as one list. Expandable folders = expand sub-folders inside the file display like the tree.
notes: Selecting can use wildcards, filters, or checkbox mode. Searching (other locations, Windows Search or Opus Find or Everything) differs from filtering (hide files in the current folder, Filter Bar).
see: lister.parts, lister.defaultlister, formats.concept

## lister.parts | Parts of a Lister
src: 0006 | area: concept
ui: Settings / Lister Configuration (Lister menu), F8 toggles Folder Tree
user-words: window layout, panes, panels, what is that bar
what: A Lister holds: 1 or 2 file displays (each with tabs and a location bar toolbar above), default toolbars (Menu, Operations, Favorites; Images toolbar shows in thumbnail mode), search field, folder tree(s), viewer pane, metadata pane, utility panel, status bar, filter bar, folder tab bar (below the file display by default).
notes: Default toolbars can be turned off or edited but not deleted or renamed. Folder tree in dual display: separate tree per display or one shared tree that follows the source display. Utility panel hosts Find, Synchronize, Duplicate Files and logs (file operations, FTP, script output). Search field can use Windows Search, Opus Find or Everything.
see: toolbars.default, panes.viewer, panes.metadata, panes.utility

## lister.start | Starting and quitting Opus
src: 0006 | area: concept
ui: Preferences / Launching Opus / Startup
user-words: start with windows, autostart, background, tray icon, exit opus, quit
what: Opus is designed to stay resident in the background. Resident Opus opens Listers instantly, and is required for floating toolbars and system-wide hotkeys.
notes: Quit: File menu > `Exit Directory Opus`, or right-click the taskbar notification icon (if enabled) > exit. Opus can exit when the last Lister closes: `Shutdown Directory Opus when all functions finish` (the manual names page File Operations / Options, `references/preferences-map.md` lists it under Launching Opus / Shutdown, verify with `dopus.ps1 prefs`). Never kill the process (config may not be saved or may corrupt).
see: prefs.launching.startup

## lister.open | Ways a Lister opens
src: 0007 | area: concept
ui: n/a
user-words: new window, open explorer, win+e, desktop double click
what: Start from shortcut or taskbar icon. With Explorer Replacement: double-click a folder, Win+E. With double-click on desktop enabled: empty desktop double-click. System tray icon double-click. Run-on-startup action. Load a saved layout (desktop context menu or Settings menu). Internal command `Go NEW` (Win+Shift+E is assigned by default).
see: lister.defaultlister, prefs.launching.startup

## lister.defaultlister | The Default Lister
src: 0008 | area: concept
ui: Preferences / Layouts and Styles / Default Lister
user-words: default window, starting folder, new window opens wrong, remember window
what: Template used for a "new" Lister. It is a saved layout stored with the folder format and toolbars in use when it was saved. By default it is updated automatically each time a Lister closes, so a new window looks like the last closed one.
notes: Used by: shortcut/taskbar click when Opus is already running; startup (per Startup page); desktop double-click if `Open the Default Lister` is on From the Desktop page; Explorer Replacement opens; Win+E per its page; taskbar icon double-click per its page; `Go NEW`. NOT used when a saved layout is opened (manually or by an action configured to open a layout).
options:
- `Ignore folder format of Default Lister`: use the normal folder-format system instead of the format stored in the default
- `Ignore toolbars of Default Lister`: use the default toolbar set instead
- `Update Default Lister automatically when closing a Lister`: turn off for a fixed default, then set it manually
notes: Manual says set it manually with `Set As Default Lister` in the Settings menu. The 13.11 menu item is `Set Lister Defaults` (`Prefs SETLISTERDEFAULTS`).
see: prefs.layouts.defaultlister, prefs.launching.startup

## nav.methods | Ways to navigate
src: 0009 | area: nav
ui: n/a
user-words: change folder, go to folder, move between folders
what: Double-click a folder (or right-click > Open, or Enter). Up/Forward/Back buttons. Folder tree click or cursor keys. Breadcrumbs location field (each crumb clickable or expandable, can also type a path). Find-as-you-type field (type a path in the file display). Favorites, SmartFavorites, Recent and History lists, Aliases (type `/alias` in the location field).
notes: If the File Display toolbar is disabled, a smaller location bar shows in dual-display mode with default navigation buttons.
see: nav.upbackforward, nav.tree, nav.locationbar, nav.favorites, nav.recent, nav.aliases

## nav.upbackforward | Up, Back, Forward, History
src: 0011 | area: nav
ui: File Display toolbar (default location bar)
user-words: parent folder, go up, back button, history dropdown
what: Up goes to the parent folder (Desktop is the top, except virtual roots like File Collections and FTP). Back/Forward move through the per-file-display (per-tab) History list.
notes: Backspace in a Lister = go up. Mouse/keyboard Back and Forward buttons are recognised. Right-click or click-and-hold Back/Forward shows the history list as a menu. An optional `..` entry in the file display goes up on double-click.
cmd: `Go UP`, `Go BACK`, `Go FORWARD`
see: nav.recent

## nav.tree | Folder Tree
src: 0012 | area: nav
ui: Preferences / Folder Tree / (Appearance, Contents, Options)
user-words: tree, left panel, folder pane, sidebar, expand folders
what: Tree for navigation and as drop target. One tree per file display or one shared tree (follows the source display).
notes: Keys: up/down move, left/right collapse/expand, F2 rename, Del delete, Shift+F10 context menu. Customizable tree keys, defaults: `+` expand (second press expands second-level), `-` collapse, `*` expand all, Ctrl+Space toggle pin (if pins enabled). Rename: slow double-click, F2, or context menu; Enter applies, Esc cancels, Up/Down apply and rename the neighbour.
notes: Title bar buttons: Locate (scroll selected folder to centre), Collapse (all except path to current), Presets (save/load expansion presets), Close (reopen via Lister Configuration menu > Folder Tree or F8). Optional lock button stops the tree following the file display. Path highlighting (always or only when active, optionally also paths of open tabs): Folder Tree / Appearance. Drag files onto tree folders to copy/move, drag folders out.
see: prefs.tree.overview

## nav.locationbar | Location Bar and default File Display toolbar
src: 0013 | area: nav
ui: Preferences / Location Bar / (Options, Path Fields, Appearance, Components, Menus, Path Completion, Toolbars)
user-words: address bar, url bar, path bar, breadcrumbs, header
what: Title bar at the top of each file display. By default it contains the File Display toolbar. Left of the breadcrumbs location field: Back, Forward, Up, Refresh, Home (each with a right-click menu except Refresh). Right of it: Duplicate (copy this display to the other, switches to dual), Swap, Close (closes current tab, or second display if it is the only tab in dual mode; hidden in single display with one tab).
notes: Location bar colour shows source/destination in dual display. Single display has no source/destination state unless enabled in Preferences. Static header mode (turn off the File Display toolbar in Location Bar / Toolbars): Location (clickable segments), Back, Forward, Up, Duplicate, Swap, Close. In static mode the header is optional in single display (`Show header in single display mode`), always shown in dual.
see: ui.breadcrumbs, prefs.locationbar.options

## nav.drives | Drive buttons and Drives dropdown
src: 0014 | area: nav
ui: Settings / Toolbars / Drives (toolbar); Customize > Commands tab
user-words: drive letters, c d e buttons, drive list
what: Drives toolbar (installed by the installer, not a built-in default toolbar) has one button per drive (fixed drives first). Click opens the drive root, right-click shows the drive's system menu. Built from `Go DRIVEBUTTONS`. Drives Dropdown is a pre-defined command added from Customize > Commands (search `drive`, drag to a toolbar).
notes: The dropdown goes to the last-used folder on that drive, not the root (configurable, also which drives show and which display it applies to).
cmd: `Go DRIVEBUTTONS`
see: customize.fields

## nav.favorites | Favorites
src: 0015 | area: nav
ui: Preferences / Frequently Used Paths / Favorites List
user-words: bookmarks, starred folders, quick access, favorites bar
what: Browser-like list. Shown in the Favorites Bar toolbar (on by default, shows one branch), the `Other Favorites` dropdown (rest of the list, links to edit), the `Quick Access` dropdown (hard-coded links: user profile folders, drives, special folders), and optionally the folder tree (`Favorites` item on Folder Tree / Contents).
notes: If the Favorites Bar is turned off a dropdown button appears on the Location Bar toolbar (its list includes the bar folder, unlike Other Favorites). `Add to Favorites` command opens a dialog (name and branch). Drag files onto a favorite to copy/move there. Right-click gives the folder context menu.
cmd: `Favorites ADD`, `Favorites EDIT`
see: nav.smartfavorites

## nav.smartfavorites | SmartFavorites
src: 0016 | area: nav
ui: Preferences / Frequently Used Paths / SmartFavorites
user-words: frequent folders, auto favorites, most used folders
what: Learns commonly used folders and lists them in the Favorites dropdown in a separate section. Can also show in the tree via `SmartFavorites` on Folder Tree / Contents.
notes: No way in the UI or by command to remove or exclude single folders [tested 13.11]. The Preferences page has no exclusion list. Removing specific folders = edit `ConfigFiles\smartfav.osf` offline (see config-files.md, "Remove entries from SmartFavorites"). Opus re-learns a folder when it is visited enough again.
cmd: `Favorites SMART=clear` - wipes the whole list, same as `Clear` next to `Reference table`. `Favorites SMART FILTER=<wildcard>` - only hides non-matching paths from the generated list, entries stay. `EXCLUDEBRANCH` is documented for Favorites only, not SmartFavorites (docs.dopus.com internal command Favorites).
see: nav.favorites, prefs.paths.homerecent

## nav.recent | Recent list and History list
src: 0017 | area: nav
ui: Preferences / Frequently Used Paths / Recent List
user-words: recent folders, history, last folders
what: Recent = global list of recently visited folders (Recent Locations submenu under right-click on Back, the breadcrumbs dropdown, optionally the tree via `Recent List` on Folder Tree / Contents). History = per file display/tab list that powers Back/Forward. History size is set on the Recent List page.

## nav.aliases | Folder aliases
src: 0018 | area: nav
ui: Preferences / Frequently Used Paths / Folder Aliases
user-words: shortcut name, /dopusdata, folder shortcut word
what: Short names for folders, always used with a leading `/` (type `/Sales23` in the location field, or `Copy TO /Sales23`). Re-point an alias later and every button using it follows. Many built-in aliases exist, for example `/dopusdata` (personal config folder).
notes: Drive by label: `/$<label>` (for example `/$My_Portable`), picks the first drive with that label. Preferences page lists built-in aliases and edits yours.
cmd: `Favorites ALIAS=set`

## nav.pairedfolders | Paired folders
src: 0019 | area: nav
ui: Preferences / Frequently Used Paths / Paired Folders
user-words: linked folders, left right pair, production staging, mirror folder
what: Associates two folders (single level or including sub-folders, or regex find/replace rules) to work side by side in dual display. Normal navigation ignores pairs (the `AutoOpenPairedFolder` add-in changes that).
options:
- `default dual-display folder` (per pair): opening the dual display from one half sends the new display to the other half
- `default Navigation Lock target` (per pair): Navigation Lock button opens the other half and locks
- `default Synchronize target` (per pair): Synchronize preselects the other half
- `If non-existent…`: behaviour when the partner folder is missing
cmd: `{sourcepath|pair}` code (other path of the pair), for example `Go {sourcepath|pair} OPENINDUAL`. Modifiers `pairgotoparent` (go up until a folder exists), `pairignorepair` (check other pairs), `pairuseanyway` (return the missing path, for example `CreateFolder {sourcepath|pair|pairuseanyway}`).
notes: Scripting: `FSUtil.GetFolderPair`.
see: tabs.groups, view.navlock

## tabs.basics | Folder tabs: open, switch, close
src: 0020 | area: tabs
ui: Preferences / Folder Tabs (Folder Tab Bar, Groups, Options, Locking); menu Folder / Folder Tabs
user-words: tabs, new tab, open in new tab, tab bar, tab at bottom
what: Each file display has tabs. Tab bar shows at the bottom by default even for one tab (options: only when more than one, vertical left/right).
notes: Switch: click, Ctrl+Left/Right, Ctrl+Tab (tab switcher). New tab: `+` button, double-click empty tab bar, right-click folder > `Open in new folder tab`, Alt+double-click a folder (set in File Types). Close: double-click tab (can be disabled), middle-click. Drag files over a tab to copy/move into it (hover activates it). Drag tabs to reorder, to the other display or Lister (Ctrl = duplicate), or out to the desktop for a new Lister. Click the active tab label to name it (name then sticks). Tab colours: `Set Tab Color`.
notes: Menu `Folder / Folder Tabs`: New Tab for Current, New Tab for Parent, New Tabs for Selected, New Tabs for Parents (useful in collections and Find results), Close Tab, Undo Close Tab, Manage Tab Groups, Save Tabs, Save Tabs (Both Sides).
see: tabs.contextmenu, tabs.labels, tabs.lock, tabs.link, tabs.groups, tabs.switcher

## tabs.contextmenu | Folder tab context menu
src: 0020 | area: tabs
ui: right-click a folder tab
user-words: tab menu, split tab, duplicate tab
what: Items vary by single/dual display. Editable via Customize. `Groups` (hold Shift = do not close existing tabs, Ctrl = close them), `Open New Tab`, `Duplicate Tab`, `Duplicate Tab On Right` (other display), `Move Tab Right`, `Open Parent As Tab`, `Open In New Lister`, `Split To Dual Display`, `Split To New Lister`, `Rename Tab`, `Set Tab Color`, `Lock Tab`, `Link Tab`, `Close Tabs To Left/Right`, `Close All Other Tabs`, `Close Tab`, `Position` (tab bar position), `Settings` (tab bar preferences).
notes: Close-left/right/others skip locked tabs unless Shift is held. Closing a protected locked tab only appears with Shift.

## tabs.labels | Custom tab labels
src: 0020 | area: tabs
ui: rename a tab
user-words: tab name, tab title
what: A renamed tab label may contain tokens: `%P` full path, `%N` folder name, `%R` drive root, `%%` literal %, `%!...%!` hide the block when all tokens inside are empty (example `%!(%R) %!%N`).
notes: Labels can also be overridden by commands and scripts.

## tabs.switcher | Tab Switcher
src: 0021 | area: tabs
ui: Preferences / File Displays / Options / Tab Key
user-words: ctrl tab, switch tabs list
what: Hold Ctrl+Tab for a list over the Lister (most recently used order, default selection is the previous tab). Tab or cursor keys move, releasing the qualifier or Enter activates it as source, Space activates without closing, Esc cancels. Quick alternatives: Ctrl+PageUp/PageDown cycle tabs on the current side, Tab changes sides.
notes: Whether Ctrl+Tab shows the switcher and how Tab behaves is set on the Tab Key page.

## tabs.lock | Locked tabs
src: 0022 | area: tabs
ui: tab context menu > Lock Tab; Preferences / Folder Tabs / Locking
user-words: pin tab, lock tab, keep tab on folder, stop tab navigating
what: Modes: `Unlocked`; `Locked` (navigating away opens a new tab); `Locked (allow folder changes)` (can navigate, click the active tab to restore the original folder; optional restore when switching tabs; `Go TABSELECT=home` does it by command); `Locked (reuse unlocked tab)` (navigating away reuses an unlocked tab, else opens a new one). Alt+click a tab cycles modes.
notes: A Locking setting protects locked tabs from closing and hides their close button (does not stop closing the whole window, dual display, or loading a tab group). Lock commands with Shift = all tabs, Ctrl = active and tabs to the right, Ctrl+Shift = active and tabs to the left. Not the same as Navigation Lock.
cmd: `Go TABSELECT=home`

## tabs.link | Linked tabs
src: 0023 | area: tabs
ui: tab context menu > Link Tab; colours on Preferences / Colors and Fonts / Directory Opus Colors
user-words: link tabs, sync tabs between sides
what: In dual display a tab on one side can be linked to a tab on the other: activating one activates its partner. Ctrl+click links to the active tab on the other side (or unlinks). Ctrl+Shift+click toggles Navigation Lock for the pair. Shift+click ignores the link for that click. In Navigation Lock mode the destination tab follows the source tab's folder changes.

## tabs.groups | Tab groups
src: 0024 | area: tabs
ui: Preferences / Folder Tabs / Groups (`Prefs PAGE=tabgroups`); tab context menu > Groups
user-words: saved tabs, restore tabs, project tabs, open several folders at once
what: Named sets of tabs that open together. Keep tab names and colours. "Specific sides" groups place tabs in both displays and can link tabs across sides. Loading a group closes existing tabs unless the group's setting says otherwise.
notes: Create: right-click a tab > Groups > Save (or Save Both Sides in dual display). Load: right-click a tab > Groups, or the Folder Options / Folder Tabs menu.
cmd: `Prefs PAGE=tabgroups`
see: tabs.contextmenu
