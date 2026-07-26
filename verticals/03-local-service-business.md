# V03 — Local Service Business (single or multi-location)

**Applies to:** any business with a physical location or service area — clinics, salons, contractors, restaurants-as-a-business (see also V10 for food-delivery platforms), professional services.

## Primary schema.org types
`LocalBusiness` or, preferably, the **most specific subtype** available (`ProfessionalService`, `Restaurant`, `Dentist`, `Plumber`, etc. — schema.org has dozens of `LocalBusiness` subtypes; the more specific one improves rich-result and AI entity-classification eligibility over the generic type, per `docs/08`).

## Vertical-specific priorities
- ✅ **NAP consistency is the core requirement, not an optional nicety.** Name/Address/Phone in the schema must match the Google Business Profile listing **character-for-character** (same abbreviations, punctuation, formatting) — a mismatch actively undermines trust signals rather than being neutral. `docs/08`.
- ✅ **One page per location** for multi-location businesses, each with its own `LocalBusiness` instance, `address`, `geo`, and `openingHours` — don't use a single generic "locations" page with a client-side map as the only surface (CSR trap, `docs/05`).
- ✅ **`sameAs`** should include the Google Business Profile URL, Yelp, Facebook, and other verified local-directory profiles — this is the local-SEO equivalent of the entity-authority work in `docs/10`.
- ✅ Reviews embedded on-site must be **real reviews actually on the page** — same rule as `docs/08`'s Product/Review policy; don't mark up third-party review aggregator data as if it were on-page content.

## GEO notes
"Best `<service>` near me" queries increasingly get answered by AI engines cross-referencing Google Business Profile + on-site schema + third-party directories — NAP consistency and `sameAs` matter as much for GEO citation as for the classic local pack.

## Sources
- Local Business structured data — https://developers.google.com/search/docs/appearance/structured-data/local-business
