# Knowledge base (kb)

Distilled Directory Opus 13 feature reference. One entry per feature or Preferences page. Written for lookup by grep, not for reading top to bottom.

## How to use

1. Find entries: `scripts/dopus.ps1 kb -Query "<words>"` prints matching entries ranked by hits. Or `grep -n "^## " <area file>` to list entries.
2. Read only the entry you need. Entries are 5 to 40 lines. Never load a whole area file.
3. Entry labels (option names, menu items) come from the manual. The installed version can differ. Before quoting a label to the user, confirm it with `dopus.ps1 ui` or `dopus.ps1 prefs`.
4. No hit: grep `references/` (task-oriented files), then the install. Only then the web.

## Entry format

```
## <slug> | <Feature title>
src: <manual section numbers, provenance only, nothing to open> | area: <area>
ui: <Preferences / Category / Page>  or  menu/toolbar path  or  n/a
user-words: comma list of what users call it
what: 1 to 3 short sentences
options:
- `Exact label` (checkbox|radio|dropdown|field|button; default X): effect
cmd: `Command ARG` - purpose
notes: gotchas, limits, version gates (13.x+)
see: slug, slug
```

Fields are omitted when empty. `[unclear]` marks a source passage that was ambiguous.

## Areas (files)

The area files and what each covers are listed in `SKILL.md` ("Where to look"). Each starts with a contents block (slug: title), then the entries. Never open a file whole: use `scripts/dopus.ps1 kb`, or grep for the heading and read that entry only.

Not distilled here: the internal command arguments (`references/commands.md`) and the scripting object reference (grep the cy-gh typings or the manual online).
