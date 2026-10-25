# Preferences map

Where each option lives in `Preferences` (v13), what each page controls, and how to open a page by command. Full option text: docs.dopus.com.

## User says → concept

| User words | Page |
|---|---|
| "open Opus instead of Explorer", "replace Explorer" | `Launching Opus / Explorer Replacement` |
| "Win+E opens Explorer" | `Launching Opus / From the Win + E hotkey` |
| "double-click desktop opens Opus" | `Launching Opus / From the Desktop` |
| "start with Windows", "reopen my tabs at startup" | `Launching Opus / Startup` |
| "Opus keeps running after I close it" | `Launching Opus / Shutdown` |
| "new window opens with wrong folder / tabs / size" | `Layouts and Styles / Default Lister` |
| "single click to open" | `File Displays / Single Click` |
| "show `..` item", "go up selects previous folder" | `File Displays / Navigation` |
| "double-click empty space goes up" | `File Displays / Background Events` |
| "ctrl+wheel zoom", "hover switches panes", "middle click selects" | `File Displays / Mouse` |
| "full path in window title" | `File Displays / Title Bar` |
| "status bar shows X", "info icon missing" | `File Displays / Status Bar` |
| "tabs on the left", "+ button", "close button on tabs", "hide tab bar with one tab" | `Folder Tabs / Folder Tab Bar`, `Folder Tabs / Options` |
| "click a tree folder opens new tab / existing tab" | `Folder Tree / Selection Events` |
| "dark mode", "theme", "colors", "fonts" | `Colors And Fonts / ...` |
| "hide hidden / system files everywhere" | `Filtering And Sorting / Global Filters` |
| "folder view / columns stick" | `Folders / Folder Formats` (see `references/folder-formats.md`) |
| "folder sizes in Size column" | `Folders / Folder Sizes` |
| "confirm before overwrite / delete to recycle bin" | `File Operations / Confirmation`, `File Operations / Deleting Files` |
| "rename on slow double-click" | `Miscellaneous / Advanced` → `slow_dblclk_rename` |
| "Open in Directory Opus on folder context menu", "layouts on desktop menu" | `Miscellaneous / Windows Integration` |

## Model

- 20 categories, each with pages (some pages have child pages). Paths below are `Category / Page`. Write them as `Preferences / Category / Page`.
- Most pages need OK or Apply. Cosmetic pages (for example Colors and Fonts) apply live and show Save instead of Apply.
- Search field bottom-left (F3) filters pages and options by text. Use it when a name below is not enough.
- Preferences menu (top-right button): `Copy page shortcut`, `Revert changes` (works after Apply until Preferences closes), `Factory reset` (visible / page / ALL), `Reset dialog font`, `Change configuration mode` (Private vs Shared), `Backup & Restore`.
- Right-click a page in the list: Favorite page (Starred category), Copy page shortcut, Revert page, Factory reset page.

## Opening a page by command

`Prefs PAGE=<id>` opens a page. Verified ids in the manual:

