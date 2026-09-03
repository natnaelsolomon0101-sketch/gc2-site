import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { site, siteUrl } from "@/config/site";
import { fund } from "@/config/fund";

/**
 * TEAM
 *
 * `fund.people` is null, so nobody is named here. That is not a gap waiting
 * for filler: a name, a title and a two-line biography are the single easiest
 * things on a fund site to invent and the single hardest for a reader to
 * check, and an allocator who later finds a fabricated seat stops believing
 * the rest of the site.
 *
 * So the page renders what is structurally true today — which seats exist,
 * what each one holds, and what a reader should demand of a bio once one
 * appears — and the roster block below it renders ONLY when people exist.
 * With null it is absent from the DOM, not hidden and not stubbed.
 *
 * Fill `fund.people` in src/config/fund.ts and the roster appears; nothing
 * else needs editing.
 */

export const metadata: Metadata = {
  /* Bare title. The root layout's template is `%s — ${site.name}`, so passing
     the suffix here rendered "Team — Girls Can Trade 2 — Girls Can Trade 2".
     Every other page passes a bare title; this was the one that did not. */
  title: "Team",
  description:
    "The seats that exist at the firm, what each one holds, and what a reader should demand of a biography.",
};

/* AboutPage / Organization JSON-LD, round 4 (search): same shape as /firm's
   — foundingDate from `site.foundedISO`, foundingLocation "Miami" — and for
   the same reason nothing here names a person: `fund.people` is null, and
   this whole page's argument is that a seat is described before anyone
   holds it, so structured data naming someone the visible page does not
   would contradict the page it sits on. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    alternateName: site.mark,
    url: siteUrl,
    foundingDate: site.foundedISO,
    foundingLocation: { "@type": "Place", name: "Miami" },
  },
};

/** Seats, not people. Each line is already true elsewhere on the site:
 *  the authority split is /governance, the owner rule is /approach. */
const SEATS = [
  {
    seat: "The author of an idea",
    holds: "Writes the claim down with the evidence that would kill it, and defends it in front of the room.",
  },
  {
    seat: "The named owner of a position",
    holds: "Sizes within the limits the Investment Committee set, and carries the position by name rather than by house view.",
  },
  {
    seat: "Risk",
    holds: "Reports outside the desk and can cut any position without the desk agreeing. The authority is not advisory.",
  },
  {
    seat: "The Investment Committee",
    holds: "Sets mandate and limits. It does not pick trades, and it cannot switch off the tail overlay.",
  },
  {
    seat: "The administrator",
    holds: "Strikes the official mark. It sits outside the firm, and the firm cannot overwrite it.",
  },
] as const;

/** What a reader should refuse to accept a biography without. */
const DEMANDS = [
  {
    q: "What does this person decide?",
    a: "A title is not an authority. The useful question is which of the decisions on the governance page this person holds, and which they do not.",
  },
  {
    q: "What can they be overruled on, and by whom?",
    a: "A seat nobody can overrule is a key-person risk described in flattering language.",
  },
  {
    q: "Where were they before, and is it checkable?",
    a: "A prior firm and a set of dates a reference call can confirm. A list of impressive names with no role attached is decoration.",
  },
  {
    q: "What happens to the book if they are gone?",
    a: "Not the reassurance, the mechanics: who has access, who has authority on the day, and what the fund documents commit the manager to.",
  },
] as const;

/* Same inner-route primitives and the same 5/7 split as `/firm`
   (`container-gc2` / `grid-gc2` / `.t-h2`), not the home page's `wrap`/`band`/
   `.t-heading-lg` this component shipped with — the two inner routes this
   agent owns read as one template rather than two. The split is 5/7 only at
   ≥1024: `grid-gc2` is already 12 columns at ≥768, so the `md:col-span-12`
   bridge keeps the pair stacked through tablet, and `break-after-avoid` on
   the left column keeps the h2 from ever being the last line visible on a
   screen with none of its own content.

   Band alternates ground / ground-2, and (light canvas) every band also
   carries its own top hairline: the ground->ground-2 step measures 1.10, so
   per DESIGN.md a colour step alone does not read as a band boundary — it
   needs the hairline too. */
