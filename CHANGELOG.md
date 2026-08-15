# Changelog

Versions follow semver. A major version means the workflow, the file layout or
the scoring changed in a way that makes old output no longer comparable.

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
