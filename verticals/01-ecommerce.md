# V01 — E-commerce / Online Retail

**Applies to:** stores selling physical or digital products directly (single-brand or multi-category), product listing pages (PLPs) and product detail pages (PDPs).

## Primary schema.org types
`Product` + `Offer` + `AggregateRating`/`Review` (`docs/08`) on every PDP; `BreadcrumbList` on every page; `ItemList`/`CollectionPage` on category/PLP pages; `Organization` with `sameAs` site-wide.

## Vertical-specific priorities
- ✅ **Required `Product` fields:** `name`, `image`, `offers` (with `price`, `priceCurrency`, `availability` kept in sync with real-time stock — stale `availability` is a common, high-impact bug). Only include `aggregateRating`/`review` if genuine reviews render on the page; Google generally expects a minimum rating count (commonly cited around 10+) before showing stars, per `docs/08`.
- ⚠️ **Out-of-stock handling:** don't 404 or noindex a permanently-discontinued product if it still has SEO value — instead show related/replacement products and keep `availability: OutOfStock` accurate; for temporarily out-of-stock items, keep the page indexable.
- ✅ **Faceted navigation (filters/sort) is the #1 crawl-budget risk** on large catalogs — apply `docs/03`'s faceted-nav rules (canonical to unfiltered, `Disallow` non-valuable combinations) aggressively; this is usually the single biggest P1 category on an e-commerce audit.
- ✅ **Variant/SKU canonicalization:** color/size variants on separate URLs should either self-canonicalize (if each variant deserves its own ranking) or canonicalize to a parent product — pick one pattern site-wide, don't mix.
- ✅ Image SEO (`docs/07`) matters more here than most verticals — product photos are a primary discovery surface (Google Images, Shopping).

## GEO notes
Product pages with complete, accurate `Offer` data are what AI shopping assistants and answer engines lift into comparison answers — incomplete/stale price-availability data is treated the same as missing data by both Google and AI crawlers (`docs/10`).

## Sources
- Merchant listing / Product structured data — https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Faceted navigation — https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
