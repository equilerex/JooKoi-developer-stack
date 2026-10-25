# Folder formats

Why a folder shows the view mode, columns, sort, grouping and filters it does, which layer chose them, and how to make a change stick.

## User says → concept

| User words | DOpus concept | Where / how |
|---|---|---|
| "view settings", "folder view", "how the folder looks", "folder options" | Folder Format (v13 renamed "Folder Options" to "Folder Format" everywhere) | `Folder / Folder Format` menu, `Properties FOLDERFORMAT` |
| "make all folders look like this", "default view" | User Default format | Folder Format dialog `Save` → Save format for all folders, or `Set SAVEFORMAT=all` |
| "make this folder always look like this" | Path Format | `Save` → Save format for a folder, or `Set SAVEFORMAT=folder` |
| "this folder and everything under it" | Path Format with `Use as the default format for all sub-folders` | `Set SAVEFORMAT=folder,subfolders` |
| "every folder named X", "all `node_modules`" | Wildcard Path Format | `Preferences / Folders / Folder Formats` → Add → Wildcard Path Format |
| "photo folders switch to thumbnails by themselves" | Content Type format | `Preferences / Folders / Folder Formats` → Content Type Formats |
| "network drives / USB / zip files look different" | Folder Type Formats | same page, Folder Type Formats section |
| "it remembers how I left it" | Automatic (auto-remembered) formats | `Preferences / Folders / Automatic Formats` |
| "stop it changing", "freeze the view" | Format Lock | status bar info icon right-click → Format Lock, `Set FORMATLOCK=toggle` |
| "the little i icon in the status bar" | `{fl}` status bar code (info / padlock icon) | `Preferences / File Displays / Status Bar` |
| "new windows ignore my format" | Format stored in Default Lister, layout, tab group or style | see Container layers |
| "group by", "disable grouping" | Grouping tab of the format | `Set GROUPBY=off` |
| "can't sort by X" | Sort field must be a displayed column | Columns tab, `Set SORTBY` |

## Model

A folder format is one bundle of display settings: Columns (which, widths, sort fields, freeze point), Sorting options, Grouping, Display (view mode, checkbox mode, thumbnail size, font), Show Filters, Hide Filters. Each saved format has a checkbox per tab. An unchecked tab contributes nothing, so a narrow format (for example "group by Date modified" only) inherits the other tabs from the more general format below it.

Formats live in two kinds of place:

1. The Formats list in `Preferences / Folders / Folder Formats` (plus the separate auto-remembered list). Consulted every time a folder is read.
2. Copies frozen inside containers: the Default Lister, saved layouts, folder tab groups, styles and open tabs. These are applied when the container loads and win over the list.

Config files: saved formats are XML in `/dopusdata/Formats/*.off`. See `references/config-files.md` for apply routes.

### Resolution order on navigation (0222)

Opus walks the Formats list top to bottom and takes the first match:

| # | Layer | Notes |
|---|---|---|
| 1 | Path Format: exact path, or a Wildcard Path Format that matches | Applies to sub-folders only if `Use as the default format for all sub-folders` is on and the sub-folder has no own path format. Precedence between an exact and a wildcard match is not stated `[unverified]` |
| 2 | Automatic (auto-remembered) format | Only if automatic formats are enabled. An explicit path format always beats it (0844) |
| 3 | Content Type format | Only enabled groups, only if the folder meets that group's threshold |
| 4 | Folder Type Format | Archives, Cloud Storage, Collection, Duplicate Files, Find Results, Flat View, FTP, Local Drives, Network Drives, Portable Devices, Removable Drives, Search Results, Synchronize. Used only if turned on |
| 5 | User Default format | Catch-all, cannot be turned off |
| (6) | Factory default | Non-editable. Reachable only by reset commands |

System folders (This PC when Opus draws it, Portable Devices root `mtp:`) have their own formats in the System folders section. The manual does not place them in the numbered order.

Flat View and Synchronize formats are applied when the mode is turned on, not on navigation.

### Inheritable columns

`Include columns from other matching formats` (Columns tab, only when editing a saved format in Preferences): Opus keeps walking down the order after the first match and adds the columns (only columns) of each further match. It stops at the first matching format that has this option off.

### Layers that bypass the order

