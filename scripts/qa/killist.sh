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
INC=(--include=*.tsx --include=*.ts --include=*.css --include=*.mdx)
out=""
# Comment lines are stripped before matching: a comment that names a banned
# token in order to ban it is not a violation. This is the false positive the
# light-branch list produced every single run.
nocomment(){ grep -v ":[[:space:]]*\(\*\|//\|/\*\)"; }
add(){ r=$(grep -rn "$1" src/ "${INC[@]}" 2>/dev/null | nocomment); [ -n "$r" ] && out+="[$2]\n$r\n"; }

# --- invented facts -------------------------------------------------------
add "\$0M\|0\.0%\|00\.0\|\bN/A\b" "placeholder metric"
add "\bTBD\b\|\bTBA\b\|Lorem ipsum\|[Cc]oming soon\|\[insert\|\bXXX\b\|FIXME" "placeholder copy"
add "Girls Country\|Frost Bank\|555-\|123 Main\|@example\.com" "stale placeholder"
# A regulator ID that is not read out of fund.ts is a fabricated one.
r=$(grep -rn "CRD[ #:]*[0-9]\|801-[0-9]\|802-[0-9]\|NFA[ #:]*[0-9]" src/ "${INC[@]}" 2>/dev/null | nocomment | grep -v "src/config/fund.ts"); [ -n "$r" ] && out+="[hardcoded regulator id]\n$r\n"

# --- token drift ----------------------------------------------------------
# Only the categories that HAVE a token: type, tracking, colour, and the
# spacing scale. Bare layout dimensions (min-h, max-w, w, h) have no token to
# drift from — a 92px ledger row is a decision, not a deviation.
add "tracking-\[\|text-\[\|p-\[\|px-\[\|py-\[\|m-\[\|mt-\[\|gap-\[\|bg-\[#\|border-\[#" "arbitrary value"
add "rounded-lg\|rounded-xl\|rounded-2xl\|rounded-full" "off-spec radius"

# --- structural -----------------------------------------------------------
# Anchor-scroll nav is banned. The skip link and /strategies#slug deep links
# are required, so they are not that.
r=$(grep -rn "href=\"#" src/ --include=*.tsx 2>/dev/null | nocomment | grep -v "#main" | grep -v "strategies#"); [ -n "$r" ] && out+="[anchor nav]\n$r\n"
add "short-convexity\|short convexity" "tail overlay mischaracterized"

printf "%b" "$out"

# The fund name may appear only in site.ts.
n=$(grep -rln "Girlscantrade2\|Girls Can Trade" src/ 2>/dev/null | grep -v "src/config/site.ts")
[ -n "$n" ] && printf "[name hardcoded outside site.ts]\n%s\n" "$n"
exit 0
