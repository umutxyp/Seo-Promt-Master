# V12 — News & Media Publishers

**Applies to:** news outlets, magazines, media sites publishing time-sensitive articles at volume.

## Primary schema.org types
`NewsArticle` (preferred over generic `Article` for news content) with the required fields: `headline`, `author` (name + URL), `datePublished` and `dateModified` in ISO 8601 **with timezone**, `publisher` (name + logo), and a main `image` — provide it in all three common aspect ratios (1:1, 4:3, 16:9) since different Google News surfaces prefer different crops. JSON-LD is Google's explicitly preferred format over Microdata/RDFa for this type.

## Vertical-specific priorities
- ✅ **Google News inclusion since late 2025 is no longer a manual per-site application** — visibility is earned by sustained signals of reliable publishing, transparent ownership, high-quality reporting, and stable site performance, registered through Google Publisher Center. Don't treat this as a one-time submission task; treat it as an ongoing quality bar.
- ✅ **News sitemap freshness is far stricter than the standard sitemap rule in `docs/06`** — a dedicated news sitemap should be kept pruned to roughly the last 48 hours of content, updated continuously, not the general "accurate lastmod, resubmit occasionally" pattern.
- ✅ **Timezones on every date field** — a missing or wrong timezone on `datePublished`/`dateModified` is a specifically-called-out, common, high-impact bug in this vertical given how much ranking for news queries depends on precise recency.
- ✅ Correction/update transparency (visible "Updated: <date>" with what changed) is an E-E-A-T signal specific to news content (`docs/09`) — silent edits to published news content undermine trust signals.

## GEO notes
Breaking-news and current-events queries are a category where AI Overviews lean heavily on publication recency and NewsArticle-marked, timezone-correct dates — the freshness discipline above is directly a GEO lever, not just a classic-SEO one.

## Sources
- schema.org NewsArticle — https://schema.org/NewsArticle
- Publisher Center — best practices for article pages — https://support.google.com/news/publisher-center/answer/9607104
