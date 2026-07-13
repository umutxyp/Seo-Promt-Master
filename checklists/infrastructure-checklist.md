# Infrastructure Checklist

Shared systems that affect **many pages at once**. Fix these first — they give the biggest leverage.

## Central metadata helper
- [ ] One helper builds title/description/canonical/hreflang/robots/OG for all pages — `docs/01`
- [ ] Clamps title/description to sensible lengths without dropping the brand — `docs/01`
- [ ] Supports a `noindex` flag and (ideally) a `canonicalPath` override for dedup — `docs/01`

## robots.txt
- [ ] `Disallow` covers all `private` routes (dashboard/admin/account/api) — `docs/01`
- [ ] Does **not** `Disallow` any page you want `noindex`-ed (use meta noindex instead) — `docs/01`
- [ ] References the sitemap (`Sitemap:` line) — `docs/06`

## XML sitemap
- [ ] Covers exactly the `public-index` set — `docs/06`
- [ ] No disallowed/noindex/private URLs listed — `docs/06`
- [ ] Split + sitemap index if > 50k URLs / 50MB — `docs/06`
- [ ] Accurate `lastmod`; `priority`/`changefreq` not relied on — `docs/06`

## i18n / hreflang
- [ ] Locale list valid (ISO codes); URL strategy consistent — `docs/02`
- [ ] hreflang emitted bidirectionally + `x-default` everywhere — `docs/02`
- [ ] No IP/Accept-Language auto-redirect — `docs/02`

## Shared components
- [ ] Pagination component renders real `<a href="?page=n">` — `docs/03`
- [ ] HTML sanitizer appends `rel="ugc nofollow noopener noreferrer"` on UGC links — `docs/03`
- [ ] Image component supports width/height + eager/lazy control — `docs/05`,`docs/07`
- [ ] A reusable JSON-LD injector exists (escapes output) — `docs/08`

## Rendering defaults
- [ ] List/detail pages fetch initial data server-side (SSR/SSG/ISR) — `docs/05`
- [ ] Dynamic routes call the framework's `notFound()`/404 for missing entities — `docs/05`
