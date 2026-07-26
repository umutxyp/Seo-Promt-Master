# V21 — Discord Utility / Moderation Bots

**Applies to:** a Discord bot's own marketing/docs website whose core function is server management — moderation, auto-mod, security, logging, ticketing (e.g. a Sylon-type product). Distinct from V22 (music/media bots) because the audience, query intent, and content shape differ: server admins researching a purchase/adoption decision, not end-users looking for entertainment.

## Primary schema.org types
`SoftwareApplication` (`applicationCategory: SecurityApplication`/`BusinessApplication`, `operatingSystem: Web`) for the bot product itself; `Organization` for the developer/team with `sameAs`; `FAQPage` for common setup/permissions questions (2023 eligibility caveat, `docs/08`); `HowTo`-style content for setup guides is fine as content even though the `HowTo` rich result itself is deprecated (`docs/08`) — write the steps for humans, not for a rich-result payoff.

## Vertical-specific priorities
- ✅ **Feature/command pages, same principle as V02:** "auto-moderation," "anti-raid protection," "ticket system," "logging" etc. each deserve their own indexable page targeting how an admin actually searches ("discord anti-spam bot," "discord bot for ticket system") rather than funneling everything to one homepage.
- ✅ **Commands/documentation pages must be crawlable, not just an in-Discord `/help` command.** If the docs are a JS-rendered SPA (common for bot dashboards), apply the CSR-trap check (`docs/05`) directly — command reference pages are high-intent, frequently-linked content that's easy to accidentally hide from crawlers.
- ✅ **The OAuth/invite page itself is usually correctly `noindex`** (it's a transactional redirect flow, not content — `public-noindex` per Phase 1's classification, `prompts/01`), but the page that *links to* the invite (features/pricing page explaining what the bot does) must be fully `public-index` and complete.
- ✅ **Third-party bot-directory listings (top.gg, discordbotlist.com, etc.) are a legitimate, standard off-page strategy in this space** — every listing that links back is both a discovery channel and a real backlink; treat maintaining an accurate, complete listing on the major directories as part of the site's off-page checklist, not a distraction from on-site SEO.
- ✅ **Trust/uptime/status signals matter disproportionately** — a status page or visible uptime indicator is an E-E-A-T-adjacent trust signal specific to this vertical (an admin adopting a moderation bot is making a security-relevant trust decision, similar in kind to V02's SaaS trust signals, just with server-safety stakes instead of business stakes).
- ✅ **Server-count/user-count claims in marketing copy and any `Organization`/`SoftwareApplication` schema must be genuinely current** — stale, inflated adoption numbers are both a user-trust issue and, if marked up in structured data, a `docs/08` policy violation (data must reflect what's real).

## GEO notes
"Best discord moderation bot" / "discord bot for anti-raid" is a common AI-answer query pattern that draws on `SoftwareApplication` schema plus third-party directory reviews and reputation — the entity-authority guidance from `docs/10` (`sameAs` to bot-directory listing pages, GitHub if open-source, Discord support server) applies directly and is one of the highest-leverage GEO actions in this niche.

## Sources
- SoftwareApplication — https://schema.org/SoftwareApplication
- Structured data general policies — https://developers.google.com/search/docs/appearance/structured-data/sd-policies
