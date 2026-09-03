"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Strategy } from "@/content/strategies";

/* ===========================================================================
   PinnedStrategies — the sliding/fanning tile deck, back by owner's request.

   Round 0 replaced this with six hairline rows because the original (see
   `git show redesign/origin-100k:src/components/sections/Strategies.tsx`,
   the last dark version) had two real problems on top of being dark:
   line-clamped tile bodies the matrix's clipped-text check correctly failed,
   and — Nate's own complaint in BUILD100K.md — "~950px of dead black
   mid-page" from a `height:100vh` sticky panel that stayed that tall
   regardless of what the deck itself needed.

   Nate wants the deck back. Rebuilt here rather than restored verbatim:

   1. NO DEAD GROUND. The old panel was `height:100vh` with `overflow:hidden`
      and `align-items:center` — a fixed box the deck floated inside,
      centered, whatever its own height. Here the panel has no height rule at
      all: it is `position:sticky` and sized by its own content (the deck),
      full stop. A `.stx-spacer` sibling inside the track supplies the scroll
      travel instead of an oversized panel, so "how tall the pin feels" and
      "how tall the deck is" are no longer the same number, and there is
      nothing to be dead.

   2. NO CLIPPING. The old collapsed tile bodies stayed in the DOM at real
      size with `opacity:0` inside an `overflow:hidden` tile — invisible, but
      still a text node whose rendered rect exceeds its clipping ancestor's,
      which is exactly what `scripts/qa/matrix.ts`'s clipped-text check
      looks for regardless of opacity. Collapsed bodies here carry the native
      `hidden` attribute instead: the browser removes them from layout
      entirely (a 0×0 rect), which the check already excludes by its own
      logic, and which is also the more honest semantics — a closed
      accordion panel, not a mis-sized card. The tile's own height transition
      still does the visual work of the collapse.

   3. PHONE, ON OWNER'S LATER INSTRUCTION. Shipped >=768px only at first —
      the four-viewport phone cost that justified round 0's rewrite never
      applied there. Nate then asked for the deck on phones too. Phone gets
      its own (smaller) --tile-h/--step/--expanded tier, tuned so the whole
      pinned panel — all six tiles, one expanded, name/one-liner/markets/
      instruments fully readable — fits inside one 393x852 screen under the
      nav, and the total scroll track stays under ~2.5 viewport heights.
      Landscape phones (short viewports, no room to pin a panel at all) and
      `prefers-reduced-motion: reduce` both get the static grid instead —
      see the mode effect below.

   Track height, sticky offset, tile height, expand height and gap are pure
   CSS custom properties — see the block comment above the CSS template
   below for the exact numbers and why.

   Mode is resolved client-side: `static` is the SSR/no-JS default and what
   `prefers-reduced-motion: reduce` OR a short (landscape-phone) viewport
   always get — all six tiles simultaneously expanded in a plain grid,
   nothing pinned, nothing to scroll-jack. `pinned` is what a mounted,
   motion-allowed, tall-enough client upgrades to.
   ========================================================================= */

/** `dark` marks the one tile (deep-iris) whose fill is dark enough that its
    paired foreground is `ground`, not `ink` — see the print handling below. */
type Tile = { bg: string; fg: string; dark?: boolean };

/** Index-matched to `strategies`. Reads the paired accent/-fg tokens
    DESIGN.md defines and Tile.tsx already asserts >=4.5:1 for — no hex here,
    so there is nothing for this file to drift out of sync with that table. */
const tiles: Tile[] = [
  { bg: "var(--color-accent-iris-gleam)", fg: "var(--color-accent-iris-gleam-fg)" },
  { bg: "var(--color-accent-cyan-signal)", fg: "var(--color-accent-cyan-signal-fg)" },
  { bg: "var(--color-accent-pale-iris)", fg: "var(--color-accent-pale-iris-fg)" },
  { bg: "var(--color-accent-deep-iris)", fg: "var(--color-accent-deep-iris-fg)", dark: true },
  { bg: "var(--color-accent-orchid-bloom)", fg: "var(--color-accent-orchid-bloom-fg)" },
  { bg: "var(--color-accent-periwinkle)", fg: "var(--color-accent-periwinkle-fg)" },
];

type Mode = "static" | "pinned";

