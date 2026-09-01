#!/bin/sh
# jookoi-doc — end-of-turn flush gate.
# Claude Code: Stop, SubagentStop. Gemini CLI: AfterAgent. Copilot CLI: Stop, AgentStop.
# Spec: ../references/hooks.md
#
# Blocks once, with instructions, when the session has unflushed work.
# Self-clearing: running flush removes the reason to block.

. "$(dirname -- "$0")/_common.sh"

# 1. Already mid-block. Exiting here is what stops the gate looping.
[ "$(field stop_hook_active)" = "true" ] && exit 0

# 2. Nothing changed on disk -- nothing worth recording.
[ -z "$(git -C "$REPO_ROOT" status --porcelain 2>/dev/null)" ] && exit 0

# 3. Session log already clean.
STATUS=$($DOC status 2>/dev/null) || exit 0
printf '%s' "$STATUS" | grep -q 'UNFLUSHED' || exit 0

emit_block "Unflushed jookoi-doc session log. Before ending: run \`jookoi-doc flush\`, then rewrite the standing summary in current-state.md and route any unfinished or newly surfaced work to next-steps.md (sequenced) or backlog.md (unscoped). See the jookoi-doc skill." "Stop"
exit 0
