import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Access to materials",
  description:
    "Why there is no download and no form on this page, and how an introduction actually works.",
};

/* =============================================================================
   THE GATE — READ BEFORE EDITING THIS FILE

   This is the page most private fund sites get wrong, and it is worth stating
   exactly how, because the wrong version looks more professional than the
   right one.

   Under Regulation D Rule 506(b) the firm may communicate about the fund only
   with investors with whom it has a PRE-EXISTING, SUBSTANTIVE relationship —
   one that existed before the conversation about the fund began, and that is
   substantive enough for the firm to judge eligibility. An email field that
   returns a deck does not create that relationship. Neither does a checkbox
   asserting accredited status, nor a button labelled "request access" that
   grants access in the same second it is pressed. Those produce a record that
   LOOKS like diligence and is not one, and the record is worse than nothing
   because it documents the violation.

   Therefore this page contains, and must continue to contain:
     - NO <form>
     - NO <input>
     - NO <button>, of any type, and certainly none of type="submit"
     - NO checkbox asserting eligibility
     - NO auth system and NO auth dependency
     - NO download, gated or otherwise

   What it contains instead is a mailto: address, an explanation, and a
   sequence that takes time on purpose. The honesty is the signal: a family
   office pitched two hundred times has never seen a manager explain why it
   CANNOT simply hand over the deck.

   `scripts/qa/regime.ts` scans this route, and a separate assertion checks the
   rendered HTML for form, input and submit elements. Both run before commit.
   ========================================================================== */

const SUBJECT = `Introduction — ${site.mark}`;
const MAILTO = `mailto:${site.emails.investors}?subject=${encodeURIComponent(SUBJECT)}`;

const CSS = `
.ac-block{ border-top:1px solid rgba(255,255,255,.12); }
/* An unordered list without bullets: these are things to include in a note,
   not a form to fill in, and a bulleted checklist reads like one. */
.ac-list{ list-style:none; margin:0; padding:0; }
.ac-list li{
  border-top:1px solid rgba(255,255,255,.12);
  padding:16px 0;
  font-size:16px; line-height:1.6; color:var(--color-ash);
}
.ac-list li:last-child{ border-bottom:1px solid rgba(255,255,255,.12); }

/* PageHeader.tsx (sec-firm's, not this file's) opens every inner route with
   80px of padding-block above the eyebrow. Stacked under a 56px sticky nav
   on phone, that reads as dead air before the first word. Tightened here,
   scoped to this route only, since .section-y is not this file's to edit at
   the source. */
@media (max-width:767px){ .section-y{ padding-block:32px 40px; } }
`;

const blocks: { n: string; h: string; p: string[] }[] = [
  {
    n: "01",
    h: "Why there is nothing to download here",
    p: [
      "The partnership relies on Regulation D, Rule 506(b). Under that rule the firm may discuss the fund only with investors with whom it already has a relationship — one that existed before the conversation about the fund began, and that is substantive enough for the firm to form a view on eligibility.",
      "A website cannot create that relationship, and neither can a form. An email field that returns a link, a box you tick to assert your own status, a button marked “request access” that grants it in the same second — none of those establish anything. They produce a record that looks like diligence and is not one.",
      "So the materials are not behind a gate on this page. They are behind a relationship, which is slower, and which is the actual requirement rather than a decorative version of it.",
    ],
  },
  {
    n: "02",
    h: "What a first note should contain",
    p: [],
  },
  {
    n: "03",
    h: "What happens then",
    p: [
      "Each enquiry is read by the people who manage the money. That is the reason this takes time — sometimes a long time — and the reason we would rather not promise a turnaround we would meet only in a quiet month.",
      "If there is a fit, the next step is a conversation rather than a document. Materials come after that, if both sides still think the reading is worth it, and the offering documents govern everything once they arrive.",
      "Eligibility is established through those documents. It is not established by anything anyone ticks on a website, including this one.",
    ],
  },
];

const noteItems = [
  "Who you are, and on whose behalf you are looking.",
  "How you came to the firm, and who introduced us if somebody did.",
  "What you are trying to solve. The problem is more useful to us than the mandate.",
  "The horizon you are working on, in years.",
];

export default function Access() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <PageHeader
        eyebrow="Access"
        title="Access to materials."
        standfirst="There is no download on this page and no form on it. There is a plain explanation of why not, and an address."
      />

      <section>
        <Container>
          <div className="pb-4">
            {blocks.map((b) => (
              <div key={b.n} className="ac-block grid-gc2 py-12 md:py-16">
                <div className="col-span-4 md:col-span-3">
                  <p className="t-mono-xs text-fog">{b.n}</p>
                  <h2 className="t-h3 mt-3">{b.h}</h2>
                </div>
                <div className="col-span-4 md:col-span-8 md:col-start-5">
                  {b.p.map((t, i) => (
                    <p key={i} className={`t-body measure-body ${i ? "mt-5" : ""}`}>
                      {t}
                    </p>
                  ))}

                  {/* A list of things to say in an email. Deliberately not a
                      form: nothing here is captured, validated or required. */}
                  {b.n === "02" && (
                    <>
                      <p className="t-body measure-body">
                        Write it as an email, in your own words. Nothing below is
                        required and nothing is captured anywhere — there is no
                        field on this site to capture it with.
                      </p>
                      <ul className="ac-list measure-body mt-8">
                        {noteItems.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <p className="t-small measure-body mt-8 text-fog">
                        Nothing confidential, and nothing long. A short note is
                        enough; we are not scoring it.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- The address. A mailto, and nothing that behaves like a form. --- */}
      <section className="bg-abyss">
        <Container>
          <div className="grid-gc2 py-16 md:py-24">
            <div className="col-span-4 md:col-span-3">
              <p className="t-mono-xs text-fog">04</p>
              <h2 className="t-h3 mt-3">Introductions</h2>
            </div>
            <div className="col-span-4 md:col-span-8 md:col-start-5">
              <a href={MAILTO} className="btn min-h-11 text-lg">
                {site.emails.investors}
              </a>
              <p className="t-small measure-body mt-6 text-fog">
                The subject line arrives pre-filled as “{SUBJECT}”. If your mail
                client does not open, the address is {site.emails.investors} and
                a plain email works exactly as well.
              </p>
              <p className="t-body measure-body mt-8">
                No terms, fees or figures appear on this website, and none will
                while the partnership relies on 506(b). That is not a temporary
                state pending a redesign — it is the rule, and a site built to
                work around the rule would be telling you something about the
                firm rather than something about the rule.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
