# Phase 5 — Live Signals (Optional)

**Goal:** cross-check the Phase 2 findings against production, using an MCP-connected SEO
data tool, for the three things a source-code audit cannot see: real Core Web Vitals, whether
the deployed page matches what the source implies, and whether the live sitemap matches the
route inventory.

> This phase is optional. It requires a live public URL and a connected MCP SEO tool. If
> either is missing, skip it and say so — do not guess at production behavior from source code.

## 0. Applicability check

Confirm both before continuing:
- A live, publicly reachable URL exists for this project (not localhost, not
  staging-behind-auth).
- An MCP-connected SEO data tool is available in this session — check your assistant's
  connected MCP tools for domain-level SEO signals (page performance/CWV, live page-SEO
  scrape, sitemap, site health). [RankParse](https://rankparse.com/docs/mcp) (MCP server at
  `https://mcp.rankparse.com/mcp`) is the reference implementation; any MCP server exposing
  equivalent tools works.

If either is false, write one line in `SEO-AUDIT-PROGRESS.md` stating which condition was
missing, and stop here.

## Sampling

Live data is rate-limited and often billed per call — do not query every route. Sample the
homepage plus up to 5 more `public-index` pages from `ROUTES-INVENTORY.md`, one per major
route pattern (and one per locale if the site is multilingual). State the sample size and
which pages you picked in the output.

## The checks (run per sampled page, unless noted "once per domain")

1. **Live page-SEO scrape** (`docs/01`) — fetch the deployed URL's title, description,
   canonical, robots meta, and JSON-LD. Diff against the Phase 2 findings for that route in
   `SEO-AUDIT-PROGRESS.md`. A mismatch is a new finding — note the likely cause (redirect
   chain, CDN/edge rewrite, environment-specific config, middleware stripping something).
2. **Live Core Web Vitals** (`docs/05`) — LCP, CLS, INP, and TTFB (mobile at minimum,
   desktop too if the tool and budget allow). Compare against `docs/05`'s thresholds. Anything
   outside "Good" is a new P2/P3 finding. If the tool also reports FCP, note it for reference
   only — `docs/05` does not document a "Good" threshold for FCP.
3. **Live sitemap** (`docs/06`) — confirm the page appears in the deployed sitemap with a
   plausible `lastmod`. Flag any `public-index` page missing from it, or any URL present that
   should be `noindex`/private.
4. **Site health** (once per domain) — `robots.txt` configuration. Cross-check against
   `checklists/infrastructure-checklist.md`'s robots.txt section. If the tool also reports
   HTTPS enforcement, HSTS, or other security headers, note them as operational hygiene
   only — they are not SEO ranking factors and are not sourced as such in this repo's
   knowledge base.
5. **Prioritization context** (optional, once per domain) — if the tool exposes domain
   authority or backlink data, use it only to help order the Phase 3 backlog (e.g. fix a
   crawl-blocking bug on an already well-linked page before a cosmetic one elsewhere). Never
   log domain authority or backlink counts as an "issue" to fix — they aren't ranking-factor
   defects, per `CONTRIBUTING.md` rule 3 (distinguish ranking factors from non-signals).

## Output — append to `SEO-AUDIT-PROGRESS.md`

Use `templates/live-signals.md`. File any new finding into the **existing** Phase 3 P1/P2/P3
backlog (`prompts/03-prioritize-fixes.md`'s format) — do not create a second priority list.

This is the final phase. See "What done means" in `START.md`.
