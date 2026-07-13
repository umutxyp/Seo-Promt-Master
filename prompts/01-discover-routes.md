# Phase 1 — Discover & Classify Every Route

**Goal:** a complete, classified inventory of every route. Missing a route here means missing it everywhere downstream, so be exhaustive.

## Do this

1. **Enumerate every route.** Walk the routing source — file-based route folders, route config, controllers, or the sitemap if one already exists. Include dynamic routes (`[slug]`, `:id`, `*`) as patterns. Don't forget: home, listing pages, detail pages, tool pages, auth pages, legal pages, and API endpoints.

2. **Classify each route** into exactly one bucket:

   | Bucket | Meaning | robots | In sitemap? |
   |---|---|---|---|
   | `public-index` | Real content users search for | `index,follow` | ✅ yes |
   | `public-noindex` | Reachable but shouldn't rank: internal **search results**, live **tools** with unbounded inputs, **auth** screens, thank-you/confirmation, print views | `noindex,follow` | ❌ no |
   | `private` | Dashboards, admin, account settings, API | blocked in robots.txt + auth-gated | ❌ no |

3. **Flag mismatches — this is the high-value part.** For each route, check whether its *current* state matches its *correct* bucket:
   - A feature/tool page that is **public in intent** but is `noindex` or `Disallow`-ed by mistake → should become `public-index`.
   - A thin internal **search-result** URL (`?q=`, `?search=`) that is currently indexable → should become `public-noindex`.
   - A **private** route that appears in the sitemap or lacks a robots block → fix.
   - A dynamic detail route that returns **200 for non-existent entities** (soft-404) → should `notFound()`/404 or `noindex`.

4. **For dynamic routes, note the canonical-URL risk.** Multiple keys resolving to one entity (id vs slug vs uuid, case variations, trailing params) need a single canonical + redirect. Record it.

## Output — `ROUTES-INVENTORY.md`

Use `templates/routes-inventory.md`. One row per route:

`route pattern | bucket (current → correct) | rendering | notes/mismatch`

Group by section (marketing, listings, detail, tools, auth, legal, private). End with a **"Mismatches to fix"** shortlist — these feed Phase 3 as likely P1/P2 items.

Then proceed to **Phase 2** (`prompts/02-audit-page.md`).
