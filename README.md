# JooKoi Developer Stack

Personal, cross-project AI dev-tooling stack. Skills, prompts, conventions, global config — plus the research that justified each pick. Plain files, portable, survives a dead machine.

## Why this exists

Bare-minimum tooling used to be a fine choice, not a fallback. Work was standardized enough to get by on defaults. Going beyond that meant adopting someone else's packaged solution: usually more limited than what you actually needed, often picked by your employer rather than you, and real effort to keep running. If DevOps wasn't your thing, skipping it cost you little.

AI breaks that trade-off. It speeds up a developer's work by enough that the real gap now runs between developers who shape their own stack and developers still coasting on the old assumption that the default is good enough.

I've felt that shift hard this past couple years — I've built more tools in the past year than in the five or six before it, because an agent can now run in the background while I do my main work, instead of tooling needing its own dedicated block of time. The pace outran my ability to keep things organized: some tools got thrown out when they should have stayed, others piled up with no system holding them together. This repo is the start of fixing that, pulling what's worth keeping into one reusable toolkit instead of scattered one-offs. It isn't the best or most complete stack out there, it doesn't hold everything I've built (some of that lives at work and isn't mine to publish), and turning the pile into an actual system is still in progress.

## What it does

1. **Teaches** — `ai-tooling-crash-course-for-developers/` is a 16-topic reading path (context files, MCP, subagents, sandboxing, token economics, local models, supply chain). Each topic has a real research pass behind it.
2. **Decides** — nothing gets added because it trended. Every pick needs a named practitioner, current docs, or repo-health signals behind it. Every real decision gets a numbered record in `_architecture/plans/decisions/`.
3. **Ships** — `my-global-setup/` and `my-repo-setup/` are copy-paste bundles. No installer, no generator. Copy the folder, done.

## Core ideas

- **Plain files outlive vendors.** No binaries, no install step, no migration when the harness changes. Any agent, editor, or `grep` can read it all.
- **Adopted from need, not speculation.** The failure mode isn't "we lack a feature" — it's "nobody updates the notes." So keep it cheap to keep true.
- **Apps are opt-in, swappable.** graphify is one example. The context underneath doesn't depend on it.
- **Dotfile managers are rejected** — they'd own the core layer itself. Dependencies stay minimal, and binaries are the hard line. See [Dependencies](./_architecture/ARCHITECTURE.md#dependencies).
- Best for solo work or repos without an agreed team system. If your team has real shared infrastructure, use that instead.

## This repo vs. the plugin marketplace

```
JooKoi Developer Stack   → portable baseline (this repo)
JooKoi Plugins           → optional richer tooling (separate repo, not yet created)
```

This repo is the universal baseline — global `AGENTS.md`, small skills, prompts, conventions, research/decisions. Copy-out, no install. Framework-specific or heavier tooling belongs in a separate plugin repo layered on top. See [decision 014](./_architecture/plans/decisions/014-personal-plugin-marketplace-as-optional-extension-layer.md).

## The four layers

One rule decides what's public: the **`_jookoi-` prefix**. No prefix = committed. `_jookoi-` prefix = globally gitignored, mirrored to a private vault instead. Both can sit in the same folder.

| Layer | Lives at | Tracked | Travels |
|---|---|---|---|
| Personal / global | `~/.agents/` | in this repo, as `my-global-setup/` | every repo, every machine |
| Repo, shared | `AGENTS.md`, `_architecture/`, `CONTEXT.md` | yes, in that repo | with the repo |
| Repo, private | `_jookoi-architecture/`, `_jookoi-CONTEXT.md` | never | to the vault |
| Vault | separate repo, one per environment | yes, in the vault | nowhere |

Work repos, client repos, anything you don't own — still need private notes that survive a fresh clone. Same mechanism handles that.

## The vault

A separate git repo. Two halves: `repo-mirrors/<repo-name>/` (real relative paths) and `notes/` (non-code material). Sync is manual, bidirectional, additive on push (never deletes), and writes only into folders that already exist locally on pull. Conflicts get a report, never a silent overwrite.

Repo identity = **leaf folder name**, so parallel checkouts under different grouping folders still agree on vault location. Sync checks `git remote get-url origin` against what was recorded on first sync, and stops on mismatch.

**One vault per environment. They never touch.** Home has one, each employer has their own, no shared remote. A new job is a clean start. Only cost: a genuinely personal note written at work has to be moved by hand.

**Only this repo crosses environments** — mechanism only, no content. Setup anywhere: clone the stack, copy the bundles, create an empty vault.

## What the stack asserts

- **Sessions stay short.** Instruction-following decays as sessions grow. Fresh context is the cheapest compliance mechanism there is.
- **Ask, don't tell.** Stating a conclusion before requesting review raises sycophancy risk.
- **Load-bearing rules get re-injected, not just written down.** Compaction drops standing instructions silently — `TODO.md`'s Context header exists for this.
- **Compiler and tests are the only oracle.** Model prose doesn't correlate with correctness. Cap iteration at two passes.
- **Consensus isn't evidence.** Agents agreeing is correlated error, not confirmation. A cold read from a different model family beats any number of self-critiques.
- **No new dependency without a registry check.** Package hallucination happens across every model — a second opinion won't catch it.
- **Never bulk-generate context.** `CONTEXT.md` earns its place the first time real work happens in a folder. Mass-produced context is wrong on arrival.
- **Don't build a framework for a bounded annoyance.** Sometimes just eat the cost.

`jookoi-paper-trail` is the connective tissue: fixed file names, fixed places, one entry format, a skill that does the bookkeeping. Start with `jookoi-paper-trail.md`.

## Where to find things

**Learning and research**

| | |
|---|---|
| [`ai-tooling-crash-course-for-developers/README.md`](./ai-tooling-crash-course-for-developers/README.md) | Start here — the reading path. |
| [`topic-index.md`](./ai-tooling-crash-course-for-developers/topic-index.md) | Every topic, tagged known / new / disagree / wants-deeper. |
| [`topics/`](./ai-tooling-crash-course-for-developers/topics/) | 16 deep-dive docs. |
| [`TODO.md`](./ai-tooling-crash-course-for-developers/TODO.md) | Subtopics identified but not written yet. |

**Curated lists**

| | |
|---|---|
| [`_ai-tooling-recommendations.md`](./ai-tooling-crash-course-for-developers/_ai-tooling-recommendations.md) | What to actually use — repos, products, protocols. |
| [`_inspiration-and-staying-current.md`](./ai-tooling-crash-course-for-developers/_inspiration-and-staying-current.md) | Who to follow — newsletters, practitioners, communities. |
| [`EXPLORE.md`](./EXPLORE.md) | Unresearched pointers. Not a queue, not a commitment. |

**Opinions (labelled as such, kept separate from verified content)**

| | |
|---|---|
| [`personal-guidelines/developer-stack-tailoring.md`](./personal-guidelines/developer-stack-tailoring.md) | Building out a stack, corporate-locked-PC constraints. |
| [`personal-guidelines/prompting-and-instructions.md`](./personal-guidelines/prompting-and-instructions.md) | Writing instructions for agents. |

**Copy-out bundles**

| | |
|---|---|
| [`my-global-setup/`](./my-global-setup/) | → `~/.agents/`. Global `AGENTS.md`, gitignore snippet, portable skills. |
| [`my-repo-setup/`](./my-repo-setup/) | → new repo's root. Seed-template `AGENTS.md`. |
| [`utility-scripts/`](./utility-scripts/) | Build tooling for *this* repo only. Not shipped. |
| [`prompts/`](./prompts/) | Reusable ad-hoc prompts. Barely started. |

Three separate `AGENTS.md` files exist, don't confuse them: the global one (`~/.agents/AGENTS.md`, mirrored in `my-global-setup/.agents/`), this repo's own root [`AGENTS.md`](./AGENTS.md) (rules for developing this repo, not shippable), and the seed template in `my-repo-setup/`. Root [`CLAUDE.md`](./CLAUDE.md) just imports `AGENTS.md` — Claude Code doesn't read `AGENTS.md` natively ([decision 007](./_architecture/plans/decisions/007-agents-md-claude-code-bridge.md)).

**The convention**

| | |
|---|---|
| [`jookoi-paper-trail.md`](./jookoi-paper-trail.md) | Privacy switch, folder layout, pipeline, rules, tooling. Read this. |
| [`_architecture/plans/2026-08-30-jookoi-paper-trail.md`](./_architecture/plans/2026-08-30-jookoi-paper-trail.md) | Why it's shaped this way, prior art checked, where the build diverged. |
| [`my-global-setup/.agents/skills/jookoi-paper-trail/`](./my-global-setup/.agents/skills/jookoi-paper-trail/) | The skill that maintains it. |

**This repo's own paper trail**

`_architecture/` is metaspace — about building this repo, not distributable content.

| | |
|---|---|
| [`ARCHITECTURE.md`](./_architecture/ARCHITECTURE.md) | Why the repo is shaped this way. Static. |
| [`TODO.md`](./_architecture/TODO.md) | Where things stand. Read first on a cold start. |
| [`items.json`](./_architecture/items.json) | Live working set: now, parked, done, dropped items. |
| [`plans/decisions/`](./_architecture/plans/decisions/) | Numbered decision records. |
| [`plans/`](./_architecture/plans/) | One file per planning session, kept permanently. |
| [`archive/`](./_architecture/archive/) | Flushed `TODO.md` snapshots. Written only by `jookoi-paper-trail flush`. |

`_jookoi-architecture/` is the gitignored private counterpart — not visible on GitHub, by design.

## Status

Baseline survey and deep-dive research done. Crash course restructured 2026-08-30 ([decision 002](./_architecture/plans/decisions/002-crash-course-naming.md)). `jookoi-paper-trail` is designed, built, and running on this repo.

Live status always lives in `_architecture/TODO.md`, not here.
