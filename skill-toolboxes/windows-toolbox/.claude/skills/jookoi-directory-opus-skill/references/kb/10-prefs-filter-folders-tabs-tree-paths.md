# Preferences: filtering, folders, folder tabs, folder tree, frequently used paths, internet, labels

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- prefs.filter.overview: Filtering And Sorting category
- prefs.filter.filters: Filters page (stored filters)
- prefs.filter.filterbar: Filter Bar page
- prefs.filter.fayt: Find-As-You-Type pages (general, Filter Mode, Find Mode, Folders Mode)
- prefs.filter.global: Global Filters page
- prefs.filter.quickkeys: Quick Keys page
- prefs.filter.sorting: Sorting page (global)
- prefs.folders.overview: Folders category
- prefs.folders.autoread: Automatic Reading page
- prefs.folders.formats: Folder Formats page
- prefs.folders.auto: Automatic Formats page
- prefs.folders.images: Folder Images page
- prefs.folders.sizes: Folder Sizes page
- prefs.folders.network: Network Servers page
- prefs.folders.special: Special Folders page (cloud storage)
- prefs.folders.virtual: Virtual Folders pages (Desktop, File System, This PC)
- prefs.tabs.overview: Folder Tabs category
- prefs.tabs.dimensions: Dimensions and Edge Colors pages
- prefs.tabs.bar: Folder Tab Bar page
- prefs.tabs.groups: Tab Groups page
- prefs.tabs.locking: Locking page
- prefs.tabs.options: Folder Tabs Options page
- prefs.tree.overview: Folder Tree category
- prefs.tree.appearance: Folder Tree Appearance page
- prefs.tree.contents: Folder Tree Contents page
- prefs.tree.expand: Expand / Collapse page
- prefs.tree.misc: Pins, Options, Selection Events, Sorting pages
- prefs.paths.overview: Frequently Used Paths category
- prefs.paths.favorites: Favorites List and Folder Aliases pages
- prefs.paths.homerecent: Home Folder, Recent List, SmartFavorites pages
- prefs.internet: Internet category: Email and Updates pages
- prefs.labels: Labels category pages
<!-- contents:end -->

## prefs.filter.overview | Filtering And Sorting category
src: 0210 | area: prefs
ui: Preferences / Filtering and Sorting / (Filters, Filter Bar, Find-As-You-Type, Filter Mode, Find Mode, Folders Mode, Global Filters, Quick Keys, Sorting)

## prefs.filter.filters | Filters page (stored filters)
src: 0211 | area: prefs
ui: Preferences / Filtering and Sorting / Filters
user-words: save filter, reusable filter
what: Central list of named filters used by copy/delete filters, Find, Synchronize, etc. Toolbar: add, duplicate, rename, description, delete, `Edit as text`. Commands accept a filter name (`Copy FILTER <name>`).
see: filter.concept

## prefs.filter.filterbar | Filter Bar page
src: 0212 | area: prefs
ui: Preferences / Filtering and Sorting / Filter Bar
user-words: filter bar always visible, type *.txt to filter, clear filter when changing folder
options:
- `Display Filter Bar`: `Always`, `Whenever a filter is set`, `Only when editing the filter`
- `Automatically type * when activating the filter bar` (so `*` then `.txt` filters `*.txt`; off needs `**.txt`), `Clear the filter automatically when changing folders` (also on refresh unless `Go REFRESH` overrides), `Real-time filtering` (off = press Enter), `Select first matching item`
- defaults: `Ignore diacritics`, `Ignore file extensions`, `Match any word` (`moo cow` = either), `Partial matching` (explicit `*` at an end disables partial for that pattern), `Use regular expression`, `Evaluator` (`?filtername`, `?bigfiles:5`)
see: filter.bar

