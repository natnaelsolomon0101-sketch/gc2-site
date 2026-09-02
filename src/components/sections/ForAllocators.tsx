import Link from "next/link";
import { allocatorNav } from "@/config/nav";

/**
 * FOR ALLOCATORS — the home page's route into the seven allocator pages.
 *
 * Those pages existed for a while reachable only from the footer, which meant
 * the reader who most needed them was the one least likely to find them. This
 * band is the index: one hairline row per page, each carrying the single
 * question that page actually answers.
 *
 * The rows are DERIVED from `allocatorNav` rather than listed again here, and
 * `assertRowsMatchNav()` throws at module load if the two ever diverge. A
 * hand-kept second list is how a nav entry ends up with no row, or a row ends
 * up pointing at a route that no longer exists — the same class of silent
 * drift the kill list and the regime gate exist to catch.
 *
 * Nothing below is a claim about the fund. Every line describes what its page
 * discusses, and every one of those pages renders nothing where `fund.ts` is
 * null.
 */
const COPY: Record<string, { q: string; a: string }> = {
  "/partnership": {
    q: "How can a family hold capital here?",
    a: "Three structures, what alignment means in each, and how a relationship starts.",
  },
  "/diligence": {
    q: "What will you show me, and when?",
    a: "The document index, what is released on request, and how operations run.",
  },
  "/governance": {
    q: "Who can stop a position?",
    a: "Five decisions and who holds each. Risk reports outside the desk.",
  },
  "/letters": {
    q: "What do you write to investors?",
    a: "What a letter contains, and why none of them sits on a public page.",
  },
  "/tearsheet": {
    q: "Where are the numbers?",
    a: "What a tearsheet carries, what to refuse to accept one without, and why this is not one.",
  },
  "/questions": {
    q: "What should I be asking?",
    a: "The hard questions an allocator asks an emerging manager, answered before they are asked.",
  },
  "/access": {
    q: "How do I actually start?",
    a: "No form and no download. The reason for that, and the address.",
  },
};

/** Fails the build if a nav entry has no row, or a row points nowhere. */
function assertRowsMatchNav(): void {
  const hrefs = allocatorNav.map((n) => n.href);
  for (const href of hrefs) {
    if (!COPY[href]) {
      throw new Error(
        `ForAllocators: allocatorNav has "${href}" but no row copy. Add it to COPY ` +
          `or the home page will silently drop a page an allocator needs.`
      );
    }
  }
  for (const href of Object.keys(COPY)) {
    if (!hrefs.includes(href as (typeof hrefs)[number])) {
      throw new Error(
        `ForAllocators: COPY has a row for "${href}" but allocatorNav does not ` +
          `list it. The row would link to a route nothing else knows about.`
      );
    }
  }
}
assertRowsMatchNav();

/* The headline counts the rows rather than asserting a number. "Seven pages"
   beside a list of six is the kind of small lie nobody edits out, because the
   sentence was true when it was written. */
const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven",
               "eight", "nine", "ten", "eleven", "twelve"] as const;
function count(n: number): string {
  return WORDS[n] ?? String(n);
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export default function ForAllocators() {
  return (
    <section className="bg-abyss" aria-labelledby="allocators-title">
      <div className="wrap band">
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
            <p className="t-mono">For allocators</p>
            <h2 id="allocators-title" className="t-heading-lg mt-5 first-letter:uppercase">
              {count(allocatorNav.length)} pages, {count(allocatorNav.length)} questions.
            </h2>
            <p className="t-sub mt-7 max-w-[34ch] text-ash">
              Written to be read before a first conversation rather than sent after
              one. Where a fact is not yet published, the page says so instead of
              filling the space.
            </p>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <ul className="border-t border-white/12">
              {allocatorNav.map((n) => {
                const { q, a } = COPY[n.href];
                return (
                  <li key={n.href} className="border-b border-white/12">
                    <Link
                      href={n.href}
                      className="group flex min-h-[88px] items-center justify-between gap-6 py-6 transition-colors duration-200 hover:bg-white/5"
                    >
                      <span className="flex flex-col gap-2">
                        <span className="t-mono-xs">{n.label}</span>
                        <span className="t-heading-sm text-pure">{q}</span>
                        <span className="t-small">{a}</span>
                      </span>
                      <Arrow />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
