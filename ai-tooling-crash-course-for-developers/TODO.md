# Crash-course TODO — subtopics not yet written

Pending research/writing passes for this folder, tracked here instead of in `_architecture/BACKLOG.md` so the crash-course's own open work lives beside the docs it belongs to.

## Corporate/restricted developer environments

Logged 2026-08-26, from the user's read-through review pass. Two documents, own subtopic folder:

1. What corporate environments actually limit and why — memory, MCP, install mechanisms, binaries, specific integrations. Most corporate AI-agent deployments have built-in data-handling safeguards; capabilities get disabled by policy for specific reasons, not a blanket "no cloud LLM" stance.
2. A practical doc on working within those constraints — safe alternatives/workarounds, local vs. company-approved cloud tooling.

Pull corporate-specific caveats *out* of the general educational docs (`memory-and-progress-ledgers.md`, `session-and-token-economics.md`, etc.) into this dedicated area — general docs mention corporate cases only in passing, with a link out.

Largely answered at the policy level by the memory system's per-environment vault split (`_architecture/plans/2026-08-30-jookoi-paper-trail.md`) — this item is now just the crash-course *documentation*, not an open design question.

## Prompt engineering — resource curation

Logged 2026-09-05. `topics/prompt-engineering.md` exists as a skeleton (core techniques, why it matters, where it stops being enough), but the resource list — practitioner write-ups, technique comparisons across providers, courses — isn't done. Per this repo's workflow convention, that research pass goes through cowork, not inline.

## Agentic OS

Logged 2026-09-05, raised in a review of doc 0's terminology. Not defined or researched yet, unlike prompt/context/harness/loop/graph engineering (covered in `0-how-llms-actually-work-under-the-hood.md`'s glossary and `topics/harness-engineering-vocabulary.md`). Needs a real research pass before a glossary entry or topic doc: what people mean by the term, whether it's checkable/named yet or still buzzword stage, and whether it's a repackaging of harness/graph engineering or a genuinely separate layer.
