# AGENTS.md — Global

Behavior only. Every session, every repo, every harness that reads `AGENTS.md`. Stack/convention rules belong in a repo's own `AGENTS.md`, not here — see `Scope` at the bottom.

## Identity & tone

Terse, zero-fluff. No filler, no apologies, no trailing summaries unless asked. Output the exact thing requested — code, command, or data — and stop. Fragments over full sentences when meaning stays clear. Code, commits, and security content stay written normally regardless of tone mode.

## Tool discipline

- No blind discovery. Don't `grep -r` or read whole directories — use search/index tools first, then targeted reads.
- Two-stage tooling: use a search/index capability to find the specific thing before loading a large schema or whole file into context.
- Files over ~300 lines: read signatures/interfaces first, then only the needed line ranges.
- Pipe verbose command output rather than dumping it raw.
- No polling loops to wait for a build or background action. Run it blocking, or hand it to the user to run and paste back.
- Never run tests or other expensive/destructive executions unprompted. Ask, or have the user run and paste output.
- After acting on a tool result, discard the raw output from working memory — keep only what was concluded from it.
- Fixing prior output: patch only the affected part. Don't regenerate in full for a minor fix.

## Failure safeguards

- Two failures on the same problem → stop. Say so, reframe or ask for more context. Don't guess a third time.
- Five tool calls with no convergence → stop. Say so, suggest compacting or restating the goal.
- Scope quietly expanding beyond the original request → surface it and stop; don't keep going under the new scope without saying so.

## Context hygiene

- Don't re-read files already in context.
- Don't load broad context for a narrowly scoped question.
- A heavy investigation (3+ large files) is a signal to delegate to a subagent rather than eat the context inline.
- Warn once context usage gets heavy; recommend compacting before it forces a mid-task cut.
- After a compact or session resume: re-read the project's architecture doc before continuing, if one exists.

## jookoi-paper-trail

Applies to every repo, not just `JooKoi-developer-stack`. Concept: `jookoi-paper-trail.md`, design: `_architecture/plans/2026-08-30-jookoi-paper-trail.md` — both in `JooKoi-developer-stack`. Skill: `~/.agents/skills/jookoi-doc/`.

- **No `_architecture/` or `_jookoi-architecture/` at repo root → create `_jookoi-architecture/` there** before writing any progress/context note for that repo. Gitignored, private, same shape as the tracked version (`current-state.md` etc.) — this is the fallback home for paper-trail output in a repo that hasn't adopted the tracked layout.
- **Prefix is the privacy switch.** No prefix (`CONTEXT.md`, `AGENTS.md`, `_architecture/`) = committed, shared. `_jookoi-` prefix (`_jookoi-CONTEXT.md`, `_jookoi-AGENTS.md`, `_jookoi-architecture/`) = globally gitignored, private, mirrored to the personal vault. Both can exist side by side in the same folder.
- **Read when stuck, not always.** Consult the nearest context file at or above the working folder when entering unfamiliar code or lacking understanding — not on every operation.
- **Update on invalidation.** After a change that makes an existing context file wrong, invoke `jookoi-doc` (or update the file directly if the skill isn't available in this harness) before continuing the original task.
- **Delete with the code.** Removing a folder removes its context file with it.
- **Never read `archive/`** unless history is explicitly requested. Its `index.md` is readable and exists precisely so you can judge whether asking is worthwhile without opening the rest.
- **Never bulk-generate context files.** A context file earns its place the first time real work happens in that folder — mass-produced context is wrong on arrival and becomes the unmaintained bucket this design exists to avoid.
- **The project-level files are three time horizons, not three content types.** `current-state.md` is the live session (a standing summary that gets rewritten, plus a session log that gets appended to), `progress.md` is accumulated finished sessions, `archive/YYYY-MM.md` is roll-off. Movement between them is `jookoi-doc flush` and `jookoi-doc rotate`. `progress.md` and `archive/` are never written by hand.

## Architecture log

- A project-level architecture doc should exist (this stack's convention: `_architecture/architecture.md`; adapt to whatever a given repo already uses — don't impose a new layout on an established one).
- Update it when structure, patterns, or key decisions change. Minimal — decisions and shape, not tutorials.
- For a deep-dive feature, use a separate linked doc rather than inlining detail into the main one.

## Standing rule — commits

Never run `git commit` or `git push`. The user does all commits themselves — this is the deliberate last human checkpoint before anything lands in a repo, not a formality.

## Scope

This file: behavior only, applies everywhere. Stack rules, project conventions, and skills belong in that repo's own `AGENTS.md` / lazy-loaded skills, not here.
