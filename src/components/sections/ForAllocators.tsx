import Link from "next/link";
import { allocatorNav } from "@/config/nav";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import RevealLines from "@/components/ui/RevealLines";

/**
 * FOR ALLOCATORS — the home page's route into the eight allocator pages, as
 * a bento (21st "Bento Grid" idea, 9594): eight <Glass> tiles of unequal
 * spans on a 12-column grid at >=1024 (two wide across the top, two tall on
 * the flanks, four narrow in the middle 2x2), each wrapped in <Tilt> so it
 * leans toward the pointer. Two columns on tablets, one on phones — the
 * unequal spans are a >=1024 idea; a tile is not worth forcing into an
 * unequal span at 375px wide.
 *
 * Those pages existed for a while reachable only from the footer, which meant
 * the reader who most needed them was the one least likely to find them. This
 * band is the index: one tile per page, each carrying the single question
 * that page actually answers as an editorial line (one italic word, deep
 * iris — DESIGN.md's chromatic-tiles table: the one accent that passes as
 * text on paper) and the page name as a caption underneath, the way a plate
 * carries a caption.
 *
 * The rows are DERIVED from `allocatorNav` rather than listed again here, and
 * `assertRowsMatchNav()` throws at module load if the two ever diverge. A
 * hand-kept second list is how a nav entry ends up with no tile, or a tile
 * ends up pointing at a route that no longer exists — the same class of
 * silent drift the kill list and the regime gate exist to catch.
 *
 * Nothing below is a claim about the fund. Every line describes what its page
 * discusses, and every one of those pages renders nothing where `fund.ts` is
 * null. The full answer (`a`) is still in the DOM as an sr-only elaboration
 * of the link, so nothing is deleted — it is repositioned off the visible
 * tile, which now carries only the question and the page name per this
 * round's brief.
 */
const COPY: Record<string, { q: string; w: string; a: string }> = {
  "/team": {
    q: "Who is actually running this?",
    w: "running",
    a: "The seats that exist, what each one holds, and what to demand of a biography.",
  },
  "/partnership": {
    q: "How can a family hold capital here?",
    w: "capital",
    a: "Three structures, what alignment means in each, and how a relationship starts.",
  },
  "/diligence": {
    q: "What will you show me, and when?",
    w: "show",
    a: "The document index, what is released on request, and how operations run.",
  },
  "/governance": {
    q: "Who can stop a position?",
    w: "stop",
    a: "Five decisions and who holds each. Risk reports outside the desk.",
  },
  "/letters": {
    q: "What do you write to investors?",
    w: "write",
    a: "What a letter contains, and why none of them sits on a public page.",
  },
  "/tearsheet": {
    q: "Where are the numbers?",
    w: "numbers",
    a: "What a tearsheet carries, what to refuse to accept one without, and why this is not one.",
  },
  "/questions": {
    q: "What should I be asking?",
    w: "asking",
    a: "The hard questions an allocator asks an emerging manager, answered before they are asked.",
  },
  "/access": {
    q: "How do I actually start?",
    w: "start",
    a: "No form and no download. The reason for that, and the address.",
  },
};

/** Fails the build if a nav entry has no row, or a row points nowhere. */
function assertRowsMatchNav(): void {
  const hrefs = allocatorNav.map((n) => n.href);
  for (const href of hrefs) {
    if (!COPY[href]) {
      throw new Error(
        `ForAllocators: allocatorNav has "${href}" but no row copy. Add it to COPY ` +
          `or the home page will silently drop a page an allocator needs.`
      );
    }
  }
  for (const href of Object.keys(COPY)) {
    if (!hrefs.includes(href as (typeof hrefs)[number])) {
      throw new Error(
        `ForAllocators: COPY has a row for "${href}" but allocatorNav does not ` +
          `list it. The row would link to a route nothing else knows about.`
      );
    }
  }
}
assertRowsMatchNav();

