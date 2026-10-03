# Prompt Library

Ready-to-paste prompts for every SEO and GEO job — in the spirit of [prompts.chat](https://prompts.chat), but each prompt follows this repository's rules: it cites official guidance, asks for **evidence rather than assertions**, and refuses outdated advice (meta keywords, `llms.txt` as a fix, FID, `rel=next/prev`).

**How to use one:** open a category, copy the `text` block, replace the `{{variables}}`, and paste it into any assistant — ChatGPT, Claude, Gemini, Copilot or Cursor. If the assistant can see this repository, or a project where `install.sh` was run, the prompts get much better: the assistant can cite `docs/`, run `tools/seo-audit.mjs`, and edit the code.

> Doing the whole job? Use **[Full audit and fix](01-start-here.md#full-audit-and-fix-coding-agent)**. It runs the complete workflow in `START.md`. The other prompts are for when you want one specific task.

## Categories

| # | Category | Prompts |
|---|---|---|
| 01 | [Start here](01-start-here.md) | Full audit and fix · 15-minute health check · Single-page deep audit · Resume an audit · Explain my report |
| 02 | [Technical SEO](02-technical-seo.md) | robots.txt · XML sitemap · Soft 404 hunt · Canonical clusters · Migration redirect map · hreflang · JS rendering · Core Web Vitals · Faceted navigation · Crawl-budget log analysis |
| 03 | [On-page & content](03-on-page-and-content.md) | Titles & descriptions in bulk · Heading outline · Internal linking · Thin-content triage · E-E-A-T audit · Refresh brief · Cannibalization |
| 04 | [Structured data](04-structured-data.md) | JSON-LD generator · Validate JSON-LD · Organization/Person entity · Product markup |
| 05 | [GEO: AI answer engines](05-geo-ai-search.md) | AI-crawler policy · Answer-first rewrite · Entity consistency · AI citation tracking · The llms.txt question · AI Overviews CTR loss |
| 06 | [Beyond Google](06-multi-engine.md) | Multi-engine readiness · Bing + IndexNow · Yandex · Apple/Safari/Brave · Naver/Seznam/Baidu |
| 07 | [Monitoring & diagnosis](07-monitoring-and-diagnosis.md) | Traffic drop · Search Console export · CI gates · Monthly report · Hacked site |
| 08 | [Framework recipes](08-framework-recipes.md) | Next.js · Nuxt · SvelteKit/Astro/Remix · WordPress · Laravel/Django/Rails |

## Machine-readable

[`prompts.csv`](prompts.csv) holds every prompt as `act,prompt,category,source` rows, so you can import them into prompt managers or tools built around the prompts.chat CSV. It is generated from these Markdown files — **edit the Markdown, then run `npm run prompts:csv`**. CI fails if the CSV is out of date.

## Writing a new prompt

Add it to the matching category file in the same shape:

````markdown
### Short imperative title

**Use when:** one line naming the situation it's for.

```text
The prompt. Variables in {{double_braces}}. Ask for evidence and an output format.
```
````

Keep it tool-agnostic, tie every rule to `docs/`, and never ask an AI to assert something the knowledge base doesn't back.