function Band({
  n,
  label,
  title,
  children,
  ground,
}: {
  n: number;
  label: string;
  title: string;
  children: React.ReactNode;
  ground: boolean;
}) {
  return (
    <section className={ground ? "bg-ground-2" : ""}>
      <Container>
        <div className="grid-gc2 py-16 md:py-24 rule-t">
          <div className="col-span-4 md:col-span-12 lg:col-span-5 break-after-avoid">
            <p className="t-mono-xs text-ink-3">
              {String(n).padStart(2, "0")}
            </p>
            <h2 className="t-h2 mt-3">{title}</h2>
            <p className="t-mono-xs mt-5">{label}</p>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function TeamPage() {
  const people = fund.people;

  // Ordinals are the rendered index, so the roster's absence leaves no gap.
  const bands = [
    { key: "seats", label: "Seats", title: "What the seats are" },
    ...(people && people.length
      ? [{ key: "roster", label: "Roster", title: "Who holds them" }]
      : []),
    { key: "bios", label: "Reading a bio", title: "What to demand of a name" },
    { key: "naming", label: "Naming", title: "Why nobody is named yet" },
  ];
  const index = (key: string) => bands.findIndex((b) => b.key === key) + 1;
  const dark = (key: string) => index(key) % 2 === 0;

  return (
    /* A fragment, not <main>. layout.tsx already renders <main id="main"> around
       every page, and this was nesting a second landmark inside it — which
       breaks landmark navigation and leaves the layout's skip link pointing at
       one of two mains. Every other route file returns a fragment. */
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Team"
        title="The people."
        standfirst={`${site.name} is small on purpose, and a small firm is mostly its judgement. This page is about who holds which decision. Where a name is not published yet, the seat is still described, because the seat is the part an allocator actually has to price.`}
      />

      <Band
        n={index("seats")}
        ground={dark("seats")}
        label="Seats"
        title="What the seats are"
      >
        <dl className="rule-t">
          {SEATS.map((s) => (
            <div key={s.seat} className="rule-b py-6">
              <dt className="t-heading-sm text-ink">{s.seat}</dt>
              <dd className="t-body measure-body mt-3">{s.holds}</dd>
            </div>
          ))}
        </dl>
        <p className="t-small measure-body mt-8">
          One person can hold more than one of these, and at a firm this size
          somebody does. That is a fact about concentration, not a compliment
          about range, and it is why{" "}
          <Link href="/firm" className="link">
            the firm page
          </Link>{" "}
          treats key-person risk as a cost of staying small rather than a
          detail.
        </p>
      </Band>

      {people && people.length ? (
        <Band
          n={index("roster")}
          ground={dark("roster")}
          label="Roster"
          title="Who holds them"
        >
          <dl className="rule-t">
            {people.map((p) => (
              <div key={p.name} className="rule-b py-8">
                <dt>
                  <span className="t-mono-xs block text-ink-3">{p.role}</span>
                  <span className="t-h3 mt-2 block text-ink">{p.name}</span>
                </dt>
                <dd className="t-body measure-body mt-4">{p.bio}</dd>
                {p.priorFirms.length ? (
                  <dd className="t-small mt-3">
                    Previously {p.priorFirms.join(", ")}.
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        </Band>
      ) : null}

      <Band
        n={index("bios")}
        ground={dark("bios")}
        label="Reading a bio"
        title="What to demand of a name"
      >
        <dl className="rule-t">
          {DEMANDS.map((d) => (
            <div key={d.q} className="rule-b py-6">
              <dt className="t-heading-sm text-ink">{d.q}</dt>
              <dd className="t-body measure-body mt-3">{d.a}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band
        n={index("naming")}
        ground={dark("naming")}
        label="Naming"
        title="Why nobody is named yet"
      >
        <div className="measure-body">
          <p className="t-prose">
            A name, a title and two lines of biography are the easiest things on
            a fund site to write and the hardest for a reader to check. They are
            also the first thing a diligence process verifies, which is the
            right way round.
          </p>
          <p className="t-prose mt-6">
            So this page carries none until the firm publishes them, rather than
            carrying a placeholder that would read as a roster. The seats above
            are real and are described the same way{" "}
            <Link href="/governance" className="link">
              governance
            </Link>{" "}
            describes them: by what they hold, and by who can overrule them.
          </p>
          <p className="t-prose mt-6">
            Names, roles and prior firms go up when the firm publishes them, and
            they are confirmed in diligence rather than taken from a public page
            in either case.
          </p>
        </div>
      </Band>
    </>
  );
}
