#!/usr/bin/env bash
# SWARM §4.1 punctuation lint. Must print nothing.
#
# Scans PROSE only. An earlier version scanned all of src/ and flagged CSS
# variable names (--font-newsreader), JSX comment rules ({/* ---- hero ---- */})
# and JS spread (...size) — none of which are prose. Those are code, and a lint
# that flags code is a lint that gets muted.
set -u
out=""

# 1. MDX bodies: everything outside fenced code and outside JSX/frontmatter.
mdx=$(find src/content -name '*.mdx' 2>/dev/null)
for f in $mdx; do
  r=$(awk '/^```/{c=!c;next} c{next} /^(import|export|<)/{next} {print FILENAME":"FNR": "$0}' "$f" \
      | grep -E "[a-zA-Z]'[a-zA-Z]|[^-]--[^->]|\.\.\." || true)
  [ -n "$r" ] && out+="$r\n"
done

# 2. Content data files: only the values of prose-bearing keys.
r=$(grep -rnE '^\s*(dek|title|oneLiner|standfirst|body|p):' src/content --include=*.ts 2>/dev/null \
    | grep -E "[a-zA-Z]'[a-zA-Z]|[^-]--[^->]|\.\.\." || true)
[ -n "$r" ] && out+="$r\n"

# 3. Quoted prose inside page components: strings of 4+ words.
r=$(grep -rnoE '"[A-Z][^"]{25,}"' src/app --include=*.tsx 2>/dev/null \
    | grep -vE 'className|href|aria-|datetime|https?://|font-|--' \
    | grep -E "[a-zA-Z]'[a-zA-Z]|\.\.\." || true)
[ -n "$r" ] && out+="$r\n"

[ -n "$out" ] && printf "[straight punctuation in prose]\n%b" "$out"
exit 0
