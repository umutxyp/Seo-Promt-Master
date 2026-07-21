# Design: Phase 5 — Live Signals (optional)

**Date:** 2026-07-21
**Status:** proposed

## Problem

`SEO Prompt Master`'s workflow (`START.md`, `prompts/00`–`04`) audits a site entirely from
source code: it reads route files, components, and config to check metadata, canonical tags,
structured data, headings, images, links, rendering model, and sitemap presence.

Three things in the existing 9-point audit (`prompts/02-audit-page.md`) cannot be verified from
source code alone:

1. **Point 8 (Rendering / Core Web Vitals)** — the audit can tell you the *rendering model*
   (SSR/SSG/CSR) but not actual LCP/CLS/INP numbers. Those only exist once the site is deployed.
2. **Points 1–4 (Metadata/canonical/robots/JSON-LD)** — the audit checks what the *source*
   would produce, but not necessarily what a real request to the *deployed* URL returns. CDN
   rewrites, env-specific config, and edge middleware can all cause the two to diverge silently.
3. **Point 9 (Sitemap)** — the audit checks that sitemap-generation code exists and looks
   correct, not that the *live* sitemap actually matches the route inventory.

This is a real, structural gap in the existing workflow — not a nice-to-have.

## Goal

Add an optional Phase 5 that cross-checks the Phase 2 findings against live production data,
using an MCP-connected SEO data tool. RankParse (rankparse.com) is the reference
implementation and the tool this design was built against, but the phase is written generically
so any MCP server exposing equivalent tools (page performance, page SEO scrape, sitemap, site
health) satisfies it — this keeps the phase compliant with `CONTRIBUTING.md`'s "prompts stay
tool-agnostic" rule.

## Non-goals

- Not a replacement for Phase 2. Phase 5 only adds what source-code inspection structurally
  cannot see; it does not re-run the static audit.
- Not mandatory. Requires a live public URL and a connected MCP SEO tool; if either is missing,
  the phase is explicitly skipped and the skip is logged (matching the existing "never silently
  cap coverage" principle from `prompts/02-audit-page.md`).
- Not a full backlink/authority audit. Domain authority and backlinks are surfaced only as
  prioritization context (which already-linked pages are worth fixing first) — never presented
  as something to "fix," per the repo's own ranking-factor-vs-a11y distinction
  (`CONTRIBUTING.md` rule 3).
- Does not introduce a second priority system. New findings are filed into the existing
  Phase 3 P1/P2/P3 backlog.

## Design

### New files

- **`prompts/05-live-signals.md`** — the phase prompt, following the exact structure of
  `prompts/00`–`04` (Goal → numbered steps → Output → "Then proceed to…").
- **`templates/live-signals.md`** — output template in the same style as
  `templates/audit-progress.md`, to be appended to the project's `SEO-AUDIT-PROGRESS.md`.

### Edited files

- **`START.md`** — add a "Phase 5 — Live signals (optional)" entry to the workflow list, and
  a line in "What done means" noting Phase 5 was either completed or explicitly skipped with
  reason.
- **`README.md`** — add Phase 5 to the workflow diagram and the file-tree listing.

### Phase 5 content

**Gating (checked first, before anything else runs):**
- A live, publicly reachable URL exists for the project (not localhost/staging-behind-auth).
- An MCP-connected SEO data tool is available in the current session (the prompt instructs the
  assistant to check its connected MCP tools for domain-level SEO signals — e.g. RankParse,
  linking to its MCP setup docs — but does not hard-code tool names into the audit logic).
- If either is false: skip the phase, state why, and stop. Do not guess at production behavior
  from source code.

**Sampling:** homepage + up to 5 representative `public-index` pages from
`ROUTES-INVENTORY.md` (one per major route pattern/locale). This is a paid/rate-limited live
data source, so the phase explicitly does not run against every route. The sample size and
selection are stated in the output, matching the "if you sample, say so" convention already
used in `prompts/02-audit-page.md`.

**Checks, per sampled URL:**
1. Live page-SEO scrape (metadata/canonical/robots/JSON-LD) — diffed against the Phase 2
   findings for that route; mismatches are flagged as new issues with a likely cause
   (redirect, CDN override, edge middleware, env config).
2. Live Core Web Vitals (LCP/CLS/INP/FCP/TTFB, mobile at minimum) — the one metric impossible
   to get from source.
3. Presence + accuracy in the live sitemap, checked against `ROUTES-INVENTORY.md`'s
   `public-index` set.

**Checks, once per domain:**
4. Site health (HTTPS enforcement, HSTS, security headers, robots.txt) — cross-checked against
   `checklists/infrastructure-checklist.md`.
5. (Optional, only if the connected tool exposes it) Domain authority / backlink context — used
   solely to help Phase 3 prioritize, never logged as an "issue" to fix.

**Output:** a "Live Signals (Phase 5, optional)" section appended to `SEO-AUDIT-PROGRESS.md`
via `templates/live-signals.md`. Any new issue found is filed into the existing Phase 3
P1/P2/P3 backlog, not a separate list.

## Testing / validation

This is a prompt-only change (no executable code). Validation is:
- Run the full workflow (`START.md` → Phase 0–5) against the repo's own worked example
  (`examples/nextjs-blog-example.md`) or a small real Next.js project, once with an MCP SEO
  tool connected and once without, and confirm:
  - With a tool connected: Phase 5 produces sampled findings and files new issues correctly
    into the Phase 3 backlog format.
  - Without a tool connected: Phase 5 is skipped cleanly with a stated reason, and the rest of
    the workflow's "what done means" checklist is unaffected.
- Read-through check that `prompts/05-live-signals.md` matches the tone, heading structure, and
  citation style (`docs/NN` references) of `prompts/02-audit-page.md` and `prompts/04-apply-and-verify.md`.

## Open questions for the maintainer (to raise in the PR description, not resolved here)

- Whether a phase built around a specific external paid API (even framed generically) fits the
  repo's contribution categories in `CONTRIBUTING.md` ("Good PRs" lists doc updates, framework
  recipes, examples, translations — a new phase is a different shape of change). This is
  flagged explicitly in the PR description rather than assumed to be pre-approved.
