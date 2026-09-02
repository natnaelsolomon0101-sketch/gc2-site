/**
 * Print gate.
 *
 * Allocators print these pages. An ODD analyst reads the DDQ on paper, marks it
 * up and takes it into a meeting, and what they take in is whatever the print
 * stylesheet produced — not what the designer saw on a 27" display.
 *
 * The media is EMULATED, not guessed at. `page.emulateMedia({ media: "print" })`
 * makes Chromium resolve `@media print` for real, so every assertion below is a
 * computed style off the live cascade rather than a colour sampled out of a
 * screenshot. Nothing here reads a pixel.
 *
 * MEASURED IN BOTH PRINTER MODES. This is the part that matters and it is easy
 * to get half right:
 *
 *   PAINTED  — the reader ticked "Background graphics". Backgrounds print. This
 *              is the mode where a dark ground empties a toner cartridge.
 *   PAPER    — the default. Chromium drops background colours unless the page
 *              sets `print-color-adjust: exact`, so every background is white
 *              paper and only the ink is printed. This is the mode where white
 *              display type prints white-on-white and the page comes out blank.
 *
 * A page that is correct in only one of the two is broken, because the reader
 * chooses the mode and never tells you which. A print stylesheet that sets a
 * white ground and dark ink is correct in both, which is why both checks can be
 * hard failures without contradicting each other.
 *
 * CHECKS
 *   P1  every <details> on /questions is actually rendered under print (all 25)
 *   P2  nothing visible on screen disappears under print
 *   P3  nothing is clipped: the page is no wider than the sheet, and no line of
 *       type is cut off by a container that cannot be scrolled on paper
 *   P4  no large dark background (PAINTED mode)
 *   P5  every internal link in <main> is still identifiable as a link
 *   P6  no white-on-white or black-on-black text, in EITHER mode
 *
 * Sheet is 816x1056 CSS px — US Letter at 96dpi, which is the width Chromium
 * lays print media out at for this paper size.
 *
 * ROUTE LIST: read from src/app/sitemap.ts, not retyped. See scripts/qa/links.ts
 * for why. Re-exported below.
 */
import { chromium } from "playwright";
import sitemap from "../../src/app/sitemap";
import { siteUrl } from "../../src/config/site";

/** Every public route, in sitemap order. */
export const ROUTES: string[] = sitemap().map((e) => e.url.slice(siteUrl.length) || "/");

/** US Letter at 96dpi. */
const SHEET = { width: 816, height: 1056 };

/**
 * A page is "dark" for toner purposes when a background covers more than a
 * quarter of a sheet and its relative luminance is below the midpoint. A quarter
 * sheet is the point at which a reader notices the cartridge draining; the
 * midpoint is where light-on-dark stops being decorative and becomes the ground.
 */
const DARK_AREA = SHEET.width * SHEET.height * 0.25;
const DARK_LUM = 0.5;

/**
 * Contrast below this is not "hard to read", it is "not there". #ffffff on white
 * is 1.00 and #f5f5f7 on white is 1.09; the site's body ash on white paper is
 * about 2.6, which is poor but legible and is a design argument rather than a
 * gate. 1.5 fails only text that has genuinely vanished.
 */
const INVISIBLE = 1.5;

/** /questions ships 25 answers. A floor, not an equality: adding a question
 *  must not red the build, but losing the accordion must. */
const MIN_DETAILS = 25;

type Finding = { route: string; check: string; detail: string };

