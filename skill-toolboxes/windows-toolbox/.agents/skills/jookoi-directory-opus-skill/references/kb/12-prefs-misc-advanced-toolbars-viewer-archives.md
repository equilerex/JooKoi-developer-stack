# Preferences: Miscellaneous (incl. Advanced options), Toolbars, User Interface, Viewer, Archives

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- prefs.misc.overview: Miscellaneous category
- prefs.misc.advanced: Advanced page (how it works)
- adv.behavior: Advanced options: Behavior
- adv.compat: Advanced options: Compatibility
- adv.cosmetic: Advanced options: Cosmetic
- adv.filesystem: Advanced options: Filesystem
- adv.ftpimage: Advanced options: FTP and Image Formats
- adv.display: Advanced options: Information Display
- adv.limits: Advanced options: Limits
- adv.trouble: Advanced options: Troubleshooting
- prefs.misc.exttools: External Tools page
- prefs.misc.privacy: Privacy page
- prefs.misc.shellext: Shell Extensions page
- prefs.misc.sounds: Sounds page
- prefs.misc.windowsintegration: Windows Integration, Jump List, Startup Delay pages
- prefs.toolbars.appearance: Toolbars: Appearance, Floating, Folder Toolbars, Icons
- prefs.toolbars.options: Toolbars Options page
- prefs.toolbars.sets: Toolbar Sets and View Mode Toolbars pages
- prefs.ui: User Interface category: Language, Spacing, Transition Animations
- prefs.viewer.standalone: Viewer: Standalone Viewer, Options, Size And Position pages
- prefs.viewer.mouse: Viewer: Mouse Buttons, Marked Pictures, Slideshow, QuickShow
- prefs.viewer.pane: Viewer: Viewer Pane, Options, Exclusion List, Plugins
- prefs.archives.plugins: Zip and Other Archives: plugins, options, context menu, Zip
<!-- contents:end -->

## prefs.misc.overview | Miscellaneous category
src: 0283 | area: prefs
ui: Preferences / Miscellaneous / (Advanced, External Tools, Privacy, Shell Extensions, Sounds, Windows Integration, Jump List, Windows Startup Delay)

## prefs.misc.advanced | Advanced page (how it works)
src: 0284 | area: prefs
ui: Preferences / Miscellaneous / Advanced
user-words: hidden settings, advanced options, esoteric setting, reset advanced option
what: List of named options (Boolean, number, string, dropdown) in categories Behavior, Compatibility, Cosmetic, Filesystem, FTP, Image Formats, Information Display, Limits, Troubleshooting. Double-click the value or F2 to edit. Changed options show in bold. Description at the bottom, `Reset` button, search field (name or description), `Hide unchanged settings`. Asterisk or "(global)" = affects all users of the machine.
notes: Option names below are exact. Find one quickly: `dopus.ps1 prefs -Query <name>` or grep `adv.` entries here.
see: adv.behavior, adv.compat, adv.cosmetic, adv.filesystem, adv.ftpimage, adv.display, adv.limits, adv.trouble

