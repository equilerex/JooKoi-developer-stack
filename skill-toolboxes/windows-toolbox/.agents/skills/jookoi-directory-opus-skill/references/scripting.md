# Scripting
Writing, installing and debugging Opus scripts: script functions, script add-ins, rename scripts, include files and modules, events, object model, dialogs, packaging, editor typings.

## User says → concept

| User words | DOpus concept | Where / how |
|---|---|---|
| "a button that runs code", "JavaScript in a button" | Script Function | Button editor, Advanced, Function: `Script Function`, entry point `OnClick` |
| "my own command", "plugin", "extension" | Script add-in with a script command | File in `/dopusdata/Script AddIns`, `OnAddCommands` |
| "custom column", "show X next to each file" | Script add-in with a script column | `OnAddColumns` + column method |
| "do something every time I open a folder / start Opus" | Script add-in event | `OnAfterFolderChange`, `OnStartup`, etc. |
| "rename with code / regex logic" | Rename script | Advanced Rename dialog, script mode, `OnGetNewName` |
| "share my script", "install this script" | `.opusscriptinstall`, `.osp`, plain `.js` | Script Management `Share` / `Install`, `Prefs SCRIPTINSTALL` |
| "where do errors show", "console", "print debug" | Script Log | `DOpus.Output`, Help > Logs > Script Log |
| "manage / disable scripts" | Script Management dialog | `Prefs SCRIPTS` (Settings > Scripts) |
| "autocomplete in VS Code" | Third-party typings | See Editor typings |

## Model

Three kinds of script, one object model:

| Kind | Lives in | Triggered by | Entry point |
|---|---|---|---|
| Script Function | A button, menu item or hotkey (stored in the toolbar `.dop` / `.dcf`) | User click or key | `OnClick(clickData)` (optional, top-level code runs first) |
| Script add-in | File in `/dopusdata/Script AddIns` (`%APPDATA%\GPSoftware\Directory Opus\Script AddIns`) | Events, its own commands and columns | `OnInit` + any event functions |
| Rename script | Rename preset, or embedded in a `Rename` button after `@script:<language>` | Each file in a rename | `OnGetNewName(getNewNameData)` |

Rule: if a button needs a few lines of logic, use a Script Function. If the logic must run on events, be callable as a command from many buttons/hotkeys/`dopusrt`, or add a column, use an add-in.

Every event function takes one data object argument (except legacy `Rename_GetNewName`/`Rename_GetNewName2`). Two globals exist: `DOpus` (everywhere) and `Script` (add-in event handlers other than `OnInit`).

### Languages

- Any installed Active Scripting language. JScript and VBScript ship with Windows. Prefer **JScript** (`.js`): most forum examples, Create New Script and the editor support it, and collections can be indexed with `[]` (13+) as well as `()`.
- VBScript (`.vbs`) is equally supported. Other languages (Python, PerlScript) need a third-party engine, and the Create New Script dialog only offers JScript/VBScript (custom templates go in `/dopusdata/Script AddIns/Templates/<Language>.<ext>`).
- Add-in language comes from the file extension. Script Function language comes from the editor drop-down.

### Button XML form of a Script Function

Not documented in the manual. Seen in the local `Buttons\Menu.dop` and in forum posts:

```xml
<button backcol="none" display="both" textcol="none">
  <label>Say hi</label>
  <function type="script">
    <instruction>@script JScript</instruction>
    <instruction>function OnClick(clickData)</instruction>
    <instruction>{</instruction>
    <instruction>  DOpus.Output("hi from " + clickData.func.sourcetab.path);</instruction>
    <instruction>}</instruction>
  </function>
</button>
```

Modifiers like `@hideif:` or `@toggle:update` go as `<instruction>` lines before `@script`. In the editor they live on the Modifiers tab, code on Script Code, dialogs/strings on Resources.

### Include files and modules (13+)

