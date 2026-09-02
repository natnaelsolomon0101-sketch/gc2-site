#!/usr/bin/env bash
# SWARM §4.1 punctuation lint. Must print nothing.
# Content must use typographic punctuation: ' " " – — …
# Straight quotes, -- and ... are failures in prose.
set -u
out=""
scan(){ # $1 = pattern, $2 = label
  r=$(grep -rn --include=*.mdx --include=*.ts --include=*.tsx -E "$1" src/content src/app 2>/dev/null \
      | grep -vE "^\S+:[0-9]+:\s*(import|export|//|/\*|\*)" \
      | grep -vE "className=|href=|src=|aria-|datetime=|https?://" || true)
  [ -n "$r" ] && out+="[$2]\n$r\n"
}
# Straight apostrophe or double quote inside a prose string.
scan "\"[^\"]*[a-z]'[a-z][^\"]*\"" "straight apostrophe in prose"
scan '\-\-[^>-]' "double hyphen instead of an em or en dash"
scan '\.\.\.' "three dots instead of an ellipsis"
printf "%b" "$out"
exit 0
