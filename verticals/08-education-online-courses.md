# V08 — Education / Online Courses (EdTech)

**Applies to:** online course platforms, schools/universities, individual instructor sites.

## Primary schema.org types
`Course` for individual course pages; a `Course List` page needs **at least 3 courses** to be eligible for the Course-list carousel, per Google's documented technical requirement (`docs/08`). ⚠️ **Google retired the individual course-info rich result (start date/price/instructor snippet) in mid-2025** — don't promise that specific rich result; the Course List carousel is what's still active. `EducationalOrganization` for institution pages.

## Vertical-specific priorities
- ✅ **Content must be genuinely educational with defined learning objectives** — this is Google's stated eligibility bar for Course markup, not a formality; a marketing page dressed up as a "course" won't qualify.
- ✅ **Free preview / paywalled content split** is a rendering concern: if a lesson is behind a paywall, the initial server-rendered HTML should still contain enough (title, description, syllabus) to be genuinely useful and indexable — don't CSR-gate everything behind a login check (`docs/05`).
- ✅ **Instructor E-E-A-T** — course pages benefit from the same author-credibility signals as any content vertical (`docs/09`): real instructor bio, credentials, and experience, not a generic "our team" blurb.
- ✅ Course catalog pages are exactly the faceted-navigation pattern from `docs/03` (filter by subject/level/price) — apply the same crawl-budget discipline as e-commerce (V01).

## GEO notes
"Best course for X" is a common AI-answer query pattern; complete, accurate `Course` markup plus genuine instructor credentials is what makes a course citable over a generic marketing page.

## Sources
- Course structured data — https://developers.google.com/search/docs/appearance/structured-data/course
- Google Clarifies Course Structured Data Requirements — https://www.searchenginejournal.com/google-clarifies-course-structured-data-requirements/456806/
