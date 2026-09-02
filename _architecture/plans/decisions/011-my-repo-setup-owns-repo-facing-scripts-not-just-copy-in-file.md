# Decision 011 — my-repo-setup owns repo-facing scripts, not just copy-in files

Date: 2026-09-02

Status: DECIDED

## Problem

`jookoi-graphify-setup/` sat in `utility-scripts/` because it is a script, and `utility-scripts/` is where scripts live. But it does nothing for this repo — it configures graphify in *some other* repo. `my-repo-setup/` already held everything else concerning another repo, so the same concern was split across two folders on a criterion (is it executable?) that nobody actually navigates by.

`_architecture/plans/2026-08-30-jookoi-paper-trail.md` had explicitly assigned it to `utility-scripts/`, so this reverses a recorded call.

## Options considered

- Leave it in `utility-scripts/`, split by executable vs. inert.
- Move only `graphifyignore-template` into `my-repo-setup/` (it is the one file that lands in the target repo), leave the script behind.
- Move the whole bundle into `my-repo-setup/`, split by *which repo it concerns*.

## Decision

The whole bundle moves to `my-repo-setup/setup-scripts/jookoi-graphify-setup/`.

The dividing line is **which repo the thing concerns**, not whether it executes. `my-repo-setup/` = another repo. `utility-scripts/` = this repo. A `setup-scripts/` subfolder keeps the second distinction visible where it still matters: the starter tree gets copied into the target, `setup-scripts/` never does.

`AGENTS.md` claimed nothing in `my-repo-setup/` executes. That was true and is not any more, so it was rewritten rather than used as an argument against the move — the property worth guaranteeing is that nothing runs *unless invoked*, which still holds.

## Why not the alternatives

Splitting on executable-vs-inert is a property of the file, not of the question anyone asks when looking for it; the question is always "where's the stuff for setting up a new repo." Moving only the template is worse than either whole option — it puts two halves of one bundle in two places, and the snippet in this same bundle had already gone stale from exactly that kind of hand-maintained duplication.

## Next step

`setup-scripts/` is expected to gain the `_jookoi-architecture/` scaffolding script (`TODO.md`), which is the same shape: runs here, acts on a target repo.
