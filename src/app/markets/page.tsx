import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RevealLines from "@/components/ui/RevealLines";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import Sparkline from "@/components/viz/Sparkline";
import { css } from "@/lib/css";
import { fetchQuotes, fmtLevel, fmtChange, fmtAsOf, MARKETS_SOURCE } from "@/lib/markets";
import { fetchCnbc, fetchTape, fmtWhen } from "@/lib/news";
import { people } from "@/content/watching";

/* ===========================================================================
   /markets — the tape, the headlines, and what is worth watching.

   Everything on this page is someone else's: delayed public prices, third-
   party headlines that link to their publishers, and interviews embedded
   through YouTube's own player. The firm adds the frame and nothing else.
   It publishes no positions, no forecasts and no performance, and the page
   says so in its standfirst and its foot. A source that fails renders
   nothing; there is no placeholder and no stale value with a fresh date.
   ========================================================================= */

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Public market data, third-party headlines, and interviews worth watching. A reference, not a view: the firm publishes no positions, forecasts or performance.",
};

export const revalidate = 1800;

const CSS = css`
.mk-sec{position:relative;padding:56px 0;}
@media (min-width:1024px){.mk-sec{padding:80px 0;}}
.mk-sec + .mk-sec{border-top:1px solid var(--color-hairline);}
.mk-h2{margin:0 0 28px;}
.mk-h2 em{font-style:italic;color:var(--color-accent-deep-iris);}
.mk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0;padding:0;list-style:none;}
@media (min-width:768px){.mk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;}}
.mk-tile{padding:18px 18px 14px;display:flex;flex-direction:column;gap:10px;height:100%;}
.mk-val{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;}
.mk-label{color:var(--color-ink-3);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mk-chg{color:var(--color-ink-2);font-variant-numeric:tabular-nums;}
.mk-chg[data-up="true"]{color:var(--color-accent-deep-iris);}
.mk-last{margin:0;font-variant-numeric:tabular-nums;line-height:1;}
.mk-spark{width:100%;height:auto;margin-top:2px;}
.mk-cols{display:grid;gap:36px;}
@media (min-width:1024px){.mk-cols{grid-template-columns:repeat(2,minmax(0,1fr));gap:48px;}}
.mk-col h3{margin:0 0 14px;color:var(--color-ink-3);}
.mk-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;}
.mk-row{display:block;padding:14px 16px;color:inherit;text-decoration:none;}
.mk-row-title{display:block;margin:0 0 6px;color:var(--color-ink);text-wrap:pretty;}
.mk-row-meta{display:block;color:var(--color-ink-3);}
.mk-row:hover .mk-row-title{text-decoration:underline;text-underline-offset:3px;}
.mk-vid-title{margin:0 0 4px;color:var(--color-ink);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.mk-vid-cap .t-caption{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--color-ink-3);}
.mk-vids{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none;}
@media (min-width:768px){.mk-vids{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;}}
@media (min-width:1024px){.mk-vids{grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;}}
.mk-vid{overflow:hidden;}
.mk-vid-link{display:block;color:inherit;text-decoration:none;}
.mk-vid-link:focus-visible{outline:2px solid var(--color-ink);outline-offset:2px;}
.mk-vid-media{position:relative;display:block;aspect-ratio:16/9;background:var(--color-surface);overflow:hidden;}
.mk-vid-media img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.85);transition:transform var(--dur-base) var(--ease);}
.mk-vid-link:hover .mk-vid-media img{transform:scale(1.03);}
.mk-vid-link:hover .mk-vid-title{text-decoration:underline;text-underline-offset:3px;}
.lv-play{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:999px;
  display:grid;place-items:center;background:var(--color-ink);color:var(--color-ground);
  transition:transform var(--dur-fast) var(--ease);}
.mk-vid-cap{display:block;padding:10px 12px 12px;}
.mk-vid-cap p{margin:0;}
.mk-vid-cap .t-caption{color:var(--color-ink-3);margin-top:4px;}
.mk-foot{margin:0;color:var(--color-ink-3);max-width:80ch;}
`;

