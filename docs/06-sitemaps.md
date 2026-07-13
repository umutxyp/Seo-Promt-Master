# 06 — Sitemaps

## Limits & structure

- ✅ A single sitemap file: max **50 MB uncompressed** *or* **50,000 URLs**. Exceed either → split and reference from a **sitemap index**.
- ✅ A sitemap index: max **50,000 sitemap entries**. You can submit up to **500 index files** per site in Search Console.
- ✅ Sitemaps referenced by an index must live on the **same site**, in the **same directory or below** the index.
- ✅ Files must be **UTF-8**; URLs must be **fully-qualified absolute** URLs pointing only to the **canonical** version.

## `lastmod`, `priority`, `changefreq`

- ✅ Google uses `<lastmod>` **only if it's consistently and verifiably accurate** (reflecting real content changes). Use W3C Datetime format.
- ⚠️ Google **ignores `<priority>` and `<changefreq>` entirely.** (Harmless to include for other engines, but don't rely on them.)

## Formats & submission

- ✅ Formats: **XML** (most versatile — supports image/video/news/hreflang), RSS/Atom, plain text. Prefer XML.
- ✅ Submit via Search Console, the Search Console API, a `Sitemap:` line in `robots.txt`, or WebSub for feeds.

## Coverage rule (audit this)

- ✅ The sitemap should list exactly your **`public-index`** set.
- ❌ **Never list a URL you also `Disallow` in `robots.txt`** — that's a conflicting signal. (Common bug: tool/editor pages disallowed in robots but still in the sitemap.)
- ✅ Keep `noindex` and `private` routes **out** of the sitemap.

## Multilingual

- ✅ XML sitemaps can carry `hreflang` via `xhtml:link` alternates per `<url>` (an alternative to HTML `<link rel="alternate">`). See `docs/02`.

## Sources
- Build & submit a sitemap — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Large sitemaps / sitemap index — https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps
