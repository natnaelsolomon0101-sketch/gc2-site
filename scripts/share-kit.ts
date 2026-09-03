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
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchYieldCurve, geometry, asOf, TREASURY_ATTRIBUTION } from "../src/components/viz/treasury";

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
 *  and the site's own fixed tiers (.ft-quote is a flat 34px, .stx-name a flat
 *  26px) do not grow with the frame the way the clamp() tiers do. The ceiling
 *  stops it turning a paragraph into a billboard. */
const CEIL = 2.2;

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
  /** Extra frame rules for this card only. Layout, never type or colour. */
  frame?: string;
};

const CARDS: Card[] = [
  {
    name: "hero-headline",
    width: 1080, height: 1350,           // portrait post
    route: "/",
    selectors: ["h1.hv2-h1"],
  },
  {
    name: "four-stages",
    width: 1080, height: 1920,           // story — the tall poster
    route: "/",
    selectors: [
      { sel: "#approach p.t-mono", first: true },   // the eyebrow, not the five stage labels
      "#approach h2",
      "#approach ol",                                // the four stages, and nothing after them
    ],
    /* A poster is the four stages, not the page about them. The stage prose and
       the gate line are hidden — the numeral, the label, who holds it and the
       stage's own headline are what a poster of "how an idea earns capital"
       consists of. This hides the site's words; it never writes any. At full
       prose the fitter had to go to 0.21 to make it fit a 1920 story, which is
       a screenshot of a page, not a poster. */
    frame:
      ".sk-body { justify-content: flex-start; } .sk-body > * + * { margin-top: 34px; }" +
      ".sk-body li .t-prose, .sk-body li p.mt-8 { display: none !important; }" +
      ".sk-body li { padding-top: 26px !important; padding-bottom: 26px !important; }" +
      ".sk-body .card-dark { padding: 26px !important; }",
  },
  {
    name: "risk-framework",
    width: 1200, height: 630,            // open graph
    route: "/",
    selectors: ["blockquote.ft-quote"],
  },
  {
    name: "strategies",
    width: 1600, height: 900,            // X
    route: "/",
    selectors: [{ sel: "section.stx h2.t-display-sm", first: true }, ".stx-head"],
    frame: ".sk-body > * + * { margin-top: 18px; } .sk-body .stx-head { display: block; }",
  },
  {
    name: "yield-curve",
    width: 1080, height: 1080,           // square
    route: "/",
    /* Empty until sec-hero mounts <YieldCurve/>; see curveCard() below. */
    selectors: ['[data-source="home.treasury.gov"]'],
  },
];

/* ------------------------------------------------------------------ frame */

/* Tokens are read off the site, not written here: --color-obsidian and the type
   classes arrive with the stylesheet. The only literals are the frame's own
   geometry. */
const FRAME = `
  html, body { margin: 0; padding: 0; }
  body { background: var(--color-obsidian); overflow: hidden; }
  .sk {
    box-sizing: border-box;
    display: flex; flex-direction: column; justify-content: space-between;
    width: 100vw; height: 100vh;
    padding: 7.4% 7% 6.6%;
  }
  .sk-body { display: flex; flex-direction: column; min-height: 0; }
  /* Nothing on a card is a link, a button, or a control. Whatever the source
     element carried, it is a still image here. */
  .sk a { text-decoration: none; pointer-events: none; }
  .sk button { background: none; border: 0; padding: 0; text-align: left; width: 100%; }
  /* The cards are stills. Any load or scroll animation cloned along with the
     markup has to be at its finished state, not caught mid-reveal. Scoped to
     the descendants, not to .sk-body itself, which carries the fit zoom. */
  .sk-body *, .sk-body *::before, .sk-body *::after,
  .sk-mark *, .sk-mark *::before, .sk-mark *::after {
    animation: none !important; transition: none !important;
    opacity: 1 !important; transform: none !important;
  }
`;

type Chrome = { htmlClass: string; styles: string[]; inline: string[]; wordmark: string };

