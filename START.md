<!--
════════════════════════════════════════════════════════════════════════
  SEO PROMPT MASTER — AI BOOTSTRAP FILE
  If you are an AI coding assistant (Claude, GPT, Gemini, Cursor, Copilot,
  etc.) and this file is in the repository/context, READ IT FULLY and then
  EXECUTE THE WORKFLOW BELOW. This file is a prompt, not documentation.
════════════════════════════════════════════════════════════════════════
-->

# START HERE — SEO Prompt Master

> **You are an AI assistant. This file activates an autonomous, step-by-step SEO audit-and-fix workflow for the project in your current working directory.** Follow it exactly. Do not skip steps. Do not ask permission to begin — begin.

You have been given a knowledge base (`docs/`), a set of step prompts (`prompts/`), checklists (`checklists/`), and output templates (`templates/`). Your job is to bring **every public page** of the host project into full compliance with Google's official SEO guidance, one page at a time, leaving nothing out.

---

## Ground rules (read once, obey always)

1. **The `docs/` folder is your source of truth.** Every recommendation you make must trace to a rule in `docs/01`–`docs/09`. When you cite a reason, cite the doc section (e.g. "docs/03 §UGC links").
2. **Never break the build.** After any change, run the project's typecheck/lint/build. If it fails, fix it before moving on.
3. **Never invent facts about Google.** If a claim isn't in `docs/`, say "not covered by the knowledge base" rather than guessing.
4. **Work page by page. Persist your progress to a file** so nothing is forgotten across long runs (`SEO-AUDIT-PROGRESS.md`).
5. **Evidence over assertion.** Do not claim a page is "fixed" until you have verified the change (grep the rendered output, run the build, or load the route).
6. **Respect intent.** A page being *technically reachable* is not the same as it *should be indexed*. Distinguish: **public+indexable**, **public-but-noindex** (tools, search results, auth flows), and **private** (dashboards, admin).

---

## The Workflow (5 phases)

Execute these in order. Each phase has a dedicated prompt file with the full instructions — open it and follow it.

### Phase 0 — Bootstrap & detect  → `prompts/00-bootstrap.md`
Detect the framework (Next.js, Nuxt, SvelteKit, Astro, Remix, Rails, Django, Laravel, plain HTML, etc.), the routing convention, the i18n setup, and where metadata/sitemaps/robots live. Read the whole `docs/` folder into your working memory. Produce a short **Stack Report**.

### Phase 1 — Discover routes  → `prompts/01-discover-routes.md`
Enumerate **every route** in the project. Classify each as:
- `public-index` — should be crawlable & indexable
- `public-noindex` — reachable but must be `noindex` (internal search results, live tools, auth screens, thank-you pages)
- `private` — must be blocked (dashboards, admin, account, API)

Also flag **routes that SHOULD be public but currently aren't** (e.g. a feature page hidden behind an unnecessary `noindex` or `robots.txt Disallow`).
Write the result to **`ROUTES-INVENTORY.md`** using `templates/routes-inventory.md`.

### Phase 2 — Audit each public page  → `prompts/02-audit-page.md`
For **every** `public-index` route, run the 9-point audit (metadata, canonical/hreflang, robots, JSON-LD, headings/semantics, images, internal links, rendering, sitemap). Record findings per page in **`SEO-AUDIT-PROGRESS.md`** using `templates/audit-progress.md`. Do not stop until every page has a row.

### Phase 3 — Prioritize  → `prompts/03-prioritize-fixes.md`
Turn the findings into a single prioritized backlog: **P1 (indexing/crawl blockers)**, **P2 (structured data / render / dedup)**, **P3 (hygiene / CWV polish)**. Note any deliberate skips with a reason tied to `docs/`.

### Phase 4 — Fix & verify  → `prompts/04-apply-and-verify.md`
Work the backlog top-down. Fix **shared infrastructure first** (metadata helper, sitemap, robots, i18n) because it fixes many pages at once, then per-page items. After each batch: typecheck → lint → build → verify the live/rendered output. Tick each item in `SEO-AUDIT-PROGRESS.md` as you complete it.

---

## What "done" means

You are done when **all** of the following are true and you can show evidence for each:

- [ ] `ROUTES-INVENTORY.md` lists every route with a correct classification.
- [ ] `SEO-AUDIT-PROGRESS.md` has an audited + resolved row for every `public-index` page.
- [ ] Every `public-index` page has: unique title/description, self-referential canonical (+ hreflang if multilingual), correct `index,follow` robots, at least one type-appropriate JSON-LD block reflecting only visible content, exactly one `<h1>`, crawlable internal links, and server-rendered indexable content.
- [ ] Every `public-noindex` page emits `noindex` (and internal search results are excluded).
- [ ] Every `private` route is blocked in `robots.txt` and does not leak into the sitemap.
- [ ] The XML sitemap covers exactly the `public-index` set (no disallowed URLs), with accurate `lastmod`.
- [ ] Typecheck, lint, and build all pass. You have driven or rendered the changed routes and confirmed the output.

Print a final summary table: page → what changed → verification evidence.

---

## If the user pasted only this file

Ask them to also give you the repo (or run you inside it), then start at **Phase 0**. If you already have the repo, **start now — Phase 0.**

---

_Knowledge base authored from Google Search Central (developers.google.com/search) and web.dev. Project by **Umut Bayraktar (@umutxyp)** — see `README.md`._
