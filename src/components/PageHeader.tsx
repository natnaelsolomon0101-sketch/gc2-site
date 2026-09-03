import * as React from "react";
import Container from "./Container";
import RevealLines from "./ui/RevealLines";
import { css } from "@/lib/css";

/* Inner-page header — the Editorial Hero structure (21st "Editorial Hero"
   19075 / "Editorial Image Hero" 19077, docs/v4/refs/21st/editorial-hero.md):
   the eyebrow sits alone in a left column in `.t-caption`, the headline sits
   in a right column with its one operative word italic in deep iris via
   RevealLines, and the lead/caption/quickLink/actions stack under it. Below
   768 both columns collapse to one (the same `grid-gc2` bridge /firm and
   /team already use for their own bands), so the eyebrow simply sits above
   the rest — natural height, no dead air.

   BACKWARD COMPATIBLE ON PURPOSE: this is imported by every inner route
   (firm, team, contact, plus governance, insights, legal, letters,
   partnership, questions, strategies, tearsheet, access, diligence,
   disclosures — sixteen call sites across nine other agents' files). Every
   existing prop keeps its name, type and behaviour; nothing here required a
   caller to change. `accent` is new and optional: the word to set in italic
   deep-iris. Its default is the title's LAST word, so a call site that never
   heard of this redesign still gets exactly one italic word without editing
   a line. `actions` is new and optional too — pill CTAs, rendered only when
   a caller supplies them; no existing call site does, so no route grows a
   button it did not ask for.

   GROUND. A soft iris-haze wash behind the copy (TRANSFORM.md rule 3): a
   `radial-gradient` of `--color-accent-pale-iris` at well under .34 alpha,
   the same recipe HeroV2 uses for `.hv2-wash`, kept far lighter here since
   this ground sits behind SIXTEEN routes' worth of reading, not one hero.

   ACCENT WORD MATCHING. `accent` matches case-insensitively and ignores
   leading/trailing punctuation ("trades" matches "trades."), so a caller can
   pass the bare word from its own title string without reproducing its
   punctuation. If it does not match anything in `title` (or is omitted),
   the last word is used — always exactly one italic word, never zero, never
   two, matching TRANSFORM.md rule 2's "do not italicise two per line."

   VERTICAL RHYTHM, LANDSCAPE PHONES, `quickLink` REORDER, `caption`'s 60ch
   cap and `quickLink`'s 468px cap: unchanged from the previous revision —
   see the git history on this file for the round-by-round reasoning. They
   now live one level deeper, inside the right-hand grid column's own flex
   column, rather than at the top of a single flex column that also held the
   eyebrow — the eyebrow moved to its own grid item, so it no longer needs a
   `mt-*` hack to clear it; the grid's own gap does that. */

const CSS = css`
.ph-frame{position:relative;isolation:isolate;overflow:hidden;background:var(--color-ground);}
.ph-bg{position:absolute;inset:0;pointer-events:none;z-index:0;contain:layout paint style;}
.ph-wash{position:absolute;inset:0;
  background:
    radial-gradient(58% 55% at 86% 8%, rgba(209,201,255,.20) 0%, rgba(209,201,255,.07) 45%, rgba(247,245,240,0) 75%),
    radial-gradient(42% 40% at 4% 96%, rgba(209,201,255,.12) 0%, rgba(247,245,240,0) 70%);}
.ph-h1 em{font-style:italic;color:var(--color-accent-deep-iris);}
.ph-cta{display:flex;flex-wrap:wrap;gap:12px;}
.ph-cta .btn,.ph-cta .btn-ghost{border-radius:999px;}
@media print{
  .ph-bg{display:none !important;}
  .ph-h1 em{color:var(--color-ink) !important;}
}
`;

/** Strips leading/trailing punctuation for matching only; the rendered word
 *  keeps whatever punctuation `title` gave it. */
function normalizeWord(w: string): string {
  return w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").toLowerCase();
}

/** One italic word, deep iris, chosen by `accent` (matched loosely) or, with
 *  no match and no `accent`, the last word — TRANSFORM.md rule 2: exactly
 *  one italic word, never two. */
function titleWithAccent(title: string, accent?: string): React.ReactNode {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return title;
  let idx = words.length - 1;
  if (accent) {
    const target = normalizeWord(accent);
    const found = words.findIndex((w) => normalizeWord(w) === target);
    if (found >= 0) idx = found;
  }
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i === idx ? <em>{w}</em> : w}
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </>
  );
}

export type PageHeaderAction = {
  label: string;
  href: string;
  /** Default "solid" (`.btn`). "ghost" renders `.btn-ghost`. */
  variant?: "solid" | "ghost";
};

export default function PageHeader({
  eyebrow, title, standfirst, caption, quickLink, accent, actions,
}: {
  eyebrow?: string;
  title: string;
  standfirst?: string;
  caption?: string;
  quickLink?: React.ReactNode;
  /** The word in `title` to set in italic deep iris. Default: the last word. */
  accent?: string;
  /** Optional pill CTAs under the header copy. No call site passes these
   *  today, so no route renders any unless it opts in. */
  actions?: PageHeaderAction[];
}) {
  return (
    <section className="ph-frame relative overflow-hidden">
      <style>{CSS}</style>
      <div className="ph-bg" aria-hidden="true">
        <div className="ph-wash" />
      </div>
      <Container className="relative">
        <div
          className="grid-gc2 pt-6 pb-8 md:pt-12 md:pb-14 lg:pt-20 lg:pb-20
                     [@media(max-height:480px)_and_(orientation:landscape)]:pt-3
                     [@media(max-height:480px)_and_(orientation:landscape)]:pb-4"
        >
          <div className="col-span-4 md:col-span-12 lg:col-span-5">
            {eyebrow && <p className="t-caption text-ink-3">{eyebrow}</p>}
          </div>

          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6 flex flex-col items-start">
            <RevealLines
              as="h1"
              from={1}
              className="order-1 ph-h1 t-h1 measure-head [@media(max-height:480px)_and_(orientation:landscape)]:max-w-[22em]"
              lines={[titleWithAccent(title, accent)]}
            />
            {standfirst && (
              <p
                className="order-2 [@media(max-height:480px)_and_(orientation:landscape)]:order-4
                           t-lead measure-lead mt-6 md:mt-8"
              >
                {standfirst}
              </p>
            )}
            {caption && (
              <p className="order-3 t-caption max-w-[60ch] mt-6 md:mt-8">{caption}</p>
            )}
            {quickLink && (
              <div className="order-4 max-w-[468px] mt-6 md:mt-8 [@media(max-height:480px)_and_(orientation:landscape)]:order-2">
                {quickLink}
              </div>
            )}
            {actions && actions.length > 0 && (
              <div className="order-5 ph-cta mt-6 md:mt-8">
                {actions.map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    className={`btn ${a.variant === "ghost" ? "btn-ghost" : ""}`}
                  >
                    {a.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
