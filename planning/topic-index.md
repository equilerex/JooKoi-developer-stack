# Topic Index — What's Actually Agreed On (2026)

A survey, not a shopping list. Each topic below states what's settled vs. contested in the field, then links to the deep-dive doc(s) that cover it in this repo — or says plainly if no deep-dive exists yet. Personal reactions/mark-labels from the original pass are kept separately in `local/stage-0-raw-notes.md` (gitignored, not shareable content — this file is the shareable version).

---

## 1. Context/memory files
Every major agentic coding tool now reads a plain-markdown instruction file at project root before acting: `CLAUDE.md` (Claude Code), `AGENTS.md` (an emerging cross-tool convention adopted by Codex CLI, Cursor, and others), `.github/copilot-instructions.md` (Copilot). The pattern is settled: keep it short, keep it pointers not prose, and treat provider-specific files as thin wrappers around one provider-agnostic source (`AGENTS.md`) rather than duplicating content per tool.

*No dedicated deep-dive doc yet for the "per-feature/per-quirk architectural context" question specifically — this is a real gap, distinct from base directives. Related: [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md) (repository legibility — architecture notes, decision records as things agents can discover) and [`personal-harness-architecture.md`](./personal-harness-architecture.md) (capability lifecycle, task state) touch adjacent ground but don't resolve this specific question. Blocked pending a pick from item 10 below.*

**Correction, flagged by the user 2026-08-23: this topic itself has no real deep-dive doc and was being conflated with topic 10.** `memory-and-progress-ledgers.md` (topic 10) is about a *different* question — session/progress ledgers, cross-project memory of decisions and work done. This topic is about the **base instruction file itself**: AGENTS.md/CLAUDE.md/copilot-instructions.md — best practices for what goes in it, root-vs-nested precedence, when/how each tool actually loads it, provider differences. That's never been researched as its own thing here. See `TODO-LIST.md` for the logged follow-up. Also flagged: the user's own `~/.claude/CLAUDE.md` (referenced live in this session's system prompt) appears to be an unreviewed merge of an old personal version and an AI-suggested rewrite from a prior session — nobody ran this topic's eventual research against it before it started being used. Revisit once this topic has a real deep-dive.

**Framing correction, also 2026-08-23 — important for whoever does this research:** per the project's system-agnostic requirement (see `founding-context-dev-stack.md`'s "if Claude disappeared tomorrow" test, ported into the other repo, and the same principle stated fresh here), **`AGENTS.md` is the primary, provider-agnostic source of truth — not `CLAUDE.md`.** Every provider-specific file (`CLAUDE.md`, `.github/copilot-instructions.md`, etc.) should be researched and written up as a thin pointer *to* `AGENTS.md`, not as an equal alternative. Provider-specific content is the exception — only for things a specific tool genuinely can't get any other way — not the default framing. Don't let the eventual deep-dive doc default to Claude-Code-centric examples just because that's the tool in hand.

## 2. Prompt & skill libraries
Anthropic's `SKILL.md` format (a folder with a markdown file plus optional scripts/resources, progressively disclosed into context only when triggered) is a de facto standard for Claude Code and is being mirrored by other tools' "custom command" systems. The unsettled part: whether skills should be personal, project-local, or org-distributed as plugins — practice varies by how much the author expects reuse.

Deep dive: [`skill-libraries-and-marketplaces.md`](./skill-libraries-and-marketplaces.md) — spec state, anti-patterns, marketplaces, individual atomic skills vs. libraries. Reference lists: [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md).

## 3. Session & token economics
Consensus: long-running sessions degrade output quality ("context rot") well before they hit the hard token limit, because irrelevant history competes for the model's attention on every turn. Agreed mitigations: one coherent unit of work per session, proactive `/compact`/`/clear`, and prompt caching (rewarding session *shape* — stable prefix, volatile content appended — over raw brevity). Still evolving: automated context-management hooks that decide *for* you when to compact.

Deep dive: [`session-and-token-economics.md`](./session-and-token-economics.md) — caching cost mechanics, compaction vs. fresh, subagent token impact by provider (including a firsthand corporate-environment audit).

