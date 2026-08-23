# Stage 1 — Session & Token Economics, and Subagent Cost by Provider

Topic #3 from the baseline, expanded per an explicit follow-up request: cover subagent/sub-process token impact with named per-provider sections rather than an agent-agnostic summary, and answer directly whether Claude Code's proactive subagent spawning is a capability gap, a corporate-tier restriction, or something requiring custom tooling elsewhere.

## Section A — Session & token economics

### How prompt caching actually prices out

Per Anthropic's own pricing docs (platform.claude.com/docs/en/build-with-claude/prompt-caching):

| Operation | Cost vs. base input |
|---|---|
| 5-minute cache write | 1.25x |
| 1-hour cache write | 2x |
| Cache read (hit) | 0.1x |

A cache write is not free — it's a premium (25-100% over base price) paid once to make later reads cheap. A read is a 90% discount, not a 100% one. Every single turn in a long session still pays that 0.1x on the entire cached prefix, on top of full price for whatever's new since the last breakpoint. That's the concrete answer to "does a bigger context cost more even when cached": yes, linearly, just at a tenth of the rate.

Cache hits require a **byte-identical prefix** up to the cache-control breakpoint — any earlier edit, a toggled tool, an image appearing/disappearing, or a changed thinking/effort setting invalidates the whole cached block and forces a full-price rewrite. TTL is 5 minutes by default or 1 hour at 2x write cost; the clock resets on any read, but time spent generating a response also eats into it. None of this is Claude-specific in spirit — OpenAI and Google both publish materially similar cached-input discount schemes (roughly 50-90% off depending on provider and TTL), so the compounding-cost shape described below is not a Claude quirk.

### Why growing context compounds cost and risk even with caching

Three separable effects, worth naming individually because they're often conflated:

1. **Linear cost growth.** Every turn reprocesses the full accumulated context. Caching cuts the rate (0.1x on the cached portion) but doesn't cap the total — a session that's 10x longer still costs meaningfully more per turn than a fresh one, cache or no cache. This is the mechanical answer to the concern about a session's cost "inheriting" its own history.
2. **Cache invalidation risk grows with session complexity.** More turns means more chances to touch something upstream of the last breakpoint (edit a tool, add an image, change a setting) and silently pay full 2x/1.25x write price again instead of the 0.1x read price. A long, varied session is more prone to this than a short, uniform one.
3. **Quality degradation ("context rot") is a separate failure mode from cost, and it arrives earlier than the hard context limit.** This is well-documented as a general LLM behavior (retrieval/attention quality degrades as irrelevant or stale content accumulates in the window) rather than a single benchmarked Anthropic claim — treat the *existence* of the effect as consensus, the exact point it kicks in as model- and task-dependent, not a fixed number worth citing precisely.

The practical implication: "is there token headroom left" and "should this session keep going" are different questions. The first is about the hard limit. The second is about whether cost-per-turn and answer quality are still worth it — and that second question degrades well before the first one does.

### Compaction vs. starting fresh

**Compact when:** the work is still mid-task, prior turns contain decisions/constraints that matter to what comes next, and there's no clean handoff document that already captures them. Compaction keeps a compressed narrative of what happened; it loses exact wording, exact tool outputs, and any nuance not judged summary-worthy by the compaction pass itself.

**Start fresh when:** everything that matters is already externalized to disk (files, memory entries, a written spec/decision doc) and the conversation itself is not the source of truth for anything. A fresh session pays zero inherited-context cost and sidesteps both the linear-growth and context-rot effects entirely — at the price of the new session needing to re-read whatever files carry the state.

Neither is free; the choice is about where the state already lives. A session that has been disciplined about writing its conclusions to files (rather than leaving them only in chat) makes "start fresh" cheap. A session that hasn't makes compaction the only way to preserve anything.

### Signals and tooling for knowing when to act

- **Claude Code's own `/compact`** — manual trigger, produces a summary in place of full history. There is no fully automatic Anthropic-side compaction trigger as of this writing; the decision is left to the user/session, which is exactly why a standing "flag it when it looks like a good moment" habit is worth keeping rather than expecting the tool to enforce it.
- **Context-usage indicators** — Claude Code surfaces remaining context in-session; treat a fast-approaching limit as a lagging indicator, not a leading one — quality effects can precede it.
- **Third-party usage/efficiency tooling** — this session has direct access to an MCP-based tool (`headroom`) exposing compress/retrieve/stats operations, which is a class of tool worth knowing exists (session-external compression/retrieval as an alternative to relying on in-conversation compaction) — not evaluated here against the two-tier evidence bar since it's already installed rather than sourced from research; treat as a **new-but-promising, unverified** entry if it's carried forward into [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md).
- No single named, well-sourced third-party "token efficiency dashboard" product surfaced with enough independent verification (named maintainer, repo health) to state as a citable option here — flagged as a gap below rather than guessed at.

### Cross-session context handoff — brief (deeper coverage lives in the memory/ledger stage)

