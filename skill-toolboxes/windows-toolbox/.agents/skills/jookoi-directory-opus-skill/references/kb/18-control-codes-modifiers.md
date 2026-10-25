# External control codes and command modifiers

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- codes.overview: External control codes (basics)
- codes.filenames: Codes for passing file names
- codes.filenames.mods: Modifiers for file and path codes
- codes.paths: Codes for passing paths
- codes.dialogs: Codes that ask at run time
- codes.datetime: Date and time codes and format tokens
- codes.clipboard: Clipboard, DPI, variable and evaluator codes
- modifiers.list: Command modifier reference (A to P)
- modifiers.conditions: Conditional modifiers (@if family, @keydown, @set, @toggle)
<!-- contents:end -->

## codes.overview | External control codes (basics)
src: 0482 | area: codes
ui: Command Editor Function field
user-words: braces codes in button, pass filename, curly codes
what: `{...}` codes insert data into command lines of external programs and also internal commands (`CreateFolder {date|yyyyMMdd}`). Case-sensitive. Most have a short and a long form. Literal brace: `{{`. Modifiers are appended with `|` (`{file|noext|escwild}`).
notes: Explorer-compatible aliases (not in MS-DOS batch functions): `%1`, `%2`, `%L` = `{filepath}`, `%V` = `{filepath}` if anything is selected else `{sourcepath}`, `%*` = `{allfilepath}`.
see: codes.filenames, codes.paths, codes.dialogs, codes.datetime, codes.clipboard

## codes.filenames | Codes for passing file names
src: 0483 | area: codes
ui: Command Editor Function field
user-words: pass selected files, run once per file, all files one line, short names, destination files
what: Five choices combine into a code: full path or name only; one at a time or all at once; selected items required (`$` suffix, long form) or not; long or short (8.3) names; source or destination display.
options:
- one at a time, full path: `{filepath}` `{f!}` (command repeats per file; runs with empty value if none), `{filepath$}` `{f}` (needs a selection; the usual choice)
- one at a time, name only: `{file}` `{o!}`, `{file$}` `{o}`
- all at once (space separated, one run): `{allfilepath}` `{F!}`, `{allfilepath$}` `{F}`, `{allfile}` `{O!}`, `{allfile$}` `{O}`
- short names: `{filepathshort}` `{fs!}`/`{fs}`, `{fileshort}` `{os!}`/`{os}`, `{allfilepathshort}` `{Fs!}`/`{Fs}`, `{allfileshort}` `{Os!}`/`{Os}`
- destination display: add `dest` to the long name: `{filepathdest}` `{fd!}`/`{fd}`, `{filedest}` `{od!}`/`{od}`, `{allfilepathdest}` `{Fd!}`/`{Fd}`, `{allfiledest}` `{Od!}`/`{Od}`, and short+dest forms (`{filepathshortdest}` `{fsd}`, `{fileshortdest}` `{osd}`, `{allfilepathshortdest}` `{Fsd}`, `{allfileshortdest}` `{Osd}`)
notes: `!` short form = not required, plain short form = required.
see: codes.filenames.mods

