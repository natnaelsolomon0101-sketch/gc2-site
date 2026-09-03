import Link from "next/link";
import { site } from "@/config/site";
import { nav, allocatorNav, legalNav } from "@/config/nav";
import { css } from "@/lib/css";
import Glass from "@/components/ui/Glass";
import RevealLines from "@/components/ui/RevealLines";
import SessionClock from "@/components/viz/SessionClock";

const FOOTER_GROUPS = [
  { label: "Site", items: nav },
  { label: "For allocators", items: allocatorNav },
  { label: "Legal", items: legalNav },
] as const;

/* =============================================================================
   Footer — the orchid-bloom plate.

   THE OWNER'S WORDS (4 Sep 2026): "make the bottom Instagrammable pink since
   it's female clients." So the footer is no longer a stone band with a list in
   it. It is a full-bleed plate that GROWS OUT OF THE PAGE: the ground starts at
   paper along its top edge and ripens downward through paler mixes into the
   site's own pink token, --color-accent-orchid-bloom (#dd90d8), which is solid
   by the time it reaches the oversized wordmark. There is no seam and no rule
   across the top; the page simply turns pink. TRANSFORM.md rule 7 gives orchid
   bloom to this plate and to nothing else new.

   1. COLOUR IS THE TOKEN, MIXED WITH PAPER, AND NOTHING ELSE. Every stop in the
      gradient is `color-mix(orchid-bloom N%, ground)`. No second pink, no
      invented tint. The soft light at the top right is paper at 55% over the
      same gradient, which is why it reads as the page's own light spilling in
      rather than as a new colour. The stops are front-loaded (solid pink by
      76% of the plate's height, not at its last pixel) because the plate is
      three times taller on a 393 phone than on a 1440 laptop, and a ramp
      spread over the full height left the phone reading as a pale wash with
      one pink stripe at the bottom.

   2. GRAIN, BECAUSE A 700px PINK GRADIENT BANDS. The hero's own GRAIN data-URI
      (TRANSFORM.md rule 3: "copy the hero's GRAIN data-URI"), at .2, breaks the
      8-bit steps that are plainly visible on a wide gradient of a saturated
      hue, and gives the plate the tooth that makes it read as printed rather
      than as a CSS fill.

   3. CONTRAST — MEASURED, NOT ASSUMED. On #dd90d8 (relative luminance .4028):
        ink      #141311  ->  8.01:1   PASS
        ink-2    #544e45  ->  3.55:1   FAIL
        ink-3    #67615a  ->  2.64:1   FAIL
      So EVERY piece of text sitting directly on the plate is `ink`: the italic
      line, the disclosure, the caption row, the wordmark. ink-2 and ink-3 do
      not appear on the pink at all.

      The one place they still do is INSIDE the <Glass> pane, where the
      material's paper-at-62% over the pink computes to about #edcfe7
      (luminance .682), and there ink-2 is 5.74:1 and ink is 12.9:1. The link
      list keeps its ink-2 rest state and ink hover on that pane and nowhere
      else. The pane's column heads were ink-3 (4.26:1, a fail); they are ink-2
      now.

      SessionClock tells a running session from a closed one by TONE (ink vs
      ink-3) — a distinction that cannot survive this ground, since ink-3 is the
      failing value. On the plate every row is ink and the words "In session" /
      "Closed" carry the state on their own. That was always the accessible
      signal; here it is the only one, which costs nothing a colour-blind reader
      or a printed copy did not already cost.

   4. THE LINK GRID IS A TABLE, ON A GLASS PANE. A shared hairline under every
      row and a vertical hairline between columns at >=1024, so it reads as one
      ruled object even though the three groups (4, 8, 2 items) are different
      heights — that asymmetry is real data, not a bug to hide. The pane is
      <Glass> (DESIGN principle 4: cards are glass, cards never carry a shadow),
      which is what keeps a dense list of eighteen links from turning the top of
      the plate into a wall.

   5. THE ITALIC LINE IS site.mandate, NOT A SLOGAN. Copy is frozen: the words
      are `{site.mandate}` read out of src/config/site.ts, set in the display
      face in italic — the site's one typographic move — and revealed by
      RevealLines, the same masked rise every h2 on the site uses. Nothing here
      is written; it is the mandate, enlarged.

   6. THE MARK KEEPS THE OVERFLOW CROP. It starts at the same left gutter as
      everything else and is allowed to run past the .wrap container and the
      true viewport edge — `.gc2-ftr`'s `overflow-x:hidden` is what turns "the
      browser ran out of room" into "cropped by design" instead of a horizontal
      scrollbar. Ink on solid orchid: 8.01:1, and the single loudest object on
      the page, which is the point of a plate you are meant to screenshot.

   7. THE DISCLOSURE IS `.t-small` (14px Inter, sentence case), not
      `.t-caption`: a legal paragraph run in caption's 13px uppercase mono with
      .182em tracking came out nine lines on a phone and unreadable (Conductor,
      round 1). `.t-caption` stays reserved for the short column labels and the
      caption row where an eyebrow is the point.

   Class names are prefixed `gc2-ftr-` on purpose, not just `ft-`: this file
   injects a global, unscoped <style> tag (the pattern every chrome/section
   component on this branch uses), and `Feature.tsx` (sec-framework) already
   owns a bare `.ft-link` — the collision silently painted every footer link
   black-on-black. Namespace every class this file defines.
   ========================================================================= */

