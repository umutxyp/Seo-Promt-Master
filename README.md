<div align="center">

# 🔍 SEO Prompt Master

### Google SEO — the full docs, as an AI prompt machine.

**Drop this repo into your AI coding assistant. It auto-detects the workflow, maps every public route of your site, audits each page against Google's official SEO rules, and fixes the gaps — step by step, nothing left out.**

[![License: MIT](https://img.shields.io/badge/License-MIT-78c51c.svg)](LICENSE)
[![Docs: Google Search Central](https://img.shields.io/badge/docs-Google%20Search%20Central-4285F4.svg)](https://developers.google.com/search)
[![Works with](https://img.shields.io/badge/works%20with-Claude%20·%20GPT%20·%20Gemini%20·%20Cursor-000.svg)](#-how-to-use)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## What is this?

**SEO Prompt Master** is two things in one repo:

1. **A complete, up-to-date knowledge base** of Google's SEO guidance (`docs/`), distilled from [Google Search Central](https://developers.google.com/search) and [web.dev](https://web.dev), split into 9 focused, cited topics.
2. **A self-executing prompt workflow** (`START.md` + `prompts/`) that turns any AI coding assistant into an autonomous SEO auditor for **your** codebase.

You don't read a 200-page guide and try to remember it. You hand the whole thing to your AI, and it does the audit-and-fix loop **for your actual routes**, citing the exact rule behind every change.

> Built from a real audit of a **40-locale, 574K-concurrent-user** production site ([mcstat.org](https://mcstat.org)) — the methodology is battle-tested, not theoretical.

---

## 🚀 How to use

### Option A — inside an AI coding tool (Claude Code, Cursor, Copilot, Gemini CLI, …)
1. Copy this folder into your project (or open it alongside your repo).
2. Tell your assistant:
   > **"Read `START.md` and run the workflow on this project."**
3. It will produce `ROUTES-INVENTORY.md` and `SEO-AUDIT-PROGRESS.md`, then fix issues page by page, verifying as it goes.

### Option B — chat assistant (Claude, ChatGPT, Gemini web)
1. Paste the contents of `START.md` (and, if it fits, the `docs/`).
2. Give it your repo (zip, paste files, or connect the tool to your codebase).
3. Say **"Begin at Phase 0."**

### Option C — just the knowledge
Read `docs/` as a clean, current reference for Google SEO. Start at [`docs/README.md`](docs/README.md).

---

## 📂 What's inside

```
seo-prompt-master/
├── START.md                  ← the bootstrap prompt (AI reads this first)
├── prompts/                  ← the 5-phase workflow
│   ├── 00-bootstrap.md          detect stack + load knowledge base
│   ├── 01-discover-routes.md    enumerate & classify every route
│   ├── 02-audit-page.md         9-point audit per public page
│   ├── 03-prioritize-fixes.md   one ordered backlog (infra-first)
│   └── 04-apply-and-verify.md   fix + typecheck/lint/build + prove it
├── docs/                     ← the knowledge base (source of truth)
│   ├── 01-meta-and-head.md
│   ├── 02-internationalization.md
│   ├── 03-ugc-forums-blogs.md
│   ├── 04-page-structure.md
│   ├── 05-rendering-and-core-web-vitals.md
│   ├── 06-sitemaps.md
│   ├── 07-image-seo.md
│   ├── 08-structured-data.md
│   └── 09-2024-2026-updates.md
├── checklists/               ← quick pass/fail lists
│   ├── public-page-checklist.md
│   └── infrastructure-checklist.md
├── templates/                ← output files the AI fills in
│   ├── routes-inventory.md
│   └── audit-progress.md
└── examples/                 ← a worked example
```

---

## 🧠 The workflow in one picture

```
START.md
  │
  ├─ Phase 0  Bootstrap ......... detect framework, rendering, i18n; load docs/
  ├─ Phase 1  Discover .......... list EVERY route → ROUTES-INVENTORY.md
  │                               classify: public-index / public-noindex / private
  ├─ Phase 2  Audit ............. 9-point check per public page → SEO-AUDIT-PROGRESS.md
  ├─ Phase 3  Prioritize ........ one backlog, infra-first (P1 → P2 → P3)
  └─ Phase 4  Fix & verify ...... change → typecheck/lint/build → prove → tick
```

---

## ✅ What it checks (the 9 points)

Metadata · Canonical + hreflang · Robots/indexing · Structured data (JSON-LD) · Headings & semantics · Images · Internal links & pagination · Rendering (SSR/CSR) · Sitemap.

Every rule traces to a cited section in `docs/`. See [`checklists/public-page-checklist.md`](checklists/public-page-checklist.md).

---

## ❤️ Why it exists

Most "SEO checklists" are shallow, outdated, or generic. This one is:
- **Current** (2024–2026: Helpful Content, core updates, AI Overviews, the 2024 Starter Guide refresh).
- **Cited** (every claim links to Google's own docs).
- **Executable** (an AI can actually *run* it on your code, not just read it).
- **Honest** (it distinguishes ranking factors from a11y-only niceties, and logs deliberate skips).

---

## 👤 Author

**Umut Bayraktar** — [@umutxyp](https://github.com/umutxyp)

Full-stack developer (React · Next.js · Node.js · PostgreSQL) & AI-systems tinkerer. Founder at **Codeshare Technology**. Antalya, Turkey.

Building things people actually use:
- 🎵 **[Beatra](https://beatra.app)** — multi-platform Discord music bot (1.2M+ users)
- 🛡️ **[Sylon](https://sylon.app)** — AI-powered Discord moderation (20K+ users)
- 🧩 **[Codeshare](https://codeshare.me)** — digital marketplace for code & content (15K+ users)
- ⛏️ **[McStat.org](https://mcstat.org)** — Minecraft server stats (574K+ concurrent players) — *the site this toolkit was forged on*

🔗 **Links:** [Portfolio](https://umutbayraktar.vercel.app) · [GitHub](https://github.com/umutxyp) · [Codeshare](https://codeshare.me)
⭐ Notable OSS: [MusicBot](https://github.com/umutxyp/MusicBot) (1.3k★) · [Personal-Website](https://github.com/umutxyp/Personal-Website) · [Discord-Bot-Website](https://github.com/umutxyp)

If this saved you time, **star the repo** and share it. 🌟

---

## 📄 License

[MIT](LICENSE) © Umut Bayraktar ([@umutxyp](https://github.com/umutxyp)).
Knowledge base compiled from public Google Search Central & web.dev documentation; all trademarks belong to their owners. This project is not affiliated with or endorsed by Google.

---

## 🤝 Contributing

Google's guidance evolves — PRs that update a rule (with a source link) or add a framework recipe are very welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
