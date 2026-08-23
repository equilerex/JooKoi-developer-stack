# Stage 1 — Dev-Scoped "Second Brain" (RAG over your own context)

New topic, not covered by Topic #10 ([`memory-and-progress-ledgers.md`](./memory-and-progress-ledgers.md), which is about a dev/project progress ledger, not a full retrieval system over your own codebase/notes/history). Scoped per explicit user confirmation to the developer use case — querying your own codebase, ADRs, past troubleshooting, personal snippets — not general life organization. No pick made; options and trade-offs only.

## 1. OpenClaw — name-collision resolution (the important part)

**This is not a naming collision. It is the same project**, and the security incident documented in [`security-and-supply-chain.md`](./security-and-supply-chain.md) is directly relevant, not a false alarm.

OpenClaw (github.com/openclaw/openclaw) is a real, extremely large open-source project: a local-first AI gateway that runs on your own machine and talks to you through whatever chat app you already use (WhatsApp, Telegram, Signal, etc.). Origin: Peter Steinberger (the developer behind the PDF SDK used in Dropbox/Slack/Box) pushed it to GitHub in November 2025 as "Warelay," renamed to "Moltbot," then to "OpenClaw" after a trademark dispute. It became one of the fastest-growing open-source projects on record — 247,000 stars and 47,700 forks by March 2026. Steinberger joined OpenAI in February 2026; the project moved to an independent foundation and stayed open, later shipping native iOS/Android apps.

Its extensibility model is "claws" — installable plugins, distributed through **ClawHub**, the same skill registry [`security-and-supply-chain.md`](./security-and-supply-chain.md) documents as systematically poisoned in a February 2026 campaign (30+ malicious skills at peak infection, SlowMist flagging 472; Snyk's ToxicSkills scan found 36.8% of scanned ClawHub/skills.sh skills had at least one security flaw, 13.4% critical). This is not two different "OpenClaw"s — it's the core project's own plugin marketplace that was compromised, and the structural reason is the same one already noted: publishing to ClawHub requires only a `SKILL.md` and a week-old account, no code signing or default sandboxing.

**Practical read:** OpenClaw itself (core gateway, self-hosted, no third-party claws installed) is a real, actively maintained, large project — not a scam or a hallucination. The risk is specifically in what you install *from ClawHub*, same as the general skill-marketplace risk already documented. If evaluating OpenClaw, treat any third-party "claw" exactly like any other unaudited MCP server or skill per the vetting checklist in [`security-and-supply-chain.md`](./security-and-supply-chain.md) — don't install broadly just because the core project is legitimate and huge.

## 2. "Open Human" — resolved, real project under a different exact name

The claim ("Rust-based personal super-intelligence, encrypted memory tree over docs/emails/meetings, MCP integration") maps to a real project: **OpenHuman** (github.com/tinyhumansai/openhuman), not "Open Human" as a separate name. Built in Rust + Tauri, GPL3-licensed, maintained by an org called Tiny Humans AI. Description matches closely: it summarizes and compresses documents/emails/chats into a "memory graph," supports on-device encryption, an approval gate, OS-keyring secrets, opt-in sandboxing, and a "Privacy Mode" that keeps all inference local. It exposes memory over MCP and can drive MCP servers itself (including OAuth flows). Real, checkable maintainer org, active project — the original dump's sourcing (a single YouTube video) undersold something that does have primary documentation once you have the correct name.

## 3. Established RAG-over-personal-context architecture (consensus, not a new claim)

The pattern in the pasted dump is standard, current, and worth stating as consensus rather than re-verifying piece by piece:

```
[ Ingestion ]              [ Vector store ]           [ LLM / interface ]
Git commits, markdown  →   pgvector (Postgres) /   →   Ollama (local model)
notes, exported Slack/     Qdrant / ChromaDB            + Open WebUI / LibreChat
Jira, code repos            (via LlamaIndex/LangChain)   + IDE extension (Continue.dev)
```

- **Ingestion/chunking layer**: LlamaIndex (run-llama/llama_index, already in [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md)) or LangChain parse and chunk source material — code, markdown, exported chat/ticket logs — into embeddings.
- **Vector store**: pgvector (a Postgres extension — convenient if you already run Postgres, avoids a separate service), Qdrant, or ChromaDB (simplest to run locally, SQLite-adjacent ergonomics) are the three real, well-established options. None is a wrong choice; the difference is mostly "do you want another service running" vs. "reuse Postgres" vs. "simplest local file-backed option."
- **Interface layer**: Open WebUI (open-webui/open-webui, already in [`_ai-tooling-recommendations.md`](./_ai-tooling-recommendations.md)'s browser-tooling section for a different reason — it's also a legitimate offline chat front-end) or LibreChat for a chat-style interface; **Continue.dev** for pulling that same custom context directly into VS Code/JetBrains as inline completions/chat, which is the more natural fit if the goal is staying in the editor rather than context-switching to a separate chat window.
- **Model**: Ollama running a local model — directly continuous with the hardware analysis already done in [`local-model-hardware-fit.md`](./local-model-hardware-fit.md) (this rig: RTX 3070, 8GB VRAM, 64GB system RAM — full-VRAM ceiling around 9B, larger models RAM-offloaded and slower).

Other named projects from the dump, checked and real: **Dify** (visual RAG-pipeline/app builder), **Logseq** (logseq/logseq — privacy-first outliner/knowledge graph with an AI plugin ecosystem), **RAGFlow** (infiniflow/ragflow — deep document-understanding engine for messy unstructured files). `aristoapp/awesome-second-brain` is a real curated list, general-scope (not dev-specific) — useful as a browsing entry point, not a citable authority in itself.

## 4. Practical read for this setup specifically

Per this repo's own anti-speculative-infrastructure stance (`docs/reasoning.md`: extract from real need, don't build ahead of it) and the hardware already analyzed in [`local-model-hardware-fit.md`](./local-model-hardware-fit.md):