/* The hero's grain, byte for byte (HeroV2.tsx). Ink-toned fractal noise at a
   low alpha; see note 2. */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

const CSS = css`
.gc2-ftr{
  position:relative; overflow-x:hidden;
  color:var(--color-ink);
  background:
    radial-gradient(110% 62% at 84% 6%,
      color-mix(in srgb, var(--color-ground) 55%, transparent) 0%,
      color-mix(in srgb, var(--color-ground) 0%, transparent) 64%),
    linear-gradient(180deg,
      var(--color-ground) 0%,
      color-mix(in srgb, var(--color-accent-orchid-bloom) 24%, var(--color-ground)) 9%,
      color-mix(in srgb, var(--color-accent-orchid-bloom) 58%, var(--color-ground)) 28%,
      color-mix(in srgb, var(--color-accent-orchid-bloom) 86%, var(--color-ground)) 55%,
      var(--color-accent-orchid-bloom) 76%);
}
.gc2-ftr-grain{
  position:absolute; inset:0; pointer-events:none;
  background-image:${GRAIN_URL}; background-size:140px 140px; opacity:.2;
}
/* .band is 80px top and bottom; the bottom 80 is replaced by 16 because the
   oversized mark below already carries all the air the plate's foot needs,
   and 80 + the mark's own leading left a visible hole between the italic
   line and the wordmark. */
.gc2-ftr-body{ position:relative; z-index:1; padding-bottom:16px; }

/* ---- the link table, on glass ------------------------------------------- */
.gc2-ftr-pane{ padding:8px 24px 24px; }
@media (min-width:768px){ .gc2-ftr-pane{ padding:12px 32px 32px; } }

.gc2-ftr-table{ display:grid; grid-template-columns:1fr; row-gap:32px; }
@media (min-width:1024px){
  .gc2-ftr-table{ grid-template-columns:repeat(3, 1fr); column-gap:48px; row-gap:0; }
  .gc2-ftr-col + .gc2-ftr-col{ border-left:1px solid var(--color-hairline); padding-left:48px; }
}
/* Capped so a stacked column (<1024, where it would otherwise run the full
   .wrap width) stays a link LIST, not an 80ch+ line. Well clear of the
   3-column widths (~300-350px there), so this is a no-op at >=1024. */
.gc2-ftr-col{ max-width:24em; }
/* ink-2, not ink-3: see note 3. 4.26:1 on the glass was a fail. */
.gc2-ftr-col-head{ padding-block:14px; color:var(--color-ink-2); }
/* THE ANCHOR HAS TO BE THE ROW. Round 2 put the padding on the <li> and left
   the <a> sized to its own line box, and the matrix went on measuring the
   anchor at 20px tall on the built site — the rect an assistive-tech user
   actually gets is the text's line box, not the padded row. min-height and
   padding both live on .gc2-ftr-link, explicit here rather than via Tailwind
   utilities, so there is exactly one place this is declared. Adjacent rows
   then touch at a shared hairline with no gap, which matrix.ts's tap-target-
   gap check exempts for stacked, >=80%-width, touching targets. */
.gc2-ftr-row{ border-top:1px solid var(--color-hairline); }
.gc2-ftr-link{
  display:flex; align-items:center; width:100%;
  min-height:44px; padding-block:4px;
  color:var(--color-ink-2);
  transition:color var(--dur-fast) var(--ease);
}
.gc2-ftr-link:hover{ color:var(--color-ink); }

/* ---- disclosure + caption row, directly on the pink --------------------- */
.gc2-ftr-disclosure{
  margin-top:48px; max-width:80ch; color:var(--color-ink);
}
.gc2-ftr-caption{
  margin-top:32px; padding-top:20px;
  border-top:1px solid var(--color-hairline-strong);
  display:flex; flex-wrap:wrap; align-items:baseline; gap:4px 28px;
}
.gc2-ftr-caption .t-caption{ color:var(--color-ink); }
/* SessionClock declares container-type: inline-size, i.e. contain:
   inline-size, which means its own inline size CANNOT come from its
   contents. As a flex item with flex-basis:auto that resolves to ZERO and
   the three columns paint straight through the copyright line beside them
   (measured: width 0, text overlapping at 1440). Every other placement on
   the site hands it a width from a block parent; this one is a flex row, so
   it states one. 15em at the caption's own 13px mono with .182em tracking
   holds "TOKYO / 00:00 / IN SESSION", the longest reading, with room. */
.gc2-ftr-clock{ flex:0 0 auto; width:15em; font-size:16px; }
.gc2-ftr-clock .sc-rows,
.gc2-ftr-clock .sc-row{ grid-template-columns:auto auto auto; justify-content:start; column-gap:14px; }
/* SessionClock's own tone scale cannot hold 4.5:1 on this ground; the state
   word carries the state instead (note 3). The selectors are deep enough to
   beat .sc-row[data-open="true"] .sc-state, which is three class-weight
   simple selectors on its own. */
.gc2-ftr-clock .sc-row .sc-city,
.gc2-ftr-clock .sc-row .sc-time,
.gc2-ftr-clock .sc-row .sc-state,
.gc2-ftr-clock .sc-row[data-open="true"] .sc-state,
.gc2-ftr-clock .sc-note{ color:var(--color-ink); }
.gc2-ftr-clock .sc-row{ min-height:28px; border-bottom-color:var(--color-hairline-strong); }
.gc2-ftr-clock .sc-note{ margin-top:6px; }

/* ---- the italic line ----------------------------------------------------- */
.gc2-ftr-line{
  margin:64px 0 0;
  font-family:var(--font-display); font-weight:400; font-style:italic;
  font-size:clamp(34px, 6.4vw, 76px); line-height:1.06;
  letter-spacing:-0.022em;
  color:var(--color-ink);
  text-wrap:balance;
}

/* ---- the mark ------------------------------------------------------------ */
/* Sized to genuinely outrun the viewport at laptop/desktop widths (it is meant
   to be cropped there, per brief) while staying comfortably inside a phone's
   viewport at the clamp floor. Tuned against real screenshots, not guessed. */
.gc2-ftr-mark{
  position:relative; z-index:1;
  display:block;
  margin-top:8px; padding-bottom:24px;
  padding-inline: max(24px, env(safe-area-inset-left));
  font-family:var(--font-display); font-weight:400;
  font-size:clamp(120px, 51vw, 210px);
  line-height:0.82;
  letter-spacing:-0.03em;
  color:var(--color-ink);
  white-space:nowrap;
  text-decoration-line:none;
}
.gc2-ftr-mark:hover{ color:var(--color-ink); }
.gc2-ftr-mark:focus-visible{
  outline:2px solid var(--color-ink); outline-offset:6px; border-radius:var(--radius-control);
}
/* The crop, stated as arithmetic rather than guessed at. DM Serif Display sets
   "GC2" at 1.711x its own font-size (measured, 1440). Below 768 the mark is
   FULL: 51vw x 1.711 = 87% of the viewport, inside the two 24px gutters. At
   768 and up it is 60vw, which puts the right edge of the "2" roughly 4% past
   the viewport, so the mark is cropped by the frame the way a plate crops a
   picture. overflow-x:hidden on .gc2-ftr is what makes that a crop instead
   of a horizontal scrollbar. */
@media (min-width:768px){ .gc2-ftr-mark{ font-size:60vw; } }

@media (prefers-reduced-motion: reduce){
  .gc2-ftr-link, .gc2-ftr-mark{ transition-duration:1ms !important; }
}

/* Print: the plate is a solid pink flood on paper and the mark is a page of
   toner. Neither belongs in a printed copy of a legal page. */
@media print{
  .gc2-ftr{ background:none !important; }
  .gc2-ftr-grain, .gc2-ftr-mark, .gc2-ftr-line{ display:none !important; }
}
`;

