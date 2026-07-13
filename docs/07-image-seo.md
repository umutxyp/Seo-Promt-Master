# 07 — Image SEO

## Discoverability & markup

- ✅ Use standard `<img src>` — Google indexes images referenced there. ❌ **CSS `background-image` is NOT indexed.**
- ✅ Supported formats include BMP, GIF, JPEG, PNG, **WebP, SVG, AVIF**.
- ✅ Place images **near relevant text** on topically appropriate pages — Google derives image subject matter from surrounding content, captions, and titles.

## Alt text (Google's top image-SEO tip)

- ✅ Short but **descriptive** `alt` that expresses the image–content relationship; use keywords in context.
- ❌ Don't keyword-stuff or leave generic/empty alt. In the 2024 Starter Guide, Google reduced image guidance to essentially "write good alt text."

## Responsive images

- ✅ Use `srcset` / `<picture>`, but **always** provide a fallback `src` so crawlers can find the image.

## File names

- ✅ Short, descriptive file names (`red-minecraft-skin.png`), not `IMG_0001.jpg` / `image1.jpg`.

## Core Web Vitals interaction

- ✅ The LCP image must be eager (`<img src>` + `fetchpriority="high"`), **not** `loading="lazy"`; below-the-fold images should be `loading="lazy"`. Always set `width`/`height` to prevent CLS. (See `docs/05`.)

## Image sitemaps

- ✅ Surface images Google might not otherwise find (e.g. JS-loaded) with an image sitemap.
- Required tags: `<image:image>` (wraps each image) + `<image:loc>` (URL), namespace `http://www.google.com/schemas/sitemap-image/1.1`. Up to **1,000 `<image:image>` per `<url>`**.
- ✅ Images may live on a **different domain / CDN** — but both domains must be **verified in Search Console** and `robots.txt` must allow crawling.
- ⚠️ **Deprecated/removed** image sitemap tags: `image:caption`, `image:geo_location`, `image:title`, `image:license`.

## Sources
- Google Images best practices — https://developers.google.com/search/docs/appearance/google-images
- Image sitemaps — https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
