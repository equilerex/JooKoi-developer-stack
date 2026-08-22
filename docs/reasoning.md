# Reasoning — how this repo got put together

This repo exists to solve a specific problem: AI-assisted development has gotten cheap enough that anyone can build serious personal tooling, but that also means the right setup differs person to person, even between two people in the same role. There is no single "correct" dev stack to copy — there's a personal one, curated deliberately, kept current. This repo is that: a personal, cross-project AI dev-tooling stack, built and owned by one person, not a generic template.

## Why curation, not adoption

The process here is deliberately staged rather than "pick the popular tools and go":

1. **Stage 0 — baseline.** Survey what's genuinely agreed-upon across the field right now (not a shopping list — a map of what's settled vs. still contested), then read it and mark each topic: already known, new, disagree, or wants a full curation pass. See `planning/stage-0-baseline.md`.
2. **Per-topic stages.** For each topic marked for deeper curation, do the actual research — options, trade-offs, who's behind each one — and present it as choices, not a pick. The person who owns the stack chooses; the research surfaces the options and does the source-checking.
3. **Only then, adopt.** A tool or practice enters `skills/`, `prompts/`, or `AGENTS.md` after being chosen this way — not because a single research pass mentioned it once.

This ordering matters because the failure mode being avoided is exactly the opposite one: assembling a stack from whatever one research session happened to surface, without checking it against real experience or verifying the sourcing.

## The evidence bar

Two tiers, not one:

- **De facto standards** (e.g. `SKILL.md`, the `AGENTS.md` convention) are stated as fact without a verification pass — they're settled enough that re-litigating them per curation stage would be wasted effort.
- **Opinionated choices** (which skill marketplace, which review pattern, which local-model workflow) require real sourcing before they're presented as an option at all: named practitioners with a checkable identity (org affiliation, public repo, publication history), current docs, or repo-health signals (stars, forks, active commits — not a one-person abandoned project). A new-but-promising exception is allowed, but has to be labeled as such, not folded in silently.

Raw material that doesn't clear this bar (e.g. an unverified AI-search-result dump) gets quarantined rather than discarded — see `planning/raw-inspiration-unverified.md` — and only promoted to `planning/sources.md` entry by entry, after checking.

## Global vs. seed

Two different jobs live in the same repo, and they're not the same thing:

- **Global** — content read every session, everywhere, regardless of project (`AGENTS.md`, most of `skills/` and `prompts/` today).
- **Seed** — a base project skeleton (folder layout, starter `AGENTS.md`, starter decision-log format) meant to be *copied into* a new project's own `.agents/`, not read from here directly. This doesn't exist yet — building it before a second real project has proven the shape would be speculative infrastructure, the same mistake the earlier product-planning research explicitly called out and avoided. It gets extracted from real project experience (starting with `JooKoi-frontpage-to-the-open-web`), not designed up front.

## Where the trail lives

`planning/` holds the process itself — the staged research, the red-lined baseline, decisions as they're made — separate from the stack it produces. That split is deliberate: someone reading `AGENTS.md` or a skill in `skills/` shouldn't have to read the research trail to use it, but the trail stays available for anyone (including a future self) who wants to know why something is the way it is.
