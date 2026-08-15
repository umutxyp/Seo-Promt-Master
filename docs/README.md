# Knowledge Base — Google SEO, Split by Topic

This is the **source of truth** for SEO Prompt Master. Every recommendation the workflow makes should cite one of these sections. All rules are distilled from **Google Search Central** (`developers.google.com/search`) and **web.dev**, cross-checked and current for **2024–2026**.

| # | Doc | Covers |
|---|---|---|
| 01 | [Meta & Head](01-meta-and-head.md) | `<title>`, meta description, Open Graph, robots meta / X-Robots-Tag, canonical |
| 02 | [Internationalization](02-internationalization.md) | hreflang, `lang`, URL strategy, language detection, auto-redirect |
| 03 | [UGC, Forums & Blogs](03-ugc-forums-blogs.md) | `rel=ugc/sponsored/nofollow`, pagination, faceted nav, moderation |
| 04 | [Page Structure](04-page-structure.md) | headings, semantic HTML, internal linking, anchor text |
| 05 | [Rendering & Core Web Vitals](05-rendering-and-core-web-vitals.md) | SSR/SSG/CSR, JavaScript SEO, LCP/CLS/INP/TTFB |
| 06 | [Sitemaps](06-sitemaps.md) | XML sitemap, sitemap index, size limits, `lastmod` |
| 07 | [Image SEO](07-image-seo.md) | alt text, responsive images, lazy loading, image sitemaps |
| 08 | [Structured Data](08-structured-data.md) | JSON-LD, schema.org types, policies, validation |
| 09 | [2024–2026 Updates](09-2024-2026-updates.md) | Helpful Content, core updates, AI Overviews, Starter Guide changes |
| 10 | [AI Crawlers & GEO](10-ai-crawlers-and-geo.md) | GPTBot/ClaudeBot/PerplexityBot robots.txt directives, getting cited by AI answer engines |
| 11 | [SEO Score & GEO Score](11-scoring-rubric.md) | Deterministic 0–100 scoring rubric, P1-caps-the-page rule, self-recheck requirement |
| 12 | [Crawling & robots.txt](12-crawling-and-robots.md) | RFC 9309 semantics, response-code behaviour, Google's crawlers, crawl budget, log analysis |
| 13 | [Indexing & duplicates](13-indexing-and-duplicates.md) | noindex vs Disallow vs 410, canonical conflicts, duplicate taxonomy, faceted nav, soft 404s, GSC index states |
| 14 | [Quality, E-E-A-T & spam](14-quality-eeat-and-spam.md) | The 16 spam policies, scaled content abuse, AI-content line, directory thresholds, manual action recovery |
| 15 | [Measurement & verification](15-measurement-and-verification.md) | Search Console reports, BigQuery, KPI set, proving a change, traffic-drop diagnosis |
| 16 | [Migrations & incidents](16-migrations-and-incidents.md) | URL inventory, redirect maps, rollback criteria, hack response |
| 17 | [Off-page & entity authority](17-offpage-and-entity-authority.md) | Link quality, digital PR, disavow, brand and entity building |

**01–11 are about the page.** 12–17 are about everything around it: whether a
crawler reaches the page, which URL wins when several say the same thing, whether
the content clears the quality bar at all, how you prove a change worked, and
what to do when a migration or an incident is under way.

## How to read a rule

Each doc uses this convention:
- **✅ Do** — Google's explicit recommendation.
- **⚠️ Gotcha** — a common mistake or non-obvious interaction.
- **❌ Don't** — an anti-pattern Google warns against.
- **Source:** — the official page the rule comes from.

## The one-paragraph summary

Give every important page a **unique title/description**, a **self-referential canonical** (plus **bidirectional hreflang** if multilingual), correct **`index,follow`** robots, **server-rendered** content, **crawlable `<a href>`** links (including real pagination), **type-appropriate JSON-LD** that reflects only visible content, **descriptive image alt + dimensions**, and list it in an **XML sitemap**. Keep internal search results and live tools **`noindex`**, keep dashboards **private**, and write for **people, not crawlers**.
