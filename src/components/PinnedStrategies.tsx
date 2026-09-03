"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
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

   3. NO PHONE. Below 768px this component is not in the layout at all
      (Strategies.tsx CSS-hides it and shows hairline rows instead) — the
      four-viewport phone cost that justified round 0's rewrite in the first
      place is gone because the deck simply never reaches a phone.

   Track height, sticky offset, tile height, expand height and gap are pure
   CSS custom properties (no vh borrowed from the old file's phone-tuned
   numbers) — see the block comment above the CSS template below for the
   exact numbers and why.

   Mode is resolved client-side, same as before: `static` is the SSR/no-JS
   default and what `prefers-reduced-motion: reduce` always gets — all six
   tiles simultaneously expanded in a plain two-column grid, nothing pinned,
   nothing to scroll-jack. `pinned` is what a mounted, motion-allowed client
   upgrades to.
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
.stx-pin {
  /* Collapsed tile height / step between collapsed tiles / active tile
     height / tile inner padding. --overlap is how far the next tile rides
     up onto the open one's bottom edge -- the fan. --expanded is measured,
     not guessed: the open tile's body (one-liner, hairline, the two-column
     Markets/Instruments pair, plus its own bottom padding) needs 134px of
     content height at the 640px tile width this component holds at every
     size it ships at (768 and up) -- verified with Playwright by comparing
     scrollHeight/clientHeight directly, not inherited from the old phone
     numbers, which were tuned for a much narrower tile. 224px leaves an
     18px margin over the 206px --tile-h(72)+134 actually needs. */
  --tile-h: 72px;
  --step: 60px;
  --overlap: calc(var(--tile-h) - var(--step));
  --expanded: 224px;
  --pad-x: 28px;
  max-width: 640px;
}
@media (min-width: 1280px) {
  .stx-pin { --tile-h: 80px; --step: 66px; --expanded: 232px; --pad-x: 32px; }
}

.stx-track { position: relative; }
/* No height rule on the panel. It is exactly as tall as .stx-deck, which is
   exactly as tall as (N-1) steps plus one expanded tile -- content decides,
   not a vh guess. The spacer below supplies scroll travel. */
.stx--pinned .stx-panel {
  position: sticky; top: calc(var(--nav-h) + 24px);
}
/* Travel is deliberately short -- six ticks in well under one viewport of
   extra scroll, not the 140vh (six ticks of ~187px each) the recovered
   version used. That is "keep it tight": the reader needing six modest
   flicks of the wheel instead of a slow multi-screen crawl. */
.stx--pinned .stx-spacer { height: 70vh; }
.stx--static .stx-spacer { display: none; }

.stx-deck { position: relative; }
.stx--pinned .stx-deck {
  height: calc(5 * var(--step) + var(--expanded));
}

.stx-tile {
  border-radius: var(--radius-tile, 30px); overflow: hidden;
  display: flex; flex-direction: column;
}
.stx--pinned .stx-tile {
  position: absolute; inset-inline: 0; top: 0; height: var(--tile-h);
  transition: transform var(--dur-base) var(--ease), height var(--dur-base) var(--ease);
}
.stx--pinned .stx-tile[data-active="true"] { height: var(--expanded); }

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
.stx--pinned .stx-body { padding-bottom: calc(24px + var(--overlap)); }
.stx-one, .stx-rule, .stx-meta { flex: none; }
.stx-one { max-width: 32em; margin-bottom: 16px; }
.stx-rule { height: 1px; background: currentColor; opacity: .3; margin: auto 0 14px; }
.stx-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin: 0; }
.stx-meta dd { margin: 0; }
.stx-tile .t-mono-xs, .stx-tile .t-small, .stx-tile .t-sub, .stx-tile .t-heading-sm,
.stx-tile dt, .stx-tile dd { color: inherit; }
.stx-muted { opacity: .82; }

/* ---- static: reduced motion, no JS, and the server render --------------- */
.stx--static .stx-deck { display: grid; gap: 16px; grid-template-columns: repeat(2, 1fr); }
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
  const [mode, setMode] = useState<Mode>("static");
  const [i, setI] = useState(0);
  const N = strategies.length;

  /* Mode is resolved after mount so the server render -- and any client with
     JS off -- gets the fully readable static grid rather than a dead pin. */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMode(reduce.matches ? "static" : "pinned");
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
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
      const panel = el.firstElementChild as HTMLElement | null;
      const panelH = panel?.getBoundingClientRect().height || window.innerHeight;
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

  /* Clicking a tile drives the page to that tile's slice of the track, so
     the pin and the click never disagree about which strategy is open. */
  const select = useCallback((k: number) => {
    setI(k);
    if (mode !== "pinned") return;
    const el = trackRef.current;
    if (!el) return;
    const panel = el.firstElementChild as HTMLElement | null;
    const panelH = panel?.getBoundingClientRect().height || window.innerHeight;
    const total = el.getBoundingClientRect().height - panelH;
    if (total <= 0) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.round(top + total * ((k + 0.5) / N)), behavior: "smooth" });
  }, [mode, N]);

  const stacked = mode === "pinned";

  const offset = (k: number) =>
    k <= i
      ? `calc(${k} * var(--step))`
      : `calc(${k - 1} * var(--step) + var(--expanded) - var(--overlap))`;

  return (
    <div className={`stx-pin stx--${mode}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div ref={trackRef} className="stx-track">
        <div className="stx-panel">
          <div className="stx-deck">
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

                  <div id={pid} className="stx-body" hidden={stacked && !active}>
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
