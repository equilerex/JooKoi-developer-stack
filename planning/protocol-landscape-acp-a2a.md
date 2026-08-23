# Stage 1 — Protocol Landscape: ACP, A2A, and CLI-vs-MCP

New topic surfaced from a ChatGPT-sourced dump (quarantine trail resolved and removed once processed). Covers the interface-layer question one level above individual tools: what protocol connects what to what, and when a protocol is even the right answer versus a plain script. No pick — this is a map, not a recommendation to adopt any of these now.

**Updated 2026-08-23** (cowork research pass): ACP and A2A sections refreshed below — both prior gaps (ACP's unnamed maintainer, A2A's unconfirmed 403'd source) are now resolved. This doc's own MCP framing was checked for consistency against the 2026-07-28 stateless-protocol revision documented in full in `mcp-model-context-protocol.md`; §4's security citation already correctly references that revision, and nothing else in this doc describes MCP's superseded session/handshake model — no further correction needed here.

## 1. The four-layer picture

- **Agent ↔ tools/data** — MCP (already covered in depth in [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md)).
- **Agent ↔ editor/IDE** — Agent Client Protocol (ACP).
- **Agent ↔ agent** — A2A (Agent-to-Agent).
- **Agent ↔ local machine, for small one-off operations** — increasingly just a CLI script, no protocol at all.

These are genuinely different layers solving different problems, not competing standards. The instinct to treat "ACP vs MCP" or "CLI vs MCP" as a single winner-take-all choice is the wrong frame — each answers a different question.

## 2. Agent Client Protocol (ACP)

**What it is:** ACP standardizes communication between code editors/IDEs and coding agents — confirmed directly from `agentclientprotocol.com`. The stated model is explicitly Language-Server-Protocol-shaped: LSP let one editor speak to any language server without custom per-pairing work; ACP aims to let one editor speak to any coding agent the same way. It reuses MCP's JSON representations where it can, but adds agentic-coding-specific types (e.g. structured diff display) that MCP doesn't have.

**What it is not:** it does not replace MCP or Skills. MCP is agent↔tools; ACP is editor↔agent — an agent using ACP to talk to your editor still uses MCP (or CLI scripts) to talk to your filesystem, GitHub, etc.

**Maturity — both prior gaps now resolved (2026-08-23 pass).** ACP is jointly governed by **Zed Industries and JetBrains** (not Zed alone) — confirmed via the spec's own `/community/governance` page. Two lead maintainers hold veto authority: Ben Brandt (Zed) and Sergey Ignatov (JetBrains, appointed 2026-02-18). The canonical repo moved to `github.com/agentclientprotocol/agent-client-protocol` (out from under `zed-industries`), ~4.0k★/351 forks, with published `MAINTAINERS.md`/`GOVERNANCE.md` and official SDKs in Rust, TypeScript, Python, Java, and Kotlin. ACP is **not** an AAIF project despite both maintaining orgs being AAIF members — the governance page states they're "working toward transitioning to an independent foundation," no date given.

Adoption is real and broad, not Zed-only: ~40 listed agents (Claude Agent, Codex CLI, Gemini CLI, GitHub Copilot, Cline, Goose, OpenCode, Cursor, and others) and editor/client support spanning JetBrains IDEs, Neovim, Emacs, VS Code extensions, Qt Creator, and more (`/get-started/clients`, `/get-started/agents`) — caveat that these are self-listed directory pages, presence means "claims support," not verified conformance depth. Remote-agent support is still genuinely not shipped: stdio remains the only production transport ("agents and clients SHOULD support stdio whenever possible"); a Transports Working Group formed 2026-04-22 to standardize HTTP/WebSockets, currently at "draft proposal in progress." Other 2026 developments: an ACP Registry for cross-client agent discovery/install, and Rust/TypeScript SDKs reaching 1.0 on 2026-06-25.

## 3. Agent-to-Agent (A2A)

**What it is:** a protocol for agent↔agent communication — distinct from both MCP (agent↔tool) and ACP (agent↔editor). Originally announced by Google (April 2025) and donated to the Linux Foundation with founding orgs AWS, Cisco, Google, Microsoft, Salesforce, SAP, and ServiceNow.

**Governance update, confirmed 2026-08-23 (the previously-blocked Axios source is now superseded by primary sources):** on **2026-08-17** — six days before this research pass — **A2A joined the Agentic AI Foundation (AAIF)**, the same Linux Foundation entity now hosting MCP, `goose`, and `AGENTS.md`. Confirmed directly against AAIF's own blog and project pages (`aaif.io/blog/a2a-joins-aaif`, `aaif.io/projects/agent2agent`). Note the protocol's own site (`a2a-protocol.org`) hadn't been updated to mention AAIF as of this pass — stale rather than wrong, since AAIF is itself a Linux Foundation body.

A2A reached **v1.0** (first stable spec) in March 2026, adding multi-tenancy, modernized security flows, and signed Agent Cards for cryptographic identity. The Linux Foundation's own press release (2026-04-09) reports **150+ participating organizations** and enterprise production use, with named implementers spanning Google Cloud, Microsoft (Azure AI Foundry, Copilot Studio), AWS (Bedrock AgentCore Runtime), Cisco, IBM, Salesforce, SAP, and ServiceNow, plus framework integration in LangGraph and CrewAI — treat "150+ organizations" as a self-reported foundation participation count, not an independently audited deployment count.

**Relevance to this stack, honestly assessed:** still low, for the same reason as before — a solo developer isn't building a multi-agent *product* where independently-owned agents need to negotiate. The adoption breadth above changes the "is this real" answer, not the "is this relevant to me" answer. A2A matters when building the multi-agent system as the actual product (comparable to when CrewAI/LangGraph/AutoGen becomes relevant, per [`subagents-and-delegation.md`](./subagents-and-delegation.md) §"Third-party orchestration frameworks"). Not a near-term concern here.

## 4. CLI-scripts vs. MCP for local capabilities

This is the practical decision that actually matters for a personal setup, more than either protocol above.

**The pattern:** for small, repo-local operations (`npm run test:affected`, a custom lint-and-report script, a "find component context" helper), an ordinary shell command a coding agent can already run is often simpler than standing up a dedicated MCP server:

- No extra server process or protocol layer to run and keep alive.
- The command is already versioned with the repo, already familiar, already testable the normal way.
- It works with essentially any coding agent that can run a shell command — no MCP client support required.
- Permissions are whatever your existing shell/sandbox already enforces.

**Where this doesn't apply:** MCP still earns its cost for genuinely *external*, *reusable*, *multi-client* integrations — a database connector, a GitHub API wrapper, anything meant to be discovered and called the same way from Claude Code, Cursor, and a teammate's IDE alike. [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md) §5 already documents this exact pattern from the opposite direction (Skill-wrapping-a-CLI as the work-restricted MCP alternative) — this section generalizes it: prefer CLI-first for anything local and single-purpose, reach for MCP when the thing genuinely needs to be a standing, multi-client, discoverable service.

**The security correction, worth stating plainly:** "use a CLI script instead of MCP" is not automatically safer. A shell command with broad filesystem/network access is not inherently more contained than a narrowly-scoped MCP tool — the real principle is least privilege, explicit approval, sandboxing, and auditability, regardless of which mechanism executes the action. This is reinforced directly by MCP's own current security documentation (`modelcontextprotocol.io`, `2026-07-28` security-best-practices page, fetched directly for this research): it documents a specific "Local MCP Server Compromise" attack class — a malicious local MCP server binary running with the same privileges as the client, capable of data exfiltration or destructive commands exactly like an unreviewed shell script would be. The same page also confirms, directly (not secondhand), two of the four risk categories the source dump attributed to MCP: the **confused deputy problem** (a proxy server with a static client ID can be tricked into leaking an authorization code to an attacker) and **token passthrough** (a server forwarding a client's token to a downstream API without validating it was actually issued for that server) — both documented as explicit `MUST`/`MUST NOT` requirements in the current spec, not informal guidance. The dump's other two claimed risk categories — prompt injection and untrusted tool metadata ("tool poisoning") — are real but come from a different part of MCP's security story, already covered in [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md) §4 via Cloud Security Alliance research rather than this specific tutorial page; this page's scope is mostly OAuth/SSRF/local-execution risk, a genuinely broader and more detailed picture than what [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md) currently cites. Worth a follow-up pass on [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md)'s security section specifically, since this primary source turned out to cover meaningfully more ground (SSRF, state-handle hijacking, localhost redirect impersonation, mix-up attacks) than what's there now.

