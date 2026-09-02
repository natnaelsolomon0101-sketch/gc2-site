"use client";
import { useState } from "react";
import { NEWSLETTER } from "@/content/site";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="band border-t border-graphite">
      <div className="wrap">
        <div className="mx-auto max-w-[600px] text-center">
          <p className="eyebrow">Newsletter</p>
          <h2 className="ivy t-h-sm mt-6">{NEWSLETTER.heading}</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
                className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <label htmlFor="nl-email" className="sr-only">{NEWSLETTER.placeholder}</label>
            <input id="nl-email" type="email" required value={email}
                   onChange={(e) => setEmail(e.target.value)} placeholder={NEWSLETTER.placeholder}
                   className="w-full rounded-full border border-white bg-transparent py-[10px] pl-5 pr-[10px] text-[14px] text-white outline-none placeholder:text-steel sm:w-[320px]" />
            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">{NEWSLETTER.cta}</Button>
          </form>
          <p aria-live="polite" className="mt-5 text-[14px] text-fog">
            {sent ? "Thank you. We will be in touch." : NEWSLETTER.note}
          </p>
        </div>
      </div>
    </section>
  );
}
