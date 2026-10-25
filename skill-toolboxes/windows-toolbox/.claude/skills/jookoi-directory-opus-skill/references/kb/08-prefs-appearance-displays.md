# Preferences: dialog, colors and fonts, file displays, columns, display modes

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- prefs.dialog: Preferences dialog (search, apply, menu, backup)
- prefs.backup: Backup and Restore Configuration
- prefs.categories: Preferences categories
- prefs.colors.overview: Colors and Fonts category
- prefs.colors.themes: Themes page (apply, create, manage)
- prefs.colors.blending: Color Blending page
- prefs.colors.opuscolors: Directory Opus Colors page
- prefs.colors.windows: Windows Colors page
- prefs.colors.images: Images page
- prefs.colors.fonts: Fonts page
- prefs.displays.overview: File Displays category
- prefs.displays.expansion: Folder Expansion page
- prefs.displays.mouse: Mouse page
- prefs.displays.background: Background Events page
- prefs.displays.singleclick: Single Click page
- prefs.displays.navigation: Navigation page
- prefs.displays.options: Options page (file displays)
- prefs.displays.infotips: Info Tips page
- prefs.displays.tabkey: Tab Key page
- prefs.displays.statusbar: Status Bar page
- prefs.displays.titlebar: Title Bar page
- prefs.columns.overview: File Display Columns category
- prefs.columns.appearance: Column appearance page
- prefs.columns.evaluator: Evaluator Columns page
- prefs.columns.groups: Evaluator Groups page
- prefs.columns.filenames: Filenames page
- prefs.columns.icons: Icons page
- prefs.columns.options: Column Options page
- prefs.columns.shell: Shell Properties page
- prefs.modes.overview: File Display Modes category
- prefs.modes.details: Details and Power mode pages
- prefs.modes.powerbuttons: Power mode Buttons page
- prefs.modes.thumbnails: Thumbnails pages (main, folders, overlays, performance, styles)
- prefs.modes.tiles: Tiles Mode page
<!-- contents:end -->

## prefs.dialog | Preferences dialog (search, apply, menu, backup)
src: 0150 | area: prefs
ui: Settings > Preferences...
user-words: open settings, options window, reset settings, undo settings change, backup settings, shared config
what: Left page tree (categories expand to pages), right options, bottom-right `OK` / `Apply` / `Cancel`, bottom-left search field (F3, X or Esc clears) that highlights matching pages and options. Pages with a symbol at the top-right apply live and show `Save` instead of `Apply`. Gold star on a page = favorite (Starred category at top).
options:
- Preferences menu (button top-right): `Help`, `Preferences introduction`, `Copy page shortcut` (puts `Prefs PAGE="..."` on the clipboard), `Revert changes` (`Revert visible` on some pages, `Revert page`, `Revert ALL`; works after Apply until Preferences closes), `Factory reset` (`visible`, `page`, `ALL`; Backup and Restore does a full reset incl. toolbars and hotkeys), `Reset dialog font`, `Change configuration mode` (`Private configuration` per user, `Shared configuration` one global config), `Backup & Restore`
- page list right-click: `Expand all`, `Collapse all` (minus key), page items: `Favorite page`, `Copy page shortcut`, `Revert page`, `Factory reset page`
- page list keys: Up/Down move, Left/Right collapse/expand, `*` expand all, `-` twice collapse all
cmd: `Prefs PAGE="colors"`
see: prefs.backup, prefs.categories

## prefs.backup | Backup and Restore Configuration
src: 0150 | area: prefs
ui: Settings > Backup and Restore...; Preferences menu > Backup & Restore (`Prefs BACKUPRESTORE`)
user-words: back up opus settings, move settings to new pc, restore config, reset everything
what: Four modes: `Backup configuration`, `Restore configuration`, `Export to USB`, `Reset configuration` (offers a full backup first). Not available in an exported portable copy (re-export instead). Preferences, toolbars and file types are always included. Backup file is a zip (`.ocb`).
options:
- includes: `Backup images`, `Backup sounds` (only if below the Opus config folder), `Backup miscellaneous data` (for example File Collections), `Backup local state data` (window positions; for disaster recovery, not for moving machines), `Backup currently open folder tabs` (subset of local state)
- `encrypt` the backup (protects FTP passwords)
- restore: same include options plus `Replace existing configuration completely` (off = merge)
cmd: `Prefs BACKUPRESTORE`

