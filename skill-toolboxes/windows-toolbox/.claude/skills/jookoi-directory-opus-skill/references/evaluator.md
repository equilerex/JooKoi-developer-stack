# Evaluator

The v13 expression language for small logic in columns, groups, filters, info tips, buttons, rename and the status bar. Where codes like `{=..=}` sit inside other code systems: `references/codes.md`.

## User says → concept

| User words | DOpus concept | Where / how |
|---|---|---|
| "a column showing part of the file name" | Evaluator Column with `RegEx()` | `Preferences / File Display Columns / Evaluator Columns` |
| "how old is the file", "days since modified" | Evaluator Column with `Age()` | same page, caching off |
| "group files my own way" | Evaluator Group scheme | `Preferences / File Display Columns / Evaluator Groups` |
| "filter with a formula", "show only files where..." | evaluator filter, text starting with `=` | filter bar, FAYT, search field, `Find FILTERDEF =...` |
| "button text shows how many are selected" | dynamic label | `@label:=` in the button function |
| "button changes color / icon / is greyed out" | `@color:=`, `@icon:=`, `@enableif:=`, `@hideif:=`, `@toggle:=` | button function |
| "button does X if shift held / if in a zip" | conditional behavior | `@if:=KeyDown("shift")` |
| "compute part of a command" | insertion code | `{=expr=}` inside a command line |
| "build the whole command in code" | generated command line | line starting `=` |
| "rename using a formula" | rename insertion | `{=expr=}` in the new name field |
| "custom Ctrl key in inline rename" | Rename Control Keys | `Preferences / File Operations / Renaming / Control Keys` [unverified path] |
| "Copy of name pattern" | generated file names | `Preferences / File Operations / Copying Files / Copy of template`, value starts with `=` |

## Model

- An expression language with JScript/C++ style grammar. No user-defined functions. Much lower overhead than a script, so it can run per file (columns, filters) or on every toolbar refresh (labels, states).
- Each context feeds it different variables and expects a specific return type. Same functions everywhere, plus a few context-specific ones.
- Try code in `Tools / Opus CLI / Ad-Hoc Script Editor`: turn on Script Interpreter and pick Evaluator. `Ctrl+Space` lists functions.
- Emergency stop: `Set EVALUATORDISABLE=Toggle` (until restart or toggled again).
- Choose it over a script when the logic fits in a few lines and only reads info. Choose a script for state, events, or real file manipulation.

## Contexts

