# Decision 004 — Consolidation plan: old Cowork-session location → this repo

Date: 2026-08-23
Status: plan only, not yet executed. Nothing below has been done — this file exists so the plan itself isn't lost to session memory.

## Why

This dev-stack work originally started in a Cowork session, ported into `D:/repos/Serenity/JooKoi-frontpage-to-the-open-web/.agents/`, then got split out into this separate repo (`JooKoi-developer-stack`). That split happened before the port was fully verified. A sweep of the old location (2026-08-23) found one real gap and some staleness risk — this plan is how to close both without losing the thread.

## What the sweep found

- **Lost, not just misplaced:** `discovery-phase-review.md` (critique of the product concept, four-claims test, original repo skeleton) was never ported anywhere — not in `.agents/context/decisions/` (no `000-discovery.md`), not even in `_raw/`. Only files 1, 2, 3, 5, 6, 7, 8 from the original eight made it across.
- **Still pending in the old location, per its own `_raw/README.md`:** founding-context Part A (personal values/constraints) was never folded into `~/.agents/AGENTS.md` — same open question this repo's `TODO-LIST.md` already tracks ("Resolve the `~/.agents/AGENTS.md` merge question"). One open question, currently tracked in two places.
- Cosmetic only: `personal-ai-dev-stack-blueprint_.md` has a stray trailing underscore in the filename.
 
## Steps

1. **Recovered, 2026-08-23.** The original Cowork thread ran on mobile, never synced to `~/.claude/sessions` on this machine — genuinely unreachable from here. User instead pulled a context-summary handoff from that session and uploaded it (`planning/local/handoff/`: `CONTEXT-HANDOFF.md`, `discovery-phase-review.md`, and a duplicate `planning-before-implementation_2.md` — confirmed byte-identical to the already-ported copy, deleted). `discovery-phase-review.md` was real and matched the missing file exactly. **Its actual destination was never this repo** — it's product-specific critique for `JooKoi-frontpage-to-the-open-web`, not dev-stack material — so it's been ported to `JooKoi-frontpage-to-the-open-web/.agents/context/decisions/000-discovery.md`, filling the gap that was there. Gap closed.
2. **Content audit — done, 2026-08-23, corrected after user pushback (see below).** Result:
   - `personal-ai-dev-stack-blueprint_.md` — **not audited line-by-line**. Per the user: this was the original project-definition doc, superseded by design once detailed per-topic research began (that's the whole reason the 14 `planning/` docs exist). Treated as already handled by the process, not diffed.
   - `planning-before-implementation.md` — **confirmed real gap.** No topic in `topic-index.md` covers planning methodology; the file's own destination in the old `00-START-HERE.md` was "cross-project reference," and it was never actually copied anywhere. **Done:** ported verbatim to `planning/planning-before-implementation.md`, added to `topic-index.md` under "Surfaced from cross-repo consolidation," added to `review-status.md` as unread.
   - `staying-current-ai-dev-2026.md` vs. `_ai-tooling-recommendations.md` + `_inspiration-and-staying-current.md` — **checked, not a gap.** The split the user describes (marketplaces/skills/references → `_ai-tooling-recommendations.md`; articles/people/communities → `_inspiration-and-staying-current.md`) already happened and `_ai-tooling-recommendations.md` covers the marketplace/registry content in more depth than the old file. No action needed.
   - Founding-context Part A / `~/.agents/AGENTS.md` merge question — still just one open question, already tracked in this repo's `TODO-LIST.md`. No duplicate tracking to resolve.
3. **Pull forward** — done for the one confirmed gap (`planning-before-implementation.md`, step 2 above). Nothing else identified as needing this.
4. **Freeze the old location** — not done. Still needs explicit go-ahead before editing that separate repo.
5. **Licensing/copyright on crawled content** — separate open question, not resolved by this plan. Ties to `planning/security-and-supply-chain.md` (still unread, Stage 2).
6. **Durable-record mechanism** — confirmed sufficient (`TODO-LIST.md` + `decisions/NNN-*.md`). No new system needed.

## Recovery note (WebStorm local history)

User can't confirm whether `personal-ai-dev-stack-blueprint_.md` was a single snapshot or continuously updated over the original session — offered to check WebStorm's local file history in the IDE (`.idea` local history isn't practically readable from here — it's not plain-text diffable via file tools). Not pursued: treated as unnecessary per the "already superseded" call in step 2.

## Next step

Steps 1–3 done. Steps 4 (freeze old location — needs go-ahead) and 5 (licensing/copyright, tied to `security-and-supply-chain.md`) stay open, not urgent. `planning/local/handoff/CONTEXT-HANDOFF.md` (the full bootstrap concatenation) can be deleted whenever — everything in it is either already ported or confirmed superseded, nothing further to extract from it.
