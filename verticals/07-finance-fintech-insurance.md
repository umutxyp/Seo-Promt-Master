# V07 — Finance / Fintech / Insurance (YMYL)

**Applies to:** banks, fintech apps, insurance comparison sites, investment/financial-advice content.

## Primary schema.org types
`FinancialService`/`BankOrCreditUnion`/`InsuranceAgency` (`LocalBusiness` subtypes) for institutional pages; `Product`+`Offer` for comparable financial products (e.g. insurance plans, cards) **only where the "price"/rate genuinely reflects what's on the page** — rate/APR data goes stale fast and stale `Offer` data here is both a Google structured-data-policy violation (`docs/08`) and a user-trust failure.

## Vertical-specific priorities
- ✅ **Rate/fee/APR freshness is the #1 P1-class issue in this vertical.** Any page quoting a rate or fee needs a visible last-verified date and a process to keep it current — this is `docs/09`'s "helpful content" bar applied at maximum strictness, since outdated financial numbers are actively misleading.
- ✅ **Author/reviewer credentials matter more here than in almost any other vertical** — a "reviewed by a licensed financial advisor / CFA / actuary" byline with real credentials is the E-E-A-T baseline for anything beyond pure product pages (`docs/09`).
- ✅ **Comparison/calculator tools must be server-rendered enough to be indexable** if the underlying comparison data itself is meant to rank (not just the shell UI) — apply the CSR-trap check from `docs/05` specifically to the results/output state, not just the initial empty form.
- ⚠️ Disclosure/disclaimer text (rates subject to change, not financial advice, etc.) must be **visible on the page**, not just in a modal that never renders in the initial HTML — same rendering-parity concern as V06's legal disclaimers.

## GEO notes
Financial YMYL content faces the same conservative AI-citation bar as healthcare/legal — freshness and credentialed authorship are the two levers that matter most for both classic ranking and GEO citation here.

## Sources
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Structured data general policies — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