## prefs.categories | Preferences categories
src: 0150 | area: prefs
ui: Preferences left tree
user-words: which category, where is the setting
what: `Colors And Fonts`, `File Displays`, `File Display Columns`, `File Display Modes`, `File Operations`, `Filtering And Sorting`, `Folders`, `Folder Tabs`, `Folder Tree`, `Frequently Used Paths`, `Internet`, `Labels`, `Launching Opus`, `Layouts and Styles`, `Location Bar`, `Miscellaneous`, `Toolbars`, `User Interface`, `Viewer`, `Zip and Other Archives`.
notes: Page-level detail per category is in the other prefs.* entries; `references/preferences-map.md` has the task-oriented index.

## prefs.colors.overview | Colors and Fonts category
src: 0151, 0152 | area: prefs
ui: Preferences / Colors and Fonts / (Dark Mode, Themes, Color Blending, Directory Opus Colors, Windows Colors, Images, Fonts)
user-words: dark mode, light mode, change colors
what: Opus keeps two separate colour+image sets ("dark" and "light"). Colour pages edit only the set currently in use.
options:
- Dark Mode page: `Use system setting` (follows Windows 10+), `Dark always`, `Light always`. Also Settings menu `Dark Mode` (`Set DARKMODE=toggle`; the 13.11 menu runs `Set DARKMODE=togglesmart`)
cmd: `Set DARKMODE=toggle`
see: themes.concept

