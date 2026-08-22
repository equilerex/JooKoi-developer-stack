# Stage 1 — Security: vetting AI tooling before you run it

This extends the existing personal stance ("no new dependency without a registry check — age, download counts, repo link; never substitute a second model's opinion for this") to the newer surface: Skills, MCP servers, and agent plugins. That surface is real and actively exploited as of 2026, not a hypothetical — see the incidents below. This is knowledge and practices, not a product recommendation; pick what's worth adopting.

## The threat is documented, not speculative

Several concrete, sourced incidents from 2026:

- **ClawHub (OpenClaw skill registry) was systematically poisoned at scale** — five of the top seven most-downloaded skills at peak infection were confirmed malware; a February 2026 coordinated campaign distributed 30+ malicious skills, and SlowMist's MistEye issued high-severity alerts for 472 malicious skills on the platform. The barrier to publishing a new skill there is just a `SKILL.md` file and a week-old GitHub account — no code signing, security review, or default sandboxing. (Sources: OpenSourceMalware.com campaign writeup, SlowMist MistEye alerts, referenced via Snyk's ToxicSkills research below.)
- **Snyk's ToxicSkills study** scanned 3,984 skills across ClawHub and skills.sh: 36.8% had at least one security flaw, 13.4% had critical issues, and prompt injection was found in 36% of scanned skills. (snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub)
- **Marketplace dependency hijacking in Claude Code specifically** — a malicious plugin can redirect dependency installs mid-flow so a routine "add httpx" request pulls a trojanized package instead, with the only user actions being "connect to an unofficial marketplace, install a plugin, ask Claude to add a dependency." Documented independently by both Prompt Security and SentinelOne. (prompt.security, sentinelone.com)
- **MCP-specific**: malicious or later-compromised MCP servers can act as bridges to sensitive local resources, exploit the sampling feature for prompt-injection-driven attacks, and — because many MCP servers run locally with direct filesystem/shell access — are vulnerable to command injection if input handling is careless. (Unit 42/Palo Alto Networks, Checkmarx MCP security 2026 report)
- **Anthropic's own guidance is blunt**: "A malicious Skill can direct Claude to invoke tools or execute code in ways that don't match the Skill's stated purpose" — including reading environment variables and exfiltrating API keys via URL parameters or embedded requests. Anthropic's stated recommendation is to use Skills only from sources you created yourself or Anthropic-vetted ones, and enterprise plans can turn on automatic skill/plugin malware scanning at upload time. (support.claude.com/en/articles/15927065, code.claude.com/docs/en/security-guidance)
- **General npm supply-chain context (not AI-specific, but the same failure mode)**: 2026 saw large legitimate-package takeovers — Axios (maintainer account compromise, RAT dropper via a hidden postinstall dependency) and keyv (127M weekly downloads, GitHub account takeover, credential-stealing worm pushed with valid CI-signed provenance). Roughly half of all tracked malicious-package incidents in 2026 are compromised *legitimate* packages, not attacker-authored ones from scratch — meaning a repo being old, popular, and previously trustworthy is not durable protection on its own. (Zscaler ThreatLabz, Aikido, Wiz, Microsoft Security Blog)

## Pre-install verification checklist

Adapted from OWASP's Agentic Skills Top 10 project (owasp.org/www-project-agentic-skills-top-10), trimmed to what's realistic for a single home developer rather than an enterprise security team:

**Worth doing every time, low effort:**
- Check the repo/author has a real, checkable identity — not just a username. A one-week-old account publishing a skill is the exact pattern behind the ClawHub incidents above.
- Read the skill's actual instructions/manifest before enabling it, specifically for: does it request write access to your instruction/memory files (`AGENTS.md`, memory directories), does it request broad/wildcard file or network access it has no obvious reason to need, does it pull logic or content from a remote source at runtime rather than being fully self-contained.
- Prefer Anthropic-vetted or first-party sources over third-party marketplaces for anything touching credentials, filesystem, or shell — this matches Anthropic's own stated position, not just a personal preference.
- If a skill/MCP server needs a dependency installed, watch what actually gets installed — the marketplace-hijack pattern above hides a swapped package inside an otherwise-normal-looking request.

**Worth doing for anything with real access (filesystem, shell, credentials), more effort:**
- Pin to a specific version/commit rather than "latest" — this is the direct mitigation for the "legitimate package gets compromised later" failure mode, since roughly half of 2026's incidents were exactly that.
- Consider a dependency-monitoring tool (Socket.dev is the most cited for exactly this — alerts on new vulnerabilities, maintainer changes, and packages starting to make network requests they didn't make before; deps.dev is a free alternative for basic lookup) if you're pulling in enough third-party skills/packages that manual review stops scaling.
- Run genuinely unfamiliar tooling in an isolated/sandboxed context first (a VM, a container, a throwaway environment) before giving it access to your real filesystem or credentials — this is the single highest-leverage practical step and the one most often skipped.

**Explicitly not worth it for a solo home setup** (per the same OWASP checklist, scaled down): a formal skill-inventory/governance workflow, mandatory code-signing infrastructure you maintain yourself, or enterprise-style approval pipelines. Those solve a team-coordination problem, not an individual-risk one — security theater relative to the actual threat model here.

## Handling "it was fine, then it wasn't"

The Axios and keyv incidents matter specifically because they show pinning-and-forgetting isn't enough on its own if you never revisit pinned versions — but *blindly auto-updating* is worse, since that's exactly the vector (a poisoned release ships with valid signatures and looks like a normal update). The practical middle ground practitioners point to: let a bot (Renovate, Dependabot) open update PRs rather than auto-merging, and actually look at what changed before accepting — version bump alone isn't a safety signal anymore given CI-signed provenance can now come from a compromised-but-legitimate pipeline.

## Sources
- OWASP Agentic Skills Top 10 project (owasp.org/www-project-agentic-skills-top-10)
- Snyk, "ToxicSkills: malicious AI agent skills in ClawHub" (snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub)
- Prompt Security and SentinelOne, both independently covering Claude Code marketplace dependency hijacking (prompt.security/blog/..., sentinelone.com/blog/marketplace-skills-and-dependency-hijack-in-claude-code)
- Anthropic Help Center, "Get started with skill and plugin scanning" (support.claude.com/en/articles/15927065) and Claude Code security guidance (code.claude.com/docs/en/security-guidance)
- Unit 42 (Palo Alto Networks), "New Prompt Injection Attack Vectors Through MCP Sampling"; Checkmarx, "MCP Security: Risks, Real Incidents & Controls (2026)"
- Zscaler ThreatLabz, Aikido, Wiz, Microsoft Security Blog — 2026 npm supply-chain incident coverage (Axios, keyv/cacheable, Mastra)
- Socket.dev documentation (docs.socket.dev/docs/dependency-search) for the dependency-monitoring tooling mention

**Weak-sourcing flag:** the OWASP "Agentic Skills Top 10" project is real and current but is a newer, narrower-adoption OWASP subproject compared to the flagship OWASP Top 10 — treat its checklist as credible guidance, not as an industry-universal standard the way the main OWASP Top 10 is. Everything else above traces to named security research teams or Anthropic's own docs.
