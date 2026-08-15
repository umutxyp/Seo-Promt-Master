<!--
════════════════════════════════════════════════════════════════════════
  SEO PROMPT MASTER — UNIVERSAL AGENT ENTRY POINT
  Many coding agents (OpenAI Codex CLI, Cursor, Windsurf, GitHub Copilot,
  Amp, Jules, Claude Code, and others) auto-discover a root `AGENTS.md`
  before doing anything else in a repo. This file exists so the workflow
  below activates automatically, regardless of which agent opened this
  project — no manual "read START.md" instruction required.
════════════════════════════════════════════════════════════════════════
-->

# Agent instructions for this repository

If this repository (or a copy of it dropped alongside another project) is in
your context, you are looking at **SEO Prompt Master** — a prompt-driven SEO
audit-and-fix workflow with a runnable live audit tool.

**Read `START.md` now and execute the workflow it describes, in order, without
asking for permission to begin — and don't stop between phases or pages to check
in either. Keep going until every phase is done or you hit one of the specific,
named stopping conditions in `START.md`'s "Autonomy contract" section.**

## Before you open START.md

- **Run the tool, don't only read the code.**
  ```bash
  node tools/seo-audit.mjs --url https://the-site.example --max 40 --md seo-report.md
  ```
  Zero dependencies, Node 18+, works against `http://localhost:3000` too. Reading
  the repository tells you what the project *intends*; this tells you what the
  server *returns* — soft 404s per template, one-way hreflang sets, canonicals
  pointing at redirects, metadata streamed past `</head>`. Exits `1` on any P1.
  See `tools/README.md`.

- **`docs/01`–`docs/17` is the only source of truth for SEO claims.** Cite the
  section behind every recommendation. If a claim is not in there, say "not
  covered by the knowledge base" rather than recalling it — much of the SEO
  advice in training data predates INP replacing FID, FAQ rich results being
  removed, and `rel=next/prev` falling out of use. Docs 01–11 cover the page;
  12–17 cover crawling, indexing, quality, measurement, migrations and off-page.

- **`verticals/` has 24 industry overlays** (e-commerce, SaaS, marketplace,
  Discord bots, Minecraft server lists…). Check for a match in Phase 0; apply
  alongside the core audit, never instead of it.

- **The workflow ends with a computed SEO Score and GEO Score out of 100**
  (`docs/11`), with the category breakdown and the off-page caveat — not a bare
  number, and never a "final" score without full coverage and the self-recheck.

- **Progress is persisted** to `ROUTES-INVENTORY.md` and `SEO-AUDIT-PROGRESS.md`
  so long runs survive context resets. Check for these first and resume from
  them rather than starting over.

- **Never break the build.** Typecheck, lint and build after every change.

This file is intentionally short. The full ground rules, phase instructions and
definition of done live in `START.md` — go there next.

If your framework does not auto-load `AGENTS.md` or `START.md`, the user can
paste either file into the chat to activate the same workflow. Other agents have
their own entry points in this repository: `.claude/skills/seo-audit/SKILL.md`,
`.cursor/rules/seo-prompt-master.mdc`, `GEMINI.md`,
`.github/copilot-instructions.md`. `install.sh` writes all of them into another
project.
