# Stage 1 — Local Model Use

Builds on Stage 0's consensus framing (8GB-class GPUs are an opportunistic batch tier, not a coding-assistant tier) with what's actually realistic on this specific rig — RTX 3070, 8GB VRAM, 64GB system RAM — and what else is worth knowing given hands-on 27B runs are already happening. No pick made; these are options.

## Runner: Ollama vs. alternatives

llama.cpp is the actual inference engine underneath — both Ollama and LM Studio run llama.cpp (or an LM Studio fork of it) rather than competing with it. The pure inference-speed gap between them on identical GGUF weights is small on NVIDIA hardware (roughly 3-5%), so the choice is really about workflow, not raw speed:

- **Ollama** (current tool) — a single background daemon, REST API on `localhost:11434`, model pulls via an OCI-style registry, headless by default. Best fit for scripting and automation — an overnight batch job calling a local endpoint fits this naturally.
- **LM Studio** — polished GUI for browsing and comparing models side by side, plus a headless daemon (`llmster`, driven by an `lms` CLI) if scripting is wanted later. Better for *finding and evaluating* a model before committing to it than for daily automated use.
- **llama.cpp directly** — only worth reaching for when something Ollama/LM Studio don't expose is needed: an exotic quantization format, a backend not yet wrapped, or a feature that landed upstream in the last few weeks and hasn't trickled down yet.

Practical middle ground several sources converge on: use LM Studio to evaluate/compare candidate models, Ollama to actually serve the winner for scripted/automated use. They coexist fine, at the cost of each keeping its own separate copy of downloaded weights.

**vLLM** is not a good fit here — it's built for serving concurrent users at production throughput (multi-request batching, PagedAttention for GPU memory efficiency across many simultaneous requests). For a single person running jobs sequentially on one card, it adds real setup complexity without a matching benefit. Skip it unless multi-user serving becomes an actual requirement.

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
