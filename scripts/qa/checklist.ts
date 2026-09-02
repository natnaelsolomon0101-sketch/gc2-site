import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

type Check = { ok: boolean; name: string; detail?: string };

export async function runChecklist(base: string, outDir: string, routes: string[], siteName: string) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const checks: Check[] = [];
  const push = (ok: boolean, name: string, detail?: string) => checks.push({ ok, name, detail });

  for (const route of routes) {
    const page = await ctx.newPage();
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    push(res?.status() === 200, `${route} returns 200`, `got ${res?.status()}`);

    const d = await page.evaluate(() => {
      const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
      const order = hs.map((h) => Number(h.tagName[1]));
      let bad = "";
      for (let i = 1; i < order.length; i++) if (order[i] - order[i - 1] > 1) bad = `h${order[i-1]} -> h${order[i]}`;
      const imgs = [...document.querySelectorAll("img")];
      const firstFocusable = document.querySelector<HTMLElement>(
        'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
      return {
        h1: document.querySelectorAll("h1").length,
        headingSkip: bad,
        main: !!document.querySelector("main"),
        nav: !!document.querySelector("nav"),
        footer: !!document.querySelector("footer"),
        imgsMissingAlt: imgs.filter((i) => !i.hasAttribute("alt") && i.getAttribute("aria-hidden") !== "true").length,
        firstFocusableIsSkip: !!firstFocusable && /skip/i.test(firstFocusable.textContent || ""),
        title: document.title,
      };
    });

    push(d.h1 === 1, `${route} has exactly one h1`, `found ${d.h1}`);
    push(d.headingSkip === "", `${route} heading order`, d.headingSkip);
    push(d.main && d.nav && d.footer, `${route} landmarks main/nav/footer`);
    push(d.imgsMissingAlt === 0, `${route} images have alt`, `${d.imgsMissingAlt} missing`);
    push(d.firstFocusableIsSkip, `${route} skip link is first focusable`);
    push(d.title.includes(siteName), `${route} title carries site name`, d.title);
    await page.close();
  }

  // Every strategy row on home resolves to a real id on /strategies (A.8.4).
  {
    const home = await ctx.newPage();
    await home.goto(base + "/", { waitUntil: "networkidle" });
    const hrefs = await home.evaluate(() =>
      [...document.querySelectorAll('a[href*="/strategies#"]')].map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
    await home.close();
    const s = await ctx.newPage();
    await s.goto(base + "/strategies", { waitUntil: "networkidle" });
    const ids = await s.evaluate(() => [...document.querySelectorAll("[id]")].map((e) => e.id));
    await s.close();
    const missing = hrefs.map((h) => h.split("#")[1]).filter((f) => !ids.includes(f));
    push(hrefs.length > 0, "home links to strategy anchors", `${hrefs.length} rows`);
    push(missing.length === 0, "every strategy anchor exists", missing.join(", "));
  }

  // Sitemap routes all resolve.
  {
    const p = await ctx.newPage();
    const r = await p.goto(base + "/sitemap.xml");
    const xml = (await r?.text()) || "";
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    let bad = 0;
    for (const loc of locs) {
      const u = new URL(loc); const rr = await p.goto(base + u.pathname);
      if (rr?.status() !== 200) bad++;
    }
    push(locs.length > 0, "sitemap has entries", `${locs.length}`);
    push(bad === 0, "every sitemap route returns 200", `${bad} failed`);
    await p.close();
  }

  await browser.close();
  const failed = checks.filter((c) => !c.ok);
  const md = [
    "# Checklist", "",
    `${checks.length - failed.length}/${checks.length} passing`, "",
    ...checks.map((c) => `- [${c.ok ? "x" : " "}] ${c.name}${c.detail && !c.ok ? ` — ${c.detail}` : ""}`),
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "checklist.md"), md);
  return { total: checks.length, failed: failed.length, failures: failed };
}
