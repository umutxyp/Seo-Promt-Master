# Vertical Playbooks — Industry-Specific SEO & GEO Overlays

The core knowledge base (`docs/01`–`11`) covers universal technical SEO and GEO — it applies to every site. This directory adds **industry-specific overlays**: the schema.org types, structural pitfalls, and GEO considerations particular to a business type. A vertical file never repeats or contradicts the core docs — it only adds what's specific to that niche and cites back to `docs/` for everything else.

## How to use this during the workflow

In **Phase 0** (`prompts/00-bootstrap.md`), after detecting the stack, also identify which vertical(s) below best match the project (a site can match more than one, e.g. a marketplace that's also SaaS). Read the matching file(s) and apply their priorities **in addition to** the standard Phase 1–4 audit — a vertical file adds emphasis and vertical-specific checks, it does not replace the 9-point audit or the scoring rubric (`docs/11`).

If no vertical clearly matches, that's fine — the core `docs/01`–`11` workflow is fully self-sufficient on its own; verticals are a bonus layer, not a requirement.

## Index

| # | Vertical | File |
|---|---|---|
| 01 | E-commerce / Online Retail | [01-ecommerce.md](01-ecommerce.md) |
| 02 | SaaS / B2B Software | [02-saas-b2b-software.md](02-saas-b2b-software.md) |
| 03 | Local Service Business | [03-local-service-business.md](03-local-service-business.md) |
| 04 | Real Estate | [04-real-estate.md](04-real-estate.md) |
| 05 | Healthcare / Medical (YMYL) | [05-healthcare-medical.md](05-healthcare-medical.md) |
| 06 | Legal Services (YMYL) | [06-legal-services.md](06-legal-services.md) |
| 07 | Finance / Fintech / Insurance (YMYL) | [07-finance-fintech-insurance.md](07-finance-fintech-insurance.md) |
| 08 | Education / Online Courses | [08-education-online-courses.md](08-education-online-courses.md) |
| 09 | Travel & Hospitality | [09-travel-hospitality.md](09-travel-hospitality.md) |
| 10 | Restaurant & Food Delivery | [10-restaurant-food-delivery.md](10-restaurant-food-delivery.md) |
| 11 | Automotive | [11-automotive.md](11-automotive.md) |
| 12 | News & Media Publishers | [12-news-media-publishers.md](12-news-media-publishers.md) |
| 13 | Blog / Content / Personal Brand | [13-blog-content-personal-brand.md](13-blog-content-personal-brand.md) |
| 14 | Job Boards & Recruitment | [14-job-boards-recruitment.md](14-job-boards-recruitment.md) |
| 15 | Marketplace / Two-Sided Platforms | [15-marketplace-two-sided-platforms.md](15-marketplace-two-sided-platforms.md) |
| 16 | Directory & Listing Sites | [16-directory-listing-sites.md](16-directory-listing-sites.md) |
| 17 | Mobile App Landing Pages | [17-mobile-app-landing-pages.md](17-mobile-app-landing-pages.md) |
| 18 | Video / Streaming Platforms | [18-video-streaming-platforms.md](18-video-streaming-platforms.md) |
| 19 | Podcast Sites | [19-podcast-sites.md](19-podcast-sites.md) |
| 20 | Nonprofit / NGO | [20-nonprofit-ngo.md](20-nonprofit-ngo.md) |
| 21 | Discord Utility / Moderation Bots | [21-discord-utility-moderation-bots.md](21-discord-utility-moderation-bots.md) |
| 22 | Discord Music / Media Bots | [22-discord-music-media-bots.md](22-discord-music-media-bots.md) |
| 23 | Minecraft Server Lists / Game Server Directories | [23-minecraft-server-lists-game-directories.md](23-minecraft-server-lists-game-directories.md) |
| 24 | Digital Product / Code Marketplace | [24-digital-code-marketplace.md](24-digital-code-marketplace.md) |

## Adding a new vertical

Same spirit as `CONTRIBUTING.md`'s doc-numbering rule: add the next free number, kebab-case filename, add it to this table, and every claim still needs a source. A vertical file should be an **overlay** (priorities, pitfalls, GEO notes specific to the niche) — if you find yourself re-explaining a core mechanism (what a redirect chain is, how hreflang works), that belongs in `docs/`, not here; link to it instead.
