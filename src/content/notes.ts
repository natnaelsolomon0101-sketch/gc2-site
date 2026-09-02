export type Note = { slug: string; title: string; date: string; category: string; dek: string };

/** Sorted newest first at build. Bodies live in src/content/notes/<slug>.mdx
 *
 *  One note. The firm was founded in September 2026 and is days old, so a
 *  back catalogue would be the easiest lie on the site to tell and the easiest
 *  to catch: three notes dated February, May and July 2026 all predated the
 *  founding date they sat beside. A short index is the truth about a firm this
 *  new, and it costs nothing an allocator values. */
export const notes: Note[] = [
  { slug: "capacity-is-a-research-problem", title: "Capacity is a research problem",
    date: "2026-09-01", category: "Process",
    dek: "A strategy that cannot be sized is a hobby. Why we underwrite market impact before we underwrite edge." },
].sort((a, b) => (a.date < b.date ? 1 : -1));

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
