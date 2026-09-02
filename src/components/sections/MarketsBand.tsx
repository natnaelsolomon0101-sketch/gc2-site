"use client";

/* ---------------------------------------------------------------------------
   MarketsBand — the data band.

   Structure and density are lifted from the 21st.dev "Financial Markets Table"
   (id 9045): a dense header row, one line per instrument, colour-keyed markers,
   selection + hover states, a compact glyph in the right-hand column. The skin
   is not: no shadcn, no next-themes, no framer-motion. Motion is CSS only.

   EVERY FIELD ON THIS BAND IS READ FROM THE REPO. There are no performance
   numbers here because GC2 does not publish any:

     name, oneLiner, markets, instruments, body   src/content/strategies.ts
     founded, city, structure, mandate            src/config/site.ts
     program count                              strategies.length
     asset-class coverage                         classify(), below — derived
                                                  from the `markets` string
     return driver                                the opening clause of each
                                                  strategy's own oneLiner

   The reference component's sparkline is a return series. It is deleted. The
   right-hand glyph is a four-cell coverage matrix over a FIXED asset-class
   axis — a set membership, not a time series, with no magnitude and no sign.
   ------------------------------------------------------------------------- */

import { useState } from "react";
import Link from "next/link";
import { strategies } from "@/content/strategies";
import { site } from "@/config/site";

/* --- the asset-class axis ------------------------------------------------ */

const AXIS = [
  { key: "rates", short: "R", label: "Rates" },
  { key: "fx", short: "FX", label: "FX" },
  { key: "eq", short: "EQ", label: "Equity" },
  { key: "cm", short: "CM", label: "Commodity" },
] as const;

/**
 * Coverage is READ from the strategy's own `markets` string — never asserted.
 * A cross-asset mandate marks every column, which is what "cross-asset" means.
 */
function classify(markets: string): Set<string> {
  const m = markets.toLowerCase();
  if (m.includes("cross-asset")) return new Set(AXIS.map((a) => a.key));
  const s = new Set<string>();
  if (m.includes("rates")) s.add("rates");
  if (/\bfx\b/.test(m)) s.add("fx");
  if (m.includes("equit") || m.includes("single names")) s.add("eq");
  if (/energy|metals|agriculture|commodit/.test(m)) s.add("cm");
  return s;
}

/**
 * The opening clause of each strategy's published one-liner, shortened to a
 * column heading. Source phrase is quoted in the comment. Not a claim we are
 * making here — a restatement of one already on the site.
 */
const DRIVER: Record<string, string> = {
  "systematic-macro": "Directional", //        "Directional cross-asset risk driven by…"
  "volatility-arbitrage": "Relative value", // "Relative value between implied and realized…"
  "statistical-relative-value": "Mean reversion", // "Mean reversion inside tightly defined…"
  "commodity-carry": "Term structure", //      "Term structure and inventory dislocation…"
  "event-dislocation": "Liquidity provision", // "Liquidity provision around … catalysts"
  "tail-overlay": "Long convexity", //         "A permanent long-convexity hedge…"
};

/**
 * Identity hue per program. deep-iris (#4b49aa) is deliberately unused: it
 * measures 2.67:1 on abyss and would fail both the 4.5:1 text floor and the
 * 3:1 non-text floor. Tail Overlay takes silver because it is the one book
 * that runs across all the others.
 */
const HUE: Record<string, string> = {
  "systematic-macro": "var(--color-periwinkle)", // 9.72:1 on abyss
  "volatility-arbitrage": "var(--color-cyan-signal)", // 8.01:1
  "statistical-relative-value": "var(--color-iris-gleam)", // 6.00:1
  "commodity-carry": "var(--color-orchid-bloom)", // 8.54:1
  "event-dislocation": "var(--color-pale-iris)", // 12.75:1
  "tail-overlay": "var(--color-silver)", // 12.09:1
};

/* --- the ledger strip ---------------------------------------------------- */

