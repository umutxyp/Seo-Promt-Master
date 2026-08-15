---
name: seo-audit
description: Audit and fix a website's technical SEO and AI-search (GEO) readiness against Google's official guidance, page by page, ending in a computed SEO/GEO score. Use when asked to audit SEO, fix indexing or crawling problems, check canonicals/hreflang/sitemaps/structured data, diagnose why pages are not indexed or traffic dropped, prepare a site migration, or make a site visible to AI answer engines. Also use before shipping changes that touch routing, metadata, robots.txt or sitemaps.
---

# SEO audit and repair

You are running **SEO Prompt Master**. Bring every public page of the project in
the working directory into compliance with Google's documented guidance, and
prove it rather than asserting it.

## Before anything else

Read `docs/README.md` for the map, then keep `docs/` open as you work. It is the
**only** source of truth in this skill. If a claim about how Google behaves is
not in `docs/01`–`docs/17`, say "not covered by the knowledge base" instead of
recalling it from memory — the SEO web is full of advice that was true in 2021.

Check `verticals/README.md` for an overlay matching the project's industry. It
adds emphasis; it never replaces the core audit.

## Two ways to learn what is wrong, and you need both

**Read the code** to know what the project intends. **Run the tool** to know what
the server actually does. They disagree more often than anyone expects, and the
gap is where the bugs live.

```bash
node tools/seo-audit.mjs --url https://the-site.example --max 40 --md seo-report.md
```

Zero dependencies, Node 18+. It samples across the sitemap rather than the head
of it, then checks robots.txt against RFC 9309, sitemap limits and `lastmod`
credibility, host consolidation, per-template soft 404s, canonical
self-reference, **hreflang reciprocity across pages** (a one-way set is
discarded in full), duplicate titles, streamed-metadata visibility, raw-HTML
content volume, structured-data validity, and image dimensions. It exits `1` if
any P1 is open, so it can gate a deploy.

Point it at a local build (`--url http://localhost:3000`) when there is no live
site yet.

Three things it deliberately cannot see, which stay your job: whether the
*content* is any good (`docs/14`), off-page authority (`docs/17`), and real
field CWV data, which only CrUX has (`docs/05`).

## The workflow

Follow `START.md`, which holds the full phase-by-phase instructions:

| Phase | File | Output |
|---|---|---|
| 0 — Bootstrap & detect | `prompts/00-bootstrap.md` | Stack report |
| 1 — Discover routes | `prompts/01-discover-routes.md` | `ROUTES-INVENTORY.md` |
| 2 — Audit each page | `prompts/02-audit-page.md` | `SEO-AUDIT-PROGRESS.md` |
| 3 — Prioritise | `prompts/03-prioritize-fixes.md` | P1/P2/P3 backlog + baseline score |
| 4 — Fix & verify | `prompts/04-apply-and-verify.md` | Fixes, each with evidence |
| 5 — Live signals (optional) | `prompts/05-live-signals.md` | Field data, if a live URL exists |

Classify every route as `public-index`, `public-noindex` (internal search, live
tools, auth screens) or `private` (dashboards, admin, API). Getting this wrong
in Phase 1 makes every later phase wrong: a page being *reachable* is not the
same as it *deserving to be indexed*.

## Rules that are not negotiable

1. **Fix shared infrastructure first.** A metadata helper, the sitemap builder,
   `robots.txt`, the i18n layer — one change there fixes hundreds of pages. Per-page
   work afterwards.
2. **Never break the build.** Typecheck, lint and build after every change. If it
   fails, fix it before moving on.
3. **Evidence, not assertion.** A page is not fixed until you have re-fetched it
   and seen the change — `curl` the route, grep the rendered output, or re-run
   the tool. "Should now be correct" is not a result.
4. **Persist progress** to `SEO-AUDIT-PROGRESS.md` as you go. Long runs outlive
   context windows; the file is what survives.
5. **Don't stop between phases to check in.** A site with hundreds of routes is a
   reason to keep working, not a reason to summarise and wait. Stop only if you
   cannot access the repo or run the build, or if a finding needs a genuine
   product decision ("should `/internal-tool` be public at all") — ask that one
   question and keep going on everything else meanwhile.

## Reporting

End with the **SEO Score** and **GEO Score** from `docs/11`: the per-category
breakdown, the coverage status (final vs provisional), and the caveat that
off-page factors are out of scope. A bare number is not a report.

Before calling a score final, re-verify a random ~15% of everything already
marked done by re-reading the actual output, not your notes. Optimistic
copy-paste ticks are the failure mode this catches.
