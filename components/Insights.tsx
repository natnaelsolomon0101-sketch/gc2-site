import { INSIGHTS } from "@/content/site";
import Surface from "./Surface";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US",
    { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export default function Insights() {
  return (
    <section id="insights" className="band bg-linen-cream">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Insights</p>
            <h2 className="tiempos t-h mt-3">Notes from the desk.</h2>
          </div>
          <a href="#insights" className="btn-ghost ws-label">All notes</a>
        </div>

        {/* hairline above each column is the only chrome */}
        <div className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-3">
          {INSIGHTS.map((p) => (
            <article key={p.slug}>
              <a href={`#${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[100px]"
                     style={{ background: p.surface }}>
                  <Surface className="absolute inset-0 h-full w-full" lines={30} tone={p.tone} opacity={0.75} />
                </div>
                <div className="rule-top mt-8 pt-5">
                  <div className="flex items-center gap-3 t-caption">
                    <span>{p.category}</span>
                    <span className="text-stone">·</span>
                    <span>{fmt(p.date)}</span>
                  </div>
                  <h3 className="mt-3 max-w-[26ch] text-[20px] font-medium leading-[1.3] transition-opacity group-hover:opacity-65">
                    {p.title}
                  </h3>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
