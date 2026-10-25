# Preferences: File Operations category

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- prefs.fileops.overview: File Operations category
- prefs.fileops.copying: Copying Files page
- prefs.fileops.attributes: Attributes page (copying)
- prefs.fileops.confirmation: Confirmation page (copying)
- prefs.fileops.copymetadata: Copying Files / Metadata page
- prefs.fileops.security: Security page (copying)
- prefs.fileops.deleting: Deleting Files page
- prefs.fileops.doubleclick: Double-click on Files page
- prefs.fileops.logging: Logging pages
- prefs.fileops.metadata: Metadata page (editing behaviour)
- prefs.fileops.metadataeditor: Metadata Editor page
- prefs.fileops.options: File Operations / Options page
- prefs.fileops.progress: Progress Indicators, Counting Files, Jobs Bar pages
- prefs.fileops.renaming: Renaming Files and Control Keys pages
<!-- contents:end -->

## prefs.fileops.overview | File Operations category
src: 0190 | area: prefs
ui: Preferences / File Operations / (Copying Files, Attributes, Confirmation, Metadata, Security, Deleting Files, Double-click on Files, FTP, Logging, Metadata, Metadata Editor, Music Genres, Options, Progress Indicators, Counting Files, Jobs Bar, Renaming Files, Control Keys)
what: Defaults for file operations. Most can be overridden by command arguments (`Copy`, `Delete`...).
notes: There are two pages named Metadata: one under Copying Files (copy behaviour) and one top-level (editing behaviour).

## prefs.fileops.copying | Copying Files page
src: 0191 | area: prefs
ui: Preferences / File Operations / Copying Files (`Prefs PAGE=copyopts`)
user-words: copy of name template, copy queue settings, ghost files, copy options
options:
- `Automatically select newly copied files`, `Automatically manage file copy queues` (off = manual `Copy QUEUE=`), `Display confirmation when a job is queued` (or `Copy QUEUE=quiet`), `Generate thumbnails for network files in Confirm File Replace dialog`, `Show icon overlays for files being copied`, `Show ghost files for queued copies`
- `'Copy of' template`: default `%1 - Copy %2`; `%1` original name without extension, `%2` count in brackets (hidden for the first copy), `%3` count without brackets, `%%` literal. Result `Document - Copy.txt`, then `Document - Copy (2).txt`. Evaluator naming possible (Generated File Names)
cmd: `Prefs PAGE=copyopts`

## prefs.fileops.attributes | Attributes page (copying)
src: 0192 | area: prefs
ui: Preferences / File Operations / Attributes
user-words: keep timestamps when copying, archive flag, read only from cd
options:
- `Copy file attributes` (override `COPYATTR`), `Mark copied files as archived (clear the A flag)` (`MARKDESTARCHIVE`), `Clear read-only flag when copying from optical media` (`CLEARREADONLY`), `Mark original files as archived after being copied (clear the A flag)` (`MARKSOURCEARCHIVE`)
- `Copy modified timestamp`, `Copy created timestamp` (`COPYFILETIMES`, `COPYDIRTIMES`)
notes: Applies to moves done as copy+delete; same-drive moves are renames and keep everything.

## prefs.fileops.confirmation | Confirmation page (copying)
src: 0193 | area: prefs
ui: Preferences / File Operations / Confirmation
user-words: stop asking overwrite, merge folders prompt, flat view copy behaviour, copy folder into collection
options:
- `Ask for confirmation before overwriting existing files` (`WHENEXISTS`), `Ask for confirmation before overwriting read-only files`, `Ask for confirmation before merging existing folders` (`WHENEXISTS`), `Automatically rename when copying virtual files` (drags from browsers)
- `When copying nested items` (Flat View / expanded folders; `FLATVIEWCOPY`): `Ask how to copy`, `Copy to single level`, `Recreate source folder structure`; `Copy to single level if all items are in the same folder`
- `When copying folders to a collection` (`COPYTOCOLL`): `Ask how to copy`, `Add to collection as a member`, `Add to collection as a sub-collection`
- rename presets shown in the Replace dialog dropdown (separate New and Old entries)

