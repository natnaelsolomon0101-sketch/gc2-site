import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="bg-paper">
      <Container>
        <div className="section-y">
          <h1 className="t-h1 measure-head-sm text-black">This page is not here.</h1>
          <p className="t-lead measure-lead mt-8 text-slate">
            The address you followed no longer resolves.
          </p>
          <div className="mt-12"><Button href="/">Return home</Button></div>
        </div>
      </Container>
    </section>
  );
}