const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

const ledger: { label: string; value: string }[] = [
  { label: "Formed", value: String(site.founded) }, //      site.founded
  { label: "Domicile", value: site.city }, //               site.city
  { label: "Structure", value: site.structure }, //         site.structure
  { label: "Mandate", value: site.mandate }, //             site.mandate
  { label: "Strategies", value: COUNT[strategies.length] ?? String(strategies.length) },
  { label: "Risk framework", value: "One, firm-wide" }, //  /strategies standfirst
];

/* --- styles -------------------------------------------------------------- */

const css = `
.mk { background: var(--color-abyss); border-top: 1px solid rgba(255,255,255,.09); }
.mk-hair { border-top: 1px solid rgba(255,255,255,.09); }

/* ledger strip */
.mk-ledger { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); }
@media (min-width: 640px) { .mk-ledger { grid-template-columns: repeat(3, minmax(0,1fr)); } }
@media (min-width: 1024px) { .mk-ledger { grid-template-columns: repeat(6, minmax(0,1fr)); } }
.mk-ledger-cell { padding: 18px 16px 18px 20px; border-left: 1px solid rgba(255,255,255,.09); }
.mk-ledger-cell:first-child { padding-left: 0; border-left: 0; }
@media (min-width: 640px) { .mk-ledger-cell:nth-child(3n+1) { padding-left: 0; border-left: 0; } }
@media (min-width: 1024px) { .mk-ledger-cell:nth-child(3n+1) { padding-left: 20px; border-left: 1px solid rgba(255,255,255,.09); }
                             .mk-ledger-cell:first-child { padding-left: 0; border-left: 0; } }

/* table */
.mk-grid { display: grid; gap: 4px 24px; grid-template-columns: minmax(0,1fr); align-items: start; }
@media (min-width: 1024px) {
  .mk-grid {
    grid-template-columns:
      minmax(0, 1.75fr) minmax(0, .95fr) minmax(0, 1.15fr) minmax(0, 1.05fr) 136px;
    gap: 24px; align-items: center;
  }
}
/* The column header is desktop-only. It is hidden here rather than with a
   Tailwind variant: this <style> block is emitted after the Tailwind sheet, so
   .mk-grid's display:grid would win over max-lg:hidden. */
.mk-head { display: none; padding: 0 0 10px; }
@media (min-width: 1024px) { .mk-head { display: grid; } }
/* the selected treatment wraps the row AND its disclosure, so an open
   program reads as one block rather than a highlight with an orphan below */
.mk-item {
  border-top: 1px solid rgba(255,255,255,.09);
  padding-inline: 14px; margin-inline: -14px; border-radius: 8px;
  position: relative; transition: background .22s ease;
}
.mk-item:last-child { border-bottom: 1px solid rgba(255,255,255,.09); }
.mk-item:hover { background: rgba(255,255,255,.026); }
.mk-item[data-open="true"] { background: rgba(255,255,255,.045); }
/* selection rule — the reference's selected-row treatment, in the row's hue */
.mk-item::before {
  content: ""; position: absolute; left: 0; top: 14px; bottom: 14px; width: 2px;
  border-radius: 2px; background: var(--hue); transform: scaleY(0);
  transform-origin: 50% 50%; opacity: 0; transition: transform .28s ease, opacity .28s ease;
}
.mk-item[data-open="true"]::before { transform: scaleY(1); opacity: 1; }

.mk-row {
  width: 100%; text-align: left; display: block; cursor: pointer;
  min-height: 44px; padding-block: 18px; background: transparent;
}

.mk-idx { font-variant-numeric: tabular-nums; }
.mk-dot { width: 7px; height: 7px; border-radius: 9999px; background: var(--hue); flex: none; }

.mk-caret { transition: transform .28s ease; }
.mk-item[data-open="true"] .mk-caret { transform: rotate(180deg); }

/* mobile field rows */
.mk-fields { display: grid; grid-template-columns: 88px minmax(0,1fr); gap: 6px 16px; }
@media (min-width: 1024px) { .mk-lbl { display: none; } .mk-fields { display: contents; } }

/* Coverage matrix — set membership, not a series. The width is capped below
   lg on purpose: allowed to stretch across a tablet column, four equal cells
   start reading as filled meters, i.e. as magnitude. There is no magnitude
   here. Four fixed, equal, short cells can only say in / out. */
.mk-cov { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 6px; max-width: 208px; }
@media (min-width: 1024px) { .mk-cov { max-width: none; } }
.mk-cov-bar { height: 3px; border-radius: 2px; background: rgba(255,255,255,.11); }
.mk-cov-on .mk-cov-bar { background: var(--hue); height: 5px; margin-top: -1px; }

/* disclosure */
.mk-detail { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .34s cubic-bezier(.22,.61,.36,1); }
.mk-item[data-open="true"] .mk-detail { grid-template-rows: 1fr; }
.mk-detail-clip { overflow: hidden; }
.mk-detail-in { opacity: 0; transition: opacity .24s ease .06s; }
.mk-item[data-open="true"] .mk-detail-in { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .mk-item, .mk-item::before, .mk-caret, .mk-detail, .mk-detail-in { transition: none; }
}
`;

