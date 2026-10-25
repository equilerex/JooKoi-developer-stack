# Sorting, grouping, folder formats, expandable folders, flat view, virtual file systems

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- sort.basics: Sorting
- sort.options: Sorting tab options (Folder Format dialog)
- sort.manual: Manual sorting
- group.basics: Grouping
- group.options: Grouping tab options
- columns.freeze: Frozen columns
- columns.config: Columns tab (Folder Format)
- formats.concept: Folder format (concept)
- formats.dialog: Folder Format dialog
- formats.save: Saving a folder format
- formats.display: Display tab
- formats.filters: Show Filters and Hide Filters tabs
- formats.auto: Auto-remembered formats
- formats.content: Content types (format by folder contents)
- formats.identify: Identifying the current format
- formats.lock: Locking the format
- view.expandable: Expandable folders
- view.flatview: Flat View
- folders.sizes: Folder sizes
- vfs.concept: Virtual file systems
- vfs.systemfolders: System virtual folders (Desktop, This PC)
- collections.concept: File Collections
- collections.stored: Stored queries
- libraries.concept: Libraries
- archives.concept: Archives as folders
- ftp.concept: FTP as folders
- mtp.concept: MTP devices
<!-- contents:end -->

## sort.basics | Sorting
src: 0058 | area: sort
ui: column header; right-click file display background or status bar; Folder Format dialog / Columns tab; Preferences / File Displays / Options (`Show sort header in icon modes`)
user-words: sort by, order files, sort descending, sort by date, sort by multiple columns
what: A column must be enabled in the folder format to sort by it (also in List/icon modes). Details/Power: click header = sort, click again = reverse, Shift+click = straight to reverse, right-click header = menu. Arrow in header shows field and direction.
notes: Multiple fields: Ctrl+click further headers (extra arrow button at the left reverses overall order). Ctrl+Shift+click changes direction of one field only. Without a header: right-click empty file display area (or status bar) and pick the field. Files before/after/mixed with folders is in the Folder Format dialog.
see: sort.options, sort.manual, formats.dialog

## sort.options | Sorting tab options (Folder Format dialog)
src: 0063 | area: sort
ui: Folder / Folder Format / Sorting tab
user-words: sort numbers naturally, folders first, ignore the in names, reverse sort
what: Options besides which fields sort.
options:
- `Keep folders sorted alphabetically` (not with mixing)
- `Manual sorting` (turn on manual order)
- `Numeric order filename sorting`: digits at start or end of names sort by numeric value
- `Reverse overall sort order`
- `Sort name and extension separately`: sort by stem first, then extension, keeps same-stem names together
- `Sort newly copied and created files`: off = new files added unsorted at the end (overrides Filtering and Sorting / Sorting)
- `Word sort`: punctuation before alphanumerics except hyphen and apostrophe (keeps `coop` and `co-op` together)
- `Mixing`: files before folders, folders before files, or interspersed
- `Ignore prefix`: prefixes skipped when sorting (for example `The `)

## sort.manual | Manual sorting
src: 0059 | area: sort
ui: right-click column header > Sort By > Manual Sorting; Folder Format / Sorting / `Manual sorting`; Preferences / Filtering and Sorting / Sorting
user-words: custom order, drag files to reorder, arrange files by hand
what: Arbitrary order. Turning it on has no visible effect unless an order was saved. Move items by drag and drop or Shift+Alt+cursor keys. A control-menu button appears at the left of the column header: Save Sort Order, Reset Sort Order (back to automatic), named orders.
options:
- `Automatically save manual sort order where possible` (Sorting page, default on): off = changes are temporary, control-menu button turns red until saved
- `Allow manual sorting even when the order can't be saved` (Sorting page): otherwise manual sorting is disabled where saving is impossible
- named orders: Advanced option `manual_sort_names`, then selectable from the header menu and the Sorting tab dropdown
notes: Cannot be saved on non-NTFS drives, folders without write permission, archives, FTP. Cloud folders on local drives save, but the sort metadata likely does not sync. Not supported in Flat View or when grouped.
see: formats.save

