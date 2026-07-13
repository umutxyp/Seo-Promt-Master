# Public Page Checklist

Run this against **every `public-index` page**. Each item cites its knowledge-base doc.

## Metadata & head
- [ ] Unique, descriptive `<title>` (not boilerplate) — `docs/01`
- [ ] Unique meta `description` — `docs/01`
- [ ] Open Graph + Twitter card (title/description/image/url/type) — `docs/01`
- [ ] `index,follow` robots (this page should rank) — `docs/01`
- [ ] Self-referential `rel="canonical"` — `docs/01`

## Internationalization (if multilingual)
- [ ] Bidirectional, self-referential `hreflang` set — `docs/02`
- [ ] `x-default` present; valid ISO codes — `docs/02`
- [ ] No auto-redirect between locales — `docs/02`

## Structured data
- [ ] `WebPage` + `BreadcrumbList` — `docs/08`
- [ ] Type-appropriate schema (Article/Product/ItemList/ProfilePage/FAQPage/…) — `docs/08`
- [ ] Reflects **only visible** content; valid schema.org type — `docs/08`

## Structure & links
- [ ] Exactly one `<h1>` — `docs/04`
- [ ] Semantic landmarks (`main`/`nav`/`article`/`section`) — `docs/04`
- [ ] Crawlable `<a href>` internal links, descriptive anchors — `docs/03`,`docs/04`
- [ ] Pagination = real `?page=n` links, self-canonical per page — `docs/03`
- [ ] UGC links `rel="ugc"`, ads `rel="sponsored"` — `docs/03`

## Rendering & performance
- [ ] Primary content in server-rendered HTML (not CSR-only) — `docs/05`
- [ ] Real 404 for missing entities (no soft-404) — `docs/05`
- [ ] LCP image eager + `fetchpriority=high`, not lazy — `docs/05`,`docs/07`
- [ ] Below-fold images `loading="lazy"` — `docs/07`

## Images
- [ ] Descriptive `alt` on every content image — `docs/07`
- [ ] Explicit `width`/`height` (CLS) — `docs/07`
- [ ] Real `<img src>` (not CSS background) for content images — `docs/07`

## Sitemap
- [ ] Page is in the XML sitemap with accurate `lastmod` — `docs/06`
