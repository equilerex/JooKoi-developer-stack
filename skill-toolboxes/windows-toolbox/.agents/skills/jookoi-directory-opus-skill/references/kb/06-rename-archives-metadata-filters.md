# Rename options, folders, archives, undo, attributes, labels, metadata, filters, UAC

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- rename.options: Rename dialog options
- rename.metadata: Rename with metadata codes
- rename.scripts: Rename scripts
- folders.create: Create Folder dialog
- archives.create: Creating archives
- archives.dialog: Add to Archive dialog
- archives.options: Archive format options (Zip, 7z, RAR, TAR)
- archives.zip: Zip specifics (comment, read-only, self-extracting)
- fileops.undo: Undo, Redo and File Log
- fileops.attributes: Change Attributes & Timestamps dialog
- labels.concept: Labels and status icons
- metadata.editing: Editing metadata
- metadata.fields: Metadata fields by category
- metadata.setattr: SetAttr META (set metadata by command)
- time.shift: Time shift strings
- fileops.descriptions: File descriptions
- filter.concept: Filtered operations (recursive filters)
- filter.clauses: Filter clauses and logic
- filter.clausetypes: Filter clause types
- filter.textual: Textual filters (FILTERDEF)
- uac.adminmode: UAC and Administrator Mode
<!-- contents:end -->

## rename.options | Rename dialog options
src: 0105 | area: rename
ui: Advanced Rename / Options section
user-words: rename subfolders, number on clash, apply case change to non matching, rename matching names together
options:
- `Apply actions even if pattern doesn't match` (capitalization etc. applies to every item)
- `Automatically number files when names clash` (off = error dialog)
- `Hide unaffected items in preview` (off = shown in another colour)
- `Use preview list to build macros`
- `Rename files in selected sub-folders` (recurse into selected folders instead of renaming them)
- `Rename folders as well as their contents`
- `Show preview of sub-folder contents` (cannot edit or uncheck those rows)
- `Rename matching filenames as one` (same base name with different extensions counts as one for numbering, for example `01012.JPG` and `01012.WAV`)

## rename.metadata | Rename with metadata codes
src: 0106 | area: rename
ui: Advanced Rename / dropdown button left of the `New name` field (lists all column fields plus rename-only codes)
user-words: rename mp3 by tags, rename photos by date taken, move files to folders when renaming, zero pad
what: Insert `{field}` codes in New name (same fields as file display columns; full keyword list: manual page Keywords for Columns). Backslashes in the new name move files into sub-folders (created automatically) relative to the current folder. Example: `{mp3artist}\{mp3album}\{mp3track} {mp3title}`.
options:
- extra codes: `[#]` number position; `{parent}`, `{parent2}`, `{parent3}` (parent folder names; recursion changes what `{parent}` returns); `{parentbase}`, `{parentbase2}` (folder where the rename started); `{date}`, `{time}` (local), `{dateu}`, `{timeu}` (UTC); `{= expr =}` evaluator result
- `|noext` strips an extension from `{parent}`/`{parentbase}` (for archive parents): `{parentbase|noext}`. `{name|noext}` = original name without extension
- `$.\` at the start of New name: move relative to the base folder instead of the file's parent
- date/time formats: `D#` date format, `T#` time format: `{datetaken|D#yyyy-MM-dd}`, `{modified|T#HH-mm-ss}`, `{datetaken|D#yyyyMMddT#HHmmss}`. Numeric zero padding: `{size|#8}`, `{mp3track|#2}`
- literal `{`: escape with another `{` (`*{{size}` adds the text `{size}`)
notes: Illegal filename characters from metadata (for example `:` in `{time}`) are converted to the nearest legal one by default (colon becomes semicolon).
see: codes.datetime, rename.advanced

## rename.scripts | Rename scripts
src: 0107 | area: rename
ui: Advanced Rename / Actions / `Edit Script`
user-words: rename with vbscript, custom rename logic
what: Script editor pops out right of the dialog (language dropdown: VBScript, JScript, other ActiveX languages). `Script defined` shows when a script is active even if the editor is hidden. Hide Script button's dropdown has Clear. Writing guide: scripting section, Rename Scripts.
see: scripting.rename

