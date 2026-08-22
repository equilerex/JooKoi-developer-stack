# Stage 1 — Prompt & Skill Libraries (Stage 0 topic #2)

Survey, not a pick. Covers current `SKILL.md` spec state, authoring anti-patterns, distribution mechanics, and named candidates worth knowing about for front-end dev and dev-tool building specifically. Nothing here is adopted by this stage — read it and choose what's worth trying.

## 1. Current spec state

The spec is maintained by Anthropic at `platform.claude.com/docs` (canonical) and mirrored/tracked externally at `agentskills.io`. As of this research pass:

- **Frontmatter:** only `name` and `description` are required. `name` — lowercase/numbers/hyphens only, ≤64 chars, no `anthropic`/`claude` reserved words, must match the folder name. `description` — ≤1024 chars, must state both *what* the skill does and *when to use it*, written in third person (not "I can help you..." — this matters because the description gets injected straight into the system prompt, and inconsistent point-of-view breaks discovery).
- **Progressive disclosure, concretely:** only `name`+`description` from every installed skill load at session start. The full `SKILL.md` body loads only when Claude decides it's relevant. Referenced files (`reference.md`, `scripts/*.py`, etc.) load only when Claude actually reads them — zero context cost until touched. This is the actual mechanism, not just a marketing claim.
- **Size discipline:** keep `SKILL.md` body under 500 lines; split into reference files beyond that, but keep all reference files **one level deep** from `SKILL.md` — Claude may only partially read (`head -100`-style) a file that's referenced from another referenced file, so nesting loses content silently.
- **Degrees of freedom:** match specificity to task fragility — high freedom (prose heuristics) for judgment calls, low freedom (exact script, no deviation) for fragile/sequential operations like migrations.

This is Anthropic's own current documentation, not third-party interpretation — high confidence.

## 2. Anti-patterns — what NOT to build as a skill

Two sources converge on the same core rule: **build from your own repeated need, not from a marketplace browse.** Specific guidance:

- Don't build a skill for something the model already knows or that changes rarely — skills earn their context cost by loading *current* knowledge the model lacks (fast-moving library APIs, your team's specific conventions, a fragile multi-step procedure), not by re-explaining stable fundamentals.
- Progression ladder before reaching for a skill at all: direct prompt → (repeat 3x) → slash command → (command gets too complex) → skill. Skipping straight to "download a skill for this" from a marketplace, before hitting that repetition threshold yourself, is called out explicitly as the anti-pattern to avoid.
- Don't offer the model multiple options where one clear default with an escape hatch would do ("use pdfplumber... for scanned PDFs use X instead" beats listing five libraries).
- For skills with executable scripts: handle errors explicitly rather than deferring to Claude to figure it out, and justify every numeric constant (no "magic numbers") — same discipline as normal code review.
- Anthropic's own recommended workflow is evaluation-first: run a real task without the skill, note the actual gaps, write 3 evaluation scenarios against those gaps, *then* write minimal instructions to pass them. Skills built by imagining requirements instead of observing real failures are the anti-pattern this whole workflow exists to prevent.

Source: Anthropic's official best-practices doc (primary), cross-checked against a practitioner substack post on newcomer anti-patterns — both agree on the same core.

## 3. Distribution — no longer manual-copy-only

This has moved past manual copying as the only option:

