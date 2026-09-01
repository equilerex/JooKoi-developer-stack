#!/bin/sh
# jookoi-doc — rehydrate after compaction, and at session start.
# Claude Code: SessionStart (matcher compact|startup|resume).
# Gemini CLI: SessionStart (source compress). Copilot CLI: onSessionStart.
# Spec: ../references/hooks.md

. "$(dirname -- "$0")/_common.sh"

CS="$ARCH/current-state.md"
[ -f "$CS" ] || CS="$PRIV/current-state.md"
[ -f "$CS" ] || exit 0

# Standing summary: everything between its heading and the session log heading.
SUMMARY=$(awk '/^## Standing summary/{f=1;next} /^## Session log/{f=0} f' "$CS")

# Session log: everything after its heading. Present only if a session died unflushed
# or is mid-flight through a compaction.
LOG=$(awk '/^## Session log/{f=1;next} f' "$CS")

OUT="jookoi-doc — standing summary:"
[ -n "$SUMMARY" ] && OUT="$OUT
$SUMMARY"

OUT="$OUT

Track this session's work as you go: \`jookoi-doc note\` for things that happen, \`flush\` at session end (or when the Stop gate asks). Route anything unfinished or newly surfaced to next-steps.md or backlog.md."

if printf '%s' "$LOG" | grep -q '[^[:space:]]'; then
  OUT="$OUT

Unflushed session log (a prior session ended without flushing, or this is post-compaction):
$LOG

Run \`jookoi-doc flush\` when this session's work is recorded. Keep the entries' own dates."
fi

if [ -s "$PRIV/session-log.md" ]; then
  OUT="$OUT

Undrained raw notes at _jookoi-architecture/session-log.md. Read, route what still matters, clear it."
fi

emit_context "$OUT" "SessionStart"
exit 0
