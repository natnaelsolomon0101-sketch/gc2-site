export type Note = { slug: string; title: string; date: string; category: string; dek: string };

/** Sorted newest first at build. Bodies live in src/content/notes/<slug>.mdx */
export const notes: Note[] = [
  { slug: "trade-the-regime-not-the-forecast", title: "Trade the regime, not the forecast",
    date: "2026-07-14", category: "Research",
    dek: "Point estimates decay in days. Regime classification survives quarters. Why we stopped asking where the market is going." },
  { slug: "the-honest-cost-of-convexity", title: "The honest cost of convexity",
    date: "2026-05-02", category: "Risk",
    dek: "A permanent hedge looks expensive in every month it isn't needed. The arithmetic that makes it cheap across a full cycle." },
  { slug: "capacity-is-a-research-problem", title: "Capacity is a research problem",
    date: "2026-02-20", category: "Process",
    dek: "A strategy that cannot be sized is a hobby. Why we underwrite market impact before we underwrite edge." },
].sort((a, b) => (a.date < b.date ? 1 : -1));

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
