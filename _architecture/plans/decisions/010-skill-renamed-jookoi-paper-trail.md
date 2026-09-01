# Decision 010 — renaming the skill from `jookoi-doc` to `jookoi-paper-trail`

Date: 2026-09-02

Status: DECIDED

## Problem

Decision 008 named the convention `jookoi-paper-trail` but left the skill that maintains it named `jookoi-doc` — the tool and the thing it implements no longer shared a name, which is exactly the mismatch 008 fixed once already (it also matched `jookoi-doc` / `_jookoi-*` against the old four-word name at the time).

## Decision

Renamed the skill to `jookoi-paper-trail`, matching the convention name exactly:

- Skill directory: `my-global-setup/.agents/skills/jookoi-doc/` → `.../jookoi-paper-trail/`.
- Script: `scripts/jookoi-doc.js` → `scripts/jookoi-paper-trail.js`.
- Session marker: `_jookoi-architecture/.jookoi-doc-ran-<id>` → `.jookoi-paper-trail-ran-<id>`.
- `SKILL.md` frontmatter `name:` and body heading, all `references/*.md`, both hook scripts, all three hook config JSON files, `.claude/settings.json`'s hook command paths.
- Every doc pointing at the old path or invoking it by name: root `AGENTS.md` (which also still had the fully retired `current-state.md`/`next-steps.md`/`progress.md` pipeline description — fixed in the same pass), `README.md`, `jookoi-paper-trail.md`, `_architecture/architecture.md`, `_architecture/backlog.md`, `_architecture/TODO.md`, `my-global-setup/.agents/AGENTS.md`, both `skills/README.md` files, `utility-scripts/jookoi-hooks/*.sh`, `my-repo-setup/_architecture/` seed templates.

Historical records were left untouched on purpose: `_architecture/plans/2026-08-30-jookoi-paper-trail.md`, `_architecture/plans/2026-09-01-jookoi-doc-full-skill.md`, `_architecture/plans/2026-09-02-jookoi-doc-redesign.md` (filename itself unchanged — it names the redesign, not the current skill), `_architecture/archive/*.md`, and decisions 008/009 all describe what was true when they were written or name a specific historical build; they keep the name that was live at the time.

## Not yet done

`~/.agents/skills/jookoi-doc/` (the deployed global copy) still needs the same rename applied and the stale copy removed — tracked in `_architecture/TODO.md`'s checklist, not done here since this repo is the source and the deployed copy is a manual mirror step.

## Next step

None beyond the pending mirror sync above.
