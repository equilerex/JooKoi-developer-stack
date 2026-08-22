# Sources — Curated, Verified

Reading/watching/following list for staying current on AI-assisted dev tooling. Nothing goes in this file without meeting the evidence bar: named practitioners with a real, checkable identity (org affiliation, public repo, publication history), current docs, or repo-health signals (stars, forks, active commits — not a one-person abandoned project). New-but-promising entries are allowed as a labeled exception. Verification trail and process notes live in `raw-inspiration-unverified.md` and `decisions/` — this file stays a clean reference list.

**Editorial note on this pass:** every "People to follow" entry now has a real explanation of *why* it's here, not just what platform they're on — several turned out to be adjacent to this list's actual purpose (software dev tooling) rather than squarely in it, and that's now said explicitly instead of papered over. The duplicate sections present in the previous draft (Design-to-code, Individual atomic skills, Skill libraries, Products each appeared twice) have been merged into single entries.

---

## Newsletters

- [TLDR AI](https://tldr.tech/ai) — daily digest, ~1.1M subscribers. Breadth over depth; good for not missing a major release, not for understanding one.
- [Latent Space](https://www.latent.space) — Substack, swyx + Alessio Fanelli. The defining "AI Engineer" publication; same brand runs the podcast and Discord below. Closest thing to a beat-reporting operation for this specific space.
- [The Batch](https://www.deeplearning.ai/the-batch/) — DeepLearning.AI / Andrew Ng. General AI-industry framing, not dev-tooling-practice specific — peripheral, not core, per the same judgment call made in `staying-current-ai-dev-2026.md`.
- Ben's Bites — established AI product/tool newsletter, product-launch and funding-news focus rather than technical practice (exact current URL not confirmed, search before subscribing).
- [Interconnects by Nathan Lambert](https://www.interconnects.ai) — 79k+ subscribers. Real ML-research background (Berkeley AI, Meta, DeepMind, HuggingFace) — writes about training/alignment research with the technical depth of someone who's done the work, not summarized it.
- [Ahead of AI by Sebastian Raschka](https://magazine.sebastianraschka.com) — same author as the YouTube channel below; paper-to-practice explainers from someone with a real research and textbook-authoring background, not a news aggregator.

## People to follow

X/social handles are inherently a lower evidence bar than repos/docs — real accounts posting real content, not vetted authorities. Split below by whether the content is actually about *building* something — a tool, a skill, an agent, an automation, code or no-code — versus commentary/coaching that isn't. That's a different and better line than "is this person a software developer": building an agent in n8n or Zapier counts as building, same as writing a SKILL.md does. Each entry states specifically what it's good for.

### Core — building tools, skills, and agents (code or no-code)

- **Andrej Karpathy** — [YouTube](https://www.youtube.com/@AndrejKarpathy), [@karpathy](https://x.com/karpathy). Former Tesla AI director, OpenAI founding member. The "Zero to Hero" series builds a neural net and then an LLM from scratch in code, no slideware — the most technically rigorous "how transformers actually work" education available from any single source. Highest-confidence entry on this whole list.
- **Sebastian Raschka** — [YouTube](https://www.youtube.com/@SebastianRaschka), Ahead of AI Substack above. ML researcher and staff member at Lightning AI, author of multiple deep-learning textbooks including a from-scratch LLM-building book. Reliable bridge between new papers and practical implementation — technically literate, not hype-summarizing.
- **[@simonw](https://x.com/simonw)** (Simon Willison) — creator of [Datasette](https://datasette.io/), long-running independent writer on local models, CLI tooling, and LLM security. Dates everything, links primary sources, states uncertainty explicitly rather than hedging vaguely. The highest signal-to-hype ratio individual voice on this entire list — see also `staying-current-ai-dev-2026.md` Part 4, where he's independently the top pick there too.
- **[@swyx](https://x.com/swyx)** (Shawn Wang) — Latent Space co-host, ex-AWS/Temporal/Airbyte before going independent. Coined/popularized "AI Engineer" as a distinct role. Real-time tracker of dev-environment and agent-harness shifts — less a single-topic expert, more the person actually watching the whole tooling ecosystem move.
- **Greg Kamradt** — [YouTube (Data Independent)](https://www.youtube.com/@DataIndependent), [gregkamradt.com](https://gregkamradt.com/media). Creator of the "Needle in a Haystack" test — now a standard benchmark for LLM long-context retrieval, [used and cited across the industry](https://arize.com/blog/the-needle-in-a-haystack-test-evaluating-the-performance-of-llm-rag-systems/) including by model vendors themselves. Data Independent covers hands-on RAG/agent-framework build-alongs. Worth following specifically for context-window and retrieval-evaluation methodology.
- **Sam Witteveen** — YouTube (exact current handle not confirmed, search "Sam Witteveen AI"), [@Sam_Witteveen](https://x.com/Sam_Witteveen). Co-founder of Red Dragon AI, a working AI company in Singapore. One of the earlier LangChain-era educators; channel now covers agentic-application patterns and local/open-source model walkthroughs. A practicing company co-founder narrating real build decisions, not tutorial content alone.
- **Mervin Praison** — [YouTube](https://www.youtube.com/@mervinpraison), [mer.vin](https://mer.vin/), [github.com/MervinPraison](https://github.com/MervinPraison). Creator of [PraisonAI](https://github.com/MervinPraison/PraisonAI), a multi-agent orchestration framework supporting 100+ LLMs with built-in memory/RAG. Real, checkable identity and active repo. Relevant specifically if evaluating multi-agent frameworks — a first-party source on that framework's own design tradeoffs, narrower relevance outside that.
- **@skirano** (Pietro Schirano) — [profiled by Replit's own blog](https://replit.com/blog/pietro-schirano) as a notable independent builder; known for fast, design-literate AI-assisted app-building demonstrations on X. Real identity, but the content is technique-and-demo, not documented methodology — useful for seeing what's currently possible at the frontier of AI-assisted UI building quickly, treat as inspiration rather than a source to cite claims from.
- **[@realrileybrown](https://www.instagram.com/realrileybrown)** (Riley Brown) — 329K followers, real person, associated with the VibeCode app/newsletter, one of the more visible faces popularizing "vibe coding" — building real software with AI assistance, no traditional dev background required. Useful for tracking that workflow and vocabulary as it evolves; the "$9M app" figure circulating about him comes from marketing-adjacent blogs, not an audited source, so weight the outcome claims separately from the technique itself.
- **@nick_saraev** — 550K followers, real person, founder of Maker School — an AI-automation-agency community teaching n8n/Zapier-style agent and workflow building. No-code, but it's genuinely about constructing agents/automations, which is this list's actual subject. Caveat is on the packaging, not the content category: this is a paid course/community business, and several independent "is this legit" review sites exist specifically because of that — read the technique, weight the outcome claims skeptically.
- **@nathanhodgson_** (TikTok) — 141.8K followers, real and active, Make/Zapier-centric AI-automation-building content — same category as nick_saraev, same caveat on outcome claims vs. technique. Note: original source had this as `@nathanhodgson.ai`, corrected to `@nathanhodgson_`.
- **The Cognitive Revolution** (Nathan Labenz) — podcast. Long-form interviews where guests are often the actual researchers or builders behind a given model or paper, not press-circuit talking heads — gets more technical candor than most coverage of the same announcement.

### Adjacent — real and checkable, but not about building

Kept for completeness, not endorsed at the same level as the section above. The distinguishing feature here isn't "no-code" or "not a developer" — it's that the content itself isn't instructional about constructing a tool, skill, or agent; it's commentary, career content, or using an AI product as an end user.

- **[@thevarunmayya](https://www.instagram.com/thevarunmayya)** (Varun Mayya) — 1M+ followers, real entrepreneur (founder, Avalon Labs; previously connected to Furlenco). Broad startup/career/tech commentary — general tech-culture awareness, not building instruction.
- **@sabrina_ramonov** — real, founder of [Blotato](https://www.blotato.com/about) (an AI content-distribution tool — she has built something), but the audience-facing content is mostly "how to use AI for content/marketing output" rather than "how to build an agent or skill." Worth a second look specifically for how Blotato itself is built, less so for the broader content stream.

**Checked and not confirmable, don't cite:** @mavgpt, @gayatri.tech.

## Repos / awesome-lists

### Design-to-code / browser verification tooling (verified 2026-08-22)

- [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) — official Google org repo. MCP server exposing live Chrome DevTools (DOM/computed styles, viewport emulation, network/console/perf) to coding agents. 49.6k stars, 3.5k forks, pushed within 24h of verification.
- [MengTo/Skills](https://github.com/MengTo/Skills) — portable SKILL.md playbooks for design/layout discipline (spacing, typography, guardrails) in coding agents. 5.2k stars, 633 forks, active. **Currently being trialed** — see `decisions/001-first-design-skill-picks.md`.
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — Vercel's structural guidelines/skill trees for web-design and framework conventions (incl. Next.js/RSC patterns). 30.3k stars, 2.7k forks, active.
- [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) — CLI/daemon orchestrating local Chrome/Puppeteer sessions for agents inspecting a running local dev server. 41.1k stars, 2.7k forks, active.
- [BuilderIO/skills](https://github.com/BuilderIO/skills) — visual-to-code mapping skills (`/visual-plan`, `/visual-edit`) connecting a repo to an editable browser layout. 4.1k stars, 204 forks, active.
- [browser-use/browser-use](https://github.com/browser-use/browser-use) — Python library giving LLMs structured browser control (accessibility-tree extraction, click/scroll/fill, visual inspection). 110k stars, 12.1k forks, very active — the dominant player in this category by a wide margin.
- [Skyvern-AI/skyvern](https://github.com/Skyvern-AI/skyvern) — vision-first web interaction/layout-validation pipeline (planner/actor/validator loop). 22.8k stars, 2.1k forks, active.
- [browserbase/stagehand](https://github.com/browserbase/stagehand) — open-source automation SDK over Chrome DevTools Protocol, browser control + visual state capture. 24k stars, 1.7k forks, active.
- [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) — reverse-engineers a screenshot/mockup into matching HTML/Tailwind layout. 74.4k stars, 9.1k forks, active.
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) ([impeccable.style](https://impeccable.style)) — design language for making an AI coding harness better at design. 61.6k stars. Maintainer Paul Bakaus, ex-Google, creator of jQuery Mobile — real, checkable identity.
- [nraiden/openv0](https://github.com/nraiden/openv0) — 4.0k stars. Note: an earlier pass separately checked "Open Design / OpenV0" as a general concept and found no single canonical project (see "Checked and discarded" below); this specific repo is the one confirmed real entry in that space.
- [plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills) — **new-but-promising, labeled exception**: design-token/WCAG-oriented skill set for turning a coding agent into a design-system-aware assistant. 507 stars, 46 forks, active as of 2026-06 — smaller signal than the rest of this subsection, include with that caveat.

### Skill libraries (multi-skill collections — not individual skills)

Every entry here is a collection of many skills bundled in one repo, not a single skill — see "Individual atomic skills" below for the actual single-skill answer.

- [obra/superpowers](https://github.com/obra/superpowers) — "agentic skills framework & software development methodology": plan-first, spec-driven workflow (brainstorming → writing-plans → TDD → verification). 276k stars, 24.7k forks, active. **This is the exact skill framework already active in this Claude Code session** (`superpowers:brainstorming`, `superpowers:writing-plans`, etc.) — already adopted, not a new pick.
- [mattpocock/skills](https://github.com/mattpocock/skills) — "Skills for Real Engineers," personal collection from Matt Pocock, a well-known TypeScript educator (creator of totaltypescript.com). Includes strict-interrogation and TDD-style workflow skills. 231.6k stars, 19.8k forks, active.
- [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) — reshapes agent output for ADHD-friendly reading (answer-first, numbered steps, no preamble, one clear next action). 23.2k stars, 1.5k forks, active; organic virality confirmed across multiple independent write-ups, not one aggregator's spin. Effectively a single-behavior skill in spirit, but ships as a repo alongside related material — verify its actual folder structure before treating as strictly atomic.
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — "Production-grade engineering skills for AI coding agents," 24 distinct skills (spec-driven dev, TDD, code review, performance optimization, Chrome DevTools browser testing). 89.1k stars, 9.5k forks, active. Maintainer Addy Osmani, a named, highly checkable web-performance/Chrome practitioner — also independently the second name in `staying-current-ai-dev-2026.md` Part 4. Included here specifically to make a point stick: even top-tier named individuals ship libraries, not atomic skills.

### Individual atomic skills (single SKILL.md, one job — verified 2026-08-22)

Genuinely standalone or subfolder-level single-purpose skills, distinct from the libraries above. See `stage-1-skill-libraries.md` section 7 for full reasoning.

- [netresearch/context7-skill](https://github.com/netresearch/context7-skill) — one job: Context7 documentation lookup as a lightweight REST wrapper, no MCP overhead. 53 stars, 8 forks, pushed within days, active. Maintainer netresearch, a named dev agency. **New-but-promising**: real, well-scoped, thin signal.
- [mgifford/accessibility-skills — `skills/color-contrast/SKILL.md`](https://github.com/mgifford/accessibility-skills/blob/main/skills/color-contrast/SKILL.md) — WCAG contrast-check, single job. Cite the subfolder, not the whole repo (the repo itself is a small library, 39 stars/2 forks). Maintainer Mike Gifford, a named/checkable accessibility practitioner. **New-but-promising**, low star count.
- [softaworks/agent-toolkit — `skills/commit-work/SKILL.md`](https://github.com/softaworks/agent-toolkit/blob/main/skills/commit-work/SKILL.md) — stage/split/write Conventional Commits messages, single job. Parent repo is a library (2,378 stars/221 forks, real and active) — cite this subfolder specifically for the atomic use case.
- [agensi.io/skills/git-commit-writer](https://www.agensi.io/skills/git-commit-writer) — single-purpose Conventional Commits writer, marketplace-listed. Agensi's own dashboard calls it their most-downloaded skill — real listing, but that popularity figure is self-reported by the marketplace, not independently auditable.
- [agensi.io/skills/pr-description-writer](https://www.agensi.io/skills/pr-description-writer) — single-purpose PR-description generator from a diff. Same marketplace, same self-reported-metric caveat.
- [mcpmarket.com/tools/skills/leaderboard](https://mcpmarket.com/tools/skills/leaderboard) — real, numbered leaderboard of atomic single-purpose skills, ranked by GitHub stars of each skill's underlying repo (confirmed methodology, not a marketplace-only self-reported metric). Confirmed live entries incl. [#1 diagram-maker-visualizer](https://mcpmarket.com/tools/skills/diagram-maker-visualizer) (SVG/HTML/Excalidraw architecture-diagram generator), `next-js-turbopack-optimizer`, `frontend-slides`, `react-flow-implementation`, `frontend-performance-optimizer`, `context7-documentation-lookup`, `react-performance-optimization`, `react-code-fix-linter`. Per-entry underlying-repo star counts and exact rank positions beyond #1 not independently re-pulled this pass (site rate-limited, HTTP 429) — existence and ranking method confirmed, individual numbers not yet.

**Marketplaces referenced but not promoted as sources in their own right** (real platforms, self-reported metrics only — useful as places to find/verify individual skills, not citable authorities themselves): [mdskills.ai](https://www.mdskills.ai) — 4,000+ skill/plugin/MCP listings with visible download counts. [agensi.io](https://www.agensi.io) — 4,000+ paid skills marketplace, cross-tool; hosts `git-commit-writer` and `pr-description-writer` above (both real, free, cross-tool listings — "most downloaded" claim is Agensi's own unverifiable metric).

### Core infra & framework repos

- [ollama/ollama](https://github.com/ollama/ollama) — single-command local model runner.
- [ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp) — C/C++ inference engine, popularized GGUF-style quantization for consumer hardware.
- [vllm-project/vllm](https://github.com/vllm-project/vllm) — PagedAttention high-throughput serving engine, the production/multi-user standard (not the right tool for solo local use — see `stage-1-local-models.md`).
- [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) — Python multi-agent orchestration framework.
- [microsoft/autogen](https://github.com/microsoft/autogen) — multi-agent conversation framework. Original authors also continue as the community-led **AG2** fork.
- [All-Hands-AI/OpenHands](https://github.com/All-Hands-AI/OpenHands) — autonomous software-engineering agent, product renamed OpenHands (formerly OpenDevin), org is All Hands AI.
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — official MCP reference-server hub.
- [langchain-ai/langchain](https://github.com/langchain-ai/langchain) — composable-chain framework for LLM apps.
- [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) — stateful/cyclic agent orchestration with persistence.
- [run-llama/llama_index](https://github.com/run-llama/llama_index) — data-ingestion/RAG framework; also the standard ingestion/chunking layer for a personal RAG-over-codebase pipeline (see "Dev-scoped second brain" below).
- [Mastra](https://mastra.ai) — TypeScript-native agent framework.
- **Microsoft Agent Framework** — Microsoft's 2025 convergence of AutoGen + Semantic Kernel (exact repo URL not confirmed).

### Utility / observability repos

- [yamadashy/repomix](https://github.com/yamadashy/repomix) — packs a repo into one LLM-friendly context file.
- [Langfuse](https://github.com/langfuse/langfuse) — open-source LLM observability/tracing platform.
- [Arize Phoenix](https://github.com/Arize-ai/phoenix) — open-source tracing tool, OpenTelemetry-based.
- [mem0ai/mem0](https://github.com/mem0ai/mem0) — memory layer for AI agents, formerly Embedchain.

### Other real products

- [Lovable](https://lovable.dev) — AI full-stack web-app builder (formerly GPT Engineer).
- [Firecrawl](https://www.firecrawl.dev) — web-scraping/crawling API built for LLM ingestion.

### Currently being trialed

See `decisions/001-first-design-skill-picks.md`:
- [MengTo/Skills](https://github.com/MengTo/Skills) (above)
- Claude Design (below, in Products)
- `Adityaraj0421/naksha-studio` — **unverified**, user's own find, no repo-health data on record.

### Dev-scoped second brain / RAG-over-own-context

See `stage-1-dev-second-brain.md` for full reasoning, including the OpenClaw security resolution below.

- [run-llama/llama_index](https://github.com/run-llama/llama_index) — already listed above; also the standard ingestion/chunking layer for a personal RAG-over-codebase pipeline.
- [open-webui/open-webui](https://github.com/open-webui/open-webui) — already listed above (browser tooling); also a legitimate offline chat front-end for a local RAG stack.
- **Continue.dev** — IDE extension (VS Code/JetBrains) pulling custom retrieved context directly into inline completions/chat, avoiding a separate chat-window context switch.
- **Dify** — open-source visual RAG-pipeline/app builder.
- [logseq/logseq](https://github.com/logseq/logseq) — privacy-first outliner/knowledge graph with an active AI-plugin ecosystem.
- [infiniflow/ragflow](https://github.com/infiniflow/ragflow) — deep document-understanding engine specialized in extracting clean data from messy unstructured files.
- **pgvector / Qdrant / ChromaDB** — the three established local vector-store options (Postgres extension / standalone service / simplest local file-backed option, respectively). None is a wrong pick; differ mainly in operational overhead.
- `aristoapp/awesome-second-brain` — curated list, general life-organization scope (not dev-specific) — browsing entry point, not a citable authority on its own.

**OpenClaw (github.com/openclaw/openclaw)** — real, large (247k stars/47.7k forks by March 2026), local-first personal-AI messaging gateway, not a fabrication and not a naming collision with anything else. Its plugin ecosystem, distributed via ClawHub, **is** the same registry documented in `stage-1-security.md` as systematically poisoned with malware in Feb 2026. Core project legitimate; treat any third-party "claw" with the same unaudited-marketplace scrutiny as any other unvetted skill/MCP server — do not adopt broadly on the strength of the core project's popularity alone.

**tinyhumansai/openhuman** (the project an earlier dump garbled as "Open Human") — real, Rust+Tauri, GPL3, local-first encrypted memory graph over documents/emails/chats, MCP-native. Maintained by Tiny Humans AI.

### Discovered via jaychempan/Agent-Leaderboard (agentskills.media)

This leaderboard tool itself (github.com/jaychempan/Agent-Leaderboard, own repo only 39 stars) was previously flagged as "too thin to promote." Correction: it's a legitimate live discovery tool — cron-updated via GitHub Search API across 5 boards (Agent Skills, MCP Servers, Prompt Library, AI Frameworks, Auto Research), methodology confirmed real. Its own low star count doesn't matter for that use. Star counts on the site itself run stale (~15–40% under real, some names post-rename) — verify current numbers directly on GitHub before citing exact figures elsewhere. Standouts pulled from it and confirmed real via GitHub API (2026-08-22):

- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — 100k stars. Claude Code skill for token-reduction via terse output. Directly relevant to the caveman-mode config already in this user's setup — worth comparing against.
- [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) (renamed from `safishamsi/graphify`) — 109.5k stars. AI coding assistant skill. Directly relevant to the user's own parked "Graphify" knowledge-graph interest — worth a look before building anything custom, but see the star-count-gaming caveat already on record in `personal-ai-dev-stack-blueprint.md` §6.4 before treating popularity as endorsement.
- [affaan-m/ECC](https://github.com/affaan-m/ECC) (renamed from `everything-claude-code`) — 242k stars. Agent-harness performance-optimization system (skills, instincts, memory).
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) — 234k stars. From NousResearch, a real/known open AI org.
- [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) — 205k stars. Single CLAUDE.md derived from Karpathy's own stated Claude Code preferences.
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 119.8k stars. Design-intelligence skill for professional UI/UX — relevant to the design-skill gap noted in `stage-1-skill-libraries.md`.
- [karpathy/autoresearch](https://github.com/karpathy/autoresearch) — 94.5k stars. Real, confirmed on Karpathy's own account — AI agents running research on single-GPU nanochat training automatically.
- [x1xhlol/system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) — 143k stars. Extracted system prompts from major AI coding tools (Cursor, Devin, Claude Code, etc.) — reference material, not a skill.

For the rest of the leaderboard (MCP servers, prompt libraries, AI frameworks, auto-research tools) — browse [agentskills.media](https://agentskills.media) directly rather than duplicating the full ranking here; it refreshes daily.

**Checked and discarded (failed the evidence bar):**
- "Open Design / OpenV0" as a general concept — no single canonical project found beyond the specific `nraiden/openv0` repo now listed above; GitHub search otherwise turns up only unrelated small personal repos (`CrambitHazard/openv0`, etc.), no dominant checkable identity. Not promoted as a category, the one specific repo is.
- "Impeccable" (Claude anti-slop design skill), as a separate concept from `pbakaus/impeccable` above — no other single canonical repo found; GitHub search returns dozens of unrelated small forks/clones using "impeccable" in the name. Sourced originally to a single YouTube video only. Not promoted beyond the one confirmed repo.
- "GSD / Body Double / Executioner" skill — no repo, no named author found. Not promoted.
- `jaychempan/Agent-Leaderboard` as a followable source in its own right — real repo but only 39 stars/0 forks, too thin to meet the repo-health bar on its own merits (it's promoted above as a discovery *tool*, which is a different bar — live methodology, not personal following-worthiness).

## Products (not repos)

- **Claude Design** — real, in beta (`support.claude.com`). Chat + canvas design tool importing design systems from GitHub/Figma/codebases, `/design-sync` command for Claude Code, direct canvas editing (drag/resize/align), multi-format export. Available Pro/Max/Team/Enterprise, web + Desktop. Note: an "interactive sliders for spacing/typography/color" claim seen elsewhere is **not** confirmed by the support doc — it describes canvas editing, not sliders specifically.

## Communities (Discord/Reddit/etc.)

- **Latent Space Discord** — tied to the Latent Space brand above.
- **Anthropic Developers Discord** — official Anthropic community.
- **OpenAI Developers Discord** — official OpenAI community.
- **Cursor Community Discord** — official Cursor community.
- [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) — open-weights/local-hardware focus, fast honest benchmarking of new claims.
- [r/mcp](https://www.reddit.com/r/mcp/) — smaller/newer, MCP-specific.
- [r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/)
- [ODS.ai](https://ods.ai) (Open Data Science) — long-running practitioner ML community, Telegram-based.
