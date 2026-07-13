# Contributing to SEO Prompt Master

Thanks for helping keep this current! Google's guidance changes often, and framework recipes always help.

## Ground rules

1. **Every SEO claim needs a source.** Add or update the `Source:` link (prefer `developers.google.com/search` or `web.dev`). No source, no merge.
2. **Keep the `✅ Do / ⚠️ Gotcha / ❌ Don't` convention** in `docs/`.
3. **Distinguish ranking factors from a11y/UX niceties.** Don't oversell something Google says isn't a ranking signal.
4. **Prompts stay tool-agnostic.** They should work in Claude, GPT, Gemini, Cursor, Copilot, etc.

## Good PRs

- ✍️ **Doc update** — a rule changed; update the text + source + the date implications in `docs/09` if relevant.
- 🧩 **Framework recipe** — add concrete "how to fix X in Next.js / Nuxt / SvelteKit / Astro / Rails / Django / Laravel" notes to the relevant `prompts/04` recipe or a new `examples/` file.
- 🧪 **Example** — a worked `ROUTES-INVENTORY.md` / `SEO-AUDIT-PROGRESS.md` for a real stack in `examples/`.
- 🌐 **Translation** — a localized `docs/` set.

## How

1. Fork → branch → edit.
2. Keep changes focused and cited.
3. Open a PR describing what changed and linking the Google source.

By contributing you agree your work is licensed under the repo's [MIT License](LICENSE).