| | Include file | Module |
|---|---|---|
| Purpose | Share code between scripts | Split one big script into parts |
| Filename | Must start `inc_` (`inc_myutils.js`), same language as the user | `<MainScript>.<ModuleName>.osm`, e.g. `MyScript.js.Utilities.osm` |
| Loading | `@include inc_myutils.js` at the very top (min version: `@include inc_myutils.js:1.2`). `//@@include inc_myutils.js` also accepted | Automatic when the main script loads |
| Init | Optional `OnInitIncludeFile(initData)`. Must implement it with `shared = true` to be usable by all scripts | none |
| Scope | Runs as part of the including add-in (`Script.vars` is the add-in's) | Same |

## Add-in skeleton

`OnInit(initData)` receives a `ScriptInitData`. It runs at Opus startup and again whenever the file is added or edited. Returning `true` disables the script until next `OnInit`.

| `initData` member | Meaning |
|---|---|
| `name`, `desc`, `version`, `copyright`, `url` | Shown in Script Management |
| `default_enable` | `true` to be enabled on install |
| `min_version` | `"13"`, `"13.11"` or `"13.11.1"` (beta). Lower version disables the script |
| `group` | Groups the script in the list |
| `log_prefix` | Prefix for its log lines (default: script name) |
| `early_dblclk` | Get `OnDoubleClick` first with only a path (fast) |
| `startup` | Read-only. `true` during Opus startup, `false` on hot load |
| `file` | Read-only. Script path |
| `config` | `ScriptConfig`. Assign defaults here, user edits them via the cog. Read later via `Script.config` |
| `vars` | Script-scoped `Vars` |
| `AddCommand()`, `AddColumn()` | Old style. Unavailable when `OnAddCommands` / `OnAddColumns` exist |

Config value type sets the editor control: bool → checkbox, int → number, string → text, string with CR/LF → multiline, `Vector` of strings → string list, `Vector` with an int first → drop-down (int = default index). Per-item sub-properties: `.desc`, `.group`, `.label`, `.min`, `.max`, `.limit`, `.type` (`"float"`, `"float:3"`, `"multiline"`). Use an `OrderedMap` to keep order. React to edits with `OnScriptConfigChange` (and `Script.InitCommands()` / `Script.InitColumns()` / `Script.RefreshColumn(name)`).

`ScriptCommand` (from `AddCommand`): `name` (invoked name), `method` (function name), `desc`, `label`, `template` (argument template), `icon` (internal icon or `set:icon`), `hide`, `noprogress`, `flags` (default `"sd"`), `dynamic_args` (→ `OnAddButtons`), `context_args` (→ `OnButtonContext`).

Template syntax: `NUMBER/N,FROM/K/N,NODESELECT/S`. `/S` switch → bool, `/N` → int, `/K` keyword → string, `/O` optional value (bool if no value), `/M` multiple → `Vector`. Read via `func.args.<name>`, test with `func.args.got_arg.<name>`.

`ScriptColumn` (from `AddColumn`): `name`, `method`, `label`, `header`, `justify`, `type` (`number`, `double`, `size`, `zip`, `duration`, `durationh`, `percent`, `time`, `datetime`, `stars`, `graph`...), `autogroup`, `autorefresh`, `nosort`, `nogroup`, `defsort`, `defwidth`, `multicol`, `infotiponly`, `match` (Vector of searchable values), `category`, `timeout`. The method gets `ScriptColumnData`: read `item`, `col`, `tab`, set `value`, `sort`, `group`. With `multicol`, set `columns(<name>).value` for each.

### Minimal working add-in (JScript)

Save as `%APPDATA%\GPSoftware\Directory Opus\Script AddIns\AgentDemo.js`. Adds command `AgentDemo` and column `NameLength`.

```js
function OnInit(initData) {
    initData.name = "Agent Demo";
    initData.version = "1.0";
    initData.desc = "Example command and column";
    initData.default_enable = true;
    initData.min_version = "13.0";
    initData.config.out_file = "C:\\Temp\\agentdemo.txt";
}

function OnAddCommands(addCmdData) {
    var cmd = addCmdData.AddCommand();
    cmd.name = "AgentDemo";
    cmd.method = "OnAgentDemo";
    cmd.desc = "Writes the source path and selection count to a file";
    cmd.label = "Agent Demo";
    cmd.template = "MSG/K";
}

function OnAgentDemo(scriptCmdData) {
    var func = scriptCmdData.func;
    var tab = func.sourcetab;
    var msg = func.args.got_arg.msg ? func.args.msg : "";
    var text = "path=" + tab.path + " selected=" + tab.selected.count + " msg=" + msg;
    DOpus.Output(text);
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var file = fso.CreateTextFile(Script.config.out_file, true); // overwrite
    file.WriteLine(text);
    file.Close();
}

function OnAddColumns(addColData) {
    var col = addColData.AddColumn();
    col.name = "NameLength";
    col.method = "OnNameLength";
    col.label = "Name Length";
    col.justify = "right";
    col.type = "number";
    col.autogroup = true;
}

function OnNameLength(scriptColData) {
    scriptColData.value = scriptColData.item.name.length;
}
```

Run it: `dopusrt.exe /acmd AgentDemo MSG=hello`, or put `AgentDemo` on a button. Show the column: `Set COLUMNSTOGGLE="scp:Agent Demo/NameLength"` (`scp:<script name>/<column name>`).

## Agent edit-run-check loop (tested 13.11)

Tested on the author machine (Opus 13.11): a `.js` add-in written into `%APPDATA%\GPSoftware\Directory Opus\Script AddIns\` auto-loads within seconds, hot-reloads on every save, unloads on delete. Its command runs from outside via `dopusrt.exe /acmd <CommandName>`. `new ActiveXObject("Scripting.FileSystemObject")` worked for writing files from JScript. Apply-route details: [references/config-files.md](references/config-files.md).

Loop:
1. Write or edit the `.js` file.
2. Wait a few seconds for the reload.
3. Run `"C:\Program Files\GPSoftware\Directory Opus\dopusrt.exe" /acmd <CommandName> <ARGS>`.
4. Read the output file the command writes (the agent cannot read the Script Log directly).
5. Delete the file to uninstall.

Hot-load caveats: `OnStartup` does not fire for a hot-loaded script (only at real Opus startup). `OnInit` runs with `initData.startup == false`. Write errors (syntax errors, exceptions) go to the Script Log, so wrap the command body in `try { } catch (e) { ...write e.message to the file... }` to see them from outside.

## Events

All are optional functions in the add-in. Return values only matter where noted.

| Group | Event | Meaning |
|---|---|---|
| Lifecycle | `OnInit` | Identify script, define config. Return `true` disables |
| | `OnAddCommands` | Add commands via `AddCmdData.AddCommand()` |
| | `OnAddColumns` | Add columns via `AddColData.AddColumn()` |
| | `OnStartup` | Opus started (not on hot load) |
| | `OnShutdown` | Opus quitting. Return `true` to block (not on Windows shutdown) |
| | `OnScriptConfigChange` | User edited the script config |
| | `OnAboutScript` | About button in Script Management |
| | `OnDeleteScript` | User deleted the script via the UI. Clean up data files |
| | `OnInitIncludeFile` | Include file self-description |
| Entry points (name set by script) | `OnScriptCommand` | A script command runs. Gets `ScriptCommandData` |
| | `OnScriptColumn` | Column value wanted for one item. Gets `ScriptColumnData` |
| | `OnScriptFAYTCommand` | FAYT extension triggered |
| | `OnClick` | Script Function button/hotkey run (`ClickData`) |
| Folders and tabs | `OnBeforeFolderChange` | Before read. Return `true` to block, or a string/`Path` to redirect |
| | `OnAfterFolderChange` | After read. `result` false + return `true` = stay on failed path |
| | `OnOpenTab` / `OnCloseTab` | Tab opened / closing (return `true` blocks close) |
| | `OnActivateTab` | Tab came to front (`oldtab`, `newtab`) |
| | `OnSourceDestChange` | Tab source/dest state changed |
| | `OnDisplayModeChange` | View mode changed |
| | `OnFlatViewChange` | Flat View mode changed |
| | `OnQuickFilterChange` | Quick filter changed |
| | `OnTabClick` | Tab clicked with qualifier. Return `true` to override |
| Listers | `OnOpenLister` | New Lister. Return `true` to get a second call after tabs exist |
| | `OnCloseLister` | Closing. Return `true` blocks (unless shutting down) |
| | `OnActivateLister` | Lister gained or lost activation |
| | `OnListerResize` | Window resized |
| | `OnListerUIChange` | Lister UI element toggled (check with `Command.IsSet`) |
| | `OnStyleSelected` | Lister style chosen |
| Files | `OnDoubleClick` | File/folder double-clicked. Return `true` to replace default action [unverified: return semantics] |
| | `OnFileOperationComplete` | Operation finished (Rename only). Two-pass `query` protocol |
| | `OnGetCopyQueueName` | Pick copy queue. Return string, `false` (default) or `true` (no queue) |
| | `OnFilesystemChange` | Watched path changed (`FSUtil.WatchChanges`, 13+) |
| Rename | `OnGetNewName` | Return new name string, or `true` to skip the file |
| | `OnGetCustomFields` | Add controls to the Rename dialog |
| Toolbars | `OnAddButtons` | Generate dynamic buttons for `dynamic_args` |
| | `OnButtonContext` | Set highlight/disabled state for `context_args` |
| UI misc | `OnFAYTClose` | FAYT closed after a script FAYT command |
| | `OnViewerEvent` | Standalone viewer event (`viewer`, `event`, `item`) |
| Timers | `OnPeriodicTimer` | `DOpus.SetTimer(id, ms)` fired. `DOpus.KillTimer(id)` stops |
| | `OnScheduledTimer` | `DOpus.SetScheduledTimer(id, date)` reached (once) |
| System | `OnClipboardChange` | Clipboard changed |
| | `OnPowerEvent` | Power event (`type`) |
| | `OnSystemSettingChange` | System setting changed (`type`) |
| | `OnConfigBackup` / `OnConfigRestore` | Edit files in the staging `location` folder |

Events named in the forum (OpusDevTools changelog) but missing from the extract (two placeholder pages exist): `OnConfigureScript`, `OnAddConfigPages` [unverified]. Check docs.dopus.com before using them.

## Object model

Entry points and the members agents need most. Full lists: docs.dopus.com Scripting Objects.

| Object | Get it from | Key members |
|---|---|---|
| `DOpus` | global | `Output(text, error?, timestamp?)`, `ClearOutput()`, `Create` (→ `DOpusFactory`), `FSUtil`, `Dlg`, `listers`, `vars`, `version`, `GetClip()`, `SetClip()`, `GetQualifiers()`, `Delay(ms)`, `SetTimer`, `KillTimer`, `SetScheduledTimer`, `ReloadScript(file)`, `Toolbars`, `strings`, `aliases`, `favorites`, `language`, `TypeOf(x)` |
| `DOpusFactory` | `DOpus.Create` | `Command()`, `Map()`, `OrderedMap()`, `Vector()`, `StringSet()`, `StringSetI()`, `UnorderedSet()`, `Blob()`, `Date()`, `StringTools()`, `SysInfo()`, `Filter()`, `BusyIndicator()` |
| `Script` | global in add-in events | `config`, `vars`, `file`, `InitCommands()`, `InitColumns()`, `RefreshColumn(name)`, `UpdateButtons(full)`, `LoadResources(file or XML)`, `LoadImage(name)`, `UpdateConfig()` |
| `ClickData` | `OnClick` arg | `func` |
| `ScriptCommandData` | command method arg | `func`, `cmdline`, `fayt` |
| `Func` | `.func` | `sourcetab`, `desttab`, `args`, `argsmap`, `command` (pre-filled `Command`), `qualifiers`, `fromdrop`, `fromkey`, `viewer`, `Dlg()` |
| `Command` | `func.command` or `DOpus.Create.Command()` | `RunCommand("Select ALL")`, `AddLine()` + `Run()`, `RunAsync()`, `AddFile()`, `AddFiles()`, `SetFiles()`, `ClearFiles()`, `SetSourceTab()`, `SetDestTab()`, `SetSource(path)`, `SetDest(path)`, `SetModifier(name, value)`, `IsSet("VIEW=Thumbnails")`, `results`, `progress`, `vars`, `deselect`, `files`, `filecount`, `CommandList()` |
| `Lister` | `DOpus.listers(0)`, `tab.lister` | `activetab`, `desttab`, `tabs`, `tabsleft`, `tabsright`, `dual`, `title`, `layout`, `style`, `vars`, `left`/`top`/`right`/`bottom`, `viewpane`, `utilpage`, `Update()` |
| `Tab` | `func.sourcetab`, `lister.activetab` | `path`, `all`, `files`, `dirs`, `selected`, `selected_files`, `selected_dirs`, `stats`, `selstats`, `lister`, `label`, `lock`, `format`, `quickfilter`, `vars`, `GetFocusItem()`, `Update()` |
| `Item` | enumerate `tab.files`, `FSUtil.ReadDir`, `FSUtil.GetItem` | `name`, `name_stem`, `ext`, `realpath`, `path`, `is_dir`, `size` (`FileSize`, use `.cy` to compare), `modify`, `create`, `attr`, `metadata`, `selected`, `labels`, `Open()` (→ `File`), `ShellProp(name)`, `Update()` |
| `Items` | `tab.files`, etc. | `count`, index `(i)` or `[i]` (13+ JScript), `new Enumerator(items)` |
| `Path` | `FSUtil.NewPath(str)`, `tab.path` | `filepart`, `pathpart`, `stem`, `ext`, `drive`, `components`, `Add(sub)`, `Parent()`, `Resolve()`, `Set(str)`, `Split()`, `test_root` |
| `FSUtil` | `DOpus.FSUtil` | `Exists(path)`, `GetItem(path)`, `ReadDir(path, "r")`, `NewPath()`, `Resolve(alias)`, `OpenFile(path, "w")`, `GetTempFilePath()`, `Hash(path, "md5")`, `Run(cmd, ...)`, `GetType()`, `PathType()`, `WatchChanges()` (13+), `NewWild(pattern)`, `ComparePath()` |
| `Vars` / `Var` | `DOpus.vars`, `Lister.vars`, `Tab.vars`, `Command.vars`, `Script.vars` | `Set(name, value)`, `Get(name)`, `Exists(name)`, `Delete(name)`, `vars("name").persist = true` (survive restart) |
| `Dialog` | `DOpus.Dlg`, `func.Dlg()`, `tab.Dlg` | See Dialogs |
| `Progress` | `cmd.progress` | `Init()`, `Show()`, `SetTitle()`, `SetStatus()`, `SetFiles()`, `StepFiles()`, `SetPercentProgress()`, `GetAbortState()`, `Hide()` |
| `Map` / `OrderedMap` | `DOpus.Create.Map()` | `(key)` get/set, `exists(key)`, `erase(key)`, `count`, enumerable keys |
| `Vector` | `DOpus.Create.Vector()` | `push_back()`, `(i)`, `count`, `erase(i)`, `sort()`, `empty` |
| `Blob` | `DOpus.Create.Blob()` | binary buffer for `File.Read`/`Write` |
| `StringTools` | `DOpus.Create.StringTools()` | encode/decode, `RemoveDiacritics()` (13+) |
| `Date` | `DOpus.Create.Date()`, `item.modify` | Opus date object, builds from JScript `Date` (13+) |
| `FileSize` | `item.size` | `.cy` numeric value for comparisons |

Running internal commands from script is the normal way to change Opus state: `func.command.RunCommand("Go /desktop NEWTAB")` or `cmd.SetSourceTab(tab)` then `cmd.RunCommand("Set SORTBY=modified")`. Command arguments: [references/commands.md](references/commands.md). To act on script-chosen files: `ClearFiles()`, `AddFile(item)`, `RunCommand("Select FROMSCRIPT DESELECTNOMATCH")`. Pass `NOSCRIPT` to `Go`/`Prefs LAYOUT` to avoid retriggering your own events.

## Dialogs

| Kind | How | Use |
|---|---|---|
| Message / buttons | `dlg.message`, `dlg.title`, `dlg.buttons = "OK|Cancel"`, `dlg.icon = "warn"`, `dlg.Show()` returns the button index, also in `dlg.result`. The last button is the cancel button (first = 1, cancel = 0 [unverified]) | Confirmations |
| Text input | `dlg.max = 128` before `Show()`, read `dlg.input`. Or `dlg.GetString(message, default)` | Ask for a string |
| Popup menu | `dlg.choices` (Vector of strings) + `dlg.menu`, shown at the mouse | Quick pick |
| Simple resource dialog | `dlg.template = "name"`, `Show()` blocks until a `close="N"` button. Read `dlg.Control("name").value` after | Data entry form |
| Detached | `dlg.detach = true` (or `Create()` then `Show()`), then a message loop | Live interaction |

Always set `dlg.window = clickData.func.sourcetab` (or a Lister) as parent. Detached loop (JScript):

```js
dlg.detach = true;
dlg.Show();
while (true) {
    var msg = dlg.GetMsg();
    if (!msg.result) break;          // dialog closed
    if (msg.event == "click" && msg.control == "btnRefresh") { /* update controls */ }
}
var closedBy = dlg.result;           // which close button
```

Dialog XML lives in the script Resources tab (button) or the `==SCRIPT RESOURCES` block at the end of an add-in file, edited in the Dialog Editor. Package resources can be separate `.odxml` files loaded with `Script.LoadResources`.

## Installing and sharing

| Format | What it is | Install |
|---|---|---|
| `.js` / `.vbs` (or `.js.txt`) | Single add-in | Copy into `Script AddIns`, or Script Management `Install`, or drag onto the list |
| `.osp` | Zip of one or more scripts, optional `icons\` icon-set folder, `images\`, `.odxml` resources | Same. Build: zip the files, rename to `.osp` |
| `.opusscriptinstall` (13+) | Installer bundle made by Script Management `Share`, includes needed include files | Double-click (installed Opus) or `Prefs SCRIPTINSTALL=<path>` |

- `Prefs SCRIPTS=<file>*` opens Script Management at a script. `Prefs SCRIPTEDIT=<file>*` opens the Script Editor (13+). The `*` matches an optional `.txt` suffix.
- Script Editor (13+): tabs per asset, Assets panel (Scripts, Resources, Other), Dialog Editor, String Editor, snippets, `Convert to Package`. Packages are edited in place. External editors only see single files, so plain `.js` is easier for agents and VS Code.
- `ScriptCommand.icon = "mysetname:myicon"` uses an icon from the package `icons` folder.
- Enable/disable state is Opus-managed in `ConfigFiles\scriptaddins.oxc`. Do not hand-edit (see [references/config-files.md](references/config-files.md)).

## Debugging

- `DOpus.Output("text")` writes to the Script Log. `DOpus.Output("bad", true)` shows it red as an error. Third arg `true` adds a timestamp.
- Open the log: Help > Logs > Script Log, or the Utility Panel (older manual text calls it Other Logs). From a Script Function editor, `Run` shows output under the editor.
- Verbosity: `Preferences / Miscellaneous / Advanced: script_output_level`.
- Ad-hoc testing: `CLI SCRIPTMODE=JScript` opens the CLI in script mode.
- Evaluator `Output()` and button `@output:` also log here.

## Editor typings

| Project | File | State | Setup |
|---|---|---|---|
| cy-gh [DOpus_ScriptingHelper](https://github.com/cy-gh/DOpus_ScriptingHelper) | `_DOpusDefinitions.d.ts` | README: "very early stage", v13 docs partly applied, last dated note 2024-02-04. Many members typed read-only | VS Code setting `JS/TS › Implicit Project Config: Check JS`, copy the `.d.ts` next to scripts, top of file: `///<reference path="./_DOpusDefinitions.d.ts" />` and `// @ts-check` |
| PassThePeas OpusDevTools (forum thread "VSCode Integration (typings, intellisense, snippets)") | `dopus.d.ts` + `global.d.ts` | Actively updated in the thread up to v1.3.0 for Opus 13.25 scripting changes. All objects JSDoc-covered. Newer than 13.11, so a few members may not exist on 13.11 | Install `OpusDevTools.opusscriptinstall`, run `OpusDT_Install`. Creates `.vscode\` (tasks, snippets) and `OpusDevTools\` in `Script AddIns` |

OpusDevTools extras: `OpusDT_FixTypes` rewrites `@include` to `//@@include` (keeps the type checker quiet) and adds JSDoc to event and command/column methods so parameters get intellisense. `OpusDT_GenerateIndex` links all `.d.ts` files including your include files. Thread advice: avoid `.osp` when using VS Code, and keep dialog XML in a side file loaded with `Script.LoadResources("x.xml")` (cost: no Dialog Editor on it).

For v13 work prefer OpusDevTools. Neither is official.

## Recipes

**Run a script command from outside Opus**: `dopusrt.exe /acmd AgentDemo MSG=hello`.

**Button that runs code on selected files** (Script Function, JScript):
```js
function OnClick(clickData) {
    var e = new Enumerator(clickData.func.sourcetab.selected_files);
    for (; !e.atEnd(); e.moveNext())
        DOpus.Output(e.item().realpath);
}
```

**Change sort when entering a folder** (add-in):
```js
function OnAfterFolderChange(data) {
    if (!data.result) return;
    if (String(data.tab.path).indexOf("D:\\Photos") == 0) {
        var cmd = DOpus.Create.Command();
        cmd.SetSourceTab(data.tab);
        cmd.RunCommand("Set SORTBY=modified");
    }
}
```

**Remember a value across runs**: `Script.vars.Set("count", n)` in add-ins, or `DOpus.vars.Set("count", n)` then `DOpus.vars("count").persist = true` for global and restart-proof.

**Rename script with parameters**: implement `OnGetCustomFields`, read `getNewNameData.custom.<field>`, automate with `Rename PRESET=MyRename SCRIPTARG my_option:True my_field:x`.

## Pitfalls

- Command not found after editing → script failed to load (syntax error) or `OnInit` returned `true` → check Script Management Status column and the Script Log.
- `initData.AddCommand` ignored → `OnAddCommands` also exists in the file. Use one style only. Same for columns.
- Global variables reset between calls → each event call may start fresh. Use `Script.vars` / `DOpus.vars` [unverified: exact global lifetime rule].
- `OnStartup` code never ran → script was hot-loaded. Restart Opus or move the code to `OnInit`/a command.
- Modern JS fails (`let`, `const`, arrow functions, template literals, `JSON`, `Array.prototype.forEach`) → classic JScript is roughly ES3 [unverified]. Write ES3 style, use `Enumerator` for collections.
- `item.size` comparisons wrong → it is a `FileSize` object. Compare `.cy`.
- Event loops (folder change runs `Go`, which triggers the event again) → add `NOSCRIPT` to the command.
- Include file not found by other scripts → name lacks `inc_` prefix, different language, or not marked `shared` in `OnInitIncludeFile`.
- `.osp` hard to edit externally → use plain `.js` while developing, convert to package later.
- Typings mention members missing at runtime → typings track 13.23+ while this machine runs 13.11. Check `DOpus.version` or docs.
- Rename legacy `Rename_GetNewName` → use `OnGetNewName` for new scripts.
