# FTP, standalone viewer, image/file tools, floating toolbars, utilities

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- ftp.connect: Connecting to FTP sites
- ftp.addressbook: FTP Address Book
- ftp.pages: FTP site pages (Site, Network, Display, Index, Sounds, Misc, Speed, Special, Proxy)
- ftp.log: FTP Log
- viewer.standalone: Standalone viewer
- viewer.keys: Viewer keys, mouse, toolbar and commands
- viewer.marking: Image marking
- viewer.linked: Lister-linked viewers
- viewer.quickshow: QuickShow
- tools.sounds: Playing sounds
- tools.imageconvert: Image conversion
- tools.printfolder: Print / Export Folder Listing
- tools.duplicates: Duplicate File Finder
- tools.splitjoin: Split and Join files
- links.types: Shortcuts, hard links, junctions, soft links
- toolbars.floating: Floating toolbars
- hotkeys.systemwide: Hotkeys: local vs system-wide
- tools.usbexport: Exporting to USB (portable)
- tools.everything: Integration with Everything (voidtools)
- tools.eraseemptyspace: Erase Empty Space
- tools.filetypesummary: File Type Summary
- tools.updatechecker: Update checker
- tools.taskmanager: Task Manager
- tools.cli: CLI / Ad-Hoc Script Editor
- tools.crashlogs: Crash logs
<!-- contents:end -->

## ftp.connect | Connecting to FTP sites
src: 0131, 0142 | area: ftp
ui: FTP menu (Menu toolbar): Edit Address Book, FTP Connect, Site Properties, Display FTP Logs; right-click the FTP item in the tree
user-words: connect ftp, ftp address book, sftp, ftps, ftp login
what: Built-in client; sites act as folders (copy, rename, delete, create folders, view images). Three ways: type a URL in the location field (`ftp://ftp.microsoft.com`, with login `ftp://user:pass@host/`), `FTP Connect` dialog, address book entries (also shown in the tree and Jump List).
options:
- FTP Connect dialog: `FTP host` (dropdown = address book, fills the fields), recall button (last connection), `Connection` type, `Port`, `Use PASV (passive) mode` (tri-state: third state = take from site/defaults), `Anonymous login`, `User name`, `Password`, `Remote dir`
- Connection types: `Standard Connection`, `Secure TLS Explicit` (FTPS), `Secure SSL Implicit` (FTPS), `Secure SFTP via SSH`. Secure types need the optional Advanced FTP purchase. Default ports 21 (standard and explicit), 990 (implicit), 22 (SFTP)
- paths: `ftp://<user>:<password>@<host>:<port>//<folder>`; address book shorthand `@Work\BigCompany` (`Copy TO @Work\BigCompany`) always uses the entry's current settings
- Site Properties (FTP menu, or right-click background/status bar when viewing a site): tabs match the address book pages. `Apply changes to this session only` or `Save changes permanently for this FTP site` (creates a new entry if none)
cmd: `Copy TO "ftp://jon:apple@bigcompany.com"`, `Copy TO @Work\BigCompany`
see: ftp.addressbook, ftp.log

## ftp.addressbook | FTP Address Book
src: 0131, 0132, 0142 | area: ftp
ui: FTP menu > Edit Address Book
user-words: save ftp sites, export ftp sites, ftp passwords, default ftp settings
what: Tree of sites and folders. Toolbar: New FTP Site, Duplicate, New Folder, Rename, Delete, Connect. File menu: `Import` (`Import to a new folder`, `Merge with existing entries` (clashes overwritten), `Replace all existing entries`), `Export` (`Export all entries`, `Export selected item only`, `Remove FTP passwords from exported file`), `Create Shortcut` (desktop). Edit menu has copy/cut/paste between sites. Right-click gives the same commands.
notes: `Default Settings` entry holds defaults for all sites; each page section can `Use defaults` or override per site. Its `Site` page becomes `Global`.
options:
- Global page: `Anonymous password`, `Global password` (reveals stored site passwords, default value is `password`, change it), `Save password for newly added sites`, `Cache site passwords` (and duration), `Show site passwords in plain text` (needs the global password), `Remember Quick Connect passwords`
- New site dialog: `Site name`, `Comment`, `Connection`, `Host address`, `Port`, `Anonymous login`, `User name`, `Ask for password` (tri-state, third = global `Always ask for password for login`), `Password`, `Initial directory`, `Adjust directory and file dates for site time zone` (+ time zone, `Adjust for daylight saving changes`; first entry `Automatic (Serv-U)`)
see: ftp.pages

