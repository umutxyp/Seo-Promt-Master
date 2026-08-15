#!/usr/bin/env bash
#
# seo-smoke — the deploy tripwire.
#
# `seo-audit.mjs` is the thorough pass you run deliberately. This is the ten-second
# one you wire into the deploy, after the swap, on every release. It catches the
# regressions no browser shows you: a staging `noindex` that shipped, a robots.txt
# that came back empty, a template that started answering 200 for URLs that do not
# exist, a canonical that stopped rendering.
#
#   bash tools/seo-smoke.sh https://example.com
#   bash tools/seo-smoke.sh http://localhost:3000
#
# Exit 1 on any failure, so a deploy script can stop on it.
#
# There is deliberately no `set -o pipefail` here. `grep -q` exits as soon as it
# matches, which closes the pipe and makes curl return 23 — pipefail would count
# that success as a failure. This has bitten people; leave it as it is.

set -u

BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"
fail=0

pass() { printf '  ok   %s\n' "$1"; }
bad()  { printf '  FAIL %s\n' "$1"; fail=1; }

status() {
  curl -s -o /dev/null -w '%{http_code}' -m 15 -A 'seo-smoke' "$1" 2>/dev/null
}

# Expect a specific status code from a path.
check() {
  local path="$1" want="${2:-200}" got
  got=$(status "$BASE$path")
  if [ "$got" = "$want" ]; then pass "$path → $got"; else bad "$path → $got (expected $want)"; fi
}

body() {
  curl -s -m 15 -A 'seo-smoke' "$BASE$1" 2>/dev/null
}

echo "seo-smoke → $BASE"

# ── The files that must exist ────────────────────────────────────────────────
echo "infrastructure"
check /robots.txt
check /sitemap.xml
check /

# ── Production must not carry a noindex ──────────────────────────────────────
# This is the single most expensive regression in this list and the one most
# likely to reach production unnoticed, because nothing about the page looks
# different.
echo "indexability"
if body / | grep -qi 'name="robots"[^>]*content="[^"]*noindex'; then
  bad "homepage carries noindex"
else
  pass "no noindex on homepage"
fi

# `Disallow: /` only matters in the group that applies to search crawlers.
# Blocking GPTBot or Google-Extended outright is a deliberate AI-training policy
# (docs/10) and flagging it would train people to ignore this script.
if body /robots.txt | awk '
  BEGIN { IGNORECASE = 1; relevant = 0; blocked = 0 }
  { sub(/#.*/, ""); gsub(/\r/, "") }
  /^[[:space:]]*[Uu]ser-[Aa]gent:/ {
    agent = tolower($2)
    if (started) { relevant = 0; started = 0 }
    if (agent == "*" || agent == "googlebot" || agent == "bingbot") relevant = 1
    next
  }
  /^[[:space:]]*[Dd]isallow:/ {
    started = 1
    path = $2
    if (relevant && path == "/") blocked = 1
    next
  }
  END { exit blocked ? 0 : 1 }
'; then
  bad "robots.txt blocks search crawlers site-wide with 'Disallow: /'"
else
  pass "search crawlers are not blocked site-wide"
fi

if body /robots.txt | grep -qi '^[[:space:]]*Sitemap:'; then
  pass "robots.txt advertises a sitemap"
else
  bad "robots.txt has no Sitemap: line"
fi

# ── Canonical and structured data still render ───────────────────────────────
echo "metadata"
if body / | grep -qi 'rel="canonical"'; then
  pass "homepage has a canonical"
else
  bad "homepage canonical missing"
fi

if body / | grep -qi 'application/ld+json'; then
  pass "homepage has JSON-LD"
else
  bad "homepage JSON-LD missing"
fi

# ── 404s, per template ───────────────────────────────────────────────────────
# Per template, not once. A `loading.tsx` (or any Suspense boundary) added above
# one segment turns that whole template's 404 into a 200 shell, and there is no
# visible symptom — see docs/13.
#
# Set SEO_SMOKE_404_PATHS to your own templates:
#   SEO_SMOKE_404_PATHS="/blog /products /users" bash tools/seo-smoke.sh https://…
echo "404 handling"
NONCE="seo-smoke-nonexistent-$$"
for prefix in ${SEO_SMOKE_404_PATHS:-/}; do
  prefix="${prefix%/}"
  check "$prefix/$NONCE" 404
done

# ── Optional extras, only checked when they exist ────────────────────────────
echo "optional"
for path in /feed.xml /llms.txt; do
  code=$(status "$BASE$path")
  case "$code" in
    200) pass "$path → 200" ;;
    404) printf '  --   %s not present\n' "$path" ;;
    *)   bad "$path → $code" ;;
  esac
done

echo
if [ "$fail" -eq 0 ]; then
  echo "seo-smoke: all checks passed"
else
  echo "seo-smoke: FAILURES — do not consider this deploy healthy"
fi
exit "$fail"
