# File operations and renaming (part 1)

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- fileops.overview: Copy, move, delete: the ways
- fileops.clipboard: Copy and paste
- fileops.dragdrop: Drag and drop behaviour
- fileops.copybuttons: Copy Files and Move buttons
- fileops.copyas: Copy As / Move As (rename while copying)
- fileops.queues: Copy queues
- fileops.unattended: Unattended copy and "When file exists"
- fileops.jobsbar: Jobs Bar
- fileops.replacedialog: Confirm File Replace dialog
- fileops.updated: Copying updated files (Update commands)
- sync.tool: Synchronize tool
- fileops.delete: Deleting files
- fileops.securedelete: Secure delete
- rename.overview: Ways to rename
- rename.inline: Inline rename
- rename.simple: Simple Wildcard Rename
- rename.advanced: Advanced Rename dialog
- rename.presets: Rename presets
- rename.modes: Rename modes
- rename.actions: Rename actions (capitalization, macro, numbering, script)
- rename.macros: Rename macro builder
<!-- contents:end -->

## fileops.overview | Copy, move, delete: the ways
src: 0079 | area: fileops
ui: n/a
user-words: move files, copy files, how to copy
what: Three ways to copy/move: copy-and-paste, drag-and-drop, toolbar buttons (Copy Files, Move). Extras: copy queue, rename while copying (one by one or wildcards), replace dialog on name clashes, Synchronize, copy/delete filters for sub-folder content, Secure Wipe. Sections: renaming, creating folders, archives, attributes, labels, metadata, descriptions, UAC and Administrator Mode.

## fileops.clipboard | Copy and paste
src: 0080 | area: fileops
ui: Edit menu: Copy Ctrl+C, Cut Ctrl+X, Paste Ctrl+V
user-words: paste text as file, paste image as file, add to clipboard, cumulative copy
what: Paste of files runs the internal `Copy` command behind the scenes, so copy queues apply. Clipboard text pastes as a file `Clipboard Text.txt`, image as `Clipboard Image.jpg` (format via Advanced option `clipboard_image_paste`: Bitmap, GIF, PNG, JPG; `clipboard_image_paste_dpi` scales for system DPI). File names are controllable with `Clipboard` arguments.
notes: Incremental clipboard: `Clipboard COPY ADD` appends selected files to what is already on the clipboard (Ctrl+C runs `Clipboard COPY` by default; bind the ADD version to for example Ctrl+Shift+C).
cmd: `Clipboard COPY`, `Clipboard COPY ADD`
see: fileops.queues

## fileops.dragdrop | Drag and drop behaviour
src: 0081 | area: fileops
ui: Settings / File Types, `All files and folders` type, Events and Drop Menu tabs
user-words: drag copies instead of moves, change drag drop default, alt drag shortcut, right-drag menu
what: Default like Explorer: same drive = move, different drive = copy, Shift forces move, Ctrl forces copy, Alt creates a shortcut, right-button drag shows a Copy/Move/Create Shortcut menu. In Opus these are configurable events of the `All files and folders` file type: drag and drop = `Copy MOVEWHENSAME`, +Alt = `Copy MAKESHORTCUT`, +Ctrl = `Copy RENAMEWHENSAME`, +Shift = `Copy MOVE`. The Drop Menu tab defines the right-drag menu.
notes: To always copy, change the plain drag-and-drop event to `Copy RENAMEWHENSAME`. Specific file types can override (for example Shift+drop of a Zip extracts it).
cmd: `Copy MOVEWHENSAME`, `Copy MAKESHORTCUT`, `Copy RENAMEWHENSAME`, `Copy MOVE`
see: filetypes.events

## fileops.copybuttons | Copy Files and Move buttons
src: 0082 | area: fileops
ui: Operations toolbar > Copy Files ▾ / Move ▾
user-words: copy as, duplicate, dated name copy, create shortcut, send to
what: Uses source/destination (prompts for a destination if none).
options:
- Copy Files ▾: `Copy Files`, `Copy As`, `Duplicate` (same folder), `Duplicate to Dated Names` (current date appended), `Update All`, `Update Existing`, `Create Shortcuts` (.lnk in destination), `Create Advanced Links` (junctions/softlinks), `Send To`, `Enable Copy Filter` (recursive filter for sub-folder content), `Copy Settings` (opens Copying Files page)
- Move ▾: `Move`, `Move As`, `Move into Dated Folder`
see: fileops.copyas, fileops.updated

## fileops.copyas | Copy As / Move As (rename while copying)
src: 0083 | area: fileops
ui: Copy Files ▾ / Move ▾ > Copy As, Move As
user-words: rename on copy, copy with new name, batch rename when copying
what: Dialog with `Old name` and `New name`. A literal new name renames one file, the dialog reappears for each further selected file. Wildcards: only `*` is recognised (same as Simple Wildcard Rename). Old pattern marks the parts to keep, new pattern places them. Any number of asterisks, at least as many in Old as in New.
see: rename.simple

