# Decision 010 — renaming the skill from `jookoi-doc` to `jookoi-paper-trail`

Date: 2026-09-02

Status: DECIDED

## Problem

Decision 008 named the convention `jookoi-paper-trail` but left the skill that maintains it named `jookoi-doc` — the tool and the thing it implements no longer shared a name, which is exactly the mismatch 008 fixed once already (it also matched `jookoi-doc` / `_jookoi-*` against the old four-word name at the time).

## Options considered

1. Rename the skill to `jookoi-paper-trail`, matching the convention.
2. Leave the skill as `jookoi-doc` and treat the two names as tool-vs-convention on purpose.
3. Rename the convention back to something `jookoi-doc`-shaped, so the tool name stays put.

## Decision

Renamed the skill to `jookoi-paper-trail`, matching the convention name exactly:

- Skill directory: `my-global-setup/.agents/skills/jookoi-doc/` → `.../jookoi-paper-trail/`.
- Script: `scripts/jookoi-doc.js` → `scripts/jookoi-paper-trail.js`.
- Session marker: `_jookoi-architecture/.jookoi-doc-ran-<id>` → `.jookoi-paper-trail-ran-<id>`.
- `SKILL.md` frontmatter `name:` and body heading, all `references/*.md`, both hook scripts, all three hook config JSON files, `.claude/settings.json`'s hook command paths.
- Every doc pointing at the old path or invoking it by name: root `AGENTS.md` (which also still had the fully retired `current-state.md`/`next-steps.md`/`progress.md` pipeline description — fixed in the same pass), `README.md`, `jookoi-paper-trail.md`, `_architecture/architecture.md`, `_architecture/backlog.md`, `_architecture/TODO.md`, `my-global-setup/.agents/AGENTS.md`, both `skills/README.md` files, `utility-scripts/jookoi-hooks/*.sh`, `my-repo-setup/_architecture/` seed templates.

Historical records were left untouched on purpose: `_architecture/plans/2026-08-30-jookoi-paper-trail.md`, `_architecture/plans/2026-09-01-jookoi-doc-full-skill.md`, `_architecture/plans/2026-09-02-jookoi-doc-redesign.md` (filename itself unchanged — it names the redesign, not the current skill), `_architecture/archive/*.md`, and decisions 008/009 all describe what was true when they were written or name a specific historical build; they keep the name that was live at the time.

## Why not the alternatives

Option 2 costs a lookup on every single reference — the user, and any cold session, has to remember that the thing called `jookoi-doc` maintains the thing called `jookoi-paper-trail`. Decision 008 already paid to remove exactly that gap once; keeping a second instance of it would mean 008 fixed the symptom rather than the pattern. Option 3 inverts a name that had just been chosen deliberately, and the convention name is the one that appears in prose and in other repos, so it is the more expensive of the two to change. Renaming the tool is the cheaper side of the mismatch: it is mechanical, contained to paths and identifiers, and the script enforces its own filenames anyway.

## Next step

None. The deployed mirror at `~/.agents/skills/jookoi-paper-trail/` was verified byte-identical to this repo's copy on 2026-09-02 and the stale `~/.agents/skills/jookoi-doc/` is gone.
