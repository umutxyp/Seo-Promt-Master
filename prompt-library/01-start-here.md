# 01 — Start here

The prompts most people need first. Each one works pasted into any AI assistant. If the assistant can see this repository (or a project with `.seo-prompt-master/` installed), it gets better: it can cite `docs/`, run `tools/seo-audit.mjs`, and edit the code.

Variables look like `{{this}}`. Replace them before sending.

---

### Full audit and fix (coding agent)

**Use when:** an agent (Claude Code, Codex, Cursor, Gemini CLI, Copilot) has the project open and you want the whole job done.

```text
Run the SEO Prompt Master workflow on this project, start to finish.

1. Read START.md and follow its phases in order (0 → 5). Don't stop between phases to ask whether to continue.
2. In Phase 0, run: node tools/seo-audit.mjs --url {{live_url_or_http://localhost:3000}} --max 40 --md seo-report.md
   (inside an installed project the path is .seo-prompt-master/tools/seo-audit.mjs). Keep the report open for the whole run.
3. Treat docs/01–docs/18 as the only source of truth and cite the section behind every finding. If a rule isn't there, say "not covered by the knowledge base".
4. Fix shared infrastructure first (metadata helper, robots, sitemap, i18n), then per-page issues. Typecheck, lint and build after every change. A fix only counts once you've re-fetched the page and seen it.
5. Persist progress to ROUTES-INVENTORY.md and SEO-AUDIT-PROGRESS.md, so the run can resume after a reset.
6. Finish with the SEO Score and GEO Score from docs/11 (before → after, per-category breakdown, coverage status, off-page caveat), plus a table of page → change → evidence.
```

### Quick 15-minute health check (URL only)

**Use when:** you have a URL but no code access, or you want a fast verdict before committing to a full audit.

```text
Act as a senior technical SEO. Give me a fast health check of {{url}}.

If you can run commands, run: npx github:umutxyp/Seo-Promt-Master --url {{url}} --max 15 --md seo-report.md
and base the answer on that report. If you can't, fetch these yourself: /robots.txt, the sitemap it lists, the homepage HTML, and 2 inner pages.

Report exactly:
1. Top 5 problems, ranked by impact. Use P1 (crawl/index blocker), P2 (misrepresented) or P3 (hygiene), with the evidence for each: the URL plus the header, tag or line you saw.
2. Crawler access: is the site open to Googlebot, Bingbot and Applebot? What is its AI-crawler policy (training vs AI search vs user-triggered)?
3. One quick win that can be done today.
Don't recommend llms.txt, meta keywords, or anything you can't tie to official search-engine documentation.
```

### Deep audit of a single page

**Use when:** one important page (homepage, top landing page, money page) has to be right.

```text
Audit this single page as a technical SEO and GEO reviewer: {{url}}
(Page type: {{homepage | article | product | category | profile | tool}}. Target query: {{main query}}.)

Work through all 9 points and give a verdict for each (✅ / ⚠️ / ❌), with the evidence you saw:
1 metadata (title, description, OG) · 2 canonical, hreflang and redirects · 3 robots meta + X-Robots-Tag header · 4 JSON-LD (type fits the page, reflects visible content, required properties present) · 5 headings & semantics · 6 images (alt, dimensions, LCP image eager) · 7 internal links & anchors · 8 rendering (is the main content in the raw HTML?) · 9 sitemap presence.
Then the GEO view: does each section lead with a direct, quotable answer? Is the author or organization identifiable?
End with a prioritized fix list. Give exact code or tag changes, not advice.
```

### Resume an interrupted audit

**Use when:** a long run hit a context limit or a new session started.

```text
Resume the SEO Prompt Master audit in this project. Don't start over.
Read ROUTES-INVENTORY.md and SEO-AUDIT-PROGRESS.md and tell me in one line where the run stopped (phase, last page, open backlog count). Then continue from exactly that point.
Don't re-litigate decisions already recorded. Re-verify a random 15% (at least 3) of the items already ticked against the real rendered output before you trust them.
```

### Explain my seo-audit report

**Use when:** you ran `tools/seo-audit.mjs` and want it turned into a plan a non-specialist can follow.

```text
Below is the output of seo-audit (SEO Prompt Master). Explain it to me as a plan.

For each finding group:
- what it means, in plain language
- whether it can really hurt rankings or AI visibility, or is hygiene
- the exact fix for my stack ({{framework}})
- how I'll verify the fix (command or check)

Then give an order of work: infrastructure P1 → page P1 → P2 → P3. Name anything that's a business decision rather than a bug (for example, the AI-crawler policy).

REPORT:
{{paste seo-report.md here}}
```
