import type { Metadata } from "next";
import { FUND } from "@/content/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <p className="eyebrow">404</p>
        <h1 className="display h-sec mt-6 max-w-[16ch]">This page is not in the book.</h1>
        <p className="body-copy mt-6">The address you followed no longer resolves.</p>
        <a href="/" className="mt-10 inline-flex min-h-11 items-center border border-ink px-7 py-3 text-[14px] transition-colors hover:bg-ink hover:text-white">
          Back to {FUND.mark}
        </a>
      </div>
    </section>
  );
}
