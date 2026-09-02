import Link from "next/link";

export default function TextLink({
  href, children, onBlack = false, external = false,
}: { href: string; children: React.ReactNode; onBlack?: boolean; external?: boolean }) {
  const cls = `link ${onBlack ? "link-on-black" : ""}`;
  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return <Link href={href} className={cls}>{children}</Link>;
}
