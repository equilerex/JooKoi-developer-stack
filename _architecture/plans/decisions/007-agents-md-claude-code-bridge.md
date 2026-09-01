# Decision 007 — bridging AGENTS.md to Claude Code

Date: 2026-09-01

Status: DECIDED

## Problem

This repo's whole convention is one `AGENTS.md` as the harness-agnostic ruleset (per `_architecture/plans/2026-08-30-jookoi-paper-trail.md`). Claude Code, specifically, does not read `AGENTS.md` — its own docs state plainly "Claude Code reads `CLAUDE.md`, not `AGENTS.md`." The GitHub feature request for native support has 5,200+ reactions and has been open since August 2025; not shipping.

## Options considered

- **Symlink `CLAUDE.md` → `AGENTS.md`.**
- **Third-party sync tool (`rulesync`, `ruler`) in a pre-commit hook.**
- **`@AGENTS.md` import syntax in `CLAUDE.md`.**

## Decision

Root `CLAUDE.md` added, containing only `@AGENTS.md`. One file, no tooling, no generation step, no drift risk — there is nothing to regenerate, it is a permanent one-line pointer.

## Why not the alternatives

**Symlink** — rejected: symlinks need admin/dev-mode on Windows, which this repo's own machine can't assume as a default.

**Sync tool in a pre-commit hook** — viable, but adds a dependency and a build step for a one-line problem. Revisit only if more harness-specific files are ever needed simultaneously (e.g. `.cursorrules`, `GEMINI.md`).

Per the blueprint research that flagged this gap: "Do not build a framework to fix this. Budget the annoyance; it's a generated-file problem, not an architecture problem." A one-line import is the whole fix.

## Next step

None. Revisit only if a second harness needs its own file, at which point the sync-tool option comes back into play.
