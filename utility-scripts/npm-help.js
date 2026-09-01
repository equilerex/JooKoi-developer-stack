#!/usr/bin/env node
// Prints available npm scripts with descriptions. JSON has no comments,
// so descriptions live here instead of in package.json.
const descriptions = {
  help: 'Show this list.',
  gr: 'Full graphify extract via local Ollama (deep, slow — whole repo).',
  'gr:c': 'Quick code-only graphify extract (no LLM, fast).',
  'gr:i': 'Install/refresh the graphify CLI + hook for this repo.',
  'gr:query': 'Query the existing graph (needs gr or gr:c run first).',
  'gr:tree': 'Render the existing graph as a browsable HTML tree.',
  'vault:push': 'Push _jookoi-prefixed content into the personal vault repo.',
  'vault:pull': 'Pull vault content back into this checkout.',
  'vault:push:dry': 'Preview vault:push without writing anything.',
  'vault:pull:dry': 'Preview vault:pull without writing anything.',
};

const pkg = require('../package.json');
const names = Object.keys(pkg.scripts);
const width = Math.max(...names.map((n) => n.length));

console.log('Available npm run scripts:\n');
for (const name of names) {
  const desc = descriptions[name] || '(no description — add one in utility-scripts/npm-help.js)';
  console.log(`  ${name.padEnd(width)}  ${desc}`);
}
