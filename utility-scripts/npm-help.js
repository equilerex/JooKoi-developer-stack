#!/usr/bin/env node
// Prints available npm scripts with descriptions. JSON has no comments,
// so descriptions live here instead of in package.json.
const descriptions = {
  help: 'Show this list.',
  bonsai: 'Start Bonsai llama server (ctx 16384, ngl 99) from D:\\repos\\Babylon-5\\Bonsai-demo.',
  gr: 'Full graphify extract via Claude (deep, whole repo — costs API credits).',
  ollama: 'Start the local deepseek model gr:ollama expects.',
  'gr:ollama': 'Full graphify extract via local Ollama (free, slow — needs `ollama` running).',
  'gr:gemini': 'Full graphify extract via Gemini.',
  'gr:c': 'Quick code-only graphify extract (no LLM, fast).',
  'gr:i': 'Install/refresh the graphify CLI + hook for this repo.',
  'gr:query': 'Query the existing graph (needs gr or gr:c run first).',
  'gr:tree': 'Render the existing graph as a browsable HTML tree.',
  'vault:push': 'Push _jookoi-prefixed content into the personal vault repo.',
  'vault:pull': 'Pull vault content back into this checkout.',
  'vault:push:dry': 'Preview vault:push without writing anything.',
  'vault:pull:dry': 'Preview vault:pull without writing anything.',
  'sync:skill': 'Interactive: pick skills, pull latest from the marketplace (if there), symlink into ~/.agents and ~/.claude.',
  'setup:jnote': 'One-time: install global `jnote` shell function (PowerShell, pwsh, Git Bash).',
  jnote: 'Log a process-improvement note. Also runs as a bare `jnote` after setup:jnote.',
};

const pkg = require('../package.json');
const names = Object.keys(pkg.scripts);
const width = Math.max(...names.map((n) => n.length));

console.log('Available npm run scripts:\n');
for (const name of names) {
  const desc = descriptions[name] || '(no description — add one in utility-scripts/npm-help.js)';
  console.log(`  ${name.padEnd(width)}  ${desc}`);
}