export default function Footer() {
  return (
    <footer className="gc2-ftr">
      <style>{CSS}</style>
      <div className="gc2-ftr-grain" aria-hidden="true" />

      <div className="wrap band gc2-ftr-body">
        <Glass
          className="gc2-ftr-pane"
          radius={20}
          /* Glass's default is paper at 62%, tuned to read as a card on plain
             paper. On this plate 62% washes the pink out of the top half of
             the footer, which is the half a phone shows first. 44% keeps the
             frosted material and lets the orchid through, and ink-2 still
             measures 5.6:1 on the result (ink-3 would be 4.19:1, which is why
             the column heads are ink-2). Glass spreads `style` last, so this
             replaces the background and keeps its blur, ring and highlight. */
          style={{ background: "color-mix(in srgb, var(--color-ground) 44%, transparent)" }}
        >
          <div className="gc2-ftr-table">
            {FOOTER_GROUPS.map((g) => (
              <nav key={g.label} aria-label={g.label} className="gc2-ftr-col">
                <p className="t-mono-xs gc2-ftr-col-head" role="heading" aria-level={2}>
                  {g.label}
                </p>
                <ul>
                  {g.items.map((n) => (
                    <li key={n.href} className="gc2-ftr-row">
                      <Link href={n.href} className="gc2-ftr-link t-small">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </Glass>

        <p className="t-small gc2-ftr-disclosure">
          {site.name} is a private investment partnership. This website is for
          informational purposes only and does not constitute an offer to sell or a
          solicitation of an offer to buy any security. Past performance is not
          indicative of future results. Interests in the fund are offered only to
          investors who meet the eligibility requirements set out in the offering
          documents.
        </p>

        {/* The caption line the way a plate carries one (TRANSFORM.md rule 6):
            city, structure, the live sessions, and the copyright, all on one
            baseline. SessionClock is the cross-section object sec-motion
            builds and this file places (OWNERSHIP.md); it renders nothing
            until hydrated and picks its own rows via a container query. */}
        <div className="gc2-ftr-caption">
          <span className="t-caption">{site.city}</span>
          <span className="t-caption">{site.structure}</span>
          <SessionClock className="gc2-ftr-clock" caption={false} rows="open" dense />
          <span className="t-caption">
            &copy; {new Date().getFullYear()} {site.name}
          </span>
        </div>

        <RevealLines as="p" className="gc2-ftr-line" lines={[site.mandate]} />
      </div>

      <Link href="/" aria-label={`${site.mark} home`} className="gc2-ftr-mark">
        {site.mark}
      </Link>
    </footer>
  );
}