## 5. Agent Skills as an open standard — one claim checked

The source dump cited `github.com/agentskills/agentskills` as "the Agent Skills specification released as an open standard." This was worth scrutinizing since [`skill-libraries-and-marketplaces.md`](./skill-libraries-and-marketplaces.md) already establishes `platform.claude.com/docs` as the canonical spec source — a second repo claiming to be "the standard" could have been an overstatement or a competing/unofficial fork. Direct fetch confirms it's not: the repo's own README states the format "was originally developed by Anthropic, released as an open standard, and has been adopted by a growing number of agent products," explicitly frames itself as the open-ecosystem home for that same standard (not a rival), and shows real activity — 24.6k stars, 1.8k forks, 145 commits, active issues/PRs. Consistent with, not contradicting, what [`skill-libraries-and-marketplaces.md`](./skill-libraries-and-marketplaces.md) already says. No correction needed there.

**2026-08-23 delta check:** a follow-up fetch returned ~20.6k★/123 commits — lower than the 24.6k★/145 commits recorded above. GitHub star counts don't typically drop, so this is more likely a snapshot/rendering discrepancy than an actual decline, but this pass could not resolve it — treat both numbers as approximate rather than trusting either precisely. Governance unchanged: still not an AAIF project (absent from `aaif.io`'s project list) — remains Anthropic-originated, community-run under the neutral `agentskills` org, Apache-2.0 code / CC-BY-4.0 docs. No material change to the standard itself.

