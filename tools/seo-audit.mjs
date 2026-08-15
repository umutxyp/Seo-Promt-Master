#!/usr/bin/env node
/**
 * seo-audit — the part of SEO Prompt Master that runs instead of reasoning.
 *
 * An agent reading a repository can tell you what the code intends. It cannot
 * tell you what the server actually returns, whether hreflang sets are
 * reciprocal across pages it never opened, or whether a template quietly
 * answers 200 for a URL that does not exist. This does.
 *
 * Zero dependencies. Node 18+ (needs global fetch).
 *
 *   node tools/seo-audit.mjs --url https://example.com
 *   node tools/seo-audit.mjs --url https://example.com --max 80 --json report.json --md report.md
 *   node tools/seo-audit.mjs --url http://localhost:3000 --insecure
 *
 * Every finding carries a docs/ citation. If a check cannot be traced to a rule
 * in the knowledge base, it does not belong here.
 */

import { writeFileSync } from "node:fs";

// ─────────────────────────────────────────────────────────────────────────────
// Arguments
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const flag = (name) => args.includes(`--${name}`);

const BASE = opt("url");
const MAX_PAGES = Number(opt("max", 40));
const CONCURRENCY = Number(opt("concurrency", 4));
const TIMEOUT_MS = Number(opt("timeout", 20000));
const JSON_OUT = opt("json");
const MD_OUT = opt("md");
const QUIET = flag("quiet");

if (!BASE || flag("help") || flag("h")) {
  console.log(`
seo-audit — live technical SEO audit

  --url <origin>        Site to audit (required). e.g. https://example.com
  --max <n>             Max pages to fetch (default 40)
  --concurrency <n>     Parallel requests (default 4)
  --timeout <ms>        Per-request timeout (default 20000)
  --json <file>         Write the machine-readable report
  --md <file>           Write the human-readable report
  --quiet               Only print the summary

Exit code is 1 if any P1 finding is open, else 0 — so it can gate a deploy.
`);
  process.exit(BASE ? 0 : 1);
}

const ORIGIN = new URL(BASE).origin;
const UA =
  "Mozilla/5.0 (compatible; seo-audit/1.0; +https://github.com/umutxyp/Seo-Promt-Master)";

// ─────────────────────────────────────────────────────────────────────────────
// Findings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * P1 — the page may not be indexed at all (crawl/index blocker).
 * P2 — indexed but misrepresented (structured data, duplication, rendering).
 * P3 — hygiene and polish.
 */
const findings = [];
const add = (severity, doc, where, message, evidence) =>
  findings.push({ severity, doc, where, message, evidence });

const log = (...a) => {
  if (!QUIET) console.error(...a);
};

// ─────────────────────────────────────────────────────────────────────────────
// Fetching
// ─────────────────────────────────────────────────────────────────────────────

const cache = new Map();

async function get(url, { redirect = "manual", method = "GET" } = {}) {
  const key = `${method} ${redirect} ${url}`;
  if (cache.has(key)) return cache.get(key);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let result;
  try {
    const res = await fetch(url, {
      method,
      redirect,
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "*/*" },
    });
    const contentType = res.headers.get("content-type") || "";
    const body =
      method === "HEAD" || res.status >= 300
        ? ""
        : contentType.includes("image/") || contentType.includes("font/")
          ? ""
          : await res.text();
    result = {
      ok: true,
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      location: res.headers.get("location"),
      body,
      url,
    };
  } catch (error) {
    result = { ok: false, status: 0, headers: {}, body: "", url, error: String(error) };
  } finally {
    clearTimeout(timer);
  }
  cache.set(key, result);
  return result;
}

async function pool(items, worker, size = CONCURRENCY) {
  const out = [];
  let cursor = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      out[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Minimal HTML extraction
//
// A real parser would be better and would also be a dependency. These patterns
// only ever read <head> metadata and coarse body structure, which is regular
// enough in practice; anything subtler is left to the agent reading the page.
// ─────────────────────────────────────────────────────────────────────────────

/* What a reader would see: scripts, styles and the document head removed.
 *
 * The head matters. `<title>` is text, and left in, it lands in the extracted
 * body — so a page whose entire content arrives with JavaScript would appear to
 * "contain its own subject" purely because the subject is also its title. That
 * is precisely the page this tool needs to catch. `<title>` is stripped
 * separately as well, because a framework that streams metadata emits it
 * outside `</head>`. */
const stripped = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<title[\s\S]*?<\/title>/gi, " ");

const decode = (s = "") =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null;
};

