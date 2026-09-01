# Stage 1 — Subagents / Multi-Agent Delegation

Imagine asking an assistant to research something, and instead of doing all the messy digging themselves and cluttering the desk with piles of paper, they send an intern off to do the digging in another room and only bring back a one-page summary. A "subagent" is that intern — a helper the AI spins up to handle one chunk of work separately, so all the clutter it generates doesn't pile up in your main conversation. Worth knowing about if you have long AI coding sessions that slow down or get confused over time; skip it if your sessions are always short and simple.

Stage 0 established the core distinction: fresh-context subagents for *scope* (well-supported) vs. multi-agent voting for *confidence* (contested, correlated error). This stage explains the subagent concept itself — what it is, why it exists, when it helps and when it doesn't — then compares how Claude Code, Copilot CLI, and Gemini CLI implement it.

## What is a subagent?

A **subagent** is a separate agent instance that a parent agent (sometimes called the orchestrator) invokes to handle one bounded piece of work, then returns control to the parent. Concretely: the parent sends a task description, the subagent runs its own tool-calling loop (reading files, running commands, searching) to complete it, and reports back a result — a summary, a set of findings, a diff. The parent then decides what to do with that result.

This is different from just "running another prompt." The defining feature is **context isolation**, explained below.

### Why the pattern emerged

Agent harnesses work inside a **context window** — the fixed amount of text (conversation history, file contents, tool output) a model can hold at once. Long coding sessions fill that window fast: reading a dozen files to find one function, running a build and reading its log, grepping across a repo. None of that raw material matters once you have the answer — but if it all happened in the main conversation, it stays there, taking up space and making everything after it slower and more expensive to process.

Subagents exist to solve this: push the exploratory, disposable work into a side context that gets thrown away, and only bring back the conclusion.

### What happens to a subagent's context

A subagent starts with a **fresh context window** — it does not see the parent's conversation history unless the parent explicitly includes it in the task description. Everything the subagent reads or does (files opened, commands run, search results) stays inside its own context. When it finishes, only its final report is passed back to the parent — the parent's context grows by that report, not by everything the subagent did to produce it.

This isolation is also why subagents are good for getting an unbiased second look: a subagent reviewing code for bugs, for instance, isn't anchored by the same assumptions the parent already built up over a long session.

### Why delegation reduces context pollution

Every tool call and file read in the main conversation is permanent until you compact or clear it — the model has to keep re-processing all of it on every subsequent turn. If reading 15 files to answer "where is X handled" only ever mattered for producing one paragraph of answer, keeping those 15 files' contents in the main context forever is pure waste. Delegating that search to a subagent means the 15 files' worth of noise lives and dies in the subagent's window; the main conversation only gains the one paragraph.

### When delegation saves tokens

Delegation is a net win when the **raw output volume is much larger than the useful conclusion**, and the parent has no further need for that raw material:
- Broad codebase exploration ("find every place this API is called")
- Reading logs, build output, or test results to extract one fact
- Research that produces a synthesized answer, where the sources themselves don't need to stay in context
- Independent investigations that don't depend on each other

### When delegation costs more tokens

Every subagent invocation has fixed overhead: spinning up a fresh context, re-stating enough background for it to act usefully, and the round trip of sending the task and receiving the report. For small work, that overhead can exceed just doing the task inline:
- One-line fixes, single-file edits, anything you could do in one or two tool calls yourself
- Tasks that need most of the running conversation's context restated anyway — if the brief has to include half of what's already in the parent's history, you haven't isolated anything
- Several parallel subagents each independently re-reading the same shared files or background — the duplication costs more than one agent reading it once

### Good delegation candidates

- Independent, self-contained investigations ("how does auth work in this repo," "what changed between these two versions")
- Several unrelated fixes/tasks that don't touch the same files and don't depend on each other's output
- Research whose only useful product is a summary — the sources or search trail aren't needed afterward

### Poor delegation candidates

- Tightly coupled, sequential work where step two needs step one's full detailed output, not just a summary (the isolation that makes subagents useful is exactly what breaks this — the parent would have to relay everything back in anyway)
- Tiny, mechanical changes
- Anything that genuinely needs the full running conversation's context to make correct decisions
- Parallel subagents that would edit the same file (conflicts, no coordination between them)

### Automatic vs. explicit delegation

Both exist, depending on the harness. Some harnesses decide on their own when to hand a subtask to a subagent — e.g. Copilot CLI's automatic delegation for unfamiliar-repo exploration or long-running commands (see implementation section below). Others require the developer to explicitly invoke a subagent (a slash command, an explicit "use a subagent for this" instruction, or a named agent type). Claude Code supports both: it can suggest delegation, but a developer can also explicitly request `Task`/subagent invocation, or configure custom subagents for specific roles.