## group.basics | Grouping
src: 0058 | area: group
ui: right-click column header > Group By; Folder Format / Grouping tab; Preferences / File Display Columns / Options (`Add 'Group' column automatically when file display is grouped`); Colors page for group header colours
user-words: group by date, group by type, collapse groups, ungroup, disable grouping
what: Splits the list into headed groups (with item counts). May group by a column that is not displayed (via Folder Format dialog or `Set GROUPBY`). Header: Alt+click a column header = group by it (again reverses), Shift+Alt+click = grouping off. Group header: arrow glyph or Left/Right collapse/expand, click selects the group, right-click selects it and shows a menu with Collapse group, Expand group, Expand all groups, Collapse all groups, Collapse other groups. A Group column (added in Folder Format) shows headings inline instead of vertical headers.
notes: Evaluator grouping schemes: Preferences / File Display Columns / Evaluator Groups.
cmd: `Set GROUPBY`
see: group.options, evaluator.ctx.columns

## group.options | Grouping tab options
src: 0064 | area: group
ui: Folder / Folder Format / Grouping tab
user-words: group settings, group other, combine groups
what: `Group by` (column, need not be displayed), `Scheme` (if several defined), `Sort groups` (ascending/descending), `Combine`: `Combine similar values` (ranges such as A-H), `Never combine values`, `Singletons in 'Other' group`. `Collapse all groups initially`. `Put folders in their own group`.

## columns.freeze | Frozen columns
src: 0062 | area: columns
ui: right-click column header > Freeze Columns To Here; Ctrl+Alt+click a header; Folder Format / Columns / Freeze field
user-words: lock columns, keep name column visible when scrolling
what: Freezes the clicked column and all to its left in Details/Power. Repeating the action toggles it off.

## columns.config | Columns tab (Folder Format)
src: 0061 | area: columns
ui: Folder / Folder Format / Columns tab (right-click header > More)
user-words: add column, show size column, column width, hide extension, reorder columns
what: Two lists: available (left), enabled (right). Move by double-click, drag, or arrows. Reorder on the right or by dragging headers. Filter field at the bottom finds columns by name.
options:
- Width per column: pixels or `Auto` (fit contents), `Expand` (like Auto, ignored when computing Fill, may run off the right), `Collapse` (auto but can shrink to zero so others fit), `Fill` (takes remaining space, shared among Fill columns). `Min` / `Max` for auto columns, Max `Fill` = auto up to the display width without growing past needs
- `Freeze` field: click to set the freeze point, click again to clear
- `Sort` column: click a field to sort by it, Ctrl or Shift+click for more fields, Ctrl/Shift+click on a sorted field flips only its direction
- `Auto-size all columns in Details and Power modes` (editing one width turns it off)
- `Hide file extension in Filename column`
- `Include columns from other matching formats` (only when editing a saved format in Preferences): columns of other matching formats are merged in
- Index column `Reverse` option: numbers count down, last index at the top and #1 at the bottom
see: formats.dialog

## formats.concept | Folder format (concept)
src: 0059, 0067 | area: formats
ui: Preferences / Folders / Folder Formats (`Prefs PAGE=folderformats`)
user-words: remember view for folder, folder always details, per-folder view, why does view change
what: Folder format = view mode, columns, sort, grouping, filters (and related display options such as checkbox mode, thumbnail size, font) for what a file display shows. Changing columns, sort or view changes the format of that display until something else changes it. Opus applies the best saved format automatically when you navigate.
options:
- saved format kinds on the Folder Formats page: `Path Formats` (single folder or folder plus sub-folders, wildcard paths allowed), `System folders` (for example This PC), `Content Type Formats` (per file type group), `Folder Type Formats` (drive kinds, file collection, Flat View...), `Favorite Formats` (quick choice in the Folder menu), `Default Format` (the editable `User Default`, used when nothing more specific exists)
notes: Folder formats are one of the most confusing parts for users. Use the status bar format indicator tooltip to learn why a format is in use. Frozen formats also live inside layouts, tab groups, styles and open tabs and win when those load.
see: formats.dialog, formats.save, formats.identify, formats.lock, formats.content, formats.auto

