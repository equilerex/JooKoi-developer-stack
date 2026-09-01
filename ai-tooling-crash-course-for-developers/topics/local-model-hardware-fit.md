# Stage 1 — Local Model Use

Normally, when you chat with an AI, your words travel over the internet to a company's giant computers, get processed there, and the answer travels back. Running a model "locally" means instead putting a smaller version of that AI directly on your own computer, so it works without an internet connection and nothing you type ever leaves your machine. Worth knowing about if you own a decent gaming PC and care about privacy, offline use, or avoiding per-use fees; skip it if you're happy using AI through a website or app and don't own powerful hardware.

Builds on Stage 0's consensus framing (8GB-class GPUs are an opportunistic batch tier, not a coding-assistant tier) with what's actually realistic on this specific rig — RTX 3070, 8GB VRAM, 64GB system RAM — and what else is worth knowing given hands-on 27B runs are already happening. No pick made; these are options.

## What "running a model locally" means

A model is two things: a file of **weights** (the trained numbers — a few GB to hundreds of GB depending on model size and quantization, explained below) and a **runtime** that loads those weights and executes them to produce output. "Running locally" means both live on your own machine — the runtime does the inference (the actual forward pass through the model that turns your prompt into a response) on your own CPU/GPU, instead of your request going over the network to a provider's servers. No API key, no per-request network call, no data leaving the machine unless you send it somewhere yourself.

This is a genuinely different setup from calling a hosted API (Claude, GPT, Gemini, etc.) where the weights and runtime are entirely on the provider's infrastructure and you only ever send/receive text over HTTP.

### Two different scales of "local"

Worth separating these, since they get lumped together but are very different in practice:

- **Local inline code completion** — small, fast models (often under 1-3B parameters) doing tab-completion or short suggestions inside an editor. Low latency requirement, low VRAM requirement, runs fine on modest hardware including laptops without a dedicated GPU.
- **A full local chat/coding model** — a general-purpose model (commonly 7B-70B+ parameters) handling multi-turn conversations, larger context, or agentic tool use. This is the scale the rest of this document is about — it's a much heavier ask on VRAM and system RAM, and the practical ceiling on consumer hardware is the main subject below.

### Why bother, given cloud frontier models are usually faster and better

For most coding tasks, a hosted frontier model will out-perform anything you can run on a single consumer GPU, and will usually respond faster too. Local is worth it for specific situations, not as a general replacement:

- **Privacy/sensitive data** — content that shouldn't leave the machine regardless of relative model quality (proprietary code, regulated data, anything under an NDA).
- **Offline use** — no network connection available or wanted.
- **Predictable cost** — no per-token API billing; once the hardware is paid for, running the model costs electricity, not a metered bill. Matters most at high volume.
- **Experimentation** — trying quantization, fine-tuning, or prompt techniques without burning API spend on every iteration.
- **Batch/background jobs where latency doesn't matter** — a job that runs for hours is fine if nobody's waiting on it synchronously.
- **Using spare/idle hardware** — a GPU that would otherwise sit idle overnight can run a bulk job for free instead of paying per-token for the same job on a hosted API.

The rest of this document covers the hardware/software choices for the second scale above — a full local model, not inline completion.

## Runner: Ollama vs. alternatives

