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

## How to read a rule

Each doc uses this convention:
- **✅ Do** — Google's explicit recommendation.
- **⚠️ Gotcha** — a common mistake or non-obvious interaction.
- **❌ Don't** — an anti-pattern Google warns against.
- **Source:** — the official page the rule comes from.

## The one-paragraph summary

Give every important page a **unique title/description**, a **self-referential canonical** (plus **bidirectional hreflang** if multilingual), correct **`index,follow`** robots, **server-rendered** content, **crawlable `<a href>`** links (including real pagination), **type-appropriate JSON-LD** that reflects only visible content, **descriptive image alt + dimensions**, and list it in an **XML sitemap**. Keep internal search results and live tools **`noindex`**, keep dashboards **private**, and write for **people, not crawlers**.