## prefs.fileops.copymetadata | Copying Files / Metadata page
src: 0194 | area: prefs
ui: Preferences / File Operations / Copying Files / Metadata
user-words: ntfs streams lost on copy, mark of the web, sparse files, copy descriptions
options:
- `Copy Alternate Data Streams` (comments, tags, ratings, labels in NTFS ADS; lost on FAT32/exFAT, some network shares, archives, FTP): `Copy to new file`, `Copy to new file, unless slower`, `Remove from new file` (`COPYPROPERTIES`). Speed depends on Advanced option `copy_allow_delegation` (default: Windows API copies all ADS; custom code only if `DELEGATE`)
- `Copy file descriptions` (`COPYDESC`; only worthwhile for descript.ion, for ADS use the option above)
- `Copy sparse files as sparse` (`COPYSPARSE`, forces custom copy code for sparse files)
- `Strip zone information (Mark of The Web)`

## prefs.fileops.security | Security page (copying)
src: 0195 | area: prefs
ui: Preferences / File Operations / Security
user-words: copy permissions, file owner on copy, uac when moving
options:
- `Copy file ownership` (`COPYOWNER`, needs admin, may cause UAC) + `Local drives only`; `Copy security permissions when copying, or moving between drives` (`COPYSECURITY`; off = inherit from destination folder)
- same-drive moves: `Update permissions/encryption to match destination when moving on same drive` (`UPDATESECURITY`), `Update permissions even if it would trigger a UAC prompt`, `Change ownership to match destination`, `Preserve explicit (non-inherited) permissions`

## prefs.fileops.deleting | Deleting Files page
src: 0196 | area: prefs
ui: Preferences / File Operations / Deleting Files (`Prefs PAGE=deleting`)
user-words: stop delete confirmation, recycle bin off, permanent delete, delete read-only
options:
- `Ask for confirmation before commencing delete` (`QUIET`), `Skip confirmation when deleting to Recycle Bin`, `Automatically select next file after deleting`, `Delete to Recycle Bin where possible` (`RECYCLE`, `NORECYCLE`, `SHIFT`)
- when not using the Recycle Bin: `Ask for confirmation for each selected file before deleting`, `Ask for confirmation for each selected folder before deleting` (top-level selections only), `Delete read-only files automatically` (`FORCE`), `Skip confirmation if Shift key is held down`, `Use Secure Wipe` (+ passes; usually use `Delete SECURE` instead)
cmd: `Delete SECURE`, `Prefs PAGE=deleting`

## prefs.fileops.doubleclick | Double-click on Files page
src: 0197, 0198 | area: prefs
ui: Preferences / File Operations / Double-click on Files (+ FTP)
user-words: open images in opus viewer, wav player, open files without extension, edit ftp file
options:
- Images: use the internal viewer for all recognised images or only unregistered types (`Use internal picture viewer`)
- Sounds: `Use internal sound player for WAV files`
- Unknown types: `Open unregistered file types in text viewer if they appear to be plain text` (viewer set on Miscellaneous / External Tools)
- FTP edit loop: `Re-upload modified files to FTP sites`, change detection `Check for changes when process exits` (unreliable if the program hands off to an existing instance), `Monitor file until it changes (once)`, `Monitor file for…` (time), `Monitor indefinitely`; `Ask before uploading`, `Use file checksum to detect modifications`
notes: File Types gives far more control over double-click.

## prefs.fileops.logging | Logging pages
src: 0199, 0200 | area: prefs
ui: Preferences / File Operations / Logging (+ Script/FTP Logs)
user-words: file log size, log what files
options:
- `Log file functions` (max events), `File Function Logging Level`: `Standard` (drag-drop copies/moves and deletes), `Maximum`, `Custom`
- `Maximum size of FTP and script logs` (KB, one log per FTP site plus unified FTP and script/evaluator log); Script logs: header added to each line

## prefs.fileops.metadata | Metadata page (editing behaviour)
src: 0201 | area: prefs
ui: Preferences / File Operations / Metadata
user-words: modified date changes when editing tags, descript.ion fallback, id3v1, ape tags
options:
- `Update file dates when setting metadata inside files` (ID3, EXIF), `Update file dates when setting metadata in NTFS ADS` (labels in the file system, descriptions, ratings, tags), `Warn when setting metadata that won't sync via cloud storage`
- Descriptions: `Save decriptions to internal file metadata if possible`, `Fallback to descript.ion files instead of NTFS comments`, `Hide 'descript.ion' comment files when marked as Hidden`
- MP3: `Write APE tags`, `Write ID3v1 tags` (in addition to ID3v2)

