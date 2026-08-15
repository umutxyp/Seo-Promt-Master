# 14 — Content Quality, E-E-A-T & Spam Policies

Everything else in `docs/` is mechanical and verifiable. This is the part an audit can only surface, not settle — but the policies themselves are specific, and violating them is measurable.

## E-E-A-T

**Experience · Expertise · Authoritativeness · Trust.**

- ⚠️ **E-E-A-T is not a ranking factor.** It is the framework Google's quality raters use, and Google says it tries to *align* its systems with it. It is never measured directly — only approached through proxy signals.
- **Trust is the centre.** The other three feed it. An untrustworthy page is low quality no matter how expert.

| Dimension | What it actually looks like on a site |
|---|---|
| Experience | Your own measurements, tests, screenshots, first-hand photos, real user content |
| Expertise | Author bios with credentials, `Person` schema, author archive pages, topical depth |
| Authoritativeness | Industry citations, digital PR, brand mentions, Wikidata presence, `sameAs` (`docs/08`) |
| Trust | HTTPS, real contact/address, about page, privacy and terms, accurate dates, a corrections policy, genuine reviews, disclosed advertising and affiliate relationships |

**YMYL** topics — health, finance, law, safety, major life decisions — are held to a much higher bar. Anonymous or unedited generated content does not rank there in practice.

## The "Who, How, Why" test

Google's helpful-content framing, refreshed December 2025:

- **Who** produced it, and is that visible?
- **How** was it produced? **If automation or AI played a role, disclose it.** If you claim testing, where is the evidence?
- **Why** does it exist? The answer needs to be "to help someone", not "to collect search traffic".

- ⚠️ **"Helpful content" is not a separate system or penalty.** Since March 2024 it is part of core ranking. "Hit by HCU" now means "hit by a core update", and the recovery path is not a one-off repair — it is raising the site-wide quality ratio.

## The spam policies (2026)

Violations lead to algorithmic demotion or a **manual action**.

| # | Policy | Short form |
|---|---|---|
| 1 | Cloaking | Different content to users and crawlers |
| 2 | Doorway abuse | Many similar pages/domains funnelling to the same destination |
| 3 | Expired domain abuse | Buying an aged domain to host unrelated low-value content |
| 4 | Hacked content | Injected content or redirects |
| 5 | Hidden text & link abuse | Invisible text or links |
| 6 | Keyword stuffing | Unnatural keyword or location lists |
| 7 | Link spam | Buying/selling links, excessive exchange, automated links, PBNs |
| 8 | Machine-generated traffic | Unauthorised automated querying / rank scraping |
| 9 | Malicious behavior | Malware, unwanted software, back-button hijacking |
| 10 | Misleading functionality | Pages that do not do what they promise |
| 11 | **Scaled content abuse** | Producing many low-value pages at scale, by any method |
| 12 | Scraping | Republishing others' content without adding value |
| 13 | Site reputation abuse | Third-party content exploiting a host's authority ("parasite SEO") |
| 14 | Sneaky redirects | Sending users somewhere the crawler was not sent |
| 15 | Thin affiliation | Affiliate content with no original value |
| 16 | User-generated spam | Forum/comment/profile spam — the site owner is responsible either way |

**Enforcement focus in 2026:** the June 2026 spam update deliberately did *not* target link spam or site reputation abuse; it targeted content-level violations — cloaking, doorways, expired-domain abuse, hacked content, hidden text, keyword stuffing and **scaled content abuse**. Scaled content abuse has been the most aggressively enforced item since 2024, and increasingly overlaps with unedited bulk AI output.

### The line on AI-assisted content

> Google judges the **result**, not the production method. AI-assisted, edited, accurate, genuinely useful content is compliant. Unedited, scaled, value-free production is **scaled content abuse** and is demoted.

The practical test: *is the human effort that went into this page proportional to the value it gives the reader?*

## Directory, listing and UGC sites

Any site with tens of thousands of generated entity pages sits close to the scaled-content line. What separates a legitimate directory from a violation:

- ✅ Does each page carry **real, unique, human-supplied data** — a description, reviews, a command list, membership figures?
- ✅ Is someone actually looking for this page, or does it exist to fill an index?
- ✅ Are empty entries kept out of the index by a **threshold**, not published by default?

**Define the index threshold as a product rule, not an SEO rule.** If a listing is only publishable when approved and not deleted, then "approved and not deleted" should be the same condition that governs its presence in the sitemap, the category pages and the index. When the product rule and the index rule are one rule, quality control stops being a separate thing anyone has to remember.

For UGC specifically: moderate or `noindex` low-quality posts, `noindex` empty profiles and empty topics, mark user links `rel="ugc nofollow"` (`sponsored` for paid), and run rate limiting and spam detection. Third-party "sponsored sections" that trade on your domain's authority fall under **site reputation abuse**.

## Manual actions and recovery

**Manual action** (GSC → Security & Manual Actions): applied by a human reviewer, and you are notified.

1. Establish the scope — site-wide or a section.
2. Fix the cause completely. Hiding it or cleaning part of it does not pass review.
3. Document what you changed and why.
4. Submit a reconsideration request: honest, detailed, evidenced.
5. Expect days to weeks. A rejection means the cleanup was not deep enough.

**Algorithmic decline**: no notification, empty manual actions report. Recovery usually waits for the next core update (months), and fixing a handful of pages does not do it — the site-wide quality ratio has to move. Delete or merge the worthless, deepen the rest.

## Checklist
- [ ] Author information, about, contact, privacy and terms pages are real and populated
- [ ] AI involvement, where it exists, is disclosed; output is edited
- [ ] Zero-traffic thin pages have been audited (delete / merge / deepen)
- [ ] UGC moderation, `rel="ugc nofollow"` and spam protection are live
- [ ] Affiliate and sponsored content is labelled, links marked `rel="sponsored"`
- [ ] Manual actions report is clean
- [ ] Ratings and reviews are genuine; incentivised reviews disclosed
- [ ] Generated entity pages sit behind an index threshold that is also the product's own publish rule

## Sources
- Spam policies — https://developers.google.com/search/docs/essentials/spam-policies
- Creating helpful, reliable, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Search Quality Rater Guidelines — https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf
- Search Essentials — https://developers.google.com/search/docs/essentials
