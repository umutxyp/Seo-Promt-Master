# 15 — Measurement & Verification

An audit that ends at "I changed it" is half an audit. This is how a change is proven, and how a decline is diagnosed.

## Search Console setup

- ✅ Use a **Domain property** (DNS verification) — it covers every subdomain and protocol. Add URL-prefix properties on top when you want a section (`/tr/`, `/forum/`) analysed separately.
- ✅ Submit every sitemap, turn on email notifications, and set up the **BigQuery bulk export** — the UI caps at 1,000 rows and 16 months, which is not enough for real analysis.
- ✅ Set up **Bing Webmaster Tools** too. It is not about Bing traffic: Bing's index is what ChatGPT and Copilot draw on, and its **AI Performance** panel is the only first-party report of AI citations that exists (`docs/10`).

## Which report answers which question

| Report | Question | Then what |
|---|---|---|
| Performance → Search results | What are we shown for, and what gets clicked? | Query/page/country/device breakdowns |
| Performance → **Generative AI** | Which pages appear in AI Overviews / AI Mode? | Impressions only — no clicks, CTR or queries; data starts May 2026, no backfill |
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
5. **Filter out brand queries** — otherwise brand growth masks whether SEO is actually working.

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
GROUP BY query
HAVING url_count > 1 AND impressions > 500
ORDER BY impressions DESC
LIMIT 100;
```

## Analytics

Set up, at minimum: organic channel split by engine, landing-page performance, conversion events, on-site search terms, and an **AI referral segment** — traffic whose source host is `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com` or `claude.ai`. That segment is the only place AI *traffic* (as opposed to AI impressions) shows up at all.

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
2. IS IT TECHNICAL? 5xx spike, robots.txt change, leaked noindex, broken
                    canonical, unreachable sitemap, CWV collapse.
                    → Fast to fix, fast to recover.
3. MANUAL ACTION?   GSC → Manual actions / Security issues.
4. ALGORITHMIC?     Does the date line up with a core or spam update? Site-wide
                    or one section? Which query types were lost?
5. SERP CHANGE?     AI Overview appeared? New SERP feature? New competitor?
                    (Position unchanged, CTR down.)
6. SEASONAL?        Compare demand in Google Trends. If demand fell, you didn't.
```

| Shape of the drop | Likely cause |
|---|---|
| Sudden, steep, one day | Technical or manual action |
| Gradual over 1–2 weeks | Core update rollout |
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
- Debugging search traffic drops — https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops
- Bing Webmaster Tools — https://www.bing.com/webmasters
