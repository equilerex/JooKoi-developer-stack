# jookoi-paper-trail — design and build plan

Session: 2026-08-30. Status: designed, no blockers left. Build order at the end — steps 1–7 done (see `progress.md`), step 8 deferred.

Name is the argument. A folder of markdown files is a retro answer to a modern problem — and that's the point, not an apology.

## The take

Most memory tooling for coding agents solves for scale and automation. This solves for a different thing: the **low-level, easy-to-maintain, easy-to-copy** option that stays legible to both people and LLMs, and doesn't rot when the tool that produced it disappears.

Properties that matter, in order:

- **Future-proof.** Plain files outlive vendors. Nothing to migrate when the harness changes.
- **Agnostic.** No tool owns it. Any agent, any editor, grep, git.
- **Understandable by humans and LLMs alike.** Same artifact serves both — no export step, no viewer required.
- **Copyable.** Moving it is `cp -r`. Backing it up is rsync. That's the whole operation.

The sweet spot it's aimed at: **you're not collaborating under a repo-level agreed-upon system.** When a team has settled on shared infrastructure, use theirs. When there isn't one — solo work, a repo you don't own, or a team that hasn't converged — a folder is strictly better than adopting something heavier that only you use.

Second, independent claim: the **personal private data vault** stands on its own merit, separate from the agent-memory case. It's useful without any agent involved, and being plain files means it integrates with whatever memory system comes next rather than competing with it.

Explicitly **not** being built: automatic crawling, indexing, or maintenance. "Here's a file." READMEs were for people; these are for AI and people.

## The problem this solves

Agents start each session with no working context and are visibly worse for it. But the fix isn't a bucket of everything — it's a small, deliberate set of files holding only what gets an agent moving: scope, limits, requirements, and the historic decisions behind code that doesn't explain itself. Context lives next to the code it describes, so it dies when that code dies instead of rotting in a global store nobody maintains.

Per-repo files alone miss two cases:

1. **Repos where committing personal notes isn't allowed.** Work repos, client repos, anything not owned. Notes still need to exist and survive a fresh clone.
2. **Notes meant only for me.** Thinking, half-formed reasoning, things not ready to be stated in a repo's history.

And a scope problem: memory holding only code context throws away most of what's worth keeping. Split across separate tools, nothing ever gets searched together.

## Prior art (scanned 2026-08-27)

Checked before designing. The core intuition is not unique — which is corroboration, not a reason to stop. What's absent from the existing work is the specific combination below.

