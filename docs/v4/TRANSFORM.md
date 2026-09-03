# TRANSFORM — the whole site, every section, from two references

Owner's instruction (4 Sep 2026): "You need to create new code for everything
of the site. Each detail has to come from motionsites.ai/?prompt=aethera-hero
or 21st.dev/community/components?q=hero. I need to see this fully transformed
and amazing." Plus: the footer becomes pink and Instagram-worthy (female
allocator audience), and the favicon (the paper "G") is redesigned.

The hero (r9e, live) is the pattern. Every other section is rebuilt to the
same language. This document is the brief; OWNERSHIP.md is the file map; the
paper token system in DESIGN.md / globals.css is the palette. Nothing here
changes a fact, a word of firm copy, or the 506(b) regime.

## The language (from the references)

Aethera hero (motionsites): a picture fills the frame; the nav floats over
it; one editorial serif line with two operative words in italic; a short
lead; pill actions; nothing else competes with the picture. Plate + caption.

21st hero library (what we took, by entry): Editorial Hero 19075 / Editorial
Image Hero 19077 (tagline left, headline right, full-width plate below);
Text Reveal (Mask) 19257 (lines rise into masks); Tilt Card 12246 (objects
lean toward the pointer with a spotlight); Bento Grid 9594 (a grid of
unequal glass tiles); Bold Stats 18908 (one headline value, huge); Glass
Nav 15025 (floating glass pill); Marquee 1593 (a slow ticker band); Editorial
footers (oversized wordmark, colophon). Full code for 19075 and 19077 is in
`docs/v4/refs/21st/`; the rest are structural ideas, read from their public
preview cards only.

Translate, never transplant:

1. **Every section is a frame.** Desktop sections are min-height 80vh (the
   hero is 100vh) and their copy sits at the optical centre of the frame,
   not at the top of a stack. Phones keep natural height.
2. **Every h2 is an editorial line with one italic word in deep iris.**
   `<h2 className="t-h2"><RevealLines lines={[<>Risk is not the <em>price</em>,</>, "it is the product."]}/></h2>`
   with `em{font-style:italic;color:var(--color-accent-deep-iris)}`. Pick
   the operative word; do not italicise two per line.
3. **A ground behind the copy.** Each section draws a soft ground: the iris
   wash (`radial-gradient` of `--color-accent-pale-iris` at ≤ .34 alpha over
   paper), the grain (copy the hero's GRAIN data-URI), or a `YieldSurface`
   plate (`mode="wire"` at low opacity, `static` on inner pages). No stock
   imagery. Never a photo we do not own.
4. **Objects float.** Cards are `<Glass>` panes wrapped in `<Tilt>`; pills
   are `border-radius:999px`. Cards never carry a shadow.
5. **Motion is the hero's motion.** Fade-rise on load in stagger tiers,
   RevealLines on headlines, scroll-driven parallax between ground and copy
   only inside `@supports (animation-timeline: scroll())`, everything off
   under reduced motion, every value from `--dur-*`/`--stagger`/`--ease`.
6. **Captions on the foot.** A section's standing facts / source / date go
   in one `.t-caption` line at its foot, the way a plate carries its caption.
7. **Colour is rationed:** deep iris for italic words and one accent line;
   the pale iris haze as ground; the six tiles in Strategies; ORCHID BLOOM
   (`--color-accent-orchid-bloom` #dd90d8) is the pink, and it belongs to the
   footer plate (and nowhere else new).
8. **Words are frozen.** Copy comes from `src/config`, `src/content`, and the
   existing components. A null field renders nothing. No em-dashes anywhere
   in copy. No numbers that are not already in config or public data. Run
   the regime check (`scripts/qa/regime.ts`) before you commit.

## Shared primitives (already on `v4/every-screen`, import them)

- `@/components/ui/RevealLines` — masked line reveal, server, CSS only.
- `@/components/ui/Tilt` — pointer tilt + spotlight vars, client, off on touch.
- `@/components/ui/Glass` — the glass pane.
- `@/components/ui/Reveal` — the existing one-shot fade tier.
- `@/components/viz/YieldSurface` — `mode="wire" | "chart" | "painted"`, `static`.

## Assignments (files per OWNERSHIP.md; two agents never share a file)

- **chrome** — Nav: the glass pill on EVERY route (inner routes lose the plain
  bar), transparent until 8px scroll. Footer: the pink plate — full-bleed
  orchid-bloom ground (a gradient from `#dd90d8` to a paler mix with paper
  at the top edge so it grows out of the page), the oversized GC2 wordmark
  in ink, the italic tagline line, the link table as a glass pane, the
  SessionClock and city as the caption; it must screenshot well on a phone.
  Favicon: new mark replacing the paper "G" — a rounded-square tile in deep
  iris with the "G" in DM Serif italic in paper, plus the same mark in the
  orchid pink for the apple-touch icon; regenerate favicon.ico / png set /
  icon.svg / manifest (chrome owns them for this round).
- **framework** — Feature + Statement + FactsRow: the thesis frame. One
  giant italic Statement across the frame on an iris ground, the two cards
  (Risk / Correlated) as tilting glass panes beside/below it.
- **strategies** — home Strategies + /strategies: the six tiles as Aethera
  frames: each tile full-bleed in its colour with the editorial line, the
  pinned deck kept on ≥768; /strategies chapters get RevealLines and a
  foot caption; ECB grid stays.
- **approach** — Approach + /governance: the four stages as a sticky
  chapter sequence, huge serif numerals, glass stage cards that tilt.
- **insights** — Insights + /insights + article: Editorial Image Hero
  structure on /insights (tagline left, headline right, a static wire
  YieldSurface plate below); article titles with RevealLines; the reading
  column untouched in measure.
- **allocators** — ForAllocators + partnership/diligence/questions/access/
  letters: the eight questions as a bento of glass tiles that tilt; inner
  page headers in the Editorial Hero structure.
- **firm** — PageHeader becomes the Editorial Hero structure for every
  inner route that uses it; /firm, /team, /contact rebuilt in the language;
  ContactBand as a floating glass plate on an iris ground with pill actions.
- **legal** — /legal, /disclosures, /tearsheet, 404: editorial headers,
  the 404 gets a static wire plate; print block untouched.
- **motion** — OG/twitter images regenerated for the new hero (the chart
  beside the words), share kit rerun, `scripts/qa/sources.ts` still green;
  plus a `YieldSurface` `mode="wire"` `static` path that costs no rAF.

## How each agent works

1. `cd ~/gc2-wt/<name>` (branch `v4/sec-<name>`, already synced to
   `v4/every-screen`). Dev server: `npm run dev -- -p <port>` (chrome 3101,
   framework 3103, strategies 3104, approach 3105, insights 3106,
   allocators 3107, firm 3108, legal 3109, motion 3110). Kill by PORT only.
2. Read this file, DESIGN.md, your own files, and `docs/v4/refs/21st/*.md`.
3. Build. `npx tsc --noEmit -p .` must pass.
4. Screenshot with gstack browse (never the Chrome MCP):
   `B=~/.claude/skills/gstack/browse/dist/browse; $B viewport 1440x900; $B goto http://localhost:<port>/<route>; $B screenshot docs/v4/shots/t1-<name>/<route>--1440.png` and the same at `393x852`. Look at them (Read the PNG). Fix what you see.
5. `git config user.email natnaelsolomon0101@gmail.com; git config user.name "Natnael Solomon"`, commit on your branch with a message that says what changed and why, `git push origin v4/sec-<name>`.
6. Report: what you built, the shots' paths, anything you could not do and why. Do not merge; the Conductor merges.
