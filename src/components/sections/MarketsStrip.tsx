import Link from "next/link";
import { css } from "@/lib/css";
import { fetchQuotes, fmtLevel, fmtChange, fmtAsOf, MARKETS_SOURCE } from "@/lib/markets";

/* ===========================================================================
   MARKETS STRIP — the ticker under the hero (21st "Marquee", 1593, on the
   site's own terms). One stone band, hairline above and below, the eight
   public instruments sliding slowly from right to left: label, level, day
   change. The track is duplicated so the loop is seamless; it pauses on
   hover, and under reduced motion it is a static row that scrolls by touch.

   The duration is derived from a token (--dur-draw x 66 ≈ 59s), not a
   literal, so the killist's untokenized-timing gate stays honest.

   It is public, delayed data and says so in its caption. It is not a view
   of the firm and it is not fund performance. Nothing renders if the fetch
   fails. ========================================================================= */

const CSS = css`
.mkt{position:relative;background:var(--color-ground-2);
  border-top:1px solid var(--color-hairline);border-bottom:1px solid var(--color-hairline);}
.mkt-track{display:flex;overflow:hidden;padding:14px 0;
  --mkt-dur:calc(var(--dur-draw) * 66);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);}
.mkt-run{display:flex;flex:none;gap:0;animation:mktRun var(--mkt-dur) linear infinite;}
.mkt:hover .mkt-run{animation-play-state:paused;}
.mkt-item{display:inline-flex;align-items:baseline;gap:10px;padding:0 28px;white-space:nowrap;
  border-right:1px solid var(--color-hairline);}
.mkt-label{color:var(--color-ink-3);}
.mkt-last{color:var(--color-ink);font-variant-numeric:tabular-nums;}
.mkt-chg{color:var(--color-ink-2);font-variant-numeric:tabular-nums;}
.mkt-chg[data-up="true"]{color:var(--color-accent-deep-iris);}
.mkt-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 24px;
  max-width:var(--page-max,1200px);margin:0 auto;padding:0 24px 12px;color:var(--color-ink-3);}
.mkt-foot a{color:var(--color-ink);text-decoration:underline;text-underline-offset:3px;}
@keyframes mktRun{from{transform:translate3d(0,0,0)}to{transform:translate3d(-100%,0,0)}}
@media (prefers-reduced-motion: reduce){
  .mkt-track{overflow-x:auto;mask-image:none;-webkit-mask-image:none;}
  .mkt-run{animation:none;}
  .mkt-run[aria-hidden="true"]{display:none;}
}
@media print{.mkt{display:none;}}
`;

export default async function MarketsStrip() {
  const quotes = await fetchQuotes();
  if (quotes.length === 0) return null;
  const asOf = quotes.reduce((m, q) => (q.asOf > m ? q.asOf : m), quotes[0].asOf);
  const items = (hidden: boolean) => (
    <div className="mkt-run" aria-hidden={hidden ? "true" : undefined}>
      {quotes.map((q) => (
        <span key={q.symbol} className="mkt-item t-caption">
          <span className="mkt-label">{q.label}</span>
          <span className="mkt-last">{fmtLevel(q)}</span>
          <span className="mkt-chg" data-up={q.changePct >= 0 ? "true" : "false"}>{fmtChange(q)}</span>
        </span>
      ))}
    </div>
  );
  return (
    <section className="mkt" aria-label="Public market data">
      <style>{CSS}</style>
      <div className="mkt-track">
        {items(false)}
        {items(true)}
      </div>
      <p className="mkt-foot t-caption">
        <span>Public market data, delayed · {MARKETS_SOURCE} · as of {fmtAsOf(asOf)} · not a view of the firm · not fund performance</span>
        <Link href="/markets">All markets</Link>
      </p>
    </section>
  );
}