## 4. Subagents / multi-agent delegation
Agreed use case: delegating work whose *intermediate* tool output you don't need to keep — broad exploration, isolated research, parallel independent tasks. Agreed anti-pattern (debated in degree, not direction): using multiple agents as a substitute for review quality ("ask 3 agents, take the majority") — correlated error, not independent verification. The distinction: *fresh-context subagent for scope* (well-supported) vs. *multi-agent voting for confidence* (contested).

Deep dive: [`subagents-and-delegation.md`](./subagents-and-delegation.md) — cross-provider status, bounded-roles-vs-swarms pattern.

## 5. MCP (Model Context Protocol)
Adoption moved from experimental to mainstream fast: by mid-2026, MCP-backed agents are in production at the large majority of enterprise AI teams tracked in industry surveys. In restricted corporate environments, the documented workaround is packaging the same capability as an Agent Skill that wraps a direct API/CLI call instead of running an MCP server. Three-primitive framing gaining traction: **Skills** for reusable capability + know-how, **MCP** for governed live connectivity, **CLI/local execution** underneath both.

Deep dive: [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md) — servers, security, CLI-vs-MCP tradeoff. Related: [`protocol-landscape-acp-a2a.md`](./protocol-landscape-acp-a2a.md) (how MCP relates to ACP/A2A).

## 6. Hooks / automation triggers
Settled as a category: hooks (shell commands firing on tool-call, session-start, session-end, etc.) are the accepted mechanism for deterministic guardrails an LLM shouldn't be trusted to self-enforce. Not contested that they're useful; what's a matter of personal taste is *how much* automation to hang off them.

*No dedicated deep-dive doc yet — a lighter-pass topic, not yet researched beyond this baseline note.*

## 7. Local model use
Converging, previously contested: for a single consumer GPU in the 8GB class, the realistic role is opportunistic — batch/offline jobs where latency doesn't matter — not a default coding-assistant tier. Frontier cloud models still substantially outperform anything that fits in 8GB VRAM for actual coding/reasoning work.

Deep dive: [`local-model-hardware-fit.md`](./local-model-hardware-fit.md) — hardware fit, quantization tradeoffs, Ollama vs. alternatives.

## 8. Review discipline
Agreed: self-review by the same model/context that wrote the code is weak evidence, and multi-agent "consensus" review is correlated rather than independent for the same reason as item 4. The stronger pattern — sometimes called a cold-start or fresh-context critic — is a separate agent with no shared conversation history, forced into a typed verdict, ideally from a different model family. Demanding pasted command output over claimed correctness is close to universal agreement.

Deep dive: [`review-and-verification-tooling.md`](./review-and-verification-tooling.md) — off-the-shelf/IDE-native review tooling, open-source review agents.

## 9. Dotfiles / portability
Chezmoi is the most-referenced current tool for managing a personal config/dotfiles set across multiple machines with templated per-machine divergence — genuinely popular, actively maintained. GNU Stow and plain symlink scripts remain common lighter-weight alternatives; chezmoi's edge is templating at the cost of a steeper tool to learn.

*No dedicated deep-dive doc yet — a lighter-pass topic, not yet researched beyond this baseline note.*

## 10. Personal cross-project memory/ledger
No single agreed tool here — a real gap, not just an unresearched one. Candidates named: Claude Code's own built-in memory system, plain dated journal files, a personal notes vault (Obsidian-class), periodic extraction scripts mining AI session transcripts, gitignored per-repo notes.

Deep dive: [`memory-and-progress-ledgers.md`](./memory-and-progress-ledgers.md) — full evaluation of all candidates, no pick made yet.

## 11. Usage analytics / self-assessment tooling
Confirmed: **AI Engineering Fluency** (VS Code extension, author Rob Bos / rajbos) — reads local session logs from VS Code, Copilot CLI, Claude Code, Gemini CLI, Cursor and others, surfaces token usage/cost/usage-pattern insights in the editor status bar, local-first. Beyond this one extension, the category is small and not yet consolidated.

*No dedicated deep-dive doc — confirmed via this baseline pass, open follow-up (more options in this category) not yet pursued.*

## 12. Security
The volume of new repos/scripts/skills available makes it tempting to just install and use things, but shipping malicious code inside them is easier than ever — closer to old-school piracy risk (grab a pile of loot, find a surprise inside) than typical package-manager trust.