## codes.filenames.mods | Modifiers for file and path codes
src: 0483, 0484 | area: codes
ui: after `|` inside the code
user-words: strip extension, escape wildcard, write list to temp file, parent folder of selection
options:
- name parts: `noext`, `ext` (with dot), `ext2` (no dot), `ext=<ext>` (replace), `nopath`, `noroot`, `noterm`, `notermdrive`, `noshort` (do not 8.3-shorten paths over 260), `..` parent (`..\..` higher), `\` drive root, `driveletter`, `drivelabel`, `wsl` (`/mnt/c/...`), `subdir` (colon becomes semicolon so a path nests under another), `pair` (+ `pairgotoparent`, `pairignorepair`, `pairuseanyway`; paths only)
- escaping: `escbackslash` (`\` to `\\`), `escforfilter` (= escbackslash + escwild), `escnl`, `escregex`/`escregexp`, `escwild`, `urlencode`, `cleanfilename` (illegal chars, separators and colons replaced), `cleanfilepath`, `cleanfilepathrel`
- list to file: `file` (space separated, quotes if spaces), `filem` (one per line), `fileq`, `filemq` (always quoted), `utf8`, `ucsle`, `ucsbe`, `nobom`, `cronly`, `lfonly`; `sep=<char>` separator for all-at-once codes
- `regex=<pattern>` only process matching; `regex=<pattern>|to=<new>` replace; `regex!=` keeps original on no match (quote patterns containing `|`)
notes: Example `Clipboard EXPANDNEWLINES SET {filepath|escbackslash}\n{filepathdest|escbackslash}`.

## codes.paths | Codes for passing paths
src: 0484 | area: codes
ui: Command Editor Function field
user-words: current folder code, destination folder code, left right path, app path, alias path
options:
- `{sourcepath}` `{s!}` / `{sourcepath$}` `{s}` (required), `{destpath}` `{d!}` / `{destpath$}` `{d}`, short: `{sourcepathshort}` `{ss!}`/`{ss}`, `{destpathshort}` `{ds!}`/`{ds}`; fixed sides (no required form): `{leftpath}` `{l}`, `{rightpath}` `{r}`, `{leftpathshort}` `{ls}`, `{rightpathshort}` `{rs}`
- `{apppath|winword.exe}` `{p}` (App Paths registry), `{apppathshort}` `{ps}`, `{alias|mydocuments}` `{A}` (`{alias|libraries}/Documents`), `{aliasshort}` `{As}`
- modifiers as in codes.filenames.mods (path subset)
notes: `{sourcepath|nopath|noterm}` = folder name. Source/destination follow the display states.

## codes.dialogs | Codes that ask at run time
src: 0485 | area: codes
ui: Command Editor Function field
user-words: ask for filename, prompt for text, choose from list, password prompt
options:
- `{dlgopen}` `{Rf}`, `{dlgmulti}` `{Rm}`, `{dlgsave}` `{RF}`, `{dlgfolder}` `{Rd}`, `{dlgstring}` `{Rs}`, `{dlgstringS}` `{RS}` (preselect default), `{dlgpassword}` `{Rp}`, `{dlgchoose}` `{Rc}`, `{dlgchooseS}` `{RC}` (sorted)
- templates: `{dlgopen|<title>|<default or *.jpg;*.bmp>}` (`type=folder` browses folders), `{dlgsave|Title|Default.txt|type=#Text Files!*.txt!Doc Files!*.doc}` (`#` adds All files), `{dlgfolder|<title>|<default>|expand}`, `{dlgstring|<message with \n>|<default>}` + `doublequotes` (for `"comment:{dlgstring|Enter Comment||doublequotes}"`), `keys` (rename keys), `{dlgpassword|msg||confirm}`, `{dlgchoose|<message>|default:High=320+Medium=256+Low=128}` (`+` separates, `=` gives the passed value, `notdefault:` literal prefix, double `++` / `==` for literals)
- file modifiers need the blank `<title>` and `<default>` slots (`{dlgopen|||noext}`)

## codes.datetime | Date and time codes and format tokens
src: 0486 | area: codes
ui: Command Editor; Advanced options `custom_date_format*`; metadata codes `D#`/`T#`
user-words: date in folder name, timestamp format, yyyyMMdd
options:
- codes `{date|fmt}` local, `{dateu|fmt}` UTC, `{time|fmt}`, `{timeu|fmt}`; no format = system default
- prefixes `D#` date, `T#` time, `A#` both (required when a code returns date and time, e.g. `{modified|D#yyyy}`); flags after the prefix: `I` invariant (North American) locale, `N` day names (Today, Monday; dates only), `M` milliseconds (times only, `{time|MHH:mm:ss}`)
- date tokens (case sensitive): `d` `dd` day, `D` `DD` weekday number (Sunday=1 / Monday=1), `ddd` `dddd` weekday name, `w` `ww` ISO week, `W` `WW` simple week, `M` `MM` `MMM` `MMMM` month, `y` `yy` `yyyy` year, `Y` `YY` `YYYY` ISO year, `gg` era
- time tokens: `h` `hh` 12-hour, `H` `HH` 24-hour, `m` `mm`, `s` `ss`, `t` `tt` AM/PM
notes: Example `CreateFolder {date|yyyyMMdd}`.

## codes.clipboard | Clipboard, DPI, variable and evaluator codes
src: 0487 | area: codes
ui: Command Editor
user-words: paste clipboard into command, dpi aware sizes, use stored variable
options:
- `{clip}` `{c}` clipboard text; sanitise as filename: `{clip|cleanfilename}`, `{clip|cleanfilepath}`, `{clip|cleanfilepathrel}`
- `{dpi}` current DPI (96 = 100%), `{dpi|%}` scale percent, `{dpi|25}` 96-dpi pixels to current, `{dpi|/50}` back
- `{$name}` value set with `@set` (example `@set name {dlgstring|Enter new folder name}` then `CreateFolder "{$name}"` and `Go "{$name}" NEWTAB`); `FileType NEW` sets `newfile`
- `{=expr=}` evaluator result

## modifiers.list | Command modifier reference (A to P)
src: 0488 | area: modifiers
ui: Command Editor Advanced mode, Modifiers dropdown. Each modifier on its own line (whole function) or in front of a command on the same line (that command)
user-words: at modifiers, button conditions, confirm dialog, run as admin
options:
- `@admin` (whole function UAC elevation; `@admin:notepad.exe {f}` one command; `@admin:no` / `@admin:yes` toggle prompts)
- `@async` / `@sync` (per command; defaults in commands.syncasync)
- `@clearoutput`, `@output <text>` (Script Log), `@codepage:1258` (DOS batch), `@color:=...` (evaluator)
- `@confirm:<message>|<OK text>|<Cancel text>` (omit Cancel text = no Cancel button; `\n` line break)
- `@ctx:=return "Go DRIVEBUTTONS";` dynamic button via evaluator (default Favorites Bar uses it with `LanguageStr()`)
- selection scope: `@dirsonly`, `@filesonly`, `@firstfileonly`, `@filesfromdroponly` (only dropped files), `@nodeselect` (keep selection), `@useactivelister`, `@resolvelinks`, `@perfile:begin` ... `@perfile:end` (run the block once per file instead of each command for all files), `@runonce:<cmd>`
- state: `@enableif` / `@disableif` / `@showif` / `@hideif` with a command test (`Set DUAL=toggle`, `!` negates) or `=expr` (`=Exists("/downloads/MonthlyExport.xls")`); path forms `@enableifpath` / `@disableifpath` / `@showifpath` / `@hideifpath` and `...pathr` (regex; aliases, env vars, `{apppath}` only with wildcards; keyword `shell` = hosted virtual folder; `!` negates); `@disablenosel` / `@hidenosel` (`files`, `dirs`, `minfiles=`, `maxfiles=`, `numfiles=`, `mindirs=`, `maxdirs=`, `numdirs=`, `type=<pattern>` must be last, `!` negates; combine with commas); `@hideblock:begin` / `@hideblock:end` (hide/show several buttons by the first one's test)
- `@eval:` / `@evalalways:` evaluator clause; `@externalonly`; `@functype:script|msdos|eval` (inside embedded function, with `@script:vbscript`)
- icons: `@icon:<name>,<command test>` list (View Mode Cycle: `Set VIEW=Cycle @icon:largeicons,Set VIEW=LargeIcons ...`; first true wins, button icon is default; `RECYCLEBINEMPTY` test auto-refreshes), `@iconp:` / `@icon!:` from a child of a three-button button (parent icon / parent and child), Ctrl+click the string in the editor to pick an icon
- `@if` / `@ifset` / `@ifexists` / `@ifsel` / `@ifpath` / `@ifpathr` / `@ifrunning` / `@keydown`: see modifiers.conditions
- `@label` (page unfinished in the manual; dynamic labels via evaluator, update with `@toggle:update`), `@leavedoswindowopen` (uses cmd `/K`, `%ComSpecLeaveOpenArg%` for other shells), `@logusage`, `@nocall`, `@nodrop` (must be first line), `@noexpandenv`, `@nofilenamequoting`, `@nolocalizefiles` (pass ftp:// path instead of downloading), `@noprogress`, `@norunbatch`, `@runbatch`

## modifiers.conditions | Conditional modifiers (@if family, @keydown, @set, @toggle)
src: 0488 | area: modifiers
ui: Command Editor Advanced mode
user-words: if else in button, different action with shift, set variable in button, toggle button state
options:
- `@if:<command line>` true if a button with that command would look highlighted (`@if:Set DUAL=on`); `@ifset:DUAL=on` is `@if:Set DUAL=on`; `@if:enabled <command>` would be enabled; `@if:$foo` / `@if:$glob:bar` variable set; `@if:SIDE=left|right` (File Display toolbar tied side); `@if:&&ARG&&=value` / `!=` user-command argument; `@if:else`; `@if:common` (always run). `!` negates
- `@ifexists:<path>` (`wild:` prefix for wildcard in last component, `!` negates, `else`, `common`), `@ifsel:numfiles=2 ... @ifsel:else ...`, `@ifpath:<wildcard>` / `@ifpathr:<regex>` (`else`, `common`; `C:\Program Files\*` = below it, not itself), `@ifrunning:notepad.exe` (wildcards or `regex:`)
- `@keydown:none|any|shift|ctrl|alt|ctrlshift|...` (`!` negates, `common`); `@keydown:shift:Opens a new window` adds tooltip text
- `@set name=value`, `@set name` (delete); scopes `src:`, `dst:`, `left:`, `right:`, `tab:`, `lst:`, `glob:`; add `!` after the scope to persist across sessions (`glob!:name`); use `{$name}` or `$name` in tests
- `@toggle:invert`, `@toggle:disable`, `@toggle:if <test>[;<test>]` (default highlight follows the first command; `if&` adds to it; variable tests need the modifier on the first line; `@toggle:update` forces buttons, labels and status bars to refresh after variable changes); evaluator form `@toggle:=expr`
- `@requires:<flags>` `s` want source, `S` need source, `d` want destination, `D` need destination, `L` need Lister, `f` want files, `F` want folders, `N` need entries, `w` no source/destination swap, `u` override auto "needs entries"
- `@runmode:min|max|hide`, `@script:<language>`, `@sendkey:win+v` (qualifiers shift, ctrl, alt, win; named keys), `@useimagedata` (viewer: `Image CONVERT` uses the displayed bitmap; `NOUSEIMAGEDATA` overrides)
cmd: `@if`, `@set`, `@toggle`