## prefs.filter.fayt | Find-As-You-Type pages (general, Filter Mode, Find Mode, Folders Mode)
src: 0213, 0214, 0215, 0216 | area: prefs
ui: Preferences / Filtering and Sorting / Find-As-You-Type (+ Filter Mode, Find Mode, Folders Mode)
user-words: type to find options, f3 next match, fayt timeout, highlight matches
options:
- general: `Wrap-around` in popup lists, `Close timeout` (not Command mode), `Auto search` delay (Windows Search/Everything)
- Filter Mode: `Allow Enter key to open selected item`, `Select first matching item`, `Ignore diacritics`, `Ignore file extensions`, `Match any word`, `Partial matching`, `Regular expression`, `Evaluator`
- Find Mode: `Enable all cursor keys` (off = Left/Right/Home/End move the caret instead of the list), `Highlight matches`, `Indicate matches in scrollbar`, `Keep highlights visible after field closes` (Esc clears), `Minimize scroll to make item visible`, `First character repeat mode` (Explorer-like), `Ignore diacritics`, `Ignore file extensions`, `Prioritize shorter filenames`, `Search anywhere in the filename` (off = start of name only)
- Folders Mode sources: `Back/forward history` (current or all tabs), `Favorites`, `Folder aliases (build-in)`, `Folder aliases (user-defined)`, `Recent folders`, `Smart Favorites`, `Windows Quick Access folder` (Home on Windows 11)
see: find.fayt

## prefs.filter.global | Global Filters page
src: 0217 | area: prefs
ui: Preferences / Filtering and Sorting / Global Filters
user-words: show hidden files, hide thumbs.db, hide desktop.ini, show system files
options:
- `Hide hidden files` (H without S; Folder menu `Show Hidden Files` toggles), `Hide operating system files` (H+S; Folder menu `Show System Files`), `Enable global wildcard filters` (files and folders, one pattern per line, `Use regular expression`; example `(desktop.ini|*thumbs*.db)`)
notes: Show Everything bypasses all filters in a tab.

## prefs.filter.quickkeys | Quick Keys page
src: 0218 | area: prefs
ui: Preferences / Filtering and Sorting / Quick Keys
user-words: change fayt key, default fayt mode, filter bar key, mode colours
what: Per FAYT mode: activation key (1 to 4 characters, for example `>>` command, `>?` DOS command; a popup lists modes matching the typed prefix, can be disabled on the FAYT page), text/background colour, and which mode is default (what happens on a plain letter; default Find). The key field is hidden for the default mode. Some modes have their own options via the arrow glyph. Filter Bar activation key default `*`.

## prefs.filter.sorting | Sorting page (global)
src: 0219 | area: prefs
ui: Preferences / Filtering and Sorting / Sorting
user-words: sort shortcuts like folders, ignore the prefix, new files sorted at end
options:
- `Allow manual sorting even when the order can't be saved`, `Automatically save manual sort order where possible`, `Sort newly created and copied files`, `Sort shortcuts to folders like folders` (can slow network folders), `Ignore prefix when sorting` (global, also in tree)
see: sort.manual

## prefs.folders.overview | Folders category
src: 0220 | area: prefs
ui: Preferences / Folders / (Automatic Reading, Folder Formats, Automatic Formats, Folder Images, Folder Sizes, Junctions and Links, Network Servers, Special Folders, Virtual Folders > Desktop / File System / This PC)

## prefs.folders.autoread | Automatic Reading page
src: 0221 | area: prefs
ui: Preferences / Folders / Automatic Reading
user-words: network drive not loading on startup, don't wake sleeping disk, don't reconnect ftp on start
what: Stops automatic loading of slow folder types when a Lister opens (restored session, layout). Types: `CD-ROM/DVDs`, `Drives that are powered down`, `FTP sites`, `Network drives`, `Removable devices`, `Search results`, `Zip files and other archives`, `All other drive types`. Each: `Load normally`, `Prevent loading` (link shown in the display to read it), `Load on tab activation` (load first time the tab is active). A list at the bottom overrides per folder or wildcard.

