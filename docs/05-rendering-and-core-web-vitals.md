# 05 — Rendering & Core Web Vitals (JavaScript SEO)

## Rendering strategy

- ⚠️ **Dynamic rendering is no longer recommended** — Google explicitly calls it a *temporary workaround*, not a long-term solution.
- ✅ Use **SSR** (server-side rendering), **static rendering (SSG)**, or **hydration** instead.
- Google's guidance by app type:
  - **SSR** → content-heavy, SEO-critical, e-commerce (full HTML → fast first load + strong indexing).
  - **SSG** → infrequently changing content (build-time HTML, cacheable, very fast); ❌ not for highly dynamic apps.
  - **CSR** → highly interactive apps; ⚠️ slow first load + SEO challenges → **not** for content that must rank.
- ⚠️ Googlebot renders JS in **three phases: crawl → render → index.** Every 200 page is queued for rendering unless a robots directive blocks it. A `noindex` makes Google **skip rendering/JS entirely**.
- ✅ Even though Googlebot runs JS, prefer SSR/pre-render (speed + not all crawlers run JS).

## The CSR trap (most common real bug)

If a list/detail page fetches its data client-side (`useEffect` + `fetch`) with **no server-side initial data**, the initial HTML is empty — crawlers see no content and no internal links. **Fix:** fetch server-side and pass initial props (SSR/SSG/ISR).

## Mobile-first indexing & content parity

- ⚠️ **Google indexes with a mobile crawler by default, for every site — this is not opt-in and there is no desktop-first fallback.** Whatever the mobile Googlebot sees in the rendered HTML is what gets indexed and ranked.
- ✅ **Content parity is the actual requirement, not "mobile-friendly."** Text, headings, metadata, internal links, and structured data that exist on desktop must also exist (in the DOM) on mobile. A common real bug: a responsive layout that hides secondary content, a data table, or extra internal links behind a "desktop only" breakpoint using `display:none` conditioned on viewport, or a separate lighter mobile template that drops content to save bandwidth.
- ✅ Content behind an **accordion, tab, or "read more" toggle is fine** — Google reads the full DOM regardless of what's visually collapsed. The problem is content that's **absent from the mobile DOM entirely**, not content that's merely collapsed.
- ✅ Audit this by diffing the **rendered HTML** (not just the visual layout) at a mobile viewport against desktop for the same route — same check technique as the CSR trap above, just comparing two renders of the same page instead of source vs. rendered.

## SPA correctness

- ✅ Return meaningful HTTP status codes: real **404** for missing, 401 for auth. Avoid **soft-404** (200 for a "not found" page).
- ✅ Use the History API (real URLs), not `#`-fragment routing. Give each screen a unique URL.
- ⚠️ Text injected via CSS `content` is **ignored** — content must be in the DOM.
- ✅ Use content-fingerprinted asset filenames (`main.2bb85551.js`) so Google re-fetches updates.

## Core Web Vitals (Google's targets)

| Metric | Good |
|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5 s |
| **CLS** (Cumulative Layout Shift) | < 0.1 |
| **INP** (Interaction to Next Paint) | < 200 ms |
| **TTFB** (Time to First Byte) | < 800 ms |

- **LCP:** reference the LCP image with `<img src>` or `<link rel=preload>` (**not** `data-src`), give it `fetchpriority="high"`, and **never** `loading="lazy"` on it. (~73% of mobile LCPs are images; many are undiscoverable in initial HTML due to JS lazy-loaders.)
- **INP:** break up long JS tasks (>50 ms) with yield points (`scheduler.yield()`, `async/await`), code-split, and remove unused JS.
- **CLS:** set explicit `width`/`height` (or `aspect-ratio`) on images; animate `transform`/`opacity`, not layout properties (`margin`/`top`/`left`).

## Sources
- JavaScript SEO basics — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Dynamic rendering (workaround) — https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering
- Rendering on the web — https://developers.google.com/solutions/content-driven/hosting/rendering
- Core Web Vitals — https://web.dev/articles/vitals · https://web.dev/blog/top-cwv-2023
- Mobile-first indexing best practices — https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