function parsePage(html) {
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  const head = headMatch ? headMatch[0] : html;

  /**
   * Metadata is read from the whole document, not just <head>.
   *
   * Frameworks that stream (Next.js 15+ among them) flush <head> early and emit
   * <title>, canonical and hreflang later in the stream. Browsers and Google's
   * renderer hoist those into the head; a regex over <head> alone would report
   * a fully-tagged page as having no title at all. <svg><title> is stripped
   * first so an inline icon cannot masquerade as the page title.
   */
  const doc = html.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  const tags = (re) => doc.match(re) || [];

  const titleMatch = doc.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metas = tags(/<meta\b[^>]*>/gi);
  const links = tags(/<link\b[^>]*>/gi);
  const streamedMetadata = Boolean(
    headMatch && titleMatch && !/<title/i.test(head),
  );

  const metaByName = (name) => {
    const t = metas.find(
      (m) => (attr(m, "name") || "").toLowerCase() === name.toLowerCase(),
    );
    return t ? attr(t, "content") : null;
  };
  const metaByProperty = (prop) => {
    const t = metas.find(
      (m) => (attr(m, "property") || "").toLowerCase() === prop.toLowerCase(),
    );
    return t ? attr(t, "content") : null;
  };

  const linksRel = (rel) =>
    links.filter((l) => (attr(l, "rel") || "").toLowerCase().split(/\s+/).includes(rel));

  const canonicalTag = linksRel("canonical")[0];
  const alternates = linksRel("alternate")
    .map((l) => ({ hreflang: attr(l, "hreflang"), href: attr(l, "href") }))
    .filter((a) => a.hreflang && a.href);

  const body = stripped(html);
  const headings = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: decode(m[2].replace(/<[^>]+>/g, " ")).slice(0, 120),
  }));

  const images = [...body.matchAll(/<img\b[^>]*>/gi)]
    .map((m) => m[0])
    .map((tag) => ({
      src: attr(tag, "src"),
      alt: attr(tag, "alt"),
      width: attr(tag, "width"),
      height: attr(tag, "height"),
      loading: attr(tag, "loading"),
      hasAltAttribute: /\balt\s*=/i.test(tag),
      /* Is this image's box already reserved by CSS?
       *
       * Google asks for width/height *or* a reserved space — an aspect-ratio
       * box is the documented alternative, not a workaround. An image that
       * fills a sized container (`size-full`, `w-full h-full`, `absolute
       * inset-0`, an explicit `aspect-*`) has its space reserved before the
       * bytes arrive, and reporting it as a layout-shift risk is noise. It was
       * 113 findings on one site, all of them wrong, which is how a checker
       * teaches people to ignore it. */
      cssSized:
        /\b(size-full|w-full|h-full|inset-0|aspect-|object-(cover|contain))\b/.test(
          attr(tag, "class") || "",
        ) || /\b(width|height|aspect-ratio)\s*:/i.test(attr(tag, "style") || ""),
    }));

  const anchors = [...body.matchAll(/<a\b[^>]*>/gi)]
    .map((m) => ({ href: attr(m[0], "href"), rel: attr(m[0], "rel") }))
    .filter((a) => a.href);

  const jsonLdRaw = [
    ...html.matchAll(
      /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1]);

  const text = decode(body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));

  return {
    title: titleMatch ? decode(titleMatch[1].replace(/<[^>]+>/g, "")) : null,
    description: metaByName("description"),
    robots: metaByName("robots"),
    googlebot: metaByName("googlebot"),
    canonical: canonicalTag ? attr(canonicalTag, "href") : null,
    alternates,
    lang: (html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i) || [])[1] || null,
    og: {
      title: metaByProperty("og:title"),
      description: metaByProperty("og:description"),
      image: metaByProperty("og:image"),
      url: metaByProperty("og:url"),
      type: metaByProperty("og:type"),
    },
    twitterCard: metaByName("twitter:card"),
    headings,
    images,
    anchors,
    jsonLdRaw,
    streamedMetadata,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    textSample: text.slice(0, 400),
    /* Does the raw HTML actually contain what the page is about?
     *
     * Computed here, against the full text, because the caller only keeps a
     * sample — and the subject of a page is as likely to be halfway down it as
     * in the first 400 characters.
     *
     * The h1 is the best statement of the subject, but the worst pages do not
     * have one: a shell that renders everything client-side often renders its
     * heading there too. So the title is the fallback, with the site-name
     * suffix trimmed off — "Uspomene by Ana Bekuta | Beatra" is about a song,
     * and matching on "Beatra" would pass every page on the site.
     */
    subjectRendered: (() => {
      const heading = headings.find((h) => h.level === 1)?.text?.trim() ?? "";
      const fromTitle = (titleMatch ? decode(titleMatch[1].replace(/<[^>]+>/g, "")) : "")
        .split(/\s+[|·—–-]\s+/)[0]
        .trim();
      /* The title is a fallback for pages with no h1 at all, not for pages
       * whose h1 is merely short.
       *
       * A title is often a constructed sentence — "shxrky.022 Discord Profile
       * on Sylon" — and that sentence does not appear anywhere in the body even
       * on a page that renders perfectly. Falling back to it whenever the h1
       * was short turned every symbol-named profile into a false positive. If
       * the page has a heading, that heading is the subject; if it cannot be
       * judged, the honest answer is to not judge it. */
      const subject = heading.length > 0 ? heading : fromTitle;

      /* A subject has to be long enough to be searched for.
       *
       * Some pages are titled with a single symbol or two ideographs — a
       * display name of "❦", a track called "呼喚". Combining marks (U+20DF and
       * friends) attach to whatever precedes them once the text is normalised,
       * so a substring test on one of those fails even when the name is plainly
       * on the page. Every such case observed in testing was a false positive,
       * and a check that cries wolf on unusual names is worse than no check.
       *
       * Counted after stripping marks, punctuation and symbols, so "❦" is one
       * character and "呼喚" is two — neither is enough to conclude anything. */
      const meaningful = subject
        .normalize("NFKD")
        .replace(/[\p{M}\p{P}\p{S}\s]/gu, "");
      if (meaningful.length < 4) return null;

      /* Both sides folded the same way before comparing.
       *
       * A display name like "♚          𝐐𝐀𝐘𝐒" is on the page, but the
       * extracted text has had its runs of whitespace collapsed while the
       * heading string still carries them, and the mathematical letterforms
       * lowercase differently from their ASCII equivalents. Comparing a raw
       * subject against normalised text reports a rendered page as an empty
       * shell. Fold decoration away on both sides and what is left is the
       * question actually being asked: does the page contain its own name? */
      const fold = (value) =>
        value
          .normalize("NFKD")
          .toLowerCase()
          .replace(/[\p{M}\p{P}\p{S}]/gu, "")
          .replace(/\s+/g, " ")
          .trim();

      const needle = fold(subject).slice(0, 24).trim();
      if (needle.length < 4) return null;

      /* Note that when the subject came from an `<h1>`, this is close to
       * self-satisfying — the heading is itself part of the extracted text. That
       * is deliberate, not an oversight. The question is "does the raw HTML say
       * what this page is about", and a server-rendered `<h1>` answers it: the
       * subject is there before any JavaScript runs. The pages this catches are
       * the ones with no heading in the HTML at all, which is what a shell that
       * renders its own title client-side looks like. Whether such a page then
       * has *enough* content is the word-count question below, and a different
       * finding with a different fix. */
      return fold(text).includes(needle);
    })(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// URL helpers
// ─────────────────────────────────────────────────────────────────────────────

const sameOrigin = (u) => {
  try {
    return new URL(u, ORIGIN).origin === ORIGIN;
  } catch {
    return false;
  }
};

/** Compare URLs the way a canonical check has to: ignore the fragment and the
 *  trailing-slash difference, but never ignore the query — `?page=2` is a
 *  different page and treating it as the same one is how pagination gets
 *  wrongly reported as canonicalised. */
function normalize(u) {
  try {
    const url = new URL(u, ORIGIN);
    url.hash = "";
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return u;
  }
}

/**
 * hreflang values are case-insensitive per Google, so `zh-tw` is as valid as
 * `zh-TW` and flagging the lowercase form is noise. What genuinely gets a line
 * dropped is a malformed value: an underscore instead of a hyphen, a bare
 * country code, or a region that is not ISO 3166-1 alpha-2 / UN M.49.
 */
const ISO_LANG = /^([a-z]{2,3})(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$|^x-default$/i;

// ─────────────────────────────────────────────────────────────────────────────
// Site-level checks
// ─────────────────────────────────────────────────────────────────────────────

async function checkRobots() {
  const url = `${ORIGIN}/robots.txt`;
  const res = await get(url, { redirect: "follow" });

  if (res.status !== 200) {
    // 4xx means "no rules", which is permissive rather than broken; 5xx stops
    // Googlebot crawling the site entirely for the first ~12 hours.
    const severity = res.status >= 500 || res.status === 0 ? "P1" : "P2";
    add(
      severity,
      "docs/12",
      "/robots.txt",
      `robots.txt returned ${res.status || "no response"}. A 5xx here halts crawling site-wide; a 4xx means every rule you think you have is being ignored.`,
      { status: res.status },
    );
    return { text: "", sitemaps: [] };
  }

  const text = res.body;
  const bytes = Buffer.byteLength(text, "utf8");

  if (bytes > 500 * 1024) {
    add("P2", "docs/12", "/robots.txt", `robots.txt is ${Math.round(bytes / 1024)} KiB; Google stops processing after 500 KiB.`, { bytes });
  }

  const sitemaps = [...text.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (sitemaps.length === 0) {
    add("P3", "docs/06", "/robots.txt", "No `Sitemap:` line in robots.txt. It is the one discovery hint every engine reads without being asked.", null);
  }
  for (const s of sitemaps) {
    if (!/^https?:\/\//i.test(s)) {
      add("P2", "docs/06", "/robots.txt", `Sitemap line "${s}" is not an absolute URL; relative sitemap references are ignored.`, null);
    }
  }

  // A global Disallow: / under User-agent: * is almost always a staging file
  // that shipped. Worth shouting about.
  const groups = parseRobotsGroups(text);
  const star = groups.find((g) => g.agents.includes("*"));
  if (star && star.disallow.includes("/") && !star.allow.length) {
    add("P1", "docs/12", "/robots.txt", "`User-agent: * / Disallow: /` blocks the entire site from every crawler. If this is production, nothing can be crawled.", null);
  }

  for (const critical of ["/_next/", "/static/", "/assets/", "/css/", "/js/"]) {
    if (star && star.disallow.some((d) => critical.startsWith(d) && d !== "/")) {
      add("P1", "docs/05", "/robots.txt", `Blocking ${critical} stops Google rendering the page — blocked CSS/JS produces an empty rendered DOM.`, null);
    }
  }

  const aiBots = ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "PerplexityBot", "OAI-SearchBot"];
  // Either way of stating it counts: per-bot groups, or the newer machine-readable
  // `Content-Signal:` declaration (contentsignals.org / IETF AIPREF), which says
  // the same thing in one line. A site that has decided is a site that has decided.
  const mentionsAi =
    aiBots.some((b) => new RegExp(`user-agent:\\s*${b}`, "i").test(text)) ||
    /^\s*Content-Signal\s*:/im.test(text);
  if (!mentionsAi) {
    add("P3", "docs/10", "/robots.txt", "robots.txt takes no explicit position on AI crawlers. Training, AI-search and user-triggered fetching are three different decisions; defaulting silently is not one of them.", null);
  }

  return { text, sitemaps };
}

function parseRobotsGroups(text) {
  const groups = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      if (!current || current.started) current = { agents: [], disallow: [], allow: [], started: false };
      current.agents.push(value.toLowerCase());
      if (!groups.includes(current)) groups.push(current);
    } else if (current && (key === "disallow" || key === "allow")) {
      current.started = true;
      current[key].push(value);
    }
  }
  return groups;
}

