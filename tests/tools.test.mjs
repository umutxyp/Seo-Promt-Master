import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { brokenSite, healthySite, noindexSite, serve } from "./fixtures.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const run = (cmd, args, env = {}) =>
  new Promise((resolve) => {
    execFile(cmd, args, { cwd: root, env: { ...process.env, ...env } }, (error, stdout, stderr) =>
      resolve({ code: error ? error.code ?? 1 : 0, stdout, stderr }),
    );
  });

async function audit(build, extra = []) {
  const site = await serve(build);
  const out = join(mkdtempSync(join(tmpdir(), "seo-audit-")), "report.json");
  try {
    const result = await run(process.execPath, ["tools/seo-audit.mjs", "--url", site.origin, "--json", out, "--quiet", ...extra]);
    return { ...result, report: JSON.parse(readFileSync(out, "utf8")) };
  } finally {
    await site.close();
  }
}

const has = (report, severity, pattern, where) =>
  report.findings.some(
    (f) => f.severity === severity && pattern.test(f.message) && (where === undefined || f.where === where),
  );

test("a healthy site passes clean", async () => {
  const { code, report } = await audit(healthySite);
  const serious = report.findings.filter((f) => f.severity !== "P3");
  assert.deepEqual(serious, [], "no P1/P2 on a healthy site");
  assert.equal(code, 0);
  assert.equal(report.pagesFetched, 3, "the .xml.gz sitemap was read");
  assert.ok(report.score.total >= 95, `SEO score ${report.score.total}`);
  assert.ok(report.geo.total >= 90, `GEO score ${report.geo.total}`);
  assert.ok(!report.geo.capped);
  const gpt = report.crawlers.find((c) => c.name === "GPTBot");
  assert.equal(gpt.allowedRoot, false, "GPTBot group resolved");
  assert.equal(report.crawlers.find((c) => c.name === "Bingbot").allowedRoot, true);
});

test("a broken site is caught on every defect", async () => {
  const { code, report } = await audit(brokenSite);
  assert.equal(code, 1, "exit 1 on P1");
  assert.ok(has(report, "P1", /blocks Bingbot/), "Bingbot block");
  assert.ok(has(report, "P1", /noindex.*X-Robots-Tag/, "/a"), "X-Robots-Tag noindex");
  assert.ok(has(report, "P1", /disallows this URL for Googlebot/, "/private/x"), "sitemap URL blocked by robots");
  assert.ok(has(report, "P1", /script\/stylesheet/, "/"), "render-critical asset blocked");
  assert.ok(has(report, "P1", /soft 404/), "soft 404 per template");
  assert.ok(has(report, "P1", /does not point back/, "/en/one"), "one-way hreflang");
  assert.ok(has(report, "P2", /redirects \(301\)/, "/old"), "sitemap lists a redirect");
  assert.ok(has(report, "P2", /which is `noindex`/, "/"), "canonical to a noindex page");
  assert.ok(has(report, "P2", /aggregateRating` is emitted with no rating count/, "/product"), "empty rating");
  assert.ok(has(report, "P3", /neither width\/height/, "/"), "data-src is not mistaken for src");
  assert.ok(report.score.total < 60);
});

test("--fail-on never keeps the exit code at 0", async () => {
  const { code } = await audit(brokenSite, ["--fail-on", "never"]);
  assert.equal(code, 0);
});

test("seo-smoke passes a healthy site and fails a broken one", async () => {
  const healthy = await serve(healthySite);
  try {
    // The healthy fixture serves its sitemap as .xml.gz, so only check the rest.
    const r = await run("bash", ["tools/seo-smoke.sh", healthy.origin]);
    assert.match(r.stdout, /ok +no noindex meta on homepage/);
    assert.match(r.stdout, /ok +search crawlers are not blocked/);
  } finally {
    await healthy.close();
  }

  const broken = await serve(brokenSite);
  try {
    const r = await run("bash", ["tools/seo-smoke.sh", broken.origin], { SEO_SMOKE_404_PATHS: "/ /a" });
    assert.equal(r.code, 1);
    assert.match(r.stdout, /FAIL robots\.txt blocks search crawlers/);
    assert.match(r.stdout, /FAIL \/a\/seo-smoke-nonexistent-\d+ → 200/);
  } finally {
    await broken.close();
  }

  const leak = await serve(noindexSite);
  try {
    const r = await run("bash", ["tools/seo-smoke.sh", leak.origin]);
    assert.match(r.stdout, /FAIL homepage carries a noindex robots meta tag/, "content-first attribute order");
  } finally {
    await leak.close();
  }
});
