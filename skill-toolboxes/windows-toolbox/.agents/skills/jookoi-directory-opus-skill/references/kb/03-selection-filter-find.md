# Selecting, filtering, searching

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- select.mouse: Selecting with mouse and keyboard
- select.singleclick: Single-click mode
- select.checkbox: Checkbox mode
- select.pattern: Select by Pattern (Select Files dialog)
- select.cells: Selecting cells (copy column data)
- filter.vs-search: Filtering vs searching
- filter.bar: Filter Bar
- filter.showeverything: Show Everything mode
- filter.field: Toolbar filter field
- find.quicksearch: Quick search field (search engines)
- find.files: Find Files tool
- find.simple: Simple find criteria
- find.advanced: Advanced find
<!-- contents:end -->

## select.mouse | Selecting with mouse and keyboard
src: 0046 | area: select
ui: Preferences / File Displays / Mouse; Preferences / File Display Modes / Power Mode
user-words: select files, multi select, rubber band, select range, deselect, middle click
what: Mouse (all modes except Power): click = select one, Ctrl+click toggle, Shift+click range, Ctrl+Shift+click add range, click empty area deselects all, drag from empty area = rectangle (with Ctrl keeps existing selection and inverts what is dragged over), middle-click toggles (same as Ctrl+click) and middle-drag inverts, right-drag makes a rectangle then shows the context menu.
notes: Keyboard: Ctrl+A select all, Ctrl+I invert, cursor/PageUp/PageDown/Home/End move selection, Shift+cursor range, Ctrl+cursor moves focus without changing selection, Space selects focused item, Ctrl+Space toggles it, Ins toggles and moves to next, typing starts FAYT.
notes: Middle button: some drivers remap it. Option to treat single middle-click as double (browser-like: middle-click opens folder in new tab), on File Displays / Mouse.
notes: Power mode: left-click inverts one file only, dragging up/down range-selects (so drag and drop works only by dragging left/right), empty click does not deselect (persistent). Cursor keys scroll only until Ctrl toggles keyboard mode, then they move the focus indicator, Space inverts focused file, Shift+cursor range selects (reversing direction undoes). Clear all selection in Power mode: Ctrl+A then Ctrl+I, or add `Select NONE` to a toolbar/hotkey.
cmd: `Select NONE`
see: view.modes, select.commands

## select.singleclick | Single-click mode
src: 0047 | area: select
ui: Preferences / File Displays / Mouse / `Single click to open an item`
user-words: open with one click, hover to select, web-style click
what: Items open on single click and are auto-selected after hovering about half a second (Ctrl+hover multi, Shift+hover range). No effect in Power mode.

## select.checkbox | Checkbox mode
src: 0048 | area: select
ui: Folder menu > Checkbox Mode; Folder Format dialog / Display tab / `Checkbox mode`
user-words: checkboxes next to files, tick files, persistent selection, mark files
what: Per file display (part of the folder format, can be permanent per folder). Functions such as Copy Files act on checked files instead of selected files. Clicking empty space or another file clears the selection but not the checks, so double-click to open and drag-and-drop do not disturb checks.
notes: Space toggles the check state of all selected files. Edit / Select All and Invert Selection change check state instead of selection. Drag and drop still uses the selection. Edit / Select Other: `Selection to Checkboxes` (turns the mode on if needed) and `Checkboxes to Selection`. The standalone viewer's image marking can use checkbox mode when the File Collection option is off.
see: select.commands, viewer.marking

## select.pattern | Select by Pattern (Select Files dialog)
src: 0049, 0050 | area: select
ui: Edit / Select by Pattern, Ctrl+S
user-words: select by wildcard, select all jpg, select matching, hide matching
what: Dialog with Simple and Advanced modes (remembers last mode, switch with the Advanced / Simple button).
options:
- Simple: wildcard string in standard pattern syntax (example `*.(mp3|m4a)`), `Partial match` (`kit` matches `Cute Kitten.jpg`), `Deselect on no match`
- Advanced: filter control (same as Find advanced). `Action`: `Select matching items`, `Deselect matching items`, `Hide matching items`. `Hide items that don't match` (with select/deselect actions). OK applies and closes, Apply applies and keeps the dialog
notes: Hidden items come back on refresh (F5 or Refresh button) or via `Select NOPATTERN SHOWHIDDEN` (not on default toolbars, make a button).
cmd: `Select NOPATTERN SHOWHIDDEN`
see: filter.clauses, patterns.standard