async function collectSitemapUrls(sitemapUrls) {
  const seen = new Set();
  const urls = [];
  const queue = [...sitemapUrls];
  let filesRead = 0;

  while (queue.length && filesRead < 25) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    filesRead++;

    const res = await get(sm, { redirect: "follow" });
    if (res.status !== 200) {
      add("P2", "docs/06", sm, `Sitemap returned ${res.status}. A sitemap referenced but not served is a discovery hole.`, { status: res.status });
      continue;
    }
    const isIndex = /<sitemapindex/i.test(res.body);
    const locs = [...res.body.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) => decode(m[1]));

    if (isIndex) {
      queue.push(...locs);
      continue;
    }

    if (locs.length > 50000) {
      add("P2", "docs/06", sm, `Sitemap holds ${locs.length} URLs; the protocol limit is 50,000 per file. Everything past the limit is ignored.`, { count: locs.length });
    }
    if (/<priority>|<changefreq>/i.test(res.body)) {
      add("P3", "docs/06", sm, "`<priority>` / `<changefreq>` are ignored by Google. They only make the file bigger.", null);
    }

    const lastmods = [...res.body.matchAll(/<lastmod>\s*([\s\S]*?)\s*<\/lastmod>/gi)].map((m) => m[1].trim());
    const badFormat = lastmods.filter((d) => !/^\d{4}-\d{2}-\d{2}([T ]|$)/.test(d));
    if (badFormat.length) {
      add("P3", "docs/06", sm, `${badFormat.length} \`<lastmod>\` values are not W3C datetimes (e.g. "${badFormat[0]}").`, null);
    }
    // Every lastmod identical and equal to today is the signature of a build
    // stamping the whole catalogue, which makes the signal worthless.
    if (lastmods.length > 20) {
      const unique = new Set(lastmods.map((d) => d.slice(0, 10)));
      if (unique.size === 1) {
        add("P3", "docs/06", sm, `All ${lastmods.length} entries share one \`lastmod\` date (${[...unique][0]}). A lastmod that moves on deploy rather than on edit gets discounted entirely.`, null);
      }
    }

    urls.push(...locs);
  }

  return urls;
}