## prefs.colors.themes | Themes page (apply, create, manage)
src: 0153 | area: prefs
ui: Preferences / Colors and Fonts / Themes (`Prefs PAGE=themes`)
user-words: apply color theme, share theme, import theme
what: List shows installed themes plus default dark and light. Select a theme to see preview. `Apply` (above the list, or double-click) lets you choose parts: `Directory Opus Colors`, `Windows Colors`, `Color Blending`, `Images`, `Fonts`; optional automatic backup first.
options:
- `New` (name, description, author, URL, preview image, content parts), `Duplicate` (copies only the Save New Theme dialog details; full copy with colours uses the main page Duplicate), `Edit` (+ `Update Content` replaces the theme's colours/fonts with current), `Import` / `Export` (also drag in/out, not for the two defaults), `Clean Up` (delete theme backups and unused background images)

## prefs.colors.blending | Color Blending page
src: 0154 | area: prefs
ui: Preferences / Colors and Fonts / Color Blending
user-words: selection colour wrong, selected files hard to see on dark theme, visual styles
options:
- `Blend file background colors with background`, `Blend row and column background colors`, `Blend selected items with column colors` (unavailable with visual styles on), `Use visual styles to draw items` (increases spacing, changes selection look, hot item highlight), `Selection rectangles overlap` (Win7 look, taste on Win10), `Visual styles override file selection colors`, `Drag image opacity`, `Background graph opacity`
- Selection opacities: `Inactive file display`, `Inactive folder tree`, `Hot`, `Selected`, `Selected & hot/focused`
notes: With dark backgrounds turn `Visual styles override file selection colors` off, otherwise Windows-drawn selection is hard to see (hybrid mode: Opus draws selection, other visual-style traits stay). Opacity values are 1% to 99%.

## prefs.colors.opuscolors | Directory Opus Colors page
src: 0155 | area: prefs
ui: Preferences / Colors and Fonts / Directory Opus Colors
user-words: change file list color, folder tab color, status bar color, toolbar color, group color
what: Two groups: `File and Folder Colors` and `Other Colors`, with a color list (search field at the bottom) and previews. Color picker: RGB/HSL, alpha 0 to 255 where supported, eyedropper, 16 saved favorite slots (right-click to store, left-click to load). Picker menu (also right-click on the button): `Copy`, `Copy with alpha`, `Copy markup code` (HTML for info tips), `Paste`, `Paste (swap with clipboard)`, `Reset to factory default`, `Reset to initial value`, `Reset to last saved value`, `Get other mode color`, `Use hex format`.
options:
- File and Folder: `File display background` (source, destination, off and quick-filter variants; `Inline Sub-folders` with `Per-level fade`), `File group column`, `File group header`, `Files and folders` (+ `Current sort column`), `Compressed, Encrypted and System`, `Favorites`, `Matched Text`, `Queued`, `Synchronize`, `Folder expanders`, `Grid lines` (incl. frozen-column style), `Highlighted cells`, `Selection lasso`, `Thumbnails`, `Tiles`
- Other: `Cloud status icons`, `Code editor`, `File display icon`, `Folder tabs` (+ destination, `Linked tabs` 15 colours), `File display border` (Destination/Off/Source), `Folder tree` (+ destination, `Path to selection`), `Graphs` (copy speed, free space, pie charts, relative age, relative size), `Jobs bar`, `New job arrow`, `Location bar`, `Logs`, `Metadata pane`, `Miscellaneous`, `Pane borders`, `Preferences UI`, `Status bar` (+ `Framed text`), `Toolbars` (text/background per toolbar override, shadow/highlight, selected/toggled, menu background and frames, `Field background`, `Toolbars (Office-style)`, gradients, automatic vs custom highlight colors), `Viewer` (pane, text plugin, video & audio, WAV)
notes: Labels override these per file type or file. Folder tree uses file display colours unless `Use configured file display colors for tree items` is off. Visual styles can override selected colours (a clickable message says so).

## prefs.colors.windows | Windows Colors page
src: 0156 | area: prefs
ui: Preferences / Colors and Fonts / Windows Colors; `Help THEMETESTER`
user-words: dark mode buttons, control colors, scrollbars dark
what: Dark mode is implemented by hooking Windows visual styles. `System Colors` (about 25 classic colours) and `Visual Styles` (per control type, many parts each). Per control `Custom` checkbox enables the hook. In light mode most are off, in dark mode all on. Only affects Opus. Theme Tester shows live control types.
cmd: `Help THEMETESTER`

## prefs.colors.images | Images page
src: 0157 | area: prefs
ui: Preferences / Colors and Fonts / Images
user-words: background image, wallpaper in file list
what: Image per Lister element, per colour set. Browse, dropdown reuses images. Opacity, scaling and alignment.
options:
- scaling: `Stretched`, `Aspect Fill` (crop), `Aspect Fit` (+75/50/25%), `Original Size` (+75/50/25%)
- alignment: `Tiled`, `Center`, `Left`, `Right`, `Top`, `Bottom`, `Top/Left`, `Top/Right`, `Bottom/Left`, `Bottom/Right`
- `Shared`: one image aligned across the whole Lister and joined seamlessly across elements

## prefs.colors.fonts | Fonts page
src: 0158 | area: prefs
ui: Preferences / Colors and Fonts / Fonts
user-words: change font size, bigger text, dialog font too big
options:
- fonts for: `Code editors` (fixed width), `Dialogs` (needs restart; recover via Preferences menu `Reset dialog font`), `File display`, `File display column header`, `File display groups`, `Folder tabs`, `Folder tree`, `Hotkeys` (font only), `Jobs Bar`, `Location bar`, `Logs`, `Metadata pane`, `Pane borders`, `Rename macro builder` (fixed width), `Status bar`, `Text viewer (hex)` (fixed width), `Text viewer (text)`, `Thumbnail labels`, `Toolbars` (default, per-toolbar override in Customize; `Heading Scale` for menu headings), `Tooltips and info-tips`, `Video & Audio viewer`
notes: Quick zoom without Preferences: Ctrl+mouse wheel over the file display (see prefs.displays.mouse).

## prefs.displays.overview | File Displays category
src: 0159 | area: prefs
ui: Preferences / File Displays / (Folder Expansion, Mouse, Background Events, Navigation, Options, Info Tips, Tab Key, Status Bar, Title Bar)
what: Behaviour of the file list area.

## prefs.displays.expansion | Folder Expansion page
src: 0160 | area: prefs
ui: Preferences / File Displays / Folder Expansion
user-words: expand folders inline, spring loaded folders
options:
- `Make folders expandable in the file display`, `Extra expand button width`, `Hide expand buttons until a folder is expanded` (then use `Go EXPANDBRANCH`), `Save space when no folders are present`, `Use inline sub-folder color for parent folders`
- Collapse: `Clear selections within collapsed folders`, `Collapse sub-folders within collapsed folders`
- Drag and drop: `Expand folders when dragging over them`, `Collapse after drag (spring-loaded)`, `Expansion delay` (ms)
- Remember: `Remember expanded folders when going back and forward`, `Remember expanded folders when refreshing` (also keeps selection and scroll)
see: view.expandable

## prefs.displays.mouse | Mouse page
src: 0161 | area: prefs
ui: Preferences / File Displays / Mouse
user-words: middle click opens in new tab, ctrl wheel zoom, mouse wheel back forward, hover switch pane, accidental drag into folder
options:
- `Allow file selection when clicking to activate Lister`, `Allow file selection when clicking to switch source/destination state`, `Allow drag and drop into sub-folders` (off = needs Shift/Ctrl/Alt; accessibility), `Double-click group headers to expand/collapse` (off = instant select), `Hot-tracking of mouse cursor`
- dual display: `Hover to switch source/destination state`, `Mouse wheel to switch source/destination state`
- wheel: `Mouse wheel + Ctrl to adjust font and thumbnail sizes` (icon in location bar shows zoom, can reset or make permanent), `Mouse wheel + Shift to navigate back and forward`, `Smooth scrolling with mouse wheel/keyboard`
- middle button: `Single middle click to toggle selection state`, `Single middle click to trigger file and folder middle double-click events`
see: select.mouse

## prefs.displays.background | Background Events page
src: 0162 | area: prefs
ui: Preferences / File Displays / Background Events
user-words: double click empty space go up, empty area click action
what: Commands run on double-click of empty space: left and middle button, each with optional Ctrl/Shift/Alt (up to eight). Middle can trigger on single click. Any command line, for example `Go UP BACK`; multi-line via a user command.
cmd: `Go UP BACK`

## prefs.displays.singleclick | Single Click page
src: 0163 | area: prefs
ui: Preferences / File Displays / Single Click
options:
- `Single click to open an item`, `Alt + click to select without opening`, `Expand sub-folders on hover`, `Single click over icon only`, `Underline items on hover`, `Hover time to select`, `Hover time to expand`
notes: Not in Power mode.
see: select.singleclick

## prefs.displays.navigation | Navigation page
src: 0164 | area: prefs
ui: Preferences / File Displays / Navigation
user-words: show .. entry, flat view off when changing folder, select folder after going up
options:
- `Cancel Flat View mode when folder is changed`, `Highlight previous folder on Up/Back` (blinking underline, time), `Select previous folder when going up`, `Show .. parent item in folders` (+ `Hide when file display is grouped`; double-click to go up, drop onto it to copy/move to parent), `Show folder read errors inline in the file display` (banner instead of dialog), Navigation Lock: `Warning message when out of sync`
notes: The Up button runs `Go UP BACK`, so Back history can leave the parent selected regardless of the option.
cmd: `Go UP BACK`

## prefs.displays.options | Options page (file displays)
src: 0165 | area: prefs
ui: Preferences / File Displays / Options
user-words: scroll jumps when sorting, format keeps resetting, sort header in thumbnails, dual display initial folder
options:
- `Automatically select first file in folder` (not Power mode), `Clear quick filter with the Esc key`, `Reset focus entry when sorting file list`, `Preserve folder format edits between folders` (off = ad-hoc changes reset on every folder change), `Show sort header in icon modes`
- Single display: `Single display Listers have source/destinaiton modes`
- Dual display: `Set new panel to source when switching to dual file display`, `Specify initial folder when switching to dual file display` (folder or a Tab group)
see: view.dual, concept.sourcedest

## prefs.displays.infotips | Info Tips page
src: 0166 | area: prefs
ui: Preferences / File Displays / Info Tips
user-words: disable tooltips, hover tooltip on files
options:
- `Enable file Info Tips` (per display mode), `Folder type` (for example not on network/FTP), `Only with key held down` (qualifier; Ctrl-hold keyboard method unaffected), `Keyboard delay` (hold Ctrl to show tip for the focused item)
notes: Tip content is edited in File Types.

## prefs.displays.tabkey | Tab Key page
src: 0167 | area: prefs
ui: Preferences / File Displays / Options / Tab Key
user-words: tab switches panes, ctrl tab behaviour
options:
- `Tab`: `Cycle through all Lister user interface elements` or `Switch source/destination in dual-display Listers`
- `Ctrl + Tab`: `Display popup tab switcher` or `Switch source/destination in dual-display Listers`
- `Ctrl + Shift + Tab`: `Display popup tab switcher`, `Switch source/destination in dual-display Listers`, `No action`

## prefs.displays.statusbar | Status Bar page
src: 0168 | area: prefs
ui: Preferences / File Displays / Status Bar
user-words: customize status bar, free space in status bar, padlock icon, status bar at bottom
options:
- `Enable format lock padlock icon` (`{fl}` code), `Keep status bars at the bottom of the Lister`
- `Use two independent status bars when in dual display mode`; `Separate definitions for…` (for single and dual display modes, or for left/top and right/bottom displays)
- definition text: one line per section (comments `//`), `{codes}` (Codes dropdown lists them), live preview with red highlight of the section being edited
see: codes.statusbar, panes.statusbar

## prefs.displays.titlebar | Title Bar page
src: 0169 | area: prefs
ui: Preferences / File Displays / Title Bar
user-words: window title shows path, custom window title, window icon
options:
- `Display folder path`, `Display layout name`, `Custom title` (codes below; they affect `%T`)
- codes: `%P` source path, `%N` source name, `%R` drive root, `%D` destination path, `%M` destination name, `%G` junction target, `%F` last selected item path, `%1` `%2` left/top and right/bottom paths, `%3` `%4` their names, `%5` `%6` `%7` last-loaded tab group (left, right, source), `%L` layout name, `%S` style name, `%V` program version, `%T` original title, `%%` literal, `%!...%!` hide block when its tokens are empty (example `%!%N - %!Directory Opus`)
- window icon: Opus logo (colour shows state) or `Current folder's icon`

## prefs.columns.overview | File Display Columns category
src: 0170 | area: prefs
ui: Preferences / File Display Columns / (Appearance, Evaluator Columns, Evaluator Groups, Filenames, Icons, Options, Shell Properties)

## prefs.columns.appearance | Column appearance page
src: 0171 | area: prefs
ui: Preferences / File Display Columns / Appearance
user-words: colour a column, bold size column, column default width, reverse sort default
options:
- `Custom color and font settings` per column (text/background colours, bold/italic/underline); `Current sort column` entry (its colours are on Directory Opus Colors)
- `Default width` (some columns in pixels, some in characters, sets Thumbnail column default), `Middle ellipsis`, `Reverse graph meaning`, `Reverse initial sort direction` (date and size fields already sort newest/largest first on the first click), `Custom title` for the header

## prefs.columns.evaluator | Evaluator Columns page
src: 0172 | area: prefs
ui: Preferences / File Display Columns / Evaluator Columns
user-words: custom column, column from filename regex, script-free column
what: List of your columns (add, edit, delete, share/copy and paste). `Example file` feeds all columns to preview. Editor fields: `Title`, `Header title`, `Keyword` (becomes `eval:<keyword>`, for example `Set COLUMNSTOGGLE=eval:imagebytes`), `Evaluator code`.
options:
- types: `Date`, `Date/Time`, `Double`, `Graph` (0 to 100, `Graph color`), `Percent`, `Rating` (`Max stars`), `Signed`, `Size`, `Text`, `Time`, `Unsigned`
- settings: `Category`, `Alignment`, `Default width` (pixels or characters)
- options: `Reverse sort by default`, `Refresh if file changes` (+ `Include attributes`), `Refresh if name changes`, `Filesystem folders only`, `Graph behind`, `Cache column values` (off for time-dependent), `Refresh` (periodic), `Custom grouping` (clause called with `operation` = `group`), `Reverse group order`, `Support markup` (`operation` = `markup`)
cmd: `Set COLUMNSTOGGLE=eval:<keyword>`
see: evaluator.ctx.columns

## prefs.columns.groups | Evaluator Groups page
src: 0173 | area: prefs
ui: Preferences / File Display Columns / Evaluator Groups
user-words: custom grouping, group by first letter
what: Grouping schemes per column (the default config has five extra schemes for Name). Editor: `Name` (programmatic id), `Description` (shown in the group menu), `Definition` tab (`Static groups` off = code returns group name, empty = Unspecified; on = predefine numbered groups, code returns the number, 0 = Unspecified; variable `value`), `Sort groups alphabetically`, `Reverse group order`; `Columns` tab chooses which columns offer the scheme in menus.
cmd: `Set GROUPBY=name GROUPSCHEME=first_letter`

## prefs.columns.filenames | Filenames page
src: 0174 | area: prefs
ui: Preferences / File Display Columns / Filenames
user-words: hide .lnk extension, show extension, localized folder names
options:
- `Display localized folder names`, `Hide the .lnk extension for shortcuts`, `Hide the .url extension for Internet shortcuts`, `Hide other extensions as specified in the Windows registry`, `Modify display of all-uppercase filenames`, `Preserve file extensions when truncating names`, `Strip Unicode Left-to-Right and Right-to-Left characters` (stops fake extensions)

## prefs.columns.icons | Icons page
src: 0175 | area: prefs
ui: Preferences / File Display Columns / Icons
user-words: shortcut arrow overlay, onedrive status icons, tortoise icons, slow folder icons
options:
- `Show shortcut arrows and other icon overlays`, `Show generic icons` (off is faster on networks for per-file icons such as .exe)
- Status column diversion (Windows allows only 15 overlays): `Show cloud storage icons in the Status column`, `Show TortoiseSVN icons in the Status column` (`Tortoise icon set`, `Disable Tortoise icon overlays in the file display`; needs TortoiseSVN 1.9.3+)

## prefs.columns.options | Column Options page
src: 0176 | area: prefs
ui: Preferences / File Display Columns / Options
user-words: friendly dates, seconds in time, rating stars click, size graph, group column
options:
- `Add 'Group' column automatically when file display is grouped`, `Edit ratings by clicking within the Rating column`, `Show dashes in empty columns`, `Show friendly dates` (`Day names within one week`, `Today only`), `Show graphs behind Modified and Created date and time columns`, `Show graphs behind size columns`, `Show seconds in time columns` (+ `Show milliseconds`), `Display extended sync attributes for cloud folders`

## prefs.columns.shell | Shell Properties page
src: 0177 | area: prefs
ui: Preferences / File Display Columns / Shell Properties
user-words: add explorer columns, import shell column
what: Lists Explorer columns; pick an `Example file` to see which produce data (`Group properties with data`). Tick to make a column available in the Shell category of the Folder Format dialog and header menus. Command prefix `sh:` (for example `Set COLUMNSTOGGLE sh:System.Contact.NickName`).

## prefs.modes.overview | File Display Modes category
src: 0178 | area: prefs
ui: Preferences / File Display Modes / (Details, Power Mode, Appearance, Buttons, Thumbnails, Folders, Overlays, Performance, Styles, Tiles)

## prefs.modes.details | Details and Power mode pages
src: 0179, 0180, 0181, 0182 | area: prefs
ui: Preferences / File Display Modes / Details (+ Appearance); Power Mode (+ Appearance)
user-words: row height, line padding, full row select, thumbnail column ratio, power mode keyboard
options:
- Details: `Copy column data with Ctrl + right-click`, `Sort-field specific key scrolling` (FAYT searches the sorted column), `Begin lasso on filenames` (with a qualifier)
- Details/Power Appearance: `Display icons`, `Hide icons when thumbnail column is visible`, `Column padding`, `Extra line padding` (DPI scaled), `Extra line spacing` (may be removed; >1px creates click gaps), `Left padding`, `Use left padding only when grouped`; selection style `Filename only`, `Full width of the Name column`, `Full row`; `Always highlight full row`; Thumbnail column: `Aspect ratio` (sets row height), `Padding`, `Resize mode`
- Power Mode: `Copy column data with Ctrl + right-click`, `Always in keyboard mode`, `Activate Keyboard Mode when a partial filename is typed`, `Automatically select first file in folder`, `Display Power mode toolbar buttons`, `Enter key opens all selected files`, `Sort-field specific key scrolling`

## prefs.modes.powerbuttons | Power mode Buttons page
src: 0183 | area: prefs
ui: Preferences / File Display Modes / Power Mode / Buttons
user-words: mouse buttons in power mode, drag select behaviour
what: Per mouse button (three) click action and drag-and-drop action.
options:
- click: `Auto-deselect`, `Context Menu`, `Context Menu (auto-deselect)`, `Context Menu (no select)`, `Context Menu (select)`, `Deselect only`, `Disabled`, `Drag select` (inverts then applies to drag), `Full toggle`, `Inline Rename`, `Partial toggle`, `Select only`, `Set focus (no select)`; `Context menu after…` (ms hold)
- drag and drop: `Disabled`, `Immediate action`, `Show menu`
- `Range selection in select and toggle modes` (Shift, Ctrl or Alt + second click; Auto-deselect modes always use Shift range and Ctrl toggle)

## prefs.modes.thumbnails | Thumbnails pages (main, folders, overlays, performance, styles)
src: 0184, 0185, 0186, 0187, 0188 | area: prefs
ui: Preferences / File Display Modes / Thumbnails (+ Folders, Overlays, Performance, Styles)
user-words: thumbnail size, thumbnail cache, folder thumbnails, rating stars on thumbnails, slow thumbnails
options:
- main: `Thumbnail size` (px, `Make square`), `Spacing`, `Spread excess space between columns`, `Resize mode` (pixelated upscaling only at 3x+), `Rotate images automatically using EXIF metadata`, Labels: `Lines`, `Display date taken or modified`, `Display image dimensions and file size`, `Expand thumbnail with focus if name doesn't fit`
- Folders: `Display thumbnails for folders`, `Use Windows folder thumbnails where possible`, Opus-generated: `Exclude folders with custom icons`, `Include images of folder contents`, `Choose most recent images`, `Look inside sub-folders`, `Resize mode`, `Match wildcard`, `Use first matching file only`
- Overlays: `Overlay film sprockets on videos and animations`, `Overlay rating stars`, `Overlay aspect ratio bars`, `Overlay relative dimension bars` (`Set RELDIMENSIONOVERLAYS`), `Overlay thumbnail with file type icon` (+ `Hide file type icon if type not registered`, `Maximum size`), `Overlay thumbnail with icon overlay (if any)`
- Performance: `Thumbnail threads` (not above logical CPUs), `Start loading thumbnails before they become visible`, caching per drive type: `Use lossless compression`, `Maximum cache size` + `Empty`
- Styles (folder thumbnail styles): identification by `Specific thumbnail files` (patterns/regex, for example `coverart.jpg`, `coverart.png`, `cover.jpg`), `Shell folder type` (for example Music), `Folder contents` (file type group or filenames, `Ignore`, minimum count among first files); any match activates. Style image `Merge` area (left/top/right/bottom offsets), `Thumbnail size`. First matching style in list order wins
cmd: `Set RELDIMENSIONOVERLAYS`

## prefs.modes.tiles | Tiles Mode page
src: 0189 | area: prefs
ui: Preferences / File Display Modes / Tiles
options:
- `Label size` (characters x lines), `Spacing`, `Spread excess space between columns`, `Expand tile with focus if needed`, `Vertical layout` (scrolls horizontally like List)
- thumbnails in tiles: `Thumbnail size`, `Resize mode`, `Show file type icon in tile` (needs tile frame or fill colours on Directory Opus Colors), `Hide file type icon if type not registered`