**When to deliberately ask for a subagent yourself:** when you can see, before starting, that a piece of work is going to generate a lot of disposable exploration (a "map this unfamiliar module" or "find every caller of X across the repo" task), or when you want a genuinely independent second opinion (e.g. a code review that isn't anchored by the same context that produced the code). If you're not sure the task will generate much noise, it's usually cheaper to just do it inline and delegate next time if it turns out to be bigger than expected.

### Parallel delegation

Running multiple subagents **concurrently** (rather than one after another) additionally saves wall-clock time, not just context: independent investigations that don't depend on each other's results can run at the same time and report back together. This only helps when the tasks are genuinely independent — parallel subagents that need to coordinate mid-task, or that would touch the same files, reintroduce the coupling problems above. A practical ceiling several sources converge on is roughly three to five concurrent subagents for most jobs; beyond that, the overhead of managing and integrating their outputs tends to eat the gain.

### Simple subagents vs. multi-agent orchestration frameworks

The built-in subagent primitives in Claude Code, Copilot CLI, and Gemini CLI are all the same basic shape: a **bounded task handoff** — parent delegates, subagent runs once, reports back, done. There's no persistent state between invocations and no subagent-to-subagent communication.

Open-source multi-agent orchestration frameworks (CrewAI, AutoGen, LangGraph — see below) go further: they add **persistent roles** (an agent that stays "alive" across many tasks with its own memory), **shared state or queues** (a blackboard or message queue multiple agents read and write to), and **inter-agent messaging** (agents that talk directly to each other, not just to a single orchestrator). This is a fundamentally different architecture, built for standalone multi-agent *products*, not for delegating a subtask inside a coding session.

### When "multi-agent" becomes unnecessary complexity

Most day-to-day development work does not need a persistent multi-agent system. A single agent that occasionally delegates bounded subtasks covers the large majority of real tasks — investigate something, fix something, review something. Reach for a full orchestration framework only when the actual deliverable *is* a standalone multi-agent system (e.g. building a product where multiple long-lived agent roles coordinating is the point), not as a way to make a single coding session feel more sophisticated. Unstructured "swarms" of agents freely coordinating with no single owner mostly produce noise unless roles, handback artifacts, and merge criteria are explicitly defined — see "Bounded roles vs. unstructured swarms" below.

## Implementation comparison

The concepts above transfer directly across tools — what differs is syntax and defaults. This section is secondary detail, not the main story.

### Claude Code subagents — practice

**When to delegate:** research-heavy tasks touching 10+ files, work that splits into 3+ independent pieces, sequential pipelines with distinct phases, or anything needing a genuinely clean slate — "fresh context when unbiased analysis matters," per [Anthropic's subagent guidance](https://www.claude.com/blog/subagents-in-claude-code). A useful rule of thumb from the same source: if a task would flood the main session with search results, logs, or file contents you'll never look at again, that's the signal to delegate — the noise stays in the subagent's window, only the conclusion returns. See the official [subagents documentation](https://docs.claude.com/en/docs/claude-code/sub-agents) for how to configure named, reusable subagent roles.

**Writing a good subagent brief:** scope clearly rather than vaguely, name the desired output format explicitly (summary, findings list, recommendation), and if multiple independent tasks exist, request them run in parallel rather than issuing them one at a time. Anthropic's guidance treats this as a decomposition skill, not a prompting trick — the actual work is identifying which tasks are self-contained and which specialist should own which domain.

Developer note: make sure we will compile a list of reoccuring tasks where prepreparing scraper/helper scripts and premade prompts for firing off subagents would save on token usage and improve the process.

**Anti-patterns** (see the poor-candidate list above for the underlying reasoning): sequential dependent work, parallel subagents editing the same file, small quick tasks, a custom subagent defined for every conceivable scenario instead of a handful of well-scoped ones, and tight coupling that forces subagents to coordinate mid-flight.

### Copilot CLI — yes, and actively being tuned

[GitHub Copilot CLI](https://github.com/features/copilot/cli) has real subagent delegation, and it's an active area of work, not a static feature. Two mechanisms:

1. **Automatic delegation** — the CLI decides on its own when to hand a subtask to a subagent (e.g. exploring an unfamiliar part of the repo, running a long command). GitHub shipped a "smarter subagent delegation" update in 2026 specifically to make this *more selective* — the prior version delegated too eagerly, and the fix measurably helped: a production A/B test showed a 23% reduction in tool failures per session (27% for search-tool failures, 18% for edit-tool failures) and modest wait-time improvements, with no quality loss. This is now at 100% of production traffic.
2. **Explicit delegation** — the `/delegate` command (or the `&` shorthand) sends a task to a GitHub-hosted Copilot cloud agent, which works in the background on a branch and opens a draft pull request. This is a different shape than Claude Code's in-session subagents — it's closer to "hand this off and check back later" than "spawn a helper in this conversation."

No skill/extension install needed for either — both are built into current Copilot CLI.

### Gemini CLI — yes, shipped April 2026

Google added subagents to [Gemini CLI](https://github.com/google-gemini/gemini-cli) in v0.36 (April 15, 2026). Same shape as Claude Code's: each subagent gets its own instructions, own context window, and optionally its own restricted tool set, run in parallel rather than sequentially. Google ships several built-in subagents out of the box — a general-purpose assistant, a CLI helper, and a codebase-investigation agent — so nothing needs to be authored from scratch to start using them. One real difference worth knowing: [Gemini 2.5 Pro](https://deepmind.google/models/gemini/pro/)'s context window (1M+ tokens) dwarfs Claude's per-subagent window (roughly 200–400K), which matters if a subagent's job is genuinely to hold a huge amount of source material at once rather than to stay scoped.

**Bottom line:** both Copilot and Gemini CLI now have real subagent primitives, built in, no extra setup — the gap that existed when this was last checked has closed. The concepts above transfer directly; the syntax differs per tool.

## Bounded roles vs. unstructured swarms

Worth naming explicitly, since it's easy to conflate "use more subagents" with "better results." The pattern that actually works:

```
primary agent owns the task
specialized subagents produce bounded findings
primary agent integrates and verifies
```

Not: several agents freely coordinating with each other mid-task with no single owner. An unstructured "swarm" — agents talking to each other, no clear final integrator — mostly produces noise unless it has clear roles, defined artifacts each agent hands back, and explicit merge criteria for how the primary agent reconciles them. This is consistent with the "3-5 concurrent subagents as the practical sweet spot" and "avoid tight coupling" guidance above — it's the same finding stated as a named anti-pattern rather than left implicit.

## Third-party orchestration frameworks — mostly not the relevant layer here

[CrewAI](https://github.com/crewAIInc/crewAI), [AutoGen](https://github.com/microsoft/autogen), and [LangGraph](https://github.com/langchain-ai/langgraph) solve a different problem than personal dev-tooling delegation: they're for building standalone multi-agent *applications* (a product with agents as its architecture), not for delegating a task inside a coding session. Worth knowing regardless:

- **CrewAI** — lowest barrier to entry, "agents as roles/tasks" abstraction, good for quick prototypes. Teams commonly graduate off it once a system needs production reliability.
- **LangGraph** — the production-grade option: durable execution, checkpointing, human-in-the-loop support, [LangSmith](https://www.langchain.com/langsmith) observability. More boilerplate than a two-agent prototype wants.
- **AutoGen** — flag this clearly: Microsoft moved it to maintenance mode (bug/security fixes only, no new features), and the project's own README now points new users to [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) instead. Don't adopt AutoGen for anything new.

None of these are a fit for "delegate a subtask within my coding session" — that's what Claude Code/Copilot/Gemini's native subagents already do. They'd only become relevant if a future project's actual *product* needed a standalone multi-agent system as its architecture (not the case for anything currently in scope).

## Sources

- [How and when to use subagents in Claude Code](https://www.claude.com/blog/subagents-in-claude-code) — Anthropic, primary source for Claude Code practice section
- [Claude Code subagents documentation](https://docs.claude.com/en/docs/claude-code/sub-agents) — Anthropic, official reference for configuring subagents
- [How we made GitHub Copilot CLI more selective about delegation](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/) — GitHub Engineering blog, primary source, includes A/B test numbers
- [GitHub Copilot CLI Custom Agents and /delegate Guide](https://www.itechguides.com/github-copilot-cli-create-custom-agents-and-delegate-work-to-copilot-cloud-agent/) — secondary, corroborates `/delegate` mechanics
- [Subagents in Gemini CLI Enable Task Delegation and Parallel Agent Workflows](https://www.infoq.com/news/2026/04/subagents-gemini-cli/) — InfoQ, corroborated by multiple independent write-ups (geminicli.one, pasqualepillitteri.it) on version number and ship date
- Multiple 2026 framework-comparison pieces (Pickaxe, Galileo, DataCamp, OpenAgents) cross-checked for the CrewAI/LangGraph/AutoGen summary — directionally consistent across sources on the AutoGen maintenance-mode status and LangGraph's production lean
</content>
</invoke>
