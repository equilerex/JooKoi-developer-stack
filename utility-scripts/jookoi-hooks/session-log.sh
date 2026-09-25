#!/usr/bin/env bash
# jookoi-paper-trail — deterministic session-end / pre-compact capture.
# Not a jookoi-paper-trail write (that needs agent judgement) — just logs a timestamped
# marker + git state so the next session's SessionStart hook can flag it for
# curation into the working set (items.yaml).
set -euo pipefail

root="${CLAUDE_PROJECT_DIR:-.}"
log="$root/_jookoi-architecture/session-log.md"
mkdir -p "$(dirname "$log")"

{
  echo "## $(date -u +%Y-%m-%dT%H:%M:%SZ) — ${1:-session-end}"
  echo "branch: $(git -C "$root" branch --show-current 2>/dev/null || echo unknown)"
  echo '```'
  git -C "$root" status --short 2>/dev/null || true
  echo '```'
  echo
} >> "$log"
