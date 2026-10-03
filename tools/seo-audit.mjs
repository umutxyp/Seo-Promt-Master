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
 *   node tools/seo-audit.mjs --url https://staging.example --insecure
 *   npx github:umutxyp/Seo-Promt-Master --url https://example.com
 *
 * Every finding carries a docs/ citation. If a check cannot be traced to a rule
 * in the knowledge base, it does not belong here.
 *
 * Google is the reference engine, but not the only one that reads robots.txt.
 * The access matrix in the report resolves the rules for Bing, Yandex, Apple,
 * DuckDuckGo, Baidu, Naver, Seznam and the AI crawlers too (docs/10, docs/18).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

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
const FAIL_ON = String(opt("fail-on", "P1")).toUpperCase();
const EXTRA_404 = (opt("404-paths", "") || "").split(/[\s,]+/).filter(Boolean);

const VERSION = (() => {
  try {
    return readFileSync(new URL("../VERSION", import.meta.url), "utf8").trim();
  } catch {
    return "dev";
  }
})();

if (flag("version")) {
  console.log(VERSION);
  process.exit(0);
}

if (!BASE || flag("help") || flag("h")) {
  console.log(`
seo-audit ${VERSION} — live technical SEO + GEO audit

  --url <origin>        Site to audit (required). e.g. https://example.com
  --max <n>             Max pages to fetch (default 40)
  --concurrency <n>     Parallel requests (default 4)
  --timeout <ms>        Per-request timeout (default 20000)
  --json <file>         Write the machine-readable report
  --md <file>           Write the human-readable report
  --404-paths "<a b>"   Extra template roots to probe for soft 404s (e.g. "/blog /products")
  --fail-on <level>     Exit 1 on: P1 (default), P2 (P1 or P2), or never
  --user-agent <ua>     Override the request User-Agent
  --insecure            Accept invalid TLS certificates (staging only)
  --quiet               Only print the summary
  --version             Print the version

Exit code is 1 if a finding at or above --fail-on is open, else 0 — so it can gate a deploy.
`);
  process.exit(BASE ? 0 : 1);
}

for (const [name, value] of [["max", MAX_PAGES], ["concurrency", CONCURRENCY], ["timeout", TIMEOUT_MS]]) {
  if (!Number.isFinite(value) || value < 1) {
    console.error(`--${name} must be a positive number`);
    process.exit(2);
  }
}
if (!["P1", "P2", "NEVER"].includes(FAIL_ON)) {
  console.error("--fail-on must be P1, P2 or never");
  process.exit(2);
}

