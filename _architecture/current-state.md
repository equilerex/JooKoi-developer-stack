# Current state
<!-- Live session. `jookoi-doc flush` empties the session log into progress.md. See AGENTS.md. -->

## Standing summary

The repo follows **`jookoi-paper-trail`** — the convention's fixed name as of 2026-09-01 (`decisions/008-paper-trail-naming.md`; it was "JooKoi Folder Memory Dinosaur" before, and "memory" was dropped deliberately per 003). Three docs, three jobs: `jookoi-paper-trail.md` at the repo root is the concept doc (what it is, for anyone adopting it), `plans/2026-08-30-jookoi-paper-trail.md` is the design and build record including where implementation diverged, and `plans/2026-09-01-jookoi-doc-full-skill.md` is the skill's own build plan.

The full build order 0–8 is done: the `jookoi-doc` skill is built (`my-global-setup/.agents/skills/jookoi-doc/`), deployed to `~/.agents/skills/`, and `_architecture/` has been canonicalised onto the formats the skill enforces.

`jookoi-paper-trail` behavior rules (read-when-stuck, update-on-invalidation, delete-with-code, never-read-archive, three-time-horizons) now live only in global `my-global-setup/.agents/AGENTS.md` — they apply to every repo, not just this one. That file also gained the fallback rule: a repo with neither `_architecture/` nor `_jookoi-architecture/` at its root gets a `_jookoi-architecture/` created before any progress/context note is written there. This repo's own `AGENTS.md` no longer restates the rules — it just points at the global file and lists this repo's own paths (concept doc, design record, skill location).

The memory pipeline is three time horizons, not three content types: `current-state.md` is the live session, `progress.md` is accumulated finished sessions (capped 200 lines), `archive/YYYY-MM.md` is roll-off. Movement between them is `jookoi-doc flush` and `jookoi-doc rotate` — mechanics belong to the script, judgement (what happened, where it belongs, the standing-summary rewrite) belongs to the model. `progress.md` and `archive/` are never written by hand.

One entry grammar, `## YYYY-MM-DD — Title`, is used in all three stages, which is what lets flush and rotate be verbatim block moves.

The `_jookoi-` prefix is the public/private switch: no prefix ships, `_jookoi-*` is globally gitignored and mirrored to the personal vault (`C:\JooKoi-vault`) by `utility-scripts/vault-sync.js`. `~/.agents/skills/` is the live global source of skills; `my-global-setup/.agents/skills/` is a tracked mirror of a curated subset, direction decided per skill (`jookoi-doc` repo→home, `find-docs` home→repo).

The crash-course content lives in `ai-tooling-crash-course-for-developers/` and is tracked separately from repo-construction work; web research on its topics goes through cowork, not inline.

A standing constraint as of 2026-09-01 (`decisions/009-no-binary-dependencies.md`): nothing in the shippable layer may require a binary, an install step, or a runtime the machine does not already have. That closed topic 9 (dotfiles/portability) by rejection rather than by a research pass. Shipped scripts are plain text in an already-present runtime and must degrade to a written spec, the way `jookoi-doc` degrades to `references/file-formats.md`.

Root `README.md` is the navigation index for the whole repo (rewritten 2026-09-01): a short pitch, then linked tables per area. It is deliberately *not* a status doc — it points at `current-state.md` and `next-steps.md` for that, so it doesn't need updating every session.

`jookoi-doc` verification is complete: `flush`, `rotate`, the malformed-heading refusal, `stale` on the zero-real-CONTEXT.md case, and the `Stop` gate's blocking, `stop_hook_active`, and already-clean-log paths have all been exercised against real or isolated-scratchpad fixtures. Only the gate's genuinely-clean-tree branch was verified by reading rather than staging (it's a one-line `git status --porcelain` early-exit). Cold routing of real notes through the tree is still unexercised.

`my-global-setup/` and `my-repo-setup/` are inert, tracked copies of what belongs outside this repo (`~/.agents/`, `~/.claude/`, a new repo's starter tree) — nothing in either executes on its own, applying them is always a manual copy-out. `_jookoi-` prefixing does not apply inside them (that prefix means private/gitignored; these folders' point is the opposite — tracked so they survive across machines). `my-global-setup/.claude/settings.json` now carries a portable copy of `~/.claude/settings.json`'s `permissions.allow` block. Both READMEs and root `AGENTS.md` were rewritten 2026-09-01 to say this explicitly, after a wrong first attempt put the settings file under a gitignored `_jookoi-claude/` folder.

Nothing in this repo is committed by Claude — the user commits. That matters here because two large uncommitted passes are stacked: the canonicalisation rewrote most of `_architecture/`, and the rename touched ~20 files plus `~/.agents/`. Historic dated entries in `progress.md` and `archive/` keep their original wording where they quote what was said at the time; only live references were rewritten.

## Session log

