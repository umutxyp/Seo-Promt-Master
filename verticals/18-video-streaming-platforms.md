# V18 — Video / Streaming Platforms

**Applies to:** sites hosting original or aggregated video content — tutorial libraries, entertainment streaming, video-first content sites.

## Primary schema.org types
`VideoObject` on every video page — `name`, `description`, `thumbnailUrl`, `uploadDate`, and ideally `duration` and `contentUrl`/`embedUrl`. A **video sitemap** (or `<video:video>` entries in the main XML sitemap) surfaces videos Google might not otherwise find, especially JS-embedded players (`docs/06`, extended here).

## Vertical-specific priorities
- ✅ **The video player itself is very often the CSR trap** (`docs/05`) — if the title, description, and transcript/captions only appear after a JS player fully initializes, that content may be invisible to crawlers even though a human sees it instantly. Server-render the surrounding metadata and, where feasible, a transcript, independent of player hydration.
- ✅ **`uploadDate` and duration must be accurate** — stale or fabricated video metadata is a structured-data policy violation identical in spirit to fake `Review`/`Recipe` data (`docs/08`); Google explicitly checks that marked-up data matches the actual video.
- ✅ **Live/premiere content** should use `BroadcastEvent`/live-specific properties where the content is genuinely live, rather than reusing static `VideoObject` fields inaccurately.
- ✅ Transcripts and captions, beyond their accessibility value, are the single highest-leverage addition for both classic indexing (real crawlable text describing the video) and GEO extractability (`docs/10`) — a video with no text representation is invisible to any text-based crawler, AI or otherwise.

## GEO notes
AI engines cannot "watch" a video — they rely entirely on `VideoObject` metadata and any transcript/caption text present in the DOM. A site in this vertical without transcripts is close to un-citable for GEO purposes regardless of how good the actual video content is.

## Sources
- Video structured data — https://developers.google.com/search/docs/appearance/structured-data/video
- Video sitemaps — https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
