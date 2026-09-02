# Decision 012 — LLM-generated graphify output is source, so it lives in the tracked dir

Date: 2026-09-02

Status: DECIDED

## Problem

Two mechanisms write graphify output and neither knows about the other. The npm `gr*` scripts pass `--out _architecture/graphify` (tracked). The `/graphify` skill ignores `--out` entirely and writes `graphify-out/` relative to cwd (`~/.claude/skills/graphify/SKILL.md:53`, `:288`), which in this repo means a gitignored folder at the root.

The result is not a harmless duplicate. `GRAPH_REPORT.md`, `graph.html` and `.graphify_labels.json` exist **only** in the gitignored copy — LLM-generated artifacts sitting in the disposable location, while the tracked location holds a different partial set. The expensive output is the throwaway one.

Separately: with several repos in play, nothing says which one hosts the graph. `graphify-out/` is a single fixed name, so a second target silently overwrites the first.

## Options considered

- Leave both, document the split.
- Wrap the skill so `--out` is honoured.
- Run the skill with cwd set to the tracked output dir, so its fixed `graphify-out/` resolves there.
- For several repos: a graph per repo, versus one designated host.

## Decision

**LLM-generated output is source, not build artifact.** It goes in the tracked location; anything writing it elsewhere is misconfigured, not an alternative.

Convergence needs no code — the skill's cwd-relative path is the lever:

```
cd _architecture/graphify && /graphify ../..
```

That resolves to `_architecture/graphify/graphify-out/`, the same dir the npm scripts target.

**With several repos, one is designated the main instance** and hosts the graph; the others are scan targets, never output homes. Documented in the bundle README as the pattern to follow; no tooling enforces it, because on this machine there is only one instance and the need is unproven here. The need is real on the work machine, which is what makes it worth writing down rather than inventing a config format for.

## Why not the alternatives

Documenting the split preserves the actual defect — persistent output in a gitignored folder. Wrapping the skill means maintaining a fork of a third-party skill against a hardcoded path, for a result that a `cd` already produces.

Per-repo graphs multiply the fixed `graphify-out/` name collision and give no cross-repo edges, which is most of why a graph beats grep in the first place.

## Next step

Blocked on one open item before the tracked dir is safe to converge into: `SKILL.md:122` writes `.graphify_root` as an absolute path via `Resolve-Path`. Committing that pins the graph to one machine and breaks the vault-mirror pattern in `BACKLOG.md`. Either ignore `.graphify_root` inside the tracked dir, or give the mirror a path-rewrite step.