Three shapes, in increasing order of ceremony: (1) rely on the coding tool's own end-of-session summary (what compaction already produces) landing at the top of the next session; (2) hand-written or model-written decision/progress files committed to the repo (this repo's own `planning/` and `TODO-LIST.md` pattern); (3) a dedicated typed memory system (Claude Code's file-based memory directory used in this very session). All three are complementary, not competing — the actual pick belongs to the Topic #10 memory-ledger stage, not here.

## Section B — Subagent/sub-process token impact, by provider

### Claude Code

Subagents (and forked agents) run with their own fresh context window, separate from the parent session's. The parent pays only for the dispatch prompt and the final report that comes back — not for whatever the subagent read, searched, or generated internally. This is the mechanism this exact stage was produced with: research and web-fetch content stayed inside the fork, only a written file and a short completion note returned to the parent. Anthropic's own subagent guidance (see `planning/subagents-and-delegation.md`, already sourced from `claude.com/blog/subagents-in-claude-code`) frames this explicitly as the reason to delegate — "if a task would flood the main session with content you'll never look at again, that's the signal to delegate." Cost-wise, this means subagent use is close to a pure token-efficiency win for the parent session specifically, at the cost of the subagent's own (separate, fresh-context, non-cache-inheriting) token spend — total tokens across the whole operation aren't reduced, but the *parent session's* accumulated context — the thing that compounds per Section A — is.

### GitHub Copilot CLI

Real subagent delegation exists today, in two forms already characterized in [`subagents-and-delegation.md`](./subagents-and-delegation.md): automatic in-session delegation (tuned in 2026 to be more selective, per GitHub's own engineering blog, cutting tool-failure rates without a quality hit) and explicit `/delegate`/`&` handoff to a cloud-hosted background agent that opens a draft PR. Both are built into the CLI, no extra setup.

The corporate/enterprise angle: GitHub's own enterprise-policy documentation confirms organizations can restrict *which models* a subagent is allowed to use, with an automatic fallback to the parent session's (permitted) model if the subagent's default is blocked. This is evidence of real, documented enterprise-tier policy control over agent behavior — but it constrains model choice, not whether delegation exists at all. No sourced evidence was found of an enterprise policy that disables subagent delegation as a capability outright. Access to the cloud-hosted `/delegate` target specifically is also gated by licensing in practice (having Copilot CLI doesn't automatically include cloud-agent access) — this is a real, if narrower, restriction path.

### Gemini CLI

Subagents shipped in Gemini CLI (Google Developers Blog, `developers.googleblog.com/en/subagents-have-arrived-in-gemini-cli`, corroborated by InfoQ and independent trackers on the v0.36 / April 2026 date). Same architectural shape as Claude Code and Copilot: own instructions, own context, optional restricted tool set, run in parallel. One notable operational detail: subagents in Gemini CLI run in "YOLO mode" by default (executing tools without per-action confirmation) and the capability was gated behind an experimental flag at launch rather than on-by-default — a rollout/maturity distinction, not a corporate-tier one. No sourced evidence surfaced of a Gemini Enterprise/Workspace admin control that specifically disables subagents; enterprise-admin toggles found in the search were for unrelated features (e.g., a "canvas" UI toggle), which is worth noting only as evidence the search was thorough, not as a finding.

### Direct answer

Given what's sourced: **(a) is no longer true as a blanket claim, (b) is real but narrow, and (c) doesn't apply.** As of this stage's research, both Copilot CLI and Gemini CLI ship native subagent primitives with no additional tooling required — the capability gap that existed when this was first raised has closed at the product level. What *is* real and corporate-tier-specific is narrower policy control: Copilot's enterprise model-restriction policies, and Gemini's experimental-flag gating at launch. Neither of those amounts to "subagents don't exist in the corporate version" — they amount to "which model a subagent can use, or whether the feature is opted into yet, can be constrained by an admin." The proactive, low-friction *quality* of Claude Code's delegation (deciding to spawn without being asked, in a way that reads as unusually fluent) is not explained by any sourced capability gap in this research — it's more likely a maturity/tuning difference (Claude's subagent feature has had more production iteration specifically on *when* to delegate) than an architectural one, but this last point is inference, not something a named source states outright — flagged below.

### Firsthand corporate-environment observation (2026-08-23)

The user directly tested their locked-down Copilot and Gemini CLI accounts and reported back what's actually enabled/disabled — primary, first-hand evidence, stronger than the inference above. Full itemized detail is deliberately kept out of this tracked file (see `planning/local/corporate-environment-audit.md`, gitignored — not sensitive, just not the kind of thing worth info-dumping verbatim into git history).

**The general, safe-to-state takeaway:** both corporate accounts retain real subagent/delegation primitives — this isn't "Copilot has orchestration and Gemini doesn't" or vice versa. The restrictions that do exist are targeted (MCP switched off in both, plus memory/cloud-agent/indexing off for Copilot specifically) rather than a wholesale removal of the agent-loop/subagent layer. This corroborates "(b) real but narrow" with primary evidence instead of only public docs/inference. The one pattern worth remembering when designing anything for a work context: **MCP being off organization-wide showed up consistently across both tools** — don't design a work-context harness piece that assumes MCP availability without checking first.

## Open questions / weak sourcing

- The "Claude delegates more proactively/fluently than Copilot or Gemini" observation itself has no direct sourced comparison (no benchmark or practitioner writeup found that measures delegation quality/frequency head-to-head across the three tools) — the answer above is inference from feature-maturity timing (Claude's subagents have been in production longest) rather than a citable claim.
- Context-rot's exact onset point (tokens, task type) is asserted as a general, well-known LLM behavior but not pinned to a specific benchmark or paper here — treat the *existence* of the effect as solid, any specific threshold as unverified.
- No named, independently-verified third-party token-efficiency/usage-dashboard tool was found meeting the two-tier evidence bar; the in-session `headroom` MCP tool is noted as installed-but-unevaluated, not a sourced recommendation.
- Whether GitHub's enterprise model-restriction policy or Gemini's experimental-flag gating has since (post-launch) been lifted or tightened wasn't checked beyond current docs/changelog snapshots — worth a freshness check if this doc is read much later than August 2026.