## select.cells | Selecting cells (copy column data)
src: 0051 | area: select
ui: Preferences / File Display Modes / Details or Power Mode / `Copy column data with Ctrl + right-click`; Customize / Context Menus
user-words: copy a column value, copy cell text, copy column
what: Details and Power modes. Ctrl+right-click a cell selects it, Ctrl+right-click a column header selects the column, Ctrl+right-drag lassoes cells (yellow highlight, colour on Directory Opus Colors). Right-click a selected cell (no Ctrl) shows `Copy Highlighted Cells` menu. Ctrl+right-click again deselects, Esc or a left click clears all.
notes: Menu uses `Clipboard COPYCOLUMNS` and `Select HIGHLIGHTCLEAR`. Scripts: `Item.highlighted`.
cmd: `Clipboard COPYCOLUMNS`, `Select HIGHLIGHTCLEAR`

## filter.vs-search | Filtering vs searching
src: 0045, 0051 | area: filter
ui: n/a
user-words: hide files, show only, search inside folder, difference between filter and search
what: Filtering hides files from the current folder listing (quick filter via Filter Bar, folder format filters in Folder Options, global filters in Preferences). Searching starts at a location and builds a new list of matches (Windows Search indexed, Everything, or Find Files). Filters stack: quick filter sits on top of format filters and global filters and never overrides them.
see: filter.bar, find.files, find.quicksearch

## filter.bar | Filter Bar
src: 0052 | area: filter
ui: Preferences / Filtering and Sorting / Filter Bar; Quick Keys page (activation key, default `*`)
user-words: quick filter, filter list, show only files matching, hide files while typing, press star to filter
what: Small field at the bottom of the file display. Type to filter immediately (quick filter). Shows hidden counts (files and folders separately). Esc or the X clears it; the bar hides when cleared unless the Filter Bar page keeps it open. A different file display background colour can mark an active quick filter (Directory Opus Colors / File display background).
options:
- file/folder icons: first pair hides all files/folders temporarily, second pair shows all
- options menu: `Ignore diacritics`, `Match any word` (search-engine style; `+word` required, `-word` excluded, `:` literal prefix), `Partial matching`, `Use regular expression`, `Evaluator`, `Save as default`
- file types button: menu of file type groups and extensions present in the folder (multi-select), Shift+F5 in the field opens it
- `Show everything` checkbox: toggles Show Everything mode
- `Filter folders in Flat view` (only shown in Flat View, off by default): folders filtered out also drop all their files. Default from Advanced option `flatview_folder_filters`
notes: Evaluator mode: type a clause (`size > 2gb`) or a predefined filter with `?` (`?bigfiles`, arguments `?bigfiles:5`). The FAYT can do quick filtering too if a key for Filter mode is set on Quick Keys.
see: find.fayt, filter.showeverything, evaluator.contexts

## filter.showeverything | Show Everything mode
src: 0053 | area: filter
ui: Folder menu > Show Everything; click the hidden-item count in the status bar; Filter Bar checkbox
user-words: show hidden files temporarily, disable filters, why are files missing
what: Temporarily shows all files and folders in that folder tab by disabling all filtering (quick filter, format filters, global filters). Status bar shows `Everything` while active, click it to turn off. Does not undo folders hidden by Flat View Mixed (No Folders). Not the voidtools Everything search tool.

## filter.field | Toolbar filter field
src: 0054 | area: filter
ui: Customize / Commands tab / File Lists category / `File Filter Field` (drag to a toolbar)
user-words: filter box on toolbar, always visible filter
what: Toolbar field editing the quick filter (same as Filter Bar). Drop-down lists a wildcard per file type present (auto-content) or filter history. Esc clears. Menu on the left icon changes what it controls.
options:
- `Files` / `Folders` / `Files and Folders`: make the field edit folder format filters instead of the quick filter. Then `Show` or `Hide` picks Show Filter or Hide Filter (Filename / Folders / both)
- `Filter in Real Time`, `Partial Match` (wraps in `*...*`), `Auto-content`, `Clear Filters` (all except global), `Clear History`
notes: Menu changes are per Lister session. Change defaults by editing the field's definition in Customize.

