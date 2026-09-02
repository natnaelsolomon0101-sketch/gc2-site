import { PANEL, FUND } from "@/content/site";

/**
 * The hero's product surface. A real interface with real hierarchy, not a
 * texture field. Data is illustrative and marked as such in the UI.
 */
export default function Panel() {
  return (
    <div className="card overflow-hidden">
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold">{FUND.mark}</span>
          <span className="text-[13px] text-muted">{PANEL.label}</span>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted">
          {PANEL.marker}
        </span>
      </div>

      {/* table */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {PANEL.columns.map((c, i) => (
              <th key={c}
                  className={`px-5 py-2.5 text-[11px] font-medium uppercase tracking-[.06em] text-muted-2 ${i === 2 ? "text-right" : ""} ${i === 1 ? "hidden sm:table-cell" : ""}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PANEL.rows.map((r) => (
            <tr key={r.sym} className="border-b border-line last:border-0">
              <td className="px-5 py-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="w-6 shrink-0 text-[13px] font-semibold tabular-nums">{r.sym}</span>
                  <span className="truncate text-[14px] text-ink">{r.name}</span>
                </div>
              </td>
              <td className="hidden px-5 py-3 text-[13px] text-muted sm:table-cell">{r.mandate}</td>
              <td className="px-5 py-3 text-right text-[14px] tabular-nums">{r.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* footer summary */}
      <div className="grid grid-cols-3 border-t border-line bg-surface">
        {PANEL.summary.map((s, i) => (
          <div key={s.k} className={`px-5 py-3.5 ${i > 0 ? "border-l border-line" : ""}`}>
            <div className="text-[11px] uppercase tracking-[.06em] text-muted-2">{s.k}</div>
            <div className="mt-1 text-[15px] font-medium tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
