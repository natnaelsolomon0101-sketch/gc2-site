"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { strategies } from "@/content/strategies";

/* ===========================================================================
   STRATEGIES — pinned chromatic deck.

   What survives from the old PinnedStrategies: CSS `position: sticky` over a
   scroll track, one rAF-throttled scroll listener, no animation library, the
   big chromatic tile against the black, the `04 / 06` counter, the serif/mono
   type density.

   What changed, and why:

   1. The old track was `strategies.length * 100vh` = 600vh of document to read
      six lines of copy, and it paid that on phones too. The track is now 240vh
      (140vh of actual travel), and phones do not get a track at all. Same pin,
      40% of the document height.

   2. Only one strategy was ever visible. All six are now on screen at once as
      a fanned deck of chromatic cards — every name, number and colour readable
      at a glance — with the active card expanded into the full tile carrying
      one-liner, markets and instruments. Scanning the section now leaves you
      knowing there are six and what they are called; reading it leaves you
      knowing one in full.

   3. Nothing invited a click. Every card is now a real <button> with proper
      accordion semantics: click or keyboard-activate to jump the pin straight
      to that strategy. The visible slice of a collapsed card is --step, 62px
      to 84px depending on breakpoint and never below the 44px target, and it
      carries a hover ring plus a rotating +/- marker.

   Three render modes, chosen at runtime:
     static — the SSR/no-JS default, and what `prefers-reduced-motion: reduce`
              always gets: all six tiles fully expanded in a plain grid, no
              pin, no track, nothing that traps a reader who cannot scroll
              smoothly.
     deck   — under 1024px: the same fanned deck, unpinned, tap to open. About
              one viewport tall instead of six.
     pinned — 1024px and up, motion allowed: sticky panel over a 240vh track.

   Colour: foreground is per tile and is NOT uniform. White clears AA on
   exactly one of the six (deep-iris, 7.41:1); on pale-iris it is 1.55:1.
   Measured black/white ratios are on each tile below. Secondary text uses
   opacity .82, which composites against the tile's own ground — the worst
   case there is iris at 5.30:1, still past AA.
   ========================================================================= */

type Tile = { bg: string; fg: string };

/** Index-matched to `strategies`. Ratios measured against the tile ground. */
const tiles: Tile[] = [
  { bg: "#847dff", fg: "#000000" }, // iris gleam   — black 6.36:1  (white 3.30)
  { bg: "#00b3dd", fg: "#000000" }, // cyan signal  — black 8.49:1  (white 2.47)
  { bg: "#d1c9ff", fg: "#000000" }, // pale iris    — black 13.51:1 (white 1.55)
  { bg: "#4b49aa", fg: "#ffffff" }, // deep iris    — white 7.41:1  (black 2.84)
  { bg: "#dd90d8", fg: "#000000" }, // orchid bloom — black 9.06:1  (white 2.32)
  { bg: "#90b8f0", fg: "#000000" }, // periwinkle   — black 10.30:1 (white 2.04)
];

const N = strategies.length;
const pad = (n: number) => String(n).padStart(2, "0");

type Mode = "static" | "deck" | "pinned";

