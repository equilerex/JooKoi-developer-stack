# Status bar codes

<!-- contents:start -->
Contents (slug: title). Find an entry with `scripts/dopus.ps1 kb -Query "<words>"` or grep `^## <slug>`.
- codes.statusbar: Status bar definition and code basics
- codes.statusbar.counts: Status bar: counts, sizes, disk space, duration
- codes.statusbar.graphics: Status bar: icons, bar graphs, percentages
- codes.statusbar.other: Status bar: drive, selection, variables, conditions
- codes.statusbar.hide: Hiding and padding sections
<!-- contents:end -->

## codes.statusbar | Status bar definition and code basics
src: 0440, 0443 | area: codes
ui: Preferences / File Displays / Status Bar (definition text, `Codes` dropdown)
user-words: customize status bar, show selected size, custom status text
what: One line of the definition = one section. Codes are `{xx}`. Most count/size/space codes have side suffixes: none = source display, `D` destination, `L` left/top, `R` right/bottom (for example `{sf}`, `{sfD}`, `{sfL}`, `{sfR}`); size codes end `b` (bytes) or `a` (automatic units) after the side letter (`{sbDb}`, `{sbLa}`). Literal brace: `{{`. `//` at line start = comment. Styling: `<b>`, `<i>`, `<u>`, `<#RRGGBB>..</#>`, `<#fg #bg>..</#>` (add `fill` to fill the section).
see: prefs.displays.statusbar, codes.statusbar.hide

## codes.statusbar.counts | Status bar: counts, sizes, disk space, duration
src: 0443, 0444, 0445 | area: codes
ui: Status Bar definition
user-words: selected files count, total size, hidden count, free space, music duration
options:
- selected: `{sd}` folders, `{sf}` files, `{si}` items; sizes `{sb..}` all selected, `{sbf..}` files, `{sbd..}` folders (folder sizes only if calculated)
- total: `{td}`, `{tf}`, `{ti}`; sizes `{tb..}`, `{tbf..}`, `{tbd..}`
- hidden by filters: `{hd}`, `{hf}`, `{hi}`; sizes `{hb..}`, `{hbf..}`, `{hbd..}`; `{hse}` = `Everything` while Show Everything is active (use inside `{h!}`)
- `{grp}` number of groups
- disk: free `{dfb}` / `{dfa}` (+ side letters, for example `{dfDb}`), used `{dub}`/`{dua}`, total `{dtb}`/`{dta}`, `{pf}` percent free, `{pu}` percent used
- media: `{tmp3}` total duration, `{smp3}` selected duration (Advanced option `status_metadata_trigger` decides if the status bar may trigger the calculation)
notes: Default status bar shows selected/total folders and files, extensions, hidden count, sizes, format indicator, free space, used bar.

## codes.statusbar.graphics | Status bar: icons, bar graphs, percentages
src: 0446, 0448 | area: codes
ui: Status Bar definition
user-words: bar graph free space, percent of dvd, format lock icon, icon in status bar
options:
- `{fl}` format lock icon (clickable; tooltip says where the format came from), `{gfl}` grayscale
- `{i:dir}`, `{i:file}`, `{i:.mp3}` or `{i:/path/icon.png}` icon (scaled to fit)
- `{cp+V=<num>/<den>}` percentage number (codes or absolute `4.7gb`, `kb`, `mb`, `gb`; example `{cp+V=sb/4.7gb}`); plain `{cp}` = used space (`V=du/dt`)
- `{bg+<params>}` bar graph, params comma separated: `W=<px>` (-1 = section width; negative = no DPI scaling), `C=#rrggbb` solid, `C1`/`C2` gradient ends, `C3` colour over 100%, `B=#rrggbb` or `B=n` background, `T=#rrggbb` or `T=n` text, `G=0..6` gradient (0 solid, 1 normal, 2 scaled, 3/4 Computer-style unthemed A/B, 5/6 themed A/B; A for used space blue until 90% then red, B for free space red below 10%; setting any `C3` moves the cut-off to 100%), `F=0..6` frame (0 none, 1 raised 3D, 2 flat dark, 3 fill the section as background, 4 flat always dark, 5 flat light, 6 sunken 3D), `L=0|1` half height lines (stack graphs), `V=<num>/<den>`
notes: Examples: `{bg+F=3,T=n,W=-1,B=#BBBBBB}<#ffffff> {pu}% full, {df} free`; `{bg+L=0}{bg+L=1,V={df}/{dt}}`.

## codes.statusbar.other | Status bar: drive, selection, variables, conditions
src: 0447 | area: codes
ui: Status Bar definition
user-words: show drive letter, show file system, selected file date, variable in status bar, show only in folder
options:
- drive/state: `{dlet}`, `{dlab}`, `{fsys}`, `{vm}` view mode, `{ls}` Lister state
- selected file: `{sel:<keyword>}` with keywords `name`, `size` (append `b` or `k` for bytes/KB, example `{sel:sizek}`), `create` and `write` (append `d` date only or `t` time only), `access`, `attr`, `desc`, `path`, `index`
- variables: `{var:<scope>:<name>}`, scopes `glob`, `lst`, `tab`, `src`, `dst`, `left`, `right` (`{varL:tab:x}`, `{varR:tab:x}`, `{varD:tab:x}`); negate with `!` (`{var:!glob:X}`); set from commands with `@set`, toggle example `@if:$glob:ShowExtraInfo @set glob:ShowExtraInfo @if:else @set glob:ShowExtraInfo=on @if:common @toggle:update`
- tests returning 1 or empty (use inside `{h!}`): `{ifpath:<path|pattern|regex:...>}` (`!` negates; alias allowed; escape `(` `)` with `'`; `C:\MyFolder(|\*)` = folder and below; side variants `{ifpathL:}` `{ifpathR:}` `{ifpathD:}` uppercase), `{ifexists:<path>}` (relative `.\` `..\`, `*` in last component; avoid network paths), `{if:<command>}` and `{ifset:<Set ...>}` (command state, for example `{if:!Set VIEW=Details}`)
notes: Tests re-run on every status update; put cheap tests (`ifpath`) first. Identical repeated tests are cached.

## codes.statusbar.hide | Hiding and padding sections
src: 0449, 0450 | area: codes
ui: Status Bar definition
user-words: hide section when zero, align status bar with tree, fixed width section
options:
- hide: `{h!}...{h!}` show only if all codes inside are non-zero; `{h#}...{h#}` if any non-zero; `{h?}...{h?}` only if all zero; `{h=expr=}...{h!}` evaluator (true hides). Codes may sit inside the condition tag (`{h?{si}}{ti} object(s){h?}`), several conditions allowed, do not nest or overlap hidden sections
- padding: `{padN}` percent of total width, `{rpadN}` percent of remaining width, `{wtree}`, `{wtree2}`, `{rtree}`, `{rtree-}`, `{rtree2}`, `{rtree2-}` (`-` right-justifies), `{wleft}`, `{rleft}`, `{rleft-}`, `{widthN}` pixels scaled by DPI, `{width-N}` pixels unscaled