| Command | Opens |
|---|---|
| `Prefs PAGE=folderformats` | `Folders / Folder Formats` |
| `Prefs PAGE=tabgroups` | Folder tab groups manager (`Folder > Folder Tabs > Manage Tab Groups`) |
| `Prefs PAGE=foldertabbars` | Folder tab bar settings (tab bar `Settings...`) |
| `Prefs PAGE=toolbarsets` | Toolbar sets (`Settings > Toolbars > Toolbar Sets > Edit Toolbar Sets`) |
| `Prefs PAGE=fdbtoolbar` | `Location Bar / Toolbars` (`Settings > Toolbars > Choose Location Bar Toolbars...`) |
| `Prefs PAGE=themes` | Lister themes (`Settings > Lister Themes...`) |
| `Prefs PAGE=copyopts` | Copy settings (`Copy Files > Copy Settings...` on the Operations toolbar) |
| `Prefs PAGE=deleting` | Delete settings (`Delete > Delete Settings...`) |
| `Prefs PAGE=viewer` | Viewer preferences (Image Viewer toolbar `Edit > Preferences...`) |
| `Prefs PAGE=layouts` (= `Prefs LAYOUTEDIT`) | `Layouts and Styles / Layouts` |
| `Prefs PAGE=styles` (= `Prefs STYLEEDIT`) | `Layouts and Styles / Styles` |
| `Prefs PAGE=colors` | Colors and Fonts area (manual labels it with an old name, exact sub-page `[unverified]`) |
| `Prefs PAGE=transitionanimations` | `User Interface / Transition Animations` |
| `Prefs PAGE=vfsplugins` (= `Prefs VFSPLUGINMANAGER`) | `Zip and Other Archives / Archive and VFS Plugins` |
| `Prefs PAGE=scripts:<file>` | Scripts page, opens that script's config (`scripts:dopstack.js`) |
| `Prefs PAGE=evalcolumns:<name>`, `Prefs PAGE=evalgroups:<name>` | Editor for that evaluator column / group |
| `Prefs PAGE=folderformats COLLAPSEALL` | Page with all other categories collapsed |

The ids above are the ones in the default 13.11 toolbars and menus. `Prefs PAGE=deflister` is a guess seen in one session, `[unverified]`. Any other page: open it, then Preferences menu → `Copy page shortcut` (or right-click the page in the list). That puts the exact `Prefs PAGE=...` line on the clipboard. Do not guess ids.

Related: `Prefs CUSTOMIZE` (Customize dialog), `Prefs FILETYPES`, `Prefs KEYS`, `Prefs SETLISTERDEFAULTS`, `Prefs BACKUPRESTORE`. See `references/commands.md`.

## Category and page index

