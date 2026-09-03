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

# --- motion: one timing source ----------------------------------------------
# EVERY-SCREEN.md §8.1 and APPENDIX-A "Motion": src/lib/motion.ts is the single
# source of durations, stagger and easing, mirrored into globals.css as
# --dur-fast / --dur-base / --dur-draw / --dur-menu / --stagger / --ease. A
# timing literal anywhere else in src/ is drift: it is how two sections end up
# moving differently, which is the bug this gate exists to make impossible.
#
# What counts, on the comment-stripped source above (so a comment that explains
# a duration is not a violation):
#   * transition / animation, and -duration / -delay, with a non-zero time
#   * the same as a React style-object property
#   * a cubic-bezier() literal, or a --custom-property holding a time, outside
#     globals.css — a local --ease or --dur is a second source, not a token
#   * Tailwind duration-*, delay-*, ease-in|out|linear|in-out
#   * a literal duration / delay / ease key in a file that imports framer-motion
#     or motion/react — §5.10: "framer-motion usages read from motion.ts too"
# Allowed: any line reading var(--dur-*) / var(--ease) / var(--stagger); any
# line reading duration.* / easing / stagger from motion.ts; `none`; 0; and the
# 1ms / .001ms values that kill motion under prefers-reduced-motion.
#
# NOT-YET-RETIMED, per file, with the section that owns it (docs/v4/OWNERSHIP.md).
# These files predate the rule and belong to other agents, who are the only ones
# allowed to touch them. The count is pinned, so an owning section can leave its
# file alone but cannot add MORE untokenized timing to it, and any file not on
# the list fails on its first offence. A section that retimes its file deletes
# its line here; the list reaching empty is what "motion.ts is the only timing
# source in src/" means, and the Conductor holds that at integration.
m=$(cd "$SRC" && python3 - <<'MOTIONPY'
import os, re

DEFS = "src/app/globals.css"

# Pinned pre-existing drift: path -> (count, owning section).
BASELINE = {
    "src/app/globals.css":                       (3, "foundation"),
    "src/app/insights/page.tsx":                 (2, "sec-insights"),
    "src/app/legal/page.tsx":                    (1, "sec-legal"),
    "src/app/questions/page.tsx":                (1, "sec-allocators"),
    "src/components/HairlineList.tsx":           (1, "sec-allocators"),
    "src/components/PinnedStrategies.tsx":       (2, "sec-strategies"),
    "src/components/sections/Atmosphere.tsx":    (4, "sec-hero"),
    "src/components/sections/ContactBand.tsx":   (2, "sec-firm"),
    "src/components/sections/Feature.tsx":       (0, "sec-framework"),
    "src/components/sections/ForAllocators.tsx": (2, "sec-allocators"),
    "src/components/sections/HeroV2.tsx":       (14, "sec-hero"),
    "src/components/sections/Insights.tsx":      (7, "sec-insights"),
    "src/components/sections/MarketsBand.tsx":   (5, "sec-hero"),
    "src/components/sections/SiteNav.tsx":       (8, "sec-chrome"),
    "src/components/sections/Strategies.tsx":    (2, "sec-strategies"),
    "src/components/ui/Button.tsx":              (1, "Conductor"),
    "src/components/ui/Card.tsx":                (1, "Conductor"),
    # Dead code: neither is imported by any route, and §8.2 forbids a marquee
    # outright. Pinned rather than fixed because it is not sec-motion's to
    # delete; reported to the Conductor.
    "src/components/ui/infinite-slider.tsx":      (3, "Conductor"),
}

TOKEN   = re.compile(r"var\(\s*--(dur-[a-z]+|ease|stagger)\b")
FROM_TS = re.compile(r"\b(duration\.(fast|base|draw|menu)|easing|stagger)\b")
DECL    = re.compile(r"(?:^|[\s;{\"'`])(?:transition|animation)(?:-(?:duration|delay))?\s*:\s*([^;}\"'`\n]+)")
JSPROP  = re.compile(r"\b(?:transition|animation)(?:Duration|Delay)?\s*:")
CUSTOM  = re.compile(r"--[a-z0-9-]+\s*:\s*[^;}\n]*(?<![\w.-])\d*\.?\d+\s*m?s(?![\w-])")
TW      = re.compile(r"(?:^|[\s\"'`])(?:duration|delay)-(?:\[[^\]]+\]|\d+)")
TWEASE  = re.compile(r"(?:^|[\s\"'`])ease-(?:linear|in|out|in-out)\b")
BEZIER  = re.compile(r"cubic-bezier\(")
TIME    = re.compile(r"(?<![\w.-])(\d*\.?\d+)\s*(ms|s)(?![\w-])")
KEEP    = re.compile(r"^(0|0?\.0*1|1)(ms|s)?$")
MOTIONLIB = re.compile(r"from\s+[\"\'](framer-motion|motion/react|motion)[\"\']")
MOTIONKEY = re.compile(r"\b(duration|delay|ease|repeatDelay)\s*:\s*[\"\'\d]")


def offending(path, line, uses_motion_lib=False):
    if TOKEN.search(line) or FROM_TS.search(line):
        return False
    if uses_motion_lib and MOTIONKEY.search(line):
        return True
    for m in DECL.finditer(line):
        v = m.group(1).strip()
        if v.split()[0] in ("none", "inherit", "initial", "unset", "revert"):
            continue
        for num, unit in TIME.findall(v):
            if not KEEP.match(num + unit):
                return True
        if BEZIER.search(v):
            return True
    if JSPROP.search(line):
        for num, unit in TIME.findall(line):
            if not KEEP.match(num + unit):
                return True
    if path != DEFS and CUSTOM.search(line):
        return True
    if TW.search(line) or TWEASE.search(line):
        return True
    if BEZIER.search(line) and not DECL.search(line) and path != DEFS:
        return True
    return False


per = {}
for base, dirs, files in os.walk("src"):
    dirs[:] = [d for d in dirs if d not in {"node_modules", ".next"}]
    for f in sorted(files):
        if not f.endswith((".tsx", ".ts", ".css")):
            continue
        p = os.path.join(base, f).replace(os.sep, "/")
        if p == "src/lib/motion.ts":
            continue
        src = open(p, encoding="utf-8").read()
        lib = bool(MOTIONLIB.search(src))
        for n, line in enumerate(src.splitlines(), 1):
            if offending(p, line, lib):
                per.setdefault(p, []).append("%s:%d:%s" % (p, n, line.strip()[:140]))

for p in sorted(per):
    allowed, owner = BASELINE.get(p, (0, None))
    if len(per[p]) > allowed:
        if owner:
            print("%s  (%d now, %d pinned for %s)" % (p, len(per[p]), allowed, owner))
        else:
            print(p)
        for h in per[p][allowed:]:
            print("  " + h)
MOTIONPY
)
[ -n "$m" ] && out+="[untokenized motion timing — src/lib/motion.ts is the only source]\n$m\n"

printf "%b" "$out"
[ -z "$out" ]
