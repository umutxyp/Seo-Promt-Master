# 02 — Internationalization (Multilingual / Multi-Regional)

## How Google decides a page's language

- ⚠️ Google determines language **from the visible content only**. It does **not** use the `lang` attribute, the URL, or `hreflang` to *detect* language. (`lang`/`hreflang` are for accessibility and matching, not detection.)

## URL strategy — pick one

| Strategy | Example | Notes |
|---|---|---|
| ccTLD | `example.de` | Strong geo signal, costly |
| Subdomain | `de.example.com` | Flexible |
| Subdirectory | `example.com/de/` | Usually the most practical |
| URL parameter | `example.com?lang=de` | ❌ Not recommended for locale |

## hreflang

- ✅ Use `hreflang` so Search serves the right language/region version. Provide it via HTML `<link rel="alternate" hreflang>`, HTTP `Link` headers (for non-HTML), **or** XML sitemap `xhtml:link`.
- ✅ **Bidirectional & self-referential:** every version must list **itself** and **all** other versions. If page A links to B but B doesn't link back to A, **Google ignores the annotations**.
- ✅ Codes: ISO 639-1 language + optional ISO 3166-1 Alpha-2 region (`en`, `en-GB`, `de-CH`, `zh-Hans`). A region code **cannot** stand alone. `UK`, `EU`, `UN` are invalid.
- ✅ URLs must be **fully qualified** (include `https://`), not protocol-relative or root-relative.
- ✅ Add `x-default` for the fallback when no language matches.

## Redirects & adaptation

- ❌ **Don't auto-redirect** users between language versions by IP/`Accept-Language` — it can block users and crawlers from reaching versions. Offer a banner/selector instead.
- ⚠️ IP-based content adaptation is discouraged as unreliable. For locale-adaptive pages, Google may not crawl/index all locale variants.

## Duplicate regional content

- For similar content across regional URLs, combine `rel="canonical"` **with** `hreflang` to serve the correct regional/language URL.

## Sources
- Managing multi-regional sites — https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Localized versions (hreflang) — https://developers.google.com/search/docs/specialty/international/localized-versions
