#!/usr/bin/env bash
#
# install.sh — put SEO Prompt Master into another project.
#
#   cd /path/to/your-project
#   bash /path/to/Seo-Promt-Master/install.sh
#
# Copies the knowledge base and tools into `.seo-prompt-master/`, then writes the
# entry point each agent actually reads:
#
#   Claude Code   .claude/skills/seo-audit/SKILL.md
#   Codex / Amp   AGENTS.md              (appended if one already exists)
#   Cursor        .cursor/rules/seo-prompt-master.mdc
#   Gemini CLI    GEMINI.md              (appended if one already exists)
#   Copilot       .github/copilot-instructions.md
#
# Existing files are never overwritten silently: an existing AGENTS.md or
# GEMINI.md gets a short section appended, and anything else is skipped with a
# note. Re-running is safe.

set -euo pipefail

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$(pwd)"
PAYLOAD=".seo-prompt-master"

if [ "$SOURCE" = "$TARGET" ]; then
  echo "You are already in the SEO Prompt Master repository."
  echo "Run this from the project you want to audit instead."
  exit 1
fi

VERSION="$(cat "$SOURCE/VERSION" 2>/dev/null || echo unknown)"
echo "Installing SEO Prompt Master $VERSION into $TARGET"

# ── Payload ──────────────────────────────────────────────────────────────────
mkdir -p "$TARGET/$PAYLOAD"
for dir in docs verticals prompts checklists templates tools examples; do
  [ -d "$SOURCE/$dir" ] || continue
  rm -rf "${TARGET:?}/$PAYLOAD/$dir"
  cp -R "$SOURCE/$dir" "$TARGET/$PAYLOAD/$dir"
done
cp "$SOURCE/START.md" "$TARGET/$PAYLOAD/START.md"
cp "$SOURCE/VERSION" "$TARGET/$PAYLOAD/VERSION"
chmod +x "$TARGET/$PAYLOAD/tools/seo-smoke.sh" "$TARGET/$PAYLOAD/tools/seo-audit.mjs" 2>/dev/null || true
echo "  ✓ $PAYLOAD/ (docs, verticals, prompts, tools)"

# Paths inside the installed copy differ from paths inside this repo, so rewrite
# them rather than shipping instructions that point at files the agent cannot find.
rewrite() {
  sed -e "s#\`tools/#\`$PAYLOAD/tools/#g" \
      -e "s#node tools/#node $PAYLOAD/tools/#g" \
      -e "s#bash tools/#bash $PAYLOAD/tools/#g" \
      -e "s#\`docs/#\`$PAYLOAD/docs/#g" \
      -e "s#\`verticals/#\`$PAYLOAD/verticals/#g" \
      -e "s#\`prompts/#\`$PAYLOAD/prompts/#g" \
      -e "s#\`START.md\`#\`$PAYLOAD/START.md\`#g" \
      "$1" |
  # Ranges like `docs/01`–`docs/17` come out of the rewrite above with the
  # prefix repeated on both ends, which is unreadable. Collapse them.
  sed -E "s#\`$PAYLOAD/(docs|verticals|prompts)/([0-9]+)\`(–|-)\`$PAYLOAD/\1/([0-9]+)\`#\`$PAYLOAD/\1/\2–\4\`#g"
}

write_new() {
  local dest="$1" src="$2" label="$3"
  if [ -e "$dest" ]; then
    echo "  – $label already exists, skipped"
    return
  fi
  mkdir -p "$(dirname "$dest")"
  rewrite "$src" > "$dest"
  echo "  ✓ $label"
}

append_or_write() {
  local dest="$1" src="$2" label="$3"
  mkdir -p "$(dirname "$dest")"
  if [ -e "$dest" ]; then
    if grep -q "SEO Prompt Master" "$dest" 2>/dev/null; then
      echo "  – $label already references SEO Prompt Master, left alone"
      return
    fi
    {
      printf '\n\n---\n\n'
      rewrite "$src"
    } >> "$dest"
    echo "  ✓ $label (appended)"
  else
    rewrite "$src" > "$dest"
    echo "  ✓ $label"
  fi
}

# ── Agent entry points ───────────────────────────────────────────────────────
write_new "$TARGET/.claude/skills/seo-audit/SKILL.md" \
          "$SOURCE/.claude/skills/seo-audit/SKILL.md" \
          ".claude/skills/seo-audit/SKILL.md (Claude Code)"

write_new "$TARGET/.cursor/rules/seo-prompt-master.mdc" \
          "$SOURCE/.cursor/rules/seo-prompt-master.mdc" \
          ".cursor/rules/seo-prompt-master.mdc (Cursor)"

write_new "$TARGET/.github/copilot-instructions.md" \
          "$SOURCE/.github/copilot-instructions.md" \
          ".github/copilot-instructions.md (Copilot)"

append_or_write "$TARGET/AGENTS.md" "$SOURCE/AGENTS.md" "AGENTS.md (Codex, Amp, Jules…)"
append_or_write "$TARGET/GEMINI.md" "$SOURCE/GEMINI.md" "GEMINI.md (Gemini CLI)"

echo
echo "Done. Try it now:"
echo
echo "  node $PAYLOAD/tools/seo-audit.mjs --url https://your-site.example --max 25 --md seo-report.md"
echo
echo "Then ask your agent to 'run the SEO audit' — it will find the workflow on its own."
