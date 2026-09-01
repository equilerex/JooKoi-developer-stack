# TODO
<!-- Live working set. `jookoi-paper-trail flush` archives it and resets it. See AGENTS.md. -->

## Context

The repo follows `jookoi-paper-trail` (concept: `jookoi-paper-trail.md`; design: `plans/2026-08-30-jookoi-paper-trail.md`; skill: `my-global-setup/.agents/skills/jookoi-paper-trail/`). As of 2026-09-02 the pipeline is `TODO.md` (this file) → `jookoi-paper-trail flush` → `archive/YYYY-MM.md`, replacing the old `current-state.md`/`next-steps.md`/`progress.md` split — see `plans/2026-09-02-jookoi-doc-redesign.md` for the full redesign record and reasoning. The skill itself was renamed from `jookoi-doc` to `jookoi-paper-trail` on 2026-09-02 (unifying the tool name with the convention name), across the skill dir, script filename, session-marker filename, hooks, and every doc/config reference repo-wide.

`_jookoi-` prefix is the public/private switch (globally gitignored, mirrored to `C:\JooKoi-vault`). `~/.agents/skills/` is the live global skill source; `my-global-setup/.agents/skills/` is a tracked mirror of a curated subset, direction decided per skill.

Nothing in this repo is committed by Claude — the user commits.

`jookoi-paper-trail` verification is otherwise complete (flush, malformed-heading refusal, `stale`, the `Stop` gate's block/already-clean paths) except cold-routing real notes through the tree, which is still outstanding and the user has explicitly declined to force.

## Checklist

- [x] Redesign and rebuild `jookoi-doc` around `TODO.md`, retiring `current-state.md`/`next-steps.md`/`progress.md` (script, templates, references, hooks, `SKILL.md`, `README.md`, `jookoi-paper-trail.md`, global `AGENTS.md`)
- [x] Verify the redesigned skill end to end: `check --dry-run`, `flush --title "test" --dry-run`, `status`, plus a repo-wide grep for leftover `progress.md`/`next-steps.md`/`current-state.md`/`rotate` references
- [x] Rename the skill itself from `jookoi-doc` to `jookoi-paper-trail`: dir, script file, session-marker filename, `SKILL.md` frontmatter/body, all `references/*.md`, hooks + hook configs, `.claude/settings.json`, root `AGENTS.md` (also caught stale current-state/next-steps/progress.md pipeline description there), `README.md`, `jookoi-paper-trail.md`, `_architecture/architecture.md`, `_architecture/backlog.md`, `my-global-setup/.agents/AGENTS.md`, both skills `README.md`s, `utility-scripts/jookoi-hooks/*.sh`, `my-repo-setup/` seed templates
- [ ] Sync the renamed skill out to `~/.agents/skills/jookoi-paper-trail/` (mirror direction: this repo is the source) — old `~/.agents/skills/jookoi-doc/` should be removed once the new copy is verified
- [ ] Cold-route ten real notes through the `jookoi-paper-trail` tree — the one piece of verification still outstanding (routing table: CONTEXT.md / decision / plan / architecture / checklist / backlog)
- [ ] Stack-distribution open questions (`_architecture/stack-distribution.md`): skill-sync mechanism, root-`AGENTS.md` collision risk between this repo's own instance and a target project's. Routes to cowork for research.
