# V05 — Healthcare / Medical (YMYL)

**Applies to:** clinics, hospitals, telehealth, health-information content sites, medical directories.

## Primary schema.org types
`MedicalOrganization`/`Physician`/`Hospital` (LocalBusiness subtypes, see V03) for practice pages; `MedicalWebPage` and `Article`/`MedicalCondition` markup for informational content, only when the page genuinely matches the medical-content pattern Google documents — don't apply medical-specific schema to generic blog content.

## Vertical-specific priorities
- ✅ **This is the highest-stakes YMYL category — E-E-A-T is not optional polish here, it's the primary lever.** Every piece of medical content needs a visible, credentialed author (real name, real credentials, linked bio) or clear institutional review byline (`docs/09`). Anonymous or generic "Staff Writer" bylines on medical advice content is the single most common, most damaging pattern in this vertical.
- ✅ **Cite sources for every clinical claim** — link to the actual study, guideline, or authoritative body (CDC/WHO/NIH-equivalent for the relevant country), not just "studies show."
- ✅ **Keep content current and dated** — `dateModified` should reflect genuine medical review, not a cosmetic timestamp bump; stale medical content is a helpful-content/core-update risk (`docs/09`).
- ✅ All the same technical fundamentals apply with **zero tolerance for shortcuts**: no soft-404s on discontinued service pages, no CSR-only content on anything a patient might need to read (`docs/05`), NAP consistency for physical locations (V03).

## GEO notes
AI Overviews/AI Mode are explicitly more conservative about citing YMYL medical content without strong authority signals — expect a higher bar for entity authority (`docs/10`) and E-E-A-T than in any other vertical; don't expect GEO wins here without the fundamentals solid first.

## Sources
- Creating helpful, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- MedicalWebPage — https://schema.org/MedicalWebPage
