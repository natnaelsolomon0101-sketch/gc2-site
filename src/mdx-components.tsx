import type { MDXComponents } from "mdx/types";
import Statement from "./components/Statement";
import { Marginalia, FootnoteRef, Footnotes, Footnote } from "./components/Prose";

/* Makes the article's shared objects usable as bare JSX tags inside .mdx
   note bodies with no per-file import.

   Statement: the one way of emphasizing a sentence on this site (Appendix A
   "Motion" / §5.6) — sec-framework owns Statement.tsx and is rebuilding it
   concurrently with this round; this imports it as-is rather than forking
   it. Its current shape (a full bg-graphite section with a required
   `attribution`) is the same object the home page's statement band uses, so
   a pull quote built from it reads as the site's one emphasis object rather
   than a second one invented for articles — but its section-y (80px
   top/bottom) padding is sized for a page-level band, not an inline aside,
   which reads heavier here than the §5.6 "full measure, hairline above and
   below" description calls for. Flagged for the Conductor: once sec-framework
   ships the lighter/optional-attribution version this should be revisited. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Statement, Marginalia, FootnoteRef, Footnotes, Footnote, ...components };
}