## folders.create | Create Folder dialog
src: 0107 | area: fileops
ui: Operations toolbar > New Folder; right-click background > New > Folder (simple Explorer way)
user-words: make many folders, numbered folders, folder tree at once, new folder dialog
what: Shows name length and total path length (normal maximum 259 characters; Opus handles longer but other programs may not).
options:
- folder tree: separate with slashes (`One/Two/Three`)
- `Create multiple folders`: one name per line (Enter = new line; Enter twice on the last line or Shift+Enter accepts)
- children under one parent: separate names with `|` (for example `2023|2024` then months below)
- numbered: `<a-b+c>` code, `a` may be zero-padded (`<001-100>`), `-b` optional (`<10>` = 1 to 10), `+c` increment default 1, text outside the code kept (`New Folder <5>`)
- OK button dropdown (or hold a qualifier while clicking OK): `Create Folder` (no read), `Read Folder` (navigate into it), `Read Dual` (other display, first folder only), `Read New Tab` (one tab per folder), `Read New Tab (Dual)`
cmd: `CreateFolder`

## archives.create | Creating archives
src: 0107, 0108 | area: archives
ui: Operations toolbar > New Folder ▾ > New Archive; Archive Files; right-click context menu; Preferences / Zip and Other Archives / Archive Context Menu
user-words: make zip, new archive, add to 7z, compress files
what: `New Archive` creates an empty archive (choose name and `Archive Type`, extension follows the type); then drop, paste or Copy Files into it (also onto archives in the tree if shown on Folder Tree / Contents). Ways to add files: open archive as folder and copy/paste, drag onto archive, `Archive Files` button, context menu.
options:
- context menu `Add to named archive` (instant, same folder, named after the first selected file, for example `Add To "Presentation.7z"`)
- context menu `Add to archive` (opens the Add to Archive dialog; the format chosen on the Preferences page is only the initial format)
notes: Which formats get which commands: Archive Context Menu page.
see: archives.dialog

## archives.dialog | Add to Archive dialog
src: 0109 | area: archives
ui: Archive Files button or context menu `Add to archive`
user-words: archive settings, compression level, encrypt archive
what: Top: `Archive Type` (writable formats only), location and name fields (histories; extension adjusts to type; paste a full archive path into the name field to fill both; Ctrl+Shift+C copies combined path), Browse buttons (path-only / existing archive picker). Bottom: options specific to the type. Existing archives can be chosen to add into.
see: archives.options

## archives.options | Archive format options (Zip, 7z, RAR, TAR)
src: 0110, 0111, 0112, 0113, 0114 | area: archives
ui: Add to Archive dialog (bottom)
user-words: encrypt zip, split zip, 7z solid, rar password, self extracting
options:
- Zip: `Compression level` (six: Store to Best), `Enhanced compression level` (may not open in older tools), `Encryption method` (`Standard` = oldest, weakest, most compatible; AES options = stronger, key length differs), `Password`, `Verify password`, `Mask password`, `Make self-extracting archive`, `Split archive` (chunk presets or manual size `1.87 MB`, no suffix = bytes), `Save full file paths` (off = path relative to current folder)
- 7z: `Compression level`, `Compression method` (`LZMA` default, `LZMA2`, `PPMD`, `BZip2`), `Solid mode` (+ block size; slow to extract single files, thumbnails mostly off), `Password`, `Verify password`, `Mask password`, `Encrypt file names`, `Use multiple threads`, `Store full file timestamps`
- RAR (needs WinRAR installed to create/modify; Opus reads RAR itself): `Compression level`, `Solid compression`, `Password`, `Verify password`, `Mask password`, `Encrypt file names`, `Send passwords to WinRAR via command-line` (convenient, password visible in Task Manager during the job), `Use multiple threads`, `Store full file timestamps`
- TAR BZip2 (.tbz2): `Compression level` (five: Fastest to Best), `Use multiple threads`
- TAR GZip (.tgz): `Compression level` (five)

