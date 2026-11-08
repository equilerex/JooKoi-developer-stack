# toolboxes-consolidation

Session: 06-11-2026 01:30. Status: draft. Second Opus review 06-11-2026: ready with fixes. Must wait for skill-sync step 15 (live home links into my-global-setup would break) and a commit of the current tree.

## Context

`toolboxes/` is the home for kits opened or copied from on demand. `my-global-setup/` and `my-repo-setup/` overlap with it. Calls made by the user on 06-11-2026:

- `my-global-setup/` moves into `toolboxes/` as `toolboxes/my-global-setup/`. It stays one folder, it is not split.
- `my-repo-setup/` is broken apart and removed. Much of it is redundant.
  - Skills are already grouped by category, so each group becomes a toolbox.
  - The example `_architecture/` files (ARCHITECTURE, plans, graphify placeholders) are covered by the `jookoi-paper-trail` skill and templates. They are dropped.
  - Setup tooling goes where it fits best (proposed below).
- Third-party dependencies are handled by the plan `2026-11-06-toolbox-third-party-manifest.md` (package.json per box, never committed). This plan only moves what exists.

## Proposed mapping

| Today | Goes to | Why |
|---|---|---|
| `my-global-setup/` | `toolboxes/my-global-setup/` | User call |
| `my-repo-setup/.agents/angular-repos/skills/jookoi-angular-performance`, `mobile-native` | `toolboxes/angular-toolbox/.agents/skills/` | Angular specific |
| `.../angular-repos/skills/` animate, animation-vocabulary, emil-design-eng, find-animation-opportunities, improve-animations, review-animations | `toolboxes/frontend-toolbox/.agents/skills/` | Not Angular specific, so they share the frontend box. Several look third-party, candidates for dependency entries later |
| `my-repo-setup/.agents/frontend-repos/skills/visual-component-derivation` | `toolboxes/frontend-toolbox/.agents/skills/` | Frontend, framework independent |
| `my-repo-setup/setup-scripts/jookoi-graphify-setup`, `webstorm-inspections` | `toolboxes/repo-tooling/` | Tooling applied to other repos, run in place or copied in. Same job as today, new home |
| `my-repo-setup/AGENTS.md` (seed template) | Deleted. A repo-type-specific `AGENTS.md` (if one is ever wanted) goes into that type's toolbox, at its root or in its `.agents/` | User call 06-11-2026 |
| `my-repo-setup/_architecture/*`, `.agents/skills/README.md`, `README.md` | Deleted | Redundant with paper-trail; replaced by `toolboxes/README.md` |

## Open questions

1. ~~Seed `AGENTS.md`~~ Decided 06-11-2026: deleted.
2. ~~Animation skills~~ Decided 06-11-2026: two boxes, `frontend-toolbox` (animation skills, visual-component-derivation) and `angular-toolbox` (angular-performance, mobile-native). No separate animation box.
3. ~~Name `repo-tooling`~~ Decided 06-11-2026: kept.

## Paths to rewrite

Live references to `my-global-setup/` or `my-repo-setup/`: root `README.md`, `AGENTS.md`, `jookoi-paper-trail.md`, `.gitignore`, `.graphifyignore`, `.agents/skills/README.md`, `_architecture/ARCHITECTURE.md`, `_architecture/stack-distribution.md`, open plans, `_architecture/items.yaml`, `_jookoi-skill-locations.json` (sources and destinations for `copy:skill`), `utility-scripts/` (check `copy-skill.js` and `vault-sync.js`), and the setup scripts' own READMEs. The global `~/.agents/AGENTS.md` mirror note and the paper-trail skill text mention `my-global-setup/.agents/AGENTS.md`; check both. Archived plans and graphify output are not edited.

## Deliverables

- [x] Answer open questions, then move the files (git sees renames, user commits)
- [x] Rewrite the paths listed above
- [x] Re-run `copy:skill` dry run to prove the skill-locations file works
- [x] Remove `my-repo-setup/`
- [x] Docs per Fold-out (box READMEs, `toolboxes/README.md`, `AGENTS.md`, `README.md`, `ARCHITECTURE.md`)

## Fold-out

- `toolboxes/README.md`: new boxes, `my-global-setup/` as a box
- `README.md`, `AGENTS.md`, `_architecture/ARCHITECTURE.md`: layout descriptions, drop `my-repo-setup/`
- Close the parked item `n30g Fold my-repo-setup/ into toolboxes`

## Implementation deviations

Done 08-11-2026.
- `my-repo-setup/.agents/frontend-repos/skills/` held empty leftover folders (old link remnants) besides `visual-component-derivation`. Only that one moved, the empty folders were removed.
- Left unedited on purpose: `_architecture/stack-distribution.md` (historical decision text), archived plans, `graphify-out/`, `_jookoi-architecture/session-log.md`.
- Not done, other repo: `jookoi-ai-market/README.md` lines 11 and 93 still name the old paths.
- Not done: the seed-template `AGENTS.md` mention in `toolboxes/my-global-setup/README.md` and any `jookoi-paper-trail` skill text outside `AGENTS.md` and `jookoi-paper-trail.md` were not re-audited beyond a grep for `my-repo-setup`.
