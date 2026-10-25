# Evaluator language, contexts, wildcard and regex syntax

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- evaluator.concept: Evaluator (what it is)
- evaluator.grammar: Evaluator grammar, operators, variables
- evaluator.contexts: Where the evaluator can be used
- evaluator.ctx.columns: Evaluator context: columns and groups
- evaluator.ctx.filters: Evaluator context: filters, find, quick filter
- evaluator.ctx.infotips: Evaluator context: info tips, tiles, rename, generated names
- evaluator.ctx.buttons: Evaluator context: buttons and functions
- evaluator.ctx.menus: Evaluator context: rename control keys, status bar, header and tab menus
- evaluator.functions: Evaluator functions (pointer)
- patterns.standard: Standard pattern matching (wildcards)
- patterns.regex: Regular expression syntax
<!-- contents:end -->

## evaluator.concept | Evaluator (what it is)
src: 0417 | area: evaluator
ui: Preferences / File Display Columns / Evaluator Columns; Tools > Opus CLI (Script interpreter on, language `Evaluator`)
user-words: expression, formula, calculated column, evaluator code, dynamic button
what: Small expression language (JScript/C++-like) for places where a full script is too heavy: columns, groups, filters, info tips, button state, rename, status bar. No user-defined functions. Typically one or two lines. Example column code: `jobdate = RegEx(name, "Job-(.+)-(.+)-(..).xlsx", "\2"); jobdate = Left(jobdate, 4) + "-" + Mid(jobdate, 4, 2) + "-" + Right(jobdate, 2); return jobdate As date;`.
notes: Each context supplies variables (for example `name`). Experiment in the CLI. Version gate: the 2026 manual documents `for`/`while` loops, but an earlier test on 13.11 found loops a syntax error; check before using.
see: evaluator.grammar, evaluator.contexts

## evaluator.grammar | Evaluator grammar, operators, variables
src: 0417 | area: evaluator
ui: n/a
user-words: evaluator syntax, ternary, string operators, null coalescing
what: Left-to-right, BODMAS, parentheses; clauses end with `;`; comments `//`; `if (...) ... elseif ... else`, `{ }` scopes, ternary `a ? b : c` (chainable); loops `for`/`while` with braces, `break`, `continue`; strings in double quotes (`""` = literal quote); functions need `()` even without arguments. `return x;` or implicit return of the last value (must NOT end with `;`): `{=source=}` = `{=return source;=}`.
options:
- arithmetic: `+` (also concatenation) `-` `*` `/` `Mod`; assignment `=` (chained), `+=` `-=` `*=` `/=` `??=`; `++` `--` (pre and post)
- compare: `==` `!=` `<>` `>` `<` `>=` `<=`; logic: `And` `&&`, `Or` `||`, `Not` `!`; bitwise `&` `|` `~` `^`
- string: `~<` starts with, `~>` ends with, `~~` contains, `~!` not contains, `$=` word equals, `$<` word starts with, `$~` DOS wildcard match (`"directory opus" $~ "dir* op?s"`)
- other: `?:`, `As` conversion/format (`d = "2023-08-20" as date;`, `x As date`), `:` explicit init (`d: date = "2023-08-20";`), `[ ]` value container (`x = [a = 5; b = "hi";];` access `x.b`), `??` (null = empty string, 0 or false)
- types: `bool`, `int`, `uint`, `int64`, `uint64`, `double`, `date`, `str`, `path` (adding strings inserts path separators: `"C:\Windows" as path` + `"System32"`), `map`, `array`. Inferred: `15` uint, `-15` int, `5000000000` uint64, `1185.15` double. Date and path must be initialised from strings with `as` or `:`. Use `TypeOf()`; `Len()` for arrays; arrays are created with `ArrayCreate` (0-based)
- variables start with a letter (then letters, digits, `_`, `$`). External variables begin with `$` (`$name` from `@set name Jon`; scoped `$glob:name`); a missing `$` variable returns empty. Environment variables `%PROGRAMFILES%`
- constants: decimal, hex `0xe`, sizes `5kb` `21gb` `1.75tb` (binary), date suffix units `h m s d M y`, `true`, `false`, `pi`, `CRLF`
notes: Endless loop: abort via Task Manager (Help > Task Manager).

## evaluator.contexts | Where the evaluator can be used
src: 0417 | area: evaluator
ui: n/a
what: Evaluator Columns, Evaluator Groups, Filters and Find (textual filter starting with `=`, search field in Opus Find, quick filter), File Info Tips and Tiles (`{= =}`), Functions (button label/icon/tooltip/state, `@if`, `@eval`, command lines), Rename (`{= =}`), Rename Control Keys, Status Bar (`{= =}`), Column header context menus, Folder tab context menus.

