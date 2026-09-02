# TODO
<!-- Live working set. `jookoi-paper-trail flush` archives it and resets it. See AGENTS.md. -->

## Context

`jookoi-paper-trail` is built, verified and live. `~/.claude/skills/*` are junctions onto `~/.agents/skills/*`, and this repo's `my-global-setup/.agents/skills/` is the source that gets copied out — that junction farm is the whole skill-distribution mechanism, nothing else needed. Routing gets exercised in normal use rather than by a test pass.

The working set is what closes the gap between `ARCHITECTURE.md`'s claims and the repo as it stands (decision 013): the empty `prompts/` pillar, the unstated composition rule between the three `AGENTS.md` instances, and the last graphify items. Crash-course content work is deliberately not in it — that's a separate phase, not repo finalization.

Two separate graphify mechanisms exist and do not share a config. The `/graphify` skill writes to `graphify-out/` relative to cwd and ignores `--out`; the npm `gr*` scripts pass `--out _architecture/graphify`. Any reasoning about graphify output paths has to say which one it means.

`my-repo-setup/` holds anything concerning another repo, scripts included (decision 011); `utility-scripts/` is tooling for this repo only.

Web research routes to cowork, not inline. The user picks commit points; nothing here waits on one.

## Checklist

- [x] Root `graphify-out/` explained — it is the `/graphify` *skill's* output, not a script misconfiguration. The skill hardcodes `graphify-out/` relative to cwd and ignores `--out` entirely (`~/.claude/skills/graphify/SKILL.md:53`, `:288`); `.graphify_root` holds `.`, so it came from a run at repo root. Already gitignored at `.gitignore:7` — the earlier "un-gitignored" claim here was wrong
- [x] Output-location call settled (decision 012) — LLM output is source, so it lives in the tracked dir; converge by running the skill from inside it (`cd _architecture/graphify && /graphify ../..`). Several repos get one designated main instance hosting the graph, documented in the bundle README, no tooling built
- [x] Stray root `graphify-out/` deleted and regenerated into the tracked dir via `npm run gr:c` + `graphify cluster-only _architecture/graphify`. `.gitignore` now also excludes the skill's machine-local `.graphify_python`/`.graphify_root`, and `.graphifyignore` excludes `package-scripts-snippet.json` (its `cross_env` node was colliding with `package.json`'s and being dropped)
- [ ] Name the graph communities — all 142 are `Community N` placeholders; `graphify label` found no LLM backend. The pre-delete copy had real names. Re-run `cluster-only --backend <x>`, or run the skill from the tracked dir, whenever an LLM pass is worth it
- [ ] Confirm graphify output is machine-portable — check `graph.json` and `LESSONS.md` for absolute paths using the cheap `--code-only` extraction, not a full LLM run. A hit means the vault-mirror pattern in `BACKLOG.md` needs a path-rewrite step before it can be built
- [ ] Research pass on reusable prompts (cowork), then populate `prompts/` — it holds one file while `ARCHITECTURE.md` names it a shippable pillar. Scope of the gap: prompt vs. skill vs. slash-command, structure of a good reusable prompt, templating/variables, organization as the set grows. `topic-index.md` topic 2 covers skills only
- [ ] Settle how the three `AGENTS.md` instances compose — global, this-repo's-own, seed. Inherit, override, or both. Same question as `stack-distribution.md` open question 2 (root-file collision); answer once, close both. Repo-flavour variants stay gated on a second real flavour existing
- [ ] Add the guardrails section to global `AGENTS.md` — phrasing the model over-reads ("deep research"/"deep dive" taken as academic-grade when an effective multi-source overview is meant), plus guards against looping/spiraling token waste
- [ ] Document when a repo earns a graphify pass — which repos justify the extraction cost and how often to re-run. One paragraph in `my-repo-setup/setup-scripts/jookoi-graphify-setup/README.md`; the bundle covers how and why but not when
- [ ] Design the `_jookoi-architecture/` scaffolding script — the fallback rule (repo with neither `_architecture/` nor `_jookoi-architecture/` at root gets one created before any note is written) is still model judgement in global `AGENTS.md`. Requirements are fixed: non-destructive, `_jookoi-` prefix by default for repos the user doesn't own, explicit opt-out to the unprefixed form, and it must never require editing the target repo's own `AGENTS.md`. Open: the CLI shape, and which of `jookoi-paper-trail`'s remaining judgement steps become mechanical alongside it
