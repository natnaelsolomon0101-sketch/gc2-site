import Link from "next/link";

export default function Button({
  href, children, inverted = false,
}: { href: string; children: React.ReactNode; inverted?: boolean }) {
  return (
    <Link href={href} className={`btn ${inverted ? "btn-inverted" : ""}`}>
      {children}
    </Link>
  );
}
