# Stack distribution architecture (topic surfaced later — not in the original 14)

Requirements/open-questions doc for how the shippable layer (`AGENTS.md`, `skills/`, `prompts/`, `utility-scripts/`) should actually be built and distributed. No pick made here — next step is research (cowork), per this project's own "research before adopt" discipline (`_architecture/ARCHITECTURE.md` §"Why curation, not adoption").

## The four jobs this repo does

1. Documentation + personal guidelines → `personal-guidelines/`.
2. 101/crash-course education content (separate reorg, tracked in `_architecture/BACKLOG.md`).
3. The global drop-in stack folder — `AGENTS.md` + `skills/` + `prompts/` + `utility-scripts/` + possible mini web portal. Some utility scripts won't be corporate-safe — flag per-script, don't assume.
4. Possible self-built marketplace/plugin-style distribution mechanism — undecided, wants research before choosing over a plain drop-in folder.

This doc covers jobs 3 and 4.

## Requirements (user's own, recorded close to verbatim)

- Package/dependency-style sync for skills where such a system exists; manual copy-paste + local version control as the fallback for anything it doesn't cover.
- On any given machine: shareable/global content lives in `~/.agents/`; repo-specific content lives in that repo's own `.agents/`.
- `utility-scripts/` exists now (created this pass) with no content yet — placeholder only.
- "Flavor" folders (e.g. Angular/Stencil variants) deferred until a second real flavor exists — same anti-speculative-infrastructure reasoning already applied to deferring `seed/` (`_architecture/ARCHITECTURE.md` §"Repo layout").
- This repo's own root content (used while curating/maintaining this repo) must not be conflated with the *shippable* content meant to be copied elsewhere — risk of name collisions between this repo's own skills and the user's global `~/.agents` skills, and of maintenance-only skills leaking into the shippable stack.

## Decision (2026-08-27) — jobs 3 & 4, resolved ad hoc

Start simple: **plain drop-in folder**, per the user's original proposal. `AGENTS.md` + `skills/` + `prompts/` + `utility-scripts/`, copy/symlink into a project's own `.agents/` or a machine's `~/.agents/`, plain filesystem, no tooling required to consume it.

Resolves open questions 1 and 3 below:

- **Q1 (package-manager-style sync tool)** — Claude Code's own plugin/marketplace system (`.claude-plugin/marketplace.json` + `/plugin install`) is the real, current answer *if* a sync tool is wanted — verified via live docs, not assumed (see chat history 2026-08-27: `marketplace.json`/`plugin.json` schemas, `skills/`/`commands/`/`agents/`/`hooks/` layout, `--scope user|project|local|managed` install scopes, corporate/managed-settings controls). **Not adopted now**: it's Claude-Code-specific, and this repo's stated requirement is agent-harness-agnostic. Plain files stay the base layer regardless of which harness reads them.
- **Q3 (drop-in-folder vs. installer-with-selector)** — drop-in folder wins for now. No install step, no harness lock-in, matches the harness-agnostic requirement directly.

**Revisit condition**: if the personal skill library grows enough to be worth *distributing to others* (not just self-use across machines), reconsider the plugin/marketplace path as an optional Claude-Code-specific packaging layer on top of the plain-file base — not a replacement for it. That's likely a separate project at that point, not a restructure of this repo.

**Revisited (2026-09-05, [decision 014](./plans/decision-history/014-personal-plugin-marketplace-as-optional-extension-layer.md))**: taken, but as a second repo (`jookoi-ai-market`, name provisional), not a folder inside this one. This repo's drop-in-folder distribution (above) stays the answer for baseline, universal, harness-agnostic content. The plugin repo is a separate, optional distribution surface for richer/domain-specific tooling — one broad personal plugin (`jookoi-dev`) to start, not fragmented per-topic plugins. Layering, not replacement: this repo works with no knowledge of the plugin repo existing.

## Decision (2026-09-02) — no collision to solve, Q2 closed

The premise behind Q2 was wrong. Global `AGENTS.md` (`~/.agents/`) and a repo's own root `AGENTS.md` serve different jobs and never share a file — one is machine-level personal behaviour, the other is how to work in this specific repo. The seed template (`my-repo-setup/AGENTS.md`) is read by no agent at all; it is inert content that travels via git and only becomes live once copied into a new repo's root, where it is that repo's own instance. Three instances, three non-overlapping jobs, nothing to inherit or override.

What remains is not a composition question: repo-flavour variants (Angular vs. Stencil) stay gated on a second real flavour existing, per the anti-speculative-infrastructure rule already applied elsewhere.

## Open research questions

Expectations for whoever picks this up (cowork, not inline): identify concrete existing tools/conventions/prior art; verify each is current and actually maintained; compare directly against the requirements above; distinguish viable options from abandoned/unsuitable prior art; produce a small set of realistic architecture options with tradeoffs and remaining unknowns. Not expected to choose the final architecture — just make the eventual decision well-informed.

1. ~~Does a current, maintained package-manager-style tool exist for syncing Claude Code (or cross-tool) skills as dependencies?~~ **Resolved above** — Claude Code plugin/marketplace system exists and works, deliberately not adopted yet (harness-agnostic requirement).
2. ~~Prior art for a repo that both self-maintains and ships copy-out content, without root-instruction-file collision.~~ **Closed above** — the collision does not exist; the three instances have separate jobs and the seed one is not read by any agent.
3. ~~Drop-in-folder vs. an interactive plugin-installer-with-selector.~~ **Resolved above** — drop-in folder.

## Related, not this doc

- Multi-checkout sync + portable ad hoc personal-file convention — split off as its own backlog topic, see `_architecture/BACKLOG.md`.
- Per-feature-area LLM context files — same, see `_architecture/BACKLOG.md`.
