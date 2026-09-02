# Graph Report - _architecture\graphify  (2026-09-02)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 516 nodes · 438 edges · 142 communities (40 shown, 102 thin omitted)
- Extraction: 88% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.58)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f003b05b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Base Instruction Files
- jookoi doc full skill
- jookoi-paper-trail.js
- scripts
- Skill
- Planning
- AI Tooling Recommendations
- Jookoi Documentation
- vault-sync.js
- Jookoi Documentation Script
- scripts
- Security and Supply Chain
- jookoi-casual-writer
- Frontend Design
- Graphify
- Repository Legibility
- OS-Level Sandboxing
- Model Context Protocol (MCP)
- Critique
- _common.sh
- Skill Scan
- Plain Local Filesystem
- Obsidian Notes
- Task Notification
- Graphify_output
- Skyvern AI
- Personal Harness Architecture Document
- Planning Process
- OS-Level Isolation Primitives
- llama.cpp
- Setup File
- Remove
- Memory_system
- Vercel Agent Skills
- Plans
- Cline's Memory Bank
- Cloudflare Skills
- Doc Gate Script
- Jookoi Architecture
- Archive
- Crash_course_structure
- EARS Notation
- Graphify_mirroring
- AGENTS.md
- arXiv 2607.02357
- Copy-out Bundles
- doc-gate.sh
- preserve.sh
- rehydrate.sh
- setup.sh
- session-log.sh
- session-start-reminder.sh
- DeepSeek
- Defense Stack Layers
- Global Config
- jookoi-doc flush
- Kilo Code
- Letta
- No Setup Script
- NVIDIA SkillSpector
- OpenClaw Memory System
- parse-sessions.py
- Plain Text Files
- Private Context
- 004_cross_repo_consolidation_plan
- Chrome DevTools MCP
- Coding_agents_work
- Guardrails_for_phrases
- Hooks_dotfiles
- JooKoi_commit_message_skill
- Local_model_hardware_fit
- Own_repos_commit_allowed
- Paste_sanitizers
- SKILL.md
- Session_token_economics
- A2A Protocol
- Acceptance Criteria
- Agent Client Protocol
- AI Tooling Crash Course for Developers
- Planning Before Implementation
- Local Model Use
- Anti-patterns in Skill Development
- Anthropic Skill/Plugin Scanning
- anthropics_design_skill
- anti_slop_skill
- AristoApp Awesome Second Brain
- BACKLOG.md
- Capn Hook
- caveman_skill
- Cisco AI Defense skill-scanner
- Claude Code
- Cognee
- Skill Scanner Picks
- Developers
- Dify
- discovery_phase_review
- Formal Pipeline
- front_end_pr_review
- Agentskills
- Chatbox
- Cherry Studio
- LobeChat
- Anything LLM
- Msty
- GPT
- Graphiti
- Claude
- Grok
- Mistral
- Jookoi Context
- Llama
- MCP Server
- Model Context Protocol Specification
- mcp-warden
- Current State
- nvidia_skillspect
- Obra Episodic Memory
- Obsidian
- Ollama
- OpenClaw
- OpenHuman
- OpenZep
- Plan
- PR-Agent
- Progression Ladder
- Qwen
- RAGFlow
- Requirements
- Second Opinion
- Sentry's skill-scanner
- SkillCloak
- SkillDetonate
- Skill for Repeated Need
- Skill Scanners
- skill_scanning_and_verification
- snyk_agent_scan
- Planning Before Implementation
- superpowers_skill
- Tasks
- TheWeatherReport AI
- VLLM
- Zep

