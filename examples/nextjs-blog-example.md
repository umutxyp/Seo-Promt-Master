# Worked Example — Next.js Blog

A trimmed illustration of what SEO Prompt Master produces on a small Next.js (App Router) blog. Your real output goes to `ROUTES-INVENTORY.md` and `SEO-AUDIT-PROGRESS.md` at the project root.

---

## Phase 0 — Stack Report
- **Framework:** Next.js 15 (App Router), ISR.
- **Rendering:** SSR/SSG mixed; blog posts are SSG.
- **Multilingual:** no.
- **Existing SEO:** `generateMetadata` per route; `app/sitemap.ts`; `app/robots.ts`; no JSON-LD.
- **Verify:** `npm run typecheck` · `npm run lint` · `npm run build`.

## Phase 1 — ROUTES-INVENTORY.md (excerpt)

| Route | Current | Correct | Rendering | Notes / mismatch |
|---|---|---|---|---|
| `/` | public-index | public-index | SSG | ok |
| `/blog` | public-index | public-index | SSG | list — no ItemList JSON-LD |
| `/blog/[slug]` | public-index | public-index | SSG | no Article JSON-LD; missing 404 for bad slug |
| `/tags/[tag]` | public-index | public-index | SSG | pagination is "Load more" button only ❌ |
| `/search` | **public-index** | **public-noindex** | CSR | ⚠️ internal search indexed → noindex |
| `/draft/[id]` | public-index | **public-noindex** | SSR | unpublished drafts must be noindex |
| `/admin/*` | — | private | SSR | not in robots.txt ❌ |

**Mismatches to fix**
- [ ] `/search` indexable → `noindex` when a query is present (`docs/03`)
- [ ] `/tags/[tag]` "Load more" not crawlable → real `?page=n` links (`docs/03`)
- [ ] `/blog/[slug]` returns 200 for bad slug → `notFound()` (`docs/05`)
- [ ] `/admin/*` missing robots Disallow (`docs/01`)

## Phase 2 — SEO-AUDIT-PROGRESS.md (one page)

### Blog post (`/blog/[slug]`) — status: 🔧
- **Metadata:** ✅ dynamic title/description from frontmatter.
- **Canonical/hreflang:** ✅ self-canonical; single-language.
- **Robots:** ✅ index,follow.
- **JSON-LD:** ❌ none → add `BlogPosting` + `BreadcrumbList` (`docs/08`).
- **Headings:** ✅ one h1 (post title).
- **Images:** ⚠️ hero has no width/height (CLS); cover uses `next/image` ok (`docs/07`).
- **Internal links:** ✅ related posts crawlable.
- **Rendering:** ✅ SSG. ❌ bad slug returns soft-404 → `notFound()` (`docs/05`).
- **Sitemap:** ✅ included.
- **Issues:** P1 soft-404 · P2 missing BlogPosting JSON-LD · P3 hero dimensions.

## Phase 3 — Backlog (infra-first)
### P1
- [ ] Add `notFound()` to `/blog/[slug]` and `/tags/[tag]` for unknown params
- [ ] `noindex` `/search` when `?q=` present
- [ ] Convert `/tags/[tag]` "Load more" to `?page=n` links
- [ ] Add `Disallow: /admin` to `app/robots.ts`
### P2
- [ ] `BlogPosting` + `BreadcrumbList` on posts; `ItemList` on `/blog`
### P3
- [ ] `width`/`height` on hero images

## Phase 4 — Verification log (excerpt)
| Item | Change | Evidence | Done |
|---|---|---|---|
| soft-404 | `notFound()` on bad slug | `curl -I /blog/nope` → 404 | ✅ |
| BlogPosting | JSON-LD in `page.tsx` | rendered HTML has `"@type":"BlogPosting"`; build ✅ | ✅ |
| search noindex | `robots:{index:false}` when `q` | `<meta name="robots" content="noindex">` present | ✅ |