## fileops.queues | Copy queues
src: 0084 | area: fileops
ui: Preferences / File Operations / Copying Files
user-words: copy one at a time, parallel copies slow, queue copies, abort queue
what: Serialises copy/move jobs that hit the same device so they do not thrash. A Queue tab appears in the progress window (reorder, start now, abort). Abort asks: current job or all jobs.
options:
- `Display confirmation when a job is queued`
- `Automatically manage file copy queues`: off disables auto queuing
notes: Auto rules (first match decides the queue): fixed local destination drive with another operation to the same physical drive (partitions of one drive count as one); source network/removable/FTP with another copy from the same source; destination network/removable/FTP with another job to it; destination archive with another job to that archive; otherwise same source and destination. Queues are independent of each other (an archive queue on D: and a normal-folder queue on D: run in parallel). Prefs, arguments and script add-ins can override.
cmd: `Copy QUEUE=MyQueue` (named queue, shown in the progress title; bind to a held key to force queuing)

## fileops.unattended | Unattended copy and "When file exists"
src: 0086 | area: fileops
ui: Unattended checkbox at the bottom of the copy progress dialog
user-words: copy overnight, no prompts, skip errors, always replace
what: Unattended mode shows no error or confirmation dialogs. Errors are logged on an Errors tab and can be reviewed/retried at the end. `Export error list` saves them as text or CSV. Start unattended with `Copy UNATTENDED`; set the collision default with `Copy WHENEXISTS`.
options:
- `When file exists`: `Replace`, `Keep newer`, `Rename existing`, `Skip`, `Treat as an error` (logged for later retry), `Resume` (FTP, if existing file is smaller and server supports it), `Merge folders without asking` (overrides `Ask for confirmation before merging existing folders` on Copying Files / Confirmation), `Skip identical` (same size and date)
cmd: `Copy UNATTENDED`, `Copy WHENEXISTS`

## fileops.jobsbar | Jobs Bar
src: 0087 | area: fileops
ui: Preferences / File Operations / Progress Indicators; command `Set JOBSBAR`
user-words: multiple copy progress windows, minimize progress, job list
what: Small bar at the bottom of the Lister with a button per running job (action, source, destination, progress bar coloured by state running/paused/error). Click a button to show/hide its progress dialog. Right-click: pause, resume, abort.
options:
- `Display the jobs bar automatically when starting a new job`
- `Minimize progress indicators` (can be limited to when the Jobs Bar is visible)
- `Prevent progress indicators from showing on the taskbar` (hides them from taskbar and Alt+Tab, they return if no Jobs Bar is visible)
notes: A subtle animation marks new minimized jobs (can be turned off).
cmd: `Set JOBSBAR`

## fileops.replacedialog | Confirm File Replace dialog
src: 0088 | area: fileops
ui: Preferences / File Operations / Copying Files / Confirmation
user-words: file already exists, overwrite prompt, rename new, keep newer, skip identical
what: Shows Name, Location, Size, Date, Desc of existing and incoming file (differences in bold, icons mark larger/newer) with thumbnails (hover = bigger preview, right-click = file menu customisable in File Types, double-click opens).
options:
- Proceed: `Replace` (Shift+click = Replace All), `Rename New` (Ctrl+click) / `Rename New (All)` (Ctrl+Shift), `Rename Old` (Alt+Ctrl) / `Rename Old (All)` (Alt+Shift), `Keep Newer` / `Keep Newer (All)` (ties skip the incoming file). Editing the name field turns Replace into `Rename`
- Abandon: `Skip` (Shift+click = Skip All), `Skip Identical` (Ctrl+click; compares size and date only, not contents), `Abort`
- FTP: `Resume` / `Resume All` only when the existing file is smaller
notes: Rename presets can be added to the Replace dropdown on the Confirmation page. The name field supports the inline rename control keys.

## fileops.updated | Copying updated files (Update commands)
src: 0089 | area: fileops
ui: Copy Files ▾ > Update All / Update Existing
user-words: copy only newer, one way sync, copy new files only
what: One-way sync via the source/destination concept. `Update All` copies files that are missing in the destination, or exist but differ in size or are older. `Update Existing` copies only files that exist and differ in size or are older. Tune with `Copy UPDATETOLERANCE` (how different a timestamp counts as older) and `Copy UPDATEEXISTING` (ignore size or date in the comparison). Synchronize is the two-way, reviewable alternative.
cmd: `Copy UPDATETOLERANCE`, `Copy UPDATEEXISTING`
see: sync.tool