| Category | Pages → controls what |
|---|---|
| Colors And Fonts | Dark Mode (light/dark color set) · Themes (save/apply/share colors, images, fonts) · Color Blending (opacity of selection, graphs, inactive panes) · Directory Opus Colors (file/folder and UI colors Opus draws) · Windows Colors (menus, controls) · Images (background images per element) · Fonts (every UI font) |
| File Displays | Folder Expansion (expandable folders inline) · Mouse · Background Events (double-click empty space) · Single Click · Navigation · Options · Info Tips (hover tooltips) · Tab Key (what Tab does) · Status Bar · Title Bar |
| File Display Columns | Appearance (per-column color, font style, default width, middle ellipsis) · Evaluator Columns (custom columns) · Evaluator Groups (custom grouping schemes) · Filenames (hide `.lnk`/`.url` extensions, localized names, uppercase names) · Icons (shortcut arrows/overlays, cloud and TortoiseSVN status icons) · Options (auto Group column, friendly dates, size/date graphs, seconds in times, dashes in empty columns) · Shell Properties (import Explorer columns) |
| File Display Modes | Details (+ Appearance: icons, padding, line spacing) · Power Mode (+ Appearance, Buttons: per-mouse-button actions) · Thumbnails (size, spacing, resize mode, EXIF rotate, labels, + Folders: folder thumbnails, Overlays: sprockets, stars, type icon, Performance: threads, cache, Styles: folder thumbnail style) · Tiles |
| File Operations | Copying Files (select copied files, copy queues) · Attributes (which attributes/timestamps copy) · Confirmation (overwrite, merge, nested copy) · Metadata (ADS on copy) · Security (ownership, permissions) · Deleting Files (confirm, Recycle Bin, secure wipe) · Double-click Files · FTP (re-upload edited files) · Logging · Metadata (dates on metadata save, descript.ion) · Metadata Editor · Music Genres · Options (undo entries, deselect after function) · Progress Indicators · Counting Files · Jobs Bar · Renaming Files (inline rename behavior) · Control Keys (rename keys) |
| Filtering And Sorting | Filters (named filters for copy/delete/find) · Filter Bar · Find-As-You-Type (FAYT timeout, auto search) · Filter Mode · Find Mode · Folders Mode (FAYT folder jump sources) · Global Filters (`Hide hidden files`, `Hide operating system files`, `Enable global wildcard filters`) · Quick Keys (keys that open FAYT modes) · Sorting (manual sort saving, `Sort newly created and copied files`, `Sort shortcuts to folders like folders`, `Ignore prefix when sorting`) |
| Folders | Automatic Reading (skip auto-read of network, removable, FTP, archives) · Folder Formats · Automatic Formats · Folder Images (per-folder background) · Folder Sizes (`Calculate folder sizes automatically`, Everything) · Junctions and Links · Network Servers · Special Folders (third-party desktop folders, e.g. OneDrive) · Virtual Folders (+ Desktop, File System, This PC: Opus vs Explorer implementation, drive grouping, free space warning) |
| Folder Tabs | Dimensions (tab sizes) · Edge Colors (per-folder accent) · Folder Tab Bar · Groups (tab groups) · Locking · Options |
| Folder Tree | Appearance (style, lines, full-row select, path highlight) · Contents (root items: hidden/system folders, archives, favorites, libraries) · Expand / Collapse (auto-expand to current folder, collapse non-selected branches) · Pins · Options (second tree in dual mode, horizontal scrolling) · Selection Events · Sorting (`Mirror sort order from file display`) |
| Frequently Used Paths | Favorites List · Folder Aliases · Home Folder · Paired Folders · Recent List · SmartFavorites (+ Points) |
| Internet | Email (SMTP for Zip and Email Files) · Updates (check frequency, betas, auto install) |
| Labels | Label Definitions · Label Assignments (file, folder, wildcard, filter labels) · In Specific Folders · Options (store in file system or config) |
| Launching Opus | Explorer Replacement · From the Desktop · From the Taskbar Icon · From the Win + E hotkey · Startup · Shutdown |
| Layouts and Styles | Default Lister · Layouts · Styles |
| Location Bar | Options (close button, Copy/Swap buttons, icon) · Path Fields (breadcrumbs behavior) · Appearance · Components (drive labels, This PC / Network components) · Menus (breadcrumb drop-down contents) · Path Completion · Toolbars (location bar mode, docking, Up does Up + Back) |
| Miscellaneous | Advanced · External Tools (text viewer, script editor) · Privacy (history clearing) · Shell Extensions (block third-party context menu items) · Sounds · Windows Integration · Jump List · Windows Startup Delay |
| Toolbars | Appearance (button spacing, scaling) · Floating Toolbars (screen-edge docking, auto-hide) · Folder Toolbars (per-folder toolbars) · Icons (icon sets) · Options (`Lock Toolbars`, `Allow default toolbars to be edited`, Alt+click edit) · Sets (toolbar sets) · View Mode Toolbars (toolbar per view mode) |
| User Interface | Language · Spacing (spacing schemes) · Transition Animations |
| Viewer | Standalone Viewer · Options · Size And Position · Mouse Buttons · Marked Pictures · Slideshow · QuickShow (`Trigger QuickShow with the Space key`) · Viewer Pane (+ Options, Exclusion List) · Viewer Plugins |
| Zip and Other Archives | Archive and VFS Plugins · Archive Options (`Open archives as read-only by default`, auto-extract on double-click) · Context Menu (archive items in context menu) · Zip Files (`Enable internal Opus Zip support`, compression level) |

Some sub-pages share a name (Options, Appearance, Metadata). Always give the full path.

## Launching Opus (detail)

**Explorer Replacement.** Does not affect system Open/Save dialogs. Win+E is on its own page (Windows 10+).

| Option | Effect |
|---|---|
| `Don't replace Explorer` | Off |
| `Replace Explorer for all file system folders` | Real folders open in Opus, virtual ones (Recycle Bin) stay in Explorer |
| `Replace Explorer for all folders` | Everything |
| `Replace Explorer for all but the following folders` | Exclusion list |
| `Open a new tab instead of a new window` | Intercepted folders open as a tab in an existing Lister |
| `Open all Default Lister tabs when opening a new window` | New window loads the whole Default Lister first, then adds a tab for the folder |

