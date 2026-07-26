# V09 — Travel & Hospitality (Hotels, Tours, Booking Sites)

**Applies to:** hotels, vacation rentals, tour operators, booking/comparison platforms.

## Primary schema.org types
`Hotel`/`LodgingBusiness` (`LocalBusiness` subtypes, see V03) with `starRating`, `amenityFeature`, and `Offer` (price/availability); `Event` for organized tours/experiences with a fixed date; `BreadcrumbList` + `Organization`.

## Vertical-specific priorities
- ✅ **Price/availability freshness is a P1-class concern** — the same "don't mark up stale `Offer` data" rule as e-commerce (V01) applies with extra weight here since travel prices change constantly and a stale price is a direct trust breach at the point a user is about to book.
- ✅ **Multi-currency, multi-locale sites need the full `docs/02` hreflang treatment** — this vertical is disproportionately international, and currency should follow the same locale/URL-strategy discipline as language, not be bolted on via a client-side toggle that doesn't affect the canonical URL.
- ✅ **Booking-widget CSR trap:** availability calendars and price widgets are almost always heavy client-side components — ensure the room/tour's core descriptive content (name, description, images, amenities) is server-rendered independent of whether the live-availability widget has loaded (`docs/05`).
- ✅ Reviews (a major trust driver in this vertical) must follow the same genuine-content rule as V01/V03 — don't aggregate third-party review scores into on-page `AggregateRating` without the underlying reviews actually rendering.

## GEO notes
"Best hotel in X for Y" is a heavily AI-answered query category; accurate amenity/price schema plus genuine review content (not aggregated scores alone) is what's citable.

## Sources
- Hotel structured data — https://developers.google.com/search/docs/appearance/structured-data/hotel
- Managing multi-regional sites — https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
