# 10 — AI Crawlers & GEO (Generative Engine Optimization)

This doc covers two related but distinct 2025–2026 topics: (a) how to control **AI crawlers** in `robots.txt`, and (b) how to actually get **cited by AI answer engines** (Google AI Overviews/AI Mode, ChatGPT Search, Perplexity, Copilot, Claude). Both are now a standard part of a complete audit — don't skip them just because they're newer than the classic 9-point check.

## AI crawlers in `robots.txt`

- ⚠️ **Training vs. retrieval are different bots — treat them differently.** Most AI providers now ship separate user-agents for *training* their models on your content versus *retrieving* your content live to answer a user's question. Blocking one does not block the other.
  - Training-only agents (block these if you don't want your content used for model training): `GPTBot`, `Google-Extended`, `ClaudeBot` (Anthropic's training crawler), `CCBot`, `anthropic-ai`, `Meta-ExternalAgent`.
  - Retrieval/search agents (allow these if you *want* to be eligible for citation in AI answers): `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot`, `Claude-User`.
- ✅ **A `Disallow` only works if the bot honors it.** Unlike Googlebot, compliance from AI crawlers is opt-in and inconsistent — some providers (Perplexity, notably) have been documented ignoring `robots.txt` or rotating user-agents to route around a block. Treat `robots.txt` AI directives as a real but not airtight control, not a guarantee.
- ✅ **This is a per-project decision, not a universal recommendation.** Ask (or ask the user) whether the goal is: (a) maximize AI-answer visibility → allow the retrieval bots, or (b) protect content from model training / competitors → block the training bots. Don't silently pick one; state the tradeoff and the choice made.
- ✅ AI crawler user-agents change often — note in the audit output that this list should be re-verified periodically (e.g. quarterly), it is not a one-time fix like classic `robots.txt` rules.

## GEO fundamentals (getting cited by AI answers)

- ✅ **Classic SEO is the prerequisite, not a replacement.** Google AI Overviews draw citations overwhelmingly from pages that already rank organically (typically top 10) — so everything in `docs/01`–`08` still has to be right first. GEO adds on top of SEO; it doesn't substitute for it.
- ✅ **Server-rendered content is mandatory here too.** AI crawlers generally do **not** execute JavaScript. A CSR page that's invisible to Googlebot (`docs/05`) is equally invisible to GPTBot/PerplexityBot/ClaudeBot — same fix (SSR/SSG/ISR), same check.
- ✅ **Structure content to be quoted, not just read.** Lead each section with a direct, self-contained answer to the question the heading implies (a sentence that makes sense pulled out of context), then elaborate. Use lists/tables for anything comparative or enumerable — AI engines extract these more readily than prose.
- ✅ **Different engines cite differently — don't optimize for only one.** Google AI Overviews correlate with your normal organic ranking; ChatGPT leans toward well-established, encyclopedic/reference-style sources; Perplexity draws heavily on recent, community-discussed content (forums/Reddit-style sources feature disproportionately). If citations matter to the project, check more than just Google.
- ✅ **Entity authority compounds across engines.** Consistent naming, an `Organization`/`Person` JSON-LD entity (`docs/08`), an About page and clear authorship (`docs/09`'s E-E-A-T section) all help AI systems resolve *who* is answering, not just index *what* was said.
- ❌ **`llms.txt` is not a fix for any of this.** As of 2026, Google, OpenAI, Anthropic, and Meta have not committed to reading or acting on `llms.txt` in production search/answer systems, and independent measurement has found no correlation between its presence and AI-citation frequency. Don't recommend adding it as an SEO/GEO fix — this reinforces `docs/09`'s existing guidance, now with confirmation the position hasn't changed.

## What to audit

- [ ] `robots.txt` explicitly and deliberately addresses AI crawlers (not silently defaulting to whatever a template shipped with) — training vs. retrieval agents handled per the project's actual intent.
- [ ] Pages the project wants AI-cited are server-rendered (same check as `docs/05`, just confirm it also covers the pages that matter for GEO).
- [ ] Key pages lead with a direct, extractable answer near the top, not buried after several paragraphs of preamble.
- [ ] No `llms.txt`-as-silver-bullet recommendation is made; if one exists already, don't flag its absence as an issue.

## Sources
- Google Search — AI features and your website (confirms `llms.txt` not used/needed for AI Overviews/AI Mode) — https://developers.google.com/search/docs/appearance/ai-features
- Googlebot / crawlers overview (JS execution behavior referenced from `docs/05`) — https://developers.google.com/search/docs/crawling-indexing/googlebot
- OpenAI — GPTBot / OAI-SearchBot documentation — https://platform.openai.com/docs/gptbot
- web.dev — rendering on the web (crawler JS execution) — https://web.dev/articles/rendering-on-the-web
