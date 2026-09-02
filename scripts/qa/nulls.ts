/**
 * Null-collapse gate.
 *
 * The central promise of this build is written at the top of src/config/fund.ts
 * and again at the top of src/app/diligence/page.tsx: every allocator fact is
 * null until the owner supplies it, and a null renders NOTHING. Not "TBD", not
 * a greyed row, not an em-dash stand-in, not a mono column label with an empty
 * column under it, not a section heading with no body.
 *
 * That promise is invisible in code review. It is a claim about pixels, and the
 * only way to hold it is to load the built pages with fund.ts in its committed
 * all-null state and look at what actually came out. That is what this does.
 *
 * Prints nothing and exits 0 when clean. On failure it prints the route, the
 * check that fired, and enough of the offending element to find it, then exits
 * NON-ZERO.
 *
 * CHECKS
 *   N1  a rendered "null" / "undefined" / "NaN" / "[object Object]"
 *   N2  the same tokens leaked into an href/src/alt/title/aria-label
 *   N3  a placeholder stand-in: TBD, TBA, N/A, "coming soon", lorem ipsum, or a
 *       data cell whose whole content is a dash
 *   N4  a table row whose data cells are ALL empty (a labelled row with nothing
 *       in it is a placeholder wearing a <th>)
 *   N5  a table column whose header is set but whose every body cell is empty —
 *       the "As of" column of blanks that src/app/diligence/page.tsx builds its
 *       conditional-column trick to avoid
 *   N6  a section heading with no body under it
 *   N7  an ordinal sequence with a gap (01, 02, 04) — the visible hole a
 *       collapsed block leaves when ordinals are hardcoded instead of computed
 *   N8  a <dt> with no matching <dd>, or a <dd> that is empty
 *   N9  an empty <li> or an empty heading
 *
 * Run at BOTH a desktop and a phone viewport. That is not belt-and-braces: the
 * Ledger in src/app/diligence/page.tsx drops an empty cell from the stacked
 * layout with `hidden` but still emits it as a `md:table-cell`, so an empty
 * column is a DESKTOP-only defect and a dangling mobile label is a PHONE-only
 * one. One viewport would miss half of what this gate exists to catch.
 *
 * ROUTE LIST: read from src/app/sitemap.ts, not retyped. See scripts/qa/links.ts
 * for why. Re-exported below.
 */
import { chromium } from "playwright";
import sitemap from "../../src/app/sitemap";
import { siteUrl } from "../../src/config/site";

/** Every public route, in sitemap order. */
export const ROUTES: string[] = sitemap().map((e) => e.url.slice(siteUrl.length) || "/");

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
];

type Finding = { route: string; viewport: string; check: string; detail: string };

