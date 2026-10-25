# Limits, triage and version gates
How to classify a request, what v13 changed against older advice, what Opus cannot do, and when the answer lies outside Opus.

## User says → concept

| User words | DOpus concept | Where / how |
|---|---|---|
| "how do I make it…", "where is the setting for…" | Preferences or Customize | Map the words to a page first (see the vocabulary reference), then the least powerful mechanism that works |
| "make a button that…", "a hotkey to…", "script that…" | Command, button, user command, script add-in | Build it. Setting > command > button > evaluator > script |
| "can Opus do X?", "is there a way to…" | Possibly a limit | Check the Pitfalls and Known limits sections before inventing a workaround |
| "it crashed", "freezes", "since the update…" | Bug | Collect data (Triage table), never invent a config fix |
| "this menu item isn't Opus", "right-click is slow", "crash when right-clicking" | Shell extension | Preferences / Miscellaneous / Shell Extensions |
| "Win+E opens Explorer", "double-click desktop stopped working", "folder opens in Explorer instead" | Explorer Replacement, DOpusRT | Preferences / Launching Opus / … |
| "Open/Save dialog shows the wrong folder", "make Save As use Opus" | Not replaceable by Opus | Third-party dialog jumper (Companion tools) |
| "which version do I have", "can I install 13.x", "upgrade from 12" | Version and licence | Version gating section |
| "the button from the forum does nothing" | Shared content install | Troubleshooting checklist |

## Triage table

| Request type | Signals in the user's wording | What the agent does |
|---|---|---|
| How-to config | "where", "how do I", "change", "turn off", a screen element name | Translate to the DOpus concept. Give the exact `Preferences / Category / Page` path or Customize step. Prefer a setting over code. |
| Build a command, button or script | "button", "hotkey", "toolbar", "automate", "every time I…" | Produce the command line or button XML. Use the evaluator (`@if:=…`, `{=…=}`) for small logic before a script. Back up first, see `references/config-files.md`. |
| Not possible natively | "can Opus…", "is there any way", a feature from another file manager | Check Known limits below. Say plainly it is not native, say why if known, give the nearest workaround. Do not dress up a hack as a feature. |
| Bug or crash | "crash", "hang", "freezes", "stopped working after update", "error" | Collect: Opus version from Help / About (`Help ABOUT`), Windows version, crash log ID (Help / Submit Crash Logs, `Help CRASHLOGS`, logs in `%TEMP%\DOpus.Minidumps`), exact reproduce steps, whether it happens with context menu extensions blocked. Check if a newer 13.x exists (Help / Check for Program Updates). Point to resource.dopus.com Help & Support. Never invent a config fix for a bug. |
| Third-party or Windows conflict | "only on this PC", "after installing X", menu item the user does not recognise, antivirus warning | Identify the shell extension: Preferences / Miscellaneous / Shell Extensions, search by name, right-click for info, Block it to test. Shift + right-click shows the full menu when Windows items are hidden. Staff often answer "not part of Opus". |
| Shell integration | "Win+E", "double-click desktop", "Open/Save dialog", "opens Explorer instead", "Open in Directory Opus" | See Shell integration section. Open/Save dialogs are outside Opus. |
| Licensing, install, upgrade | "licence", "upgrade", "evaluation", "reinstall", "lost settings", "portable/USB" | Version gating section. Install over the top to keep settings. Pricing and licence disputes go to GPSoftware, not the agent. |

## Shell integration

All under `Preferences / Launching Opus` unless noted.

