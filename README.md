<div align="center">

# 🔍 SEO Prompt Master

### Google SEO — the full docs as an AI skill, plus a tool that actually runs.

**Install it into your project and every coding agent you use — Claude Code, Codex, Cursor, Gemini CLI, Copilot — gains an SEO auditor that maps your routes, checks them against Google's official rules, fixes the gaps, and proves it with a real audit against your live server.**

[![License: MIT](https://img.shields.io/badge/License-MIT-78c51c.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-4285F4.svg)](CHANGELOG.md)
[![Docs: Google Search Central](https://img.shields.io/badge/docs-Google%20Search%20Central-4285F4.svg)](https://developers.google.com/search)
[![Works with](https://img.shields.io/badge/skill%20for-Claude%20·%20Codex%20·%20Cursor%20·%20Gemini%20·%20Copilot-000.svg)](#-install-as-a-skill)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## What is this?

Three things in one repository:

1. **A knowledge base of Google's SEO guidance** (`docs/01`–`docs/17`), distilled from [Google Search Central](https://developers.google.com/search) and [web.dev](https://web.dev), every claim cited. Docs 01–11 cover the page; 12–17 cover crawling and crawl budget, indexing and canonicals, content quality and the spam policies, measurement, migrations, and off-page authority.
2. **A skill** that installs into whichever agent you use, so "audit my SEO" activates the whole workflow without you pasting anything.
3. **Two tools that run** (`tools/`) — because reading a repository tells you what a project *intends*, and only a request tells you what the server *returns*.

> The tools are not decoration. Tested against five production sites before release, `seo-audit.mjs` found two live P1 blockers — a `Disallow: /_next/` breaking rendering, and a template returning 200 for every URL under it — that source review had not surfaced.

---

## 🚀 Install as a skill

```bash
git clone https://github.com/umutxyp/Seo-Promt-Master.git
cd /path/to/your-project
bash /path/to/Seo-Promt-Master/install.sh
```

That copies the knowledge base and tools into `.seo-prompt-master/` and writes the entry point each agent actually reads:

| Agent | File it discovers |
|---|---|
| **Claude Code** | `.claude/skills/seo-audit/SKILL.md` |
| **OpenAI Codex CLI**, Amp, Jules | `AGENTS.md` |
| **Cursor** | `.cursor/rules/seo-prompt-master.mdc` |
| **Gemini CLI** | `GEMINI.md` |
| **GitHub Copilot** | `.github/copilot-instructions.md` |

Then just ask: **"run the SEO audit"**. The agent finds the workflow itself.

An existing `AGENTS.md` or `GEMINI.md` is appended to, never replaced, and re-running the installer is safe.

**Prefer not to install?** Drop the repo next to your project — most agents auto-discover `AGENTS.md` and start on their own. Or paste `START.md` into any chat assistant and say "begin at Phase 0". Or ignore the automation entirely and read [`docs/README.md`](docs/README.md) as a current, cited SEO reference.

---

## 🛠️ The tools

```bash
# The thorough pass — sample the sitemap, audit each page, score it
node tools/seo-audit.mjs --url https://example.com --max 40 --md report.md

# The ten-second deploy tripwire
SEO_SMOKE_404_PATHS="/ /blog /products" bash tools/seo-smoke.sh https://example.com
```

Zero dependencies. Node 18+ for the auditor, `curl` and `awk` for the smoke test. Both exit non-zero on failure, so either can gate a deploy or a CI job. Both work against `http://localhost:3000`.

**What `seo-audit.mjs` catches that reading code cannot:**

- **Soft 404s per template** — a route answering 200 for URLs that do not exist. In frameworks with Suspense boundaries this has no visible symptom at all; a `loading.tsx` above one segment silently turns that whole template's 404 into a 200 shell.
- **One-way hreflang** — a set that is not reciprocal is discarded *in full*, so every language in the cluster loses the signal. Only visible by comparing pages against each other.
- **Streamed metadata** — frameworks that flush `<head>` early and emit `<title>` later. Browsers hoist it; bots that stop reading at `</head>` see an untitled page.
- Plus: robots.txt against RFC 9309 group semantics, blocked render-critical paths, sitemap limits and `lastmod` credibility, host consolidation, canonical self-reference and duplicate titles, JSON-LD validity, `aggregateRating` with no ratings behind it, raw-HTML content volume, image dimensions.

**What it deliberately cannot see**, and so stays your job: content quality (`docs/14`), off-page authority (`docs/17`), and real field Core Web Vitals, which come from CrUX rather than from fetching a page (`docs/05`). A high score means the technical foundation is sound — not that the site will rank.

See [`tools/README.md`](tools/README.md).

---

## 📂 What's inside

```
seo-prompt-master/
├── install.sh                ← writes the skill into your project, for every agent
├── VERSION · CHANGELOG.md    ← semver; a major means old scores aren't comparable
│
├── .claude/skills/seo-audit/SKILL.md    ← Claude Code
├── AGENTS.md                            ← Codex, Amp, Jules (and most others)
├── .cursor/rules/seo-prompt-master.mdc  ← Cursor
├── GEMINI.md                            ← Gemini CLI
├── .github/copilot-instructions.md      ← GitHub Copilot
├── CLAUDE.md · START.md                 ← the workflow itself
│
├── tools/                    ← the parts that run
│   ├── seo-audit.mjs            live audit, scored, exits 1 on any P1
│   ├── seo-smoke.sh             deploy tripwire
│   └── README.md
│
├── prompts/                  ← the 5-phase workflow (+ 1 optional)
│   ├── 00-bootstrap.md          detect stack, load docs, run the audit tool
│   ├── 01-discover-routes.md    enumerate & classify every route
│   ├── 02-audit-page.md         9-point audit per public page
│   ├── 03-prioritize-fixes.md   one ordered backlog (infra-first)
│   ├── 04-apply-and-verify.md   fix + typecheck/lint/build + prove it
│   └── 05-live-signals.md       optional: field data via MCP
│
├── docs/                     ← the knowledge base (source of truth)
│   ├── 01-meta-and-head.md              06-sitemaps.md
│   ├── 02-internationalization.md       07-image-seo.md
│   ├── 03-ugc-forums-blogs.md           08-structured-data.md
│   ├── 04-page-structure.md             09-2024-2026-updates.md
│   ├── 05-rendering-and-core-web-vitals.md
│   ├── 10-ai-crawlers-and-geo.md        11-scoring-rubric.md
│   │
│   ├── 12-crawling-and-robots.md        RFC 9309, crawl budget, log analysis
│   ├── 13-indexing-and-duplicates.md    canonicals, facets, soft 404s, GSC states
│   ├── 14-quality-eeat-and-spam.md      the 16 spam policies, scaled content
│   ├── 15-measurement-and-verification.md  GSC, BigQuery, proving a change
│   ├── 16-migrations-and-incidents.md   redirect maps, rollback, hack response
│   └── 17-offpage-and-entity-authority.md  links, digital PR, entity building
│
├── verticals/                ← 24 industry overlays (optional, additive)
├── checklists/               ← quick pass/fail lists
├── templates/                ← output files the AI fills in
└── examples/                 ← a worked example
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

Progress lives in `ROUTES-INVENTORY.md` and `SEO-AUDIT-PROGRESS.md`, so a long run survives a context reset and resumes instead of restarting.

---

## ✅ What it checks

Metadata · Canonical + hreflang · Robots and indexing · Structured data · Headings and semantics · Images · Internal links and pagination · Rendering · Sitemap — every rule tracing to a cited section in `docs/`.

**The output is a number with its working shown:** a deterministic **SEO Score** and **GEO Score** out of 100 ([`docs/11`](docs/11-scoring-rubric.md)), each with a per-category breakdown. A P1 crawl/index blocker caps a page's score no matter what else it gets right — a page that cannot be indexed does not benefit from polish. No score is reported as final without full coverage plus a self-recheck of a random sample. And it is a technical-readiness score, stated as such every time: backlinks, content quality and competition are out of scope.

---

## ❤️ Why it exists

Most SEO checklists are shallow, generic, or quietly out of date. This one is:

- **Current.** It is explicit about what changed: INP replaced FID in March 2024, FAQ rich results were removed in May 2026, `rel=next/prev` has been unused since 2019, Google does not support IndexNow, `llms.txt` is not required. Advice that repeats any of those is old, and the knowledge base says so.
- **Cited.** Every claim links to Google's own documentation. If something is not in `docs/`, the agent is instructed to say "not covered by the knowledge base" rather than recall it from training data.
- **Executable.** An agent can run it against your code *and* your server, not just read it.
- **Honest about its limits.** It separates ranking factors from hygiene, logs deliberate skips, and names the three things it cannot measure.

---

## 👤 Author

**Umut Bayraktar** — [@umutxyp](https://github.com/umutxyp)

Full-stack developer and AI-systems researcher. Founder at **Codeshare Technology**.

The methodology comes out of running these, not out of theory:

- ⛏️ **[MCStat.org](https://mcstat.org)** — Minecraft server list, 6.7K servers and ~250K players tracked daily
- 🎵 **[Beatra](https://beatra.app)** — Discord music bot, 32.8K servers and 2.1M+ users
- 💬 **[JustDiscord](https://justdiscord.org)** — Discord server and bot list, 16K+ listings across 21 languages
- 🛒 **[Codeshare](https://codeshare.me)** — digital marketplace for code, licences and services
- 🛡️ **[Sylon](https://sylon.app)** — AI-powered Discord moderation

🔗 [Portfolio](https://umutbayraktar.vercel.app) · [GitHub](https://github.com/umutxyp) · [Codeshare](https://codeshare.me)

If this saved you time, **star the repo**. 🌟

---

## 📄 License

[MIT](LICENSE) © Umut Bayraktar ([@umutxyp](https://github.com/umutxyp)).
Knowledge base compiled from public Google Search Central and web.dev documentation; all trademarks belong to their owners. Not affiliated with or endorsed by Google.

---

## 🤝 Contributing

Google's guidance moves. PRs that update a rule with a source link, add a framework recipe, or add a check to `tools/` are very welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).