## evaluator.ctx.columns | Evaluator context: columns and groups
src: 0418, 0419 | area: evaluator
ui: Preferences / File Display Columns / Evaluator Columns, Evaluator Groups
what: Columns: expression runs once per file/folder. Variables: all column keywords (use `Val("kw:with:colon")` when a keyword has invalid characters), `file_name` (real full name; `file` is the Name column value), `is_dir`, `operation` (`display`, `markup`, `sort`, `group`). Context function `HasLabel("green")`. Return value type per column Type setting. Return a different value for `operation == "sort"` to sort differently than shown.
notes: Groups: variables `scheme`, `value` (the value being grouped), `file_name`, `is_dir`, basic Date/Time/Name/Path/Size/General columns only. Return group index (static) or name (dynamic). A dynamic group may return a container `[ name = "B"; order = 0; collapse = true; markup = "<b>My Group</b>"; ]` to set order (any type), default collapse, header markup.

## evaluator.ctx.filters | Evaluator context: filters, find, quick filter
src: 0420 | area: evaluator
ui: filter control textual filter beginning with `=`; `Find FILTERDEF =...`; search field set to Opus Find; Filter Bar `Evaluator` option
what: Modes by variable: filter mode (return true to match), recurse mode (`subfolder` true: return true to descend; if the expression never reads `subfolder`, Opus always recurses), quick filter mode (`quick_filter` true: return true to show). Variables: column keywords, `dest`, `source`, `file_name`, `filter_args` (text after `?name:` in a quick filter), `groupcount`, `is_dir`, `opt_anyword`, `opt_ignore`, `opt_partial`, `opt_regex`. Must return bool. Example `=size>100kb` in the FAYT Opus search or Filter Bar; predefined `?bigfiles:5`.

## evaluator.ctx.infotips | Evaluator context: info tips, tiles, rename, generated names
src: 0421, 0434, 0435 | area: evaluator
ui: File Type Editor / Info Tip, Tiles Mode; Advanced Rename New name; Preferences / File Operations / Copying Files
what: Info tips and tiles: `{= expr =}` inserts text (multi-line allowed), `{!= bool =}...{!}` hide section (true shows); variables: column keywords plus `foldersize`, `foldercontents`, `infotip`, `dest`, `source`, `file_name`, `is_dir`. Rename: `{= expr =}` in New name; extra variables `oldname`, `newname`, rename keywords such as `parent`, `parentbase`; call `Cancel()` to skip the file. Generated copy/shortcut names: clause beginning with `=` in `File Operations / Copying Files / Copy of template` or `File Operations / Options / Use template when creating shortcuts`; variables `count` (generation, 0 first), `ext`, `name` (no extension); return the new base name.

## evaluator.ctx.buttons | Evaluator context: buttons and functions
src: 0422-0433 | area: evaluator
ui: Command Editor (Advanced) modifier lines; tooltip field starting with `=`
user-words: dynamic button label, button colour by state, hide button when, toggle state, icon by condition
what: Variables (Lister toolbars; some viewer-only): `dest`, `dest_shell`, `expanded`, `fullscreen` (viewer), `is_dual`, `is_right`, `key_repeat`, `lister_title`, `preparse_dummy` (pre-parse inside `@perfile`), `selbytes`, `seldirs`, `selfiles`, `selimage` (viewer), `selitems`, `selpath` (focus item; main toolbars may not refresh on selection change), `source`, `source_shell`, `tabcount`, `tabcount_other`, `tabindex`, `tabindex_other`, `totalbytes`, `totaldirs`, `totalfiles`, `totalitems`, `viewmode` (`largeicons`, `smallicons`, `list`, `details`, `power`, `thumbnails`, `tiles`), `original_label` (label context). Functions `IsChecked`, `IsEnabled`, `SysInfo` (for example `SysInfo("DarkMode")`).
options:
- `@label:=<expr>` (label; Spacer-with-label and Label fields take a plain `=expr` in the label field): `@label:=return "Hello!";`
- `@color:=text="#000000"; back="#ff0000";` (hex `#RRGGBB` or `RRR,GGG,BBB`, or `default` / `none`); light/dark: `@color:=SysInfo("DarkMode") ? { text="#ff0000"; back="#ffff00"; } : { text="#0000ff"; back="#00ffff"; }`
- `@icon`, `@iconp`, `@icon!` with `=expr` returning an internal icon name, `file.dll,40`, or an image path
- tooltip: type `=expr` in the tip field
- state: `@hideif` / `@showif` / `@disableif` / `@enableif` / `@toggle` (checked) with `=expr`; conditions `@if` / `@ifset` with `=expr` (true = run following lines)
- `@eval:=` inline clause that sets variables for other modifiers while updating the toolbar (not when the function runs); `@evalalways:=` also visible to the function itself (insertion codes, generated commands). Example: `@eval:=type = pathtype(source); fIsFileSystem = (type == "shell" || type == "filesys"); @enableif:=fIsFileSystem`
- insertion `{= expr =}` in a command line (external control codes are variables: `filepath`; quotes stripped unless you append `#q`, for example `allfilepath#q`)
- generated command: a line beginning with `=` whose returned string runs as part of the function (no string = line skipped); `@ctx:` + expression generates a dynamic button list
- `Go USEQUALKEYS` override: Advanced option `go_usequalkeys_eval`; variables `alt`, `ctrl`, `shift`, `cmdline`; return Go arguments (for example `if (shift) return "NEW";`)
- whole function in the evaluator: functions `GetItems`, `Dialog`, `Run`
cmd: `@label`, `@color`, `@icon`, `@hideif`, `@showif`, `@disableif`, `@enableif`, `@toggle`, `@if`, `@eval`, `@evalalways`, `@ctx`

