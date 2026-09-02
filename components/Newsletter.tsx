"use client";

import { useState } from "react";
import { NEWSLETTER } from "@/content/site";
import Emphasis from "./Emphasis";

/**
 * Mercury newsletter — a calm closing band on the white canvas.
 * One field, one button, one line of reassurance that becomes the receipt.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="band border-t border-line bg-white">
      <div className="wrap">
        <div className="grid grid-cols-1 items-end gap-y-8 md:grid-cols-12 md:gap-x-10">
        <div className="min-w-0 md:col-span-5">
          <p className="eyebrow">Newsletter</p>

          <h2 className="t-h2 mt-4 max-w-[20ch] text-ink [&_strong]:font-semibold [&_strong]:text-ink">
            <Emphasis text={NEWSLETTER.heading} word={NEWSLETTER.emphasis} />
          </h2>

        </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSent(true);
            }}
            className="mt-0 flex w-full min-w-0 flex-col gap-3 sm:flex-row md:col-span-6 md:col-start-7"
          >
            <div className="min-w-0 flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                {NEWSLETTER.placeholder}
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={NEWSLETTER.placeholder}
                className="h-[46px] w-full rounded-[12px] border border-line bg-white px-4 text-[15px] text-ink transition-colors placeholder:text-muted-2 hover:border-muted-2 focus:border-blue"
              />
            </div>

            <button type="submit" className="btn btn-primary h-[46px] shrink-0">
              {NEWSLETTER.cta}
            </button>
          </form>

          <p aria-live="polite" className="t-cap mt-4 max-w-[52ch]">
            {sent ? "Thank you. We will be in touch." : NEWSLETTER.note}
          </p>
        </div>
      </div>
    </section>
  );
}
