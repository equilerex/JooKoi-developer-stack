# Planning Before Implementation — An Evidence-Based Approach

Ported from the original Cowork-session location (`JooKoi-frontpage-to-the-open-web/.agents/planning-before-implementation.md`) — this is the one file from that batch that never made it across when the projects split. Content unchanged from the original; see `planning/decisions/004-cross-repo-consolidation-plan.md` for how this gap was found.

A note on the evidence before anything else, because you're right to demand it: most cited papers here are 2025–2026 arXiv preprints, typically written 2–4 months before this document. In a field moving as fast as agentic coding, a paper measuring GPT-5-mini or Claude 4.5 in February may already be testing a stale model by August. Two things survive that problem and two don't:

- **Survives:** *mechanisms* — the shape of a failure mode, the reason a technique works or fails. "Self-review doesn't catch semantic drift because the model that made the error shares the blind spot that produced it" is a structural claim about how these systems work, not a benchmark score. It doesn't expire when the next model ships.
- **Doesn't survive:** *magnitudes* — "80-point cliff," "31.7%," "3% effect." These are true of the specific models tested, on that date. Treat every number in this document as "this was the shape of the effect in mid-2026," not as a constant you can plan a budget around.

So read this for direction, verify magnitude yourself if a decision hinges on it, and re-test anything numeric after a major model release. Where a finding is contested or thin, I've said so.

---

# Part 1 — Should you even plan?

This is the question everyone skips, and it's the one with the clearest evidence behind it.

**The core finding, and it cuts against the instinct to always plan first:** a controlled ablation (16,991 SWE-bench trajectories, plan-removal design) found that removing an upfront plan barely affected strong models but collapsed weaker ones — meaning planning substitutes for capability more than it adds to it. A second study found planning representations helped *only* on tasks past the model's unaided ceiling; on easy tasks, imposing a plan actively hurt, by constraining exploration that would otherwise have found a better solution. In the ablation, removing the plan let models solve dozens of instances the plan had been preventing them from reaching.

**The practical test, then, is not "is this a big task" — it's "would I bet on the agent one-shotting this unaided?"**

**Skip planning when:**
- The change touches one or a few files the agent has already read this session
- There's a fast deterministic feedback loop — a failing test, a type error, a stack trace — where try-and-fix converges faster than deliberation
- The change is cheaply reversible
- You're still discovering the shape of the problem (a plan here locks in the wrong shape)

**Plan when:**
- The task is past what you'd bet the agent can one-shot
- The work spans multiple sessions, so nothing else will hold the shared intent
- A wrong architectural choice would be expensive to discover late
- Multiple people (or multiple future-you sessions) need to agree on scope before work starts

**The corollary that's easy to miss:** an unreviewed plan is worse than no plan. It's pure cost — your time producing it, the agent's tokens executing against it — plus a false-confidence surcharge, because a plan someone approved *feels* validated even when nobody actually checked it against the codebase. The plan is not the artifact that matters. **Your review of the plan is the load-bearing step.** Everything downstream of this document assumes you're actually reading what comes out, not rubber-stamping it because it looks coherent.

That caution is not abstract. In the one industrial-scale randomized trial available (16 experienced developers, 246 real tasks), developers using AI tools were **19% slower** while believing they were **20% faster**. Your felt sense that a planning session "went well" is exactly the kind of self-assessment that study showed to be unreliable. Don't trust the vibe; check the artifact.

---

# Part 2 — Elicitation: getting the requirements out of your head

You already do this informally with a "grill me" prompt. Here's the systematic version and where your instinct was right or wrong.

### 2.1 Keep the interrogation prompt thin, not heavy

Counterintuitively, a minimal interviewer prompt elicits *more* requirements and more context-adaptive questions than a long, structured elicitation framework. The heavy prompt produces better-formed questions and a tidier summary, but at the cost of exploration. **Practical rule: start with something close to "ask me what you need to know to build this, one question at a time" — save the checklist rigor for a second pass, not the first.**

### 2.2 Never ask the model to self-report what's ambiguous

This is the single most common move in AI-assisted planning and it has direct disconfirming evidence. When models are asked to flag ambiguity in their own understanding of a task, detection precision sits around chance and localization is worse. The mechanism explains why: an underspecified prompt doesn't produce incoherent output — the model converges *confidently* on one plausible reading and won't tell you it guessed. Coherent, articulate, internally consistent output is not evidence the model understood you correctly.

