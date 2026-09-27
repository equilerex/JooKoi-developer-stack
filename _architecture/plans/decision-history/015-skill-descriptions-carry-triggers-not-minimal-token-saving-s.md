# Decision 015 — Skill descriptions carry triggers, not minimal token-saving summaries

Date: 24-09-2026 23:54

Status: DECIDED

## Problem

To save context tokens, skill descriptions in the marketplace were cut to one or two sentences (94 to 136 characters). The guidance in `jookoi-create-skill` said "keep it as minimal as possible, every extra word costs tokens". `jookoi-paper-trail` v1 had an event-triggered description with trigger phrasings and was invoked reliably throughout sessions. After v2 cut its description, two trial sessions loaded it once, set it up, and stopped recording decisions and state changes. The description is the only part of a skill the model sees before deciding to load it, so it decides whether the skill runs at all.

## Options considered

- Keep every description minimal, and rely on hooks and the skill body for enforcement.
- Give every skill a long, trigger-rich description.
- Size the description by how the skill is invoked. Skills called on request stay short. Skills that must trigger on their own mid-task list their events, the phrasings users say, and why it matters, up to the 1024-character limit.

## Decision

Size by invocation. Skills invoked on request keep one or two sentences. Skills that must trigger on their own (documentation, memory, style, safety) carry an event-triggered description. `jookoi-paper-trail`'s description is restored to the v1 pattern, and `jookoi-create-skill`'s description guidance says so, with this case as the evidence.

## Why not the alternatives

Minimal everywhere removes the only signal that re-invokes a self-triggering skill, and hooks don't cover every harness. Long everywhere spends tokens in every conversation on skills the user calls by name anyway. At about 200 tokens per long description, the cost is small next to a memory skill that silently stops running.

## Next step

Review the other self-triggering skills' marketplace descriptions (`jookoi-write-casual-technical`, `jookoi-write-like-a-person`, `jookoi-md-design`) against this rule. A third paper-trail trial should show the skill invoked mid-session on a decision without prompting.
