# Backlog — logged, not yet scoped
<!-- Unordered. Promote to next-steps.md when an item gets a real slot. See AGENTS.md. -->

Draft/logged only. Not fleshed out, not ready for implementation — see `_architecture/next-steps.md` for the ordered, actively-worked plan.

## Multi-checkout / multi-repo personal-file sync

Status: OPEN

User works multiple simultaneous checkouts of the same repo (parallel branches) and needs:
- A way to sync shared content (e.g. a global-agents-equivalent folder) across those checkouts — symlinks? partial-sync tooling against an already-existing target folder?
- A portable, generalizable version of the gitignored-personal-file pattern (`_jookoi-` prefix precedent) usable in *any* repo, including ones the user doesn't own — where committing isn't an option but losing the content on a fresh clone is a real risk.

The durability half of this is the same shape as `_architecture/plans/decisions/003-memory-ledger-picks.md`'s still-open centralized-memory design (mirror to a global personal location) — cross-link, don't re-solve independently.

Needs its own research pass before any decision. Not every open question here needs a full topic doc first, though — a narrower "what's current best practice for X" question can just be ad hoc discovery (research it, present findings, let the user decide), same as this whole planning round did. Reserve a full doc for things that earn a lasting reference.

## Memory system

Status: MOVED

Full design done 2026-08-30, lives in `_architecture/plans/2026-08-30-jookoi-paper-trail.md`. Not a backlog item any more; build order 0–8 is in that doc, status tracked in `_architecture/next-steps.md` and `progress.md`.

What it settled, so it isn't re-solved here: the `_jookoi-` prefix as the public/private switch, the project-level file set (`architecture.md`, `next-steps.md`, `current-state.md`, `progress.md`, `plans/`, `archive/`), feature-local `CONTEXT.md`, the vault repo layout, the bidirectional manual sync script, and one skill (`jookoi-doc`) rather than two.

The multi-checkout sync item above, the hook-triggered knowledge-file idea, and the global-developer-location question are all answered by that design — reconcile against it, don't solve independently. `decisions/003-memory-ledger-picks.md`'s open centralized-memory design is the vault.

Vault hosting is settled too: one vault per environment, never shared — home and each employer keep their own, and this repo is the only thing that crosses, as the seed. No open blockers.

## AGENTS.md instances — one file per context, not one file

Status: OPEN

A single `AGENTS.md` can't serve every context. Three distinct instances, resolved 2026-08-30:

