# Stage 1 — Personal Harness Architecture: Context Bundling, Capability Lifecycle, Task Graphs

Companion to [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md), but different in kind: that doc is a vocabulary/completeness check against industry terminology ("does what we already do have a name, is anything missing"). This one is build-oriented — four concrete architecture components for the user's own personal **agent harness** (industry term, confirmed via live search against Wikipedia/Hugging Face/Martin Fowler: "Agent = Model + Harness," the tool-access/memory/state/feedback-loop layer around a model). This repo's own branding for that harness is "developer stack" — that's identity, not a competing technical term; use "harness" in technical writing so the vocabulary matches how the field actually talks about this, which is the point of matching established phrasing in the first place. No pick — architecture patterns to consider, not a mandate, consistent with every other stage-1 doc here.

Surfaced from a ChatGPT conversation the user had, reframed by them from Angular-specific advice to their actual goal (a project-agnostic personal harness). Three ideas the user originally singled out as worth developing further, plus a fourth (async execution) added from a follow-up idea of their own.

---

## 1. Deterministic context bundling before model calls

**The idea.** Instead of letting an agent burn early turns on exploratory discovery (read this file, grep that pattern, list this directory), a script generates a compact, deterministic fact-bundle up front — project facts, architecture map, relevant files, known constraints, available commands, current task state — and that bundle is what the model actually reasons over.

**Why it's not just a restatement of context engineering.** [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md) section 3 already covers context engineering as a discipline (curating the smallest high-signal token set, just-in-time retrieval over front-loading). This idea is a specific *mechanism* for the front-loading side of that discipline: a deterministic, scriptable preprocessing step, not a prompting technique. The distinction matters because it's testable and versionable in a way "write a good system prompt" isn't — the bundle-generation script is itself a piece of code with inputs and outputs, reviewable and improvable independently of any specific model call.

**Relevant prior art the user already has.** The user reports already informally building something in this shape for their own "review utils" and finding it effective — worth treating that as the starting design reference when this gets built for real, rather than designing from scratch. (No details on that tool were given here — don't invent them; when this gets built, start by looking at what's already working there.)

**What the bundle would plausibly contain, for this repo's own use case specifically:**
- Which stage-1 docs exist and their one-line scope (a table of contents, not the content)
- What's already in [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md) (so research forks don't re-verify something already promoted)
- Whether a similar claim was already checked and discarded before (see the "Checked and discarded" notes in `_ai-tooling-recommendations.md`)
- Open items from `TODO-LIST.md` equivalents / decision records

**Where this sits relative to MCP/skills.** Per [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md)'s CLI-vs-MCP section (added by a parallel research pass): this is squarely a CLI-script job, not an MCP server — deterministic, local, versioned with the repo, no need for a standardized external protocol.

### The concrete design: a "context compiler" / tool shelf

The user pushed further on this idea with a sharper follow-up question and got back a much more specific design worth recording in full, since it's the most load-bearing of the three ideas in this doc given how much engagement it's had.

**Source-attribution correction, checked before writing this up:** the design below was attributed to Martin Fowler's "Context Engineering for Coding Agents" (martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html, Birgitta Böckeler, 5 Feb 2026 — a real, current, checkable article). Fetched directly to verify: **the attribution doesn't hold.** That article is a primer on context *configuration features* (CLAUDE.md, Rules, Skills, Subagents, MCP servers, Hooks, Plugins) and the general principle of keeping context small — it does not describe a collector/normalizer/renderer pipeline, structured subagent-result contracts, or JSON-reporter preferences. Treat everything below as a design proposal surfaced in conversation, not something with a citable primary source behind its specifics — same failure pattern already seen elsewhere in this research (real link, invented or over-specific detail attached to it). The general "small, scoped context" principle it does support is already covered in [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md) section 3.

**The pipeline.** Four separate concerns, not one blob:

```
raw project data → collector → normalized result → renderer → task-specific bundle → agent/subagent
```

- **Collector** — retrieves and filters raw information (reads a build log, runs `git diff`, queries a dependency graph).
- **Normalized result** — a machine-readable intermediate (JSON, JSONL, or SQLite), not prose.
- **Renderer** — turns the normalized result into concise Markdown/XML sized for the target agent.
- **Prompt** — explains what the agent should do with the bundle; it should describe the task and interpretation rules, not contain a manually assembled dump of logs or source files.

**Proposed shape** (a plausible starting layout, not a spec to follow exactly):

```
ai-kit/
├── contexts/<situation>/{context.yaml, collect.ts, render.md}
├── tools/{repo-map, test-summary, build-summary, git-context, dependency-graph}
└── prompts/*.md
```