## ftp.pages | FTP site pages (Site, Network, Display, Index, Sounds, Misc, Speed, Special, Proxy)
src: 0133, 0134, 0135, 0136, 0137, 0138, 0139, 0140, 0141, 0142 | area: ftp
ui: FTP Address Book > site > tabs
user-words: ftp passive mode, ftp timeout, ftp log, ftp speed limit, ftp proxy, ftp private key
options:
- Site: `Site name`, `Comment`, `Connection`, `Host address`, `Port`, `Anonymous login`, `User name`, `Authentication`: `Ask for password`, `Use stored password`, `Use private key file` (SFTP; passphrase prompted, can be saved); `Password`, `Private key file`, `Initial directory` (empty = server default; `Keep last directory` updates it), time zone adjust. Admin can block saving passwords: HKLM `Software\GPSoftware\Directory Opus` `PreventSaveFTPCredentials` DWORD 1
- Network (sections Connection, Reconnect, Site-to-Site): `Allow special directory names beginning with space`, `Keep last directory`, `Rescan directory after change`, `Use PASV (passive) mode` (needed behind firewall/NAT), `Timeout`; `Retry count` and `Delay`, `Automatically reconnect if connection lost`, `Keep link alive` and `Delay` (many sites discourage); `Attempt for uploads`, `Attempt for downloads` (site-to-site, server dependent)
- Display (Display, Log): `Display progress windows`, `Hide files beginning with '.'`, `Show directory messages`, `Show startup messages`, `Treat unknown links as` (automatic/file/folder), `Logical parent directory` (off = FTP UP command, on = strip last path part and CD); `Enable log`, `Enable debug`, `Display log automatically upon connection`
- Index: `Enable index file downloading` (INDEX, FILES.BBS, 00_INDEX.txt...; descriptions shown in the Description column), `Download automatically if less than` (KB), `If index not downloaded automatically` (ignore or ask). Default Settings only: `Match` list, `Ignore` list, `File start position`
- Sounds: events `Login success`, `Login failure`, `Copy success`, `Copy failure`, `Error`, `Lose connection`, `Timeout` with optional Activation Time (minimum seconds). Sound files are set on Miscellaneous / Sounds
- Misc: `Use MLST`, `Use custom LIST command` (for example `LIST -alF`), `Use MDTM` (tri-state; timestamp sent as Automatic/UTC/local), `Use FEAT`, `Use RESUME`, `Use UTF8` (all tri-state), `Transfer Mode`: ASCII, Binary, Automatic (by extension, list on the Default Settings Misc page)
- Speed: `Limit Upload Speed`, `Limit Download Speed`: `Maximum speed` KB/s, `Scheduled` From / To times
- Special: `Compression` (None, Zlib for LIST only, Zlib for all transfers, level 1 to 9; little use on already compressed files), `SSL Data Channel - Use Clear Data` (encrypt only the control connection, faster), VMS settings (`Display all file versions`, `Escape characters`, `Show file versions as description`), `Limit data ports`
- Proxy: `Connect via FTP Proxy`, `Proxy type` (standard variants, `Custom Template`, SOCKS4, SOCKS5), `Proxy address`, `Port` (21 FTP, 1080 SOCKS), `Delimiter` (`@`), `Proxy user name`, `Proxy password`, `SOCKS 5 Authentication`; custom template codes `%h` host, `%u` user, `%p` password, `%x` proxy user, `%y` proxy password (separate USER and PASS templates)
notes: The Transfer page in the manual is unfinished.

