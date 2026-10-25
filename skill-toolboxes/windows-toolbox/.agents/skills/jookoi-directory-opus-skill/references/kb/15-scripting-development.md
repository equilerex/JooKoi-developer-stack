# Scripting: kinds of scripts, add-ins, editor, dialogs, examples

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- scripting.concept: Scripting overview
- scripting.rename: Rename scripts (OnGetNewName)
- scripting.functions: Script functions (button/hotkey scripts)
- scripting.addins: Script add-ins and Script Management
- scripting.include: Include files, modules, script packages
- scripting.templates: Custom new-script templates
- scripting.editor: Script editor, assets, snippets
- scripting.strings: String resources (multi-language)
- scripting.dialogs: Script dialogs (resources, simple, detached)
- scripting.example.command: Example: add an internal command
- scripting.example.column: Example: add a column (and from shell properties)
- scripting.example.events: Example: respond to events, extend FAYT
<!-- contents:end -->

## scripting.concept | Scripting overview
src: 0362 | area: scripting
ui: Settings > Scripts... (`Prefs SCRIPTS`); Tools > Opus CLI / Ad-Hoc Script Editor; Help / Logs / Script Log
user-words: script a button, write a plugin, jscript vbscript, python in opus
what: Any installed ActiveX scripting language (JScript and VBScript are built in; Perlscript, Python from third parties). Scripts use the Opus object model (Listers, tabs, items, metadata, dialogs, clipboard, env vars, aliases, commands, columns, events, config). Three delivery forms: Rename Scripts (in Advanced Rename), Script Functions (in a button/menu/hotkey), Script Add-ins (event driven files in `/dopusdata/Script AddIns`).
notes: Output via `DOpus.Output` goes to the Script Log (Utility Panel / Other Logs). Diagnostic level: Advanced option `script_output_level`. Test with the CLI in script mode.
see: scripting.rename, scripting.functions, scripting.addins

## scripting.rename | Rename scripts (OnGetNewName)
src: 0362, 0363, 0408 | area: scripting
ui: Advanced Rename / Actions / Edit Script; embedded form in commands.renamescript
user-words: rename script, add image size to filename, skip files in rename script
what: Opus calls `OnGetNewName(GetNewNameData)` per file. `GetNewNameData.item` is an `Item`; `item.metadata` (compare to `"image"`), `item.name_stem`, `item.ext`, `meta.image.picwidth` / `picheight`. Return the new name (VBScript: assign to the function name), or `True` to skip the file. Legacy: `Rename_GetNewName(strFileName, strFilePath, fIsFolder, strOldName, ByRef strNewName)` and `Rename_GetNewName2` (return value, for languages without by-ref). Use `OnGetNewName` for new scripts. Example: `OnGetNewName = item.name_stem & " (" & meta.image.picwidth & "x" & meta.image.picheight & ")." & item.ext` for images, `True` otherwise.
options:
- custom fields in the rename dialog: implement `OnGetCustomFields(getFieldData)`; assign `getFieldData.fields.<name>` a value (Boolean = checkbox, string = text, number = numeric, `DOpus.Create.Vector(default, "A", "B")` = dropdown) and sub-properties `label`, `tip` (cue banner), `min`, `max`, `limit`. Read the user's values in `OnGetNewName` as `getNewNameData.custom.<name>`
- run from a preset with parameters: `Rename PRESET MyRename SCRIPTARG my_option:True my_field:moocow`
cmd: `Rename PRESET`, `Rename ... SCRIPTARG`

## scripting.functions | Script functions (button/hotkey scripts)
src: 0363 | area: scripting
ui: Command Editor > Advanced > Function type `Script Function`; tabs `Modifiers`, `Script Code`, `Resources`; `Run` button
user-words: javascript button, vbscript button, onclick
what: Entry point `OnClick(clickData)`. `clickData.func` has `sourcetab`, `command`, `Dlg`, `args`. Language dropdown, `Default` button saves a language template. Resources tab holds dialogs and string sets. Example: iterate `new Enumerator(clickData.func.sourcetab.files)`; select via `clickData.func.command.ClearFiles()`, `AddFile(item)`, `RunCommand("Select FROMSCRIPT DESELECTNOMATCH MAKEVISIBLE")`; set `clickData.func.command.deselect = false` to keep the selection.
cmd: `Select FROMSCRIPT`

