# 06 — Sitemaps

## Limits & structure

- ✅ A single sitemap file: max **50 MB uncompressed** *or* **50,000 URLs**. Exceed either → split and reference from a **sitemap index**.
- ✅ A sitemap index: max **50,000 sitemap entries**. You can submit up to **500 index files** per site in Search Console.
- ✅ Sitemaps referenced by an index must live on the **same site**, in the **same directory or below** the index — unless you set up **cross-site submission** (verified ownership of both sites), which waives this.
- ✅ Files must be **UTF-8**; URLs must be **fully-qualified absolute** URLs pointing only to the **canonical** version.

## `lastmod`, `priority`, `changefreq`

- ✅ Google uses `<lastmod>` **only if it's consistently and verifiably accurate** (reflecting real content changes). Use W3C Datetime format.
- ⚠️ Google **ignores `<priority>` and `<changefreq>` entirely**, and so does **Bing** (stated July 2025). Harmless to include, but no major engine uses them — spend the effort on an accurate `<lastmod>`, which Bing also calls a key recrawl signal.

## Formats & submission

- ✅ Formats: **XML** (most versatile — supports image/video/news/hreflang), RSS/Atom, plain text. Prefer XML.
- ✅ For engines that support it (Bing, Yandex, Naver, Seznam, Yep, plus the Internet Archive and Amazonbot — **not** Google), also ping **IndexNow** when a URL is published, changed or removed. It speeds discovery and does not replace the sitemap (`docs/18`).
- ✅ Submit via Search Console, the Search Console API, a `Sitemap:` line in `robots.txt`, or WebSub for feeds.

## Coverage rule (audit this)

- ✅ The sitemap should list exactly your **`public-index`** set.
- ❌ **Never list a URL you also `Disallow` in `robots.txt`** — that's a conflicting signal. (Common bug: tool/editor pages disallowed in robots but still in the sitemap.)
- ✅ Keep `noindex` and `private` routes **out** of the sitemap.

## New sites and big launches: grow the sitemap, don't dump it

What Google documents:

- ✅ A site that is **new and has few external links** is exactly the case where a sitemap helps discovery — but a sitemap "doesn't guarantee that all the items in your sitemap will be crawled and indexed."
- ⚠️ **Crawl demand comes from perceived inventory and popularity.** "If Google spends too much time crawling URLs that it shouldn't, Google's crawlers might not explore the rest of your site, or might not increase your crawl budget." A new domain has little popularity, so a large inventory on day one is mostly inventory Google won't get to.
- ⚠️ *Discovered – currently not indexed* means Google found the URL and **postponed** crawling it, typically because it expected to overload the site (`docs/13`). Thousands of URLs sitting there is the classic signature of a launch that published everything at once.
- ❌ Publishing large numbers of thin or templated pages is the pattern Google's **scaled content abuse** policy describes: "many pages are generated for the primary purpose of manipulating search rankings and not helping users" (`docs/14`).

**The ramp-up (practice, not a Google rule).** No engine documents a schedule; this is operating experience from directory, listing and UGC sites that went from zero to hundreds of thousands of URLs. Use it on any new domain, and on an established site launching a large new section (thousands of generated pages):

1. **Launch with a seed set.** Verify the site in Google Search Console, Bing Webmaster Tools and Yandex Webmaster first. The first sitemap holds only the best, most complete pages — homepage, hubs and categories, and the strongest entries: on the order of **a few hundred URLs** (≈300 is a reasonable start for a directory), not the whole database.
2. **Wait for the seed to be absorbed — about 1–2 weeks.** Watch *Pages* (Indexing) and *Crawl stats*: most of the seed indexed, response times steady, no 5xx or 429.
3. **Admit new URLs in small, steady batches** — for example **5–10 URLs a day, or every 2–3 days**, best first. Every admitted URL must pass the site's **index threshold** (`docs/14`): real unique content, 200, self-canonical, not empty, linked from an already-indexed page.
4. **Let indexing set the pace.** Grow the batch only while the previous batches are being indexed (as a working rule, most of a batch indexed within about two weeks). If *Discovered – currently not indexed* or *Crawled – currently not indexed* starts growing, **stop adding** and improve the pages already in — more URLs won't fix a quality or capacity signal.
5. **Hold the rest back properly.** Leaving a URL out of the sitemap does not hide it — Google still finds it through links. Pages waiting for their turn stay unpublished, or `noindex` and unlinked from indexable pages; admission is one step: make it indexable, add it to the sitemap with a real `lastmod`, link it, and ping IndexNow for Bing and Yandex (`docs/18`).
6. **Automate it as a queue, not a cron dump.** Candidate URLs wait in priority order; a scheduled job admits the next batch only if they pass the threshold and the pause rule above isn't tripped. The daily cap and the pause rule are product settings, written down — not something an agent changes silently.

- ❌ Don't publish 100,000+ generated URLs on day one, resubmit the sitemap every day, or stamp every `lastmod` with "now" to look fresh.
- ✅ An established site publishing at its normal pace needs no ramp — the rule is for new domains and for step changes in inventory.

## Multilingual

- ✅ XML sitemaps can carry `hreflang` via `xhtml:link` alternates per `<url>` (an alternative to HTML `<link rel="alternate">`). See `docs/02`.

## Sources
- Build & submit a sitemap — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Large sitemaps / sitemap index — https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps
- Bing: sitemaps in AI-powered search (`lastmod`, `changefreq`/`priority` ignored) — https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/
- IndexNow participating engines — https://www.indexnow.org/searchengines.json
- Sitemaps overview (new sites with few links; no guarantee of crawling) — https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Crawl budget (perceived inventory, popularity) — https://developers.google.com/crawling/docs/crawl-budget
- Page indexing report (Discovered – currently not indexed) — https://support.google.com/webmasters/answer/7440203
- Spam policies: scaled content abuse — https://developers.google.com/search/docs/essentials/spam-policies#scaled-content
