# UI map: what users see and say → DOpus names

Translates screen positions and everyday words into official Directory Opus 13 component names, the Preferences page that configures each one, and the command that toggles it. Full argument lists are in [references/commands.md](references/commands.md).

## Lister map

A Lister is the main window. This is a dual display Lister in vertical layout (displays side by side) with tree, viewer pane and metadata pane open. Default single display Listers drop the right-hand display.

```
+==========================================================================================+
| (window icon)  Lister title bar  "Data"                                          _  []  X |  [1]
+==========================================================================================+
| Menu toolbar:   File Edit FTP Tools Settings   ...   View Folder Lister  [Search field]  |  [2]
| Operations toolbar:   Copy  Move  Delete  Rename  New Folder ...                         |  [2]
| Favorites Bar:   Desktop  Documents  Downloads ...                                       |  [2]
+---+------------+---+-----------------------------+---+-----------------------------+---+-----------+---+
| L | FOLDER     | T | LOCATION BAR (source, blue) | C | LOCATION BAR (destination)  | V | VIEWER    | R |
| E | TREE       | R | File Display toolbar:       | E | < > ^ refresh home          | P | PANE      | I |
| F | [Locate]   | E | < > ^ refresh home          | N | D: > Backup  v   dup swap x | A | (F7)      | G |
| T | [Collapse] | E | Desktop > C: > Data v       | T +-----------------------------+ N +-----------+ H |
|   | [Presets]  |   |   dup  swap  x              | E | FILE DISPLAY (right)        | E | METADATA  | T |
|   | [Close]    |   +-----------------------------+ R |                             |   | PANE (F9) |   |
|   |            |   | FILE DISPLAY (left)         |   |   > subfolder  (chevron =   |   |           |   |
|   |  C:        |   |  Name   Size   Modified     |   |     expandable folder)      |   |           |   |
|   |   Data     |   |  ...                        |   |                             |   |           |   |
|   |            |   | [FAYT field: "rep"       ]  |   | [Filter Bar: *.jpg   x ]    |   |           |   |
|   |            |   +-----------------------------+   +-----------------------------+   |           |   |
|   |            |   | Folder tab bar [Data][Docs] |   | Folder tab bar [Backup]     |   |           |   |
|   |            |   | Status bar  3/120 files ... |   | Status bar ... 80 GB [####] |   |           |   |
+---+------------+---+-----------------------------+---+-----------------------------+---+-----------+---+
| fdbottom toolbar (under the file displays, does not extend under the tree)                 |
| UTILITY PANEL  [Find Files v]   results or logs                                [shrink]    |  [3]
| bottom toolbar (very bottom of the Lister, under everything)                               |
+==========================================================================================+
```

| Mark | Official name | Notes |
|---|---|---|
| [1] | Lister title bar | Text set on File Displays / Title Bar. Top-row toolbars can be moved into it. |
| [2] | Menu, Operations, Favorites Bar (default toolbars, `STATE=top`) | `LINE=<n>` picks the row. |
| LEFT / RIGHT | toolbars docked at the window edges | `Toolbar <name> STATE=left` or `STATE=right` |
| TREE | toolbar between the tree and the left file display | `STATE=tree` |
| CENTER | toolbar between the two file displays, vertical or horizontal to match the dual layout | `STATE=center` |
| VPANE | toolbar between the file displays and a right-side viewer pane. Acts as `right` when the viewer pane is closed or at the bottom | `STATE=viewpane` |
| fdbottom / bottom | toolbars under the file displays / under the whole Lister | `STATE=fdbottom`, `STATE=bottom` |
| Location bar toolbar | File Display toolbar, one per file display | `STATE=fdb` or `Set FDBTOOLBAR=<name>` |
| [3] | Utility panel | Opens at the bottom when Find, Synchronize, Duplicates or a log runs. Exact stacking order against the bottom toolbars and the Jobs bar is `[unverified]`. |

Layout variants:
- Dual horizontal layout (`Set DUAL=horiz`) puts one file display above the other. The CENTER toolbar is then horizontal.
- Viewer pane vertical layout = right of the Lister (shown). Horizontal layout = bottom of the Lister. Same `horiz`/`vert` keywords for the metadata pane. Where the metadata pane sits relative to the viewer pane when both are open is `[unverified]`.
- Status bar is per file display by default. `Set STATUSBARSTYLE=bottom` moves it to the Lister bottom, `=single` uses one bar for both displays.
- Folder tab bar defaults below each file display. It can go above, left or right (Folder Tabs / Folder Tab Bar / Tab bar position).
- FAYT field and Filter Bar both pop up at the bottom of a file display.
- In a dual display Lister the source location bar is blue by default, the destination grey (light mode) or red (dark mode).