## sync.tool | Synchronize tool
src: 0090 | area: fileops
ui: Tools > Synchronize (utility panel)
user-words: sync folders, mirror folders, two way sync, backup folder, compare folders
what: Two stages: Compare (marks actions with glyph checkboxes), then Synchronize. Locations can be any Opus location (drives, archives, shares, FTP). Changing options after Compare disables Synchronize until you Compare again.
options:
- `Copy files in both directions`: newer file overwrites older (date only)
- `Copy files from left to right`: one-way, comparison method: `Byte comparison` (slow), `Date (different)`, `Date (different) or size`, `Date (newer)`, `Date (newer) or size`, `Filename only` (only missing files), `Size (different)`, `Size (larger)`, `Size (smaller)` (manual wording; the larger/smaller entries read like "different" in the source)
- one-way only: `Delete files from destination that aren't in the source`, `Delete before copy`
- both: `Filter` (pattern, saved filter, Define), `Hide unaffected files` (also context menu `Hide unaffected items` / `Reveal hidden items`), `Ignore one hour time differences` (DST on FAT/some FTP), `Ignore seconds`, `Only compare existing files`
- location: Source/Destination or Left/Right fields with link button (follows Lister), Browse, `Swap` button
- `Synchronize left-to-right`: takes source from the left/top display regardless of which is active (prevents accidental wrong direction)
- `Synchronize sub-folder contents`, `Synchronize everything (including hidden files)`, `Exclude` (paths, names, wildcards, drop-down: hidden/system folders)
notes: Compare opens dual display if needed, puts both displays in a special checkbox mode (and Flat View Grouped if sub-folders are included), shows a summary dialog. Click a checkbox to cycle an item's action (copy, delete, none). File-vs-folder name clashes are skipped and listed under Conflicts. Progress runs copy source to destination, destination to source, then delete from destination.
see: nav.pairedfolders

## fileops.delete | Deleting files
src: 0091 | area: fileops
ui: Delete button ▾ on the Operations toolbar; Preferences / File Operations / Deleting Files (`Prefs PAGE=deleting`)
user-words: delete to recycle bin, permanent delete, empty recycle bin, ask before delete
what: Del key, context menu, toolbar. Uses the Recycle Bin by default when possible (not on network/removable drives, archives, FTP). Shift+Del / Shift+click bypasses it.
options:
- Delete ▾: `Delete`, `Secure Wipe`, `Remove From Collection`, `Go to Recycle Bin`, `Empty Recycle Bin`, `Secure Empty Recycle Bin`, `Enable Recycle Bin` (toggle default), `Enable Recycle Confirmation`, `Enable Delete Filter` (recursive filter), `Delete Settings`
- Deleting Files page: confirmation (even per file), recycle bin use, deleting read-only files without special prompt, `Use Secure Wipe`, number of passes
cmd: `Prefs PAGE=deleting`

## fileops.securedelete | Secure delete
src: 0092 | area: fileops
ui: Delete ▾ > Secure Wipe; Preferences / File Operations / Deleting Files
user-words: shred files, wipe, overwrite deleted
what: Overwrites file data before deleting (algorithms like those NSA-style recommendations), 1 to 31 passes (3 recommended). Slow. `Use Secure Wipe` option applies it whenever the Recycle Bin is not used (for example Shift+Del). Recycle Bin deletes are not wiped.

## rename.overview | Ways to rename
src: 0092 | area: rename
ui: F2; Rename button; Preferences / File Operations / Renaming Files
user-words: rename files, batch rename, rename many
what: Inline Rename (F2, slow double-click, or context menu Rename, one file), Simple Wildcard Rename (not reachable by default), Advanced Rename (the Rename button: wildcards, regex, find/replace, macros, numbering, metadata, scripts).
see: rename.inline, rename.simple, rename.advanced

