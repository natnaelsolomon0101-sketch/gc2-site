import Link from "next/link";

export default function TextLink({
  href, children, onBlack = false, external = false, standalone = false,
}: { href: string; children: React.ReactNode; onBlack?: boolean; external?: boolean; standalone?: boolean }) {
  // standalone: a link that is its own control (a dd, a list row) rather than a
  // word inside a sentence. Only those get the 44px target; forcing it on an
  // inline prose link would break the line box. WCAG 2.5.8 exempts inline links.
  //
  // onBlack: previously emitted `link-on-black`, a class with no rule in
  // globals.css — an invisible no-op. Kept as a prop for call-site stability
  // (nothing currently passes it), but it no longer changes the class: the
  // `.link` tier (ink text, hairline-strong underline) is the one link tier
  // the light canvas defines, and it already clears 4.5:1 on every ground.
  void onBlack;
  const cls = `link ${standalone ? "inline-flex min-h-11 items-center" : ""}`;
  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return <Link href={href} className={cls}>{children}</Link>;
}
