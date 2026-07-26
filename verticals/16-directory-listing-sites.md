# V16 — Directory & Listing Sites (General)

**Applies to:** general-purpose directories aggregating entities of one kind (businesses, tools, resources, links) that are not themselves a transaction marketplace (see V15) — e.g. "best X tools" directories, city/niche business directories, resource link-lists.

## Primary schema.org types
`ItemList`/`CollectionPage` for the directory listing pages; `WebPage`+`BreadcrumbList` baseline on every entry; the type-appropriate schema for whatever entity each entry actually represents (a `LocalBusiness` for a business directory, `SoftwareApplication` for a tools directory, etc. — don't force a generic type when a more specific one from `docs/08`'s cheat-sheet fits).

## Vertical-specific priorities
- ✅ **Every entry page needs to earn its own index-worthiness**, same principle as V15: a directory entry that's just a name, a link, and a one-line auto-generated description is thin content — add genuine editorial value (why it's included, a real evaluation, category context) or consolidate low-value entries rather than indexing thousands of near-empty pages.
- ✅ **Outbound links to listed entities are exactly `docs/03`'s UGC/qualify-outbound-links territory** if entries are user-submitted (`rel="ugc"`), or can be plain followed links if editorially curated and vetted — decide deliberately, don't default to unqualified links at scale.
- ✅ **Category/filter pages** (by location, by type, by rating) are the faceted-navigation pattern (`docs/03`) — apply the same crawl-budget discipline as e-commerce/marketplace filters.
- ✅ Directories that double as backlink sources (submission-based listings) should be honest with themselves about their content's actual uniqueness — see `docs/09`'s "Site Reputation Abuse" note if any part of the directory hosts third-party content it doesn't meaningfully curate or vouch for.

## GEO notes
"Best X tools/services" queries are heavily AI-answered by pulling from exactly this kind of curated directory content — genuine, differentiated per-entry evaluation (not templated boilerplate) is what makes a directory citable versus indistinguishable from a hundred similar low-effort lists.

## Sources
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Qualify outbound links — https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
