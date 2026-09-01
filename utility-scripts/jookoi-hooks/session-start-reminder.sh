#!/usr/bin/env bash
# jookoi-paper-trail — SessionStart nudge.
# If the previous session(s) left an uncurated session-log, surface it so the
# agent considers folding it into TODO.md via jookoi-paper-trail, then
# clearing the log. Silent (no output) if there's nothing to flag.
set -euo pipefail

root="${CLAUDE_PROJECT_DIR:-.}"
log="$root/_jookoi-architecture/session-log.md"

if [ -s "$log" ]; then
  context="Uncurated session-end notes exist at _jookoi-architecture/session-log.md (from a prior SessionEnd/PreCompact hook). Consider invoking jookoi-paper-trail to fold anything still relevant into TODO.md, then clear this log."
  printf '{"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": "%s"}}\n' "$context"
fi