| Prior art | What it is | Overlap |
|---|---|---|
| [AGENTS.md](https://ericmjl.github.io/blog/2025/10/4/how-to-teach-your-coding-agent-with-agentsmd/) | Root markdown file, read at session start, appended to. 60k+ projects; donated to the Agentic AI Foundation (Linux Foundation) Dec 2025; read natively by Copilot, Cursor, Jules, Windsurf, Zed, Claude Code. | Strongest precedent for "plain markdown, harness-agnostic, universally read." Repo-scoped only — no personal/global layer. |
| [Personal Monorepo](https://mdflow.cz/blog/personal-monorepo-for-ai-agents) | One version-controlled folder of markdown as the agent's persistent home: `projects/`, `people/`, `notes/`, `TODO.md`, plus an `AGENTS.md` describing behaviour there. | Closest match to the vault. Same "one folder, git, plain markdown" thesis. |
| [ai-memory](https://github.com/akitaonrails/ai-memory) (AkitaOnRails) | Long-term memory + cross-vendor handoff for agent CLIs. | Directly targets the handoff problem across vendors. |
| [agent-work-mem](https://github.com/daystar7777/agent-work-mem) | Shared memory + handoffs across Claude Code / Codex CLI / Cursor / Aider, markdown only. | Same agnostic-handoff goal, markdown-only. |
| [agent-toolkit session-handoff](https://github.com/softaworks/agent-toolkit/blob/main/skills/session-handoff/README.md), [agent-handoff](https://codes1gn.github.io/agent-handoff/) | Session-handoff as a packaged skill. | The handoff skill already exists as a pattern — read before writing one. |
| Claude Code `MEMORY.md` (Feb 2026) | Per-subagent persistent markdown store; first 200 lines injected at startup, agent reorganizes when it grows. | Vendor-specific, but validates markdown-file-as-memory at the harness level, and is the precedent for the line cap below. |
| [Plain text file as agent memory](https://voxos.ai/blog/how-to-give-ai-coding-agents-long-term-m/index.html) | Argument that plain text beats RAG for this. | The thesis, stated by someone else. |

**What none of them cover, together:** the two-level split (per-repo *and* a separate personal vault), with the vault holding **non-code material as first-class content**, and the level chosen by *what a note is* rather than where it was written. Existing work is repo-scoped or personal-scoped, not both with a stated rule for which gets what.

---

# The design

## The central mechanism — the prefix is the privacy switch

One rule generates the whole public/private split:

| Name | Git | Vault | Purpose |
|---|---|---|---|
| No prefix (`CONTEXT.md`, `_architecture/`, `AGENTS.md`) | committed | not synced | shared with the team, already versioned |
| `_jookoi-` prefix (`_jookoi-CONTEXT.md`, `_jookoi-architecture/`, `_jookoi-AGENTS.md`) | globally gitignored via `~/.gitignore: _jookoi-*` | synced | private |

Both coexist in the same folder — a committed base file plus a private layer beside it. No negation rules, no per-repo setup, and the safe default is automatic: forget to configure something and nothing leaks; worst case a note doesn't get committed.

Third benefit beyond the two problem cases above: in public repos, internal reasoning, doubts, known flaws and security observations stay private.

## Project level

```
repo/
├── AGENTS.md                    shared rules (or _jookoi-AGENTS.md, private)
└── _architecture/               (or _jookoi-architecture/, private)
    ├── ARCHITECTURE.md          why it's shaped this way
    ├── next-steps.md            forward-looking only
    ├── current-state.md         the live session: standing summary + session log
    ├── progress.md              accumulated finished sessions, hard line cap (~200)
    ├── plans/                   one file per planning session, kept
    │   ├── 2026-08-30-<topic>.md
    │   └── decisions/           kept decision records, one per call, numbered
    │       └── NNN-<topic>.md
    └── archive/
        ├── index.md             readable — what each file covers, date range
        └── 2026-08.md           explicit request only
```

`plans/decisions/` holds standalone decision records (accept/reject calls with reasoning) that aren't tied to one planning session's narrative — kept permanently like the rest of `plans/`, never capped or rotated.

**The three files are three time horizons, not three content types.** `current-state.md` is the live session; `progress.md` is accumulated finished sessions; `archive/YYYY-MM.md` is roll-off. Content moves between them on a schedule, never on a judgement about what kind of thing it is.

`current-state.md` holds two blocks with different behaviours: a **standing summary**, rewritten in place at every flush and never appended to, which is what a cold session reads first; and a **session log**, appended to during the session and emptied by flush. The session log surviving compaction is why the file exists separately from `progress.md` at all.

`progress.md` enforcement: hard line cap, oldest whole entries roll off first into the dated archive file. Deterministic, no judgement call, no silent relevance-pruning. All three stages share one entry grammar (`## YYYY-MM-DD — Title`), which is what makes flush and rotate verbatim block moves rather than rewrites.

**`plans/` — plans live in the repo, not in harness session storage.** Every planning session writes a dated file here and it stays. Plans held in a harness's proprietary global session store can't be reviewed by hand, can't be picked up by a different agent or harness, and are effectively lost when a session runs out of tokens — which is exactly when the plan matters most. Plans are not capped and not archived; they're historic reference.

## Feature level

`CONTEXT.md` (shared) / `_jookoi-CONTEXT.md` (private), at feature-area and component-folder granularity. Thin fixed sections, so the skill can update one section surgically and a person knows where to look:

```markdown
# CONTEXT — profile-card
updated: 2026-08-30

## What this is
Scope, one or two lines.

## Why it's built this way
Decisions that don't self-explain.

## Gotchas
Glitches, footguns, surprises.

## Don't
Tried and rejected.
```

Lifecycle is coupled to the code: created alongside it, updated when a change invalidates it, deleted with the folder.

**What does NOT go in.** Less-is-more without a negative test bloats into the bucket this avoids. Exclusions, enforced by the skill and stated in AGENTS.md: no restating what the code plainly shows; no API/parameter documentation (that belongs in code); no changelog or commit history (git has it); no general framework knowledge (the model has it). If removing a line wouldn't slow a newcomer down, it doesn't belong.

**Staleness.** A wrong context file is worse than none — an agent trusts it. Two cheap defences: the `updated:` line above, and a standing rule that **when context contradicts the code, the code wins and the context gets corrected immediately**, before continuing the original task. The skill compares that date against the folder's last commit to flag likely-stale files, with no crawling.

**Adoption.** Never bulk-generate context files for an existing repo — mass-produced context is exactly the unmaintained bucket this avoids, and it's mostly wrong on arrival. A context file is created the first time real work happens in that folder, by the agent doing that work. Coverage grows with attention, which is the only place it's worth having.

## The vault

Separate repo. Both halves committed, neither disposable.

```
vault/
├── AGENTS.md
├── repo-mirrors/
│   └── <repo-name>/            real relative paths preserved
│       ├── _jookoi-architecture/
│       └── src/accounts/_jookoi-CONTEXT.md
└── notes/
    ├── projects/  experiments/  research/
    └── learning/  people/       utils/
```

Only `_jookoi-`-prefixed files mirror. Non-prefixed files are already in git and are ignored by sync.

**Repo identity is the leaf folder name.** Checkouts live under themed grouping folders — `C:/repos/serenity/<repo>`, `C:/repos/rocinante/<repo>`, `nostromo`, `daedalus`, `babylon-5` — arbitrary buckets with memorable names, so it's easy to remember which project sits where. The grouping folder varies; the repo folder name doesn't. So parallel checkouts of the same repo already agree on their leaf name, and keying the vault mirror on it gives one vault folder per repo for free. The group folder is never part of the vault path.

Sync verifies rather than derives: it compares `git remote get-url origin` against what the vault folder recorded on first sync, and stops with a report on mismatch. That catches the one case the leaf name can't — two genuinely different repos sharing a generic name (`api`, `docs`) in different groups. Remote-derived naming is not used as the key; a rename or a fork would silently split the mirror.

**One vault per environment. They never touch.** Home has a vault; each employer has its own. No shared remote, no sync between them, no notes crossing the boundary. That's what makes hosting a non-question: each vault gets whatever remote its own environment permits, and corporate observations physically cannot reach a personal remote because they live in a different repo entirely.

**The only thing that crosses is this repo.** `JooKoi-developer-stack` is the seed — it carries the *mechanism* (the `jookoi-doc` skill, the sync script, the conventions, the global config templates) and no *content*. Setup at a new employer, or at home, is the same three steps: clone the stack, run its setup script, create an empty vault beside it.

**So machine bootstrap belongs in the stack, not the vault.** `~/.gitignore` (with `_jookoi-*`) and the global `.agents.md` are the same everywhere, and a machine silently lacking them fails in the unsafe direction — private files stop being ignored. Canonical copies live in this repo under `my-global-setup/` at repo root (moved out of `utility-scripts/` 2026-09-01 — see Implementation deviations, below), applied by hand (copy `.agents/` to `~/.agents/`, append the gitignore snippet, set `core.excludesFile`) rather than a setup script — see that note for why. The vault stays pure content, which is also what lets it be per-environment without duplicating tooling.

## Behaviour rules

Live in the global `.agents.md`, restated per-repo:

1. **Read when stuck, not always.** Consult the nearest context file at or above the working folder when entering unfamiliar code or lacking understanding — not on every operation. Context is king, less is more.
2. **Update on invalidation.** After a change that makes an existing context file wrong, invoke `jookoi-doc` to correct it.
3. **Delete with the code.** Removing a folder removes its context file.
4. **Never read `archive/`** unless history is explicitly requested. `archive/index.md` is readable — it exists so an agent can judge whether asking is worthwhile without reading any of it.

## The `jookoi-doc` skill

One skill, all operations (create, update, remove, find, use) — both levels share one ruleset, so splitting would duplicate it. Owns the line cap and archive rotation.

Triggers, in order of preference:

- **Rule-driven** — AGENTS.md instructs invocation after an invalidating change. Portable across harnesses.
- **End-of-turn gate** — Claude Code `Stop`/`SubagentStop`, Gemini CLI `AfterAgent`, Copilot CLI `Stop`/`AgentStop`. This is the flush trigger, and it is the only lifecycle event that can inject an instruction the model must act on before the turn ends. It blocks only when the tree is dirty *and* the session log is unflushed *and* the harness's loop-prevention flag is not already set — so flushing clears it and it never fires twice.
- **Pre-compaction preservation** — Claude Code `PreCompact`, Gemini CLI `PreCompress`. Receives the entire uncompacted transcript on stdin and **cannot inject anything back**; its only job is getting to disk what compaction discards. The original claim that this was "the highest-value trigger" was half right: the moment matters most, but the injecting half has to be the paired `SessionStart` event (matcher `compact`/`compress`), which fires after the shrink and can inject.

No hook on any harness invokes a skill by name. A gate injects an instruction; the model acts on it.

MVP first: rule-driven invocation, create/update, line cap, archive rotation. Enough to dogfood. The full design (find/remove semantics, staleness detection, section-surgical updates, conflict-aware writes) got its own planning round once the MVP had shown what it needed — memory-system build step 8, planned and built 2026-09-01 (`_architecture/plans/2026-09-01-jookoi-doc-full-skill.md`).

## Sync script

Bidirectional, manual invocation only — parallel checkouts make any automatic sync unsafe.

**Push (checkout → vault).** Additive: adds and updates, never deletes. A stale branch missing folders must not remove vault content written from a newer one. `--force-full` for genuine deletions, renames, and refactors.

**Pull (vault → checkout).** Writes only into folders that already exist in this checkout — this is what prevents stale structure from being resurrected. Run when the checkout is stable, or after a push.

**Conflicts** (both sides modified since last sync): compare timestamps, sync everything unambiguous, then emit a conflict report listing each conflicting file with both timestamps. Resolve by accepting one side, rejecting, or handing the pair to the LLM to merge. Nothing is overwritten without appearing in that report.

## Vault hosting — resolved by the per-environment split

The disclosure problem solved itself once vaults stopped being one thing. A vault never leaves its environment, so each one's remote is simply whatever that environment already allows: a private remote at home, whatever an employer sanctions on their hardware, local-only where nothing is sanctioned. No rule for the sync script to enforce, because there is no path between them to police.

Two things this makes real rather than aspirational: recovery works everywhere (each vault can have a remote, since none of them is the risky one), and a new employer is a clean start by construction — no accidental inheritance of the previous one's notes.

The cost is accepted deliberately: home and work vaults don't share content, so a genuinely portable personal note written at work has to be moved by hand. That's the correct friction.

Related: `_architecture/BACKLOG.md`'s corporate/restricted-environments subtopic is largely answered by this.

## Open

- Line cap number — 200 proposed, following the `MEMORY.md` precedent. Adjust once real use shows whether that's tight or loose.
- The `_jookoi-` prefix is hardcoded personal. Making it a one-line config value costs nothing and is the difference between this being usable by others later. Do it when the sync script is written, not before.

## Build order

1. **Vault repo scaffold** (home vault first) — `repo-mirrors/`, `notes/` with its six subfolders, an `AGENTS.md` for the vault's own rules. Empty otherwise.
2. **Migrate `_architecture/local/` into the vault** — real content as a load test. If the design can't hold what's already written, it's wrong; revise before step 4.
3. **Global config in this repo** — canonical `~/.gitignore` snippet and global `.agents.md`/`AGENTS.md`, applied by hand rather than a setup script (see Implementation deviations, below).
4. **`jookoi-doc` MVP** — read `agent-toolkit`'s session-handoff and `agent-handoff` first; adapt rather than invent the handoff half.
5. **Sync script** — push, pull, conflict report, `--force-full`, leaf-name identity with remote verification.
6. **Hooks** — SessionEnd, then PreCompact if the event exists.
7. **Dogfood here** — this repo's `_architecture/` already matches the convention; add `current-state.md`, `progress.md`, `plans/`, `archive/index.md` and run the system on itself.
8. **Plan the full `jookoi-doc` skill** — own session, informed by steps 4 and 7.

Steps 1–3 are hours. Steps 4–6 are the real work. Step 7 is what proves it. Steps 1–7 done as of 2026-08-30 (see `progress.md`). Step 8 planned and built 2026-09-01 — plan at `_architecture/plans/2026-09-01-jookoi-doc-full-skill.md`, skill at `my-global-setup/.agents/skills/jookoi-doc/`. Not yet exercised against real input; verification is sequenced in `next-steps.md`.

## Implementation deviations

Where this repo's actual build diverged from the design as first written above. Reconcile future reads against this, not just the sections above.

- **No setup script.** The design's build order (step 3) and hosting section assumed an installer script for `~/.gitignore`/global `AGENTS.md`. The user rejected this directly (2026-09-01): script-generated config is "magic," hard to visualize/browse/modify. Applying `my-global-setup/`/`my-repo-setup/` to a machine or new repo is manual copy — read the folder, copy it, done. No `setup.sh` anywhere in either bundle.
- **Copy-out bundles live at repo root, not `utility-scripts/`.** The design (and this repo's first pass at building it) put the canonical global/seed config under `utility-scripts/jookoi-global-config/`. That was a misreading of the plan, not a deliberate choice — corrected 2026-09-01: `utility-scripts/` is build tooling *for this repo*; anything meant to be copied elsewhere (global config, seed template) is not that, and now lives at repo root as `my-global-setup/` and `my-repo-setup/`. `utility-scripts/` keeps only `vault-sync.js`, `jookoi-graphify-setup/`, `jookoi-hooks/`.
- **A repo gets its own `.agents/skills/` too, not just a global one.** Not explicit in the design — clarified 2026-09-01: this repo's root `.agents/skills/` holds tooling used to *build this repo*, populated manually/on request; distinct from `my-global-setup/.agents/skills/`, which holds skills meant to ship to any repo.
- **`my-global-setup/.agents/` is a mirror of `~/.agents/`, not always the source.** Corrected 2026-09-01 — earlier wording in `README.md`/`ARCHITECTURE.md` assumed the repo copy was always the ship-from/canonical location. In practice `~/.agents/skills/` already holds 47+ live skills in active daily use, most authored there directly; the repo folder is a tracked backup of a curated subset, not the authority. Direction is per-skill: `jookoi-doc` was authored in the repo first and shipped out (repo is source); `find-docs` (Context7 docs lookup) was authored at `~/.agents/` and copied into the repo as a backup (`~/.agents` is source). Don't assume one direction repo-wide — check per skill.
- **No separate root `skills/` staging folder.** An earlier pass authored `jookoi-doc` at root `skills/jookoi-doc/SKILL.md`, treating it as "content the stack produces" before being copied out — this created a real duplication gap (the skill sat there, uncopied, while `my-global-setup/.agents/skills/` stayed an empty placeholder). Fixed 2026-09-01: `jookoi-doc` is authored directly at `my-global-setup/.agents/skills/jookoi-doc/`, its actual ship-from location, matching how the global `AGENTS.md` is authored directly in `my-global-setup/.agents/`, not in a separate root staging copy. Root `skills/` deleted.
- **Seed-template `AGENTS.md` was built, not deferred.** Earlier `next-steps.md`/`BACKLOG.md` entries said the seed instance was deliberately deferred pending a second real project. It was actually written 2026-09-01 as `my-repo-setup/AGENTS.md` (a bracketed starter template) alongside the global-config restructuring — those tracking docs were stale, now corrected.
- **`_architecture/local/` retired for real, 2026-09-01.** Migrated to sibling `_jookoi-architecture/` (build order step 2 called this a load-test in 2026-08-30; the permanent move happened later, once the design had settled). `.gitignore`'s narrow `/_architecture/local/*` line replaced with the general `_jookoi*` pattern (further corrected same day to `_jookoi-*`, requiring the hyphen — matches the prefix actually used everywhere, e.g. `_jookoi-architecture/`). Vault push run for real the same day — `_jookoi-architecture/`'s 5 files now mirrored into `C:\JooKoi-vault\repo-mirrors\JooKoi-developer-stack\`.
- **`gr` (graphify) reconfigured off Ollama, 2026-09-01** — `--backend claude`, dropping the Ollama-only env vars. `gr:ollama` and `gr:gemini` kept as alternates in `package.json`.
- **`current-state.md` and `progress.md` were never actually defined, 2026-09-01.** As first written, both were described as done-work logs (`rolling, hard line cap` / `short-lived; done work awaiting archive`) with no test to tell them apart. Routing was improvised per session and the two files accumulated near-duplicate content. Resolved as a time horizon: live session / accumulated finished sessions / roll-off. The sections above have been rewritten to the resolved definition.
- **The line cap moved from `current-state.md` to `progress.md`, 2026-09-01.** The original cap was coherent only while `current-state.md` accumulated. It is now a session buffer that empties at every flush and so cannot grow; the 200-line cap and the roll-off belong to the file that actually does.
- **`PreCompact` is not the flush trigger; the end-of-turn gate is, 2026-09-01.** The design named `PreCompact` the highest-value trigger and `SessionEnd` the primary one. Neither can inject an instruction back into the session — they can write to disk and emit a system message, nothing more. The blocking end-of-turn event (`Stop`/`AfterAgent`/`AgentStop`) can, so the flush gate lives there, and `PreCompact` keeps only the job it can actually do: writing the pre-shrink snapshot to disk. Recorded so `PreCompact`-as-trigger isn't re-attempted.
- **The skill ships hooks for three harnesses, not one, 2026-09-01.** The design assumed Claude Code. On the user's instruction the bundle carries one lifecycle mapping across Claude Code, Gemini CLI and GitHub Copilot CLI, with one shell helper branching per harness and three copy-in config fragments. Blocking support on Gemini's `AfterAgent` and Copilot's `Stop`/`AgentStop` is unverified and flagged as such in `references/hooks.md`; the gate degrades there to a written reminder surfaced at the next session start.
- **Mechanics moved into a script, 2026-09-01.** Not in the design at all. Every defect the dogfooding pass found was bookkeeping — divergent heading grammar, a verbatim duplicate entry, a rotation that never ran — not judgement. Those are exactly what an LLM tracks badly across sessions, so `scripts/jookoi-doc.js` owns dating, heading grammar, ordering, dedup, the cap, roll-off, archive-index pointers, `NNN` allocation, `updated:` bumping and template instantiation. The model keeps what happened, where it belongs, and the standing-summary rewrite. The script refuses rather than reformats when a file does not match its expected shape.
- **`current-state.md`/`progress.md`/`next-steps.md` retired in favor of `TODO.md`, 2026-09-02.** The forced per-session flush and continuously-resequenced forward plan turned out to be the friction, not a feature. Full redesign record and reasoning: `_architecture/plans/2026-09-02-jookoi-doc-redesign.md`.

## Related, elsewhere in this repo

Fragments of this system, logged before it had a name — reconcile against this doc, don't solve independently:

- `_architecture/plans/decision-history/003-memory-ledger-picks.md` — trial storage direction (local filesystem + Graphify + Obsidian); its still-open centralized-memory design is the vault under another name.
- `_architecture/BACKLOG.md` — "Multi-checkout / multi-repo personal-file sync", now answered by the sync script above.
- `_architecture/BACKLOG.md` — hook-triggered engineering-knowledge-file idea (now the `jookoi-doc` triggers), and the "global developer location" question (now the vault).
