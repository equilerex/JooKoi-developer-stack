# Hooks — session-end flush across three harnesses

The pipeline only stays honest if flush actually fires. Rule-driven invocation is the primary path; hooks are the backstop for the session that ends without one.

Three scripts, one job each. All POSIX `sh`, all reading hook JSON on stdin, all emitting the calling harness's output shape from a single `emit` function.

| Job | Claude Code | Gemini CLI | GitHub Copilot CLI |
|---|---|---|---|
| Gate the end of a turn | `Stop`, `SubagentStop` | `AfterAgent` | `Stop`, `AgentStop` |
| Preserve before compaction | `PreCompact` | `PreCompress` | — (no auto-compaction loop) |
| Rehydrate after compaction | `SessionStart` matcher `compact` | `SessionStart` source `compress` | — |
| Rehydrate on a new session | `SessionStart` matcher `startup`/`resume` | `SessionStart` | `onSessionStart` |
| Config location | `.claude/settings.json` | `.gemini/hooks/hooks.json` (v0.26.0+) | `hooks.json`, or `joinSession()` via `@github/copilot-sdk/extension` |

Copy-in fragments for each live in `hooks/config/`.

---

## `doc-gate.sh` — the flush gate

Blocks the end of a turn once, with instructions, when the session has unflushed work.

Blocks only when **all three** hold:

1. the harness is not already mid-block (`stop_hook_active` is not `true`);
2. `git status --porcelain` is non-empty — a session that changed nothing has nothing to record;
3. `jookoi-doc status` reports an unflushed session log.

Flush clears condition 3, so the gate is self-clearing and cannot loop on itself.

**Condition 1 is not optional.** Without it the gate blocks every turn up to Claude Code's cap (8 by default, `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`), and on a harness with no cap it hangs the session outright.

**Unverified — check before relying on it.** Claude Code's `Stop` documents `decision: "block"` with `additionalContext`. Whether Gemini's `AfterAgent` and Copilot's `Stop`/`AgentStop` support a blocking decision has not been confirmed against their current docs. Where blocking is unavailable the script degrades: it writes the reminder to `_jookoi-architecture/session-log.md` and the next `SessionStart` surfaces it. That path is strictly weaker — the reminder arrives one session late — so verify blocking support rather than assuming the fallback is fine.

---

## `preserve.sh` — before compaction

`PreCompact` receives the **entire uncompacted transcript on stdin**. It cannot inject anything back, and it does not need to: its job is to get to disk what compaction is about to throw away.

Appends to `_jookoi-architecture/session-log.md`: timestamp, branch, `git status --short`, and anything from the transcript that has not reached the session log.

That file is a coarse recovery record, not a pipeline stage. It is raw material for reconstructing a session whose log is thin. Drain it by reading it, routing what still matters through the tree, then clearing it.

---

## `rehydrate.sh` — after compaction, and at session start

`SessionStart` fires after the context has shrunk and **can** inject. It emits, as `additionalContext`:

- the standing summary from `current-state.md`;
- the current session log, if non-empty;
- a one-line notice if `_jookoi-architecture/session-log.md` has undrained content.

This pairing is why `current-state.md` is a separate file rather than the top of `progress.md`: it is the thing read back in when context is lost.

Matching on the compaction source keeps a fresh startup from paying for a rehydrate it does not need — but injecting on `startup` and `resume` too is cheap and means a cold session begins with the standing summary already in hand.

---

## Registering

Claude Code, in `.claude/settings.json` — merge, do not replace:

```json
{
  "hooks": {
    "Stop": [
      { "hooks": [{ "type": "command", "command": "sh .agents/skills/jookoi-doc/hooks/doc-gate.sh" }] }
    ],
    "PreCompact": [
      { "hooks": [{ "type": "command", "command": "sh .agents/skills/jookoi-doc/hooks/preserve.sh" }] }
    ],
    "SessionStart": [
      { "matcher": "compact|startup|resume",
        "hooks": [{ "type": "command", "command": "sh .agents/skills/jookoi-doc/hooks/rehydrate.sh" }] }
    ]
  }
}
```

No hook on any harness can invoke a skill by name. The gate injects an instruction to run `jookoi-doc flush`; the model does the invoking. Design accordingly — the injected text has to stand on its own.

Registration is manual copy, deliberately. No setup script.
