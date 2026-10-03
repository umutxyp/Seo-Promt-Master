# 07 — Monitoring & diagnosis

When something changed and you need to know why, and how to stop it happening again unnoticed.

---

### Diagnose a traffic drop

**Use when:** organic traffic fell and nobody knows why.

```text
Act as an SEO incident analyst. Organic traffic dropped {{x%}} starting {{date}}. Work through these steps in order, and don't skip ahead:
1. Is it real? Analytics or tag change? Did Search Console impressions fall too, or only clicks?
2. Is it technical? A 5xx spike, a robots.txt change, a leaked noindex (check the meta tags AND the X-Robots-Tag header), a broken canonical, an unreachable sitemap, a WAF blocking Googlebot or Bingbot. If you can, run: npx github:umutxyp/Seo-Promt-Master --url {{url}} and bash tools/seo-smoke.sh {{url}}
3. Is there a manual action or a security issue in Search Console?
4. Is it algorithmic? Does the date line up with a core or spam update? Is it site-wide or one section?
5. Did the SERP change? Position flat but clicks down usually means an AI Overview or a SERP feature.
6. Is it seasonal? Compare demand in Google Trends.
Match the shape of the drop (sudden, gradual, one folder, one country) to its likely cause. Give the most probable cause, the evidence still needed, and the fix.
Data I have: {{paste GSC / analytics summaries, deploy log, dates}}
```

### Analyze a Search Console export

**Use when:** you have a Performance export (CSV or BigQuery) and want a list of opportunities.

```text
Analyze this Search Console Performance export (query, page, clicks, impressions, CTR, position):
{{paste or attach}}
Find:
1. Positions 8–20 with high impressions (the cheapest wins), each with the page and the action.
2. High impressions with low CTR (a title or snippet problem, or an AI Overview), each with a rewrite suggestion.
3. Cannibalization: one query, several URLs.
4. Pages declining over the last 3 months compared with the previous 3.
Filter out brand queries ({{brand terms}}) first. Present each finding as a table, and end with the top 10 actions.
```

### Gate deploys with SEO checks (CI)

**Use when:** you want regressions caught before they reach production, not after.

```text
Add SEO regression gates to this project's CI ({{GitHub Actions | GitLab CI | other}}):
1. After build and start, run: bash tools/seo-smoke.sh http://localhost:{{port}}, with SEO_SMOKE_404_PATHS set to our template roots ({{/blog /products}}).
2. Run node tools/seo-audit.mjs --url http://localhost:{{port}} --max 25 --fail-on P1 --md seo-report.md and upload the report as an artifact.
3. After the production deploy, run seo-smoke against the live URL and roll back on failure.
Use the installed path .seo-prompt-master/tools/ if that's where the tools live. Show the full workflow file. Wait for the server to be ready rather than using a fixed sleep.
```

### Monthly SEO / GEO report

**Use when:** stakeholders want a regular status update.

```text
Write this month's SEO/GEO report for {{site}} from the data below. Structure:
1. Headline: 3 bullet points, written for a non-specialist.
2. KPI table: crawl (requests, response time, 5xx), index (indexed vs submitted), visibility (non-brand impressions), clicks and CTR, AI (Generative AI impressions, AI referral sessions), CWV at p75, authority (referring domains), business conversions. Show each against last month.
3. What we shipped, with each change's hypothesis and its result so far. Include the ones that didn't work.
4. The current seo-audit SEO and GEO scores, with the category breakdown.
5. Next month's top 3 priorities.
Data: {{paste}}
```

### Respond to a hacked site

**Use when:** spam pages appear in the index, or Search Console shows a security issue.

```text
Our site {{url}} looks hacked: {{symptoms}}. Give me an incident runbook, in order:
1. Contain it (take the site offline or isolate it).
2. Find the entry point (logs, recently changed files, dependencies, credentials).
3. Restore from a clean backup and close the hole.
4. Return 410 for the injected URLs and clean any spam sitemaps.
5. Rotate every key and session.
6. Request a review in Search Console, and check Bing Webmaster Tools too.
7. Hardening: 2FA, dependency scanning, a WAF, file-integrity monitoring.
For each step, give the exact commands or checks for our stack ({{stack}}).
```
