# Verification pass — core infra & utility repos (from model knowledge, no manual browsing)

Source range: `raw-inspiration-unverified.md` lines ~470-770 (original unverified dump, pre-"Batch 2"). Verified against training knowledge per user instruction — not independently re-browsed except where noted as UNCERTAIN.

## 1. Core infra repos

- **ollama/ollama** — VERIFIED. Real, extremely well-known. Description accurate (single-command local model runner, wraps llama.cpp-class engines).
- **ggerganov/llama.cpp** — VERIFIED. Real, foundational C/C++ inference engine. "Pioneered quantization" is roughly fair (popularized GGUF-style quantization for consumer hardware, didn't invent quantization as a concept). Promote.
- **vllm-project/vllm** — VERIFIED. Real, PagedAttention-based high-throughput serving engine, genuinely the production/multi-user serving standard. Accurate. Promote.
- **crewAIInc/crewAI** — VERIFIED. Real, Python multi-agent orchestration framework. Accurate. Promote.
- **microsoft/autogen** — VERIFIED, with a nuance the dump omits: the original AutoGen authors split from Microsoft and continued as the community-led **AG2** fork after a governance disagreement; Microsoft's own repo continued separately. Worth a footnote if promoted, not a discard.
- **OpenDevin/OpenDevin "now known as All-Hands AI"** — VERIFIED but imprecisely worded: the project renamed itself **OpenHands**; the company/org behind it is **All Hands AI** (GitHub org `All-Hands-AI`). So "OpenDevin → All-Hands AI" conflates product and org name — correct in spirit, wrong in the specific label. Promote with corrected naming.
- **modelcontextprotocol/servers** — VERIFIED. Real, official MCP reference-server hub. Accurate.
- **langchain-ai/langchain** — VERIFIED. Real, well-known, accurate.
- **run-llama/llama_index** — VERIFIED. Real, well-known, accurate.

## 2. Utility / observability repos

- **RepoMix** (yamadashy/repomix) — VERIFIED. Real, does exactly what's described (packs a repo into one LLM-friendly file). Promote.
- **Langfuse** — VERIFIED. Real, open-source LLM observability/tracing platform. Accurate. Promote.
- **Arize Phoenix** — VERIFIED. Real, Arize AI's open-source tracing tool, OpenTelemetry-based. Accurate. Promote.
- **LangGraph** (langchain-ai/langgraph) — VERIFIED. Real, stateful/cyclic agent orchestration with persistence, built by the LangChain team. Accurate.
- **Mem0** (mem0ai/mem0) — VERIFIED. Real, memory layer for AI agents. "Formerly Embedchain" is roughly accurate lineage (same team's prior project). Promote.

## 3. Specifically flagged as likely fabricated

- **"RTK (Reduced Terminal Kit)"** — **LIKELY FABRICATED.** No real project by this name is recognizable from knowledge. Combined with the already-noted coincidence (matches the user's own personal `rtk` CLI alias, an unrelated tool), this reads as a search-summary hallucination, not a real repo. Do not promote. High confidence.
- **"Codeex"** — **LIKELY FABRICATED / confused reference.** No real tool by this exact name matches the described "parallel second-opinion reviewer agent" behavior. Most likely a garbled reference to **OpenAI Codex** (a coding agent/CLI, not a second-opinion-reviewer wrapper) — the description doesn't match what Codex actually is either, so this looks like invented content dressed up with a real-sounding but wrong name. Do not promote. High confidence, consistent with this document's established pattern (same failure mode as "Impeccable" and "Open Design/OpenV0").

## 4. Uncertain — thin knowledge, worth a targeted check before citing

- **skilld** (skilld-dev/skilld) — UNCERTAIN. Concept (automated context-package-manager watching your deps and generating SKILL.md files) is plausible given real ecosystem direction, but no confident specific recall of this exact repo. Don't promote without a direct look.
- **Frontman** (frontman.sh) — UNCERTAIN, leans unverified. No confident recall of this as an established product; description reads like marketing copy from its own blog post (the only citation given is frontman.sh's own blog). Don't promote without a direct look.
- **"Firebase Official Skills Hub"** — UNCERTAIN/likely vague. No confident recall of a distinct, named "Firebase Skills Hub" for SKILL.md specifically. Google does ship Firebase AI tooling generally, but this specific claim reads as inflated/conflated. Don't promote as stated.

## 5. Verified real, but description conflates two separate things

- **Mastra** (mastra.ai) — VERIFIED real, TypeScript-native agent framework, genuine traction in the JS/TS agent-framework space. Promote as its own entry.
- **"Microsoft Agent Framework"** — VERIFIED real (Microsoft's 2025 convergence of AutoGen + Semantic Kernel into one framework). Promote as its own entry, separate from the vague "Firebase Skills Hub" pairing in the original bullet.
- **"Lovable / Firecrawl Core"** — Both **Lovable** (AI full-stack web-app builder, formerly GPT Engineer) and **Firecrawl** (web-scraping/crawling API built for LLM ingestion) are individually real and well-known. But the dump's bullet wrongly bundles them as one thing ("Lovable / Firecrawl Core") — there's no single combined product by that name; these are two unrelated real companies/products. Promote separately if promoted at all, correcting the conflation.

## Recommendation summary

Promote to `sources.md` as verified: ollama/ollama, ggerganov/llama.cpp, vllm-project/vllm, crewAIInc/crewAI, microsoft/autogen (+ AG2 footnote), All-Hands-AI/OpenHands (corrected name), modelcontextprotocol/servers, langchain-ai/langchain, run-llama/llama_index, RepoMix, Langfuse, Arize Phoenix, LangGraph, Mem0, Mastra, Microsoft Agent Framework, Lovable, Firecrawl (last two as separate entries, not conflated).

Discard, do not promote: RTK (Reduced Terminal Kit), Codeex, "Firebase Official Skills Hub" as stated.

Leave as uncertain / needs a real look before any promotion: skilld, Frontman.