| Symptom | Owner | Fix or fact |
|---|---|---|
| Folder shortcuts or other apps open Explorer | Explorer Replacement page | Choose "Replace Explorer for all file system folders" (virtual folders like Recycle Bin stay in Explorer) or "Replace Explorer for all folders". "Open a new tab instead of a new window" is on the same page. |
| Win+E opens Explorer | From the Win + E hotkey page | Only shown on Windows 10+ with Explorer Replacement available. Pick "Bring the last active Lister to the front", "Open the Default Lister", a layout, or "Run a command". Before Windows 10 use a System-Wide Hotkey instead. Do not use both methods on Windows 10+. |
| Desktop double-click does nothing | From the Desktop page, DOpusRT.exe | DOpusRT.exe hooks Explorer and runs from startup. Antivirus can block the hook. Click Restart DOpusRT.exe on the page. It also reports if Opus runs elevated, which blocks Explorer messages. Works after restart but fails after reboot → another startup program conflicts, set Delay DOpusRT.exe. Leo: tools that change the desktop or use a desktop double-click gesture can clash. Reinstall over the top is the first staff step. |
| Tray icon double-click | From the Taskbar Icon page | Windows hides the icon in overflow by default. |
| Opus does not start with Windows | Startup page | "Launch Directory Opus automatically on system startup" adds a Startup shortcut. "Always perform startup action" also runs it when Opus opens for a specific folder. |
| Opus quits when the last window closes | Shutdown page | "Shutdown Directory Opus when all functions finish". Staff recommend leaving Opus running for hotkeys and floating toolbars. |
| Open/Save dialog does not use Opus | Nothing in Opus | Opus does not replace the system file open or save dialogs. Use a dialog jumper (Companion tools). |
| Want "Open in Directory Opus" on folder menus | `Preferences / Miscellaneous / Windows Integration` | Option only matters with Explorer Replacement off. With it on, the item is always added. |
| Lister layouts on desktop right-click | `Preferences / Miscellaneous / Windows Integration` | "Add layout and other items to Desktop context menu". |
| Context menus slow, crash, or messy | `Preferences / Miscellaneous / Shell Extensions` | Block single handlers (affects Opus only). "Access context menus out-of-process if possible" isolates crashes. "Hide Windows items on file context menus (shift overrides)". System-wide blocks need ShellExView or AutoRuns. |

