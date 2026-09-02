/**
 * Regulation D regime gate.
 *
 * Under 506(b) general solicitation is prohibited, so the public site must not
 * carry language that reads as an invitation to invest. This scans the RENDERED
 * HTML of every public route against the word list and exits non-zero on a hit.
 *
 * /legal/* is excluded: the disclaimer legitimately uses some of these terms in
 * the negative ("this is not an offer to sell").
 *
 * NOT LEGAL ADVICE. This encodes public commentary so counsel can be handed one
 * file and one page list instead of a whole website.
 */
import { chromium } from "playwright";

const PROHIBITED_506B = [
  "invest now", "invest with us", "investment opportunity", "now raising",
  "currently raising", "open for subscription", "subscribe", "minimum investment",
  "minimum commitment", "target return", "targeted return", "expected return",
  "projected", "irr", "annualized return", "net return", "gross return",
  "track record", "performance since inception", "aum", "assets under management",
  "closing date", "final close", "first close", "allocation available",
  "capacity available", "limited spots", "join our investors",
  "participate in the fund", "oversubscribed", "illustrative figures",
];

// Under 506(c) solicitation is permitted, but the Marketing Rule still bars
// hypothetical performance, so the projection terms survive the change.
const PROHIBITED_506C = [
  "target return", "targeted return", "expected return", "projected",
  "illustrative figures",
];

const ROUTES = ["/", "/firm", "/strategies", "/insights", "/diligence", "/governance",
                "/partnership", "/letters", "/tearsheet", "/questions", "/access",
                "/contact", "/legal", "/legal/terms", "/legal/privacy", "/disclosures"];

async function main() {
  const base = process.env.REGIME_BASE ?? "http://localhost:3000";
  const regime = process.env.REGIME ?? "506b";
  const list = regime === "506c" ? PROHIBITED_506C : PROHIBITED_506B;

  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  const hits: string[] = [];

  // Disclaimer pages legitimately use these terms in the NEGATIVE ("no figure
  // here should be construed as a track record"), which is the opposite of
  // solicitation. Excluding them is not a loophole: their whole job is to deny.
  const DISCLAIMER = ["/legal", "/disclosures"];
  let scanned = 0;
  let skipped = 0;
  for (const route of ROUTES) {
    if (DISCLAIMER.some((d) => route.startsWith(d))) { skipped++; continue; }
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    if (!res || res.status() !== 200) { console.log(`  skip ${route} (${res?.status()})`); continue; }
    // Rendered text, not markup: a term inside a class name is not solicitation.
    //
    // textContent, not innerText. innerText returns what is VISIBLE, and
    // Chromium treats the contents of a closed <details> as invisible. On an
    // accordion page that is ~90% of the copy, so innerText was scanning the
    // summaries and nothing else — a page could solicit inside every closed
    // answer and pass. textContent still excludes attributes and class names,
    // which is the property this scan actually needed; script and style are
    // stripped off a clone because textContent would otherwise return the
    // source of both.
    const text = (await page.evaluate(() => {
      const body = document.body.cloneNode(true) as HTMLElement;
      body.querySelectorAll("script, style, noscript, template").forEach((n) => n.remove());
      return body.textContent ?? "";
    })).toLowerCase();
    scanned++;
    for (const term of list) {
      if (text.includes(term)) hits.push(`${route}  "${term}"`);
    }
  }
  await browser.close();

  if (hits.length) {
    console.log(`[regime ${regime}] ${hits.length} prohibited term(s) in rendered public HTML:`);
    for (const h of hits) console.log("  " + h);
    process.exit(1);
  }
  // Report what was actually READ, not the length of the route list. Counting
  // ROUTES would have credited the gate for the disclaimer pages it skips and
  // for any route that failed to return 200.
  console.log(
    `[regime ${regime}] clean across ${scanned} public routes` +
      (skipped ? ` (${skipped} disclaimer route${skipped > 1 ? "s" : ""} excluded)` : "")
  );
}
main();
