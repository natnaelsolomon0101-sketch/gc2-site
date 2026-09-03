import type { MDXComponents } from "mdx/types";
import Statement from "./components/Statement";
import { Marginalia, FootnoteRef, Footnotes, Footnote } from "./components/Prose";

/* Makes the article's shared objects usable as bare JSX tags inside .mdx
   note bodies with no per-file import.

   Statement: the one way of emphasizing a sentence on this site (Appendix A
   "Motion" / §5.6) — sec-framework owns Statement.tsx; this imports it as-is
   (round 1: merged from v4/every-screen) rather than forking it. It now
   matches §5.6 directly — display face, full measure, hairline above and
   below, no quote marks, `attribution` optional. Its py-14/md:py-20 (56/80px)
   padding is still page-band-sized rather than a lighter inline variant; per
   the Conductor (round 1), used as-is rather than forked — a `compact` prop
   would be the right fix, requested through the Conductor if this comes up
   again rather than added here. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Statement, Marginalia, FootnoteRef, Footnotes, Footnote, ...components };
}