## archives.zip | Zip specifics (comment, read-only, self-extracting)
src: 0115, 0116, 0117, 0118 | area: archives
ui: Preferences / Zip and Other Archives / Zip Files and Archive Options (`Open archives as read-only by default`); Archive Context Menu page
user-words: zip comment, archive read only, make exe from zip, sfx
what: Zip is built in (others via plugins) so options live on separate pages. Opus config backups are `.ocb` files that are zip archives.
options:
- Zip comment: enter the zip, right-click empty area or status bar > Lister Zip context menu > `ZIP Comment` (visible in the Description column)
- Read-only mode: with `Open archives as read-only by default` adds/deletes in archives raise an error. Add the Read-Only toggle button (Customize / Commands) to switch while inside an archive
- Self-extracting: convert via the `Create Self-Extracting Archive` dialog (context menu command on .zip, can be disabled on Archive Context Menu page, or tick in Add to Archive): `From`, `To` (.exe path), `Name` (title bar), `Custom instructions` (.txt), `Custom image` (on with no file = no image, smaller exe), `Default path for extraction` (default temp folder), `Auto-run after extraction` (choose an included exe). User can tick `Open folder to view files`. UAC elevation is handled automatically.

## fileops.undo | Undo, Redo and File Log
src: 0118 | area: fileops
ui: Edit > Undo (Ctrl+Z), Edit > Undo List; Help / Logs / File Log; Preferences / File Operations / (Options `Sequential undo`, Logging)
user-words: undo delete, undo rename, redo, what happened to my file, file log
what: Undo reverses most actions; deletes only if sent to the Recycle Bin. `Undo List` shows the ten most recent, `More…` opens the Utility Panel Undo Log (undo one, many or all).
options:
- `Sequential undo` off: an undo creates a new top entry that undoes the undo (Ctrl+Z again = redo). On: undone items go to a redo list; redo with `Undo REDO`
- File Log: persistent, last 1000 operations by default (type, file, time, destination for copy/move), filter field, Save button exports text. Size and recorded operation types: File Operations / Logging page
cmd: `Undo REDO`

## fileops.attributes | Change Attributes & Timestamps dialog
src: 0118 | area: fileops
ui: Properties button ▾ > Attributes
user-words: remove read only, set hidden, change modified date, copy date taken to file date
what: Attributes shown in the `Attr` column as letters.
options:
- attributes: `A` Archive, `C` Compressed (NTFS, exclusive with E), `E` Encrypted (NTFS, exclusive with C), `H` Hidden (fades icon, hidden from display depends on Global Filters), `I` Non-Indexed, `R` Read-only (can still go to Recycle Bin), `S` System (H+S hidden by default, `Hide operating system files` on Global Filters)
- modify: `Change attributes` (absolute set), `Turn on` / `Turn off` (specific ones only)
- timestamps: `Set creation time`, `Set last modified time` (date, time or both; checkboxes preserve parts). Dropdown: now, or from the selected file. `Copy from`: `Modified` (creation only), `Created` (modified only), `Date Taken`, `Date Digitized`, `Parent folder`, `Document Created`, `Last Edit Time`, `Last Saved Date` (missing value = no change). `Time shift` field
- `Sub-folders`: `Make the same changes to files within selected folders`, `Use filter`
see: time.shift, filter.concept

## labels.concept | Labels and status icons
src: 0118 | area: labels
ui: Properties button ▾ > Set Label / Set Status; Preferences / Labels / (Label Definitions, Label Assignments, In Specific Folders, Options)
user-words: colour files, tag with colour, mark important, flag files, pin files to top
what: A label has a name and optional colours/font styles, icon override, status icon (own column) and pinning to the top. Defaults: Blue, Green, Orange, Purple, Red; status icons Checked, Flagged, Important, Pinned (status entries are labels grouped under `Status`).
options:
- Stacked labels: several labels can apply; each definition has a `stop on match` flag
- Wildcard labels (Label Assignments page): pattern-based, filters can test other attributes. Explicit labels override wildcard ones unless `Apply wildcard and label filters to explicitly labeled files and folder` is on
- Icon override example: label `HD Image` with custom icon plus a label filter (JPG, height >= 1080)
- Storage: NTFS alternate data stream (travels with the file on copy/move/rename if enabled on Copying Files / Attributes), otherwise a path list (label does not follow a moved file; manage on Label Assignments). `Labels / Options` can turn off file-system storage
- TortoiseSVN: `Show TortoiseSVN icons in the Status column` (File Display Columns / Icons), needs TortoiseSVN 1.9.3+, avoids the 15 icon-overlay limit