| Context | Entry syntax | Key variables | Return |
|---|---|---|---|
| Evaluator Column | code field in the column editor | all column keywords, `file_name`, `is_dir`, `operation` | value for the column Type. `operation` is `display`, `sort`, `group` or `markup` |
| Evaluator Group | scheme Definition tab | basic column keywords only (no extracted metadata), `file_name`, `is_dir`, `scheme`, `value` | static: group number (`0` = Unspecified). dynamic: name, or `[name=..; order=..; collapse=..; markup=..;]` |
| Filter / Find / quick filter | text starting `=` | column keywords, `file_name`, `is_dir`, `source`, `dest`, `subfolder`, `quick_filter`, `filter_args`, `groupcount`, `opt_anyword`, `opt_ignore`, `opt_partial`, `opt_regex` | bool: match / recurse into folder / show |
| Info tip, tile | `{=expr=}`, `{!=expr=}..{!}` | column keywords, `foldersize`, `foldercontents`, `infotip`, `file_name`, `is_dir`, `source`, `dest` | str to insert, or bool (true shows the section) |
| Button label | `@label:=expr`. Label and Spacer fields: `=expr` | button variables, `original_label` | str |
| Button color | `@color:=text="#000000"; back="#ff0000";` | button variables | set `text` and `back` (`#RRGGBB`, `R,G,B`, `default`, `none`) |
| Button icon | `@icon:=`, `@iconp:=`, `@icon!:=` | button variables | icon set name, `file.dll,40`, or image path |
| Button tooltip | tooltip field starting `=` | button variables | str |
| Button state | `@hideif:=` `@showif:=` `@disableif:=` `@enableif:=` `@toggle:=` | button variables | bool |
| Conditional lines | `@if:=expr`, `@ifset:=expr` | button variables | true runs the following lines |
| Eval clause | `@eval:=` (refresh only), `@evalalways:=` (also at run time) | button variables | sets variables for later lines |
| Insertion in command | `{=expr=}` | button variables plus every control code as a variable (`filepath`, `allfilepath`) | str inserted |
| Generated command | line starting `=` | as insertion | str run as a function line. Non-string = line skipped |
| Dynamic button list | `@ctx:=return "Go DRIVEBUTTONS";` | as above | command that generates buttons |
| Whole function | function type Evaluator (`@functype:eval`) | button variables | uses `GetItems()`, `Dialog()`, `Run()` |
| Rename | `{=expr=}` in New name | column keywords, `parent`, `parentbase`, `file_name`, `is_dir`, `oldname`, `newname` | str. `Cancel()` skips this file |
| Rename control keys | key definition | `value`, `valstem`, `valext`, `valsel`, `valleft`, `valright`, `selstart`, `selend`, `name`, `namestem`, `nameext`, `path`, `is_dir`, `exthidden` | new str, `true` (only selection changed) or `false` |
| Generated file names | template starting `=` | `name` (no extension), `ext`, `count` | new name, Opus adds the extension |
| Status bar | `{=expr=}`, `{h=expr=}..{h!}` | all numeric status codes (`tf`, `sf`, `sba`), `dual` (0/1/2), `path`. Names with `:` via `Val()` | str, or bool (true hides) |
| Column header menu | any `=` code in that menu | `header`, `headerkey`, `headername`, `headerindex`, `headerinsert`, `group`, `groupkey`, `groupname`, `groupscheme`, `frozenfields`, `path` | per modifier |
| Tab context menu | any `=` code in that menu | `count`, `countdual`, `dual`, `right`, `sel`, `path` | per modifier |
| `Go USEQUALKEYS` override | Advanced option `go_usequalkeys_eval` | `alt`, `ctrl`, `shift`, `cmdline` | Go arguments, e.g. `if (shift) return "NEW";` |

### Button variables (shared by all button and function contexts)

| Variable | Type | Meaning |
|---|---|---|
| `source`, `dest` | path | source / destination folder |
| `source_shell`, `dest_shell` | bool | folder is an Explorer-hosted virtual folder |
| `selitems`, `selfiles`, `seldirs`, `selbytes` | uint / uint64 | selection counts and bytes |
| `totalitems`, `totalfiles`, `totaldirs`, `totalbytes` | uint / uint64 | totals |
| `selpath` | str | focused selected item (viewer: current image) |
| `is_dual`, `is_right` | bool | dual display / source is right or bottom |
| `tabcount`, `tabcount_other`, `tabindex`, `tabindex_other` | uint | tabs |
| `viewmode` | str | `largeicons` `smallicons` `list` `details` `power` `thumbnails` `tiles` |
| `expanded` | uint | expanded folders |
| `lister_title` | str | Lister title |
| `key_repeat` | bool | launched by a held-down key |
| `preparse_dummy` | bool | pre-parse call inside `@perfile` |
| `fullscreen`, `selimage` | bool | viewer only |

## Syntax

- Clauses end with `;`. `//` comments. Literal strings use `"`, a quote inside is `""`.
- `return x;` or implicit return: the last value is returned when the code does not end in `;`. `{=source=}` equals `{=return source;=}`.
- `if (..) ..; elseif (..) ..; else ..;` with `{ }` for multi-clause branches. Ternary `c ? a : b`, chainable.
- `for (a = 0; a < 10; a++) { }` and `while (..) { }` with `break` and `continue` are in the 2026-01 manual but not in 13.11: a `for` or `while` anywhere in the code is a syntax error, even when the result is a constant [tested 13.11]. The 13.0 notes say the evaluator has no loops, so loops arrived in a later 13.x. Check the installed version before using them. Multiple statements with `;` and `return` work on 13.11.
- Variables need no declaration. Names start with a letter. `$name`, `$glob:name`, `$lst:name` read or write `@set` variables (missing ones return empty). `%USERNAME%` reads environment variables.
- Constants: `0xe`, `5kb` `21gb` `1.75tb` (binary units), date offsets `h` `m` `s` `d` `M` `y` (e.g. `Now() - 7d`), `true` `false` `pi` `CRLF`.