## User says → concept

Commands were checked against `references/commands.md` except where noted. `Prefs` paths are `Category / Page / option`.

### Window, layout, settings

| User words | DOpus name | Configure in | Toggle / control |
|---|---|---|---|
| "the window", "main window", "explorer window" | Lister | Layouts and Styles / Default Lister | `Go NEW`, `Set LISTERCMD=maximize` |
| "new window opens wrong", "what a new window looks like" | Default Lister | Layouts and Styles / Default Lister | `Prefs SETLISTERDEFAULTS` |
| "window title", "title text" | Lister title bar | File Displays / Title Bar (Display folder path, Custom title) | `Set LISTERTITLE=<text>` |
| "title bar buttons", "toolbar inside the title bar" | top-row toolbars moved into the title bar | Toolbars / Options / Move top-row toolbars into the window title bar | `Set TITLEBARTOOLBARS=toggle` |
| "top-left icon", "window menu" | window icon | none | click it, choose Customize |
| "saved workspace", "window setup", "session" | Lister Layout | Layouts and Styles / Layouts | `Prefs LAYOUT=<name>`, `Prefs LAYOUTSAVE` |
| "preset look", "commander look", "switch arrangement" | Lister Style | Layouts and Styles / Styles | `Prefs STYLE=<name>`, `Prefs STYLELIST` |
| "settings", "options", "preferences" | Preferences | none | `Prefs`, `Prefs PAGE=<page>` |
| "edit buttons", "edit menus", "customize" | Customize mode | Settings > Customize Toolbars and Keys... | `Prefs CUSTOMIZE`, Alt + click a button |
| "shortcuts", "keyboard shortcuts" | hotkeys | Customize / Keys | `Prefs KEYS` |
| "dark mode" | Dark Mode | Colors And Fonts / Dark Mode | `Set DARKMODE=toggle` |
| "theme", "colors" | Themes, Directory Opus Colors | Colors And Fonts / Themes, Directory Opus Colors | `Prefs THEMELOAD THEMENAME=<file>` |
| "compact", "padding", "row height" | spacing scheme | User Interface / Spacing | `Set SPACINGSCHEME=<name>` |

### Toolbars

| User words | DOpus name | Configure in | Toggle / control |
|---|---|---|---|
| "menu bar", "File Edit menus" | Menu toolbar (default) | Customize / Toolbars | `Toolbar Menu TOGGLE` |
| "the toolbar", "big button row", "copy move delete buttons" | Operations toolbar (default) | Customize / Toolbars | `Toolbar Operations TOGGLE` |
| "bookmarks bar", "favorites row" | Favorites Bar (default toolbar) | Customize / Toolbars | `Toolbar "Favorites Bar" TOGGLE` (file `Buttons\Favorites Bar.dop`) |
| "toolbar above each pane" | File Display toolbar | Location Bar / Toolbars | `Set FDBTOOLBAR=<name>` |
| "toolbar that appears with thumbnails" | Images toolbar, view mode toolbar | Toolbars / View Mode Toolbars | `Toolbar Images STATE=fdbottom TOGGLE` |
| "toolbar only in some folders" | folder toolbar | Toolbars / Folder Toolbars, Folder Formats | none |
| "middle vertical toolbar", "toolbar between panes" | center toolbar | Customize (drag to position) | `Toolbar <name> STATE=center TOGGLE` |
| "side toolbar", "vertical toolbar" | left or right docked toolbar | Customize | `Toolbar <name> STATE=left` |
| "toolbar next to the preview" | viewpane toolbar | Customize | `Toolbar <name> STATE=viewpane` |
| "toolbar next to the tree" | tree toolbar | Customize | `Toolbar <name> STATE=tree` |
| "bottom toolbar" | bottom or fdbottom toolbar | Customize | `Toolbar <name> STATE=bottom` |
| "floating toolbar", "toolbar on the desktop", "dock to screen edge" | floating toolbar, appbar | Toolbars / Floating Toolbars | `Toolbar <name> STATE=float`, `APPBAR=top` |
| "toolbars keep moving" | Lock Toolbars | Toolbars / Options / Lock Toolbars | toolbar right-click menu |
| "my set of toolbars", "default toolbars for new windows" | Toolbar Set, Default Toolbar Set | Toolbars / Sets | `Toolbar LOADSET`, `Toolbar SETDEFAULT` |
| "reset toolbar" | factory reset toolbar | Customize / Toolbars | `Toolbar RESETDEFAULTS` |
| "drive buttons", "drive letters bar" | Drives toolbar (pre-supplied, built from `Go DRIVEBUTTONS`) | Settings / Toolbars / Drives | `Toolbar Drives TOGGLE` |
| "drive dropdown" | Drives Dropdown | Customize / Commands, search "drive" | none |