## metadata.editing | Editing metadata
src: 0118 | area: metadata
ui: Metadata Pane (F9); Properties button ▾ > Edit Metadata (Set Metadata dialog); standalone viewer Edit > Edit Metadata; Preferences / File Operations / Metadata / Editor
user-words: edit tags, edit exif, bulk edit metadata, rating stars, multiple values
what: Three routes: Metadata Pane, Set Metadata dialog, `SetAttr META`. Categories: Non-editable Properties (pane only), Document, Picture (EXIF: JPEG, PNG, TIFF, PSD), Music (MP3, WMA), Video (AVI, WMV), Music & Movie (mixed selection), Extended (Comment, Tags, Rating), Standard (attributes, timestamps with a `Select operation` time shift field).
options:
- editing: click a value, Tab/Shift+Tab, Enter accepts, Esc undoes; red triangle marks modified fields
- multiple files: only common properties editable; differing values show `multiple values`
- multi-value fields (tags, authors): separate by `;`; with several files `+value` adds, `-value` removes. `Add to multi-value fields by default` (Editor page) removes the need for `+`
- copy metadata by dragging another file onto the property list (left drag = default set, right drag = menu)
- apply: Set Metadata = OK. Pane = `Apply` / `Cancel` links; Shift+arrow buttons save and move; `Apply changes automatically` (Editor page)
- Rating column: click stars directly
notes: Extended properties go in the file if the format supports them, else an NTFS alternate data stream (not available on FAT).
see: metadata.fields, metadata.setattr, time.shift

## metadata.fields | Metadata fields by category
src: 0119, 0120, 0121, 0122, 0123, 0124 | area: metadata
ui: Metadata Pane / Set Metadata dialog
user-words: which tags exist, exif fields, id3 fields, cover art
what: Field names as shown in the editor.
options:
- Document: Authors (Artists on music/video), Category, Company, Content Status, Content Type, Copyright, Language, Last saved by, Manager, Subject, Title
- Picture: Aperture, Camera make, Camera model, Contrast, Creation software, Date digitized, Date taken (both accept time shift and `Copy from date created/modified/taken`), Digital zoom, Exposure bias, Exposure program, Exposure time, F-number, Flash, Focal length, Focal length (35mm), GPS Altitude/Latitude/Longitude, ISO speed, Metering mode, Rotation (0/90/180/270), Saturation, Scene capture type, Sharpness, Shutter speed, Subject distance, White balance
- Music: Album, Album artist, Artists, Author URL, BPM, Composers, Conductors, Content group, Copyright, Cover art, Disk number, Encoded by, Genre, Initial key, Mood, Original artists, Publisher, Release date, Subtitle, Title, Track number (`5` or `5 / 15`; `Increment` option numbers selected files in order, leading zero pads), Year
- Video: Artists, Author URL, BPM, Composers, Conductors, Content group, Copyright, Directors, Encoded by, Genre, Mood, Producers, Publisher, Subtitle, Title, Writers, Year
- Extended: Comment (in file, ADS, or descript.ion), Tags, Rating (1 to 5 stars, X clears)
- Cover art (music): `Add`, `Paste` (clipboard image), JPG or PNG only (others converted to JPG), hover/Space shows a larger popup with resolution/size and a type dropdown (front cover, back cover...; front cover is used for the file thumbnail). Popup right-click menu: `Type`, `Set description`, `Copy`, `Extract image`, `Delete`
notes: Multi-value fields: semicolon separated.