**From the Desktop** (double-click empty desktop): `Disable`, `Bring the last active Lister to the front`, `Open the Default Lister`, `Open a saved Lister layout` (+ `Close existing Listers`, `Close Listers on all virtual desktops`), `Run a command`. Uses the background helper `DOpusRT.exe` (hooks Explorer, starts with Windows). Troubleshooting: `Restart DOpusRT.exe` button (also reports if Opus runs elevated), `Delay DOpusRT.exe` when another startup program conflicts.

**From the Taskbar Icon**: `Add icon to taskbar notification area`, then `Do nothing on double-click` / `Bring the last active Lister to the front` / `Open the Default Lister` / `Open a saved Lister layout` / `Run a command`.

**From the Win + E hotkey** (Windows 10+, needs Explorer Replacement available): `Open File Explorer as normal`, `Bring the last active Lister to the front`, `Open the Default Lister`, `Open a saved Lister layout` (+ close options), `Run a command`. Do not also define a System-Wide Hotkey for Win+E. It can override this page.

**Startup** (`Launching Opus / Startup`). Control types matter: two checkboxes on top, then a radio group.

| Control | Option | Effect |
|---|---|---|
| checkbox | `Launch Directory Opus automatically on system startup` | Shortcut in the Start menu Startup group |
| checkbox | `Don't open any Listers` | At Windows boot no window opens (Opus runs silently). The radios below still apply when Opus is started manually |
| radio group `What happens when Opus starts up` | `Open the Default Lister` | One window from the Default Lister |
| radio | `Open the Listers that were open when the program was last closed` | Restores the session |
| checkbox (under the radio above) | `Backup open Listers automatically`, `Restore each Lister to its original virtual desktop` | Snapshot on a schedule (also on shutdown), virtual desktop restore |
| radio | `Open a saved Lister layout` / `Run a command` | |
| checkbox | `Always perform startup action` | Also run the startup action when Opus is launched with a folder |

"One window (or none) at boot": tick `Don't open any Listers`, or pick `Open the Default Lister`. Which window the Default Lister opens: `Layouts and Styles / Default Lister`, below.

**Shutdown**: `Shutdown Directory Opus when all functions finish` makes Opus exit when the last Lister closes. Off (default) keeps it resident, which system-wide hotkeys and floating toolbars need.

## Layouts and Styles (detail)

**Default Lister** (what a "new" Lister opens with, see `references/folder-formats.md` for format effects):

| Option | Effect |
|---|---|
| `Ignore folder format of Default Lister` | New Listers use the Folder Formats system instead of the stored format |
| `Ignore toolbars of Default Lister` | Use the Default Toolbar Set (`Settings / Toolbars / Set As Default Toolbar Set`) |
| `Update Default Lister automatically when closing a Lister` | Last closed Lister becomes the default. Turn off and use `Settings` > `Set Lister Defaults` (`Prefs SETLISTERDEFAULTS`) for a fixed default. The manual calls this item "Set As Default Lister", the 13.11 menu shows `Set Lister Defaults` |
| Positioning: `In a fixed position relative to the monitor the mouse is on` / `Always in the same position` / `Always over the mouse pointer` | Where new default Listers appear |
| `Always open Default Lister on the current desktop`, `Avoid switching desktops to find existing Listers` | Virtual desktops |

**Layouts**: list with flags `C` close existing, `A` close on all desktops, `F` use saved folder formats, `T` use saved toolbars, `M` relative to mouse monitor, `V` restore virtual desktop, `H` hidden from lists. Edit → `Update` button reopens the layout for changes. Drag a layout to the desktop for a shortcut.

