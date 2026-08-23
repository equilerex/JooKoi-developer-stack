# Stage 1 — Agent code-execution sandboxing

Topic: whether "sandboxing" is becoming a real named security standard for AI coding agents, beyond the generic advice already in [`security-and-supply-chain.md`](./security-and-supply-chain.md) ("run unfamiliar tooling in an isolated context"). Options only, no pick made.

## 1. Is there an actual named standard?

No single cross-vendor spec for sandboxing itself. 2026's agentic-AI standards convergence is real but it's happening one layer up: MCP (tool connectivity, governed by Anthropic/community), A2A (agent-to-agent, now under the Linux Foundation), WebMCP (browser-facing tool exposure, W3C explainer stage). Sandboxing is not one of those layers — it's infrastructure each vendor still implements independently, using a shared *pool* of underlying isolation tech rather than a shared *protocol*. So: convergence on primitives, fragmentation on interface. If the user saw text describing "an emerging security standard," it's more accurately "a converging set of practices around a shared toolkit" than a ratified spec — worth being precise about since the difference matters for how much to trust any single vendor's docs as authoritative.

## 2. The shared toolkit (what's actually converging)

Three isolation primitives, used in different combinations:

- **OS-level syscall filtering** — macOS Seatbelt (Apple's App Store sandbox framework, reused), Linux `bubblewrap`/Landlock, Windows AppContainer. Cheap, no VM overhead, but shares the host kernel — a kernel exploit escapes it.
- **gVisor** — a user-space kernel that intercepts syscalls and only allows a vetted subset through to the real kernel. Stronger isolation than bubblewrap, some performance/compatibility cost. Anthropic uses this for Claude web's sandboxed code execution.
- **MicroVMs (Firecracker)** — hardware-virtualized, full kernel-boundary isolation, ~100-125ms cold start, snapshot/pause/resume in 5-30ms. Strongest guarantee, used by E2B and others built for concurrent multi-tenant execution.

Named vendor choices, each confirmed against current docs/blog sources (not aggregator-only):

- **Claude Code**: opt-in via `/sandbox` command (not default). macOS uses Seatbelt natively; Linux/WSL2 needs `bubblewrap` + `socat` installed; WSL1 unsupported. Two isolation layers: filesystem (write access restricted to working directory, explicit deny-list for things like `~/.bashrc`, SSH keys; reads are broader), and network (proxied, allow-list of domains, prompts on new ones). Two run modes: auto-allow within those boundaries, or manual-approval-per-command. This is the feature the user has direct hands-on access to already and hasn't turned on.
- **Claude web / Anthropic's hosted code-execution tool**: gVisor-based, MCP-integrated Python execution — chosen for gVisor's better fit at high concurrent-sandbox counts, not because it's inherently better than Firecracker for a single user.
- **OpenAI Codex CLI**: macOS Seatbelt, Linux Landlock (default), Windows AppContainer — same category of OS-level primitive as Claude Code, different implementation per OS.
- **Dedicated sandbox-as-a-service platforms** (relevant if building custom agent tooling, not just using an existing coding agent): E2B (Firecracker-based, fastest cold start in benchmarks ~717ms, strong SDK ergonomics, best fit for ephemeral single-session tasks), Modal (gVisor-based, GPU-friendly since gVisor doesn't block hardware passthrough the way some microVM setups can), Daytona (Docker-snapshot-based, tuned for persistent dev-workflow use rather than one-shot execution). These are aimed at people building agent products, not typically something a solo dev wires in just to run Claude Code safely — see Section 4.

## 3. Convergence or fragmentation?

Fragmented at the interface level, converging at the primitive level. Every serious vendor has landed on "OS-level enforcement, not prompt-level trust" as the design principle — that part is now closer to settled consensus than contested opinion, worth stating as near-fact. But there's no equivalent of MCP for sandboxes: no shared config format, no portable "sandbox descriptor" a tool from one vendor could hand to another. One relevant real signal: Anthropic's Claude Code sandbox runtime was released as an open source npm package usable outside Claude Code itself — a step toward a shared primitive, not yet a standard other vendors have adopted.

## 4. Practical takeaway for a solo home-dev setup

- Turning on Claude Code's `/sandbox` costs nothing and matches the current best-practice consensus (kernel-level enforcement over trusting the model/prompt). This is the direct, concrete answer to what was flagged as possibly dismissed too early — it's a real, low-effort, already-available feature, not vaporware or enterprise-only.
- The named CVE disclosure surfaced in research (CVE-2026-35022, referenced by multiple 2026 sources as motivating sandboxing adoption) is a concrete forcing-function reason this moved from "nice to have" to "worth doing now" — flagged here as a claim seen across secondary sources, not independently verified against a primary CVE database entry in this pass.
- The sandbox-as-a-service platforms (E2B/Modal/Daytona/Firecracker-direct) solve a different problem — running *many* concurrent isolated agent sessions at scale, typically for a product, not a single local dev's Claude Code sessions. Not worth adopting for a personal setup unless a future project specifically needs to spin up agent-executed code in an ephemeral cloud sandbox (e.g., a tool that lets an agent run untrusted code against real infra). Worth knowing the names exist, not worth setting up now — matches the project's stated anti-speculative-infrastructure stance.

## Open questions / weak sourcing

- The "emerging standard" framing itself is not fully pinned down — no primary spec document found; conclusion above is inferred from the pattern across several 2026 vendor blogs and comparison posts (Modal, Northflank, Qovery, Blaxel), which are vendor-interested parties, not neutral standards bodies. Treat the "convergence on primitives, not protocol" conclusion as a reasonable synthesis, not a verified fact from a primary source.
- CVE-2026-35022 mentioned by name in secondary sources describing Claude Code sandbox motivation — not independently checked against NVD/a primary advisory in this pass.
- Whether Claude Code's sandbox runtime npm package has seen real third-party adoption outside Anthropic's own tools — not checked; flagged as a claim from a single blog post, not a repo-health signal.
- No direct check performed on GitHub Copilot's sandboxing approach specifically (search results covered Codex and Claude but not Copilot in comparable depth) — gap, not a "Copilot has none" claim.
