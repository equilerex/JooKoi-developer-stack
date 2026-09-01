# Decision 006 — Skill-stack picks and candidates (topic 2)

Date: 2026-08-26

Status: TRIAL

Source: user's read-through feedback on `ai-tooling-crash-course-for-developers/topics/skill-libraries-and-marketplaces.md`.

## Problem

Skill marketplaces make it trivial to accumulate skills, and the educational doc on them deliberately only elevates broadly-established recommendations. That left the actual question — which skills does *this* stack take on, and on what grounds — unanswered and drifting into the educational doc where it doesn't belong.

## Options considered

- Adopt one or more skill libraries wholesale (Superpowers being the obvious candidate).
- Adopt individual skills, chosen per item.
- Build custom skills for the gaps.
- Adopt nothing until a repeated need shows up.

## Decision

**Adopted direction, not a specific skill:**

- Start small, grow only from a repeated, demonstrated personal need — not from marketplace browsing.
- Do not adopt a whole skill library wholesale just because it contains a few useful pieces. Pull individual skills out, or write your own, rather than importing a library's full surface area.
- Every extra skill exposed to the agent costs some context/attention budget and adds another chance of wrong skill selection — precise, narrow, actually-used skills beat a large accumulated set.

Per item:

- **Anthropic's design skill** — strong candidate for adoption (ties to `001-first-design-skill-picks.md`'s Claude Design trial).
- **Caveman** (already installed in this environment) — investigate for fit; not picked.
- **Superpowers** — review for genuinely useful "must-have" patterns only, in particular planning/delegation patterns that plausibly save context or tokens (`writing-plans`, `dispatching-parallel-agents`, `subagent-driven-development` are the first to look at). Pull individual patterns out if they prove useful.
- **Frontend PR-review skill** — intend to build custom, not adopt off-the-shelf. Not started.
- **Documentation / anti-slop technical-writing skill** — likely needed, likely custom. `jokoivi-no-slop` / `stop-slop`, already present in this environment, are candidate starting points to adapt rather than build from zero; not yet evaluated for fit.

Nothing in the "investigate" or "intend to build" lists is adopted.

## Why not the alternatives

Wholesale library adoption is rejected on cost grounds, not quality grounds: the context and attention budget is real, and a large accumulated set makes wrong-skill selection likelier. Adopting nothing at all was rejected because two candidates (the design skill, the anti-slop skill) already have a demonstrated need behind them.

## Next step

- Trial Anthropic's design skill (already in motion via decision 001).
- Look at Caveman and Superpowers' planning/delegation skills specifically, deciding keep/drop per item rather than as a bundle.
- No timeline for the two custom skills (PR-review, anti-slop/docs) — build when the repeated need actually shows up, per the start-small rule.
