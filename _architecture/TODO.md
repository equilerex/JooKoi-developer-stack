# TODO
<!-- Context header only, rewritten wholesale when stale. Items live in items.json, owned by `jookoi-paper-trail`. See AGENTS.md. -->

## Context

`jookoi-paper-trail` is built, verified and live. Its working set is a keyed store, `_architecture/items.json`, written only through the script (`list` at session start, `add`/`done`/`park`/`start`/`drop`/`edit`/`move`, `flush`); `BACKLOG.md` is gone, backlog items are `parked`. `~/.claude/skills/*` are junctions onto `~/.agents/skills/*`, and this repo's `my-global-setup/.agents/skills/` is the source that gets copied out — that junction farm is the whole skill-distribution mechanism, nothing else needed. Routing gets exercised in normal use rather than by a test pass.

The working set is what closes the gap between `ARCHITECTURE.md`'s claims and the repo as it stands (decision 013): the empty `prompts/` pillar, the unstated composition rule between the three `AGENTS.md` instances, and the last graphify items. Crash-course content work is deliberately not in it — that's a separate phase, not repo finalization.

Two separate graphify mechanisms exist and do not share a config. The `/graphify` skill writes to `graphify-out/` relative to cwd and ignores `--out`; the npm `gr*` scripts pass `--out _architecture/graphify`. Any reasoning about graphify output paths has to say which one it means.

`my-repo-setup/` holds anything concerning another repo, scripts included (decision 011); `utility-scripts/` is tooling for this repo only.

Web research routes to cowork, not inline. The user picks commit points; nothing here waits on one.