## find.quicksearch | Quick search field (search engines)
src: 0055 | area: find
ui: search field on the Menu toolbar (F3); engine menu = button left of the field
user-words: search box, windows search, everything search, search current folder
what: Searches below the current folder with Windows Search (indexed), Everything (indexed, local or global) or Opus search (internal Find, not indexed). Partial matching by default. Not every location is indexed (Windows Search then is as slow as Opus find; Everything cannot search non-indexed locations). Engine options show in the bottom half of the engine menu.
options:
- Windows Search: `Natural query syntax`, `Automatic wildcards` (AQS/NQS queries allowed)
- Everything: `Case sensitive`, `Whole words`, `Use regular expression` (only * and ? wildcards), `Ignore diacritics`, `Match path`. Types: Everything search (below current folder), Global Everything search
- Opus search: `Search filenames`, `Search content`, `Use wildcards`, `Use regular expression`, `Match any word`, `Case sensitive`, `Ignore diacritics`, `Partial match`, `Assume UTF-8 with no BOM`
notes: Results show in a temporary file collection that is a child of the searched folder; Back or the field's close button returns. To keep results: right-click file display background or status bar > `Save as Stored Query`. FAYT can start a search by engine key.
see: collections.stored, find.files, find.fayt

## find.files | Find Files tool
src: 0056 | area: find
ui: Tools > Find Files, Ctrl+F (utility panel); Preferences / Filtering and Sorting
user-words: search for files, find in folders, search file contents, search subfolders
what: Utility-panel search with Simple and Advanced modes (`Advanced mode` checkbox, Alt+A), `Presets` dropdown, `Reset`.
options:
- `Find in`: one or more folders or drives (+ button, drag folders in, edit entries). Linked to the file display by default (link button disconnects). Dropdown = history
- `Search subfolders`, `Search archives`, `Suppress UAC prompts`
- `Exclude`: paths, names or wildcards (for example `.svn`, `.github`); dropdown can exclude hidden and system folders
- `Indexed search`: query passed first to Windows Search or Everything, then Opus find runs inside those results (fast pre-filter)
- `Show results in`: file collection name and which display (source/destination/new tab). `Clear previous results` off = accumulate across finds
- `Find` starts. `Refine` narrows the previous results using changed parameters (Find starts fresh)
notes: Results appear in a file collection as they are found.
see: find.simple, find.advanced, collections.concept

## find.simple | Simple find criteria
src: 0057 | area: find
ui: Find panel (simple mode)
user-words: find by name date size text
what: All set criteria must match; criteria labels turn bold when used.
options:
- `Name`: `Wildcards`, `Regular expressions`, `Any word` (`+` required, `-` excluded, plain words optional with at least one matching; extensions given exclude folders; partial extensions match so `.jp` matches `.jpg`, `*.jp` only `.jp`; wildcard words are treated as partial), `Ignore diacritics`, `Case sensitive`, `Partial match`
- `Text`: searches file contents (slower; non-text formats need an IFilter), same options plus `Assume UTF8` (no-BOM text)
- `Type`: `All files and folders`, `Files`, `Folders`, `Junctions and Links`, `File Type Group` + group, `File Type` + type
- `Date` (modified, date only): `Ignore`, `On`, `Before`, `After`, `Between`, `Not Between`, `Within` (relative, for example 7 days)
- `Time` (modified, hours and minutes only): `Ignore`, `At`, `Before`, `After`, `Between`, `Not Between`, `+/- One Hour`, `+/- Six Hours`, `Within`
- `Size` (value in KB, compared rounded to nearest KB): `Ignore`, `Equals`, `Smaller Than`, `Greater Than`, `Between`, `Not Between`, `+/- 25%`, `+/- 50%`

## find.advanced | Advanced find
src: 0058 | area: find
ui: Find panel with `Advanced mode` ticked
user-words: find images larger than, search by metadata, complex search
what: Uses the filter control (clauses on any attribute or metadata: image size, audio bitrate, author, dates). Example: images at least 1280x1024 modified in the last two months.
see: filter.clauses
