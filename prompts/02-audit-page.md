# Phase 2 — Audit Each Public Page (9-Point Check)

**Goal:** for **every** `public-index` route from `ROUTES-INVENTORY.md`, produce a concrete, cited findings list. Do not stop until every page has a row in `SEO-AUDIT-PROGRESS.md`.

> Tip: if the project is large, audit in parallel batches by section, but keep one authoritative progress file. Never silently cap coverage — if you sample, say so.

## The 9-point audit (run all 9 per page)

For each page, read the route file **and** its main component/template, then evaluate:

1. **Metadata** (`docs/01`) — Unique, descriptive `<title>` and meta `description`? Generated per-page (not boilerplate)? For dynamic pages, built from the entity? Open Graph + Twitter card present?

2. **Canonical + hreflang** (`docs/01`, `docs/02`) — Self-referential canonical to the page's own URL? If multilingual: bidirectional, self-referential `hreflang` set + `x-default`, valid ISO codes? Any duplicate-URL variant that needs canonicalizing?

3. **Robots** (`docs/01`) — `index,follow` for real content. Is `noindex` (correctly) used only for the `public-noindex` bucket? Remember: a `robots.txt` `Disallow` **prevents Google from seeing a `noindex`** — never combine them for the same URL.

4. **Structured data / JSON-LD** (`docs/08`) — Which schema.org types are emitted? Is there a type-appropriate one (Article/BlogPosting, Product+AggregateRating, ItemList/CollectionPage for lists, ProfilePage+Person, DiscussionForumPosting for forums, FAQPage, SoftwareApplication, BreadcrumbList)? Does it reflect **only visible content**? JSON-LD (not Microdata) preferred.

5. **Headings & semantics** (`docs/04`) — Exactly one `<h1>`? Logical heading outline? Semantic landmarks (`main`, `nav`, `article`, `section`)? (Heading *order* is a11y, not ranking — note but don't over-prioritize.)

6. **Images** (`docs/07`) — Descriptive `alt`? Explicit `width`/`height` (CLS)? Is the LCP/hero image an eager `<img src>` (not `data-src`, not `loading="lazy"`), and below-fold images lazy? Real `<img>` (indexable) vs CSS background (not)?

7. **Internal links** (`docs/03`, `docs/04`) — Real crawlable `<a href>` (not button/onclick/JS-only)? Descriptive anchor text? Every important page linked from somewhere? **Pagination** uses real `?page=n` links with self-canonical per page (not "load more"-only, not canonicalize-all-to-page-1)? UGC/forum links carry `rel="ugc"`, ads `rel="sponsored"`?

8. **Rendering** (`docs/05`) — Is the primary content in the **initial server-rendered HTML** (SSR/SSG/ISR), or client-only (CSR → empty HTML → invisible to crawlers)? Meaningful HTTP status codes (real 404 for missing, no soft-404)?

9. **Sitemap** (`docs/06`) — Is the page in the XML sitemap with an accurate `lastmod`? (Google ignores `priority`/`changefreq`.)

## Output — append to `SEO-AUDIT-PROGRESS.md`

Use `templates/audit-progress.md`. Per page: status per check + a bulleted **Issues (P1/P2/P3)** list + concrete **Recommended fixes** (file-specific). Cite the `docs/` section for each issue.

Then proceed to **Phase 3** (`prompts/03-prioritize-fixes.md`).