## prefs.folders.formats | Folder Formats page
src: 0222 | area: prefs
ui: Preferences / Folders / Folder Formats (`Prefs PAGE=folderformats`)
user-words: per-folder view, default view for all folders, user default format, folder type formats
what: Formats list groups: `Favorite Formats`, `Path Formats`, `System folders` (Computer when Opus displays it natively, Portable Devices root), `Content Type Formats`, `Folder Type Formats`, `Default Format` (User Default).
options:
- Folder Type Formats: `Archives`, `Cloud Storage`, `Collection`, `Duplicate Files`, `Find Results`, `Flat View`, `FTP`, `Local Drives`, `Network Drives`, `Portable Devices`, `Removable Drives`, `Search Results`, `Synchronize` (Duplicate/Find/Search override Collection)
- add menu: `Path Format`, `Wildcard Path Format` (standard or regex, `Expand aliases` lets `/$Data` match a drive by label), `Content Type Formats` (just opens File Types), `Favorite Format`. Double-click edits, right-click copies/pastes definitions or adds to favorites, toolbar share/paste
notes: Lookup order on navigation: 1 Path format (exact or wildcard), 2 automatic remembered format (if enabled), 3 Content type (if enabled), 4 Folder Type format (if turned on), 5 User Default (cannot be turned off). A manually edited format in the display persists until a folder with its own format; Format Lock stops all automatic change.
notes: Edit Format dialog: each tab can be switched off so a specific format only overrides part (inherits the rest from defaults). `Include columns from other matching formats`: also merges columns of further matching formats, stops at the first matching format that does not have it. `Use as the default format for all sub-folders` (path formats).
see: formats.concept, formats.content

## prefs.folders.auto | Automatic Formats page
src: 0223 | area: prefs
ui: Preferences / Folders / Automatic Formats
user-words: remember sort per folder, remember last view
options:
- `Remember folder formats automatically`, `Remember at most` (count, oldest dropped), `Use as the default format for all sub-folders`, list right-click `Make Permanent` (to path format) / `Remove`, `Clear Formats`

## prefs.folders.images | Folder Images page
src: 0224 | area: prefs
ui: Preferences / Folders / Folder Images
user-words: background image per folder, different background for network drives
what: Like Folder Formats but for background image and fill colour (overrides Images and Directory Opus Colors pages). Groups: Folders (paths/wildcards), System folders, Content Types, Folder Types (same list as formats).
options:
- `Image`, `Image fit`: `Tiled`, `Stretched`, `Aspect Fit`, `Aspect Fill`, `Aspect Tile`, `Top/Left`, `Top/Right`, `Bottom/Left`, `Bottom/Right`, `Center`; `Opacity`, `Fill color`, `Shared`, `Apply settings to all sub-folders`, `Expand aliases`

## prefs.folders.sizes | Folder Sizes page
src: 0225, 0226 | area: prefs
ui: Preferences / Folders / Folder Sizes (+ Junctions and Links)
user-words: show folder sizes automatically, folder size slow, junction size
options:
- `Calculate folder sizes automatically` (choose drive types), `Cache folder sizes when going back and forward in the history`, `Update folder sizes after file operations where possible` (local/removable), `Use Everything to calculate folder sizes where possible`, `Calculate automatically even if automatic calculation is otherwise disabled` (indexed Everything folders)
- per-folder overrides list (folder or wildcard, enable/disable; applies to sub-folders inside that folder, not the folder itself)
- Junctions and Links: `Ignore junctions below a folder when calculating its size`, `Don't calculate size of junctions themselves` (manual `GetSizes` still works)
see: folders.sizes

## prefs.folders.network | Network Servers page
src: 0227 | area: prefs
ui: Preferences / Folders / Network Servers
user-words: network branch empty, hide computers in tree
options:
- `Populate the Network folder with computers found on your network`; cache: `Cache computer list across restarts`, `Cache computer list until shutdown`, `Do not cache computer list`; `Exclude these computers`, `Always add these computers`