## God Nodes (most connected - your core abstractions)
1. `scripts` - 14 edges
2. `Base Instruction Files` - 14 edges
3. `Jookoi Documentation Script` - 13 edges
4. `agents md` - 13 edges
5. `AI Tooling Recommendations` - 13 edges
6. `jookoi-casual-writer` - 10 edges
7. `cmdFlush()` - 10 edges
8. `jookoi doc full skill` - 9 edges
9. `Pipeline` - 9 edges
10. `Planning` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Jookoi Documentation Script` --references--> `File Formats Reference`  [EXTRACTED]
  jookoi-doc/scripts/jookoi-doc.js → my-global-setup/agents/skills/jookoi-doc/references/file-formats.md
- `Jookoi Documentation Script` --references--> `Hooks Reference`  [EXTRACTED]
  jookoi-doc/scripts/jookoi-doc.js → my-global-setup/agents/skills/jookoi-doc/references/hooks.md
- `Jookoi Documentation Script` --references--> `Operations Reference`  [EXTRACTED]
  jookoi-doc/scripts/jookoi-doc.js → my-global-setup/agents/skills/jookoi-doc/references/operations.md
- `Jookoi Documentation Script` --references--> `Pipeline Reference`  [EXTRACTED]
  jookoi-doc/scripts/jookoi-doc.js → my-global-setup/agents/skills/jookoi-doc/references/pipeline.md
- `agents md` --reads--> `Aider`  [EXTRACTED]
  _architecture/plans/2026-09-01-jookoi-doc-full-skill.md → ai-tooling-crash-course-for-developers/tutorials/base-instruction-files.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Shippable Stack** — jookoi-developer-stack, my-global-setup, my-repo-setup [EXTRACTED 0.75]
- **Memory System** — agents_skills_jookoi_doc, jookoi-developer-stack [EXTRACTED 0.75]
- **Architecture and Guidelines** — architecture_architecture_docs, my-global-setup, my-repo-setup [EXTRACTED 0.75]
- **Jookoi Paper Trail Convention** — jookoi_paper_trail, architecture_current_state_md, architecture_next_steps_md, my_global_setup_agents_skills_jookoi_doc [EXTRACTED 0.75]
- **Drop-in Stack** — architecture_stack_distribution, agents-md, skills, prompts, utility-scripts [INFERRED 0.75]
- **Implementation Deviations** — no_setup_script, repo_build_process, copy_out_bundles, repo_root, global_config, seed_template, local_folder, jookoi_architecture, global_developer_location [EXTRACTED 0.75]
- **Alternatives Considered** — claudes_memory_system, obsidian_vault, graphify_tool, periodic_extraction_scripts [EXTRACTED 0.75]
- **cross_repo_workflow** — 004_cross_repo_consolidation_plan, discovery_phase_review, skill_scanning_and_verification [INFERRED]
- **Crash Course Organization** — ai-tooling-crash-course-for-developers_README.md, ai-tooling-crash-course-for-developers_TOPIC-INDEX.md, ai-tooling-crash-course-for-developers_ARCHITECTURE.md, ai-tooling-crash-course-for-developers_INSPRATION-AND-STAYING-CURRENT.md, ai-tooling-crash-course-for-developers_AI-TOOLING-RECOMMENDATIONS.md, ai-tooling-crash-course-for-developers_TODO.md [EXTRACTED 1.00]
- **mcp-servers** — mcp-servers, punkpeye-awesome-mcp-servers, appcypher-awesome-mcp-servers [INFERRED]
- **mcp-security** — tool-poisoning, correction-2026-08-23 [INFERRED]
- **Personal Memory System** — claude_memory, plain_journal, claire_tooling, copilot [EXTRACTED 1.00]
- **Pipeline Steps** — collector, normalized_result, renderer, task_specific_bundle [EXTRACTED 0.75]
- **Background Processing Patterns** — run_in_background, ScheduleWakeup, Monitor [EXTRACTED 0.75]
- **Planning Workflow** — gate, elicit, write-down, draft-plan, validate-plan, critique, execute [EXTRACTED 0.75]
- **Review Tools Concept** — github_copilot, jetbrains_ide, claire_code, pr_agent, second_opinion [EXTRACTED 0.75]
- **Skill Scanners Ecosystem** — skill_spectator, snyk_skill_scan, skill_scan [EXTRACTED 0.75]
- **Session Management System** — doc_gate_sh, preserve_sh, rehydrate_sh [EXTRACTED 0.75]
- **Operations Group** — my_global_setup_agents_skills_jookoi_doc_references_operations_find, my_global_setup_agents_skills_jookoi_doc_references_operations_remove, my_global_setup_agents_skills_jookoi_doc_references_operations_staleness, my_global_setup_agents_skills_jookoi_doc_references_operations_section_surgical [EXTRACTED 0.75]
- **Graphify Setup Process** — utility_scripts_jookoi_graphify_setup_graphifyignore_template, utility_scripts_jookoi_graphify_setup_package_scripts_snippet_json, utility_scripts_jookoi_graphify_setup_setup_sh, graphify [EXTRACTED 0.75]

## Communities (142 total, 102 thin omitted)

### Community 0 - "Base Instruction Files"
Cohesion: 0.06
Nodes (36): AAIF.io Projects Agents.md, Agents' Journals, agents md, Base Instruction Files, Aider, Amp, arXiv 2606.07448, AutoGen (+28 more)

### Community 1 - "jookoi doc full skill"
Cohesion: 0.07
Nodes (27): Contexts Directory, Prompts Directory, Tools Directory, ai tooling crash course for developers, Current State Document, Next Steps Document, Archive Directory, archive/YYYY-MM.md (+19 more)

### Community 2 - "jookoi-paper-trail.js"
Cohesion: 0.14
Nodes (28): archDir(), BACKLOG_STATUS, cmdBacklog(), cmdCheck(), cmdFlush(), cmdNewDecision(), cmdNewPlan(), cmdStatus() (+20 more)

### Community 3 - "scripts"
Cohesion: 0.09
Nodes (21): name, private, scripts, gr, gr:c, gr:gemini, gr:i, gr:ollama (+13 more)

### Community 4 - "Skill"
Cohesion: 0.12
Nodes (17): Agent, Anthropic's Official Skills Repository, BigQuery Skill, Conard Li Garden Skills, Description, Frontend Development Skill, Marketplace, Microsoft Skills Collection (+9 more)

### Community 5 - "Planning"
Cohesion: 0.12
Nodes (17): Agents, AGENTS.md, AI Coding Agents, Stack Distribution Architecture, Complexity, Conditions, Decision - Drop-in Folder, Implementation (+9 more)

### Community 6 - "AI Tooling Recommendations"
Cohesion: 0.12
Nodes (17): AI Tooling Recommendations, Architecture Document, Inspiration and Staying Current, AI Tooling Crash Course for Developers README, Crash-course TODO, Topic Index, RagFlow, LangChain (+9 more)

### Community 7 - "Jookoi Documentation"
Cohesion: 0.13
Nodes (15): Sync Script, Vault, Jookoi Documentation, Architecture Documentation, Archive Documentation, Backlog Documentation, Current State Documentation, Next Steps Documentation (+7 more)

### Community 8 - "vault-sync.js"
Cohesion: 0.23
Nodes (15): checkIdentity(), collectAllFiles(), collectJookoiPaths(), ensureDirFor(), { execSync }, fail(), fs, gitRemoteUrl() (+7 more)

### Community 9 - "Jookoi Documentation Script"
Cohesion: 0.14
Nodes (14): Add Command, Flush Command, Jookoi Documentation Script, Templates Directory, File Formats Reference, Hooks Reference, Operations Reference, Pipeline Reference (+6 more)

### Community 10 - "scripts"
Cohesion: 0.14
Nodes (13): cross-env, devDependencies, cross-env, scripts, gr, gr:c, gr:gemini, gr:i (+5 more)

### Community 11 - "Security and Supply Chain"
Cohesion: 0.18
Nodes (11): Security and Supply Chain, Aikido, Checkmarx, ClawHub, Deps.dev, Elastic Security, Prompt Security, SentinelOne (+3 more)

### Community 12 - "jookoi-casual-writer"
Cohesion: 0.18
Nodes (11): Before writing, Candor, Corporate puffery, Explaining things, Figurative framing, jookoi-casual-writer, Punctuation ban, Shape, size, and density (+3 more)

### Community 13 - "Frontend Design"
Cohesion: 0.20
Nodes (10): Frontend Design, Web Artifacts Builder, Webapp Testing, Web Design Engineer, Azure Playwright Testing, Frontend Design Review, Frontend UI Dark Mode, React Flow Node (+2 more)

### Community 14 - "Graphify"
Cohesion: 0.22
Nodes (9): Memory and Progress Ledgers, Corporate Environment Research Pass, Foam, Graphify, Graphify Configuration, Obsidian Alternatives, SilverBullet, Graphify Ignore Template (+1 more)

### Community 15 - "Repository Legibility"
Cohesion: 0.29
Nodes (7): Agent Loops, AGENTS.md, Context Engineering, Harness Engineering, llm-progress-complete.jsonl, next-steps.md, Repository Legibility

### Community 16 - "OS-Level Sandboxing"
Cohesion: 0.29
Nodes (7): Agent Sandboxing, Claude Code Sandboxing, Dedicated Sandbox Service, gVisor, MicroVMs, OpenAI Codex Sandboxing, OS-Level Sandboxing

### Community 17 - "Model Context Protocol (MCP)"
Cohesion: 0.33
Nodes (7): Appcypher's MCP Servers, MCP Specification Correction, Model Context Protocol (MCP), MCP Security, MCP Servers, Punkypeye's MCP Servers, Tool Poisoning

### Community 18 - "Critique"
Cohesion: 0.29
Nodes (7): Critique, Draft Plan, Elicit, Execute, Gate, Validate Plan, Write Down

### Community 19 - "_common.sh"
Cohesion: 0.33
Nodes (3): emit_block(), emit_context(), _common.sh script

### Community 20 - "Skill Scan"
Cohesion: 0.29
Nodes (6): GitHub/NMitchem/Skill Scan, GitHub/NVIDIA/SkillSpector, GitHub/Snyk/Agent Scan, NMitchem/SkillScan, Skill Scan, Snyk Skill Scan

### Community 21 - "Plain Local Filesystem"
Cohesion: 0.40
Nodes (6): Claude Code's Memory System, Graphify, Obsidian Vault, Periodic Extraction Scripts, Plain Local Filesystem, The dotmack Claude Mem

### Community 22 - "Obsidian Notes"
Cohesion: 0.33
Nodes (6): Dendron, Kuzudb, Logseq, Nex CRM - Wuphf, Obsidian Notes, Silverbullet MD

### Community 23 - "Task Notification"
Cohesion: 0.50
Nodes (5): Monitor Tool, ScheduleWakeup Tool, run_in_background Function, Structured Reporter, Task Notification

### Community 24 - "Graphify_output"
Cohesion: 0.50
Nodes (4): AGENTS_md_instances, Graphify_out_folder, Graphify_output, Restricted_repos

### Community 25 - "Skyvern AI"
Cohesion: 0.50
Nodes (4): BuilderIO Skills, Skyvern AI, Browser Use, Stagehand

### Community 26 - "Personal Harness Architecture Document"
Cohesion: 0.50
Nodes (4): Personal Harness Architecture Document, Harness Engineering Vocabulary Document, Skill Pick Decision Document, Skills Registry Document

### Community 27 - "Planning Process"
Cohesion: 0.50
Nodes (4): Critiquing the Plan, Decomposition, Planning Process, Research Phase

### Community 28 - "OS-Level Isolation Primitives"
Cohesion: 0.50
Nodes (4): Filesystem Access Restriction, Network Access Restriction, OS-Level Isolation Primitives, System Call Restriction

### Community 29 - "llama.cpp"
Cohesion: 0.50
Nodes (4): Ollama, llama.cpp, LM Studio, vLLM

### Community 30 - "Setup File"
Cohesion: 0.50
Nodes (4): AGENTS.md File, settings.json File, .gitignore File, Setup File

### Community 31 - "Remove"
Cohesion: 0.50
Nodes (4): Find, Remove, Section-surgical updates, Staleness

### Community 32 - "Memory_system"
Cohesion: 0.67
Nodes (3): Memory_system, Multi_checkout_sync, Vault_hosting

### Community 33 - "Vercel Agent Skills"
Cohesion: 0.67
Nodes (3): MengTo Skills, Vercel Agent Browser, Vercel Agent Skills

### Community 34 - "Plans"
Cohesion: 0.67
Nodes (3): Architecture, Decisions, Plans

### Community 35 - "Cline's Memory Bank"
Cohesion: 0.67
Nodes (3): Cline's Memory Bank, Jayzeng AgentMemory, Modus Create Agentic Coding Handbook

### Community 36 - "Cloudflare Skills"
Cohesion: 0.67
Nodes (3): Cloudflare Skills, Frontman AI, Remotion Skills

### Community 37 - "Doc Gate Script"
Cohesion: 1.00
Nodes (3): Doc Gate Script, Preserve Script, Rehydrate Script

### Community 38 - "Jookoi Architecture"
Cohesion: 0.67
Nodes (3): Global Developer Location, Jookoi Architecture, Local Folder

### Community 39 - "Archive"
Cohesion: 1.00
Nodes (3): Archive, Current State, Progress

## Knowledge Gaps
- **301 isolated node(s):** `fs`, `path`, `{ execSync }`, `name`, `version` (+296 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **102 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `agents md` connect `Base Instruction Files` to `jookoi doc full skill`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `jookoi doc full skill` connect `jookoi doc full skill` to `Base Instruction Files`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `Base Instruction Files` connect `Base Instruction Files` to `AI Tooling Recommendations`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `fs`, `path`, `{ execSync }` to the rest of the system?**
  _301 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Base Instruction Files` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `jookoi doc full skill` be split into smaller, more focused modules?**
  _Cohesion score 0.06854838709677419 - nodes in this community are weakly interconnected._
- **Should `jookoi-paper-trail.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13978494623655913 - nodes in this community are weakly interconnected._