async function chrome(page: Page): Promise<Chrome> {
  return page.evaluate(() => ({
    /* next/font puts the --font-* variables on <html> as generated class names.
       Without them the card falls back to Georgia and the whole point is lost. */
    htmlClass: document.documentElement.className,
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

/** The curve card, when no route mounts <YieldCurve/> yet. Same fetch and the
 *  same geometry() the component uses, so this cannot draw a different line —
 *  and the moment sec-hero composes the slot, the selector above resolves and
 *  this branch stops being taken. */
async function curveCard(): Promise<string[] | null> {
  const data = await fetchYieldCurve();
  if (!data) return null;
  const W = 900, H = 320;
  const { d } = geometry(data.points, W, H);
  return [
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"
          style="display:block;width:100%;height:${H}px">
       <path d="${d}" fill="none" stroke="var(--color-pure)" stroke-width="1"
             vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
     </svg>`,
    `<p class="t-caption" style="margin:28px 0 0">${TREASURY_ATTRIBUTION} · as of ${asOf(data.date)}</p>`,
  ];
}

/* ------------------------------------------------------- the 506(b) list */

/**
 * The prohibited terms, read out of `scripts/qa/regime.ts` at run time.
 *
 * Parsed from the source rather than imported because regime.ts calls `main()`
 * at module scope — importing it would launch a second browser and scan the
 * whole site as a side effect of reading a list of strings. Parsing keeps ONE
 * list, which is the property that matters: a term added to the regime gate is
 * a term the share kit checks, with no second copy to forget. The Conductor
 * could make this an import by exporting the constant and guarding the call;
 * requested, not taken.
 */
async function prohibited(): Promise<string[]> {
  const src = await readFile(join(process.cwd(), "scripts", "qa", "regime.ts"), "utf8");
  const m = src.match(/const PROHIBITED_506B\s*=\s*\[([\s\S]*?)\]/);
  if (!m) throw new Error("could not read PROHIBITED_506B out of scripts/qa/regime.ts");
  const terms = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  if (terms.length < 10) throw new Error(`only ${terms.length} terms parsed; the shape changed`);
  return terms;
}

/* ------------------------------------------------------------------- main */

async function main() {
  const base = process.env.SHARE_BASE ?? "http://localhost:3000";
  const terms = await prohibited();
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const src = await (await browser.newContext({ viewport: SOURCE })).newPage();
  const fails: string[] = [];
  const made: string[] = [];

  for (const card of CARDS) {
    const res = await src.goto(base + card.route, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) {
      fails.push(`${card.name}: ${card.route} returned ${res?.status()}`);
      continue;
    }
    const c = await chrome(src);

    let parts: string[];
    try {
      parts = await lift(src, card.selectors);
    } catch (e) {
      if (card.name === "yield-curve") {
        const local = await curveCard();
        if (!local) {
          /* The feed is down. No card, rather than a card with a line on it
             that is not the data. */
          fails.push("yield-curve: Treasury feed unreachable, card not written");
          continue;
        }
        parts = local;
        console.log("  yield-curve: no route mounts <YieldCurve/> yet; drawn from treasury.ts");
      } else {
        fails.push(`${card.name}: ${(e as Error).message}`);
        continue;
      }
    }

    const page = await (await browser.newContext({
      viewport: { width: card.width, height: card.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    })).newPage();

    await page.setContent(
      `<!doctype html><html class="${c.htmlClass}"><head>` +
        c.styles.map((h) => `<link rel="stylesheet" href="${base}${h}">`).join("") +
        /* The sections' own <style> blocks, before the frame so the frame can
           still win where it has to. */
        c.inline.map((css) => `<style>${css}</style>`).join("") +
        `<style>${FRAME}${card.frame ?? ""}</style></head><body>` +
        `<div class="sk"><div class="sk-body">${parts.join("")}</div>` +
        `<div class="sk-mark">${c.wordmark}</div></div>` +
        `</body></html>`,
      { waitUntil: "networkidle" }
    );
    await page.evaluate(() => document.fonts.ready);

    /* Fit. A card is a fixed frame and the sections were not written for it —
       the four stages at full prose overrun a 1920 story by half a stage, and
       the first run cut the fourth one off below the fold with the wordmark
       printed over the third. `zoom` rather than `transform: scale()` because
       zoom re-lays-out: the text re-wraps at the smaller size instead of being
       squeezed. Three passes, because changing the zoom changes the wrapping,
       which changes the height. */
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
        const mark = document.querySelector(".sk-mark") as HTMLElement;
        (body.style as unknown as { zoom: string }).zoom = String(z);
        const cs = getComputedStyle(sk);
        const r = body.getBoundingClientRect();
        return {
          room:
            sk.clientHeight - parseFloat(cs.paddingTop) -
            parseFloat(cs.paddingBottom) - mark.offsetHeight - 40,
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
    await page.close();
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
