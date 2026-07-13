# Phase 0 — Bootstrap & Detect

**Goal:** understand the project well enough to audit it, and load the knowledge base.

## Do this

1. **Read the knowledge base.** Open every file in `docs/` (01–09) and hold the rules in memory. You will cite them by section throughout.

2. **Detect the stack.** Identify:
   - **Framework & version** (Next.js App/Pages Router, Nuxt, SvelteKit, Astro, Remix, Gatsby, Rails, Django, Laravel, Hugo/Jekyll, plain HTML, …).
   - **Rendering model** — SSR, SSG/ISR, or CSR? (Decisive for indexability — see `docs/05`.)
   - **Routing convention** — file-based (`app/`, `pages/`, `routes/`), config-based, or controller-based.
   - **i18n** — is the site multilingual? What locales, and what URL strategy (subdirectory `/de/`, subdomain, ccTLD, or none)? Where is the locale list defined?
   - **Where SEO lives** — search for a central metadata helper, `sitemap`, `robots`, `hreflang`/`alternates`, and any existing JSON-LD (`application/ld+json`).

3. **Locate the verification commands.** Find the scripts for typecheck, lint, and build (e.g. `package.json` scripts, `Makefile`, `composer`, `manage.py`). You will run these after every change.

## Useful searches (adapt to the language)

```bash
# metadata / SEO helpers
grep -rlE "generateMetadata|<title>|og:title|canonical|alternates|hreflang" .
# sitemaps & robots
find . -iname "*sitemap*" -o -iname "robots*"
# structured data
grep -rl "application/ld+json\|schema.org" .
# i18n
grep -rlE "i18n|locales|hreflang|lang=" .
```

## Output — "Stack Report"

Write a short report (to chat and/or the top of `SEO-AUDIT-PROGRESS.md`):

- Framework + rendering model
- Routing convention + where routes are defined
- Multilingual? locales + URL strategy
- Existing SEO infrastructure (what's already there — metadata helper, sitemap, robots, JSON-LD)
- Verification commands (typecheck / lint / build)

Then proceed to **Phase 1** (`prompts/01-discover-routes.md`).
