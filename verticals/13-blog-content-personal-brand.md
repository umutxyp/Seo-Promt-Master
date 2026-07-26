# V13 — Blog / Content Site / Personal Brand

**Applies to:** independent blogs, content marketing sites, personal/creator brand sites (not tied to a product or storefront).

## Primary schema.org types
`Article`/`BlogPosting` per post with `author` (`Person`, linked to a real bio), `datePublished`/`dateModified`, `image`; `Person` entity for the author/creator with `sameAs` to social profiles (`docs/08`, `docs/10`); `BreadcrumbList`; `ProfilePage`+`Person` for an author/about page.

## Vertical-specific priorities
- ✅ **This is the vertical where `docs/09`'s E-E-A-T section applies most directly and simply** — a real author byline, a substantive About page, and first-hand experience signals (original photos, direct testing, personal narrative) are the primary lever, more than any structured-data trick.
- ✅ **Internal linking discipline matters disproportionately here** — content sites without a product catalog or app to anchor navigation often under-link older posts; apply `docs/04`'s "every page you care about needs at least one internal link" rule deliberately (tag pages, related-posts modules, in-content links to older evergreen posts).
- ✅ **Tag/category archive pages are the faceted-navigation pattern** (`docs/03`) at content-site scale — thin, near-duplicate tag pages with little unique content are a common P2/P3 finding; either add genuine value (a real intro, curated ordering) or `noindex` low-value archive combinations.
- ⚠️ Comment sections are UGC — apply `docs/03`'s `rel="ugc"` rule to any links users post in comments.

## GEO notes
Personal-brand/blog content is exactly the kind of source ChatGPT-style engines favor when it's genuinely first-person and experience-driven (`docs/10`) — this is the vertical where "write for humans, not AI chunks" (`docs/09`) and GEO's extractable-structure guidance align most naturally, since a real personal voice with clear direct answers serves both audiences at once.

## Sources
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Article — https://schema.org/Article
