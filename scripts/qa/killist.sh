#!/usr/bin/env bash
# Appendix A.7 kill list. Must print nothing. Any output is a gate failure.
set -u
out=""
add(){ r=$(grep -rn "$1" src/ --include=*.tsx --include=*.ts --include=*.css --include=*.mdx 2>/dev/null); [ -n "$r" ] && out+="[$2]\n$r\n"; }
add "→" "arrow glyph"
add "·" "middle dot"
add "ticker" "ticker"
add "\$0M\|0\.0%" "placeholder metric"
add "uppercase" "uppercase"
add "italic" "italic"
add "tracking-\[" "ad-hoc tracking"
add "shadow-" "shadow"
add "rounded-lg\|rounded-xl\|rounded-2xl\|rounded-full" "off-spec radius"
add "text-\[\|bg-\[\|p-\[\|px-\[\|py-\[\|m-\[\|w-\[\|h-\[\|gap-\[\|z-\[\|top-\[\|left-\[\|right-\[\|bottom-\[\|min-h-\[\|max-w-\[" "arbitrary value"
add "font-mono\|monospace" "monospace"
add "Girls Country\|Frost Bank\|555-" "stale placeholder"
# Color gradients only. A mask-image gradient is an alpha ramp that A.6 requires
# for the surface dissolve; it paints no color, so it is not an A.7.12 gradient.
r=$(grep -rn "bg-gradient\|linear-gradient\|radial-gradient" src/ --include=*.tsx --include=*.ts --include=*.css --include=*.mdx 2>/dev/null | grep -v "mask-image"); [ -n "$r" ] && out+="[gradient]\n$r\n"
add "backdrop-blur" "glass"
add "framer-motion\|lucide\|react-icons\|@radix-ui\|@heroicons" "banned dependency"
# A.7.10 bans anchor-scroll NAV. The skip link (A.9, required) and the
# /strategies#slug deep links (A.8, required) are not that.
r=$(grep -rn "href=\"#" src/ --include=*.tsx 2>/dev/null | grep -v "#main" | grep -v "strategies#"); [ -n "$r" ] && out+="[anchor nav]\n$r\n"
add "short-convexity\|short convexity" "A.7.13 tail overlay mischaracterized"
printf "%b" "$out"
# The fund name may appear only in site.ts.
n=$(grep -rln "Girlscantrade2\|Girls Can Trade" src/ 2>/dev/null | grep -v "src/config/site.ts")
[ -n "$n" ] && printf "[name hardcoded outside site.ts]\n%s\n" "$n"
exit 0