## formats.dialog | Folder Format dialog
src: 0060 | area: formats
ui: Folder / Folder Format; right-click column header > More
user-words: folder options, change columns sort group for folder
what: Six tabs: `Columns`, `Sorting`, `Grouping`, `Display`, and two filter tabs (`Show Filters`, `Hide Filters`). In some contexts each tab has an on/off checkbox so a saved format overrides only part of the default. Changes persist in that file display until something else changes them.
see: columns.config, sort.options, group.options, formats.display, formats.filters

## formats.save | Saving a folder format
src: 0060 | area: formats
ui: Folder Format dialog / Save button
user-words: make this view permanent, save view for folder, save as default
what: `Save` opens Save Folder Format with three choices.
options:
- `Save format for a folder`: current folder (up button saves for a parent). `Replace this folder's format…` also updates matching saved layouts, tab groups, styles and open tabs. `Save for all sub-folders` sets `Use as the default format for all sub-folders`
- `Save format for all folders`: becomes the User Default. `Clear any saved folder formats` resets folders that had a specific format. `Replace the folder format…` also resets formats inside layouts, tabs and styles
- `Save a favorite format`: new or over an existing favorite
notes: Alternative: define it directly on Preferences / Folders / Folder Formats.

## formats.display | Display tab
src: 0065 | area: formats
ui: Folder Format / Display tab
user-words: view mode for folder, thumbnail size for folder, font for folder
what: `View mode`, `List mode column width` (Auto = Details Name width), `Checkbox mode`, `Thumbnail size`, `Thumbnail resizing`, `Font` (separate font possible for thumbnails mode).

## formats.filters | Show Filters and Hide Filters tabs
src: 0066 | area: formats
ui: Folder Format / Show Filters, Hide Filters
user-words: hide files in a folder, only show certain files in folder, hide by attribute
what: `Show Filters` hides items that do NOT match, `Hide Filters` hides items that DO match. `File names` and `Folder names` fields take standard patterns or regex (`Use regular expression`). `Attributes`: matches if any selected attribute is set. Optional separate attribute filter for folders (then the first Attributes field applies to files only). Stacks on global filters. Show Everything disables them in a tab.
see: filter.showeverything

## formats.auto | Auto-remembered formats
src: 0068 | area: formats
ui: Preferences / Folders / Automatic Formats
user-words: remembers my sort, remembers last folders view
what: Opus remembers format changes for recently used folders automatically. You choose how many folders it remembers.

## formats.content | Content types (format by folder contents)
src: 0069 | area: formats
ui: Preferences / Folders / Folder Formats / Content Type Formats
user-words: pictures folder thumbnails automatically, music folder different view, switch view by file type
what: Based on File Type Groups. Disabled until you tick the checkbox next to a group in Content Type Formats. Format applies when a share of files in the folder belong to the group.
options:
- threshold percentage next to each group (click to edit), `Consider subfolders when calculating content threshold`, `Minimum files`, `Maximum files`
notes: Example: Images group 25% means thumbnails format when at least 25% of files are images. Adding a group in the File Types editor adds its entry here automatically.

## formats.identify | Identifying the current format
src: 0070 | area: formats
ui: status bar format icon (code `{fl}`); Preferences / File Displays / Status Bar
user-words: why this view, where does this format come from, reset view
what: Hover the status bar icon: tooltip explains how the format arose (for example auto-remembered then modified by adding a column), where the Lister came from (for example system layout `Last Closed Listers`), and the background image source. Right-click menu: `Format Lock`, `Folder Format` (dialog), `Manage Folder Formats` (Preferences page), content type formats (switch instantly), resets: `Reset to folder's format` (as a fresh tab would load), `Reset to folder-type format`, `Reset to "User Default" format`, `Reset to factory default format`, `Edit Status Bar`.
notes: If the `{fl}` code was removed from the status bar definition the icon is gone. Re-add on the Status Bar page.
see: formats.lock