## metadata.setattr | SetAttr META (set metadata by command)
src: 0125 | area: metadata
ui: button or hotkey command
user-words: set rating by button, script metadata change, copy tags from file
what: `SetAttr META keyword:<value> keyword:<value> ...`. Missing value clears the field (`SetAttr META album`). Values with spaces: quote the whole pair (`SetAttr META "album:Dark Side Of The Moon" "albumartist:Pink Floyd"`). Wildcards in keywords set several fields (`*artist`). `SetAttr META` alone clears all metadata fields. Keyword list: manual page Keywords for SetAttr META.
notes: Rating menu example: `SetAttr META rating:0` (clear) ... `rating:5`. Relative date: `SetAttr META datetaken:-1` (minus one hour).
options:
- `copyfrom:<type>,<file>`: type 1 music artist/album/year/genre; 2 music all except title and track; 3 music all; 4 documents author and ownership; 5 documents all except title and subject; 6 documents all; 7 movie director/producer/writer; 8 movie all except title; 9 movie all; 10 picture author and ownership; 11 picture GPS; 12 picture GPS and camera; 13 picture author, ownership, camera; 14 picture author, ownership, GPS; 15 picture all. Example `SetAttr META "copyfrom:8,/myvideos/my home movie1.avi"`
cmd: `SetAttr META`

## time.shift | Time shift strings
src: 0126 | area: metadata
ui: metadata editor date fields, Change Attributes dialog `Time shift`, `SetAttr`
user-words: add one hour to photos, fix camera clock, shift timestamps
what: Format `<date-shift> <time-shift>` or just `<time-shift>`. One value alone is a time shift, so a date shift needs a time part (can be 0).
options:
- date-shift: `[+-]Y:M:D`, `[+-]M:D`, `[+-]D`
- time-shift: `[+-]H:M:S`, `[+-]H:M`, `[+-]H`
- examples: `+1` or `1` = plus 1 hour; `-1:0:0 0` = minus one year; `+8:30` = plus 8.5 hours; `+3 -0:45` = plus 3 days, minus 45 minutes

## fileops.descriptions | File descriptions
src: 0126 | area: metadata
ui: Properties button ▾ > Description (Ctrl+P); Preferences / File Operations / Metadata; Copying Files / Metadata
user-words: file comment, notes on files, descript.ion
what: Two stores: `descript.ion` (old pseudo-standard, one file per folder, readable by other tools, slower, clutters listings but can be hidden) and NTFS comments (alternate data stream, efficient, NTFS only). Choose on File Operations / Metadata. Copying Files / Metadata controls whether descriptions are kept on copy.
options:
- Set Description dialog: `Apply to all selected items`, `Apply to all files within selected folders`
- also editable via the metadata `Comment` field

## filter.concept | Filtered operations (recursive filters)
src: 0126 | area: filter
ui: Copy Files ▾ > Enable Copy Filter; Delete ▾ > Enable Delete Filter; Preferences / Filtering and Sorting / Filters
user-words: copy only images from subfolders, delete only tmp files, reusable filter
what: Filters decide which items inside folders an operation touches. Used by Copy/Move (Copy Filter), Delete (Delete Filter), Find Files advanced, Advanced Selection, Synchronize, Duplicate File Finder, Attributes dialog, Print/Export Folder Listing, Labels. Copy and delete filters are local to the Lister until turned off or it closes.
options:
- define on the spot (and edit) or pick a saved filter (Filters page); command line: `Copy FILTER <name>` or `Copy FILTERDEF name match *.jpg`
- filter dialog (copy/delete): `Disable filter after this function`, `Select` (select what it matches in the current display), `Skip Filter` (skip for this operation only); `Clear` button (Shift+click = template filter); dropdown loads/saves filters
cmd: `Copy FILTER`, `Copy FILTERDEF`
see: filter.clauses, filter.textual

## filter.clauses | Filter clauses and logic
src: 0127, 0128 | area: filter
ui: filter control (Find advanced, Select by Pattern advanced, copy/delete filters)
user-words: and or not in filters, nested conditions, subclause
what: A filter is clauses linked by `and` / `or`; each clause is `Match` or `No Match` (not); sub-clauses act as parentheses. Example: `name match *.jpg and size match > 100 kb` or `name match *.gif and size match < 50 kb`. Negated example: jpg > 100kb and nomatch (size > 1mb or name *horse*).
options:
- per clause: `+` adds above the clicked line (bottom `+` adds at the end), `-` deletes, checkbox disables without deleting, and/or dropdown (not on the first clause), type dropdown (`Subclause` starts one), Match/No Match dropdown
- keyboard: Tab, Up/Down between clauses, `+` or Ins add, `-` or Del delete, Space toggle