## adv.behavior | Advanced options: Behavior
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Category Behavior
user-words: advanced behavior setting
options:
- `autoselect_suggestions` first suggestion auto-selected in function editor
- `clipboard_datestamps` datestamp prefix on pasted clipboard file names; `clipboard_text_encoding` text encoding for pasted text
- `compress_collections` compress File Collections; `config_backup_name` default backup name template (`{D#yyyy-MM-dd}`, `UTC#` prefix, env vars)
- `dblclk_distance` double-click pixel tolerance; `drag_distance` pixels to start a drag (0 disables drag and drop)
- `description_quick_flush` flush descript.ion immediately; `display_release_history` show release history after an upgrade
- `everything_autolaunch` full command line to start Everything when a search needs it (not for folder sizes)
- `find_unique_collections` separate result collections for parallel Finds
- `flatview_folder_filters` default state of Filter Bar option `Filter folders in Flat view`
- `go_up_always_back` make `Go UP` behave like `Go UP BACK`; `go_usequalkeys_eval` evaluator override for `Go USEQUALKEYS`
- `illegal_namechar_replace` replace illegal characters while renaming (for example `<` to `(`)
- `image_locate_services` URL templates (`%lat%`, `%lon%`) for `Image LOCATE`; `layout_string` desktop layout shortcut name containing `%1`
- `manual_sort_names` extra named manual sort orders (one per line)
- `pinyin_support`, `powermode_singledrag` (drag only the clicked file), `powershell_exe` (default PowerShell executable, for example PowerShell 7)
- `prefs_prebuild_search_index`, `rename_default_focus` (Old or New name field), `save_button_editor_pos` (remember Command Editor position)
- `searchfield_autostart` delay before search field starts searching (0 = FAYT value), `scroll_lock` (cursor keys scroll without moving focus), `search_warn_nonindexed` (Windows Search banner for unindexed folders)
- `setwallpaper_file` target for `Properties SETWALLPAPER` (.bmp or .jpg)
- `single_click_rename`, `slow_dblclk_rename` (False disables slow double-click rename, F2 still works)
- `status_metadata_trigger` Never / Always / Always, except Flat View and Collections (status bar may trigger media duration calculation)
- `styles_update_previous` (`Prefs STYLE=^prev` baseline), `tab_click_nofocus` (clicking a destination tab leaves source/destination unchanged), `utility_panel_autoshrink`, `wheel_acceleration`, `wordbreak_char_names`, `wordbreak_char_paths`, `wsl_distribution`

## adv.compat | Advanced options: Compatibility
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Category Compatibility
options:
- `convert_descriptions`, `def_func_cd_sourcedir` (programs from buttons start in the source folder instead of `C:\Windows\System32`), `direct2d` (Normal, Force CPU rendering, Disable; affects progress speed graph)
- `dlldir_security` (default on: no DLL loading from the current directory; turn off only for broken shell extensions; not changeable on USB installs)
- `dragdrop_async`, `flush_com_libraries` (False may help crashing shell extensions), `function_default_async` (all functions async by default; normally single-command = async, multi-command = sync)
- `global_explorer_replacement` (global), `jscript_defver` (per script `//!JSCRIPTVER=x`), `mp3_custom_comments` (extra COMM tag descriptions, one per line, for example `Songs-DB_Custom1`)
- `no_async_icons` (extensions needing synchronous icons; `.msg;.oft;.xnk` always), `patch_edit_control_dpi`, `patch_text_apis` (consistent kerning; turn off if text layout glitches)
- `regex_style` (default TR1 ECMAScript; revert to old style for legacy rename presets), `zip_large_file_support` (create Zip64; reads always work)

## adv.cosmetic | Advanced options: Cosmetic
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Category Cosmetic
options:
- icons: `collection_icon_default`, `collection_icon_find`, `collection_icon_flickr`, `collection_icon_marked`, `collections_icon` (path to .ico or `/system/imageres.dll,101`), `context_menu_icon_set` (icon set `name` attribute, not `display_name`), `custom_network_folder_icons` (can freeze with dead network tabs), `thumb_48x48_icons`
- look: `glass_status_bar`, `gloss_and_gradients` (Automatic = flat on Windows 8+), `grid_lines_first_last` (First/Last/Both), `no_contextmenu_fix` (Office 2003 style menus), `progress_smoothing`, `resize_grips`, `window_corners` (Windows 11: Automatic, square, two round sizes)