let ORIGIN;
try {
  ORIGIN = new URL(/^https?:\/\//i.test(BASE) ? BASE : `https://${BASE}`).origin;
} catch {
  console.error(`Not a URL: ${BASE}`);
  process.exit(2);
}

// Staging certificates are often self-signed. Opt-in only, never the default.
if (flag("insecure")) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const UA =
  opt("user-agent") ||
  `Mozilla/5.0 (compatible; seo-audit/${VERSION}; +https://github.com/umutxyp/Seo-Promt-Master)`;

// ─────────────────────────────────────────────────────────────────────────────
// Findings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * P1 — the page may not be indexed at all (crawl/index blocker).
 * P2 — indexed but misrepresented (structured data, duplication, rendering).
 * P3 — hygiene and polish.
 */
const findings = [];

/**
 * Every finding also names the docs/11 rubric row it costs points in, so the
 * report can say *where* the score went rather than only how much of it.
 * `geo` findings feed the GEO Score and are kept out of the SEO Score — the
 * SEO rubric in docs/11 has no AI-crawler row.
 */
const CATEGORIES = {
  indexability: "Indexability & crawl foundation",
  rendering: "Rendering & mobile parity",
  structured: "Structured data",
  metadata: "Metadata quality",
  i18n: "Internationalization",
  links: "Headings, semantics & links",
  images: "Images",
  geo: "GEO (AI search readiness)",
};
const add = (severity, doc, where, message, evidence, category = "indexability") =>
  findings.push({ severity, doc, category, where, message, evidence });

const log = (...a) => {
  if (!QUIET) console.error(...a);
};

// ─────────────────────────────────────────────────────────────────────────────
// Fetching
// ─────────────────────────────────────────────────────────────────────────────

const cache = new Map();

async function get(url, { redirect = "manual", method = "GET", binary = false } = {}) {
  const key = `${method} ${redirect} ${binary} ${url}`;
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
    let body = "";
    // Error bodies are kept: a 403 is only interpretable once you can see
    // whether it is the application refusing or a bot-protection challenge.
    if (method !== "HEAD" && (res.status < 300 || res.status >= 400)) {
      if (binary) {
        // Sitemaps may be served as .xml.gz files — a gzip *file*, not a gzip
        // Content-Encoding, so fetch does not unpack it for us.
        let buffer = Buffer.from(await res.arrayBuffer());
        if (buffer[0] === 0x1f && buffer[1] === 0x8b) buffer = gunzipSync(buffer);
        body = buffer.toString("utf8");
      } else if (!contentType.includes("image/") && !contentType.includes("font/")) {
        body = await res.text();
      }
    }
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
  // Anchored on whitespace so `src` never matches inside `data-src`, nor `name`
  // inside `data-name` — a lazy-loader's placeholder is not the image.
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
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

  const canonicalTags = linksRel("canonical");
  const canonicalTag = canonicalTags[0];
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

  /* Render-critical assets, read from the raw document. If robots.txt blocks
   * one of these for Googlebot, the rendered page is not the page you see. */
  const assets = [
    ...[...html.matchAll(/<script\b[^>]*>/gi)].map((m) => attr(m[0], "src")),
    ...links
      .filter((l) => /stylesheet|modulepreload|preload/i.test(attr(l, "rel") || ""))
      .map((l) => attr(l, "href")),
  ].filter(Boolean);

  return {
    title: titleMatch ? decode(titleMatch[1].replace(/<[^>]+>/g, "")) : null,
    description: metaByName("description"),
    robots: metaByName("robots"),
    googlebot: metaByName("googlebot"),
    bingbot: metaByName("bingbot"),
    viewport: metaByName("viewport"),
    canonical: canonicalTag ? attr(canonicalTag, "href") : null,
    canonicalCount: new Set(canonicalTags.map((t) => attr(t, "href"))).size,
    assets,
    /* Extractable structure for GEO (docs/10): content an answer engine can
     * lift whole — lists and tables — and a heading outline to lift it from. */
    lists: (body.match(/<(ul|ol|table|dl)\b/gi) || []).length,
    subheadings: headings.filter((h) => h.level === 2 || h.level === 3).length,
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

/**
 * robots.txt, parsed and *resolved* — not just pattern-matched.
 *
 * RFC 9309: a crawler obeys exactly one group (the most specific user-agent
 * match, merged if it appears more than once, `*` only as a fallback); paths are
 * prefix matches with `*` and `$`; the longest matching rule wins and `Allow`
 * wins a tie. Getting any of that wrong produces findings that are confidently
 * false, which is worse than no finding.
 */
function parseRobotsGroups(text) {
  const groups = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === "user-agent") {
      if (!current || current.started) {
        current = { agents: [], rules: [], crawlDelay: null, started: false };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (current && (key === "disallow" || key === "allow")) {
      current.started = true;
      // An empty Disallow means "nothing is disallowed" — it is not a rule.
      if (value) current.rules.push({ allow: key === "allow", path: value });
    } else if (current && key === "crawl-delay") {
      current.started = true;
      current.crawlDelay = Number(value);
    }
  }
  return groups;
}

/** The rules one crawler actually obeys. `fallbacks` lets Applebot inherit the
 *  Googlebot group when it has none of its own, which is what Apple documents. */
function rulesFor(groups, tokens, fallbacks = []) {
  for (const set of [tokens, ...fallbacks.map((f) => [f]), ["*"]]) {
    const matched = groups.filter((g) => g.agents.some((a) => set.includes(a)));
    if (matched.length) {
      return {
        via: matched[0].agents.find((a) => set.includes(a)),
        rules: matched.flatMap((g) => g.rules),
        crawlDelay: matched.map((g) => g.crawlDelay).find((d) => d != null) ?? null,
      };
    }
  }
  return { via: null, rules: [], crawlDelay: null };
}

const ruleRegex = new Map();
function robotsPatternMatches(pattern, path) {
  if (!ruleRegex.has(pattern)) {
    const anchored = pattern.endsWith("$");
    const body = (anchored ? pattern.slice(0, -1) : pattern)
      .split("*")
      .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*");
    ruleRegex.set(pattern, new RegExp(`^${body}${anchored ? "$" : ""}`));
  }
  return ruleRegex.get(pattern).test(path);
}

function isAllowed(resolved, pathWithQuery) {
  if (pathWithQuery === "/robots.txt") return true;
  let best = null;
  for (const rule of resolved.rules) {
    if (!robotsPatternMatches(rule.path, pathWithQuery)) continue;
    if (
      !best ||
      rule.path.length > best.path.length ||
      (rule.path.length === best.path.length && rule.allow)
    ) {
      best = rule;
    }
  }
  return best ? best.allow : true;
}

const pathOf = (u) => {
  const url = new URL(u, ORIGIN);
  return url.pathname + url.search;
};

/**
 * Who is allowed in. `kind` drives severity: blocking a search engine loses an
 * audience; blocking an AI trainer is a policy (docs/10), not a defect.
 */
const CRAWLERS = [
  { name: "Googlebot", tokens: ["googlebot"], kind: "search", engine: "Google (and Brave, which follows Googlebot rules)" },
  { name: "Bingbot", tokens: ["bingbot", "msnbot"], kind: "search", engine: "Bing, plus DuckDuckGo/Yahoo/Ecosia results and Copilot answers built on Bing" },
  { name: "YandexBot", tokens: ["yandexbot", "yandex"], kind: "search", engine: "Yandex" },
  { name: "Applebot", tokens: ["applebot"], fallbacks: ["googlebot"], kind: "search", engine: "Apple — Siri, Spotlight, Safari Suggestions" },
  { name: "DuckDuckBot", tokens: ["duckduckbot"], kind: "search", engine: "DuckDuckGo's own crawler" },
  { name: "Baiduspider", tokens: ["baiduspider"], kind: "search", engine: "Baidu" },
  { name: "Yeti", tokens: ["yeti"], kind: "search", engine: "Naver" },
  { name: "SeznamBot", tokens: ["seznambot"], kind: "search", engine: "Seznam" },
  { name: "OAI-SearchBot", tokens: ["oai-searchbot"], kind: "ai-search", engine: "ChatGPT search" },
  { name: "ChatGPT-User", tokens: ["chatgpt-user"], kind: "ai-user", engine: "ChatGPT, fetching on a user's request" },
  { name: "GPTBot", tokens: ["gptbot"], kind: "ai-training", engine: "OpenAI model training" },
  { name: "Claude-SearchBot", tokens: ["claude-searchbot"], kind: "ai-search", engine: "Claude search" },
  { name: "Claude-User", tokens: ["claude-user"], kind: "ai-user", engine: "Claude, fetching on a user's request" },
  { name: "ClaudeBot", tokens: ["claudebot"], kind: "ai-training", engine: "Anthropic model training" },
  { name: "PerplexityBot", tokens: ["perplexitybot"], kind: "ai-search", engine: "Perplexity search index" },
  { name: "Perplexity-User", tokens: ["perplexity-user"], kind: "ai-user", engine: "Perplexity, fetching on a user's request" },
  { name: "Google-Extended", tokens: ["google-extended"], kind: "ai-training", engine: "Gemini training & grounding (not Search)" },
  { name: "Applebot-Extended", tokens: ["applebot-extended"], kind: "ai-training", engine: "Apple model training (not Siri/Spotlight)" },
  { name: "Meta-ExternalAgent", tokens: ["meta-externalagent"], kind: "ai-training", engine: "Meta model training" },
  { name: "Amazonbot", tokens: ["amazonbot"], kind: "ai-training", engine: "Amazon (Alexa, AI models)" },
  { name: "CCBot", tokens: ["ccbot"], kind: "ai-training", engine: "Common Crawl (feeds many models)" },
  { name: "Bytespider", tokens: ["bytespider"], kind: "ai-training", engine: "ByteDance model training" },
  { name: "DuckAssistBot", tokens: ["duckassistbot"], kind: "ai-search", engine: "DuckDuckGo AI answers" },
  { name: "MistralAI-User", tokens: ["mistralai-user"], kind: "ai-user", engine: "Mistral Le Chat, user-triggered" },
];

async function checkRobots() {
  const url = `${ORIGIN}/robots.txt`;
  const res = await get(url, { redirect: "follow" });
  const empty = { text: "", sitemaps: [], groups: [], matrix: [], google: { rules: [] }, aiPolicy: false, contentSignal: null };

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
    return empty;
  }

  const text = res.body;
  const bytes = Buffer.byteLength(text, "utf8");

  if (/<html|<!doctype/i.test(text.slice(0, 500))) {
    add("P2", "docs/12", "/robots.txt", "robots.txt is an HTML page (usually an SPA fallback route). Crawlers find no valid rules in it, so none of your intended rules apply.", null);
  }
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

  const groups = parseRobotsGroups(text);
  const contentSignal = (text.match(/^\s*Content-Signal\s*:\s*(.+)$/im) || [])[1]?.trim() ?? null;

  const matrix = CRAWLERS.map((c) => {
    const resolved = rulesFor(groups, c.tokens, c.fallbacks);
    return {
      ...c,
      via: resolved.via,
      explicit: resolved.via != null && resolved.via !== "*" && !(c.fallbacks || []).includes(resolved.via),
      allowedRoot: isAllowed(resolved, "/"),
      crawlDelay: resolved.crawlDelay,
      resolved,
    };
  });
  const google = matrix[0].resolved;

  for (const c of matrix.filter((m) => m.kind === "search" && !m.allowedRoot)) {
    if (c.name === "Googlebot") {
      add("P1", "docs/12", "/robots.txt", `robots.txt blocks Googlebot from the homepage (via \`User-agent: ${c.via}\`). If this is production, Google — and Brave, which follows Googlebot rules — cannot crawl the site.`, null);
    } else if (c.name === "Bingbot") {
      add("P1", "docs/18", "/robots.txt", `robots.txt blocks Bingbot from the homepage (via \`User-agent: ${c.via}\`). That removes the site from Bing and from everything built on Bing's index: DuckDuckGo and Yahoo results, Copilot answers.`, null);
    } else {
      add("P3", "docs/18", "/robots.txt", `robots.txt blocks ${c.name} (${c.engine}) from the homepage. Fine if deliberate — make sure it is.`, null);
    }
  }

  // Bing honours Crawl-delay (Google ignores it). A large value quietly caps how
  // much of a big site Bing can ever see: 10s is at most 8,640 URLs a day.
  const bing = matrix.find((m) => m.name === "Bingbot");
  if (bing.crawlDelay && bing.crawlDelay >= 10) {
    add("P3", "docs/18", "/robots.txt", `Crawl-delay: ${bing.crawlDelay} applies to Bingbot. Google ignores it; Bing obeys it — that is at most ${Math.floor(86400 / bing.crawlDelay).toLocaleString("en")} URLs a day. Prefer Bing Webmaster Tools' crawl control.`, null);
  }

  // Either way of stating it counts: per-bot groups, or the newer machine-readable
  // `Content-Signal:` declaration (contentsignals.org / IETF AIPREF), which says
  // the same thing in one line. A site that has decided is a site that has decided.
  const aiPolicy = matrix.some((m) => m.kind.startsWith("ai") && m.explicit) || Boolean(contentSignal);
  if (!aiPolicy) {
    add("P3", "docs/10", "/robots.txt", "robots.txt takes no explicit position on AI crawlers. Training, AI-search and user-triggered fetching are three different decisions; defaulting silently is not one of them.", null, "geo");
  }

  return { text, sitemaps, groups, matrix, google, aiPolicy, contentSignal };
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

    const res = await get(sm, { redirect: "follow", binary: true });
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
  // Localhost, bare IPs and explicit ports have no www/http twin worth probing,
  // and probing one would report the dev server as a duplicate of itself.
  if (/^(localhost|\d+\.\d+\.\d+\.\d+|\[.*\])$/i.test(url.hostname) || url.port) return;

  const isWww = url.hostname.startsWith("www.");
  const other = isWww
    ? `${url.protocol}//${url.hostname.slice(4)}/`
    : `${url.protocol}//www.${url.hostname}/`;

  const [httpRes, otherRes] = await Promise.all([
    url.protocol === "https:" ? get(`http://${url.hostname}/`) : Promise.resolve({ status: 0 }),
    get(other),
  ]);

  if (url.protocol === "http:") {
    const httpsRes = await get(`https://${url.hostname}/`);
    add(
      "P2",
      "docs/01",
      "http://",
      httpsRes.status
        ? "The audited origin is http:// although HTTPS answers. Every public page should be served — and canonicalised — over HTTPS."
        : "The site does not answer over HTTPS. HTTPS is a confirmed ranking signal and there is no case for an HTTP-only public site.",
      null,
    );
  }

  if (httpRes.status === 200) {
    add("P2", "docs/01", "http://", "The http:// origin serves 200 instead of redirecting. Both protocols are then independently crawlable duplicates.", null);
  } else if (httpRes.status && httpRes.status !== 301 && httpRes.status !== 308 && httpRes.status < 400) {
    add("P3", "docs/01", "http://", `http:// answers ${httpRes.status}; a permanent move should be 301 (or 308).`, { status: httpRes.status });
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
        "rendering",
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page-level checks
// ─────────────────────────────────────────────────────────────────────────────


/**
 * X-Robots-Tag, read the way Google reads it: a directive list that may be
 * scoped to one crawler (`googlebot: noindex`) and stays scoped until the next
 * crawler name. `unavailable_after: <date>` also has a colon and is not a name.
 */
const SCOPED_DIRECTIVES = /^(unavailable_after|max-snippet|max-image-preview|max-video-preview)$/i;
function parseXRobots(header = "") {
  const scopes = { "*": new Set() };
  let bot = "*";
  for (const token of header.split(",").map((t) => t.trim()).filter(Boolean)) {
    const m = token.match(/^([a-z][\w-]*)\s*:\s*(.*)$/i);
    let directive = token;
    if (m && !SCOPED_DIRECTIVES.test(m[1])) {
      bot = m[1].toLowerCase();
      directive = m[2];
    }
    (scopes[bot] ||= new Set()).add(directive.toLowerCase());
  }
  return scopes;
}

/** Directives that apply to one crawler, from meta tags and the header together. */
function directivesFor(bot, page, header) {
  const xr = parseXRobots(header);
  const list = [
    ...(page.robots || "").split(","),
    ...(page[bot] || "").split(","),
    ...xr["*"],
    ...(xr[bot] || []),
  ]
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  const has = (d) => list.some((x) => x === d || x.startsWith(`${d}:`));
  return {
    list,
    noindex: has("noindex") || has("none"),
    nosnippet: has("nosnippet") || list.some((x) => /^max-snippet\s*:\s*0$/.test(x)),
    noarchive: has("noarchive") || has("nocache"),
  };
}

const isRoot = (u) => new URL(u).pathname === "/";

/** Cloudflare, Akamai, Imperva, DataDome and friends answer an unrecognised
 *  client with a challenge page rather than the content. */
const challenged = [];
function isChallenge(res) {
  if (![403, 429, 503].includes(res.status)) return false;
  return (
    Boolean(res.headers["cf-mitigated"]) ||
    /<title>\s*(Just a moment|Attention Required|Access denied|Pardon Our Interruption)/i.test(res.body) ||
    /_Incapsula_Resource|captcha-delivery\.com|challenge-platform|px-captcha/i.test(res.body)
  );
}

async function auditPage(url, _index, hops = 0) {
  const res = await get(url, { redirect: "manual" });
  const where = new URL(url).pathname;

  if (res.status >= 300 && res.status < 400) {
    const target = res.location ? new URL(res.location, url).toString() : null;
    // The homepage redirecting to a locale or a canonical host is normal. Follow
    // it so the real homepage still gets audited, rather than silently dropping it.
    if (isRoot(url) && target && sameOrigin(target) && hops < 5) {
      if (res.status === 302 || res.status === 307) {
        add("P3", "docs/01", where, `The homepage answers ${res.status} (temporary) to ${new URL(target).pathname}. A redirect that is not temporary should be 301/308.`, null);
      }
      return auditPage(target, _index, hops + 1);
    }
    if (fromSitemap.has(normalize(url))) {
      add("P2", "docs/13", where, `Listed in the sitemap but redirects (${res.status}) to ${target ?? "nowhere"}. Sitemaps should list final, canonical URLs only — "Page with redirect" in Search Console.`, { status: res.status, location: target });
    }
    return { url, status: res.status, redirectsTo: target, page: null };
  }
  if (isChallenge(res)) {
    // A WAF challenge served to this tool says nothing about what Googlebot
    // gets from Google's verified IPs. Record it once, site-wide, and do not
    // score a page we were never shown.
    challenged.push(where);
    return { url, status: res.status, page: null, challenged: true };
  }
  if (res.status !== 200) {
    add("P1", "docs/13", where, `${fromSitemap.has(normalize(url)) ? "Listed in the sitemap but returned" : "Returned"} ${res.status || "no response"}.`, { status: res.status });
    return { url, status: res.status, page: null };
  }
  if (!/text\/html|application\/xhtml/i.test(res.headers["content-type"] || "")) {
    return { url, status: res.status, page: null, skipped: "not html" };
  }

  const page = parsePage(res.body);
  const xRobots = res.headers["x-robots-tag"] || "";
  const forGoogle = directivesFor("googlebot", page, xRobots);
  const forBing = directivesFor("bingbot", page, xRobots);

  // ── Indexability ──────────────────────────────────────────────────────────
  if (robotsTxt.groups.length && !isAllowed(robotsTxt.google, pathOf(url))) {
    add("P1", "docs/12", where, "robots.txt disallows this URL for Googlebot, yet it is in the sitemap. Blocked URLs cannot be crawled, and a `noindex` on them is never seen — pick one signal.", null);
  }
  if (forGoogle.noindex) {
    add("P1", "docs/01", where, `Page is \`noindex\` for Google (${xRobots && /noindex|none/i.test(xRobots) ? "X-Robots-Tag header" : "robots meta"}). If this is production and the page is meant to rank, this alone keeps it out of the index.`, { robots: page.robots, xRobotsTag: xRobots || undefined });
  } else if (forBing.noindex) {
    add("P2", "docs/18", where, "Page is `noindex` for Bing only. It disappears from Bing, DuckDuckGo, Yahoo and Copilot while ranking in Google — confirm that is intended.", { bingbot: page.bingbot, xRobotsTag: xRobots || undefined });
  }
  if (!page.canonical) {
    add("P2", "docs/01", where, "No `rel=canonical`. Without one, Google picks a canonical from the duplicate cluster itself — and it may not pick this URL.", null);
  } else {
    if (page.canonicalCount > 1) {
      add("P2", "docs/13", where, `${page.canonicalCount} different canonical URLs on one page. With conflicting canonicals Google may ignore all of them.`, null);
    }
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
      "rendering",
    );
  }
  if (!page.title) {
    add("P2", "docs/01", where, "No `<title>`.", null, "metadata");
  } else if (page.title.length > 70) {
    add("P3", "docs/01", where, `Title is ${page.title.length} characters; the title link is truncated to the device width (~60 is the practical target).`, { title: page.title }, "metadata");
  }
  if (!page.description) {
    add("P3", "docs/01", where, "No meta description. Google will write the snippet from the page — acceptable, but you have given up the choice.", null, "metadata");
  } else if (page.description.length > 200) {
    add("P3", "docs/01", where, `Meta description is ${page.description.length} characters and will be cut.`, null, "metadata");
  }
  if (!page.og.title || !page.og.image) {
    add("P3", "docs/01", where, "Incomplete Open Graph (missing og:title or og:image). Not a ranking factor; it is the whole preview on every share surface.", null, "metadata");
  }
  if (!page.lang) {
    add("P3", "docs/18", where, "No `<html lang>`. Google detects language from the content, but Bing reads `lang` / `content-language` as a language signal, and screen readers need it.", null, "i18n");
  }

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (!page.viewport) {
    add("P3", "docs/05", where, "No `<meta name=\"viewport\">`. Indexing is mobile-first; without a viewport the mobile render is a shrunken desktop page.", null, "rendering");
  }

  // ── Snippet and AI-answer controls ────────────────────────────────────────
  if (forGoogle.nosnippet && !forGoogle.noindex) {
    add("P3", "docs/10", where, "`nosnippet` (or `max-snippet:0`) is set. Google applies it to AI Overviews and AI Mode too, so this page cannot be quoted in AI answers. Deliberate?", { directives: forGoogle.list }, "geo");
  }
  if (forBing.noarchive && !forBing.noindex) {
    add("P3", "docs/18", where, "`noarchive`/`nocache` is set. Bing uses these to limit or exclude the page from Copilot answers. Deliberate?", { directives: forBing.list }, "geo");
  }

  // ── Structure ─────────────────────────────────────────────────────────────
  const h1s = page.headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    add("P3", "docs/04", where, "No `<h1>`.", null, "links");
  } else if (h1s.length > 1) {
    add("P3", "docs/04", where, `${h1s.length} `+"`<h1>`"+` elements. One page, one main heading.`, { headings: h1s.map((h) => h.text) }, "links");
  }
  for (let i = 1; i < page.headings.length; i++) {
    if (page.headings[i].level - page.headings[i - 1].level > 1) {
      add("P3", "docs/04", where, `Heading level jumps from h${page.headings[i - 1].level} to h${page.headings[i].level} ("${page.headings[i].text}"). Headings are structure, not type size.`, null, "links");
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
    add("P2", "docs/05", where, `The raw HTML does not contain this page's own subject ("${subject.slice(0, 40)}") — only ${page.wordCount} words, all of it site chrome. The content arrives with JavaScript, and most AI crawlers never run any.`, { sample: page.textSample.slice(0, 160) }, "rendering");
  } else if (page.wordCount < 120) {
    add("P3", "docs/14", where, `Only ${page.wordCount} words of server-rendered content. Rendering is fine; there is simply not much here, which is the kind of page an index threshold is for.`, { words: page.wordCount }, "rendering");
  }

  // ── Render-critical assets blocked for Googlebot ──────────────────────────
  if (robotsTxt.groups.length) {
    const blocked = [
      ...new Set(
        page.assets
          .map((a) => {
            try {
              return new URL(a, url);
            } catch {
              return null;
            }
          })
          .filter((a) => a && a.origin === ORIGIN && !isAllowed(robotsTxt.google, a.pathname + a.search))
          .map((a) => a.pathname),
      ),
    ];
    if (blocked.length) {
      add("P1", "docs/05", where, `robots.txt blocks ${blocked.length} script/stylesheet file(s) this page needs (e.g. \`${blocked[0]}\`). Google renders without them — blocked CSS/JS can produce an empty or broken rendered page.`, { blocked: blocked.slice(0, 5) }, "rendering");
    }
  }

  // ── Images ────────────────────────────────────────────────────────────────
  const noAlt = page.images.filter((i) => !i.hasAltAttribute);
  const noDims = page.images.filter((i) => (!i.width || !i.height) && !i.cssSized);
  if (noAlt.length) {
    add("P3", "docs/07", where, `${noAlt.length}/${page.images.length} images have no \`alt\` attribute (decorative images still need \`alt=""\`).`, null, "images");
  }
  if (noDims.length) {
    add("P3", "docs/07", where, `${noDims.length}/${page.images.length} images have neither width/height nor a CSS-reserved box. Unreserved space is the single most common cause of layout shift.`, null, "images");
  }
  const lazyFirst = page.images[0];
  if (lazyFirst && /lazy/i.test(lazyFirst.loading || "") && page.images.length > 0 && isRoot(url)) {
    add("P3", "docs/05", where, "The first image on the homepage is `loading=\"lazy\"`. If it is the LCP element, lazy-loading it delays LCP — make it eager with `fetchpriority=\"high\"`.", { src: lazyFirst.src }, "images");
  }

  // ── Structured data ───────────────────────────────────────────────────────
  const jsonLd = [];
  for (const raw of page.jsonLdRaw) {
    try {
      jsonLd.push(JSON.parse(raw));
    } catch (error) {
      add("P2", "docs/08", where, `A JSON-LD block does not parse (${String(error).slice(0, 80)}). Invalid markup is markup Google discards silently.`, null, "structured");
    }
  }
  if (jsonLd.length === 0) {
    add("P3", "docs/08", where, "No JSON-LD. Structured data does not raise rankings, but it is how the entities on the page are stated unambiguously.", null, "structured");
  }
  const nodes = jsonLd.flatMap(flattenGraph);
  const typesOf = (n) => [].concat(n["@type"] || []).map(String);
  for (const node of nodes) {
    const types = typesOf(node);
    if (!types.length) {
      add("P3", "docs/08", where, "A JSON-LD node has no `@type`.", null, "structured");
    }
    const rating = node.aggregateRating;
    if (rating) {
      const count = Number(rating.ratingCount ?? rating.reviewCount ?? 0);
      if (!count) {
        add("P2", "docs/08", where, "`aggregateRating` is emitted with no rating count. Marking up a score that does not exist is the exact behaviour that draws a manual action.", { rating }, "structured");
      }
      if (rating.ratingValue == null) {
        add("P2", "docs/08", where, "`aggregateRating` has no `ratingValue`.", null, "structured");
      }
    }
    if (types.includes("Product") && !node.offers && !node.review && !node.aggregateRating) {
      add("P2", "docs/08", where, "`Product` has none of `offers`, `review` or `aggregateRating`. Google requires at least one before the markup is eligible for anything.", null, "structured");
    }
    if (types.includes("BreadcrumbList") && !(Array.isArray(node.itemListElement) && node.itemListElement.length)) {
      add("P2", "docs/08", where, "`BreadcrumbList` has no `itemListElement`. An empty breadcrumb is invalid markup.", null, "structured");
    }
  }

  // ── Links ─────────────────────────────────────────────────────────────────
  const internal = page.anchors.filter((a) => sameOrigin(a.href) && !/^(javascript|mailto|tel):/i.test(a.href));
  if (internal.length === 0) {
    add("P2", "docs/04", where, "No crawlable internal `<a href>` links. Router `onClick` handlers do not build a link graph.", null, "links");
  }

  return {
    url,
    status: 200,
    page,
    nodes,
    xRobots,
    internal: internal.map((a) => normalize(new URL(a.href, url).toString())),
  };
}

/**
 * A canonical is a hint that only counts when its target is itself a clean,
 * indexable 200. Pointing it at a redirect, an error or a noindexed page tells
 * Google two contradictory things, and Google then picks for you (docs/13).
 */
async function checkCanonicalTargets(results) {
  const targets = new Map();
  for (const r of results) {
    if (!r.page?.canonical) continue;
    let target;
    try {
      target = new URL(r.page.canonical, r.url).toString();
    } catch {
      continue;
    }
    if (normalize(target) === normalize(r.url)) continue;
    const list = targets.get(target) || [];
    list.push(new URL(r.url).pathname);
    targets.set(target, list);
  }
  const fetched = new Map(results.filter((r) => r.page).map((r) => [normalize(r.url), r]));

  await pool([...targets.keys()], async (target) => {
    const sources = targets.get(target);
    let status, noindex;
    const known = fetched.get(normalize(target));
    if (known) {
      status = 200;
      noindex = directivesFor("googlebot", known.page, known.xRobots).noindex;
    } else {
      const res = await get(target, { redirect: "manual" });
      status = res.status;
      if (status === 200 && /text\/html/i.test(res.headers["content-type"] || "")) {
        noindex = directivesFor("googlebot", parsePage(res.body), res.headers["x-robots-tag"] || "").noindex;
      }
    }
    for (const where of sources) {
      if (status >= 300 && status < 400) {
        add("P2", "docs/13", where, `Canonical points at ${target}, which redirects. Point canonicals directly at the final URL.`, { status }, "indexability");
      } else if (status !== 200) {
        add("P2", "docs/13", where, `Canonical points at ${target}, which returns ${status || "no response"}. Google ignores a canonical whose target is not a 200.`, { status }, "indexability");
      } else if (noindex) {
        add("P2", "docs/13", where, `Canonical points at ${target}, which is \`noindex\`. That asks Google to consolidate into a page it is told not to index.`, null, "indexability");
      }
    }
  });
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
        add("P2", "docs/02", where, `hreflang="${alt.hreflang}" is not a valid code. \`en-UK\` (should be \`en-GB\`) and underscores are the usual culprits; an invalid line is dropped.`, null, "i18n");
      }
      if (!/^https?:\/\//i.test(alt.href)) {
        add("P2", "docs/02", where, `hreflang href "${alt.href}" is not absolute.`, null, "i18n");
      }
    }

    if (!set.some((a) => normalize(a.href) === normalize(r.url))) {
      add("P2", "docs/02", where, "The hreflang set does not include this page itself. Self-reference is required.", null, "i18n");
    }
    if (!set.some((a) => a.hreflang === "x-default")) {
      add("P3", "docs/02", where, "No `x-default` in the hreflang set.", null, "i18n");
    }

    // Reciprocity can only be judged against pages we actually fetched.
    for (const alt of set) {
      const target = normalize(alt.href);
      if (!declared.has(target)) continue;
      const back = declared.get(target);
      if (!back.some((b) => normalize(b.href) === normalize(r.url))) {
        add("P1", "docs/02", where, `hreflang points to ${alt.href}, which does not point back. A one-way set is discarded in full — every language in the cluster loses the signal, not just this pair.`, { target: alt.href }, "i18n");
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
      add("P2", "docs/01", pages[0], `${pages.length} pages share the title "${title.slice(0, 70)}". Near-duplicate pages compete with each other and invite Google to pick its own canonical.`, { pages: pages.slice(0, 8) }, "metadata");
    }
  }
  for (const [, pages] of byDescription) {
    if (pages.length > 2) {
      add("P3", "docs/01", pages[0], `${pages.length} pages share one meta description.`, { pages: pages.slice(0, 8) }, "metadata");
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Score — docs/11 rubric, computed rather than estimated
// ─────────────────────────────────────────────────────────────────────────────

function score(results) {
  const pages = results.filter((r) => r.page);
  const seo = findings.filter((f) => f.category !== "geo");
  if (!pages.length) return { total: 0, pagesScored: 0, sitePenalty: 0, breakdown: [] };

  const perPage = new Map(pages.map((r) => [new URL(r.url).pathname, []]));
  for (const f of seo) {
    if (perPage.has(f.where)) perPage.get(f.where).push(f);
  }

  const weight = { P1: 12, P2: 5, P3: 1 };
  const site = seo.filter((f) => !perPage.has(f.where));
  const sitePenalty = site.reduce((sum, f) => sum + weight[f.severity], 0);

  let sum = 0;
  let capped = 0;
  for (const [, pageFindings] of perPage) {
    let value =
      100 -
      pageFindings.filter((f) => f.severity === "P2").length * 6 -
      pageFindings.filter((f) => f.severity === "P3").length * 2;
    // A P1 caps the page: a blocker means it may not be indexed at all, so
    // polish elsewhere cannot buy the points back.
    if (pageFindings.some((f) => f.severity === "P1")) {
      value = Math.min(value, 60);
      capped++;
    }
    sum += Math.max(0, value);
  }

  /* Where the points went, per docs/11 row. Page deductions are averaged over
   * the pages scored, exactly as the total is; the P1 cap is its own line
   * because it is not attributable to any one row. */
  const breakdown = Object.entries(CATEGORIES)
    .filter(([key]) => key !== "geo")
    .map(([key, label]) => {
      const inCat = seo.filter((f) => f.category === key);
      const pageLoss =
        inCat
          .filter((f) => perPage.has(f.where))
          .reduce((t, f) => t + (f.severity === "P2" ? 6 : f.severity === "P3" ? 2 : 0), 0) / perPage.size;
      const siteLoss = inCat.filter((f) => !perPage.has(f.where)).reduce((t, f) => t + weight[f.severity], 0);
      return {
        category: label,
        P1: inCat.filter((f) => f.severity === "P1").length,
        P2: inCat.filter((f) => f.severity === "P2").length,
        P3: inCat.filter((f) => f.severity === "P3").length,
        pointsLost: Math.round((pageLoss + siteLoss) * 10) / 10,
      };
    });

  const total = Math.max(0, Math.round(sum / perPage.size - sitePenalty));
  return {
    total: Math.min(100, total),
    pagesScored: perPage.size,
    pagesCappedByP1: capped,
    sitePenalty,
    breakdown,
  };
}

/**
 * GEO Score, docs/11's six rows. Four are measured from what was fetched; two
 * cannot be measured by fetching a page at all and are labelled as such rather
 * than quietly awarded or quietly withheld.
 */
const ENTITY_TYPES = /^(Organization|Corporation|LocalBusiness|NewsMediaOrganization|EducationalOrganization|NGO|OnlineBusiness|OnlineStore|Person|[A-Z]\w*(Business|Store|Organization|Service))$/;

function geoScore(results, seoTotal) {
  const pages = results.filter((r) => r.page);
  if (!pages.length) return { total: 0, rows: [], capped: false };
  const home = pages.find((r) => isRoot(r.url)) || pages[0];

  const rows = [];
  rows.push({
    category: "AI crawler configuration",
    max: 20,
    points: robotsTxt.aiPolicy ? 20 : 0,
    basis: robotsTxt.aiPolicy
      ? robotsTxt.contentSignal
        ? `Content-Signal: ${robotsTxt.contentSignal}`
        : "explicit AI user-agent groups in robots.txt"
      : "no explicit AI-crawler position in robots.txt",
  });

  const judged = pages.filter((r) => r.page.subjectRendered !== null);
  const rendered = judged.filter((r) => r.page.subjectRendered);
  const renderShare = judged.length ? rendered.length / judged.length : 1;
  rows.push({
    category: "Extractable rendering",
    max: 20,
    points: Math.round(20 * renderShare),
    basis: `${rendered.length}/${judged.length} pages carry their own subject in the raw HTML`,
  });

  const structured = pages.filter((r) => r.page.subheadings >= 2 && r.page.lists >= 1);
  rows.push({
    category: "Extractable content structure",
    max: 15,
    points: Math.round((15 * structured.length) / pages.length),
    basis: `${structured.length}/${pages.length} pages have ≥2 h2/h3 and a list or table (heuristic — whether sections lead with a direct answer needs a reader)`,
    heuristic: true,
  });

  const homeNodes = home.nodes || [];
  const entity = homeNodes.find((n) => [].concat(n["@type"] || []).some((t) => ENTITY_TYPES.test(String(t))));
  const sameAs = entity ? [].concat(entity.sameAs || []).filter(Boolean) : [];
  const website = homeNodes.some((n) => [].concat(n["@type"] || []).includes("WebSite"));
  let entityPoints = 0;
  if (entity) entityPoints += 8;
  if (sameAs.length) entityPoints += 8;
  if (website) entityPoints += 4;
  rows.push({
    category: "Entity authority",
    max: 20,
    points: entityPoints,
    basis: `homepage: ${entity ? `${[].concat(entity["@type"]).join("/")} entity` : "no Organization/Person entity"}, ${sameAs.length} sameAs link(s), ${website ? "WebSite node" : "no WebSite node"} — About page and author bylines still need a human check`,
  });
  if (!entity || !sameAs.length) {
    add("P3", "docs/10", "/", entity
      ? "The homepage's entity has no `sameAs`. Links to the profiles you control (Wikidata, LinkedIn, GitHub, socials) are the highest-leverage entity signal for AI answer engines."
      : "The homepage declares no `Organization` or `Person` entity in JSON-LD. Answer engines resolve *who* is speaking from it, and `sameAs` on it is the highest-leverage GEO addition.", null, "geo");
  }

  rows.push({
    category: "Classic-SEO prerequisite",
    max: 15,
    points: Math.round(seoTotal * 0.15),
    basis: `round(SEO Score ${seoTotal} × 0.15)`,
  });
  rows.push({
    category: "No wasted/counterproductive GEO effort",
    max: 10,
    points: 10,
    basis: "not measurable by fetching pages — awarded provisionally; verify no unsourced 'AI SEO' tactics were shipped",
    heuristic: true,
  });

  let total = rows.reduce((t, r) => t + r.points, 0);
  // docs/11: a GEO blocker caps the score at 60 — no deliberate AI-crawler
  // decision, or a homepage whose subject is not in its server-rendered HTML.
  const capped = !robotsTxt.aiPolicy || home.page.subjectRendered === false;
  if (capped) total = Math.min(total, 60);
  return { total, rows, capped };
}

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

const KIND_LABEL = {
  search: "Search engine",
  "ai-search": "AI search / answers",
  "ai-user": "AI, user-triggered",
  "ai-training": "AI training",
};

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
            `- **${f.message}**\n  - \`${f.where.slice(0, 6).join("`, `")}\`${f.where.length > 6 ? ` _+${f.where.length - 6} more_` : ""}\n  - Rule: \`${f.doc}\` · ${CATEGORIES[f.category]}`,
        )
        .join("\n") +
      "\n"
    );
  };

  // docs/11: a score built on a sample is provisional, and says so.
  const coverage =
    report.sitemapUrlCount > report.sitemapUrlsVisited
      ? `provisional — ${report.sitemapUrlsVisited}/${report.sitemapUrlCount} sitemap URLs sampled`
      : `${report.pagesFetched} pages fetched, full sitemap coverage`;

  const matrix = report.crawlers.length
    ? `| Crawler | Kind | Used by | Homepage | Rule group |
|---|---|---|---|---|
${report.crawlers
  .map(
    (c) =>
      `| ${c.name} | ${KIND_LABEL[c.kind]} | ${c.engine} | ${c.allowedRoot ? "✅ allowed" : "⛔ blocked"} | \`${c.via ?? "(none — allowed)"}\`${c.crawlDelay ? ` · Crawl-delay ${c.crawlDelay}` : ""} |`,
  )
  .join("\n")}