## prefs.folders.special | Special Folders page (cloud storage)
src: 0228 | area: prefs
ui: Preferences / Folders / Special Folders
user-words: onedrive folder format, dropbox in tree, cloud storage folder
what: Desktop folders added by software (OneDrive, Dropbox) auto-detected as cloud storage (dark cloud icon) or marked manually (bright cloud). Cloud folders appear in the Cloud Storage tree branch and trigger the Cloud Storage folder format (Status column). `Show` per folder: `Folder Tree`, `File Display`, `Both`, `Hide`. `Other cloud folders` list for software without a desktop folder (for example Google Drive drive letter).

## prefs.folders.virtual | Virtual Folders pages (Desktop, File System, This PC)
src: 0229, 0230, 0231, 0232 | area: prefs
ui: Preferences / Folders / Virtual Folders / (Desktop, File System, This PC)
user-words: desktop in opus, this pc groups, drives sorted by name, empty drives, fonts folder real
what: Most virtual folders host Explorer (black box). Desktop and This PC can use Opus's native display (folder formats, colours, Opus commands).
options:
- hosting Explorer: `Enable background images`, `Enable custom fonts` (can cause cosmetic issues or crashes; turn off if problems)
- Desktop: `Use the Opus implementation for the Desktop folder`; contents: `All Users / Shared Desktop contents`, `Collections`, `Control Panel`, `Cloud Storage (and folders added by other software)`, `Documents / Profile folders`, `FTP`, `Libraries`, `Network`, `Operating system files` (hide desktop.ini), `Recycle Bin`, `This PC`; `Include additional folders when using Windows Search from the Desktop`; format via a Path Format for the desktop folder
- File System (virtual folders with a real folder behind, for example Fonts): `Treat all "virtual filesystem folders" as virtual`, `Treat all virtual folders as real`, `Treat specific virtual folders as real`
- This PC: `Use the Opus implementation for the This PC folder`, `Group drives by storage type` (HDD/SSD/Other), `Include Files Stored on This Computer`, `Include Media Servers`, `Show empty disk drives`, `Sort drives by name instead of letter`, `Low free space warning` (default 10%), `Show drive labels as`; format via System folders in Folder Formats

## prefs.tabs.overview | Folder Tabs category
src: 0233 | area: prefs
ui: Preferences / Folder Tabs / (Dimensions, Edge Colors, Folder Tab Bar, Groups, Locking, Options)

## prefs.tabs.dimensions | Dimensions and Edge Colors pages
src: 0234, 0235 | area: prefs
ui: Preferences / Folder Tabs / Dimensions, Edge Colors
user-words: tab width, same size tabs, colored tab edge for folder
options:
- horizontal: `Same size tabs` (`Automatic size` or `Fixed size`), `Maximum tab size`, `Minimum tab size`, `Reduce tab sizes to fit available space`
- vertical: `Automatic width` or `Initial width`
- Edge Colors: per folder or wildcard `Edge color`, `Apply settings to all sub-folders`

## prefs.tabs.bar | Folder Tab Bar page
src: 0236 | area: prefs
ui: Preferences / Folder Tabs / Folder Tab Bar (`Prefs PAGE=foldertabbars`)
user-words: tab bar on top, hide tab bar with one tab, new tab button, new tab opens which folder
options:
- new tab: `Display new tab button`, `Double-click to open a new tab`; initial folder: `Current folder`, `Duplicate`, `Default folder` (the Default Lister folder), `Home folder`, `Empty tab`, `Location`; `Open new tabs next to the active tab`
- overflow: `Use popup menu when tabs exceed available space`, `Show all tabs in menu`, `Show menu when tabs are reduced` (vertical bars scroll)
- `Display folder tab bar`: `Always`, `When needed`, `When needed (balanced)` (dual display shows both if either needs it)
- `Tab bar position`: `Below`, `Above`, `Left`, `Right` (per Lister: `Set TABPOSITION`); `Dual display position`: `Normal`, `Together`, `Apart`
cmd: `Set TABPOSITION`

