# V11 — Automotive (Dealers & Inventory Sites)

**Applies to:** car dealerships, vehicle marketplaces, inventory-driven automotive sites.

## Primary schema.org types
`Vehicle` (or its more specific `Car` subclass) on every vehicle detail page (VDP) as schema.org data that describes the inventory. ⚠️ **Google phased out the Vehicle Listing rich result by September 2025** (`docs/08`), so this markup no longer earns a Google rich result — its value now is entity understanding for AI answer engines and other consumers, and accurate data. Pair with `LocalBusiness` (dealership, see V03) and `Service` (maintenance/parts); `FAQPage` earns no Google rich result since May 2026.

## Vertical-specific priorities
- ✅ **Every VDP needs accurate make, model, year, mileage, price and condition — on the page and in `Vehicle` markup** — inventory-based automotive sites live or die on this data being complete and accurate; a stale price or "sold" vehicle still showing as available is both a P1-class trust failure and a direct duplicate of the freshness problems in V01/V04/V09.
- ✅ **Sold-vehicle handling** mirrors V04's real-estate listing-removal guidance: redirect to a relevant current listing or the model-year search, don't leave a stale VDP indexable with no path forward for the user.
- ✅ **Inventory scale = the faceted-navigation problem from `docs/03`/V01** — make/model/year/trim/price filters on a large inventory site need the same crawl-budget discipline as e-commerce category filters.
- ✅ Dealership `LocalBusiness` (or multi-location) data needs the same NAP-consistency rigor as V03.

## GEO notes
Vehicle-shopping queries are increasingly answered by AI systems, which can only cite make/model/price/condition they can read — server-rendered on the page and mirrored in `Vehicle` markup (`docs/10`). Treat claims that markup alone decides AI visibility as industry opinion, not engine documentation.

## Sources
- Vehicle — https://schema.org/Vehicle
- Local Business structured data — https://developers.google.com/search/docs/appearance/structured-data/local-business
