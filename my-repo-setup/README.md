# my-repo-setup

Literal starter tree for a brand-new repo, not a generator script. Copy what's needed by hand.

## Layout

```
my-repo-setup/
├── AGENTS.md              starter template — fill in and drop at the new repo's root
├── .agents/
│   └── skills/            repo-scoped skills, empty until the repo earns one
└── _architecture/         jookoi-paper-trail context-file templates (optional)
    ├── current-state.md   live session state
    ├── architecture.md    why the repo is shaped this way
    ├── progress.md        finished sessions (auto-managed)
    ├── next-steps.md      sequenced forward plan
    ├── backlog.md         logged, not-yet-scoped items
    ├── archive/
    │   └── index.md       pointer to archived sessions (auto-managed)
    ├── plans/
    │   └── decisions/     numbered decision records
    └── graphify/          if using graphify knowledge-graph tool

## To apply to a new repo

1. Copy `AGENTS.md` to the new repo's root, fill in the bracketed sections, delete the guidance comments.
2. Copy `.agents/` alongside it if the repo will have its own skills; otherwise skip it until it does.
3. **Optional:** Copy `_architecture/` if the repo will use jookoi-paper-trail for session/project documentation. See `jookoi-paper-trail.md` in the parent repo for details. Otherwise skip it.

No script — a new repo's needs vary enough that a copy-and-edit pass by hand is more honest than templating it.
