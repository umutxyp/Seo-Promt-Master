#!/usr/bin/env node
/**
 * Builds prompt-library/prompts.csv from the Markdown category files.
 *
 * The Markdown is the source; the CSV exists so the library can be imported
 * into prompt managers built around the prompts.chat CSV shape. Run with
 * `--check` in CI to fail when someone edited one without regenerating.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = new URL("../prompt-library/", import.meta.url);
const out = new URL("prompts.csv", dir);

export function extract(markdown) {
  const prompts = [];
  const category = (markdown.match(/^#\s+\d+\s+—\s+(.+)$/m) || [])[1]?.trim() ?? "";
  const sections = markdown.split(/^###\s+/m).slice(1);
  for (const section of sections) {
    const title = section.split("\n")[0].trim();
    const body = section.match(/```text\n([\s\S]*?)\n```/);
    if (body) prompts.push({ act: title, prompt: body[1].trim(), category });
  }
  return prompts;
}

const cell = (value) => `"${String(value).replace(/"/g, '""')}"`;

const files = readdirSync(dir).filter((f) => /^\d{2}-.*\.md$/.test(f)).sort();
const rows = files.flatMap((file) =>
  extract(readFileSync(new URL(file, dir), "utf8")).map((p) => ({ ...p, source: `prompt-library/${file}` })),
);
const csv =
  ["act,prompt,category,source", ...rows.map((r) => [r.act, r.prompt, r.category, r.source].map(cell).join(","))].join("\n") +
  "\n";

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(out, "utf8");
  } catch {}
  if (current !== csv) {
    console.error("prompt-library/prompts.csv is out of date — run `npm run prompts:csv`.");
    process.exit(1);
  }
  console.log(`prompts.csv up to date (${rows.length} prompts).`);
} else {
  writeFileSync(out, csv);
  console.log(`Wrote prompt-library/prompts.csv (${rows.length} prompts from ${files.length} files).`);
}
