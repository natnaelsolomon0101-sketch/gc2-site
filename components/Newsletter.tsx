"use client";
import { useState } from "react";
import { NEWSLETTER } from "@/content/site";
import Emphasis from "./Emphasis";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-band">
      <div className="mx-auto max-w-[1280px] px-6 py-band-sm md:px-10">
        <div className="grid items-end gap-10 md:grid-cols-2 md:gap-20">
          <h2 className="display h-sub max-w-[20ch]">
            <Emphasis text={NEWSLETTER.heading} word={NEWSLETTER.emphasis} />
          </h2>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
            className="w-full"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="nl-email" className="sr-only">{NEWSLETTER.placeholder}</label>
              <input
                id="nl-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={NEWSLETTER.placeholder}
                className="h-12 flex-1 border-b border-ink bg-transparent px-1 text-[16px] outline-none placeholder:text-ink-45 focus-visible:border-accent"
              />
              <Button type="submit" variant="outline" size="md" className="shrink-0 px-8">
                {NEWSLETTER.cta}
              </Button>
            </div>
            <p aria-live="polite" className="mt-4 text-[13px] text-ink-45">
              {sent ? "Thank you. We will be in touch." : NEWSLETTER.note}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
