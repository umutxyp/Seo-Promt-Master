# 03 — UGC, Forums & Blogs

## Link `rel` attributes (the most important forum/UGC rule)

- ✅ **User-generated links** (comments, forum posts, profiles) → `rel="ugc"`.
- ✅ **Paid / advertising links** → `rel="sponsored"` (preferred over the old `nofollow`).
- ✅ `rel="nofollow"` → general fallback for links you don't vouch for.
- ✅ **Moderation reward:** you may drop `ugc` from links posted by consistently trusted, high-quality members.
- ⚠️ These `rel` values usually stop link-following, but the target can still be **crawled if discovered elsewhere** (sitemap, external link). `rel` ≠ access block.
- ⚠️ Common bug: an HTML sanitizer that **overwrites** `rel` to `noopener noreferrer` and strips `nofollow`/`ugc`. Make sanitizers **append** `ugc nofollow noopener noreferrer`.

## Pagination (forum threads, blog archives, listings)

- ✅ Each paginated page needs its **own URL** (`?page=n`) and its **own self-referential canonical**. ❌ Don't canonicalize every page back to page 1.
- ✅ Link pages with real crawlable `<a href="?page=n">`. Google **does not click buttons** or run "load more"/infinite-scroll-only interactions — content past page 1 becomes invisible.
- ⚠️ `rel="next"`/`rel="prev"` are **obsolete for Google** (other engines may still use them). Harmless to keep, but not required.
- ❌ Don't encode page numbers as URL fragments (`#page=2`) — fragments aren't crawled as distinct pages.

## Faceted navigation / filters (large forums, catalogs)

- ✅ `Disallow` filter/sort parameters in `robots.txt` when those combinations don't need indexing — infinite filtered URL space wastes crawl budget.
- ⚠️ For `nofollow` to prevent crawling a faceted URL, **every** anchor to it must carry `nofollow` — partial coverage is ineffective.
- ✅ `rel="canonical"` to the unfiltered version reduces crawl of non-canonical variants over time.
- ✅ Use standard `&` separators; return **404** for empty filter combinations (not a redirect).

## Thin & moderated content

- ✅ Internal **search-result** pages (`?q=`, `?search=`) should be `noindex` (thin/duplicate).
- ✅ Hidden/deleted/moderated threads should return a real **404** (or `noindex`), not a 200 soft-404.
- ✅ Forum threads have a dedicated schema type — `DiscussionForumPosting` (see `docs/08`).

## Sources
- Qualify outbound links (ugc/sponsored/nofollow) — https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- Pagination — https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- Faceted navigation — https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation
