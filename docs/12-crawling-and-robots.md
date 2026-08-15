# 12 — Crawling, robots.txt & Crawl Budget

`docs/01` covers what you tell a crawler once it arrives. This covers whether it arrives at all.

## The pipeline, and why the distinction matters

```
DISCOVERY → CRAWLING → RENDERING → INDEXING → RANKING → SERVING
```

- ⚠️ **Each stage is independent and none guarantees the next.** Being crawled does not mean being indexed; being indexed does not mean ranking. Almost every "SEO problem" is really a question of *which link in this chain is broken*, and the fix is completely different at each one.
- Diagnostic order, in this order: reachable (`curl -I` → 200?) → crawl-allowed (URL Inspection) → renders (Test live URL → view rendered HTML) → indexed (`site:`) → correct canonical → has impressions → has clicks. A page with impressions and no clicks is a title/snippet problem, not a crawl problem, and treating it as one wastes weeks.

## robots.txt is a specification, not a convention

It is **RFC 9309**. The rules are exact:

- ✅ Only `https://host:port/robots.txt` is read. There is no such thing as a subdirectory robots.txt.
- ✅ It is **per scheme, host and port**. `https://example.com`, `https://www.example.com` and `http://example.com` each have their own file. Subdomains are independent — `cdn.example.com/robots.txt` governs the CDN alone.
- ✅ Max processed size is **500 KiB**; everything after is ignored. UTF-8.
- ⚠️ **Response codes change the meaning entirely:**

| Code | Googlebot behaviour |
|---|---|
| 200 | Rules apply |
| 4xx (incl. 404/410) | **File treated as absent → everything is crawlable** |
| 5xx / timeout | **Nothing is crawled for the first ~12 hours**, then the last known copy is used for up to 30 days, then full crawl |
| 3xx | Followed up to 5 hops |

- ❌ **Don't serve robots.txt from the application layer if that layer can 503.** A maintenance window then stops crawling site-wide. Serve it statically or at the edge.

### Matching rules people get wrong

- A crawler obeys **exactly one group** — the most specific `User-agent` match. Rules from the `*` group are **not merged in**.
- Path matching is a **prefix**: `Disallow: /a` also blocks `/abc`.
- Wildcards: `*` (any sequence), `$` (end of string).
- On conflict, the **longest** rule wins; on equal length, **`Allow`** wins.
- ⚠️ Case: paths are case-sensitive, user-agent names are not.
- ⚠️ **A `Disallow` rule is a path, and a locale prefix is part of the path.** `Disallow: /panel` does not cover `/tr/panel`. On a multilingual site this is the single most common crawl-budget leak — every blocked section quietly stays open under every locale prefix.

### What robots.txt does not do

- ❌ **It does not prevent indexing.** A blocked URL can still be indexed from external links, as a URL-only result.
- ❌ **`Disallow` and `noindex` cancel each other out.** Google must crawl a page to see its `noindex`. If you block it, the directive is never read. To remove a page: allow crawling **and** serve `noindex`.
- ❌ It is not privacy. The file is public; listing a secret path advertises it.

## Google's crawlers (2026)

| Token | Purpose | robots-controllable |
|---|---|---|
| `Googlebot` | Search, Images, Video, News, Discover | Yes |
| `Googlebot-Image` / `-Video` / `-News` | Per-surface crawling | Yes |
| `Storebot-Google` | Shopping surfaces | Yes |
| `Google-InspectionTool` | Rich Results Test / URL Inspection — **does not affect ranking** | Yes |
| `GoogleOther` | General-purpose / one-off research crawls | Yes |
| `Google-Extended` | **Gemini training & grounding control.** Blocking it does **not** affect Search ranking | Yes |
| `Google-Safety` | Abuse scanning | **No** — ignores robots.txt |

- ⚠️ **User-agent strings are trivially spoofed.** Verify real Googlebot by reverse DNS (`*.googlebot.com` / `*.google.com`) or against Google's published IP ranges before whitelisting anything in a WAF.

## Crawl budget

```
actual crawling = min(crawl capacity limit, crawl demand)
```

- **Capacity limit** is how much your server can take without degrading. It rises when responses are fast and **falls quickly** on 5xx, 429 and timeouts — and recovers slowly.
- **Demand** is how much Google *wants* to crawl you, from three inputs: perceived unique inventory (duplicates inflate it wastefully), popularity, and staleness (how often content genuinely changes).

**Who needs to care:** under ~1,000 URLs, nobody — basic hygiene is enough. Over ~10,000, or with fast-changing inventory, it matters. Over 1M it is the primary technical concern.

### Raising capacity
- ✅ Cut server response time. This is the strongest single lever; target **< 300 ms** average, with 1s as the alarm threshold.
- ✅ Drive 5xx/429/timeouts toward zero — GSC's Crawl Stats should show **< 1%** non-2xx.
- ✅ Support **HTTP 304**: honour `If-Modified-Since` / `If-None-Match` and return Not Modified for unchanged content.
- ✅ HTTP/2 or better; avoid fanning assets across many hosts.

### Directing demand
- ✅ Eliminate duplicate URL inventory — the same content behind 20 parameter combinations is 20× the waste.
- ✅ Block genuinely worthless sections in **robots.txt**, not with `noindex` (a `noindex` page is still crawled every time).
- ✅ Return **404/410** for permanently removed content; prefer it to blocking, because blocked URLs linger in the queue longer.
- ✅ Break redirect chains — every hop is a separate crawl request.
- ✅ Close crawl traps: infinite calendars, unbounded filter combinations, endless pagination.

### Things that do not raise crawl budget (myths)
`Crawl-delay` (Google ignores it) · sitemap `<priority>`/`<changefreq>` (ignored) · a high Lighthouse score (the signal is *response time*, not the score) · `nofollow` on internal links (the URL is still discovered) · "budget optimisation" on a small site (there is no problem to solve).

## Log analysis — the only source of ground truth

```bash
# Status-code distribution for Googlebot
grep -i 'Googlebot' access.log | awk '{print $9}' | sort | uniq -c | sort -rn

# The 50 most-crawled paths — is the budget going anywhere useful?
grep -i 'Googlebot' access.log | awk '{print $7}' | sed 's/?.*//' | sort | uniq -c | sort -rn | head -50

# Sitemap URLs that have never been crawled
comm -23 <(sort sitemap-urls.txt) <(grep -i Googlebot access.log | awk '{print $7}' | sort -u)

# AI crawler volume (see docs/10)
grep -Ei 'GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot|ChatGPT-User' access.log \
  | awk '{print $1, $7}' | sort | uniq -c | sort -rn | head -30
```

Look for: crawl requests concentrated on worthless paths, important templates crawled rarely (weeks apart means an internal-linking or sitemap problem), the 3xx/4xx/5xx ratio, and fake Googlebot traffic.

## Measurement

GSC → **Settings → Crawl stats**: total request trend, average response time, response-code distribution, file type, purpose (discovery vs refresh), and Googlebot type.

- ⚠️ Serving Googlebot 429/503 is an acceptable short-term signal — Google slows down. Sustained for weeks, URLs start dropping out of the index.
- ⚠️ WAF and bot-protection rules that catch Googlebot show up as a sudden 403/503 spike in Crawl Stats. On Cloudflare, verify the "Verified Bots" allow rule.

## Checklist
- [ ] robots.txt returns 200, is under 500 KiB, and has an absolute `Sitemap:` line
- [ ] No critical CSS/JS/image path is disallowed (`/_next/`, `/static/`, `/assets/`)
- [ ] No URL carries both `Disallow` and `noindex`
- [ ] Locale-prefixed variants of every `Disallow` rule are covered
- [ ] AI crawler policy is a written decision, not a template default (`docs/10`)
- [ ] Crawl Stats: average response < 300 ms, 5xx under 1%
- [ ] Googlebot verified by reverse DNS and allowed through the WAF

## Sources
- Managing crawl budget for large sites — https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget
- Google common crawlers — https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- Verifying Googlebot — https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot
- RFC 9309, Robots Exclusion Protocol — https://www.rfc-editor.org/rfc/rfc9309.html
- HTTP status codes and network errors — https://developers.google.com/search/docs/crawling-indexing/http-network-errors
