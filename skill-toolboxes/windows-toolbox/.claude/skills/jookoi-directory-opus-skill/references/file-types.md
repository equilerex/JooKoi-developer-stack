# File types and file context menus
Scope: per-type behavior in Opus (double-click, drag and drop, right-click and drop menus, info tips, tiles), file type groups, hiding and organising shell context menu items, opening a type in Opus's own viewer. Toolbar and UI menus (column header, tabs, tray): `references/customize.md`. Config file locations and apply routes: `references/config-files.md`.

## User says → concept
| User words | DOpus concept | Where / how |
|---|---|---|
| "right-click menu for .txt files", "add item to right-click" | file type Context Menu tab | Settings / File Types, edit the type, Context Menu |
| "right-click menu for all files / all folders / everything" | pseudo types All files, All folders, All files and folders | top of the File Types list |
| "for all images", "for all my video types" | file type group (Images, Movies...) or Recognized images | File Types / File Type Groups |
| "what happens on double-click", "open with X only in Opus" | Events tab (Left double-click) | Opus-only, Explorer unaffected |
| "Shift+double-click does something else", "middle double-click" | Events with qualifier variants | Events tab |
| "when I drop a file" / "right-drag menu" | Drag-and-drop event / Drop Menu tab | file type editor |
| "default program", "Open with" | default handler (global, Windows) | right-click file / Open With, or the type's Actions tab |
| "context menu too long / slow", "remove 7-Zip / Dropbox entries" | shell extension blocking, Hide Windows items option | Preferences / Miscellaneous / Shell Extensions |
| "tooltip when hovering a file" | Info Tip tab | file type editor |
| "text under icons in tiles view" | Tiles Mode tab | file type editor |
| "open .svg / .md in Opus viewer" | Left double-click event = `Show` | see Recipes |
| "New > text file menu" | `FileType NEW` / `FileType NEWMENU` | buttons or context menu |
| "compare when a copy asks to replace" | Replace Menu tab | file type editor |

## Model
- Open the dialog: Settings / File Types (`Prefs FILETYPES`). Edit a type: double-click it or Edit. From a selected file: `FileType EDIT`.
- Three kinds of entry in the list:
  - **File types**: Windows registered types (JPEG Image = .jpe .jpeg .jpg .jfif). Shared with the whole system.
  - **File type groups**: Opus-only bundles of extensions from different types. Defaults: Archives, Documents, Images, Movies, Music, Programs. Change membership via the Group column drop-down or by editing the group's extensions. Right-click a default group / Reset to Defaults.
  - **Directory Opus file types** (pseudo classes): All files, All files and folders, All folders, Cloud item, Collection item, Flat View item, Library item, No filename extension, Recognized images, Unknown file types.
- Scope of a change:
  | Class | Examples | Effect |
  |---|---|---|
  | Global | icon, description, extensions, MIME type, Actions, "Opens with" | written to Windows, Explorer sees it |
  | Mixed | Context Menu items | Run an application / DDE = global. Run an Opus function / Sub-menu = Opus-only |
  | Opus-only | Events, Drop Menu, Info Tip, Tiles Mode, groups | only inside Opus |
- Lookup order for events, info tips and tiles. The first match with a definition wins:
  1. the specific file type (JPEG Image)
  2. its file type group (Images)
  3. Recognized images (if Opus can decode it)
  4. All files (folders: All folders)
  5. All files and folders
- Context menus are **merged** from all five levels, not first-match. A .jpg menu shows items from JPEG Image, Images, Recognized images, All files and All files and folders. Verbs from the Actions tab sit at the top.
- Groups and pseudo types have no icon setting and (mostly) no Actions tab.

## File type editor tabs
| Tab | Holds | Can use Opus commands |
|---|---|---|
| Actions | Windows verbs: `open`, `explore`, `find`, `print`, `printto`. Set Default = what double-click runs (bold). Types: Run an application (`%1` = file) or DDE command | no, global only |
| Events | Drag-and-drop, Left double-click, Middle double-click, each with Alt / Ctrl / Shift variants. No right double-click | yes (full command editor) |
| Context Menu | right-click items. Types: Run an application, DDE command, Run an Opus function, Sub-menu | yes for Run an Opus function |
| Drop Menu | right-drag drop menu items. Only Run an Opus function and Sub-menu | yes |
| Replace Menu | menu on file icons in the Confirm File Replace dialog | yes. `{filepath$}` = old, `{filepathdest$}` = new |
| Info Tip | hover tooltip, one line per line, `{..}` column keywords | n/a |
| Tiles Mode | tile label lines | n/a |

## Context menu items
- New, Edit, Delete, Set Default (global items only). Drag to reorder. Right-click / Begin a group = separator above.
- Type is fixed after saving: an app item cannot become an Opus function item or the other way.
- Groups only offer Run an Opus function and Sub-menu (groups are Opus-only).
- Action field = label (`&` marks the underlined key). Box beside it = icon, shown in Opus only.
- **Sub-menu**: every item listed below it goes inside it. Right-click the first item that should be back on the main menu / Decrease Indent. Nested sub-menus allowed. Right-click the first item in a sub-menu / Button makes the sub-menu clickable (runs that first item). In Explorer, global items in an Opus sub-menu show on the main menu.
- Shell extension items (handlers, not static registry verbs) cannot be edited here. Control them with blocking, the Hide option and `FileType CONTEXTMENU` (below).

## Opus-defined vs Windows shell items
| Want | How |
|---|---|
| Block one program's entries in Opus only | Preferences / Miscellaneous / Shell Extensions, category Context Menu (or Context Menu UWP for Store apps), select, Block. Blocked category lists them. Page menu exports/imports the block list (13.0+) |
| Hide all Windows and third-party items | same page, **Hide Windows items on file context menus (shift overrides)**. Only Opus-defined items remain. Shift+right-click shows everything |
| Put the hidden items in a sub-menu | with the Hide option on, add to All files and folders / Context Menu: a Sub-menu, then a Run an Opus function item `FileType CONTEXTMENU CONTEXTOPTIONS=windowsonly` |
| Bring back one handler | Run an Opus function item `FileType CONTEXTMENU {GUID-of-extension}` or `FileType CONTEXTMENU <file class>` (e.g. `jpegfile`) |
| Full Windows menu as a sub-menu regardless of Hide | `FileType CONTEXTMENU CONTEXTFORCE` |
| Fewer crashes from bad extensions | same page, Access context menus out-of-process if possible (13.0+, on by default) [unverified default] |
| Invoke a shell menu command from a button | find it with `ContextMenu SHOWCMDS` (dialog has Copy Command), then `ContextMenu VERB="delete"` or `ContextMenu LABEL="Scan*" WILD`. Prefer the verb over `ID`, IDs shift when extensions change |
| Extended (Shift-only) verbs | `ContextMenu SHOWCMDS EXTENDEDVERBS`, run with `EXTENDEDVERBS SHIFT VERB=...` |
| Opus's own archive items (Add to Archive, Extract) | Preferences / Zip and Other Archives / Context Menu: Enable Archive context menu, Cascade context menu items (sub-menu), Display context menus in Explorer as well as Opus, Display icons |

Full argument lists: `references/commands.md` / FileType, ContextMenu.

## Drop menu
- Shown when you drag with the right mouse button and drop. Defaults (Copy Here, Move Here, Create Shortcut(s) Here) come from All files and folders.
- Merged across matching types like the context menu. Only Opus functions and sub-menus.
- Left-button drops are the Drag-and-drop event on the Events tab (with Alt/Ctrl/Shift variants).

## Info tips and tiles
- One line per line of the edit field. A line whose codes are all empty for the file is dropped. Text outside `{}` is literal.
- Keywords are the column keywords used by Rename and `Set COLUMNSADD` (manual: Keywords for Columns). Evaluator also allowed.
- Info tip specials: `{thumbnail}` (`{thumbnail:0}` no border, `:2` border only without alpha, `{thumbnailt}` / `l` / `b` position), `{foldersize}` / `{foldersize:noprefix}`, `{foldercontents:files,maxitems=20}` (also `dirs`, `noprefix`, `singleline`, `indent=`, `maxitemlength=`).
- Tiles specials: `{foldersize}`, `{foldercontent}`. Markup: `<b>`, `<i>`, `<u>`, `<#RRGGBB>text</#>`. Tile size: the Tiles Mode Preferences page.
- Put the definition on a group to cover many types, override on a single type.

## Opus viewer vs external app
| Goal | Mechanism | Scope |
|---|---|---|
| All recognized images open in Opus viewer on double-click | Preferences / File Operations / Double-click Files / Images option (all recognized images or only unregistered types) | Opus only |
| One type opens in the Opus standalone viewer | that type's (or group's) Events / Left double-click = `Show` | Opus only |
| Opus viewer also from Explorer | Windows default app for the type = `d8viewer.exe` (Opus program folder). `d8viewer.exe` and `dopusrt.exe /show` open files in the Opus viewer from outside | global |
| One type opens in a specific app only in Opus | Events / Left double-click = `"C:\Path\app.exe" {filepath}` | Opus only |
| Change the system default | right-click file / Open With (choose default), or the type's Actions / open | global |
| WAV in Opus's player | Double-click Files / Use internal sound player for WAV files | Opus only |
| Unknown text-like files in a text viewer | Double-click Files / Open unregistered file types in text viewer if they appear to be plain text. Pick the viewer on Preferences / Miscellaneous / External Tools | Opus only |

How the viewer renders a type: viewer plugins (Preferences / Viewer / Plugins, order = precedence, catch-all Text plugin last) and Windows preview handlers through the MetaPlugin (named "ActiveX + Preview + Office + Web" before 13.0). In 13 the viewer pane uses Edge for HTML, MHT, SVG and URL files by default. Force a plugin: `Show PLUGIN=<plugin name>`.

