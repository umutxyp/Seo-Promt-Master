# 06 — Beyond Google: Bing, Yandex, Apple, Brave, DuckDuckGo

The foundation is the same for every engine, but the details differ (`docs/18`). These prompts cover the differences, so that a Google-only setup doesn't quietly fail everywhere else.

---

### Multi-engine readiness check

**Use when:** you've only ever looked at Google.

```text
Act as a multi-engine SEO auditor. Check {{url}} for Google, Bing (which also feeds DuckDuckGo, Yahoo and Copilot), Apple (Siri, Spotlight, Safari Suggestions), Brave, Yandex and DuckDuckGo.

If you can run commands: npx github:umutxyp/Seo-Promt-Master --url {{url}} --max 15 --md report.md, then read its "Crawler access" table.
Otherwise, read robots.txt and resolve it per RFC 9309 for: Googlebot, Bingbot, Applebot (which falls back to the Googlebot group), YandexBot, DuckDuckBot, Baiduspider, Yeti and SeznamBot. Brave follows the Googlebot rules.

Check:
- is any search engine blocked, or throttled by Crawl-delay (Bing obeys it)?
- <html lang> and content-language agree with hreflang (Bing reads them)
- noarchive or nocache on pages we want cited in Copilot
- is the site verified in Bing Webmaster Tools, and is IndexNow in use?
Output: a table of engine → status → issue → fix.
```

### Set up Bing Webmaster Tools and IndexNow

**Use when:** Bing (and with it DuckDuckGo, Yahoo and Copilot) is under-indexing the site.

```text
Walk me through, step by step, setting up Bing for {{site}} ({{framework}}, hosted on {{host}}):
1. Verify the site in Bing Webmaster Tools (importing from Google Search Console is fastest) and submit the sitemaps.
2. Implement IndexNow: generate a key, serve it at /<key>.txt, and ping https://api.indexnow.org/indexnow on publish, meaningful update and delete. Use a POST batch of up to 10,000 URLs for bulk changes. Give the code that hooks into our {{CMS/database/deploy}} events, with retries and no duplicate pings for unchanged content.
3. Remove any Crawl-delay that's throttling Bing, and use Bing's crawl control instead.
4. Turn on the AI Performance report and tell me what to watch there.
Note: Google doesn't use IndexNow, so the sitemap stays accurate regardless.
```

### Set up Yandex

**Use when:** the audience includes Russia, Türkiye or other CIS markets where Yandex has meaningful share.

```text
Set {{site}} up for Yandex:
1. Verify it in Yandex Webmaster, submit the sitemaps, and set the region if the site is local.
2. robots.txt: add a Yandex group with Clean-param for the tracking and session parameters we use ({{utm_*, ref, sessionid}}). Don't use the obsolete Host: directive; the main mirror is set by 301s. Don't rely on Crawl-delay (Yandex ignores it); use the crawl-speed setting instead.
3. Confirm that canonical, hreflang and the sitemap index are consistent.
4. Add IndexNow (shared with Bing) if it isn't already there.
Give the exact robots.txt additions, and a checklist.
```

### Apple, Safari and Brave readiness

**Use when:** you care about iPhone users, Siri and Spotlight suggestions, or privacy-focused audiences.

```text
Explain and check {{site}}'s readiness for Apple and Brave:
- Safari searches go to Google by default, so the Google foundation covers them. What extra does Applebot (Siri, Spotlight, Safari Suggestions) need?
- robots.txt: does Applebot fall back to our Googlebot group, and is that what we want? Do we want to opt out of model training with Applebot-Extended without leaving Siri and Spotlight?
- Brave follows the Googlebot rules and has no webmaster console. Confirm that nothing blocks it, and that discovery through links is strong.
- How to verify that a request is really Applebot (reverse DNS *.applebot.apple.com).
Output: the current state, recommended changes, and the exact robots.txt lines.
```

### Regional engines: Naver, Seznam, Baidu

**Use when:** the business targets South Korea, the Czech Republic or mainland China.

```text
We target {{country}}. Tell me which search engine matters there and what's specifically needed:
- Naver (Korea): crawler Yeti, Naver Search Advisor registration, sitemap submission, IndexNow
- Seznam (Czechia): SeznamBot, IndexNow
- Baidu (China): Baiduspider, Baidu Ziyuan, weak JavaScript rendering (so server-rendered HTML is effectively mandatory). Flag the hosting and ICP licence questions as business and legal decisions, not SEO fixes.
Only recommend work for the markets we actually serve. Give a prioritized setup list.
```
