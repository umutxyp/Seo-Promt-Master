# 05 — GEO: AI answer engines

Generative Engine Optimization: being found, quoted and cited by Google AI Overviews / AI Mode, ChatGPT search, Perplexity, Copilot, Claude and Gemini. **Classic SEO is the prerequisite.** None of these prompts replace `docs/01`–`docs/13`; they work on top of them.

---

### Decide the AI-crawler policy

**Use when:** robots.txt has no position on AI crawlers, or the business has never actually decided one.

```text
Help me make — and then implement — an explicit AI-crawler policy for {{site}}, a {{type of business}}.

Explain the three decisions separately, each with its trade-off:
1. Model training (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, CCBot…): blocking costs no search visibility, but the content isn't used to train models.
2. AI search and answers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, DuckAssistBot; Google AI Overviews use Googlebot itself; Copilot uses Bing): blocking means not being cited.
3. User-triggered fetchers (ChatGPT-User, Claude-User, Perplexity-User): what "a user asked about my page" means for us.
Ask me the two or three questions that decide this, then write the robots.txt groups (remember that a named group ignores *, so repeat the needed Disallows), plus a matching Content-Signal line.
Also list any page-level controls I might want: nosnippet or data-nosnippet for Google AI features, and noarchive or nocache for Copilot.
```

### Rewrite a page to be quotable (answer-first)

**Use when:** a page ranks but is never cited in AI answers.

```text
Act as an editor optimizing for AI answer engines without hurting human readers. Rewrite this page's structure. Keep the facts, the voice and the length roughly the same.
- every H2 or H3 is a question or a clear topic, and is followed IMMEDIATELY by a 1–2 sentence direct answer that still makes sense when quoted on its own
- comparisons → a table; steps or options → a list
- concrete numbers, dates and named entities instead of vague claims; cite sources for facts
- a visible author and last-updated date; our first-hand experience or data made explicit
- no keyword stuffing, no "AI chunks" written for machines, and no hidden text
Return: the new outline, the rewritten opening paragraph of each section, and a list of tables or lists to add.

Page:
{{paste}}
```

### Entity consistency audit

**Use when:** AI engines describe the brand wrongly, mix it up with someone else, or don't know it at all.

```text
Act as an entity-SEO analyst. Our entity: {{name}}, {{one-line description}}, site {{url}}.
1. List where the entity is described: the site's About page, JSON-LD Organization/Person, Wikidata, LinkedIn, GitHub, X, YouTube, directories, review platforms, press.
2. For each, compare the name, the description, the logo, the founding facts and the links back to the site. Flag every inconsistency.
3. Check the site's sameAs: does it point to all of these and only to profiles we control?
4. Recommend the 5 changes most likely to make AI engines resolve "who is this" correctly.
```

### Test AI citations (manual tracking)

**Use when:** you need a baseline before GEO work, or proof afterwards.

```text
Create an AI-visibility test plan for {{site}}, covering the topics {{topics}}.
1. Write 15 realistic prompts a potential customer would ask: a mix of informational, comparison ("best X for Y") and brand questions.
2. Make a tracking table: prompt | engine (ChatGPT search, Perplexity, Copilot, Google AI Mode/Overviews, Gemini, Claude) | are we cited? (Y/N + URL) | competitors cited | date.
3. Explain how to read the results alongside the first-party data: Search Console's Generative AI report (impressions), Bing Webmaster Tools AI Performance, and an analytics segment for AI referrers (chatgpt.com, perplexity.ai, copilot.microsoft.com, gemini.google.com, claude.ai).
4. Set the cadence: monthly, with the same prompts, logged.
```

### Should we add llms.txt?

**Use when:** someone asks for llms.txt or an "AI SEO file".

```text
Someone on my team wants to add llms.txt (or another "AI file") for SEO or GEO. Give me an evidence-based answer:
- what Google says officially about llms.txt and AI features
- whether any major AI search product has committed to using it in production
- what it costs (keeping it maintained) against what it's likely to return
- what to do instead: server-rendered content, an answer-first structure, entity markup with sameAs, an explicit AI-crawler policy
If we add it anyway (for example, for developer documentation), say how to do it without treating it as an SEO fix.
```

### Did AI Overviews take our clicks?

**Use when:** impressions are stable or rising while CTR and clicks fall.

```text
Search Console data for {{period vs previous period}}:
{{query | impressions | clicks | CTR | position — paste}}
Separate the causes: a change in demand, a change in ranking (position), or the SERP changing (an AI Overview or other feature absorbing the click while position stays flat).
For the queries hit hardest, check whether an AI Overview appears now and whether we're cited in it.
Recommend: which queries to stop chasing, which pages to restructure so they get cited (answer-first, tables, original data), and where titles and descriptions can win back the click.
```