## evaluator.ctx.menus | Evaluator context: rename control keys, status bar, header and tab menus
src: 0436, 0437, 0438, 0439 | area: evaluator
ui: Preferences / File Operations / Renaming Files / Control Keys; Status Bar page; Customize / Context Menus
what: Rename control keys: variables `dir`/`is_dir`, `exthidden`, `file_name`, `name`, `nameext`, `namestem`, `path`, `selstart`, `selend` (assignable), `valext`, `valstem`, `valleft`, `valright`, `valsel`, `value`. Return a string (new text), `true` (selection changed only) or `false` (no change). Functions `RestoreExt()`, `ShowTips()`. Status bar: status codes as variables (not images/graphs), `dual` (0 single, 1 left/top, 2 right/bottom), `path`. Column header menu: `frozenfields`, `group` (column id, -1 none; use in `Set GROUPBY=x,toggle`), `groupkey`, `groupname`, `groupscheme`, `header` (id of right-clicked column; `Set COLUMNSTOGGLE=x`), `headerindex`, `headerinsert`, `headeritem` (deprecated), `headerkey`, `headername`, `path`. Tab menu: `count`, `countdual`, `dual`, `path`, `right`, `sel` (-1 if not on a tab).
see: evaluator.functions

## evaluator.functions | Evaluator functions (pointer)
src: 0433, 0692-0745 | area: evaluator
ui: n/a
user-words: regex function, left mid right, date functions, array functions
what: Dozens of functions exist (strings, numbers, dates, arrays, file and system info, `RegEx`, `Match`, `Output`, `Arg`, `Val`, `Run`, `Dialog`, `GetItems`, `SysInfo`, `ES`, `Cancel`, `HasLabel`, `IsChecked`, `IsEnabled`, `TypeOf`, `Len`, `ArrayCreate`...). The one-line signature index is `references/evaluator.md` / manual Evaluator Functions reference (pages 0692 to 0745). Not distilled entry by entry here: grep `references/evaluator.md` first.

## patterns.standard | Standard pattern matching (wildcards)
src: 0441 | area: syntax
ui: used in filters, Find, Select, rename, copy filters, labels, folder format wildcard paths
user-words: wildcard syntax, not operator in wildcard, match extension list, grp
what: Default pattern system (regex only when explicitly enabled).
options:
- `?` one character; `*` any number (same as `#?`); `#x` repeat the next character or `(group)` zero or more (`a#xb`, `a#(xyz)b`); `|` or (`a(x|y|z)b`, `*.(gif|bmp|jpg)`); `~` not (`~(*.doc)`, `~(*.(gif|bmp))`); `( )` grouping and nesting (`NEW-((*.doc)|(*_backup_*))`); `[abc]` `[a-j]` `[a-dh-kq-]` set; `[~pqr]` negated set; `'` escapes a token (`a'#xb` matches only `a#xb`); `grp:Images` all extensions of a file type group (`Select grp:Images`, `(grp:Images|grp:Documents)`)
see: patterns.regex

## patterns.regex | Regular expression syntax
src: 0442 | area: syntax
ui: options named `Use regular expression`, Rename modes
user-words: regex rename, capture groups, repeat replace, backslash
what: Default flavour TR1 ECMAScript (Advanced option `regex_style` switches to the old flavour). Rename: Old name = pattern with capture groups `( )`, New name uses `\1`, `\2`; literal backslash in the new name = `\\`. Opus extension (Rename only): append `#` to the old name to repeat until the name stops changing, `#5` limits to five repeats. Example: `The (.*) Backup\.(.*)` to `\1.\2`; remove all spaces `(.*)\s(.*)#` to `\1\2`.
options:
- tokens: `^` start, `$` end, `.` any char, `*` 0+, `+` 1+, `?` 0 or 1, `|` alternation, `{n}` exact count, `[ ]` set, `[^ ]` negated set, `( )` group/capture, `\` escape; `\t \r \v \f \n \e`, `\xHH`, `\uHHHH`; classes `\w \W \s \S \d \D`. Unanchored patterns can match a substring
