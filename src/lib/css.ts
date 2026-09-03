/**
 * `css` — the tagged template every section's inline <style> should use.
 *
 * WHY THIS EXISTS. Sections on this site style themselves with an inline
 * <style> built from a template string, and those strings carry the comments
 * that explain the decisions in them. That is the right place for the comments
 * and they should stay — but a template string is shipped verbatim, so every
 * one of those bytes is sent to every reader on every request, uncompressed by
 * anything except transport gzip and re-parsed by the browser. sec-hero found
 * the hero alone was shipping 27KB of comment text into the HTML before it
 * added a strip pass of its own. This is that pass, once, for everyone.
 *
 * HOW TO ADOPT IT. Rename the local template to a constant and tag it:
 *
 *     import { css } from "@/lib/css";
 *     const CSS = css`
 *       .thing { color: var(--color-ink) }   // comments here are free
 *     `;
 *     ...
 *     <style>{CSS}</style>
 *
 * The strip runs ONCE, when the module is first evaluated — `const CSS = css`…``
 * at module scope, never inside the component body, or it runs on every render
 * for a result that cannot change.
 *
 * WHAT IT DOES, AND DELIBERATELY DOES NOT DO. It removes comments and collapses
 * runs of whitespace, and it drops the space on either side of the structural
 * punctuation `{ } ; ,`. That is where nearly all the weight is.
 *
 * It does NOT touch anything else, because a CSS minifier that is clever is a
 * CSS minifier that eventually breaks a rule nobody re-reads:
 *
 *   - spaces around `+ - * /` stay, because `calc(100% - 12px)` is not the same
 *     expression as `calc(100%-12px)`, which is invalid;
 *   - the space after `:` stays, because telling `a :hover` from `a:hover`
 *     needs a selector parser and the saving is one byte a declaration;
 *   - the space before `(` stays, because `@media (min-width: 40em)` is a
 *     media query and `@media(min-width: 40em)` is not;
 *   - quoted strings pass through untouched, so `content: "  "` keeps its
 *     spaces and a comment-opening sequence inside a string is not read as a
 *     comment.
 *
 * Interpolations are inserted first and then stripped with everything else, so
 * a value carrying its own whitespace is normalized like any other. Do not
 * interpolate an untrusted string into a stylesheet; that was already true.
 */

/** Removes CSS comments and redundant whitespace. Quote- and comment-aware. */
export function stripCss(input: string): string {
  /* A hand-rolled pass rather than a regex: `/\*[\s\S]*?\*\//g` cannot tell a
     comment from the same two characters inside a quoted string, and neither
     can a whitespace-collapsing regex tell a meaningful space in `content` from
     an indent. Both cases are rare and both are silent when they go wrong. */
  /* A pending space dies when the character on either side of it is structural
     punctuation: `a { b: c; d: e }` -> `a{b: c;d: e}`. */
  const TIGHTEN = "{};,";

  let out = "";
  let pendingSpace = false;
  let quote: string | null = null;
  let i = 0;

  while (i < input.length) {
    const c = input[i];

    if (quote !== null) {
      out += c;
      if (c === "\\") {
        out += input[i + 1] ?? "";
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i += 1;
      continue;
    }

    if (c === '"' || c === "'") {
      if (pendingSpace && out !== "" && !TIGHTEN.includes(out[out.length - 1])) out += " ";
      pendingSpace = false;
      quote = c;
      out += c;
      i += 1;
      continue;
    }

    if (c === "/" && input[i + 1] === "*") {
      const end = input.indexOf("*/", i + 2);
      i = end === -1 ? input.length : end + 2;
      /* A comment BETWEEN two tokens is a token separator: a comment sitting
         between two class selectors makes them a DESCENDANT pair, and deleting
         it outright would weld them into a single compound selector matching
         something else entirely. So a comment leaves a pending space behind and
         the rules below decide whether that space survives. */
      pendingSpace = true;
      continue;
    }

    if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f") {
      pendingSpace = true;
      i += 1;
      continue;
    }

    if (pendingSpace) {
      const prev = out[out.length - 1] ?? "";
      if (out !== "" && !TIGHTEN.includes(c) && !TIGHTEN.includes(prev)) {
        out += " ";
      }
      pendingSpace = false;
    }
    out += c;
    i += 1;
  }

  return out.trim();
}

/**
 * Tagged template. Interleaves the interpolations, strips once, returns the
 * minified stylesheet.
 */
export function css(strings: TemplateStringsArray, ...values: unknown[]): string {
  let raw = "";
  for (let i = 0; i < strings.length; i++) {
    raw += strings[i];
    if (i < values.length) raw += String(values[i]);
  }
  return stripCss(raw);
}