- **Claude Code plugins** bundle one or more skills plus optional hooks/MCP into one installable package, managed via the `/plugin` command in-terminal.
- **Scope matters at install time**: user-scope installs to `~/.claude/skills/` (available in every project — this matches the "global" layer in this repo's own structure); project-scope installs to `.claude/skills/` in a specific repo (shared with a team via version control).
- **Marketplace scale, as of mid-2026**: the official Anthropic marketplace lists hundreds of plugins; community marketplaces collectively list low thousands of skills, with individual community repos bundling hundreds each.

Manual copying still works and is still normal for a one-off personal skill, but for anything meant to be reused across machines or shared, the plugin/marketplace path is the current real option, not a manual-copy-only ecosystem anymore.

## 4. Named candidates — worth knowing about

**De facto standard, adopt without further vetting:**
- **`anthropics/skills`** (github.com/anthropics/skills) — Anthropic's own official repo. Confirmed: 171k stars, 20.3k forks. 17 top-level skills across document processing, design/art, web artifacts, writing, and dev/extension tooling. Directly relevant to this project's stated domains: **`web-artifacts-builder`** (React 18 + TypeScript + Tailwind + shadcn/ui multi-component artifacts), **`webapp-testing`** (pairs with it for the test side), **`frontend-design`**, **`skill-creator`** (Anthropic's own tool for writing new skills — the reflexive choice for actually building the library you said you want to grow), and **`mcp-builder`** (relevant to Stage-0 topic #5, held for that stage).

**Opinionated, real options, not endorsed — worth evaluating:**
- **`ComposioHQ/awesome-claude-skills`** — confirmed 73k stars via direct repo check. 1000+ skills, but note: this repo is run by Composio, a commercial SaaS-integration company, and a meaningful share of its content promotes their own "connect-apps" plugin (78+ SaaS integrations). Treat as a real, large, active list — but read it knowing part of it is a product funnel, not a neutral curation.
- **`rohitg00/awesome-claude-code-toolkit`** — broader scope than skills alone: 135 agents, 35 curated skills, 42 commands, 176+ plugins, 20 hooks, 15 rules, per its own README. Worth a browse specifically because it indexes hooks and commands alongside skills — useful cross-reference once Stage-0 topic #6 (hooks) gets its own pass.
- **"Superpowers"** — a full plan→spec→test workflow skill, cited independently by two separate 2026 roundups as a top pick; also the exact skill set already active in this Claude Code session (`superpowers:brainstorming`, `superpowers:writing-plans`, etc.) — so this isn't a cold recommendation, it's already running.

**Flagged, not confirmed — treat as unverified:**
- One search result claimed a Karpathy-attributed skills repo hit "144k stars in weeks" as one of the fastest-growing AI repos ever. This did not come from a primary source (no repo URL surfaced, no independent confirmation) and reads like aggregator hype rather than a checkable claim. Don't act on this without finding and verifying the actual repo first.

## 5. Reference examples for writing a good skill

Anthropic's own best-practices doc uses **`pdf-processing`** and a **BigQuery domain-organized skill** as its worked examples — both demonstrate the one-level-deep reference pattern and domain-split reference files (`reference/finance.md`, `reference/sales.md`, etc.) cleanly. Beyond the docs, the most directly useful thing to actually read is **`anthropics/skills/skill-creator`** itself — it's both a working example of a well-formed skill and a tool for generating new ones, so reading it teaches the format while giving you the tool to apply it.

## 6. Individual skills actually in wide use — front-end dev focus

**Correction (2026-08-22):** the user flagged, correctly, that every entry below this point is a *library* — a repo or collection containing many skills — not a single, atomic skill. That's a real and important distinction this section originally blurred. Section 7 below is the actual answer to "list individual atomic skills." Keep this section for what it's still good for: which *collections* are worth browsing to cherry-pick individual skills from — the normal usage pattern is picking a handful of relevant skills out of a library, not installing the whole thing wholesale.

This section answers a narrower question than section 4: not "which marketplaces exist" but "which single, standalone skills does a working front-end developer actually reach for" — whether that skill lives alone in its own repo, inside a bigger multi-skill collection, or as a marketplace listing. Direct repo checks (`gh`/GitHub API, stars/forks/last-push), not aggregator claims.

**Chrome DevTools debugging — the honest finding: adoption sits at the MCP-server layer, not the skill layer.** `ChromeDevTools/chrome-devtools-mcp` (github.com/ChromeDevTools/chrome-devtools-mcp) is the real, high-adoption artifact here — official Google org, 48.1k stars, pushed within the last week at time of writing, 27 documented DevTools tools (DOM inspection, network capture, performance tracing, viewport emulation). That's the thing front-end devs are actually installing. But a *standalone SKILL.md skill that wraps it* is not itself independently popular — the hits that turn up (`mcpservers.org/agent-skills`, `claudeskills.info`, `awesomeskill.ai`, `mcpmarket.com`) are marketplace/SEO listing sites re-publishing the same thin wrapper skill, not evidence of a widely-adopted standalone skill with its own community, stars, or maintainers distinct from the MCP server itself. Treat "install chrome-devtools-mcp as an MCP server, write your own thin SKILL.md around it if needed" as the actual current practice, not "go find the one popular chrome-devtools skill" — that second thing doesn't clearly exist yet as a separate, checkable entity.

**Individual/small-team maintained skill collections with real front-end content, ranked by repo-health signal (all confirmed live via direct GitHub API check, not archived):**

- **`MiniMax-AI/skills`** (github.com/MiniMax-AI/skills) — 13.4k stars, 1.1k forks, pushed within the last few months. Includes a dedicated `frontend-dev` skill. Backed by a named commercial AI lab (MiniMax), not a solo maintainer — checkable identity.
- **`ConardLi/garden-skills`** (github.com/ConardLi/garden-skills) — 10.5k stars, 1.4k forks, active. Maintained by Conard Li, a named individual practitioner with an existing public dev-tooling reputation (not anonymous). Covers web design, image generation, knowledge retrieval alongside front-end-relevant skills — broader than pure front-end, worth a targeted look rather than a wholesale adopt.
- **`microsoft/skills`** (github.com/microsoft/skills) — 2.9k stars, 333 forks, pushed within the last day at time of writing (most actively maintained of this group). Official Microsoft org — de facto checkable identity. Explicitly scoped to "Skills, MCP servers, Custom Agents, AGENTS.md for SDKs to ground coding agents" — includes Playwright-based testing/visual-regression guidance, directly relevant to this project's review-tooling interests (cross-reference `stage-1-review-tooling.md`).
- **`finfin/awesome-frontend-skills`** (github.com/finfin/awesome-frontend-skills) — 184 stars, 24 forks. Small but exists specifically to solve this exact question (a curated, install-via-`npx skills add` list scoped to front-end only, not a general marketplace). Worth noting as a **new-but-promising** entry per the two-tier evidence bar: real signal is low in absolute terms, but the repo's scope directly matches what was asked for here, and it's structured as a growing curated index rather than a one-off skill.
- **`colbymchenry/frontend-audit-skill`** (github.com/colbymchenry/frontend-audit-skill) — 19 stars, 9 forks. A single named individual's skill that does visual-regression auditing (compares live renders against design PNGs) — the same *category* of tool Anthropic's own best-practices doc uses as a worked example (see section 5), but this is a real, separate, third-party implementation of that pattern. Low star count — flagged as **new-but-promising**, not confirmed wide adoption; include as a concrete example of the pattern, not a recommendation to install as-is.

**What this section does not repeat:** `anthropics/skills` (`web-artifacts-builder`, `frontend-design`, `webapp-testing`) is already covered with full detail in section 4 — it remains the highest-confidence single source for front-end-relevant individual skills, cross-reference there rather than duplicated here.

**Bottom line for the user's actual question:** there is no separate, thriving "standalone popular front-end skill" ecosystem cleanly distinct from the marketplaces in section 4 — what exists instead is a handful of named orgs/practitioners (MiniMax, Conard Li, Microsoft) shipping front-end skills inside broader multi-skill repos, plus a couple of small, narrowly-scoped, low-star projects (`finfin/awesome-frontend-skills`, `colbymchenry/frontend-audit-skill`) that are structurally exactly what was asked for but don't yet have adoption numbers to back "actually in wide use." The Chrome DevTools case is the clearest example: the tool front-end devs actually adopted at scale is the MCP server itself, with skill-wrapping still thin and marketplace-listing-only.

## 6a. Cherry-pick list — top individual front-end skills to pull out of the libraries above

This is the piece that was still missing: not just "which libraries exist" but "which specific named skills inside them are the ones actually worth installing individually for front-end work." Names are exact folder/skill names, checked directly against each repo's own README — cite the skill, install just that one, not the whole library.

**From `anthropics/skills`** (already covered in section 4 — de facto standard, no further vetting needed):
- `frontend-design` — general front-end UI/layout generation discipline.
- `web-artifacts-builder` — React 18 + TypeScript + Tailwind + shadcn/ui multi-component builds.
- `webapp-testing` — pairs with the above for the test side.

**From `microsoft/skills`** (official Microsoft org, 2.9k★, actively maintained):
- `frontend-design-review` — the direct front-end-design counterpart to Anthropic's own skill, worth comparing against `frontend-design` above rather than assuming duplication.
- `frontend-ui-dark-ts` — dark-mode-aware UI component patterns in TypeScript.
- `azure-microsoft-playwright-testing-ts` — Playwright-based automated browser testing, directly relevant to the visual-verification-loop workflow discussed earlier in this session.
- `react-flow-node-ts` — interactive node/diagram UI components (React Flow), same category as the mcpmarket `react-flow-implementation` atomic skill in section 7 — two independent sources point at this as a real recurring front-end need.
- `zustand-store-ts` — Zustand state-management patterns.

**From `MiniMax-AI/skills`** (13.4k★, named commercial lab):
- `frontend-dev` — React/Next.js UI, animation, and generative-art-asset workflows. This is the one skill in the repo actually relevant here; the rest of the repo (mobile-native, PDF/DOCX/PPTX generation, music/voice generation) is out of scope for front-end web work — don't cherry-pick beyond this one.

**From `ConardLi/garden-skills`** (10.5k★, named individual practitioner):
- `web-design-engineer` — front-end design for web pages, dashboards, prototypes, UI mockups. Again the one clearly relevant skill in a broader, mixed-purpose repo (the rest covers video/presentation engineering, image generation, knowledge retrieval, article writing) — pull this one, skip the rest.

**Design-specific, not full design systems** (the user's explicit ask — small, MVP-scoped, not a whole suite):
- `microsoft/skills/frontend-design-review` and `anthropics/skills/frontend-design` are the two named, checkable, narrowly-scoped design-critique/generation skills found — both single-job (review or generate a front-end design against stated criteria), neither a full design-token/system suite. Worth trying both and comparing rather than picking blind, since they come from different named orgs with different house styles.
- No standalone atomic single-skill repo doing only "design critique" or "design-token enforcement" at meaningful adoption was found beyond these two library subfolders and the `plugin87/ux-ui-agent-skills` new-but-promising entry already in section 4/`sources.md` (507★, DTCG token + WCAG focus) — flag this as a real, if modest, gap in the ecosystem rather than implying more choice exists than actually does.

## 7. Individual atomic skills (single SKILL.md, not libraries)

This is the actual answer to "give me single, narrow-purpose skills — one skill, one job — not repos with hundreds of them bundled in." "Atomic" here means *does one coherent job*, not *does one trivial thing* — a skill like "run a Chrome DevTools responsive-breakpoint check and report results" counts; a whole SDD workflow system (superpowers) or a 24-skill engineering-practices collection (addyosmani/agent-skills) does not, no matter how good it is.

**The honest structural finding first:** genuinely standalone, single-skill GitHub repos with real independent star-based adoption are rare. Most "atomic" skills that exist live as one subfolder inside a larger multi-skill collection (the library repos in section 6), not as their own repo. Where standalone single-skill repos do exist, they mostly have low-to-modest stars — real, but thin by the star-count bar this project otherwise uses. The other place atomic skills genuinely live at individual granularity is marketplace listings (mcpmarket.com, agensi.io) that give each skill its own page and install/usage count — but that adoption number is the marketplace's own self-reported metric, not an independently checkable GitHub signal, so it's weaker sourcing by this project's evidence bar and is labeled as such below.

**Genuinely standalone, single-purpose repos (confirmed via direct GitHub API check):**
- **`netresearch/context7-skill`** (github.com/netresearch/context7-skill) — one job: wraps Context7 documentation lookup as a lightweight REST call with no MCP context overhead. 53 stars, 8 forks, pushed within days of this research pass, not archived. Maintainer is netresearch, a named German dev agency — checkable identity. This is the cleanest example found of "one repo = one atomic skill" with real (if modest) adoption. **New-but-promising** per the two-tier bar — real and well-scoped, thin signal in absolute terms.
- **`mgifford/accessibility-skills` → `skills/color-contrast/SKILL.md`** — the *repo* is a small collection (39 stars, 2 forks — already discussed as a library in section 6), but this specific subfolder is worth calling out individually: a narrowly-scoped WCAG contrast-check skill, maintained by Mike Gifford, a named, independently checkable accessibility practitioner (maintains the separate `mgifford.github.io/ACCESSIBILITY.md` resource this repo mirrors). Cite the skill, not the whole repo, if the goal is genuinely atomic adoption — **new-but-promising**, low star count.
- **`softaworks/agent-toolkit` → `skills/commit-work/SKILL.md`** — same pattern: the repo (2,378 stars, 221 forks, real and reasonably active) is a library, but `commit-work` specifically is a single-job skill (stage changes, split into logical commits, write a Conventional Commits message) worth citing at the subfolder level rather than adopting the whole toolkit.

**Marketplace-listed atomic skills — real listings, self-reported adoption metric, not GitHub-star-verifiable:**
- **`agensi.io/skills/git-commit-writer`** — single-purpose (staged-diff → Conventional Commits message), listed by Agensi as its most-downloaded skill. That "most downloaded" figure is Agensi's own dashboard number, not independently auditable — treat the skill's existence and scope as confirmed, the popularity ranking as marketplace-self-reported.
- **`agensi.io/skills/pr-description-writer`** — same marketplace, same caveat, single-purpose PR-description generation from a diff.
- **`mcpmarket.com/tools/skills/leaderboard`** — confirmed real, and the ranking metric is confirmed to be GitHub stars of each skill's underlying repo, not a self-reported install count — cross-checked via search since direct page fetches were rate-limited (HTTP 429) throughout this research pass. Because ranking is star-based, each listed entry should trace to a real, independently-checkable GitHub repo, which meets this project's evidence bar better than a marketplace-only metric would. Confirmed live entries include, at minimum: **#1 `diagram-maker-visualizer`** — generates standalone SVG/HTML/Excalidraw diagrams (architecture, system flow, hub-spoke, swimlane layouts) with zero external dependencies, front-end-relevant for documenting component/architecture diagrams; plus `next-js-turbopack-optimizer`, `frontend-slides`, `react-flow-implementation`, `frontend-performance-optimizer`, `context7-documentation-lookup`, `react-performance-optimization`, `react-code-fix-linter`. This is the closest real match found to "a top-100-style ranked list of individual atomic skills." Two gaps: (1) the underlying GitHub repo/star count for each individual entry wasn't independently pulled in this pass (rate-limiting blocked it) — the *existence and ranking methodology* are confirmed, per-entry star counts are not yet; (2) the exact rank numbers for entries beyond #1 (e.g. #4, #12, #23, #29, #73, #95, #97 as cited from the leaderboard) weren't independently re-confirmed against a live page render, only against search-index snippets — treat specific rank positions as likely-accurate but not re-verified first-hand.

**What doesn't hold up:** even a very high-profile, individually-checkable maintainer — `addyosmani/agent-skills` (Addy Osmani, well-known for Chrome/web-perf work; 89.1k stars, real and highly active) — ships a 24-skill collection, not an atomic skill. This reinforces the section 6 finding: at the top of the adoption curve, named practitioners consistently ship libraries, not single skills. The atomic layer is real but exists mostly at modest scale (sub-100-star standalone repos, or marketplace listings with unverifiable popularity numbers), not at the same adoption tier as the libraries in sections 4 and 6.

## Sources

- `platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices` — primary source for spec fields, anti-patterns, progressive disclosure mechanics, evaluation-first workflow.
- `aiforsystems.substack.com` post on Claude Code newcomer anti-patterns — cross-check on the "build from need, not from a repo" rule.
- `github.com/anthropics/skills` — direct fetch, confirmed star/fork count and directory structure.
- `github.com/ComposioHQ/awesome-claude-skills` — direct fetch, confirmed star count and noted commercial affiliation.
- Search aggregation across `alirezarezvani.github.io`, `agensi.io`, `hidekazu-konishi.com`, `designrevision.com`, `firecrawl.dev` — cross-checked for marketplace scale and plugin-scope mechanics, not treated as independent sourcing on their own for any single claim.
- `github.com/ChromeDevTools/chrome-devtools-mcp` — direct GitHub API check, 48.1k stars confirmed, official Google org.
- `github.com/MiniMax-AI/skills`, `github.com/ConardLi/garden-skills`, `github.com/microsoft/skills`, `github.com/finfin/awesome-frontend-skills`, `github.com/colbymchenry/frontend-audit-skill` — all direct GitHub API checks (stargazers_count/forks_count/pushed_at/archived), not aggregator claims.
- Marketplace/SEO listing sites (`mcpservers.org`, `claudeskills.info`, `awesomeskill.ai`, `mcpmarket.com`) surfaced in search but explicitly NOT treated as adoption-signal sources — they republish the same content and don't indicate independent popularity.