## formats.lock | Locking the format
src: 0071 | area: formats
ui: status bar icon right-click > Format Lock; Folder menu > Format Lock; Preferences / Folder Tabs / Options (`Per-tab format lock`); File Displays / Status Bar (`Enable format lock padlock icon`)
user-words: keep same view in all folders, stop view changing, lock view
what: When locked, the display format does not change automatically as you move between folders. Manual changes still work. Lock applies to all tabs unless `Per-tab format lock`. Icon becomes a padlock. `Enable format lock padlock icon` shows the padlock permanently so a click toggles it.

## view.expandable | Expandable folders
src: 0071 | area: view
ui: Preferences / File Displays / Folder Expansion
user-words: expand folder in list, tree in file list, show subfolder contents inline
what: Arrow glyph left of folders expands them inside the file display. Click glyph or Alt+Down, collapse with click or Alt+Up. Drag files into and out of expanded folders. Option for spring-loaded folders (expand while dragging over). `Hide expand buttons until a folder is expanded` keeps Alt+Down working. `Go EXPANDBRANCH` can be bound to your own key.
notes: Copying nested files: `Recreate` (rebuild the folder structure relative to the base) or `Same Folder` (flatten into target).
cmd: `Go EXPANDBRANCH`

## view.flatview | Flat View
src: 0071 | area: view
ui: Flat View button (Menu toolbar), right-click for modes; Folder / Flat View; Preferences / Folders / Folder Formats / Folder Type Formats (Flat View)
user-words: show all files in subfolders, recursive view, flatten folder
what: Shows contents of all sub-folders at once. Modes: `Mixed` (all items from the folder and all sub-folders in one list), `Mixed (No Folders)` (files only), `Grouped` (sub-folder contents as a tree hierarchy). The button cycles the modes. Default Flat View format adds the `Location (relative)` column.
notes: Dropping into the file display (not on a sub-folder) targets the base folder, so dragging from a nested folder can move a file to the base by accident (undoable). Copy nested files: `Recreate` or `Same Folder` as for expandable folders. Folder filters in Flat View hide whole sub-trees, see Filter Bar option. Manual sorting is unsupported in Flat View.
see: filter.bar, sort.manual

## folders.sizes | Folder sizes
src: 0071 | area: folders
ui: Edit / Calculate Folder Sizes (Ctrl+K); Preferences / Folders / Folder Sizes
user-words: show folder size, size column for folders, why folder size is blank, tilde before size
what: Windows does not store folder totals; Opus counts contents. Manual: select folders then `Calculate Folder Sizes` (no selection = all sub-folders). Hovering a folder tooltip with `{foldersize}` also triggers a count. Automatic calculation is set on the Folder Sizes page. Columns such as File Count (Total) force sub-folder reads and size calculation. Everything (voidtools) makes it much faster for indexed places.
notes: A leading `~` means approximate: calculation not finished or some sub-folders unreadable. Everything usually shows no tilde and can give different totals (includes folders Opus cannot read). Junction and soft-link counting is configurable. Treat sizes as a guide.
see: toolbars.menu

## vfs.concept | Virtual file systems
src: 0071 | area: vfs
ui: n/a
user-words: archive as folder, ftp as folder, collection, library
what: Beyond the real file system Opus provides: system virtual folders, File Collections, Libraries, Archives, FTP, MTP. They behave like folders. Plugins can add more (for example the registry).

## vfs.systemfolders | System virtual folders (Desktop, This PC)
src: 0072 | area: vfs
ui: Preferences / Virtual Folders / (Desktop, This PC, File System)
user-words: this pc empty drives, desktop items, shell folders, control panel in opus
what: Native in Opus: `Desktop` (merged user and All Users desktop plus virtual items; Desktop page picks which virtual folders show), `This PC` (empty drives such as a DVD without disc hidden by default, change on This PC page), `CD Burning` (staged burning only). Other shell folders are hosted in an Explorer instance inside the Lister, a black box: most Opus features do not work there.
notes: Some folders are real folders with a virtual overlay (for example `C:\Windows\Fonts`). Virtual Folders / File System page can show the underlying real folder instead.