Allowing or blocking an AI crawler is a policy decision (\`docs/10\`), not a defect. Blocking a search engine is a defect unless someone decided it.${report.contentSignal ? `\n\n\`Content-Signal: ${report.contentSignal}\`` : ""}`
    : "robots.txt was not readable, so every crawler is treated as allowed.";

  return `# SEO audit — ${report.origin}

_Generated ${report.generatedAt} · ${coverage} · seo-audit ${report.tool}_

## SEO Score: ${report.score.total}/100 (${coverage})

${report.score.pagesScored} pages scored · ${report.score.pagesCappedByP1} capped at 60 by a P1 · site-level penalty ${report.score.sitePenalty}.

| Severity | Count | Meaning |
|---|---:|---|
| P1 | ${bySeverity("P1").length} | Crawl or index blocker — the page may not be indexed at all |
| P2 | ${bySeverity("P2").length} | Indexed but misrepresented |
| P3 | ${bySeverity("P3").length} | Hygiene |

### Where the points went (\`docs/11\` rows)

| Category | P1 | P2 | P3 | ≈ points lost |
|---|---:|---:|---:|---:|
${report.score.breakdown.map((b) => `| ${b.category} | ${b.P1} | ${b.P2} | ${b.P3} | ${b.pointsLost} |`).join("\n")}

