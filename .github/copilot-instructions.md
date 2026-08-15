# SEO Prompt Master — Copilot instructions

This repository is a prompt-driven SEO audit-and-fix workflow with a runnable
live audit tool.

When a request touches search visibility — an SEO audit, indexing or crawl
problems, canonicals, hreflang, sitemaps, `robots.txt`, structured data, a
traffic drop, a migration, or AI answer-engine visibility — follow `START.md`
and its phases in order.

**Source of truth:** `docs/01`–`docs/17`, distilled from Google Search Central
and web.dev. Cite the section behind every recommendation (`docs/13 §soft 404`).
If a claim is not in there, say it is not covered rather than recalling it —
much of the SEO advice in training data predates INP replacing FID, the removal
of FAQ rich results, and `rel=next/prev` falling out of use.

**Industry overlays:** `verticals/01`–`24`, additive to the core audit.

**Run the audit rather than only reading the code:**

```bash
node tools/seo-audit.mjs --url https://the-site.example --max 40 --md seo-report.md
```

Zero dependencies, Node 18+. It reports what the server actually returns — soft
404s per template, one-way hreflang sets, canonicals pointing at redirects,
metadata streamed past `</head>` — and exits `1` on any P1 so it can gate CI.

**Rules:** fix shared infrastructure before per-page work; typecheck, lint and
build after every change; a fix counts only once the page has been re-fetched
and checked; persist progress to `ROUTES-INVENTORY.md` and
`SEO-AUDIT-PROGRESS.md`; finish with the `docs/11` SEO and GEO scores including
the category breakdown and the off-page caveat.
