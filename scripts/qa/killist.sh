#!/usr/bin/env bash
# Kill list for redesign/origin-100k (dark system).
#
# This is NOT the light-branch A.7 list. That list banned uppercase, mono,
# gradients, radix, lucide and framer-motion — all of which this system uses
# on purpose. What survives is the part that was never about taste: invented
# facts, placeholder text, and drift away from the token scale.
#
# Must print nothing. Any output is a gate failure.
set -u

# Comments are blanked before matching, line numbers preserved, so a comment
# that names a banned token in order to ban it is not a violation. Line-based
# stripping is not enough: a block comment's continuation lines carry no
# marker of their own, which is exactly how "no TBD" tripped the TBD rule.
SRC=$(mktemp -d)
trap 'rm -rf "$SRC"' EXIT
python3 - "$SRC" <<'PY'
import os, re, sys
dst = sys.argv[1]
# src/ is where the site is, but the stale-placeholder rule is about facts,
# and facts leak into prose too: "Girls Country 2" and "Austin, TX" sat in
# README.md for the life of this branch while this gate reported PASS, because
# it only ever walked src/. Markdown at the repo root and under docs/ counts.
ROOTS = ["src", "docs", "."]
SEEN = set()
for base in ROOTS:
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in
                   {"node_modules", ".next", ".git", ".vercel", "dist", ".gstack"}]
        if base == "." and root != ".":
            continue  # root pass takes top-level files only; docs/ has its own pass
        for f in files:
            if not f.endswith((".tsx", ".ts", ".css", ".mdx", ".md")):
                continue
            p = os.path.normpath(os.path.join(root, f))
            if p in SEEN:
                continue
            SEEN.add(p)
            s = open(p, encoding="utf-8").read()
            # Blank comment bodies, keep newlines so line numbers still line up.
            s = re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), s, flags=re.S)
            s = re.sub(r"(?m)^(\s*)//.*$", r"\1", s)
            o = os.path.join(dst, p)
            os.makedirs(os.path.dirname(o), exist_ok=True)
            open(o, "w", encoding="utf-8").write(s)
PY

out=""
# Style rules stay scoped to src/: docs/21st/ is harvested third-party component
# code and legitimately full of rounded-xl and shadow-. Fact rules use addfact()
# and scan everything, because a false founding city in README.md is exactly the
# thing this gate exists to catch and it sat there for the life of the branch.
add(){ r=$(cd "$SRC" && grep -rn "$1" src/ 2>/dev/null); [ -n "$r" ] && out+="[$2]\n$r\n"; }
addfact(){ r=$(cd "$SRC" && grep -rn "$1" . 2>/dev/null | grep -v "^./docs/21st/"); [ -n "$r" ] && out+="[$2]\n$r\n"; }

# --- invented facts -------------------------------------------------------
addfact "\$0M\|0\.0%\|\bN/A\b" "placeholder metric"
add "\bTBD\b\|\bTBA\b\|Lorem ipsum\|[Cc]oming soon\|\[insert\|\bXXX\b\|FIXME" "placeholder copy"
addfact "Girls Country\|Frost Bank\|555-\|123 Main\|@example\.com" "stale placeholder"
# A regulator ID that is not read out of fund.ts is a fabricated one.
r=$(cd "$SRC" && grep -rn "CRD[ #:]*[0-9]\|801-[0-9]\|802-[0-9]\|NFA[ #:]*[0-9]" src/ 2>/dev/null | grep -v "src/config/fund.ts"); [ -n "$r" ] && out+="[hardcoded regulator id]\n$r\n"

# --- token drift ----------------------------------------------------------
# Only categories that HAVE a token: type, tracking, colour, spacing scale.
# Bare layout dimensions (min-h, max-w, w, h) have no token to drift from —
# a 92px ledger row is a decision, not a deviation.
add "tracking-\[\|text-\[\|p-\[\|px-\[\|py-\[\|m-\[\|mt-\[\|gap-\[\|bg-\[#\|border-\[#" "arbitrary value"
add "rounded-lg\|rounded-xl\|rounded-2xl\|rounded-full" "off-spec radius"

# --- structural -----------------------------------------------------------
# Anchor-scroll nav is banned. The skip link and /strategies#slug deep links
# are required, so they are not that.
r=$(cd "$SRC" && grep -rn "href=\"#" src/ 2>/dev/null | grep -v "#main" | grep -v "strategies#"); [ -n "$r" ] && out+="[anchor nav]\n$r\n"
add "short-convexity\|short convexity" "tail overlay mischaracterized"

# The fund name may appear only in site.ts.
n=$(cd "$SRC" && grep -rln "Girlscantrade2\|Girls Can Trade" src/ 2>/dev/null | grep -v "src/config/site.ts")
[ -n "$n" ] && out+="[name hardcoded outside site.ts]\n$n\n"

printf "%b" "$out"
[ -z "$out" ]