async function checkHostConsolidation() {
  const url = new URL(ORIGIN);
  const isWww = url.hostname.startsWith("www.");
  const other = isWww
    ? `${url.protocol}//${url.hostname.slice(4)}/`
    : `${url.protocol}//www.${url.hostname}/`;

  const [httpRes, otherRes] = await Promise.all([
    get(`http://${url.hostname}/`),
    get(other),
  ]);

  if (httpRes.status === 200) {
    add("P2", "docs/01", "http://", "The http:// origin serves 200 instead of redirecting. Both protocols are then independently crawlable duplicates.", null);
  } else if (httpRes.status && httpRes.status !== 301 && httpRes.status < 400) {
    add("P3", "docs/01", "http://", `http:// answers ${httpRes.status}; a permanent move should be 301.`, { status: httpRes.status });
  }

  if (otherRes.status === 200) {
    add("P2", "docs/01", other, `Both ${url.hostname} and its ${isWww ? "bare" : "www"} counterpart serve 200. Pick one canonical host and 301 the other.`, null);
  }
}

/** Soft 404 detection. A template that answers 200 for a URL that cannot exist
 *  is invisible in a browser and costs the whole template its indexing. */
async function checkNotFound(paths) {
  for (const path of paths) {
    const probe = `${ORIGIN}${path.replace(/\/$/, "")}/seo-audit-nonexistent-${Date.now().toString(36)}`;
    const res = await get(probe, { redirect: "follow" });
    if (res.status === 200) {
      const parsed = parsePage(res.body);
      const saysNoindex = /noindex/i.test(parsed.robots || "");
      add(
        saysNoindex ? "P3" : "P1",
        "docs/13",
        probe,
        saysNoindex
          ? "Missing page answers 200 with noindex. Better than a plain soft 404, but a real 404 status is what stops it consuming crawl budget."
          : "Missing page answers 200 — a soft 404. Google drops the URL and, over time, discounts the template. Check for a `loading.tsx`/Suspense boundary above the segment that turns the refusal into a 200 shell.",
        { status: res.status, title: parsed.title },
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page-level checks
// ─────────────────────────────────────────────────────────────────────────────

async function auditPage(url) {
  const res = await get(url, { redirect: "manual" });

  if (res.status >= 300 && res.status < 400) {
    return { url, status: res.status, redirectsTo: res.location, page: null };
  }
  if (res.status !== 200) {
    add("P1", "docs/13", url, `Returned ${res.status || "no response"}.`, { status: res.status });
    return { url, status: res.status, page: null };
  }
  if (!/text\/html/i.test(res.headers["content-type"] || "")) {
    return { url, status: res.status, page: null, skipped: "not html" };
  }

  const page = parsePage(res.body);
  const where = new URL(url).pathname;

  // ── Indexability ──────────────────────────────────────────────────────────
  const robotsValue = `${page.robots || ""} ${page.googlebot || ""}`.toLowerCase();
  if (robotsValue.includes("noindex")) {
    add("P1", "docs/01", where, "Page is `noindex`. If this is production and the page is meant to rank, this alone keeps it out of the index.", { robots: page.robots });
  }
  if (!page.canonical) {
    add("P2", "docs/01", where, "No `rel=canonical`. Without one, Google picks a canonical from the duplicate cluster itself — and it may not pick this URL.", null);
  } else {
    if (!/^https?:\/\//i.test(page.canonical)) {
      add("P2", "docs/01", where, `Canonical "${page.canonical}" is relative. Use an absolute URL including the protocol.`, null);
    }
    if (normalize(page.canonical) !== normalize(url)) {
      add("P3", "docs/01", where, `Canonical points elsewhere (${page.canonical}). Intentional for a variant; a bug if this page should stand on its own.`, { canonical: page.canonical });
    }
  }

  // ── Metadata ──────────────────────────────────────────────────────────────
  if (page.streamedMetadata) {
    add(
      "P3",
      "docs/05",
      where,
      "`<title>` is emitted after `</head>`, so the framework is streaming metadata. Browsers and Googlebot hoist it, but a bot that stops reading at `</head>` — which many AI crawlers do — sees an untitled page. In Next.js, widening `htmlLimitedBots` makes metadata blocking for every bot.",
      null,
    );
  }
  if (!page.title) {
    add("P2", "docs/01", where, "No `<title>`.", null);
  } else if (page.title.length > 70) {
    add("P3", "docs/01", where, `Title is ${page.title.length} characters; the title link is truncated to the device width (~60 is the practical target).`, { title: page.title });
  }
  if (!page.description) {
    add("P3", "docs/01", where, "No meta description. Google will write the snippet from the page — acceptable, but you have given up the choice.", null);
  } else if (page.description.length > 200) {
    add("P3", "docs/01", where, `Meta description is ${page.description.length} characters and will be cut.`, null);
  }
  if (!page.og.title || !page.og.image) {
    add("P3", "docs/01", where, "Incomplete Open Graph (missing og:title or og:image). Not a ranking factor; it is the whole preview on every share surface.", null);
  }

  // ── Structure ─────────────────────────────────────────────────────────────
  const h1s = page.headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    add("P3", "docs/04", where, "No `<h1>`.", null);
  } else if (h1s.length > 1) {
    add("P3", "docs/04", where, `${h1s.length} `+"`<h1>`"+` elements. One page, one main heading.`, { headings: h1s.map((h) => h.text) });
  }
  for (let i = 1; i < page.headings.length; i++) {
    if (page.headings[i].level - page.headings[i - 1].level > 1) {
      add("P3", "docs/04", where, `Heading level jumps from h${page.headings[i - 1].level} to h${page.headings[i].level} ("${page.headings[i].text}"). Headings are structure, not type size.`, null);
      break;
    }
  }

  // ── Rendering vs thin content ─────────────────────────────────────────────
  //
  // A low word count means one of two different things, with different fixes,
  // and conflating them produces a page of noise on any site whose entity pages
  // are simply small.
  //
  // A client-rendered shell has chrome and nothing else: whatever the page is
  // *about* — the name in its <h1> — is absent from the raw HTML entirely,
  // because it arrives with the JavaScript. Most AI crawlers never run
  // JavaScript, so for them the page has no subject at all. That is a rendering
  // bug (docs/05).
  //
  // A server-rendered page that happens to be short is a content question
  // (docs/14), not a rendering one. It is worth noting and it is not the same
  // finding.
  const subject = (h1s[0]?.text || page.title || "").split(/\s+[|·—–-]\s+/)[0].trim();

  if (page.wordCount < 200 && page.subjectRendered === false) {
    add("P2", "docs/05", where, `The raw HTML does not contain this page's own subject ("${subject.slice(0, 40)}") — only ${page.wordCount} words, all of it site chrome. The content arrives with JavaScript, and most AI crawlers never run any.`, { sample: page.textSample.slice(0, 160) });
  } else if (page.wordCount < 120) {
    add("P3", "docs/14", where, `Only ${page.wordCount} words of server-rendered content. Rendering is fine; there is simply not much here, which is the kind of page an index threshold is for.`, { words: page.wordCount });
  }

  // ── Images ────────────────────────────────────────────────────────────────
  const noAlt = page.images.filter((i) => !i.hasAltAttribute);
  const noDims = page.images.filter((i) => (!i.width || !i.height) && !i.cssSized);
  if (noAlt.length) {
    add("P3", "docs/07", where, `${noAlt.length}/${page.images.length} images have no \`alt\` attribute (decorative images still need \`alt=""\`).`, null);
  }
  if (noDims.length) {
    add("P3", "docs/07", where, `${noDims.length}/${page.images.length} images have neither width/height nor a CSS-reserved box. Unreserved space is the single most common cause of layout shift.`, null);
  }

  // ── Structured data ───────────────────────────────────────────────────────
  const jsonLd = [];
  for (const raw of page.jsonLdRaw) {
    try {
      jsonLd.push(JSON.parse(raw));
    } catch (error) {
      add("P2", "docs/08", where, `A JSON-LD block does not parse (${String(error).slice(0, 80)}). Invalid markup is markup Google discards silently.`, null);
    }
  }
  if (jsonLd.length === 0) {
    add("P3", "docs/08", where, "No JSON-LD. Structured data does not raise rankings, but it is how the entities on the page are stated unambiguously.", null);
  }
  for (const node of jsonLd.flatMap(flattenGraph)) {
    if (!node["@type"]) {
      add("P3", "docs/08", where, "A JSON-LD node has no `@type`.", null);
    }
    const rating = node.aggregateRating;
    if (rating) {
      const count = Number(rating.ratingCount ?? rating.reviewCount ?? 0);
      if (!count) {
        add("P2", "docs/08", where, "`aggregateRating` is emitted with no rating count. Marking up a score that does not exist is the exact behaviour that draws a manual action.", { rating });
      }
    }
  }

  // ── Links ─────────────────────────────────────────────────────────────────
  const internal = page.anchors.filter((a) => sameOrigin(a.href));
  if (internal.length === 0) {
    add("P2", "docs/04", where, "No crawlable internal `<a href>` links. Router `onClick` handlers do not build a link graph.", null);
  }

  return {
    url,
    status: 200,
    page,
    internal: internal.map((a) => normalize(new URL(a.href, url).toString())),
  };
}

function flattenGraph(node) {
  if (Array.isArray(node)) return node.flatMap(flattenGraph);
  if (!node || typeof node !== "object") return [];
  const out = [node];
  if (Array.isArray(node["@graph"])) out.push(...node["@graph"].flatMap(flattenGraph));
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// hreflang reciprocity — a cross-page check, so it runs after the crawl
// ─────────────────────────────────────────────────────────────────────────────

function checkHreflang(results) {
  const withAlternates = results.filter((r) => r.page?.alternates?.length);
  if (!withAlternates.length) return;

  const declared = new Map();
  for (const r of withAlternates) {
    declared.set(normalize(r.url), r.page.alternates);
  }

  for (const r of withAlternates) {
    const where = new URL(r.url).pathname;
    const set = r.page.alternates;

    for (const alt of set) {
      if (!ISO_LANG.test(alt.hreflang)) {
        add("P2", "docs/02", where, `hreflang="${alt.hreflang}" is not a valid code. \`en-UK\` (should be \`en-GB\`) and underscores are the usual culprits; an invalid line is dropped.`, null);
      }
      if (!/^https?:\/\//i.test(alt.href)) {
        add("P2", "docs/02", where, `hreflang href "${alt.href}" is not absolute.`, null);
      }
    }

    if (!set.some((a) => normalize(a.href) === normalize(r.url))) {
      add("P2", "docs/02", where, "The hreflang set does not include this page itself. Self-reference is required.", null);
    }
    if (!set.some((a) => a.hreflang === "x-default")) {
      add("P3", "docs/02", where, "No `x-default` in the hreflang set.", null);
    }

    // Reciprocity can only be judged against pages we actually fetched.
    for (const alt of set) {
      const target = normalize(alt.href);
      if (!declared.has(target)) continue;
      const back = declared.get(target);
      if (!back.some((b) => normalize(b.href) === normalize(r.url))) {
        add("P1", "docs/02", where, `hreflang points to ${alt.href}, which does not point back. A one-way set is discarded in full — every language in the cluster loses the signal, not just this pair.`, { target: alt.href });
      }
    }
  }
}

function checkDuplicateMetadata(results) {
  const byTitle = new Map();
  const byDescription = new Map();
  for (const r of results) {
    if (!r.page) continue;
    if (r.page.title) {
      const list = byTitle.get(r.page.title) || [];
      list.push(new URL(r.url).pathname);
      byTitle.set(r.page.title, list);
    }
    if (r.page.description) {
      const list = byDescription.get(r.page.description) || [];
      list.push(new URL(r.url).pathname);
      byDescription.set(r.page.description, list);
    }
  }
  for (const [title, pages] of byTitle) {
    if (pages.length > 1) {
      add("P2", "docs/01", pages[0], `${pages.length} pages share the title "${title.slice(0, 70)}". Near-duplicate pages compete with each other and invite Google to pick its own canonical.`, { pages: pages.slice(0, 8) });
    }
  }
  for (const [, pages] of byDescription) {
    if (pages.length > 2) {
      add("P3", "docs/01", pages[0], `${pages.length} pages share one meta description.`, { pages: pages.slice(0, 8) });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Score — docs/11 rubric, computed rather than estimated
// ─────────────────────────────────────────────────────────────────────────────

function score(results) {
  const pages = results.filter((r) => r.page);
  if (!pages.length) return { total: 0, rows: [] };

  const perPage = new Map(pages.map((r) => [new URL(r.url).pathname, []]));
  for (const f of findings) {
    if (perPage.has(f.where)) perPage.get(f.where).push(f);
  }

  const site = findings.filter((f) => !perPage.has(f.where));
  const sitePenalty =
    site.filter((f) => f.severity === "P1").length * 12 +
    site.filter((f) => f.severity === "P2").length * 5 +
    site.filter((f) => f.severity === "P3").length * 1;

  let sum = 0;
  for (const [, pageFindings] of perPage) {
    let value =
      100 -
      pageFindings.filter((f) => f.severity === "P2").length * 6 -
      pageFindings.filter((f) => f.severity === "P3").length * 2;
    // A P1 caps the page: a blocker means it may not be indexed at all, so
    // polish elsewhere cannot buy the points back.
    if (pageFindings.some((f) => f.severity === "P1")) value = Math.min(value, 60);
    sum += Math.max(0, value);
  }

  const total = Math.max(0, Math.round(sum / perPage.size - sitePenalty));
  return {
    total: Math.min(100, total),
    pagesScored: perPage.size,
    sitePenalty,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

function markdown(report) {
  const bySeverity = (s) => report.findings.filter((f) => f.severity === s);
  const section = (s, title) => {
    const list = bySeverity(s);
    if (!list.length) return `### ${title}\n\nNone.\n`;
    const grouped = new Map();
    for (const f of list) {
      const key = f.message.replace(/\d+/g, "#");
      const entry = grouped.get(key) || { ...f, where: [] };
      entry.where.push(f.where);
      grouped.set(key, entry);
    }
    return (
      `### ${title} (${list.length})\n\n` +
      [...grouped.values()]
        .map(
          (f) =>
            `- **${f.message}**\n  - \`${f.where.slice(0, 6).join("`, `")}\`${f.where.length > 6 ? ` _+${f.where.length - 6} more_` : ""}\n  - Rule: \`${f.doc}\``,
        )
        .join("\n") +
      "\n"
    );
  };

  return `# SEO audit — ${report.origin}

_Generated ${report.generatedAt} · ${report.pagesFetched} pages fetched · seo-audit ${report.tool}_

## SEO Score: ${report.score.total}/100

${report.score.pagesScored} pages scored. Site-level penalty: ${report.score.sitePenalty}.

| Severity | Count | Meaning |
|---|---:|---|
| P1 | ${bySeverity("P1").length} | Crawl or index blocker — the page may not be indexed at all |
| P2 | ${bySeverity("P2").length} | Indexed but misrepresented |
| P3 | ${bySeverity("P3").length} | Hygiene |

Caveat: this is a technical SEO readiness score, not a ranking or traffic guarantee. Off-page factors — backlinks, content quality, competition — are out of scope and are not measured here.

## Findings

${section("P1", "P1 — blockers")}
${section("P2", "P2 — misrepresentation")}
${section("P3", "P3 — hygiene")}

## Pages fetched

${report.pages.map((p) => `- \`${p.path}\` — ${p.status}${p.title ? ` — ${p.title.slice(0, 70)}` : ""}`).join("\n")}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

const started = Date.now();
log(`seo-audit → ${ORIGIN}`);

const robots = await checkRobots();
await checkHostConsolidation();

const sitemapUrls = await collectSitemapUrls(
  robots.sitemaps.length ? robots.sitemaps : [`${ORIGIN}/sitemap.xml`],
);
log(`  sitemap: ${sitemapUrls.length} URLs`);

// Sample across the sitemap rather than taking the head of it — the first N
// entries of a catalogue are all one template and would hide every other.
const sampled = [];
if (sitemapUrls.length) {
  const step = Math.max(1, Math.floor(sitemapUrls.length / MAX_PAGES));
  for (let i = 0; i < sitemapUrls.length && sampled.length < MAX_PAGES; i += step) {
    sampled.push(sitemapUrls[i]);
  }
}
// Dedupe on the normalised form: a sitemap that lists the origin without its
// trailing slash would otherwise be fetched twice and then reported as two
// pages sharing a title.
const seeds = [];
const seenSeeds = new Set();
for (const candidate of [`${ORIGIN}/`, ...sampled]) {
  const key = normalize(candidate);
  if (seenSeeds.has(key)) continue;
  seenSeeds.add(key);
  seeds.push(candidate);
  if (seeds.length >= MAX_PAGES) break;
}

log(`  auditing ${seeds.length} pages…`);
const results = await pool(seeds, auditPage);

checkHreflang(results);
checkDuplicateMetadata(results);

// Probe 404 handling on the distinct path prefixes we saw, since a soft 404 is
// per-template rather than site-wide.
const prefixes = [
  ...new Set(
    results
      .filter((r) => r.page)
      .map((r) => "/" + new URL(r.url).pathname.split("/").filter(Boolean)[0] || "/")
      .filter(Boolean),
  ),
].slice(0, 6);
await checkNotFound(["/", ...prefixes]);

const report = {
  tool: "1.0.0",
  origin: ORIGIN,
  generatedAt: new Date().toISOString(),
  durationMs: Date.now() - started,
  pagesFetched: results.filter((r) => r.page).length,
  sitemapUrlCount: sitemapUrls.length,
  score: score(results),
  findings: findings.sort((a, b) => a.severity.localeCompare(b.severity)),
  pages: results.map((r) => ({
    path: new URL(r.url).pathname,
    status: r.status,
    title: r.page?.title ?? null,
    canonical: r.page?.canonical ?? null,
    words: r.page?.wordCount ?? 0,
  })),
};

if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(report, null, 2));
if (MD_OUT) writeFileSync(MD_OUT, markdown(report));

const p1 = findings.filter((f) => f.severity === "P1").length;
const p2 = findings.filter((f) => f.severity === "P2").length;
const p3 = findings.filter((f) => f.severity === "P3").length;

console.log(
  `\n${ORIGIN} — SEO Score ${report.score.total}/100  ·  P1 ${p1}  P2 ${p2}  P3 ${p3}  ·  ${report.pagesFetched} pages, ${sitemapUrls.length} sitemap URLs, ${Math.round(report.durationMs / 1000)}s`,
);
if (!JSON_OUT && !MD_OUT && !QUIET) {
  console.log("\n" + markdown(report));
}

process.exit(p1 > 0 ? 1 : 0);
