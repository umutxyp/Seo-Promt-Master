# V02 — SaaS / B2B Software

**Applies to:** subscription software products, developer tools, B2B platforms with a marketing site + app.

## Primary schema.org types
`SoftwareApplication` (set `applicationCategory` e.g. `BusinessApplication`/`DeveloperApplication`, `operatingSystem` e.g. `Web`) on the product page; `Organization` with `sameAs`; `FAQPage` on pricing/help pages (mind the 2023 rich-result eligibility restriction, `docs/08`); `Review`/`AggregateRating` only if genuine reviews (e.g. embedded from G2/Capterra with real attribution) render on the page.

## Vertical-specific priorities
- ✅ **One landing page per feature/use-case, not one generic homepage.** "Automated invoicing software," "client portal software for agencies" etc. each deserve their own indexable, internally-linked page — this is the single highest-leverage content-structure decision for SaaS SEO, and it's a Phase 1/routes-inventory concern (are these feature pages even discoverable/public-index?), not just a content one.
- ✅ **Docs/help-center subdomain or subdirectory** — if docs live on a separate subdomain, treat it as its own site for canonical/hreflang/sitemap purposes (`docs/01`, `docs/06`); don't let it silently fall outside the sitemap coverage audit.
- ⚠️ **Pricing page must render server-side** — this is one of the highest-intent, highest-traffic pages on a SaaS site and is frequently built as a CSR-only interactive calculator, which is exactly the CSR trap in `docs/05`.
- ✅ App Store / Play Store listing pages (if a companion mobile app exists) are a separate surface — see `verticals/17-mobile-app-landing-pages.md`, don't conflate them with the web marketing site's audit.

## GEO notes
"Software recommendation" queries are now heavily answered by AI engines pulling from `SoftwareApplication` structured data plus third-party review sites — per `docs/10`, entity `sameAs` linking to G2/Capterra/Product Hunt listings materially helps cross-engine resolution here, more than in most other verticals.

## Sources
- SoftwareApplication — https://schema.org/SoftwareApplication
- Structured data general policies — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