### Location bar and navigation

| User words | DOpus name | Configure in | Toggle / control |
|---|---|---|---|
| "address bar", "path bar", "location bar", "header" | Location Bar (strip above each file display) | Location Bar / Toolbars | `Set FDBTOOLBAR=<name>` |
| "breadcrumbs", "clickable path" | breadcrumbs path field | Location Bar / Path Fields, Appearance, Components | `Set FOCUS=pathfield` |
| "type a path", "edit the address" | path field edit mode, FAYT Go mode | Location Bar / Path Completion | `Set FOCUS=pathfield`, `Go PATHENTRY` |
| "arrows between path parts", "chevron in the path" | breadcrumb drop-down arrow | Location Bar / Appearance (Arrow width), Location Bar / Menus | none |
| "icon at the left edge of the path bar" (outside the breadcrumbs box) | Location Bar `Icon`, a Directory Opus icon on the border. Optional, off in the default File Display toolbar mode | Location Bar / Options / Icon | drag = shortcut to the current folder, right-click = the folder's context menu (manual) |
| "folder icon inside the address/URL bar", "icon in the path field" | the current-folder icon inside the breadcrumbs path field (`field_type="path_treepath"`), part of the field itself | none found in the manual. `Location Bar / Path Fields` has no option for it | clicking it only selects the path text, user-observed on 13.11. Cannot be hidden or rebound: staff forum thread "Remove location/folder icon from Location Bar" `[forum, not in manual]`. No click-to-copy. For one-click copy add a separate button (`references/customize.md`, Copy folder path) |
| "greyed folders after going up" | ghost crumbs | Location Bar / Path Fields / Append ghost components | `Go LASTCRUMB`, `Go NEXTCRUMB` |
| "This PC missing in the path" | This PC component | Location Bar / Components | none |
| "back forward up buttons" | Back, Forward, Up (File Display toolbar) | Customize | `Go BACK`, `Go FORWARD`, `Go UP` |
| "history dropdown" | history list | none | right-click Back, `Go BACKLIST`, `Go HISTORYLIST` |
| "refresh button" | Refresh | none | `Go REFRESH` |
| "home button" | Home folder | Frequently Used Paths / Home Folder | `Go HOMEDIR` |
| "copy to other side", "swap sides" buttons | Duplicate and Swap (file display border) | Location Bar / Options / File display Copy and Swap buttons | `Go SWAP` |
| "X on the path bar" | Close button | Location Bar / Options / Close button | `Go TABCLOSE` |
| "old plain header" | static header | Location Bar / Toolbars / Display as a static header | none |
| "favorites", "bookmarks", "starred folders" | Favorites (Favorites List) | Frequently Used Paths / Favorites List | `Favorites ADD`, `Favorites EDIT` |
| "frequent folders" | SmartFavorites | Frequently Used Paths / SmartFavorites | `Favorites SMART` |
| "remove / hide a folder from frequent folders" | SmartFavorites entry. Only removable by editing `smartfav.osf` (no UI, no exclusion list) | none. `Clear` wipes all | `references/config-files.md`, "Remove entries from SmartFavorites" |
| "folder shortcut word like /docs" | folder alias | Frequently Used Paths / Folder Aliases | `Favorites ALIAS=set` |
| "search box", "search bar top right" | search field (Quick Search) on the Menu toolbar | engine menu on the field | F3, `Find QUERY=<text>` |
| "find files", "advanced search" | Find Files (utility panel) | none | `Find`, `Set UTILITY=find` |

### Tree, file display, dual display