Run Opus commands from outside (AutoHotkey, launchers): `dopusrt.exe /cmd Go C:\`, `dopusrt.exe /cmd:active <command>` for the active Lister. Old `/acmd` and `/vcmd` still work (13 adds `/cmd:active`, `/cmd:viewer`). Read current paths and selection from outside: `dopusrt.exe /info <outfile>,paths` or `,listsel` writes XML. DOpusRT lives in `C:\Program Files\GPSoftware\Directory Opus`.

## v13 changes that invalidate older advice

Opus 13 keeps old settings when installed over 12, and edited toolbars are left alone. So a user on 13 can still have 12-era toolbars and see "missing" features. Default Toolbars tab in Customize has a slider that highlights items new in 13.

### Removed (extract 0862)

| Old advice | v13 reality |
|---|---|
| `Set COMPATIBILITYFILES` | Removed. `Go COMPATIBILITYFILES` still toggles to the Compatibility Files folder. |
| `Go ROOTTREE`, `Set TREEROOT`, "change the tree root" | Removed. Use Preferences / Folder Tree / Folder Tree Contents (re-order or hide roots, move This PC to its own group). |
| "Start Desktop at…" tree dropdown | Removed. Same Folder Tree Contents options. |
| `Go LIMITPATH`, "lock a Lister to certain folders" | Removed, no replacement documented. Locked tabs are the nearest thing (agent inference). |
| "Make Preferences / Customize always on top" | Removed. Lister titlebars get buttons to show, OK or Cancel them. |
| Slide-out navigation buttons | Removed. |
| Flickr sync | Removed. |
| Opus Light edition, 32-bit Windows, Vista | Gone. Windows 7 64-bit is the minimum. |
| Advanced `ignore_context_menus` / `allow_context_menus` | Replaced by Preferences / Miscellaneous / Shell Extensions. |
| "Hide file type icon if thumbnail is too small", "Expand My Computer branch" | Removed, no longer needed. |
| Themes carrying sounds and toolbar icons | Themes no longer include them. |

### Changed defaults

| Old advice assumes | v13 default | Restore old behavior |
|---|---|---|
| Copy/Move sends files to another single-display window | Off. Source/destination only applies inside a dual-display Lister. | `Preferences / File Displays / Options / Single display Listers have source/destination modes`. Status bar `{ls}` outputs nothing without it. |
| Display changes are forgotten unless saved as a folder format | Automatic Formats remember changes per folder | `Preferences / Folders / Folder Formats / Automatic Formats` |
| Folder background colors, folder sizes, labels, folder toolbars live in Folder Formats | Split out to `Folders / Folder Images`, `Folders / Folder Sizes`, `Folder Tabs / Edge Colors`, `Labels / Label Assignments / In Specific Folders`, `Toolbars / Folder Toolbars` | Converted automatically |
| Copy uses Opus's own engine | Copies via the Windows Shell API where possible (server-side copy offload). Falls back for archives and FTP. | n/a |
| Status bar padlock toggles the format lock | Passive info icon. `Set FORMATLOCK` now acts on the current display only, `Set FORMATLOCK=toggle,all` for both sides. | |
| Status bar triggers video duration scans | Only shows durations if a column already calculated them | Advanced `[Behavior] status_metadata_trigger` |
| Search results reload when a tab's initial folder | Not loaded by default | `Preferences / Folders / Automatic Reading` |
| `Copy TO=…` queues automatically | No longer auto-queued | Add a queue argument explicitly |
| Double-click a folder in a locked tab opens a new tab | Switches to an existing tab for that folder | New option restores old behavior |
| Video metadata from Windows shell / codecs | MediaInfo library built in, columns for HDR, languages, stream counts | Metadata editor still depends on Windows |

### Renamed commands and arguments (old names still work)

| Old | v13 |
|---|---|
| `Prefs SETDEFAULTLISTER`, "Set Default Lister" | `Prefs SETLISTERDEFAULTS`, Settings / Set Lister Defaults (also sets default view mode and columns) |
| `Rename AUTORENAME` | `Rename AUTONUMBER` |
| `Properties FOLDEROPTIONS`, menu "Folder Options" | `Properties FOLDERFORMAT`, Folder / Folder Format |
| `Set GROUPREVERSE` | `Set GROUPORDER` |
| `Set COMBINESINGLEGROUPS`, `Set GROUPINDIVIDUAL` | `Set GROUPCOMBINE` |
| `Go EXPANDTREE` | `Go TREEEXPAND` |
| `Show NOUSEEXISTING` | `Show USEEXISTING=…` |
| `GetSizes MD5`, `GetSizes SHA` | `GetSizes HASH=<md5,sha1,sha256,sha512,crc32,blake3…>` |
| `Clipboard COPYNAMES=hash5` etc. | `Clipboard COPYNAMES=hash:sha1,fmt:2` |
| `Copy COPYCREATIONTIME` | `Copy COPYFILETIMES` / `COPYDIRTIMES` with `all`, `none`, `onlymodified`, `onlycreated` |
| `dopusrt /acmd`, `/vcmd` | `dopusrt /cmd:active`, `/cmd:viewer` |
| `%headeritem%` | `%headerinsert%` |
| metadata keyword `colorspace` | `colormodel` |
| Viewer plugin "Movie" | "Video & Audio" plugin |
| "ActiveX + Preview + Office + Web" plugin | "MetaPlugin" |
| Script add-ins in Preferences / Toolbars / Scripts | Standalone Script Management dialog: Settings / Scripts (`Prefs SCRIPTS`). Install with Settings / Install Script (`Prefs SCRIPTINSTALL`) |
| Path field `args` string edited by hand | `Preferences / Location Bar / Path Fields`. A leftover `args` string still overrides it |
| Rename `FILEINFO` / "enable file information fields" checkbox | Automatic since Opus 12 (Leo). Only `NOFILEINFO` exists now. |
| Script button starting with `@script jscript` | Script Function type with Script Type dropdown (since 12). |

### New subsystems that replace old workarounds

| Old workaround | v13 feature |
|---|---|
| Script columns for simple computed values | Evaluator Columns: `Preferences / File Display Columns / Evaluator Columns` |
| Scripts for conditional buttons | Evaluator in buttons: `@if:=…`, `@label`, `@showif`, `@hideblock`, `@enableif`, `{=…=}` in rename New Name. Kill switch: `Set EVALUATORDISABLE=Toggle` |
| Scripts to add File Explorer columns | `Preferences / File Display Columns / Shell Properties` checkbox list |
| SearchEverything scripts and buttons | Built-in Everything: search field modes, FAYT `+`, Find Files, instant folder sizes |
| "Viewer Select" script | Lister-Linked Viewers, `Preferences / Viewer / Standalone Viewer / Link both ways` |
| Cleaning history by hand | `Preferences / Miscellaneous / Privacy` (Leo) |
| Script sitting in background loops | `OnPeriodicTimer` event (13.9.4+, Jon) |

SFTP: the v13 release notes in the manual extract do not mention SFTP changes. Treat claims about a "new SFTP" as `[unverified]` and check docs.dopus.com.

## Version gating

| Question | How |
|---|---|
| Installed version | Help / About (`Help ABOUT`). Script: `DOpus.version` (full string as in About), `.product` (release version), `.module` (dopus.exe file version), `DOpus.version.AtLeast("13.3")`. Outside Opus: file version of `C:\Program Files\GPSoftware\Directory Opus\dopus.exe`, e.g. PowerShell `(Get-Item "C:\Program Files\GPSoftware\Directory Opus\dopus.exe").VersionInfo.ProductVersion` |
| Installed build vs manual | The manual describes the newest release. Anything the manual marks "(Opus 13.20.2 and above)" or similar may be absent on an older build. When the manual and the user's UI disagree, ask for the version first. |
| Version numbers | Third digit is a beta: "13.3.1" means 13.3 Beta 1 (manual, `min_version`). So staff "fixed in 13.11.1" means the first beta after 13.11. Betas need `Preferences / Updates / Check for new beta releases`. |
| Licence limits | Forum users report a licence that caps the 13.x they may install ("13.16 (the highest version my license supports)"). Before recommending "update to fix it", ask if their licence covers that build. Exact licence terms `[unverified]`, send to gpsoft.com.au. |
| 13 licence on older versions | Works. Configs saved by 13 do not load correctly in 12. |
| Upgrade from 12 | Back up in 12 first (Settings / Backup & Restore). Install over the top to keep settings. Uninstall first = factory reset. Reboot when asked. The 12 updater will not install 13 by itself. |
| Shared script needs a newer Opus | Scripts with `min_version` above the installed version are disabled. The script installer warns about this. |

"Fixed in 13.x.y" pattern: staff commit to a point release ("We'll add a configurable indent in 13.11.1"). If the user's issue matches a thread like that, the answer is "update to at least 13.x.y", not a config change.

## Known limits and nearest workaround

Only limits backed by the manual or a staff answer.

| Limit | Source | Nearest workaround |
|---|---|---|
| Opus does not replace system Open/Save dialogs | Manual, Explorer Replacement | Dialog jumper tool. Leo pointed to Listary, which reads Opus paths via the `dopusrt /info` API |
| No mouse gestures | No gesture feature in the manual. Leo pointed to PowerPro and StrokeIt | External gesture tool sending hotkeys or `dopusrt /cmd` |
| Tree root cannot be changed | Manual 0862 | Folder Tree Contents preferences |
| Lister cannot be limited to specific paths (`Go LIMITPATH` gone) | Manual 0862 | Locked tabs (agent inference, not a staff answer) |
| Opus windows cannot be forced always-on-top | Manual 0862 | none in Opus |
| Folder sizes auto-update only on local and removable disks | Manual 0837 | Run `GetSizes` by hand on network drives (agent inference) |
| Everything folder sizes only on NTFS drives indexed by Everything 1.4.1+, "Size on disk" less accurate | Manual 0837 | Normal calculation for other drives |
| Metadata editor still uses Windows property handlers, not MediaInfo | Manual 0835 | Columns and filters use MediaInfo. For edits, install the right Windows property handler or use ExifTool externally |
| Formats without a viewer component cannot be previewed (e.g. 3D formats) | Leo | Viewer plugin or Windows preview handler from the format's vendor |
| Sub-file and sub-folder counts are not refreshed automatically | Leo | Re-read the folder |
| Copying a column cell copies what the cell shows | Staff (Help & Support) | Change the column display or use `Clipboard COPYNAMES` |
| Script column keywords with `:`, spaces or path separators break things | Leo | Use `_` or `-` |
| Win+E page missing before Windows 10 or on portable installs without Explorer Replacement | Manual 0268 | System-Wide Hotkey |
| Opus elevated (run as admin) breaks desktop double-click messages | Manual 0266 | Do not run Opus elevated |

## Companion tools

| Tool | Gap it fills | Status |
|---|---|---|
| Everything (voidtools) | Indexed search, instant folder sizes, faster progress totals | Built-in integration in 13 (search field "Everything search" and "Global Everything search", FAYT `+`, Find Files, folder sizes). Scripting via `DOpus.Create.EverythingInterface` (Query, Indexed, Start, Stop, SendCmd). Optional. Auto-start set on Miscellaneous / Advanced. |
| MediaInfo | Video and audio metadata columns | Library built into 13 (Video & Audio plugin, Metadata Methods). Forum script OpusMediaInfo adds more fields. |
| ExifTool | Extra metadata columns (camera, RAW, anything Windows does not expose) | Not bundled. Forum scripts "ExifTool Custom Columns" and OpusExifTool call the exe. Most failures are a wrong ExifTool path (Leo asks for it first). |
| ImageMagick or other CLI converters | View, thumbnail or convert image formats Opus lacks | `Preferences / Miscellaneous / External Tools / Image Formats` with tokens `%in%`, `%out_png%`, `%in_png%`, `%out%`, `%quality%` |
| External text or script editor | Replace internal viewer or script IDE | `Preferences / Miscellaneous / External Tools` |
| Listary | Jump Open/Save dialogs to the Opus folder | Staff-confirmed integration via `dopusrt /info` |
| QuickSwitch, JumpToFolder | Same dialog-jump gap | Mentioned by users only `[unverified]` |
| Quick Access Popup | Folder and launcher menu that works in Opus and dialogs | Leo did a video with its author. Button runs `"C:\Program Files\Quick Access Popup\QAPmessenger.exe" ShowMenuLaunch` (user post) `[unverified]` for current versions |
| StrokeIt, PowerPro, StrokesPlus.Net | Mouse gestures | Leo mentioned StrokeIt and PowerPro without testing them. StrokesPlus.Net is a user tip `[unverified]` |
| AutoHotkey | Global automation, dialog tweaks, hotkeys outside Opus | Drives Opus through `dopusrt.exe /cmd`. Staff appeared on an AutoHotkey channel. Specific AHK scripts `[unverified]` |
| ShellExView, AutoRuns | Block shell extensions system-wide | Named by the manual as the system-wide counterpart of the Opus Shell Extensions page |
| PowerShell 7 | Commands that open PowerShell | Set Advanced `powershell_exe` |

## Troubleshooting: shared content "does nothing"

Check in this order. Ask the user for the result of each before moving on.

1. **Wrong content type or install route.** Raw command → button Function field. XML `<button>` block → copy it, enter Customize (Settings > Customize Toolbars and Keys...), right-click a toolbar and paste. It does not work typed into the Function field. `.dop` toolbar → double-click to import. `.dcf` → double-click runs it, drag to a toolbar in Customize to keep it. `.js` / `.vbs` / `.js.txt` / `.osp` / `.opusscriptinstall` → script add-in, install via Settings / Scripts or Settings / Install Script. `.orp` → rename preset, import in the Rename dialog.
2. **Wrong function type.** Script code in a button needs Function = Script Function and the right Script Type (JScript or VBScript). Code starting with `OnClick` belongs in a button. Code with `OnInit` is an add-in, not a button.
3. **Script add-in disabled or failed to load.** Settings / Scripts shows the checkbox and status. Open the Script Log panel (part of the Utility Panel) for load errors and `DOpus.Output` text. A script whose `min_version` exceeds the installed version is disabled.
4. **Installed but nothing visible.** An add-in adds commands or columns, it does not add buttons. Drag the new command or column from the Install Results dialog, or add the column via Preferences / File Display Columns. Hidden by an `@hideif` / `@showif` condition is possible.
5. **Missing dependency.** ExifTool, MediaInfo CLI, 7-Zip, ImageMagick or a DLL at a path that differs from the author's. Check the path in the script config (cog button in Script Management) or in the button.
6. **Version too old or too new.** Content written for v9 to v12 may use removed commands (see the v13 tables). Content using 13.x features fails on older 13 builds. Compare with Help / About.
7. **Edited toolbars from v12.** New default buttons are missing because the user's toolbars were customised. Use Customize / Default Toolbars with the new-items slider, or "Edit alongside default" for context menus.
8. **Evaluator turned off.** `Set EVALUATORDISABLE=Toggle` disables all evaluator code until restart.
9. **Shell or security interference.** Antivirus blocking DOpusRT or a script, Opus running elevated, a shell extension crashing the menu.

## Pitfalls

- Staff answer from the newest build. A 13.11 user may not have a feature a 13.20 thread describes. Always check the version before saying "it is in Preferences".
- Old forum threads (2008 to 2016) show v9 to v12 UI. The command usually still exists under the same name because renamed arguments keep working, but menus and Preferences paths moved.
- Do not tell a user to uninstall before upgrading. It resets the configuration.
- A crash right after right-clicking is usually a shell extension, not Opus. Turn on out-of-process context menus or block the handler before filing a bug.
- Do not promise a fix version. Say "staff said it is planned for 13.x.y" only when a thread states it.