| Layer | Effect | Control |
|---|---|---|
| Format Lock | No automatic change at all on navigation. Manual edits still work | Status bar info icon right-click → Format Lock, `Set FORMATLOCK=on\|off\|toggle`, `Folder` menu → Format Lock. Global for all tabs unless `Preferences / Folder Tabs / Options / Per-tab format lock` is on. A style can also turn it on or off |
| Sticky manual edits | After you edit the format in a tab (column header, Folder Format dialog), the edited format follows you to the next folder until a folder with its own specific format is reached | `Preferences / File Displays / Options / Preserve folder format edits between folders`. Off = format resets on every folder change |
| Automatic formats on | Changes the sticky rule: editing one folder then moving to another loads the new folder's format instead of carrying the edit (0844) | `Preferences / Folders / Automatic Formats` |
| Container formats | Default Lister, layout, tab group, style apply their stored format on load | See next table |

### Container layers

| Container | What it stores | Switch to make it defer to the Formats list |
|---|---|---|
| Default Lister | Format in use when it was set or auto-updated on Lister close | `Preferences / Layouts and Styles / Default Lister / Ignore folder format of Default Lister`. Or turn off `Update Default Lister automatically when closing a Lister` and set it manually (`Prefs SETLISTERDEFAULTS`) |
| Saved layout | Format of every folder in every tab | Per layout: `Use folder formats saved within this layout` (flag `F` on `Preferences / Layouts and Styles / Layouts`). Per load: `Prefs LAYOUT="name" LAYOUTIGNOREFORMATS=yes` |
| Folder tab group | Each tab has its own format, which overrides the Formats list. Editing the Folder Formats page does not touch it | `Preferences / Folder Tabs / Groups` → Edit Format per tab (drop-down copies it to all tabs) |
| Style | Optional Format, View Mode (`Auto` = ask the Formats list), Format Lock | `Preferences / Layouts and Styles / Styles` → File display configuration |
| Last Closed Listers | Lister state restored on startup includes tab formats | Startup option on `Preferences / Launching Opus / Startup` |

## Identify the current format

Hover the info icon (`{fl}` code) in the status bar. The tooltip says how the format came about (for example "auto-remembered, then modified by a command that added the Created column"), where the Lister came from (layout name, Last Closed Listers), and where a folder background image came from.

Right-click the icon for:

| Menu item | Does |
|---|---|
| Format Lock | Toggle lock |
| Folder Format | Opens the dialog |
| Manage Folder Formats | Opens `Preferences / Folders / Folder Formats` |
| Content type format list | Apply one now (listed even when disabled) |
| Reset to folder's format | What a fresh tab would get. Same as `Set FORMAT=!folder` |
| Reset to folder-type format | Folder Type Format for this kind of location. `Set FORMAT=!default` |
| Reset to "User Default" format | `Set FORMAT=!user` |
| Reset to factory default format | `Set FORMAT=!factory` |
| Edit Status Bar | `Preferences / File Displays / Status Bar` |

If the icon is missing, the status bar definition lost `{fl}`. Add it back on `Preferences / File Displays / Status Bar`. `Enable format lock padlock icon` on that page makes the icon a permanent padlock (left-click locks, right-click shows the menu).

