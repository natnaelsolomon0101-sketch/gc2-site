import { INSIGHTS } from "@/content/site";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });

/**
 * Editorial list, not cards. The previous version used three near-identical
 * generated texture blocks as "covers"; filler imagery reads worse than none.
 */
export default function Insights() {
  return (
    <section id="insights" className="band bg-surface">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="eyebrow">Insights</p>
            <h2 className="t-h2 mt-4 text-ink">Notes from the desk.</h2>
          </div>
          <a href="#insights" className="btn btn-ghost shrink-0">All notes</a>
        </div>

        <ul className="mt-12 border-t border-line">
          {INSIGHTS.map((p) => (
            <li key={p.slug} className="border-b border-line">
              <a href={`#${p.slug}`}
                 className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 py-7 md:grid-cols-12">
                <span className="eyebrow md:col-span-2">{p.category}</span>
                <h3 className="t-h3 min-w-0 text-ink transition-colors group-hover:text-blue md:col-span-7">
                  {p.title}
                </h3>
                <time dateTime={p.date} className="t-cap md:col-span-3 md:text-right">
                  {fmt(p.date)}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
