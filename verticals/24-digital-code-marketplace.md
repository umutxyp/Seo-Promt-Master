# V24 — Digital Product / Code Marketplace

**Applies to:** platforms selling downloadable/licensed digital goods — source code, scripts, templates, plugins, themes, digital assets (e.g. a Codeshare.me-type marketplace). Structurally V01 (e-commerce) + V15 (marketplace) combined, with licensing/preview-specific concerns layered on top.

## Primary schema.org types
`Product`+`Offer` per listing (`docs/08`, `docs/01`) — `price`/`priceCurrency`/`availability` as in any e-commerce PDP; `SoftwareApplication` is often *also* appropriate alongside `Product` when the item is genuinely software (a script/plugin/theme), giving both the commerce and software-discovery surfaces; `Person`/`Organization` for the seller/author with `sameAs`; `AggregateRating`/`Review` only from genuine, on-page buyer reviews.

## Vertical-specific priorities
- ✅ **Live preview/demo links must be crawlable and functional** — a listing's single biggest trust-and-conversion lever (beyond price) is a working live demo; if the demo is only reachable via a JS-triggered modal with no real `<a href>`, apply `docs/04`'s crawlable-link rule, and make sure the demo URL itself doesn't silently rot (dead demo links are both a UX failure and, at scale, a quality signal).
- ✅ **Screenshots/preview images need real `<img>` markup with descriptive alt** (`docs/07`) — a common shortcut in this vertical is a single carousel image sprite or canvas-rendered preview that isn't a real indexable image; each preview screenshot should be its own crawlable image.
- ✅ **Versioning and update freshness matter for both trust and ranking** — a listing whose "last updated" date is stale for years (common with abandoned marketplace items) reads as a quality/reliability signal problem; if `dateModified` or an equivalent is marked up, keep it honest (`docs/08`'s policy against fabricated data applies to freshness claims too).
- ✅ **License terms must be genuinely visible on the page**, not just in a downloaded ZIP's readme — a buyer (and Google's structured-data policy of "only mark up visible content," `docs/08`) both need the license type (regular/extended, single-use/multi-use, etc.) stated in the actual page content.
- ✅ **Category/tag taxonomy is the faceted-navigation problem** (`docs/03`/V01/V15) at marketplace scale — "PHP scripts," "WordPress plugins," "Discord bot templates" filter combinations need the same crawl-budget and thin-page discipline as any large catalog.
- ✅ **Thin auto-listed items are V15's core risk here too** — a listing with only a title, price, and one screenshot is thin content; require a genuine description (what it does, tech stack, requirements) before a listing is `public-index`-eligible, same principle as Phase 1's classification discipline (`prompts/01`).
- ✅ **Support/documentation pages for each product** (setup guides, changelogs) are exactly V02's per-feature-page pattern — a well-documented product with its own indexable docs page outperforms one with only a bare listing.

## GEO notes
"Best [type] script/plugin for X" is an AI-answerable pattern that draws on genuine differentiation (real feature descriptions, working demos, verified reviews) exactly as in V01/V15 — a marketplace whose listings are richly, honestly described (not templated) is what an AI engine can actually cite versus a wall of near-identical thin listings.

## Sources
- Merchant listing / Product structured data — https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