async function main() {
  const base = process.env.BASE ?? "http://localhost:3000";
  const findings: Finding[] = [];

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: SHEET });
  // See scripts/qa/links.ts for why this shim is here.
  await ctx.addInitScript(() => {
    (window as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f;
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) {
      findings.push({ route, check: "route did not load", detail: `status ${res?.status() ?? "none"}` });
      continue;
    }

    /* Pass 1, screen media: stamp every text-bearing element with an id and
       record whether it was visible. The page is NOT reloaded before pass 2, so
       the same nodes are re-measured under print and the diff is exact rather
       than a heuristic match on selectors. */
    await page.emulateMedia({ media: "screen" });
    const onScreen: Record<string, boolean> = await page.evaluate(() => {
      const seen: Record<string, boolean> = {};
      let i = 0;
      document.querySelectorAll("body *").forEach((el) => {
        if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName)) return;
        // Own text only: a wrapper div inherits nothing to lose.
        let own = "";
        el.childNodes.forEach((n) => { if (n.nodeType === 3) own += n.nodeValue ?? ""; });
        if (own.trim() === "") return;
        const id = "p" + i++;
        el.setAttribute("data-qa-print", id);
        /* Must be the SAME visibility test the print pass uses, or the diff
           reports the difference between two definitions of "visible" rather
           than the difference between two media. */
        const e = el as HTMLElement & { checkVisibility?: (o?: Record<string, boolean>) => boolean };
        if (typeof e.checkVisibility === "function") {
          seen[id] = e.checkVisibility({
            contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true,
          });
        } else {
          const s = getComputedStyle(el);
          const r = e.getBoundingClientRect();
          seen[id] = s.display !== "none" && s.visibility !== "hidden" && r.width > 0 && r.height > 0;
        }
      });
      return seen;
    });

    await page.emulateMedia({ media: "print" });
    /* Switching media re-runs the cascade, and anything with a `transition` on
       colour is mid-flight for a few frames afterwards. Measuring immediately
       reports the interpolated value (#151515 on its way from ash to black),
       which is a number nobody can act on. 400ms clears the longest transition
       on the site (180ms) with room to spare. */
    await page.waitForTimeout(400);

    const hits: { check: string; detail: string }[] = await page.evaluate(
      ({ onScreen, DARK_AREA, DARK_LUM, INVISIBLE, MIN_DETAILS, isQuestions }) => {
        const out: { check: string; detail: string }[] = [];
        const add = (check: string, detail: string) => out.push({ check, detail: detail.slice(0, 170) });

        const where = (el: Element) => {
          const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
          const t = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
          return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}${t ? ` "${t}"` : ""}`;
        };
        const rgb = (c: string): [number, number, number, number] | null => {
          const m = c.match(/[\d.]+/g);
          if (!m) return null;
          return [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1];
        };
        const lum = (c: [number, number, number, number]) => {
          const f = (v: number) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
        };
        const contrast = (a: [number, number, number, number], b: [number, number, number, number]) => {
          const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
          return (x + 0.05) / (y + 0.05);
        };
        /* The background the PAINTED printer would lay down: the first opaque
           background walking up the tree, white paper if there is none.
           Returns null on a gradient or image background — its luminance is not
           a single number and reading it would mean sampling pixels, which is
           exactly the screenshot-and-guess this gate is written to avoid. The
           painted contrast check is skipped there and the PAPER check (where
           the image is dropped anyway) still covers it. */
        const paintedBg = (el: Element): [number, number, number, number] | null => {
          let n: Element | null = el;
          while (n) {
            const s = getComputedStyle(n);
            if (s.backgroundImage && s.backgroundImage !== "none") return null;
            const c = rgb(s.backgroundColor);
            if (c && c[3] > 0.5) return c;
            n = n.parentElement;
          }
          return [255, 255, 255, 1];
        };
        const PAPER: [number, number, number, number] = [255, 255, 255, 1];
        /* checkVisibility() first, because getBoundingClientRect() LIES about
           anything inside a closed <details>: Chromium skips the subtree with
           content-visibility and the rect keeps reporting the last size it was
           laid out at. An answer that never opened measures 269px tall. A
           height check alone therefore passes on a page where nothing expanded,
           which is exactly the silently-green gate this file exists to be. */
        const vis = (el: Element) => {
          const e = el as HTMLElement & {
            checkVisibility?: (o?: Record<string, boolean>) => boolean;
          };
          if (typeof e.checkVisibility === "function") {
            return e.checkVisibility({
              contentVisibilityAuto: true,
              opacityProperty: true,
              visibilityProperty: true,
            });
          }
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden") return false;
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        /* The sr-only pattern: laid out, but clipped to nothing on purpose. It
           is not printed content and must not be read as clipped content. */
        const srOnly = (el: Element) => {
          let n: Element | null = el;
          while (n && n !== document.body) {
            const s = getComputedStyle(n);
            const r = (n as HTMLElement).getBoundingClientRect();
            if (/inset\(\s*50%/.test(s.clipPath)) return true;
            if (s.clip && s.clip !== "auto" && /rect\(/.test(s.clip)) return true;
            if (s.position === "absolute" && r.width <= 1 && r.height <= 1) return true;
            n = n.parentElement;
          }
          return false;
        };
        /* Ink that will not print: anything within a hair of white paper. */
        const printsOnPaper = (c: [number, number, number, number] | null) =>
          !!c && c[3] > 0.1 && contrast(c, PAPER) >= 1.5;

        /* -- P1: closed answers must open on paper ------------------------- */
        if (isQuestions) {
          const details = Array.from(document.querySelectorAll("details"));
          if (details.length < MIN_DETAILS) {
            add("accordion shrank", `${details.length} <details> on the page, expected at least ${MIN_DETAILS}`);
          }
          details.forEach((d) => {
            const summary = d.querySelector("summary");
            const bodyParts = Array.from(d.children).filter((c) => c.tagName !== "SUMMARY");
            if (!bodyParts.length) {
              add("<details> with no answer body", where(summary ?? d));
              return;
            }
            /* Two independent signals, and both must agree. checkVisibility()
               says the subtree is actually being rendered; the height
               comparison says the <details> box grew past its own <summary>,
               which a collapsed one never does. Either alone has a way to be
               fooled — see vis() above. */
            const rendered = bodyParts.some((c) => vis(c));
            const grew = summary
              ? (d as HTMLElement).getBoundingClientRect().height >
                (summary as HTMLElement).getBoundingClientRect().height + 2
              : true;
            if (!rendered || !grew) {
              add("closed <details> did not expand for print",
                `${where(summary ?? d)} — rendered=${rendered}, box grew past its summary=${grew}`);
            }
          });
        }

        /* -- P2: content that exists on screen and not on paper ------------
           Site chrome is exempt. A print stylesheet is entitled to drop the
           nav, the header and the footer — a menu is not content, and a reader
           holding the sheet cannot click it. Losing a paragraph is the failure
           this catches; losing the navigation is a decision. */
        document.querySelectorAll("[data-qa-print]").forEach((el) => {
          const id = el.getAttribute("data-qa-print")!;
          if (!onScreen[id]) return;
          if (el.closest("nav, header, footer, [role='navigation']")) return;
          if (srOnly(el)) return;
          if (!vis(el)) add("content lost under print", where(el));
        });

        /* -- P3: clipping ---------------------------------------------------
           Measured off the TEXT, not off scrollWidth. A masked line
           (overflow:hidden with padding for the descenders) reports scroll
           overflow while losing nothing, and a gate that fires on every reveal
           mask is a gate that gets muted. Range rects are where the glyphs
           actually landed, so this only fires when type is genuinely cut.
           overflow:auto counts as clipping here: paper does not scroll. */
        if (document.documentElement.scrollWidth > window.innerWidth + 1) {
          let widest: Element | null = null;
          let right = window.innerWidth + 1;
          document.querySelectorAll("body *").forEach((el) => {
            const r = (el as HTMLElement).getBoundingClientRect();
            if (r.width > 0 && r.right > right && (el.textContent ?? "").trim()) {
              right = r.right;
              widest = el;
            }
          });
          add("page is wider than the sheet",
            `document scrollWidth ${document.documentElement.scrollWidth} > sheet ${window.innerWidth}` +
            (widest ? ` — widest content ${where(widest)} ends at ${Math.round(right)}px` : ""));
        }
        const CLIPS = /hidden|clip|auto|scroll/;
        const clipperOf = (el: Element): Element | null => {
          let n: Element | null = el;
          while (n && n !== document.documentElement) {
            const s = getComputedStyle(n);
            if (CLIPS.test(s.overflowX) || CLIPS.test(s.overflowY)) return n;
            n = n.parentElement;
          }
          return null;
        };
        const clipReported = new Set<string>();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let t = walker.nextNode(); t; t = walker.nextNode()) {
          if (!(t.nodeValue ?? "").trim()) continue;
          const parent = t.parentElement;
          if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(parent.tagName)) continue;
          if (!vis(parent) || srOnly(parent)) continue;
          const clip = clipperOf(parent);
          if (!clip) continue;
          const box = (clip as HTMLElement).getBoundingClientRect();
          /* A Range rect is the font's em box, not the ink. Display type set at
             line-height < 1 reports a rect taller than its own line box and
             would look clipped while losing nothing, so the difference is
             allowed for vertically. Horizontal clipping has no such slack:
             a glyph past the right edge is a cut word. */
          const ps = getComputedStyle(parent);
          const fs = parseFloat(ps.fontSize) || 16;
          const lh = ps.lineHeight === "normal" ? fs * 1.2 : parseFloat(ps.lineHeight) || fs * 1.2;
          const vSlack = Math.max(0, fs * 1.25 - lh) + 2;
          const range = document.createRange();
          range.selectNodeContents(t);
          for (const r of Array.from(range.getClientRects())) {
            if (r.width === 0 && r.height === 0) continue;
            const over = Math.max(
              r.right - box.right - 2, box.left - r.left - 2,
              r.bottom - box.bottom - vSlack, box.top - r.top - vSlack,
            );
            if (over > 0) {
              const key = where(clip).slice(0, 60);
              if (clipReported.has(key)) break;
              clipReported.add(key);
              add("text clipped by its container",
                `${key} clips "${(t.nodeValue ?? "").trim().slice(0, 40)}" by ${Math.round(over)}px`);
              break;
            }
          }
        }

        /* -- P4: toner (PAINTED mode) --------------------------------------- */
        const darkSeen = new Set<string>();
        document.querySelectorAll("body, body *").forEach((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          const area = r.width * Math.max(r.height, 0);
          if (area < DARK_AREA) return;
          const c = rgb(getComputedStyle(el).backgroundColor);
          if (!c || c[3] < 0.5) return;
          if (lum(c) >= DARK_LUM) return;
          const key = where(el).slice(0, 60);
          if (darkSeen.has(key)) return;
          darkSeen.add(key);
          add("dark background would print as a page of toner",
            `${key} background ${getComputedStyle(el).backgroundColor} (luminance ${lum(c).toFixed(3)}) over ${Math.round(r.width)}x${Math.round(r.height)}px`);
        });

        /* -- P5: an internal link must still read as a link -----------------
           Scoped to <main>. A cross-reference in the body copy is the thing a
           reader needs to be able to follow off the page ("see /governance");
           a nav bar reproduced on paper is a menu, and whether it looks like
           type or like links changes nothing for them.

           An indicator only counts if it would actually print: a 12%-white
           hairline is a link affordance on a dark screen and nothing at all on
           white paper, so it is checked against paper, not against the screen. */
        const origin = location.origin;
        document.querySelectorAll("main a[href]").forEach((a) => {
          const href = a.getAttribute("href") ?? "";
          if (!href.startsWith("/") && !href.startsWith(origin)) return;
          if (!vis(a) || !(a.textContent ?? "").trim()) return;
          const s = getComputedStyle(a);
          const parentColor = a.parentElement ? getComputedStyle(a.parentElement).color : "";
          const decorated = s.textDecorationLine !== "none" && s.textDecorationLine !== "" &&
                            printsOnPaper(rgb(s.textDecorationColor) ?? rgb(s.color));
          const ruled = parseFloat(s.borderBottomWidth) > 0 &&
                        s.borderBottomStyle !== "none" &&
                        printsOnPaper(rgb(s.borderBottomColor));
          const coloured = s.color !== parentColor && printsOnPaper(rgb(s.color));
          const after = getComputedStyle(a, "::after").content;
          const printsHref = !!after && after !== "none" && after !== "normal" && after.length > 2;
          if (!decorated && !ruled && !coloured && !printsHref) {
            add("internal link is not identifiable on paper",
              `${where(a)} href="${href}" — no underline, no rule that prints, same colour as its surroundings, no printed href`);
          }
        });

        /* -- P6: ink that is not there, in both printer modes --------------- */
        document.querySelectorAll("[data-qa-print]").forEach((el) => {
          if (!vis(el) || srOnly(el)) return;
          const s = getComputedStyle(el);
          const fg = rgb(s.color);
          if (!fg || fg[3] < 0.1) {
            add("text is fully transparent under print", where(el));
            return;
          }
          const paper = contrast(fg, PAPER);
          if (paper < INVISIBLE) {
            add("text prints invisibly on white paper (backgrounds off)",
              `${where(el)} colour ${s.color} on white — contrast ${paper.toFixed(2)}:1`);
            return;
          }
          const bg = paintedBg(el);
          if (!bg) return; // gradient or image ground: see paintedBg()
          const painted = contrast(fg, bg);
          if (painted < INVISIBLE) {
            add("text prints invisibly against its own background (backgrounds on)",
              `${where(el)} colour ${s.color} on rgb(${bg[0]}, ${bg[1]}, ${bg[2]}) — contrast ${painted.toFixed(2)}:1`);
          }
        });

        return out;
      },
      {
        onScreen,
        DARK_AREA,
        DARK_LUM,
        INVISIBLE,
        MIN_DETAILS,
        isQuestions: route === "/questions",
      }
    );

    for (const h of hits) findings.push({ route, ...h });
  }

  await browser.close();

  if (findings.length) {
    /* Grouped and capped. A missing print stylesheet fails on every heading of
       every route; 900 identical lines is a wall nobody reads, and the first
       three of each kind are enough to find the cause. */
    const byCheck = new Map<string, Finding[]>();
    for (const f of findings) {
      if (!byCheck.has(f.check)) byCheck.set(f.check, []);
      byCheck.get(f.check)!.push(f);
    }
    console.log(`[print] ${findings.length} print failure(s) across ${ROUTES.length} public routes, at ${SHEET.width}x${SHEET.height} (US Letter @96dpi):`);
    for (const [check, list] of byCheck) {
      console.log(`  [${check}] x${list.length}`);
      for (const f of list.slice(0, 3)) console.log(`    ${f.route}  ${f.detail}`);
      if (list.length > 3) console.log(`    ... and ${list.length - 3} more`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.log("[print] gate crashed: " + (e instanceof Error ? e.message : String(e)));
  process.exit(1);
});
