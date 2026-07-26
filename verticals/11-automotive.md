# V11 — Automotive (Dealers & Inventory Sites)

**Applies to:** car dealerships, vehicle marketplaces, inventory-driven automotive sites.

## Primary schema.org types
`Vehicle` (or its more specific `Car` subclass) on every vehicle detail page (VDP) — this is the single most important structured-data type for an inventory-based automotive site, per current industry guidance, and adoption is reportedly still under 40% among dealerships, meaning it's a genuine differentiator, not table-stakes yet. Pair with `LocalBusiness` (dealership, see V03), `Service` (maintenance/parts), and `FAQPage` where relevant (2023 eligibility caveat, `docs/08`).

## Vertical-specific priorities
- ✅ **Every VDP needs `Vehicle` markup with make, model, year, mileage, price, and condition** — inventory-based automotive sites live or die on this being complete and accurate; a stale price or "sold" vehicle still showing as available is both a P1-class trust failure and a direct duplicate of the freshness problems in V01/V04/V09.
- ✅ **Sold-vehicle handling** mirrors V04's real-estate listing-removal guidance: redirect to a relevant current listing or the model-year search, don't leave a stale VDP indexable with no path forward for the user.
- ✅ **Inventory scale = the faceted-navigation problem from `docs/03`/V01** — make/model/year/trim/price filters on a large inventory site need the same crawl-budget discipline as e-commerce category filters.
- ✅ Dealership `LocalBusiness` (or multi-location) data needs the same NAP-consistency rigor as V03.

## GEO notes
Vehicle-shopping queries are increasingly answered via AI systems that rely on structured `Vehicle` data to understand make/model/price/condition — per current industry data, dealerships without this markup are effectively invisible to those systems even if their pages otherwise rank.

## Sources
- Vehicle — https://schema.org/Vehicle
- Local Business structured data — https://developers.google.com/search/docs/appearance/structured-data/local-business
