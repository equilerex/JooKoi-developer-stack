# jookoi-paper-trail

A convention for keeping AI coding agents oriented, using nothing but plain files in the repo.

Not a product, not a framework, not a database. It's a filing discipline: fixed file names, fixed places, one home per kind of information, and a small skill that does the bookkeeping so nobody has to remember it.

- What it is: this file.
- Why it's shaped this way, and what prior art it was checked against: `_architecture/plans/2026-08-30-jookoi-paper-trail.md`.
- The tool that maintains it: `my-global-setup/.agents/skills/jookoi-paper-trail/`.

---

## The thesis

Most "agent memory" products solve for scale: more storage, more recall, more automation. For one developer that's the wrong end of the problem.

The failure mode is never "we lack a memory database". It's "nobody updates the notes".

So the thing being optimised is how cheap the system is to keep true, because that's what decides whether it survives a real week of work. Plain files, greppable, diffable, small enough that correcting one takes thirty seconds instead of becoming a chore you postpone.

Four properties, in priority order:

- Future-proof. Plain files outlive vendors. Nothing to migrate when the harness changes.
- Agnostic. No tool owns it. Any agent, any editor, grep, git.
- Readable by humans and LLMs alike. One artifact serves both, with no export step and no viewer.
- Copyable. Moving it is `cp -r`. Backing it up is rsync. That's the whole operation.

It fits best when you are not working under a repo-level agreed system: solo work, a repo you don't own, a team that hasn't converged on anything. If your team already has real shared infrastructure, use theirs. If there isn't one, a folder beats adopting something heavier that only you use.

What's deliberately absent: automatic crawling, indexing, bulk generation. Coverage grows with attention, because that's the only coverage worth having.

---

## The five parts

Five separable things. You can adopt some without the others.

### 1. The privacy switch

One rule generates the whole public/private split: the `_jookoi-` prefix.

| Name | Git | Vault | Purpose |
|---|---|---|---|
| No prefix (`CONTEXT.md`, `_architecture/`, `AGENTS.md`) | committed | not synced | shared with the team |
| `_jookoi-` prefix (`_jookoi-CONTEXT.md`, `_jookoi-architecture/`) | gitignored globally (`~/.gitignore: _jookoi-*`) | synced to the personal vault | private |

Both live in the same folder: a committed base file with a private layer beside it. No negation rules, no per-repo setup. The default fails safe, so forgetting to configure something leaks nothing. Worst case a note doesn't get committed.

That's what makes this usable in repos you don't own, and what keeps half-formed reasoning, doubts and security observations out of a public history.

### 2. The folder layout

Fixed names, so any agent finds them without being told where to look.

Project level is `_architecture/` at the repo root (or `_jookoi-architecture/` for the private one):

```
_architecture/
├── ARCHITECTURE.md      why the repo is shaped this way. Static.
├── items.yaml           the live working set: now, parked, and unflushed done or dropped items.
├── plans/
│   ├── YYYY-MM-DD-topic.md      one file per planning session, kept. Finished ones move to implemented/.
│   └── decision-history/        background on why rules exist, one call each. Not read by default.
│       ├── index.md             one line per decision.
│       └── NNN-slug.md
└── archive/
    └── items-YYYY-MM.yaml       flushed items, one file per month. Lookup only.
```

Each kind of information has one home:

| Information | Home |
|---|---|
| Work item (now, parked, done, dropped) | `items.yaml`, written only by the script |
| A call made inside a planning session | that plan |
| A call made outside a planning session | `plans/decision-history/` |
| Durable facts about the repo | `ARCHITECTURE.md` |
| Rules agents follow every session | the repo's `AGENTS.md` |
| Folder-local context | `CONTEXT.md` |

Feature level is `CONTEXT.md` (or `_jookoi-CONTEXT.md`) sitting beside the code it describes, at feature-area granularity. Four fixed sections plus an `updated:` date:

```markdown
# CONTEXT — profile-card
updated: 2026-08-30

## What this is        scope, one or two lines
## Why it's built this way   decisions that don't self-explain
## Gotchas             glitches, footguns, surprises
## Don't               tried and rejected
```

Its lifecycle is the code's lifecycle: created alongside it, corrected when a change invalidates it, deleted with the folder.

Plans live in the repo, not in harness session storage. A plan held in a proprietary session store can't be reviewed by hand, can't be picked up by a different agent, and is gone when the session runs out of tokens, which is exactly the moment it matters most.

### 3. The pipeline

One stage, on model judgement, not a schedule.

```
   loaded into every session                     lookup only
┌──────────────────────────┐                ┌──────────────────────────┐
│        items.yaml         │ ──── flush ──▶ │ archive/items-YYYY-MM.yaml│
│  now · parked · done ·    │  done + dropped│  one file per month       │
│  dropped (not yet flushed)│  items only    │  of ts_done               │
└──────────────────────────┘                └──────────────────────────┘
```

An item is a title plus a free-form markdown body, so the store works as a scratchpad and not only a task list. Items are written only through the script, by ID. IDs are short random strings with no counter, so parallel repos and branches never collide. Every mention of an item to a person is `id title`, never a bare ID.

