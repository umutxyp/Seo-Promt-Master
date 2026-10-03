/**
 * Consistency checks across the repository itself: the knowledge base is only
 * a source of truth if what cites it points at things that exist.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    if ([".git", "node_modules"].includes(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const markdown = walk(root).filter((p) => /\.(md|mdc)$/.test(p));
const docNumbers = new Set(readdirSync(join(root, "docs")).map((f) => f.slice(0, 2)).filter((n) => /^\d\d$/.test(n)));

test("every docs/NN citation points at an existing doc", () => {
  const missing = [];
  for (const file of [...markdown, join(root, "tools/seo-audit.mjs")]) {
    for (const m of readFileSync(file, "utf8").matchAll(/\bdocs\/(\d\d)\b/g)) {
      if (!docNumbers.has(m[1])) missing.push(`${relative(root, file)} → docs/${m[1]}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("relative Markdown links resolve", () => {
  const broken = [];
  for (const file of markdown) {
    const text = readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
    for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = m[1].split("#")[0];
      if (!target || /^(https?:|mailto:)/.test(target)) continue;
      if (!existsSync(join(dirname(file), target))) broken.push(`${relative(root, file)} → ${m[1]}`);
    }
  }
  assert.deepEqual(broken, []);
});

test("every library prompt has a title, a 'Use when' line and a text block", async () => {
  const dir = join(root, "prompt-library");
  for (const file of readdirSync(dir).filter((f) => /^\d\d-.*\.md$/.test(f))) {
    const sections = readFileSync(join(dir, file), "utf8").split(/^###\s+/m).slice(1);
    assert.ok(sections.length > 0, `${file} has prompts`);
    for (const s of sections) {
      const title = s.split("\n")[0];
      assert.match(s, /\*\*Use when:\*\*/, `${file} › ${title}: Use when`);
      assert.match(s, /```text\n[\s\S]+?\n```/, `${file} › ${title}: text block`);
    }
  }
});

test("versions agree", () => {
  const version = readFileSync(join(root, "VERSION"), "utf8").trim();
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(pkg.version, version, "package.json version matches VERSION");
  assert.match(readFileSync(join(root, "README.md"), "utf8"), new RegExp(`version-${version.replace(/\./g, "\\.")}-`), "README badge");
  assert.match(readFileSync(join(root, "CHANGELOG.md"), "utf8"), new RegExp(`^## ${version.replace(/\./g, "\\.")} `, "m"), "CHANGELOG entry");
});
