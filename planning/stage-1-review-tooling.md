# Stage 1 — Review Discipline: Off-the-Shelf Tooling Survey

Scope: not the custom compound-review-skill pattern (already well understood — preprocessing scripts, blast-radius flagging, ticket context pulls). This covers what exists ready-made: IDE-native review features, Claude Code's own baseline, and open-source review agents worth knowing rather than rebuilding.

## 1. IDE-native / built-in features

**GitHub Copilot code review, JetBrains IDEs (including WebStorm).** Shipped to JetBrains and Visual Studio in September 2025, with continued feature updates through Feb 2026 ([GitHub Changelog, Sep 2025](https://github.blog/changelog/2025-09-18-copilot-code-review-now-in-jetbrains-ides-and-visual-studio/); [GitHub Changelog, Feb 2026](https://github.blog/changelog/2026-02-13-new-features-and-improvements-in-github-copilot-in-jetbrains-ides-2/)). Invoked from the PR context menu (Copilot → Request a Review) or via the Copilot plugin settings, letting you self-review changes before opening a PR — feedback lands inline, flagging logic, security, and performance issues. As of WebStorm 2026.2, Copilot is natively integrated with no separate plugin required ([JetBrains blog, Jul 2026](https://blog.jetbrains.com/webstorm/2026/07/webstorm-2026-2/)), and Agent Skills support is in preview inside the JetBrains Copilot plugin.

How it compares to the cold-start-critic pattern: it's a single-pass reviewer, not obviously running with a genuinely fresh/isolated context from the code-writing session — the sourcing found describes *what* it flags, not its internal isolation guarantees. Treat it as a useful first-pass catch, not a substitute for a real fresh-context critic.

**Cursor.** No distinct "review" feature comparable to Copilot's — 2026 coverage centers on its agent/autonomous-loop capabilities (Background Agents on separate branches opening PRs, Cloud Agents running in parallel) rather than a standalone review button. Its Enterprise plan has an "AI Code Tracking API" (attribution/audit logging of which model wrote which line), which is an audit tool, not a review tool. If self-review happens, it's folded into the agent loop itself, not a separate reviewer role — worth confirming directly if this matters, sourcing here is thinner than for Copilot.

**JetBrains' own AI review tooling independent of Copilot** — nothing distinct turned up; JetBrains' 2026 AI investment in WebStorm appears to route through the Copilot integration rather than a separate native reviewer.

## 2. Claude Code's own baseline (this session's harness)

Useful as a comparison point since it's the most-documented fresh-context-critic implementation available. Per [Claude Code docs](https://code.claude.com/docs/en/code-review): the `/code-review` command reviews a local diff; on Team/Enterprise plans, "Code Review" runs on GitHub PRs directly, posting inline comments from "a fleet of specialized agents" examining changes against the full codebase for logic errors, security issues, broken edge cases, and regressions. The `code-reviewer` subagent type is built to run with its own focused system prompt and fresh context — explicitly designed around the cold-start pattern rather than self-review. Anthropic shipped official Code Review in March 2026 and `/ultrareview` (cloud-based multi-agent bug hunter) in April 2026.

This confirms the cold-start-critic pattern is productized here, not just a technique to hand-roll — which is the thing worth checking for elsewhere before building it again.

## 3. Open-source review agents

**PR-Agent (qodo-ai/pr-agent, formerly Codium-PR-Agent).** The clear leader by adoption: ~10.7k GitHub stars, ~1.4k forks, active maintenance. Self-hostable as a GitHub Action, provider-agnostic (Anthropic, OpenAI, Google, others behind a unified interface), triggered via slash commands (`/review`, `/describe`, `/improve`, `/ask`) on GitHub, GitLab, Bitbucket, or Azure DevOps. This is the one genuinely worth trying for a single-developer setup — real repo health, self-hostable, not locked to one model vendor, which fits the provider-independence constraint.

**CodeRabbit / Sourcery** — both commercial SaaS, not self-hosted open-source. CodeRabbit has a free tier covering private repos; Sourcery's free tier is limited to open-source projects and is more Python-refactoring-focused. Neither is open-source in the way PR-Agent is; noted for completeness, not recommended over PR-Agent for this use case.

## 4. Reusable "second opinion" / cold-start-critic implementations

One direct hit: **`pghqdev/second-opinion`** — a Claude Code plugin and portable skill that intercepts risky plans (migrations, auth changes, production deploys, destructive ops) via a `PreToolUse` hook and routes them to a different-lineage model (Codex, Gemini, Opencode) for adversarial review, returning `SHIP` / `REVISE` / `RECONSIDER` verdicts. Conceptually it's exactly the cross-provider cold-start pattern the user's own review-discipline principle already calls for.

**Flagged, not recommended as-is:** this repo has 0 stars, 0 forks, and only 6 commits — a solo, unproven prototype, not something that clears the evidence bar on its own merits. Worth reading as a working example of the pattern (install script, hook mechanism, fallback-to-self-review-with-fresh-framing when no external reviewer is configured) rather than adopting sight-unseen. If the pattern is wanted, it may be more solid to build a small version of this directly rather than depend on an unmaintained one-person repo.

No other standalone reusable cold-start-critic tool turned up in this pass — the pattern currently lives mostly as *guidance* (Anthropic's own best-practices docs, the "adversarial code review" pattern described by Augment Code and others) rather than as a mature ecosystem of ready tools. `pghqdev/second-opinion` is the only concrete implementation found, and it's early.

## What this leaves open

The gap between "IDE gives you a review button" and "a genuinely fresh, different-lineage critic reviews this" is still mostly closed by DIY — either Claude Code's built-in subagent pattern (solid, documented, in-house) or a self-built cross-provider hook similar to `second-opinion`'s approach. PR-Agent is the one mature, self-hostable, provider-agnostic option worth actually trying for day-to-day PR review; nothing else in the open-source space matched it on repo health.

## Sources
- [GitHub Changelog — Copilot code review in JetBrains IDEs and Visual Studio](https://github.blog/changelog/2025-09-18-copilot-code-review-now-in-jetbrains-ides-and-visual-studio/)
- [GitHub Changelog — Copilot in JetBrains IDEs, Feb 2026 update](https://github.blog/changelog/2026-02-13-new-features-and-improvements-in-github-copilot-in-jetbrains-ides-2/)
- [JetBrains blog — WebStorm 2026.2 release notes](https://blog.jetbrains.com/webstorm/2026/07/webstorm-2026-2/)
- [Claude Code Docs — Code Review](https://code.claude.com/docs/en/code-review)
- [qodo-ai/pr-agent on GitHub](https://github.com/qodo-ai/pr-agent) — star/fork counts checked directly
- [pghqdev/second-opinion on GitHub](https://github.com/pghqdev/second-opinion) — fetched directly, repo stats confirmed (0 stars/forks, 6 commits)
- General 2026 coverage of Cursor's agent/review capabilities (multiple review-aggregator sites — directional, not primary-sourced; weaker than the above)
