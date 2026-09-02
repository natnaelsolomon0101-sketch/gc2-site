import { INSIGHTS } from "@/content/site";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US",
    { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export default function Insights() {
  return (
    <section id="insights" className="border-b border-rule bg-band">
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Insights</p>
            <h2 className="display h-sec mt-7">Notes from the desk.</h2>
          </div>
          <a href="#insights" className="border-b border-ink pb-1 text-[14px] transition-colors hover:border-accent hover:text-accent">
            All notes
          </a>
        </div>

        <div className="mt-16 grid gap-x-7 gap-y-14 md:mt-20 md:grid-cols-3">
          {INSIGHTS.map((p, i) => (
            <article key={p.slug} className="group">
              <a href={`#${p.slug}`} className="block">
                <div className={`relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br ${p.cover}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                  <span className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.18em] text-white/85">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em]">
                  <span className="text-accent">{p.category}</span>
                  <span className="text-ink-45">{fmt(p.date)}</span>
                </div>
                <h3 className="display mt-3 max-w-[24ch] text-[22px] leading-[1.18] tracking-[-0.02em] transition-colors group-hover:text-accent md:text-[26px]">
                  {p.title}
                </h3>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
