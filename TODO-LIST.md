# TODO / Master Plan

This is the thing that was missing: a single place stating what stage this project is actually in and what the concrete next steps are, rather than that living only in chat history. Update this as stages complete — it's the source of truth for "what's next," not `NEXT-SESSION-PROMPT.md` (that file is just a paste-in continuation blurb pointing back here).

## Where this project actually is

1. **Stage 0 — baseline survey.** Done. `planning/topic-index.md`, 14 topics, each marked and linked.
2. **Stage 1 — deep-dive research per topic.** MIXED, not "done" — a first-pass doc exists for every topic that got one (14 docs in `planning/`, see the index), but "a doc exists" is not the same as "the research is actually sufficient." At least one (topic 10, memory ledger) was expanded once and still needs a further pass before it's read-ready — don't assume the rest are any more finished just because a file is there; check with the user which docs they consider still needing a real deep-dive, don't infer it from doc existence. A few topics were explicitly marked "no dedicated deep-dive doc yet, lighter pass" in `topic-index.md` (Hooks, Dotfiles/portability, per-feature architectural context) — those are known-open, not forgotten.
3. **Stage 2 — user reads and reviews the research.** IN PROGRESS. Track per-file status in `planning/local/review-status.md` (gitignored). This is the step that was happening when this file was written.
4. **Stage 3 — make real picks per topic.** BARELY STARTED. No topic has a confirmed pick yet. `planning/decisions/001-first-design-skill-picks.md` (design-tooling candidates: Claude Design, MengTo/Skills, naksha-studio — local trial clones being tested, none picked/adopted). `planning/decisions/003-memory-ledger-picks.md` (topic 10 — **not a pick**, just rejects: Claude's built-in memory, hand journal files, and conditionally Obsidian for corporate use are ruled out; log-mining accepted only as diagnostic-utility, not as the memory system. User explicitly says not enough info yet to pick — needs a storage/vault research pass first). Every other topic in `planning/topic-index.md` still has zero pick.
5. **Stage 4 — move picks into the actual stack.** NOT STARTED. `AGENTS.md`, `skills/`, `prompts/` at repo root are still empty/placeholder. This is the actual deliverable — everything before this is groundwork for it.
6. **Stage 5 — crash-course restructuring.** DEFERRED on purpose, see `planning/decisions/002-crash-course-naming.md`. Do this after Stage 3 is far enough along that it's clear which docs earn a spot in the polished version.

## Concrete next steps, in order

Grouped by actual dependency, not by when each item was logged. Do the numbered groups roughly in order; items inside a group aren't strictly ordered against each other.

### 1. Read-through (Stage 2, in progress — the current gate)

- [ ] Work through `planning/local/review-status.md`, flip each row's status as you read (that file's status column is user-only — Claude does not flip it). Currently `unread`: `memory-and-progress-ledgers.md` (just got a major expansion — read this one first, see group 2), `subagents-and-delegation.md`, `mcp-model-context-protocol.md`, `local-model-hardware-fit.md`, `review-and-verification-tooling.md`, `security-and-supply-chain.md`, `agent-sandboxing.md`, `dev-scoped-second-brain-rag.md`, `harness-engineering-vocabulary.md`, `protocol-landscape-acp-a2a.md`. Two new docs added 2026-08-23, not yet in the review-status table's original list, now added as new rows: `base-instruction-files.md` (topic #1, new) and `skill-scanning-and-verification.md` (new topic). `memory-and-progress-ledgers.md` also got a second addition (a storage/vault-layer section, §8) since its earlier expansion — worth a fresh read of just that section even if the rest was already reviewed. `protocol-landscape-acp-a2a.md` also received a correction/refresh pass (ACP/A2A governance details) on top of being previously unread.

### 2. Topic 10 (memory ledger) — cowork follow-up pass now landed, still not read/picked

