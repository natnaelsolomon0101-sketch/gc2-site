import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RevealLines from "@/components/ui/RevealLines";
import Glass from "@/components/ui/Glass";
import Tilt from "@/components/ui/Tilt";
import Sparkline from "@/components/viz/Sparkline";
import LiteVideo from "@/components/LiteVideo";
import { css } from "@/lib/css";
import { fetchQuotes, fmtLevel, fmtChange, fmtAsOf, MARKETS_SOURCE } from "@/lib/markets";
import { fetchCnbc, fetchTape, fetchAbout, fmtWhen } from "@/lib/news";
import { hosts } from "@/content/watching";

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
.mk-host + .mk-host{margin-top:56px;padding-top:40px;border-top:1px solid var(--color-hairline);}
.mk-host-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 18px;margin:0 0 18px;}
.mk-host-name{margin:0;}
.mk-host-note{margin:0;color:var(--color-ink-3);}
.mk-host-news{margin-top:24px;}
.mk-host-news h4{margin:0 0 12px;color:var(--color-ink-3);}
.mk-vids{display:grid;grid-template-columns:1fr;gap:18px;margin:0;padding:0;list-style:none;}
@media (min-width:768px){.mk-vids{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media (min-width:1280px){.mk-vids{grid-template-columns:repeat(3,minmax(0,1fr));}}
.mk-vid{overflow:hidden;}
.mk-vid-media{position:relative;aspect-ratio:16/9;background:var(--color-surface);}
.lv-poster{position:absolute;inset:0;width:100%;height:100%;padding:0;border:0;background:none;cursor:pointer;}
.lv-poster img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.85);}
.lv-play{position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:999px;
  display:grid;place-items:center;background:var(--color-ink);color:var(--color-ground);
  transition:transform var(--dur-fast) var(--ease);}
.lv-poster:hover .lv-play{transform:scale(1.06);}
.lv-poster:focus-visible{outline:2px solid var(--color-ink);outline-offset:2px;}
.lv-frame{position:absolute;inset:0;width:100%;height:100%;border:0;}
.mk-vid-cap{padding:12px 16px 14px;}
.mk-vid-cap p{margin:0;}
.mk-vid-cap .t-caption{color:var(--color-ink-3);margin-top:4px;}
.mk-foot{margin:0;color:var(--color-ink-3);max-width:80ch;}
`;

export default async function MarketsPage() {
  const [quotes, cnbc, tape, ...about] = await Promise.all([
    fetchQuotes(), fetchCnbc(), fetchTape(), ...hosts.map((h) => fetchAbout(h.newsQuery)),
  ]);
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

      {hosts.some((h) => h.episodes.length > 0) && (
        <section className="mk-sec" aria-labelledby="mk-watch">
          <div className="wrap">
            <h2 id="mk-watch" className="t-h2 mk-h2">
              <RevealLines lines={[<>Worth <em>watching</em>.</>]} />
            </h2>
            {hosts.map((h, hi) => (
              <div key={h.name} className="mk-host">
                <div className="mk-host-head">
                  <h3 className="t-h3 mk-host-name">{h.name}</h3>
                  <p className="t-caption mk-host-note">{h.note}</p>
                </div>
                <ul className="mk-vids">
                  {h.episodes.map((v) => (
                    <li key={v.id}>
                      <Glass as="div" radius={18} className="mk-vid">
                        <div className="mk-vid-media"><LiteVideo id={v.id} title={v.title} poster={v.poster} /></div>
                        <div className="mk-vid-cap">
                          <p className="t-small">{v.title}</p>
                          <p className="t-caption">{v.channel} · YouTube</p>
                        </div>
                      </Glass>
                    </li>
                  ))}
                </ul>
                {(about[hi] ?? []).length > 0 && (
                  <div className="mk-col mk-host-news">
                    <h4 className="t-caption">{h.name} · in the news</h4>
                    <ul className="mk-list">
                      {about[hi].map((n) => (
                        <li key={n.url}>
                          <Glass as="div" radius={14}>
                            <a className="mk-row" href={n.url} target="_blank" rel="noopener noreferrer">
                              <span className="mk-row-title">{n.title}</span>
                              <span className="mk-row-meta t-caption">{n.source} · {fmtWhen(n.publishedAt)}</span>
                            </a>
                          </Glass>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mk-sec">
        <div className="wrap">
          <p className="t-small mk-foot">
            Prices are delayed public data from {MARKETS_SOURCE}. Headlines belong to their publishers and link to them; the firm does not endorse them. Videos play through YouTube's player from their channels. None of this is a view of the firm, a recommendation, or fund performance, and none of it is an offer.
          </p>
        </div>
      </section>
    </>
  );
}
