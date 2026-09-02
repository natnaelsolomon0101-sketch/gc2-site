import type { Metadata } from "next";
import { FUND } from "@/content/site";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center bg-obsidian">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <p className="eyebrow">404</p>
        <h1 className="ivy t-h mt-6 max-w-[16ch]">This page is not in the book.</h1>
        <p className="body-copy mt-6">The address you followed no longer resolves.</p>
        <a href="/" className={buttonVariants({ variant: "ghost", size: "md" }) + " mt-10"}>
          Back to {FUND.mark}
        </a>
      </div>
    </section>
  );
}
