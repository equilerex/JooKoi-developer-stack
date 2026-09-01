# JooKoi graphify setup — portable bundle

Applies this repo's opinionated graphify config to any other repo. Graphify itself is a third-party tool (`Graphify-Labs/graphify`); this bundle is just the personal setup layered on top of it — what to ignore, where output lives, and the commit-allowed vs. private split.

## Files

- **`graphifyignore-template`** — drop-in `.graphifyignore` for the target repo.
- **`package-scripts-snippet.json`** — the `gr`/`gr:c`/`gr:i`/`gr:query`/`gr:tree` scripts and `cross-env` devDependency to merge into the target repo's `package.json`. Merge by hand — this bundle never edits another repo's `package.json` for you.
- **`setup.sh`** — copies the ignore file into the target repo and prints the remaining manual steps.

## Apply to a new repo

```bash
bash /path/to/JooKoi-developer-stack/utility-scripts/jookoi-graphify-setup/setup.sh
```

Run from the target repo's root. It writes `.graphifyignore` (refuses to overwrite an existing one) and prints the manual `package.json`/`npm install`/`npm run gr:i` steps.

## The core rule: `_architecture/graphify/` vs `_jookoi-architecture/graphify/`

Graphify's extraction output is expensive to regenerate (LLM extraction, not just a rebuildable artifact) — treat it as source, not `_generated/`. Where it lives depends on the repo:

- **Repo where committing graph output is fine** (this repo, most personal/solo repos): output goes to `_architecture/graphify/`, tracked in git normally. `.graphifyignore` still excludes graphify's own output folder from being re-ingested into itself, and excludes `_jookoi-*` so no private notes are ever pulled into a graph that might get shared or committed.
- **Corporate/client/restricted repo, or any repo where committing personal tooling output isn't allowed**: point `--out` at `_jookoi-architecture/graphify/` instead. That prefix is globally gitignored (`_jookoi-*` in `~/.gitignore`, set up per `my-global-setup/README.md`) — the output exists locally, never gets committed, and mirrors to the personal vault repo like any other `_jookoi-` content. Same graphify CLI, same scripts — only the `--out` path and `.graphifyignore` need adjusting for the restricted case, since gitignore already keeps `_jookoi-*` out of the ignore file's own concern.

Either way, `.graphifyignore` always keeps `_jookoi-*` excluded — this is the one line that must never be dropped when adapting the template, because it's what stops private notes from being ingested into a graph that isn't itself private.

## Why the ignore pattern looks like this

```
node_modules/
_generated/
_architecture/graphify/
_jookoi-*
.git/
.env
*.lock
```

- `_architecture/graphify/` — don't re-ingest graphify's own prior output when re-running extraction.
- `_generated/` — this repo's convention for disposable/rebuildable output; graphify output is explicitly NOT this (see above), which is why it gets its own line instead of being covered by this one.
- `_jookoi-*` — the private-file marker (see `_architecture/plans/2026-08-30-jookoi-paper-trail.md` in this repo). Never ingest private notes into a graph.
- `.env`, `*.lock`, `node_modules/`, `.git/` — standard noise/secret exclusions, not JooKoi-specific.

If the target repo has its own `_generated/`-equivalent convention under a different name, adapt that line; the `_jookoi-*` and `_architecture/graphify/` lines should be copied verbatim.
