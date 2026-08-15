# SEO Prompt Master

This repository is a prompt-driven SEO audit-and-fix workflow with a runnable
live audit tool.

The full instructions live in the skill at
`.claude/skills/seo-audit/SKILL.md`, which Claude Code loads automatically when
a task involves search visibility — an SEO audit, indexing or crawl problems,
canonicals, hreflang, sitemaps, `robots.txt`, structured data, a traffic drop, a
migration, or AI answer-engine visibility.

If the skill is not available in your environment, read `START.md` and follow
its phases directly. Either path leads to the same workflow.

Two things worth knowing before you start:

- **`docs/01`–`docs/17` is the only source of truth.** Never assert a Google rule
  that is not in there. Much of the SEO advice in training data predates INP
  replacing FID, FAQ rich results being removed, and `rel=next/prev` falling out
  of use — the knowledge base is explicit about all three.
- **Run `tools/seo-audit.mjs`, don't only read the code.** Reading the repository
  tells you what the project intends; the tool tells you what the server returns.
