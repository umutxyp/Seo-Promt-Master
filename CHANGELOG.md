# Changelog

Versions follow semver. A major version means the workflow, the file layout or
the scoring changed in a way that makes old output no longer comparable.

## 2.2.0 — 2026-11-11

The knowledge base re-checked claim by claim against the engines' own
documentation, a sitemap ramp-up for new sites, and an auditor that reads
robots.txt the way Google and Bing do.

### `seo-audit.mjs`

- **A robots.txt answering 429 is a server error.** It was reported as an
  ordinary 4xx ("your rules are ignored"); Google treats 429 like a 5xx and
  stops crawling the site, so it is now a P1 that says so.
- **Bing's Crawl-delay from the default group is caught.** Bing applies a
  `Crawl-delay` in `User-agent: *` even when a `bingbot` group exists.
- **The AIPREF training token** (`User-agent: __usage_ai-training`) counts as
  a deliberate AI-crawler position, like per-bot groups and `Content-Signal`.
- **30 crawlers, up from 24:** Meta-WebIndexer, Meta-ExternalFetcher,
  Amzn-SearchBot, Amzn-User, MistralAI-Index and MistralAI-Training, with the
  Amazonbot, MistralAI-User and Bingbot descriptions corrected.

### Knowledge base — every doc checked against the engines' current documentation

All 18 docs and the 24 verticals were re-read claim by claim against Google,
Bing, Apple, Yandex and the AI operators' own pages (November 2026). The
changes that matter most:

- **Grow a new site's sitemap, don't dump it** (`docs/06`, the workflow, the
  sitemap prompt, `verticals/15`, `16`, `23`): a seed set of the best few
  hundred URLs, then small batches that pass the index threshold, paused when
  *Discovered – currently not indexed* grows — with Google's documented
  reasons, and the schedule clearly marked as practice.
- **FAQ rich results are gone for every site** (7 May 2026), as are the
  sitelinks search box and the rich results retired in 2025. Product,
  review, LocalBusiness, SoftwareApplication, Recipe, JobPosting and Article
  required fields now match Google's pages; ratings aggregated from other
  websites are never allowed, even with attribution.
- **AI features have an opt-out:** the Search Console "Search generative AI"
  setting (`docs/09`, `docs/15`), and Google's own Generative AI performance
  report. Snippet controls govern AI answers at Google, Bing and Apple.
- **robots.txt status codes** as Google documents them (429, the 30-day rule,
  redirects), 429/503 for one or two days at most, and Google's real
  crawl-budget thresholds (`docs/12`).
- **AI crawler table** (`docs/10`): Google's user-triggered fetchers, Amazon,
  Mistral and Meta search crawlers, AIPREF, OpenAI's ads bot.
- Smaller corrections across `docs/01`, `03`, `05`, `07`, `11`, `13`, `14`,
  `16`, `17`, `18` and the verticals — policy names, Google News inclusion,
  Change of Address, disavow, redirects, moved and dead source links.
- **Google's update timeline is current again.** `docs/09` listed core updates
  only up to August 2024; it now carries every ranking update from March 2024 to
  the November 2026 core update (started 10 November, still rolling out), with
  the durations Google published, and points at the Search Status Dashboard as
  the authoritative list.
- **How to measure an update** (`docs/09`): wait for completion plus a full
  week, compare with the week before the rollout began, and don't compare a
  seasonal peak against an ordinary week. Smaller core updates run unannounced,
  so recovery need not wait for the next named one (`docs/09`, `docs/14`).
- **Discover core updates** (`docs/09`, `verticals/12`): the February 2026
  update, Google's stated goals, and what they mean for images, titles and
  clickbait. Traffic-drop diagnosis (`docs/15`, the monitoring prompt) now
  separates a Discover drop from a Search drop.
- **Site reputation abuse in the EEA** (`docs/14`): since 30 August 2026, its
  manual actions no longer affect results for searches in the EEA.