### Operators

| Group | Operators |
|---|---|
| math | `+` (also string concat) `-` `*` `/` `Mod` |
| assign | `=` (chainable) `+=` `-=` `*=` `/=` `??=` `++` `--` |
| compare | `==` `!=` `<>` `>` `<` `>=` `<=` |
| logic | `And` `&&`, `Or` `\|\|`, `Not` `!` |
| bitwise | `&` `\|` `~` `^` |
| string | `~<` starts with, `~>` ends with, `~~` contains, `~!` not contains, `$=` word equals, `$<` word starts with, `$~` DOS wildcard match |
| other | `?:`, `??` (fallback if empty/0/false), `As`, `:` typed init, `[ ]` container, `.` member |

No null exists: "null" for `??` means empty string, `0` or `false`.

### Types and `As`

Types: `bool`, `int`, `uint`, `int64`, `uint64`, `double`, `date`, `str`, `path`, `map` (value container), `array`. Inferred: `15` uint, `-15` int, `5000000000` uint64, `1.5` double, `"x"` str.

- `date` and `path` must be explicit: `d = "2023-08-20" as date;` or `d: date = "2023-08-20";`. String to date accepts `YYYY-MM-DD`, `YYYY-MM-DD HH:MM:SS`, `HH:MM:SS` (24h).
- `path` + str inserts the separator: `("C:\Windows" as path) + "System32"` gives `C:\Windows\System32`.
- Format with `As "<code>"`:

| Code | Result |
|---|---|
| `"D#dd-MMM-yyyy"`, `"T#HH:mm"`, `"A#yyyyMMddHHmmss"` | date/time (tokens in `references/codes.md`) |
| `"#3"` or `"%03"` | zero-pad to 3 |
| `"%8"` / `"%-8"` | right / left justify |
| `"%.2"` / `"%.02"` | max / fixed decimals |
| `"%x"` / `"%X"` | hex |
| `num` | locale number `1,055` |
| `size`, `szt`, `szi`, `szd` | auto size (user / traditional / binary / decimal units) |
| `kb` `mb` `gb` `tb`, `kib` `mib`.., `kbd` `mbd`.. | fixed unit, e.g. `"%.3kb"` |

### Containers and arrays

- `x = [a = 5; b = "hi";];` then `x.b`. Used for group return values and `Dialog()` results (`.choice`, `.text`).
- Arrays only via `ArrayCreate()`, `Explode()`, `GetItems()`, multi-file `Dialog()`. Index from 0. `Len(arr)` = size.

## Item values in per-file contexts

- Every column keyword (Keywords for Columns, extract 0801) is a variable: `name`, `ext`, `size`, `modified`, `modifieddate`, `createddate`, `path`, `fullpath`, `parent`, `type`, `desc`, `attr`, `label`, `rating`, `keywords`, `picwidth`, `picheight`, `datetaken`, `cameramodel`, `mp3artist`, `mp3album`, `mp3title`, `mp3track`, `mp3year`, `mp3genre`, `duration`, `title`, `author`, `pages`, `md5sum`.
- Shell and plugin columns: `sh:svnstatus`, `opus7zip:packed`, `zip:compsize`. Names with `:` or a leading digit need `Val("sh:svnstatus")`, `Val("35mmfocallength")`.
- `name` is what the Name column shows (extension may be hidden). `file_name` is always the full real name.
- Missing metadata: test with `IsSet("picwidth")` before use.
- Evaluator Columns get keyword `eval:<keyword>`, e.g. `Set COLUMNSTOGGLE=eval:imagebytes`. Groups activate with `Set GROUPBY=name GROUPSCHEME=first_letter`.

