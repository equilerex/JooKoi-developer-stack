#!/usr/bin/env bash
# Applies the JooKoi opinionated graphify setup to the current repo.
# Canonical, git-tracked copy lives in this folder, inside JooKoi-developer-stack.
# Runs in place — never copied into the target repo.
#
# Usage: run from the target repo's root:
#   bash /path/to/JooKoi-developer-stack/my-repo-setup/setup-scripts/jookoi-graphify-setup/setup.sh
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
target=".graphifyignore"

if [ -f "$target" ]; then
  echo "$target already exists — not overwritten. Diff it against $script_dir/graphifyignore-template by hand."
else
  cp "$script_dir/graphifyignore-template" "$target"
  echo "Wrote $target"
fi

echo ""
echo "Next steps (manual — package.json is never edited automatically):"
echo "  1. Merge $script_dir/package-scripts-snippet.json's scripts/devDependencies into this repo's package.json."
echo "  2. Run: npm install"
echo "  3. Run: npm run gr:i   (installs the graphify CLI + hook for this repo)"
echo "  4. Read $script_dir/README.md for the _architecture/graphify/ vs _jookoi-architecture/graphify/ decision."
