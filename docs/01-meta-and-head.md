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
- ⚠️ **Snippet controls also govern AI answers.** Google applies `nosnippet`, `max-snippet` and `data-nosnippet` to AI Overviews and AI Mode, and Bing has honoured `data-nosnippet` for its snippets and Copilot answers since October 2025. A template-wide `nosnippet` makes a page unquotable in AI answers (`docs/10`). Site-wide, Search Console also has a **Search generative AI control** for inclusion in AI Overviews and AI Mode.
- ✅ **"Read more" deep links** (links inside a snippet to a section of the page) need that section to be **immediately visible** — not behind tabs or an expandable block — and the page must not use JavaScript to force the scroll position on load or strip the URL's `#fragment`.

## Open Graph / Twitter (social cards)

- Provide `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, and `twitter:card` (`summary_large_image`). Not a Google ranking factor, but essential for shares and click-through.
- ✅ **`og:image` also feeds Google's result thumbnail.** Google lists `og:image` (with schema.org `primaryImageOfPage` or the main entity's `image`) as a way to state the preferred image for Search and Discover. Point it at a representative content image — not a logo, not an image full of text, not an extreme aspect ratio (`docs/07`).

## Robots meta / `X-Robots-Tag`

- ✅ Place `<meta name="robots" content="...">` in `<head>`. Names/values are case-insensitive.
- ⚠️ **Google also obeys a robots meta tag in `<body>`.** It doesn't enforce head placement, so a `noindex` injected into the body — by user content, a widget or a sanitizer gap — still deindexes the page.
- ✅ Use `X-Robots-Tag` HTTP header for the same directives on **non-HTML files** (PDF, images).
- **Directives:** `noindex`, `nofollow`, `none` (= both), `nosnippet`, `max-snippet`, `max-image-preview`, `max-video-preview`, `notranslate`, `noimageindex`, `unavailable_after`, `indexifembedded` (full list in `docs/13`). `noarchive` is no longer used by Google Search — but Bing still uses it for Copilot answers (`docs/18`).
- ⚠️ **Don't rely on JavaScript to remove a `noindex`.** When Google sees `noindex` in the served HTML it may skip rendering, so a script that later removes or changes it may never run for Google.
- ⚠️ **The #1 gotcha:** robots directives are only obeyed **if the page can be crawled**. If you `Disallow` a URL in `robots.txt`, Google never sees the `noindex` — so it can still get indexed. **To keep a page out of the index, use `noindex` and *allow* crawling — do not `Disallow` it.**
- ⚠️ On conflicting rules, Google applies the **most restrictive**.

## Canonical

- ✅ Specify `rel="canonical"` for duplicate/near-duplicate pages; if you don't, Google picks one for you.
- ✅ Prefer declaring canonical in **HTML**. If injected via JS, it must equal the value in the original HTML.
- ✅ If you can't set it in the HTML at all, **leave it out of the HTML** and set it only with JavaScript, so the rendered page has exactly one canonical.
- ❌ Don't use JS to point canonical at a **different** URL than the HTML.
- Pattern: pages reachable by multiple keys (id vs slug, case, tracking params) should canonicalize to **one** URL and 301/redirect the rest.

## HTTPS & host consolidation

- ✅ **HTTPS is a confirmed, lightweight ranking signal** — Google called it "very lightweight", affecting fewer than 1% of queries when it launched; not a major ranking driver on its own. Serve every page over HTTPS; there is no scenario where HTTP-only is correct for a public page in 2026.
- ✅ **Pick exactly one canonical host** (`https://example.com` vs `https://www.example.com`) and 301-redirect every other variant (`http://`, the other `www`/non-`www` form, trailing-slash inconsistencies) to it. This is the same canonicalization problem as duplicate URL keys above, just at the host level — audit it once per project, not per page.
- ❌ Don't leave both `www` and non-`www` (or both `http` and `https`) independently crawlable with no redirect — Google treats them as separate, competing duplicate URLs.

## Redirects

- ✅ Use **301** (or **308** — Google treats them the same) for URLs that have moved for good — it passes ranking signals to the target and is what Google recrawls to update its index. Use **302** (temporary) only for genuinely short-lived redirects (A/B tests, temporary maintenance) — a 302 left in place for months is a common bug, not a valid long-term pattern.
- ❌ Avoid **redirect chains** (A → B → C) and **loops** (A → B → A); resolve every internal link and canonical directly to the final URL. Each extra hop adds crawl cost and risk of Google not following the whole chain.
- ✅ A redirected URL's **content should match the destination's intent** — don't redirect unrelated pages to the homepage as a catch-all; that's frequently treated as a soft-404.

## Sources
- SEO Starter Guide — https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Title links — https://developers.google.com/search/docs/appearance/title-link
- Snippets / meta description — https://developers.google.com/search/docs/appearance/snippet
- Robots meta / X-Robots-Tag — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Consolidate duplicate URLs — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- JavaScript SEO basics (noindex and canonical with JS) — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Control what you share with Google (Search generative AI control) — https://developers.google.com/search/docs/crawling-indexing/control-what-you-share
- Preferred image metadata (`og:image`) — https://developers.google.com/search/docs/appearance/google-images
- Redirects (301/308) — https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Bing: `data-nosnippet` support (Oct 2025) — https://blogs.bing.com/webmaster/2025/10/Bing-Introduces-Support-for-the-data-nosnippet-HTML-Attribute/
- HTTPS as a ranking signal — https://developers.google.com/search/blog/2014/08/https-as-ranking-signal
