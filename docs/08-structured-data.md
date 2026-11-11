# 08 — Structured Data (JSON-LD / schema.org)

## Format

- ✅ Google supports **JSON-LD (recommended)**, Microdata, and RDFa — all treated equally when valid. Prefer **JSON-LD**: easiest to maintain, not interleaved with visible markup, and readable even when injected via JS. Place it in a `<script type="application/ld+json">` in `<head>` or `<body>`.

## Policies (mandatory — violations lose rich results or trigger manual actions)

- ✅ Structured data must reflect content **visible to users** on the page.
- ❌ Don't mark up hidden, irrelevant, misleading, or fake content (e.g. fake reviews).
- ❌ Don't create blank/empty pages just to hold markup.
- ✅ The page must **not** be blocked from Googlebot (robots.txt/noindex) if you want the markup used.
- ✅ A rich result requires **all documented required properties** for that type; images in structured data must be crawlable and relevant.
- ⚠️ Valid markup **does not guarantee** a rich result — display is algorithmic.

## Type cheat-sheet (pick what matches the page)

| Page type | Recommended schema |
|---|---|
| Any page | `WebPage` + `BreadcrumbList` |
| Home | + `WebSite` + `Organization` (add `sameAs` linking to Wikidata/LinkedIn/Crunchbase/official social profiles — the strongest entity-disambiguation signal for both classic knowledge-panel eligibility and GEO cross-engine entity resolution, `docs/10`) |
| Article / blog post | `Article` / `BlogPosting` / `NewsArticle` |
| Product / item with ratings | `Product` + `AggregateRating` + `Review`. **Merchant listings** require `name`, `image`, `offers` (the `Offer` requires `price` and `priceCurrency`; `availability` is recommended — keep it accurate anyway). **Product snippets** require `name` plus one of `review`, `aggregateRating` or `offers`. `aggregateRating` requires `ratingValue` and one of `ratingCount`/`reviewCount`; `bestRating`/`worstRating` are recommended (5 and 1 are assumed). Reviews must **genuinely exist on the page**; ❌ **don't aggregate reviews or ratings from other websites**, even with attribution; ❌ no fake or **undisclosed** incentivized reviews (a disclosed incentive is allowed, July 2026); use one way of indicating what is reviewed |
| Local business (physical location) | `LocalBusiness` (or a more specific subtype like `ProfessionalService`/`Restaurant` — prefer the specific subtype, it improves rich-result and AI entity-classification eligibility over generic `LocalBusiness`). Required: `name`, `address`; recommended: `url`, `telephone`, `geo`, `priceRange`, `openingHoursSpecification`. Keep name, address and phone **consistent** with the Google Business Profile. ⚠️ **No stars for self-serving reviews:** if the business controls the reviews about itself (its own testimonials, an embedded widget of its reviews), `LocalBusiness`/`Organization` pages are ineligible for the review-star feature |
| Listing / category | `ItemList` / `CollectionPage` |
| User / author profile | `ProfilePage` + `Person` |
| Forum thread | `DiscussionForumPosting` (2024+ recommended) or `QAPage` |
| FAQ (visible Q&A) | `FAQPage` — ❌ **the FAQ rich result is gone for every site** since **7 May 2026** (restricted to government and health sites from Aug 2023; documentation removed June 2026). The markup is still valid schema.org and harmless, but it earns no Google rich result — never sell it as a CTR lever |
| Downloadable app/tool | `SoftwareApplication` / `WebApplication` — the rich result requires `name`, `offers.price` (`0` if free) and `aggregateRating` or `review`; `applicationCategory` (a supported value such as `GameApplication`) and `operatingSystem` are recommended |
| Glossary / catalog of terms | `DefinedTermSet` + `DefinedTerm` |
| Video | `VideoObject` |
| How-to, recipe, event, etc. | matching type per Google's gallery — ⚠️ `HowTo` rich results were removed on desktop and mobile (Sept 2023). `Event` must take place in a **physical location** and be bookable by the public (online-event properties were removed in June 2025) |

- ⚠️ **Retired rich results — don't recommend them for Google:** sitelinks search box (`WebSite` + `SearchAction`, Nov 2024); FAQ (May 2026); HowTo (2023); Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement and Vehicle Listing (phased out by Sept 2025); Practice problem (Jan 2026); Dataset is used only by Dataset Search. (Book Actions was on the June 2025 list, but Google later removed its deprecation notice — check the gallery before advising either way.) The markup stays valid schema.org; it just earns nothing in Google Search.
- ⚠️ Don't invent types. `GameServer`, `Studio`, etc. are **not** real schema.org types and Google ignores them. Check https://schema.org before using a type.

## Validate

- Rich Results Test (dev), Rich result status reports (post-deploy), URL Inspection Tool.
- Business value: rich results measurably lift CTR (Google cites case studies of +20–80% CTR).

## Sources
- Intro to structured data — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Structured data general policies — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Search gallery (all types) — https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- Merchant listing / Product structured data — https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Review snippet policies — https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- Local Business structured data — https://developers.google.com/search/docs/appearance/structured-data/local-business
- Product snippet — https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Software app — https://developers.google.com/search/docs/appearance/structured-data/software-app
- Event (physical location, online properties removed) — https://developers.google.com/search/docs/appearance/structured-data/event
- Search documentation updates (FAQ, sitelinks search box, practice problem, review snippet changes) — https://developers.google.com/search/updates
- Simplifying the search results page (June 2025 retirements) — https://developers.google.com/search/blog/2025/06/simplifying-search-results
- Practice problem and dataset (Nov 2025) — https://developers.google.com/search/blog/2025/11/update-on-our-efforts
