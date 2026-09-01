# JooKoi Developer Stack

A personal, cross-project AI dev-tooling stack: the skills, prompts, conventions and global config I actually use, plus the research trail that decided each pick. Portable, versioned, recoverable if a machine dies.

Not tied to any product repo (see `JooKoi-frontpage-to-the-open-web` for that one).

## The pitch

AI coding tools change faster than anyone can evaluate them properly, and most of what's written about them is vendor copy or a hot take with nothing behind it. This repo is one developer's answer to that, and it does three separable things.

It **teaches**. `ai-tooling-crash-course-for-developers/` is a self-study reading path covering what a working developer actually needs to know: context files, MCP, subagents, sandboxing, token economics, local models, supply-chain risk. Sixteen topics, each with a real research pass behind it.

It **decides**. Nothing enters this repo because it trended. Every opinionated pick clears an evidence bar (a named practitioner with a checkable identity, current docs, or repo-health signals) and every call that mattered has a numbered record in `_architecture/plans/decisions/` stating what was rejected and why. Research presents options. It never picks. The failure mode being avoided is a stack assembled from whatever one research session happened to surface.

It **ships**. `my-global-setup/` and `my-repo-setup/` are literal copy-paste bundles. No generator, no install script, no framework. Read the folder, copy it, done. Generated config is hard to browse and hard to modify, which is the opposite of what this whole thing optimises for.

### The ideology, stated plainly

Plain markdown, harness-agnostic, adopted from demonstrated need rather than speculative completeness.

The bet is that **plain files outlive vendors**. Nothing here needs migrating when the harness changes, and any agent, editor, `grep` or `git` can read all of it. The thing being optimised is not capability, it's how cheap the system is to keep true, because that's what decides whether it survives a real week of work. The failure mode is never "we lack a memory database". It's "nobody updates the notes".

**The core stays plain text, no binaries, no install step.** Notes, plans, and scripts that ship in this layer run in a runtime the machine already has, and degrade to a written spec a human can follow where even that is missing, so they work on a locked corporate machine with no install request or security scan first. Apps are allowed on top of that, graphify is one, but they're opt-in, not required, and swappable: pick a different tool tomorrow and the context underneath doesn't move. Dotfile managers specifically are rejected, not because they're apps, but because they'd own the core layer itself ([decision 009](./_architecture/plans/decisions/009-no-binary-dependencies.md)).

This fits best when you are **not** working under a repo-level agreed system: solo work, a repo you don't own, a team that hasn't converged. Where a team has real shared infrastructure, use theirs.

### Four layers, and what's tracked

The whole public/private split comes from one rule: the **`_jookoi-` prefix**. No prefix means committed. `_jookoi-` means globally gitignored (`~/.gitignore: _jookoi-*`) and mirrored to a private vault instead. Both live side by side in the same folder, so a shared base file can carry a private layer beside it. No negation rules, no per-repo setup, and the default fails safe. Forget to configure something and nothing leaks. Worst case a note doesn't get committed.

| Layer | Lives at | Tracked | Travels |
|---|---|---|---|
| Personal / global | `~/.agents/` (`AGENTS.md`, `skills/`, `prompts/`) | in this repo, as `my-global-setup/` | every repo, every machine, work and home |
| Repo, shared | `AGENTS.md`, `_architecture/`, feature-level `CONTEXT.md` | yes, in that repo | with the repo |
| Repo, private | `_jookoi-architecture/`, `_jookoi-CONTEXT.md` | never | to the vault |
| Vault | a separate repo, one per environment | yes, in the vault | nowhere |

That third row is the reason the prefix exists. Work repos, client repos and anything you don't own still need notes, and those notes still need to survive a fresh clone. Same mechanism covers the other case: thinking, doubts, known flaws and security observations that shouldn't sit in a public history.

### The vault, and the multi-repo problem