async function main() {
  const base = process.env.BASE ?? "http://localhost:3000";
  const findings: Finding[] = [];

  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    // See scripts/qa/links.ts for why this shim is here.
    await ctx.addInitScript(() => {
      (window as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f;
    });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      const res = await page.goto(base + route, { waitUntil: "networkidle" });
      if (!res || res.status() !== 200) {
        findings.push({ route, viewport: vp.name, check: "route did not load", detail: `status ${res?.status() ?? "none"}` });
        continue;
      }

      const hits: { check: string; detail: string }[] = await page.evaluate(() => {
        const out: { check: string; detail: string }[] = [];
        const add = (check: string, detail: string) => out.push({ check, detail: detail.slice(0, 160) });

        const BLOCK = new Set([
          "ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "BR", "CAPTION", "DD", "DETAILS", "DIV",
          "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3",
          "H4", "H5", "H6", "HEADER", "HR", "LI", "MAIN", "NAV", "OL", "P", "PRE", "SECTION",
          "SUMMARY", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL",
        ]);
        const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);

        /* Serialise with block boundaries turned into newlines. Plain
           textContent runs adjacent blocks together ("...desk.Jul 14, 2026Trade
           the regime...") which destroys the word boundaries every check below
           depends on. It deliberately includes the contents of a CLOSED
           <details>: on /questions that is ~90% of the copy, and a null leaking
           into a closed answer is still a null on the page. */
        const ser = (n: Node): string => {
          if (n.nodeType === 3) return n.nodeValue ?? "";
          if (n.nodeType !== 1) return "";
          const el = n as Element;
          if (SKIP.has(el.tagName)) return "";
          let s = "";
          n.childNodes.forEach((c) => { s += ser(c); });
          return BLOCK.has(el.tagName) ? "\n" + s + "\n" : s;
        };
        const text = ser(document.body).replace(/[^\S\n]+/g, " ").replace(/\n{2,}/g, "\n");

        const visible = (el: Element) => {
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden") return false;
          const r = (el as HTMLElement).getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        const txt = (el: Element | null | undefined) =>
          (el?.textContent ?? "").replace(/\s+/g, " ").trim();
        /* A cell is empty when it renders no text and carries no image. An
           aria-hidden mobile column label with nothing under it is EMPTY, not
           filled: the label is chrome for a value that is not there. */
        const cellEmpty = (el: Element) => {
          const c = el.cloneNode(true) as Element;
          c.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
          return txt(c) === "" && !el.querySelector("img, svg, picture");
        };
        const where = (el: Element) => {
          const cls = (el.getAttribute("class") ?? "").split(/\s+/).slice(0, 3).join(".");
          return el.tagName.toLowerCase() + (cls ? "." + cls : "");
        };

        /* -- N1: a JS value that reached the page as prose -------------------
           Case-sensitive on purpose. "Null hypothesis" is English; `null` is a
           leaked value. */
        for (const m of text.matchAll(/\b(?:null|undefined|NaN)\b|\[object Object\]/g)) {
          const at = m.index ?? 0;
          add("rendered literal", `"${m[0]}" in "...${text.slice(Math.max(0, at - 50), at + 50).replace(/\n/g, " ")}..."`);
        }

        /* -- N2: the same leak, in an attribute ---------------------------- */
        document.querySelectorAll("[href], [src], [alt], [title], [aria-label]").forEach((el) => {
          for (const a of ["href", "src", "alt", "title", "aria-label"]) {
            const v = el.getAttribute(a);
            if (v && /\b(?:null|undefined|NaN)\b|\[object Object\]/.test(v)) {
              add("literal in attribute", `${where(el)} ${a}="${v}"`);
            }
          }
        });

        /* -- N3: placeholder copy and dash stand-ins ------------------------ */
        for (const m of text.matchAll(/\b(?:TBD|TBA|N\/A|Lorem ipsum|[Cc]oming soon|\[insert)\b/g)) {
          const at = m.index ?? 0;
          add("placeholder copy", `"${m[0]}" in "...${text.slice(Math.max(0, at - 50), at + 50).replace(/\n/g, " ")}..."`);
        }
        document.querySelectorAll("td, dd").forEach((el) => {
          const t = txt(el);
          if (/^[-–—‑]{1,3}$/.test(t) || /^(n\/a|tbd|tba|\?)$/i.test(t)) {
            add("dash / placeholder stand-in", `${where(el)} renders "${t}"`);
          }
        });

        /* -- N4: a labelled row with nothing in it -------------------------- */
        document.querySelectorAll("table tbody tr").forEach((tr) => {
          const tds = Array.from(tr.querySelectorAll(":scope > td"));
          if (!tds.length) return;
          if (tds.every(cellEmpty)) {
            const head = txt(tr.querySelector(":scope > th")) || txt(tr).slice(0, 40);
            add("table row with every data cell empty", `row "${head}" (${tds.length} empty cell(s))`);
          }
        });

        /* -- N5: a column of blanks ----------------------------------------
           The named failure mode: a table grows an "As of" column that has a
           header and nothing underneath it. */
        document.querySelectorAll("table").forEach((table) => {
          const heads = Array.from(table.querySelectorAll("thead th"));
          const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
          if (!heads.length || !bodyRows.length) return;
          /* Column 0 of these tables is the row header (<th scope="row">), so
             data columns start at index 1 of the header row. */
          heads.forEach((h, i) => {
            const label = txt(h);
            if (!label) return;
            const cells = bodyRows
              .map((r) => {
                const own = Array.from(r.children).filter((c) => c.tagName === "TD" || c.tagName === "TH");
                return own[i];
              })
              .filter(Boolean) as Element[];
            if (cells.length < bodyRows.length) return;
            if (cells.every(cellEmpty)) {
              add("table column with a header and no values", `column "${label}" over ${cells.length} empty cell(s)`);
            }
          });
        });

        /* -- N6: an orphan heading ------------------------------------------
           A section that renders its title and then nothing. This is what a
           collapsed fact block looks like when the heading is outside the
           conditional and the body is inside it. */
        document.querySelectorAll("section, article, nav, aside").forEach((sec) => {
          const heads = sec.querySelectorAll("h1, h2, h3, h4, h5, h6");
          if (!heads.length) return;
          if (!visible(sec)) return;
          const c = sec.cloneNode(true) as Element;
          c.querySelectorAll("h1, h2, h3, h4, h5, h6, script, style, noscript, template").forEach((n) => n.remove());
          if (txt(c) === "" && !c.querySelector("img, svg, picture, input, a")) {
            add("section heading with no body", `${where(sec)} heading "${txt(heads[0]).slice(0, 60)}"`);
          }
        });

        /* -- N7: an ordinal sequence with a gap -----------------------------
           Ordinals are collected from the rendered page in document order. A
           run restarts at "01", so a page carrying two independent sequences
           (the home page carries three) is handled without special-casing. */
        const ordinals: { v: number; el: Element }[] = [];
        document.querySelectorAll("p, span, div, td, th, li, dt").forEach((el) => {
          if (el.children.length) return;
          const t = txt(el);
          if (/^\d{2}$/.test(t) && visible(el)) ordinals.push({ v: Number(t), el });
        });
        let run: { v: number; el: Element }[] = [];
        const closeRun = () => {
          for (let i = 1; i < run.length; i++) {
            if (run[i].v !== run[i - 1].v + 1) {
              const seq = run.map((o) => String(o.v).padStart(2, "0")).join(", ");
              add("ordinal sequence with a gap", `${seq}  (jumps ${String(run[i - 1].v).padStart(2, "0")} -> ${String(run[i].v).padStart(2, "0")} near ${where(run[i].el)})`);
              break;
            }
          }
          run = [];
        };
        for (const o of ordinals) {
          if (o.v === 1) closeRun();
          run.push(o);
        }
        closeRun();

        /* -- N8: a term with no definition ---------------------------------- */
        document.querySelectorAll("dt").forEach((dt) => {
          const dds: Element[] = [];
          let n = dt.nextElementSibling;
          while (n && n.tagName === "DD") { dds.push(n); n = n.nextElementSibling; }
          if (!dds.length) add("<dt> with no <dd>", `"${txt(dt).slice(0, 60)}"`);
          else if (dds.every((d) => cellEmpty(d))) add("<dt> whose <dd> is empty", `"${txt(dt).slice(0, 60)}"`);
        });
        document.querySelectorAll("dd").forEach((dd) => {
          if (cellEmpty(dd)) add("empty <dd>", where(dd));
        });

        /* -- N9: empty list items and empty headings ------------------------ */
        document.querySelectorAll("li").forEach((li) => {
          if (!visible(li)) return;
          if (txt(li) === "" && !li.querySelector("img, svg, picture, a, input")) {
            add("empty <li>", where(li));
          }
        });
        document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
          if (txt(h) === "") add("empty heading", where(h));
        });

        return out;
      });

      for (const h of hits) findings.push({ route, viewport: vp.name, ...h });
    }
    await page.close();
    await ctx.close();
  }

  await browser.close();

  if (findings.length) {
    console.log(`[nulls] ${findings.length} null-collapse failure(s) across ${ROUTES.length} public routes:`);
    for (const f of findings) console.log(`  ${f.route} (${f.viewport})  [${f.check}]  ${f.detail}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.log("[nulls] gate crashed: " + (e instanceof Error ? e.message : String(e)));
  process.exit(1);
});
