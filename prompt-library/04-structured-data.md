# 04 — Structured data

JSON-LD that's valid, honest and type-appropriate. The rule behind every prompt here: **mark up only what's visible on the page.** Markup that describes things the user can't see is the fastest route to a manual action.

---

### Generate JSON-LD for a page type

**Use when:** a page has no structured data, or it has the wrong type.

```text
Act as a schema.org and Google structured-data expert. Generate JSON-LD for this page.
Page type: {{home | article | product | category/list | profile | local business | forum thread | software/app | video | event}}
Visible content (paste the real fields): {{title, author, date, price, rating count, address…}}

Rules:
- baseline on every page: WebPage + BreadcrumbList. Add the type-specific node on top, combined in one @graph with @id references.
- include every property Google documents as required for that type, and the recommended ones where the data exists
- ONLY data that's visible on the page. No invented ratings, no reviews from elsewhere, no hidden FAQs.
- real schema.org types only (no made-up types such as "GameServer")
- FAQPage and HowTo are valid markup, but the FAQ rich result is limited to government and health sites, and the HowTo rich result is gone. Don't promise a rich result for either.
Return the JSON-LD, the server-side code that injects it for {{framework}} (escape the output safely), and how to validate it (Rich Results Test plus the schema.org validator).
```

### Validate existing JSON-LD

**Use when:** Search Console's Enhancements report shows errors, or the markup was written long ago.

```text
Validate this JSON-LD against Google's structured-data guidelines and schema.org:
1. Does it parse? Is @context present? Does every node have an @type?
2. Are the required and recommended properties present for each type Google supports here?
3. Does each value match what's VISIBLE on the page? I'll paste the visible text below.
4. Policy problems: aggregateRating with no real ratings, self-serving reviews, incentivized reviews, markup describing content that isn't on the page.
5. Duplicate or conflicting nodes (for example, two Organization nodes with different names).
Return each issue (severity, why, fix) and a corrected block.

JSON-LD:
{{paste}}
Visible page text:
{{paste}}
```

### Build the Organization / Person entity

**Use when:** improving entity authority for knowledge panels and AI answer engines (one of the highest-leverage GEO actions).

```text
Act as an entity-SEO specialist. Build the site-wide entity for {{organization or person name}}.
- Organization (or the most specific subtype: LocalBusiness, NewsMediaOrganization, Corporation…) or Person
- name exactly as used everywhere; url; logo; description; foundingDate / address / contactPoint where they apply
- sameAs: ONLY profiles we control, consistently named. Mine: {{Wikidata, LinkedIn, GitHub, X, YouTube, Crunchbase…}}
- WebSite node (with SearchAction if the site has search), linked by @id
- for authors: a Person node with jobTitle, sameAs and worksFor, used in every Article's author field
Also list where the name, logo and description must be made consistent off-site (profiles, directories), because AI engines check consistency across the open web.
```

### Check Product / merchant markup

**Use when:** e-commerce or marketplace product pages.

```text
Audit the Product markup on these pages: {{URLs or paste JSON-LD}}
Check: name, image, and offers (price, priceCurrency, availability kept in sync with real stock). If there's no offers, the markup needs review or aggregateRating instead.
Ratings: aggregateRating only when genuine reviews are rendered on the page (ratingValue, ratingCount/reviewCount, bestRating). Is the review count high enough for stars to appear? Never mark up incentivized reviews.
Variants: is one canonical pattern used site-wide?
Out of stock: availability must be accurate, and the page must not soft-404.
Return the issues and a corrected template.
```
