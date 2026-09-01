# Stage 1 — Prompt & Skill Libraries (Stage 0 topic #2)

Think of an AI coding assistant like a new employee who's smart but doesn't know your habits yet. A "skill" is like a laminated instruction card you hand them for a specific recurring job, so they do it the same right way every time instead of you re-explaining it from scratch. A "library" or "marketplace" is just a shelf of these cards other people have written and shared, so you can grab one instead of writing your own. Worth knowing about if you use an AI coding assistant regularly and find yourself typing the same instructions over and over; skip it if you only use AI for occasional one-off questions.

Survey, not a pick. Covers what an agent skill actually is, current `SKILL.md` spec state, authoring anti-patterns, distribution mechanics, and what's genuinely broadly adopted worth knowing about. Nothing here is adopted by this stage — read it and choose what's worth trying.

## 1. Skill basics ("skills 101")

**What is an agent skill?** A packaged, reusable unit of instructions — and optionally code — that a coding agent loads on demand for a specific kind of task. Instead of retyping the same multi-step instruction every session, you save it once as a skill; the agent (or you, explicitly) invokes it by name whenever the task matches.

**What's normally inside one?** A folder containing a `SKILL.md` file:
- YAML frontmatter between `---` markers — at minimum a `description` field stating what the skill does and when to use it. A `name` field is optional (defaults to the folder name).
- A markdown body with the actual instructions the agent follows once the skill loads.
- Optionally, supporting files in the same folder: reference docs (`reference.md`), example collections, or a `scripts/` directory with executable helpers.

Minimal example — a one-file skill, no scripts:

```yaml
---
description: Stage changes and write a Conventional Commits message. Use when the user asks to commit or wants a commit message written from the diff.
---

Stage the relevant changes, then write a commit message in Conventional Commits
format (type(scope): summary). Keep the subject under 50 characters.
```

That's a complete, working skill. Nothing more is required.

**Skill vs. prompt.** A prompt is a one-off instruction typed into a conversation — useful once, then gone. A skill is reusable and *discoverable*: it has a name you (or the agent) can invoke again, and a `description` that declares when it applies, so it surfaces automatically on a matching future task without you re-explaining it.

**Skill vs. a base instruction file (`AGENTS.md`/`CLAUDE.md`).** A base instruction file is always loaded, in full, into every session's context regardless of what you're doing — it's baseline behavior and conventions. A skill's full body loads only when it's relevant to the current task; only its `description` sits in context cheaply at session start. This on-demand loading is often called **progressive disclosure**: the agent pays almost nothing for a skill until it actually needs it, so a library of dozens of skills can exist without bloating every session.

**How does an agent know when to invoke one?** By matching the current task against each installed skill's `description` field. A description that states both *what the skill does* and *when to use it* is the actual retrieval mechanism — not decoration. A vague description ("helps with commits") competes poorly against a specific one ("stage changes and write a Conventional Commits message from the diff; use when asked to commit or write a commit message").

**Can you invoke one explicitly?** Yes. Skills double as slash commands — typing `/skill-name` runs it directly, bypassing the agent's own judgment about relevance. The command name comes from the skill's folder name.

