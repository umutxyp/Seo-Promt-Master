# V17 — Mobile App Landing Pages

**Applies to:** the marketing/web presence for an iOS/Android app (distinct from the SaaS web-app pattern in V02, though they can overlap).

## Primary schema.org types
`SoftwareApplication` (or the `MobileApplication` type) with a supported `applicationCategory` value such as `GameApplication` or `UtilitiesApplication`, `operatingSystem: iOS`/`Android`, `offers.price` (`0` if free) and `aggregateRating`/`review` — Google requires a rating or review for the rich result, but ❌ app-store ratings may not be aggregated into your markup ("Don't aggregate reviews or ratings from other websites"); only reviews collected and shown on your own page qualify; `Organization` for the developer/publisher.

## Vertical-specific priorities
- ✅ **App Store/Play Store listings and the marketing website are two separate indexable surfaces** — don't assume optimizing one covers the other. The web landing page still needs the full standard audit (`docs/01`–`07`) independent of app-store-specific ASO (App Store Optimization, which is a distinct discipline this repo doesn't cover).
- ✅ **Deep links (`app-argument`/`al:ios:url`/`al:android:url` style App Links/Universal Links meta) should point to real, working in-app destinations** — a landing page advertising deep-linking that 404s or falls back incorrectly inside the app is a common, easily-missed technical bug specific to this vertical.
- ✅ **Feature/use-case pages, same principle as V02** — "app for tracking X," "app for managing Y" each deserve their own indexable page rather than everything funneling to one generic homepage.
- ⚠️ Screenshots/preview content should be real `<img>` elements with descriptive `alt` (`docs/07`), not solely embedded via a JS-rendered app-store widget that may not render server-side.

## GEO notes
"Best app for X" is an AI-answered pattern that draws on `SoftwareApplication` schema plus genuine third-party review signals (app-store ratings, tech-press reviews) — the same entity-authority (`sameAs` to app-store listing pages) approach from `docs/10` applies directly.

## Sources
- SoftwareApplication — https://schema.org/SoftwareApplication
