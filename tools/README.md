# tools/

The workflow in `prompts/` reasons about a codebase. These two run against a
server. Both matter: reading the repository tells you what the project intends,
and only a request tells you what it actually does. They disagree more often
than anyone expects, and the gap is where the bugs live.

Neither has dependencies. `seo-audit.mjs` needs Node 18+ (global `fetch`);
`seo-smoke.sh` needs `curl` and `awk`. Both are tested on every push against a
healthy and a deliberately broken fixture site (`tests/`, `npm test`).

---

## `seo-audit.mjs` — the thorough pass

```bash
npx github:umutxyp/Seo-Promt-Master --url https://example.com   # no clone needed
node tools/seo-audit.mjs --url https://example.com
node tools/seo-audit.mjs --url https://example.com --max 80 --md report.md --json report.json
node tools/seo-audit.mjs --url http://localhost:3000 --max 20      # against a local build
```

| Flag | Default | |
|---|---|---|
| `--url <origin>` | — | Required |
| `--max <n>` | 40 | Pages fetched |
| `--concurrency <n>` | 4 | Parallel requests |
| `--timeout <ms>` | 20000 | Per request |
| `--json <file>` | — | Machine-readable report |
| `--md <file>` | — | Human-readable report |
| `--404-paths "<a b>"` | — | Extra template roots to probe for soft 404s |
| `--fail-on <level>` | `P1` | Exit `1` on `P1`, on `P2` (P1 or P2), or `never` |
| `--user-agent <ua>` | seo-audit UA | Override the User-Agent |
| `--insecure` | — | Accept invalid TLS (staging only) |
| `--quiet` | — | Summary line only |
| `--version` | — | Print the version |

Exit code is `1` when a finding at or above `--fail-on` is open (default: any P1), so it can gate a deploy or a CI job.

### What it checks

**Site level** — robots.txt status, size, HTML-instead-of-text, and RFC 9309
resolution (one group per crawler, longest match wins, `Allow` wins ties,
`*`/`$` wildcards) for **24 crawlers**: Googlebot, Bingbot, YandexBot, Applebot
(falling back to the Googlebot group, as Apple documents), DuckDuckBot,
Baiduspider, Yeti (Naver), SeznamBot, and 16 AI crawlers split into training,
AI search and user-triggered. A blocked Googlebot or Bingbot is P1; a large
`Crawl-delay` that Bing obeys is flagged; an AI policy (per-bot groups or
`Content-Signal:`) is a GEO input, not a defect. Then: sitemap index traversal
(`.xml.gz` included), the 50,000-URL limit, `lastmod` format and credibility,
ignored `priority`/`changefreq`; host consolidation (`http://`, `www` vs bare);
**per-template soft 404s**; bot-protection challenges recognised and reported
once instead of being scored as errors.

**Page level** — status; sitemap URLs that redirect, error, or that robots.txt
blocks; `noindex` from the robots meta, the `googlebot`/`bingbot` meta **and the
`X-Robots-Tag` header**; canonical presence, uniqueness, absoluteness and
self-reference; title and description presence, length and cross-page
uniqueness; Open Graph completeness; `<html lang>`; viewport; `<h1>` count and
heading-level jumps; raw-HTML word count and whether the page's own subject is
in it (AI crawlers do not run JavaScript); render-critical JS/CSS blocked by
robots.txt; image `alt` and dimensions (`data-src` is not mistaken for `src`);
JSON-LD parse validity, `@type`, `Product` without offers/review/rating,
empty `BreadcrumbList`, and `aggregateRating` with no ratings behind it;
`nosnippet` (Google AI features) and `noarchive`/`nocache` (Copilot) on pages;
crawlable internal links.

**Across pages** — hreflang **reciprocity** (a one-way set is discarded in
full, so this is only detectable by comparing pages); duplicate titles and
descriptions; **canonical targets** — a canonical pointing at a redirect, an
error or a `noindex` page.

### Output

An **SEO Score** with a per-`docs/11`-category breakdown ("where the points
went"), a **GEO Score** across the six `docs/11` GEO rows (heuristic rows are
labelled as such), the **crawler access matrix**, and every finding with its
severity, `docs/` rule and category.

### Sampling

It walks the sitemap and samples across it with a stride, rather than taking the
first N entries. On a catalogue the first N are all one template and would hide
every other. Raise `--max` for wider coverage; the report states how many pages
were actually fetched, and `docs/11` requires a score built on partial coverage
to be labelled provisional.

### What it deliberately cannot see

Content quality (`docs/14`), off-page authority (`docs/17`), and real field Core
Web Vitals — those come from CrUX, not from fetching a page (`docs/05`). A high
score here means the technical foundation is sound, not that the site will rank.

---

## `seo-smoke.sh` — the deploy tripwire

```bash
bash tools/seo-smoke.sh https://example.com
SEO_SMOKE_404_PATHS="/ /blog /products /users" bash tools/seo-smoke.sh https://example.com
```

Ten seconds, run after the swap on every deploy. It catches the regressions that
look like nothing in a browser: a staging `noindex` that shipped, a `robots.txt`
that came back empty or blocking, a canonical or JSON-LD block that stopped
rendering, and — per template — a route that started answering 200 for URLs that
do not exist. The `noindex` check reads the robots/googlebot/bingbot meta in
either attribute order **and** the `X-Robots-Tag` header.

**Set `SEO_SMOKE_404_PATHS` to your own template roots.** The default only probes
`/`, and a soft 404 is per-template: a Suspense boundary added above one segment
turns that template's 404 into a 200 shell with no visible symptom anywhere else.
This is not hypothetical — it is the check that catches it.

Two deliberate omissions, both of which look like bugs and are not:

- **No `set -o pipefail`.** `grep -q` exits on first match, closing the pipe and
  making `curl` return 23. With pipefail, every successful match would count as a
  failure.
- **`Disallow: /` is only a failure in the group that applies to search
  crawlers.** Blocking `GPTBot` or `Google-Extended` outright is a deliberate
  AI-training policy (`docs/10`), and flagging it would teach people to ignore
  the script.

### In a deploy script

```bash
npm run build
swap_to_new_release
bash tools/seo-smoke.sh https://example.com || rollback
```

### In CI

```yaml
- run: npm ci && npm run build
- run: npm start & npx --yes wait-on http://localhost:3000
- run: bash tools/seo-smoke.sh http://localhost:3000
- run: node tools/seo-audit.mjs --url http://localhost:3000 --max 25 --md seo-report.md
```
