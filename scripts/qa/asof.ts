/**
 * Date provenance gate.
 *
 * A stale or invented date on a fund site is not a typo, it is a
 * misrepresentation. "As of Q2" over a table an allocator is reading in Q4 is a
 * statement about facts that are no longer the facts, and a date nobody can
 * trace to a source is a fact the firm cannot stand behind in diligence.
 *
 * So: every date rendered anywhere on the public site must be traceable to a
 * value in the repo. There are exactly four sources.
 *
 *   fund.updatedAt              src/config/fund.ts   (null today)
 *   note.date                   src/content/notes.ts (raw ISO and formatted)
 *   site.founded                src/config/site.ts
 *   the current year            ONLY inside a copyright line
 *
 * The current year is on that list for one reason and it is worth being exact
 * about it: src/components/Footer.tsx renders `new Date().getFullYear()` in a
 * copyright notice. That is computed at render time, so it can never go stale,
 * and it asserts nothing about the fund. It is allowed ONLY in an element whose
 * text carries a copyright marker. The same "2026" anywhere else — stamped over
 * a table, sitting in an eyebrow — is an unsourced date and fails, which is the
 * whole point of scoping the exception instead of allowlisting the year.
 *
 * CHECKS
 *   A1  every rendered date traces to one of the four sources
 *   A2  no date is in the future
 *   A3  no "as of" / "last updated" stamp is stale beyond STALE_DAYS
 *   A4  no dangling label: an "As of" or "Last updated" with nothing after it
 *   A5  no table column headed "As of" / "Updated" / "Date" whose cells are all
 *       empty — a table growing a column of blank dates, which is the specific
 *       failure this gate was asked for
 *
 * Prints nothing and exits 0 when clean. Exits NON-ZERO on any failure.
 *
 * ROUTE LIST: read from src/app/sitemap.ts, not retyped. See scripts/qa/links.ts
 * for why. Re-exported below.
 */
import { chromium } from "playwright";
import sitemap from "../../src/app/sitemap";
import { site, siteUrl } from "../../src/config/site";
import { fund } from "../../src/config/fund";
import { notes, formatDate } from "../../src/content/notes";

/** Every public route, in sitemap order. */
export const ROUTES: string[] = sitemap().map((e) => e.url.slice(siteUrl.length) || "/");

/**
 * How old a stamped date may be before it is stale.
 *
 * 400 days, not 365. A fund's stamped facts — the document index, the provider
 * ledger, the registrations — turn over on the annual audit cycle, so one year
 * is the real refresh interval and anything past it is a page describing last
 * year's firm. The extra 35 days are a grace period: an audit that lands five
 * weeks after the anniversary is normal and should not turn the build red on a
 * calendar boundary. Past 400 days it is not a slipped cycle, it is a page
 * nobody has looked at.
 */
const STALE_DAYS = 400;

/** Labels that introduce a stamped date. */
const STAMP = /\b(as of|as at|last updated|updated|effective|dated)\b/i;
/** The same labels standing alone with nothing after them. */
const DANGLING = /^(as of|as at|last updated|updated|effective|dated)\s*[:.—-]?\s*$/i;
/** A column header that promises dates. */
const DATE_COLUMN = /^(as of|as at|updated|last updated|date|effective)$/i;
/** Text that makes a bare current year a copyright notice rather than a claim. */
const COPYRIGHT = /©|&copy;|\(c\)\s*\d{4}|copyright|all rights reserved/i;

/**
 * Every date shape the site can render. Ordered longest-first so a full date is
 * matched whole rather than decomposed into a bare year.
 */
const DATE_RE =
  /\b(?:\d{4}-\d{2}-\d{2}|[A-Z][a-z]{2,8}\.? \d{1,2},? \d{4}|\d{1,2} [A-Z][a-z]{2,8},? \d{4}|\d{1,2}\/\d{1,2}\/\d{4}|[QH][1-4] (?:19|20)\d{2}|(?:19|20)\d{2})\b/g;

type Finding = { route: string; check: string; detail: string };

