# V14 — Job Boards & Recruitment

**Applies to:** job listing platforms, company career pages, staffing/recruitment sites.

## Primary schema.org types
`JobPosting` — required fields per Google for Jobs: `title`, `description`, `datePosted`, `hiringOrganization`, `jobLocation` (or `jobLocationType: TELECOMMUTE` for fully remote roles), and `validThrough`.

## Vertical-specific priorities
- ✅ **`validThrough` and expired-listing removal is the single highest-impact, most commonly mishandled item in this vertical.** Every posting needs an expiration date (rolling/evergreen postings may omit `validThrough` rather than setting an arbitrary future date). When a job closes, do **one** of: set `validThrough` to a past date, return a real 404/410 for the page, or remove the `JobPosting` markup entirely. Leaving expired postings live with active schema is explicitly called out as degrading trust — repeated violations measurably reduce a domain's standing with Google for Jobs, making this a P1-class finding, not P3 hygiene.
- ✅ **Salary transparency fields** (`baseSalary`) — where legally required or simply available, include them; missing salary data is an increasingly common reason a posting underperforms in job-search rich results and AI-answer summaries alike.
- ✅ **One canonical URL per job**, even if the same posting is syndicated to multiple boards/aggregators — cross-canonicalize or note the syndication relationship, don't let duplicate postings compete with each other (`docs/01`).
- ✅ High-volume job boards face the exact faceted-navigation problem from `docs/03`/V01 at scale (filter by location/salary/type) — apply the same crawl-budget discipline.

## GEO notes
"Jobs hiring near me for X" is a heavily AI-answered pattern; complete, current `JobPosting` data (especially `validThrough` accuracy) is the deciding factor between a citable listing and one AI engines correctly avoid surfacing as potentially stale.

## Sources
- JobPosting structured data — https://developers.google.com/search/docs/appearance/structured-data/job-posting