The vault is a separate git repo holding everything the prefix marks private, in two halves: `repo-mirrors/<repo-name>/` preserving real relative paths, and `notes/` for material that was never about code (projects, research, learning, people). Sync is manual and bidirectional. Push is additive, because a stale branch must never delete content written from a newer checkout. Pull writes only into folders that already exist locally, which is what stops dead structure being resurrected. Conflicts produce a report, never a silent overwrite.

Repo identity is the **leaf folder name**. Checkouts live under themed grouping folders (`repos/serenity/<repo>`, `repos/nostromo/<repo>`) that vary, but the repo folder name doesn't, so parallel checkouts of the same repo agree on their vault location for free. Sync verifies rather than derives, comparing `git remote get-url origin` against what the mirror recorded on first sync and stopping on mismatch.

**One vault per environment, and they never touch.** Home has one. Each employer has its own. No shared remote, no sync between them, no path for a note to cross. That makes hosting a non-question: each vault gets whatever remote its own environment permits, and work observations physically cannot reach a personal remote because they live in a different repo entirely. A new employer is a clean start by construction. The accepted cost is that a genuinely portable personal note written at work has to be carried across by hand, which is the correct friction.

**The only thing that crosses environments is this repo.** It carries the mechanism and no content. Setting up anywhere is the same three steps: clone the stack, copy the bundles, create an empty vault beside it.

### What the stack actually asserts

The picks that shape everything else, most of them habits rather than tooling:

- **Sessions stay short.** Instruction adherence decays measurably as a session grows. One coherent unit of work, then clear. Fresh context is the primary compliance mechanism and it costs nothing.
- **Ask, don't tell.** Never state a conclusion before requesting review. Stating certainty raises sycophancy, and phrasing beats any system-prompt instruction at suppressing it.
- **Load-bearing rules must be re-injected, not merely present.** Compaction silently drops standing instructions, so anything that must hold lives where it gets re-injected from disk or is pushed back in by a hook. This is what `current-state.md`'s standing summary and the end-of-turn flush gate are for.
- **Compiler and tests are the only oracle.** Model prose is uncorrelated with correctness, and a model endorses a large share of its own drift. Iteration capped at two, because past that it's noise. Static analysis stays for style, not correctness.
- **Consensus is not evidence.** Multiple agents agreeing is correlated error. A cold reader from a distant model family is worth more than any number of self-critique passes.
- **No new dependency without a registry check.** Package hallucination is model-agnostic and asking a second model does not help, because the same names get invented by all of them.
- **Never bulk-generate context.** A `CONTEXT.md` earns its place the first time real work happens in that folder. Mass-produced context is the unmaintained bucket this whole design exists to avoid, and it's mostly wrong on arrival.
- **Don't build a framework to fix a generated-file problem.** Where a gap is annoying but bounded, budget the annoyance.

The connective tissue holding it together is `jookoi-paper-trail`: fixed file names, fixed places, one entry grammar, and a small skill doing the bookkeeping so nobody has to remember it. That's the red string. `jookoi-paper-trail.md` is the map.

## Where to find things

**Learning and research**

| | |
|---|---|
| [`ai-tooling-crash-course-for-developers/README.md`](./ai-tooling-crash-course-for-developers/README.md) | Start here. The reading path. |
| [`topic-index.md`](./ai-tooling-crash-course-for-developers/topic-index.md) | The map: every topic, marked known / new / disagree / wants-deeper. Drives everything else. |
| [`topics/`](./ai-tooling-crash-course-for-developers/topics/) | 16 deep-dive docs, one per researched topic. |
| [`TODO.md`](./ai-tooling-crash-course-for-developers/TODO.md) | Subtopics identified but not yet written. |

**Curated lists**

| | |
|---|---|
| [`_ai-tooling-recommendations.md`](./ai-tooling-crash-course-for-developers/_ai-tooling-recommendations.md) | What to actually use: repos, products, protocols. Evidence bar enforced. |
| [`_inspiration-and-staying-current.md`](./ai-tooling-crash-course-for-developers/_inspiration-and-staying-current.md) | Who and where to follow: newsletters, named practitioners, communities. |
| [`EXPLORE.md`](./EXPLORE.md) | Unresearched pointers. Not a queue, not a commitment. Promoted to `topic-index.md` when something earns a real pass. |

