# Usage guide

Everything you need to go from "I want better SEO" to a fixed, verified site. Read the section that matches what you have; you don't need the rest.

**[Türkçe rehber →](GUIDE.tr.md)**

- [1. Pick your path](#1-pick-your-path)
- [2. Path A — audit a live site in one minute](#2-path-a--audit-a-live-site-in-one-minute)
- [3. Path B — let a coding agent audit and fix your project](#3-path-b--let-a-coding-agent-audit-and-fix-your-project)
- [4. Path C — use a single prompt](#4-path-c--use-a-single-prompt)
- [5. Reading the report](#5-reading-the-report)
- [6. Keep it fixed: CI and deploy checks](#6-keep-it-fixed-ci-and-deploy-checks)
- [7. Beyond Google](#7-beyond-google)
- [8. Troubleshooting & FAQ](#8-troubleshooting--faq)

---

## 1. Pick your path

| You have… | Use | You get |
|---|---|---|
| A URL, nothing else | **Path A** — the audit tool | A scored report in about a minute |
| The project's code and an AI coding agent | **Path B** — the skill | Audit → prioritized backlog → fixes in the code → re-verified score |
| A specific question ("is my robots.txt right?", "why did traffic drop?") | **Path C** — the prompt library | A copy-paste prompt for that job |

The paths combine well. A typical first week: run Path A to see where you stand, run Path B to fix things, and use a Path C prompt for the content and AI-visibility work the tool can't measure.

---

## 2. Path A — audit a live site in one minute

**Requirement:** Node.js 18 or newer (`node --version`). Nothing else.

```bash
npx github:umutxyp/Seo-Promt-Master --url https://your-site.com --md seo-report.md
```

`npx` downloads the repository and runs the auditor. There is nothing to install and nothing left behind in your project. If you've cloned the repo, `node tools/seo-audit.mjs` is the same thing.

What it does, in order:
1. Reads `robots.txt` and resolves it for every major search engine and AI crawler.
2. Probes host consolidation (`http://` and `www` variants).
3. Reads the sitemap (including sitemap indexes and `.xml.gz` files) and **samples across it**, not just its first entries, because the first N entries of a catalogue are usually all one template.
4. Audits each sampled page, then runs the checks that need several pages at once: hreflang reciprocity, duplicate titles, canonical targets.
5. Probes each template for soft 404s.
6. Computes the SEO and GEO scores and writes the report.

### Useful flags

| Flag | When to use it |
|---|---|
| `--max 80` | Larger sites. More pages give better coverage and a longer run. Default 40. |
| `--404-paths "/blog /products /u"` | Add the template roots you know about, so each one is probed for soft 404s |
| `--json report.json` | Feed the results into another tool or a dashboard |
| `--fail-on P2` | Make CI stricter (default `P1`; `never` always exits 0) |
| `--url http://localhost:3000` | Audit a local build before it ships |
| `--insecure` | A staging server with a self-signed certificate |
| `--user-agent "…"` | A WAF or bot protection blocks the default user agent (see [FAQ](#8-troubleshooting--faq)) |

---

## 3. Path B — let a coding agent audit and fix your project

### Install (once per project)

```bash
git clone https://github.com/umutxyp/Seo-Promt-Master.git ~/seo-prompt-master
cd /path/to/your-project
bash ~/seo-prompt-master/install.sh
```

This creates `.seo-prompt-master/` (knowledge base, prompts, tools, prompt library) and the entry-point file each agent reads: `.claude/skills/seo-audit/SKILL.md`, `AGENTS.md`, `.cursor/rules/seo-prompt-master.mdc`, `GEMINI.md`, and `.github/copilot-instructions.md`. If `AGENTS.md` and `GEMINI.md` already exist, the installer appends to them rather than overwriting.

> **Windows:** run `install.sh` from Git Bash or WSL. The audit tool itself (`node …/seo-audit.mjs` or `npx`) runs natively in PowerShell.

### Run

Open the project in your agent and say:

> **Run the SEO audit.** The live site is https://your-site.com (or: start the dev server and use localhost).

The agent then works through `START.md`:

| Phase | What happens | File it writes |
|---|---|---|
| 0 Bootstrap | Detects the framework, rendering model and i18n setup; runs the audit tool for a baseline | Stack report |
| 1 Discover | Lists **every** route and classifies it: `public-index`, `public-noindex` or `private` | `ROUTES-INVENTORY.md` |
| 2 Audit | Runs the 9-point check on every indexable page | `SEO-AUDIT-PROGRESS.md` |
| 3 Prioritize | Builds one backlog, infrastructure first, and computes the baseline scores | (same file) |
| 4 Fix & verify | Fixes, then typecheck → lint → build → re-fetch → tick, item by item | (same file) |
| 5 Live signals | Optional: real Core Web Vitals through a connected MCP SEO tool | (same file) |

**Tips that save hours:**
- **Answer the business questions it asks** (for example, "should `/tools/x` be indexed?" or the AI-crawler policy). It is told to ask only those, and to keep working on everything else meanwhile.
- **Long project?** If the session ends, open a new one and say *"resume the SEO audit"*. The two progress files hold everything.
- **Trust, but verify.** The workflow re-checks a random 15% of its own ticks before it calls a score final. You can ask it for the evidence behind any line.

### Updating to a new version

```bash
cd ~/seo-prompt-master && git pull
cd /path/to/your-project && bash ~/seo-prompt-master/install.sh
```

The `.seo-prompt-master/` payload is replaced. Agent entry-point files you already have are left untouched. To refresh them too, delete them first.

---

## 4. Path C — use a single prompt

1. Open [`prompt-library/README.md`](prompt-library/README.md) and pick a category.
2. Copy the `text` block of the prompt you need.
3. Replace every `{{variable}}`.
4. Paste it into any assistant.

The prompts work in plain chat. They work much better when the assistant can see this repository or your project: it can then cite `docs/`, run the tool, and change code. Every prompt tells the assistant to show evidence and to avoid outdated advice.

**Five prompts to start with:**
- [15-minute health check](prompt-library/01-start-here.md#quick-15-minute-health-check-url-only) — when you only have a URL
- [Review and rewrite robots.txt](prompt-library/02-technical-seo.md#review-and-rewrite-robotstxt) — before any launch
- [Write titles and meta descriptions in bulk](prompt-library/03-on-page-and-content.md#write-titles-and-meta-descriptions-in-bulk)
- [Decide the AI-crawler policy](prompt-library/05-geo-ai-search.md#decide-the-ai-crawler-policy)
- [Diagnose a traffic drop](prompt-library/07-monitoring-and-diagnosis.md#diagnose-a-traffic-drop)

---

## 5. Reading the report

### Severities

| | Meaning | What to do |
|---|---|---|
| **P1** | Crawl or index blocker: the page may not be indexed at all | Fix before anything else. Any P1 caps the page's score at 60. |
| **P2** | Indexed, but misrepresented (wrong canonical, broken structured data, content only rendered by JavaScript…) | Fix next |
| **P3** | Hygiene and polish | Batch these, starting with shared components |

Every finding names the doc it comes from (`docs/13`). Open that doc to see the rule and its official source.

### The two scores

- **SEO Score** — technical search readiness, computed from the findings. The "Where the points went" table shows which `docs/11` category cost the points.
- **GEO Score** — readiness for AI answer engines: an explicit AI-crawler policy, content in the server-rendered HTML, extractable structure, an entity with `sameAs`, plus 15% of the SEO Score (AI answers draw on pages that already rank). Rows marked *heuristic* are estimates the tool can't measure exactly. They are labelled, not hidden.
- **"provisional"** means only a sample of the sitemap was fetched. Raise `--max` for broader coverage.
- Neither score measures backlinks, content quality or competition. A high score means the foundation is sound, not that the site will rank.

### The crawler access table

This table shows, for each crawler, whether it may fetch your homepage and which robots.txt group decided it.
- A **search engine** marked ⛔ is almost always a bug. Bingbot blocked also means DuckDuckGo, Yahoo and Copilot lose the site.
- An **AI training** crawler marked ⛔ is a legitimate choice. An **AI search** crawler marked ⛔ means that product won't cite you. Make each decision on purpose — `docs/10` explains the trade-offs.

---

## 6. Keep it fixed: CI and deploy checks

The most expensive SEO bugs are regressions nobody sees: a staging `noindex` that ships, a robots.txt that comes back empty, a template that starts answering 200 for missing pages.

**After every deploy** (10 seconds):

```bash
SEO_SMOKE_404_PATHS="/ /blog /products" bash .seo-prompt-master/tools/seo-smoke.sh https://your-site.com || rollback
```

**In CI (GitHub Actions example):**

```yaml
- run: npm ci && npm run build
- run: npm start & npx --yes wait-on http://localhost:3000
- run: bash .seo-prompt-master/tools/seo-smoke.sh http://localhost:3000
- run: node .seo-prompt-master/tools/seo-audit.mjs --url http://localhost:3000 --max 25 --md seo-report.md
- uses: actions/upload-artifact@v4
  if: always()
  with: { name: seo-report, path: seo-report.md }
```

---

## 7. Beyond Google

Google is the reference engine, but it isn't the only one that matters:

- **Bing** powers its own results, most of **DuckDuckGo** and **Yahoo**, and **Copilot** answers. Verify the site in Bing Webmaster Tools, and add **IndexNow** if content changes often. Don't leave a `Crawl-delay` in robots.txt: Bing obeys it.
- **Safari** sends searches to Google by default. Apple's own surfaces (Siri, Spotlight, Safari Suggestions) use **Applebot**, which falls back to your Googlebot rules.
- **Brave** follows your Googlebot rules and has no webmaster console.
- **Yandex** needs Yandex Webmaster; use `Clean-param` for tracking parameters.

Details and sources: [`docs/18`](docs/18-other-search-engines.md). Ready-made prompts: [Beyond Google](prompt-library/06-multi-engine.md).

---

## 8. Troubleshooting & FAQ

**"N URLs answered this tool with a bot-protection challenge."**
Cloudflare, Akamai or Imperva challenged the tool's request. From a datacenter IP that's normal, and those pages aren't scored. What matters is whether *real* search crawlers get through. Check Search Console → Settings → Crawl stats for a 403/503 spike, run URL Inspection on one of those URLs, and make sure verified bots are allowed in your WAF. You can also run the tool from your own network, or pass `--user-agent`.

**"No sitemap URLs found."**
There's no `Sitemap:` line in robots.txt and `/sitemap.xml` is missing, so only the homepage was audited. Add a sitemap (`docs/06`), or start with the homepage findings.

**The tool flags a canonical "pointing elsewhere" on purpose.**
That's a P3, worded as a question: it's correct for a variant and a bug for a standalone page. If it's intentional, ignore it.

**Can it check content quality or backlinks?**
No, and it says so. Use the [thin-content triage](prompt-library/03-on-page-and-content.md#triage-thin-and-low-value-pages) and [E-E-A-T audit](prompt-library/03-on-page-and-content.md#e-e-a-t-and-trust-audit) prompts, and `docs/14` and `docs/17`.

**Should I add `llms.txt`?**
It isn't an SEO or GEO lever — see `docs/09`, `docs/10` and [the llms.txt prompt](prompt-library/05-geo-ai-search.md#should-we-add-llmstxt). Having one isn't penalized either.

**Does it work offline or on localhost?**
Yes: `--url http://localhost:3000`. Host-consolidation checks are skipped for localhost, IPs and explicit ports.

**Where are the rules?**
In [`docs/README.md`](docs/README.md). Every rule cites its official source, and if a claim isn't there, the agent is told to say so instead of guessing.
