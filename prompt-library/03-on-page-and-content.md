# 03 — On-page & content

What the page says and how it says it. Some of this can't be measured mechanically — Google judges content quality, not tags — so these prompts keep the AI honest about what's judgement and what's a rule.

---

### Write titles and meta descriptions in bulk

**Use when:** many pages have missing, duplicate or boilerplate titles and descriptions.

```text
Act as an SEO copywriter. Write a <title> and a meta description for each page below.
Rules:
- unique per page, describing THIS page's specific content. No boilerplate.
- title: about 50–60 characters (a practical target, not a rule), main topic first, brand last separated by " | " or " – ". Brand = {{brand}}.
- description: about 140–160 characters. Say what the reader gets, in plain language. No keyword lists.
- language: {{language}}. Don't promise anything the page doesn't deliver.
- for programmatic pages, give a TEMPLATE that uses the entity's real fields, plus 3 filled examples.
Return a table: URL | title | length | description | length.

Pages (URL — what the page is):
{{list}}
```

### Fix the heading outline and semantics

**Use when:** pages have no H1, several H1s, or headings chosen for font size.

```text
Review the heading structure and landmarks of this page's HTML.
- exactly one <h1> stating the page's subject
- a logical h2/h3 outline. Note level skips as an accessibility issue (heading order is not a Google ranking factor, so don't oversell it).
- landmarks: <main>, <nav>, <article>, <section>, and <time datetime> for dates
- each section should open with a direct, self-contained sentence that answers the question its heading implies. That's what AI answer engines quote.
Give the corrected outline and the minimal markup diff.

HTML:
{{paste}}
```

### Plan internal linking

**Use when:** important pages are rarely crawled, or new pages take weeks to get discovered.

```text
Act as an information architect. My important pages, by priority: {{list with URLs}}
My templates: {{home, category, article, product…}}

Design internal linking so that:
- every important page is linked from at least one crawlable <a href>, ideally within 3 clicks of the home page
- anchors describe the destination (no "click here"); for image links, the alt text acts as the anchor
- hubs (category and topic pages) link down to their children, and children link back up and across to siblings
- pagination uses real ?page=n links, not "load more" alone
Output: a link plan per template (where the link sits, the anchor pattern, the target rule), plus the 10 highest-impact links to add first.
```

### Triage thin and low-value pages

**Use when:** Search Console shows many "Crawled – currently not indexed" pages, or after a core-update drop.

```text
Act as a content strategist who knows Google's spam policies (scaled content abuse, doorways, thin affiliation).
Here are pages with their 12-month data: URL | impressions | clicks | words | backlinks | last updated
{{paste table}}

Put every page in one bucket, with a one-line reason:
KEEP & DEEPEN (has demand and a unique angle) · MERGE (301 into the stronger page) · NOINDEX (useful to users, not to search) · DELETE (410).
Then define an index threshold as a product rule (for example, "a listing is indexable only when it has a description and is approved"), so that quality control stops depending on people remembering it.
Don't recommend producing more pages. A high not-indexed ratio is fixed by consolidating, not by adding.
```

### E-E-A-T and trust audit

**Use when:** YMYL sites (health, finance, legal), review sites, or any site after a quality-related drop.

```text
Act as a Search Quality Rater–minded reviewer. Audit {{site}} for trust signals (E-E-A-T is a framework, not a ranking factor):
- Who: author bylines with bios and credentials; an About page that works as the entity home; contact information and a real address or company details
- How: evidence of first-hand experience (original photos, data, tests); AI involvement disclosed where it exists
- Why: does each page exist to help someone, or to collect traffic?
- Trust: privacy policy, terms, accurate dates, a corrections policy, genuine reviews, affiliate and sponsored links disclosed and marked rel="sponsored"
- Structured data: Person for authors and Organization for the site, both with sameAs to profiles the site really controls
Output: a gap list with the specific page and fix for each. Mark YMYL-critical gaps.
```

### Write a content refresh brief

**Use when:** a page is declining, or it sits at positions 8–20 with high impressions.

```text
Act as an SEO editor. Page: {{url}}. Main query cluster: {{queries}}. Current position {{x}}, impressions {{y}}, CTR {{z}}.
Write a refresh brief:
1. Search intent: what does the searcher actually need? Name the gaps in the current page.
2. New outline (H2/H3), with the direct answer leading each section.
3. What's missing that only we can add: our own data, examples, screenshots, expert input.
4. Facts to update, with sources.
5. A title and description variant (the CTR problem).
6. 3–5 internal links to add pointing to this page, and from it.
7. How we'll measure it: the affected URL, a control page, and a 4–8 week window.
```

### Resolve keyword cannibalization

**Use when:** several of your URLs rank for the same query and swap places with each other.

```text
These URLs compete for the same query cluster "{{query}}":
{{URL | impressions | clicks | avg position, per URL}}
Decide: merge (which one wins, and 301 the rest), differentiate (give each a distinct intent and change the titles, H1s and internal anchors), or canonicalize (only for true duplicates).
Give the exact changes, and the internal links to repoint so that every signal points at the winner.
```
