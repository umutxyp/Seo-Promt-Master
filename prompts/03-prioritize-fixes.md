# Phase 3 — Prioritize Into One Backlog

**Goal:** collapse all per-page findings into a single, ordered backlog so fixing is mechanical.

## Priority rubric

- **P1 — Crawl / index blockers** (fix first). Things that make content invisible or actively wrong:
  - Content is CSR-only / not in server HTML.
  - Pagination not crawlable → pages 2..N undiscoverable.
  - Soft-404 (200 for missing entities) / unbounded indexable URL space.
  - `noindex` or `robots.txt Disallow` on a page that should rank; or a page that should be `noindex` is indexable (internal search results).
  - UGC links missing `rel="ugc"`/`nofollow`.
  - Missing/duplicated `<title>`; broken canonical/hreflang.

- **P2 — Structured data, dedup, and correctness:**
  - Missing type-appropriate JSON-LD (or invalid/nonexistent schema types).
  - Duplicate content without a cross-canonical.
  - Sitemap gaps or sitemap listing disallowed URLs.
  - Missing `ItemList`/`BreadcrumbList` on lists.

- **P3 — Hygiene & Core Web Vitals polish:**
  - Missing `width`/`height` on images (CLS); lazy/eager mistakes.
  - Heading-order skips (a11y).
  - Type refinements (AboutPage/ContactPage/etc.).

## Sequencing rule (important)

**Fix shared infrastructure before per-page items.** A change to the central metadata helper, the sitemap generator, the robots file, the i18n/hreflang builder, or a shared pagination component often resolves the same issue across dozens of pages at once. Order the backlog: **infrastructure P1 → page P1 → infrastructure P2 → page P2 → P3.**

## Deliberate skips

If you choose **not** to fix something, record it with a reason tied to `docs/` (e.g. "heading-order skip — `docs/04`: order does not affect ranking; shared-component churn risk outweighs a11y-only benefit"). Silent omissions are not allowed.

## Output

A single ordered checklist at the top of `SEO-AUDIT-PROGRESS.md` (`- [ ]` items, grouped P1/P2/P3, infra-first). Then proceed to **Phase 4** (`prompts/04-apply-and-verify.md`).
