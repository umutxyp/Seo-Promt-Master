# V15 — Marketplace / Two-Sided Platforms

**Applies to:** any platform connecting independent sellers/providers to buyers at scale (beyond single-brand e-commerce, V01) — think Etsy/Airbnb-style platforms, service marketplaces, listing aggregators.

## Primary schema.org types
`Product`/`Service`+`Offer` per listing (seller-provided, so validate rather than trust blindly); `Person`/`Organization` for seller/vendor profile pages with `sameAs` where sellers have external presence; `AggregateRating`/`Review` only where genuine, on-page reviews exist.

## Vertical-specific priorities
- ✅ **Thin/duplicate seller content at scale is the defining technical-SEO problem of this vertical**, more than any other. Thousands of listings for the same or similar underlying item, with boilerplate or near-empty descriptions, is the most common reason marketplace pages fail to meet Google's indexing bar — this is `docs/09`'s helpful-content concern operating at industrial scale, and should be treated as the top P1/P2 category in a marketplace audit, above individual on-page polish.
- ✅ **Vendor/seller pages are where E-E-A-T concentrates** (`docs/09`, `docs/10`): a seller page rich with real introduction text, verified badges, transaction history, and genuine buyer feedback is both more trustworthy to users and more indexable to Google than a bare listing grid — invest audit and fix attention here specifically.
- ✅ **Two-sided (blind) review systems** — where both parties submit reviews independently before either sees the other's — produce materially more honest, retaliation-free reviews than one-sided systems; this is a trust-and-safety design choice with a direct SEO consequence (real, substantive review content vs. thin or absent reviews).
- ✅ Duplicate/near-duplicate listings for the same underlying product across different sellers need the faceted-nav and cross-canonical treatment from `docs/03`/V01 — don't let hundreds of sellers listing "the same item" each compete as separate weak pages when one canonical group page would serve better.
- ✅ Newly created listings (a constant stream on active marketplaces) need a deliberate minimum-content bar before being allowed to be `public-index` — apply Phase 1's classification (`prompts/01`) explicitly to "how thin is too thin to index yet."

## GEO notes
AI shopping/service-discovery answers strongly prefer marketplace pages with complete, non-boilerplate seller and product data — the same anti-thin-content discipline above is directly what makes a listing citable versus indistinguishable noise to an AI crawler.

## Sources
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Faceted navigation — https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
