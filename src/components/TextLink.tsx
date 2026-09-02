import Link from "next/link";

export default function TextLink({
  href, children, onBlack = false, external = false, standalone = false,
}: { href: string; children: React.ReactNode; onBlack?: boolean; external?: boolean; standalone?: boolean }) {
  // standalone: its own control (a CTA, a dd) rather than a word inside a
  // sentence. Only those take the 44px target; WCAG 2.5.8 exempts inline links.
  const cls = `link ${onBlack ? "link-on-black" : ""} ${standalone ? "link-block" : ""}`;
  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return <Link href={href} className={cls}>{children}</Link>;
}