Core Web Vitals are not in this number: they come from CrUX field data, not from fetching a page (\`docs/05\`).

## GEO Score: ${report.geo.total}/100 (provisional — automated)${report.geo.capped ? " · capped at 60 by a GEO blocker" : ""}

| Category | Points | / Max | Basis |
|---|---:|---:|---|
${report.geo.rows.map((r) => `| ${r.category}${r.heuristic ? " _(heuristic)_" : ""} | ${r.points} | ${r.max} | ${r.basis} |`).join("\n")}

Caveat: these are technical SEO/GEO readiness scores, not a ranking or traffic guarantee. Off-page factors — backlinks, content quality, competition — are out of scope and are not measured here.

## Crawler access (robots.txt, resolved per RFC 9309)

${matrix}

## Findings

${section("P1", "P1 — blockers")}
${section("P2", "P2 — misrepresentation")}
${section("P3", "P3 — hygiene")}

## Pages fetched

${report.pages.map((p) => `- \`${p.path}\` — ${p.status}${p.challenged ? " (bot challenge — not audited)" : ""}${p.title ? ` — ${p.title.slice(0, 70)}` : ""}`).join("\n")}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

const started = Date.now();
log(`seo-audit ${VERSION} → ${ORIGIN}`);

const robotsTxt = await checkRobots();
await checkHostConsolidation();

