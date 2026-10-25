# Telling the user where to click

Scope: how to write manual steps so they match the screen, and how to look up the exact on-screen text. Guidelines, not a template. Shape the answer to the question.

## Never trust remembered labels

The manual's prose, forum posts and model memory use old or reworded labels. Real example on 13.11: manual says `Set As Default Lister`, the Settings menu shows `Set Lister Defaults`.

Before naming a menu item or Preferences option to the user, look it up on their install:

```
dopus.ps1 ui -Query "<command text or label>"      menu/toolbar path, e.g. "Settings > Set Lister Defaults"
dopus.ps1 prefs -Query "<option text>"             "Preferences / <Category> / <Page> : <option label>"
```

- `ui` reads the user's own `Buttons\*.dop`, so it also shows their customizations. Query by command (`SETLISTERDEFAULTS`, `COPYNAMES=unc`) or by label.
- `prefs` reads the install's Preferences search cache. The category/page split is a heuristic, check it against `references/preferences-map.md`.
- No hit: grep `references/` for the user's words and synonyms first, then say the label is `[unverified]`.

## Entry points (verified in the default 13.11 menus)

Start every walkthrough from something the user can see. Say it once per answer, not per step.

| To open | Say |
|---|---|
| Preferences | top menu bar `Settings` > `Preferences...` |
| Customize (toolbars, menus, hotkeys) | `Settings` > `Customize Toolbars and Keys...`. Fallbacks: right-click empty toolbar space > `Customize`, or the Lister window icon (top-left of title bar) > `Customize` |
| Save current window as the default | `Settings` > `Set Lister Defaults` |
| Layouts | `Settings` > `Lister Layouts` > `Edit Layouts...` / `Save This Lister...` |
| Toolbar sets | `Settings` > `Toolbars` > `Toolbar Sets` |
| File types | `Settings` > `File Types...` |
| Scripts | `Settings` > `Scripts...` / `Install Script...` |
| Backup and restore | `Settings` > `Backup and Restore...` |
| Dark mode, themes | `Settings` > `Dark Mode`, `Lister Themes...` |
| Copy path of current folder | `Edit` > `Copy Other` > `Folder Path` |

Top menu bar, default: `File  Edit  FTP  Tools  Settings`. A user may have edited it. If a label is not found on screen, run `ui`.

## Preferences dialog layout

- Left: page tree (categories expand into pages). Right: the options of the selected page.
- Bottom-left: search field (F3). Bottom-right: `OK`, `Apply`, `Cancel`. Pages with a `Save` button instead of `Apply` apply live.
- A tree path is `Category / Page`. Write it as `Preferences / Category / Page`.
- A checkbox is `check` / `uncheck`. A radio group is `select`. Say which it is. `references/preferences-map.md` lists the control type where it is known.
- Skip the click path when `Prefs PAGE=<id>` can open the page for the user. Offer it.

## Writing guidelines

The reader is tired and scanning. These are habits, not a format.

- **Where, then what.** Give the location in one short line, the action in the next. Do not pack both into one sentence.
- **One action per line.** Numbered when order matters.
- **Exact on-screen text** in backticks, copied from the lookup. Never paraphrase a label.
- **Define DOpus words at first use.** `Lister` = a Directory Opus window. `Default Lister` = the window template new windows copy. `Location field` = the clickable path (breadcrumbs) in the bar above the file list. Use the user's word next to it when they gave one.
- **Say what they will see after.** One short line ("the path bar now shows a copy icon").
- **Say live or restart.** Whether the change applies immediately, after `Apply`/`OK`, or needs Opus restarted.
- **Offer, don't push.** If you can open the page or run the command for them, offer both: "I can open this page, or you can do it by hand."
- **Short answers stay short.** A one-step answer is a sentence, not a list. Only use headings and tables when they help scanning.
- **Match the question.** Answer what was asked first. Extra findings go after, only if they change what the user does.
- **Do not state UI behavior you have not seen or read.** Mark it `[unverified]`, or ask the user to look.

Example of the shape, not a required template:

```
Open Preferences: top menu `Settings` > `Preferences...`

1. Left tree: `Launching Opus` > `Startup`
2. Under "What happens when Opus starts up", select `Open the Default Lister`
3. Click `OK` (bottom right)

Applies on next Opus start.
```

## When something fails

- `stop` times out: report it, say what you saw, and ask which route the user wants (quit Opus themselves with `File` > `Exit Directory Opus`, or the live reload route). Do not switch routes silently.
- A dialog opens: quote its text. See `SKILL.md` Apply rules.
