# Sources — Curated, Verified

Reading/watching/following list for staying current on AI-assisted dev tooling. Nothing goes in this file without meeting the evidence bar: named practitioners (with a real, checkable identity — org affiliation, public repo, publication history), current docs, or repo-health signals (stars, forks, active commits, not a one-person abandoned project). New-but-promising is allowed as a labeled exception, but label it.

Empty for now. Populate by working through `raw-inspiration-unverified.md` one entry at a time — verify, then promote here with a one-line note on why it passed the bar. Don't bulk-copy.

## Newsletters

## People to follow

## Repos / awesome-lists

### Design-to-code / browser verification tooling (verified 2026-08-22)

- [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) — official Google org repo. MCP server exposing live Chrome DevTools (DOM/computed styles, viewport emulation, network/console/perf) to coding agents. 49.6k stars, 3.5k forks, pushed within 24h of verification.
- [MengTo/Skills](https://github.com/MengTo/Skills) — portable SKILL.md playbooks for design/layout discipline (spacing, typography, guardrails) in coding agents. 5.2k stars, 633 forks, active.
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — Vercel's structural guidelines/skill trees for web-design and framework conventions (incl. Next.js/RSC patterns). 30.3k stars, 2.7k forks, active.
- [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) — CLI/daemon orchestrating local Chrome/Puppeteer sessions for agents inspecting a running local dev server. 41.1k stars, 2.7k forks, active.
- [BuilderIO/skills](https://github.com/BuilderIO/skills) — visual-to-code mapping skills (`/visual-plan`, `/visual-edit`) connecting a repo to an editable browser layout. 4.1k stars, 204 forks, active.
- [browser-use/browser-use](https://github.com/browser-use/browser-use) — Python library giving LLMs structured browser control (accessibility tree extraction, click/scroll/fill, visual inspection). 110k stars, 12.1k forks, very active — the dominant player in this category by a wide margin.
- [Skyvern-AI/skyvern](https://github.com/Skyvern-AI/skyvern) — vision-first web interaction/layout-validation pipeline (planner/actor/validator loop). 22.8k stars, 2.1k forks, active.
- [browserbase/stagehand](https://github.com/browserbase/stagehand) — open-source automation SDK over Chrome DevTools Protocol, browser control + visual state capture. 24k stars, 1.7k forks, active.
- [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) — reverse-engineers a screenshot/mockup into matching HTML/Tailwind layout. 74.4k stars, 9.1k forks, active.
- [plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills) — **new-but-promising, labeled exception**: design-token/WCAG-oriented skill set for turning a coding agent into a design-system-aware assistant. Real repo (confirmed, not the "skillsllm.com"-only listing originally pasted), 507 stars, 46 forks, active as of 2026-06 — smaller signal than the others above, include with that caveat.

### Skill libraries (multi-skill collections — NOT individual skills; relabeled 2026-08-22)

**Correction:** every entry in this subsection is a collection of many skills bundled in one repo, not a single skill. Originally mislabeled "individual popular skills" — the user caught this. See "Individual atomic skills" subsection below for the actual single-skill answer.

- [obra/superpowers](https://github.com/obra/superpowers) — "agentic skills framework & software development methodology": plan-first, spec-driven workflow (brainstorming → writing-plans → TDD → verification). 276k stars, 24.7k forks, active. **This is the exact skill framework already active in this Claude Code session** (`superpowers:brainstorming`, `superpowers:writing-plans`, etc.) — already adopted, not a new pick.
- [mattpocock/skills](https://github.com/mattpocock/skills) — "Skills for Real Engineers," personal skill collection from a well-known TypeScript educator (creator of totaltypescript.com), includes strict-interrogation and TDD-style workflow skills. 231.6k stars, 19.8k forks, active.
- [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) — reshapes agent output for ADHD-friendly reading (answer-first, numbered steps, no preamble, one clear next action). 23.2k stars, 1.5k forks, active; organic virality confirmed across multiple independent write-ups, not one aggregator's spin. (Effectively a single-behavior skill in spirit, but ships as a repo alongside related material — verify its actual folder structure before treating as strictly atomic.)
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — "Production-grade engineering skills for AI coding agents," 24 distinct skills (spec-driven dev, TDD, code review, performance optimization, Chrome DevTools browser testing, etc.). 89.1k stars, 9.5k forks, active. Maintainer is Addy Osmani, a named, highly checkable web-performance/Chrome practitioner. Included here specifically to make the point stick: even top-tier named individuals ship libraries, not atomic skills.

### Individual atomic skills (single SKILL.md, one job — verified 2026-08-22)

Genuinely standalone or subfolder-level single-purpose skills, distinct from the libraries above. See `stage-1-skill-libraries.md` section 7 for full reasoning.

- [netresearch/context7-skill](https://github.com/netresearch/context7-skill) — one job: Context7 documentation lookup as a lightweight REST wrapper, no MCP overhead. 53 stars, 8 forks, pushed within days, active. Maintainer netresearch (named dev agency). **New-but-promising**: real, well-scoped, thin signal.
- [mgifford/accessibility-skills — `skills/color-contrast/SKILL.md`](https://github.com/mgifford/accessibility-skills/blob/main/skills/color-contrast/SKILL.md) — WCAG contrast-check, single job. Cite the subfolder, not the whole repo (the repo itself is a small library, 39★/2 forks). Maintainer Mike Gifford, named/checkable accessibility practitioner. **New-but-promising**, low star count.
- [softaworks/agent-toolkit — `skills/commit-work/SKILL.md`](https://github.com/softaworks/agent-toolkit/blob/main/skills/commit-work/SKILL.md) — stage/split/write Conventional Commits messages, single job. Parent repo is a library (2,378★/221 forks, real and active) — cite this subfolder specifically for the atomic use case.
- [agensi.io/skills/git-commit-writer](https://www.agensi.io/skills/git-commit-writer) — single-purpose Conventional Commits writer, marketplace-listed. Agensi's own dashboard calls it their most-downloaded skill — real listing, but that popularity figure is self-reported by the marketplace, not independently auditable.
- [agensi.io/skills/pr-description-writer](https://www.agensi.io/skills/pr-description-writer) — single-purpose PR-description generator from a diff. Same marketplace, same self-reported-metric caveat.
- [mcpmarket.com/tools/skills/leaderboard](https://mcpmarket.com/tools/skills/leaderboard) — real, numbered leaderboard of atomic single-purpose skills, ranked by GitHub stars of each skill's underlying repo (confirmed methodology, not a marketplace-only self-reported metric). Confirmed live entries incl. [#1 diagram-maker-visualizer](https://mcpmarket.com/tools/skills/diagram-maker-visualizer) (SVG/HTML/Excalidraw architecture-diagram generator), `next-js-turbopack-optimizer`, `frontend-slides`, `react-flow-implementation`, `frontend-performance-optimizer`, `context7-documentation-lookup`, `react-performance-optimization`, `react-code-fix-linter`. Per-entry underlying-repo star counts and exact rank positions beyond #1 not independently re-pulled this pass (site rate-limited, HTTP 429) — existence and ranking method confirmed, individual numbers not yet.

**Marketplaces referenced but not promoted as sources in their own right** (real platforms, self-reported metrics only — useful as places to find/verify individual skills, not citable authorities themselves):
- `mdskills.ai` — 4,000+ skill/plugin/MCP listings with visible download counts.
- `agensi.io` — 4,000+ paid skills marketplace, cross-tool. Hosts `git-commit-writer` and `pr-description-writer` (both real, free, cross-tool listings — "most downloaded" claim is Agensi's own unverifiable metric).

**Checked and discarded (failed the evidence bar):**
- "Open Design / OpenV0" — no canonical project found; GitHub search turns up only unrelated small personal repos (`nraiden/openv0`, `CrambitHazard/openv0`, etc.), no single checkable identity or repo-health signal. Not promoted.
- "Impeccable" (Claude anti-slop design skill) — no single canonical repo; GitHub search returns dozens of unrelated small forks/clones using "impeccable" in the name, no dominant/official one identifiable. Sourced originally to a single YouTube video only. Not promoted — if this is worth revisiting later, get a direct repo link from the user first.
- "GSD / Body Double / Executioner" skill — no repo, no named author found. Not promoted.
- `jaychempan/Agent-Leaderboard` — real repo but only 39 stars/0 forks, too thin to meet the repo-health bar as a leaderboard worth following. Not promoted.

## Products (not repos — verified as real Anthropic-shipped features)

- **Claude Design** — confirmed real, in beta, via `support.claude.com`. Chat + canvas design tool that imports design systems from GitHub/Figma/codebases, has a `/design-sync` command for Claude Code integration, supports direct canvas editing (drag/resize/align) and multi-format export. Note: the "interactive sliders for spacing/typography/color" claim from the original pasted dump is **not** confirmed by the support doc — it describes canvas editing, not sliders specifically. Available Pro/Max/Team/Enterprise, web + Desktop.

## Communities (Discord/Reddit/etc.)
