# Rename

Renaming files in Opus 13: inline rename, the Rename dialog, its modes (wildcard, find and replace, regex), macros, numbering, metadata and evaluator codes, presets, rename keys, scripts, clash handling. Argument lists live in [references/commands.md `## Rename`](references/commands.md#rename).

## User says → concept

| User words | DOpus concept | Where / how |
|---|---|---|
| "F2", "edit the name in place" | Inline rename | `Rename INLINE`, options on `Preferences / File Operations / Renaming Files` |
| "batch rename", "rename many files" | Rename dialog (Advanced Rename) | `Rename` or `Rename ADVANCED` |
| "simple rename box" | Simple Rename (wildcards only) | `Rename SIMPLE` |
| "regex rename", "remove first N characters" | Regular Expressions mode | Mode drop-down, or `Rename REGEXP PATTERN=… TO=…` |
| "replace text in names" | Find And Replace mode | `Rename FINDREP PATTERN=… TO=…` |
| "replace a pattern anywhere in the name" | Regular Expressions + Find and Replace mode | `Rename REGEXP FINDREP …` |
| "saved rename", "rename preset", ".orp file" | Rename preset | Presets panel on the left of the dialog, `Rename PRESET="<name>"` |
| "add numbers", "0001, 0002" | Numbering action | `Numbering from` field, `[#]` code, `Rename NUMBER=0001` |
| "use the artist/title/date taken in the name" | Metadata codes | `{mp3artist}`, `{datetaken\|D#yyyy-MM-dd}` in New name |
| "rename button", "one-click rename" | Rename command in a button | Dialog Clipboard menu / Create function from current settings |
| "custom key while renaming", "Ctrl+something in the rename box" | Rename control keys (13.0+) | `Preferences / File Operations / Renaming Files / Control Keys` |
| "if it already exists add (1)" | Clash handling | `Automatically number files when names clash`, `AUTONUMBER`, `WHENEXISTS=rename` |
| "sort music into Artist\Album folders" | Rename with `\` in the new name | New name `{mp3artist}\{mp3album}\*` |

## Model

- **Inline rename** edits one name in the file list. Enter applies, Esc cancels, ↑/↓ or Tab moves to the next file and applies the current one.
- **Rename dialog** has two faces. Simple mode is one wildcard pair. Advanced mode has, top to bottom: presets list, mode plus Old name / New name, actions (Capitalization, Macro, Numbering, Script), options, preview list. Processing runs top to bottom: the mode pattern first, then actions, then the script.
- **Dialog vs command.** Everything in the dialog maps to `Rename` arguments. Clipboard menu (bottom of dialog) / Create function from current settings copies the exact command (as text and as a pasteable button). Use that instead of hand-writing complex commands. Manage / Create Function From Preset does the same for a saved preset.
- **Ignore extension.** When on, the extension is cut off before matching, the pattern only sees the stem, and the extension is put back afterwards. On by default in the dialog. **Off by default in non-interactive commands** (old-button compatibility). Add `IGNOREEXT` to every command that renames without opening the dialog.
- **Case.** Matching is case-insensitive unless `Case sensitive` (dialog) or `MATCHCASE` (command) is on.
- **Non-matching files** are skipped (shown grey in the preview). `Apply actions even if pattern doesn't match` / `APPLYNOMATCH` makes the actions (Capitalization etc.) still apply to them.
- **Apply** renames and keeps the dialog open, then **Undo** reverts that apply. **Last Rename** button (or `Rename PRESET=last`) reloads the previous settings.

## Inline rename

Start: F2, slow double-click, context menu Rename, or `Rename INLINE`.

| `Rename INLINE=` | Initial selection |
|---|---|
| (none) | from `Default selection mode` preference (default: stem only) |
| `all` / `name` / `ext` | whole name / stem / extension |
| `endstem` / `home` / `end` | cursor at end of stem / start / end, nothing selected |
| `single` (combinable: `INLINE=name,single`) | opens the Rename dialog if more than one item is selected |

Default control keys (13.0+, all reassignable on the Control Keys page, may vary by keyboard layout):

| Key | Action |
|---|---|
| F2 | Cycle selection: stem, extension, all |
| Ctrl+A / Ctrl+F or Ctrl+N / Ctrl+E | Select all / stem / extension |
| Ctrl+S | Select next word |
| Ctrl+L / Ctrl+U / Ctrl+W / Ctrl+P | lower / UPPER / Capitalize All Words / Capitalize first word |
| Ctrl+. | Dots and underscores to spaces (dots between digits kept: `2.1.0` stays) |
| Ctrl+D | Insert current date |
| Ctrl+/ / Ctrl+Shift+/ | Take parent / grandparent folder name, keep extension |
| Ctrl+[ / Ctrl+] | Move the ` - `-separated part under the cursor left / right |
| Ctrl+Shift+↑ / ↓ (or Ctrl+') | Copy name from previous / next file. Add Alt to copy the extension too |
| Ctrl+Shift+Home | Reset to the original name |
| Ctrl+↑ / Ctrl+↓ | History of whole previous names |
| Ctrl+Space | Suggestions popup (words from previous renames) |
| Hold Ctrl | Tooltip cheat sheet of all control keys |

Inline preferences (`Preferences / File Operations / Renaming Files`): `Allow rename into other directories` (typing `New Folder\` in front moves the file), `Automatically number files when names clash` (gives `Manuscript (1).txt`), `Rename all selected files at once` (Explorer-style, numbers added to 2nd file onward), `Retain cursor position when moving to next/previous file`, `Automatic suggestion popups`, `Default selection mode`.

## Rename modes

| Mode | Old name field | New name field | Command form |
|---|---|---|---|
| Standard Wildcard Rename | wildcard pattern, `*` captures | literal text, each `*` inserts the next capture in order | `Rename PATTERN="img_*" TO="IMG*"` |
| Find And Replace | literal text to find (all occurrences) | literal replacement (empty = delete) | `Rename FINDREP PATTERN="jones" TO="smith"` |
| Regular Expressions | regex that must match the **whole** name | replacement with `\1`, `\2` | `Rename REGEXP PATTERN="(.*)_(.*)" TO="\1\2"` |
| Regular Expressions + Find and Replace | regex that matches a **part** of the name, every match replaced | replacement text (can use `\1`) | `Rename REGEXP FINDREP PATTERN="- \d+" TO=""` |
| Script | any, passed to the script | any, passed to the script | `@script` in a button, see below |

- Wildcard mode: Old name needs at least as many `*` as New name. Captures can't be reordered (use regex). A New name without `*` is a literal name: Simple mode then renames file by file, re-opening for each.
- Find And Replace works on the stem only unless Ignore extension is off. On the command line `FINDREP=ext` includes the extension.
- Opening the dialog straight into a mode: `Rename PRESET=findrep`, `PRESET=regexp`, `PRESET=regexpfindrep`.

## Wildcard pattern syntax (standard pattern matching)

Used in Old name of wildcard mode, and in `FROM`, `Select`, filters.

| Token | Meaning | Example |
|---|---|---|
| `*` | any run of characters, including none (same as `#?`) | `*.doc` |
| `?` | exactly one character | `a?b` matches `axb`, not `ab` |
| `#` | previous character or `( )` group, 0 or more times | `IMGP#[0-9].jpg` |
| `[abc]` `[a-j]` | one character from the set or range | `[0-9]` |
| `[~abc]` | one character not in the set | |
| `(a\|b)` | alternatives | `*.(gif\|jpg)` |
| `~(…)` | not | `~(*.doc)` |
| `'` | escape the next token | `a'#b` matches `a#b` literally |
| `grp:Name` | all extensions of a file type group | `grp:Images` |

## Regex flavor and syntax

Flavor: TR1 ECMAScript (std::regex ECMAScript grammar). Opus-documented tokens: `^ $ . * + ? | {n} [ ] [^ ] ( ) \ \w \W \s \S \d \D \t \n \xHH \uHHHH`.

| Topic | Rule |
|---|---|
| Whole-name match | Regular Expressions mode needs the pattern to match the entire name (or stem, with Ignore extension). `^` and `$` are implied there. Files that don't match are skipped |
| Substring match | Regex + Find and Replace matches parts. Here `^`/`$` matter: `^The ` removes `The ` only at the start |
| Capture references | `\1`, `\2`, … in New name. `$1` is inserted literally [tested 13.11] |
| Literal backslash in New name | `\\`. So `\1\\\2` = capture 1, a folder separator, capture 2 |
| Literal dot | `\.` outside a set, plain `.` inside `[ ]` |
| Greedy | `*` and `+` are greedy: `(.*)_(.*)` splits at the **last** `_` |
| Stop at the first X | negated class: `([^_]*)_(.*)` splits at the **first** `_` |
| Lazy `*?` `+?` | not in the Opus token table, but they work [tested 13.11: `(.*?) - .*` turned `one - two - three` into `one`] |
| Repeat until stable | append `#` to Old name: `(.*)\s(.*)#` → `\1\2` removes all spaces. `#5` = at most 5 passes. Rename only (and in evaluator `RegEx`) |
| Case | insensitive unless `Case sensitive` / `MATCHCASE`. So `[a-z]` also matches capitals by default [tested 13.11] |
| Help in dialog | (13.0+) in regex modes the name fields have menus that insert common regex codes with a description |

## Actions

| Action | Dialog | Command |
|---|---|---|
| Capitalization | `all lower-case`, `ALL UPPER-CASE`, `Capitalize All Words`, `Capitalize first word`, `lower-case extens.ion`, `upper-case extens.ION` | `CASE=lower\|upper\|allwords\|firstword\|extlower\|extupper`. Add `,extignore` to keep the extension's case: `CASE=upper,extignore` |
| Macro | recorded via the preview list | `MACRO "R0-6/L0+Final"` |
| Numbering | `Numbering from` (start, padding by leading zeros), increment | `NUMBER=0010 BY=2` |
| Script | Edit Script button | `@script` in a button |

### Numbering

- `[#]` in New name marks where the number goes. Without it the number goes at the end of the stem, before the extension.
- Start value sets padding: `0100` = start at 100, pad to 4 digits. `[#5]` pads to 5 digits.
- Order = current sort order of the file display. Sort first.
- `Rename matching filenames as one` / `RENAMEMATCHING`: `IMG1.JPG` and `IMG1.WAV` get the same number.
- `Rename ADVANCED NUMBER=!01` pre-fills the field without turning numbering on.

### Rename macros

Easiest: turn on `Use preview list to build macros`, click a name in the New Name column (or F2), and edit it. Each keystroke on one name is recorded and applied to all. Ctrl+X/C/V are recorded per name. Ctrl+Shift+V pastes literal clipboard text. Double-click the pencil icon (or double-press Home/End) to flip the anchor between left and right end. Double Shift+End selects to the end of every name.

Macro language (for `MACRO=` by hand). Operations separated by `/`:

| Part | Values |
|---|---|
| Anchor | `L` (from start) or `R` (from end). `P` = previous cursor position, offset may be negative (13.0+, hand-written only) |
| Offset | characters from the anchor. `Wx` after it moves x words (13.0+, hand-written only) |
| Operation | `-n` remove, `Cn` copy, `Xn` cut, `V` paste. `*` as length = to the end. `U` / `L` upper/lower-case the range (13.0+) |
| Insert | `+text` |

Examples: `R0-6/L0+Final` removes 6 chars from the end, inserts `Final` at start. `L0W2+abc` inserts `abc` before the third word. `L0W2/P-1+abc` appends `abc` to the end of the second word. The manual's `R0-6` example removes `_draft` from `..._draft.txt`, so macros act on the stem with Ignore extension on `[unverified with it off]`.

## Options

| Dialog option | Command | Effect |
|---|---|---|
| Ignore extension | `IGNOREEXT` / `NOIGNOREEXT` | see Model |
| Case sensitive | `MATCHCASE` | exact-case matching |
| Apply actions even if pattern doesn't match (13.0+) | `APPLYNOMATCH` | actions run on non-matching files too |
| Automatically number files when names clash | `AUTONUMBER` (old name `AUTORENAME` still works) | adds a number on clash instead of an error |
| Hide unaffected items in preview (13.0+) | | |
| Use preview list to build macros | | macro builder on, else per-file manual edits (shown red, locked in) |
| Rename files in selected sub-folders | `RECURSE` | renames contents of selected folders, not the folders |
| Rename folders as well as their contents | | both |
| Rename matching filenames as one | `RENAMEMATCHING` | same-stem files numbered together |
| (folders/files only) | `TYPE=files` / `TYPE=dirs` | |

Clipboard menu in the dialog: copy all old names, `Paste new names from clipboard` (one per line), Prefix / Append clipboard text (one line = to all, many lines = one per file, blank line skips), Reset. Clipboard paste and Prefix/Append turn off the macro builder.

## Clash handling

| Want | Use |
|---|---|
| Ask per file (default) | `WHENEXISTS=ask` |
| Add a number to the new name | dialog `Automatically number files when names clash`, or `AUTONUMBER`, or `WHENEXISTS=rename` |
| Number every file of the batch from the 2nd one, in brackets | `AUTONUMBER=force` (13.0+) |
| Overwrite the existing file | `WHENEXISTS=delete` |
| Keep both by renaming the existing file | `WHENEXISTS=keep` |
| Skip | `WHENEXISTS=skip` |
| Number in a chosen position/format, lowest free number | not built in. Forum rename script "Add a Unique Number while renaming" (`[NUM]` placeholder) |

## Metadata and special codes in New name

Any column keyword in braces is replaced per file. Full list: manual page Keywords for Columns. The dialog's drop-down left of New name inserts them.

| Category | Common codes |
|---|---|
| Name and Path | `{name}`, `{name\|noext}`, `{ext}`, `{parent}`, `{path}` |
| Date and Time | `{modified}`, `{created}`, `{accessed}`, `{modifieddate}`, `{createddate}` |
| Picture Metadata | `{datetaken}` (= `{shootingtime}`), `{cameramake}`, `{cameramodel}` |
| Picture Dimensions | `{picwidth}`, `{picheight}`, `{picsize}` |
| Music | `{mp3artist}`, `{mp3album}`, `{mp3title}`, `{mp3track}` |
| Documents | `{title}`, `{author}`, `{subject}` |
| File Size | `{size}` |
| Other groups | Programs, General, Movies |

Rename-only codes:

| Code | Inserts |
|---|---|
| `[#]`, `[#5]` | numbering position (and padding) |
| `{parent}`, `{parent2}`, `{parent3}` | parent, grandparent, … folder name. With `RECURSE` it is each file's own folder |
| `{parentbase}`, `{parentbase2}` | folder the rename started in, and its parent |
| `{parent\|noext}`, `{parentbase\|noext}` | same, extension stripped (parent is an archive) |
| `{date}`, `{time}` / `{dateu}`, `{timeu}` | current local / UTC date, time |
| `{=expr=}` | evaluator result (13.0+) |
| `{{` | literal `{`. `*{{size}` appends the text `{size}` |

Format suffixes:

| Suffix | Example | Result |
|---|---|---|
| `D#` date format | `{datetaken\|D#yyyy-MM-dd}` | `2008-09-22` |
| `T#` time format | `{modified\|T#HH-mm-ss}` | `13-10-55` |
| `A#` combined | `{datetaken\|A#yyyyMMddHHmmss}` | `20221130154410` |
| no prefix for `{date}` / `{time}` | `{date\|yyyy-MM-dd} {time\|HH-mm}` | |
| `#n` zero-pad number | `{mp3track\|#2}` | `08` |
| `I` / `N` / `M` flag after prefix | `{modified\|D#Nyyyy-MM-dd}` | invariant locale / day names / milliseconds |

Date tokens (case-sensitive): `d dd` day, `ddd dddd` weekday name, `M MM` month, `MMM MMMM` month name, `yy yyyy` year, `w ww` ISO week, `YYYY` ISO year (only with ISO week). Time: `H HH` 24h, `h hh` 12h, `m mm`, `s ss`, `t tt` AM/PM.

- Illegal filename characters from metadata are converted (`:` becomes `;`). Use formats without colons.
- `\` in the New name moves the file into sub-folders relative to its current folder, created as needed. `$.\` at the start makes the path relative to the base folder. (13.0+) leading/trailing spaces and trailing dots are trimmed from each path component.
- `NOFILEINFO` turns codes off (inserted literally).

## Evaluator in rename (13.0+)

`{=expression=}` in New name. Variables: every column keyword (`mp3artist`, `modified`, …), rename keywords (`parent`, `parentbase`), `file_name` (real full name), `is_dir`, `oldname` and `newname` (field contents). Keywords with characters like `:` need `Val("…")`. Call `Cancel()` to skip the current file. Return a string.

Manual example: `{=regex(parent, "(.*\([0-9]{4}\))", "\1")=}` keeps the parent name up to and including `(1999)`. `RegEx` requires a full match (returns input unchanged if no match). `RegExS` matches substrings. Both take several pattern/replace pairs and `#` for replace-all. Other useful functions: `Explode`, `ArrayGet`, `Trim`, `Left`, `Mid`, `Right`, `LCase`, `UCase`, `Replace`, `IsSet("name")` (quoted name). Grammar: see the evaluator reference.

## Rename control keys (13.0+)

`Preferences / File Operations / Renaming Files / Control Keys`. Each key runs one of: a rename preset, a regular expression selection, or evaluator code. Works in inline rename and most name-edit fields. The built-in keys are defined here and can be changed or removed.

Evaluator variables: `name`, `namestem`, `nameext`, `dir` / `is_dir`, `exthidden`, `path`, `value`, `valstem`, `valext`, `valleft`, `valsel`, `valright`, `selstart`, `selend`. Return a string to replace the field, change `selstart`/`selend` to move the selection (equal values = cursor), return `true` to only change the selection, `false` for no change. Extra functions: `RestoreExt()`, `ShowTips()`.

Staff example (forum, removes `[...]`/`(...)` at start or end, cursor at end of stem):

```
newstem = Trim(RegEx(valstem,
	"^[\[\(][^\[\(\]\)]+[\]\)](.+)$", "\1",
	"^(.+)[\[\(][^\[\(\]\)]+[\]\)]$", "\1"));
selstart = Len(newstem);
selend = selstart;
return newstem + valext;
```

Shared as XML `<regexsel key="219,3" name="…"><eval>…</eval></regexsel>` (forum shape, `[unverified]` how it is imported).

## Rename presets

- A preset stores the whole dialog state (mode, fields, actions, options, script). Load: double-click. Star = favorite (top of list). Groups via Manage / Assign To Group. (13.0+) search field above the list.
- Manage menu: Save, Save As, Export Current Settings, Export Preset, Import Preset File, Create Function From Preset, Reset Default Presets.
- Storage and XML shape: `/dopusdata\Rename Presets\<name>.orp`, see [references/config-files.md](references/config-files.md). An `.orp` written into that folder works at once with `Rename PRESET="<name>"` [tested 13.11].
- **Install a forum `.orp`:** download (extract if zipped), open the Rename dialog in advanced mode, Manage / Import Preset File, keep `Add to Preset List` on, pick the file. With it off the preset only loads into the dialog once.
- **Share yours:** Manage / Export Current Settings (or Export Preset) writes an `.orp`.
- **Run a preset from a button:** `Rename PRESET="Number Files"` (no dialog), `Rename ADVANCED PRESET="Number Files"` (dialog for review), `Rename PRESET=!last` (repeat last rename silently), `Rename PRESET=!list,favesonly HEADING` (dynamic menu of presets).
- Pass custom script fields: `Rename PRESET="MyRename" SCRIPTARG my_option:True`.

## Rename scripts

Entry point `OnGetNewName(getNewNameData)` runs once per item (also for the preview). Return a string = new name, `true` = skip the item, `false` = use the proposed name. Useful properties: `item` (Item: `name_stem`, `ext`, `metadata`), `newname`, `newname_stem`, `newname_ext` (and `_m` variants for `.part1.rar`), `newname_field`, `oldname_field`, `preview`, `custom`, `tab` (13.0+). Errors go to Help / Logs / Other Logs. Script details and custom fields: see `references/scripting.md`.

Embed in a button (first line must be a `Rename` command, its arguments run first):

```
@nodeselect
Rename PATTERN="*" TO="*"
@script vbscript
Option Explicit
Function OnGetNewName(ByRef getNewNameData)
	OnGetNewName = getNewNameData.item.name_stem & " TEST" & getNewNameData.item.ext
End Function
```

The staff example returns stem plus extension, so return the full name. With `IGNOREEXT` whether the return should include the extension is `[unverified]`.

## Recipes

Dialog fields unless stated. Ignore ext = Ignore extension checkbox. Each command is the non-interactive equivalent (add `ADVANCED` to preview in the dialog first).

| Goal | Mode | Old name | New name | Ignore ext | Command |
|---|---|---|---|---|---|
| Remove first 3 chars | Regex | `...(.*)` | `\1` | on | `Rename REGEXP IGNOREEXT PATTERN="...(.*)" TO="\1"` |
| Remove first N chars (alt) | Macro `L0-3` | | | on | `Rename IGNOREEXT MACRO="L0-3"` [tested 13.11] |
| Remove last 3 chars of stem | Regex | `(.*)...` | `\1` | on | `Rename REGEXP IGNOREEXT PATTERN="(.*)..." TO="\1"` |
| Remove leading digits and `_` | Regex | `[0-9]+_(.*)` | `\1` | on | |
| Remove everything up to and incl. first `_` | Regex | `[^_]*_(.*)` | `\1` | on | |
| Remove everything after first ` - ` | Regex | `([^-]*) - .*` | `\1` | on | names with `-` inside the first part don't match: use `(.*?) - .*` [tested 13.11] |
| Remove everything after last `_` | Regex | `(.*)_.*` | `\1` | on | |
| Remove `The ` only at start | Regex+F&R | `^The ` | (empty) | on | `Rename REGEXP FINDREP IGNOREEXT PATTERN="^The " TO=""` |
| Remove all spaces | Regex | `(.*)\s(.*)#` | `\1\2` | on | |
| Insert text at start | Wildcard | `*` | `Draft *` | on | `Rename IGNOREEXT PATTERN="*" TO="Draft *"` |
| Insert text at end of stem | Wildcard | `*` | `* final` | on | `Rename IGNOREEXT PATTERN="*" TO="* final"` |
| Insert text after 3 chars | Regex | `(...)(.*)` | `\1_text\2` | on | |
| Dots to spaces, keep extension | Find And Replace | `.` | ` ` (space) | on | `Rename FINDREP IGNOREEXT PATTERN="." TO=" "`. Also splits version numbers like `2.1`. Inline Ctrl+. keeps dots between digits |
| Underscores to spaces | Find And Replace | `_` | ` ` | on | `Rename FINDREP IGNOREEXT PATTERN="_" TO=" "` |
| Append current date | Wildcard | `*` | `* {date\|yyyy-MM-dd}` | on | `Rename IGNOREEXT PATTERN="*" TO="* {date\|yyyy-MM-dd}"` |
| Prefix modified date and time | Wildcard | `*` | `{modified\|A#yyyy-MM-dd HH.mm} *` | on | |
| Name = date taken | Wildcard | `*` | `{datetaken\|D#yyyyMMdd}_{datetaken\|T#HHmmss}` | on | add `AUTONUMBER` for photos taken the same second |
| Sequential number, padded | Wildcard + Numbering from `001` | `*` | `Holiday [#]` | on | `Rename IGNOREEXT PATTERN="*" TO="Holiday [#]" NUMBER=001` |
| Number prefix keeping name | Wildcard + Numbering | `*` | `[#] - *` | on | `Rename IGNOREEXT PATTERN="*" TO="[#] - *" NUMBER=01` |
| Unique number only on clash | any | | | | add `AUTONUMBER` (or `WHENEXISTS=rename`) |
| Change case | Capitalization action | | | | `Rename CASE=allwords` / `CASE=lower` / `CASE=upper,extignore` |
| Swap `Artist - Title` | Regex | `(.*) - (.*)` | `\2 - \1` | on | `Rename REGEXP IGNOREEXT PATTERN="(.*) - (.*)" TO="\2 - \1"`. Greedy: splits at the last ` - `. For the first: `([^-]*) - (.*)` |
| Use parent folder name | Wildcard + Numbering `01` | `*` | `{parent} [#]` | on | `Rename IGNOREEXT PATTERN="*" TO="{parent} [#]" NUMBER=01` |
| Prefix parent folder name | Wildcard | `*` | `{parent} - *` | on | |
| Sort music into folders | Wildcard | `*` | `{mp3artist}\{mp3album}\{mp3track\|#2} - {mp3title}` | on | |
| Move `Artist - Title` into `Artist\Title` | Regex | `([^-]*) - (.*)` | `\1\\\2` | on | `\\` = literal backslash in regex New name |
| Move into first-letter folder | Regex | `(.)(.*)` | `\1\\\1\2` | on | |
| First artist only (multi-artist tag) | Wildcard | `*` | `{=IsSet("mp3artist") ? Trim(ArrayGet(Explode(mp3artist, ";"), 0)) : "Unknown Artist"=}\{mp3album}\*` | on | save as preset, don't put in `TO=` (inner quotes break the command line) |
| Remove N chars, ask N each time (button) | | | | | `Rename TYPE=files IGNOREEXT REGEXP PATTERN=".(.*)#{dlgstring\|Characters to remove}" TO="\1"` (`#N` repeats N times, each pass removes one char) |

Notes:
- The first-artist recipe assumes artists are `;`-separated in `mp3artist` (as seen by forum users). An empty artist tag still gives an empty first folder. The accepted forum answer used keyword `mp3artists`, which the manual doesn't list. Both `mp3artist` and `mp3artists` return the raw tag `Alpha;Beta` [tested 13.11, ID3v2.3 TPE1].
- `.` counts characters. For 4 chars use `....(.*)`. `.{4}(.*)` works in a rename preset [tested 13.11]. In a button line `{4}` may be parsed as an Opus code `[unverified]`. Prefer dots in commands.

## Pitfalls

- Regex rename leaves some files unchanged (grey) → Regular Expressions mode needs a whole-name match → widen with `(.*)`, or switch to Regex + Find and Replace for a substring.
- Removing "last 3 chars" eats the extension (`01_moocow.txt` → `01_moocow.`) → Ignore extension off, or a command without `IGNOREEXT` → turn it on / add `IGNOREEXT`.
- Button works in the dialog but not as a command → commands default to Ignore extension off → add `IGNOREEXT`. Get exact commands via Clipboard / Create function from current settings.
- `$1` appears literally in the new name → Opus uses `\1` style references.
- Regex rename sent from outside as `dopusrt /acmd Rename REGEXP … TO=\1` loses the back-reference: Opus received an empty `TO` and opened the interactive Rename dialog [tested 13.11]. Put regex renames in a preset (`.orp`) or a button and trigger it with `Rename PRESET="<name>"`.
- Wanted a folder `A\B`, got `A B` or wrong result in regex mode → `\` is the escape char in regex New name → use `\\`.
- `.` in Old name matches anything → escape: `\.`.
- `(.*) - (.*)` splits in the wrong place → greedy `.*` takes the last ` - ` → use `([^-]*) - (.*)` or anchor the parts more tightly.
- Can't reorder parts with `*` → wildcard captures stay in order → regex mode.
- Capitalization not applied to some files → those didn't match the pattern → `Apply actions even if pattern doesn't match` / `APPLYNOMATCH` (13.0+).
- Numbers come out in the wrong order → numbering follows the display sort → sort first.
- Time in name shows `;` → `:` is illegal and gets converted → use `HH-mm` or `HH.mm`.
- Want literal `{name}` in a name → `{{name}` or `NOFILEINFO`.
- Multi-line rename button stops after the first line for some files → non-matching files are flagged failed and skipped by later commands (unless the next line is also `Rename`) → `NOMATCHNOFAIL`.
- Script-based unique numbering shows duplicate numbers in the preview → the preview doesn't write to disk → normal, the real run differs.
- Macro codes `P`, `W` can't be recorded by the builder → type them in the Macro field.
- `{date}` / `{time}` need no extra checkbox since Opus 12. Old forum posts mention `Enable file information fields`, which no longer exists.
- Old forum regex buttons have two lines (`TYPE=files` with `(\..*)` for the extension, `TYPE=dirs` without) → written before Ignore extension existed → one line with `IGNOREEXT` replaces both.
- `AUTORENAME` in old buttons → still works, new name is `AUTONUMBER`.
- Not possible natively: numbering that fills gaps or checks existing names (use the forum `[NUM]` script), several regex passes in one dialog run (chain several `Rename` lines in a button, or use evaluator `RegEx` with several pattern/replace pairs, or the forum "Script to perform multiple Regular Expressions").
