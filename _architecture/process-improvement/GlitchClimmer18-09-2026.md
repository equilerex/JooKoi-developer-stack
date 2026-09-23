Before the retrospective — **a test is failing, and it isn't mine to fix.** Something edited `DEFAULT_POSES` in `path.js` while I was working (along with `src/`, `AGENTS.md`, `web/live.js` — a parallel session, I'd guess). The new poses are two mirrored arches of equal width, which breaks the Task 4 assertion that strip 1 is *the shorter run*:

```
✖ the default poses keep the two strips clear of each other
ℹ pass 23  fail 1
```

The "strip 0 above strip 1" half still holds. What's obsolete is the span claim, which encoded the original spec's "strip 1 a shorter arc at 72%". The new layout deliberately abandons that. So either the poses go back, or that one assertion should — I've left both alone rather than pick for you.

Written to [PROCESS-NOTES.md](_architecture/PROCESS-NOTES.md). The honest summary:

**The expensive mistake was mine and structural.** I asked the right question early — debug or preview — got an answer, then wrote a spec that quietly narrowed it to "swap the renderer inside your page" and never read that narrowing back to you. Seven tasks ran correct-against-spec and useless-against-intent. Putting the mockup in the repo as `web/design/mockup-reference.html` and having the implementer read it directly worked first try; doing that on day one would have skipped the whole detour.

**Six of about nine review findings were defects in my plan, not implementer errors.** The pattern is sharp: the prose was fine, the *code blocks* were not. A float-equality assertion that fails against correct code, a test asserting behaviour my own data couldn't produce, a `try/catch` around only the parse. All written from memory, none executed once before being pasted into a brief. That's the highest-leverage fix available: run the pure-logic snippets before calling a plan finished.

**The line that earned the most per word** was in every dispatch: *if the brief contradicts the code, stop and report rather than adjust either side to fit*. It caught the silicone contradiction and the mode-switch binding bug — both cases where a compliant agent would have quietly edited a number to turn the suite green.

**What I'd cut:** full review agents spun up to confirm two-line fixes, a 3,380-line final package, and running every implementer at the same tier when several tasks were transcription plus `npm test`.

**What I'd keep without hesitation:** per-task review — every single one found something real — and doing the browser verification myself rather than delegating it. That caught four bugs no code review could have, including the layout feedback loop that was growing the page by a viewport per resize.

The most costly thing I *didn't* know going in was that your tree was already mid-migration. It made review packages noisy, made one of my stated constraints false, and left the final review with a Critical it couldn't resolve. Three lines before planning — target artefact, tree cleanliness, fixture values — would have removed most of it.


---

user: 


One thing I have noticed with some of maybe your plants or other LM plants is when I ask for a plan, it literally generates all the code and tells in the plan where to drop that code in. Where what I imagine a plan is the conceptual and the requirements, and good to knows, and kind of like the pros and technicalities around it, and not the actual code, where the code generation would then land upon cheaper models to figure out from the kind of a list of description and requirements, right? Is that something you seem to have struggled in our previous sessions in here, or am I misremembering it a bit. Second point, your comment about line that earned most per word if brief contradicts the code, stop and report rather than adjust either side of it. Where does this actually originate from? Is it from the superpowers? Is it from my own library? Is it from your own harness? Another note to add is that I can see that we have been using the superpowers agentic implementation pathways several times, but from what I can see, it is incredibly wasteful in terms of tokens. The task split-ups are often very chaotic and it delivers very little in massive amounts of time. And the quality is often even worse than if it was a single running session with me being the gateway of telling what is right or wrong versus it trying to do it automatically and delivering a sub-optimal product in five times the time and ten times the tokens and me then needing to restart from scratch and several steps of the process need to be redone. So I'm currently looking into if I should just disable the superpowers altogether or if it's the agendic plan implementation skill specifically that I need to remove or I'm also open for suggestions if I'm mistaken about this assessment. Keep in mind that this is not a production repository, this is bytecoding where it's not about accuracy and production stability, it is about speed and good enough

