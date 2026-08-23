# Stage 1 — Base Instruction Files (AGENTS.md / CLAUDE.md)

Deep-dive on baseline topic #1, split out from topic #10 per the 2026-08-23 correction logged in `topic-index.md` — this is about the base instruction file itself (what goes in it, root-vs-nested precedence, provider loading mechanics), not the cross-project memory/ledger question `memory-and-progress-ledgers.md` covers. Some raw research already existed as a byproduct of that doc's expansion (its "Repo-scoped context files" subsection) — promoted into this doc rather than re-researched from scratch, per `TODO-LIST.md`.

**Framing constraint, per `topic-index.md`'s 2026-08-23 correction**: `AGENTS.md` is treated here as the primary, provider-agnostic source of truth — not `CLAUDE.md`. Provider-specific files are researched as thin pointers *to* it, not as equal alternatives. No pick is made in this doc — options and evidence only, per `docs/reasoning.md`'s process.

## 1. Governance, and the "60,000 repositories" claim

`AGENTS.md` is a real, governed convention, not an informal one. It was originally released by OpenAI in August 2025 and is now one of three anchor project contributions (alongside MCP from Anthropic and `goose` from Block) to the **Agentic AI Foundation (AAIF)**, announced by the Linux Foundation 2025-12-09 — confirmed directly against the Linux Foundation's own press release and the spec's own site (`agents.md`), which states "AGENTS.md is now stewarded by the Agentic AI Foundation under the Linux Foundation." Founding members at Platinum tier: AWS, Anthropic, Block, Bloomberg, Cloudflare, Google, Microsoft, OpenAI.

The spec itself is thin by design — the canonical repo (`github.com/agentsmd/agents.md`, ~22–24k★ depending on snapshot date, 35 commits) states plainly: "AGENTS.md is just standard Markdown. Use any headings you like." No mandatory fields, no schema.