**What to do instead: generate divergence, then look at the diff.** Ask the same question twice — different model families if you have them (Claude + a Codex/Gemini second opinion), or the same model at a higher temperature if you don't — and compare the *interpretations*, not the code. Disagreement between the two readings is a real, measured signal of underspecification. Agreement is weaker evidence of clarity than it feels like, but it's still better than asking the model to grade its own homework.

### 2.3 Structure the interrogation around a small ambiguity taxonomy

Four categories catch most of what matters: missing goals, missing constraints/premises, vague terminology, and structural/syntactic ambiguity. Of these, **vague domain terminology is consistently the worst offender** across every study that measured it — worse than missing structure. The practical implication: a project glossary (what do *you* mean by "trusted," by "verified," by "source") is probably higher-leverage than a better plan template. Write it once, put it in your persistent context, and the interrogation gets sharper for free.

### 2.4 Write acceptance criteria in EARS form, with real tests, not prose

EARS notation — "When \<trigger\>, the \<system\> shall \<response\>" — forces you out of vague prose into checkable statements. It's an old requirements-engineering format (not AI-specific), but it mechanically eliminates the vagueness category that's empirically the worst source of failure, and it's what AWS Kiro's spec workflow defaults to for exactly this reason.

The stronger and better-evidenced move: **put a handful of concrete failing tests in the plan itself**, not just prose criteria. Studies of test-first generation consistently show meaningful gains, largest for messier or more ambiguous tasks — exactly the tasks where you bothered to plan in the first place. One caveat that matters: a *few sharp tests* beat a large suite pasted into context — dumping many tests degrades the model's attention to the ones that matter. Two or three well-chosen tests, not twenty.

### 2.5 What must stay yours

The elicitation research is consistent on where an agent-conducted interview breaks down: it fabricates plausible-sounding costs and effort estimates, misses privacy/scope implications a human would flag by instinct, and has no read on the difference between what a stakeholder said and what they actually meant. Translating to your situation: **scope boundaries, cost/effort tradeoffs, which invariant wins when two requirements conflict, and what "done" actually means** are decisions you make, not decisions you delegate to the interrogation. The agent's job is to surface the question; yours is to answer it.

---

# Part 3 — Research before planning: worth it, but less than the rhetoric claims

The "explore the codebase before you plan" pattern is widely preached. The one controlled test of it found a real but small effect — roughly a 3% quality improvement, not the transformative gain the pattern's advocates imply. More interesting: within that same study, **checking the plan against the actual repo (validation) outperformed reading the repo before writing the plan (discovery)** by a wide margin. And in a blinded human comparison, reviewers actually *preferred* the ungrounded output more often than the grounded one — the grounding didn't obviously read as better to a human judge, even where it scored higher on automated metrics.

**Practical reading: don't over-invest in an elaborate research phase. Do invest in a cheap validation pass** — after the plan is drafted, have an agent (or yourself) check that the files, symbols, and APIs the plan references actually exist and behave as assumed. That's a mechanical check, not a research essay, and it's the part with the stronger evidence behind it.

**One place research genuinely earns its keep, with the strongest evidence in this whole area: writing down what the codebase can't tell the agent.** A study on this found compliance with product decisions and prior rulings — the "we decided X and here's why" facts that live nowhere in the code — jumped from roughly half compliant to near-total once written into plan-time context, while decisions already visible in the code were near-100% either way regardless of extra context. **Translation: your plan-time research budget should go toward product intent and prior decisions, not toward re-reading code the agent can already see.** This is exactly what an ADR practice is for — if it's written down there, the agent doesn't need to rediscover it, and it stops being a place research effort gets wasted.

If you do run a research phase, run it as an isolated sub-agent that returns a condensed brief (roughly a page, not a transcript) rather than dumping its full exploration into your planning context. The mechanism here is simply arithmetic about context budget, not a measured finding, but it's cheap to do and costs nothing if it doesn't help.

---

# Part 4 — Decomposition: cutting the plan into executable pieces

**The one thing with real evidence: units of work need an explicit, independently-checkable output, and need to be retryable alone.** A study measuring decomposition strategies found that a rigid ordered task chain was *worse* than not decomposing at all when something failed partway through — because a downstream failure forced re-running the entire chain from the top. Decomposition that allowed selective retry of just the failed unit cut recovery cost sharply compared to both the ordered-chain and the no-decomposition baselines.

