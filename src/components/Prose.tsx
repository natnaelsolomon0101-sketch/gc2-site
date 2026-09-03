/* Long-form body copy on the Origin ground.

   Two changes beyond the colour swap, both about reading comfort on black:

   1. The paper build pinned every paragraph to `.t-body` (16px/1.5), which
      overrode the `.t-prose` 18px/1.7 on the wrapper. On a dark ground the
      tighter setting is markedly harder to hold a line in, so the paragraph
      override is gone and `.t-prose` now governs: 18px, 1.7, ash.
   2. `h2` carried a font change and no size, so subheads rendered at body size
      and the article had no visible structure. They now take `.t-heading-sm`
      (26px display) at cloud.

   Colour: body ash #9f9fa0 on obsidian #0f1011 = 7.20:1. Headings and inline
   emphasis lift to cloud #f5f5f7 = 17.49:1. Pure white is deliberately NOT used
   for running text — it glares over a paragraph this long. */
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="measure-prose t-prose mx-auto
        [&>p]:mt-6 [&>p]:text-ash
        [&>h2]:font-display [&>h2]:mt-12 [&>h2]:text-2xl [&>h2]:leading-tight
        [&>h2]:tracking-tight [&>h2]:text-cloud
        [&>ul]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:text-ash
        [&>ol]:mt-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:text-ash
        [&>blockquote]:mt-8 [&>blockquote]:border-l [&>blockquote]:border-steel
        [&>blockquote]:pl-6 [&>blockquote]:text-cloud
        [&_li]:mt-2
        [&_strong]:font-medium [&_strong]:text-cloud
        [&_a]:text-pure [&_a]:underline [&_a]:underline-offset-4"
    >
      {children}
    </div>
  );
}
