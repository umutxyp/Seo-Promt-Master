# V23 — Minecraft Server Lists / Game Server Directories

**Applies to:** a platform that lists, ranks, and shows live stats for many third-party game servers (e.g. an mcstat.org-type Minecraft server list/stats tracker), not a single game server's own promotional page. This is structurally a **directory (V16) crossed with live-data aggregation** — treat both patterns as applying together.

## Primary schema.org types
⚠️ **`GameServer` is not a real schema.org type — Google ignores invented types like this** (already flagged in `docs/08`). Use standard types instead: `WebPage`+`BreadcrumbList` baseline per server page; `ItemList`/`CollectionPage` for ranked/category listing pages; `Organization` for the platform itself; if a server has a genuine web presence, `sameAs` can point to it, but don't invent a game-specific schema type that doesn't exist.

## Vertical-specific priorities
- ✅ **Per-server pages need genuine, differentiated content, not just a live player-count widget** — this is V16/V15's thin-content problem in its purest form: a page that's only "Server Name, IP, live player count" is exactly the kind of thin, auto-generated content Google's helpful-content systems target (`docs/09`). Add real description content, game-mode/version detail, and (where available) genuine server-submitted descriptions to earn indexability, not just aggregate telemetry.
- ✅ **Live player-count/status widgets are the CSR trap by default** — a live-updating count is inherently a client-side/polling pattern, but the server's *static* descriptive content (name, description, IP, version, tags, submitted date) must still be in the initial server-rendered HTML independent of whether the live widget has finished polling (`docs/05`). Don't let "live data" become an excuse for the whole page being CSR-only.
- ✅ **Category/version/game-mode filters are the faceted-navigation pattern at directory scale** (`docs/03`/V16) — "survival servers," "skyblock 1.21," "crossplay" filter combinations need the same crawl-budget discipline as e-commerce/marketplace filters, especially since server lists tend to have very large combinatorial filter spaces.
- ✅ **Off-page reality of this niche:** legitimate server-list submission across multiple directories functions as backlinks for the *listed servers*, not for the directory itself — if the platform is the directory (this vertical), the SEO lever is the reverse: being one of the trusted, high-quality destinations server owners submit to, which comes from exactly the differentiated-content and freshness work above, not from being submitted elsewhere.
- ✅ **International reach**: this niche often serves a genuinely global player base across many locales (this repo's own reference deployment, mcstat.org, runs 40 locales) — apply the full `docs/02` hreflang/URL-strategy discipline properly rather than a token language switcher; at this scale, i18n technical correctness (bidirectional hreflang, locale URL structure) is as high-value a fix category as anything content-related.
- ✅ **Vote/ranking manipulation risk**: if the platform has a voting or ranking mechanism (common in this niche), keep it clearly separate from any Google-facing signal — don't let internal vote counts leak into structured data as if they were a `Review`/`AggregateRating`, since they aren't genuine user reviews of the *platform's* content (`docs/08`).

## GEO notes
"Best Minecraft [gamemode] servers 2026" is a heavily AI-answered query pattern; genuinely differentiated per-server descriptions (not templated telemetry-only pages) plus accurate, current data (a stale "500 online" count on a dead server is worse for GEO citability than for classic SEO, since AI engines have zero tolerance for citing dead/inaccurate results) are what separate a citable listing from noise.

## Sources
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Managing multi-regional sites — https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Faceted navigation — https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
