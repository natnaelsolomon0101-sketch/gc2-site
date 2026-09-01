import { INSIGHTS } from "@/content/site";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US",
    { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export default function Insights() {
  return (
    <section id="insights" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-band md:px-10">
        <p className="eyebrow">Insights</p>
        <h2 className="display h-sec mt-7 max-w-[16ch]">Notes from the desk.</h2>

        <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-3 md:gap-7">
          {INSIGHTS.map((p) => (
            <article key={p.slug} className="group">
              {/* muted abstract gradient cover — no stock photography */}
              <div className={`aspect-[4/5] w-full bg-gradient-to-br ${p.cover} transition-opacity duration-500 group-hover:opacity-90`} />
              <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em]">
                <span className="text-accent">{p.category}</span>
                <span className="text-ink-45">{fmt(p.date)}</span>
              </div>
              <h3 className="display mt-3 max-w-[22ch] text-[21px] tracking-[-0.02em] md:text-[24px]">
                {p.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