- **Global instance** — `~/.agents/AGENTS.md`, the machine-level personal ruleset, inherited everywhere. Written.
- **This repo's own instance** — repo-root `AGENTS.md`, rules for developing *this* repo specifically. Not a template. Written.
- **Seed-template instance** — a copyable bootstrap `AGENTS.md` for brand-new projects. Written 2026-09-01 as `my-repo-setup/AGENTS.md` (a bracketed starter template, not this repo's own ruleset) — no separate `seed/` folder; `my-repo-setup/` fills that role.

Still open, not resolved by the above:

- **Repo-flavour instances (possible)** — variants per project type (e.g. Angular vs. Stencil), layered on top of the seed instance once it exists. Gated on a second real flavour existing.
- How instances compose (inherit? override? both?) once more than one is in play at once. Remaining half of `stack-distribution.md`'s open question 2.

## Per-feature-area LLM context files

Status: MOVED

Resolved by the memory-system design — this is the feature-level `CONTEXT.md`/`_jookoi-CONTEXT.md` convention in `_architecture/plans/2026-08-30-jookoi-paper-trail.md`. Prior art (Malloy's CONTEXT.md convention, the `llm-context-md` proposal, the Codebase Context Specification, all logged in `decisions/003-memory-ledger-picks.md`) already folded in. Not an open item any more.

## Corporate/restricted developer environments

Status: MOVED

Moved to `ai-tooling-crash-course-for-developers/TODO.md` — it's crash-course-content work, not repo-construction, so it lives beside the docs it belongs to rather than here.

## Reusable prompts — confirmed research gap

Status: OPEN

Flagged 2026-08-26. `ai-tooling-crash-course-for-developers/topic-index.md` topic 2 ("Prompt & skill libraries") only actually covers *skills* — no research doc exists on reusable prompts as their own artifact (design/structure of a good reusable prompt, prompt vs. skill vs. slash-command, templating/variables, organization/versioning as the set grows). Root `prompts/` dir exists but is empty — expected, Stage 4 population hasn't started. The gap is the missing research, not the empty folder. Needs its own light-to-medium research pass before `prompts/` gets populated for real.

## Graphify output — vault-mirror pattern for no-commit repos

Status: DESIGNED

Corrected 2026-08-30: graphify output is not cheap to regenerate (LLM-backed extraction — this repo's own `gr` script now targets the `claude` backend, reconfigured 2026-09-01 off Ollama; `gr:ollama` and `gr:gemini` kept as alternates) and carries a hand-curated layer on top (`graphify save-result`/`reflect` → `LESSONS.md`, `.graphify_learning.json` preference overlay) — not disposable output, closer to an authored artifact.

- **Own repos, commit allowed** — tracked normally in `_architecture/graphify/`, no prefix, no vault involvement.
- **Restricted/no-commit repos** — private, at `_jookoi-architecture/graphify/` in the checkout, mirrored into the existing vault location `repo-mirrors/<repo-name>/graphify/` — same per-repo keying as everything else, no new taxonomy.
- **Sync semantics differ deliberately from `vault-sync.js`.** That script's mtime-diff/conflict-report machinery exists because markdown notes have real partial-merge value. A generated graph doesn't — it's one artifact from one run, so blunt whole-folder overwrite is correct, not a shortcut. Needs its own small script (or a distinct `--blunt` path), not a mode bolted onto `vault-sync.js`.
- **One-directional, matching the single-canonical-instance work-PC pattern:** one designated checkout runs the expensive extraction; that checkout's output is authoritative and overwrites the vault copy. Other parallel checkouts read from the vault, never write to it.
- **Still open before building anything:** confirm `graph.json`/`LESSONS.md` don't embed machine-specific absolute paths (test via the cheap `--code-only` extraction, not a full LLM run) — if they do, the mirrored copy isn't portable across machines and the pattern needs a path-rewrite step.

Not applicable to this repo right now (commit is allowed here) — logged so the pattern exists when a restricted repo needs it.

## Stray root `graphify-out/`

Status: OPEN

Spotted 2026-09-01 while indexing the repo for the README. A `graphify-out/` folder sits at the repo root, untracked *and* not gitignored, holding a `cache/` subfolder. `AGENTS.md` puts graphify output at `_architecture/graphify/`, which also exists and is the tracked one. Either a stray run wrote to a default path or the `gr` script's output dir drifted. Check `package.json`'s `gr*` scripts, then delete the stray or repoint the script. Cheap, just needs a look.

## Hooks / dotfiles — standalone deep-dive doc gap

Status: OPEN

Not a review-gate item, just a documentation gap. Hooks/automation triggers and dotfiles/portability both need their own deep-dive doc eventually; lighter-pass status for now.

## Crash-course structure reorg

Status: OPEN

Ties to `_architecture/plans/decisions/002-crash-course-naming.md`. Eventual structure should split "core developer AI-tooling 101" (concepts most AI-assisted devs should know) from "optional/deeper topic areas" (local models/hardware, corporate/restricted environments, deeper security, advanced memory/context systems, harness architecture, protocol internals, RAG/second-brain, advanced orchestration) — not one flat folder where basic and specialist material look equally load-bearing. Do not execute yet.

## 101 overview — "how do AI agents actually work"

Status: BLOCKED

Blocked on the crash-course structure reorg above — root-vs-deep-dive-vs-special-topic placement has to be decided first, then this gets written into the reorganized structure. Scope: coding-agent lifecycle, how the researched topics fit together, an ELI5 appendix on how LLMs work generally.

## Session/token economics (topic 3)

Status: OPEN

Not a blocker for anything else, and not currently relevant. Once the overall stack architecture exists, mention `AGENTS.md`'s importance there.

## `JooKoi-commit-message` skill

Status: OPEN

Flagged 2026-08-23. Explicitly do not start yet. Scope: script(s) to pull a token-efficient diff/change overview (not raw `git diff`) and generate a commit message from a personally-defined, user-editable template. Ties to topic 2 (skill libraries) and topic 3 (token economics). Not researched — just captured so it isn't lost.

## Where coding agents actually do their work outside the visible project

Status: OPEN

Flagged 2026-08-23. Global per-tool folders holding session logs/temp state (e.g. `~/.claude/`), and workflows where an agent works in a temporary directory or git worktree entirely outside the project, branching/merging back later. Real "AI basics" content for a newcomer. See `ai-tooling-crash-course-for-developers/topic-index.md` placeholder entry. When picked up: research as its own topic, write a deep-dive doc, add to `topic-index.md` properly.

## Guardrails for common misleading phrases

Status: OPEN

Not started. The dev-stack `AGENTS.md` baseline should have a guardrails section for phrasing the LLM tends to over-interpret — e.g. "deep research"/"deep dive" read as academic-level research when the user means an effective general overview referencing more than one or two sources. Similarly needs guards against classic token-waste patterns: looping, spiraling.

## Paste sanitizers — strip pasted context down to the useful lines

Status: OPEN

Flagged 2026-09-01. Scripts that take copy-pasted content and return only the parts worth feeding an agent. The recurring problem: the easily-available context is thousands of lines, and the useful part is a handful picked out of it.

Named cases:

- **Browser console cleaner** — keep real file references and errors, drop the build-artifact noise, framework chatter, and repeated warnings that make up most of the paste.
- **Test-output cleaner** — the failure and its location, not the full runner output.
- **Long-article compressor** — reduce prose to what is actually being claimed.

Open design question, not a pick: a two-stage pass where a cheap/local model does the first reduction and the expensive model only ever sees the result. That is a different mechanism from pure rule-based stripping (regex/heuristic filters) and the two may suit different cases — console output is patterned enough for rules, an article is not.

Ties to token economics (crash-course topic 3) and to `local-model-hardware-fit.md` if the cheap first pass runs locally. Not researched — captured so it isn't lost.