`Go FORMATPATH` reads the folder the current format was saved for (useful when a parent's sub-folder format is in effect).

## Folder Format dialog tabs

Open: `Folder / Folder Format`, column header right-click → More, or `Properties FOLDERFORMAT`.

| Tab | Holds (exact option names) |
|---|---|
| Columns | Column list, Width (`Auto`, `Expand`, `Collapse`, `Fill`, pixels), Min / Max, Freeze, Sort (click, Ctrl/Shift+click for multi-sort and per-field direction), `Auto-size all columns in Details and Power modes`, `Hide file extension in Filename column`, `Include columns from other matching formats` (Preferences only), `Reverse` (Index column) |
| Sorting | `Keep folders sorted alphabetically`, `Manual sorting`, `Numeric order filename sorting`, `Reverse overall sort order`, `Sort name and extension separately`, `Sort newly copied and created files` (per-folder override of the global option), `Word sort`, `Mixing` (files first / folders first / mixed), `Ignore prefix` |
| Grouping | `Group by`, `Scheme`, `Sort groups` (v13 adds ordering by member count), `Combine` (Combine similar values / Never combine values / Singletons in 'Other' group), `Collapse all groups initially`, `Put folders in their own group` |
| Display | `View mode`, `List mode column width`, `Checkbox mode`, `Thumbnail size`, `Thumbnail resizing`, `Font` (separate thumbnails font possible) |
| Show Filters / Hide Filters | `File names`, `Folder names` (wildcard or `Use regular expression`, multi-line in v13), `Attributes`, separate folder attribute filters, reparse point filter (v13). Stack on top of `Preferences / Filtering and Sorting / Global Filters`. `Set SHOWEVERYTHING=toggle` bypasses all filters |

Bottom buttons (v13): `Save` (see below) and `Load` (menu: reset to User Default, factory default, or load a Favorite format). Loading updates the dialog only, nothing applies until OK.

Moved out of folder formats in v13, so they do not follow format resolution: background image/color (`Preferences / Folders / Folder Images`), folder size calculation (`Folders / Folder Sizes`), tab edge colors (`Folder Tabs / Edge Colors`), per-folder labels (`Labels / Label Assignments / In Specific Folders`), per-folder toolbars (`Toolbars / Folder Toolbars`).

## Making a change stick

A change made in the Lister (header click, `Set VIEW=...`, `Set GROUPBY=...`) is live state only. It persists when one of these happens:

| Route | Result | Command |
|---|---|---|
| Save → Save format for a folder | Path Format for the shown folder (Up button picks a parent) | `Set SAVEFORMAT=folder` |
| ...plus Save for all sub-folders | Turns on `Use as the default format for all sub-folders` | `Set SAVEFORMAT=folder,subfolders` |
| ...plus `Replace this folder's format…` | Also rewrites that folder's format inside saved layouts, saved tabs, styles and open tabs | `Set SAVEFORMAT=folder,replace` |
| Save → Save format for all folders | New User Default | `Set SAVEFORMAT=all` |
| ...plus `Clear any saved folder formats` | Deletes path formats so User Default takes over | `Set SAVEFORMAT=all,clear` |
| ...plus `Replace the folder format…` | Resets formats stored in layouts, tabs, styles | `Set SAVEFORMAT=all,replace` (`quiet` skips the warning) |
| Save → Save a favorite format | Named favorite, applied by `Set FORMAT="name"` or `Set FORMATLIST` | `Set SAVEFORMAT=favorite FORMAT="name"` |
| Delete a folder's saved format | Folder falls back down the order | `Set SAVEFORMAT=folder,clear` |
| Automatic formats on | Edits saved implicitly per folder (up to the `Remember at most` limit, default 100) | Right-click entry → `Make Permanent` converts it to a Path Format |
| Edit in Preferences | Double-click a format in the list. v13: Browse re-targets a path format to another folder. Share / Paste exchange definitions | `Prefs PAGE=folderformats` |

After clearing or changing saved formats, open tabs keep their current format. Re-evaluate with `Set FORMAT=!folder`.

Side effect of replace-all: some Folder Type formats get extra columns added automatically (Cloud Storage gets Availability and Status). Stop that with the Advanced options `deffmt_cloud_availability` and `deffmt_cloud_status` set to False.

## Automatic formats (v13)

Page: `Preferences / Folders / Automatic Formats` (0844 calls it `Folders / Folder Formats / Automatic Formats`).

| Option | Effect |
|---|---|
| `Remember folder formats automatically` | Enables the system. Any format change in a Lister is saved for that folder |
| `Remember at most` | List size limit. Old or missing folders drop out first |
| `Use as the default format for all sub-folders` | Remembered formats also cover sub-folders |
| Remembered Formats list, right-click | `Make Permanent`, `Remove` |
| `Clear Formats` | Empties the list |

Kept in a separate list from curated Path Formats. If auto formats feel messy, turn them off and save explicitly.

## Content types

| Item | Detail |
|---|---|
| Basis | File Type Groups (Images, Music, ...). New groups are created in the File Types editor and then appear in the Content Type Formats section |
| Enable | Checkbox next to each group on `Preferences / Folders / Folder Formats`. Off by default |
| Threshold | Percentage shown right of each entry. Click it to edit. Dialog options: `Consider subfolders when calculating content threshold`, `Minimum files`, `Maximum files`, and an option to hide the format |
| Manual use | Disabled content formats still appear in the info icon menu and `Set FORMATLIST`. `Set CONTENTFORMAT=<group>` applies one |

## Recipes

**Same view everywhere, wipe per-folder clutter.** Set up the view in any folder, then:
```
Set SAVEFORMAT=all,clear,replace
Set FORMAT=!folder
```
Then check Container layers: turn on `Ignore folder format of Default Lister` (or set the Default Lister again), and turn off the `F` flag on layouts you use.

**Disable grouping forever.**
1. `Set GROUPBY=off` in a folder, then `Set SAVEFORMAT=all,clear,replace` so User Default and stored container formats lose grouping.
2. On `Preferences / Folders / Folder Formats`, open each enabled Content Type and Folder Type format that has its Grouping tab checked. Uncheck the tab or set `Group by` to none.
3. Clear Remembered Formats (or turn automatic formats off) since remembered formats may carry grouping.
4. Hover the info icon in a folder that still groups. It names the layer.

**Format updated but folders are not.** Something above or outside the edited format wins. Check, in order: info icon tooltip, Format Lock (padlock), sticky edit from the previous folder (`Set FORMAT=!folder` fixes it now), tab group tab format, layout `F` flag, Default Lister format, a Path or Wildcard format higher in the order. If you edited a general format (User Default, Folder Type), any path, remembered or content format that matches wins over it.

**Reapply User Default to one folder.** `Set FORMAT=!user` (live only). To make it stick, delete the folder's path format (`Set SAVEFORMAT=folder,clear`) and its remembered format.

**One folder sorted by date, newest first, every time.**
```
Set SORTBY=modified SORTREVERSE=on
Set SAVEFORMAT=folder
```
`SORTBY` needs the column displayed in the format.

**Thumbnails in image folders only.** Enable the Images Content Type format, set its Display tab `View mode` to Thumbnails, tune the threshold (for example 50 %, Minimum files 5).

**Only add a column for one tree.** Path Format for the root with only the Columns tab checked, `Include columns from other matching formats` on, `Use as the default format for all sub-folders` on.

**Hotkey to lock / unlock format.** `Set FORMATLOCK=toggle`.

## Diagnostic procedure

1. Hover the status bar info icon. Read the origin. If the icon is a padlock, the lock is on.
2. Match the symptom:

| Symptom | Layer overriding | Fix |
|---|---|---|
| Format never changes between folders | Format Lock | Click padlock, `Set FORMATLOCK=off`. Check styles that set Format Lock |
| Last folder's columns follow me everywhere | Sticky manual edit | `Set FORMAT=!folder`. Turn off `Preserve folder format edits between folders` if unwanted |
| Edited User Default, nothing changed | Specific formats above it (path, remembered, content, folder type), or tabs still hold the old format | `Set SAVEFORMAT=all,clear,replace`, then `Set FORMAT=!folder`. Check Folder Type and Content formats with their tab checked |
| Edited a path format, new Lister ignores it | Default Lister or layout stored format | `Ignore folder format of Default Lister`, layout `F` flag off, or save with `replace` |
| Tab group folder ignores saved formats | Tab group per-tab format | Edit Format in `Preferences / Folder Tabs / Groups` |
| Folder randomly switches to thumbnails or groups | Content Type format threshold met | Disable that content type or raise its threshold |
| Network / USB / zip / search results look different | Folder Type Format | Edit or uncheck that Folder Type Format |
| Folder remembers a change I did not save | Automatic formats | Remove entry in Remembered Formats, or turn the system off |
| Can't change sort column | Sort field must be a displayed column. Or locked format / Manual sorting on | Add the column (Columns tab), turn off `Manual sorting`, unlock |
| Flat View adds a Location column | Flat View Folder Type Format | Edit it. If Format Lock is on, Flat View now respects it (v13), except when Synchronize turns Flat View on |
| Files show / hide differently per folder | Format Show/Hide Filters stacked on Global Filters | Check Filters tabs, `Set SHOWEVERYTHING=toggle` to test |

## Pitfalls

- Saving a folder format does not update open tabs, layouts or tab groups unless `replace` (or the dialog's Replace option) is used. The manual names layouts, saved folder tabs, styles and open tabs. Whether "saved folder tabs" means tab groups is not stated `[unverified]`, so check tab groups by hand.
- An unchecked tab in a specific format means "inherit", not "empty". A path format that only sets grouping still takes columns from the next matching layer.
- `Clear any saved folder formats` removes your curated path formats. Use Share on the Folder Formats page first if they matter.
- Background images, folder sizes, tab colors, labels and per-folder toolbars are not part of folder formats in v13. Changing the format will not affect them.
- Automatic formats default limit is 100 folders. Older entries are silently evicted.
- Content type matching uses File Type Group extensions, not file contents.
- The `{fl}` icon can be removed by a custom status bar. The menu commands still work (`Folder` menu → Format Lock).
- `Set SAVEFORMAT=all,clear` with `quiet` skips the confirmation. Do not use `quiet` on a user's machine without saying what it deletes.
- Commands renamed in v13: `Properties FOLDEROPTIONS` → `Properties FOLDERFORMAT`, `Set GROUPREVERSE` → `Set GROUPORDER`. Old names still work. The manual's `Set` and `Properties` reference pages still list only the old names, so `references/commands.md` does too.