## prefs.tabs.groups | Tab Groups page
src: 0237 | area: prefs
ui: Preferences / Folder Tabs / Groups (`Prefs PAGE=tabgroups`)
user-words: edit tab group, hidden tab group, tab group per side
options:
- toolbar: new group/folder, `Mark as hidden` (only reachable by the `Go` command), Edit (double-click)
- Edit Tab Group: `Name`, `Description`, `Close existing folder tabs when opening this group`, `Define tabs on specific sides of a dual-display Lister` (switches to dual display)
- per tab: `Edit Tab` (label tokens `%P` `%N` `%R`, folder), `Edit Format` (stored with the tab and overrides the folder format system; dropdown copies to all tabs), `Set Active`, `Change Side`, `Locked Tab`, `Link Tab` (specific sides only), edge colour palette button
see: tabs.groups

## prefs.tabs.locking | Locking page
src: 0238 | area: prefs
ui: Preferences / Folder Tabs / Locking
options:
- `Allow locked tabs to be closed individually`, `Display padlock icons when tabs are locked`, `Reset when another tab is activated` (Locked (allow folder changes) returns to its home folder; clicking the active tab or `Go TABSELECT=home` always resets), `Try to find existing tabs for double-clicked folders`
see: tabs.lock

## prefs.tabs.options | Folder Tabs Options page
src: 0239 | area: prefs
ui: Preferences / Folder Tabs / Options
user-words: close tab double click, tab close button, click active tab renames, drive letter in tab
options:
- `Display drive letter in tab label`, `Display folder icons`, `Drag over tabs brings them to the front` (hover time), `Per-tab format lock`, `Process file changes in background tabs` (off = reload when activated, faster with many tabs), `Treat tab label as folder when dragged or right-clicked` (icon = tab, label = folder), `Truncate long labels with "…" instead of fading out`
- clicking the selected tab: `Rename tab`, `Go to previous`, `Do nothing`
- closing: `Close tab on device ejection`, `Double-click tabs to close them`, `Folder tab close buttons`, `Small close buttons`, `Lister close button closes active tab`, `Lister closes when last tab closes`

## prefs.tree.overview | Folder Tree category
src: 0240 | area: prefs
ui: Preferences / Folder Tree / (Appearance, Contents, Expand / Collapse, Pins, Options, Selection Events, Sorting)

## prefs.tree.appearance | Folder Tree Appearance page
src: 0241 | area: prefs
ui: Preferences / Folder Tree / Appearance
user-words: tree lines, tree row height, highlight current folder path, lock button
options:
- `Tree style`: `Lines`, `No Lines`, `Visual Style`; `Show drive labels as` (labels before letters, letters only, letters before labels); `Custom indent size`, `Extra item height`, `Full-row selection`
- `Highlight path to selected folder`, `Highlight path to all currently open tabs`, `Only highlight paths when tree is active`, `Use color from tab`; `Separate items at the root level` (+ `Custom spacing`); `Show Folder Tree header`, `Show lock button`; `Use configured file display colors for tree items` (+ `Including network drives`)

## prefs.tree.contents | Folder Tree Contents page
src: 0242 | area: prefs
ui: Preferences / Folder Tree / Contents
user-words: remove libraries from tree, hide network in tree, show favorites in tree, reorder tree roots
what: Checkbox list of root items with arrow buttons to reorder; hidden branches still appear temporarily when you navigate into them.
options:
- general: `Show hidden folders`, `Show operating system folders`, `Show archives`, `Show virtual (non-filesystem) folders`, `Remove dynamically added folders`
- per item `Display under the Desktop item`
- Aliases: `Show built-in aliases`. Desktop: `Show extra folders` (Windows 11 extras filtered by default). Favorites: `Display separators in favorites tree`, `Merge Favorites and Smart Favorites`, `Display favorited files`. FTP: `Site roots always to go initial folder` (mouse clicks in tree only). Libraries: `Show member folders individually`. Profile: `Use user name as label` + sub-directory list. Smart Favorites: `Merge Favorites and Smart Favorites`, `Show full paths`. This PC: `Show empty disk drives`, `Show non-drive folders`