**Where do they live?** This varies by tool, but for Claude Code specifically (per its [skills documentation](https://code.claude.com/docs/en/skills)):
- **Personal/global** — available in every project: `~/.claude/skills/<skill-name>/SKILL.md`. On Windows that resolves under your user profile, e.g. `C:\Users\<you>\.claude\skills\<skill-name>\SKILL.md`; on macOS/Linux, `~/.claude/skills/<skill-name>/SKILL.md` (i.e. `/Users/<you>/.claude/skills/...` or `/home/<you>/.claude/skills/...`).
- **Project/repo-specific** — shared with a team via version control: `.claude/skills/<skill-name>/SKILL.md` at the repo root.

The underlying format is an open standard — [Agent Skills](https://agentskills.io) — so the same `SKILL.md` shape works across multiple AI coding tools, not just one vendor's.

**How simple can a skill be, vs. how complex?** As simple as the one-file example above. As complex as a directory with a `SKILL.md` that only holds an overview and links out to `reference.md` (detailed API docs), `examples.md`, and a `scripts/` folder of helper code — each loaded or executed only when actually needed, keeping the always-in-context part (the description) tiny regardless of how much material the skill ultimately draws on.

**What are scripts/resources for?** Two jobs: (1) offload fragile or deterministic logic to real code instead of prose the model has to re-derive every time (a script that renders a chart exactly the same way every run, rather than instructions hoping the model gets the formatting right), and (2) keep large reference material off-context until it's actually read, so a 2,000-line API reference costs nothing on sessions that never touch that skill.

**Compound/workflow-oriented skills.** Some skills don't just answer a question — they orchestrate a multi-step procedure, or explicitly delegate to a subagent or to other skills. A research skill might run a dedicated read-only subagent and return only the summary; a release skill might run tests, then build, then push, as an ordered checklist the model works through. These are still just `SKILL.md` files — the complexity lives in the instructions and any bundled scripts, not in a different mechanism.

**When should you create your own?** When a specific, *repeated* need actually shows up — not because a skill "looks useful" in a marketplace listing. A reasonable trigger: you've typed the same instruction three times, or a section of your base instruction file has grown into a multi-step procedure rather than a stable fact.

**Can AI help you write one?** Yes — a meta/skill-creation skill (Anthropic ships its own, `skill-creator`, in [`anthropics/skills`](https://github.com/anthropics/skills)) can scaffold a new `SKILL.md`, tighten a `description` for better matching, and help you write evaluation scenarios to check the skill actually works before you rely on it. Reading a skill-creation skill's own source also doubles as a working example of the format.

## 2. Less is more

Don't accumulate skills just because they look useful. Every installed skill's `description` sits in context on every turn — even when the body never loads — so each additional skill is a recurring token cost *and* another chance the agent picks the wrong skill for an ambiguous task.

Practical guidance:
- Keep a small set of skills you actually invoke, not a large collection you might someday need.
- Prefer a precise, narrow skill for a genuinely repeated need over a general-purpose one that half-fits several needs.
- Before writing a new skill, check whether adapting one you already have gets you there faster.
- Write your own skill when a repeated workflow is specific enough to justify it — and don't wait for someone else to publish one first. Creating a basic skill is intentionally low-effort: the minimal example in section 1 is the whole thing. A five-minute personal need is reason enough to write a five-line `SKILL.md`.

## 3. Current spec state

The open format is maintained as the [Agent Skills](https://agentskills.io) spec, with Claude Code's own extensions documented at [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills). As of this research pass:

- **Frontmatter:** only `description` is recommended (not strictly required — if omitted, the first markdown paragraph is used instead). `name` is optional and defaults to the folder name. `description` should state both *what* the skill does and *when to use it*, written in third person (not "I can help you..." — this matters because the description gets injected straight into the system prompt, and inconsistent point-of-view breaks discovery).
- **Progressive disclosure, concretely:** only `name`+`description` from every installed skill load at session start. The full `SKILL.md` body loads only when the agent decides it's relevant, or you invoke it directly. Referenced files (`reference.md`, `scripts/*.py`, etc.) load only when the agent actually reads them — zero context cost until touched.
- **Size discipline:** keep `SKILL.md` body under 500 lines; split into reference files beyond that, but keep all reference files **one level deep** from `SKILL.md` — an agent may only partially read a file that's referenced from another referenced file, so nesting loses content silently.
- **Degrees of freedom:** match specificity to task fragility — high freedom (prose heuristics) for judgment calls, low freedom (exact script, no deviation) for fragile/sequential operations like migrations.

## 4. Anti-patterns — what NOT to build as a skill

Two sources converge on the same core rule: **build from your own repeated need, not from a marketplace browse.** Specific guidance:

- Don't build a skill for something the model already knows or that changes rarely — skills earn their context cost by loading *current* knowledge the model lacks (fast-moving library APIs, your team's specific conventions, a fragile multi-step procedure), not by re-explaining stable fundamentals.
- Progression ladder before reaching for a skill at all: direct prompt → (repeat 3x) → slash command → (command gets too complex) → skill. Skipping straight to "download a skill for this" from a marketplace, before hitting that repetition threshold yourself, is called out explicitly as the anti-pattern to avoid.
- Don't offer the model multiple options where one clear default with an escape hatch would do ("use pdfplumber... for scanned PDFs use X instead" beats listing five libraries).
- For skills with executable scripts: handle errors explicitly rather than deferring to the model to figure it out, and justify every numeric constant (no "magic numbers") — same discipline as normal code review.
- The recommended workflow is evaluation-first: run a real task without the skill, note the actual gaps, write a few evaluation scenarios against those gaps, *then* write minimal instructions to pass them. Skills built by imagining requirements instead of observing real failures are the anti-pattern this whole workflow exists to prevent.

Source: Anthropic's official best-practices doc (primary), cross-checked against a practitioner substack post on newcomer anti-patterns — both agree on the same core.

## 5. Distribution — no longer manual-copy-only

This has moved past manual copying as the only option:

- **Claude Code plugins** bundle one or more skills plus optional hooks/MCP servers into one installable package, managed via the `/plugin` command in-terminal.
- **Scope matters at install time**: user-scope installs to `~/.claude/skills/` (available in every project); project-scope installs to `.claude/skills/` in a specific repo (shared with a team via version control).
- **Marketplace scale, as of mid-2026**: the official Anthropic marketplace lists hundreds of plugins; community marketplaces collectively list low thousands of skills, with individual community repos bundling hundreds each.

Manual copying still works and is still normal for a one-off personal skill, but for anything meant to be reused across machines or shared, the plugin/marketplace path is the current real option, not a manual-copy-only ecosystem anymore.

## 6. Recommended skills

Keeping this narrow on purpose: the only entry elevated here is one with clear, checkable, broad adoption. Specific candidate repos worth *evaluating* (not yet adopted, not broadly established) are tracked separately in [`decisions/006-skill-stack-picks.md`](./decisions/006-skill-stack-picks.md), so they don't get mistaken for settled recommendations in an educational doc.

- **[`anthropics/skills`](https://github.com/anthropics/skills)** — Anthropic's own official repo, confirmed 171k stars, 20.3k forks. 17 top-level skills across document processing, design/art, web artifacts, writing, and dev/extension tooling, including `skill-creator` (see section 1) and `frontend-design`. This is the one entry here with unambiguous provenance (official vendor repo) and adoption numbers — the reasonable default to browse first, not because everything in it fits every project, but because it's the least speculative starting point.

Beyond that single repo, dozens of community marketplaces and collections exist (see section 5) — real, but evaluate them the same way you'd evaluate any third-party dependency: check who maintains it, how recently it's been touched, and whether it solves a need you actually have, rather than treating "high star count" alone as an adoption signal.

## 7. Reference examples for writing a good skill

Anthropic's own best-practices doc uses **`pdf-processing`** and a **BigQuery domain-organized skill** as its worked examples — both demonstrate the one-level-deep reference pattern and domain-split reference files (`reference/finance.md`, `reference/sales.md`, etc.) cleanly. Beyond the docs, the most directly useful thing to actually read is [`anthropics/skills/skill-creator`](https://github.com/anthropics/skills/tree/main/skill-creator) itself — it's both a working example of a well-formed skill and a tool for generating new ones, so reading it teaches the format while giving you the tool to apply it.

## 8. Individual skills actually in wide use — front-end dev focus

The entries below are *libraries* — repos or collections containing many skills — not single atomic skills. The normal usage pattern is cherry-picking a handful of relevant skills out of a library, not installing the whole thing wholesale; section 8a below names specific skills worth pulling out. Direct repo checks (`gh`/GitHub API, stars/forks/last-push) back the numbers here, not aggregator claims.

**Chrome DevTools debugging — adoption sits at the MCP-server layer, not the skill layer.** [`ChromeDevTools/chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp) is the real, high-adoption artifact here — official Google org, 48.1k stars, pushed within the last week at time of writing, 27 documented DevTools tools (DOM inspection, network capture, performance tracing, viewport emulation). That's the thing front-end devs are actually installing. A *standalone SKILL.md skill that wraps it* is not itself independently popular — the hits that turn up (`mcpservers.org/agent-skills`, `claudeskills.info`, `awesomeskill.ai`, `mcpmarket.com`) are marketplace/SEO listing sites re-publishing the same thin wrapper skill, not evidence of a widely-adopted standalone skill with its own community, stars, or maintainers distinct from the MCP server itself. Treat "install chrome-devtools-mcp as an MCP server, write your own thin SKILL.md around it if needed" as the actual current practice.

**Individual/small-team maintained skill collections with real front-end content, ranked by repo-health signal (all confirmed live via direct GitHub API check, not archived):**

- **[`MiniMax-AI/skills`](https://github.com/MiniMax-AI/skills)** — 13.4k stars, 1.1k forks, pushed within the last few months. Includes a dedicated `frontend-dev` skill. Backed by a named commercial AI lab (MiniMax), not a solo maintainer.
- **[`ConardLi/garden-skills`](https://github.com/ConardLi/garden-skills)** — 10.5k stars, 1.4k forks, active. Maintained by Conard Li, a named individual practitioner with an existing public dev-tooling reputation. Covers web design, image generation, knowledge retrieval alongside front-end-relevant skills — broader than pure front-end, worth a targeted look rather than a wholesale adopt.
- **[`microsoft/skills`](https://github.com/microsoft/skills)** — 2.9k stars, 333 forks, pushed within the last day at time of writing (most actively maintained of this group). Official Microsoft org. Explicitly scoped to "Skills, MCP servers, Custom Agents, AGENTS.md for SDKs to ground coding agents" — includes Playwright-based testing/visual-regression guidance, directly relevant to this project's review-tooling interests (cross-reference [`review-and-verification-tooling.md`](./review-and-verification-tooling.md)).
- **[`finfin/awesome-frontend-skills`](https://github.com/finfin/awesome-frontend-skills)** — 184 stars, 24 forks. Small but exists specifically to solve this exact question (a curated, install-via-`npx skills add` list scoped to front-end only, not a general marketplace). New-but-promising: real signal is low in absolute terms, but the repo's scope matches directly, and it's structured as a growing curated index rather than a one-off skill.
- **[`colbymchenry/frontend-audit-skill`](https://github.com/colbymchenry/frontend-audit-skill)** — 19 stars, 9 forks. A single named individual's skill that does visual-regression auditing (compares live renders against design PNGs) — the same *category* of tool Anthropic's own best-practices doc uses as a worked example (section 7), but a real, separate, third-party implementation of that pattern. Low star count — new-but-promising, not confirmed wide adoption; a concrete example of the pattern, not a recommendation to install as-is.

`anthropics/skills` (`web-artifacts-builder`, `frontend-design`, `webapp-testing`) is already covered in section 6 — the highest-confidence single source for front-end-relevant individual skills.

**Bottom line:** there's no separate, thriving "standalone popular front-end skill" ecosystem cleanly distinct from the collections above — what exists is a handful of named orgs/practitioners (MiniMax, Conard Li, Microsoft) shipping front-end skills inside broader multi-skill repos, plus a couple of small, narrowly-scoped, low-star projects that are structurally exactly what you'd want but don't yet have adoption numbers to back "in wide use." The Chrome DevTools case is the clearest example: the tool front-end devs actually adopted at scale is the MCP server itself, with skill-wrapping still thin and marketplace-listing-only.

## 8a. Cherry-pick list — top individual front-end skills to pull out of the libraries above

Names are exact folder/skill names, checked directly against each repo's own README — cite the skill, install just that one, not the whole library.

**From [`anthropics/skills`](https://github.com/anthropics/skills)** (section 6 — de facto standard, no further vetting needed):
- `frontend-design` — general front-end UI/layout generation discipline.
- `web-artifacts-builder` — React 18 + TypeScript + Tailwind + shadcn/ui multi-component builds.
- `webapp-testing` — pairs with the above for the test side.

**From [`microsoft/skills`](https://github.com/microsoft/skills)** (official Microsoft org, 2.9k★, actively maintained):
- `frontend-design-review` — the direct front-end-design counterpart to Anthropic's own skill, worth comparing against `frontend-design` above rather than assuming duplication.
- `frontend-ui-dark-ts` — dark-mode-aware UI component patterns in TypeScript.
- `azure-microsoft-playwright-testing-ts` — Playwright-based automated browser testing.
- `react-flow-node-ts` — interactive node/diagram UI components (React Flow).
- `zustand-store-ts` — Zustand state-management patterns.

**From [`MiniMax-AI/skills`](https://github.com/MiniMax-AI/skills)** (13.4k★, named commercial lab):
- `frontend-dev` — React/Next.js UI, animation, and generative-art-asset workflows. The one skill in the repo actually relevant here; the rest (mobile-native, PDF/DOCX/PPTX generation, music/voice generation) is out of scope for front-end web work.

**From [`ConardLi/garden-skills`](https://github.com/ConardLi/garden-skills)** (10.5k★, named individual practitioner):
- `web-design-engineer` — front-end design for web pages, dashboards, prototypes, UI mockups. Again the one clearly relevant skill in a broader, mixed-purpose repo (video/presentation engineering, image generation, knowledge retrieval, article writing) — pull this one, skip the rest.

**Design-specific, not full design systems:**
`microsoft/skills/frontend-design-review` and `anthropics/skills/frontend-design` are the two named, checkable, narrowly-scoped design-critique/generation skills found — both single-job (review or generate a front-end design against stated criteria), neither a full design-token/system suite. No standalone atomic single-skill repo doing only "design critique" or "design-token enforcement" at meaningful adoption was found beyond these two library subfolders — a real, if modest, gap in the ecosystem.

## 9. Individual atomic skills (single SKILL.md, not libraries)

"Atomic" here means *does one coherent job*, not *does one trivial thing* — a skill like "run a Chrome DevTools responsive-breakpoint check and report results" counts; a whole planning/testing workflow system or a 24-skill engineering-practices collection does not, no matter how good it is.

Genuinely standalone, single-skill GitHub repos with real independent star-based adoption are rare. Most "atomic" skills that exist live as one subfolder inside a larger multi-skill collection (section 8), not as their own repo. Where standalone single-skill repos do exist, they mostly have low-to-modest stars — real, but thin. The other place atomic skills genuinely live at individual granularity is marketplace listings (mcpmarket.com, agensi.io) that give each skill its own page and install/usage count — but that adoption number is the marketplace's own self-reported metric, not an independently checkable GitHub signal, so it's weaker sourcing and is labeled as such below.

**Genuinely standalone, single-purpose repos (confirmed via direct GitHub API check):**
- **[`netresearch/context7-skill`](https://github.com/netresearch/context7-skill)** — one job: wraps Context7 documentation lookup as a lightweight REST call with no MCP context overhead. 53 stars, 8 forks, pushed within days of this research pass, not archived. Maintainer is netresearch, a named German dev agency. The cleanest example found of "one repo = one atomic skill" with real (if modest) adoption. New-but-promising: real and well-scoped, thin signal in absolute terms.
- **[`mgifford/accessibility-skills`](https://github.com/mgifford/accessibility-skills)** → `skills/color-contrast/SKILL.md` — the repo is a small collection (39 stars, 2 forks), but this specific subfolder is worth calling out individually: a narrowly-scoped WCAG contrast-check skill, maintained by Mike Gifford, a named, independently checkable accessibility practitioner. Cite the skill, not the whole repo — new-but-promising, low star count.
- **[`softaworks/agent-toolkit`](https://github.com/softaworks/agent-toolkit)** → `skills/commit-work/SKILL.md` — same pattern: the repo (2,378 stars, 221 forks, real and reasonably active) is a library, but `commit-work` specifically is a single-job skill (stage changes, split into logical commits, write a Conventional Commits message) worth citing at the subfolder level rather than adopting the whole toolkit.

**Marketplace-listed atomic skills — real listings, self-reported adoption metric, not GitHub-star-verifiable:**
- **[`agensi.io`](https://agensi.io)`/skills/git-commit-writer`** — single-purpose (staged-diff → Conventional Commits message), listed by Agensi as its most-downloaded skill. That "most downloaded" figure is Agensi's own dashboard number, not independently auditable.
- **`agensi.io/skills/pr-description-writer`** — same marketplace, same caveat, single-purpose PR-description generation from a diff.
- **[`mcpmarket.com`](https://mcpmarket.com)`/tools/skills/leaderboard`** — confirmed real, and the ranking metric is confirmed to be GitHub stars of each skill's underlying repo, not a self-reported install count. Because ranking is star-based, each listed entry should trace to a real, independently-checkable GitHub repo. Confirmed live entries include, at minimum: **#1 `diagram-maker-visualizer`** — generates standalone SVG/HTML/Excalidraw diagrams with zero external dependencies; plus `next-js-turbopack-optimizer`, `frontend-slides`, `react-flow-implementation`, `frontend-performance-optimizer`, `context7-documentation-lookup`, `react-performance-optimization`, `react-code-fix-linter`. <!-- VERIFY: per-entry GitHub star counts and exact rank positions beyond #1 weren't independently re-confirmed against a live page render (rate-limited during this research pass); existence and star-based ranking methodology are confirmed. -->

**What doesn't hold up:** even a very high-profile, individually-checkable maintainer — [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) (Addy Osmani, known for Chrome/web-perf work; 89.1k stars, real and highly active) — ships a 24-skill collection, not an atomic skill. This reinforces the section 8 finding: at the top of the adoption curve, named practitioners consistently ship libraries, not single skills. The atomic layer is real but exists mostly at modest scale (sub-100-star standalone repos, or marketplace listings with unverifiable popularity numbers), not at the same adoption tier as the libraries in sections 6 and 8.

## Sources

- [`code.claude.com/docs/en/skills`](https://code.claude.com/docs/en/skills) — primary source for spec fields, frontmatter reference, skill locations/paths, anti-patterns, progressive disclosure mechanics.
- [`agentskills.io`](https://agentskills.io) — the open Agent Skills spec that the format follows across tools.
- `aiforsystems.substack.com` post on Claude Code newcomer anti-patterns — cross-check on the "build from need, not from a repo" rule.
- [`github.com/anthropics/skills`](https://github.com/anthropics/skills) — direct fetch, confirmed star/fork count and directory structure.
- Search aggregation across `alirezarezvani.github.io`, `agensi.io`, `hidekazu-konishi.com`, `designrevision.com`, `firecrawl.dev` — cross-checked for marketplace scale and plugin-scope mechanics, not treated as independent sourcing on their own for any single claim.
- [`github.com/ChromeDevTools/chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp) — direct GitHub API check, 48.1k stars confirmed, official Google org.
- [`github.com/MiniMax-AI/skills`](https://github.com/MiniMax-AI/skills), [`github.com/ConardLi/garden-skills`](https://github.com/ConardLi/garden-skills), [`github.com/microsoft/skills`](https://github.com/microsoft/skills), [`github.com/finfin/awesome-frontend-skills`](https://github.com/finfin/awesome-frontend-skills), [`github.com/colbymchenry/frontend-audit-skill`](https://github.com/colbymchenry/frontend-audit-skill) — all direct GitHub API checks (stargazers_count/forks_count/pushed_at/archived), not aggregator claims.
- Marketplace/SEO listing sites (`mcpservers.org`, `claudeskills.info`, `awesomeskill.ai`, `mcpmarket.com`) surfaced in search but explicitly NOT treated as adoption-signal sources — they republish the same content and don't indicate independent popularity.
