# Stage 1 — MCP (Model Context Protocol)

Deeper pass on topic #5 from Stage 0. Baseline established the adoption trend and the work-restricted workaround pattern; this stage covers the protocol itself, what's worth connecting at home, named servers, and security — enough to actually set something up, not just recognize the acronym. No pick made — this is knowledge plus a short candidate list for you to choose from.

## 1. What MCP actually is

MCP is an open, client/server protocol for connecting an AI application to external systems — Anthropic's own framing is "a USB-C port for AI applications": one standard interface instead of a bespoke integration per tool. A client (Claude Code, Claude Desktop, VS Code, Cursor, and others all speak it) connects to one or more MCP servers. Each server exposes some combination of three primitives:

- **Tools** — actions the model can invoke (e.g. "run this SQL query," "create this GitHub issue")
- **Resources** — data the client can read into context (e.g. a file, a database row)
- **Prompts** — reusable, server-defined prompt templates

The difference from a plain API wrapper or a Skill: a Skill is *your* packaged know-how plus optional script, loaded into *your* session; an MCP server is a standing, addressable connection a client discovers and calls into live, following a declared schema the client introspects at runtime rather than you hand-coding the call. That live, governed, multi-client-reusable connection is MCP's actual value-add over "just write a script that calls the API" — it costs you a running server process and its own security surface (§4) in exchange.

## 2. Worth connecting at home vs. overkill

For a single-developer personal stack (your unrestricted home setup), the servers worth having are the ones that save you from re-explaining your own filesystem/tools to the model every session:

- **Filesystem** — read/write access to a directory with path restrictions. Near-universally called the starting point in current guides.
- **GitHub** — repo search, PR/issue management, without you copy-pasting diffs by hand.
- **Fetch/browser** — pulling and converting web content into usable context.
- A **database connector** only if you actually have a database you query often — not worth installing speculatively.

Things like Slack, Notion, or enterprise data-warehouse connectors are the "overkill for one person" end — real for a team/production agent, not for a personal dev-tooling stack unless you have a specific standing use for one.

## 3. Named servers worth knowing

- **`modelcontextprotocol/servers`** (github.com/modelcontextprotocol/servers) — Anthropic's own reference-implementation repo, ~79k stars. Includes Filesystem, Git, Fetch, and an "Everything" test server. Explicitly framed as reference/educational rather than hardened production code — a reasonable starting point, but read what you install rather than trusting "official" alone.
- **`punkpeye/awesome-mcp-servers`** — the actively-maintained community curated list, ~92.7k stars, ongoing commit activity. This is the better catalog to browse for "what exists" today.
- **`appcypher/awesome-mcp-servers`** — a second curated list, ~5.8k stars — **archived as of August 2026, read-only.** Don't treat it as current; use `punkpeye`'s list instead.

## 4. Security — MCP-specific

(Brief here; general repo/dependency vetting is its own stage, #12.) The specific risk shape unique to MCP is **tool poisoning**: a malicious or later-compromised server embeds hidden instructions inside a tool's description field — text the model reads as part of its context but a human reviewing the UI doesn't see — and the agent follows those instructions without you noticing. A related pattern is the "rug pull": a tool's description changes after you've already approved it, weeks or months later, without a new consent prompt. Anthropic has confirmed this is a known, accepted characteristic of the current protocol design and has not committed to a protocol-level fix — the mitigation burden sits with the person configuring the client. Industry response as of mid-2026: Microsoft's June guidance classifies MCP tool descriptions as a supply-chain asset needing the same review rigor as production code, and OWASP lists tool poisoning in its MCP Top 10.

Practical takeaway for a personal setup: treat adding or updating an MCP server config as a real review event, not a checkbox — read the tool descriptions it registers, prefer servers from `modelcontextprotocol/servers` or well-known maintainers over random unaudited ones, and don't blanket-trust a server just because it worked fine on day one.

## 5. The work-restricted workaround, in more depth

Where MCP is blocked by policy (your work situation), the pattern already named in Stage 0 — wrap the same capability as an Agent Skill calling a direct API/CLI — works because a Skill doesn't require a standing server process or new network endpoint; it's markdown plus a script, invoked inside your existing session the same way any other Skill is. Concretely: instead of running a GitHub MCP server, a Skill's script shells out to `gh` (already installed, already authenticated) or calls the REST API directly with a token from your existing auth. You lose the live tool/resource schema MCP gives multiple clients "for free," but you gain something MCP explicitly doesn't have yet: the whole thing is auditable as plain text before it ever runs, which is exactly what the tool-poisoning risk in §4 argues you want anyway.

## Sources

- modelcontextprotocol.io official documentation (protocol overview, client/server/tools/resources/prompts model)
- `github.com/modelcontextprotocol/servers` (official reference servers, ~79k stars)
- `github.com/punkpeye/awesome-mcp-servers` (~92.7k stars, active) vs. `github.com/appcypher/awesome-mcp-servers` (~5.8k stars, archived Aug 2026) — checked directly, not taken from a secondary list
- Cloud Security Alliance research notes on MCP tool poisoning and design flaws (2026)
- Reporting on Microsoft's June 2026 MCP security guidance and OWASP's MCP Top 10 (tool poisoning, third entry) — via aggregated security-blog coverage, not fetched from Microsoft/OWASP primary docs directly; treat as directionally reliable, not verbatim-quoted