**Worked example — build failure.** Instead of handing an agent 5,000 lines of raw build output, a `build-summary` tool produces something like:

```json
{
  "command": "npm run build", "exitCode": 1, "durationMs": 42100, "status": "failed",
  "errors": [{"file": "src/app/orders/orders.component.ts", "line": 42, "column": 9,
              "code": "TS2339", "message": "Property 'total' does not exist on type 'Order'"}],
  "warnings": 3,
  "affectedFiles": ["src/app/orders/orders.component.ts", "src/app/orders/order.service.ts"],
  "rawLogPath": ".ai/artifacts/build-2026-08-23.log"
}
```

The raw log stays on disk, retrievable if a follow-up investigation actually needs it — it's just not in the initial context. The same principle applies to any long/noisy command: retain exit code, duration, errors, warnings, affected files, test counts, failed-test names, artifact paths, and a short tail of raw output for genuinely unexpected failures — not the full scrollback.

**Prefer structured reporters over scraping.** `tsc --pretty false`, `jest --json`, `playwright test --reporter=json`, `eslint --format=json` — parse JSON where a tool offers it; fall back to text-scraping only when no structured reporter exists. This is a plain, checkable engineering fact about these tools (they do support these flags), not something that needed the Fowler citation to stand on.

**Contexts should be task-shaped, not universal.** Narrow, situation-specific bundles instead of one giant "everything about this project" dump: `repo-orientation`, `implementation-context`, `build-failure`, `change-review`, `dependency-impact`, `test-failure`, `architecture-investigation`. Each is a different question the model is trying to answer, and each needs different inputs.

