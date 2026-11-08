---
name: jookoi-vault
description: Day-to-day use of the owner's Obsidian vault through its MCP server. Use when the owner asks to add a todo, a follow-up or a quick fact, check what is on today's list, look something up in their notes, update a project's state, or answer a question from the vault. Not for filing a large unformatted dump or the whole Inbox; the jookoi-vault-triage skill covers that.
metadata:
  author: Joosep Kõivistik
  last_updated: 2026-09-25
---

# Vault, day to day

The vault serves its own procedure, so every AI (ChatGPT included, which has no skills) follows the same one. This skill only points at it.

1. With the vault MCP server connected: `vault_conventions(section="procedure:quick-edit", include_requires=true)` and follow it. For a lookup, `vault_briefing`, `vault_tasks` and `vault_search` need no further rules, and a task write needs none either (the task tool carries the placement defaults). Before a note write, load `core-write` once; older servers name the tools `vault_get_vault_conventions`, `vault_get_briefing` and so on, use whichever the server lists.
2. Without the MCP server (a local session in the vault checkout): read `vault/_system/procedures/quick-edit.md` and `vault/_system/instructions.md` (`vault/_procedures/` and `_AI_INSTRUCTIONS.md` in a vault not yet moved). Vault writes still go through the MCP server; if it isn't available, propose the change instead of editing files, unless you are an agent running inside Obsidian (see the vault's `CLAUDE.md`/`AGENTS.md`).
3. Several items or a lot of loose material: switch to the jookoi-vault-triage skill.

Older server builds name tools `*_tool` (`read_note_tool`) instead of `vault_*`; use whichever the server lists.