## "Open with" buttons
- Shell Open With list inside any menu or context menu: `FileType OPENWITHMENU`. `FileType OPENWITHMENU=nosub` inlines the entries (13.20.2+, newer than the 13.11 install). Do not put it on a top-level toolbar, it does not track the selection there.
- Fixed app button: `"C:\Program Files\App\app.exe" {allfilepath}` (see `references/customize.md` for control codes and sync/async).
- Shell Send To list: `FileType SENDTOMENU`. New file menu: `FileType NEWMENU`. Create a file directly: `FileType NEW .txt`.
- Trigger a type's own event from a button: `FileType ACTION=dblclkshift` (values: `open`, `openwith`, `explore`, `find`, `print`, `shellex`, `drop`, `dropshift`, `dropctrl`, `dropalt`, `dblclk`, `dblclkshift`, `dblclkctrl`, `dblclkalt`, `mdblclk`, `mdblclkalt`, `mdblclkshift`, `mdblclkctrl`).

## Recipes
**Add a right-click item for one type (Opus only)**
1. Settings / File Types, find the extension (type it in the list to jump), Edit.
2. Context Menu tab / New. Type = Run an Opus function. Action = `Open in &Notepad++`.
3. Function: `"C:\Program Files\Notepad++\notepad++.exe" {filepath}`. OK, OK.
For several unrelated extensions: create a group (File Types / New / group), add the extensions, put the item on the group. For every file: All files. For files and folders: All files and folders.

**Same item also in Explorer**: Type = Run an application, Application = `"C:\Program Files\Notepad++\notepad++.exe" "%1"`. Global, written to the registry.

**Open .svg (or .md) in the Opus standalone viewer on double-click**
1. Settings / File Types, find `.svg`, Edit (the type itself, adding it to Images alone did not change double-click for a forum user).
2. Events / Left double-click / Edit. Function: `Show`. OK.
3. Rendering: SVG uses Edge/preview handler, .md needs a Markdown preview handler (PowerToys or Atrejoe MarkdownPreview per forum) or falls back to the Text plugin.
Alternative that also works in Explorer: right-click / Open With / choose default / `d8viewer.exe`.

**Keep Explorer's double-click, but Shift+double-click opens in Opus viewer**: type's Events / Left double-click + Shift = `Show`.

**Ctrl+drop images converts to PNG**: Images group / Events / Drag-and-drop + Ctrl = `Image CONVERT=png`.

**Right-drag "Create Softlink Here"**: All files and folders / Drop Menu / New, Run an Opus function, Action `Create Softlink Here`, Function `Copy MAKELINK=softlink HERE`. Needs admin (UAC).

**Organise and speed up context menus** (forum tip, checked against manual)
1. Preferences / Miscellaneous / Shell Extensions: Block the worst offenders (Context Menu and Context Menu UWP categories).
2. Turn on Hide Windows items on file context menus (shift overrides).
3. All files and folders / Context Menu / New: Sub-menu, Label `More`.
4. New: Run an Opus function, Action `windows items` (label only shows in the editor), Function `FileType CONTEXTMENU CONTEXTOPTIONS=windowsonly`.
5. Drag the sub-menu where you want it. If items below it got swallowed, right-click the first one / Decrease Indent.
6. Shift+right-click still shows the full flat menu.
Do not delete the `open` verb from Actions to shorten the menu. Double-click usually runs it.

**Edit any file's type from its menu**: All files and folders / Context Menu / New, Run an Opus function, Function `FileType EDIT`.

**Compare on overwrite**: All files / Replace Menu / New, Function `"C:\Program Files\Beyond Compare 4\BCompare.exe" {filepath$} {filepathdest$}`.

## Pitfalls
- Changed icon, description, extension or Actions in Opus and Explorer changed too → these are global → use Events or Opus-only context items for Opus-only behavior.
- Action cannot run `Show` or other Opus commands → Actions are Windows verbs → use the Events tab.
- Added extension to Images but double-click unchanged → the specific type or the Windows default still decides, and the Images group has no Left double-click by default → set the event on the type, or turn on Double-click Files / Images.
- New group item missing in Explorer → groups and Opus functions are Opus-only by design.
- Item appears under a sub-menu by accident → everything below a Sub-menu is inside it → Decrease Indent.
- Item type locked → cannot convert global ↔ Opus-only after saving → delete and recreate.
- Third-party item cannot be edited or reordered → it's a shell extension handler, not a verb → block it, or hide all and re-add with `FileType CONTEXTMENU {GUID}`.
- Old advice about `ignore_context_menus` / `allow_context_menus` in Miscellaneous / Advanced → replaced in 13.0 by the Shell Extensions page.
- Old advice "Miscellaneous / Windows Integration / Hide Windows items" → moved to Miscellaneous / Shell Extensions in 13.0 (the FileType CONTEXTFORCE doc still names the old page). Forum quotes the label as "Hide Windows & third-party items on file context menus".
- Context menu slow or Opus crashes on right-click → a shell extension → block it on Shell Extensions page, keep out-of-process option on.
- `Show` on a type no plugin handles → Text plugin shows text or hex → install a plugin or preview handler, check Preferences / Viewer / Plugins order.
- `FileType OPENWITHMENU=nosub` ignored → needs 13.20.2+.
- Not possible natively: right double-click events. Nearest: middle double-click or a qualifier variant.
- File type edits are saved under `FileTypes\` plus the registry. Do not hand-edit while Opus runs (`references/config-files.md`).
