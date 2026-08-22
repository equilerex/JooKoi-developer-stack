# Stage 1 — Subagents / Multi-Agent Delegation

Stage 0 established the core distinction: fresh-context subagents for *scope* (well-supported) vs. multi-agent voting for *confidence* (contested, correlated error). This stage builds on that — sharper Claude Code practice, and closing the specific gap of whether Copilot/Gemini have an equivalent primitive at all.

## Claude Code subagents — sharper practice

**When to delegate:** research-heavy tasks touching 10+ files, work that splits into 3+ independent pieces, sequential pipelines with distinct phases, or anything needing a genuinely clean slate — "fresh context when unbiased analysis matters," per Anthropic's own guidance. A useful rule of thumb from the same source: if a task would flood the main session with search results, logs, or file contents you'll never look at again, that's the signal to delegate — the noise stays in the subagent's window, only the conclusion returns.

**Writing a good subagent brief:** scope clearly rather than vaguely, name the desired output format explicitly (summary, findings list, recommendation), and if multiple independent tasks exist, request them run in parallel rather than issuing them one at a time. Anthropic's guidance treats this as a decomposition skill, not a prompting trick — the actual work is identifying which tasks are self-contained and which specialist should own which domain.

**When NOT to delegate — the anti-patterns:**
- Sequential, dependent work where step two needs step one's full output (the isolation that makes subagents useful is exactly what breaks this)
- Parallel subagents editing the same file (conflicts)
- Small, quick tasks — a subagent's fixed overhead (full context spin-up, round trip) can exceed the task itself
- Defining a custom subagent for every conceivable task — a handful of well-scoped ones outperform a sprawling roster
- Tight coupling between subagent tasks that forces them to coordinate with each other mid-flight

Anthropic's own applied guidance also notes three-to-five concurrent subagents as the practical sweet spot for most jobs — beyond that, coordination overhead tends to eat the gain.

## Copilot CLI — yes, and actively being tuned

GitHub Copilot CLI has real subagent delegation, and it's an active area of work, not a static feature. Two mechanisms:

1. **Automatic delegation** — the CLI decides on its own when to hand a subtask to a subagent (e.g. exploring an unfamiliar part of the repo, running a long command). GitHub shipped a "smarter subagent delegation" update in 2026 specifically to make this *more selective* — the prior version delegated too eagerly, and the fix measurably helped: a production A/B test showed a 23% reduction in tool failures per session (27% for search-tool failures, 18% for edit-tool failures) and modest wait-time improvements, with no quality loss. This is now at 100% of production traffic.
2. **Explicit delegation** — the `/delegate` command (or the `&` shorthand) sends a task to a GitHub-hosted Copilot cloud agent, which works in the background on a branch and opens a draft pull request. This is a different shape than Claude Code's in-session subagents — it's closer to "hand this off and check back later" than "spawn a helper in this conversation."

No skill/extension install needed for either — both are built into current Copilot CLI.

## Gemini CLI — yes, shipped April 2026

Google added subagents to Gemini CLI in v0.36 (April 15, 2026). Same shape as Claude Code's: each subagent gets its own instructions, own context window, and optionally its own restricted tool set, run in parallel rather than sequentially. Google ships several built-in subagents out of the box — a general-purpose assistant, a CLI helper, and a codebase-investigation agent — so nothing needs to be authored from scratch to start using them. One real difference worth knowing: Gemini 2.5 Pro's context window (1M+ tokens) dwarfs Claude's per-subagent window (roughly 200–400K), which matters if a subagent's job is genuinely to hold a huge amount of source material at once rather than to stay scoped.

**Bottom line on the original question:** both Copilot and Gemini CLI now have real subagent primitives, built in, no extra setup — the gap that existed when this was last checked has closed. The concepts transfer directly from Claude Code practice above; the syntax differs per tool.

## Third-party orchestration frameworks — mostly not the relevant layer here

CrewAI, AutoGen, and LangGraph solve a different problem than personal dev-tooling delegation: they're for building standalone multi-agent *applications* (a product with agents as its architecture), not for delegating tasks inside a coding session. Worth knowing regardless:

- **CrewAI** — lowest barrier to entry, "agents as roles/tasks" abstraction, good for quick prototypes. Teams commonly graduate off it once a system needs production reliability.
- **LangGraph** — the production-grade option: durable execution, checkpointing, human-in-the-loop support, LangSmith observability. More boilerplate than a two-agent prototype wants.
- **AutoGen** — flag this clearly: Microsoft moved it to maintenance mode (bug/security fixes only, no new features), and the project's own README now points new users to Microsoft Agent Framework instead. Don't adopt AutoGen for anything new.

None of these are a fit for "delegate a subtask within my coding session" — that's what Claude Code/Copilot/Gemini's native subagents already do. They'd only become relevant if a future project's actual *product* needed a standalone multi-agent system as its architecture (not the case for anything currently in scope).

## Sources

- [How and when to use subagents in Claude Code](https://claude.com/blog/subagents-in-claude-code) — Anthropic, primary source for Claude Code practice section
- [How we made GitHub Copilot CLI more selective about delegation](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/) — GitHub Engineering blog, primary source, includes A/B test numbers
- [GitHub Copilot CLI Custom Agents and /delegate Guide](https://www.itechguides.com/github-copilot-cli-create-custom-agents-and-delegate-work-to-copilot-cloud-agent/) — secondary, corroborates `/delegate` mechanics
- [Subagents in Gemini CLI Enable Task Delegation and Parallel Agent Workflows](https://www.infoq.com/news/2026/04/subagents-gemini-cli/) — InfoQ, corroborated by multiple independent write-ups (geminicli.one, pasqualepillitteri.it) on version number and ship date
- Multiple 2026 framework-comparison pieces (Pickaxe, Galileo, DataCamp, OpenAgents) cross-checked for the CrewAI/LangGraph/AutoGen summary — directionally consistent across sources on the AutoGen maintenance-mode status and LangGraph's production lean
