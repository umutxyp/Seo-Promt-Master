/**
 * Two tiny sites served from memory: one that does everything right, one that
 * carries every defect the audit tools claim to catch. The tests assert both
 * directions — the broken site is caught, and the healthy one is left alone.
 * A checker that cries wolf on a clean site is as broken as one that misses.
 */
import http from "node:http";
import { gzipSync } from "node:zlib";

const page = ({ title, h1, canonical, lang = "en", head = "", body = "", jsonLd }) => `<!doctype html>
<html lang="${lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${title} — a description long enough to be a real summary of the page.">
<meta property="og:title" content="${title}"><meta property="og:image" content="/og.png">
${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
${head}
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head><body><main><h1>${h1}</h1>${body}</main></body></html>`;

const prose = "<p>" + "Real server-rendered words about this subject. ".repeat(30) + "</p>";
const structure = "<h2>What it is</h2><ul><li>One</li><li>Two</li></ul><h2>How it works</h2><table><tr><td>x</td></tr></table>";

export function healthySite(origin) {
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "Healthy", url: origin, sameAs: ["https://github.com/example"] },
      { "@type": "WebSite", name: "Healthy", url: origin },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: origin }] },
    ],
  };
  const alt = (path) =>
    `<link rel="alternate" hreflang="en" href="${origin}/en${path}"><link rel="alternate" hreflang="tr" href="${origin}/tr${path}"><link rel="alternate" hreflang="x-default" href="${origin}/en${path}">`;
  const nav = `<nav><a href="/">Home</a> <a href="/en/guide">Guide</a> <a href="/tr/guide">Rehber</a></nav>`;
  const routes = {
    "/robots.txt": [200, "text/plain", `User-agent: *\nDisallow: /admin/\n\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${origin}/sitemap.xml.gz\n`],
    "/sitemap.xml.gz": [200, "application/gzip", gzipSync(`<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", "/en/guide", "/tr/guide"].map((p, i) => `<url><loc>${origin}${p}</loc><lastmod>2026-0${i + 1}-15</lastmod></url>`).join("")}</urlset>`)],
    "/": [200, "text/html", page({ title: "Healthy — home", h1: "Healthy home page", canonical: `${origin}/`, jsonLd: org, body: nav + structure + prose + '<img src="/hero.png" alt="Hero" width="800" height="400">' })],
    "/en/guide": [200, "text/html", page({ title: "The guide", h1: "The complete guide", canonical: `${origin}/en/guide`, head: alt("/guide"), jsonLd: { "@context": "https://schema.org", "@type": "Article", headline: "The guide" }, body: nav + structure + prose })],
    "/tr/guide": [200, "text/html", page({ title: "Rehber", h1: "Eksiksiz rehber", lang: "tr", canonical: `${origin}/tr/guide`, head: alt("/guide"), jsonLd: { "@context": "https://schema.org", "@type": "Article", headline: "Rehber" }, body: nav + structure + prose })],
  };
  return { routes, headers: {} };
}

export function brokenSite(origin) {
  const nav = `<a href="/">Home</a>`;
  const routes = {
    "/robots.txt": [200, "text/plain", `User-agent: *\nDisallow: /private\nDisallow: /_assets/\n\nUser-agent: bingbot\nDisallow: /\n\nSitemap: ${origin}/sitemap.xml\n`],
    "/sitemap.xml": [200, "application/xml", `<urlset>${["/", "/a", "/private/x", "/old", "/en/one", "/fr/one", "/product"].map((p) => `<url><loc>${origin}${p}</loc><lastmod>2026-10-01</lastmod></url>`).join("")}</urlset>`],
    // Canonical points at a noindex page; a render-critical script is disallowed.
    "/": [200, "text/html", page({ title: "Broken", h1: "Broken home here", canonical: `${origin}/a`, head: `<script src="/_assets/app.js"></script>`, body: nav + '<img data-src="/lazy.png" alt="x">' })],
    // noindex arrives as a header, not a meta tag.
    "/a": [200, "text/html", page({ title: "Page A", h1: "Page A subject", canonical: `${origin}/a`, body: nav + prose })],
    "/private/x": [200, "text/html", page({ title: "Private", h1: "Private thing here", canonical: `${origin}/private/x`, body: nav })],
    // One-way hreflang: /en/one lists /fr/one, /fr/one does not list it back.
    "/en/one": [200, "text/html", page({ title: "One EN", h1: "One in English", canonical: `${origin}/en/one`, head: `<link rel="alternate" hreflang="en" href="${origin}/en/one"><link rel="alternate" hreflang="fr" href="${origin}/fr/one">`, body: nav + prose })],
    "/fr/one": [200, "text/html", page({ title: "One FR", h1: "Un en français", lang: "fr", canonical: `${origin}/fr/one`, head: `<link rel="alternate" hreflang="fr" href="${origin}/fr/one">`, body: nav + prose })],
    // Product with a rating that has nothing behind it.
    "/product": [200, "text/html", page({ title: "Product", h1: "Product name here", canonical: `${origin}/product`, jsonLd: { "@context": "https://schema.org", "@type": "Product", name: "P", aggregateRating: { "@type": "AggregateRating", ratingValue: 5 } }, body: nav + prose })],
  };
  return { routes, headers: { "/a": { "x-robots-tag": "noindex" } }, redirects: { "/old": "/a" }, softPrefixes: ["/a/"] };
}

/** Homepage noindex written content-first — the order the old smoke regex missed. */
export function noindexSite(origin) {
  return {
    routes: {
      "/robots.txt": [200, "text/plain", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`],
      "/sitemap.xml": [200, "application/xml", `<urlset><url><loc>${origin}/</loc></url></urlset>`],
      "/": [200, "text/html", page({ title: "Staging", h1: "Staging leak here", canonical: `${origin}/`, head: `<meta content='noindex, nofollow' name='robots'>`, jsonLd: { "@type": "WebPage" } })],
    },
    headers: {},
  };
}

export function serve(build) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const path = req.url.split("?")[0];
      const site = server.site;
      if (site.redirects?.[path]) {
        res.writeHead(301, { location: site.redirects[path] });
        return res.end();
      }
      const route = site.routes[path];
      if (!route) {
        const soft = (site.softPrefixes || []).some((p) => path.startsWith(p));
        res.writeHead(soft ? 200 : 404, { "content-type": "text/html" });
        return res.end("<html><head><title>Not found</title></head><body>Not found</body></html>");
      }
      const [status, type, body] = route;
      res.writeHead(status, { "content-type": type, ...(site.headers[path] || {}) });
      res.end(body);
    });
    server.listen(0, "127.0.0.1", () => {
      const origin = `http://127.0.0.1:${server.address().port}`;
      server.site = build(origin);
      resolve({ origin, close: () => new Promise((r) => server.close(r)) });
    });
  });
}
