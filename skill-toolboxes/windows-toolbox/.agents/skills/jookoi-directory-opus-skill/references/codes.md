# Codes: the small languages inside commands, status bar and info tips

Syntax for `{...}` codes in button command lines, status bar definitions, info tips and tiles, plus wildcard patterns and `@set` variables. Evaluator syntax lives in `references/evaluator.md`. Internal command arguments live in `references/commands.md`.

## User says → concept

| User words | DOpus concept | Where / how |
|---|---|---|
| "pass the selected file to my program" | external control code `{filepath}` / `{f}` | button command line, e.g. `notepad.exe {f}` |
| "all selected files in one go" | all-at-once code `{allfilepath}` / `{F}` | runs once, names separated by spaces |
| "the other panel's folder" | `{destpath}` / `{d}` | dual display only, `{d}` skips the command if no destination |
| "ask me for a name when I click" | dialog code `{dlgstring}` | `CreateFolder "{dlgstring\|Folder name}"` |
| "today's date in the name" | `{date\|yyyy-MM-dd}` | any command line |
| "remember a value between clicks" | `@set glob!:name=value` + `{$glob:name}` | scoped variable, `!` persists to disk |
| "the bar at the bottom", "show free space / selection size" | status bar codes | `Preferences / File Displays / Status Bar` |
| "hide that part when nothing is selected" | status bar hide sections `{h!}` | wrap the section |
| "tooltip when hovering a file" | info tip definition | File type editor, Info Tip page |
| "text under thumbnails in tiles view" | tile definition | File type editor, Tiles Mode page |
| "match these file names", "*.jpg or *.png" | standard wildcard syntax | `*.(jpg\|png)` |

## Model

Several separate code systems share the `{...}` look but are parsed by different parts of Opus. A code that works in one place usually does nothing in another. External control codes are case-sensitive (`{f}` is not `{F}`). A literal `{` is written `{{` in command lines and in the status bar. The evaluator plugs into most of them through `{=...=}` (see `references/evaluator.md`). Date/time format tokens are shared by all of them.

## Which code system applies where

| Place | Code system | Conditional / hide syntax | Evaluator hook |
|---|---|---|---|
| Button, hotkey, menu command line | external control codes (`{f}`, `{s}`, `{dlg...}`, `{date\|..}`, `{clip}`, `{$var}`), `@` modifiers | `@if`, `@ifset`, `@ifsel`, `@ifpath` etc. (see `references/commands.md` for internal commands) | `{=expr=}` inserts text, line starting `=` generates the whole line, `@if:=expr` |
| Status bar | status bar codes (`{sf}`, `{dfa}`, `{bg+..}`, `{var:scope:name}`, `{ifpath:..}`) | `{h!}..{h!}`, `{h#}`, `{h?}`, `{h=expr=}..{h!}` | `{=expr=}`, status codes are evaluator variables (`tf`, `sf`) |
| Info tip / tile | column keywords from Keywords for Columns (`{picwidth}`, `{modified\|D#yyyy}`) plus `{foldersize}`, `{foldercontents}`, `{thumbnail}`, `{infotip}` | `{!kw1&kw2}..{!}`, a line with only empty codes is dropped | `{=expr=}`, `{!=expr=}..{!}` |
| Rename (new name field) | column keywords with `\|D#..` / `\|#n` formatting, `*` wildcards, regex mode | none | `{=expr=}`, `Cancel()` skips a file |
| Filter, Find, quick filter, `FILTERDEF` | standard wildcard syntax or regex, textual filter keywords | filter clauses | text starting `=` runs the evaluator per file |
| Select / Copy patterns in commands | standard wildcard syntax, `grp:` groups | none | none |

## External control codes: filenames

Short codes combine a base with suffixes. Long form spells the same thing out and ends in `$` for the "required" form.

| Base (short / long) | Passes | Repeat behavior |
|---|---|---|
| `{f}` / `{filepath$}` | full path of each selected item | command runs once per item |
| `{o}` / `{file$}` | name only of each item | once per item |
| `{F}` / `{allfilepath$}` | full paths of all items | runs once, names space-separated |
| `{O}` / `{allfile$}` | names only of all items | runs once |