| User words | DOpus name | Configure in | Toggle / control |
|---|---|---|---|
| "sidebar", "left panel", "navigation pane", "directory tree", "folder list" | Folder Tree | Folder Tree / Appearance, Contents, Options | `Set TREE=toggle`, F8 |
| "tree for each side" | second folder tree | Folder Tree / Options / Open second Folder Tree in dual display mode | `Set TREE=dual` |
| "pinned folders in the tree" | tree pins | Folder Tree / Pins | `Go TREESETPINSTATE` |
| "collapse tree", "tree buttons" | folder tree title buttons (Locate, Collapse, Presets, Close) | none | `Go TREECOLLAPSE` |
| "clicking the tree opens a tab" | tree selection events | Folder Tree / Selection Events | e.g. `Go TABFINDEXISTING` |
| "file list", "main area", "content pane", "right panel" (single display) | file display | File Displays / *, File Display Modes / * | none |
| "details", "thumbnails", "icons" | view mode | File Display Modes / * | `Set VIEW=details`, `Set VIEW=thumbnails` |
| "columns" | columns | File Display Columns / * | `Set COLUMNSTOGGLE=<col>` |
| "remember view per folder" | Folder Format | Folders / Folder Formats | `Set SAVEFORMAT` |
| "chevron", "expand arrow next to folders in the list" | expandable folders | File Displays / Folder Expansion | `Set EXPANDABLEFOLDERS=toggle`, `Go EXPANDBRANCH` |
| "show all files from subfolders" | Flat View | none | `Set FLATVIEW=toggle` |
| "checkboxes" | Checkbox mode | none | `Set CHECKBOXMODE=toggle` |
| "split view", "two panes", "dual pane", "side by side", "commander mode" | dual display, vertical layout | File Displays / Options | `Set DUAL=vert`, `Set DUAL=toggle`, F6 |
| "split top and bottom", "stacked panes" | dual display, horizontal layout | File Displays / Options | `Set DUAL=horiz` |
| "rotate the split" | dual layout toggle | none | `Set DUAL=togglelayout` |
| "divider between panes" | dual splitter | none | `Set DUALSIZE=<size>` |
| "active side", "other side", "the blue one" | source / destination | File Displays / Options / Single display Listers have source/destination modes | Tab key, `Set SOURCE=left`, `Set FOCUS=toggle` |
| "both sides scroll and navigate together" | Navigation Lock | none | `Set NAVLOCK=toggle` |

### Tabs, filtering, panes, bars

| User words | DOpus name | Configure in | Toggle / control |
|---|---|---|---|
| "tabs" | folder tabs, folder tab bar | Folder Tabs / Folder Tab Bar | `Go NEWTAB`, `Set HIDEFOLDERTABS=toggle` |
| "vertical tabs", "tabs on top" | Tab bar position | Folder Tabs / Folder Tab Bar / Tab bar position | `Set TABPOSITION=left` |
| "hide tab bar with one tab" | Display folder tab bar: When needed | Folder Tabs / Folder Tab Bar | none |
| "tab list", "Ctrl+Tab popup" | Tab Switcher | none | Ctrl + Tab, `Go TABSWITCHER` |
| "saved tab sets" | Tab Groups | Folder Tabs / Groups | `Go TABGROUPLOAD=<name>` |
| "pin a tab", "lock a tab" | locked tab | Folder Tabs / Locking | `Go TABLOCK=toggle` |
| "reopen closed tab" | undo tab close | none | `Go TABUNDOCLOSE` |
| "quick filter", "filter box", "show only *.jpg" | Filter Bar (edits the quick filter) | Filtering And Sorting / Filter Bar | `*` key, `Set QUICKFILTER`, `Set QUICKFILTERCLEAR` |
| "filter field in the toolbar" | File Filter Field (toolbar filter field) | Customize / Commands / File Lists | none |
| "type to find", "jump to file by typing", "box that pops up when I type" | Find-as-you-type field (FAYT), Find mode | Filtering And Sorting / Find-As-You-Type, Find Mode, Quick Keys | F3 / Shift + F3 next and previous match |
| "command line in the window" | FAYT Command mode | Filtering And Sorting / Quick Keys (default key `>`) | `>` |
| "hide hidden files everywhere" | global filters | Filtering And Sorting / Global Filters | `Set GLOBALHIDEHIDDEN=toggle` |
| "preview", "preview pane", "preview panel" | viewer pane | Viewer / Viewer Pane | `Set VIEWPANE=toggle`, F7 |
| "preview at the bottom instead of the right" | viewer pane layout | none | `Set VIEWPANE=togglelayout` |
| "spacebar preview", "quick look" | QuickShow | Viewer / QuickShow (Trigger QuickShow with the Space key) | `Show QUICKSHOW` (in manual text, missing from references/commands.md) |
| "image viewer window" | standalone viewer | Viewer / Standalone Viewer | `Show <file>` |
| "info panel", "details pane", "properties panel", "tag editor" | metadata pane | File Operations / Metadata, Metadata Editor | `Set METAPANE=toggle`, F9 |
| "bottom panel with results", "log window", "console" | utility panel (Find, Sync, Duplicates, logs) | none | `Set UTILITY=toggle`, `Set UTILITY=scriptlog` |
| "bottom bar", "info bar", "status line" | status bar | File Displays / Status Bar | `Set STATUSBAR=toggle` |
| "the bar graph for disk space", "SSD bar graph" | status bar bar graph (`{bg}` code) | File Displays / Status Bar | none |
| "one status bar for both sides" | status bar style | File Displays / Status Bar | `Set STATUSBARSTYLE=single` |
| "progress strip for running copies" | Jobs Bar | File Operations / Progress Indicators | `Set JOBSBAR=toggle` |
| "right-click menu", "context menu" | context menu. Files/folders: File Types. Background, tabs, column header: Customize / Context Menus | Settings / File Types, Customize / Context Menus | `ContextMenu` |
| "a menu item I didn't add" | shell extension (not part of Opus) | Miscellaneous / Shell Extensions | none |

