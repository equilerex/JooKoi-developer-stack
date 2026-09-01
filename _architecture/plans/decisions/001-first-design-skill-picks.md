# Decision 001 — First design-skill picks to trial

Date: 2026-08-22

Status: TRIAL

## Problem

The curation research surfaced several design-oriented skills. Nothing had yet been tried, and the repo's own rule (`_architecture/architecture.md`, step 3 "Only then, adopt") is that a tool enters `skills/`/`prompts/`/`AGENTS.md` only after being chosen from demonstrated need. A record was needed of which candidates were being taken to a trial, so that "tried it" and "adopted it" don't blur.

## Options considered

- **Claude Design** (Anthropic-shipped, verified real in `ai-tooling-crash-course-for-developers/_ai-tooling-recommendations.md` → Products) — `/design-sync`, canvas import from GitHub/Figma.
- **MengTo/Skills** (github.com/MengTo/Skills, verified 5.2k★/633 forks, active — same source) — portable SKILL.md playbooks for design/layout discipline.
- **Adityaraj0421/naksha-studio** — suggested by the user.

## Decision

All three go to a local trial clone. **Nothing is picked.** No candidate here is adopted, and none is a winner or a final solution — this is not implementation-phase work; the repo is still at the "look at the project" stage.

## Why not the alternatives

There is no rejected alternative — the decision is deliberately to defer choosing at all rather than to adopt one now. `naksha-studio` entered the trial set without passing the verification step the other two passed; that is recorded rather than corrected, and if it works out it is worth a real (non-knowledge) check after the fact to understand what it actually is before it goes further than a trial.

## Next step

Once tried, record what worked and what didn't — that observation is what would justify promoting any of these into `skills/` proper.
