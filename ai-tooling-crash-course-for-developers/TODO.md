# Crash-course TODO — subtopics not yet written

Pending research/writing passes for this folder, tracked here instead of in `_architecture/BACKLOG.md` so the crash-course's own open work lives beside the docs it belongs to.

## Corporate/restricted developer environments

Logged 2026-08-26, from the user's read-through review pass. Two separate documents, not one, in their own subtopic folder:

1. What corporate environments actually tend to limit and why — memory, MCP, install mechanisms, binaries, specific integrations. Most corporate AI-agent deployments have their own built-in data-handling safeguards; capabilities get disabled by policy for specific reasons, not as a blanket "no cloud LLM" stance.
2. A practical doc on working within those constraints — safe alternatives/workarounds, local vs. company-approved cloud tooling.

Pull corporate-specific caveats *out* of the general educational docs (`memory-and-progress-ledgers.md`, `session-and-token-economics.md`, etc.) into this dedicated area — general docs mention corporate cases only in passing, with a link out.

Largely answered at the policy level by the memory system's per-environment vault split (`_architecture/plans/2026-08-30-jookoi-paper-trail.md`) — this item is now specifically the crash-course *documentation*, not an open design question.