- Fixed: `docs/09` said the helpful content system was "folded into quarterly
  quality signals through 2024–2025"; it became part of core ranking in March
  2024, as `docs/14` already said. `docs/14` no longer dates the "Who, How, and
  Why" guidance to December 2025, and no longer presents a press reading of the
  June 2026 spam update's targets as Google's own statement.

### Security

- **TLS certificates are verified by default, and `--insecure` says what it
  does.** The flag remains an explicit opt-in for your own self-signed staging
  server; it turns verification off for the whole run, so the tool now warns on
  stderr, records `tlsVerified` in the JSON and Markdown reports, and the help
  and guides recommend `NODE_EXTRA_CA_CERTS`, which keeps verification on.
- **HTML is read the way a browser reads it.** An end tag with whitespace or
  attributes before its `>` (`</script >`) no longer leaks a script into the
  page text — which could make a client-rendered shell look server-rendered —
  and comments are stripped. A tag name ends where a browser ends it, so a
  `"</script-x>"` string does not close a script and `<title-bar>` is neither
  the title nor stripped; a comment, script or style left open runs to the end
  of the page. Character references are decoded in one pass: `&amp;lt;` is the
  text `&lt;`, not `<`; numeric references are decoded too.
- The CI workflow's token is limited to `contents: read`.

## 2.1.0 — 2026-10-03

Beyond Google, a prompt library, and an audit tool that now catches what it
claimed to catch.

### `seo-audit.mjs`

- **Every engine, not just Google.** robots.txt is now resolved per RFC 9309
  (one group per crawler, longest match, `Allow` wins ties, `*`/`$`) for 24
  crawlers: Googlebot, Bingbot, YandexBot, Applebot (inheriting the Googlebot
  group, as Apple documents), DuckDuckBot, Baiduspider, Naver's Yeti, SeznamBot
  and 16 AI crawlers. The report prints the full **crawler access matrix**. A
  blocked Bingbot is a P1 — it takes DuckDuckGo, Yahoo and Copilot with it.
- **Checks that were claimed but missing now exist:** canonicals pointing at a
  redirect, an error or a `noindex` page; `noindex` sent in the `X-Robots-Tag`
  header; sitemap URLs that redirect or that robots.txt blocks; render-critical
  scripts and stylesheets blocked for Googlebot (read from the page, instead of
  guessing at `/static/`-style paths whether the site used them or not).
- **New checks:** multiple canonicals, missing viewport, missing `<html lang>`,
  `Product` with no offers/review/rating, empty `BreadcrumbList`,
  `aggregateRating` without `ratingValue`, `nosnippet`/`noarchive`/`nocache`
  (AI-answer controls), a lazy first image on the homepage, `Crawl-delay` that
  throttles Bing, robots.txt served as HTML, an HTTP-only origin.
- **GEO Score**, computed across the six `docs/11` rows, with heuristic rows
  labelled. The SEO Score now shows **where the points went** per category and
  no longer counts the AI-crawler decision against SEO (it is a GEO row).
- **Bot protection is recognised.** A Cloudflare/Akamai/Imperva challenge was
  scored as a P1 on every page — on one production site, eleven false P1s and a
  score of 0. It is now reported once, with what to verify, and not scored.
- Fixed: `data-src` was read as `src`; the soft-404 probe hit `/undefined` for
  the homepage's prefix; host-consolidation probes dropped the port and
  reported `localhost` as its own duplicate; a homepage that redirects (to a
  locale, say) was dropped from the audit instead of followed; the report said
  `1.0.0` whatever the version; `--insecure` was documented but did nothing.
- `.xml.gz` sitemaps; `--fail-on P1|P2|never`; `--404-paths`; `--user-agent`;
  `--version`; input validation. Runs with `npx github:umutxyp/Seo-Promt-Master`.

### `seo-smoke.sh`