- [x] The cowork follow-up pass landed 2026-08-23: `memory-and-progress-ledgers.md` §8 now covers the storage/vault-layer question specifically (the open item from `decisions/003-memory-ledger-picks.md`'s "Next step") against the corporate no-uv/no-MCP/no-native-binaries/Windows constraint. Headline findings: most named vault products (Obsidian-class) fail that filter; the closest match to the user's actual design (centralized, path-mirrored, AI-authored, hook-triggered) is the Cline-style "Memory Bank" pattern, not a vault product at all; Kuzu (the opinion piece's proposed graph-DB backend) is confirmed dead since Oct 2025 — that specific recommendation is stale.
- [ ] Still not read by the user, still not picked. Once read: either make the topic-10 pick (update `decisions/003-memory-ledger-picks.md`) or decide it needs yet another pass. This still blocks topics #1 and #3 formally, though topic #1's own deep-dive doc (`base-instruction-files.md`) now exists independently — see group 3.

### 3. Stage 3 — picks, topic by topic

- [ ] For each topic in `planning/topic-index.md`, make an actual pick (or explicitly decide "not adopting anything here yet") and log it in `planning/decisions/NNN-<topic>.md`, same format as `001`.
- [x] Topic #1 deep-dive doc written 2026-08-23: `planning/base-instruction-files.md`. Promotes the raw research that was a byproduct of `memory-and-progress-ledgers.md`, plus a fresh cowork research pass — per-provider loading table for 13 tools, verification of the AAIF governance claim, and importantly: the only controlled studies found **contradict** Anthropic's own 200-line-length guidance (no measurable length/adherence effect; the real effect found was within-session decay). Also surfaces a confirmed prompt-injection vector via cloned repos' own AGENTS.md files (NVIDIA Red Team, Backslash Security).
- [ ] Not yet picked from — still Stage 2 (user read), not Stage 3. Once read, revisit the user's own `~/.claude/CLAUDE.md` (flagged as an unreviewed merge of an old personal version and an AI-suggested rewrite) against it, per the doc's §8.
- [ ] Topic #3 (session/token economics) also depends on the topic-10 pick landing first (what gets bundled per session ties into ledger design).

### 4. Stage 4 — once a handful of picks exist

- [ ] Write the first real `AGENTS.md`, add the first real entries to `skills/` and `prompts/`.
- [ ] Resolve the `~/.agents/AGENTS.md` merge question (existing personal ruleset vs. this repo's researched one) as part of writing it — explicitly deferred until now, needs an answer during this step.
  - **Personal rule to bake in when that file is actually written (flagged 2026-08-23, not education content — a hard build requirement):** AI never runs `git commit` or `git push`, ever, no exceptions. The user's own reasoning: this is the deliberate last human checkpoint before anything lands in a repo — the mechanical practice that prevents rubber-stamping unreviewed AI output. Already an informally-followed standing rule in this project's own `TODO-LIST.md`; make sure it survives as an explicit, hard-stated rule in the real `~/.agents/AGENTS.md` (worth considering a hook enforcing it, not just a written instruction, given `planning-before-implementation.md`'s and the blueprint's evidence that written-only rules decay under compaction).

### 5. Independent — can happen anytime, doesn't block or get blocked by 1–4

- [ ] Cross-repo consolidation with old location (`JooKoi-frontpage-to-the-open-web/.agents/`) — plan logged in `planning/decisions/004-cross-repo-consolidation-plan.md`. One confirmed lost file (`discovery-phase-review.md`), founding-context Part A still pending there too (same underlying question as the `~/.agents/AGENTS.md` merge above — track in one place, here). Not executed yet.
- [ ] Graphify — **corporate blocker resolved 2026-08-23**: user got it running at work by forking the repo and fixing a pip proxy misconfig. Approved to trial for fit against actual workflow/needs; harness-level instance (this repo's own `planning/` corpus) is arguably big enough now to justify a first pass — still not started.
- [ ] Serena (MCP server, currently running) — user doesn't actually know what it does yet. Needs a real look before it factors into any pick.
- [x] Doc-hygiene follow-up done 2026-08-23: `protocol-landscape-acp-a2a.md` checked against the 2026-07-28 MCP revision — turned out already consistent (its §4 security citation already referenced the current revision), no stale session-model language found elsewhere in the doc. Same pass also refreshed ACP (now jointly Zed/JetBrains-governed, ~40 agents adopting) and A2A (joined the same Linux Foundation AAIF as MCP/AGENTS.md on 2026-08-17, not previously known) — both prior "unconfirmed source" gaps in that doc are now resolved.
- [ ] Async/non-blocking long-running-command execution (`personal-harness-architecture.md` §4) is a confirmed design gap, not yet prototyped.
- [ ] Hooks / automation triggers, Dotfiles/portability, per-feature architectural context — marked in `topic-index.md` as not yet having a dedicated deep-dive; light passes only, not urgent.
- [x] Research pass done 2026-08-23: `planning/skill-scanning-and-verification.md`. Confirmed `security-and-supply-chain.md` does not already cover this (that doc is general practice/incidents; this is the specific tool/process gap). Purpose-built scanners now exist (NVIDIA SkillSpector, Snyk agent-scan, Cisco skill-scanner) but the load-bearing finding is that they barely agree with each other (0.12% agreement rate in one independent study) and are evadable (>90% bypass rate demonstrated) — the doc's practical read is to treat any single scan as one weak signal, not a verdict. No pick made — still needs a read.
- [ ] 101 - How do ai agents actually work? coding agent lifecycle description (how does it actually work, whats the step by step process explaining how do all these topics that have a research doc fit together - often people use the tooling without understanding the "magix"). add short appendix on how LLm's work in general in an "ELI5" style since people still struggle understannding that. 

### 6. Logged only — explicitly do NOT start yet

- [ ] A custom-built `JooKoi-commit-message` skill (flagged 2026-08-23). Scope: script(s) to pull a token-efficient diff/change overview (not raw `git diff`) and generate a commit message from a personally-defined, user-editable template. Ties to topic 2 (skill libraries) and topic 3 (token economics). Not researched — just captured so it isn't lost.
- [ ] Where coding agents actually do their work outside the visible project (flagged 2026-08-23) — global per-tool folders holding session logs/temp state (e.g. `~/.claude/`), and workflows where an agent works in a temporary directory or git worktree entirely outside the project, branching/merging back later. Real "AI basics" content for a newcomer. See `topic-index.md` placeholder entry. When picked up: research as its own topic, write a deep-dive doc, add to `topic-index.md` properly.
- [ ] the dev stack agents baseline should have guardrails section for common mistakes not preferred by the user for example if a phrase, For example, "deep research" or "deep dive" is used the LLM might understand it as "Academia" level research while the dev expects a general overview done in an effective manner while referencing more than just one or two sources. similarly, might need guars for classic token waste scenarios like looping and spiraling.    

## Workflow note (2026-08-23)

Web-research passes on specific planning-doc topics are being routed through cowork mode going forward, not done inline in this session — it's been performing better on web exploration for this project. Claude's role here is organizing/curating research handed back, making picks, and building Stage 4 artifacts — not running the searches itself, going forward.

## Standing rules (don't relitigate these)

- User does all git commits themselves. Never commit or offer to.
- No scope creep — if work branches into a new task, log it here or in a decision file and report back, don't pursue it inline.
- Evidence bar for anything opinionated: named practitioner/checkable identity, current docs, or repo-health signals. De facto standards stated as fact. New-but-promising allowed as a labeled exception.