/* The headline counts the tiles rather than asserting a number. "Eight pages"
   beside a grid of seven is the kind of small lie nobody edits out, because
   the sentence was true when it was written. `cap` capitalizes the word in
   source rather than leaning on a `first-letter:uppercase` CSS mask, so the
   string is correct sentence case wherever it is read — in the DOM, in a
   screen reader, in view-source. */
const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven",
               "eight", "nine", "ten", "eleven", "twelve"] as const;
function count(n: number, cap = false): string {
  const w = WORDS[n] ?? String(n);
  return cap ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}

/* Wraps the FIRST whole-word occurrence of `word` in `text` with <em>. Falls
   back to the plain string if the word is not found, rather than throwing —
   a typo in `w` should degrade to un-emphasized copy, not a broken build. */
function emphasize(text: string, word: string): React.ReactNode {
  const re = new RegExp(`\\b${word}\\b`);
  const m = re.exec(text);
  if (!m) return text;
  const i = m.index;
  return (
    <>
      {text.slice(0, i)}
      <em>{text.slice(i, i + word.length)}</em>
      {text.slice(i + word.length)}
    </>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      className="shrink-0 transition-transform duration-[var(--dur-fast)] ease-[var(--ease)] group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/* The GRAIN texture, copied verbatim from HeroV2 (TRANSFORM.md rule 3: "the
   grain (copy the hero's GRAIN data-URI)") rather than re-derived, so the
   noise reads as the same material wherever it appears on the site. */
const GRAIN =
  "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch' result='t'/>" +
  "<feColorMatrix in='t' type='matrix' values='0 0 0 0 .078 0 0 0 0 .075 0 0 0 0 .067 .42 .42 .42 0 -.60'/>" +
  "</filter><rect width='140' height='140' filter='url(#g)'/></svg>";
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN)}")`;

/* ---------------------------------------------------------------------------
   The frame. Desktop (>=1024) is 80vh (DESIGN's "every section is a frame"),
   centred vertically; phones keep natural height (TRANSFORM.md rule 1).

   THE BENTO. 12 columns, 3 rows, at >=1024:
     row 1  — two WIDE tiles,  6 cols each                         (t1, t2)
     rows 2-3, flanks — two TALL tiles, 3 cols, spanning both rows (t3, t4)
     rows 2-3, centre — four NARROW tiles, 3 cols x 1 row, a 2x2   (t5-t8)
   768-1023 is a plain 2-column grid (auto-placed, no unequal spans — the
   bento idea is a >=1024 composition). Below 768, one column.
   ------------------------------------------------------------------------ */
const CSS = `
.fa-frame{ position:relative; isolation:isolate; overflow:hidden; background:var(--color-ground); }
@media (min-width:1024px){ .fa-frame{ min-height:80vh; } }

.fa-bg{ position:absolute; inset:0; pointer-events:none; contain:layout paint style; }
.fa-wash{ position:absolute; inset:0;
  background:
    radial-gradient(65% 55% at 50% 0%, rgba(209,201,255,.30) 0%, rgba(209,201,255,.10) 45%, rgba(247,245,240,0) 75%),
    radial-gradient(80% 55% at 50% 100%, rgba(209,201,255,.18) 0%, rgba(247,245,240,0) 70%);
}
.fa-grain{ position:absolute; inset:0; background-image:${GRAIN_URL}; background-size:140px 140px; opacity:.22; }

.fa-inner{ position:relative; z-index:1; }
@media (min-width:1024px){
  .fa-inner{ min-height:80vh; display:flex; flex-direction:column; justify-content:center; }
  /* .wrap's margin-inline:auto centers it in normal block flow everywhere
     else on the site; as a flex child that same auto margin absorbs the
     cross-axis free space instead of letting align-items:stretch fill it,
     which collapsed the column to its padding-only min-content width (48px,
     measured). An explicit width:100% removes the free space the auto
     margins would otherwise eat, so .wrap goes back to behaving like block
     layout: full width, capped by its own max-width, centered by the same
     auto margins. */
  .fa-inner > .wrap{ width:100%; }
}

.fa-head em{ font-style:italic; color:var(--color-accent-deep-iris); }

.fa-bento{ list-style:none; margin:0; padding:0; display:grid; gap:16px; grid-template-columns:1fr; }
@media (min-width:768px){
  .fa-bento{ grid-template-columns:repeat(2,1fr); gap:18px; }
}
@media (min-width:1024px){
  .fa-bento{
    grid-template-columns:repeat(12,minmax(0,1fr));
    grid-template-rows:repeat(3,minmax(150px,1fr));
    gap:20px;
  }
  .fa-t1{ grid-column:1 / 7;   grid-row:1 / 2; }
  .fa-t2{ grid-column:7 / 13;  grid-row:1 / 2; }
  .fa-t3{ grid-column:1 / 4;   grid-row:2 / 4; }
  .fa-t4{ grid-column:10 / 13; grid-row:2 / 4; }
  .fa-t5{ grid-column:4 / 7;   grid-row:2 / 3; }
  .fa-t6{ grid-column:7 / 10;  grid-row:2 / 3; }
  .fa-t7{ grid-column:4 / 7;   grid-row:3 / 4; }
  .fa-t8{ grid-column:7 / 10;  grid-row:3 / 4; }
}

.fa-tile{ display:block; height:100%; }
.fa-card{ height:100%; }
.fa-card-link{ display:flex; height:100%; flex-direction:column; justify-content:space-between;
  padding:22px; color:inherit; }
@media (min-width:768px){ .fa-card-link{ padding:26px; } }

.fa-q{ display:block; font-family:var(--font-display); font-weight:400;
  font-size:17px; line-height:1.25; letter-spacing:-.01em; color:var(--color-ink); }
.fa-q em{ font-style:italic; color:var(--color-accent-deep-iris); }
@media (min-width:1024px){
  .fa-t1 .fa-q, .fa-t2 .fa-q{ font-size:clamp(20px, 1.7vw, 27px); }
  .fa-t3 .fa-q, .fa-t4 .fa-q{ font-size:19px; }
}

.fa-cap{ display:flex; align-items:center; gap:8px; margin-top:18px; color:var(--color-ink-3); }

/* Cards never carry a shadow (DESIGN.md principle 4) — <Glass> already
   supplies the depth cue (blur + hairline ring). Tilt supplies the lean. */
@media (hover:hover) and (pointer:fine){
  .fa-card-link:hover .fa-q{ color:var(--color-ink); }
}
`;

export default function ForAllocators() {
  const n = allocatorNav.length;
  return (
    <section className="fa-frame" aria-labelledby="allocators-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="fa-bg" aria-hidden="true">
        <div className="fa-wash" />
        <div className="fa-grain" />
      </div>

      <div className="fa-inner">
        <div className="wrap band">
          <div className="max-w-[46em]">
            <p className="t-mono">For allocators</p>
            <RevealLines
              as="h2"
              id="allocators-title"
              className="fa-head t-display-sm mt-5"
              lines={[
                <>{count(n, true)} pages,</>,
                <>{count(n)} <em>questions</em>.</>,
              ]}
            />
            <p className="t-sub mt-7 max-w-[34ch] text-ink-2">
              Written to be read before a first conversation rather than sent after
              one. Where a fact is not yet published, the page says so instead of
              filling the space.
            </p>
          </div>

          <ul className="fa-bento mt-12 md:mt-16">
            {allocatorNav.map((navItem, i) => {
              const row = COPY[navItem.href];
              return (
                <Tilt key={navItem.href} as="li" max={5} className={`fa-tile fa-t${i + 1}`}>
                  <Glass as="div" radius={20} className="fa-card">
                    <Link href={navItem.href} className="fa-card-link group">
                      <span className="fa-q">{emphasize(row.q, row.w)}</span>
                      <span className="sr-only">{row.a}</span>
                      <span className="fa-cap">
                        <span className="t-mono-xs">{navItem.label}</span>
                        <Arrow />
                      </span>
                    </Link>
                  </Glass>
                </Tilt>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