Deep dive: [`security-and-supply-chain.md`](./security-and-supply-chain.md) — verification checklist, real 2026 incidents (ClawHub/OpenClaw, Snyk ToxicSkills), low-effort solo-dev practices.

## 13. Frontend debugging, browser interaction, AI integration tooling
*No dedicated stage-1 deep-dive doc — this ground was covered instead through direct verification passes on user-supplied tool lists. See [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md) → "Design-to-code / browser verification tooling" (chrome-devtools-mcp, browser-use, Skyvern, Stagehand, etc.).*

## 14. IDE inline completion and general tooling (WebStorm / VS Code)
*No dedicated deep-dive doc yet — a lighter-pass topic, not yet researched beyond this baseline note.*

---

## Surfaced later (not part of the original 14 topics)

These emerged mid-process from later research/conversations, not the original Stage 0 pass:

- [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md) — harness engineering, agent loops, context engineering, repository legibility as a connected vocabulary/completeness pass.
- [`personal-harness-architecture.md`](./personal-harness-architecture.md) — concrete build proposals: deterministic context bundling, capability lifecycle management, task state as a dependency graph, async/non-blocking long-running commands.
- [`protocol-landscape-acp-a2a.md`](./protocol-landscape-acp-a2a.md) — ACP, A2A, CLI-vs-MCP for local capabilities.
- [`agent-sandboxing.md`](./agent-sandboxing.md) — code-execution sandboxing, Claude Code's `/sandbox` command.
- [`dev-scoped-second-brain-rag.md`](./dev-scoped-second-brain-rag.md) — RAG over your own codebase/ADRs/notes (not general life-organization).
- Coding-agent harness/model landscape — kept as reference tables in [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md), not a separate topic doc (no distinct educational content beyond listings).

## Surfaced from cross-repo consolidation (not part of the original 14, added 2026-08-23)

- [`planning-before-implementation.md`](./planning-before-implementation.md) — evidence-based planning methodology: when to skip planning, elicitation, decomposition, critique (cold-start review, premortem), when to skip heavyweight spec-driven ceremony. Ported from the old Cowork-session location — this was the one file that never made it across when the projects split. See `decisions/004-cross-repo-consolidation-plan.md`.

## Surfaced 2026-08-23, no deep-dive yet: where agents actually work — global folders, session logs, temp worktrees

Distinct topic, flagged by the user, not yet researched. Coding agents don't only touch the project directory — they keep session logs/temp files/state in global per-tool folders outside the repo (e.g. `~/.claude/`), and some workflows have an agent do its actual work in a temporary directory or git worktree entirely outside the visible project, branching and merging back later. This is real "AI basics" territory — someone new to agentic tooling needs to know this is happening, where to look, and what it means for review/trust. Likely touches token-efficiency and session-economics topics (3) but is its own subject, not a subset. **Do not start researching this yet — log only.** See `TODO-LIST.md` for the scoped follow-up task.

## Surfaced 2026-08-23, no deep-dive yet: scanning/verifying third-party skills and repos for malicious content

Distinct from topic 12 (Security) above, which covers verification *practice* and named incidents generally. This is narrower and more concrete: an actual tool/process pick for scanning a specific skill, plugin, or repo for malicious prompts/code before adopting it — not yet researched as its own question. Check `security-and-supply-chain.md` when it's reviewed (still unread) for whether it already answers this; if not, this needs its own research pass.

## Parked, not Stage 0: graphify
Graphify (turns any input into a queryable knowledge graph with community detection) needs a real corpus to be worth anything. The harness-level instance now has a plausible corpus (this `planning/` folder itself, 14+ docs) worth reconsidering; project-level instances still wait for individual projects to accumulate content. See `education/README.md` → Parked.

---

## Sources
- Anthropic Claude Code documentation and this session's own harness behavior (memory system, hooks, subagents, SKILL.md, prompt caching) — primary source for items 1–6, 8.
- Industry survey coverage of MCP enterprise adoption, July 2026 (andrew.ooo, digitalapplied.com, a2a-mcp.org roadmap coverage) — item 5.
- Xebia engineering blog and DevOps Journal (2026) on the "AI Engineering Fluency" VS Code extension by Rob Bos (rajbos) — item 11.
- chezmoi project (public repo, active maintenance, cross-platform templating) — item 9.
