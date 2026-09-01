# Decision 004 — Consolidation plan: old Cowork-session location → this repo

Date: 2026-08-23

Status: DECIDED

## Problem

This dev-stack work originally started in a Cowork session, was ported into `D:/repos/Serenity/JooKoi-frontpage-to-the-open-web/.agents/`, then split out into this separate repo. The split happened before the port was fully verified. A sweep of the old location on 2026-08-23 found:

- **Lost, not just misplaced:** `discovery-phase-review.md` (critique of the product concept, four-claims test, original repo skeleton) was never ported anywhere — not to `.agents/context/decisions/` (no `000-discovery.md`), not even to `_raw/`. Only files 1, 2, 3, 5, 6, 7 and 8 of the original eight made it across.
- **Still pending in the old location, per its own `_raw/README.md`:** founding-context Part A (personal values/constraints) was never folded into `~/.agents/AGENTS.md` — the same open question this repo's `BACKLOG.md` already tracked, so one question tracked in two places.
- Cosmetic only: `personal-ai-dev-stack-blueprint_.md` carries a stray trailing underscore in its filename.

## Options considered

- Recover from the original Cowork session transcript.
- Recover from a context-summary handoff the user pulls from that session by hand.
- Reconstruct the missing content from scratch.
- Accept the loss and move on.

## Decision

Recover via handoff, audit the rest, port only confirmed gaps, and write the plan down so it survives session memory.

1. **Recovered, 2026-08-23.** The original Cowork thread ran on mobile and never synced to `~/.claude/sessions` on this machine — genuinely unreachable from here. The user instead pulled a context-summary handoff and uploaded it (`_jookoi-architecture/handoff/`: `CONTEXT-HANDOFF.md`, `discovery-phase-review.md`, and a duplicate `planning-before-implementation_2.md`, confirmed byte-identical to the ported copy and deleted). `discovery-phase-review.md` was real and matched the missing file exactly. **Its destination was never this repo** — it is product-specific critique for `JooKoi-frontpage-to-the-open-web`, not dev-stack material — so it was ported to that repo's `.agents/context/decisions/000-discovery.md`. Gap closed.
2. **Content audit — done 2026-08-23, corrected after user pushback.**
   - `personal-ai-dev-stack-blueprint_.md` — **not audited line-by-line.** Per the user, this was the original project-definition doc, superseded by design once detailed per-topic research began (which is why the 14 planning docs exist). Treated as already handled by the process, not diffed.
   - `planning-before-implementation.md` — **confirmed real gap.** No topic in `topic-index.md` covered planning methodology; the file's own stated destination in the old `00-START-HERE.md` was "cross-project reference," and it was never copied anywhere. Ported verbatim to `ai-tooling-crash-course-for-developers/topics/planning-before-implementation.md`, added to `topic-index.md` under "Surfaced from cross-repo consolidation," and added to `review-status.md` as unread.
   - `staying-current-ai-dev-2026.md` vs `_ai-tooling-recommendations.md` + `_inspiration-and-staying-current.md` — **checked, not a gap.** The split (marketplaces/skills/references → the first; articles/people/communities → the second) had already happened, and `_ai-tooling-recommendations.md` covers the marketplace/registry content in more depth than the old file.
   - Founding-context Part A / `~/.agents/AGENTS.md` merge question — one open question, already tracked in `BACKLOG.md`. No duplicate tracking to resolve.
3. **Pull forward** — done for the one confirmed gap. Nothing else needed it.
4. **Freeze the old location** — not done. Needs explicit go-ahead before editing that separate repo.
5. **Licensing/copyright on crawled content** — separate open question, not resolved by this plan. Ties to `ai-tooling-crash-course-for-developers/topics/security-and-supply-chain.md`.
6. **Durable-record mechanism** — confirmed sufficient (`next-steps.md`/`BACKLOG.md` plus `plans/decisions/NNN-*.md`). No new system needed.

## Why not the alternatives

Recovering from the original transcript was impossible, not merely inconvenient — the session ran on mobile and never synced to this machine. Reconstructing from scratch was rejected once the handoff proved to contain the missing file verbatim. Accepting the loss was rejected because the sweep proved the gap was real and recoverable rather than hypothetical.

One recovery avenue was deliberately not pursued: WebStorm's local file history could show whether `personal-ai-dev-stack-blueprint_.md` was a single snapshot or continuously updated across the original session. `.idea` local history is not practically readable from here (not plain-text diffable via file tools), and it was treated as unnecessary given the "already superseded" call in step 2.

## Next step

Steps 1–3 are done. Steps 4 (freeze the old location — needs go-ahead) and 5 (licensing/copyright, tied to `security-and-supply-chain.md`) stay open and are not urgent. `_jookoi-architecture/handoff/CONTEXT-HANDOFF.md` (the full bootstrap concatenation) can be deleted whenever — everything in it is either ported or confirmed superseded.