- The `noindex` check missed `<meta content="noindex" name="robots">` (attribute
  order), single quotes, `googlebot`/`bingbot` metas and the `X-Robots-Tag`
  header. It now catches all of them.

### Knowledge base

- **`docs/18` Beyond Google** — Bing (and what is built on it), Yandex
  (`Clean-param`, the obsolete `Host:`), Apple/Safari (Applebot,
  Applebot-Extended), Brave, DuckDuckGo, Naver, Seznam, Baidu, and IndexNow.
- **`docs/10`** — the AI-crawler list rebuilt as a provider table (training /
  AI search / user-triggered), retired tokens (`anthropic-ai`, `Claude-Web`)
  called out, `Content-Signal:`, and the snippet controls that govern AI answers.
- `docs/05` no longer lists TTFB as if it were a Core Web Vital; viewport added.
- The README's "FAQ rich results were removed in May 2026" contradicted
  `docs/08` (restricted to government and health sites since August 2023). The
  README now says what the knowledge base says.
- Stale "01–11" ranges across prompts and entry points brought up to 01–18.

### New

- **`prompt-library/`** — 47 copy-paste prompts in 8 categories, plus a
  `prompts.csv` (prompts.chat-compatible) generated from the Markdown.
- **`GUIDE.md`** and **`GUIDE.tr.md`** — usage guides in English and Turkish.
- **`tests/`** and a CI workflow — both tools run against a healthy and a broken
  fixture site; repository checks verify every `docs/NN` citation and relative
  link resolves.
- `package.json`, so the auditor runs with `npx` and `npm test` works.

## 2.0.5 — 2026-08-15

- **Subject matching folds both sides the same way.** A display name carrying
  decorative Unicode and runs of spaces was reported as absent from a page it
  was plainly on: the heading kept its whitespace while the extracted text had
  been collapsed, and mathematical letterforms do not lowercase to their ASCII
  equivalents. Both sides are now normalised before comparison.
- Documented why the check is close to self-satisfying when the page has an
  `<h1>` — that is the answer to the question being asked, not a bug.

## 2.0.4 — 2026-08-15

- **`Content-Signal:` counts as an AI-crawler decision.** The check looked only
  for per-bot `User-agent` groups, so a site declaring `Content-Signal:
  ai-train=no, search=yes, ai-input=yes` — the newer machine-readable form, one
  line saying the same thing — was reported as having no position at all.

## 2.0.3 — 2026-08-15

- **An image whose box is reserved by CSS is no longer reported as a layout-shift
  risk.** Google asks for `width`/`height` *or* reserved space — an aspect-ratio
  box is the documented alternative, not a workaround. The check now recognises
  an image that fills a sized container (`size-full`, `w-full h-full`, `absolute
  inset-0`, an explicit `aspect-*`, or inline sizing) and stays quiet. On one
  site this was 113 findings, every one of them wrong; a checker that noisy is a
  checker people learn to ignore. Genuinely unreserved images are still flagged.

## 2.0.2 — 2026-08-15

- **The client-rendered-shell check no longer cries wolf on unusual names.** A
  profile titled `❦`, a track called `呼喚`: the subject was too short to search
  for, so the check fell back to the page title — and a title is often a
  constructed sentence ("X Discord Profile on Sylon") that appears nowhere in
  the body even on a page that renders perfectly. The title is now a fallback
  only for pages with no `<h1>` at all, and a subject with fewer than four
  characters (after stripping combining marks, punctuation and symbols) is
  skipped rather than guessed at. Every such case seen in testing was a false
  positive, and a check that fires on unusual names is worse than no check.

## 2.0.1 — 2026-08-15

Three fixes to `seo-audit.mjs`, all found by running it across five production
sites rather than by reading it.

- **Thin content and a client-rendered shell are no longer the same finding.**
  A flat word-count threshold reported 29 false P2s on a site whose profile
  pages are server-rendered and simply small. The check now asks whether the raw
  HTML contains the page's own subject — its `<h1>`, or its title with the site
  suffix trimmed. Absent means the content arrives with JavaScript (P2,
  `docs/05`); present but short means there is not much there (P3, `docs/14`).
