# V19 — Podcast Sites

**Applies to:** podcast show websites and episode pages (whether hosted directly or as a companion site to a hosting platform).

## Primary schema.org types
`PodcastSeries` on the main show page (name, description, publisher, image) linking out to episodes; `PodcastEpisode` on individual episode pages (title, description, duration, upload date) paired with an `AudioObject` for the actual audio file. `PodcastEpisode` markup isn't strictly required for basic discovery but materially helps search/AI engines understand and surface episode content correctly.

## Vertical-specific priorities
- ✅ **Show notes / transcripts are the single highest-leverage content addition** — identical reasoning to V18's video transcripts: audio content has zero text representation on its own, so a page with only a title and an embedded player is nearly invisible to text-based crawling and completely invisible to GEO/AI-answer extraction. A full transcript or substantive show notes turns an audio-only page into genuinely indexable, citable content.
- ✅ **Embedded players are a common CSR trap** — ensure episode title, description, and (if present) transcript render in the initial server-rendered HTML independent of the audio player's own JS initialization (`docs/05`).
- ✅ **RSS feed and website should agree** — episode titles/dates/descriptions on the web page should match the canonical RSS feed data podcast directories use; drift between the two is a common, easily-introduced consistency bug.
- ✅ Use `PodcastSeries` only on the show's own landing page, not on every episode page — a common markup-placement mistake in this vertical.

## GEO notes
Same as V18: without a transcript, a podcast episode page has essentially nothing for an AI answer engine to extract or cite regardless of how good the audio content is — this is the top GEO lever in this vertical, above any other optimization.

## Sources
- PodcastSeries — https://schema.org/PodcastSeries
- PodcastEpisode — https://schema.org/PodcastEpisode
