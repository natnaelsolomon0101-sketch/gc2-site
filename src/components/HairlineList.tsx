import Link from "next/link";

/* HairlineRow's hover is the <Glass> pane's own recipe (paper at 62% behind a
   blur, a hairline-strong ring top and bottom) applied to a row rather than a
   card, so a hairline list reads as the same material as a bento tile without
   importing <Glass> itself — a row is not a floating object, it does not
   need Glass's radius or its full border. No shadow (DESIGN.md principle 4);
   the wash and the ring are the whole depth cue, and both fade in on
   `--dur-fast` rather than snapping. Gated to real hover so a tap does not
   "stick" the tint on, same rule ForAllocators.tsx' row hover follows. */
const CSS = `
@media (hover:hover) and (pointer:fine){
  .hlr{ position:relative; }
  .hlr::before{
    content:""; position:absolute; inset:0; z-index:0; opacity:0;
    background:color-mix(in srgb, var(--color-ground) 62%, transparent);
    -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
    border-top:1px solid var(--color-hairline-strong);
    border-bottom:1px solid var(--color-hairline-strong);
    transition:opacity var(--dur-fast) var(--ease);
  }
  .hlr:hover::before{ opacity:1; }
  .hlr > *{ position:relative; z-index:1; }
}
`;

export function HairlineList({ children }: { children: React.ReactNode }) {
  return (
    <div className="rule-t">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {children}
    </div>
  );
}

export function HairlineRow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="hlr rule-b block px-2 py-7 transition-colors duration-[var(--dur-fast)]">
      <div className="grid-gc2 items-baseline">{children}</div>
    </Link>
  );
}