/** Parse a rendered date token to a UTC timestamp, or null if it is a bare year. */
function parseToken(tok: string): number | null {
  if (/^(?:19|20)\d{2}$/.test(tok)) return null;
  const q = tok.match(/^[QH]([1-4]) ((?:19|20)\d{2})$/);
  if (q) return Date.UTC(Number(q[2]), 0, 1);
  if (/^\d{4}-\d{2}-\d{2}$/.test(tok)) return Date.parse(tok + "T00:00:00Z");
  const t = Date.parse(tok + " UTC");
  return Number.isNaN(t) ? null : t;
}

async function main() {
  const base = process.env.BASE ?? "http://localhost:3000";
  const now = Date.now();
  const currentYear = new Date().getUTCFullYear();
  const findings: Finding[] = [];

  /* ---- the allowlist, built from the repo rather than typed out ---------- */
  const allowedDates = new Set<string>();
  const allowedYears = new Set<string>([String(site.founded)]);
  for (const n of notes) {
    allowedDates.add(n.date);
    allowedDates.add(formatDate(n.date));
    allowedYears.add(n.date.slice(0, 4));
  }
  if (fund.updatedAt) {
    allowedDates.add(fund.updatedAt);
    const t = parseToken(fund.updatedAt);
    if (t !== null) {
      allowedDates.add(formatDate(fund.updatedAt.slice(0, 10)));
      allowedYears.add(String(new Date(t).getUTCFullYear()));
      /* The stamp the whole site hangs off. If it is stale here, it is stale on
         every page that renders it, and no crawl is needed to know that. */
      const ageDays = (now - t) / 86400000;
      if (ageDays > STALE_DAYS) {
        findings.push({
          route: "src/config/fund.ts",
          check: "fund.updatedAt is stale",
          detail: `${fund.updatedAt} is ${Math.round(ageDays)} days old (threshold ${STALE_DAYS})`,
        });
      }
      if (t > now) {
        findings.push({
          route: "src/config/fund.ts",
          check: "fund.updatedAt is in the future",
          detail: fund.updatedAt,
        });
      }
    }
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
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

    /* Dates are collected PER ELEMENT rather than out of one flat string,
       because every rule below needs the surrounding element: whether the
       token sits in a copyright line, whether it follows an "as of" label,
       which cell it is in. A flat regex over the page can only say a date
       exists somewhere, which is not a thing anyone can go and fix. */
    const found: {
      token: string;
      where: string;
      elText: string;
      contextText: string;
    }[] = await page.evaluate(({ src }) => {
      const re = new RegExp(src, "g");
      const out: { token: string; where: string; elText: string; contextText: string }[] = [];
      const vis = (el: Element) => {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        const r = (el as HTMLElement).getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const label = (el: Element) => {
        const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
        return el.tagName.toLowerCase() + (cls ? "." + cls : "");
      };
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        const v = t.nodeValue ?? "";
        if (!v.trim()) continue;
        const parent = t.parentElement;
        if (!parent) continue;
        if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(parent.tagName)) continue;
        /* Closed <details> content is deliberately included: an invented date
           inside a collapsed answer is still published. Visibility is only
           consulted for display:none, which is content that is not there. */
        if (parent.closest("details") === null && !vis(parent)) continue;
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(v)) !== null) {
          const container = parent.closest("p, li, td, th, dd, dt, h1, h2, h3, h4, h5, h6, span, div") ?? parent;
          out.push({
            token: m[0],
            where: label(parent),
            elText: (parent.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
            contextText: (container.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 200),
          });
        }
      }
      return out;
    }, { src: DATE_RE.source });

    for (const f of found) {
      const isYear = /^(?:19|20)\d{2}$/.test(f.token);
      const ts = parseToken(f.token);

      /* -- A1: provenance ------------------------------------------------- */
      if (isYear) {
        const sourced = allowedYears.has(f.token);
        const copyrightOK =
          Number(f.token) === currentYear && COPYRIGHT.test(f.contextText);
        if (!sourced && !copyrightOK) {
          findings.push({
            route,
            check: "bare year with no source",
            detail: `"${f.token}" in ${f.where} "${f.elText}" — not site.founded (${site.founded}), not a note year, not a copyright line`,
          });
        }
      } else if (!allowedDates.has(f.token)) {
        findings.push({
          route,
          check: "date not sourced from data",
          detail: `"${f.token}" in ${f.where} "${f.elText}" — not fund.updatedAt, not a note date, not site.founded`,
        });
      }

      /* -- A2: the future --------------------------------------------------- */
      if (ts !== null && ts > now) {
        findings.push({
          route,
          check: "date is in the future",
          detail: `"${f.token}" in ${f.where} "${f.elText}"`,
        });
      } else if (isYear && Number(f.token) > currentYear) {
        findings.push({
          route,
          check: "year is in the future",
          detail: `"${f.token}" in ${f.where} "${f.elText}"`,
        });
      }

      /* -- A3: staleness, but only where the page CLAIMS currency ----------
         A note dated three years ago is an archive entry and is meant to stay
         where it is. A ledger stamped "As of" three years ago is a claim that
         has expired. Only the second is a failure. */
      if (ts !== null && STAMP.test(f.contextText)) {
        const ageDays = (now - ts) / 86400000;
        if (ageDays > STALE_DAYS) {
          findings.push({
            route,
            check: "stamped date is stale",
            detail: `"${f.token}" is ${Math.round(ageDays)} days old (threshold ${STALE_DAYS}) in "${f.contextText.slice(0, 90)}"`,
          });
        }
      }
    }

    /* -- A4 and A5: labels with nothing after them ------------------------- */
    const labelHits: { check: string; detail: string }[] = await page.evaluate(
      ({ dangling, dateColumn }) => {
        const out: { check: string; detail: string }[] = [];
        const D = new RegExp(dangling, "i");
        const C = new RegExp(dateColumn, "i");
        const txt = (el: Element | null | undefined) =>
          (el?.textContent ?? "").replace(/\s+/g, " ").trim();
        const label = (el: Element) => {
          const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
          return el.tagName.toLowerCase() + (cls ? "." + cls : "");
        };
        const cellEmpty = (el: Element) => {
          const c = el.cloneNode(true) as Element;
          c.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
          return txt(c) === "";
        };

        /* A4 — a stamp label rendered on its own. "Last updated" with the date
           it was supposed to introduce collapsed out from under it. */
        document.querySelectorAll("p, span, div, dt, th, td, li, h1, h2, h3, h4, h5, h6, caption").forEach((el) => {
          if (el.children.length) return;
          if (D.test(txt(el))) out.push({ check: "stamp label with no date after it", detail: `${label(el)} renders "${txt(el)}"` });
        });
        /* The <dt>/<th> half of the same failure: the label has a value slot
           and the slot is empty. */
        document.querySelectorAll("dt, th").forEach((el) => {
          const t = txt(el);
          if (!C.test(t) && !D.test(t)) return;
          const partner = el.tagName === "DT" ? el.nextElementSibling : null;
          if (partner && partner.tagName === "DD" && cellEmpty(partner)) {
            out.push({ check: "date label with an empty value", detail: `${label(el)} "${t}" has an empty <dd>` });
          }
        });

        /* A5 — the named failure: a table grows an "As of" column of blanks. */
        document.querySelectorAll("table").forEach((table) => {
          const heads = Array.from(table.querySelectorAll("thead th"));
          const rows = Array.from(table.querySelectorAll("tbody tr"));
          if (!heads.length || !rows.length) return;
          heads.forEach((h, i) => {
            const name = txt(h);
            if (!C.test(name)) return;
            const cells = rows
              .map((r) => Array.from(r.children).filter((c) => c.tagName === "TD" || c.tagName === "TH")[i])
              .filter(Boolean) as Element[];
            if (cells.length !== rows.length) return;
            if (cells.every(cellEmpty)) {
              out.push({
                check: "date column with a header and no dates",
                detail: `column "${name}" over ${cells.length} empty cell(s) in table "${txt(table.querySelector("caption")).slice(0, 50)}"`,
              });
            }
          });
        });
        return out;
      },
      { dangling: DANGLING.source, dateColumn: DATE_COLUMN.source }
    );
    for (const h of labelHits) findings.push({ route, ...h });
  }

  await browser.close();

  if (findings.length) {
    console.log(`[asof] ${findings.length} date failure(s) across ${ROUTES.length} public routes:`);
    for (const f of findings) console.log(`  ${f.route}  [${f.check}]  ${f.detail}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.log("[asof] gate crashed: " + (e instanceof Error ? e.message : String(e)));
  process.exit(1);
});