## filter.clausetypes | Filter clause types
src: 0129 | area: filter
ui: filter control type dropdown
user-words: filter by size, filter by date, filter by attribute, filter image dimensions
what: Types and their parameters.
options:
- `Attributes`: On / Off for R, A, H, S, E, C, O (Offline, cloud), I (Non-Indexed), P (Pinned, cloud)
- `Availability`: cloud offline status
- `Contains`: file text (deferred, runs last; needs IFilter for non-text). Options: wildcards, regex, any word, assume UTF-8, case sensitive, partial, ignore diacritics
- `Date` (date only): timestamp Modified/Created/Accessed; After, Before, Between, Within (days, weeks, months, years). `Date/Time`: both, no Within. `Time` (time only): same timestamps; After, Before, Between, Within (hours, minutes, seconds, relative to now)
- `Description`, `Name` (wildcards, regex, any word, case, partial, diacritics), `Owner` (auto partial), `Tags` (auto partial, each tag compared separately: use two clauses for two tags), `Target` (shortcut/junction/link target path; File or Folder only), `Rating`, `Label` (dropdown or wildcard), `Path length` (find paths over 260), `Script column`, `Shell column` (numeric operators `!= == < > <= >= && ||`)
- `Document`: Any field, Author, Category, Comment, Company, Copyright, Creator, Document Created, Last Edit Time, Last Saved By, Last Saved Date, Pages, Producer, Subject, Title
- `Image`: Aperture, Artists, Aspect ratio, Bit depth, Camera make/model, Color model, Contrast, Copyright, Creation software, Date digitized, Date taken, Digital zoom, Dimensions (presets or Width/Height), Exposure bias/program/time, F-number, Flash, Focal length (+35mm), Height, Image description, ISO speed, Lens make/model, Metering mode, Resolution X/Y, Rotation, Saturation, Scene capture type, Sharpness, Shutter speed, Special instructions, Subject, Subject distance, Title, White balance, Width
- `Music`: Album, Album artist, Any field, Artists, Auto bit rate, BPM, Codec, Comment, Composers, Conductors, Disc number, Encoded by, Encoding software, Genre, Initial key, Protected (DRM), Publisher, Release date, Sample rate, Song length, Title, Track number, Year
- `Filter`: references a saved filter (changes propagate)
- `Folder content`: folder matches if any child matches the sub-clause
- `Full path`: whole path incl. name, wildcards over the whole string (`C:\Data\Pictures\*\*.jpg`). `Location`: path without file name (useful in File Collections)
- `Size`: equal/greater/less comparisons in bytes/KB/MB/GB (rounded for units, 1158 bytes equals 1 KB). Folder sizes only if combined with a `Type` = Folders clause (slow)
- `Sub-folder`: controls which folders a recursive operation enters (a failing folder and all children are skipped, only this clause stops recursion; Full path and Location still examine children). Does not work with Synchronize. Example: skip `.svn`
- `Type`: `File Type` (registered type), `File Type Group`, `Files`, `Folders`, `Junctions and Links`
see: filter.clauses

## filter.textual | Textual filters (FILTERDEF)
src: 0130 | area: filter
ui: filter control `Edit as text` button
user-words: filter on command line, find with filter, filterdef
what: Text form of a filter. `Find HERE FILTERDEF size match > 1 mb`. `FILTERDEF` is accepted by `Find`, `SetAttr`, `Print`, `Copy`, `Delete` and must be the last argument (raw). Multi-line in buttons: `Find IN C:\ [[ FILTERDEF size match > 100 kb and size match < 200 kb and name match *.jpg ]]`. Text starting with `=` uses the Evaluator instead.
cmd: `Find HERE FILTERDEF`
see: evaluator.contexts

## uac.adminmode | UAC and Administrator Mode
src: 0130 | area: fileops
ui: Operations toolbar > Admin button
user-words: run as admin, elevate lister, uac prompts, access denied program files
what: Opus prompts for UAC once per function in protected locations. `Admin` button elevates the current Lister for a chosen timeout (title bar shows `Administrator`); operations then need no prompts, and programs launched from it are also elevated. `ADMINISTRATOR` in the title bar means the whole process is elevated (not recommended). Manual recommends Windows UAC level Always notify.
notes: Elevate an external program from a button with the `@admin` command modifier.
cmd: `@admin`
