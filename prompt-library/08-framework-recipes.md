# 08 — Framework recipes

The same rules, implemented where each framework actually puts them. Paste the one for your stack into a coding agent that has the project open.

---

### Next.js (App Router)

**Use when:** Next.js 13+ with the `app/` directory.

```text
Apply SEO Prompt Master's rules to this Next.js App Router project:
- metadata: one shared helper used by every generateMetadata. It sets title, description, alternates.canonical (absolute, self-referencing) and alternates.languages (hreflang + x-default), robots, and openGraph/twitter. Set metadataBase.
- streaming: check whether <title> lands after </head> for bots that don't run JavaScript. If it does, configure htmlLimitedBots so metadata blocks for crawlers.
- 404s: notFound() for missing entities. Look for loading.tsx or Suspense ABOVE dynamic segments, which turns 404s into 200 shells, and move the refusal into layout.tsx or out of the streamed path. Verify each template with curl.
- app/sitemap.ts (generateSitemaps for more than 50k URLs) with real lastmod values; app/robots.ts with a deliberate AI policy and Bingbot left unblocked.
- JSON-LD: a server-rendered <script type="application/ld+json"> with safely escaped output, plus WebPage + BreadcrumbList as a baseline.
- data: server components fetch the data. No useEffect-only content on pages that should be indexed.
- images: next/image with explicit sizes; priority on the LCP image only.
Run typecheck, lint and build after each change, and re-fetch the routes to prove it.
```

### Nuxt

**Use when:** Nuxt 3/4.

```text
Apply SEO Prompt Master's rules to this Nuxt project:
- useSeoMeta / useHead in one composable for title, description, canonical (absolute), hreflang (via @nuxtjs/i18n's head with SEO enabled), robots and OG
- render content-critical routes with SSR or prerender (routeRules). No client-only data on pages that should be indexed.
- a real 404 via throw createError({ statusCode: 404 }) for missing entities, verified with curl for each template
- sitemap and robots (via @nuxtjs/sitemap and @nuxtjs/robots, or server routes) with an accurate lastmod and a deliberate AI policy
- JSON-LD rendered server-side
Run the build and re-fetch the routes to prove it.
```

### SvelteKit / Astro / Remix

**Use when:** one of these frameworks.

```text
Apply SEO Prompt Master's rules to this {{SvelteKit | Astro | Remix}} project:
- a single head/meta helper for title, description, absolute self-canonical, hreflang + x-default, robots and OG
- SSR or prerendering for every public-index route; check that the raw HTML contains the H1 and the body text
- real 404s: SvelteKit error(404) in load · Astro return a 404 Response / Astro.response.status = 404 · Remix throw a 404 Response from the loader. Verify each template.
- an XML sitemap (split at 50k) with a real lastmod, and robots.txt with an explicit AI policy and Bing unblocked
- server-rendered JSON-LD
Show the code changes and the curl proof.
```

### WordPress

**Use when:** WordPress with or without an SEO plugin.

```text
Audit and fix this WordPress site's SEO configuration ({{plugin: Yoast | Rank Math | none}}):
- Settings → Reading: "Discourage search engines" must be OFF in production (it sends a noindex)
- one canonical host and HTTPS (siteurl and home), with the other host variants 301ing to it
- the plugin's sitemap includes only indexable content: exclude tag, author, date and attachment archives unless they're valuable
- attachment pages redirect to the parent or the file
- robots.txt doesn't block /wp-content/ or /wp-includes/ assets that rendering needs; it has a deliberate AI policy and leaves Bing unblocked
- the schema graph has Organization/Person with sameAs, plus Article for posts. Avoid duplicate schema from the theme and the plugin.
- a theme or plugin isn't injecting noindex or a second canonical
Give the exact settings to change, and any code snippets (in a must-use plugin, not in the theme).
```

### Laravel / Django / Rails (server-rendered)

**Use when:** a classic server-rendered app.

```text
Apply SEO Prompt Master's rules to this {{Laravel | Django | Rails}} app:
- a base-layout partial that renders title, description, an absolute self-canonical, hreflang, robots and OG from per-view variables, with safe defaults
- missing records return a real 404 (findOrFail / get_object_or_404 / ActiveRecord::RecordNotFound → 404)
- sitemap generation (a package or a custom controller) with an accurate lastmod from updated_at; robots.txt served statically or by a route that can't return a 5xx
- middleware that 301s non-canonical hosts, protocols and trailing slashes in one hop
- JSON-LD from a view helper with escaped output
- pagination as real ?page=n links, each page self-canonical
Show the diffs and the curl proof.
```