**Subagents should get different context contracts, not copies of the same bundle.** A "repository scout" gets read-only search tools and no edit permissions; an "implementation agent" gets target files, conventions, tests, and acceptance criteria; a "review agent" gets the diff, spec, and quality gates. Each returns a **structured result** — `{status, confidence, summary, evidence: [{file, line, reason}], recommendedNextAction, needsMoreContext}` — rather than its full exploration transcript, so a coordinator receives a conclusion plus evidence, not a raw search trace. Cross-checked against what this repo already has: [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md) section 5 already independently documents this exact "primary agent owns the task, specialized agents produce bounded findings, primary agent integrates" pattern as the one already in live use across this whole curation project (the parent conversation's own fork-dispatch-and-merge workflow). This design item is a refinement of that already-adopted pattern (typed result shape, differentiated permissions per subagent role), not a new discovery — and it stands on that already-verified basis, independent of the unconfirmed Fowler attribution above.

**Manifest per context.** A small `context.yaml` (name, version, description, inputs, output format/schema, limits like `maxSourceExcerptLines`/`maxErrors`, activation mode) makes each context inspectable and its token cost measurable — a loggable record of context name, input files, output bytes, estimated tokens, model, task, and result, which is what would actually show which context builders are worth keeping.

**Distinct from Repomix.** [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md) already lists `yamadashy/repomix` (verified real elsewhere in this research) as a broad repo-packager — pack-everything-into-one-file for general LLM consumption. This design is the opposite instinct: narrow, task-specific, normalized-then-rendered bundles, not a single broad pack. Different tool for a different job, not a competing pick.

**A plausible starter tool-shelf:** `repo-map`, `git-diff-context`, `build-summary`, `test-summary`, `changed-symbols`, `dependency-impact`, `source-excerpt`, `project-context`, `task-state`. Skills and prompts would then become thin adapters over these deterministic providers, instead of each skill re-inventing its own way to inspect the repository.

---

## 2. Capability lifecycle management

**The idea.** Treat skills and tools as managed packages with a real lifecycle rather than files that just exist or don't:

```
discover → review → trust → install → scope → activate → update → disable/remove
```

Each capability carries metadata: owner/source, version, trust level, which agents/runtimes it supports, project-or-global scope, activation conditions, dependencies, and a removal path.

**Why this is a real gap, not a restatement of anything already researched.** [`skill-libraries-and-marketplaces.md`](./skill-libraries-and-marketplaces.md) covers what a skill *is* (spec, anti-patterns, distribution) and [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md) now holds a growing list of *candidate* skills to try. Neither addresses what happens *after* a skill is picked: how it's tracked as trusted-or-not, how a version bump gets noticed, how something gets safely removed once superseded. This repo has already lived this gap directly — `decisions/001-first-design-skill-picks.md` records three picks (MengTo/Skills, Claude Design, an unverified `naksha-studio` find) with no formal trust level, no version pin, no defined removal path if one doesn't work out. That decision record is effectively lifecycle-management step 1-2 (discover, informally review) done ad hoc; the remaining steps aren't tracked anywhere yet.

**Direct connection to security research.** [`security-and-supply-chain.md`](./security-and-supply-chain.md) already documents why "trust" can't be assumed — the ClawHub/OpenClaw marketplace poisoning (real incident, 30+ malicious skills at peak) is exactly the failure mode a lifecycle's "review → trust" gate exists to catch. A lifecycle framework is the structural answer to what that doc currently only frames as a checklist.

**A minimal version worth trying before building anything elaborate:** a single `skills/REGISTRY.md` (or small JSON/YAML file) per installed capability — source URL, date added, trust note (why it passed the bar, per `docs/reasoning.md`'s own evidence bar), version/commit pinned at install time, and scope (global vs. this-project-only). This is deliberately the lightest possible version of the pattern, consistent with this repo's stated anti-speculative-infrastructure stance — not a package manager, just a place the "discover → review → trust" steps leave a trace, so "update → disable/remove" has something to act on later.

---

## 3. Task state as a dependency graph, not a flat list

**The idea, and its real source.** [`gastownhall/beads`](https://github.com/gastownhall/beads) (verified live via GitHub API: 26,529 stars, 1,785 forks, pushed within the last day — real, active, healthy) replaces flat markdown task lists with a dependency graph agents can query, claim, update, and close: `task A blocks task B and task C`, and an agent works the next unblocked item rather than being handed one giant linear plan. Maintainer is Steve Yegge, a real, long-established, checkable software engineer/blogger — the same person behind "Gas Town" (`gastownhall` is his org), referenced in the same source dump as an orchestration experiment the user was correctly advised not to prioritize. Beads itself is a much smaller, more directly useful idea than Gas Town's orchestration scope — worth treating as a separate, lighter-weight thing to actually consider, not bundled with the "don't start here" verdict on Gas Town.

**Why this goes beyond Topic #10's existing research.** [`memory-and-progress-ledgers.md`](./memory-and-progress-ledgers.md) (read in full for this doc) evaluates four options for a cross-project *ledger* — Claude Code's built-in memory, plain dated journals, an Obsidian vault, or periodic JSONL-log extraction. All four are fundamentally **linear/append-only**: a record of what happened. None of them model *dependency relationships between not-yet-done work* — which is what Beads' actual proposition is. These aren't competing options; a ledger answers "what happened and why," a task graph answers "what can I work on right now given what's still blocked." A real personal harness plausibly wants both: a ledger for history, a graph for active work state. Worth noting explicitly when Topic #10's pick eventually gets made — that decision doesn't have to also decide this one.

**What's worth borrowing without adopting Beads itself.** The user doesn't need the tool to use the idea. A minimal version for this repo's own scale: a small JSON or SQLite file with per-task status, dependencies (which other tasks block it), the validation/completion condition, and which files/decisions it touched — small enough to hand-maintain or script against, without taking on Beads as a dependency until the graph shape has actually proven useful at this repo's size. This is a smaller-scale version of the same "durable external state beats trusting the model to remember" pattern already covered in [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md) section 2 (the Anthropic two-agent-harness correction) — the graph structure is what's new, not the "keep state in a file" principle itself.

---

## 4. Asynchronous, non-blocking long-running commands

**The gap.** Confirmed via grep across every existing `planning/*.md` file — nothing in this repo's research addresses this. It's a real, previously-uncovered idea, not a restatement.

**The idea, in the user's own framing.** Running a test suite (or any long, noisy command) synchronously is expensive in a way that's easy to overlook: the agent sits blocked for the command's full wall-clock duration, and the output that eventually comes back is often mostly noise relative to what actually matters (pass/fail, which tests, why). The proposal: let the harness launch the long-running command detached, let the agent continue other work or go idle, and have something inject a concise result back — event-driven, not the agent polling in a loop and not the agent blocked waiting.

**This isn't hypothetical in Claude Code — it's the exact mechanism already running this whole research session.** The Bash tool's `run_in_background` parameter lets a command execute detached from the turn; when it finishes, the harness delivers a `<task-notification>` back into the conversation on a later turn rather than the calling agent blocking on the tool call. The `ScheduleWakeup` tool (schedule a check-in at a future time without polling) and a `Monitor` tool (stream events from a background process, e.g. an until-loop waiting on a check command) are the same family of mechanism, one layer further. Every fork dispatched across this entire curation project used exactly this pattern — launch, continue the conversation, receive an async completion notification.

**Correction — this is not yet a cross-vendor solved pattern, and the harness must be designed agent-agnostic, not assumed-solved from one vendor's behavior.** The user pushed back directly on an earlier draft of this section (2026-08-23) with a real, firsthand counter-observation: in their corporate environment, an agent kicking off a test suite via Copilot or Gemini just blocks and waits — it does not appear to use background execution to stay productive while tests run, even though the corporate-environment audit recorded above (see [`session-and-token-economics.md`](./session-and-token-economics.md), "Firsthand corporate-environment observation") confirms Gemini CLI's own interface *does* expose "background-process management and background-output retrieval" as a real capability. That gap — the primitive existing but the agent not reaching for it unprompted — is the load-bearing finding here, and the user named the likely cause themselves: this may be an instruction/skill-design gap (the agent was never told, or never learned, to prefer the async path for long commands) rather than proof the capability is Claude-only or absent elsewhere. Copilot's async/background story specifically remains unconfirmed either way (not yet tested in the corporate audit).

**What this means for the design:** don't build this as "wrap Claude Code's `run_in_background`" and call it portable — that's a single-vendor implementation detail, not a design. The actual harness-level requirement is provider-agnostic: (1) confirm what native async/background primitives each target agent (Claude Code, Copilot CLI, Gemini CLI) actually exposes — Gemini's corporate account already shows one; Copilot CLI specifically (distinct from the JetBrains extension) is still untested; (2) where a native primitive exists, write the skill/instruction that actually tells the agent to prefer it for long commands — since the evidence so far suggests the gap is "unused," not "unavailable"; (3) where no native primitive exists or isn't confirmed, the harness needs a fallback of its own — a detached-process wrapper plus a hook or polling mechanism outside the agent's own tool schema — so the pattern still works regardless of which agent is driving. The goal is a harness-level capability the agent can be pointed at consistently, not a dependency on any one vendor's tool surface.

**How it connects to what's already in this doc and in the baseline research:**
- **Structured reporters (section 1 above)** are the right *shape* for what gets injected back on completion — a `test-summary` JSON object (pass/fail counts, failed test names, durations), not raw scrollback. The async-delivery mechanism and the deterministic-summarization mechanism are two halves of the same pattern: run detached, summarize deterministically, deliver concisely.
- **Hooks** (already named as a settled category in [`topic-index.md`](./topic-index.md): "the accepted mechanism for deterministic guardrails... injecting fresh context on resume") are a plausible trigger point for generating that summary the moment a background process exits, rather than needing the agent itself to notice and go check.

**What this means for a personal harness, practically:** a general-purpose async-run wrapper around long commands (tests, builds, installs) that (a) launches detached, (b) pipes output through a structured reporter/summarizer where one's available, (c) writes the raw log to disk regardless, and (d) delivers a short structured result back into the active session when done — is a concrete, buildable piece, and one the user already has working proof-of-concept exposure to via this very session's own tooling.

---

## How these four relate to each other

The core three aren't independent: the context bundle (#1) plausibly *reads from* the task graph (#3) to know current task state, and *reads from* the capability registry (#2) to know which skills/tools are actually active before describing them to the model. None needs to exist before the others — each is independently useful in its minimal form — but if all three eventually get built, the natural order is registry first (cheapest, most standalone), then task graph (next cheapest, mostly local), then context bundling last (the piece that pulls from both of the others plus the repo itself). Async execution (#4) is orthogonal to that ordering — it's a delivery mechanism that plugs into #1 (structured results are what gets delivered) whenever it gets built, not a dependency of the other three.

## Open questions / weak sourcing

- The user's own "review utils" prior art wasn't described in detail here — worth referencing directly (not from this doc) when actually building #1.
- **The Martin Fowler citation for #1's detailed pipeline design does not hold up** — fetched directly, the article covers context-configuration features generally, not the collector/normalizer/renderer pipeline, JSON-reporter preference, or structured-subagent-result specifics attributed to it. The subagent-contract portion of that design stands independently, cross-checked against [`harness-engineering-vocabulary.md`](./harness-engineering-vocabulary.md) section 5's already-verified fork-based pattern — but the rest of the pipeline design (directory shape, manifest format, worked build-summary example) is a design proposal without a primary source behind it, not yet a sourced industry pattern. Treat it as "worth trying," not "this is how the field does it."
- Beads' star count (26,529) is a live, verified number as of this research pass — will drift; re-check before citing an exact figure elsewhere.
- No existing tool was found or evaluated for #2 (capability lifecycle management as a named, adoptable tool) — this section is a proposed pattern, not a survey of existing implementations, unlike most other stage-1 docs in this repo. Worth flagging that asymmetry: #1 and #3 point at real prior art, #2 is closer to original design work.
- #4 has no external tool survey — it's a naming-the-gap-and-connecting-existing-pieces note, not a new research area with its own literature to check.
