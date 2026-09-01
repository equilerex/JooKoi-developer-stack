# Decision 009 — no binary dependencies in the stack layer (dotfiles/portability, topic 9)

Date: 2026-09-01

Status: DECIDED

## Problem

Topic 9 (dotfiles/portability) needs a way to keep `~/.agents/` and the rest of the personal layer consistent across machines and across the work/home boundary. The mainstream answer, and the one the blueprint research recommended, is a dedicated dotfile manager. That answer fails the constraint this stack is actually built under.

## Options considered

- **chezmoi** — the most-referenced current tool. Generates real files rather than symlinking (relevant on Windows, where symlinks need Admin or Developer Mode) and templates per-machine divergence from one repo.
- **GNU Stow** — lighter, symlink-based.
- **Dedicated AI-config managers** (`agentsync`, `ai-sync`, `ai_agent_dotfiles`) — all single-maintainer, pre-1.0.
- **Plain files, copied by hand** — no tool at all.

## Decision

**Plain files, copied by hand. No dotfile manager, no binary, no runtime dependency in the stack layer.**

This generalises past dotfiles into a standing constraint: anything in the shippable layer (`my-global-setup/`, `my-repo-setup/`, `prompts/`, skills) must work with nothing installed beyond what the machine already has. Scripts that ship are plain text in a runtime already present (shell, Node). A binary that has to be installed, approved, or scanned before the stack works is disqualified regardless of how good it is.

The one deliberate exception already in place: `jookoi-doc` ships a Node script for bookkeeping, and it degrades to a written spec (`references/file-formats.md`) that a human or an agent can follow by hand where Node is absent. That degradation path is the price of admission for any future script.

## Why not the alternatives

**chezmoi** — it is a compiled binary. On a locked corporate machine that means an install request, a security scan, or a flat refusal, and the stack is then unusable exactly where it is needed most. The stated benefit is templating work-vs-home divergence, but this stack already solves that differently and more cheaply: the `_jookoi-` prefix splits public from private, and one vault per environment means the two never need reconciling in the first place. Paying a binary dependency for a problem the architecture already answers is a bad trade. Its second benefit, generating real files instead of symlinks on Windows, is also moot, because copying files is what is being done anyway.

**GNU Stow** — symlink-based, and Windows symlinks need Admin or Developer Mode. Rejected for the same reason `decisions/007` rejected a `CLAUDE.md` symlink.

**Dedicated AI-config managers** — all single-maintainer and pre-1.0. More maintenance risk than the problem they solve, and they carry the binary/install cost as well.

**The cost being accepted:** no automatic reconciliation across machines. Applying the stack somewhere is a manual copy, and drift between a machine and the tracked bundle is caught by reading a `diff`, not by a tool. That is the same trade already made when the setup script was rejected: fewer moving parts, and everything visible.

## Next step

None. The constraint is stated in `README.md` and `personal-guidelines/developer-stack-tailoring.md`. Revisit only if a machine-count or divergence problem appears that a manual copy genuinely cannot hold, and even then prefer a plain script over an installed tool.