## prefs.tree.expand | Expand / Collapse page
src: 0243 | area: prefs
ui: Preferences / Folder Tree / Expand / Collapse
user-words: tree follows file display, tree slow on network, collapse other branches, remember expanded
options:
- `Automatically expand to current folder` (only for never-expanded branches; to freeze the tree use the lock button). Population: `Fully populate contents`, `Populate contents for local devices only`, `Don't populate contents` (big speed-up on networks)
- `Animate expanding branches`, `Collapse non-selected branches` (+ `Unless open in other tabs`), `Expand selected branch`, `Expand selected branch when changing tabs`, `Expand/collapse all child branches when parent double-clicked`, `Prevent scrolling when branches expand`, `Remember expanded root items in layouts`, `Remember all expanded items` (+ `Only remember if pinned`), `Remember expanded items for tabs`
- drag and drop: `Expand branches when dragging over the tree`, `Collapse after drag (spring-loaded)`, `Expansion delay`

## prefs.tree.misc | Pins, Options, Selection Events, Sorting pages
src: 0244, 0245, 0246, 0247 | area: prefs
ui: Preferences / Folder Tree / (Pins, Options, Selection Events, Sorting)
user-words: pin folder in tree, two trees, tree click opens new tab, tree sort
options:
- Pins (pinned branch stays expanded): `Expansion pins on folder tree branches`, `Show pins only on mouse-over`, `Require Shift key down to change pin state`, `Right-align pins`
- Options: `Open second Folder Tree in dual display mode`, `Share single tree between dual file displays` (off = left/top display only), horizontal scrolling: `Manual scrolling with automatic adjustment on folder changes`, `Manual scrolling only`, `No horizontal scrolling at all`; `Prevent horizontal scrolling during drag and drop`; `Position selected item` (vertical)
- Selection Events (commands on tree clicks; right button is always the menu): left default `Go .`, Alt `Go NEWTAB`, Ctrl `Go OPENINDUAL`; middle default `Go NEWTAB`, Ctrl `Go NEWTAB OPENINDUAL`; separate commands for Alt/Ctrl/Shift
- Sorting: `Mirror sort order from file display`, `Numeric order sorting`, `Use global ignore prefix`, `Word sort`
cmd: `Go NEWTAB`, `Go OPENINDUAL`

## prefs.paths.overview | Frequently Used Paths category
src: 0248 | area: prefs
ui: Preferences / Frequently Used Paths / (Favorites List, Folder Aliases, Home Folder, Paired Folders, Recent List, SmartFavorites, Points)

## prefs.paths.favorites | Favorites List and Folder Aliases pages
src: 0249, 0250 | area: prefs
ui: Preferences / Frequently Used Paths / Favorites List, Folder Aliases
user-words: edit favorites, favorite hotkey, add alias, show built-in aliases
options:
- Favorites List: New menu creates favorite folder, favorite file, branch, separator, heading. Edit: name, hotkey (always active, unlike menu accelerators), path. `Sort` button, `Automatically sort newly added Favorites`. `&` before a character makes a menu accelerator (`&Videos`, literal `&&`)
- Folder Aliases: map names to paths (`Go /projects`); usable in icons, background images, FAYT, location field; built-ins (for example `/desktop`, `/dopusdata`) hidden unless `Show built-in aliases`
see: nav.aliases, nav.favorites