## adv.filesystem | Advanced options: Filesystem
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Category Filesystem
options:
- copy engine: `copy_allow_delegation` (default True: Windows copies file-to-file; custom code is used for archives, FTP, sparse, split/join; override with `Copy DELEGATE`), `copy_buffer_size` (custom code buffer, KB default; `Copy BUFSIZE`), `copy_nonbufferio_threshold` (custom code, MB default, 0 disables, 1 MB suggested if enabled; `Copy NONBUFIO`). With delegation on, buffer and threshold affect only special cases
- `dos_automap_unc_paths`, `move_netshare_semantics` (PGP Netshare), `network_errors` (global; error codes meaning authentication failure, for example `50;1003;1245`), `no_copy_dir_dates`, `remember_net_paths` (remember network paths in file dialogs), `size_on_disk_thorough` (accurate Size on Disk for compact.exe `/EXE:LZX` modes, very slow)

## adv.ftpimage | Advanced options: FTP and Image Formats
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Categories FTP, Image Formats
options:
- FTP: `ftp_copy_buffer_size`, `ftp_dblclk_cache_time` (minutes, default 0), `ftp_do_not_cache` (always refresh listings), `ftp_no_case_sensitive`, `ftp_no_pasv_change`, `ftp_ssl_verbose`
- Images: `amiga_icon_borders`, `amiga_icon_palette`, `clipboard_image_paste` (JPG, PNG, BMP, GIF; `Clipboard PASTE AS=ask` prompts), `clipboard_image_paste_dpi`, `clipboard_image_paste_quality` (JPEG 1 to 100, PNG 1 to 6, 0 = default), `psd_image_preference` (thumbnail vs preview image for PSD; needs "maximize compatibility" in Photoshop), `tiff_assume_alpha`, `tiff_max_doc_metadata` (MB), `use_color_management` (JPEG/PNG with ICC profile), `viewer_disable_internal` (for example `tiff` or `JPG,PNG` to hand a type to a plugin)

