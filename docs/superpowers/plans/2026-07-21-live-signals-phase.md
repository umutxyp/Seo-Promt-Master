# Phase 5 (Live Signals) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional Phase 5 to the SEO Prompt Master workflow that cross-checks the
Phase 2 static audit against live production data (Core Web Vitals, a live page-SEO scrape,
live sitemap coverage, site health) via an MCP-connected SEO data tool, using RankParse as the
reference implementation.

**Architecture:** Prompt-only change — two new markdown files (`prompts/05-live-signals.md`,
`templates/live-signals.md`) following the exact structure of the existing `00`–`04` phase
files, plus edits to `START.md` and `README.md` to wire Phase 5 into the documented workflow.
No executable code; "tests" are grep-based structural/consistency checks against the repo's own
conventions.

**Tech Stack:** Markdown only. Repo: `abhibavishi/Seo-Promt-Master` (fork of
`umutxyp/Seo-Promt-Master`), branch `feat/rankparse-live-signals-phase`, working directory
`/Users/abhi/Downloads/Github/rankparse/Seo-Promt-Master`.

## Global Constraints

- Prompts stay tool-agnostic (`CONTRIBUTING.md` rule 4) — Phase 5 must describe capabilities
  ("an MCP-connected SEO data tool exposing page performance / page-SEO scrape / sitemap / site
  health"), not require a specific assistant or vendor. RankParse is named as the reference
  implementation with a link, never as a hard requirement.
- Ranking factors must be distinguished from non-ranking signals (`CONTRIBUTING.md` rule 3) —
  domain authority / backlink data is prioritization context only, never logged as an "issue."
- Never silently cap coverage — state the sample size and which pages were sampled, matching
  the existing convention in `prompts/02-audit-page.md`.
- New phase file follows the existing two-digit zero-padded, kebab-case naming convention
  (`00-bootstrap.md` … `04-apply-and-verify.md` → `05-live-signals.md`).
- Every cross-reference between files must resolve (e.g. `START.md` pointing at
  `prompts/05-live-signals.md`, which must actually exist with that exact path).
- Do not run `gh pr create` against `umutxyp/Seo-Promt-Master` as part of this plan — opening
  the PR is a separate, explicitly-confirmed step after the branch is pushed and reviewed.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `prompts/05-live-signals.md` | Create | The Phase 5 prompt: gating check, sampling rule, 5 live checks, output instruction |
| `templates/live-signals.md` | Create | Output template for the "Live Signals" section appended to `SEO-AUDIT-PROGRESS.md` |
| `START.md` | Modify | Add Phase 5 to the workflow list and the "what done means" checklist |
| `README.md` | Modify | Add Phase 5 to the file tree and the one-picture workflow diagram |

---

### Task 1: Create the Phase 5 prompt file

**Files:**
- Create: `prompts/05-live-signals.md`

**Interfaces:**
- Consumes: nothing (standalone prompt file, same as `prompts/00-bootstrap.md`)
- Produces: a file at `prompts/05-live-signals.md` that `START.md` (Task 3) and `README.md`
  (Task 4) will reference by that exact path. It references `templates/live-signals.md`
  (created in Task 2) and `checklists/infrastructure-checklist.md` (already exists).

- [ ] **Step 1: Write the "test" — a grep check that currently fails**

Run:
```bash
cd /Users/abhi/Downloads/Github/rankparse/Seo-Promt-Master
test -f prompts/05-live-signals.md && echo "FILE EXISTS" || echo "FILE MISSING"
```
Expected: `FILE MISSING`

- [ ] **Step 2: Create `prompts/05-live-signals.md`**

```markdown
# Phase 5 — Live Signals (Optional)

**Goal:** cross-check the Phase 2 findings against production, using an MCP-connected SEO
data tool, for the three things a source-code audit cannot see: real Core Web Vitals, whether
the deployed page matches what the source implies, and whether the live sitemap matches the
route inventory.

> This phase is optional. It requires a live public URL and a connected MCP SEO tool. If
> either is missing, skip it and say so — do not guess at production behavior from source code.

## 0. Applicability check

Confirm both before continuing:
- A live, publicly reachable URL exists for this project (not localhost, not
  staging-behind-auth).
- An MCP-connected SEO data tool is available in this session — check your assistant's
  connected MCP tools for domain-level SEO signals (page performance/CWV, live page-SEO
  scrape, sitemap, site health). [RankParse](https://rankparse.com/docs/mcp) (MCP server at
  `https://mcp.rankparse.com/mcp`) is the reference implementation; any MCP server exposing
  equivalent tools works.

If either is false, write one line in `SEO-AUDIT-PROGRESS.md` stating which condition was
missing, and stop here.

## Sampling

Live data is rate-limited and often billed per call — do not query every route. Sample the
homepage plus up to 5 more `public-index` pages from `ROUTES-INVENTORY.md`, one per major
route pattern (and one per locale if the site is multilingual). State the sample size and
which pages you picked in the output.

## The checks (run per sampled page, unless noted "once per domain")

1. **Live page-SEO scrape** (`docs/01`) — fetch the deployed URL's title, description,
   canonical, robots meta, and JSON-LD. Diff against the Phase 2 findings for that route in
   `SEO-AUDIT-PROGRESS.md`. A mismatch is a new finding — note the likely cause (redirect
   chain, CDN/edge rewrite, environment-specific config, middleware stripping something).
2. **Live Core Web Vitals** (`docs/05`) — LCP, CLS, INP, FCP, TTFB (mobile at minimum,
   desktop too if the tool and budget allow). Compare against `docs/05`'s thresholds. Anything
   outside "Good" is a new P2/P3 finding.
3. **Live sitemap** (`docs/06`) — confirm the page appears in the deployed sitemap with a
   plausible `lastmod`. Flag any `public-index` page missing from it, or any URL present that
   should be `noindex`/private.
4. **Site health** (once per domain) — HTTPS enforcement, HSTS, security headers,
   `robots.txt`. Cross-check against `checklists/infrastructure-checklist.md`.
5. **Prioritization context** (optional, once per domain) — if the tool exposes domain
   authority or backlink data, use it only to help order the Phase 3 backlog (e.g. fix a
   crawl-blocking bug on an already well-linked page before a cosmetic one elsewhere). Never
   log domain authority or backlink counts as an "issue" to fix — they aren't ranking-factor
   defects, per `CONTRIBUTING.md` rule 3 (distinguish ranking factors from non-signals).

## Output — append to `SEO-AUDIT-PROGRESS.md`

Use `templates/live-signals.md`. File any new finding into the **existing** Phase 3 P1/P2/P3
backlog (`prompts/03-prioritize-fixes.md`'s format) — do not create a second priority list.

This is the final phase. See "What done means" in `START.md`.
```

- [ ] **Step 3: Verify the file was created correctly**

Run:
```bash
test -f prompts/05-live-signals.md && echo "FILE EXISTS" || echo "FILE MISSING"
grep -c "^## " prompts/05-live-signals.md
grep "templates/live-signals.md" prompts/05-live-signals.md
grep "prompts/03-prioritize-fixes.md" prompts/05-live-signals.md
```
Expected: `FILE EXISTS`; a heading count of 4 (`## 0. Applicability check`, `## Sampling`,
`## The checks…`, `## Output…`); both grep lines print a matching line (confirms the
cross-references are spelled correctly, not typo'd).

- [ ] **Step 4: Commit**

```bash
git add prompts/05-live-signals.md
git commit -m "Add Phase 5 (live signals) prompt"
```

---

### Task 2: Create the Phase 5 output template

**Files:**
- Create: `templates/live-signals.md`

**Interfaces:**
- Consumes: nothing directly, but its structure must match what `prompts/05-live-signals.md`
  (Task 1) instructs the assistant to fill in — Coverage, per-page table, domain-level
  findings, new backlog items.
- Produces: a file at `templates/live-signals.md` referenced by `prompts/05-live-signals.md`
  (Task 1, already written) and by `README.md` (Task 4).

- [ ] **Step 1: Write the "test" — a grep check that currently fails**

Run:
```bash
cd /Users/abhi/Downloads/Github/rankparse/Seo-Promt-Master
test -f templates/live-signals.md && echo "FILE EXISTS" || echo "FILE MISSING"
```
Expected: `FILE MISSING`

- [ ] **Step 2: Create `templates/live-signals.md`**

```markdown
# LIVE SIGNALS — <project name>

> Generated by SEO Prompt Master · Phase 5 (optional). Append this section to
> `SEO-AUDIT-PROGRESS.md`. If Phase 5 was skipped (no live URL or no connected MCP SEO tool),
> replace this whole section with a single line stating why, instead of filling in the tables
> below.

## Coverage
- Live URL: <url>
- MCP tool used: <name, e.g. RankParse>
- Sampled: <N> of <total public-index count> pages — <list of sampled routes>

## Per-page live checks

| Page | Live scrape vs. Phase 2 | CWV (LCP / CLS / INP, mobile) | In live sitemap? | New issues |
|---|---|---|---|---|
| | | | | |

_(repeat per sampled page)_

## Domain-level

- **Site health:** <HTTPS/HSTS/security headers/robots.txt findings>
- **Prioritization context (optional):** <domain authority / backlink notes, if used — context
  only, not an issue>

## New backlog items filed (into Phase 3's P1/P2/P3 list)

- [ ] …
```

- [ ] **Step 3: Verify the file was created correctly**

Run:
```bash
test -f templates/live-signals.md && echo "FILE EXISTS" || echo "FILE MISSING"
grep "^## Coverage" templates/live-signals.md
grep "^## Per-page live checks" templates/live-signals.md
grep "^## Domain-level" templates/live-signals.md
grep "^## New backlog items" templates/live-signals.md
```
Expected: `FILE EXISTS`, and all four grep lines print a match.

- [ ] **Step 4: Commit**

```bash
git add templates/live-signals.md
git commit -m "Add Phase 5 (live signals) output template"
```

---

### Task 3: Wire Phase 5 into `START.md`

**Files:**
- Modify: `START.md`

**Interfaces:**
- Consumes: `prompts/05-live-signals.md` (Task 1) — must reference this exact path.
- Produces: an updated `START.md` that `README.md` (Task 4) does not directly depend on, but
  should stay consistent with (both describe the same 5-phase-plus-optional workflow).

- [ ] **Step 1: Write the "test" — grep checks that currently fail**

Run:
```bash
cd /Users/abhi/Downloads/Github/rankparse/Seo-Promt-Master
grep -c "Phase 5" START.md
```
Expected: `0`

- [ ] **Step 2: Update the workflow heading**

In `START.md`, find:
```markdown
## The Workflow (5 phases)
```
Replace with:
```markdown
## The Workflow (5 phases + 1 optional)
```

- [ ] **Step 3: Add the Phase 5 section**

In `START.md`, find the Phase 4 section:
```markdown
### Phase 4 — Fix & verify  → `prompts/04-apply-and-verify.md`
Work the backlog top-down. Fix **shared infrastructure first** (metadata helper, sitemap, robots, i18n) because it fixes many pages at once, then per-page items. After each batch: typecheck → lint → build → verify the live/rendered output. Tick each item in `SEO-AUDIT-PROGRESS.md` as you complete it.

---
```
Replace with (adds a Phase 5 section directly after Phase 4, before the `---`):
```markdown
### Phase 4 — Fix & verify  → `prompts/04-apply-and-verify.md`
Work the backlog top-down. Fix **shared infrastructure first** (metadata helper, sitemap, robots, i18n) because it fixes many pages at once, then per-page items. After each batch: typecheck → lint → build → verify the live/rendered output. Tick each item in `SEO-AUDIT-PROGRESS.md` as you complete it.

### Phase 5 — Live signals (optional)  → `prompts/05-live-signals.md`
If the project has a live public URL **and** an MCP-connected SEO data tool is available (e.g. [RankParse](https://rankparse.com/docs/mcp)), sample a handful of pages and cross-check them against production: live Core Web Vitals, a live page-SEO scrape, and live sitemap coverage — the things a source-code audit structurally cannot see. Record findings in **`SEO-AUDIT-PROGRESS.md`** using `templates/live-signals.md`, filed into the existing Phase 3 backlog. If no live URL or MCP tool is available, skip this phase and say so.

---
```

- [ ] **Step 4: Add a "what done means" bullet**

In `START.md`, find:
```markdown
- [ ] Typecheck, lint, and build all pass. You have driven or rendered the changed routes and confirmed the output.

Print a final summary table: page → what changed → verification evidence.
```
Replace with:
```markdown
- [ ] Typecheck, lint, and build all pass. You have driven or rendered the changed routes and confirmed the output.
- [ ] Phase 5 was either run against a sample of live pages, or explicitly skipped with a stated reason (no live URL / no connected MCP SEO tool).

Print a final summary table: page → what changed → verification evidence.
```

- [ ] **Step 5: Verify the edits**

Run:
```bash
grep -c "Phase 5" START.md
grep "prompts/05-live-signals.md" START.md
grep "templates/live-signals.md" START.md
grep "5 phases + 1 optional" START.md
```
Expected: a count of at least `2` for the first check (heading + section title both mention
"Phase 5"); the other three grep lines each print a matching line.

- [ ] **Step 6: Commit**

```bash
git add START.md
git commit -m "Wire Phase 5 (live signals) into START.md workflow"
```

---

### Task 4: Wire Phase 5 into `README.md`

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: `prompts/05-live-signals.md` (Task 1), `templates/live-signals.md` (Task 2) — must
  reference these exact paths.
- Produces: nothing consumed by later tasks — this is the last content edit.

- [ ] **Step 1: Write the "test" — grep checks that currently fail**

Run:
```bash
cd /Users/abhi/Downloads/Github/rankparse/Seo-Promt-Master
grep -c "05-live-signals" README.md
```
Expected: `0`

- [ ] **Step 2: Update the file-tree block**

In `README.md`, find:
```markdown
├── prompts/                  ← the 5-phase workflow
│   ├── 00-bootstrap.md          detect stack + load knowledge base
│   ├── 01-discover-routes.md    enumerate & classify every route
│   ├── 02-audit-page.md         9-point audit per public page
│   ├── 03-prioritize-fixes.md   one ordered backlog (infra-first)
│   └── 04-apply-and-verify.md   fix + typecheck/lint/build + prove it
```
Replace with:
```markdown
├── prompts/                  ← the 5-phase workflow (+ 1 optional)
│   ├── 00-bootstrap.md          detect stack + load knowledge base
│   ├── 01-discover-routes.md    enumerate & classify every route
│   ├── 02-audit-page.md         9-point audit per public page
│   ├── 03-prioritize-fixes.md   one ordered backlog (infra-first)
│   ├── 04-apply-and-verify.md   fix + typecheck/lint/build + prove it
│   └── 05-live-signals.md       optional: cross-check against live production via MCP
```

In the same file-tree block, find:
```markdown
├── templates/                ← output files the AI fills in
│   ├── routes-inventory.md
│   └── audit-progress.md
```
Replace with:
```markdown
├── templates/                ← output files the AI fills in
│   ├── routes-inventory.md
│   ├── audit-progress.md
│   └── live-signals.md
```

- [ ] **Step 3: Update the one-picture workflow diagram**

In `README.md`, find:
```markdown
```
START.md
  │
  ├─ Phase 0  Bootstrap ......... detect framework, rendering, i18n; load docs/
  ├─ Phase 1  Discover .......... list EVERY route → ROUTES-INVENTORY.md
  │                               classify: public-index / public-noindex / private
  ├─ Phase 2  Audit ............. 9-point check per public page → SEO-AUDIT-PROGRESS.md
  ├─ Phase 3  Prioritize ........ one backlog, infra-first (P1 → P2 → P3)
  └─ Phase 4  Fix & verify ...... change → typecheck/lint/build → prove → tick
```
```
Replace with:
```markdown
```
START.md
  │
  ├─ Phase 0  Bootstrap ......... detect framework, rendering, i18n; load docs/
  ├─ Phase 1  Discover .......... list EVERY route → ROUTES-INVENTORY.md
  │                               classify: public-index / public-noindex / private
  ├─ Phase 2  Audit ............. 9-point check per public page → SEO-AUDIT-PROGRESS.md
  ├─ Phase 3  Prioritize ........ one backlog, infra-first (P1 → P2 → P3)
  ├─ Phase 4  Fix & verify ...... change → typecheck/lint/build → prove → tick
  └─ Phase 5  Live signals ...... optional: cross-check against live production via MCP
```
```

- [ ] **Step 4: Verify the edits**

Run:
```bash
grep -c "05-live-signals" README.md
grep "live-signals.md" README.md
grep "Phase 5  Live signals" README.md
grep "5-phase workflow (+ 1 optional)" README.md
```
Expected: a count of at least `1` for the first check; the other three grep lines each print a
matching line.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "Wire Phase 5 (live signals) into README.md"
```

---

### Task 5: Cross-repo consistency check, push branch, draft PR description

**Files:**
- None created or modified — verification only, plus a new file for the PR body draft.
- Create: `/private/tmp/claude-501/-Users-abhi-Downloads-Github-rankparse/f31a9367-cd31-48e3-870f-a88d8b0fcc09/scratchpad/pr-body.md`
  (scratch file, not part of the repo — used to hand the PR body to `gh pr create` later)

**Interfaces:**
- Consumes: every file created/modified in Tasks 1–4.
- Produces: a pushed branch on the fork (`abhibavishi/Seo-Promt-Master`) and a drafted PR body,
  ready for the user to review before the PR is actually opened.

- [ ] **Step 1: Full cross-reference consistency check**

Run:
```bash
cd /Users/abhi/Downloads/Github/rankparse/Seo-Promt-Master

# Every prompts/NN-*.md file mentioned in START.md must exist
for f in $(grep -oE 'prompts/[0-9]{2}-[a-z-]+\.md' START.md | sort -u); do
  test -f "$f" && echo "OK   $f" || echo "MISSING $f"
done

# Every templates/*.md file mentioned in START.md must exist
for f in $(grep -oE 'templates/[a-z-]+\.md' START.md | sort -u); do
  test -f "$f" && echo "OK   $f" || echo "MISSING $f"
done

# prompts/05-live-signals.md must reference templates/live-signals.md and docs/01, docs/05, docs/06
grep -c "docs/01\|docs/05\|docs/06" prompts/05-live-signals.md
```
Expected: every line printed is `OK   <path>` (no `MISSING` lines); the last command prints a
count of `4` or more (three distinct `docs/NN` citations, `docs/05` appears twice).

If any `MISSING` line appears, stop and fix the referencing file (do not proceed to Step 2)
before continuing.

- [ ] **Step 2: Confirm the repo's own knowledge-base doc supports the `docs/05` citation**

Run:
```bash
grep -i "core web vitals\|LCP\|CLS\|INP" docs/05-rendering-and-core-web-vitals.md | head -5
```
Expected: at least one matching line (confirms `docs/05` genuinely covers Core Web Vitals
thresholds, so Task 1's citation is accurate, not just plausible-looking).

- [ ] **Step 3: Push the branch to the fork**

```bash
git push -u origin feat/rankparse-live-signals-phase
```
Expected: push succeeds, branch appears at
`https://github.com/abhibavishi/Seo-Promt-Master/tree/feat/rankparse-live-signals-phase`.

- [ ] **Step 4: Draft the PR body**

Write to
`/private/tmp/claude-501/-Users-abhi-Downloads-Github-rankparse/f31a9367-cd31-48e3-870f-a88d8b0fcc09/scratchpad/pr-body.md`:

```markdown
## What

Adds an optional Phase 5 ("Live Signals") to the audit workflow: after the existing Phase
0–4 source-code audit, it cross-checks a sample of pages against **production** using an
MCP-connected SEO data tool — live Core Web Vitals, a live page-SEO scrape, and live sitemap
coverage. These three things are structurally invisible to a source-code-only audit (see
`prompts/02-audit-page.md` points 1–4, 8, 9), which is the gap this fills.

## Why

Phases 0–4 audit what the source *implies* Google will see. They can't measure real CWV, and
they can't catch drift between source and the deployed page (CDN rewrites, edge middleware,
env-specific config). Phase 5 adds exactly that, and only that — it doesn't re-run the static
audit.

## Design notes (see full spec in `docs/superpowers/specs/2026-07-21-live-signals-phase-design.md`)

- **Tool-agnostic**, per `CONTRIBUTING.md` rule 4: the phase is written around tool
  *capabilities* (page performance, page-SEO scrape, sitemap, site health via MCP), not a
  specific vendor. [RankParse](https://rankparse.com/docs/mcp) is the reference implementation
  I built and tested this against, but any MCP server exposing equivalent tools satisfies it.
- **Fully optional**: gated on a live public URL + a connected MCP tool both being present. If
  either is missing, the phase is skipped and the skip is logged — never guesses at production
  behavior from source.
- **Sampled, not exhaustive**: live data is rate-limited/billed per call, so it samples the
  homepage + up to 5 more representative pages rather than the full route inventory, and states
  the sample size (matching the "never silently cap coverage" convention already in
  `prompts/02-audit-page.md`).
- **Domain authority / backlinks are context only**, never logged as an "issue" — keeps the
  ranking-factor-vs-non-signal distinction from `CONTRIBUTING.md` rule 3.

## Open question for you

This is a different shape of change than the four "Good PRs" categories in `CONTRIBUTING.md`
(doc update / framework recipe / example / translation) — it's a new phase, not a change to an
existing one. Happy to adjust scope, fold it into Phase 2 as a sub-step, or drop it entirely if
it doesn't fit the direction you want for the repo — wanted to flag that explicitly rather than
assume it's in scope.

## Files changed

- `prompts/05-live-signals.md` (new)
- `templates/live-signals.md` (new)
- `START.md` (Phase 5 added to workflow + "what done means")
- `README.md` (Phase 5 added to file tree + workflow diagram)
```

- [ ] **Step 5: Report status — do not open the PR**

Print a summary to the user: branch pushed, PR body drafted at the path above, and that
`gh pr create` against `umutxyp/Seo-Promt-Master` requires their explicit go-ahead before
running (per this session's rules on publishing content to a third party). Do not run
`gh pr create` as part of this task.

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers the spec's "New files → prompt" section; Task 2 covers
  "New files → template"; Task 3 covers `START.md` edits; Task 4 covers `README.md` edits;
  Task 5 covers the spec's "Testing/validation" section (cross-reference + doc-accuracy
  checks) and the "Open questions for the maintainer" section (surfaced in the PR body draft).
  No spec section is without a task.
- **Placeholder scan:** no TBD/TODO; all code/markdown blocks are complete, copy-pasteable
  content, not descriptions of content.
- **Type/reference consistency:** `prompts/05-live-signals.md` references
  `templates/live-signals.md` (created in Task 2, same filename) and
  `prompts/03-prioritize-fixes.md` (pre-existing, verified by Task 5 Step 1). `START.md` and
  `README.md` both reference `prompts/05-live-signals.md` and `templates/live-signals.md` using
  the exact paths created in Tasks 1–2. `docs/05` citation verified against actual file content
  in Task 5 Step 2, not assumed.
