# Harness permissions — save time by setting up tools and folders properly

A coding agent that asks before every command wastes your attention; one that never asks puts your machine at risk. This doc covers how to configure permissions in Claude Code, Gemini CLI and GitHub Copilot (CLI and VS Code agent mode) so routine work runs without prompts and dangerous actions stay gated. Read it once before your first long agent session, then again when a tool starts nagging you.

Researched 2026-09-27 against each vendor's current docs (sources at the end). Syntax changes fast here, so check the linked reference before copying a config into a corporate setup.

## Contents

- [Why a well set up system pays off](#why-a-well-set-up-system-pays-off)
- [The four layers every harness has](#the-four-layers-every-harness-has)
- [Principles that hold across all three tools](#principles-that-hold-across-all-three-tools)
- [Claude Code](#claude-code)
- [Gemini CLI](#gemini-cli)
- [GitHub Copilot CLI](#github-copilot-cli)
- [VS Code agent mode (Copilot in the IDE)](#vs-code-agent-mode-copilot-in-the-ide)
- [Side-by-side cheat sheet](#side-by-side-cheat-sheet)
- [A 15-minute setup routine](#a-15-minute-setup-routine)
- [Anti-patterns](#anti-patterns)
- [Open questions and weak sourcing](#open-questions-and-weak-sourcing)
- [Sources](#sources)

## Why a well set up system pays off

The main cost of default permissions is your attention, more than the seconds spent clicking. Anthropic reports that Claude Code users approve **93% of permission prompts** ([auto mode post](https://www.anthropic.com/engineering/claude-code-auto-mode), March 2026). When nearly every prompt gets a yes, people stop reading them, and the 7% that mattered slip through with the rest. That's approval fatigue, and a bad config causes it more than a careless user does.

A tuned setup buys you four things:

- **Fewer interruptions.** The test runner, linter, `git status`/`diff`/`log` and your build script run without asking. Long tasks keep going while you're away from the keyboard.
- **Prompts that mean something.** When the only prompts left are `git push`, installs, deploys and writes outside the repo, you actually read them.
- **Hard stops the model can't talk its way around.** Deny rules are enforced by the harness, not the model. An instruction in `AGENTS.md` asking the agent not to read `.env` is only a request; a deny rule actually blocks the read. Claude Code's docs are explicit that instruction files "shape what Claude tries to do, but they don't change what Claude Code allows."
- **Less wasted context.** Removing a tool entirely (a bare-name deny in Claude Code, a global `deny` in Gemini CLI, `--available-tools` in Copilot CLI) drops it from the model's tool list. The model then never tries it, gets refused and retries.

The risk side is Simon Willison's [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/): an agent that has **private data**, reads **untrusted content** (web pages, issues, cloned repos, MCP results) and can **communicate externally** can be prompt-injected into exfiltrating that data. Permissions are how you break one leg of the trifecta, usually the external-communication one (network and URL rules) or the private-data one (read denies on secrets).

## The four layers every harness has

All three vendors landed on the same shape under different names. Knowing the layers tells you where to look when something prompts too often or not enough.

| Layer | What it answers | Claude Code | Gemini CLI | Copilot |
|---|---|---|---|---|
| Tool availability | Can the model even see this tool? | Bare-name `deny` | Global `deny` rule, `tools.core` | `--available-tools`, `--excluded-tools` |
| Approval rules | Does this call run, prompt, or get refused? | `allow` / `ask` / `deny` | Policy TOML: `allow` / `ask_user` / `deny` | `--allow-tool` / `--deny-tool`, VS Code `autoApprove` maps |
| Folder scope and trust | Which directories, and does repo config load? | Working dirs, `additionalDirectories`, workspace trust | Folder trust, `includeDirectories` | Trusted folders, `--add-dir` |
| OS sandbox | What can a shell command physically reach? | `/sandbox` | `--sandbox` / `tools.sandbox` | Local/cloud sandbox, VS Code agent sandboxing |

Approval rules parse command strings on a best-effort basis. VS Code's docs call terminal auto-approval "a best-effort convenience, not a security boundary", and Claude Code documents Bash rules that a reworded command (`git -C . push`) won't match. The sandbox is the only layer that holds against a determined or injected model. See [`agent-sandboxing.md`](./agent-sandboxing.md) for that layer; this doc is about the other three.

## Principles that hold across all three tools

1. **Deny the disasters, allow the loop, leave the rest on ask.** Deny: reading `.env*` and key files, `git push --force`, your deploy command, `rm -rf`. Allow: the commands you run fifty times a day. Everything else prompts. This split is repeated across practitioner guides and matches how all three vendors order their rules.
2. **Deny wins everywhere.** In Claude Code, deny beats ask beats allow regardless of which file or scope each rule lives in. In Copilot CLI, deny beats even `--allow-all`. In Gemini CLI the highest *priority* wins, so give deny rules a high priority number. A generous allowlist is safe as long as the denylist is real.
3. **Grow the allowlist from real usage, not speculation.** Start near-default, then use "don't ask again" prompts (or Claude Code's `fewer-permission-prompts` skill, which mines your transcripts) to promote what you actually approve repeatedly. Review the result weekly for a while.
4. **Put the `*` after the subcommand.** `git log *` allows log; `git *` allows every git command including `push` and `-c` config injection. Claude Code warns at startup about a wildcard placed too early.
5. **Keep shared and personal separate.** Team-wide denies go in the committed project file. Your personal allows go in a gitignored local file. That way policy travels with the repo and your habits don't leak into other people's sessions.
6. **Never make bypass mode a habit.** `--dangerously-skip-permissions`, `--yolo` and `--allow-all` belong in a container or VM. GitHub's docs say outright never to alias them. Each tool has a setting to lock bypass off (`disableBypassPermissionsMode`, `security.disableYoloMode`); use it on any machine with real credentials.
7. **Treat a cloned repo's config as untrusted.** Project settings can add allow rules, MCP servers and hooks. All three tools gate that behind a trust prompt; read what it lists before accepting. The same injection vector through instruction files is covered in [`base-instruction-files.md`](./base-instruction-files.md).
8. **Scope folders, don't widen them.** Add a sibling repo with an add-dir option instead of launching from `~`. Starting an agent in your home directory hands it your SSH keys, shell history and every other project.

## Claude Code

### Where settings live

| Scope | File | Use for |
|---|---|---|
| Managed | OS-level managed settings (org-deployed) | Org policy; nothing overrides it |
| User | `~/.claude/settings.json` | Your personal allows and denies across all repos |
| Project | `.claude/settings.json` (committed) | Team denies and shared safe allows |
| Local | `.claude/settings.local.json` (gitignored) | Your personal allows for this repo |

A deny at any scope blocks the call; a project allow can't undo a user deny and vice versa. Project `allow` rules and `additionalDirectories` only apply after you accept the workspace trust dialog.

### Permission modes

| Mode | Behavior | When to use |
|---|---|---|
| `default` (shown as Manual) | Prompts on first use of each tool | Unfamiliar repo |
| `acceptEdits` | Auto-accepts edits and simple file commands in working dirs | Normal feature work with a tuned allowlist |
| `plan` | Reads and explores, doesn't edit source | Design and investigation |
| `auto` | A classifier reviews each call instead of you | Long tasks you'd otherwise babysit |
| `dontAsk` | Anything that would prompt is refused; allowlist still runs | Headless or CI runs with a strict allowlist |
| `bypassPermissions` | Skips prompts, except a small protected set | Containers and VMs only |

Since 2026-08-14, **auto mode is the built-in starting mode** for Pro, Max and Team plans (and for interactive terminal and VS Code sessions from v2.1.283). Enterprise, API keys, Bedrock, Google Cloud and Foundry still start in Manual ([announcement](https://claude.com/blog/auto-mode-default-in-claude-code)). Pin a different start with `"defaultMode"` in settings, or turn auto off entirely with `disableAutoMode`. Auto mode blocks about twenty categories by default (force-push, mass cloud deletes, sending internal data out, editing permission configs). Anthropic's own numbers put the full classifier at a 0.4% false-positive and 17% false-negative rate on real overeager actions, and the post says it is "not a drop-in replacement for careful human review on high-stakes infrastructure."

### Rule syntax

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "WebFetch(domain:docs.github.com)",
      "mcp__github__get_*"
    ],
    "ask": [
      "Bash(git push *)",
      "Bash(npm install *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(~/.ssh/**)",
      "Bash(git push --force *)",
      "Bash(rm -rf *)"
    ],
    "additionalDirectories": ["../shared-lib"]
  }
}
```

Things worth knowing about the syntax:

- **Compound commands are split.** `Bash(npm test *)` won't approve `npm test && curl evil.sh`; each subcommand must match on its own. Deny and ask rules fire if any subcommand matches, including inside `$(...)`.
- **A bare tool name as deny removes the tool.** `"deny": ["WebFetch"]` hides it from the model entirely. `"deny": ["mcp__*"]` removes every MCP tool.
- **Path prefixes matter.** `//abs/path` is filesystem-absolute, `~/path` is home, `/path` is relative to the settings file's project, `./path` or bare is relative to cwd. Patterns use gitignore syntax.
- **Only `Read` and `Edit` path rules are checked.** A `Write(...)` rule is accepted but never consulted; use `Edit(...)`. A `Read` deny also blocks edits to that path.
- **Read denies don't cover every shell read.** They catch `cat`, `head`, `sed` and redirections, but not `grep -r pattern .` run in the file's directory. Pair secret denies with the sandbox if it matters.
- **MCP allow globs need a named server.** `mcp__puppeteer__*` works; an unanchored allow like `mcp__*` is skipped with a warning.

### Folders

Claude reads freely inside the launch directory. Extend with `--add-dir <path>`, `/add-dir` mid-session, or `additionalDirectories` in settings. Note the difference: settings-listed dirs grant file access only, while `--add-dir`/`/add-dir` also load some of that directory's `.claude/` config. Set `permissions.blockReadsOutsideWorkingDirectories` to fence reads to those directories in every mode.

### Time-savers

- `/permissions` edits rules mid-session and shows which file each rule came from. Changes apply from the next tool call.
- The bundled `fewer-permission-prompts` skill scans past transcripts for read-only commands you keep approving and proposes an allowlist.
- `claude doctor` lists rules that were skipped as invalid.
- `permissions.disableBypassPermissionsMode: "disable"` in your user file locks you out of bypass on a machine with real credentials.

## Gemini CLI

### Where settings live

| Scope | File |
|---|---|
| User settings | `~/.gemini/settings.json` |
| Project settings | `.gemini/settings.json` |
| System settings | `/etc/gemini-cli/settings.json` (Linux; OS-specific elsewhere) |
| User policies | `~/.gemini/policies/*.toml` (all files loaded and merged) |
| Admin policies | `/etc/gemini-cli/policies` (Linux), `/Library/Application Support/GeminiCli/policies` (macOS), `C:\ProgramData\gemini-cli\policies` (Windows) |

> [!WARNING]
> Workspace policies (`.gemini/policies/` inside a project) are documented as **currently non-functional** ([issue #18186](https://github.com/google-gemini/gemini-cli/issues/18186)). Put your rules in the user policy directory instead.

### Approval modes

`default` prompts for write tools, `auto_edit` auto-approves edits, `plan` is read-only, `yolo` approves everything. Set the starting mode with `general.defaultApprovalMode` (`default`, `auto_edit` or `plan`). YOLO can only be turned on from the command line (`--yolo` or `--approval-mode=yolo`), and `security.disableYoloMode: true` blocks it even then.

### The policy engine

The policy engine is the current mechanism. The older `tools.exclude` setting is deprecated in favor of `deny` rules, and `tools.allowed` still works but is less expressive. Rules are TOML; the highest-priority matching rule wins, and higher tiers (admin > user > default) always beat lower ones.

```toml
# ~/.gemini/policies/my-rules.toml

# Allow the everyday loop
[[rule]]
toolName = "run_shell_command"
commandPrefix = ["git status", "git diff", "git log", "npm test", "npm run lint"]
decision = "allow"
priority = 100

# Always ask before pushing
[[rule]]
toolName = "run_shell_command"
commandPrefix = "git push"
decision = "ask_user"
priority = 500

# Never delete recursively, and tell the model why
[[rule]]
toolName = "run_shell_command"
commandPrefix = "rm -rf"
decision = "deny"
priority = 900
denyMessage = "Recursive delete is blocked by policy."

# Read-only tools from one MCP server run freely
[[rule]]
mcpName = "my-jira-server"
toolAnnotations = { readOnlyHint = true }
decision = "allow"
priority = 200

# Everything else from any MCP server asks
[[rule]]
toolName = "*"
mcpName = "*"
decision = "ask_user"
priority = 10
```

Details that matter:

- **A global `deny` (no `argsPattern`) removes the tool from the model's context**, same as a bare deny in Claude Code.
- **`modes = [...]` scopes a rule** to specific approval modes. Approvals granted in `plan` apply everywhere; approvals granted in `default` apply to `default`, `autoEdit` and `yolo` only.
- **Redirection prompts by default.** A command with `>` or `<` asks even when an allow rule matches, unless the rule sets `allowRedirection = true`.
- **Avoid underscores in MCP server names.** The parser splits `mcp_server_tool` on the first underscore, and the docs warn that rules can "fail silently" otherwise.
- **`ask_user` becomes `deny` in headless mode.** Plan non-interactive runs around allow rules.

### Folder trust

Folder trust is **off by default**. Turn it on:

```json
{
  "security": {
    "folderTrust": { "enabled": true }
  }
}
```

In an untrusted folder, Gemini CLI ignores the project's `.gemini/settings.json` and `.env`, won't connect MCP servers, won't load custom commands, and prompts for every tool even if auto-accept is on. Choices are stored in `~/.gemini/trustedFolders.json`. "Trust parent folder" is handy if all your own projects sit under one directory. Add extra directories to the workspace with `context.includeDirectories`.

### Sandbox

`gemini --sandbox`, `GEMINI_SANDBOX=docker|podman|sandbox-exec|runsc|lxc`, or `"tools": { "sandbox": "docker" }` in settings. macOS Seatbelt is the lightest option; containers are the portable one.

## GitHub Copilot CLI

### Where settings live

| Scope | File |
|---|---|
| User | `~/.copilot/settings.json` (override with `COPILOT_HOME`) |
| Repository | `.github/copilot/settings.json` (committed) |
| Local | `.github/copilot/settings.local.json` (gitignore it) |
| Saved approvals | `~/.copilot/permissions-config.json`, keyed per repo root or directory |

URL approvals are global, stored as `allowedUrls` in user settings; `deniedUrls` always wins. The CLI also reads a shared subset of `.claude/settings.json` (hooks, plugins, marketplaces), but not Claude's permission rules.

### Two layers of flags

```bash
# What the model can see at all
copilot --available-tools='bash,edit,view,grep,glob'
copilot --excluded-tools='web_fetch, web_search'

# What runs without asking
copilot --allow-tool='shell(git:*)' --deny-tool='shell(git push)'
copilot --allow-tool='shell(npm run:*)'
copilot --allow-tool='read, write(src/*.ts)' --deny-tool='read(.env)'
copilot --allow-tool='url(github.com)'
copilot --allow-tool='MyMCP(create_issue)'
```

Permission kinds are `shell`, `read`, `write`, `url`, `memory` and an MCP server name. `shell(git:*)` matches `git push` but not `gitea`. Path rules for `write` match exact or trailing path segments; the reference notes "no glob support yet" for denies.

GitHub's own combined example is a good template: explore, edit and commit, but no internet, no subagents, no push:

```bash
copilot --available-tools='bash,edit,view,grep,glob' \
  --allow-tool='shell(git:*)' --deny-tool='shell(git push)'
```

> [!NOTE]
> Command-line `--allow-tool`/`--deny-tool` apply only to that session and aren't saved. Persistent approvals come from answering "don't ask again in this repo" prompts. To make a flag set permanent, wrap it in a shell function that you name explicitly, never an alias for `copilot` itself.

### Trust, folders and resets

- On first launch in a directory the CLI asks you to trust it and everything below it. Default file access is the cwd, its subdirectories and the system temp dir.
- `--add-dir=PATH` grants access to another directory **and loads its `.github/skills` and `.github/agents` as trusted**. Treat it as a trust decision.
- `/reset-allowed-tools` drops everything granted this session and the saved approvals for the current location.
- `permissions.disableBypassPermissionsMode: "disable"` suppresses `--allow-all`, `--yolo` and friends; `"allow-auto-only"` still permits `/allow-all auto`, the LLM-assisted auto-approval.

## VS Code agent mode (Copilot in the IDE)

Most day-to-day Copilot agent use happens in the editor, and VS Code has its own settings separate from the CLI.

### Permission levels

Pick a level from the chat input's permissions dropdown; `chat.permissions.default` sets it for new sessions.

- **Manual permissions** (default) uses your tool, URL and terminal approval settings.
- **Assisted permissions** uses an LLM judge per call, similar to Claude Code's auto mode. Enable it with `chat.assistedPermissions.enabled` (Agent Host sessions only).
- **Allow all** runs everything. **Autopilot** is a mode that also auto-approves and keeps going until done.
- `chat.tools.global.autoApprove` applies Allow-all across every workspace. Prefer the per-session level instead.

### Terminal auto-approve

VS Code evaluates each command separately. Read-only commands run by default; `rm` and `del` need approval. Keys are exact commands or `/regex/`; `true` approves, `false` forces a prompt.

```jsonc
{
  "chat.tools.terminal.autoApprove": {
    "npm test": true,
    "/^npm run (lint|build|test)\\b/": true,
    "/^git (status|diff|log|show)\\b/": true,
    "/^git push\\b/": false,
    "/dangerous/": false
  }
}
```

A compound command auto-runs only if every subcommand matches a `true` rule and none match `false`. Note that `false` means *ask*, not *block*: to truly block, use a `PreToolUse` hook returning `permissionDecision: "deny"`. `chat.tools.terminal.blockDetectedFileWrites` (default `outsideWorkspace`) prompts for writes it detects outside the workspace.

### Tools, URLs and edits

- Run **Chat: Manage Tool Approval** to set per-tool or per-MCP-server pre-approval (runs without asking) and post-approval (result enters context without review). Post-approval on web or issue-reading tools is how injected text gets in, so leave it off for those.
- `chat.tools.eligibleForAutoApproval` with a tool set to `false` removes the "always allow" option for it.
- `chat.tools.urls.autoApprove` splits URL approval into `approveRequest` (may we contact this?) and `approveResponse` (may the result enter context?). Trusted docs domains can get both; everything else should at least keep response review.
- `chat.tools.edits.autoApprove` takes globs, so edits to secrets and editor config always show a diff and ask:

  ```jsonc
  "chat.tools.edits.autoApprove": {
    "**/*": true,
    "**/.vscode/*.json": false,
    "**/.env": false
  }
  ```

- Agent sandboxing for terminal commands (Preview on macOS/Linux/WSL2) keeps working under Allow all; network scope via `chat.agent.allowedNetworkDomains` / `deniedNetworkDomains`.

## Side-by-side cheat sheet

| Task | Claude Code | Gemini CLI | Copilot CLI | VS Code |
|---|---|---|---|---|
| Allow a command family | `Bash(npm run *)` | `commandPrefix = "npm run"`, `allow` | `shell(npm run:*)` | `"/^npm run\\b/": true` |
| Force a prompt | `ask: ["Bash(git push *)"]` | `decision = "ask_user"` | default for writes | `"/^git push\\b/": false` |
| Block secrets | `Read(./.env*)` deny | `deny` rule with `argsPattern` on the read tool | `--deny-tool='read(.env)'` | `chat.tools.edits.autoApprove` + sandbox |
| Hide a tool entirely | `deny: ["WebFetch"]` | global `deny` | `--excluded-tools=web_fetch` | disable tool in tool picker |
| Add a folder | `--add-dir`, `additionalDirectories` | `context.includeDirectories` | `--add-dir` | multi-root workspace |
| Lock out bypass | `disableBypassPermissionsMode` | `security.disableYoloMode` | `disableBypassPermissionsMode` | org policy: disable global auto-approval |
| LLM-judged approvals | `auto` mode | none documented | `/allow-all auto` | Assisted permissions |
| Reset approvals | edit via `/permissions` | edit policy files | `/reset-allowed-tools` | Chat: Reset Tool Confirmations |

## A 15-minute setup routine

1. **Lock bypass off** in your user-level file on any machine with real credentials or company access.
2. **Write the deny list once, at user level:** `.env*`, `~/.ssh`, `~/.aws`, cloud credential files, `git push --force`, `rm -rf`, your deploy command. This follows you into every repo.
3. **Allow the read-only loop at user level:** `git status`/`diff`/`log`/`show`, `ls`, your search tool. Most of these are already built-in read-only commands in Claude Code and VS Code; check before duplicating.
4. **Per repo, allow the project loop in the local (gitignored) file:** test, lint, typecheck, build. Commit only the shared denies and genuinely safe team allows.
5. **Turn on folder trust** where it's opt-in (Gemini CLI), and actually read the trust dialog on cloned repos.
6. **Decide your network stance:** allow your docs domains for fetch, keep everything else on ask. That's the cheapest way to break the lethal trifecta.
7. **Pick a default mode:** edits-auto-accepted for normal work, plan mode for investigation, the classifier mode for long unattended runs, bypass only in a container.
8. **Review after a week.** Promote repeated approvals into rules; delete rules you never hit.

## Anti-patterns

- **Launching from `~` or `/`.** Gives the agent every project and credential you own.
- **Aliasing `claude` to include `--dangerously-skip-permissions`, or `copilot` to `--yolo`.** GitHub's docs call this out by name.
- **Allowing `Bash(git *)` or `shell(git:*)` without a push deny.** One rule, and pushes to main are unattended.
- **Relying on instruction files for security.** `AGENTS.md` asking the agent not to touch secrets is a request, not a control.
- **Letting "don't ask again" accumulate unreviewed.** Saved approvals are rules you never wrote down on purpose.
- **Treating command-matching as a boundary.** Wrappers, `bash -c`, aliases and quoting all slip past string rules. Use the sandbox for real containment.
- **Blanket-trusting an MCP server** that reads untrusted content (issues, web, email) *and* has write or send tools. That's all three legs of the trifecta in one server.

## Open questions and weak sourcing

- **Gemini CLI's tier numbers are in flux.** The policy-engine doc lists Admin as base 5 and User as 4 in one table, but calls Admin "Tier 4" and computes examples with other bases. [PR #18682](https://github.com/google-gemini/gemini-cli/pull/18682) re-orders tiers to put project policies *above* user ones (loaded only in trusted folders), while [issue #18186](https://github.com/google-gemini/gemini-cli/issues/18186) (workspace policies not taking effect) was still open on 2026-09-27. Admin > user > default holds throughout; where project policies land doesn't yet.
- **Claude Code's default mode (resolved 2026-09-27):** auto by default on Pro/Max/Team since 2026-08-14, Manual elsewhere; see the [announcement](https://claude.com/blog/auto-mode-default-in-claude-code). Open GitHub issues report `defaultMode` being ignored in some surfaces (desktop app, [#92394](https://github.com/anthropics/claude-code/issues/92394)), so check the mode indicator when a session starts.
- **A widely repeated "humans caught a disguised dangerous command 13.6% of the time vs. 89% for auto mode" stat** was attributed to Anthropic's auto mode post but does not appear in it. Left out here as unverified.
- **VS Code settings drift fast.** Several settings above are Preview or Experimental. Check the approvals doc before relying on exact keys.
- **Gemini CLI has no documented LLM-judged approval mode** comparable to Claude's auto mode or VS Code's Assisted permissions, as of the docs read. Absence in docs, not a confirmed absence in the product.
- **Practitioner guides** (Backslash, DEV Community, Developers Digest and similar) were used only for the shared "deny disasters, allow the loop, ask the rest" framing, which also falls directly out of the vendor precedence rules. No single named practitioner owns it.

## Sources

Primary vendor docs:

- Claude Code — [Configure permissions](https://code.claude.com/docs/en/permissions), [Permission modes](https://code.claude.com/docs/en/permission-modes), [Sandboxing](https://code.claude.com/docs/en/sandboxing)
- Anthropic engineering — [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) (2026-03-25); [Auto mode is now the default](https://claude.com/blog/auto-mode-default-in-claude-code) (2026-08-14)
- Gemini CLI — [Policy engine](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/policy-engine.md), [Trusted folders](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/trusted-folders.md), [Configuration](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md), [Sandbox](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/sandbox.md)
- GitHub Copilot CLI — [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Config directory reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference), [CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)
- VS Code — [Manage approvals and permissions](https://code.visualstudio.com/docs/agents/run/approvals), [Review and revert agent changes](https://code.visualstudio.com/docs/agents/run/review-code-edits)

Framing:

- Simon Willison — [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) (2025-06-16)

Related docs in this folder: [`agent-sandboxing.md`](./agent-sandboxing.md), [`security-and-supply-chain.md`](./security-and-supply-chain.md), [`base-instruction-files.md`](./base-instruction-files.md), [`mcp-model-context-protocol.md`](./mcp-model-context-protocol.md).