## Function index

String

| Function | Meaning |
|---|---|
| `Left(s,n)` `Right(s,n)` `Mid(s,start[,len])` | substrings, 0-based start |
| `Len(s\|arr)` | length or element count |
| `InStr(s,find[,start][,flags])` | position or -1. Flags `c` case, `r` last, `w` whole word, `i` diacritics, `s` exact start |
| `Count(s,sub[,"c"])` | occurrences |
| `Replace(s,find,rep[,start][,count][,case])` | plain replace |
| `RegEx(s,pat[,rep]..[,0][,flags])` | whole-string regex. No `rep`: bool. With `rep`: result, input unchanged on no match. Flags `c`, `e` (empty on no match). `#` after a pattern = replace all |
| `RegExS(..)` | same as `RegEx` but searches inside the string |
| `Match(s\|arr,pat[,flags])` | wildcard match (`r` regex, `c` case, `f` file type groups, `p` partial, `h` path slashes). Arrays: index or -1, `g` string, `y` all |
| `StrCmp(a,b[,len][,"c"])` | compare, 0 = equal |
| `Trim` `LCase` `UCase` `Reverse` | basic transforms |
| `Capitalize(s[,type])` | 0 first letter, 1 all words, 2 also extensions |
| `Truncate(s,len[,type])` | 0 right, 1 left, 2 middle (default for paths) |
| `Format("%1 of %2",a,b)` | positional insertion, `%%` literal |
| `Concat(count,s1,s2..[,joiner][,final])` | join non-empty strings |
| `Space(n)` `String(n,ch)` `Chr(code)` `Asc(s)` | build strings, char codes |
| `ES("a\nb")` | expand `\n` `\t` `\"` `\x..` `\u....` escapes |
| `EscapeWild(s[,flags])` | escape wildcards (`r` regex, `b` backslashes) |
| `URLEncode(s[,flags])` | `d` decode, `g` Google (`+`), `r` RFC |
| `MakeLegal(s[,flags])` | fix illegal path chars. `n` as name, `s` subfolder, `f` forward slashes |
| `IsAlpha` `IsDigit` `IsLower` `IsUpper` `IsPunct` `IsSpace` | whole-string char class tests |

Path and file

| Function | Meaning |
|---|---|
| `FilePart(p[,n])` `Stem(p)` `FileExt(p)` | name / name without extension / `.ext` |
| `Parent(p[,levels])` `Root(p)` `Count(p)` | parent, root, component count |
| `IsParent(parent,child)` | levels between, 0 = not a parent |
| `IsPath(p)` | fully qualified |
| `Exists(p[,"w"])` `IsFile(p)` `IsDir(p)` | existence tests (`w` wildcard in last part) |
| `PathType(p)` | `filesys` `shell` `coll` `ftp` `lib` `mtp` `plugin` `zip` |
| `DisplayName(p[,flags])` | display name. `f` last part, `p` parsing path, `r` real location |
| `Resolve(p[,flags])` | expand aliases and `%vars%`. `s` shortcut, `j` junction, `p` paired folder |
| `TabPath(index[,side])` | path of tab n, side `l` `r` `s` `d` |
| `RecycleBin([mode][,drive])` | non-empty bool, `s` size, `c` count |

Date and math

| Function | Meaning |
|---|---|
| `Now()` | current date/time |
| `Age(date[,units])` | now minus date, default days |
| `DateDiff(units,d1,d2)` | difference. Units: `yyyy` years, `q` quarters, `m` months, `d`/`y` days, `w` weeks, `ww` calendar weeks, `h`, `n` minutes, `s` |
| `DatePart(date,part)` | one token (number) or a pattern (string), e.g. `DatePart(d,"yyyy-MM")` |
| `ParseDate(s[,format])` | parse with picture `"dd/MM/yyyy"` or flag sum, false on failure |
| `AdjustDate(date,tzIn,tzOut)` | time zone shift (`"UTC"`, `"local"`, `"Australia/Sydney"`, minutes) |
| `Abs` `Ceil` `Floor` `Round` `Sqrt` `Cbrt` `Pow` `Hypot` `Max` `Min` `Rnd` | math |
| `Sin` `Cos` `Tan` `Atan` `DegToRad` `RadToDeg` | trig (radians) |

