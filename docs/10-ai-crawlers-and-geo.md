# 10 — AI Crawlers & GEO (Generative Engine Optimization)

This doc covers two related but distinct 2025–2026 topics: (a) how to control **AI crawlers** in `robots.txt`, and (b) how to actually get **cited by AI answer engines** (Google AI Overviews/AI Mode, ChatGPT Search, Perplexity, Copilot, Claude). Both are now a standard part of a complete audit — don't skip them just because they're newer than the classic 9-point check.

## AI crawlers in `robots.txt`

- ⚠️ **Training, search and user-triggered fetching are three different bots — decide on each.** Most AI providers now ship separate user-agents for *training* models on your content, for *indexing* it so an AI search product can cite it, and for *fetching* a page live because a user asked about it. Blocking one does not block the others.

| Provider | Training (opt out of model use) | AI search / answer index (allow to be cited) | User-triggered fetch |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` (ChatGPT search) | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Google | `Google-Extended` (Gemini training & grounding — **not** Search; blocking it does not affect ranking) | — AI Overviews / AI Mode use **`Googlebot`**; control them with `nosnippet`/`max-snippet`, not robots.txt | `Google-CloudVertexBot` (Vertex AI agents, on the site owner's request) |
| Apple | `Applebot-Extended` (a control token, it does not crawl) | `Applebot` (Siri, Spotlight, Safari Suggestions — `docs/18`) | — |
| Perplexity | — | `PerplexityBot` | `Perplexity-User` |
| Microsoft | — (no separate token) | `bingbot` — Copilot answers come from Bing's index; control them with `noarchive`/`nocache` (`docs/18`) | — |
| Meta | `Meta-ExternalAgent` | — | `Meta-ExternalFetcher` |
| DuckDuckGo | — | `DuckAssistBot` | — |
| Amazon | `Amazonbot` | — | — |
| Common Crawl | `CCBot` (a public dataset many models train on) | — | — |
| ByteDance | `Bytespider` | — | — |
| Mistral | — | — | `MistralAI-User` |

- ⚠️ **Retired tokens:** `anthropic-ai` and `Claude-Web` are Anthropic's old tokens, replaced by the three above. Rules written for them now do nothing. Keep them only as harmless extras.
- ⚠️ **User-triggered fetchers are a special case.** Several providers say that a fetch made on a user's direct request is not automated crawling, so robots.txt may not be applied to it. If a page must not be read by these fetchers, robots.txt is not the instrument — authentication is.
- ✅ **The machine-readable alternative:** a `Content-Signal:` line in robots.txt (for example `Content-Signal: search=yes, ai-input=yes, ai-train=no`) states the same three decisions in one place for any crawler that reads it. It is newer than per-bot groups, adoption is still partial, and it is best written **alongside** them, not instead of them.
- ✅ **A `Disallow` only works if the bot honors it.** Unlike Googlebot, compliance from AI crawlers is opt-in and inconsistent — some providers (Perplexity, notably) have been documented ignoring `robots.txt` or rotating user-agents to route around a block. Treat `robots.txt` AI directives as a real but not airtight control, not a guarantee.
- ✅ **This is a per-project decision, not a universal recommendation.** Ask (or ask the user) whether the goal is: (a) maximize AI-answer visibility → allow the retrieval bots, or (b) protect content from model training / competitors → block the training bots. Don't silently pick one; state the tradeoff and the choice made.
- ✅ AI crawler user-agents change often — note in the audit output that this list should be re-verified periodically (e.g. quarterly), it is not a one-time fix like classic `robots.txt` rules. `tools/seo-audit.mjs` prints the resolved allow/block state for every token in the table above.
- ✅ **AI answers have snippet controls too.** Google applies `nosnippet`, `max-snippet` and `data-nosnippet` to AI Overviews and AI Mode, the same way it applies them to classic snippets. A `nosnippet` set site-wide by a template therefore makes the site unquotable in AI answers while it keeps ranking. Bing's equivalents are `noarchive` and `nocache` (`docs/18`).

## GEO fundamentals (getting cited by AI answers)

- ✅ **Classic SEO is the prerequisite, not a replacement.** Google AI Overviews draw citations overwhelmingly from pages that already rank organically (typically top 10) — so everything in `docs/01`–`08` still has to be right first. GEO adds on top of SEO; it doesn't substitute for it.
- ✅ **Server-rendered content is mandatory here too.** AI crawlers generally do **not** execute JavaScript. A CSR page that's invisible to Googlebot (`docs/05`) is equally invisible to GPTBot/PerplexityBot/ClaudeBot — same fix (SSR/SSG/ISR), same check.
- ✅ **Structure content to be quoted, not just read.** Lead each section with a direct, self-contained answer to the question the heading implies (a sentence that makes sense pulled out of context), then elaborate. Use lists/tables for anything comparative or enumerable — AI engines extract these more readily than prose.
- ✅ **Different engines cite differently — don't optimize for only one.** Google AI Overviews correlate with your normal organic ranking; ChatGPT leans toward well-established, encyclopedic/reference-style sources; Perplexity draws heavily on recent, community-discussed content (forums/Reddit-style sources feature disproportionately). If citations matter to the project, check more than just Google.
- ✅ **Entity authority compounds across engines.** Consistent naming, an `Organization`/`Person` JSON-LD entity (`docs/08`) with a `sameAs` array pointing to Wikidata, LinkedIn, Crunchbase, and other authoritative external profiles, an About page acting as the site's canonical "entity home," and clear authorship (`docs/09`'s E-E-A-T section) all help AI systems resolve *who* is answering, not just index *what* was said — `sameAs` is the single highest-leverage addition here if only one thing gets done.
- ❌ **`llms.txt` is not a fix for any of this.** As of 2026, Google, OpenAI, Anthropic, and Meta have not committed to reading or acting on `llms.txt` in production search/answer systems, and independent measurement has found no correlation between its presence and AI-citation frequency. Don't recommend adding it as an SEO/GEO fix — this reinforces `docs/09`'s existing guidance, now with confirmation the position hasn't changed.

## What to audit

- [ ] `robots.txt` explicitly and deliberately addresses AI crawlers (not silently defaulting to whatever a template shipped with) — training vs. retrieval agents handled per the project's actual intent.
- [ ] Pages the project wants AI-cited are server-rendered (same check as `docs/05`, just confirm it also covers the pages that matter for GEO).
- [ ] Key pages lead with a direct, extractable answer near the top, not buried after several paragraphs of preamble.
- [ ] No `llms.txt`-as-silver-bullet recommendation is made; if one exists already, don't flag its absence as an issue.
- [ ] No template sets `nosnippet` / `max-snippet:0` (Google) or `noarchive` / `nocache` (Bing) on pages the project wants cited.
- [ ] The AI-answer surfaces that matter to the project were actually tested: ask ChatGPT, Perplexity, Copilot, Gemini and Claude the questions the site should answer, record who is cited, and repeat after changes (`docs/15`).

## Sources
- Google Search — AI features and your website (confirms `llms.txt` not used/needed for AI Overviews/AI Mode) — https://developers.google.com/search/docs/appearance/ai-features
- Googlebot / crawlers overview (JS execution behavior referenced from `docs/05`) — https://developers.google.com/search/docs/crawling-indexing/googlebot
- OpenAI — crawlers (GPTBot / OAI-SearchBot / ChatGPT-User) — https://platform.openai.com/docs/bots
- Anthropic — crawlers (ClaudeBot / Claude-SearchBot / Claude-User) — https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Google common crawlers incl. Google-Extended — https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- Robots meta tag (`nosnippet` applies to AI features) — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- About Applebot / Applebot-Extended — https://support.apple.com/en-us/119829
- Perplexity crawlers — https://docs.perplexity.ai/guides/bots
- Content Signals — https://contentsignals.org
- web.dev — rendering on the web (crawler JS execution) — https://web.dev/articles/rendering-on-the-web
