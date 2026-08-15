# 13 — Indexing, Canonicals & Duplicate Management

`docs/01` shows the tags. This is when to reach for which one, and what happens when signals disagree.

## Picking the right instrument

| Goal | Right tool | Wrong tool |
|---|---|---|
| Crawlable but not indexed | `noindex` meta / `X-Robots-Tag` | robots.txt `Disallow` |
| Worthless, save server load | robots.txt `Disallow` | `noindex` (still crawled every time) |
| Content permanently gone | **410** (or 404) | `noindex` and leaving it up |
| Content moved | **301** | canonical alone |
| A variant of the same content | `rel=canonical` | `noindex` (kills the variant's link value too) |
| Urgent removal (legal, accident) | GSC Removals (~6 months) **plus** a permanent fix | Removals alone |
| Non-HTML file (PDF, image) | `X-Robots-Tag` HTTP header | meta tag (there is no HTML to put it in) |

Directive values: `noindex`, `nofollow`, `none`, `noarchive`, `nosnippet`, `max-snippet:[n]`, `max-image-preview:[none|standard|large]`, `max-video-preview:[n]`, `notranslate`, `noimageindex`, `unavailable_after:[date]`, `indexifembedded`.

- ⚠️ **The most expensive single mistake in this document:** a staging-wide `noindex` reaching production. Put a "is there a `noindex` in prod?" assertion in the deploy pipeline — see `tools/seo-smoke.sh`.

## Canonical

- ✅ **Absolute URL**, including protocol. Relative canonicals get resolved in ways you did not intend.
- ✅ **Self-referencing on every indexable page.** That is the correct default, not a special case.
- ✅ The target must return **200**, must not be `noindex`, and must not redirect.
- ✅ **One** canonical per page. Two, and Google may discard both.
- ✅ Canonical and hreflang must agree: each language version is canonical **to itself** (`docs/02`).
- ✅ Paginated pages are canonical to **themselves**, never to page 1.
- ❌ Don't inject canonical with JavaScript if you can emit it server-side.

### When Google picks a different canonical

Your `rel=canonical` is a **strong hint, not an instruction**. Google weighs it against internal link counts, sitemap membership, HTTPS preference, URL "cleanliness", redirects and the hreflang cluster. GSC reporting *"Google chose a different canonical than the user"* means your signals disagree with each other.

The fix is never "set the canonical harder". It is to align **all five**: internal links, sitemap entry, canonical tag, redirect target and hreflang — on one URL.

## Duplicate taxonomy

| Type | Example | Fix |
|---|---|---|
| Protocol / host variant | http vs https, www vs bare | **301** to one |
| Trailing slash | `/a` and `/a/` | 301 + consistent internal links + canonical |
| Case | `/Product` and `/product` | 301, lowercase everywhere |
| Index file | `/` and `/index.html` | 301 |
| Tracking parameters | `?utm_source=`, `?fbclid=` | self-canonical to the clean URL |
| Sort / filter | `?sort=price` | canonical + robots.txt where needed |
| Pagination | `?page=2` | self-canonical, **do not `noindex`** |
| Session IDs | `;jsessionid=` | remove from the URL |
| Print / AMP variant | `/print/a` | canonical to the main page |
| Same product in several languages | `/tr/x` and `/en/x` | **not duplicates** — hreflang (`docs/02`) |
| Internal search results | `/search?q=` | `noindex` **or** robots.txt (one, not both) |
| Boilerplate templates | 500 city pages differing by a name | differentiate or consolidate — otherwise doorway / scaled-content risk (`docs/14`) |

- ⚠️ `rel=next` / `rel=prev` has been **unused by Google since 2019**. Ordinary `<a href>` pagination links are sufficient.

## Faceted navigation

The biggest crawl-budget sink there is: 8 filters × 5 values is thousands of URLs.

| Facet type | Indexed? | Implementation |
|---|---|---|
| Has real search demand, produces unique content (`/shoes/red`) | **Yes** | Static path, own title/description/H1, in the sitemap |
| Rare combinations (`?color=red&size=42&brand=x`) | No | `noindex, follow` or robots.txt |
| Sort / view (`?sort=price&view=grid`) | No | Canonical to the base URL + robots.txt |
| Pagination (`?page=3`) | Yes | Self-canonical, leave crawlable |

Recipe: valuable facets go in the **path**, worthless ones stay in the **query string** and get blocked there; normalise parameter order so `?a=1&b=2` is never also `?b=2&a=1`; give empty-result facet pages a `noindex` and a useful alternative rather than a soft 404.

## Soft 404s and status-code hygiene

A **soft 404** is "not found / no results / product removed" served with **200**. Google detects it, drops the URL, and it eats crawl budget in the meantime.

| Situation | Code |
|---|---|
| Page does not exist | 404 |
| Permanently deleted | 410 |
| Permanently moved | 301 (308 preserves POST) |
| Temporarily moved / A-B test | 302 (or 307) |
| Maintenance | 503 + `Retry-After` |
| Members-only | 401/403 (plus paywall structured data, `docs/08`) |
| Rate limited | 429 |

- ⚠️ **In an SPA or a streaming framework, a real 404 is not automatic.** In Next.js App Router, call `notFound()`. And check it **per template**: a `loading.tsx` above a segment is a Suspense boundary — the framework flushes a 200 shell first, and `notFound()` then only swaps the body. The whole template soft-404s with nothing visible in a browser to show for it. The refusal belongs in that segment's `layout.tsx`. `tools/seo-audit.mjs` probes for exactly this.

## Reading GSC index states

| State | Meaning | Action |
|---|---|---|
| Discovered – currently not indexed | Known, not judged worth crawling | Raise internal link strength, quality and server speed; reduce page count |
| Crawled – currently not indexed | Crawled, not judged worth indexing | **A quality problem.** Consolidate or deepen; do not add more pages |
| Alternate page with proper canonical tag | Expected for variants | Fine — just confirm the canonical points where you think |
| Duplicate, Google chose different canonical | Signals disagree | Align all five signals (above) |
| Page with redirect | Redirected URL | Remove from sitemap, repoint internal links |
| Excluded by noindex tag | Deliberate? | If accidental, remove the tag |
| Blocked by robots.txt | Crawl blocked | Confirm the block is intentional |
| Soft 404 | 200 on an empty/error page | Return a real 404/410 or add content |

- ⚠️ **A high "Crawled – currently not indexed" ratio is a quality signal, not a technical one.** Producing more pages makes it worse; merging makes it better.

## Index bloat

Symptom: `site:` returns far more than your real content page count. Usual sources: tag and archive pages, internal search results, generated combinations, empty user profiles, staging paths, old campaign URLs, deep pagination, calendars.

Cleanup: inventory every URL (crawl + sitemap + GSC + logs + analytics) → score each **template** by traffic/impressions/links → decide per template: merge (301), delete (410), or keep-but-`noindex` → restrict the sitemap to canonical indexable URLs → watch the Pages report for 4–8 weeks.

## Checklist
- [ ] Every indexable page has an absolute self-referencing canonical
- [ ] Canonical targets return 200 and are neither redirects nor `noindex`
- [ ] http→https, host consolidation and trailing-slash policy enforced by 301
- [ ] Internal search results are not indexed
- [ ] Facet policy is written down and implemented
- [ ] Soft 404s near zero; SPA/streaming 404s verified **per template**
- [ ] Sitemap contains only 200, indexable, canonical URLs (`docs/06`)
- [ ] Staging is `noindex` + auth; production carries no `noindex`

## Sources
- Canonicalization troubleshooting — https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Robots meta tag / X-Robots-Tag — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Faceted navigation — https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
- Soft 404 errors — https://developers.google.com/search/docs/crawling-indexing/http-network-errors
- Consolidate duplicate URLs — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
