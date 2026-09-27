---
name: jookoi-vault-triage
description: Heavy filing of unformatted material into the owner's Obsidian vault. Use when the owner pastes a dump (rambling notes, a brain dump, an old list, a forwarded text) and wants it filed, says triage or file my inbox, or imports old notes such as a Google Keep export. Works in a chat through the vault's MCP server, or in Claude Code with scripts. Not for a single quick add like one todo or one fact; the jookoi-vault skill covers day-to-day edits.
metadata:
  author: Joosep Kõivistik
  last_updated: 2026-09-25
---

# Vault triage

Turns raw captures (phone voice notes, typed fragments, imported old notes, pasted text) into filed vault pages. It runs in two places:

- **Chat mode** (claude.ai, ChatGPT or any client with the vault's MCP server, no scripts): see the next section.
- **Claude Code mode** (a checkout with `TRIAGE.md` at its root): the scripts stage, redact, batch, guard and commit, see Before starting and The loop.

The work splits in two:

- **Engine (this skill):** scripts that stage, redact, batch, guard and commit.
- **Procedure and policy (per vault):** the vault serves both. `_AI_INSTRUCTIONS.md` holds the layout, routing table, standing files, buckets, layers, formats and a worked example. `_procedures/triage.md` holds the triage procedure, including the chat-mode steps. The vault's MCP server hands both to every connected AI, so chat clients without this skill (ChatGPT) follow the same procedure. In a checkout, `TRIAGE.md` at the repo root adds the scripts' settings (paths, write allowlist, batch size).

Anything that names a folder, person or topic of one vault belongs in the vault, never in this skill. `references/procedure.md` is the generic template for a vault that has no `_procedures/triage.md` yet: copy it there and adapt the tool names.

## Chat mode

`vault_get_vault_conventions(section=["procedure:triage", "all"])`, then follow the procedure's "Through the MCP" steps. A vault without `_procedures/triage.md`: use `references/procedure.md`. Older server builds name tools `*_tool` instead of `vault_*`; use whichever the server lists.

## Before starting

1. Find the repo root: the nearest folder above the working directory holding `TRIAGE.md`. Without one, stop: this vault hasn't adopted the skill.
2. Read `TRIAGE.md` and the vault's `_procedures/triage.md` (else `references/procedure.md`), in full, once per session.
3. `node <skill>/scripts/inbox.js status` shows the Inbox, the queue and any batch left open by a crashed run. Finish an open batch before anything else.

Every script takes `--root <repo>` when run from elsewhere.

## Modes

All three feed the same queue (`<staging>/queue/`, outside the vault) and the same loop.

- **inbox** (default): `node <skill>/scripts/inbox.js stage`. Commits a snapshot of the vault (owner edits since the last run), then copies each Inbox capture into the queue, redacted. Captures edited in the last `min_age_minutes` are skipped as still being written. The originals stay in the Inbox until their batch finishes.
- **import**: `node <skill>/scripts/import.js <file-or-folder>... --label <source> --dry-run`, show the owner the summary, then run it without `--dry-run`. Takes `.md` and `.txt`. Before triaging, Grep the vault for the people, projects, places and events the notes mention, and tell the owner which pages they will extend. Don't import a source twice: the script only sees what is still queued.
- **dump**: the owner pastes text and says to dump or file it. Write it to a temp file, `node <skill>/scripts/inbox.js dump --file <tmp>`, then `stage --min-age 0`. The trigger phrase for dump mode is not settled yet: act when the owner clearly asks for pasted text to go into the vault.

## The loop

Repeat until `batch` reports no captures:

1. `node <skill>/scripts/inbox.js batch` prints the next batch (at most `batch_size`, oldest first), each with its `captured:` time and `provenance:` string, and snapshots the vault for the guard.
2. Triage the batch by the triage procedure and `TRIAGE.md`. Read the staged captures with the file Read tool (they sit outside the vault). Write the vault through its operations layer, the vault MCP server, when the repo has one (`.mcp.json`), with the tools the procedure names (`vault_add_task` with `added` = the capture date, `vault_read_note(section=...)` then `vault_append_to_note` or `vault_patch_note_text` with `expected_revision`, `vault_write_note` with `create_only: true` for new pages). One write per destination file. On a `revision_conflict`, re-read and redo that one write. Only a vault without an operations layer is edited with the Edit and Write tools. Close each capture with `node <skill>/scripts/inbox.js mark <capture> done`, or `mark <capture> unresolved --reason "<why>"`.
3. `node <skill>/scripts/inbox.js finish --note "<one-line summary: items filed where, questions asked>"`. It reverts anything outside the rules, redacts the output, removes handled Inbox originals, appends the log line and commits.

`finish` exits non-zero when it reverted something. Read what it names, fix the cause in the next batch, and tell the owner. The reverted batch's captures go back into the queue.

When the queue has no captures, still run one `batch` / `finish` pass if the questions file has answers waiting (procedure step 6).

## Rules

- Never write a helper script that applies vault edits in bulk. A bug in it corrupts many pages at once.
- Never edit `TRIAGE.md`, `AGENTS.md`, the templates, `.obsidian/`, or files outside `TRIAGE.md`'s `writable` list. Never touch the Inbox originals or staged captures by hand: the scripts own them.
- The scripts commit, the model doesn't. A session that runs this skill still never runs `git commit` or `git push` itself. `--no-commit` on `stage` and `finish` skips commits and marks handled originals `triage: done` instead of deleting them.
- A capture marked `secret: true` stays in the Inbox after triage, kept out of git by `.git/info/exclude`, until the owner moves the value into a Meld Encrypt block and deletes it. Import copies with a secret wait in `<staging>/held/`.
- For more than about 30 captures, a subagent may run the loop. Brief it with this file, `TRIAGE.md` and the triage procedure.

## Operations layer

With an operations layer, no agent writes vault files directly: triage, chat and every later job go through the MCP tools. The server enforces the write paths, revisions and per-file locks, and logs every write. `node <skill>/scripts/checkpoint.js` is the git-and-checks step around its audit log. It checks each agent-written path against HEAD (append-only files, generated files, deletions), reverts what breaks a rule, and commits: owner edits as a snapshot, agent writes with the audit entries as provenance. It skips while a triage batch is open, since `finish` checks and commits those. Wire it as an end-of-turn hook in the vault repo.

## Scheduled runs

Headless, from the repo root, with the vault's MCP server configured:

```
claude -p "Use the jookoi-vault-triage skill: triage the inbox." --allowedTools "mcp__vault__*" "Bash(node:*)" "Read"
```

No Edit or Write tool, so the vault can only change through the operations layer.

## Report

End with: captures handled, pages created, lines added to the task files, questions asked, captures left held or unresolved and why, anything `finish` reverted.

Background on why triage works this way (capability map, data layers, trust ladder): the vault's `_architecture/plans/triage-agent-requirements.md`, when present. Script internals and gotchas: `CONTEXT.md` in this folder.
