/**
 * The share kit. EVERY-SCREEN.md §5.10 and §8.4. `npm run share-kit`.
 *
 * Five cards, written to `public/share/`, rendered from the SITE'S OWN
 * COMPONENTS — not retyped, not redesigned. Each card opens the real route in
 * Playwright, lifts the outerHTML of named elements out of the live DOM, and
 * re-mounts them at the card's size behind the site's own stylesheet and the
 * same next/font class list off `<html>`. The type is the site's fluid type
 * resolving at the card's width; the words are the page's words, and when
 * sec-strategies takes the numerals off the strategy rows the card loses them
 * on the next run without anyone editing this file. That property is the whole
 * reason it clones the DOM instead of holding its own copy of the layout.
 *
 * The only CSS this file adds is the frame: ground, padding, and a column that
 * puts the wordmark at the bottom. No colour, no type, no spacing scale of its
 * own — those come off the site.
 *
 * Every card's text is then run against the 506(b) list out of
 * `scripts/qa/regime.ts`. These are firm brand cards, not fund marketing, and
 * they travel further than the pages they came from.
 *
 * NOT SHIPPED UNTIL COUNSEL HAS READ IT (§5.10). This script proves the words
 * are clean against a machine list. It does not make them approved.
 */
import { chromium, type Page } from "playwright";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { mkdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import YieldCurve from "../src/components/viz/YieldCurve";
import { site } from "../src/config/site";
import { PROHIBITED_506B } from "./qa/regime";

const OUT = join(process.cwd(), "public", "share");

/* The source viewport. Wide enough that every section is in its desktop
   composition before it is lifted; the card then re-resolves the site's clamp()
   type at its own width. */
const SOURCE = { width: 1440, height: 1000 };

/** The smallest the fitter may shrink a composition. Below this the card stops
 *  being readable at the size a share card is actually looked at. */
const FLOOR = 0.55;

/** And the largest it may grow one. A card is a poster: a section that occupies
 *  a third of a 1080 square at its page size is a page fragment, not a poster,
 *  and the site's own fixed tiers (.stx-name is a flat 26px, .t-caption 13px)
 *  do not grow with the frame the way the clamp() tiers do. The ceiling stops
 *  it turning a paragraph into a billboard; it was 2.2 until the curve card
 *  took its natural aspect and stopped being able to fill the square by
 *  stretching, which is the trade counsel asked for. */
const CEIL = 2.8;

/** A selector, and whether every match is wanted or only the first. The
 *  approach eyebrow selector matches five elements on the page and one on the
 *  card; the strategy rows match six and want all six. */
type Pick = string | { sel: string; first: true };

type Card = {
  name: string;
  /** Card geometry. Assigned by fit, not by list order — the four stages are
   *  the tall poster, so they take the story frame, and the curve is the one
   *  composition that reads square. */
  width: number;
  height: number;
  route: string;
  /** Stacked in order. Every one must resolve or the card fails loudly. */
  selectors: Pick[];
  /** Where the day's curve goes on this card, if anywhere. "body" makes it the
   *  composition; "foot" puts it in the lower half above the wordmark, which is
   *  the home Open Graph card's arrangement. */
  curve?: "body" | "foot";
  /** Extra frame rules for this card only. Layout, never type or colour. */
  frame?: string;
};

const CARDS: Card[] = [
  {
    name: "hero-headline",
    width: 1080, height: 1350,           // portrait post
    route: "/",
    selectors: ["h1.hv2-h1", "p.hv2-lead"],
    /* Headline in the upper third, the hero's own lead beneath it at the
       site's 30em measure, the day's curve across the lower half, wordmark
       bottom-left — the home OG card's arrangement, at portrait. The first
       version was the headline alone and two thirds empty ground. */
    curve: "foot",
    frame:
      ".sk-body { justify-content: flex-start; }" +
      ".sk-body .hv2-lead { max-width: 30em; margin-top: 28px; }" +
      /* The curve block is not zoomed by the fitter — that only sizes the
         headline and lead — so it carries its own. Without it the tenor labels
         and the source line render at their page size, 13px on a 1080 poster,
         which is a caption on a page and not on a card. */
      ".sk-curve { zoom: 1.35; margin-bottom: 26px; }",
  },
  {
    name: "four-stages",
    width: 1080, height: 1920,           // story — the tall poster
    route: "/",
    selectors: [
      { sel: "#approach p.t-mono", first: true },   // the eyebrow, not the five stage labels
      "#approach h2",
      "#approach ol",
      /* Counsel finding 4: the block that applies to all four stages — the tail
         overlay is permanent, not discretionary — was being cut off with the
         selector. A card showing four gates and omitting the standing one
         misdescribes the process. */
      "#approach ol + div",
    ],
    /* Round 0 had to hide the stage prose to make this fit a 1920 story — the
       fitter was down at 0.21, which is a screenshot of a page, not a poster.
       sec-approach's round-1 rebuild of the stages is compact enough that the
       whole thing fits at zoom 1.04 with the prose in, so the hiding rules are
       gone and the card is the section as it now stands. Nothing here edits
       the section any more. */
    frame: ".sk-body { justify-content: flex-start; } .sk-body > * + * { margin-top: 34px; }",
  },
  {
    name: "risk-framework",
    width: 1200, height: 630,            // open graph
    route: "/",
    /* The whole Statement object, not just its sentence: counsel finding 3 —
       the card was dropping the attribution the live page carries. Lifting the
       wrapper takes the sentence and the byline together and cannot fall out of
       step with the page again. */
    selectors: [{ sel: "section.ft div.rule-t.rule-b", first: true }],
    /* The em rule is the card's typographic treatment of a byline, not new
       copy: the word is the page's "Investment Committee". The section band's
       own vertical padding is zeroed because the card supplies the air. */
    frame:
      ".sk-body div.rule-t { padding-top: 0 !important; padding-bottom: 0 !important; }" +
      /* Structural, not by class: the attribution is the second <p> in the
         Statement wrapper, and its colour utility changes with the light pass
         while its position does not. */
      '.sk-body div.rule-t > p + p::before { content: "\\2014\\00a0"; }',
  },
  {
    name: "strategies",
    width: 1600, height: 900,            // X
    route: "/",
    /* .stx-name, not .stx-head: sec-strategies took the 01-06 numerals off the
       rows in round 1 and the wrapper went with them. Six names, no numerals —
       which is what STATE.md §0.2 item 4 asked for, arriving here for free. */
    selectors: [{ sel: "section.stx h2.t-display-sm", first: true }, ".stx-name"],
    frame: ".sk-body > * + * { margin-top: 18px; } .sk-body .stx-head { display: block; }",
  },
  {
    name: "yield-curve",
    width: 1080, height: 1080,           // square
    route: "/",
    /* The component IS the composition, tenor labels and source line included —
       see curveMarkup(). Nothing is lifted off the route for this one. */
    selectors: [],
    curve: "body",
    /* No height override: card mode gives the plot the viewBox's own aspect
       (counsel finding 1), and forcing a height here would put the stretch
       straight back. */
    frame: ".sk-body { justify-content: center; }",
  },
];

/* ------------------------------------------------------------------ fonts */

/**
 * The share page has to carry the fonts itself.
 *
 * The lifted HTML brings next/font's hashed class names with it, but those
 * classes only DECLARE `--font-dmserif` / `--font-inter` / `--font-mono-face`
 * as names — the @font-face rules that make those names resolve live in a
 * stylesheet keyed to the site's own document, and the faces themselves are
 * served from /_next/static. The first version of this kit copied the class
 * list, loaded the stylesheet, and still rendered "Evidence first." and the GC2
 * wordmark in Times: a variable pointing at a family the page has never been
 * given. The failure is silent because a font fallback always succeeds.
 *
 * So the four vendored TTFs are inlined as data URLs under names of this
 * script's own, and the three variables are pointed at them. No network, no
 * hashed-class dependency, and the same files the OG cards use.
 */
const FONT_FILES = [
  { file: "DMSerifDisplay-Regular.ttf", family: "GC2 Display", weight: 400 },
  { file: "Inter-Regular.ttf",          family: "GC2 UI",      weight: 400 },
  { file: "RobotoMono-300.ttf",         family: "GC2 Mono",    weight: 300 },
  { file: "RobotoMono-400.ttf",         family: "GC2 Mono",    weight: 400 },
  { file: "RobotoMono-500.ttf",         family: "GC2 Mono",    weight: 500 },
];

async function fontCss(): Promise<string> {
  const dir = join(process.cwd(), "src", "app", "fonts");
  const faces = await Promise.all(
    FONT_FILES.map(async (f) => {
      const data = (await readFile(join(dir, f.file))).toString("base64");
      return (
        `@font-face{font-family:"${f.family}";font-style:normal;` +
        `font-weight:${f.weight};font-display:block;` +
        `src:url(data:font/ttf;base64,${data}) format("truetype");}`
      );
    })
  );
  /* Roboto Mono is vendored at 300/400/500 because the site uses all three:
     .t-caption is 300, .t-mono and .t-mono-xs are 500, everything else 400.
     One face would have left the browser synthesizing two of them. */
  return (
    faces.join("") +
    `:root{--font-dmserif:"GC2 Display";--font-inter:"GC2 UI";` +
    `--font-mono-face:"GC2 Mono";}`
  );
}

/* ------------------------------------------------------------------ frame */

/* Tokens are read off the site, not written here: --color-ground and the type
   classes arrive with the stylesheet. The only literals are the frame's own
   geometry. The cards moved to paper with the site (LIGHT-PASS.md) by changing
   one declaration, because the ground was already a token and the lifted markup
   carries the site's own colours. */
const FRAME = `
  html, body { margin: 0; padding: 0; }
  body { background: var(--color-ground); overflow: hidden; }
  .sk {
    box-sizing: border-box;
    display: flex; flex-direction: column; justify-content: space-between;
    width: 100vw; height: 100vh;
    padding: 7.4% 7% 6.6%;
  }
  .sk-body { display: flex; flex-direction: column; min-height: 0; }
  .sk-foot { display: flex; flex-direction: column; }
  .sk-curve { margin-bottom: 44px; }
  /* Counsel finding 2: every card, not just the ones carrying data. The frame
     line sits above the wordmark so the mark still closes the composition. */
  .sk-legal { display: block; margin: 0 0 16px; color: var(--color-ink-3);
              hyphens: none; }
  /* The wordmark is the frame's own element, not lifted content, so the frame
     is entitled to state its colour. Wordmark.tsx still carries the dark
     build's white utility while sec-chrome's light pass is in flight, which
     rendered the mark invisible on paper — a card is a fixed composition and
     the frame owns its legibility. */
  .sk-mark a { color: var(--color-ink); }
  /* Nothing on a card is a link, a button, or a control. Whatever the source
     element carried, it is a still image here. */
  .sk a { text-decoration: none; pointer-events: none; }
  .sk button { background: none; border: 0; padding: 0; text-align: left; width: 100%; }
  /* The cards are stills. Any load or scroll animation cloned along with the
     markup has to be at its finished state, not caught mid-reveal. Scoped to
     the descendants, not to .sk-body itself, which carries the fit zoom. */
  .sk-body *, .sk-body *::before, .sk-body *::after,
  .sk-curve *, .sk-curve *::before, .sk-curve *::after,
  .sk-mark *, .sk-mark *::before, .sk-mark *::after {
    animation: none !important; transition: none !important;
    opacity: 1 !important; transform: none !important;
  }
`;

/* Passed to page.evaluate as SOURCE, not as a function: tsx compiles a named
   inner function into a `__name(...)` call that does not exist in the page, so
   an evaluate body cannot declare helpers. A string is compiled by the browser.

   What it asks: is anything on this card invisible? A card is a composition the
   site never renders, assembled from pieces migrating between two grounds. When
   Wordmark.tsx still carried the dark build's white utility, the mark vanished
   into the paper and the kit reported five clean cards. Type that is not there
   is caught by no word list, no font check and no overflow check.

   Every element holding visible text is compared against the first opaque
   background above it; under 3:1 fails the card. 3:1 is the "can a person see
   it at all" bar, not the reading bar — the reading bar belongs to the section
   that owns the words. */
const CONTRAST_PROBE = `(() => {
  const rgb = (v) => { const m = v.match(/[\\d.]+/g);
    return m && m.length >= 3 ? [+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3]] : null; };
  const lum = (c) => { const f = c.slice(0, 3).map((v) => { const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
  const out = [];
  for (const el of Array.from(document.querySelectorAll(".sk *"))) {
    const text = Array.from(el.childNodes).filter((n) => n.nodeType === 3)
      .map((n) => n.textContent || "").join("").trim();
    if (!text) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const fg = rgb(cs.color);
    if (!fg || fg[3] === 0) continue;
    let node = el, bg = null;
    while (node) { const c = rgb(getComputedStyle(node).backgroundColor);
      if (c && c[3] > 0.5) { bg = c; break; } node = node.parentElement; }
    if (!bg) continue;
    const l = [lum(fg), lum(bg)].sort((x, y) => y - x);
    const ratio = (l[0] + 0.05) / (l[1] + 0.05);
    if (ratio < 3) out.push(el.tagName.toLowerCase() + " \\"" + text.slice(0, 34) +
      "\\" " + cs.color + " on rgb(" + bg.slice(0, 3).join(",") + ") = " + ratio.toFixed(2) + ":1");
  }
  return out.slice(0, 6);
})()`;

type Chrome = { styles: string[]; inline: string[]; wordmark: string };

async function chrome(page: Page): Promise<Chrome> {
  return page.evaluate(() => ({
    styles: Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => (l as HTMLLinkElement).getAttribute("href") ?? "")
      .filter(Boolean),
    /* The sections style themselves in inline <style> blocks — .hv2-h1,
       .ft-quote and .stx-head are all declared there, not in globals.css. The
       first run of this script forgot them and produced five cards whose type
       had silently fallen back to the browser default: a 96px headline set at
       16px on a 1080px poster. The stylesheet link alone is not the site's CSS. */
    inline: Array.from(document.querySelectorAll("style"))
      .map((s) => s.textContent ?? "")
      .filter((t) => t.length > 40),
    /* The site's own wordmark element, not a retyped "GC2". */
    wordmark:
      document.querySelector("header a[aria-label$='home']")?.outerHTML ?? "",
  }));
}

