<!--
════════════════════════════════════════════════════════════════════════
  SEO PROMPT MASTER — GEMINI CLI ENTRY POINT
  Gemini CLI reads GEMINI.md from the working directory before acting.
  This file exists so the workflow activates there the same way AGENTS.md
  activates it in Codex and SKILL.md activates it in Claude Code.
════════════════════════════════════════════════════════════════════════
-->

# SEO Prompt Master

This repository is a prompt-driven SEO audit-and-fix workflow with a runnable
live audit tool. If it is in your context — on its own, or dropped alongside
another project — you have everything needed to bring that project's public
pages into compliance with Google's documented guidance.

**Read `START.md` and execute its phases in order. Begin without asking.**

## The short version

- **Knowledge base:** `docs/01`–`docs/17`, distilled from Google Search Central
  and web.dev. It is the only source of truth. Never assert a Google rule that
  is not in there — say "not covered by the knowledge base" instead.
- **Industry overlays:** `verticals/01`–`24`. Additive, never a replacement.
- **Phases:** `prompts/00`–`04`, plus optional `05` for live field data.
- **Progress files:** `ROUTES-INVENTORY.md` and `SEO-AUDIT-PROGRESS.md`. Check
  whether they already exist and resume rather than restarting.
- **Output:** a computed SEO Score and GEO Score out of 100 (`docs/11`), with a
  category breakdown and the off-page caveat.

## Run the tool

```bash
node tools/seo-audit.mjs --url https://the-site.example --max 40 --md seo-report.md
```

Zero dependencies, Node 18+. Reading the code tells you what the project
intends; this tells you what the server actually returns. Both matter, and they
disagree more often than you would expect. Exits `1` if any P1 finding is open.

## Ground rules

1. Fix shared infrastructure (metadata helper, sitemap, robots, i18n) before
   per-page work — it fixes hundreds of pages at once.
2. Typecheck, lint and build after every change. Never leave the build broken.
3. A page is fixed when you have re-fetched it and seen the change, not when you
   have edited the file.
4. Do not pause between phases or pages to ask whether to continue. Stop only if
   you cannot access the repo or build it, or if a finding needs a real product
   decision — ask that one question and carry on with everything else.
