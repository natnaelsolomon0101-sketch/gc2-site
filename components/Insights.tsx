import { INSIGHTS } from "@/content/site";
import Surface from "./Surface";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export default function Insights() {
  return (
    <section id="insights" className="band bg-surface">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <p className="eyebrow">Insights</p>
            <h2 className="t-h2 mt-4 max-w-[18ch] text-balance">
              Notes from the desk.
            </h2>
          </div>
          <a href="#insights" className="btn btn-ghost">
            All notes
          </a>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-12 md:mt-16 md:grid-cols-3">
          {INSIGHTS.map((p) => (
            <article key={p.slug} className="min-w-0">
              <a href={`#${p.slug}`} className="group block">
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-line"
                  style={{ backgroundColor: p.surface }}
                >
                  <Surface
                    className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    lines={30}
                    tone={p.tone}
                    opacity={0.8}
                  />
                </div>

                <p className="eyebrow mt-6">{p.category}</p>
                <p className="t-cap mt-2">{fmt(p.date)}</p>
                <h3 className="t-h3 mt-3 max-w-[28ch] text-ink decoration-1 underline-offset-4 group-hover:underline">
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