const css = `
/* --body-h holds the currently-open tile's measured content height (see the
   measure effect below) and drives both the active tile's own height and
   every later tile's stacked offset. Registering it lets height and the
   translateY() offsets that reference it in a calc() interpolate smoothly
   when it changes -- an unregistered custom property is an opaque token to
   the animation engine, so a calc() built from one jumps instead of
   transitioning even though the transition is declared on the CSS property
   that consumes it. */
@property --body-h {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}

.stx-pin {
  /* Collapsed tile height / step between collapsed tiles / tile inner
     padding. --overlap is how far the next tile rides up onto the open
     one's bottom edge -- the fan. The active tile's own height is
     tile-h + the measured --body-h (see the JS measure effect below), not
     a fixed per-breakpoint number: a fixed height sized for the longest
     one-liner left a block of empty tile above MARKETS/INSTRUMENTS on every
     shorter one, so the height now matches whichever strategy is actually
     open.

     Phone (base, mobile-first): the tile is much narrower here (max-width
     is a cap, and the actual width is the phone's own content column, ~270-
     380px) than at 768px and up, so the one-liner and the Markets/
     Instruments pair wrap to more lines. --tile-h is 58px, not 44 or 48: at
     320-375px the two longest names ("Volatility Arbitrage", "Statistical
     Relative Value") wrap to two lines at 53px -- measured with Playwright,
     same as --expanded used to be -- and 58 gives that a few px of air
     rather than sitting flush. Still comfortably a >=44px tap target. */
  --tile-h: 58px;
  --step: 48px;
  --overlap: calc(var(--tile-h) - var(--step));
  --pad-x: 20px;
  max-width: 640px;
}
@media (min-width: 768px) {
  .stx-pin { --tile-h: 72px; --step: 60px; --pad-x: 28px; }
}
@media (min-width: 1280px) {
  .stx-pin { --tile-h: 80px; --step: 66px; --pad-x: 32px; }
}

/* contain:layout paint scopes layout and paint invalidation to the track
   itself -- the browser does not have to check ancestors/siblings when the
   deck's own height changes (every tile switch) or repaint outside this
   box, which is most of what the scroll handler's per-frame state update
   triggers. Left off content/size (not "strict") on purpose: the track's
   own height is intrinsic (deck height + spacer) and has to keep affecting
   normal document flow for the sticky panel and the page below it to sit
   where they should -- this is a paint/layout-invalidation boundary, not a
   fixed-size box. */
.stx-track { position: relative; contain: layout paint; }
/* No height rule on the panel. It is exactly as tall as .stx-deck, which is
   exactly as tall as (N-1) steps plus one expanded tile -- content decides,
   not a vh guess. The spacer below supplies scroll travel. */
.stx--pinned .stx-panel {
  position: sticky; top: calc(var(--nav-h) + 24px);
}
/* Travel is deliberately short -- six ticks in well under one viewport of
   extra scroll, not the 140vh (six ticks of ~187px each) the recovered
   version used. That is "keep it tight": the reader needing six modest
   flicks of the wheel instead of a slow multi-screen crawl. Phone gets an
   even shorter spacer: the deck itself is shorter too (a smaller --tile-h/
   --step/--expanded tier), and the owner's ~2.5-viewport ceiling on total
   scroll travel at 393x852 is tighter than desktop's budget. */
.stx--pinned .stx-spacer { height: 45vh; }
@media (min-width: 768px) {
  .stx--pinned .stx-spacer { height: 70vh; }
}
.stx--static .stx-spacer { display: none; }

.stx-deck { position: relative; }
.stx--pinned .stx-deck {
  height: calc(5 * var(--step) + var(--tile-h) + var(--body-h));
}

/* overflow:hidden lives on .stx-body, not here. A collapsed tile's own
   target height is a fixed --tile-h, but its title can run to two lines at
   the longest strategy names ("Volatility Arbitrage", "Statistical Relative
   Value") on the narrowest phones -- clipping the whole article would clip
   that second line, which is exactly the failure the matrix's clipped-text
   check exists to catch. The head is never the thing that needs to shrink;
   only the body region does, to produce the collapse. */
.stx-tile {
  border-radius: var(--radius-tile, 30px);
  display: flex; flex-direction: column;
}
.stx--pinned .stx-tile {
  position: absolute; inset-inline: 0; top: 0; height: var(--tile-h);
  transition: transform var(--dur-base) var(--ease), height var(--dur-base) var(--ease);
}
/* will-change is set here, not as a blanket rule on .stx-tile: a first pass
   did that and measured WORSE under CPU throttling (TBT went from ~15ms to
   ~120ms) -- six chromatic tiles permanently promoted to their own
   compositor layer for as long as the deck is pinned costs more than it
   saves, since most of that time nothing is moving. The JS below toggles
   this class for the duration of an actual transform transition only
   (transitionrun -> transitionend/transitioncancel on the transform
   property specifically), via the browser's own transition events rather
   than a timer guessing at 500ms. */
.stx-transforming { will-change: transform; }
.stx--pinned .stx-tile[data-active="true"] { height: calc(var(--tile-h) + var(--body-h)); }

.stx-head {
  display: flex; align-items: center; gap: 18px; width: 100%; text-align: left;
  min-height: var(--tile-h); flex: none; padding-inline: var(--pad-x);
  color: inherit; border-radius: var(--radius-tile, 30px);
}
button.stx-head { cursor: pointer; }
.stx-name { flex: 1; }
.stx-mark { position: relative; width: 15px; height: 15px; flex: none; opacity: .82; }
.stx-mark::before, .stx-mark::after {
  content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1.5px;
  background: currentColor; transform: translateY(-50%);
}
.stx-mark::after { transform: translateY(-50%) rotate(90deg); transition: transform var(--dur-fast) var(--ease); }
.stx-tile[data-active="true"] .stx-mark::after { transform: translateY(-50%) rotate(0deg); }

@media (hover: hover) and (pointer: fine) {
  .stx-tile[data-active="false"] button.stx-head:hover { box-shadow: inset 0 0 0 2px currentColor; }
}
button.stx-head:focus-visible {
  outline: 3px solid currentColor; outline-offset: -7px; border-radius: var(--radius-tile, 30px);
}

.stx-body {
  padding: 0 var(--pad-x) 24px;
  flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
}
/* The collapse itself: as the tile's own height animates down toward
   --tile-h, this flex item (flex:1 1 auto, min-height:0) shrinks first and
   its own overflow:hidden clips its content -- the head, a flex:none
   sibling that is never asked to shrink, is untouched regardless of what
   the tile's overall height is doing. */
.stx--pinned .stx-body { padding-bottom: calc(24px + var(--overlap)); overflow: hidden; }
.stx-one, .stx-rule, .stx-meta { flex: none; }
.stx-one { max-width: 32em; margin-bottom: 16px; }
.stx-rule { height: 1px; background: currentColor; opacity: .3; margin: auto 0 14px; }
.stx-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin: 0; }
.stx-meta dd { margin: 0; }
.stx-tile .t-mono-xs, .stx-tile .t-small, .stx-tile .t-sub, .stx-tile .t-heading-sm,
.stx-tile dt, .stx-tile dd { color: inherit; }
/* No opacity here. It used to be .82, diluting the tile's own paired -fg
   token toward the fill colour to read as "muted" -- axe caught what that
   actually does: on iris-gleam (the lowest-contrast pairing of the six at
   5.62:1 full-strength) it measured 4.43:1, under the 4.5 floor. dt/dd
   already read as label/value from .t-mono-xs's tracking and size alone;
   full -fg strength for every tile text node, always, is the rule now. */
.stx-muted { opacity: 1; }

/* ---- static: reduced motion, no JS, and the server render --------------- */
.stx--static .stx-deck { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 640px) {
  .stx--static .stx-deck { grid-template-columns: repeat(2, 1fr); }
}
.stx--static .stx-tile { position: relative; height: auto; }
.stx--static .stx-head { padding-top: 24px; }
.stx--static .stx-body { padding-bottom: 24px; }
.stx--static .stx-mark { display: none; }

@media (prefers-reduced-motion: reduce) {
  .stx-tile, .stx-mark::after { transition: none !important; }
}

/* Print: the pin releases (globals.css's frozen print block already does
   this for .stx--pinned's track/panel/deck once that exact class is on an
   ancestor, which .stx--pinned supplies), but three things it does not
   and cannot know about this rebuild still need handling here: the spacer
   would otherwise print as blank space, .stx-tile's own fixed height/
   overflow still clips every collapsed tile even after position goes
   static, collapsed bodies use the hidden attribute now rather than
   opacity:0 (which the global rule's opacity/transform reset has no power
   over), and the deep-iris tile's ground-token text (set inline, from the
   accent-fg token, not through a text-ground class) is invisible once
   PAPER mode drops every background: the global bridge rule that would
   normally catch a text-ground class is a class selector and never matches
   an inline style, so it needs its own rule here, keyed off data-tone. */
@media print {
  .stx-spacer { display: none !important; }
  .stx-tile { height: auto !important; overflow: visible !important; }
  .stx-body[hidden] { display: flex !important; }
  .stx-tile[data-tone="dark"], .stx-tile[data-tone="dark"] * { color: var(--color-ink) !important; }
}
`;

