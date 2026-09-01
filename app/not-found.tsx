import type { Metadata } from "next";
import { FUND } from "@/content/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className="nf">
      <div className="wrap">
        <div className="nf-code">404</div>
        <h1>This page is not in the book.</h1>
        <p>The address you followed no longer resolves. Return to the {FUND.mark} homepage.</p>
        <a className="btn btn-primary" href="/">
          Back to {FUND.mark}<span className="arw" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