export default async function MarketsPage() {
  const [quotes, cnbc, tape] = await Promise.all([fetchQuotes(), fetchCnbc(), fetchTape()]);
  const asOf = quotes.length ? quotes.reduce((m, q) => (q.asOf > m ? q.asOf : m), quotes[0].asOf) : null;

  return (
    <>
      <style>{CSS}</style>
      <PageHeader
        eyebrow="Markets"
        title="The tape."
        accent="tape"
        standfirst="Public market data, other people's headlines, and a few conversations worth an hour. A reference, not a view: the firm publishes no positions, no forecasts and no performance, and nothing on this page should be read as any of those."
        caption={asOf ? `Prices delayed · ${MARKETS_SOURCE} · as of ${fmtAsOf(asOf)}` : undefined}
      />

      {quotes.length > 0 && (
        <section className="mk-sec" aria-labelledby="mk-moving">
          <div className="wrap">
            <h2 id="mk-moving" className="t-h2 mk-h2">
              <RevealLines lines={[<>What is <em>moving</em>.</>]} />
            </h2>
            <ul className="mk-grid">
              {quotes.map((q) => (
                <li key={q.symbol}>
                  <Tilt max={4} className="mk-tile-tilt">
                    <Glass className="mk-tile" radius={18}>
                      <span className="t-caption mk-label">{q.label}</span>
                      <div className="mk-val">
                        <p className="t-h2 mk-last">{fmtLevel(q)}</p>
                        <span className="t-caption mk-chg" data-up={q.changePct >= 0 ? "true" : "false"}>{fmtChange(q)}</span>
                      </div>
                      <Sparkline series={q.series} className="mk-spark" />
                    </Glass>
                  </Tilt>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(cnbc.length > 0 || tape.length > 0) && (
        <section className="mk-sec" aria-labelledby="mk-said">
          <div className="wrap">
            <h2 id="mk-said" className="t-h2 mk-h2">
              <RevealLines lines={[<>What is being <em>said</em>.</>]} />
            </h2>
            <div className="mk-cols">
              {cnbc.length > 0 && (
                <div className="mk-col">
                  <h3 className="t-caption">CNBC · Markets</h3>
                  <ul className="mk-list">
                    {cnbc.map((h) => (
                      <li key={h.url}>
                        <Glass as="div" radius={14}>
                          <a className="mk-row" href={h.url} target="_blank" rel="noopener noreferrer">
                            <span className="mk-row-title">{h.title}</span>
                            <span className="mk-row-meta t-caption">{h.source} · {fmtWhen(h.publishedAt)}</span>
                          </a>
                        </Glass>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tape.length > 0 && (
                <div className="mk-col">
                  <h3 className="t-caption">The wider tape</h3>
                  <ul className="mk-list">
                    {tape.map((h) => (
                      <li key={h.url}>
                        <Glass as="div" radius={14}>
                          <a className="mk-row" href={h.url} target="_blank" rel="noopener noreferrer">
                            <span className="mk-row-title">{h.title}</span>
                            <span className="mk-row-meta t-caption">{h.source} · {fmtWhen(h.publishedAt)}</span>
                          </a>
                        </Glass>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {people.length > 0 && (
        <section className="mk-sec" aria-labelledby="mk-watch">
          <div className="wrap">
            <h2 id="mk-watch" className="t-h2 mk-h2">
              <RevealLines lines={[<>Worth <em>watching</em>.</>]} />
            </h2>
            <ul className="mk-vids">
              {people.map((v) => (
                <li key={v.id}>
                  <Glass as="div" radius={18} className="mk-vid">
                    {/* The whole card opens the video on YouTube in a new tab:
                        no player on the page, nothing to hydrate. */}
                    <a
                      className="mk-vid-link"
                      href={`https://www.youtube.com/watch?v=${v.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${v.name}: ${v.title} (opens on YouTube)`}
                    >
                      <span className="mk-vid-media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${v.id}/${v.poster === "sd" ? "sddefault" : "maxresdefault"}.jpg`}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="lv-play" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                        </span>
                      </span>
                      <span className="mk-vid-cap">
                        <span className="t-small mk-vid-title">{v.name}: {v.title}</span>
                        <span className="t-caption">{v.channel} · YouTube</span>
                      </span>
                    </a>
                  </Glass>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mk-sec">
        <div className="wrap">
          <p className="t-small mk-foot">
            Prices are delayed public data from {MARKETS_SOURCE}. Headlines belong to their publishers and link to them; the firm does not endorse them. Videos open on YouTube, on their channels. None of this is a view of the firm, a recommendation, or fund performance, and none of it is an offer.
          </p>
        </div>
      </section>
    </>
  );
}