Flush moves `done` and `dropped` items out of `items.yaml` and leaves `now` and `parked` alone. It triggers on model judgement only, at a stable point after which older items are unlikely to matter next session, never per-session and never because a hook demanded it. Flushed items stay reachable: `find`, `show <id>` and `list --archived --last N` read them, bounded and newest first. `archive/` is never written by hand.

### 4. The behaviour rules

Stated once in the global `AGENTS.md`, restated per-repo:

1. Read when stuck, not always. Consult the nearest context file when entering unfamiliar territory, not on every operation.
2. Update on invalidation. After a change that makes a context file wrong, correct it *before* continuing the original task.
3. Delete with the code. Removing a folder removes its `CONTEXT.md`.
4. Never bulk-generate. A `CONTEXT.md` earns its place the first time real work happens in that folder. Mass-produced context is the unmaintained bucket this avoids, and it's mostly wrong on arrival.
5. Never read `archive/` or `plans/decision-history/` unless history is explicitly requested or a doc cites it. A decision explains why a rule exists. It is not the rule.

The negative test matters as much as the sections: no restating what the code plainly shows, no API documentation, no changelog, no general framework knowledge. If removing a line wouldn't slow a newcomer down, it doesn't belong.

When context contradicts the code, the code wins, and the context gets corrected at the point of noticing. A wrong context file is worse than no file, because an agent trusts it.

### 5. The tooling

Two scripts and one skill. All optional in principle, since the convention is readable and writable by hand.

`jookoi-paper-trail` is the skill (`my-global-setup/.agents/skills/jookoi-paper-trail/`). It splits the labour along one line:

- The script owns bookkeeping: IDs, dating, priorities, roll-off to the archive, `NNN` allocation and the decision index, `updated:` checks, template instantiation.
- The model owns judgement: what happened, where it belongs, and when to flush.

That split came out of evidence. Every defect found in the first months of dogfooding was a bookkeeping defect, and bookkeeping across sessions is exactly what an LLM does badly.

Commands: `list`, `find`, `show`, `add`, `done`, `park`, `start`, `drop`, `edit`, `move`, `flush`, `stale`, `check`, `new-decision`, `new-plan`. The script refuses rather than guesses when a file doesn't match its expected shape, and it never reformats content it didn't write.

Hooks ship for Claude Code, Gemini CLI and GitHub Copilot CLI. The useful one is the end-of-turn gate, and it no longer asks for a flush: it blocks the turn ending when the tree is dirty *and* `items.yaml` hasn't been touched this session, injecting a reminder to update it. Touching `items.yaml` clears the condition, so it never fires twice. Flush stays entirely the model's call. Session-end and pre-compaction events can only write to disk, not inject, so they keep the job they can actually do.

`vault-sync.js` mirrors `_jookoi-` files into a personal vault repo, manual invocation only. Push is additive, because a stale branch must never delete content written from a newer one. Pull writes only into folders that already exist. Conflicts produce a report, never a silent overwrite.

---

## The vault

A separate repo holding whatever the prefix marks private:

```
vault/
├── repo-mirrors/<repo-name>/     real relative paths preserved
└── notes/  projects/ experiments/ research/ learning/ people/ utils/
```

Repo identity is the leaf folder name, so parallel checkouts of the same repo agree for free. Sync verifies rather than derives: it compares `git remote get-url origin` against what the mirror recorded on first sync and stops on mismatch.

One vault per environment, and they never touch. Home has one, each employer has its own. No shared remote, no path between them. That makes hosting a non-question, since each vault gets whatever remote its environment permits, and work observations physically cannot reach a personal remote because they live in a different repo. A new employer is a clean start by construction.

The accepted cost: a genuinely portable personal note written at work has to be moved by hand. That's the correct friction.

The only thing that crosses environments is this repo, which carries the mechanism and no content.

---

## Adopting it

1. Add `_jookoi-*` to your global gitignore (`git config --global core.excludesFile`).
2. Copy `my-global-setup/.agents/` to `~/.agents/` for the global ruleset and the `jookoi-paper-trail` skill.
3. In a new repo, start from `my-repo-setup/AGENTS.md` and create `_architecture/` with the file set above.
4. Register the end-of-turn hook from `jookoi-paper-trail/hooks/config/` for your harness.
5. Optionally, create an empty vault repo beside your checkouts and run `vault-sync.js`.

Every step is a copy. There's deliberately no setup script, because generated config is hard to browse, visualise and modify, which is the opposite of what this whole thing optimises for.

---

## What it is not

- Not a memory system. Markdown files don't query, don't hold relationships, and don't enforce a schema. That critique is correct and accepted. The answer is to stay a small curated set rather than grow into a database. If it ever needs to be queryable, that's a different tool, not a bigger folder.
- Not automatic. Nothing crawls, indexes or generates in bulk.
- Not a team standard. It's a personal discipline that happens to be readable by anyone who opens the repo.
- Not the implementation plan. That's `_architecture/plans/2026-08-30-jookoi-paper-trail.md`, which carries the reasoning, the prior-art survey, and the record of where the build diverged from the design.
