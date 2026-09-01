# jookoi-paper-trail

A convention for keeping AI coding agents oriented, using nothing but markdown files in the repo.

Not a product, not a framework, not a database. It's a filing discipline: fixed file names, fixed places, a fixed grammar for entries, and a small skill that does the bookkeeping so nobody has to remember it.

- What it is: this file.
- Why it's shaped this way, and what prior art it was checked against: `_architecture/plans/2026-08-30-jookoi-paper-trail.md`.
- The tool that maintains it: `my-global-setup/.agents/skills/jookoi-doc/`.

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
├── architecture.md      why the repo is shaped this way. Static.
├── next-steps.md        forward-looking only, sequenced.
├── current-state.md     the live session: standing summary + session log.
├── progress.md          accumulated finished sessions. Line-capped.
├── backlog.md           logged, not yet scoped.
├── plans/
│   ├── YYYY-MM-DD-topic.md      one file per planning session, kept.
│   └── decisions/NNN-slug.md    one call each, with reasoning. Kept.
└── archive/
    ├── index.md         readable: what each file covers, date range.
    └── YYYY-MM.md       roll-off. Read on explicit request only.
```

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

The three logs are three time horizons, not three content types.

```
  during session          at session end          when progress hits cap
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ current-state.md │───▶│   progress.md    │───▶│  archive/YYYY-MM │
│  · standing      │    │  one entry per   │    │  oldest entries  │
│    summary       │    │  session,        │    │  roll off whole  │
│    (rewritten)   │    │  newest first,   │    │                  │
│  · session log   │    │  capped ~200     │    │  index.md gains  │
│    (emptied)     │    │                  │    │  a pointer       │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │
         └── unfinished / newly surfaced ──▶ next-steps.md  (sequenced)
                                          └▶ backlog.md     (unscoped)
```

Content moves on a schedule, never on a judgement about what kind of thing it is. That's the whole point. Routing-by-judgement is what produced near-duplicate files the first time around.

`current-state.md` holds two blocks that behave differently. The standing summary gets rewritten in place at every flush and is never appended to. It's what a cold session reads first, and rewriting is what keeps it short and true. The session log is the append target during the session, and it survives compaction, which is the only reason the file exists separately.

All three stages share one entry grammar: `## YYYY-MM-DD — Title`, newest first. That's load-bearing. It makes flush and rotate verbatim block moves instead of rewrites, so a script can do them with no model call and no reformatting risk.

`progress.md` and `archive/` are never written by hand. They're outputs of `flush` and `rotate`.

### 4. The behaviour rules

Stated once in the global `AGENTS.md`, restated per-repo:

1. Read when stuck, not always. Consult the nearest context file when entering unfamiliar territory, not on every operation.
2. Update on invalidation. After a change that makes a context file wrong, correct it *before* continuing the original task.
3. Delete with the code. Removing a folder removes its `CONTEXT.md`.
4. Never bulk-generate. A `CONTEXT.md` earns its place the first time real work happens in that folder. Mass-produced context is the unmaintained bucket this avoids, and it's mostly wrong on arrival.
5. Never read `archive/` unless history is explicitly requested. `index.md` alone tells you whether asking is worthwhile.

The negative test matters as much as the sections: no restating what the code plainly shows, no API documentation, no changelog, no general framework knowledge. If removing a line wouldn't slow a newcomer down, it doesn't belong.

When context contradicts the code, the code wins, and the context gets corrected at the point of noticing. A wrong context file is worse than no file, because an agent trusts it.

### 5. The tooling

Two scripts and one skill. All optional in principle, since the convention is readable and writable by hand.

`jookoi-doc` is the skill (`my-global-setup/.agents/skills/jookoi-doc/`). It splits the labour along one line:

- The script owns bookkeeping: dating, heading grammar, newest-first insertion, duplicate detection, the line cap, roll-off, archive-index pointers, `NNN` allocation, `updated:` bumping, template instantiation.
- The model owns judgement: what happened, where it belongs, and the standing-summary rewrite.

That split came out of evidence. Every defect found in the first months of dogfooding was a bookkeeping defect, and bookkeeping across sessions is exactly what an LLM does badly.

Commands: `note`, `add`, `flush`, `rotate`, `status`, `stale`, `new-decision`, `new-plan`. The script refuses rather than guesses when a file doesn't match its expected shape, and it never reformats content it didn't write.

Hooks ship for Claude Code, Gemini CLI and GitHub Copilot CLI. The useful one is the end-of-turn gate: it blocks the turn ending when the tree is dirty *and* the session log is unflushed, injecting an instruction to flush. Flushing clears the condition, so it never fires twice. Session-end and pre-compaction events can only write to disk, not inject, so they keep the job they can actually do.

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
2. Copy `my-global-setup/.agents/` to `~/.agents/` for the global ruleset and the `jookoi-doc` skill.
3. In a new repo, start from `my-repo-setup/AGENTS.md` and create `_architecture/` with the file set above.
4. Register the end-of-turn hook from `jookoi-doc/hooks/config/` for your harness.
5. Optionally, create an empty vault repo beside your checkouts and run `vault-sync.js`.

Every step is a copy. There's deliberately no setup script, because generated config is hard to browse, visualise and modify, which is the opposite of what this whole thing optimises for.

---

## What it is not

- Not a memory system. Markdown files don't query, don't hold relationships, and don't enforce a schema. That critique is correct and accepted. The answer is to stay a small curated set rather than grow into a database. If it ever needs to be queryable, that's a different tool, not a bigger folder.
- Not automatic. Nothing crawls, indexes or generates in bulk.
- Not a team standard. It's a personal discipline that happens to be readable by anyone who opens the repo.
- Not the implementation plan. That's `_architecture/plans/2026-08-30-jookoi-paper-trail.md`, which carries the reasoning, the prior-art survey, and the record of where the build diverged from the design.