const sitemapUrls = (
  await collectSitemapUrls(robotsTxt.sitemaps.length ? robotsTxt.sitemaps : [`${ORIGIN}/sitemap.xml`])
).filter((u) => {
  try {
    return new URL(u).origin === ORIGIN;
  } catch {
    return false;
  }
});
const fromSitemap = new Set(sitemapUrls.map(normalize));
log(`  sitemap: ${sitemapUrls.length} URLs`);
if (!sitemapUrls.length) {
  add("P2", "docs/06", "/sitemap.xml", "No sitemap URLs found (none advertised in robots.txt, and /sitemap.xml is missing or empty). Only the homepage was audited.", null);
}

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
await checkCanonicalTargets(results);

if (challenged.length) {
  add(
    "P2",
    "docs/12",
    "(bot protection)",
    `${challenged.length} of ${results.length} URLs answered this tool with a bot-protection challenge instead of the page, so they were not audited or scored. That is expected from a datacenter IP; what matters is that real Googlebot and Bingbot get through — check Search Console Crawl stats for a 403/503 spike and URL Inspection on one of these URLs, and allow verified bots in the WAF. A challenge served to a verified search crawler is a P1.`,
    { examples: challenged.slice(0, 5) },
  );
}

// Probe 404 handling on the distinct path prefixes we saw, since a soft 404 is
// per-template rather than site-wide.
const prefixes = [
  ...new Set(
    results
      .filter((r) => r.page)
      .map((r) => new URL(r.url).pathname.split("/").filter(Boolean)[0])
      .filter((segment) => segment && !segment.includes("."))
      .map((segment) => `/${segment}`),
  ),
].slice(0, 6);
await checkNotFound([...new Set(["/", ...EXTRA_404.map((p) => (p.startsWith("/") ? p : `/${p}`)), ...prefixes])]);