- **Worth trying now, low-cost entry point**: Continue.dev + Ollama, pointed at just this repo's own docs/decisions/planning files (not a general RAG stack yet). This directly extends work already in progress here rather than standing up new infrastructure — closest thing to "the next three-times-repeated need" the prompt→skill→script→service ladder calls for before building more.
- **Premature right now**: a full ingestion pipeline (Slack/Jira export → vector DB → dedicated UI) for a solo, pre-product-code repo. There isn't yet enough accumulated project history (commits, tickets, chat threads) to make retrieval over it meaningfully better than just reading the files directly — the same "don't build `seed/` before a second real project proves the shape" logic applies here to "don't build a memory graph before there's much to remember."
- **Skip entirely for now**: OpenClaw and OpenHuman specifically as *personal-assistant-with-messaging-integration* products — they solve a broader "AI assistant across your whole digital life" problem, not the narrower "RAG over my own codebase" one this stage was scoped to. Worth knowing they exist (especially OpenHuman's MCP-native memory-graph approach, which is architecturally close to what Topic #10 already discussed), not worth adopting yet.

## Open questions / weak sourcing

- OpenClaw's *current* ClawHub security posture (whether default sandboxing or code signing has since been added, given how fast the project is moving) wasn't re-checked here — [`security-and-supply-chain.md`](./security-and-supply-chain.md)'s Feb 2026 findings should be treated as a point-in-time snapshot, not necessarily still true today.
- `aristoapp/awesome-second-brain`'s star/fork counts and activity level weren't independently pulled — confirmed real via search, not repo-health-verified to this project's usual bar.
- Continue.dev's current feature set for pointing at a *custom* local vector store (vs. its more common use with hosted/cloud context providers) wasn't verified against its current docs — worth a direct look before actually wiring this up.