**Styles**: per style, which Lister elements to change (tree, viewer pane, metadata pane, toolbars, utility panel, status bar, `Format Lock`, Filmstrip) and per file display: Tab Group, `Close existing folder tabs`, View Mode (`Auto` = folder's own), Format, Flat View, Folder. Apply with `Prefs STYLE="name"`.

## File Displays (detail)

**Mouse**: `Allow file selection when clicking to activate Lister`, `Allow file selection when clicking to switch source/destination state`, `Allow drag and drop into sub-folders`, `Double-click group headers to expand/collapse`, `Hot-tracking of mouse cursor`, `Hover to switch source/destination state`, `Mouse wheel to switch source/destination state`, `Mouse wheel + Ctrl to adjust font and thumbnail sizes`, `Mouse wheel + Shift to navigate back and forward`, `Single middle click to toggle selection state`, `Single middle click to trigger file and folder middle double-click events`, `Smooth scrolling with mouse wheel/keyboard`.

**Single Click** (all modes except Power): `Single click to open an item`, `Alt + click to select without opening`, `Expand sub-folders on hover`, `Single click over icon only`, `Underline items on hover`, `Hover time to select`, `Hover time to expand`.

**Navigation**: `Cancel Flat View mode when folder is changed`, `Highlight previous folder on Up/Back`, `Select previous folder when going up` (the Up button runs `Go UP BACK`, so the parent may stay selected regardless), `Show .. parent item in folders` (+ `Hide when file display is grouped`), `Show folder read errors inline in the file display`, Navigation Lock `Warning message when out of sync`.

**Options**: `Automatically select first file in folder`, `Clear quick filter with the Esc key`, `Reset focus entry when sorting file list`, `Preserve folder format edits between folders`, `Show sort header in icon modes`, `Single display Listers have source/destination modes`, `Set new panel to source when switching to dual file display`, `Specify initial folder when switching to dual file display` (folder or tab group).

**Background Events**: up to eight commands for left/middle double-click on empty space with Ctrl, Shift, Alt. Example: `Go UP BACK`.

**Status Bar**: `Enable format lock padlock icon`, `Keep status bars at the bottom of the Lister`, `Use two independent status bars when in dual display mode`, `Separate definitions for…` (single vs dual, or left vs right). Definition is one line per section using `{..}` codes (Codes drop-down, live preview). `{fl}` is the folder format info icon.

**Title Bar**: `Display folder path`, `Display layout name`, `Custom title` with codes `%P` full path, `%N` folder name, `%R` drive root, `%D`/`%M` destination path/name, `%1`..`%4` left/right path/name, `%L` layout, `%S` style, `%V` version, `%T` original title, `%!...%!` hide empty block. Example: `%!%N - %!Directory Opus`. Window icon: Opus logo (shows source/dest state) or `Current folder's icon`.

## Folder Tabs (detail)

**Folder Tab Bar**: `Display new tab button`, `Double-click to open a new tab` (new tab folder: Current folder, Duplicate, Default folder, Home folder, Empty tab, Location), `Open new tabs next to the active tab`, `Use popup menu when tabs exceed available space` (+ `Show all tabs in menu`, `Show menu when tabs are reduced`), `Display folder tab bar` (`Always` / `When needed` / `When needed (balanced)`), `Tab bar position` (Below / Above / Left / Right), `Dual display position` (Normal / Together / Apart). Per-Lister override: `Set TABPOSITION`.

**Options**: `Display drive letter in tab label`, `Display folder icons`, `Drag over tabs brings them to the front`, `Per-tab format lock`, `Process file changes in background tabs`, `Treat tab label as folder when dragged or right-clicked`, `Truncate long labels with "…" instead of fading out`. When selected tab is clicked: `Rename tab` / `Go to previous` / `Do nothing`. Closing: `Close tab on device ejection`, `Double-click tabs to close them`, `Folder tab close buttons` (+ `Small close buttons`), `Lister close button closes active tab`, `Lister closes when last tab closes`.

**Locking**: `Allow locked tabs to be closed individually`, `Display padlock icons when tabs are locked`, `Reset when another tab is activated`, `Try to find existing tabs for double-clicked folders`.

**Groups**: saved sets of tabs. Each tab has its own folder format (`Edit Format`), `Set Active`, `Change Side`, `Locked Tab`, `Link Tab`. Option `Close existing folder tabs when opening this group`.

## Folder Tree / Selection Events (detail)

Override what a mouse click on a tree folder runs. Left and middle button, plain or with Alt / Ctrl / Shift. Any button-style command or a user command name.

| Event | Default |
|---|---|
| Left | `Go .` |
| Left + Alt | `Go NEWTAB` |
| Left + Ctrl | `Go OPENINDUAL` |
| Middle | `Go NEWTAB` |
| Middle + Ctrl | `Go NEWTAB OPENINDUAL` |

Recipe "tree click switches to the tab already showing that folder": set Left to `Go TABFINDEXISTING` (check argument forms in `references/commands.md`).

## Colors And Fonts (detail)

- **Dark Mode**: `Use system setting` / `Dark always` / `Light always`. Two full color + image sets, one per mode. Command: `Set DARKMODE=toggle`.
- **Themes**: Apply (choose Directory Opus Colors, Windows Colors, Color Blending, Images, Fonts, optional backup), New (name, description, author, URL, preview image, content), Duplicate (details only), Edit → `Update Content`, Import / Export, Clean Up. Command: `Prefs THEMENAME=!defaultdark THEMELOAD`.
- **Fonts**: separate fonts for Code editors, Dialogs (needs restart, `Reset dialog font` to recover), File display, column header, groups, Folder tabs, Folder tree, Location bar, Status bar, Thumbnail labels, Toolbars (per-toolbar override in Customize), Tooltips and info-tips, text viewer, and more.

## Miscellaneous / Advanced (most asked)

Name/value list with search field and `Hide unchanged settings`. Non-default values show bold. Asterisk = global for all users. `Reset` restores the default.

| Option | Does |
|---|---|
| `slow_dblclk_rename` | False disables rename by slow double-click (F2 still works) |
| `single_click_rename` | In single-click mode with full-row select, click outside the name to rename |
| `go_up_always_back` | `Go UP` always behaves like `Go UP BACK` (keeps history selection) |
| `custom_date_format` | Own date format instead of locale |
| `file_size_units` | Binary with KB, decimal (1000), or KiB |
| `display_folder_extensions` | Folders show an extension in Name/Extension columns |
| `wheel_acceleration` | Turn off mouse wheel acceleration in file displays |
| `context_menu_max_files` | Warning when right-clicking more than N files (default 1000, 0 = never) |
| `manual_sort_names` | Extra named manual sort orders, one per line |
| `everything_autolaunch` | Command line to start Everything when a search needs it |
| `powershell_exe` | Executable the default PowerShell menu items run (e.g. PowerShell 7) |
| `deffmt_cloud_availability`, `deffmt_cloud_status` | Stop replace-all format saves adding cloud columns |

Other categories on the page: Behavior, Compatibility, Cosmetic, Filesystem, FTP, Image Formats, Information Display, Limits, Troubleshooting. Grep the manual's Advanced page for anything else.

**Windows Integration**: `Add File Collections icon to the Desktop`, `Add File Collections list to the Send To menu`, `Add layout and other items to Desktop context menu` (+ `Display layouts in a sub-menu`), `Add 'Open in Directory Opus' item to folder context menus` (only matters with Explorer Replacement off), `Make Directory Opus the default handler for FTP sites`.

## Pitfalls

- "Display / ..." paths from older docs and forum posts: in v13 Status Bar and Title Bar are under `File Displays`, colors under `Colors And Fonts`.
- Automatic Formats is a page under `Folders`. The v13 release notes write it as `Folders / Folder Formats / Automatic Formats`.
- The manual's Prefs command text says `File / Copy Page Shortcut To Clipboard`. The v13 Preferences page describes it as the menu item `Copy page shortcut`.
- Win+E page is hidden before Windows 10 and on portable installs without Explorer Replacement enabled.
- Desktop double-click fails when security software blocks `DOpusRT.exe` hooking Explorer, or when Opus runs elevated.
- `Revert changes` only works while Preferences stays open. After closing, use Backup & Restore or Factory reset.
- Toolbars, hotkeys and file types live outside Preferences. Factory reset ALL does not reset them. Backup & Restore `Reset configuration` does.
