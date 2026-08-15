# 17 — Off-Page & Entity Authority

The only chapter in this knowledge base about things that happen on other people's websites. It is also the part an automated audit cannot check, which is why it is here as judgement rather than as rules for `tools/seo-audit.mjs`.

## What off-page means in 2026

Backlink count alone stopped being the axis. Authority now stands on three legs:

1. **Editorial links** — relevant, given voluntarily by an authoritative source.
2. **Unlinked brand mentions** — your brand, product or founder named in credible contexts. These feed Google's entity understanding and, separately, an AI system's sense that it knows who you are.
3. **Entity consistency** — the same name, description and profiles everywhere: Wikidata, LinkedIn, X, GitHub, YouTube, industry directories.

- ⚠️ AI answer engines look for a **consistent, verifiable entity across the open web** before citing a brand. That does not replace classic link authority; it sits on top of it (`docs/10`).

## Judging a link

| Criterion | Good | Bad |
|---|---|---|
| Topical relevance | Same or adjacent vertical | Unrelated |
| Placement | In body copy, in context | Footer, sidebar, author box |
| Anchor | Natural, varied | Exact-match, repeated |
| Source traffic | Has real organic traffic | Zero traffic, sells links |
| Editorial decision | The writer chose it | Paid or exchanged |
| Site quality | Original content, real authors | Content farm, PBN |
| Outbound profile | Measured | 20 external links per post |

```html
<a href="..." rel="nofollow">    <!-- I don't vouch for this -->
<a href="..." rel="sponsored">   <!-- paid or advertising -->
<a href="..." rel="ugc">         <!-- user-generated -->
```

- ❌ **A paid link without `rel="sponsored"` is a link spam policy violation** (`docs/14`), on both sides of the transaction.

## Tactics that work

**Digital PR is the highest-return channel**, and for a site that already holds data it is nearly free:

- ✅ **Publish original data.** Turn what you already measure into an annual report, an index, a statistics page. Journalists link to data.
- ✅ Publish **free tools and calculators** — among the most-linked asset types that exist.
- ✅ Offer **quotable expert commentary** quickly when something happens in your sector.
- ✅ Publish **embeddable visualisations** (maps, charts, tables).

Sustainable channels: genuine industry directories, guest posts on publications with actual readers, partner and integration pages, open-source contribution, real community participation, honest comparisons and reviews, broken-link recovery, and politely asking to be linked where you are already mentioned.

**Not worth doing:** bulk directory submission, article spinning, PBNs, link exchange schemes, comment and forum-signature spam, "guest post" sites with no traffic, links bought through scaled outreach.

## Link profile health

Watch: referring domain count and trend, anchor distribution, follow/nofollow ratio, new vs lost link velocity, country/language mix, and which pages attract links.

Warning signs: an unexplained link spike; more than ~30% of anchors being one exact-match phrase; heavy links from unrelated verticals (gambling, adult, pharma); hundreds of domains from one IP or ASN.

### Disavow — a last resort

```txt
# disavow.txt
spam-example.com/bad-page
domain:entirely-spam-domain.com
```

- ⚠️ Google says **most sites never need this**; spam links are already ignored.
- Use it only if you have taken a manual action, or you knowingly bought bad links.
- ❌ Misuse causes **lasting damage** — disavowing good links takes months to undo. Domain-level entries are safer than per-URL ones.

## Building the entity

Slower than links, and more durable:

- **Brand search volume** is the strongest quality proxy there is. Product, community and PR investment is what moves it.
- **Consistent identity** — name, description, logo identical everywhere.
- **`sameAs` graph** — `docs/08` §entity SEO. Only list profiles you actually control; an unverifiable claim is worse than an absent one.
- **Wikidata** entry, if you meet the notability criteria — one of the biggest levers on entity resolution.
- **Third-party review platforms** — G2, Trustpilot, sector-specific sites.
- **Video and podcast presence** — YouTube transcripts are among the sources AI systems consume most.

## Measuring it

| Question | Where |
|---|---|
| How many referring domains, trending which way? | Ahrefs / Semrush / Majestic |
| What does Google actually see? | **GSC → Links report** — the only first-party answer |
| New and lost links | Tool alerts + a weekly look |
| Unlinked mentions | Alerts on the brand name |
| Brand search volume | GSC → Queries, brand-filtered, over time |
| AI citations | Bing Webmaster Tools AI Performance; manual prompt tests |

- ⚠️ Third-party authority scores (DA/DR/AS) are **not Google metrics**. Use them to compare, never as a target.

## Checklist
- [ ] GSC Links report reviewed on a schedule
- [ ] Every paid link carries `rel="sponsored"`; UGC links carry `rel="ugc nofollow"`
- [ ] There is a plan for producing linkable assets (data, tools, reports)
- [ ] `sameAs` profiles complete and consistent (`docs/08`)
- [ ] Anchor distribution looks natural
- [ ] Disavow used only where genuinely warranted
- [ ] Brand search volume tracked over time

## Sources
- Link spam policy — https://developers.google.com/search/docs/essentials/spam-policies#link-spam
- Qualify outbound links — https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- Disavow links — https://support.google.com/webmasters/answer/2648487
