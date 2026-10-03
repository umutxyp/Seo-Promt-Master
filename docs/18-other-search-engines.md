# 18 — Beyond Google: Bing, Yandex, Apple, Brave, DuckDuckGo & Regional Engines

Docs 01–17 are written against Google, because Google publishes the most and holds the largest share. But a site is also read by other engines, and some of them feed products bigger than themselves: Bing's index sits behind DuckDuckGo and Yahoo results and behind Microsoft Copilot answers. Applebot sits behind Siri, Spotlight and Safari's suggestions.

**The good news first:** almost everything in 01–17 carries over unchanged. Server-rendered HTML, real status codes, a self-referencing canonical, a clean sitemap, a valid robots.txt, honest structured data — every major engine rewards the same foundation. This doc covers only the places where engines **differ**, so that an audit doesn't accidentally optimise for Google while quietly breaking something for everyone else.

## The one-table summary

| Engine | Crawler token(s) | Powers | Webmaster tool | IndexNow | Honours `Crawl-delay` |
|---|---|---|---|---|---|
| Google | `Googlebot` (+ `Google-Extended` for Gemini) | Google Search, Discover, AI Overviews / AI Mode | Search Console | ❌ No | ❌ Ignored |
| Bing | `bingbot` (legacy `msnbot`) | Bing, **Copilot**, and most of **DuckDuckGo / Yahoo / Ecosia** web results | Bing Webmaster Tools | ✅ Yes | ✅ Yes |
| Yandex | `YandexBot` (group `Yandex` covers all Yandex bots) | Yandex Search, Alice | Yandex Webmaster | ✅ Yes | ❌ Ignored since 2018 — use the crawl-speed setting |
| Apple | `Applebot` (+ `Applebot-Extended` for model training) | Siri, Spotlight, **Safari Suggestions** | — | ❌ No | — |
| Brave | No distinct token — follows **Googlebot** rules | Brave Search, Brave Search API | — | ❌ No | — |
| DuckDuckGo | `DuckDuckBot`, `DuckAssistBot` | Its own crawl supplements results mostly sourced from Bing | — (use Bing's) | — | — |
| Naver | `Yeti` | Naver (South Korea) | Naver Search Advisor | ✅ Yes | — |
| Seznam | `SeznamBot` | Seznam (Czech Republic) | Seznam Webmaster | ✅ Yes | — |
| Baidu | `Baiduspider` | Baidu (mainland China) | Baidu Ziyuan | ❌ No | — |

⚠️ Each engine's list of user agents and products changes over time. Check the source pages below before you write robots.txt rules or claim a feature in a report. `tools/seo-audit.mjs` prints a **crawler access matrix** that resolves your actual robots.txt for every token in this table.

## Safari users are Google users (mostly)

- ✅ Safari's default search engine in most regions is Google, so a Safari user who searches is usually shown Google's results. **Google SEO is Safari SEO.**
- ✅ What Apple adds on top is its own surfaces: **Safari Suggestions, Spotlight and Siri**, crawled by **Applebot**. Blocking Applebot removes the site from those surfaces, and it does not affect Google.
- ⚠️ **Applebot inherits Googlebot's rules.** If robots.txt has no `Applebot` group but does have a `Googlebot` group, Applebot follows the Googlebot group. A rule written "for Google" therefore also applies to Apple.
- ✅ `Applebot-Extended` doesn't crawl. It is a robots.txt token that controls whether Applebot's data may be used to **train Apple's models**. Disallowing it opts out of training without leaving Siri or Spotlight.
- Verify a real Applebot by reverse DNS: it resolves to `*.applebot.apple.com`.

## Bing — and everything built on it

Treat Bing as the second engine of record. Its index is the one behind **DuckDuckGo and Yahoo results** (in part or whole, depending on the product) and behind **Microsoft Copilot** answers. So a Bing problem shows up in several places at once.

- ✅ **Set up Bing Webmaster Tools.** You can import the site from Search Console in a few clicks. It also includes the **AI Performance** report (`docs/15`), which shows how the site appears in Copilot answers.
- ✅ **IndexNow is Bing's preferred fast-discovery channel.** When a URL is added, changed or deleted, ping the IndexNow endpoint once. Every participating engine shares the submission. Google does not take part, so IndexNow supplements the sitemap and never replaces it.
- ⚠️ **Bing honours `Crawl-delay`.** Google ignores it (`docs/12`), so a `Crawl-delay: 10` copied from an old template looks harmless in Search Console. In Bing it caps the crawl at 8,640 URLs a day. For a large site, remove it and use the crawl-control setting in Bing Webmaster Tools instead.
- ✅ **Language signals:** Bing reads `<html lang>` and the `content-language` meta/header as well as hreflang. Google detects language from the visible content only (`docs/02`). Set all of them and make sure they agree.
- ✅ **Controls for Copilot answers:** Bing treats `noarchive` and `nocache` in robots meta as content-use controls for its AI answers. With `nocache`, Copilot may show only the URL, title and snippet. With `noarchive`, the page is excluded from its answers. Both are ordinary meta values, so check that no template sets them by accident on pages you want cited.
- ⚠️ **`bingbot` is not covered by a `Googlebot` group.** A site that writes only a `Googlebot` group and then `User-agent: * / Disallow: /` has blocked Bing — and with it most of DuckDuckGo and Copilot.
- ✅ Bing renders JavaScript, but its own guidance prefers content in the initial HTML for the same reasons as `docs/05`. Server rendering remains the answer for every engine.

## Yandex

- ✅ **Yandex Webmaster** gives you indexing reports, crawl stats, a robots.txt analyser and a **Crawl speed** setting. Use that setting instead of `Crawl-delay`, which Yandex has ignored since 2018.
- ✅ **`Clean-param`** is a Yandex-only robots.txt directive. It tells Yandex that query parameters such as `utm_*`, `ref` or `sessionid` do not change the content, so Yandex consolidates those URLs and doesn't crawl each variant. Other engines ignore the line, so it is safe to add:
  ```
  User-agent: Yandex
  Clean-param: utm_source&utm_medium&utm_campaign&ref /
  ```
- ⚠️ **The `Host:` directive is obsolete.** Yandex stopped using it in 2018. The main-mirror choice (`www` versus bare, `http` versus `https`) is now made by **301 redirects**, exactly as `docs/01` requires for Google.
- ✅ Yandex supports canonical, hreflang, sitemaps (including sitemap indexes) and IndexNow.
- Yandex's group token is `Yandex`, which applies to all Yandex robots. `YandexBot` targets only the main indexing robot.

## Brave Search

- ✅ Brave runs its own independent index, which also feeds the **Brave Search API** that a number of AI products use for web results.
- ⚠️ **No separate robots.txt group is needed — or possible.** Brave documents that its crawler does not announce a distinct user agent and that it follows the rules you set for **Googlebot**. A Googlebot block is therefore also a Brave block.
- Brave offers no webmaster console or sitemap submission. Pages are discovered through links and through Brave's opt-in browser-signal programme, so internal linking (`docs/04`) and external links (`docs/17`) are the levers.

## DuckDuckGo

- ✅ DuckDuckGo results draw on many sources, chiefly Bing, plus its own crawler, **DuckDuckBot**. In practice, **fix Bing and DuckDuckGo follows.**
- ✅ **`DuckAssistBot`** fetches pages for DuckDuckGo's AI-assisted answers. Decide on it the same way you decide on the other AI-answer crawlers (`docs/10`).

## Regional engines

Only relevant when the audience is in that market. Don't add work for a market the site doesn't serve.

- **Naver (South Korea):** crawler `Yeti`. Register the site in Naver Search Advisor and submit sitemaps there. Naver participates in IndexNow.
- **Seznam (Czech Republic):** crawler `SeznamBot`. It participates in IndexNow.
- **Baidu (mainland China):** crawler `Baiduspider`, with Baidu Ziyuan as the webmaster platform. Baidu's JavaScript rendering is far weaker than Google's, so **server-rendered HTML is close to mandatory**. Hosting and licensing inside mainland China (ICP) are business and legal decisions this knowledge base doesn't cover.

## IndexNow

```
https://api.indexnow.org/indexnow?url=https://example.com/changed-page&key=<your-key>
```

- ✅ The key is a string you generate yourself and host at `https://example.com/<your-key>.txt`. That proves you own the host. For batches, POST a JSON list of up to 10,000 URLs.
- ✅ A submission to one participating engine is shared with all of them (Bing, Yandex, Seznam, Naver and others — the current list is on indexnow.org).
- ✅ Ping on **real** changes: published, meaningfully updated, deleted (the URL then returns 404 or 410). Re-submitting unchanged URLs gains nothing.
- ❌ It is **not** a Google channel and does not replace the sitemap. Keep the sitemap accurate (`docs/06`). That part is for everyone.

## What to audit

- [ ] robots.txt does not block `bingbot` by accident — for example a `Googlebot`-only allow group followed by `User-agent: * / Disallow: /` (`tools/seo-audit.mjs` checks this)
- [ ] No `Crawl-delay` that caps Bing on a large site
- [ ] The site is verified in Bing Webmaster Tools, with sitemaps submitted
- [ ] IndexNow is wired into the publish and unpublish path, if the site changes often
- [ ] `<html lang>` is set and agrees with the hreflang and the content
- [ ] No `noarchive` or `nocache` on pages the project wants cited in Copilot answers
- [ ] Any decision about Applebot or Applebot-Extended is deliberate (Siri and Spotlight versus model training)
- [ ] Yandex (if the market matters): verified in Yandex Webmaster, `Clean-param` for tracking parameters, no reliance on `Host:`
- [ ] Regional engines (Naver, Seznam, Baidu): only where the business actually serves that market

## Sources
- Bing Webmaster Guidelines — https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- Bing — which crawlers Bing uses — https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0
- Bing — content controls for AI answers (`nocache` / `noarchive`) — https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat
- IndexNow protocol — https://www.indexnow.org/documentation
- Yandex — robots.txt (incl. `Clean-param`, `Crawl-delay`) — https://yandex.com/support/webmaster/controlling-robot/robots-txt.html
- Yandex Webmaster — https://webmaster.yandex.com
- About Applebot — https://support.apple.com/en-us/119829
- Brave Search crawler — https://search.brave.com/help/brave-search-crawler
- DuckDuckBot — https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot
- DuckDuckGo result sources — https://duckduckgo.com/duckduckgo-help-pages/results/sources
- DuckAssistBot — https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot
- Naver Search Advisor — https://searchadvisor.naver.com
- Baidu Ziyuan (webmaster platform) — https://ziyuan.baidu.com