export default function PinnedStrategies({ strategies }: { strategies: Strategy[] }) {
  const uid = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  /* The scroll handler used to call panel.getBoundingClientRect() on every
     frame just to read a height that only ever changes on resize or when
     the open tile's content height changes -- a layout read the hot path
     does not need. Cached here instead, refreshed by the effect below. */
  const panelHRef = useRef(0);
  const deckRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [i, setI] = useState(0);
  const [bodyH, setBodyH] = useState(0);
  const N = strategies.length;

  /* The open tile's height used to be a fixed per-breakpoint number sized
     for the longest one-liner in the set, which left a block of empty tile
     above MARKETS/INSTRUMENTS on every shorter one. Measuring instead:
     bodyRef always points at the active tile's body (the only one rendered
     without `hidden`), and its scrollHeight is the content's real height
     regardless of whatever height the tile currently has -- unaffected by
     the tile's own overflow:hidden, which clips paint, not layout. Runs in
     a layout effect (before paint) so a tile switch never shows a frame at
     the wrong size, and on resize, since word-wrap -- and so content
     height -- changes with tile width. */
  useLayoutEffect(() => {
    if (mode !== "pinned") return;
    const measure = () => {
      const h = bodyRef.current?.scrollHeight;
      if (h) setBodyH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mode, i, strategies]);

  /* Refreshes the cached panel height the scroll handler reads instead of
     measuring. Depends on bodyH, not just mode: the panel's real height
     only settles to its new value once the active tile's height CSS has
     actually updated to match a freshly-measured --body-h, which is this
     same state one render later than the effect above. */
  useLayoutEffect(() => {
    if (mode !== "pinned") return;
    const measure = () => {
      const panel = trackRef.current?.firstElementChild as HTMLElement | null;
      if (panel) panelHRef.current = panel.getBoundingClientRect().height;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mode, bodyH]);

  /* will-change:transform lives on a class, .stx-transforming, added to a
     tile only while its own transform is actually mid-transition and
     removed the instant it ends -- transitionrun/transitionend/
     transitioncancel on the transform property, delegated from the deck so
     one listener covers all six tiles. See the CSS comment above
     .stx-transforming for why this replaced a blanket always-on rule. */
  useEffect(() => {
    if (mode !== "pinned") return;
    const deck = deckRef.current;
    if (!deck) return;
    const onRun = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && e.target instanceof HTMLElement) {
        e.target.classList.add("stx-transforming");
      }
    };
    const onDone = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && e.target instanceof HTMLElement) {
        e.target.classList.remove("stx-transforming");
      }
    };
    deck.addEventListener("transitionrun", onRun);
    deck.addEventListener("transitionend", onDone);
    deck.addEventListener("transitioncancel", onDone);
    return () => {
      deck.removeEventListener("transitionrun", onRun);
      deck.removeEventListener("transitionend", onDone);
      deck.removeEventListener("transitioncancel", onDone);
    };
  }, [mode]);

  /* Mode is resolved after mount so the server render -- and any client with
     JS off -- gets the fully readable static grid rather than a dead pin.
     Two conditions force the static grid: reduced motion, and a short
     viewport (landscape phone -- 734x393 / 852x393 are the owner's named
     examples) that has no room to pin a panel in at all. 500px clears both
     examples (393px tall) while sparing every portrait phone in the matrix
     (568px and up) and any laptop window worth calling tall. */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const short = window.matchMedia("(max-height: 500px)");
    const apply = () => setMode(reduce.matches || short.matches ? "static" : "pinned");
    apply();
    reduce.addEventListener("change", apply);
    short.addEventListener("change", apply);
    return () => {
      reduce.removeEventListener("change", apply);
      short.removeEventListener("change", apply);
    };
  }, []);

  /* One rAF-throttled passive scroll listener, only while pinned. The only
     layout read on the hot path is el.getBoundingClientRect() -- the one
     number (the track's position) that can only ever come from a fresh
     read on a scroll event; the panel height it also needs comes from the
     cache above instead of a second per-frame measurement. */
  useEffect(() => {
    if (mode !== "pinned") return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const panelH = panelHRef.current || window.innerHeight;
      const total = r.height - panelH;
      if (total <= 0) return;
      const p = Math.min(Math.max(-r.top / total, 0), 0.9999);
      setI(Math.min(N - 1, Math.floor(p * N)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode, N]);

  /* Clicking (or arrow-keying to, see the keydown handler below) a tile
     drives the page to that tile's slice of the track, so the pin and the
     selection never disagree about which strategy is open. */
  const select = useCallback((k: number) => {
    setI(k);
    if (mode !== "pinned") return;
    const el = trackRef.current;
    if (!el) return;
    const panelH = panelHRef.current || window.innerHeight;
    const total = el.getBoundingClientRect().height - panelH;
    if (total <= 0) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.round(top + total * ((k + 0.5) / N)), behavior: "smooth" });
  }, [mode, N]);

  /* Six headers behave as one arrow-key-navigable group, the same pattern
     as a tablist: Up/Left move to and open the previous tile, Down/Right
     the next, Home/End jump to the first/last, all wrapping. Only these
     four keys are handled -- everything else (Tab, Space/Enter activating
     the focused button, Space/PageDown/PageUp scrolling the page) is left
     to the browser's own default behaviour, which is exactly what keeps
     the pinned track from ever trapping keyboard scroll: nothing here
     calls preventDefault on a scroll key, only on the arrows, which do not
     scroll the page from a focused button in any browser to begin with. */
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onHeadKeyDown = useCallback((k: number, e: KeyboardEvent<HTMLButtonElement>) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (k + 1) % N;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (k - 1 + N) % N;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = N - 1;
    if (next === -1) return;
    e.preventDefault();
    select(next);
    buttonRefs.current[next]?.focus();
  }, [N, select]);

  const stacked = mode === "pinned";

  const offset = (k: number) =>
    k <= i
      ? `calc(${k} * var(--step))`
      : `calc(${k - 1} * var(--step) + var(--tile-h) + var(--body-h) - var(--overlap))`;

  return (
    <div
      className={`stx-pin stx--${mode}`}
      style={stacked ? { ["--body-h" as string]: `${bodyH}px` } : undefined}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div ref={trackRef} className="stx-track">
        <div className="stx-panel">
          <div className="stx-deck" ref={deckRef}>
            {strategies.map((s, k) => {
              const t = tiles[k];
              const active = stacked ? k === i : true;
              const pid = `${uid}-p${k}`;
              const head = (
                <>
                  <span className="t-heading-sm stx-name">{s.name}</span>
                  <span className="stx-mark" aria-hidden="true" />
                </>
              );

              return (
                <article
                  key={s.slug}
                  className="stx-tile"
                  data-active={active}
                  data-tone={t.dark ? "dark" : "light"}
                  style={{
                    background: t.bg,
                    color: t.fg,
                    ...(stacked ? { transform: `translateY(${offset(k)})`, zIndex: k + 1 } : null),
                  }}
                >
                  {stacked ? (
                    <button
                      type="button"
                      ref={(el) => { buttonRefs.current[k] = el; }}
                      className="stx-head"
                      onClick={() => select(k)}
                      onKeyDown={(e) => onHeadKeyDown(k, e)}
                      aria-expanded={active}
                      aria-controls={pid}
                    >
                      {head}
                    </button>
                  ) : (
                    <div className="stx-head">{head}</div>
                  )}

                  <div
                    id={pid}
                    className="stx-body"
                    hidden={stacked && !active}
                    ref={stacked && active ? bodyRef : undefined}
                  >
                    <p className="t-sub stx-one">{s.oneLiner}</p>
                    <div className="stx-rule" aria-hidden="true" />
                    <dl className="stx-meta">
                      <div>
                        <dt className="t-mono-xs stx-muted">Markets</dt>
                        <dd className="t-small">{s.markets}</dd>
                      </div>
                      <div>
                        <dt className="t-mono-xs stx-muted">Instruments</dt>
                        <dd className="t-small">{s.instruments}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="stx-spacer" aria-hidden="true" />
      </div>
    </div>
  );
}