---

Let me verify the attribution before I answer, rather than guess.

All three verified. Straight answers.

## 1. You're not misremembering — it's mandated, and it's backwards for this repo

`writing-plans/SKILL.md:138` lists as a **plan failure**: "Steps that describe what to do without showing how (code blocks required for code steps)". So the skill requires plans to contain the finished code. I followed it.

Your instinct about the economics is right, and it's worse than inefficient — it inverted them. I wrote every line of code in the plan on an expensive model, then paid Sonnet to transcribe it, then paid a reviewer to check the transcription matched. The code was written twice and reviewed once.

And it caused the session's dominant failure mode. **Six of nine review findings were bugs in my plan's code blocks** — written from memory, never executed. The float-equality assertion, the silicone test contradicting its own data, the `try/catch` scoped around only the parse. A plan that had said *"parse stored poses defensively; malformed data costs the pose, never the page"* would have produced correct code from a cheap model on the first try. Instead I specified broken code precisely, and precision is exactly what got transcribed.

The rationale for code-in-plan is real — it makes tasks mechanical and review objective. But it only pays off if the plan author's code is correct, which requires running it, which the skill doesn't ask for.

**For bytecoding: plans should be requirements, interfaces, constraints and acceptance criteria. Signatures yes, bodies no.**

## 2. That line is mine

Not superpowers, not your library, not the harness. The four statuses (`DONE`/`BLOCKED`/`NEEDS_CONTEXT`) are from `implementer-prompt.md`. The skill's own "contradict" references are controller-facing — the pre-flight scan and ruling procedure, not a per-dispatch instruction.

I wrote *"if you find a contradiction between the brief and the code, stop and report it with specifics rather than adjusting either side to fit"* into the Task 3 dispatch, right after Task 2's implementer caught the silicone problem, and carried it forward. Worth keeping wherever you do delegate — it's one line and it converts a silent wrong fix into a question.

## 3. Your assessment of superpowers is correct, and I should have said so around task 3

The numbers: **~33 agent runs, roughly 3.3M subagent tokens**, for a page rebuild. Hit a weekly rate limit mid-session. And the decisive correction — that I'd built the wrong thing entirely — came from *you looking at the screen*, not from any of it.

The mismatch is structural. SDD optimises for **unattended correctness**: fresh context per task, independent review, explicitly *"Do not pause to check in with your human partner between tasks."* Your actual constraint is **speed with you as the gate**. Those are opposed goals, and the skill's design assumes you're not available — when you're the cheapest, fastest reviewer in the loop and sitting right there.

There's also circularity worth naming: a good share of what per-task review "caught" was mess the process itself created. Strip out the plan-code defects and four genuinely independent findings remain — the `lostpointercapture` gap, the `loadHw` scope, the `drawCores` type branch, the stale `StripView`. Three of those four I'd have found by running the page, which cost nearly nothing.

**Concrete recommendation:**

| Action | Why |
|---|---|
| **Disable `subagent-driven-development` and `executing-plans`** | This is where the 10× went |
| **Keep `brainstorming`** | It produced the mockup and the four-input model — the genuinely good output of this session |
| **Keep `writing-plans` only if you strip the code mandate** | Otherwise it's a liability; a plain outline in chat is better |
| **Keep `using-superpowers`? No** | It forces a skill-check round trip before every response, including "what does this do" |
| **Replace per-task review with:** you looking at it, plus one `/code-review` pass at the end | You caught the thing that mattered; the agents didn't |

Single session, me running the browser after each meaningful change, you saying yes/no — would have shipped this faster and with the scope error caught on day one.

I should have flagged this when Task 3 cost ~80k tokens for a 130-line file. I didn't, because the skill said to use it and I kept using it. That's worth you knowing about how I behave: **a loaded skill will generally beat my own judgement about whether it's appropriate**, so pruning the skill set is a more reliable lever than asking me to use them judiciously.

Want me to write this into `PROCESS-NOTES.md` once you've decided, and adjust the plan format there to the no-code version?
---
