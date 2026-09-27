# Decision 016 — Make requests for owner input actionable

Date: 27-09-2026 20:03

Status: DECIDED

## Problem

Across LLM harnesses, agents repeatedly reported that something needed a decision but omitted the context or the actual question. The owner then had to ask another turn to learn what information would let work continue. The existing global rule required a question and options, but did not require the agent to identify the blocked step or say whether an answer was needed immediately.

## Options considered

Keep the existing wording and correct each occurrence in chat. Add a rule to a skill that may not load in every session. Tighten the global instruction shared by harnesses and mirror it into the live Claude file.

## Decision

The global rule now requires the agent to state what is known, why the answer matters, the exact question or missing information, and which step depends on it. It calls for options or a useful default when appropriate, says whether input is needed now or later, and directs the agent to continue independent work. This applies to plans and status reports as well as direct questions. The tracked source is `my-global-setup/.agents/AGENTS.md`; the current machine also has the rule in `~/.agents/AGENTS.md` and `~/.claude/CLAUDE.md`.

## Why not the alternatives

The existing wording was already present during the failure. A skill-only rule would not reach sessions that never load that skill. A repo rule would not cover the same failure in other projects.

## Next step

Apply the tracked global source manually on future machines. When a later assistant asks for input, check that it names the dependent step and gives the question in the same turn.
