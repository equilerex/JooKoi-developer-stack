# my-repo-setup

Everything concerning a *repo other than this one* — whether it gets copied into that repo or run against it from here. Two groups, and the distinction matters when applying any of it:

- **Starter tree** (`AGENTS.md`, `.agents/`, `_architecture/`) — literal files, copied into the new repo by hand.
- **`setup-scripts/`** — tooling that stays here and runs against a target repo. Never copied in.

## Layout

```
my-repo-setup/
├── AGENTS.md              starter template — fill in and drop at the new repo's root
├── .agents/
│   └── skills/            repo-scoped skills, empty until the repo earns one
├── _architecture/         jookoi-paper-trail context-file templates (optional)
│   ├── TODO.md            Context header (items live in items.json)
│   ├── ARCHITECTURE.md    why the repo is shaped this way
│   ├── (items.json)       working-set store, created by the script on first add
│   ├── plans/
│   │   └── decisions/     numbered decision records
│   └── graphify/          knowledge-graph output — see setup-scripts/jookoi-graphify-setup/
├── webstorm-inspections/  WebStorm inspection profile, copied into <repo>/.idea/inspectionProfiles/
└── setup-scripts/         run in place against a target repo — do NOT copy these in
    └── jookoi-graphify-setup/   applies the opinionated graphify config to another repo
```

## To apply to a new repo

1. Copy `AGENTS.md` to the new repo's root, fill in the bracketed sections, delete the guidance comments.
2. Copy `.agents/` alongside it if the repo will have its own skills; otherwise skip it until it does.
3. **Optional:** Copy `_architecture/` if the repo will use jookoi-paper-trail for session/project documentation. See `jookoi-paper-trail.md` in the parent repo for details. Otherwise skip it.
4. **Optional:** For graphify, `cd` to the new repo and run `setup-scripts/jookoi-graphify-setup/setup.sh` from there. Read that folder's `README.md` first — the tracked vs. private output decision is per-repo.

No generator script for the starter tree — a new repo's needs vary enough that a copy-and-edit pass by hand is more honest than templating it. `setup-scripts/` is the exception, and only where the work is genuinely mechanical.
