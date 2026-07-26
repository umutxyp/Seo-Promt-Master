# V04 — Real Estate

**Applies to:** brokerages, listing portals, individual agent sites with property listings.

## Primary schema.org types
`RealEstateListing` (a valid, defined schema.org type — but ⚠️ **not confirmed as a Google rich-result gallery type** as of this writing; use it for entity clarity and third-party/AI-engine consumption, don't promise a rich result specifically for it, per this repo's "don't invent eligibility" rule in `docs/08`). Pair it with standard `Offer` (price) and `Place`/`PostalAddress` (location). `BreadcrumbList` + `Organization` site-wide.

## Vertical-specific priorities
- ✅ **Listing freshness and removal are a P1-class issue, not P3 polish.** A sold/off-market property still indexable and still showing a stale price/status is both a user-trust problem and a Google quality signal problem — treat "listing status accurately reflects reality" the same severity as `docs/09`'s soft-404 concern; sold listings should either redirect to a relevant current listing/search, or clearly and immediately update their status.
- ✅ **One canonical URL per property**, even if the same listing is syndicated across multiple agent/brokerage pages internally — cross-canonicalize duplicates (`docs/01`).
- ✅ Location data (`address`, `geo`) must be **accurate and consistent** with map embeds and any `LocalBusiness` data for the brokerage itself (see V03) — don't let the property's location and the agency's location schema drift or conflict.
- ⚠️ Don't over-promise structured-data-driven rich results here given `RealEstateListing`'s unconfirmed gallery status — the actual SEO lift comes from classic fundamentals (unique per-listing content, correct indexing hygiene, image SEO for property photos) more than from this specific schema type.

## GEO notes
Property search is a common AI-answer-engine query pattern ("3-bedroom houses under $X in Y"); accurate, structured price/location/status data is what makes a listing citable — the same freshness requirement as the SEO priority above, doubly important here since AI engines have no tolerance for citing a sold property as available.

## Sources
- RealEstateListing — https://schema.org/RealEstateListing
- Structured data general policies — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