**What this means practically: don't write a plan as "step 1, step 2, step 3" where step 3 assumes step 1 and 2 succeeded in some fragile way.** Write each step so it has its own pass/fail condition, checkable without re-running everything before it. If step 3 fails, you should be able to fix step 3 alone.

**On "vertical slices vs horizontal layers"** — you'll see this argued constantly as settled wisdom. It isn't; no study has actually measured the two against each other for agent execution. The one adjacent finding (retryable independent units win) happens to favor vertical slices as a rationalization, but that's inference dressed as evidence. Treat it as reasonable default taste, not as something you need to defend with a citation.

**Static plan, minimal replanning.** A plan regenerated mid-execution measurably underperforms a plan written once and executed — dynamic replanning in these studies produced action loops and lost track of what had actually been tried. Write the plan, execute against it, and only regenerate on a hard failure that genuinely invalidates the approach — not every time something looks slightly off.

---

# Part 5 — Critiquing the plan before you execute it

This is where your existing instinct ("grill me") needs the most correction, because the two most natural moves — asking the model to critique its own plan, and asking several agents to agree on it — are the two with the strongest evidence *against* them.

### 5.1 Self-critique is not a gate

A model reviewing its own plan misses roughly a third of its own semantic errors on average, and the failure is bimodal — some models catch nearly everything they got wrong, others catch almost nothing, and you generally don't know which regime yours is in without testing it. Worse, this happens even when the model can *articulate* the exact rule it violated when asked directly — it knows the rule, it just doesn't apply it to its own output. **Use self-critique as a cheap first pass if you want, never as the thing that clears a plan for execution.**

### 5.2 Consensus is not evidence

Multiple agents agreeing on a plan is not a stronger signal than one agent agreeing with itself — it can be weaker. The clearest demonstration: a stage-gated review pipeline once had 80-plus agents *unanimously* endorse a security vulnerability that didn't exist, and only running actual code caught it. Multi-agent "debate" and "council of experts" patterns are popular and expensive, and after dozens of studies of the general pattern, none cleanly show it beats one strong model with the same token budget — the documented failure modes are sycophancy between agents and premature convergence on a shared wrong answer. **If you're tempted to spin up three agents to "vote" on a plan, don't. It looks like rigor and isn't.**

### 5.3 What does work: a cold-start critic, from a different model family, demanding evidence

Two things compound here and both have real backing:

- **Cross-family, not same-family.** A critic from a different model lineage, with no memory of how the plan was produced, catches things a same-family reviewer misses — because training-data-correlated blind spots are shared within a family and not across them. Fresh context matters as much as different vendor: don't hand the critic your original prompt or reasoning, just the artifact.
- **Force a typed verdict, not a general critique.** "What do you think of this plan?" invites agreement. Structured review that requires an explicit verdict — agree with evidence, disagree with evidence, or disagree as a concern needing follow-up — measurably outperforms open-ended critique, and the mechanism is straightforward: two agreeable agents can converge on being wrong together, but forcing an explicit disagreement type breaks that.

And underneath all of it: **nothing here substitutes for something actually running.** The strongest-performing review pipeline in this research area kills the large majority of its own candidate findings, and the stage that does the real work is the one requiring runtime evidence — not the critique stages. If a plan makes a factual claim about how something behaves, the question isn't "does this sound right to a second model" — it's "did we run it."

### 5.4 The one structured technique with a real (if narrower than advertised) effect: the premortem

"Imagine this plan failed — why?" The best-controlled study of this technique found it improved calibration — people's confidence became more accurate — but did *not* show a significant effect on actual plan comprehension. That's a real, useful effect, just a narrower one than the "premortems surface 30% more failure causes" claim you'll see repeated. It's cheap and worth doing; don't expect it to be the thing that catches the failure mode self-critique misses.

---

# Part 6 — When you're right to say no to a heavyweight process

You asked specifically about when *not* to use something, so here it is plainly, because this is where the evidence is sharpest and least ambiguous.

