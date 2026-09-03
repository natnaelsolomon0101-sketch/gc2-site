import Link from "next/link";

export function HairlineList({ children }: { children: React.ReactNode }) {
  return <div className="rule-t">{children}</div>;
}

export function HairlineRow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="rule-b block px-2 py-7 transition-colors duration-[var(--dur-fast)] hover:bg-graphite">
      <div className="grid-gc2 items-baseline">{children}</div>
    </Link>
  );
}