## prefs.paths.homerecent | Home Folder, Recent List, SmartFavorites pages
src: 0251, 0252, 0253, 0254, 0255 | area: prefs
ui: Preferences / Frequently Used Paths / (Home Folder, Paired Folders, Recent List, SmartFavorites, Points)
user-words: change home button, history size, smartfavorites threshold
options:
- Home Folder: `First folder opened in the tab` or `Specific folder`
- Recent List: `Enable the recent list`, `Maximum size`, `Include virtual folders`, `Ignore filesystem folders that are only transited`; History list max size at the bottom
- SmartFavorites: `Enable SmartFavorites system`, `Check on startup for folders that no longer exist`, `Display at most`, `With at least` (points), `Reference table` (+ `Clear`). No exclusion list and no per-folder remove [tested 13.11, user's Preferences page]; see nav.smartfavorites. Points page sets points per tracked activity
- Paired Folders editor: `Absolute paths` (`Primary folder`, `Secondary folder`, bidirectional) or `Regular expression` (`Match`, `Replace`, `Expand folder aliases`; evaluated in list order); `If non-existent`: `Go up to first existing parent`, `Ignore the pair`, `Use path even if it doesn't exist`; `Apply settings to all sub-folders`, `Automatically link paired tabs`, `Default dual-display folder`, `Always display primary folder at the left/top`, `Turn on Navigation Lock automatically`, `Default Navigation Lock target`, `Default Synchronize target`; `Test folder` / `Result` fields
see: nav.pairedfolders

## prefs.internet | Internet category: Email and Updates pages
src: 0256, 0257, 0258 | area: prefs
ui: Preferences / Internet / (Email, Updates)
user-words: zip and email setup, smtp, auto update opus, beta updates
options:
- Email (for `ZIP And Email Files`): `Email address`, `Name`, `SMTP Server`, `Port` (25 or 587), `Use SSL/TLS` (Automatic available; forced for GMail), `Server requires authentication` (username, password), `Send email via`: `Internal SMTP client` (preferred), `mailto: emulation`, `MAPI client`; `Maximum SMTP threads`
- Updates: `Check for news and program updates`, `Check frequency` (daily/weekly/monthly), notification: `Open updater before checking`, `Open updater if update found`, `Status bar icon if update found`; `Automatically download new program updates`, `Automatically install when Opus is inactive` (UAC may still appear); `Check for new beta releases` (if a beta is installed and this is turned off, it still checks for newer betas until a stable is installed, with a link back to stable); `Install updates with minimal interaction`, `Check for and install updated Program Certificates`

## prefs.labels | Labels category pages
src: 0259, 0260, 0261, 0262, 0263 | area: prefs
ui: Preferences / Labels / (Label Definitions, Label Assignments, In Specific Folders, Options)
user-words: create label, colour by extension, wildcard label, label stored where
options:
- Label Definitions: `Label`, `Category` (default Colors and Status), `Bold` / `Italic` / `Underline`, `Unselected text`, `Selected text` (ignored with visual styles unless `Visual styles override file selection colors` is off), `Icon color`, `File icon`, `Status icon`, `Show in Label column`, `Pin to top` (NTFS only)
- Label Assignments (list of labelled paths; NTFS-stored labels do not appear here): New menu `File label` (path), `Folder label` (path), `Wildcard label`, `Filter label` (slow clauses like Contains cost every folder visit). Wildcard fields: `Name`, `Wildcard` (regex option; `grp:Images` matches a file type group), `Match Full Path`, `Type` (files, folders, both), `Label`, `Stop on match`. Entries reorderable for priority
- In Specific Folders: same assignments but only in given folders (`Add Folder`, `Add Wildcard`) plus entries for content types and folder types
- Options: `Enable label storage in the file system` (NTFS stream; else config path list), `Warn if labels can't be stored in the file system`, `Apply wildcard and filter labels to explicitly labelled files`
see: labels.concept
