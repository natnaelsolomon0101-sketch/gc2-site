/* Long-form body copy on the paper ground.

   Two changes beyond the colour swap, both about reading comfort in a long
   paragraph:

   1. The paper build (v1) pinned every paragraph to `.t-body` (16px/1.5),
      which overrode the `.t-prose` 17/18px, 1.65/1.7 on the wrapper. The
      tighter setting is markedly harder to hold a line in, so the paragraph
      override is gone and `.t-prose` now governs.
   2. `h2` carried a font change and no size, so subheads rendered at body size
      and the article had no visible structure. They now take `.t-heading-sm`
      (26px display) at ink.

   Colour (light canvas, DESIGN.md "Measured — ink on every ground"): body
   ink-2 #544e45 on ground #f7f5f0 = 7.55:1. Headings and inline emphasis lift
   to ink #141311 = 17.04:1. Ink is used for structure (headings, strong,
   links, the blockquote rule), not for running text — full-weight ink over a
   paragraph this long reads as shouting; ink-2 is the reading colour.

   Measure: `clamp(20em, 90vw, 36em)` per §5.6, not the shared 680px
   `.measure-prose` — that class also serves the legal/disclosures pages
   (sec-legal's row), so the fluid measure lives here as a local Tailwind
   arbitrary value instead of a change to a token this section does not own. */
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="max-w-[clamp(20em,90vw,36em)] t-prose mx-auto
        [&>p]:mt-6 [&>p]:text-ink-2
        [&>h2]:font-display [&>h2]:mt-12 [&>h2]:text-2xl [&>h2]:leading-tight
        [&>h2]:tracking-tight [&>h2]:text-ink
        [&>ul]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:text-ink-2
        [&>ol]:mt-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:text-ink-2
        [&>blockquote]:mt-8 [&>blockquote]:border-l [&>blockquote]:border-hairline-strong
        [&>blockquote]:pl-6 [&>blockquote]:text-ink
        [&_li]:mt-2
        [&_strong]:font-medium [&_strong]:text-ink
        [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4"
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Marginalia (§5.6, ALLOCATOR §7.1: a gloss set beside the paragraph it
   annotates, not a footnote the reader has to jump for).

   ≥1280 (`xl:`): an `aside` in the left margin, flown out of the flow with
   `right-full` so its right edge sits at the article measure's own left
   edge — the article column has ~250px+ of clear paper ground to its left at
   this width (measure ceiling 36em ≈ 648px inside a 1152px content area at
   1280), so a 180px note with a 32px gap never touches the container edge.
   The wrapper is a zero-height block dropped where the note belongs in the
   text, so the aside lines up with the paragraph it follows.

   <1280: the aside is `hidden`; an inline `<details>` takes over instead,
   right in the reading column. Only one of the two is ever `display`ed, so
   only one is ever in the accessibility tree at a given width — there is no
   real duplicate-content read for a screen reader user at any single size.
   ------------------------------------------------------------------------ */
export function Marginalia({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-6">
      <aside
        aria-label="Margin note"
        className="absolute right-full top-0 hidden w-[180px] pr-8 text-left xl:block"
      >
        <p className="t-mono-xs leading-relaxed text-ink-3">{children}</p>
      </aside>
      <details className="rule-t pt-4 xl:hidden">
        <summary className="t-mono-xs inline-flex min-h-11 min-w-11 cursor-pointer items-center text-ink-3">
          Note
        </summary>
        <p className="t-small mt-3 text-ink-2">{children}</p>
      </details>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Footnotes (§5.6: "the one permitted ↩"). A plain numbered reference and a
   list at the foot of the article; the only glyph either one uses for the
   back-link is ↩, and there is exactly one footnote in the note that uses
   this today (see capacity-is-a-research-problem.mdx), so it is also
   literally the one ↩ on the page.

   Round 1: both inline links measured under 44×44 (FootnoteRef 33×17, the
   ↩ back-link 14×17). Padding expands each to a ≥44×44 hit area; an equal
   negative horizontal margin cancels the padding's effect on the
   surrounding line so the glyph doesn't move. (Vertical padding on an
   inline, non-replaced element doesn't affect line-height by spec, so no
   vertical margin is needed to compensate — it only grows the click/paint
   area, overlapping the line above/below where nothing else is painted.)
   ------------------------------------------------------------------------ */
export function FootnoteRef({ n }: { n: number }) {
  return (
    <sup>
      <a
        href={`#fn${n}`}
        id={`fnref${n}`}
        className="t-mono-xs -mx-2 px-2 py-3.5 text-ink no-underline"
      >
        [{n}]
      </a>
    </sup>
  );
}

export function Footnotes({ children }: { children: React.ReactNode }) {
  return (
    <div className="rule-t mt-12 pt-6">
      <p className="t-mono-xs text-ink-3">Notes</p>
      <ol className="mt-4 space-y-3">{children}</ol>
    </div>
  );
}

export function Footnote({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li id={`fn${n}`} className="t-small text-ink-2">
      {children}{" "}
      <a
        href={`#fnref${n}`}
        aria-label="Back to text"
        className="-mx-4 px-4 py-3.5 text-ink no-underline"
      >
        ↩
      </a>
    </li>
  );
}
