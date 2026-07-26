# 01 — Meta & Head Tags

## `<title>`

- ✅ Write a **unique, descriptive, concise** title per page. Avoid vague labels like "Home" or "Profile".
- ✅ Include the brand concisely (start or end, separated by `-`, `:`, or `|`).
- ⚠️ **There is no character limit** on `<title>`. Google truncates the *title link* in results to fit the device width — "60 characters" is a practical target, not a rule.
- ⚠️ Google may generate the title link from **several sources**, not just `<title>`: the main visual heading, `<h1>`, `og:title`, anchor text of inbound links, and `WebSite` structured data. Changes require a recrawl (days–weeks).
- ❌ Don't keyword-stuff. Repeating words gives no benefit.

## Meta description

- ✅ **Unique per page.** Site-wide identical descriptions don't help.
- ✅ Summarize the specific page; programmatic generation is fine for large DB-driven sites if it stays human-readable and varied.
- ⚠️ **No character limit** — Google truncates the snippet to device width (~155–160 chars is a practical target).
- ⚠️ Google generates the snippet **mostly from page content** and uses your meta description only when it's a more accurate summary. It has **no direct ranking effect** — treat it as a suggestion.
- Snippet controls: `data-nosnippet` (exclude part), `max-snippet:[n]`, `nosnippet` (none).

## Open Graph / Twitter (social cards)

- Provide `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, and `twitter:card` (`summary_large_image`). Not a Google ranking factor, but essential for shares and click-through. Unlike `<title>`/description, OG text isn't truncated, so it can carry the fuller version.

## Robots meta / `X-Robots-Tag`

- ✅ Place `<meta name="robots" content="...">` in `<head>`. Names/values are case-insensitive.
- ✅ Use `X-Robots-Tag` HTTP header for the same directives on **non-HTML files** (PDF, images).
- **Directives:** `noindex`, `nofollow`, `nosnippet`, `max-snippet`, `max-image-preview`, `max-video-preview`, `notranslate`, `noimageindex`, `unavailable_after`.
- ⚠️ **The #1 gotcha:** robots directives are only obeyed **if the page can be crawled**. If you `Disallow` a URL in `robots.txt`, Google never sees the `noindex` — so it can still get indexed. **To keep a page out of the index, use `noindex` and *allow* crawling — do not `Disallow` it.**
- ⚠️ On conflicting rules, Google applies the **most restrictive**.

## Canonical

- ✅ Specify `rel="canonical"` for duplicate/near-duplicate pages; if you don't, Google picks one for you.
- ✅ Prefer declaring canonical in **HTML**. If injected via JS, it must equal the value in the original HTML.
- ❌ Don't use JS to point canonical at a **different** URL than the HTML.
- Pattern: pages reachable by multiple keys (id vs slug, case, tracking params) should canonicalize to **one** URL and 301/redirect the rest.

## HTTPS & host consolidation

- ✅ **HTTPS is a confirmed, lightweight ranking signal** — it functions as a tiebreaker between otherwise-comparable pages, not a major ranking driver on its own. Serve every page over HTTPS; there is no scenario where HTTP-only is correct for a public page in 2026.
- ✅ **Pick exactly one canonical host** (`https://example.com` vs `https://www.example.com`) and 301-redirect every other variant (`http://`, the other `www`/non-`www` form, trailing-slash inconsistencies) to it. This is the same canonicalization problem as duplicate URL keys above, just at the host level — audit it once per project, not per page.
- ❌ Don't leave both `www` and non-`www` (or both `http` and `https`) independently crawlable with no redirect — Google treats them as separate, competing duplicate URLs.

## Redirects

- ✅ Use **301** (permanent) for URLs that have moved for good — it passes ranking signals to the target and is what Google recrawls to update its index. Use **302** (temporary) only for genuinely short-lived redirects (A/B tests, temporary maintenance) — a 302 left in place for months is a common bug, not a valid long-term pattern.
- ❌ Avoid **redirect chains** (A → B → C) and **loops** (A → B → A); resolve every internal link and canonical directly to the final URL. Each extra hop adds crawl cost and risk of Google not following the whole chain.
- ✅ A redirected URL's **content should match the destination's intent** — don't redirect unrelated pages to the homepage as a catch-all; that's frequently treated as a soft-404.

## Sources
- SEO Starter Guide — https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Title links — https://developers.google.com/search/docs/appearance/title-link
- Snippets / meta description — https://developers.google.com/search/docs/appearance/snippet
- Robots meta / X-Robots-Tag — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Consolidate duplicate URLs — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- HTTPS as a ranking signal — https://developers.google.com/search/blog/2014/08/https-as-ranking-signal
