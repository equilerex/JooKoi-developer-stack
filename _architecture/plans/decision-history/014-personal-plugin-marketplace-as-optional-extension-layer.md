# Decision 014 — personal plugin marketplace as optional extension layer

Date: 2026-09-05

Status: DECIDED

<!-- Status is one of: DECIDED | TRIAL | REJECTED | DEFERRED | SUPERSEDED
     A superseding decision gets its own number. The superseded file's status changes
     and its body gains a pointer — it is never edited away or deleted.
     All five sections below are required. -->

## Problem

Richer optional tooling — framework-specific skills (Angular, Vue, vibe-coding), shared references/assets/scripts they'd need, eventual hooks or MCP integrations — has nowhere to live. Folding it into this repo bloats the universal baseline; deferring indefinitely blocks capability growth already underway (per-framework skills accumulating with nowhere principled to go).

## Options considered

1. Keep deferring — no plugin layer, richer tooling stays ad hoc or unbuilt.
2. Add plugin manifests and richer skill bundles directly into this repo.
3. Separate repo (`jookoi-ai-market`, name provisional) acting as both source and marketplace/catalog for personally maintained plugins, starting with one broad `jookoi-dev` plugin, layered on top of this repo rather than replacing it.

## Decision

Option 3. `jookoi-ai-market` (not created as part of this task) becomes the home for optional richer tooling: a marketplace catalog plus one broad `jookoi-dev` plugin grouping related capability areas (Angular, Vue, vibe-coding, review workflows, shared utilities) rather than many narrowly split plugins. This repo (`JooKoi-developer-stack`) stays fully standalone — no dependency on the plugin repo existing, no plugin manifests added here, no existing loose skills migrated. Layering, not replacement: `ARCHITECTURE.md` §"Optional plugin extension layer" and `stack-distribution.md`'s revisited Q1 both point here.

## Why not the alternatives

Option 1 blocks real, already-happening capability growth (framework-specific skills have nowhere principled to go) — this repo's own "adopt only after a real pick" discipline still applies, it just needs somewhere to land after the pick is made.

Option 2 conflicts with the baseline's own stated posture: minimal dependencies, no install machinery, works on a locked-down machine with no security review (`ARCHITECTURE.md` § Dependencies), universal rather than domain-specific content only (`ARCHITECTURE.md` §"What this repo is"). Plugin manifests, hooks, and MCP config are exactly the kind of harness-specific, heavier machinery that repo is built to avoid — adding them here would contaminate the baseline for the sake of capabilities most consumers of this repo won't want. Starting with many narrowly split plugins (a sub-variant of option 2/3) was also rejected: it repeats the anti-speculative-infrastructure mistake this repo already avoided once for `seed/` and repo-flavor folders (`stack-distribution.md`) — split later only when a plugin needs independent distribution, versioning, or audience.

## Next step

Create `jookoi-ai-market` and seed it with the `jookoi-dev` plugin when there's concrete content ready to move in (e.g. the Vue/Angular skill work reaches a point worth packaging). Not part of this task — no repo creation, no migration here.
