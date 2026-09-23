#!/usr/bin/env node
// Interactive skill sync. Pick skills; for each one:
//   - in the marketplace: marketplace is canonical. Copy it into this repo's
//     my-global-setup mirror, then symlink the global folders to the marketplace.
//   - not in the marketplace: this repo's copy is canonical. Symlink the global
//     folders straight to it.
const fs = require('fs');
const os = require('os');
const path = require('path');
const p = require('@clack/prompts');

const repo = path.resolve(__dirname, '..');
const skillsDir = path.join(repo, 'my-global-setup', '.agents', 'skills');
const home = os.homedir();

// Forward slashes on purpose: no escape-sequence traps in JS strings.
const marketplaceCandidates = [
  path.resolve(repo, '..', 'jookoi-ai-market/plugins/jookoi-dev/skills'),
  'D:/repos/Serenity/jookoi-ai-market/plugins/jookoi-dev/skills',
  'C:/BB/serenity/jookoi-ai-market/plugins/jookoi-dev/skills',
]
  .map((d) => path.normalize(d))
  .filter((d, i, a) => a.indexOf(d) === i && fs.existsSync(d));

const targets = [path.join(home, '.agents', 'skills'), path.join(home, '.claude', 'skills')];

const cancelled = (v) => {
  if (p.isCancel(v)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }
  return v;
};

const exists = (t) => {
  try {
    fs.lstatSync(t);
    return true;
  } catch {
    return false;
  }
};

const remove = (t) => {
  if (exists(t)) fs.rmSync(t, { recursive: true, force: true });
};

const isSame = (a, b) => {
  try {
    return fs.realpathSync(a) === fs.realpathSync(b);
  } catch {
    return false;
  }
};

function link(target, dest) {
  if (isSame(target, dest) && fs.lstatSync(dest).isSymbolicLink()) return 'already linked';
  remove(dest);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.symlinkSync(target, dest, 'junction'); // junction: no admin/Developer Mode needed on Windows
  return 'linked';
}

async function main() {
  p.intro('sync:skill');

  const marketplace = marketplaceCandidates.length > 1
    ? cancelled(await p.select({
        message: 'Marketplace skills folder',
        options: marketplaceCandidates.map((d) => ({ value: d, label: d })),
      }))
    : marketplaceCandidates[0];
  if (!marketplace) p.log.warn('No marketplace folder found. Skills link straight to this repo.');
  else p.log.info(`Marketplace: ${marketplace}`);

  const inMarket = (s) => marketplace && fs.existsSync(path.join(marketplace, s, 'SKILL.md'));
  const skills = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md')))
    .map((e) => e.name);

  const chosen = cancelled(await p.autocompleteMultiselect({
    message: 'Skills to sync (type to filter, space toggles, enter confirms)',
    options: skills.map((s) => ({
      value: s,
      label: s,
      hint: inMarket(s) ? 'marketplace -> repo + links' : 'repo -> links',
    })),
    required: true,
  }));

  const chosenTargets = cancelled(await p.multiselect({
    message: 'Link into',
    options: targets.map((t) => ({ value: t, label: t })),
    initialValues: targets,
    required: false,
  }));

  for (const s of chosen) {
    p.log.step(s);
    const repoCopy = path.join(skillsDir, s);
    let canonical = repoCopy;
    if (inMarket(s)) {
      canonical = path.join(marketplace, s);
      remove(repoCopy);
      fs.cpSync(canonical, repoCopy, { recursive: true });
      p.log.message(`copied ${canonical} -> ${repoCopy}`);
    }
    for (const t of chosenTargets) {
      const dest = path.join(t, s);
      try {
        p.log.message(`${link(canonical, dest)} ${dest} -> ${canonical}`);
      } catch (e) {
        p.log.error(`${dest}: ${e.message}`);
        process.exitCode = 1;
      }
    }
  }
  p.outro(`Done: ${chosen.length} skill(s)`);
}

main();
