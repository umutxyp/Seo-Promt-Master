# V22 — Discord Music / Media Bots

**Applies to:** a Discord bot's own marketing/docs website whose core function is entertainment/media — music playback, media commands, multi-platform streaming (e.g. a Beatra-type product). Distinct from V21 because the query intent skews toward end-users ("best discord music bot," "discord bot to play spotify") rather than server-admin security research, and the competitive field (dozens of near-identical music bots) is much more commoditized.

## Primary schema.org types
`SoftwareApplication` (`applicationCategory: MultimediaApplication`, `operatingSystem: Web`); `Organization` with `sameAs`; `FAQPage` for setup/permissions/platform-support questions (2023 eligibility caveat, `docs/08`).

## Vertical-specific priorities
- ✅ **Differentiation content is the top SEO priority in a commoditized field.** With dozens of largely-interchangeable music bots competing, generic "add our bot" pages rank poorly — pages that concretely address specific differentiators (multi-platform source support e.g. Spotify/SoundCloud/YouTube, audio quality, filters/effects, playlist features, uptime/reliability) targeting the exact phrases users search for those features perform far better than a single generic feature list.
- ✅ **Command reference/documentation must be crawlable** — same CSR-trap concern as V21; a bot's `/play`, `/queue`, `/filter` command docs are exactly the kind of high-intent page ("discord bot commands for music") that's easy to accidentally hide behind a JS-only dashboard (`docs/05`).
- ✅ **Platform-support pages** ("Spotify support," "SoundCloud support," "YouTube playback") each deserve their own indexable page — same per-feature-page principle as V02/V21 — since users frequently search by source platform, not just "discord music bot" generically.
- ✅ **Uptime and reliability signals are a real differentiator here too**, for a different reason than V21: music bots are notorious for going offline/lagging under load, so a visible status page or uptime stat is a genuine trust-and-conversion signal, not just decoration.
- ✅ **Multi-platform/multi-language reach** (if the bot serves a global Discord user base) should get the full `docs/02` hreflang/locale treatment on the website — don't limit international reach to in-bot language commands while the marketing site stays single-language.

## GEO notes
"Best discord music bot 2026" is a heavily AI-answered, high-competition query; the differentiation content above (specific platform/feature pages) is what gives an AI engine something concrete and distinct to cite instead of lumping the product in with every other generic music bot. `sameAs` linking to bot-directory listings (top.gg etc., per V21) and any press/review coverage strengthens entity resolution the same way.

## Sources
- SoftwareApplication — https://schema.org/SoftwareApplication
- Structured data general policies — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