| Suffix | Meaning | Example |
|---|---|---|
| `!` (short) / no `$` (long) | selection not required: command still runs, code expands to empty | `{f!}` = `{filepath}` |
| no `!` (short) / `$` (long) | selection required: command is skipped if nothing selected | `{f}` = `{filepath$}` |
| `s` / `short` | 8.3 short names | `{fs}` = `{filepathshort$}` |
| `d` / `dest` | items selected in the destination display | `{fd}` = `{filepathdest$}`, `{Osd!}` = `{allfileshortdest}` |

Explorer compatibility: `%1` `%2` `%L` = `{filepath}`, `%V` = `{filepath}` or `{sourcepath}` when nothing is selected, `%*` = `{allfilepath}`. Not usable in MS-DOS batch functions.

### Filename and path modifiers

Add after `|`, chain with more `|`: `{file|noext|escwild}`.

| Modifier | Effect |
|---|---|
| `noext` / `ext` / `ext2` | strip extension / only `.jpg` / only `jpg` (folders never have extensions) |
| `ext=tmp` | replace extension |
| `nopath` | last path component only (folders keep trailing `\`) |
| `noroot` | drop the root (`C:\`, UNC share, FTP site) |
| `noterm` / `notermdrive` | drop trailing `\` / also on a drive root (`C:`) |
| `..` / `..\..` | parent / grandparent of the item or path |
| `\` | drive root (`C:\`) |
| `driveletter` / `drivelabel` | `C` / volume label |
| `subdir` | `C:` becomes `C;` so the path can be nested under another (backups) |
| `cleanfilename` / `cleanfilepath` / `cleanfilepathrel` | replace illegal characters (also separators / keep separators / for use as subfolder) |
| `escbackslash` / `escnl` | `\` to `\\` / only `\n` to `\\n`, for strings that interpret `\n` |
| `escwild` / `escregex` / `escforfilter` | escape wildcard chars / regex chars / both backslashes and wildcards for inline filters |
| `regex=<pat>` | only process items whose name matches |
| `regex=<pat>\|to=<new>` | output the regex replacement (only matches) |
| `regex!=<pat>\|to=<new>` | as above but non-matches pass unchanged. Quote the pattern if it contains `\|` |
| `file` / `filem` / `fileq` / `filemq` | write names to a temp list file and pass its name. `m` = one per line, `q` = always quote |
| `utf8` / `ucsle` / `ucsbe` / `nobom` / `cronly` / `lfonly` | list file encoding and line endings |
| `sep=,` | separator for all-at-once codes |
| `urlencode` | URL-encode the name |
| `noshort` | do not auto-shorten paths over 260 chars to 8.3 |
| `wsl` | `/mnt/c/...` form |
| `pair` (paths only) | the paired folder. Overrides: `pairgotoparent`, `pairignorepair`, `pairuseanyway` |

### Quoting and multiple files

- Opus auto-quotes names that contain spaces. `@nofilenamequoting` turns that off for the whole function. Add explicit quotes only when auto-quoting gets confused by a complex line, together with `@nofilenamequoting`.
- Exception: wrap codes inside a larger argument yourself, e.g. `SetAttr META "comment:{dlgstring|Comment||doublequotes}"`.
- One-at-a-time codes (`{f}`, `{o}`) repeat the whole command per item. All-at-once codes (`{F}`, `{O}`) run it once.
- Long selections overflow the command line. Use `{allfilepath|filem}` and the program's list-file option.
- `@filesonly`, `@dirsonly`, `@firstfileonly` restrict which selected items feed the codes (see Command modifier reference).

## External control codes: paths

| Code (short) | Meaning |
|---|---|
| `{sourcepath}` (`{s!}`) / `{sourcepath$}` (`{s}`) | source folder, not required / required |
| `{destpath}` (`{d!}`) / `{destpath$}` (`{d}`) | destination folder, not required / required |
| `{sourcepathshort}` (`{ss!}`/`{ss}`), `{destpathshort}` (`{ds!}`/`{ds}`) | 8.3 forms |
| `{leftpath}` (`{l}`), `{rightpath}` (`{r}`), `{leftpathshort}` (`{ls}`), `{rightpathshort}` (`{rs}`) | left/top and right/bottom display, no required form |
| `{apppath\|winword.exe}` (`{p}`), `{apppathshort}` (`{ps}`) | install path from the registry App Paths key |
| `{alias\|mydocuments}` (`{A}`), `{aliasshort}` (`{As}`) | folder alias path. `{alias\|libraries}/Documents` resolves a library |

Path codes take the same modifiers as filename codes (`{sourcepath|noterm}`, `{destpath|..\..}`, `{sourcepath|pair|..}`).

## Dialog codes

| Code (short) | Dialog | Template |
|---|---|---|
| `{dlgopen}` (`{Rf}`) | open file | `{dlgopen\|<title>\|<default>}`, default may be a filter `*.jpg;*.png`, `type=folder` browses folders |
| `{dlgmulti}` (`{Rm}`) | open, multi-select | as `{dlgopen}` |
| `{dlgsave}` (`{RF}`) | save file | `{dlgsave\|Title\|Name.txt\|type=#Text Files!*.txt!Doc Files!*.doc}` (`#` adds All files) |
| `{dlgfolder}` (`{Rd}`) | pick folder | `{dlgfolder\|<title>\|<default>\|expand}` |
| `{dlgstring}` (`{Rs}`) | text input | `{dlgstring\|<message>\|<default>}`, `\n` in message = line break |
| `{dlgstringS}` (`{RS}`) | text input, default preselected | as above |
| `{dlgpassword}` (`{Rp}`) | masked input | `{dlgpassword\|msg\|\|confirm}` asks twice |
| `{dlgchoose}` (`{Rc}`) / `{dlgchooseS}` (`{RC}`) | drop-down / sorted drop-down | `{dlgchoose\|Quality\|default:High=320+Medium=256+Low=128}` |

Trailing flags after `<default>`: `doublequotes` (typed `"` becomes `""`), `confirm` (password), `keys` (inline-rename control keys in the field). File dialogs accept the filename modifiers only after both template slots: `{dlgopen|||noext}`. In `{dlgchoose}` a literal `+` or `=` is doubled.

## Date and time codes

`{date|fmt}` local date, `{dateu|fmt}` UTC date, `{time|fmt}` local time, `{timeu|fmt}` UTC time. No format = system format. Example: `CreateFolder {date|yyyyMMdd}`.

Format prefixes: `D#` date, `T#` time, `A#` both. Optional for `{date}`/`{time}`, required where a code yields date and time together (`{modified|D#yyyy}` in rename, info tips, evaluator `As`). Flags right after the prefix: `I` invariant locale, `N` day names ("Today"), `M` milliseconds.

| Token | Meaning | Token | Meaning |
|---|---|---|---|
| `d` / `dd` | day of month / zero-padded | `h` / `hh` | 12-hour / padded |
| `D` / `DD` | weekday number, 1 = Sunday / 1 = Monday | `H` / `HH` | 24-hour / padded |
| `ddd` / `dddd` | `Wed` / `Wednesday` | `m` / `mm` | minutes / padded |
| `M` / `MM` | month / padded | `s` / `ss` | seconds / padded |
| `MMM` / `MMMM` | `Jan` / `January` | `t` / `tt` | `A` / `AM` (locale dependent) |
| `y` / `yy` / `yyyy` | year 9 / 09 / 2009 | `w` / `ww` | ISO week / padded |
| `Y` / `YY` / `YYYY` | ISO year (pair with ISO week only) | `W` / `WW` | simple week / padded |
| `gg` | era | | |

Tokens are case-sensitive: `MM` is month, `mm` is minutes.

## Clipboard, DPI, variable and evaluator codes

| Code | Meaning |
|---|---|
| `{clip}` (`{c}`) | clipboard text. Sanitize with `{clip\|cleanfilename}`, `{clip\|cleanfilepath}`, `{clip\|cleanfilepathrel}` |
| `{dpi}` / `{dpi\|%}` | current DPI (96) / scale percent (100) |
| `{dpi\|25}` / `{dpi\|/50}` | scale a 96-DPI pixel value up / back down |
| `{$name}` / `{$glob:name}` | variable set by `@set` |
| `{=expr=}` | evaluator result (see `references/evaluator.md`) |

### Variables (`@set`)

```
@set name={dlgstring|Enter folder name}
CreateFolder "{$name}"
Go "{$name}" NEWTAB
```

Both `@set name=value` and `@set name {code}` forms appear in the manual. `@set name` with no value deletes it. `FileType NEW` sets `newfile`.

| Scope prefix | Lives in |
|---|---|
| none | this one function run |
| `src:` / `dst:` | source / destination folder tab |
| `left:` / `right:` | left / right folder tab |
| `tab:` | the active tab (in the status bar: the side the bar belongs to) |
| `lst:` | the Lister window |
| `glob:` | global |
| `glob!:` (any scope + `!`) | saved to disk, survives restarts |

Toggle pattern (also used to show a status bar section on demand):

```
@if:$glob:ShowExtraInfo
@set glob:ShowExtraInfo
@if:else
@set glob:ShowExtraInfo=on
@if:common
@toggle:update
```

`@toggle:update` refreshes buttons and status bar that depend on variables. Scripts set the same variables through the `Vars` object. The evaluator reads them as `$name` / `$glob:name`.

## Status bar codes

Edit at `Preferences / File Displays / Status Bar` (or right-click the status bar). Each line of the definition is one section.

### Counts and sizes

| Base | Value |
|---|---|
| `sd` `sf` `si` | selected folders / files / items |
| `sb` `sbf` `sbd` | size of selected items / files / folders |
| `td` `tf` `ti` | total folders / files / items |
| `tb` `tbf` `tbd` | size of all items / files / folders |
| `hd` `hf` `hi` | hidden (filtered out) folders / files / items |
| `hb` `hbf` `hbd` | size of hidden items / files / folders |
| `hse` | "Everything" or "Filtering" (Show Everything mode) |
| `grp` | number of groups when grouped |
| `dfb` `dub` `dtb` / `dfa` `dua` `dta` | disk free / used / total in bytes / auto units |
| `pf` `pu` | percent of disk free / used |
| `tmp3` `smp3` | total / selected audio and video duration |

Suffixes: side `D` (destination), `L` (left/top), `R` (right/bottom), none = source. Size codes end in `b` (bytes) or `a` (auto units) after the side letter: `{sba}`, `{sbDb}`, `{tbfLa}`, `{dfRa}`, `{sdR}`. Folder sizes only count once calculated.

### Other status bar codes

| Code | Meaning |
|---|---|
| `{sel:name}` `size` `sizek` `sizeb` `create` `write` `writed` `access` `attr` `desc` `path` `index` | info on the most recently selected item |
| `{sel:namelen}` `{sel:pathlen}` | length of selected name / full path |
| `{dlet}` `{dlab}` `{fsys}` `{vm}` `{ls}` | drive letter, drive label, file system, view mode, source/dest state |
| `{fl}` / `{gfl}` | format lock / folder format icon (grayscale) |
| `{i:dir}` `{i:file}` `{i:.mp3}` `{i:/mypictures/x.png}` | icon |
| `{ft}` | selected/all file-type summary. Options: `size`, `size,count`, `sel`, `group`, `asc`, `only`, `5`, `-1`, `0`, `frame` (e.g. `{ft:sel,size}`) |
| `{var:glob:name}` | variable (scope required). `{varL:tab:x}` `{varR:tab:x}` `{varD:tab:x}` = left / right / dest. `{var:!glob:x}` negates |
| `{var:sys:CopySpeed}` | current total copy speed |
| `<b>` `<i>` `<u>` | bold / italic / underline |
| `<#RRGGBB>..</#>`, `<#fff #a00>..</#>`, `<#fff #a00 fill>` | text color, text + background, fill whole section |
| `//` at column 1 | comment line |
| `{{` | literal `{` |

### Conditional tests (return "1" or empty)

| Code | Test |
|---|---|
| `{ifpath:C:\Program Files(\|\*)}` | current path matches wildcard (here: folder and everything below). `!` negates, aliases allowed, `regex:` switches to regex. Escape `(` `)` as `'(` `')` |
| `{ifexists:".\*.dll"}` | path exists. Relative paths start `.\` or `..\`. `*` only in last component |
| `{if:Set VIEW=Details}` / `{ifset:VIEW=Details}` | command state (button would appear checked) |
| `{ifpathL:..}` `{ifexistsR:..}` `{ifD:..}` | target left / right / destination side |

Quote the argument if it contains `{` or `}`. Order cheap tests first: `{h!{ifpath:/downloads}!{ifexists:.\*.dll}}`.

### Hiding sections

| Syntax | Section shown when |
|---|---|
| `{h!}..{h!}` | all codes inside are non-zero |
| `{h#}..{h#}` | any code inside is non-zero |
| `{h?}..{h?}` | all codes inside are zero |
| `{h!{si}}..{h!}` | test codes placed in the opener are tested but not displayed |
| `{h!{sf}?{sd}}..{h!}` | `{sf}` non-zero and `{sd}` zero |
| `{h=expr=}..{h!}` | evaluator returns false (true hides) |

Hide sections must not nest or overlap.

### Bar graphs and percentages

`{cp+V=<num>/<den>}` prints a percentage. `{bg+<param>,<param>}` draws a graph. Both default to `V=du/dt` (disk used). `<num>`/`<den>` are numeric code names without braces or absolute values with `kb` `mb` `gb` suffix.

| Param | Meaning |
|---|---|
| `W=50` | width in px, DPI-scaled. `-1` = section width, other negatives = unscaled |
| `C=#rrggbb`, `C1=`, `C2=` | solid color / gradient left / right |
| `C3=#rrggbb` | color when over 100% |
| `B=#rrggbb` / `B=n` | background / none |
| `T=#rrggbb` / `T=n` | percentage text color / hide text |
| `G=0..6` | 0 solid, 1 gradient, 2 scaled gradient, 3-6 Computer-style (A/B, unthemed/themed) |
| `F=0..6` | frame: 0 none, 1 raised, 2 flat dark, 3 fill section (graph becomes background), 4 always dark, 5 light, 6 sunken |
| `L=0` / `L=1` | half-height upper / lower line, for stacking |
| `V=sb/dfDb` | selection size vs destination free space |

### Padding sections

| Code | Effect |
|---|---|
| `{pad50}` | pad to 50% of total width |
| `{rpad25}` | pad to 25% of remaining width |
| `{wtree}` / `{wtree2}` | width of (second) folder tree |
| `{rtree}` `{rtree-}` `{rtree2}` `{rtree2-}` | right-align with tree edge (`-` also right-justifies text) |
| `{wleft}` `{rleft}` `{rleft-}` | width of / align to left file display |
| `{width240}` / `{width-240}` | fixed width, DPI-scaled / unscaled |

## Info tip and tile codes

File type editor: Info Tip page and Tiles Mode page. Lookup order: specific file type, its group, Recognized images, All files (All folders), All files and folders. First definition found wins.

| Code | Meaning |
|---|---|
| `{keyword}` | any column keyword (`{picwidth}`, `{mp3artist}`, `{desc}`) with the same formatting as rename (`{modified\|D#yyyy-MM-dd}`, `{size\|#8}`) |
| `{foldersize}` / `{foldersize:noprefix}` | calculate and show folder size |
| `{foldercontents:files,noprefix,singleline,maxitems=20,maxitemlength=40,indent=-> }` | first items of a folder (`indent=` must be last, max 20 per category). Tiles spell it `{foldercontent}` |
| `{thumbnail:<border>:<size>}`, `{thumbnailt}` | thumbnail. Border 0-3, `l`/`t`/`b` position, e.g. `{thumbnail:0:64}` |
| `{infotip}` | the Windows/shell extension tooltip |
| `{!picwidth&picheight}..{!}` | show only if all listed fields exist |
| `{=expr=}` / `{!=expr=}..{!}` | evaluator insert / show when true |
| `\<Tab>` / `\` at line end / `\\` | column separator / end table / new table inheriting column 1 width |
| `<#RRGGBB>` `<b>` `<i>` `<u>` | markup |

A line whose codes are all empty is dropped. Info tip only: Never show an InfoTip for this File Type.

## Pattern matching (standard wildcards)

Used by Select, filters, Find, `{ifpath:..}`, `@ifpath`, `Match()` without `r`.

| Token | Meaning | Example |
|---|---|---|
| `*` | any run of chars (same as `#?`) | `*.doc` |
| `?` | one char | `a?b` matches `aab`, not `ab` |
| `#` | repeat next char or group 0+ times | `a#(xyz)b` |
| `\|` | or, inside parentheses | `*.(gif\|bmp\|jpg)` |
| `~` | not | `~(*.(gif\|bmp))` |
| `( )` | group, nestable | `NEW-((*.doc)\|(*_backup_*))` |
| `[abc]` `[a-j]` | char set / range | `IMGP#[0-9].jpg` |
| `[~pqr]` | not in set | |
| `'` | escape the next token | `a'#xb`, `Program Files '(x86')` |
| `grp:Images` | all extensions of a file type group | `(grp:Images\|grp:Documents)` |

Regex is the alternative system wherever a regex option exists (`{ifpath:regex:..}`, `@ifpathr`, `Match(.., "r")`).

## Recipes

Open selected files in one program instance:
```
"C:\Program Files\App\app.exe" {allfilepath$}
```

Run once per file, in parallel, files only:
```
@filesonly
@async:notepad.exe {f}
```

New folder named by prompt, then enter it:
```
@set name={dlgstring|New folder name|{date|yyyy-MM-dd}}
CreateFolder "{$name}"
Go "{$name}" NEWTAB
```

Copy source and destination paths to clipboard, one per line:
```
Clipboard EXPANDNEWLINES SET {sourcepath|escbackslash}\n{destpath|escbackslash}
```

Google the selected name: `https://www.google.com/search?q={file|urlencode}`

Status bar showing selection only when something is selected, otherwise totals:
```
{h?{si}}{ti} items{h?}
{h!}{si} of {ti} selected, {sba}{h!}
{h!}<#ff0000>{hi} hidden</#>{h!}
{dfa} free {bg+W=60,F=2,G=1,C1=#55aa55,C2=#f06840}
```

Bar showing whether the selection fits in the destination:
```
{bg+V=sb/dfDb,W=50,F=2,C=#3c9e3c,C3=#ff0000}
```

Disk used graph as section background:
```
{bg+F=3,T=n,W=-1,B=#BBBBBB}<#ffffff> {pu}% full, {dfa} free
```

Info tip for images:
```
{thumbnail:1:256}
{!picwidth&picheight}Size: {picwidth} x {picheight}{!}
{=picwidth > 2048 ? "HighRes" : "LowRes"=}
Taken: {datetaken|D#yyyy-MM-dd}
```

## Pitfalls

- Code does nothing or shows literally → wrong code system for the place (status bar codes in a button, `{f}` in an info tip). Check the table above.
- `{F}` behaves like `{f}` or vice versa → codes are case-sensitive.
- Button does nothing when no file is selected → required form (`{f}`, `{s}`, `{d}`). Use `{f!}` / `{filepath}` to run anyway.
- Paths with `(` `)` break Select/filters/`{ifpath:}` → use `|escwild` / `|escforfilter`, or `'(` `')` by hand.
- `\N` inside a path eaten in `Clipboard EXPANDNEWLINES` or dialog text → `|escbackslash`.
- Program gets doubled quotes → auto-quoting plus manual quotes. Remove yours or add `@nofilenamequoting`.
- Variable gone after the function ends → no scope prefix. Use `lst:`, `tab:` or `glob:`, add `!` to persist.
- Status bar or button ignores a changed variable → run `@toggle:update` after `@set`.
- `{var:name}` empty in the status bar → the scope prefix is required there.
- Hide polarity differs: status bar `{h=expr=}` hides on true, info tip `{!=expr=}` shows on true.
- Nested `{h!}` sections render wrongly → nesting is not supported. Put all conditions into one opener.
- Slow status bar → `{ifexists:}` and `{if:}` run on every selection change. Avoid network paths, test `{ifpath:}` first.
- `Y`/`YYYY` gives a wrong year around New Year → those are ISO years. Use `yyyy`.
- Copied old forum status bars use `{df}`, `{du}`, `{rpad}`, `{h!L}`, `{bgL+..}` [unverified, not in the v13 tables]. Prefer `{dfa}`, `{dua}`, `{rpadX}` and per-side status bars.
- New v13 status bar features (`{ft}`, evaluator variables) missing after upgrade → reset `Preferences / File Displays / Status Bar`.
- The manual's own example `V=sf/dfDb` contradicts its text. Use `V=sb/dfDb` for selected size.
