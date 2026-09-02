import type { Metadata } from "next";
import Link from "next/link";
import { FUND } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] items-center bg-white">
      <div className="wrap w-full">
        <p className="eyebrow">404</p>

        <h1 className="t-h1 mt-4 max-w-[16ch] text-ink">
          This page no longer resolves.
        </h1>

        <p className="t-body mt-5 max-w-[46ch]">
          The address you followed has moved or never existed. Everything
          current lives on the {FUND.mark} home page.
        </p>

        <Link href="/" className="btn btn-primary mt-9">
          Back to {FUND.mark}
        </Link>
      </div>
    </main>
  );
}