**Full spec-driven ceremony — constitution, spec, plan, tasks, a formal multi-artifact pipeline — is a default to be skeptical of, not adopted wholesale.** The most carefully measured critique found the full-ceremony approach produced less code for more total time than a normal iterative loop, with the majority of that extra time spent by the *human* reviewing plan artifacts rather than by the agent working — and it still shipped an undetected bug. An independent assessment across three different spec-driven tools found no quantitative data supporting the approach anywhere, plus a case where the tool turned a small bug fix into over a dozen formal acceptance criteria — ceremony applied to a task that didn't need it. The genuinely supportive evidence for spec-driven development that does exist is real but thin: an unreplicated vendor-internal number, an "up to" figure that's explicitly an upper bound, and a pilot its own authors call illustrative rather than a controlled result. **The line that survives every version of this critique, supportive or not: agents perform better against a written, human-reviewed statement of intent. That's an argument for writing a plan. It is not an argument for a five-stage formal pipeline.**

**Automated drift-reconciliation between a spec and the code it's meant to describe** — tooling that tries to keep the two in sync as the codebase evolves — has no published measurement behind it despite being flagged by practitioners as the single biggest unsolved problem in this whole space. Reconciling two documents with an LLM inherits the exact failure mode (silent, confident, wrong) it's meant to fix. Don't build a workflow that depends on this working; keep the plan and the code in sync by discipline — updating the plan file in the same commit that changes the approach — not by automation.

**Match ceremony to the actual size of the change.** The most common self-inflicted failure across every practitioner account here is running the heavyweight process on a task that didn't warrant it — a two-file bug fix wrapped in a formal spec, review time eating the entire benefit. Circle back to Part 1: the size of the task doesn't determine whether you plan. Whether you'd bet on the agent one-shotting it does.

---

# Part 7 — A concrete workflow

Putting the evidence together into something you'd actually run.

**Step 0 — Gate.** Would you bet on the agent one-shotting this unaided? If yes, skip everything below and just do it.

**Step 1 — Elicit, thin-first.** Open with a minimal interrogation prompt, not a heavy framework. Structure follow-ups around the four-category ambiguity taxonomy (goals, constraints, terminology, structure), with extra attention to domain vocabulary — check it against your project glossary if you have one. Never ask the model whether it's confident it understood you; if you want a real ambiguity signal, ask the same question twice, compare the readings, and probe where they diverge.

**Step 2 — Write down what the code can't tell the agent.** Product intent, prior rulings, constraints that exist for reasons no longer visible in the code. This is your highest-leverage plan-time context, better evidenced than re-reading the codebase. If it's already in an ADR, reference it — this is why the ADR practice pays off here specifically.

**Step 3 — Draft one static plan.** Concrete acceptance criteria in EARS form, two or three sharp failing tests rather than a large suite, decomposed into steps each with its own independent output contract that can be retried alone if it fails. Skip formal spec-pipeline ceremony unless the task is genuinely large and multi-person.

**Step 4 — Validate the plan against the repo.** Do the referenced files, symbols and APIs actually exist and behave as the plan assumes? This mechanical check is better evidenced than a research phase before drafting, and cheaper.

**Step 5 — Critique once, correctly.** A cold-start review from a different model family, no shared context with the authoring session, forced into a typed verdict (agree-with-evidence / disagree-with-evidence / concern) rather than open prose. Add a premortem if the stakes justify it — expect it to sharpen your calibration, not to catch bugs by itself. Do not run three agents to vote; do not accept the plan's own self-critique as clearance.

**Step 6 — You review it. This is not optional and it is not delegable.** The plan is worthless as a safety mechanism if nobody actually reads it before execution starts.

**Step 7 — Execute without replanning.** Regenerate only on a hard failure that genuinely invalidates the approach.

---

## What this doesn't cover

Execution discipline once implementation starts — session boundaries, state handoff across sessions, keeping a multi-day build aligned to the plan, review economics at scale, recovery from a bad step — is a distinct phase with its own evidence base, never written up as its own document. Flagged as an open gap in the original `00-START-HERE.md` porting notes too — still open here.

---

## A note on confidence

Where a finding above rests on a single study, it's stated as "one study found" rather than settled. Where multiple independent lines of evidence converge — self-review being unreliable, consensus not being evidence, execution feedback beating static analysis — it's stated more plainly, because independent convergence is closer to what "durable" looks like in a field this young. Re-test the parts that matter to a real decision; don't take any of it, including this document, as more certain than the research it's built from actually was.
