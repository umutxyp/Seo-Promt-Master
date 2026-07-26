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

2. **Live Core Web Vitals** (`docs/05`) — collect LCP, CLS, and INP (mobile at minimum,
   desktop too if the tool and budget allow) and score each against `docs/05`'s Good/Needs
   Improvement/Poor thresholds — these three are the only metrics with a scored threshold.
   Anything outside "Good" is a new P2/P3 finding. If the tool also reports **TTFB or FCP**,
   record the raw number for diagnostic context only (e.g. "high TTFB may explain a borderline
   LCP") — do **not** score them Good/Poor and do **not** file them as a standalone issue;
   `docs/05` does not define a pass/fail bar for either.

3. **Live sitemap** (`docs/06`) — confirm the page appears in the deployed sitemap with a
   plausible `lastmod`. Flag any `public-index` page missing from it, or any URL present that
   should be `noindex`/private.

4. **Site health** (once per domain) — `robots.txt` configuration, including whether AI
   crawlers are deliberately addressed per `docs/10`. Cross-check against
   `checklists/infrastructure-checklist.md`'s robots.txt section. **Out of scope for this
   check, record only if the tool surfaces it unprompted and never as an issue:** HTTPS
   enforcement, HSTS, or other security headers — they are not SEO ranking factors and this
   repo's knowledge base does not source them as such. Do not go looking for them.

5. **Prioritization context** (optional, once per domain) — if the tool exposes domain
   authority or backlink data, use it *only* to help order the Phase 3 backlog (e.g. fix a
   crawl-blocking bug on an already well-linked page before a cosmetic one elsewhere). This is
   a hard rule, not a suggestion: **never write domain authority or a backlink count into the
   Issues/findings list.** It has no row in `templates/live-signals.md`'s per-page table and no
   backlog entry of its own — if it changes your prioritization order, say so in prose next to
   the backlog, don't log the metric as a defect. Per `CONTRIBUTING.md` rule 3 (distinguish
   ranking factors from non-signals).

## Output — append to `SEO-AUDIT-PROGRESS.md`

Use `templates/live-signals.md`. File any new finding using the **exact same P1/P2/P3 bullet
format** Phase 3 already uses in `SEO-AUDIT-PROGRESS.md` (`prompts/03-prioritize-fixes.md`) —
append to that existing list, do not create a second, differently-formatted backlog.

This is the final phase. See "What done means" in `START.md`.