Array and variable

| Function | Meaning |
|---|---|
| `ArrayCreate(..)` `ArrayCopy(a[,i1][,i2])` | create / copy range |
| `ArrayGet(a,i)` `ArraySet(a,i,v)` `ArrayPush(a,v)` `ArrayPop(a)` `ArrayErase(a[,i1][,i2])` | element access |
| `ArraySort(a)` `ArrayRev(a)` | in place |
| `Explode(s[,seps][,limit][,flags])` / `Implode(a[,sep][,flags])` | split / join (`q`/`Q` quote handling) |
| `Select(i,v0,v1..)` | pick the i-th value |
| `IsSet("name"..)` | all named variables exist |
| `Val("name"[,deref])` | read a variable by name string |
| `TypeOf(v)` | type name |
| `Swap(a,b)` | swap two variables |
| `DumpVars([regex..])` | list variables, for debugging |

Lister, UI and system

| Function | Meaning |
|---|---|
| `IsChecked(cmd..)` / `IsEnabled(cmd..)` | would a button with that command look checked / enabled. Several commands: index of first hit |
| `IsSelected(pattern..)` | selected items match (`dirs:`, `files:` prefixes) |
| `FileCount([selected,]pattern..)` | count matching items |
| `GetItems([flags])` | array of paths. `s` selected, `f` files, `i` folders, `l` `r` `d` side |
| `KeyDown("shift"..)` | qualifiers held (`none` `shift` `ctrl` `alt`) |
| `Dialog(type,..)` | `r` buttons (id, Cancel = 0), `s`/`sp` text (`.choice`, `.text`), `c`/`cs` choice, `f`/`fm`/`fv` file, `d` folder |
| `Run(cmd[,flags][,files])` | run Opus or external command. `a` async, `o` capture output, `e` elevate, `d` DOS, `s` script, `w` WSL |
| `Output(s[,clear])` | write to the script log |
| `Clip()` `ClipFormat([type][,wantcut])` `SetClip(s)` | clipboard text / type (`files` `files_cut` `image` `text`) / set |
| `SysInfo(prop)` | `DarkMode`, `DPI`, `Language`, `ListerCount`, `MouseMonitor`, `Version`, `VerHigh`, `VerLow`, `VerBuild` |
| `Running("excel.exe")` `FindWindow(class[,title][,"r"])` | process / window exists |
| `Elapsed(name[,ms][,reset])` | named global timers |
| `Arg("NAME")` | user command argument value |
| `AbortFunc()` | stop the rest of the function |
| `LanguageStr(id)` | UI translation string |

Context-only: `HasLabel("green")` (Evaluator Columns), `Cancel()` (rename), `RestoreExt()` and `ShowTips()` (rename control keys).

## Recipes

Column from a regex of the name (Type Text, turn on Refresh if name changes). Name like `Job-19230-20230605-XE.xlsx`:
```
pat = "Job-(.+)-(.+)-(..)\.xlsx";
if (!RegEx(name, pat)) return "";
d = RegEx(name, pat, "\2");
return (Left(d, 4) + "-" + Mid(d, 4, 2) + "-" + Right(d, 2)) as date;
```
Set Type to Date for the last form. Return `RegEx(name, pat, "\1")` with Type Text for the job ID.