## scripting.addins | Script add-ins and Script Management
src: 0363, 0367, 0368, 0370 | area: scripting
ui: Settings > Scripts... (`Prefs SCRIPTS`), Settings > Install Script... (`Prefs SCRIPTINSTALL`); folder `/dopusdata/Script AddIns`
user-words: install script, enable disable script, create script, share script, script package
what: Add-in = plain text file (extension = language: `.js`, `.vbs`), optionally bundled with icons into a package `.osp` (zip). Event driven: tab activate/deactivate, before/after folder change, view mode change, Lister open/close, etc.; also custom commands and columns. Drop files onto the Script Management list to install.
options:
- Script Management list: Name (checkbox enable; cog = configuration), Status (loaded or error), Version, File; groups if scripts set one; include-file scripts can be hidden (File menu). Menu per script: `Enable / Disable`, `About`, `Configure`, `Edit`, `Convert to Package`, `Share` (creates `.opusscriptinstall` with includes), `Delete`. Info pane: description, copyright, commands, columns, events
- Install: single files (`.js`, `.js.txt`), packages (`.osp`), install files (`.opusscriptinstall`, double-click works on a proper install). Results dialog lists new commands (drag to toolbars in Customize mode) and columns (drag onto a Details display)
- Create New Script dialog: `Script language` (JScript, VBScript; other languages: create files manually in Script AddIns), `Script name`, `Description`, `Copyright`, `Create an include file script`, `Shared include file`, `New style commands and columns` (Opus 12+), `Create as a script package`, `Create with a .txt extension`, event checkboxes (boilerplate), placeholders `NewScriptCommand` / `NewScriptColumn` to add commands and columns
cmd: `Prefs SCRIPTS`, `Prefs SCRIPTINSTALL`
see: scripting.templates, scripting.include

## scripting.include | Include files, modules, script packages
src: 0364, 0365, 0366 | area: scripting
ui: script editor
user-words: share code between scripts, split big script, osp package, icons for script commands
what: Include files share code between scripts: name starts `inc_`, same language as the user script, optional `OnInitIncludeFile` (required to make it shared; can set name, version, `shared`). Use `@include inc_myutils.js` or with minimum version `@include inc_myutils.js:1.2` (also `//@@include inc_myutils.js`). Private includes in a package work only inside it. Modules split one script: file named `<script>.<module>.osm` (for example `MyScript.js.Utilities.osm`), loaded automatically and joined in memory. Code in includes/modules counts as part of the add-in (`Script.vars` shared).
notes: Script package: zip with `.osp` suffix; add `.osp` to recognised Zip extensions (Zip Files page) to browse them. Icons: put an icon set (not zipped to `.dis`) in an `icons` sub-folder, use with `ScriptCommand.icon`. External resource files `.odxml`, loaded with `Script.LoadResources`. Installer files page in the manual is unfinished.

## scripting.templates | Custom new-script templates
src: 0369 | area: scripting
ui: `/dopusdata/Script AddIns/Templates`
what: Templates for other languages are INI-like files named `<Language>.<ext>` (for example `Python.py`). Sections `[language]` (comment marker, true/false), `[AddColumnIntro]`, `[AddColumn]`, `[AddCommandIntro]`, `[AddCommand]`, `[OnInit]`, `[OnInitIncludeFile]`, `[OnAboutScript]`, `[%event%]` generic. Tokens: `%object%`, `%column%`, `%command%`, `%script%`, `%copyright%`, `%minver%`, `%shared%`, `%desc%`, `%commands_and_columns%`, `%data%`, `%content%`.

## scripting.editor | Script editor, assets, snippets
src: 0370, 0371, 0372, 0373, 0374, 0399, 0400 | area: scripting
ui: Script Management > Edit; Preferences / Miscellaneous / External Tools (external editor)
what: Integrated editor for add-ins and packages: new scripts, modules and includes, tabbed code editor (syntax highlighting for VBScript/JScript), dialog editor, string editor, assets (icons/images), template event functions, snippets. Assets panel tabs: `Scripts` (code files, modules indented), `Resources` (dialogs, string sets), `Other` (icons/images in packages). Red dot marks unsaved assets. Snippets panel: per-language sets (`/dopusdata/Script Snippets`), `Paste New Snippet`, double-click or drag to copy/insert, also access event boilerplate. Code Editor page is unfinished in the manual.

## scripting.strings | String resources (multi-language)
src: 0399, 0407 | area: scripting
ui: script editor Resources tab > right-click script > New Strings
what: XML `<resource type="strings"><strings lang="deutsch"><string id="hello" text="Guten Tag!"/></strings>...`. Read with `DOpus.Strings.Get("hello")`. `lang` values = language library names in `/home/Language` (`english`, `deutsch`, `francais`, `espanol`, `cat`, `czech`...). Dialog text uses language overlays instead. In button scripts write the XML by hand.

