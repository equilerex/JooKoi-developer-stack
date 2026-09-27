# paper-trail viewer ux upgrade

Session: 25-09-2026 02:35. Status: implemented, browser-untested (smoke-tested in happy-dom only).

## Context

The viewer (`my-global-setup/.agents/skills/jookoi-paper-trail/scripts/viewer/`) is a zero-dependency page over `items.yaml` and `archive/items-*.yaml`, served by `server.js`. It works at 57 items but is thin for a growing store: there's no "All" view, `now`/`parked` sort by priority only, search replaces the status tab instead of combining with it and skips IDs, and bodies go through a 30-line regex markdown parser (no tables, links, ordered lists, or blockquotes). Goal: a viewer that stays usable as the archive grows into the thousands, with properly rendered bodies from `jookoi-universal-mdx-render`.

## Assessment findings

- **Search exists but is weak.** `index.html` `visible()` matches title and body across all statuses, drops the tab filter, doesn't match IDs, and doesn't highlight.
- **Re-rendering is the actual perf cost, not list length.** Every expand and every changed poll rebuilds the whole list through `innerHTML`, and each open item re-parses its markdown. Virtual scrolling isn't needed yet. Targeted DOM updates plus `content-visibility: auto` on rows come first. Virtualize only if a measured list shows a problem.
- **Date sort needs a fallback key.** Older items have `ts_created: null` and most timestamps are date-only, so ties are common. Newest = `ts_touched ?? ts_done ?? ts_created`, then ID descending (IDs are monotonic).
- **`jookoi-universal-mdx-render` isn't usable as-is:**
  - `renderMdx` always runs `remark-mdx`. `{...}` becomes an expression and renders as empty text, so `t001 jnote tooling built and verified` would lose its `{ts (auto), type ...}` span. A stray `<` in prose can make parsing fail. Item bodies are plain GFM.
  - `dist/` is `tsc` output with bare imports. The skill is copied to `~/.agents` with no `npm install`, so it needs a single-file browser bundle.
  - `allowHtml` defaults to true. Bodies are LLM-written and sometimes pasted from the web, so the viewer passes `allowHtml: false`.
  - Mermaid's theme is hardcoded `neutral` and the library is several MB.
- **Polling resends everything.** Every 4 s the server re-reads all YAML, including archives, and the client diffs by `JSON.stringify`.

## Decisions

| Question | Call |
|---|---|
| Layout | Keep the accordion (inline expand). Master-detail split pane rejected. |
| Default sort | Newest first on every tab, `now` and `parked` included. Priority stays available as a sort option. |
| Renderer | `jookoi-universal-mdx-render` gains a markdown-only mode and a single-file browser build. The viewer vendors that file into `scripts/vendor/`, like `js-yaml`. No Mermaid in v1. |
| Extras in scope | Keyboard (`/` search, `j`/`k` move, `Enter` toggle, `Esc` close) and `#repo/id` deep links. ETag/304 polling. Date group headers (Today, This week, Earlier) in date-sort mode. |
| Out of scope | All-repos merged view. Virtual scrolling (revisit on measured need). Mermaid. |

## Design

- **Status is a filter.** Chips: All, now, parked, done, dropped, archived, with counts. Search narrows within the active chip and matches ID, title, and body. Tokens: `status:X`, `is:archived`. Matches highlighted in the title row.
- **Sort control:** Newest, Oldest, Priority, remembered in `localStorage` (`pt.sort`). Row shows a relative date from the sort key.
- **Rows:** collapsed by default. Only an expanded row gets a renderer element. Expand/collapse and poll updates patch affected rows instead of rebuilding the list. Open state and scroll position survive a live refresh.
- **Renderer theming:** map the viewer's tokens onto `--jookoi-document-*` so light/dark follow the existing theme toggle.
- **Server:** `/api/repo/:i` returns an `ETag` from the YAML files' mtimes and sizes, and answers `If-None-Match` with 304. It also serves the vendored bundle.

## Build order

1. `jookoi-universal-mdx-render`: markdown-only option (skip `remark-mdx`), plus a `build:browser` script emitting one ESM file. Separate repo, separate change.
2. Vendor the bundle into `scripts/vendor/` and serve it from `server.js`. Swap `md()` for the renderer with `allowHtml: false`.
3. Row patching instead of full `innerHTML` rebuilds, and `content-visibility: auto`.
4. All chip, combined filter + search, ID match, tokens, highlight.
5. Sort control, fallback sort key, date group headers.
6. Keyboard and hash deep links.
7. ETag/304 on the data endpoint.

## Implementation deviations

- Renderer used through `renderMdx()` directly into a `div.jookoi-mdx-renderer` (plus `documentStyles`), not the `<jookoi-mdx-renderer>` element. The element re-renders asynchronously per instance and pulls in Mermaid; the browser build exports only `renderMdx` and `documentStyles` (`src/browser.ts`, 442 KB). Rendered HTML is cached per item body.
- `status:X` and `is:archived` tokens replace the active chip instead of narrowing within it, so `status:done` works from any chip. Plain terms still narrow within the chip. Terms are ANDed.
- Server also caches parsed layers by file signature (mtime + size), which serves both `/api/repos` and `/api/repo/:i`. The client sends `If-None-Match` itself with `cache: "no-store"` so a 304 reaches the script.
- Not verified in a real browser (chrome-devtools MCP could not attach). Checked: 200/304 and bundle serving via curl, deep link, chips, query tokens and sort via happy-dom.
- Post-plan changes, on user request: the row's date column is now the exact timestamp (`YYYY-MM-DD HH:MMZ`, monospace) and is the leftmost cell, replacing the relative label. The viewer gained an add-item form (`+ Add item` or `n`): Immediate to-do is status `now`, Backlog is `parked`, for the focused repo and layer. This ends the viewer's read-only status: `POST /api/repo/:i/items` runs `jookoi-paper-trail add` with the payload on stdin, and requires a JSON content type and a same-origin `Origin`.