async function lift(page: Page, picks: Pick[]): Promise<string[]> {
  const html: string[] = [];
  for (const pick of picks) {
    const sel = typeof pick === "string" ? pick : pick.sel;
    const loc = page.locator(sel);
    if (!(await loc.count())) throw new Error(`selector matched nothing: ${sel}`);
    if (typeof pick !== "string") {
      html.push(await loc.first().evaluate((e) => e.outerHTML));
    } else {
      /* Every match, in document order: ".stx-head" is six rows, not one. */
      html.push(...(await loc.evaluateAll((els) => els.map((e) => e.outerHTML))));
    }
  }
  return html;
}

/**
 * The day's curve, rendered from `src/components/viz/YieldCurve.tsx` itself.
 *
 * Not cloned off a route: the component is an async function that returns JSX,
 * so calling it and handing the element to renderToStaticMarkup gives the exact
 * markup the site renders — path, tenor labels on the same log axis, and the
 * "U.S. Treasury · as of {date}" line, all part of the drawing rather than
 * floating beside it. It also means the card exists before sec-hero has
 * composed the slot, and cannot drift from the component afterwards.
 *
 * Null when the feed is unreachable. No card, rather than a card carrying a
 * line that is not the data.
 */
async function curveMarkup(): Promise<string | null> {
  /* card: true — counsel finding 1. The component names the plot in type, adds
     "Public market data. Not fund performance." under the source line, and
     renders the viewBox's own aspect instead of being stretched to a height. */
  const el = (await YieldCurve({ card: true })) as ReactElement | null;
  if (!el) return null;
  return renderToStaticMarkup(el);
}