- **The `<title>` no longer leaks into the body text.** `<head>` was not
  stripped before extracting visible text, so a page whose entire content is
  client-rendered appeared to contain its own subject — because the subject was
  also its title. That silently hid the exact pages the check exists to find.
- **A page with no `<h1>` is judged by its title instead of skipped.** The worst
  shells render their heading client-side too, so "no h1" was excluding the most
  broken pages from the most relevant check.

## 2.0.0 — 2026-08-15

The release that stops this being only a prompt.

### It runs now

- **`tools/seo-audit.mjs`** — a real audit against a live origin or a local
  build. Zero dependencies, Node 18+. Checks robots.txt against RFC 9309 group
  semantics, sitemap traversal and limits, `lastmod` credibility, host
  consolidation, **per-template soft 404s**, canonical self-reference, **hreflang
  reciprocity across pages**, duplicate titles, streamed-metadata visibility,
  raw-HTML content volume, JSON-LD validity, and image dimensions. Emits a
  computed score, Markdown and JSON, and exits `1` on any P1 so it can gate a
  deploy.
- **`tools/seo-smoke.sh`** — the ten-second deploy tripwire: production
  `noindex`, robots.txt sanity, canonical and JSON-LD still rendering, and 404s
  **per template** via `SEO_SMOKE_404_PATHS`.
- **`tools/README.md`** — what each one covers, and the three things they
  deliberately cannot see.

Both were tested against five production sites before release. The audit tool
found two live P1s (a `Disallow: /_next/` blocking render, and a template
soft-404ing an entire section) that a source-only review had not surfaced.

### It installs as a skill

`install.sh` drops the knowledge base into a target project and writes the entry
point each agent actually reads:

| Agent | File |
|---|---|
| Claude Code | `.claude/skills/seo-audit/SKILL.md` |
| Codex, Amp, Jules | `AGENTS.md` |
| Cursor | `.cursor/rules/seo-prompt-master.mdc` |
| Gemini CLI | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |

Existing `AGENTS.md` / `GEMINI.md` files are appended to rather than replaced,
and re-running is safe.

### The knowledge base grew where it was thinnest

Six new documents, taking it from 11 to 17. The previous docs covered what to
put on a page; these cover the mechanisms around it:

- **`docs/12` Crawling, robots.txt & crawl budget** — RFC 9309 semantics,
  response-code behaviour, the crawler table, capacity vs demand, log analysis.
- **`docs/13` Indexing, canonicals & duplicates** — which instrument for which
  job, the duplicate taxonomy, faceted navigation, soft 404s, reading GSC index
  states, index bloat.
- **`docs/14` Content quality, E-E-A-T & spam policies** — all 16 spam policies,
  the line on AI-assisted content, the directory/UGC threshold rule, manual
  action recovery.
- **`docs/15` Measurement & verification** — Search Console reports, BigQuery,
  the KPI set, and the traffic-drop diagnosis flow.
- **`docs/16` Migrations & incident response** — the five-source URL inventory,
  redirect rules, rollback criteria, hack response.
- **`docs/17` Off-page & entity authority** — link quality, digital PR, disavow
  as a last resort, entity building.

### Fixed

- The `<title>` and canonical of any page whose framework **streams metadata**
  (Next.js 15+ and friends) were previously invisible to head-only parsing. The
  audit tool now reads the whole document and reports the streaming itself as a
  finding, since bots that stop at `</head>` genuinely do see an untitled page.
- hreflang validation is case-insensitive, per Google. `zh-tw` is not an error.

## 1.0.0

Initial release: `docs/01`–`11`, `verticals/01`–`24`, the five-phase prompt
workflow, checklists, templates, and the `docs/11` scoring rubric.