## scripting.dialogs | Script dialogs (resources, simple, detached)
src: 0374-0398, 0401-0406, 0415 | area: scripting
ui: script editor or Command Editor > Resources tab > Dialogs > New Dialog (name is what the script uses)
user-words: custom window from script, form in button, message loop
what: Dialogs are XML resources designed in a Visual-Studio-like editor (Commands toolbar, Workspace, Control Palette, Properties). Controls: Static Text, Markup Text (HTML, links, `<tip>`), Edit (single line, multiline, number, double, password, cue text, read only, enter, max length, up/down), Button, Check Box (tri-state), Radio Button, Combo Box, List Box, List View, List Edit, Tab Control (hosts other dialogs), Group Box (header mode), Palette (normal, alpha, transparent, default), Date/Time Picker.
options:
- editor tools: Align (master control selected last), Center, Space Evenly, Make Same Size, Grid (Alt overrides snap), Tab Order (click controls in order), Check Mnemonics (`&` clashes), Language Overlays (title and size per language; no add/remove controls)
- common properties: `Name` (unique, used by script), `Title` (`&` mnemonic, `&&` literal), `Visible`, `Enable`, `Resize` (X, Y, W, H, shared width/height, Text), Case, Align Text, Vertical Align. Dialog: `Base Language`, `Font Face`, `Font Size` (0 = Preferences), `Opacity`, `OK Button`, `Cancel Button`, `Resizable`, `Minimize Button`, `Maximize Button`, `Accept Drops`. Button: `Default Button`, `Close Dialog`, `Return Value`, `Border`, `Image`, `Label`
- simple: `Set Dlg = DOpus.Dlg`, `Dlg.window = clickData.func.sourcetab`, `Dlg.template = "name"`, `ret = Dlg.Show` blocks until closed (buttons with Close Dialog return their Return Value). Read values: `Dlg.Control("name").value`, `Dlg.result`
- detached: `Dlg.detach = True` before `Show` (or `Dlg.Create` then `Show`), then loop `Set Msg = Dlg.GetMsg: If Not Msg.result Then Exit Do` handling `Msg.event` (`click`, `editchange`...), `Msg.control`, `Msg.data`, `Msg.focus`, `Msg.value`. Result of a detached dialog: `Dlg.result`. Interact: `Dlg.Control("x").enabled`, `.label`, `.value`, `.AddItem(s)`, `.RemoveItem(i)`. `Dlg.Control(control, dialog, tab)` for controls in tab child dialogs. Use `Msg.focus` to ignore changes the script itself made
notes: Message-box style dialogs need no resource: `dlg.message`, `title`, `buttons` (`"First|Second+Third|Cancel"`), `icon` (`info`, `warn`), `max` (adds text field, read `dlg.input`), `options(i).label/.state`, `choices` + `selection`, `list` (checkbox list), `menu` (popup menu: `dlg.choices = DOpus.Create.Vector("Choice 1","-",...)`, `dlg.menu = DOpus.Create.Vector(2,0,...)`).

## scripting.example.command | Example: add an internal command
src: 0410 | area: scripting
ui: file in `/dopusdata/Script AddIns`
what: In `OnInit(initData)` set `name`, `desc`, `copyright`, `default_enable`, then `var cmd = initData.AddCommand()` with `cmd.name`, `cmd.method`, `cmd.desc`, `cmd.label`, `cmd.template` (command template syntax, for example `NUMBER/N,FROM/K/N,NODESELECT/S`). Alternative: `OnAddCommands(AddCmdData)`. Implement the method (`OnSelectNewest(scriptCmdData)`): read `scriptCmdData.func.args.<ARG>` and test `args.got_arg.<arg>` first; operate on `func.sourcetab.files`; use `func.command` (`ClearFiles`, `AddFile`, `RunCommand("Select FROMSCRIPT DESELECTNOMATCH")`). The command is then usable like any internal command.
see: scripting.addins

## scripting.example.column | Example: add a column (and from shell properties)
src: 0411, 0412 | area: scripting
ui: script add-in file in `/dopusdata/Script AddIns`; Preferences / File Display Columns / Shell Properties (no-code)
what: `var col = initData.AddColumn()` (or `OnAddColumns(AddColData)`) with `name`, `method`, `label`, `justify`, `autogroup`, `autorefresh`, `match.push_back("Yes")`, `userdata`. Method gets `scriptColData` (`item`, `col`, `value`, `group`, `sort`, `userdata`): set `value`, optional `group` (grouping label) and `sort` key. Shell properties: `DOpus.FSUtil.GetShellPropertyList("dwg.*", "r")`, `FSUtil.GetShellProperty`, `Item.ShellProp(pkey)`. No-code alternative: Preferences / File Display Columns / Shell Properties.

## scripting.example.events | Example: respond to events, extend FAYT
src: 0413, 0416 | area: scripting
ui: script add-in file in `/dopusdata/Script AddIns`
what: Add-in implements `OnInit` plus handlers such as `OnAfterFolderChange(afterFolderChangeData)` (check `.result`, read `.tab.path`) and `OnDisplayModeChange(displayModeChangeData)`. To change settings run a command: `Set objCmd = DOpus.CreateCommand`, `objCmd.SetSourceTab(tab)`, `objCmd.IsSet("VIEW=Thumbnails")`, `objCmd.RunCommand("Set SORTBY=modified")`. FAYT extension scripts (type text, return matches) are described on the forum; the manual page is a stub.
cmd: `Set SORTBY=modified`