**Opinions, clearly labelled as such**

| | |
|---|---|
| [`personal-guidelines/developer-stack-tailoring.md`](./personal-guidelines/developer-stack-tailoring.md) | Personal takes on building out a stack, including the corporate-locked-PC constraints. |
| [`personal-guidelines/prompting-and-instructions.md`](./personal-guidelines/prompting-and-instructions.md) | Personal takes on writing instructions for agents. Feeds picks elsewhere in the repo. |

These are separate from the researched content on purpose. Everything in `personal-guidelines/` is opinion, not consensus, and it's kept out of the docs that claim to be verified.

**Copy-out bundles**

| | |
|---|---|
| [`my-global-setup/`](./my-global-setup/) | Goes to `~/.agents/`. Global `AGENTS.md`, the gitignore snippet, and the skills meant to ship anywhere (`jookoi-doc`, `find-docs`, `jookoi-casual-writer`). |
| [`my-repo-setup/`](./my-repo-setup/) | Goes to a new repo's root. Seed-template `AGENTS.md` with bracketed slots to fill. |
| [`utility-scripts/`](./utility-scripts/) | Build tooling for *this* repo only: `vault-sync.js`, graphify config, repo-local hooks. Not shipped. |
| [`prompts/`](./prompts/) | Reusable ad-hoc prompts. Barely started. |

There are three `AGENTS.md` instances and they're never conflated: the global one (`~/.agents/AGENTS.md`, tracked copy in `my-global-setup/.agents/`), this repo's own root [`AGENTS.md`](./AGENTS.md) which is rules for developing this repo and is not shippable, and the seed template in `my-repo-setup/`. Root [`CLAUDE.md`](./CLAUDE.md) is one line importing `AGENTS.md`, because Claude Code doesn't read `AGENTS.md` natively ([decision 007](./_architecture/plans/decisions/007-agents-md-claude-code-bridge.md)).

**The convention**

| | |
|---|---|
| [`jookoi-paper-trail.md`](./jookoi-paper-trail.md) | What it is: privacy switch, folder layout, pipeline, behaviour rules, tooling. Read this one. |
| [`_architecture/plans/2026-08-30-jookoi-paper-trail.md`](./_architecture/plans/2026-08-30-jookoi-paper-trail.md) | Why it's shaped that way, the prior art it was checked against, and where the build diverged from the design. |
| [`my-global-setup/.agents/skills/jookoi-doc/`](./my-global-setup/.agents/skills/jookoi-doc/) | The skill that maintains it. |

**This repo's own paper trail**

`_architecture/` is metaspace. It's about building and evolving this repo, not distributable content.

| | |
|---|---|
| [`architecture.md`](./_architecture/architecture.md) | Why the repo is shaped this way, and the evidence bar. Static. |
| [`current-state.md`](./_architecture/current-state.md) | Where things actually stand. Read first on a cold start. |
| [`next-steps.md`](./_architecture/next-steps.md) | Sequenced forward plan. |
| [`backlog.md`](./_architecture/backlog.md) | Logged, not yet scoped. |
| [`plans/decisions/`](./_architecture/plans/decisions/) | Numbered decision records. What was picked, what was rejected, why. |
| [`plans/`](./_architecture/plans/) | One file per planning session, kept permanently. |
| [`progress.md`](./_architecture/progress.md) and [`archive/`](./_architecture/archive/) | Finished sessions and roll-off. Written only by `jookoi-doc`, never by hand. |

`_jookoi-architecture/` is the gitignored private counterpart. If you're reading this on GitHub, it isn't there, which is the point of the `_jookoi-` prefix.

## Status

Baseline survey and deep-dive research are done. The crash course was restructured 2026-08-30 ([decision 002](./_architecture/plans/decisions/002-crash-course-naming.md)). `jookoi-paper-trail` is designed, built and running on this repo itself.

Live status always lives in `_architecture/current-state.md` and `next-steps.md`, not here.