## ftp.log | FTP Log
src: 0142 | area: ftp
ui: FTP menu > Display FTP Logs; Help / Logs; Fonts page (log font); File Operations / Logging (max size)
user-words: ftp debug, see ftp commands
what: Per-site log in the Utility Panel (enable on the site's Display page, or on Default Settings for all). Buttons: Save, Copy, Clear (dropdown clears all logs), `Log` dropdown selects site or `All Activity` (unified), Float button detaches it to another monitor.

## viewer.standalone | Standalone viewer
src: 0143 | area: viewer
ui: Preferences / Viewer (Standalone Viewer, Options, Size And Position, Mouse Buttons, Marked Pictures, Slideshow, QuickShow); File Operations / Double-click on Files (`Use internal picture viewer`)
user-words: image viewer, open pictures in opus, slideshow, d8viewer
what: Floating viewer for images, movies, documents (plugins). Unlike the viewer pane it is independent of a Lister and has basic editing. Open by double-click (with `Use internal picture viewer`), Slideshow button (speed on the Slideshow page), `Show` command (Slideshow ▾ > Show Pictures), `d8viewer.exe` or `dopusrt.exe /show` from outside.
notes: Defaults: auto-size per picture, centred on current monitor, frame around picture, builds the folder's image list when opened by double-click (optional wrap-around), auto-rotate by EXIF. Extra image formats via external tools (Miscellaneous / External Tools).
cmd: `Show`
see: viewer.keys, viewer.marking, viewer.quickshow

## viewer.keys | Viewer keys, mouse, toolbar and commands
src: 0144 | area: viewer
ui: viewer menu: File, Edit (Customize Toolbars), View, Window; Preferences / Viewer / Appearance (toolbar choice); Customize / Context Menus and Keys tabs
user-words: viewer shortcuts, zoom keys, crop image, viewer toolbar, link viewer
what: Default controls: drag = scroll (Ctrl toggles 1:1 vs accelerated), drag window icon onto another app to export the image, Shift+drag selects (Space moves the box, Ctrl+C copies selection or whole image, Ctrl+R crops), F10 info overlay, S slideshow, middle-click or Alt+Enter full screen, wheel or Space/Backspace next/previous, Del deletes file, `=`/`-` or numpad `+`/`-` zoom (Ctrl+wheel), O or numpad `*` 100%, Ctrl+1 to Ctrl+8 zoom presets 25 to 800%, F fit (never enlarges), G grow, L/R rotate, 1/2/3 rotate 90/180/270, 0 reset rotation, H flip horizontal, V flip vertical, Shift+W white background, Shift+B black background.
notes: Menus: File (open, save, print, Image Conversion), Edit (Copy, Move, Cut, Delete, copy image/selection, crop), View (rotate, zoom, gamma, background, alpha off, Full Screen, Show Information, `Control Bar` toggle). Ctrl+Tab moves focus between metadata editor field and viewer. Window menu: `Menu Bar` (get the toolbar back), `Keep On Top` (reset by opening Preferences/Customize), `Close All Viewers`.
notes: Toolbar `Image Viewer` is editable (Edit > Customize Toolbars) and a different toolbar can be chosen on Viewer / Appearance. Viewer-only hotkeys on the Keys tab. All viewer functions use `Show VIEWERCMD=...` (for example `Show VIEWERCMD=zoom,+`), valid only from viewer toolbars/menus/hotkeys; other commands (Copy, Rename, external programs) also work. `@if` can test VIEWERCMD state: `@if:Show VIEWERCMD=zoom,reset Show VIEWERCMD=zoom,grow @if:else Show VIEWERCMD=zoom,reset`. Mouse wheel/button behaviour: Viewer / Mouse Buttons. Bottom control bar (same as pane, not editable): Previous, Next, Rotate Left/Right, Zoom In/Out, Original, Fit, Grow, Hex View, Slideshow, Full Screen, Print, Settings.
cmd: `Show VIEWERCMD`

## viewer.marking | Image marking
src: 0145 | area: viewer
ui: Preferences / Viewer / Marked Pictures and Behavior
user-words: pick photos to keep, mark pictures, favourite photos collection
what: `M` or Insert marks/unmarks the current image and adds it to a file collection named after the parent folder. Marked-image pane at the left shows thumbnails (double-click to jump, F2 to rename). Star in the top-left marks the current image.
options:
- keys: `Ctrl+M` show/hide pane, `Ctrl+Left/Right` previous/next marked, `Ctrl+Up/Down` first/last marked, `Ctrl+Space` return to last viewed, `Shift+M` exchange the mark with the previously marked image
- Viewer / Behavior page: collection name with `%F` parent folder name and `%D` date, optional prompt for a name before each session, whether to show the collection in a new tab on closing
notes: With the File Collection option off, marking uses checkbox mode instead.

## viewer.linked | Lister-linked viewers
src: 0146 | area: viewer
ui: right-click the Viewer Pane icon (Menu toolbar, left of the search field); Preferences / Viewer / Standalone Viewer
user-words: viewer on second monitor, preview follows selection
what: A detached preview that shows whichever file is selected in the Lister. Open from the Viewer Pane icon right-click. `Link to Lister` button on the viewer toolbar links an already open viewer. Old toolbars: take the updated buttons from Settings > Customize > Default Toolbars. One-way by default; `Link both ways (file display selection tracks Lister-linked viewer)` makes the Lister follow the viewer. [manual page unfinished]

## viewer.quickshow | QuickShow
src: 0147 | area: viewer
ui: Preferences / Viewer / Standalone Viewer / QuickShow
user-words: quick look, space bar preview, peek at image
what: Minimal viewer without toolbars, as large as possible at original size (bigger images shrink; hold mouse to enlarge). Only Esc and cursor keys work.
options:
- `Trigger QuickShow with the Space key`; `Trigger with the mouse` (hold left button on a file, press and release right button, stays open while left is held); own hotkey for `Show QUICKSHOW` (arguments override page defaults)
- dismisses on key/mouse release depending on settings, or Esc
cmd: `Show QUICKSHOW`

## tools.sounds | Playing sounds
src: 0147 | area: tools
ui: File Operations / Double-click on Files (`Use internal sound player for WAV files`); Customize / Commands (`Play`)
user-words: play wav, audio player
what: Simple player (native .wav, others if a codec exists). Controls Restart, Stop, Play, position slider, `Close Play window when finished`. Not on default toolbars: add `Play` from Customize, or enable the double-click option. Slideshow ▾ > Play Sounds also works.
cmd: `Play`

## tools.imageconvert | Image conversion
src: 0147, 0148 | area: tools
ui: Tools > Convert Images, context menu `Convert Image` (Images file type group), Images toolbar Convert
user-words: convert to jpg, resize images, rotate exif, make thumbnails, batch convert
what: Converts to BMP, GIF, PNG, JPG; rotates (90 steps, EXIF auto); resizes. Options can combine in one pass. `OK` converts the current image then reopens for the next; `All` applies to the whole selection.
options:
- `Convert` (needed if source is not already a writable format), `JPEG Quality` 0 to 100, `Alpha conversion background color`
- `Rotate` 90/180/270, `Use EXIF information` (upright by EXIF, no change if none), `Reset` (leave image, reset EXIF orientation to 0). JPEG rotation is lossless when dimensions are multiples of the block size
- `Resize` presets, ratios or `Custom size`; `Add filename suffix` (for example `IMG_2483-150%.jpg`); `Preserve aspect ratio`
- `Write converted images to destination folder` (off + unchanged name = overwrite original after confirmation)
notes: Automate with `Image` command, examples: `Image ROTATE=270 HERE REPLACE`, `Image ROTATE=90 HERE REPLACE`, `Image ROTATE=EXIF HERE REPLACE`, `Image CONVERT=png HERE`, `Image CONVERT=jpg QUALITY=90 HERE`, `Image CONVERT=jpg WIDTH=256 HEIGHT=256 PRESERVEASPECTRATIO ADDSUFFIX "_thumb"` (saves to the destination), `Image CONVERT=png HEIGHT=1200 PRESERVEASPECTRATIO HERE REPLACE`.
cmd: `Image ROTATE=`, `Image CONVERT=`

## tools.printfolder | Print / Export Folder Listing
src: 0148 | area: tools
ui: Tools > Print / Export Folder Listing
user-words: export file list to csv, print folder contents, directory listing
what: Sections Source, Destination, Format.
options:
- Source: `Folder` (Browse), `Calculate sub-folder sizes` (also required for File count / Sub-folder count columns), `Flat View` (`Mixed`, `Mixed (No Folders)`, `Grouped`), `Use filter`
- Destination: `Printer` (+ Setup), `File` (Text File `.txt`, Comma-Separated List `.csv`, Tab-Separated List), `Clipboard` (same formats)
- Format: `Edit` (folder-format style column dialog), `Current` (copy the format from the launching file display), `Reset`, `Font` (printer only), column widths (drag; used for printer and 'Normal' text/clipboard, rounded to multiples of 8 characters; ignored for CSV/TSV), `Header/Footer` (folder name + date/time; per page on a printer, once for a file)

## tools.duplicates | Duplicate File Finder
src: 0148 | area: tools
ui: Tools > Find Duplicate Files (utility panel)
user-words: find duplicate files, same files, remove duplicates
what: Mode 1 = all duplicates (bottom list empty), mode 2 = duplicates of specific files (add them to the bottom list). `Find in` list: add folder (double-click), Select Folders to Search, Remove Folder, Reset Folder List, Lock Folder (follows the file display).
options:
- `Show results in` (collection, auto-grouped), `Clear previous results`, `Number duplicate groups`, `Search inside archives`, `Search inside subfolders`
- `Comparison method`: `Filename only`, `Filename (no extension)`, `Filename and size`, `Size`, `MD5 checksum` (slowest, most accurate; same size first)
- `MD5 accuracy` slider (1 to 100% of file), `Use MD5 cache` (large NTFS files)
- `Filter`: wildcard (`*.jpg`) or Define Filter (Sub-folder clauses control folders)
- `Find`, then `Select` (choose which to keep and select the rest, then delete)

## tools.splitjoin | Split and Join files
src: 0148 | area: tools
ui: Tools > Split File / Join Files
user-words: split large file, join parts, uuencode
options:
- Split: `To folder` (default destination folder, else source folder), `Chunk size` (preset or custom with KB/MB/GB suffix, no suffix = bytes; `Automatic` = destination free space for removable, else 100 MB), `UUEncode`
- Join: list in join order (auto ordered by name; reorder with drag or Move Up/Move Down), `Add`, `Remove`, `Clear`, `Output File` (default destination folder), `UUDecode`. Can run with no selection and add files manually

## links.types | Shortcuts, hard links, junctions, soft links
src: 0148 | area: fileops
ui: Copy Files ▾ > Create Shortcuts / Create Advanced Links; right-drag > Create Shortcut Here; right-click > Paste Shortcut
user-words: symlink, junction, mklink, shortcut, hard link
what: Shortcuts (.lnk, any drive/share). Hard links (files only, same partition, NTFS). Junctions (folders only, NTFS). Soft links (file or folder, across drives, Vista+, needs admin so a UAC prompt may appear, absolute or relative, NTFS). Advanced links work source to destination like Copy Files.
notes: Windows uses hidden junctions for legacy paths (for example `Documents and Settings` to `C:\Users`); visible in red when `Hide protected operating system files` is off (Folders / Global Filters). Link targets show in the Description column. Most software is not link aware: test on copies, deletes/overwrites may hit the target.
cmd: `Copy MAKELINK=softlink`, `Copy MAKELINK=relsoftlink` (relative, falls back to absolute if not expressible)

## toolbars.floating | Floating toolbars
src: 0148, 0149 | area: toolbars
ui: in Customize mode hover the toolbar for the small icon at its top-right, or right-click empty toolbar space
user-words: launcher toolbar, desktop toolbar, toolbar outside window, auto hide toolbar
what: Toolbars (and menus) can float in their own window and work while Opus runs in the background with no Lister. Use as program launcher, folder shortcuts, layout loader. Multiple copies of one toolbar keep separate settings. Can dock to screen edges.
options:
- menu: `Customize`; `Appearance`: `Frame`, `No Frame`, `Transparent` (checkerboard in Customize mode; Shift+hover shows the frame to move it), `Glass` (Vista/7 only, later = system tint), `Taskbar`, `Rounded Edges`; `Same-sized Buttons`; `Vertical`; `Auto-Hide` (only when docked to a screen edge); `Enable Hotkeys` (floating toolbar hotkeys become system-wide; off by default so they do not override keys in other programs); `Keep on top`; `Lock position`; `New`; `Close`
see: toolbars.concept, hotkeys.systemwide

## hotkeys.systemwide | Hotkeys: local vs system-wide
src: 0149 | area: customize
ui: Customize / Keys (Hotkeys) tab
user-words: global hotkey, shortcut to launch program, win+e remap
what: Hotkey types: button hotkeys (fire in a Lister), favorite hotkeys (read the folder), "pure" hotkeys on the Hotkeys page: `Local` (Lister active, default) or `Global`/system-wide (anywhere, Opus must be running). Prefer multi-key combos. Windows-key combos Explorer reserves can be reassigned (for example Win+E to open an Opus Lister even without Explorer Replacement).
see: customize.keys

## tools.usbexport | Exporting to USB (portable)
src: 0149 | area: tools
ui: Settings > Backup and Restore > Export to USB Flash Drive
user-words: portable opus, run from usb
what: Needs the optional USB export licence (grants an extra simultaneous licence; check in Help / Licence Manager). Self-contained, no registry changes on the host.
options:
- targets: selected drive, `Use this drive as a dongle option` (licence check only, install elsewhere such as a VeraCrypt volume), U3 (.u3p bundle from the U3 entry, 32-bit only), PortableApps (auto layout)
- versions: 32-bit, 64-bit (64-bit Windows only), both (recommended; launcher `DOPUS.EXE` picks)
- elements: Plugins (USB-safe only), Languages (English always), Help files, Current configuration (plus images/sounds under the Opus config folders; elsewhere not copied)
notes: Explorer Replacement normally unavailable. Limited support via launcher INI (`DOPUS.ini` in the device root; PortableApps: `DirectoryOpusPortable.ini` in `App\AppInfo`): `AllowExplorerReplacement` (default false), `RunFromTempFolder` (default true), `AutoLister` (default true). Works less well than the installed version.

## tools.everything | Integration with Everything (voidtools)
src: 0149 | area: tools
ui: Everything options; Preferences / Miscellaneous / Advanced (`everything_autolaunch`, `search_warn_nonindexed`); Folders / Folder Sizes
user-words: everything search, fast folder sizes, es.exe
what: Opus uses Everything for indexed search and fast folder sizes (index does not include file content). Officially supports Everything 1.4 (1.5 alpha works with `alpha_instance=0` in `everything.ini`, restart Everything).
options:
- Everything settings needed: General: `Start Everything on system startup` (must run in background). Indexes: `Index file size` and `Index attributes` (folder sizes); plus `Index date created` and `Index date modified` (searching). Indexes / Exclude: no exclusions (counts would be wrong). Indexes / Folders: add network drives if wanted
- Opus: `everything_autolaunch` starts Everything when first needed; `search_warn_nonindexed` controls the warning for unindexed locations
- search: search field engine menu (Everything below current folder, Global Everything), FAYT keys, or as pre-filter in Find Files
notes: Folder size: Opus starts counting itself, then replaces it with Everything's answer when it arrives (small folders can finish first).

## tools.eraseemptyspace | Erase Empty Space
src: 0149 | area: tools
ui: Customize / Commands / File Operations / `Secure Erase Empty Space` (drag to a toolbar)
user-words: wipe free space
what: Overwrites free space on a drive, existing data untouched. Choose drive and number of passes (one is usually enough), click Erase.
cmd: `Delete ERASEEMPTYSPACE`

## tools.filetypesummary | File Type Summary
src: 0149 | area: tools
ui: status bar file-type section (hover or click)
user-words: what file types in folder, folder breakdown
what: Hover = tooltip chart; click = interactive dialog: `Selected files` / `All files`, `File count` / `File size`, `Extensions` / `Groups`. If the status bar section is missing use the command.
cmd: `FileType SUMMARY`

## tools.updatechecker | Update checker
src: 0149 | area: tools
ui: Help > Check for Program Updates; Preferences / Internet / Updates
user-words: update opus, beta versions, news feed
what: Shows version status, Download/Install/Save buttons, RSS news with `Level` filter: 1 main program updates, 2 plus plugins, 3 plus bugs/security, 4 everything. `More` fetches the full list.
options:
- Updates page: automatic check daily/weekly/monthly, `Check for new Beta releases`, silent check (notify only on new version), automatic download (prompt to install)

## tools.taskmanager | Task Manager
src: 0149 | area: tools
ui: Help > Task Manager
user-words: stop a stuck script, running scripts
what: Groups: `Scripts` (abort individually, disable all scripts temporarily), `Evaluator` (running clauses can loop; abort, disable evaluator temporarily), `Background tasks` (thumbnails, metadata threads; cannot be aborted).
cmd: `Help TASKMANAGER`

## tools.cli | CLI / Ad-Hoc Script Editor
src: 0149 | area: tools
ui: Tools > Opus CLI / Ad-Hoc Script Editor
user-words: run command without button, test script, test evaluator
what: Command line for internal commands (like FAYT command mode). `commandname ?` prints the command template. `Script interpreter` option switches to script mode: language dropdown (type the engine name for third-party languages, or `Evaluator`). F5 or Run executes, output field shows errors and `DOpus.Output` text.
options:
- Abort (Alt+A), New (Alt+N), Load (Alt+L), Save (Alt+S), `Clear` (clear output each run)

## tools.crashlogs | Crash logs
src: 0149 | area: tools
ui: Help > Submit Crash Logs
user-words: opus crashed, minidump, send crash report
what: Crash snapshots are written by the helper process (`Directory Opus Helper Application`) to `%TEMP%\DOpus.Minidumps`. The dialog lists them, add a short description, submit; option to auto-delete after submitting. Manual process snapshots can be requested by support.
cmd: `Help CRASHLOGS`