const css = `
.stx {
  /* Phone first. Names wrap to two lines at this width, so the collapsed card
     is taller and the cards overlap less — no name ever slides under the card
     stacked on top of it. --step is the visible height of a collapsed card and
     is the real touch target: 84px, comfortably past 44. */
  --tile-h: 96px;
  --step: 84px;
  --overlap: calc(var(--tile-h) - var(--step));
  --expanded: 352px;
  --pad-x: 24px;
  --dur: 460ms;
  --ease: cubic-bezier(.22,.61,.36,1);
}
@media (min-width: 640px) { .stx { --tile-h: 88px; --step: 70px; --expanded: 312px; --pad-x: 28px; } }
@media (min-width: 1024px) {
  .stx { --tile-h: 88px; --step: 70px; --expanded: 304px; --pad-x: 32px; }
}
@media (min-width: 1024px) and (max-height: 800px) {
  .stx { --tile-h: 78px; --step: 62px; --expanded: 272px; }
}

.stx-track { position: relative; }
.stx-panel { padding-block: 72px 88px; }
/* 240vh: 100vh of it is the panel itself, leaving 140vh of travel — about
   187px of scroll per strategy at a 800px viewport. The old track was 600vh. */
.stx--pinned .stx-track { height: 240vh; }
.stx--pinned .stx-panel {
  position: sticky; top: 0; height: 100vh;
  padding-block: var(--nav-h) 24px;
  display: flex; align-items: center; overflow: hidden;
}
.stx-inner { width: 100%; }

.stx-headrow {
  display: flex; align-items: baseline; justify-content: space-between; gap: 24px;
  border-top: 1px solid var(--color-steel); padding-top: 14px;
}
.stx-count { color: var(--color-cloud); font-variant-numeric: tabular-nums; }
.stx--static .stx-count { display: none; }

.stx-grid { display: grid; gap: 44px; margin-top: 30px; }
@media (min-width: 1024px) {
  .stx--pinned .stx-grid,
  .stx--deck   .stx-grid { grid-template-columns: 4.6fr 7fr; gap: 72px; align-items: center; }
}
.stx-lede { color: var(--color-ash); max-width: 31em; margin-top: 22px; }

.stx-meter { display: flex; gap: 6px; margin-top: 36px; max-width: 420px; }
.stx--static .stx-meter { display: none; }
.stx-seg {
  height: 3px; flex: 1; border-radius: 2px; background: var(--color-steel);
  transition: background var(--dur) var(--ease);
}
.stx-hint { color: var(--color-fog); margin-top: 16px; }

/* ---- the deck ---------------------------------------------------------- */
.stx-deck { position: relative; }
.stx--pinned .stx-deck,
.stx--deck   .stx-deck { height: calc(${N - 1} * var(--step) + var(--expanded)); }

.stx-tile { border-radius: 30px; overflow: hidden; display: flex; flex-direction: column; }
.stx--pinned .stx-tile,
.stx--deck   .stx-tile {
  position: absolute; inset-inline: 0; top: 0; height: var(--tile-h);
  box-shadow: 0 -18px 38px rgba(0,0,0,.45);
  transition: transform var(--dur) var(--ease), height var(--dur) var(--ease);
}
.stx--pinned .stx-tile[data-active="true"],
.stx--deck   .stx-tile[data-active="true"] { height: var(--expanded); }

.stx-head {
  display: flex; align-items: center; gap: 18px; width: 100%; text-align: left;
  min-height: var(--tile-h); flex: none; padding-inline: var(--pad-x);
  color: inherit; border-radius: 30px;
}
button.stx-head { cursor: pointer; }
.stx-num { opacity: .82; letter-spacing: .22em; flex: none; }
.stx-name { flex: 1; transition: transform var(--dur) var(--ease); }
.stx-mark { position: relative; width: 15px; height: 15px; flex: none; opacity: .82; }
.stx-mark::before, .stx-mark::after {
  content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1.5px;
  background: currentColor; transform: translateY(-50%);
}
.stx-mark::after { transform: translateY(-50%) rotate(90deg); transition: transform var(--dur) var(--ease); }
.stx-tile[data-active="true"] .stx-mark::after { transform: translateY(-50%) rotate(0deg); }

/* Hover and focus rings are drawn in the tile's OWN foreground colour, so they
   inherit that tile's measured contrast instead of assuming white works. */
.stx-tile[data-active="false"] button.stx-head:hover { box-shadow: inset 0 0 0 2px currentColor; }
.stx-tile[data-active="false"] button.stx-head:hover .stx-name { transform: translateX(5px); }
button.stx-head:focus-visible {
  outline: 3px solid currentColor; outline-offset: -7px; border-radius: 30px;
}

/* The open card is a fixed height so the deck geometry never jumps, and in the
   static grid a row's cards are equal height. Pinning markets/instruments to
   the bottom edge makes that height read as composition rather than as slack
   under a one-line strategy, and lines the labels up across a row. */
.stx-body {
  padding: 0 var(--pad-x) 26px;
  flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
}
/* The next card in the deck overlaps this one's bottom edge by --overlap, so
   the open card's own bottom padding has to clear it. */
.stx--pinned .stx-body,
.stx--deck   .stx-body {
  opacity: 0; transition: opacity 240ms var(--ease);
  padding-bottom: calc(26px + var(--overlap));
}
.stx-tile[data-active="true"] .stx-body { opacity: 1; }
/* flex: none — without it the body's flex context shrinks a three-line
   one-liner and the hairline is drawn straight through the last line. */
.stx-one, .stx-rule, .stx-meta { flex: none; }
.stx-one { max-width: 32em; margin-bottom: 20px; }
/* margin-top:auto pushes the rule to the card's bottom edge; the 20px above it
   lives on .stx-one so a card with no free space keeps the gap instead of
   drawing the hairline through the last line of the one-liner. */
.stx-rule { height: 1px; background: currentColor; opacity: .3; margin: auto 0 16px; }
.stx-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; margin: 0; }
.stx-meta dd { margin: 0; }

/* Globals paint .t-small / .t-mono-xs / .t-sub ash; on a chromatic tile the
   colour has to come from the tile. This block is unlayered, so it wins. */
.stx-tile .t-mono, .stx-tile .t-mono-xs, .stx-tile .t-small,
.stx-tile .t-sub, .stx-tile .t-heading-sm, .stx-tile dt, .stx-tile dd { color: inherit; }
.stx-muted { opacity: .82; }

/* ---- static: reduced motion, no JS, and the server render ---------------
   Nothing is pinned, nothing is collapsed, nothing is a control. The heading
   goes full width above a plain grid of all six tiles, so a reader who cannot
   scroll smoothly gets the entire section in one readable pass. */
.stx--static .stx-deck { display: grid; gap: 18px; }
@media (min-width: 700px)  { .stx--static .stx-deck { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1100px) { .stx--static .stx-deck { grid-template-columns: 1fr 1fr 1fr; } }
.stx--static .stx-tile { position: relative; height: auto; }
.stx--static .stx-head { padding-top: 28px; }
.stx--static .stx-body { opacity: 1; padding-bottom: 30px; }
.stx--static .stx-mark { display: none; }
.stx--static .stx-lede { margin-bottom: 6px; }

@media (prefers-reduced-motion: reduce) {
  .stx-tile, .stx-name, .stx-mark::after, .stx-seg, .stx-body { transition: none !important; }
}
`;

