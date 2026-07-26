# V06 — Legal Services (YMYL)

**Applies to:** law firms, legal-information content sites, legal directories.

## Primary schema.org types
`LegalService` (a `LocalBusiness` subtype, see V03) for firm/practice pages; `Attorney`/`Person` with credentials for individual lawyer bios; `FAQPage` for common-question content (mind the 2023 eligibility restriction, `docs/08`).

## Vertical-specific priorities
- ✅ **YMYL E-E-A-T applies as strictly here as in healthcare** (`docs/09`): attorney bios need real bar admission/jurisdiction info, credentials, and years of practice — not just a headshot and a name.
- ✅ **Jurisdiction accuracy is a technical-SEO concern, not just a content one.** If the firm serves multiple states/regions, each practice-area × jurisdiction combination should have its own indexable page (not one generic page claiming to serve everywhere) — this is a Phase 1 routes-inventory decision as much as a content strategy.
- ⚠️ **Disclaimers must not block indexing.** A common bug: legal-disclaimer interstitials implemented as a JS gate that prevents the underlying content from being in the initial server-rendered HTML — this is the CSR trap (`docs/05`) with legal-specific packaging; the actual page content must still be crawlable.
- ✅ **Case results / testimonials must comply with the site's own bar-association advertising rules** *and* Google's structured-data policy of only marking up visible, genuine content (`docs/08`) — don't mark up aggregated or historical case data as a current `Review`.

## GEO notes
Same conservative-citation pattern as healthcare (V05) applies to legal YMYL content — entity authority and demonstrable credentials matter more here than technical polish alone.

## Sources
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- LegalService — https://schema.org/LegalService