[llama.cpp](https://github.com/ggml-org/llama.cpp) is the actual inference engine underneath — both [Ollama](https://ollama.com/) and [LM Studio](https://lmstudio.ai/) run llama.cpp (or an LM Studio fork of it) rather than competing with it. The pure inference-speed gap between them on identical [GGUF](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) weights is small on NVIDIA hardware (roughly 3-5%), so the choice is really about workflow, not raw speed:

- **Ollama** (current tool) — a single background daemon, REST API on `localhost:11434`, model pulls via an OCI-style registry, headless by default. Best fit for scripting and automation — an overnight batch job calling a local endpoint fits this naturally.
- **LM Studio** — polished GUI for browsing and comparing models side by side, plus a headless daemon (`llmster`, driven by an `lms` CLI) if scripting is wanted later. Better for *finding and evaluating* a model before committing to it than for daily automated use.
- **llama.cpp directly** — only worth reaching for when something Ollama/LM Studio don't expose is needed: an exotic quantization format, a backend not yet wrapped, or a feature that landed upstream in the last few weeks and hasn't trickled down yet.

Practical middle ground several sources converge on: use LM Studio to evaluate/compare candidate models, Ollama to actually serve the winner for scripted/automated use. They coexist fine, at the cost of each keeping its own separate copy of downloaded weights.

**[vLLM](https://github.com/vllm-project/vllm)** is not a good fit here — it's built for serving concurrent users at production throughput (multi-request batching, [PagedAttention](https://blog.vllm.ai/2023/06/20/vllm.html) for GPU memory efficiency across many simultaneous requests). For a single person running jobs sequentially on one card, it adds real setup complexity without a matching benefit. Skip it unless multi-user serving becomes an actual requirement.

## What's realistic on this hardware

The reported 27B runs are almost certainly running **partially offloaded to system RAM**, not fully in VRAM — worth naming explicitly since it explains the multi-hour runtime. A 27B model at a typical Q4_K_M quantization is roughly 17GB, well past the 3070's 8GB. Benchmarking sources put a fully-in-VRAM ceiling for this card at around a 9B model (Q4_K_M fits at ~7GB, delivering 50+ tokens/sec); anything larger spills layers to system RAM over PCIe, which is exactly the slowdown already being observed and traded off against for overnight bulk work.

This means there's a real choice being made without necessarily naming it: **stay at ~9B and get full-VRAM speed**, or **go larger (27B+) and accept the RAM-offload slowdown** because the task is bulk/overnight anyway and latency doesn't matter. Both are legitimate depending on the job — a 9B model at full speed may be perfectly adequate for straightforward classification/extraction, while a slower 27B might genuinely produce better output for something like content curation or synthesis. Worth treating as a per-task decision rather than a fixed setup.

64GB system RAM gives real headroom for the offload approach — general guidance for offloaded setups suggests provisioning roughly 2x the GPU's VRAM in system RAM as a comfortable minimum, and this rig is well past that ratio.

## Good-fit use cases, and which ones actually benefit from local

Beyond what's already being tried (bulk content generation for curated lists):

- **Metadata extraction / classification** — genuinely benefits from local when done over a large volume of small, structurally similar inputs (e.g. tagging hundreds of URLs). A cloud API batch endpoint is often cheaper and faster for the same job unless privacy or offline availability specifically matters — local wins here on cost-at-volume and data-never-leaves-the-machine, not on raw quality.
- **Privacy-sensitive processing** — the clearest case where local is the *right* choice rather than just the cheaper one: content that shouldn't leave the machine regardless of relative model quality.
- **Repository/codebase analysis, repetitive review passes** — plausible fit for overnight batch runs, but frontier cloud models will likely still produce meaningfully better output for anything requiring real reasoning about code; treat local here as "good enough, free, and slow" rather than a quality upgrade.
- **Content curation/generation at scale** — matches what's already being run; the tradeoff is genuinely about acceptable latency (hours are fine) vs. cloud API cost at that volume, not about local being categorically better.

## New-but-promising, labeled as unverified

Search turned up claims of new 2026 quantization techniques (an "APEX MoE quantization" and "FastDMS" KV-cache compression, reportedly used to run a 27B model competitive with cloud frontier models) from a single low-traffic source (a Japanese-language blog on note.com) with no corroboration found elsewhere. **This does not meet the evidence bar** — flagging it only because it's the kind of claim worth a skeptical look later if it resurfaces from a more credible source, not as something to act on now.

On firmer ground: FP8 and NVFP4 are becoming the standard for efficient serving on newer (Hopper-class) hardware, and 6-bit quantization is gaining traction as a quality/efficiency middle ground over the traditional 4-bit vs. 8-bit split — relevant mainly if a future hardware upgrade is on the table, less so for the 3070 today, where Q4_K_M GGUF remains the practical default (roughly 1-2% perplexity loss vs. full precision, ~4x memory savings).

## Sources

- codersera.com, appscale.blog, popularai.org, digitalapplied.com — 2026 Ollama/LM Studio/llama.cpp/vLLM comparison coverage
- localllm.in, willitrunai.com — 8GB VRAM real-hardware benchmark coverage (RTX 3070 specifically)
- pinggy.io, compute-market.com — 2026 consumer-GPU local-LLM hardware guides (VRAM/system-RAM ratio guidance)
- zylos.ai, patsnap.com — 2026 quantization-method survey coverage (FP8/NVFP4/6-bit)
- note.com (APEX/FastDMS claim) — single-source, uncorroborated, explicitly flagged as unverified above
