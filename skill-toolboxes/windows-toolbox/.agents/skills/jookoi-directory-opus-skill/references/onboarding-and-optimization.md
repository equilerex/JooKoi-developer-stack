# Setup Wizard and Usage Optimization

Guide a user through a fast, mix-and-match setup of Directory Opus 13, or turn their existing folder, transfer, and column habits into 1-click shortcuts.

## Contents

- [Cross-harness guardrails (Read first)](#cross-harness-guardrails-read-first)
- [Run the audit first](#run-the-audit-first)
- [Opening screen template](#opening-screen-template)
- [Setup Wizard (one screen)](#setup-wizard-one-screen)
- [Apply with dopus.ps1 apply-wizard](#apply-with-dopusps1-apply-wizard)
- [Verified DOpus 13 column keywords by domain](#verified-dopus-13-column-keywords-by-domain)
- [Optimization Wizard (Usage-history pass)](#optimization-wizard-usage-history-pass)
- [Live telemetry add-in](#live-telemetry-add-in)

---


## Cross-harness guardrails (Read first)

> [!CAUTION]
> Every agent harness (Claude Code, Antigravity, Cursor, GitHub Copilot) must obey these rules without exception:
> 1. **Follow the [Step protocol](#step-protocol).** One question tool call per screen, payload copied from the spec. The explanation lives in the option descriptions, not in a chat table.
> 2. **Follow the [Recommendation rule](#recommendation-rule).** `(Recommended)` goes only where that rule allows it.
> 3. **Max 4 options per question.** Claude Code splits 5+ options into an awkward `"More options"` page. A call holds up to 4 questions.
> 4. **Zero GUI automation (`SendKeys` / mouse clicks are banned).** Never use `System.Windows.Forms.SendKeys`, `user32.dll` mouse events, or coordinate clicking to configure Directory Opus. They hijack the user's screen and mis-click UI elements.
> 5. **Apply at the file + silent command level in one pass.** Write the user's choices to a JSON file and run `dopus.ps1 apply-wizard -ConfigFile <path>`. It backs up config, stops Opus, edits the XML files directly with real app icons, restarts Opus, and locks in the Default Lister in ~5 seconds.
> 6. **Put app and utility buttons on the `Favorites Bar`.** Never create a separate toolbar row (`Quick Tools.dop`) for 2 or 3 buttons. Place them on `Buttons\Favorites Bar.dop` right before `Other Favorites`.

### Step protocol

Each wizard screen is **one question tool call** (`AskUserQuestion`, `ask_question`) built from the spec:
- Copy `header`, `question`, `multiSelect`, every `label` and every `description` as written. Fill `<placeholders>` from `audit`. Do not add, merge, reword or drop options, except the `audit` filtering the spec describes.
- No table or recap in chat before the call. The question text carries the progress (`Setup 2/4`), and each description says what the choice does in plain words.
- Never stop between questions that fit in one call. A call holds up to 4 questions, and the harness moves through them without a model turn in between.
- Question tools cannot pre-check an option. Default-on is done with an `Add all recommended` option, never by asking the user to tick every item.
- Read `Other` answers explicitly. Free text that names something not offered (a column, a folder, an app) is mapped and confirmed in one line, or asked about if ambiguous. Never drop it or silently swap in a listed option.
- **Fallback:** no question tool in this harness → print the same questions as a numbered list in chat (label plus description per line) and end the turn.

### Recommendation rule

`(Recommended)` goes at the end of the label. The ease-of-use additions this skill ships (folder views, toolbar buttons, navigation aids, triage bar, folder pins, local telemetry) are recommended and on by default, since they exist because they help. Never recommend, and never switch on by default:
- Changes to stock on/off features (Folder Tree, `Operations` toolbar, row spacing). The wizard does not offer them at all.
- Recursive counts (`filecounttotal`, `dircounttotal`) as global columns. They always carry the heads-up in their description: they do not slow browsing, but each one walks every subfolder in the background, so values fill in late and the disk stays busy on large trees, network drives and USB disks. The `Columns` button toggles them where needed.
- Anything that does not apply on this machine. Instant sizes need Everything (`environment.everythingInstalled`). App buttons need the app installed.
- Extra global columns (`created`, `type` and the rest). They are a taste choice, opt-in on the Columns question.

Do not add or remove `(Recommended)` beyond what the spec marks.

---

## Run the audit first

Run `info` and `audit` silently before showing the opening screen or asking any wizard question. Never ask the user what the machine already knows.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File <skill>/scripts/dopus.ps1 info
powershell -NoProfile -ExecutionPolicy Bypass -File <skill>/scripts/dopus.ps1 audit
```

| Audit JSON field | What it tells you |
|---|---|
| `environment` | Detected **Everything**, **PowerShell 7**, **Windows Dark Mode**, and `installedApps` (`vscode`, `cursor`, `git`, `wt`, `7zip`, `obsidian`, `ffmpeg`, `magick`, `sharex`, `blender`, `adobe`) |
| `setup.state` | `pristine` (score `<= 2`, mostly stock defaults) or `customized` (score `> 2`) |
| `setup` flags | Whether `Explorer Replacement`, `Go UP BACK` background double-click, and the `Operations` toolbar are active |
| `telemetry` | Whether `JooKoiTelemetry.js` is installed, event counts, `stepWalkTargets`, `uiToggles`, and `tabPingPongs` |
| `passiveUsage` | Top visited/target folders (`smartfav.osf`), `stagingFolders` (`Downloads`, `Screenshots`, `DCIM`), manual column tweaks (`AutoFormats`), MRU history, and `funclog.dfl` transfer paths |

---

## Opening screen template

When the user asks *"what does this skill do?"*, *"help me set up Opus"*, or opens a general session, print **only** this short, scannable block (filled with their live `audit` values). Do **not** dump internal script flags, KB counts, or triage rules on the opening screen.

```markdown
**Directory Opus <version>** | Setup: `<Stock defaults | Customized>` | Everything search: `<Connected | Not found>`

### Start with a guided wizard
- 🎯 **Setup Wizard** (say `"run setup wizard"`): one quick screen. Pick your window layout and columns, then add the recommended extras in one click: folder views, speed-ups, app buttons (**<list top 3-4 detected apps>**) and folder pins. Your existing favorites and toolbars stay as they are.
- ⚡ **Optimization Wizard** (say `"optimize my setup"`): Data-driven pass over your Directory Opus usage history (**<N> tracked folders** + live telemetry). Shows your most-visited unpinned folders, frequent transfer pairs, and `Downloads` / `Screenshots` habits, then lets you choose which 1-click shortcuts to add (nothing changes without your approval).

### Or ask for anything directly
- 💬 **Ask or build on the spot:** Ask if Directory Opus can do something, how to find a setting, or tell me to build a button, hotkey, folder view, batch rename, or script for you.
- 🛡️ **Safe by default:** Every change is applied cleanly to your config files after taking an automatic timestamped backup you can revert in one command.
```

Then end the turn and wait for the user's choice.

---

## Setup Wizard (one screen)

The whole wizard is **one question tool call with 4 questions**, plus an optional second call only when the user picks `Let me choose`. No stops between questions, no chat text before the call.

Defaults:
- **Skill extras are on by default.** Everything this skill adds (folder views, toolbar buttons, navigation aids, pins, triage bar, telemetry) comes in through `Add all recommended`. Picking one by one is the opt-in path, not the default.
- **Stock on/off features are not offered.** The Folder Tree, the `Operations` toolbar and row spacing are the user's own choice in Opus. Leave them as they are and do not ask. Change them only when the user asks.
- **Build the extras list from `audit`.** Leave out anything already there (`setup.existingToolbarButtons`, `setup.goUpBackEnabled`, `telemetry.installed`, pins with `inFavorites == true`) and anything the machine cannot do (instant sizes without `environment.everythingInstalled`, app buttons for apps not in `environment.installedApps`). Put the short names of what is left in the Q3 question text.

### Screen 1

```yaml
- header: Layout
  question: "Setup 1/4: layout (now: <currentLayout>). How should new windows open?"
  multiSelect: false
  options:
    - label: Dual side-by-side (Recommended)
      description: Two file lists left and right. Drag or copy straight across.
    - label: Dual stacked
      description: Two file lists, top and bottom. Better on narrow or portrait screens.
    - label: Single pane + Tabs
      description: One file list like Explorer. F6 splits it whenever you need.
    - label: Keep current layout
      description: No change.
- header: Columns
  question: "Setup 2/4: columns. Name, Size and Modified are always shown. Add any to every folder?"
  multiSelect: true
  options:
    - label: Keep just those three
      description: No extra columns. The Columns button can still toggle more per folder.
    - label: Created + age
      description: When the file was created or downloaded, plus a '3 days ago' style age.
    - label: Type
      description: File format column (PDF, Folder, Application) so you can sort by kind.
    - label: Total File Count
      description: "Heads-up: walks every subfolder in the background, so numbers fill in late and the disk stays busy on big, network or USB drives. Browsing stays fast."
- header: Extras
  question: "Setup 3/4: extras. Add all of these? <short names from audit, e.g. Photo/Video/Downloads views, Columns + Copy Path + Smart Paste buttons, instant sizes, type-to-filter, double-click Up, fresh-file colours, VS Code + Cursor buttons, 3 folder pins, triage bar, local telemetry>"
  multiSelect: false
  options:
    - label: Add all recommended (Recommended)
      description: Adds everything listed. One backup first, one command undoes it.
    - label: Let me choose
      description: One more screen with each group, pick what you want.
    - label: Add none
      description: Only layout and columns change.
- header: Apply
  question: "Setup 4/4: Opus restarts for about 5 seconds to apply. Go?"
  multiSelect: false
  options:
    - label: Apply now (Recommended)
      description: Backs up your config first. Make sure no file copy is running.
    - label: Show me the list first
      description: I list every change, then you say go.
```

`Other` on Columns takes any column name: `ext`, `accessed`, `availability` (cloud sync state), `owner`, `dircounttotal` (same heads-up as Total File Count), `filecount` / `dircount` (fast, non-recursive), `desc`.

### Screen 2 (only after `Let me choose`)

One call, up to 4 multi-select questions, one per group that has items left after the `audit` filter. Every option is `(Recommended)`. Drop empty groups. Example:

```yaml
- header: Folder views
  question: "Pick folder views (all recommended):"
  multiSelect: true
  options:
    - label: Photo folders (Recommended)
      description: Mostly-image folders open as thumbnails, with size and date taken in details.
    - label: Video folders (Recommended)
      description: Video folders show resolution, duration and codec.
    - label: Downloads newest first (Recommended)
      description: Downloads and Screenshots sort newest at the top.
    - label: Columns button (Recommended)
      description: Favorites Bar button that toggles file counts and other columns per folder.
- header: Buttons
  question: "Pick toolbar buttons and speed-ups:"
  multiSelect: true
  options:
    - label: Copy Path button (Recommended)
      description: Copies full path, C:/ style path, or file name.
    - label: Smart Paste (Recommended)
      description: Ctrl+Shift+V saves a copied screenshot or text as a file here.
    - label: Instant folder sizes (Recommended)
      description: Sizes come straight from Everything, no waiting.
    - label: <App name> button (Recommended)
      description: Opens the current folder in <App name>. Put extra apps in Other.
- header: Navigation
  question: "Pick navigation aids:"
  multiSelect: true
  options:
    - label: Type-to-filter (Recommended)
      description: Typing filters the folder live. Esc clears it.
    - label: Double-click goes Up (Recommended)
      description: Double-click empty space to open the parent folder.
    - label: Highlight fresh files (Recommended)
      description: Last hour green, today blue.
- header: Pins & triage
  question: "Pick pins and helpers:"
  multiSelect: true
  options:
    - label: Pin <folder name> (Recommended)
      description: "<full path>, opened <N> times. Up to 2 pins here, more in Other."
    - label: Staging Triage bar (Recommended)
      description: "In <stagingFolders>: flatten, group by age, move to archive."
    - label: Local usage telemetry (Recommended)
      description: Logs folder click chains to %LOCALAPPDATA% for later 'optimize my setup'. Never leaves your PC.
```

Keep each group at 4 options or fewer. Overflow (more apps, more pins) goes in the description as "more in Other".

### JSON mapping

- Layout: `layout: "dual" | "stacked" | "single" | "keep"`. Always `tree: "keep"`. Never set `cleanTopToolbar`, `compactRows` or `titlebarMenu` unless the user asked.
- Columns: `["name", "sizeauto", "modified"]` plus `created` + `daterel`, `type`, `filecounttotal`, plus `Other` keywords from the [column keyword list](#verified-dopus-13-column-keywords-by-domain).
- Extras (all, or the picked ones): `photoAutoSwitch`, `videoAutoSwitch`, `columnSwitcherButton`, `copyPathButton`, `smartPaste`, `instantSizes`, `typeToFilter`, `goUpBack`, `highlightFreshFiles` (`true`), `appButtons` (app IDs), `favoritePins` (`label` with a drive suffix when two names clash), `stagingTriageFolders`, `telemetry: "on"`. `Downloads newest first` becomes a `folderFormats` entry per folder (`sortBy: "modified"`, `sortReverse: true`).
- Apply: `Apply now` runs [apply-wizard](#apply-with-dopusps1-apply-wizard) right after the last screen. `Show me the list first` prints the receipt and waits for "go".

---

## Apply with `dopus.ps1 apply-wizard`

Once the user finishes the last screen:

1. **Print a short Configuration Receipt**: one bullet per changed setting, no table.
2. **Restart is already confirmed** by the `Apply` question. Do not ask again. On `Show me the list first`, print the receipt and wait for "go".
3. **Write a JSON config file** (e.g. in `$env:TEMP\dopus-wizard-config.json`) matching this schema (`layout`: `"dual"` | `"stacked"` | `"single"` | `"keep"`, `tree`: `"off"` | `"single"` | `"dual"` | `"keep"`, optional `darkMode`: `true|false`, optional `viewerPane`: `true|false`, optional `replaceContainerFormats`: `true|false`):

```json
{
  "layout": "dual",
  "tree": "keep",
  "columns": ["name", "sizeauto", "modified", "created", "filecounttotal"],
  "photoAutoSwitch": true,
  "videoAutoSwitch": true,
  "instantSizes": true,
  "typeToFilter": true,
  "goUpBack": true,
  "highlightFreshFiles": true,
  "smartPaste": true,
  "copyPathButton": true,
  "columnSwitcherButton": true,
  "appButtons": ["vscode", "cursor", "wt", "7zip"],
  "favoritePins": [
    { "label": "Downloads (A:)", "path": "A:\\downloads" },
    { "label": "Screenshots", "path": "C:\\Users\\Name\\Documents\\ShareX\\Screenshots" }
  ],
  "stagingTriageFolders": [
    "C:\\Users\\Name\\Downloads",
    "A:\\downloads"
  ],
  "folderFormats": [
    {
      "path": "C:\\Users\\Name\\Downloads",
      "viewMode": "details",
      "columns": ["name", "sizeauto", "modified", "created"],
      "sortBy": "modified",
      "sortReverse": true,
      "subfolders": false
    }
  ],
  "telemetry": "on"
}
```

4. **Run `apply-wizard`:**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File <skill>/scripts/dopus.ps1 apply-wizard -ConfigFile "$env:TEMP\dopus-wizard-config.json"
```

5. **Show the completion summary & Optimization Wizard handoff:**
   - Print what was applied and where to find the new buttons on screen (e.g. *"Look on the right side of your **Favorites Bar** just before `Other Favorites` for your **VS Code**, **Terminal**, **Copy Path**, **Smart Paste**, and **Columns** buttons"*).
   - Print the 1-line `dopus.ps1 restore -From <backupPath>` command in case they ever want to undo.
   - **Recommend the Optimization Wizard next for existing users:** Add a closing note:
     > 💡 **Have you been using Directory Opus for a while?** Now that your core layout and defaults are locked in, say **`"optimize my setup"`** anytime to run the **Optimization Wizard**. It will analyze your historical folder visits, copy/move corridors, and manual per-folder column tweaks, show you what it found, and let you pick which personal shortcuts to add.

---

## Verified DOpus 13 column keywords by domain

> [!WARNING]
> Always use the exact Directory Opus 13 internal column keywords below (verified against the v13 manual `Keywords for Columns` table) with `Set COLUMNS=`, `Set COLUMNSADD=`, `Set COLUMNSTOGGLE=`, and `Formats/*.off`. Never guess or use hallucinated keywords like `totalfiles`, `totalsubfolders`, `size(total)`, `picdims`, `mpvfps`, or `mpvvideo`.

| Domain / Category | Column Display Name | Verified DOpus 13 Keyword | Notes / Usage |
|---|---|---|---|
| **Core & Size** | Name, Extension, Extension (dirs) | `name`, `ext`, `extdir` | `ext` splits file extension into its own sortable column |
| **Core & Size** | Size (auto), Size (bytes), Size (KB), Relative Size Graph | `sizeauto`, `size`, `sizekb`, `sizerel` | Always prefer `sizeauto` over `size` for human-readable KB/MB/GB |
| **Core & Size** | Size on Disk (auto), Uncompressed Size | `disksizeauto`, `uncompressedsize` | Physical allocation size vs logical size |
| **Structural Counts** | Total File Count (recursive), File Count (immediate) | `filecounttotal`, `filecount` | Recursive subfolder file count vs top-level file count |
| **Structural Counts** | Total Sub-folder Count (recursive), Sub-folder Count (immediate) | `dircounttotal`, `dircount` | Recursive nested folder count vs top-level folder count |
| **Time & Age** | Modified, Created, Accessed | `modified`, `created`, `accessed` | Date + time (`modifieddate` / `modifiedtime` for date-only or time-only) |
| **Time & Age** | Modify Age (relative), Create Age (relative) | `daterel`, `cdaterel` | Human-readable elapsed time (`2 hours ago`, `Yesterday`) |
| **Paths & Links** | Location (Full folder path), Relative Path, Path Length | `path`, `pathrel`, `pathlen` | `pathrel` is ideal inside **Flat View** (`Set FLATVIEW=on,mixednofolders`) |
| **Paths & Links** | Symlink / Junction Target, Hardlink Count | `target`, `linkcount` | Shows where a symlink, junction, or shortcut points |
| **Cloud, System & Checksums** | Availability, Status Icons, Owner, Attributes | `availability`, `status`, `owner`, `attr` | Cloud sync state (OneDrive/Dropbox), label icons, NTFS owner, `R/H/S/A` flags |
| **Cloud, System & Checksums** | Description, User Description, Tags, Rating | `desc`, `userdesc`, `keywords`, `rating` | `desc` auto-summarizes image dimensions / audio bitrates |
| **Cloud, System & Checksums** | MD5 Checksum, SHA-1 Checksum | `md5sum`, `shasum` | On-demand hash columns |
| **Media (Video & Audio)** | Dimensions, Aspect Ratio, Duration, Frame Rate | `picsize` (or `dimensions`), `aspectratio`, `duration`, `framerate` | Works across video and image files |
| **Media (Video & Audio)** | Video Codec, Audio Codec, Bit Rate, Sample Rate, Data Rate | `videocodec`, `audiocodec`, `mp3bitrate`, `mp3samplerate`, `datarate` | Native media stream properties |
| **Media (Photo & EXIF)** | Date Taken, Camera Model, Camera Make, Lens Model | `datetaken`, `cameramodel`, `cameramake`, `lensmodel` | EXIF photography columns |
| **Media (Photo & EXIF)** | ISO Speed, F-Number, Shutter Speed, Focal Length, Bit Depth, Color Model | `isorating`, `fnumber`, `shutterspeed`, `focallength`, `picdepth`, `colormodel` | Deep EXIF & color profile inspection |
| **Music & ID3** | Artists, Album, Album Artist, Track, Year, Genre, BPM, Initial Key | `mp3artist`, `mp3album`, `mp3albumartist`, `mp3track`, `mp3year`, `mp3genre`, `mp3bpm`, `initialkey` | Audio tag management |
| **Documents & Admin** | Title, Authors, Subject, Category, Company, Pages, Last Saved By | `title`, `author`, `subject`, `category`, `companyname`, `pages`, `doclastsavedby` | Office, PDF, and document metadata |
| **Programs & Binaries** | Product Version, Module Version, Product Name, Company | `prodversion`, `modversion`, `prodname`, `companyname` | Inspect `.exe` and `.dll` version headers |
| **Archives (7-Zip & Zip)** | Packed Size, Compression Ratio, Method, CRC, Encrypted / Solid | `opus7zip:packed`, `opus7zip:ratio`, `opus7zip:method`, `opus7zip:crc`, `opus7zip:solid` (Zip: `zip:compsize`, `zip:compratio`) | Valid inside `.7z`, `.rar`, and `.zip` archives |
| **Script Add-In Columns** | Custom script columns (e.g. Git status, MediaInfo, ExifTool) | `scp:<ScriptName>/<ColumnName>` | Added by `.js` / `.vbs` add-ins in `Script AddIns` |

---

## Optimization Wizard (Usage-history pass)

> [!IMPORTANT]
> The Optimization Wizard **never** applies mystery changes automatically. It always analyzes first, explains the evidence from the user's own usage history, and lets the user pick which specific recommendations they want before touching any file.

When the user says `"optimize my setup"`, `"run optimization wizard"`, or `"what shortcuts should I add based on my usage?"`:

1. Run `dopus.ps1 audit` and inspect `passiveUsage`, `telemetry`, and `environment.installedApps`.
2. Ask one question tool call, following the [Step protocol](#step-protocol), with the same default-on shape as the Setup Wizard. Question 1: `Add all <N> suggestions?` (question text lists the short names) with `Add all (Recommended)` / `Let me choose` / `Add none`. Question 2: `Opus restarts for about 5 seconds to apply. Go?` with `Apply now (Recommended)` / `Show me the list first`. On `Let me choose`, a second call with one multi-select question per kind of finding (pins, staging, formats, pairs, apps), at most 4 each, all `(Recommended)`. Label = the fix in a few words, description = the evidence in plain words (e.g. "Opened 42 times, not pinned"). Build the suggestions from these signals:

| Signal in `dopus.ps1 audit` | What to propose | How to apply |
|---|---|---|
| `topSourceFolders` entry has high `points` and `inFavorites == false` | Pin to **Favorites Bar** (with drive letter suffix if two folders share a name like `Downloads`) | Pass in `favoritePins` to `dopus.ps1 apply-wizard` (or edit `ConfigFiles\favorites.ofv` offline) |
| `stagingFolders` contains high-traffic intake paths (`Downloads`, `Screenshots`, `DCIM`, `Keep`) | Attach the 3-button **Staging Triage** toolbar (`Flatten`, `Group by age`, `Move to Archive`) to those folders | Pass in `stagingTriageFolders` to `dopus.ps1 apply-wizard` |
| `autoFormatTweaks` shows folders where the user manually added columns (`created`, `picsize`, `filecounttotal`) or changed sort order | Save as a permanent **Path Format** so those columns stick automatically | Pass in `folderFormats` to `dopus.ps1 apply-wizard` |
| `topDestFolders` + `funcLogTopFolders` or `telemetry.tabPingPongs` show a frequent source-to-target pair | Link as **Paired Folders** or add a 1-click **Move/Copy to Target** button | Configure Paired Folders or add a button to `Buttons\Favorites Bar.dop` |
| `telemetry.stepWalkTargets` has paths with `chains >= 3` | User repeatedly clicks through 3+ nested folders to reach that target | Pin to **Favorites Bar** or add a `/alias` |
| `environment.installedApps` has tools not yet on their toolbar | Add 1-click app buttons (`VS Code`, `Cursor`, `Terminal`, `7-Zip`, `Obsidian`) to `Favorites Bar.dop` | Pass in `appButtons` to `dopus.ps1 apply-wizard` |

3. Apply the picked findings via `dopus.ps1 apply-wizard -ConfigFile <json>`.

---

## Live telemetry add-in

`scripts/JooKoiTelemetry.js` is an opt-in ES3 JScript add-in that logs UI and navigation events to `%LOCALAPPDATA%\jookoi-directory-opus-skill\telemetry.jsonl` (auto-rotates at 2 MB, escapes non-ASCII paths as `\uXXXX`).

```powershell
# Enable live telemetry (hot-loads immediately into Script AddIns)
powershell -NoProfile -ExecutionPolicy Bypass -File <skill>/scripts/dopus.ps1 telemetry-on

# Disable live telemetry
powershell -NoProfile -ExecutionPolicy Bypass -File <skill>/scripts/dopus.ps1 telemetry-off
```

- **Captured live:** Folder changes (`parent`, `back`, `forward`, `dblclk`), UI pane toggles (`dual`, `tree`, `viewer`, `metapane`, `utility`, `toolbars`), view mode changes, Flat View, Quick Filter, tab open/close/switch, double-clicks, and `Rename` operations.
- **Not exposed by DOpus scripting API:** Arbitrary clicks on built-in toolbar buttons (`Copy`, `Delete`) unless they write to `Logs/funclog.dfl` (`Preferences / File Operations / Logging`).