/* --- component ----------------------------------------------------------- */

export default function MarketsBand() {
  const [open, setOpen] = useState<string | null>(strategies[0]?.slug ?? null);

  return (
    <section className="mk" aria-labelledby="mk-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap band">
        {/* header */}
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="t-mono">Book of business</p>
            <h2 id="mk-title" className="t-display-sm mt-6">
              Six strategies.
              <br />
              One risk framework.
            </h2>
          </div>
          <p className="t-small measure-body mt-8 text-ash lg:mt-0 lg:max-w-sm">
            What each strategy trades, the instruments it is expressed in, and the
            asset classes it touches. Performance is not published here.
          </p>
        </div>

        {/* ledger strip — structural facts */}
        <div className="mk-hair mk-ledger mt-12">
          {ledger.map((f) => (
            <div key={f.label} className="mk-ledger-cell">
              <p className="t-mono-xs text-fog">{f.label}</p>
              <p className="mt-1 text-cloud">{f.value}</p>
            </div>
          ))}
        </div>

        {/* table */}
        <div className="mk-hair mt-12 pt-8">
          {/* column header — decorative; each cell carries its own sr-only label */}
          <div className="mk-grid mk-head" aria-hidden="true">
            <p className="t-mono-xs text-fog">Strategy</p>
            <p className="t-mono-xs text-fog">Return driver</p>
            <p className="t-mono-xs text-fog">Markets</p>
            <p className="t-mono-xs text-fog">Instruments</p>
            <div className="mk-cov">
              {AXIS.map((a) => (
                <p key={a.key} className="t-mono-xs text-fog">
                  {a.short}
                </p>
              ))}
            </div>
          </div>

          <ul>
            {strategies.map((s, i) => {
              const cov = classify(s.markets);
              const isOpen = open === s.slug;
              const hue = HUE[s.slug] ?? "var(--color-silver)";
              const covLabel = AXIS.filter((a) => cov.has(a.key))
                .map((a) => a.label)
                .join(", ");

              return (
                <li
                  key={s.slug}
                  className="mk-item"
                  data-open={isOpen}
                  style={{ ["--hue" as string]: hue }}
                >
                  <button
                    type="button"
                    className="mk-row"
                    aria-expanded={isOpen}
                    aria-controls={`mk-d-${s.slug}`}
                    onClick={() => setOpen(isOpen ? null : s.slug)}
                  >
                    <span className="mk-grid">
                      {/* program */}
                      <span className="flex items-start gap-4">
                        <span className="t-mono-xs mk-idx text-ash">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="mk-dot mt-2" />
                        <span className="block min-w-0">
                          <span className="block text-cloud">{s.name}</span>
                          <span className="t-small measure-body mt-1 block text-ash">
                            {s.oneLiner}
                          </span>
                        </span>
                        <svg
                          className="mk-caret ml-auto mt-1 lg:hidden"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path d="M2 4.5 6 8.5l4-4" stroke="#9f9fa0" strokeWidth="1.25" />
                        </svg>
                      </span>

                      {/* return driver */}
                      <span className="mk-fields mt-4 lg:mt-0">
                        <span className="t-mono-xs mk-lbl text-ash">Driver</span>
                        <span className="t-mono-xs" style={{ color: hue, letterSpacing: ".1em" }}>
                          <span className="sr-only">Return driver: </span>
                          {DRIVER[s.slug]}
                        </span>
                      </span>

                      {/* markets */}
                      <span className="mk-fields mt-1 lg:mt-0">
                        <span className="t-mono-xs mk-lbl text-ash">Markets</span>
                        <span className="t-small text-silver">
                          <span className="sr-only">Markets: </span>
                          {s.markets}
                        </span>
                      </span>

                      {/* instruments */}
                      <span className="mk-fields mt-1 lg:mt-0">
                        <span className="t-mono-xs mk-lbl text-ash">Instruments</span>
                        <span className="t-small text-silver">
                          <span className="sr-only">Instruments: </span>
                          {s.instruments}
                        </span>
                      </span>

                      {/* coverage matrix */}
                      <span className="mk-fields mt-3 lg:mt-0">
                        <span className="t-mono-xs mk-lbl text-ash">Coverage</span>
                        <span className="mk-cov" role="img" aria-label={`Asset classes: ${covLabel}`}>
                          {AXIS.map((a) => {
                            const on = cov.has(a.key);
                            return (
                              <span key={a.key} className={on ? "mk-cov-on block" : "block"}>
                                <span className="mk-cov-bar block" />
                                <span
                                  className={`t-mono-xs mt-1 block lg:hidden ${on ? "text-cloud" : "text-ash"}`}
                                >
                                  {a.short}
                                </span>
                              </span>
                            );
                          })}
                        </span>
                      </span>
                    </span>
                  </button>

                  {/* disclosure — the strategy's own note, verbatim */}
                  {/* inert while collapsed: the panel still occupies the DOM at
                      0px so the grid-rows transition has something to animate,
                      and without it the "Full strategy note" link stays in the
                      tab order and in the accessibility tree while invisible. */}
                  <div
                    className="mk-detail"
                    id={`mk-d-${s.slug}`}
                    role="region"
                    aria-label={`${s.name} detail`}
                    inert={!isOpen}
                  >
                    <div className="mk-detail-clip">
                      <div className="mk-detail-in pb-8 lg:pl-14">
                        <div className="gap-10 md:grid md:grid-cols-2">
                          {s.body.map((t, k) => (
                            <p key={k} className={`t-small measure-body text-ash ${k ? "mt-4 md:mt-0" : ""}`}>
                              {t}
                            </p>
                          ))}
                        </div>
                        <Link
                          href={`/strategies#${s.slug}`}
                          className="t-mono-xs mt-6 inline-flex min-h-11 items-center text-pure"
                        >
                          Full strategy note
                          <svg
                            className="ml-2"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="#ffffff" strokeWidth="1.25" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* provenance + the deliberate omission */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <p className="t-small measure-body text-fog">
            Asset-class coverage is read from each strategy&rsquo;s stated markets; a
            cross-asset mandate marks every class. Return driver restates the opening
            clause of the strategy&rsquo;s own description.
          </p>
          <p className="t-small measure-body text-fog">
            No returns, assets under management, or risk statistics appear on this
            site. Performance and terms are provided to qualified investors on
            request, under the applicable restrictions.
          </p>
        </div>
      </div>
    </section>
  );
}