## adv.display | Advanced options: Information Display
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Category Information Display
options:
- dates/sizes: `custom_date_format`, `custom_date_format_long`, `custom_time_format` (D#/T# codes), `file_size_decimals`, `file_size_units` (binary with KB names, decimal, or KiB), `image_res_units`, `image_size_units`
- folder formats: `deffmt_cloud_availability`, `deffmt_cloud_status` (stop columns being added to the Cloud Storage format when replacing defaults)
- misc: `desc_show_info` (what the Description column shows: metadata summary, user description, link target), `display_folder_extensions`, `graphs_separate_files_dirs`, `group_column_maxwidth`, `multipart_extensions` (for example `.tar.gz`, one per line), `name_group_high_pri_chars` (characters sorted into a top group when grouping by name), `show_sharing_overlays`

## adv.limits | Advanced options: Limits
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Category Limits
options:
- `context_menu_max_files` (confirm above N files, default 1000, 0 = never), `everything_max_results`, `hotkey_sequence_time` (ms between multi-key hotkey presses), `long_operation_notify_time`, `max_folder_thumb_time` (ms), `max_md5_file_size` (KB; 0 = always hash, 1 = never auto-hash; `GetSizes HASH` manual), `max_thumbnail_mem_size` (MB per display, 0 = no limit), `max_thumbnail_size` (pixels, also limits the Images toolbar slider), `suggestion_popup_lines`, `zip_dblclk_cache_time` (minutes, default 0)

## adv.trouble | Advanced options: Troubleshooting
src: 0284 | area: advanced
ui: Preferences / Miscellaneous / Advanced / Category Troubleshooting
options:
- timing: `clipboard_change_delay` (ms, for Office clipboard trouble), `collection_change_delay` (ms, files vanishing from collections when edited in other programs)
- crashes: `crash_debug_button`, `crash_handler` (False disables custom crash handler; part of it is `dopusrt.exe`), `crash_log_memory` (full-memory dumps, only if support asks), `debug_icon_data`, `long_operation_notify_type` (dialog, log, both, neither)
- environment: `mixed_dpi_mitigations` (Automatic recommended), `mtp_enable` (off = Explorer hosts MTP), `openwith_userchoicelatest` (Windows 11 Open With registry behaviour; Automatic/On/Off)
- file change detection: `no_external_change_notify`, `notify_debug` (+ `notify_debug_exclude`, `notify_debug_include` regexes; slows Opus), `notify_max_time` (global, ms, default 50), `notify_min_items` (global), `notify_poll_paths` (poll listed folders every few seconds; costly, use for broken notifications such as Docker volumes), `shellchange_debug`
- diagnostics: `context_menu_debug`, `script_output_level` (Script Log diagnostic level; `DOpus.Output` always shown), `script_output_throttle` (suppress repeated messages), `sync_debug` (writes a debug file on the desktop), `thumbnail_debug`

## prefs.misc.exttools | External Tools page
src: 0285 | area: prefs
ui: Preferences / Miscellaneous / External Tools
user-words: text viewer for unknown files, script editor, imagemagick formats, extra image formats
options:
- `Text viewer` (used for unknown plain-text files), `Script editor` (external IDE)
- Image Formats via command-line tools (for example ImageMagick): per format extension(s) (semicolon/space separated, or `grp:xxx`), separate command lines for viewing (tokens `%in%`, `%out_png%`, `%out_jpg%`, `%out_gif%`, `%out_bmp%`; prefer fast low compression such as `-quality 01`), optional thumbnail command, and writing (tokens `%in_png%`, `%in_jpg%`, `%in_gif%`, `%in_bmp%`, `%out%`, `%quality%` 1 to 100; presence of `%quality%` enables the quality field). `%alias:...%` inserts a folder alias

## prefs.misc.privacy | Privacy page
src: 0286 | area: prefs
ui: Preferences / Miscellaneous / Privacy
user-words: clear history, stop remembering paths
what: Per function checkboxes for storing MRU names/paths; `Clear history` link on hover; buttons at the bottom disable and clear everything.

## prefs.misc.shellext | Shell Extensions page
src: 0287 | area: prefs
ui: Preferences / Miscellaneous / Shell Extensions
user-words: block context menu item, slow right click menu, remove onedrive menu entry, hide windows items
what: Lists installed shell extensions by category (Context Menu most used; Context Menu UWP = Windows 11 style items). Search, `Block` / unblock (also right-click, Google search), page menu: block manually, import/export block list. Blocking affects only Opus.
options:
- `Access context menus out-of-process if possible` (Opus 13 default, crash isolation)
- `Hide Windows items on file context menus (shift overrides)`: only Opus-defined items show unless Shift is held

## prefs.misc.sounds | Sounds page
src: 0288 | area: prefs
ui: Preferences / Miscellaneous / Sounds
user-words: sound effects, mute opus sounds
what: `Enable Sound Events` master checkbox, per event checkbox, Browse for .wav, play/stop preview. Events: `Close a Lister`, `Close Folder Tab`, `Dock a Floating Toolbar to the screen edge`, `Dock a Lister with another one`, `Find-As-You-Type No Match`, FTP events (copy failure/success, error, login failure/success, lose connection, timeout), `Menu Command`, `Menu Pop-up`, `Navigation Click`, `Open a new Lister`, `Open New Folder Tab`, `Opus Shutdown`, `Opus Startup`, `Read/change folder`, `Script error`, `Switch Folder Tab`, `Undock a Floating Toolbar from the screen edge`, `Undock a Lister`

## prefs.misc.windowsintegration | Windows Integration, Jump List, Startup Delay pages
src: 0289, 0290, 0291 | area: prefs
ui: Preferences / Miscellaneous / (Windows Integration, Jump List, Windows Startup Delay)
user-words: layouts on desktop menu, open in directory opus context menu, ftp handler, taskbar jump list, startup delay
options:
- Windows Integration: `Add File Collections icon to the Desktop`, `Add File Collections list to the Send To menu`, `Add layout and other items to Desktop context menu` (+ `Display layouts in a sub-menu`), `Add 'Open in Directory Opus' item to folder context menus` (only useful with Explorer Replacement off; always added when on), `Make Directory Opus the default handler for FTP sites`
- Jump List (taskbar right-click / Start): `Recent Folders`, `Favorites` (no sub-menus), `Smart Favorites`, `FTP Sites`, `Other Folders` (right-click > Add Folder / Remove Folder), `Layouts`, `Tab Groups` (open in a new Lister), `Commands` (user commands and predefined). Windows limits the list size
- Windows Startup Delay: `Remove Startup Delay` / `Restore Startup Delay` (Windows 8+ delays Startup-folder programs; registry setting affecting all such programs, per machine)

## prefs.toolbars.appearance | Toolbars: Appearance, Floating, Folder Toolbars, Icons
src: 0292, 0293, 0294, 0295, 0296 | area: prefs
ui: Preferences / Toolbars / (Appearance, Floating Toolbars, Folder Toolbars, Icons)
user-words: toolbar spacing, button size, floating toolbar docking, toolbar for folder, icon sets
options:
- Appearance: `Display drop shadow under menus`, `Display toolbar top and bottom borders`, spacing: `Horizontal button spacing`, `Vertical button spacing`, `Vertical spacing for individual buttons on vertical toolbars`, `Vertical spacing for individual items in pop-up menus`; scaling: `Scale Toolbar button images` (standard 22x22 small, 32x32 large, times DPI), `Global Scaling`
- Floating Toolbars: `Allow floating toolbars to be docked with the edge of the screen` (Shift while dragging skips docking), `Save state of floating toolbars automatically on exit` (else use `Save Floating Toolbars` in Customize), `Slide auto-hide floating toolbars when hiding and revealing`, `Reveal delay`, `Hide delay`, `Reveal time`, `Hide time`
- Folder Toolbars: `Add Folder` / `Add Wildcard`, entries for system folders and content types, checkbox per entry, toolbar or toolbar set below the list (toolbar can choose its position)
- Icons: list of icon sets in lookup order (first set containing the icon name wins; reorder to restyle), built-in set has `Icon Style` flat or glass, preview, page menu `Save Icon Set Template`

## prefs.toolbars.options | Toolbars Options page
src: 0297 | area: prefs
ui: Preferences / Toolbars / Options
user-words: lock toolbars, alt click to edit button, toolbar tooltips, menu animation, toolbars in title bar, middle click with ctrl
options:
- `Allow default toolbars to be edited` (off = always show factory defaults), `Alt key activates toolbar keyboard modes`, `Alt + left-click to edit toolbar buttons` (blocks Alt as a qualifier on buttons; alternative `Toolbar CLICKTOEDIT`), `Minimize Customize dialog opened via Alt + left-click or Toolbar CLICKTOEDIT` (`Prefs CUSTOMIZE MINIMIZE`)
- `Animate menus` (+ `Use system setting`), `Display popup help text` (+ `Only with key held down`, `Show shortcut keys in help text`), `Lock Toolbars`, `Move top-row toolbars into the window title bar`, `Simulate middle mouse click with Ctrl + left click`
cmd: `Toolbar CLICKTOEDIT`, `Prefs CUSTOMIZE MINIMIZE`

## prefs.toolbars.sets | Toolbar Sets and View Mode Toolbars pages
src: 0298, 0299 | area: prefs
ui: Preferences / Toolbars / (Sets, View Mode Toolbars) (`Prefs PAGE=toolbarsets`)
user-words: create toolbar set, toolbar per view mode
options:
- Sets: rename, describe, `Behavior` dropdown (`Add toolbars to existing toolbars`, `Replace existing toolbars`, `Toggle existing toolbars`), `New`: name plus drag the crosshair onto the Lister whose toolbars to capture (or toolbar context menu `Toolbar Sets / Save Toolbar Set`)
- View Mode Toolbars: per view mode a toolbar or set that auto-opens (default Images toolbar for Thumbnails); toolbar can choose position; turns off when the mode changes; `In a dual-display Lister, activate toolbar when either file display is in that mode` (off = source only)

## prefs.ui | User Interface category: Language, Spacing, Transition Animations
src: 0300, 0301, 0302, 0303 | area: prefs
ui: Preferences / User Interface / (Language, Spacing, Transition Animations)
user-words: change language, touch mode spacing, disable animations
options:
- Language: choose, `Change Language` (confirm; optionally auto-translate unedited toolbar/menu labels; applied after restart); `Toolbar Glossary` compares labels between languages
- Spacing: schemes `Standard` and `Touch` (add more), per item enable + pixels (DPI scaled), dropdown selects when a scheme auto-activates (mouse or touch input) or none; manual `Set SPACINGSCHEME`
- Transition Animations: `Navigate Into`, `Navigate Up`, `Navigate Back`, `Navigate Forward`, `Navigate Other`, `Prefs Pages` (preview on hover). Unavailable without desktop composition or in mixed-DPI mode
cmd: `Set SPACINGSCHEME`

## prefs.viewer.standalone | Viewer: Standalone Viewer, Options, Size And Position pages
src: 0304, 0305, 0306, 0307 | area: prefs
ui: Preferences / Viewer / (Standalone Viewer, Options, Size And Position)
user-words: viewer opens at wrong size, viewer reuse window, picture list, auto rotate exif in viewer, viewer title
options:
- Standalone Viewer: `Accelerated scrolling while dragging`, `Generate Next/Previous list`, `Add all files to the list (instead of only pictures)`, `Link both ways`, `Reset scroll position for each picture`, `Reset zoom level for each picture` (Fit To Page, Grow To Page, Original Size), `Reuse existing viewer window`, `Wrap-around picture lists`, `Toolbar` (choose a different viewer toolbar)
- Options: `Default gamma correction`, `Hide scrollbars`, `Show status icons`, `Show thumbnails in Marked Pictures pane`, `Use EXIF information to auto-rotate pictures` (display only), title bar: `Custom title`, `Display full path`; tokens `%P` path, `%N` name, `%R` drive root, `%E` * if metadata modified, `%I` index, `%O` total, `%W` width, `%H` height, `%D` depth, `%M` dimensions, `%S` size, `%F` folder, `%C` collection if marked, `%L` labels, `%T` original title, `%%`, `%!...%!`
- Size And Position: `Auto-size viewer window` (`To fit every picture`, `To fit the first picture`, `Full screen`), `Auto-size Lister-linked viewer`, `Minimum window width` (View / Save Minimum Width), `Center viewer window`, `Center Lister-linked viewer`

## prefs.viewer.mouse | Viewer: Mouse Buttons, Marked Pictures, Slideshow, QuickShow
src: 0308, 0309, 0310, 0311 | area: prefs
ui: Preferences / Viewer / (Mouse Buttons, Marked Pictures, Slideshow, QuickShow)
user-words: click viewer to go next, mouse wheel in viewer, marked pictures collection name, slideshow speed, quickshow keys
options:
- Mouse Buttons (standalone viewer; separate pane page): per `Left mouse button`, `Left double-click`, `Middle button`: `Select clipboard region`, `Scroll image` (Shift swaps these two), `Expand/scroll image`, `Advance to next image`, `Toggle Full Screen mode`, `Close Viewer`, `Toggle Slideshow`, `Run a command`, `Script event` (`OnViewerEvent`); `Click left/right edges to go to previous/next picture` (edge default 20%); `Mouse wheel`: `Scroll image` (Alt = sideways), `Advance to next image` (+ `Accumulate wheel movements`), `Zoom` (Ctrl+wheel otherwise)
- Marked Pictures: `Check for marked pictures when viewer is opened`, `Display Marked Pictures pane when a picture is marked`, `Save marked images to a file collection` (default `Marked Pictures\%F`, `%D` date; off = checkbox mode in the Lister), `Ask for collection name`, `Open collection when viewer is closed`
- Slideshow: `Automatic slideshow`, `Cross-fade transition`, `Randomize slideshow`, `Slideshow speed` (seconds, fractions allowed)
- QuickShow: `Trigger QuickShow with the Space key`, `Dismiss by pressing the trigger key again`, `Hold and release trigger key to dismiss`, `Trigger with the mouse`, `Frameless window`, `Link QuickShow window to the Lister`, `Add all files to next/previous list (instead of only pictures)`, `Maximum size` (% of screen)

## prefs.viewer.pane | Viewer: Viewer Pane, Options, Exclusion List, Plugins
src: 0312, 0313, 0314, 0315 | area: prefs
ui: Preferences / Viewer / (Viewer Pane, Viewer Pane Options, Viewer Pane Exclusion List, Viewer Plugins)
user-words: preview pane settings, preview not showing pdf, disable preview for folder, viewer plugin order
options:
- Viewer Pane: `Accelerated scrolling while dragging`, `Allow download of files from cloud storage` (off by default), `Automatically refresh image when file changes`, `Automatically select next file when viewed image is deleted`, `Leave file in viewer until another is selected`, `Show control bar`, `Show lock button`
- Options: `Display shell thumbnails` (fallback via Windows thumbnail providers; not in archives/VFS), `Display shell icons`, `Gamma-correct pictures`, `Hide scrollbars`, `Scroll with left mouse button` (off = Shift to pan, plain drag selects), `Expand and scroll` (+ `Expand and scroll (Left double-click)`), `Use EXIF information to auto-rotate pictures`
- Exclusion List: `Add folder`, `Add Wildcard` (for example `\\*` all network paths, `*.pdf`)
- Viewer Plugins: plugins live in `/home/Viewers`; list order = precedence (top to bottom), checkboxes disable, cog = plugin config, info below; catch-all plugins (for example Text/hex) stay at the bottom

## prefs.archives.plugins | Zip and Other Archives: plugins, options, context menu, Zip
src: 0316, 0317, 0318, 0319, 0320 | area: prefs
ui: Preferences / Zip and Other Archives / (Archive and VFS Plugins, Archive Options, Context Menu, Zip Files)
user-words: disable rar support, archives read only default, run installer from archive, zip context menu, zip file extensions, multi-volume
options:
- Archive and VFS Plugins (`Prefs PAGE=vfsplugins`): plugins in `/home/VFSPlugins`, refresh button, per archive type checkbox, cog for plugin config; formats join the `Archives` file type group. Zip has no entry here
- Archive Options: `Open archives as read-only by default` (Zip and 7z/RAR/TAR via the official plugin), `Packed column units` (bytes, KB, auto); Auto-extract: `Auto-extract archive contents on double-click`, `Prompt before extracting`, `Extensions` (normally `.exe`), `Qualifier key`
- Context Menu: `Enable Archive context menu`; sections `Add to Archive` (initial format for the dialog), `Add to Named Archive` (instant), `Archive and Email`, `Extract` (`Extract from archives`, `Convert to Self-Extracting Archive`); options `Add single folders as sub-folders of new archives` (Named Archive only), `Cascade context menu items`, `Display context menus in Explorer as well as Opus`, `Display icons in context menus`
- Zip Files: `Enable internal Opus Zip support`, `Ask for encryption/compression settings when copying into Zip files`, `Assume UTF8 filenames`, `Use temporary file when copying to Zip files` (safer, slower), `Use temporary folder when copying to Zip files on removable drives`, `Set archive date to date of newest file within it`, `Compression level`, `Enhanced compression level`, `Zip file extensions` (many formats such as .jar are zips), `Hide extensions from folder tree`
cmd: `Prefs PAGE=vfsplugins`