Age column in days (Type Unsigned, turn off Cache column values, set Refresh):
```
if (operation == "sort") return modifieddate;
return Age(modifieddate);
```
Precise `yy:ddd:hh:mm:ss` (forum, lxp):
```
secs = Age(modifieddate, "s");
ss = secs Mod 60 As "#2";
mm = secs / 60 Mod 60 As "#2";
hh = secs / 60 / 60 Mod 24 As "#2";
dd = secs / 60 / 60 / 24 Mod 365 As "#3";
yy = secs / 60 / 60 / 24 / 365 As "#2";
return yy + ":" + dd + ":" + hh + ":" + mm + ":" + ss;
```

First artist from a multi-value tag, as a column or in a rename preset `{=..=}\{mp3album}\*`:
```
IsSet("mp3artist") ? Trim(ArrayGet(Explode(mp3artist, ";"), 0)) : ""
```
The accepted forum answer uses the keyword `mp3artists`, which the manual keyword list lacks. Both keywords return the same raw tag on 13.11 [tested]. Prefer the documented `mp3artist`.

Button label with selection count:
```
@label:=selitems > 0 ? original_label + " (" + selitems + ")" : original_label
```

Conditional button (enabled only in real folders, label follows):
```
@eval:=t = PathType(source); fs = (t == "shell" || t == "filesys");
@enableif:=fs
@label:=fs ? ("Open " + FilePart(DisplayName(source)) + " in Explorer") : original_label
explorer.exe "{sourcepath}"
```

Shift-click does something else:
```
@if:=KeyDown("shift")
Copy MOVE
@if:else
Copy
```

Command parameter computed in place, quotes kept:
```
"C:\Tools\app.exe" {=allfilepath#q=}
Prefs LAYOUT="{=KeyDown("shift") ? Val("$lst:prevLayout") : Val("$lst:nextLayout")=}"
```

Dark mode aware button colors:
```
@color:=SysInfo("DarkMode") ? { text="#ff0000"; back="#ffff00"; } : { text="#0000ff"; back="#00ffff"; }
```

Quick filter (filter bar or FAYT): `=!is_dir && size > 100mb`.

Group by first letter (dynamic groups):
```
c = UCase(Left(value, 1));
return (IsAlpha(c) || IsDigit(c)) ? c : "";
```

Copy-of template: `=name + " (" + (count + 1) + ")"`.

Status bar warning: `{h=tf < 1000=}<#ff0000>Large folder</#>{h!}`.

## Pitfalls

- "Unknown function" or syntax error for something the manual documents → the manual (2026-01) is newer than the installed 13.11. Check `SysInfo("VerBuild")` and update, or rewrite with older functions.
- Implicit return lost → the last clause ends with `;`. Drop it or use `return`.
- `@icon`, `@hideif`, `@enableif`, `@toggle`, `@if` treat text without a leading `=` as their non-evaluator syntax. Always write `@x:=`.
- Variables from `@eval` missing when the button runs → `@eval` only runs on toolbar refresh. Use `@evalalways`.
- Paths with spaces break the command → control-code variables are unquoted inside `{=..=}`. Use `filepath#q`, `allfilepath#q`.
- Label on the main toolbar does not follow the selection → main toolbars are not always refreshed on selection change. Put the button on a file display toolbar or accept the lag.
- Age or time-based column never updates → turn off Cache column values and set Refresh.
- Column stale after rename → turn on Refresh if name changes (Refresh if file changes for content).
- Group code returns nothing for metadata → Evaluator Groups only see basic file info, not extracted metadata.
- `DateDiff`/`Age` unit `y` is days, `yyyy` is years, `n` is minutes, `m` is months.
- `Age()` with coarse units rounds. Compute from seconds for exact splits.
- Mixed quotes: inside a string a quote is `""`. In XML (`<evalcolumn>`) it becomes `&quot;`.
- Status bar `{h=..=}` hides on true, info tip `{!=..=}` shows on true.
- Runaway code → `Set EVALUATORDISABLE=Toggle`. An endless loop can also be ended with Task Manager.
- Sharing: column and group editors have a share button that copies XML (`<evalcolumn ..>`) to the clipboard and pastes it back. That is the normal way to install forum snippets.