**The "60,000+ repositories" figure — worth checking before repeating.** It appears in the Linux Foundation press release and on `agents.md` itself, but both trace to the same origin (OpenAI/the project's own self-reporting) — no independent third party was found reproducing the count in this pass, and GitHub code search wasn't reachable to verify directly. It's also a December 2025 figure being carried forward as if current. Separately, an unrelated arXiv paper (2606.07448, "Agentic Very Much!") reports 60.03% file-level agent-adoption among newly created GitHub projects — a superficially similar number measuring something else entirely; don't conflate the two.

## 2. Per-provider loading mechanics

Confirmed against official docs where available; cells marked "not documented" mean the vendor's own docs don't state it, not that the answer is unknown to this pass.

| Tool | Reads AGENTS.md natively? | Nested discovery | Documented precedence | Global/user file |
|---|---|---|---|---|
| Claude Code | No — reads `CLAUDE.md`; bridged via `@AGENTS.md` import or symlink | Yes, ancestors at launch + subdirs lazily | Concatenated, root→cwd | `~/.claude/CLAUDE.md` |
| Cursor | Yes, root + nested | Yes, nested overrides parent on conflict | Team → Project → User Rules, merged | UI-based User Rules |
| GitHub Copilot (IDE/coding agent) | Yes, incl. nested | Yes | Not documented | Web/CLI/JetBrains only |
| Copilot CLI | Yes | Yes | Explicitly none — "does not define a general precedence order" | `$HOME/.copilot/` |
| Gemini CLI | No, needs `context.fileName` config | Yes | Concatenated | `~/.gemini/GEMINI.md` |
| OpenAI Codex CLI | Yes (originator) | Yes, root→cwd, one file per dir | Nearer file overrides — concatenated in order | `~/.codex/AGENTS.md`, `AGENTS.override.md` checked first |
| opencode | Yes, preferred over CLAUDE.md | Yes, walks up from cwd | Nearest AGENTS.md → global → CLAUDE.md fallback | `~/.config/opencode/AGENTS.md` |
| Zed | Yes, but ranked below 5 other filenames in a 9-entry list | No — top-level of worktree only | First match in ordered list wins | Rules Library (app-level) |
| Amp | Yes | Yes — most thorough: ancestors always, subtree on file access | Per-directory fallback chain | `$HOME/.config/amp/AGENTS.md` |
| Windsurf/Cascade (Devin Desktop) | Yes | Yes, auto-scoped per directory | Not documented | Not documented |
| Cline | Yes (merged via a long-stalled PR) | Workspace + global combined | Workspace wins on conflict | `~/Documents/Cline/Rules` |
| Aider | No — no auto-discovery of any kind | n/a | n/a | Explicit `--read`/config only |
| Google Jules | Yes | Root only | n/a | Not documented |

Two things worth flagging: `agents.md`'s own "supported tools" list includes Aider, which Aider's own docs contradict — treat that list as a self-claim, not a compatibility matrix. And precedence is mostly unpublished — only Codex, opencode, Zed, Amp, and Cursor state a resolution order; Copilot CLI explicitly disclaims having one.

## 3. What actually belongs in the file — official guidance vs. the empirical record

Anthropic's own docs (`code.claude.com/docs/en/memory`) state a concrete target: "under 200 lines per CLAUDE.md file... longer files consume more context and reduce adherence." No measurement is published behind that guidance.

**The only controlled tests of this specific claim contradict it.** Three independent studies, checked directly:

- **ETH Zurich SRI Lab** (arXiv 2602.11988, Gloaguen/Mündler/Müller/Raychev/Vechev) — SWE-bench Lite + a 138-issue benchmark, 4 agents including Claude Code and Codex. Context files did not generally improve task success (−0.5% to −2% for LLM-generated files, +4% for developer-written ones) and increased inference cost 19–23% regardless. Repository overviews specifically — "despite being popular and recommended" — proved unhelpful.
- **Damon McMillan** (arXiv 2605.10039, solo author, weaker provenance) — a factorial study across 1,650 real Claude Code sessions varying file length 25–500 lines, rule position, and structure: no detectable contrast on compliance after correction for multiple testing. The one real effect found was **within-session decay**: roughly 5.6% lower compliance odds per additional function generated, regardless of file design.
- **Prakhar Khatri** (arXiv 2607.27250, independent researcher, weakest provenance) — 288 runs, no significant effect on correctness from having a context file at all; near-miss failures traced to implementation skill, not missing repo knowledge.

**The honest synthesis**: having a file at all matters (compliance went from 0% to 67.7% with vs. without one, per McMillan); its length and internal structure are not shown to. If anything decays adherence, it's session length, not file length — which is a stronger argument for hooks (deterministic enforcement) than for editing file structure.

Descriptively, GitHub's own analysis of 2,500+ repositories (Matt Nigh, GitHub Blog, 2025-11-19) found effective files converge on executable commands with flags, testing practices, real code-style examples over prose description, and explicit boundaries — "one real code snippet showing your style beats three paragraphs describing it." No length prescription given.

**Compaction, answered directly by the docs**: root-level `CLAUDE.md` survives `/compact` — Claude re-reads it from disk and re-injects it. Nested files and `paths:`-scoped rules reload only when Claude reads files they apply to, so they effectively decay under compaction until re-triggered. A real argument for keeping load-bearing rules at root.

## 4. Nested files and the local-override pattern

Nested `AGENTS.md` (root for global rules, per-subtree files only where a subtree genuinely differs) is a named, repeatable practice — confirmed via Maximiliano Contieri (checkable identity: O'Reilly author, cross-posted Medium/Substack/DEV) and Simon Boudrias (Datadog, DEV.to), who adds a useful counter-argument: proximity-based discovery only works if the agent is already working from that subfolder or is told to `@`-reference it — his fix is a root-level router file that explicitly dispatches to nested files by task type, not nesting alone.

**Correction to a prior pass**: the local-override filename is `AGENTS.local.md`, not `AGENTS.md.local`. It's mostly convention, not tooling — Contieri himself hedges "support varies by tool; check your documentation." What's actually native: **Claude Code's `CLAUDE.local.md`** is documented and gitignore-friendly (with a real gotcha — it only exists in the worktree it was created in; use an `@~/.claude/...` import to share across worktrees), and **Codex CLI's `AGENTS.override.md`** is checked before `AGENTS.md` at both global and per-directory scope. opencode explicitly declined this (issue #16110, closed "not planned"). Everywhere else, a file by that name is simply not read.

## 5. ADRs as agent context — folklore, not yet a spec

Both sources a prior pass cited for a 2026 "agent-optimized ADR" trend check out as real, and are both vendor content marketing (BrainGrid, and Actual AI) rather than independent research — no quantitative validation in either. The mechanism-level argument (an agent blind to *why* a decision was made will confidently refactor the reason away) is plausible and untested. `adr.github.io` itself has no agent-related content as of this pass. The one attempt at a real standard, `me2resh/agent-decision-record` ("AgDR" — records decisions *made by* an agent, not decisions fed *to* one, a different problem), sits at 42 stars, effectively solo-maintained. **Bottom line: there is no canonical agent-optimized ADR format yet** — worth knowing the idea, not worth adopting a specific template.

## 6. Drift, linting, and generation tooling — traction flagged bluntly

- **`agent-sh/agnix`** — 387★/32 forks, a real linter/LSP (448 self-claimed rules across 9 tools) with editor plugins and a GitHub Action. The only tool in this category with anything resembling a real project around it.
- One-person / near-zero traction, worth knowing but not depending on: `severity1/claude-code-auto-memory` (145★, auto-maintains CLAUDE.md via isolated agents, healthiest of the small ones but still solo, pre-1.0), `BitRaptors/Archie` (16★, 0 forks — "zero forks is the tell"), `giacomo/agents-lint` (8★ — the one tool that checks whether the file still matches the codebase, right idea, no adoption), `felixgeelhaar/cclint` (6★ — the only one with an explicit size budget, ~10KB default warning threshold).
- The CI check pattern (fail the build if `CLAUDE.md` isn't a symlink or a one-line `@AGENTS.md` import) is real and matches Anthropic's own suggested pattern — but note Windows needs Administrator/Developer Mode for symlinks, so the `@AGENTS.md` import is the portable version of this check.
- Demand for native AGENTS.md support in Claude Code is real and unresolved: `anthropics/claude-code#6235`, open since 2025-08-21, no assignee, no visible official response as of this pass.

## 7. Anti-patterns and failure modes

**The strongest-sourced risk in this whole doc: a cloned repo's own AGENTS.md is a live prompt-injection vector, not a theoretical one.** NVIDIA's AI Red Team (Daniel Teixeira, 2026-04-20) demonstrated a real chain: a malicious dependency detects it's running inside an agent's environment, writes an `AGENTS.md` claiming "absolute authority" that supersedes the user's own instructions, and — worse — instructs the agent's own PR-summarization step to hide the change from reviewers. Separately, Backslash Security (2026-07-06) found OpenAI Codex CLI's non-interactive `exec` mode would silently follow attacker-controlled AGENTS.md instructions to exfiltrate AWS/npm/git credentials; OpenAI shipped a partial model-level fix, but the underlying claim — safety gating is mode-dependent, not invariant — stands unaddressed. **Practical read: don't auto-trust a cloned repo's instruction file the way you'd trust your own.**

Other named failure modes: Anthropic's own docs admit contradictory rules get resolved arbitrarily, and explicitly ship a `claudeMdExcludes` setting because monorepo ancestor files from *other teams* pollute context by default. Clay Tercek's independent critique ("AGENTS.md Is Not a README") adds two sharp points: committing an instruction file imposes one person's workflow on a whole team, and personal local files don't track your git branch, so they go stale by construction. A widely-reported (but not independently primary-sourced in this pass) 2026 incident — Apple shipping internal `CLAUDE.md` files inside a consumer app — is worth logging as a category example (committed instruction files leaking internal context), even though the specifics aren't independently confirmed here.

## 8. Practical read for this setup

Consistent with `topic-index.md`'s framing constraint: research and write any future instruction-file work provider-agnostically, `AGENTS.md` first, `CLAUDE.md`/others as thin `@`-imports — not the reverse. The empirical record (§3) argues against spending effort trimming file length and toward: keep root-level content load-bearing (it survives compaction; nested content doesn't until re-triggered), don't blanket-trust a cloned repo's own instruction file (§7), and treat within-session decay as the thing hooks should compensate for, not file editing. Once `~/.claude/CLAUDE.md` is revisited per `TODO-LIST.md`'s flagged item (unreviewed merge of an old personal version and an AI-suggested rewrite), this doc's §2–4 is the reference to check it against.

## Sources

Linux Foundation press release (2025-12-09, AAIF formation); `agents.md`; `aaif.io/projects/agents-md`; `github.com/agentsmd/agents.md`; arXiv 2606.07448; official docs — `code.claude.com/docs/en/memory`, `code.claude.com/docs/en/hooks`, Cursor (`cursor.com/docs/context/rules`), GitHub Copilot (`docs.github.com/copilot`), Gemini CLI (`github.com/google-gemini/gemini-cli`), OpenAI Codex CLI docs, `opencode.ai/docs/rules`, `zed.dev/docs/ai/rules`, `ampcode.com/manual`, `docs.devin.ai/desktop/cascade/agents-md`, `docs.cline.bot/customization/cline-rules`, `aider.chat/docs/usage/conventions.html`, `jules.google/docs`; arXiv 2602.11988 (ETH Zurich), 2605.10039 (McMillan), 2607.27250 (Khatri), 2509.14744 (PROFES 2025, note: numbers cited elsewhere for this paper did not match on direct fetch); GitHub Blog, Matt Nigh, "How to write a great agents.md" (2025-11-19); Maximiliano Contieri, "Use Nested AGENTS.md Files"; Simon Boudrias, DEV.to (Datadog); BrainGrid and Actual AI on agent-optimized ADRs; `adr.github.io`; `github.com/me2resh/agent-decision-record`; `github.com/agent-sh/agnix`; `github.com/severity1/claude-code-auto-memory`; `github.com/BitRaptors/Archie`; `github.com/giacomo/agents-lint`; `github.com/felixgeelhaar/cclint`; `anthropics/claude-code#6235`; NVIDIA AI Red Team, Daniel Teixeira (2026-04-20); Backslash Security, Amit Waizman (2026-07-06); Clay Tercek, "AGENTS.md Is Not a README" (2026-05-27).
