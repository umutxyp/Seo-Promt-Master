# 15 — Measurement & Verification

An audit that ends at "I changed it" is half an audit. This is how a change is proven, and how a decline is diagnosed.

## Search Console setup

- ✅ Use a **Domain property** (DNS verification) — it covers every subdomain and protocol. Add URL-prefix properties on top when you want a section (`/tr/`, `/forum/`) analysed separately.
- ✅ Submit every sitemap, turn on email notifications, and set up the **BigQuery bulk export** — the UI caps at 1,000 rows and 16 months, which is not enough for real analysis.
- ✅ Check **Settings → Search generative AI**: the site must be included for AI Overviews and AI Mode (`docs/09`). Inclusion is the default, but an inherited *Exclude* explains a site that never appears in AI answers.
- ✅ Set up **Bing Webmaster Tools** too. It is not only about Bing traffic: Bing's index powers Copilot answers and most DuckDuckGo and Yahoo results (`docs/18`), and its **AI Performance** panel reports AI citations alongside Google's own Generative AI reports.

## Which report answers which question

| Report | Question | Then what |
|---|---|---|
| Performance → Search results | What are we shown for, and what gets clicked? | Query/page/country/device breakdowns; the **Branded / Non-branded** filter; the **multimodal** search type (Lens, Circle to Search, image uploads, Chrome's "Search this image" — since 24 Sep 2026) |
| Performance → **Generative AI** | Which pages appear in AI Overviews / AI Mode? | Impressions by page, country, device and date; filter *Web: text-based* vs *Web: multimodal*. Discover has its own generative AI report. Rolled out worldwide 31 Aug 2026 |
| Performance → Discover / News | Discover traffic | Image and headline work |
| **Pages** (Indexing) | What is indexed, and why is the rest not? | `docs/13` state table |
| Sitemaps | Submitted vs discovered | Under 80% indexed means a quality problem, not a sitemap problem |
| Core Web Vitals | Field data by URL group | `docs/05` |
| Enhancements | Structured data errors | `docs/08` |
| Links | Internal and external link distribution | `docs/17` |
| **Crawl stats** (Settings) | Crawl volume, response time, status codes | `docs/12` |
| Manual actions / Security | Any penalty or compromise? | Must be empty (`docs/14`) |
| URL Inspection | Everything about one URL | Where every diagnosis starts |

### Finding opportunities in the Performance report

1. **Position 8–20 with high impressions** — closest to the threshold, cheapest wins. Strengthen the content and add internal links.
2. **High impressions, low CTR** — a title/description problem, or an AI Overview absorbing the click.
3. **Pages declining over the last 3 months vs the previous 3** — the refresh queue.
4. **One query, several URLs** — cannibalisation. Merge or differentiate.
5. **Filter out brand queries** — otherwise brand growth masks whether SEO is actually working. Search Console has a built-in **Branded / Non-branded** filter for this: it covers the brand name in every language, its misspellings and the site's own products, and is classified by an AI-assisted system rather than a regex — so expect the occasional misfiled query.
   - ⚠️ The filter exists only for **top-level properties** (not URL-path or subdomain properties) with enough query volume. Where it is missing, fall back to a query regex.

- ⚠️ **GSC limits:** ~2 days of latency, 16 months of history, anonymised queries omitted, and totals do not reconcile when you combine the page and query dimensions.

### One BigQuery query worth having

```sql
-- Cannibalisation: one query, several URLs competing
SELECT query,
       COUNT(DISTINCT url) AS url_count,
       ARRAY_AGG(url ORDER BY impressions DESC LIMIT 3) AS top_urls,
       SUM(impressions) AS impressions
FROM `project.searchconsole.searchdata_url_impression`
WHERE data_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY)
  AND search_type = 'WEB'   -- the table also holds Discover and News rows
  AND query != ''           -- anonymised queries are empty strings
GROUP BY query
HAVING url_count > 1 AND impressions > 500
ORDER BY impressions DESC
LIMIT 100;
```

### The same data from the Search Analytics API

Since **16 Nov 2026** the API carries what the report's filters do, so dashboards no longer need a brand regex or one request per country:

- ✅ **`brandedClassification`** — group or filter by branded vs non-branded.
  - ⚠️ Only for eligible properties (the same rule as the filter above). For any other property **the response has no rows** — an empty result means "not eligible", not "no branded traffic".
- ✅ **`type: webMultimodal`** — performance from Google Lens, Circle to Search and image uploads. Google is adding it to BigQuery for properties with the bulk export on.
- ✅ **`filterLists`** — several countries or devices in one request (a DACH or LATAM view without stitching responses together).

## Analytics

Set up, at minimum: organic channel split by engine, landing-page performance, conversion events, on-site search terms, and an **AI referral segment** — traffic whose source host is `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com` or `claude.ai`. That segment is the only place AI *traffic* (as opposed to AI impressions) shows up at all.

### Recognising Google Search traffic in analytics and logs

Google Search sends an **origin-only** `Referer`: the scheme and host, never the path or the query. The search terms are only in Search Console.

| Where the click happened | `Referer` |
|---|---|
| Google Search on the web | `https://www.google.com/` or a local domain (`https://www.google.co.uk/`, `https://www.google.co.jp/`) |
| Google app on Android | `android-app://com.google.android.googlequicksearchbox/https/www.google.com` when the app opens the link in a browser tab; otherwise the web value |
| Google app on iOS | the web value |

- ⚠️ **Discover and Google Images send the same values**, so a referrer match counts them as Search. Only Search Console separates Discover from Search (`docs/09`).
- ⚠️ **A blank `Referer` is normal**, and lands the visit in "direct": private browsing and anti-fingerprinting, results opened in a new tab in some browsers, a native search widget handing off to a browser, privacy extensions.
- ✅ In raw logs, match the header **on landing-page requests only**. Images, CSS and JavaScript carry your own page's URL as their referrer.
- ✅ If Google traffic shows up as referral or direct, look first at your own configuration: custom channel rules, referral exclusions, filters.

**Analytics will not equal Search Console clicks**, and that alone is not a fault:

- Search Console counts a **click** on the result; analytics counts a **session** only after the page loads and the tag runs — consent choices and ad blockers remove some.
- A **client-side redirect** (JavaScript, meta refresh) can replace the referrer with your own URL, and a redirect that sends a stricter `Referrer-Policy` can drop it. Redirects that lose the query string lose `gclid` too.
- Search Console is **organic only**; analytics may be counting Google Ads clicks in the same total.

## The KPI set

| Layer | Metric | Source | Healthy direction |
|---|---|---|---|
| Crawl | Daily requests, avg response time, 5xx rate | Crawl stats / logs | ↑ / ↓ / ↓ |
| Index | Indexed ÷ submitted | Pages + Sitemaps | > 80% |
| Visibility | Total and non-brand impressions | GSC | ↑ |
| Relevance | Average position per query cluster | GSC | ↑ |
| Clicks | CTR by query type, organic sessions | GSC + analytics | ↑ |
| AI | AI impressions, AI referral sessions | Generative AI report + analytics | ↑ |
| Experience | LCP/INP/CLS at p75, mobile | CrUX / RUM | Green |
| Authority | Referring domains, brand search volume | Link tool + GSC | ↑ |
| Business | Conversions, revenue, signups | Analytics | ↑ |

Rhythm: **weekly** anomaly check (indexing, 5xx, CWV, traffic); **monthly** KPI table plus what shipped; **quarterly** full audit and content portfolio review.

## Verifying a change

1. Write the **hypothesis** ("adding X to the H1 should raise position for query cluster Y").
2. Define the **affected URL set** and a **control set**.
3. Record the change date as an annotation.
4. Watch for **4–8 weeks**. Google has to recrawl and then re-evaluate.
5. Write down the result — **including the things that did not work**. A change log with only successes in it is a marketing document, not a record.

Keep that log in the repository next to the docs, and mark known core updates on the same timeline. When traffic moves six weeks later, it is the only thing that will tell you which of the eleven changes you shipped was responsible.

## Diagnosing a traffic drop

```
1. IS IT REAL?      Analytics broken? Tag lost? Did GSC impressions drop too?
                    If impressions held, the problem is measurement or CTR.
                    Analytics down but GSC clicks flat is measurement: a consent
                    banner, a new redirect dropping the referrer, a channel rule.
2. IS IT TECHNICAL? 5xx spike, robots.txt change, leaked noindex, broken
                    canonical, unreachable sitemap, CWV collapse.
                    → Fast to fix, fast to recover.
3. MANUAL ACTION?   GSC → Manual actions / Security issues.
4. ALGORITHMIC?     Does the date line up with a core, spam or Discover update?
                    (Timeline in docs/09; current list on Google's Search
                    Status Dashboard.) Site-wide or one section? Which query
                    types were lost? Search, Discover, or both?
5. SERP CHANGE?     AI Overview appeared? New SERP feature? New competitor?
                    (Position unchanged, CTR down.)
6. SEASONAL?        Compare demand in Google Trends. If demand fell, you didn't.
```

| Shape of the drop | Likely cause |
|---|---|
| Sudden, steep, one day | Technical or manual action |
| Gradual over 1–2 weeks | Core update rollout — measure only after it completes (`docs/09`) |
| Discover down, Search flat | Discover core update or Discover-specific issue (`docs/09`) |
| Position flat, clicks down | SERP feature / AI Overview / CTR |
| Impressions down, position flat | Demand fell, or queries lost |
| One folder or template | That section's quality or a template bug |
| One country or language | hreflang, a local competitor, a local update |

## Checklist
- [ ] Domain property, sitemaps and notifications configured
- [ ] BigQuery export enabled
- [ ] Bing Webmaster Tools connected
- [ ] AI referral segment defined in analytics
- [ ] Weekly anomaly check is a routine, not an intention
- [ ] KPI table updated monthly
- [ ] Change log maintained, with core updates marked on the same timeline
- [ ] Manual actions and security reports clean

## Sources
- Get started with Search Console — https://developers.google.com/search/docs/monitor-debug/search-console-start
- Search Console bulk data export — https://support.google.com/webmasters/answer/12917675
- Search Status Dashboard, ranking update history — https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history
- Google Search core updates (when and how to measure) — https://developers.google.com/search/docs/appearance/core-updates
- Debugging search traffic drops — https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops
- Bing Webmaster Tools — https://www.bing.com/webmasters/about
- Generative AI performance report — https://support.google.com/webmasters/answer/16984139
- Search generative AI control — https://support.google.com/webmasters/answer/16908024
- BigQuery export sample queries (`search_type = 'WEB'`, `query != ''`) — https://support.google.com/webmasters/answer/12917174
- Identify Google Search traffic (Referer values, why numbers differ) — https://developers.google.com/search/docs/monitor-debug/identify-google-search-traffic
- Branded queries filter — https://developers.google.com/search/blog/2025/11/search-console-branded-filter
- Web multimodal Search performance reporting — https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc
- Search Analytics API: branded, multimodal and multi-value filters (Nov 2026) — https://developers.google.com/search/blog/2026/11/search-analytics-api-update
