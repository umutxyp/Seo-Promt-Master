# V10 — Restaurant & Food Delivery

**Applies to:** individual restaurant sites, food-delivery platforms, recipe/food-blog content.

## Primary schema.org types
`Restaurant` (`LocalBusiness` subtype, see V03) with `menu`/`hasMenu`, `priceRange`, `servesCuisine`; `Recipe` for recipe content — **Recipe rich results are still fully, actively supported in 2026**, requiring at minimum `name`, `image`, `author`, and, for the full rich result, `aggregateRating`, `cookTime`, `prepTime`, `recipeYield`, `recipeIngredient`, `recipeInstructions`.

## Vertical-specific priorities
- ✅ **Menu content must be real, crawlable HTML, not a PDF or an image.** A menu shipped only as a downloadable PDF or a photo is invisible to both classic search and AI answer engines — this is a more specific instance of `docs/07`'s "text in images isn't read" rule with outsized impact in this vertical, since "menu" queries are extremely common.
- ✅ **Hours, delivery radius, and current operating status** need the same freshness discipline as V04/V09's price data — a restaurant marked "open" that's actually permanently closed is a severe trust and quality signal failure.
- ✅ **Recipe pages: don't fake yield/time/ingredient data to game the rich result** — Google's structured-data policy (`docs/08`) applies here as strictly as anywhere; all `Recipe` properties must match what's actually in the visible recipe.
- ✅ For delivery-platform aggregators listing many restaurants: this becomes a marketplace/UGC problem (thin, duplicate restaurant pages at scale) — apply V15's guidance directly.

## GEO notes
"What's a good [cuisine] restaurant near me" and "recipe for X" are extremely common AI-answer query patterns; complete, accurate `Restaurant`/`Recipe` markup plus real menu text (not images/PDFs) is the baseline for citability.

## Sources
- Recipe structured data — https://developers.google.com/search/docs/appearance/structured-data/recipe
- Local Business structured data — https://developers.google.com/search/docs/appearance/structured-data/local-business
