# 08 — Structured Data (JSON-LD / schema.org)

## Format

- ✅ Google supports **JSON-LD (recommended)**, Microdata, and RDFa — all treated equally when valid. Prefer **JSON-LD**: easiest to maintain, not interleaved with visible markup, and readable even when injected via JS. Place it in a `<script type="application/ld+json">` in `<head>` or `<body>`.

## Policies (mandatory — violations lose rich results or trigger manual actions)

- ✅ Structured data must reflect content **visible to users** on the page.
- ❌ Don't mark up hidden, irrelevant, misleading, or fake content (e.g. fake reviews).
- ❌ Don't create blank/empty pages just to hold markup.
- ✅ The page must **not** be blocked from Googlebot (robots.txt/noindex) if you want the markup used.
- ✅ A rich result requires **all documented required properties** for that type; images in structured data must be crawlable and relevant.
- ⚠️ Valid markup **does not guarantee** a rich result — display is algorithmic.

## Type cheat-sheet (pick what matches the page)

| Page type | Recommended schema |
|---|---|
| Any page | `WebPage` + `BreadcrumbList` |
| Home | + `WebSite` (with `SearchAction`) + `Organization` (add `sameAs` linking to Wikidata/LinkedIn/Crunchbase/official social profiles — the strongest entity-disambiguation signal for both classic knowledge-panel eligibility and GEO cross-engine entity resolution, `docs/10`) |
| Article / blog post | `Article` / `BlogPosting` / `NewsArticle` |
| Product / item with ratings | `Product` + `AggregateRating` + `Review` |
| Listing / category | `ItemList` / `CollectionPage` |
| User / author profile | `ProfilePage` + `Person` |
| Forum thread | `DiscussionForumPosting` (2024+ recommended) or `QAPage` |
| FAQ (visible Q&A) | `FAQPage` — ⚠️ since Aug 2023 the **rich result** is restricted to well-known, authoritative government and health sites; other sites can still emit valid `FAQPage` markup, but don't promise a rich-result CTR lift for it |
| Downloadable app/tool | `SoftwareApplication` / `WebApplication` |
| Glossary / catalog of terms | `DefinedTermSet` + `DefinedTerm` |
| Video | `VideoObject` |
| How-to, recipe, event, etc. | matching type per Google's gallery — ⚠️ `HowTo` rich results were also deprecated (Sept 2023, desktop); markup is still valid schema.org, just no longer eligible for that rich result |

- ⚠️ Don't invent types. `GameServer`, `Studio`, etc. are **not** real schema.org types and Google ignores them. Check https://schema.org before using a type.

## Validate

- Rich Results Test (dev), Rich result status reports (post-deploy), URL Inspection Tool.
- Business value: rich results measurably lift CTR (Google cites case studies of +20–80% CTR).

## Sources
- Intro to structured data — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Structured data general policies — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Search gallery (all types) — https://developers.google.com/search/docs/appearance/structured-data/search-gallery