## Disambiguation

**Pane vs panel vs bar.** Manual usage: "pane" for the viewer pane and metadata pane (beside or under the file displays), "panel" for the utility panel (bottom, multi-mode). The manual also says "viewer panel" in places. "Bar" is a thin strip: status bar, filter bar, folder tab bar, jobs bar, location bar, Favorites Bar. Users say "pane" for anything. Ask where it sits on screen and match against the map.

**Lister vs window vs layout vs style vs Default Lister.** Lister = one main window. Layout = saved set of one or more Listers, loading it opens new Listers. Style = changes the current Lister's elements (panes, toolbars, tabs) without opening a new one. Default Lister = the template used for new Listers, updated automatically on close by default. "My new window looks wrong" is a Default Lister question. "Save my setup" is a Layout question.

**Source vs destination.** Only meaningful with two folders. In a dual display Lister one side is always source (active, blue location bar by default), the other destination. Copy, Move and similar commands act on the source selection and target the destination. Click a display, its status bar, or press Tab to switch. Single display Listers have no destination unless File Displays / Options / Single display Listers have source/destination modes is on.

**Toolbar vs menu.** Same thing in DOpus. The Menu toolbar is a toolbar of drop-down buttons. Every toolbar and menu is edited in Customize. Context menus (right-click) are separate: files and folders come from File Types, other right-click menus from Customize / Context Menus.

**Location bar vs location field vs path field.** Location Bar = the whole strip above a file display. By default it holds the File Display toolbar. Breadcrumbs path field (also "location field") = the clickable path control on that toolbar. Its options are on Location Bar / Path Fields. Static header = the non-toolbar fallback for the Location Bar. Folder tabs are not part of it.

**Filter bar vs FAYT vs quick search vs search field.**
- Filter Bar: hides non-matching items in the current folder. Opens with `*`. Edits the quick filter, which sits on top of folder format and global filters and never reveals what those hide.
- FAYT: pops up when typing a letter. Find mode jumps to matches without hiding anything. Other modes start with a key (Command `>` etc). Filter mode exists but is off by default in favor of the Filter Bar.
- Search field / Quick Search: the field on the Menu toolbar. Searches the current folder with Windows Search, Everything or the Opus engine (engine picked from the button left of the field).
- Find Files: the full search tool in the utility panel.
- Toolbar filter field: a toolbar version of the Filter Bar.

**Expandable folder chevron vs tree.** The chevron next to folders in the file display is expandable folders (File Displays / Folder Expansion), not the Folder Tree. The tree has its own indent setting on Folder Tree / Appearance. No indent option for file display expanders appears on the Folder Expansion page in the manual extract.

**Viewer pane vs standalone viewer vs QuickShow.** Viewer pane = docked inside the Lister, follows the selection, F7. Standalone viewer = separate image viewer window (`Show`), own pages under Viewer / Standalone Viewer. QuickShow = borderless cut-down viewer on Space or mouse trigger, only Esc and arrow keys work. Viewer / Viewer Pane options do not affect the standalone viewer.

**Dual horizontal vs vertical.** DOpus names the layout by the split line. `Set DUAL=horiz` = one display above the other. `Set DUAL=vert` = side by side. Users saying "left and right panes" want `vert`.

## Pitfalls

- "Turn off the location bar" in dual display → not possible. The header must show source and destination. Single display only: Location Bar / Toolbars / Show header even in single display mode (static header mode).
- Toggle keys F6, F7, F8, F9, `*`, `>` are factory defaults. Customized hotkeys or Quick Keys may differ. Check Customize / Keys before telling a user to press one.
- Toolbars a Lister opens with come from its Layout or the Default Toolbar Set. Turning a toolbar on in one Lister does not change new Listers. Use Settings / Toolbars / Set As Default Toolbar Set (`Toolbar SETDEFAULT`).
- Utility panel can be shrunk to its title bar. "My search panel shrank" → shrink button in its top-right corner.
