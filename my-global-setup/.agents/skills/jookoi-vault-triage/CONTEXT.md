# CONTEXT — jookoi-vault-triage
updated: 25-09-2026 06:30

## What this is

The triage engine extracted from the retired `jookoi-mobile-vault` GitHub Actions pipeline (`.github/scripts/triage.js`, `_meta/RULES.md`, the `jookoi-vault-intake` skill). Design: `JooKoi-vault/_architecture/plans/2026-09-25-single-vault-on-obsidian-sync.md`, phase 1. `lib.js` shared helpers, `redact.js` patterns, `guard.js` snapshot and check, `inbox.js` the loop, `import.js` import mode.

## Why it's built this way

- Engine and policy are split so the same skill runs in a second vault (the work one) with its own `TRIAGE.md`. The scripts read paths and the allowlist from `TRIAGE.md` frontmatter and hardcode no vault folder.
- The model triages staged copies in `<staging>/queue/`, never the Inbox originals. With Obsidian Sync there is no git remote holding the raw capture, so redacting in place would destroy the only copy of a value.
- `stage` commits a snapshot of the whole vault folder before copying. It records owner edits that arrived through Sync, so the `triage:` commit holds only the batch's changes, and it gives each capture a commit for provenance (`(src <name> @<hash>)`). A run is therefore two commits: snapshot and triage.
- Capture time comes from the filename (`YYYY-MM-DD-HHmmss`), then a `created:` field, then mtime as a reported last resort. Sync sets mtime to arrival on the PC. Mtime is used only for the "still being edited" skip.
- A capture with a redaction hit is added to `.git/info/exclude` before the snapshot commit, so its plaintext never enters git. It stays in the Inbox, `triage: done` and `secret: true`, until the owner moves the value into Meld and deletes it.
- The guard copies the vault (minus `.obsidian/`, `.trash/`) instead of diffing against git, so it works with `--no-commit` and in a scratch copy.
- The model writes no log line. `finish` writes it, with the touched files computed by the guard and the model's `--note` as the summary.
- Batches of at most 10. A failed or reverted batch requeues its captures instead of failing the whole Inbox.
- With an operations layer (obsidian-mcp) the model writes the vault only through MCP. The server enforces write paths, revisions and locks, but not append-only files or generated files, so `checkpoint.js` checks those from its audit log after the fact and commits. `guard.js` still wraps triage batches. `inbox.js mark` exists so a headless run needs no Edit tool at all.

## Gotchas

- The guard can't tell the model from the owner. A phone edit to an allowlisted file during a batch is checked like the model's own. Deleting a line in `Todo.md` from the phone mid-batch gets the file reverted to the snapshot, losing that edit. Inbox files are exempt apart from deletions.
- Password and PIN patterns need a label ("PIN1 1234", "parool on x"). An unlabeled value passes. The question entry for it depends on the model noticing.
- `setFrontmatter` quotes values containing `:` or `#`. The flat YAML parser reads only `key: value` lines, JSON-style lists and quoted strings.
- Card numbers match only one run of 13 to 19 digits, groups of four, or Amex 4-6-5, so capture names (`2026-09-25-081200`) never trip the Luhn check.
- obsidian-mcp v2.1.0 refuses to start on native Windows (it needs `openat`-style no-follow calls). On Windows it runs in WSL, and the vault on `/mnt/c` works.
- `get_audit_log_tool` in obsidian-mcp v2.1.0 fails its own output-schema check. `checkpoint.js` reads the JSONL file directly.
- `checkpoint.js` can't tell an owner edit from an agent edit on the same file. If both land between two runs, the file goes into the agent commit, and a revert restores HEAD, losing the owner's part too.
- Regex literals written through `String.replace` replacement strings lose their backslashes. Edit patterns with a file edit, not a scripted replace.

## Don't

- Don't give a scheduled run network tools. It needs Bash for the scripts and nothing more.
- Don't push. Git is local history for this vault. No remote exists.