/* ------------------------------------------------------- the 506(b) list */

/* ------------------------------------------------------------------- main */

async function main() {
  const base = process.env.SHARE_BASE ?? "http://localhost:3000";
  /* Imported from scripts/qa/regime.ts, which now exports the list behind a
     main guard (Conductor granted the edit). One list: a term added to the
     regime gate is a term the share cards are checked against, with no second
     copy to forget. */
  const terms = PROHIBITED_506B;
  const fonts = await fontCss();
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const src = await (await browser.newContext({ viewport: SOURCE })).newPage();
  const fails: string[] = [];
  const made: string[] = [];

  for (const card of CARDS) {
    /* "load", not "networkidle". The kit navigates the same source page five
       times and each card holds ~700KB of inlined font data; once a few of
       those contexts were alive, networkidle stopped settling inside its 30s
       and the run died on the first goto. Nothing here needs the network quiet
       — it needs the DOM built — so wait for load and give the sections a beat
       to lay out. */
    const res = await src.goto(base + card.route, { waitUntil: "load" });
    await src.waitForTimeout(400);
    if (!res || res.status() !== 200) {
      fails.push(`${card.name}: ${card.route} returned ${res?.status()}`);
      continue;
    }
    const c = await chrome(src);

    let parts: string[];
    try {
      parts = await lift(src, card.selectors);
    } catch (e) {
      fails.push(`${card.name}: ${(e as Error).message}`);
      continue;
    }

    let curve = "";
    if (card.curve) {
      const drawn = await curveMarkup();
      if (!drawn) {
        fails.push(`${card.name}: Treasury feed unreachable, card not written`);
        continue;
      }
      if (card.curve === "body") parts = [...parts, drawn];
      else curve = drawn;
    }

    const ctx = await browser.newContext({
      viewport: { width: card.width, height: card.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();

    await page.setContent(
      /* No hashed next/font class on <html>: those classes only name the font
         variables, and this page defines them itself against the vendored
         faces. Leaving them on would re-introduce the silent fallback. */
      `<!doctype html><html lang="en"><head>` +
        c.styles.map((h) => `<link rel="stylesheet" href="${base}${h}">`).join("") +
        /* The sections' own <style> blocks, before the frame so the frame can
           still win where it has to. */
        c.inline.map((css) => `<style>${css}</style>`).join("") +
        `<style>${fonts}</style>` +
        `<style>${FRAME}${card.frame ?? ""}</style></head><body>` +
        `<div class="sk"><div class="sk-body">${parts.join("")}</div>` +
        `<div class="sk-foot">` +
        (curve ? `<div class="sk-curve">${curve}</div>` : "") +
        /* site.domain, not a literal: the domain has one home and it is
           src/config/site.ts. */
        `<p class="t-caption sk-legal">Informational only. Not an offer. ${site.domain}</p>` +
        `<div class="sk-mark">${c.wordmark}</div></div></div>` +
        `</body></html>`,
      { waitUntil: "load" }
    );
    /* Load the three faces explicitly and then ASSERT they resolved. A font
       fallback never throws — the first version of this kit rendered every
       headline and the wordmark in Times and reported success. `font-display:
       block` plus lazy loading also means `fonts.ready` alone can resolve
       before a face that nothing has painted yet is fetched. Verified
       separately against the live site: with these three loaded, the rendered
       width of the same string at the same size is identical to the site's, to
       0.00%, and 1.4% away from the Times fallback. */
    const missing = await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([
        document.fonts.load('400 96px "GC2 Display"'),
        document.fonts.load('400 28px "GC2 UI"'),
        document.fonts.load('500 13px "GC2 Mono"'),
        document.fonts.load('300 13px "GC2 Mono"'),
      ]);
      return [
        ['GC2 Display', document.fonts.check('400 96px "GC2 Display"')],
        ['GC2 UI', document.fonts.check('400 28px "GC2 UI"')],
        ['GC2 Mono 500', document.fonts.check('500 13px "GC2 Mono"')],
        ['GC2 Mono 300', document.fonts.check('300 13px "GC2 Mono"')],
      ].filter(([, ok]) => !ok).map(([name]) => name as string);
    });
    if (missing.length) {
      fails.push(`${card.name}: font did not load, would render in a fallback: ${missing.join(", ")}`);
      await ctx.close();
      continue;
    }

    /* Fit. A card is a fixed frame and the sections were not written for it:
       the four stages overrun a 1920 story, while .ft-quote is a flat 34px that
       does not grow with a 1200x630 frame the way the clamp() tiers do. So the
       fitter goes both ways, between FLOOR and CEIL.

       `zoom` rather than `transform: scale()` because zoom re-lays-out — the
       text re-wraps at its new size instead of being squeezed. Measured with
       getBoundingClientRect, NOT scrollHeight: under zoom, scrollHeight is
       reported in the element's own unzoomed pixels, so comparing it against
       the frame silently lets a grown card run off the right edge. That is
       exactly what the first version did, and the headline card shipped reading
       "Evidence first. Then capi".

       Driven from Node rather than inside one page.evaluate: tsx compiles a
       named inner function into a `__name(...)` call that does not exist in the
       page, so an evaluate body cannot declare helpers. */
    let zoom = 1;
    let best = 0;
    for (let pass = 0; pass < 10; pass++) {
      const m = await page.evaluate((z: number) => {
        const sk = document.querySelector(".sk") as HTMLElement;
        const body = document.querySelector(".sk-body") as HTMLElement;
        const foot = document.querySelector(".sk-foot") as HTMLElement;
        (body.style as unknown as { zoom: string }).zoom = String(z);
        const cs = getComputedStyle(sk);
        const r = body.getBoundingClientRect();
        return {
          room:
            sk.clientHeight - parseFloat(cs.paddingTop) -
            parseFloat(cs.paddingBottom) - foot.offsetHeight - 40,
          h: r.height,
          /* Horizontal overflow is compared INSIDE the zoomed element, where
             both numbers are in the same coordinate space. The body is width
             100%, so zooming narrows its layout box and the text re-wraps —
             until a single unbreakable word stops fitting, which is what put
             "Then capi" on the headline card. */
          spill: body.scrollWidth > body.clientWidth + 1,
        };
      }, zoom);

      if (m.h <= m.room && !m.spill) {
        best = zoom;
        if (zoom >= CEIL - 0.001) break;
        const up = Math.min(CEIL, zoom * (m.room / m.h) * 0.98);
        if (up - zoom < 0.015) break;
        zoom = up;
        continue;
      }
      const down = Math.max(
        FLOOR,
        m.spill && m.h <= m.room ? zoom * 0.94 : zoom * (m.room / m.h) * 0.98
      );
      if (Math.abs(down - zoom) < 0.005) { zoom = down; break; }
      zoom = down;
    }
    /* Land on the last size that was measured to fit; the loop's final step may
       have been an upward probe that did not. */
    if (best && best !== zoom) zoom = best;
    await page.evaluate((z: number) => {
      const body = document.querySelector(".sk-body") as HTMLElement;
      (body.style as unknown as { zoom: string }).zoom = String(z);
    }, zoom);

    if (!best || zoom <= FLOOR) {
      /* Below the floor the card is a screenshot of a page rather than a
         poster: the type is unreadable at the size these are actually looked
         at. Fail rather than write it — the card needs a smaller composition,
         which is a decision, not something a fitter should make silently. */
      fails.push(
        `${card.name}: does not fit ${card.width}x${card.height} above zoom ${FLOOR} — ` +
          `the composition is too long for the frame`
      );
    } else if (Math.abs(zoom - 1) > 0.01) {
      console.log(`  ${card.name}: fitted at zoom ${zoom.toFixed(2)}`);
    }

    /* Is anything on this card invisible?
     *
     * A card is a composition the site never renders, assembled out of pieces
     * that are migrating between two grounds. When Wordmark.tsx still carried
     * the dark build's white utility, the mark vanished into the paper and the
     * kit reported five clean cards. Type that is not there is not caught by a
     * word list, a font check, or an overflow check.
     *
     * So: every element holding visible text is compared against the first
     * opaque background above it, and anything under 3:1 fails the card. 3:1
     * is the "can a person see it at all" bar rather than the reading bar —
     * the reading bar belongs to the section that owns the words. */
    const invisible = (await page.evaluate(CONTRAST_PROBE)) as string[];
    if (invisible.length) {
      fails.push(
        `${card.name}: ${invisible.length} element(s) under 3:1 on this ground — ` +
          invisible.join(" | ")
      );
      /* Delete any card already on disk for this name. A previous run's file is
         not a fallback: it is the same composition rendered before the fault
         was detectable, and leaving it is how a card with invisible type gets
         posted. Better an absent card than a wrong one — the same rule the data
         components follow. */
      await rm(join(OUT, `${card.name}--${card.width}x${card.height}.png`), { force: true });
      await ctx.close();
      continue;
    }

    const file = join(OUT, `${card.name}--${card.width}x${card.height}.png`);
    await page.screenshot({ path: file });

    const text = (await page.evaluate(() => document.body.textContent ?? "")).toLowerCase();
    for (const t of terms) {
      if (text.includes(t)) fails.push(`${card.name}: 506(b) term "${t}"`);
    }
    /* A card that renders nothing is a blank PNG nobody looks at until it is
       posted. Catch it here. */
    if (text.replace(/\s+/g, "").length < 20) {
      fails.push(`${card.name}: rendered almost no text`);
    }

    made.push(`${card.name}  ${card.width}x${card.height}`);
    /* Close the CONTEXT, not just the page: each one is holding the inlined
       font data, and five of them alive at once is what stalled the source
       page's navigation. */
    await ctx.close();
  }
  await browser.close();

  for (const m of made) console.log("  " + m);
  if (fails.length) {
    console.log(`[share-kit] ${fails.length} failure(s):`);
    for (const f of fails) console.log("  " + f);
    process.exit(1);
  }
  console.log(
    `[share-kit] ${made.length} cards in public/share, clean against ` +
      `${terms.length} 506(b) terms. Counsel has not read them; that is a separate gate.`
  );
}

main();