export default function Strategies() {
  const uid = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [i, setI] = useState(0);

  /* Mode is resolved after mount so the server render — and any client with JS
     off — gets the fully readable static grid rather than a dead pin. */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 1024px)");
    const apply = () => setMode(reduce.matches ? "static" : wide.matches ? "pinned" : "deck");
    apply();
    reduce.addEventListener("change", apply);
    wide.addEventListener("change", apply);
    return () => {
      reduce.removeEventListener("change", apply);
      wide.removeEventListener("change", apply);
    };
  }, []);

  /* One rAF-throttled passive scroll listener, only while pinned. */
  useEffect(() => {
    if (mode !== "pinned") return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
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
  }, [mode]);

  /* Clicking a card is the affordance the old list never had. While pinned it
     drives the page to that card's slice of the track, so the pin and the
     click never disagree about which strategy is open. */
  const select = useCallback((k: number) => {
    setI(k);
    if (mode !== "pinned") return;
    const el = trackRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.round(top + total * ((k + 0.5) / N)), behavior: "smooth" });
  }, [mode]);

  const stacked = mode !== "static";

  /* Cards before the open one sit on the step grid; cards after it are pushed
     down by the open card's extra height. Both branches are pure calc() so the
     sizes can stay in CSS and respond to the breakpoints above. */
  const offset = (k: number) =>
    k <= i
      ? `calc(${k} * var(--step))`
      : `calc(${k - 1} * var(--step) + var(--expanded) - var(--overlap))`;

  return (
    <section id="strategies" aria-labelledby={`${uid}-h`} className={`stx stx--${mode}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div ref={trackRef} className="stx-track">
        <div className="stx-panel">
          <div className="wrap stx-inner">
            <div className="stx-headrow">
              <p className="t-mono">Strategies</p>
              <p className="t-mono stx-count" aria-hidden="true">
                {pad(i + 1)} / {pad(N)}
              </p>
            </div>

            <div className="stx-grid">
              <div className="stx-col">
                <h2 id={`${uid}-h`} className="t-display-sm">
                  Six strategies. One risk framework.
                </h2>
                <p className="t-sub stx-lede">
                  Six separate books, each underwritten by our own research before it is
                  allowed to carry capital, and every one of them sized by the same risk
                  framework rather than by conviction.
                </p>

                <div className="stx-meter" aria-hidden="true">
                  {tiles.map((t, k) => (
                    <span
                      key={strategies[k].slug}
                      className="stx-seg"
                      style={k <= i ? { background: t.bg } : undefined}
                    />
                  ))}
                </div>

                {stacked && (
                  <p className="t-mono-xs stx-hint">
                    {mode === "pinned" ? "Scroll, or select a strategy" : "Select a strategy"}
                  </p>
                )}
              </div>

              <div className="stx-deck">
                {strategies.map((s, k) => {
                  const t = tiles[k];
                  const active = stacked ? k === i : true;
                  const pid = `${uid}-p${k}`;
                  const head = (
                    <>
                      <span className="t-mono stx-num">{pad(k + 1)}</span>
                      <span className="t-heading-sm stx-name">{s.name}</span>
                      <span className="stx-mark" aria-hidden="true" />
                    </>
                  );

                  return (
                    <article
                      key={s.slug}
                      className="stx-tile"
                      data-active={active}
                      style={{
                        background: t.bg,
                        color: t.fg,
                        ...(stacked ? { transform: `translateY(${offset(k)})`, zIndex: k + 1 } : null),
                      }}
                    >
                      {stacked ? (
                        <button
                          type="button"
                          className="stx-head"
                          onClick={() => select(k)}
                          aria-expanded={active}
                          aria-controls={pid}
                        >
                          {head}
                        </button>
                      ) : (
                        <div className="stx-head">{head}</div>
                      )}

                      <div id={pid} className="stx-body" inert={stacked && !active}>
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
          </div>
        </div>
      </div>
    </section>
  );
}
