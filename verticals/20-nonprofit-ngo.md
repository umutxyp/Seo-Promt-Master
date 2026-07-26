# V20 — Nonprofit / NGO

**Applies to:** charities, foundations, advocacy organizations, community NGOs.

## Primary schema.org types
`NGO`/`Organization` (with `nonprofitStatus` where applicable) site-wide, `sameAs` to registries/verification bodies (e.g. a national charity-registration database) and social profiles; `DonateAction`/`Offer`-style markup on donation pages where a concrete, visible donation flow exists; `Event` for fundraisers with a real date/location.

## Vertical-specific priorities
- ✅ **Trust and transparency signals are this vertical's E-E-A-T** (`docs/09`): a visible, substantive "About/Mission" page, real leadership bios, financial transparency (annual report links, registered-charity status) do for a nonprofit what author credentials do for content sites — this is the highest-leverage addition here, more than any schema trick.
- ✅ **Donation pages must be indexable and server-rendered enough to describe what the donation supports** — a donation flow that's entirely a third-party embedded widget (common with payment processors) can leave the actual page with near-empty server-rendered content; ensure the surrounding context (what the donation funds, impact data) is real page content, not solely inside the widget iframe (`docs/05`).
- ✅ **Program/impact pages** (what the org actually does, with real outcomes/data) are the nonprofit equivalent of product pages — give each program its own indexable page rather than one generic "our work" page, for the same discoverability reasons as V01/V02's per-feature-page guidance.
- ✅ `sameAs` linking to charity-verification/registry listings (where a country has one) is a strong, underused entity-authority signal specific to this vertical (`docs/10`).

## GEO notes
"Best charity for X cause" or "is [organization] legitimate" are queries where AI engines lean heavily on verifiable, third-party-corroborated trust signals — the transparency and registry-`sameAs` signals above are directly what makes a nonprofit's own claims about itself citable versus not.

## Sources
- Organization — https://schema.org/Organization
- NGO — https://schema.org/NGO
