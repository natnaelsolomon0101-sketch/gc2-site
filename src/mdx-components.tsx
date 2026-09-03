import type { MDXComponents } from "mdx/types";
import BaseStatement from "./components/Statement";
import { Marginalia, FootnoteRef, Footnotes, Footnote } from "./components/Prose";

/* Makes the article's shared objects usable as bare JSX tags inside .mdx
   note bodies with no per-file import.

   Statement: the one way of emphasizing a sentence on this site (Appendix A
   "Motion" / §5.6) — sec-framework owns Statement.tsx; this imports it as-is
   rather than forking it. Round 2: sec-framework shipped the `compact` prop
   requested in round 1 (halves the vertical padding, py-7/md:py-10 instead
   of py-14/md:py-20). The note bodies still just write `<Statement
   attribution="...">`, so `compact` is defaulted here in the mapping —
   every Statement reached through an .mdx file is the article-appropriate
   size without each note having to remember to pass the prop. */
function Statement(props: React.ComponentProps<typeof BaseStatement>) {
  return <BaseStatement compact {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Statement, Marginalia, FootnoteRef, Footnotes, Footnote, ...components };
}
