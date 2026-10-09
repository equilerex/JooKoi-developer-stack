# Evidence

Read when the user challenges a recommendation or asks why. Full write-up with links: `ai-tooling-crash-course-for-developers/topics/base-instruction-files.md` in the JooKoi-developer-stack repo (not present in other checkouts; these summaries stand alone).

- **Size guidance.** Anthropic's Claude Code memory docs: keep each `CLAUDE.md` under 200 lines, "longer files consume more context and reduce adherence". No measurement published behind it.
- **Length vs compliance.** McMillan, arXiv:2605.10039, 1,650 Claude Code sessions, file length 25 to 500 lines: no detectable effect of length, rule position or structure on compliance. Having a file at all moved compliance from 0% to 67.7%. Compliance decayed about 5.6% (odds) per additional function generated within a session, regardless of file design. This is the case for hooks over prose for must-always rules.
- **Cost.** ETH Zurich SRI Lab, arXiv:2602.11988: context files raised inference cost 19 to 23%. Task success changed -0.5% to -2% for LLM-generated files, +4% for developer-written ones. Repository overviews were unhelpful.
- **What works in practice.** GitHub blog (Matt Nigh, 2025-11-19), analysis of 2,500+ repos: effective files have executable commands with flags, testing practice, and real code snippets over prose.
- **Context rot.** Chroma 2025: all 18 tested models degraded as input grew, well before the context limit. Liu et al. 2023 ("lost in the middle"): retrieval is weakest for content in the middle of context.
- **Nesting.** Contieri and Boudrias (Datadog): root for universal rules, nested only where a subtree differs. Boudrias: proximity discovery fails unless the agent is in that subtree, so root should route to nested files explicitly.
- **Prompt injection.** NVIDIA AI Red Team (2026-04-20): malicious dependency wrote an `AGENTS.md` claiming authority over user instructions and hiding changes in PR summaries. Backslash Security (2026-07-06): Codex `exec` mode followed attacker `AGENTS.md` to exfiltrate credentials.
- **Contradictions.** Anthropic docs: conflicting rules are resolved arbitrarily.
- **Emphasis.** Anthropic prompting guidance for current Claude models: they follow instructions precisely, and aggressive wording ("CRITICAL", "MUST") written for older models now causes over-triggering. Use normal wording.
