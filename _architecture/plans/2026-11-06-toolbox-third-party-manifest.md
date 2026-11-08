# toolbox-third-party-manifest

Session: 06-11-2026 00:59. Status: draft. Second Opus review 06-11-2026: ready with fixes (rea box needs a committed .mcp.json, pick list and .gitignore must be one generated record, decide helper extraction and own-skill copies in .claude/skills).

## Context

A toolbox holds tools, not only skills. Examples: Directory Opus skills, a reverse engineering CLI (`D:\repos\Babylon-5\rea`), shell shortcuts. Many come from other people (marketplaces, GitHub repos, npm). Committing someone else's source is wrong: size, licences, no upgrade path. Local disk may hold everything. Git holds only what is mine plus what is needed to fetch the rest.

Exception: a source with no reasonable git or npm home may be committed as plain files, with its licence file.

## Calls made

- Every toolbox has a `package.json` at its root. `npm install` in the box fetches its dependencies into the box's gitignored `node_modules/`. `package-lock.json` is committed, so versions are tracked and `npm outdated` / `npm update` keep them current.
- Every toolbox has a `README.md` listing its tools, where each lives and how to use it. That is the primary guidance.
- A standalone tool or repository (e.g. `rea`) needs no placement. It stays in `node_modules/` or the box root and the README says how to run it. `rea` goes in its own `reverse-engineering-toolbox`.
- Skills are the one thing that needs a specific folder format: real folders in `<box>/.agents/skills/` and `<box>/.claude/skills/`. A marketplace dependency is not usable as shipped, and only a few of its skills are wanted. So picking is manual and per box: a small script in the box (run through an npm script) copies the chosen skill folders out of `node_modules/<dep>/...`. No declarative pick list, no automation across all skills.
- Placement is copy-only, no links (open plan `2026-10-09-skill-sync-copy-only.md`, item `kx3n Finish skill sync cleanup: copy-only, no links`). The existing `.claude/skills` link in `windows-toolbox` is replaced by a copy.
- Copied third-party skills are not committed. Each box has a `.gitignore` that lists them. My own skills in the same folder stay committed.
- No global install in toolboxes. Global content belongs to the global folder (`my-global-setup/`, moving into `toolboxes/` per the consolidation plan).
- A source with no reasonable git or npm home may be committed as plain files with its licence file. This is the exception.

- Decided 06-11-2026 after the second review: only boxes with third-party dependencies get a `package.json` (and `.npmrc` only if they use git specifiers). `shortcuts`, `my-global-setup` and `repo-tooling` get none.
- Decided 06-11-2026: copies in a box's `.claude/skills` are generated and gitignored, never committed. The box's script recreates them from `.agents/skills` (own skills) and from picks (dependency skills), so a fresh clone plus the script is complete.
- Decided 06-11-2026: the Directory Opus skill is private (owners ban AI-made content). It stays in `windows-toolbox`, gitignored, listed in READMEs only, and has no global install.

## Design

Per box (`toolboxes/<box>/`):

| File | Committed | Purpose |
|---|---|---|
| `README.md` | yes | tools in this box, where they live, how to use them |
| `package.json`, `package-lock.json` | yes | dependencies and exact versions, plus the box's own scripts |
| `.npmrc` | yes | `allow-git=root`, needed on npm 12 for git specifiers |
| `node_modules/` | no | fetched sources |
| `scripts/pick-skills.mjs` | yes | hand-written: which skills to copy from which dependency |
| `.agents/skills/<own-skill>/` | yes | skills I wrote |
| `.agents/skills/<picked-skill>/`, `.claude/skills/<picked-skill>/` | no | copies made by `pick-skills.mjs` |
| `.gitignore` | yes | `node_modules/` and the picked skill folders (no trailing slash on link-like entries) |

A shared helper in `toolboxes/scripts/` (`copySkill(from, toBox)`) does the staged, dereferenced copy, same logic as `utility-scripts/copy-skill.js` (extract a module or accept duplication). Each box's `pick-skills.mjs` is a few calls to it. It refuses to overwrite a committed own skill, and it prunes a picked skill that is no longer listed. The box's `package.json` runs it from `postinstall`, so a fresh clone plus `npm install` is complete.

Resolve a dependency's folder by name through `node_modules`. A git dependency installs under its own `package.json` name, not the repo name.

`toolbox:status`: `npm outdated`, plus a lockfile-vs-`git ls-remote` check for git dependencies, because `npm outdated` reports nothing for them.

Also: add the picked paths to `.graphifyignore`. Never put a token in a git specifier, use SSH or a credential helper.

## Known npm limit

A dependency that is a plain repo without a `package.json` (many skills-only marketplace repos) cannot be installed by npm 12: it fails with `ENOENT: Could not read package.json`. This is about the dependency, not the box. When it happens, README-only for that one (repo URL, commit, clone by hand into a gitignored folder). Not designed further until it occurs.

## Open questions

None. Decided 06-11-2026: `rea` is never global. It runs only from its box when needed, so the global skill and MCP server go once the box works. It ships native modules, which `ARCHITECTURE.md` blocks by default for this repo's own dependencies, so the box README says so.

## Deliverables

- [ ] Box template: `package.json`, `.npmrc`, `.gitignore`, README sections
- [ ] Shared copy helper and `toolbox:status`
- [ ] Apply to `windows-toolbox`: add `package.json`, replace the `.claude/skills` link with a copy
- [ ] Create `reverse-engineering-toolbox` with `rea-agents` as the first dependency. Box README notes the native modules
- [ ] Once the box works, remove the global `rea` skill (`reverse-engineer-anything` in `~/.agents/skills` and `~/.claude/skills`) and the globally configured rea MCP server. Ask the user before touching global config
- [ ] Docs per Fold-out

## Fold-out

- `toolboxes/README.md`: tools not only skills, per-box README rule, what is committed vs fetched
- `toolboxes/CONTEXT.md` (new): layout table, placement rules, gotchas
- `_architecture/ARCHITECTURE.md`: one line under the `toolboxes/` bullet
- `package.json` and `utility-scripts/npm-help.js`: new scripts

## Implementation deviations
