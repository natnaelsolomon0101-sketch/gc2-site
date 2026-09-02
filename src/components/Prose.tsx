export default function Prose({ children }: { children: React.ReactNode }) {
  // Styles live in globals.css (.prose-gc2). They were inline arbitrary
  // variants, and the h2 rule set a family but no size, so in-article headings
  // rendered at body size and the hierarchy read inverted.
  return <div className="prose-gc2">{children}</div>;
}
