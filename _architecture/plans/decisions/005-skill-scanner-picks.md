# Decision 005 — First skill/artifact scanners to trial

Date: 2026-08-26

Status: TRIAL

## Problem

Third-party skills, MCP servers and plugins get adopted with no verification step. `ai-tooling-crash-course-for-developers/topics/skill-scanning-and-verification.md` establishes that this is a real attack surface; the user's read-through of that doc asked which scanner to actually run. Nothing was picked, so in practice nothing was scanned.

## Options considered

- One scanner, chosen as "best available".
- Two scanners from different vendors.
- No scanner — rely on source inspection, permission restriction and sandboxing alone.

## Decision

Trial two, from different vendors, before adopting any third-party artifact:

- **NVIDIA SkillSpector** (or the equivalent NVIDIA scanner named in `skill-scanning-and-verification.md`)
- **Snyk agent-scan**

Not a claim that either is sufficient alone, that these two are the best available, or that they substitute for the other defence layers in that doc (source inspection, permission restriction, sandboxing, reputable/maintained sources).

## Why not the alternatives

A single scanner's clean result is not evidence of safety. Per the doc's own findings, independent testing found scanners barely agree with each other (~0.12% agreement rate in one study) and are individually evadable (>90% bypass rate demonstrated in another). Two differently-built scanners give a second signal — still not a guarantee, just better than one. Running none was rejected because the non-scanner defence layers all depend on human attention that does not scale to every candidate.

## Next step

Run both against the first real third-party skill/MCP candidate this stack considers adopting (e.g. items surfacing out of `006-skill-stack-picks.md`) and log what each one actually caught or missed.
