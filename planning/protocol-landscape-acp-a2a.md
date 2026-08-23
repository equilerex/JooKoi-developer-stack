# Stage 1 — Protocol Landscape: ACP, A2A, and CLI-vs-MCP

New topic surfaced from a ChatGPT-sourced dump (quarantine trail resolved and removed once processed). Covers the interface-layer question one level above individual tools: what protocol connects what to what, and when a protocol is even the right answer versus a plain script. No pick — this is a map, not a recommendation to adopt any of these now.

## 1. The four-layer picture

- **Agent ↔ tools/data** — MCP (already covered in depth in [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md)).
- **Agent ↔ editor/IDE** — Agent Client Protocol (ACP).
- **Agent ↔ agent** — A2A (Agent-to-Agent).
- **Agent ↔ local machine, for small one-off operations** — increasingly just a CLI script, no protocol at all.

These are genuinely different layers solving different problems, not competing standards. The instinct to treat "ACP vs MCP" or "CLI vs MCP" as a single winner-take-all choice is the wrong frame — each answers a different question.

## 2. Agent Client Protocol (ACP)

**What it is:** ACP standardizes communication between code editors/IDEs and coding agents — confirmed directly from `agentclientprotocol.com`. The stated model is explicitly Language-Server-Protocol-shaped: LSP let one editor speak to any language server without custom per-pairing work; ACP aims to let one editor speak to any coding agent the same way. It reuses MCP's JSON representations where it can, but adds agentic-coding-specific types (e.g. structured diff display) that MCP doesn't have.

**What it is not:** it does not replace MCP or Skills. MCP is agent↔tools; ACP is editor↔agent — an agent using ACP to talk to your editor still uses MCP (or CLI scripts) to talk to your filesystem, GitHub, etc.

**Maturity, honestly:** the primary docs page doesn't name who created or currently maintains the spec, and gives no list of which editors/agents currently implement it — a real gap in the source itself, not something I'm withholding. The one line of adoption evidence text explicitly flags is that remote-agent support is still "a work in progress." Direct fetch of the primary source could not establish current implementer breadth. Treat ACP as a real, coherent idea with a live spec, not yet a "check which editors support it and switch" decision — worth knowing the name and shape, not worth building around yet.

## 3. Agent-to-Agent (A2A)

**What it is:** a protocol for agent↔agent communication — distinct from both MCP (agent↔tool) and ACP (agent↔editor). The claimed source for current coverage (an Axios article dated 2026-08-17) returned an HTTP 403 on direct fetch and could not be independently verified in this pass — flag this explicitly as unconfirmed at the primary-source level, not as false.

**What's confirmable without that source:** A2A as a named effort is real and has had real industry backing (originally announced by Google, subsequently moved toward a vendor-neutral foundation with cross-company participation) — this is consistent with general knowledge of the space, though the specific claims in the blocked article (current 2026 status, which companies, what's changed) are not independently re-confirmed here.

**Relevance to this stack, honestly assessed:** low, for the same reason the source dump itself ranks it last — a solo developer isn't building a multi-agent *product* where independent agents owned by different parties need to negotiate and communicate. A2A matters when you're the one building the multi-agent system as your actual product (comparable to when CrewAI/LangGraph/AutoGen becomes relevant, per [`subagents-and-delegation.md`](./subagents-and-delegation.md) §"Third-party orchestration frameworks"). Not a near-term concern here.

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

## 6. Practical read for this setup

Given this user's actual context — solo home developer, Angular-monorepo-adjacent work, already running Claude Code with subagents and MCP research done separately:

- **Worth acting on now:** the CLI-first instinct for small repo-local operations. Before reaching for a new MCP server for something scoped to one repo, check whether a plain script does the job — this is directly actionable and low-cost.
- **Worth knowing the name of, not worth building around:** ACP. If a future editor switch or multi-agent-in-one-IDE need arises, the concept is now on record; nothing to configure today.
- **Not relevant yet:** A2A. Revisit only if a future project's actual product architecture involves independently-owned agents needing to negotiate with each other — not the case for anything in scope now.

## Open questions / weak sourcing

- ACP's maintainer/creator and current implementer list could not be confirmed from the primary docs page fetched in this pass — the page itself doesn't state it. Worth a targeted look at `agentclientprotocol.com`'s other pages (not just `/get-started/introduction`) if ACP becomes actionable later.
- The Axios A2A article (2026-08-17) returned HTTP 403 on direct fetch — its specific claims about current company involvement and 2026 status are unconfirmed at the primary-source level in this research pass, not verified false, just not independently checked.
- [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md)'s security section (§4) covers tool-poisoning/prompt-injection risk via secondary aggregated coverage; this doc's §4 fetched a different, more detailed primary MCP security page directly (confused deputy, token passthrough, SSRF, local-server compromise, state-handle hijacking) — the two sections are complementary, not duplicative, but [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md) would benefit from a follow-up pass citing this fuller primary source directly rather than only the secondary coverage it currently has.