## collections.concept | File Collections
src: 0073 | area: vfs
ui: path `coll://`; File Collections item in the tree or Desktop; Preferences / Miscellaneous / Windows Integration
user-words: virtual folder of files, playlist of files, search results folder, reference files
what: Virtual folder holding references to files anywhere (other disks, FTP). Used for results of Quick Search, Find Files and Duplicate Finder. Items act like real files: delete deletes the real file (use `Remove From Collection` from the Delete drop-down to keep the file).
notes: Paths `coll://Find Results/`, `Copy TO "coll://Favorite Photos"` adds selection to that collection. Root `coll://` (cannot add items to the root). Reach it by tree item, Desktop item, location field drop-down, or typing `coll://`. Create: New Folder in the root (sub-collections the same way). Properties can set icon and description. Default format adds the `Location` column. File Types can add context menu items for collection items, predefined: `Remove from Collection`, `Open Containing Folder` (`Go OPENCONTAINER`).
options:
- Windows Integration: `Add File Collections icon to the Desktop`, `Add File Collections list to the Send To menu`
notes: Not accessible outside Opus. `dopusrt` can manipulate collections from outside.
cmd: `Go OPENCONTAINER`
see: collections.stored

## collections.stored | Stored queries
src: 0074 | area: vfs
ui: File Collections root > right-click > New Stored Query; or `Save as Stored Query` from quick search results; item Properties / Query tab
user-words: saved search, live search folder, persistent search
what: A collection that keeps a search string and folders and re-runs it. Query tab: `Query` (search field syntax of the engine; Opus search takes a name wildcard, a filter definition prefixed with `&`, or evaluator code prefixed with `=`), `Search Engine` (+ engine options), `Folders` (disabled for global engines), `Refresh results automatically` (re-run each time you open it; use for indexed locations; off = keeps last results until F5/Refresh).

## libraries.concept | Libraries
src: 0075 | area: vfs
ui: path `lib://`; Libraries item in the tree or Desktop; library Properties
user-words: documents library, combine folders, unified folder view
what: Virtual folder showing the contents of member folders (not individual files). Default libraries: Documents, Music, Pictures, Videos (right-click Libraries root > `Restore default libraries`). New library: New Folder in the root, then Properties to include folders.
options:
- Properties: `Library locations` list, `Include a folder`, `Remove`, `Set save location` (check mark = default save location; single member is always it)
- Folder context menu `Include in library`
- `Folder Tree / Contents / Show member folders individually`
- `Don't show in navigation pane` (hide a library from the tree)
notes: Path `Go lib://Pictures`. Windows programs do not understand `lib://`: use Edit / Copy Other / Folder Path to copy a usable path. Add the `Location` column to see real locations.
cmd: `Go lib://Pictures`

## archives.concept | Archives as folders
src: 0076 | area: vfs
ui: Preferences / Zip and Other Archives; Folder Tree / Contents (`Show in Folder Tree`)
user-words: open zip like folder, rar 7z support, disable archive format
what: Zip is built in, RAR/7z/ISO etc. via plugins. Double-click enters an archive like a folder; copy out, view, add files (for formats that support writing). Archive Files button creates archives. Context menu items per format: Zip and Other Archives / Archive Context Menu page. Disable formats in that Preferences section. All supported formats are in the `Archives` file type group (change double-click action or add context menu items for all at once).
notes: Zip options: Zip and Other Archives / Zip Files. Other formats: Archive and VFS Plugins page.

## ftp.concept | FTP as folders
src: 0077 | area: vfs
ui: FTP menu; Preferences / FTP (see FTP entries)
user-words: connect to ftp, sftp
what: FTP sites behave like local folders for nearly all commands, and the viewer pane can view remote files without downloading.

## mtp.concept | MTP devices
src: 0078 | area: vfs
ui: path `mtp://`; This PC > Portable Devices
user-words: phone files, android in opus, camera files
what: Phones, tablets, cameras via MTP behave like folders (thumbnails and viewer pane work). Paths `mtp://<device name>/`, root `mtp://` lists connected devices.
