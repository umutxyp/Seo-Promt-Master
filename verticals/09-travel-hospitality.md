# V09 — Travel & Hospitality (Hotels, Tours, Booking Sites)

**Applies to:** hotels, vacation rentals, tour operators, booking/comparison platforms.

## Primary schema.org types
`Hotel`/`LodgingBusiness` (`LocalBusiness` subtypes, see V03) with `starRating`, `amenityFeature`, and `Offer` (price/availability) — valid schema.org for entity understanding, but Google Search has no hotel rich result from page markup: hotel prices reach Google through Hotel Center feeds, and holiday rentals have their own `VacationRental` markup; `Event` only for tours that are genuine events with a fixed date and a physical location — Google explicitly says not to mark up trip packages as events; `BreadcrumbList` + `Organization`.

## Vertical-specific priorities
- ✅ **Price/availability freshness is a P1-class concern** — the same "don't mark up stale `Offer` data" rule as e-commerce (V01) applies with extra weight here since travel prices change constantly and a stale price is a direct trust breach at the point a user is about to book.
- ✅ **Multi-currency, multi-locale sites need the full `docs/02` hreflang treatment** — this vertical is disproportionately international, and currency should follow the same locale/URL-strategy discipline as language, not be bolted on via a client-side toggle that doesn't affect the canonical URL.
- ✅ **Booking-widget CSR trap:** availability calendars and price widgets are almost always heavy client-side components — ensure the room/tour's core descriptive content (name, description, images, amenities) is server-rendered independent of whether the live-availability widget has loaded (`docs/05`).
- ✅ Reviews (a major trust driver in this vertical) must follow the same genuine-content rule as V01/V03 — don't aggregate third-party review scores into on-page `AggregateRating` without the underlying reviews actually rendering.

## GEO notes
"Best hotel in X for Y" is a heavily AI-answered query category; accurate amenity/price schema plus genuine review content (not aggregated scores alone) is what's citable.

## Sources
- Vacation rental structured data — https://developers.google.com/search/docs/appearance/structured-data/vacation-rental
- Hotel price structured data (Hotel Center) — https://developers.google.com/hotels/hotel-prices/structured-data/hotel-price-structured-data
- Event structured data (no trip packages, physical location) — https://developers.google.com/search/docs/appearance/structured-data/event
- Managing multi-regional sites — https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