## rename.inline | Inline rename
src: 0093 | area: rename
ui: Preferences / File Operations / Renaming Files (`Default selection mode`, `Retain cursor position when moving to next/previous file`); Renaming Files / Control Keys
user-words: rename keyboard shortcuts, rename extension, change case while renaming
what: Enter applies, Esc cancels. Only the stem is selected initially (option `Default selection mode`, or `Rename INLINE` raw command to bind separate hotkeys for stem or extension).
notes: Select: Ctrl+A all, Ctrl+N or Ctrl+F stem, Ctrl+E extension, F2 cycles stem, extension, whole. Case: Ctrl+L lower, Ctrl+U upper, Ctrl+W capitalize words, Ctrl+P capitalize first word. Ctrl+. replaces dots and underscores with spaces (dots between digits kept). Down/Tab next file, Up/Shift+Tab previous (applies the change). Ctrl+Up/Down (or Shift+Up/Down) name history. Ctrl+Shift+Up (or Ctrl+') copies the previous file's name, Ctrl+Shift+Down the next (Alt also copies the extension), Ctrl+Shift+Home resets. All keys configurable.
cmd: `Rename INLINE`

## rename.simple | Simple Wildcard Rename
src: 0094, 0098 | area: rename
ui: Rename button ▾ > Use Simple Rename; command `Rename SIMPLE`
user-words: rename with star, img to image
what: `*` marks parts to keep, case-insensitive match (`Img_*.jpg` to `IMG*.jpg`). Selected files and folders only (not files inside sub-folders). A literal new name renames each selected file in turn. Same system as Copy As and Standard Wildcard Rename. Cannot reorder preserved parts (use regex).
cmd: `Rename SIMPLE`

## rename.advanced | Advanced Rename dialog
src: 0095 | area: rename
ui: Rename button
user-words: batch rename, rename presets, rename preview, paste names from clipboard
what: Sections: presets list (left), mode + Old/New name (top), actions (capitalization, macro, numbering, script), options, preview list (checkbox per file to exclude, sub-folder files cannot be excluded).
options:
- `Use preview list to build macros`: edit one preview name and the edit is recorded as a macro for all. Off = edit individual new names (shown red, locked until rename or cleared)
- `Clipboard` menu: copy original names, `Paste new names from clipboard`, `Prefix`, `Append` (one clipboard line goes to every name, multiple lines go one per name and loop, blank lines skip), `Reset`
- `OK` performs and closes, `Apply` performs and keeps the dialog (then `Undo` appears)
notes: Macro builder cannot be combined with Clipboard Paste, Prefix and Append.
see: rename.presets, rename.modes, rename.actions

## rename.presets | Rename presets
src: 0096 | area: rename
ui: Advanced Rename dialog / presets list
user-words: save rename, reuse rename settings, number files preset
what: Double-click or Load. Star marks favorites (top of list). `Last Rename` reloads the previous settings. Title bar shows the loaded preset and asks to save changes.
options:
- `Manage` menu (also right-click): `Save`, `Save As`, `Assign To Group` (groups; unassigned = Unspecified), `Export Current Settings`, `Create Function From Preset` (copies a command to the clipboard to put on a button/hotkey and run it without the dialog), `Export Preset`, `Import Preset File`, `Reset Default Presets` (adds missing defaults without replacing yours)
notes: Preset files `.orp` in `Rename Presets`. `Number Files` ships as an example.

## rename.modes | Rename modes
src: 0097, 0099, 0100, 0101 | area: rename
ui: Advanced Rename / `Mode` dropdown
user-words: regex rename, find and replace names, rename pattern
what: Modes: `Standard Wildcard Rename`, `Find And Replace` (plain text, stem only unless `Ignore extension` is off), `Regular Expressions` (whole-name match, refer to captures as `\1`, example `(.*)_(.*)` to `\1\2`), `Regular Expressions + Find and Replace` (match a substring, replace only that, example `- \d+( - )*`).
options:
- `Old name` / `New name` (Find / Replace in Find and Replace mode), `Case sensitive`, `Ignore extension` (keep on normally), `Reset`
notes: Regex repeat extension: append `#` to the Old name pattern to repeat the replace until the name stops changing (removes all underscores). Default regex flavour: ECMAScript (TR1). Standard wildcard keeps preserved parts in order only. Wildcard `img_*.*` to `IMG*.*` keeps extension case.
see: patterns.regex

## rename.actions | Rename actions (capitalization, macro, numbering, script)
src: 0102, 0103 | area: rename
ui: Advanced Rename / Actions section
user-words: change case of names, number files, add number to filenames
what: Applied after the pattern step, top to bottom. `Capitalization`: all lower-case, ALL UPPER-CASE, Capitalize All Words, Capitalize first word, lower-case extension, upper-case extension. `Macro` (recorded by the macro builder). `Numbering from`: start number, digits (zero padding, for example 0100 = 4 digits), increment, position. `Edit Script` opens the rename script editor (VBScript, JScript...).
notes: `[#]` in New name marks where the number goes; without it the number is added at the end of the name before the extension.

## rename.macros | Rename macro builder
src: 0104 | area: rename
ui: Advanced Rename / preview list with `Use preview list to build macros`; font on Preferences / Colors and Fonts / Fonts (fixed width)
user-words: swap date order in names, remove suffix from many files, edit one name apply to all
what: Click a New Name in the preview (or F2) and edit it like inline rename; the edit is recorded as a macro applied to every selected file. Pencil icon = anchor end (left or right); change by double-clicking it, pressing the cursor key toward the other end, or double-pressing Home/End. Range selections show in all rows; double Shift+End selects to the end of all names.
notes: Ctrl+C, Ctrl+X, Ctrl+V are recorded per file. Ctrl+Shift+V pastes clipboard text literally. Rows with wrong results can be unchecked. Language reference: reference section of the manual.
see: rename.advanced
