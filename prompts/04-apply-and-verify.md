# Phase 4 — Apply Fixes & Verify

**Goal:** work the backlog top-down, changing code safely and proving each fix.

## Loop (repeat until the backlog is empty)

1. **Pick the next item** (infra-first, then P1 → P2 → P3).
2. **Read before you edit.** Open the target file and the surrounding code; match the project's existing patterns, naming, and JSON-LD injection style. Reuse the central metadata helper — don't hand-roll a metadata object that drops canonical/hreflang.
3. **Make the smallest correct change.** One concern per edit. Preserve translations, styling, and SPA behavior.
4. **Verify — in this order, every time:**
   - **Typecheck** → **lint** → **build**. If any fail, fix before continuing.
   - **Observe the real output.** Grep the server-rendered HTML for the change (e.g. the JSON-LD `@type`, the `<a href="?page=2">`, the `<meta name="robots">`), or load the route and check. Static checks alone are not proof for render/indexability changes.
5. **Tick the item** in `SEO-AUDIT-PROGRESS.md` with a one-line note + evidence.

## Common fixes (recipes → see the cited doc)

- **CSR content invisible** → move the data fetch server-side and pass initial props (SSR/SSG/ISR). `docs/05`.
- **Pagination not crawlable** → render real `<a href="?page=n">` for prev/next; each page self-canonical; drop `rel=next/prev` reliance. `docs/03`.
- **Soft-404** → return a real 404 for missing entities, or `noindex` empty/placeholder pages. `docs/05`.
- **Internal search indexable** → `noindex` when a free-text search param is present (keep tag/sort/page indexable). `docs/03`.
- **UGC links** → `rel="ugc nofollow"` on user-generated links; `rel="sponsored"` on paid. `docs/03`.
- **Missing JSON-LD** → add the type-appropriate schema reflecting visible content; validate with the Rich Results Test. `docs/08`.
- **Duplicate tool/detail URLs** → set a cross-canonical to the primary URL. `docs/01`, `docs/02`.
- **`noindex` page also `Disallow`ed in `robots.txt`** → remove the `Disallow` (Google can never see a `noindex` it's blocked from crawling); keep only the meta/`X-Robots-Tag` `noindex`. `docs/01`.
- **Redirect chain (A → B → C) or A ↔ B loop** → repoint every internal link and canonical directly at the final URL; collapse the chain to a single 301. `docs/01`.
- **HTTP and/or both `www`/non-`www` hosts independently live** → pick one canonical host, 301 every other variant (protocol, `www`/non-`www`, trailing slash) to it at the server/edge level, and update internal links/canonicals to use it directly rather than relying on the redirect. `docs/01`.
- **Product page missing required schema fields, or marking up reviews not actually on the page** → add `name`/`image`/`offers`(price, priceCurrency, availability); only include `aggregateRating`/`review` if genuine reviews are rendered on the page, sourced without incentive. `docs/08`.
- **Missing baseline structured data** → every public page should emit at least `WebPage` + `BreadcrumbList`, independent of any type-specific schema. `docs/08`.
- **Sitemap** → cover exactly the `public-index` set; remove disallowed URLs; accurate `lastmod`. `docs/06`.
- **Images/CLS** → add `width`/`height`; eager+`fetchpriority=high` for LCP, `loading=lazy` below the fold. `docs/07`.
- **hreflang** → bidirectional, self-referential, `x-default`, valid ISO codes. `docs/02`.
- **Mobile content missing vs. desktop** → find what's conditionally hidden/omitted at mobile viewport (CSS `display:none` on breakpoint, a lighter mobile-only template) and put it back in the DOM; collapsed/accordion is fine, absent is not. `docs/05`.
- **AI crawlers not addressed in `robots.txt`** → add an explicit block once the project's training-vs-retrieval decision is made (see `docs/10`), e.g.:
  ```
  # Block training crawlers
  User-agent: GPTBot
  User-agent: Google-Extended
  User-agent: CCBot
  Disallow: /

  # Allow retrieval/answer-engine crawlers (remove if the project wants no AI-answer citations either)
  User-agent: OAI-SearchBot
  User-agent: PerplexityBot
  Allow: /
  ```
- **Missing entity `sameAs`** → add to the `Organization` (or `Person`) JSON-LD block, e.g.:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "…",
    "url": "https://example.com",
    "sameAs": [
      "https://www.wikidata.org/wiki/Q…",
      "https://www.linkedin.com/company/…",
      "https://www.crunchbase.com/organization/…"
    ]
  }
  ```
  `docs/08`, `docs/10`.

## Guardrails

- Don't chase rankings by removing content or keyword-stuffing. `docs/09`.
- Only mark up **visible** content in structured data. `docs/08`.
- Don't add AI-specific files (`llms.txt` etc.) expecting Google to use them — it doesn't. `docs/09`.
- If a "fix" would need a risky refactor for a non-ranking benefit, log it as a deliberate skip instead.

## Finish

When the backlog is empty and every "done" checkbox in `START.md` is satisfied, **recompute the SEO Score and GEO Score** (`docs/11`) and show the before/after delta next to the baseline from Phase 3 — this is the actual evidence the work moved the number, not just a list of edits. Print a **final summary table**: `page/area | change | verification evidence`. Note remaining deliberate skips. Report the passing typecheck/lint/build output.