## 6. Practical read for this setup

Given this user's actual context — solo home developer, Angular-monorepo-adjacent work, already running Claude Code with subagents and MCP research done separately:

- **Worth acting on now:** the CLI-first instinct for small repo-local operations. Before reaching for a new MCP server for something scoped to one repo, check whether a plain script does the job — this is directly actionable and low-cost.
- **Worth knowing the name of, still not urgent to build around — but the adoption picture changed:** ACP now has real breadth (~40 agents, multiple editors, joint Zed/JetBrains governance) rather than being a single-vendor experiment. If a future editor switch or multi-agent-in-one-IDE need arises, worth a direct look rather than treating it as vaporware — remote-agent/HTTP transport still isn't shipped, so nothing changes for a local stdio-only setup today.
- **Not relevant yet:** A2A. Revisit only if a future project's actual product architecture involves independently-owned agents needing to negotiate with each other — not the case for anything in scope now.

## Open questions / weak sourcing

- **Resolved 2026-08-23**: ACP's maintainers (Zed + JetBrains, named leads) and the A2A governance/adoption picture (both previously flagged as unconfirmed) are now sourced directly from primary pages — see §2 and §3 above.
- ACP Registry's release date is unresolved — the spec's own `/updates` page dates it 2026-03-09, Zed's announcement blog post dates it 2026-01-28. Possibly two distinct events (initial launch vs. later stabilization); don't cite a single date without rechecking.
- ACP's stated goal of transitioning to an independent foundation has no timeline attached — not confirmed whether this is active work or an aspiration.
- Agent Skills' star count is inconsistent between this doc's original pass (24.6k★) and the 2026-08-23 delta check (~20.6k★) — see §5. Not resolved.
- [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md)'s security section (§4) covers tool-poisoning/prompt-injection risk via secondary aggregated coverage; this doc's §4 fetched a different, more detailed primary MCP security page directly (confused deputy, token passthrough, SSRF, local-server compromise, state-handle hijacking) — the two sections are complementary, not duplicative, but [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md) would benefit from a follow-up pass citing this fuller primary source directly rather than only the secondary coverage it currently has.