## prefs.fileops.metadataeditor | Metadata Editor page
src: 0202, 0203 | area: prefs
ui: Preferences / File Operations / Metadata Editor (+ Music Genres)
options:
- `Add to multi-value fields by default` (otherwise prefix `+` / `-`), `Apply changes automatically`, `Decimal geocoordinate editing`, `Show popup tag history` (+ `Include read tags as well as written`), `Sort tags alphabetically`
- Music Genres: Unused genres / Listed genres lists (move buttons or double-click, reorder, sort, add custom at the bottom of Unused)
see: metadata.editing

## prefs.fileops.options | File Operations / Options page
src: 0204 | area: prefs
ui: Preferences / File Operations / Options
user-words: files stay selected after copy, shortcut name template, network refresh, undo size
options:
- `Create Folder automatic suggestion popups` (Ctrl+Space otherwise), `Deselect files used in functions`, `Postpone file deselection until end of function`, `Detect external file changes on network drives` (F5 otherwise)
- `Use template when creating shortcuts`: default `%1 - Shortcut %2` (same `%1 %2 %3 %%` codes; `Document - Shortcut.lnk`, then `Document - Shortcut (2).lnk`)
- Undo: `Maximum undo entries`, `Sequential undo`

## prefs.fileops.progress | Progress Indicators, Counting Files, Jobs Bar pages
src: 0205, 0206, 0207 | area: prefs
ui: Preferences / File Operations / (Progress Indicators, Counting Files, Jobs Bar)
user-words: hide copy dialog, jobs bar always visible, speed graph, count files before copy
options:
- Progress: `Delay before indicators appear` (ms), `Hide from taskbar when jobs bar is visible`, `Minimize progress indicators automatically` (+ `Only when the jobs bar is visible`), `Show speed graph in file copy progress indicators`, `Retain speed information from one job to the next`, `Show percent complete in progress indicator titles`, `Switch to Queue tab when new jobs are opened`, `Slide animation when jobs begin`
- Counting: `Count files in folders before copying` (per drive type), `Count files in folders before deleting` (not for Recycle Bin), `Use Everything to count files where possible`, `Count automatically even if automatic counting is otherwise disabled`
- Jobs Bar: `Always display the jobs bar`, `Display the jobs bar automatically when starting a new job`, `Show in all Listers`, `Display arrow animation when a job gets queued`, `Display transfer speed in jobs bar buttons`, `Resize Lister to display the jobs bar`, `Same size buttons on the jobs bar` (or fixed pixels)
see: fileops.jobsbar

## prefs.fileops.renaming | Renaming Files and Control Keys pages
src: 0208, 0209 | area: prefs
ui: Preferences / File Operations / Renaming Files (+ Control Keys)
user-words: inline rename shortcuts, rename into folder, rename multiple selected files same name, custom rename key
options:
- Renaming Files: `Allow rename into other directories` (`New Folder\name` moves into a new folder), `Automatically number files when names clash` (`Manuscript (1).txt`), `Automatic suggestion popups` (Ctrl+Space otherwise), `Retain cursor position when moving to next/previous file`, `Rename all selected files at once` (adds numbers to the second and later), `Show control keys tooltip when holding Ctrl`, `Default selection mode`
- Control Keys: list with Add, Delete, Share, Paste; fields `Name`, `Key`, `Type`, `Show in tooltip`; types: `Select via RegEx Match` (pattern with a capture group over the whole name, example `(Copy \d of ).*`), `Select via RegEx Search` (steps through matches, default Select words preset `[^\s\.]+` on Ctrl+S), `Modify via Rename Preset` (changes the edit text, file renamed on Enter), `Modify via Evaluator Clause` (variables: original name, current value, type, path, selection; return a string and/or change `selstart`/`selend`); Test name / Result fields
see: rename.inline
