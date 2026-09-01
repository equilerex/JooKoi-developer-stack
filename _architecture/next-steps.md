# Next steps
<!-- Forward-looking only; jookoi-doc owns the mechanics. See AGENTS.md. -->

## Now

1. **Commit the canonicalisation and the rename** — one pass rewrote most of `_architecture/` plus all seven decision records; a second renamed the convention to `jookoi-paper-trail` across ~20 files and added the root concept doc. Since then, the `my-global-setup/` settings-portability fix and `jookoi-doc` verification pass are also uncommitted. None of it is committed. Review before the next session builds on top of it.
2. **Cold-route ten real notes through the tree** — the one piece of `jookoi-doc` verification still outstanding: exercise the routing table (CONTEXT.md / decision / plan / architecture / next-steps / backlog / session-log note) against real, not fixture, content.

## Then

3. **Stack-distribution open questions** — `_architecture/stack-distribution.md`: skill-sync mechanism, root-`AGENTS.md` collision risk between this repo's own instance and a target project's. Routes to cowork for research per the workflow note in `AGENTS.md`.
4. **Re-run `gr`** (now `claude` backend, no Ollama dependency) to regenerate the graph over the post-migration repo state — old `_architecture/graphify/` output predates the `_jookoi-architecture/` move, the root-folder relocations, and the `jookoi-paper-trail` rename (its cache still carries the old name). User-run only (expensive/long-running).
5. **`personal-ai-dev-stack-blueprint_.md`** (now `_jookoi-architecture/followup/personal-ai-dev-stack-blueprint_.md`) has real content worth keeping — likely feeds a crash-course topic or `architecture.md` later. Revisit for incorporation once there's a slot for it.

## Backlog-adjacent, not sequenced yet

See `backlog.md` for items with no assigned order yet: reusable-prompts research gap, hooks/dotfiles deep-dive doc, crash-course structure reorg, 101 overview, session/token-economics topic, `JooKoi-commit-message` skill (explicitly not started), guardrails-for-common-phrases idea, repo-flavour `AGENTS.md` instances, paste sanitizers, graphify vault-mirror pattern for no-commit repos (designed, not built — not needed here since commit is allowed).
