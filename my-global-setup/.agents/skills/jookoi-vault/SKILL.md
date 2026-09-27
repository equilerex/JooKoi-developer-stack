---
name: jookoi-vault
description: Day-to-day use of the owner's Obsidian vault through its MCP server. Use when the owner asks to add a todo, a follow-up or a quick fact, check what is on today's list, look something up in their notes, update a project's state, or answer a question from the vault. Not for filing a large unformatted dump or the whole Inbox; the jookoi-vault-triage skill covers that.
metadata:
  author: Joosep Kõivistik
  last_updated: 2026-09-25
---

# Vault, day to day

The vault serves its own procedure, so every AI (ChatGPT included, which has no skills) follows the same one. This skill only points at it.

1. With the vault MCP server connected: `vault_get_vault_conventions(section="procedure:quick-edit")` and follow it. For a lookup, `vault_get_briefing`, `vault_get_tasks` and `vault_search_notes` need no further rules. Before a write, load the sections the procedure names.
2. Without the MCP server (a local session in the vault checkout): read `vault/_procedures/quick-edit.md` and `vault/_AI_INSTRUCTIONS.md`. Vault writes still go through the MCP server; if it isn't available, propose the change instead of editing files, unless you are an agent running inside Obsidian (see the vault's `CLAUDE.md`/`AGENTS.md`).
3. Several items or a lot of loose material: switch to the jookoi-vault-triage skill.

Older server builds name tools `*_tool` (`read_note_tool`) instead of `vault_*`; use whichever the server lists.
