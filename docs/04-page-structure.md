# 04 — On-Page Structure

## Headings

- ✅ One clear `<h1>` describing the page; use `<h2>`/`<h3>` for a logical outline.
- ⚠️ **Heading order (H1→H6) does not affect Google rankings.** Sequential order benefits accessibility/screen readers only. There is no mandatory min/max heading count. Fix skips for a11y, but don't treat it as an SEO priority.

## Semantic HTML

- ✅ Use landmarks: `<main>`, `<nav>`, `<article>` (per post/item), `<section>`, `<time datetime>` for dates. Helps machines (and users) understand structure.

## Internal linking (a Google 2024 emphasis)

- ✅ **Every page you care about should have at least one internal link** pointing to it — this is how Google discovers and weighs pages.
- ✅ In the 2024 Starter Guide refresh, Google removed the standalone "navigation" section and emphasized **aggressively linking your important URLs**.
- ✅ A link is only crawlable when it's an `<a>` element with a resolvable `href`. ❌ `onclick`/JS-only or href-less "links" are not reliably crawled.
- ✅ **Descriptive anchor text** that describes the destination — not "click here". For image links, Google uses the `alt` as anchor text.

## Sources
- SEO Starter Guide — https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Crawlable links — https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Starter Guide 2024 refresh — https://developers.google.com/search/blog/2024/02/ssg-gets-a-makeover
