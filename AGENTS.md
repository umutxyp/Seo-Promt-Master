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

If this repository (or a copy of it dropped alongside another project) is in your context, you are looking at **SEO Prompt Master** — a prompt-driven SEO audit-and-fix workflow.

**Read `START.md` now and execute the workflow it describes, in order, without asking for permission to begin.**

Quick facts an agent needs before opening `START.md`:
- The workflow is 5 phases (`prompts/00`–`prompts/04`) plus one optional phase (`prompts/05-live-signals.md`, needs a live URL + MCP SEO tool), each with its own instruction file.
- `docs/` (currently `01`–`11`, including AI crawlers/GEO and a numeric SEO/GEO scoring rubric) is the only source of truth for SEO claims — never assert a Google rule that isn't cited there.
- The workflow ends with a real, computed **SEO Score** and **GEO Score** out of 100 (`docs/11`), not just a pass/fail list — don't report a final score without full page coverage and the self-recheck pass `docs/11` requires.
- Progress is persisted to `ROUTES-INVENTORY.md` and `SEO-AUDIT-PROGRESS.md` so long runs survive context resets — check for these files first and resume from them if they already exist, instead of starting over.
- Never break the build: typecheck/lint/build after every change.

This file is intentionally short. Full ground rules, phase-by-phase instructions, and the "definition of done" live in `START.md` — go there next.

If your agent framework does not auto-load `AGENTS.md` or `START.md`, the user can paste either file's contents directly into the chat to activate the same workflow (see `README.md` → "How to use", Option B).