const seoScore = score(results);
const geo = geoScore(results, seoScore.total);

const report = {
  tool: VERSION,
  origin: ORIGIN,
  generatedAt: new Date().toISOString(),
  durationMs: Date.now() - started,
  pagesFetched: results.filter((r) => r.page).length,
  sitemapUrlCount: sitemapUrls.length,
  sitemapUrlsVisited: seeds.filter((u) => fromSitemap.has(normalize(u))).length,
  score: seoScore,
  geo,
  contentSignal: robotsTxt.contentSignal,
  crawlers: robotsTxt.matrix.map(({ resolved, tokens, fallbacks, ...c }) => c),
  findings: findings.sort((a, b) => a.severity.localeCompare(b.severity)),
  pages: results.map((r) => ({
    path: new URL(r.url).pathname,
    status: r.status,
    challenged: Boolean(r.challenged),
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
  `\n${ORIGIN} — SEO Score ${report.score.total}/100 · GEO Score ${geo.total}/100  ·  P1 ${p1}  P2 ${p2}  P3 ${p3}  ·  ${report.pagesFetched} pages, ${sitemapUrls.length} sitemap URLs, ${Math.round(report.durationMs / 1000)}s`,
);
if (!JSON_OUT && !MD_OUT && !QUIET) {
  console.log("\n" + markdown(report));
}

const failing = FAIL_ON === "NEVER" ? 0 : FAIL_ON === "P2" ? p1 + p2 : p1;
process.exit(failing > 0 ? 1 : 0);
