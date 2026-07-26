# 11 — SEO Score & GEO Score (Scoring Rubric)

This doc turns every other `docs/` section into two **deterministic, out-of-100 scores** so "how good is this site's SEO/GEO" has a real, reproducible number instead of a vibe. Compute both at the end of Phase 3, and again at the end of Phase 4 (and Phase 5 if run) to show measurable improvement.

## Hard rules (read before scoring anything)

1. **No score without full coverage.** You may only report a **final** SEO Score / GEO Score once every `public-index` page from `ROUTES-INVENTORY.md` has a completed row in `SEO-AUDIT-PROGRESS.md`. If coverage is partial (sampling on a very large site), report a **provisional** score labeled `(provisional — N/M pages audited)` — never present a partial-coverage number as final.
2. **A P1 finding caps the page, points don't average it away.** If a page has **any** open P1 (crawl/index blocker, per `prompts/03`'s rubric), that page's SEO Score is capped at **60/100** regardless of how well it scores elsewhere — a blocker means the page may not be indexed at all, so polish elsewhere is close to irrelevant until it's fixed. Same rule for GEO: any P1-equivalent GEO blocker (page not server-rendered, AI crawlers not deliberately configured) caps that page's GEO Score at 60/100.
3. **Self-recheck before the score is final.** Before computing the final score, re-verify a random ~15% (minimum 3 pages) of everything already marked ✅ in `SEO-AUDIT-PROGRESS.md` by re-reading the actual rendered output (not your notes) — confirm the pass is real, not a copy-paste optimistic mark. If any spot-check fails, mark it, fix the finding, and expand the recheck sample before finalizing. This is the closest a single-agent workflow can get to adversarial verification — treat it as mandatory, not optional polish.
4. **Report the breakdown, not just the total.** Always show the per-category point table (below) alongside the final number — a bare "92/100" without a breakdown is not acceptable output; the user needs to see *which* category cost the points.
5. **Off-page factors are explicitly out of scope and must be said so.** Backlinks, domain authority, content quality/originality, and competitive rankings are not scored here (`docs/09`'s "durable takeaway": this is a technical-SEO and GEO-technical-readiness score, not a ranking guarantee). State this caveat every time you report a score.

## SEO Score (0–100, average across all `public-index` pages)

| Category | Points | Source | What earns full points |
|---|---:|---|---|
| Indexability & crawl foundation | 25 | `docs/01`, `docs/06` | Correct `index,follow` (no noindex+Disallow conflict), self-referential canonical, no redirect chains/loops, single consolidated HTTPS host (no live `www`/non-`www`/`http` duplicate), page present in an accurate sitemap |
| Rendering & mobile parity | 20 | `docs/05` | Primary content in initial server-rendered HTML, real 404s (no soft-404), mobile-rendered DOM matches desktop content |
| Structured data | 15 | `docs/08` | Baseline `WebPage`+`BreadcrumbList` present, type-appropriate schema for the page, `Organization`/`Person` entities carry `sameAs` |
| Metadata quality | 10 | `docs/01` | Unique, descriptive title + description (not boilerplate), complete OG/Twitter tags |
| Internationalization | 10 | `docs/02` | Bidirectional self-referential `hreflang` + `x-default`, valid ISO codes — **if the project is not multilingual, redistribute these 10 points into Metadata quality (→20 total)**, don't just drop them |
| Headings, semantics & links | 10 | `docs/03`, `docs/04` | One `<h1>`, semantic landmarks, crawlable internal links with descriptive anchors, real paginated `?page=n` links, correct UGC/sponsored `rel` |
| Images | 5 | `docs/07` | Descriptive `alt`, explicit `width`/`height`, correct eager/lazy split |
| Core Web Vitals | 5 | `docs/05` | LCP/CLS/INP scored "Good" — use **real CrUX/field-data values** if Phase 5 (or another live tool) provided them for that page; otherwise score from the source-code heuristics (eager LCP image, no unbatched long JS tasks, explicit image dimensions) and label this row `(heuristic, not measured)` since it is not the same thing as CrUX |

## GEO Score (0–100, one score per project — mostly domain-level, not per-page)

| Category | Points | Source | What earns full points |
|---|---:|---|---|
| AI crawler configuration | 20 | `docs/10` | `robots.txt` deliberately and explicitly addresses training vs. retrieval AI crawlers, per a stated project decision — not a silent template default |
| Extractable rendering | 20 | `docs/10`, `docs/05` | The same server-rendered-content requirement as the SEO Score's rendering category, re-scored here because AI crawlers generally don't execute JS either |
| Extractable content structure | 15 | `docs/10` | Key pages lead sections with a direct, self-contained, quotable answer; comparative/enumerable content uses lists or tables |
| Entity authority | 20 | `docs/08`, `docs/09`, `docs/10` | `Organization`/`Person` JSON-LD with `sameAs` to Wikidata/LinkedIn/Crunchbase/socials, a substantive About page, visible author bylines with credentials (E-E-A-T) |
| Classic-SEO prerequisite | 15 | `docs/10` | This is **the project's own SEO Score**, reused: AI Overviews cite overwhelmingly from pages that already rank organically, so GEO cannot outscore SEO by more than this weighting allows — set this row's points to `round(SEO Score × 0.15)` |
| No wasted/counterproductive GEO effort | 10 | `docs/10` | No `llms.txt`-as-fix, no other unsourced "AI SEO" tactic recommended or implemented that this repo's knowledge base doesn't back |

## Reporting format

```
## SEO Score: <N>/100 (<final|provisional — X/Y pages>)
| Category | Points | / Max |
|---|---:|---:|
...

## GEO Score: <N>/100 (<final|provisional>)
| Category | Points | / Max |
|---|---:|---:|
...

Caveat: these are technical SEO/GEO readiness scores, not a ranking or traffic guarantee — off-page factors (backlinks, content quality, competition) are out of scope.
```

Append this section to `SEO-AUDIT-PROGRESS.md`, recomputed at the end of Phase 3 (baseline), Phase 4 (post-fix), and Phase 5 (post-live-check, if run).
