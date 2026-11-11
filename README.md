<div align="center">

# 🔍 SEO Prompt Master

### Open-source technical SEO and GEO (AI search) audit — a zero-dependency CLI, an AI agent skill, 47 SEO prompts and a cited knowledge base of Google's rules.

**Install it into your project, and every coding agent you use — Claude Code, Codex, Cursor, Gemini CLI, Copilot — gains an SEO + GEO auditor. It maps your routes, checks them against the official rules of Google, Bing, Yandex, Apple and the AI crawlers, fixes the gaps, and proves the fixes with a real audit against your live server.**

<sub>robots.txt · XML sitemaps · canonicals · hreflang · structured data / schema.org · Core Web Vitals · soft 404s · AI crawlers (GPTBot, ClaudeBot, PerplexityBot) · AI Overviews · Google core updates · Bing & IndexNow</sub>

[![License: MIT](https://img.shields.io/badge/License-MIT-78c51c.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-4285F4.svg)](CHANGELOG.md)
[![Tests](https://github.com/umutxyp/Seo-Promt-Master/actions/workflows/test.yml/badge.svg)](.github/workflows/test.yml)
[![Docs: Google Search Central](https://img.shields.io/badge/docs-Google%20·%20Bing%20·%20Yandex%20·%20Apple-4285F4.svg)](docs/README.md)
[![Works with](https://img.shields.io/badge/skill%20for-Claude%20·%20Codex%20·%20Cursor%20·%20Gemini%20·%20Copilot-000.svg)](#-install-as-a-skill)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**[Usage guide](GUIDE.md)** · **[Türkçe kullanım rehberi](GUIDE.tr.md)** · **[Prompt library](prompt-library/README.md)** · **[Knowledge base](docs/README.md)** · **[Wiki](https://github.com/umutxyp/Seo-Promt-Master/wiki)**

</div>

---

**Contents:** [Quick start](#-quick-start--pick-one) · [What's new](#-whats-new) · [What is this?](#what-is-this) · [Install](#-install-as-a-skill) · [The tools](#-the-tools) · [Sample report](#-sample-report) · [Prompt library](#-the-prompt-library) · [Workflow](#-the-workflow) · [FAQ](#-faq) · [Author](#-author)

---

## ⚡ Quick start — pick one

| You want… | Do this | Time |
|---|---|---|
| **A score and a findings list for a live site** | `npx github:umutxyp/Seo-Promt-Master --url https://your-site.com --md seo-report.md` | 1 min |
| **An agent to audit *and fix* your codebase** | `bash /path/to/Seo-Promt-Master/install.sh` inside your project, then tell your agent *"run the SEO audit"* | 1 min to set up |
| **A ready-made prompt for one task** (robots.txt, hreflang, JSON-LD, traffic drop…) | Open the [prompt library](prompt-library/README.md), copy, fill in `{{variables}}`, paste | 30 s |
| **To read the rules** | [`docs/README.md`](docs/README.md) — a current, cited reference to SEO and GEO | — |

No account, no API key, and zero dependencies. Node 18+ is the only requirement for the tool.

---

## 🆕 What's new

- **November 2026 core update** (started 10 November, still rolling out): the knowledge base now carries every Google core, spam and Discover update since March 2024, and how to measure one without fooling yourself — [`docs/09`](docs/09-2024-2026-updates.md). Diagnosing a drop? Use the [traffic-drop prompt](prompt-library/07-monitoring-and-diagnosis.md#diagnose-a-traffic-drop).
- **Discover has its own core updates** since February 2026, and **site reputation abuse** manual actions no longer apply in the EEA since August 2026 — [`docs/09`](docs/09-2024-2026-updates.md), [`docs/14`](docs/14-quality-eeat-and-spam.md).
- **2.1.0** — every engine, not just Google: a per-crawler robots.txt matrix for 24 crawlers, a GEO Score, and 47 prompts. See the [changelog](CHANGELOG.md).

---

## What is this?

Four things in one repository:

1. **A knowledge base** (`docs/01`–`docs/18`), distilled from [Google Search Central](https://developers.google.com/search), [web.dev](https://web.dev), and the official documentation of Bing, Yandex, Apple, Brave, DuckDuckGo and the AI crawler operators. Every claim is cited. Docs 01–11 cover the page. Docs 12–18 cover crawling and crawl budget, indexing and canonicals, content quality and the spam policies, measurement, migrations, off-page authority, and **the engines beyond Google**.
2. **A skill** that installs into whichever agent you use, so "audit my SEO" starts the whole workflow without you pasting anything.
3. **A prompt library** — [47 copy-paste prompts in 8 categories](prompt-library/README.md), from "rewrite my robots.txt" to "diagnose a traffic drop". Each one is built to ask for evidence and to refuse outdated advice. It's also available as a CSV.
4. **Two tools that run** (`tools/`). Reading a repository tells you what a project *intends*; only a request tells you what the server *returns*.

> The tools are not decoration. Tested against production sites before release, `seo-audit.mjs` found live P1 blockers that source review had missed: a `Disallow: /_next/` breaking rendering, and a template returning 200 for every URL under it.

---

## 🚀 Install as a skill

```bash
git clone https://github.com/umutxyp/Seo-Promt-Master.git
cd /path/to/your-project
bash /path/to/Seo-Promt-Master/install.sh
```

That copies the knowledge base, prompt library and tools into `.seo-prompt-master/`, then writes the entry-point file each agent actually reads:

| Agent | File it discovers |
|---|---|
| **Claude Code** | `.claude/skills/seo-audit/SKILL.md` |
| **OpenAI Codex CLI**, Amp, Jules, Windsurf | `AGENTS.md` |
| **Cursor** | `.cursor/rules/seo-prompt-master.mdc` |
| **Gemini CLI** | `GEMINI.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` |

Then just ask: **"run the SEO audit"**. The agent finds the workflow itself.

If your project already has an `AGENTS.md` or `GEMINI.md`, the installer appends to it and never replaces it. Re-running the installer is safe.

**Prefer not to install?** Put the repo next to your project — most agents auto-discover `AGENTS.md` and start on their own. Or paste `START.md` into any chat assistant and say "begin at Phase 0".

---

## 🔧 The tools

```bash
# The thorough pass — sample the sitemap, audit each page, compute SEO + GEO scores
npx github:umutxyp/Seo-Promt-Master --url https://example.com --max 40 --md report.md
# (or, from a clone:)  node tools/seo-audit.mjs --url https://example.com --max 40 --md report.md

# The ten-second deploy tripwire
SEO_SMOKE_404_PATHS="/ /blog /products" bash tools/seo-smoke.sh https://example.com
```

Both have zero dependencies. The auditor needs Node 18+; the smoke test needs `curl` and `awk`. Both exit non-zero on failure, so either can gate a deploy or a CI job (`--fail-on P1|P2|never`), and both work against `http://localhost:3000`.

**What `seo-audit.mjs` catches that reading code cannot:**

- **Soft 404s, template by template** — a route that answers 200 for URLs that don't exist. In frameworks with Suspense boundaries this has no visible symptom at all: a `loading.tsx` above one segment silently turns that whole template's 404 into a 200 shell.
- **One-way hreflang** — a set that isn't reciprocal is discarded *in full*, so every language in the cluster loses the signal. You can only see it by comparing pages against each other.
- **Signals that contradict each other** — a canonical pointing at a redirect, a 404 or a `noindex` page; sitemap URLs that redirect or that robots.txt blocks; a `noindex` sent in the `X-Robots-Tag` header that no one sees in the HTML.
- **A crawler access matrix** — robots.txt resolved per RFC 9309 for Googlebot, **Bingbot** (which also feeds DuckDuckGo, Yahoo and Copilot), **Applebot** (Siri, Spotlight, Safari), YandexBot, DuckDuckBot, Baiduspider, Naver and Seznam, plus 16 AI crawlers split into training, AI search and user-triggered. Blocking Bing by accident is a P1; blocking an AI trainer is a policy decision.
- **Streamed metadata** — frameworks that flush `<head>` early and emit `<title>` later. Browsers hoist it; bots that stop reading at `</head>` see an untitled page.
- **Bot protection** — it recognises a Cloudflare, Akamai or Imperva challenge and reports it once, instead of scoring an unreadable site as broken.
- Plus: render-critical JS and CSS blocked by robots.txt, sitemap limits and `lastmod` credibility (including `.xml.gz`), host consolidation, duplicate titles, JSON-LD validity and policy (`Product` with no offer, review or rating; `aggregateRating` with no ratings behind it), raw-HTML content volume, image dimensions, viewport, `lang`, and AI-answer snippet controls (`nosnippet`, `noarchive`/`nocache`).

**The output** is an SEO Score and a GEO Score out of 100, each with a per-category breakdown that shows where the points went, the crawler access table, and every finding cited to `docs/`.

**What it deliberately cannot see** — so it stays your job: content quality (`docs/14`), off-page authority (`docs/17`), and real field Core Web Vitals, which come from CrUX rather than from fetching a page (`docs/05`). A high score means the technical foundation is sound, not that the site will rank.

See [`tools/README.md`](tools/README.md) for every flag.

---

## 📋 Sample report

This is what `seo-audit.mjs --md report.md` writes, shortened. The run below is against the deliberately broken fixture site in [`tests/fixtures.mjs`](tests/fixtures.mjs) — the same site the test suite checks the tool against.

```text
## SEO Score: 43/100 (6 pages fetched, full sitemap coverage)
6 pages scored · 4 capped at 60 by a P1 · site-level penalty 29.

| Category                        | P1 | P2 | P3 | ≈ points lost |
| Indexability & crawl foundation |  3 |  2 |  1 |          18.3 |
| Rendering & mobile parity       |  2 |  0 |  2 |          12.7 |
| Structured data                 |  0 |  1 |  5 |           2.7 |

## GEO Score: 36/100 (provisional — automated) · capped at 60 by a GEO blocker

## Crawler access (robots.txt, resolved per RFC 9309)
| Googlebot | Search engine | ✅ allowed | `*`      |
| Bingbot   | Search engine | ⛔ blocked | `bingbot` |
| GPTBot    | AI training   | ✅ allowed | `*`      |
  … 24 crawlers in all

### P1 — blockers (6)
- robots.txt blocks Bingbot from the homepage (via `User-agent: bingbot`). That removes
  the site from Bing and from everything built on Bing's index: DuckDuckGo and Yahoo
  results, Copilot answers.                         Rule: docs/18
- Page is `noindex` for Google (X-Robots-Tag header).   /a          Rule: docs/01
- hreflang points to /fr/one, which does not point back. A one-way set is discarded
  in full.                                          /en/one     Rule: docs/02
```

Every finding names the URL, the rule in `docs/` it comes from, and the score category it cost. The full report also lists P2/P3 findings and a JSON version (`--json`) for CI.

---

## 📚 The prompt library

| Category | Examples |
|---|---|
| [Start here](prompt-library/01-start-here.md) | Full audit & fix · 15-minute health check · Explain my report |
| [Technical SEO](prompt-library/02-technical-seo.md) | robots.txt · sitemap · soft 404s · canonicals · migration redirect map · hreflang · JS rendering · CWV |
| [On-page & content](prompt-library/03-on-page-and-content.md) | Titles & descriptions in bulk · internal linking · thin-content triage · E-E-A-T |
| [Structured data](prompt-library/04-structured-data.md) | JSON-LD generator · validator · entity + `sameAs` |
| [GEO: AI answer engines](prompt-library/05-geo-ai-search.md) | AI-crawler policy · answer-first rewrite · AI citation tracking |
| [Beyond Google](prompt-library/06-multi-engine.md) | Bing + IndexNow · Yandex · Apple/Safari/Brave · Naver/Baidu |
| [Monitoring & diagnosis](prompt-library/07-monitoring-and-diagnosis.md) | Traffic drop · Search Console export · CI gates · monthly report |
| [Framework recipes](prompt-library/08-framework-recipes.md) | Next.js · Nuxt · SvelteKit/Astro/Remix · WordPress · Laravel/Django/Rails |

---

## 📂 What's inside

```
seo-prompt-master/
├── install.sh                ← writes the skill into your project, for every agent
├── package.json              ← `npx github:umutxyp/Seo-Promt-Master` runs the auditor
├── GUIDE.md · GUIDE.tr.md    ← usage guides (English · Türkçe)
├── VERSION · CHANGELOG.md    ← semver; a major means old scores aren't comparable
│
├── .claude/skills/seo-audit/SKILL.md    ← Claude Code
├── AGENTS.md                            ← Codex, Amp, Jules, Windsurf (and most others)
├── .cursor/rules/seo-prompt-master.mdc  ← Cursor
├── GEMINI.md                            ← Gemini CLI
├── .github/copilot-instructions.md      ← GitHub Copilot
├── CLAUDE.md · START.md                 ← the workflow itself
│
├── tools/                    ← the parts that run
│   ├── seo-audit.mjs            live SEO + GEO audit, scored, exits 1 on any P1
│   ├── seo-smoke.sh             deploy tripwire
│   └── build-prompts-csv.mjs    regenerates prompt-library/prompts.csv
│
├── prompt-library/           ← 47 copy-paste prompts in 8 categories (+ prompts.csv)
├── prompts/                  ← the 5-phase workflow (+ 1 optional)
├── docs/                     ← the knowledge base (source of truth), 01–18
├── verticals/                ← 24 industry overlays (optional, additive)
├── checklists/ · templates/ · examples/
└── tests/                    ← fixture sites the tools are tested against (npm test)
```

---

## 🧠 The workflow

```
START.md
  │
  ├─ Phase 0  Bootstrap ......... detect framework, i18n, rendering; load docs/;
  │                               RUN tools/seo-audit.mjs for the baseline
  ├─ Phase 1  Discover .......... every route → ROUTES-INVENTORY.md
  │                               classify: public-index / public-noindex / private
  ├─ Phase 2  Audit ............. 9-point check per page → SEO-AUDIT-PROGRESS.md
  ├─ Phase 3  Prioritize ........ one backlog, infra-first (P1 → P2 → P3)
  ├─ Phase 4  Fix & verify ...... change → typecheck/lint/build → re-fetch → tick
  └─ Phase 5  Live signals ...... optional: CrUX and live scrape via MCP
```

Progress lives in `ROUTES-INVENTORY.md` and `SEO-AUDIT-PROGRESS.md`, so a long run survives a context reset and resumes where it stopped.

---

## ✅ What it checks

Metadata · Canonical + hreflang · Robots and indexing (meta **and** header) · Structured data · Headings and semantics · Images · Internal links and pagination · Rendering · Sitemap · **Crawler access for every major search engine and AI crawler** — every rule traces to a cited section in `docs/`.

**The output is a number with its working shown:** a deterministic **SEO Score** and **GEO Score** out of 100 ([`docs/11`](docs/11-scoring-rubric.md)), each with a per-category breakdown. A P1 crawl or index blocker caps a page's score no matter what else it gets right, because a page that cannot be indexed gains nothing from polish. No score is reported as final without full coverage plus a self-recheck of a random sample. And it is always stated as a technical-readiness score: backlinks, content quality and competition are out of scope.

---

## ❤️ Why it exists

Most SEO checklists are shallow, generic, or quietly out of date. This one is:

- **Current** (reviewed October 2026; Google's update timeline tracked through the November 2026 core update — see [What's new](#-whats-new)). It is explicit about what changed: INP replaced FID in March 2024; FAQ rich results are limited to government and health sites; `HowTo` rich results are gone; `rel=next/prev` has been unused by Google since 2019; Google doesn't support IndexNow but Bing and Yandex do; Bing still obeys `Crawl-delay`; `llms.txt` is not a ranking or citation lever. Advice that repeats the old version is out of date, and the knowledge base says so.
- **Not Google-only.** Google is the reference engine, but Bing's index sits behind DuckDuckGo, Yahoo and Copilot, and Applebot sits behind Siri and Safari's suggestions. [`docs/18`](docs/18-other-search-engines.md) covers where the engines differ, and the auditor checks all of them.
- **Cited.** Every claim links to official documentation. If something isn't in `docs/`, the agent is told to say "not covered by the knowledge base" rather than recall it from training data.
- **Executable and tested.** An agent can run it against your code *and* your server. The tools are themselves tested against a healthy and a deliberately broken fixture site on every push.
- **Honest about its limits.** It separates ranking factors from hygiene, logs deliberate skips, and names what it can't measure.

---

## ❓ FAQ

**What is GEO?**
Generative Engine Optimization: making a site readable and citable by AI answer engines — Google AI Overviews and AI Mode, ChatGPT search, Perplexity, Copilot. Most of it is classic technical SEO done properly; the rest is crawler policy and extractable content. [`docs/10`](docs/10-ai-crawlers-and-geo.md) covers what works and what doesn't.

**Is it free? Do I need an API key?**
Yes, MIT-licensed. No account, no API key, no dependencies — the auditor is one Node 18+ file, and the prompts work in any assistant.

**Does it work with ChatGPT, Gemini or other assistants without a coding agent?**
Yes. Paste [`START.md`](START.md) into the chat and say "begin at Phase 0", or copy a single prompt from the [prompt library](prompt-library/README.md). A coding agent adds the part where it reads and fixes your code.

**Which frameworks does it support?**
Any site that serves HTTP — the auditor only fetches pages. The fix recipes cover Next.js, Nuxt, SvelteKit, Astro, Remix, WordPress, Laravel, Django and Rails ([framework recipes](prompt-library/08-framework-recipes.md)), and [24 industry overlays](verticals/README.md) cover e-commerce, SaaS, local business, news and more.

**My traffic dropped after a Google core update. What now?**
Check the date against the update timeline in [`docs/09`](docs/09-2024-2026-updates.md), rule out a technical cause first with the auditor, and don't measure until the rollout is complete plus a week. The [traffic-drop prompt](prompt-library/07-monitoring-and-diagnosis.md#diagnose-a-traffic-drop) walks through it step by step.

**Do I need an `llms.txt` file for AI search?**
No. Google ignores it, and Google, OpenAI, Anthropic and Meta have not committed to reading it in their search or answer systems ([`docs/10`](docs/10-ai-crawlers-and-geo.md)). Having one isn't penalized either.

**Will a score of 100 make my site rank?**
No. The scores measure technical readiness — whether search engines and AI crawlers can crawl, render, index and understand your pages. Content quality, backlinks and competition decide ranking, and the tool says so in every report.

---

## 👤 Author

**Umut Bayraktar** — [@umutxyp](https://github.com/umutxyp)

Full-stack developer, AI-systems researcher and content creator, with 6+ years of building platforms end to end. Founder and CEO of **[Codeshare Technology](https://codeshare.me)**, a London-based software studio (founded 2025; its products date back to 2020) built on one idea: *software that stays free for the people who need it.*

The methodology here comes from running these products, not from theory — and the tools were tested against their production sites before every release:

| Product | What it is |
|---|---|
| 🎵 **[Beatra](https://beatra.app)** | Free, high-quality Discord music bot with a full web dashboard — relaunched October 2025 |
| 🛡️ **[Sylon](https://sylon.app)** | AI-powered Discord moderation: spam and ad protection, tickets, server guard, welcome automation, logs and analytics — grown out of *Server Support* (2020) |
| ⛏️ **[MCStat](https://mcstat.org)** | Live Minecraft discovery layer — 6.7K+ servers with real-time stats and player counts |
| 💬 **[JustDiscord](https://justdiscord.org)** | Directory of Discord servers, bots, emojis, stickers and packs with verified ownership — 8K+ bots, 90K+ emojis, 23 languages |
| 📺 **[JustAnime](https://justanime.me)** | Anime and manga tracker — your library, per-episode and per-chapter progress, ratings and reviews |
| 🤖 **[Dotrai](https://dotrai.com)** | Browser-based AI assistant that answers with live web search and runs real code to check its own work |

Across the portfolio: **41.5K+ Discord servers**, **3M+ Discord users** and **466K+ Minecraft players** reached (figures from codeshare.me, October 2026).

**Open source:** [MusicBot](https://github.com/umutxyp/MusicBot) · [Seo-Promt-Master](https://github.com/umutxyp/Seo-Promt-Master) · [Discord-Bot-Website](https://github.com/umutxyp/Discord-Bot-Website) · [Personal-Website](https://github.com/umutxyp/Personal-Website) · [v14-discord-bot](https://github.com/umutxyp/v14-discord-bot) · [Shroudly](https://github.com/umutxyp/Shroudly)

🔗 [Portfolio](https://umutbayraktar.vercel.app) · [GitHub](https://github.com/umutxyp) · [LinkedIn](https://linkedin.com/in/umutxyp) · [YouTube](https://youtube.com/@umutxyp) · [Codeshare Technology](https://codeshare.me)

If this saved you time, **star the repo**. 🌟

---

## 📄 License

[MIT](LICENSE) © Umut Bayraktar ([@umutxyp](https://github.com/umutxyp)).
The knowledge base is compiled from public documentation by Google Search Central, web.dev, Microsoft Bing, Yandex, Apple, Brave, DuckDuckGo and the AI crawler operators. All trademarks belong to their owners. This project is not affiliated with or endorsed by any of them.

---

## 🤝 Contributing

Search guidance moves. PRs that update a rule with a source link, add a framework recipe or a prompt, or add a check to `tools/` (with a fixture test) are very welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
