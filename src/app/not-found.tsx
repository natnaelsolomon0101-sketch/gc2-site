import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/* Origin ground. `bg-paper` is gone — the body is obsidian; `.t-h1` carries pure
   (19.05:1) and `.t-lead` carries ash (7.20:1), so the explicit `text-black` /
   `text-slate` from the paper build were both wrong and redundant. */
export default function NotFound() {
  return (
    <section>
      <Container>
        <div className="section-y">
          <p className="t-mono text-fog">Error 404</p>
          <h1 className="t-h1 measure-head-sm mt-6">This page is not here.</h1>
          <p className="t-lead measure-lead mt-8">
            The address you followed no longer resolves.
          </p>
          <div className="mt-12"><Button href="/">Return home</Button></div>
        </div>
      </Container>
    </section>
  );
}
