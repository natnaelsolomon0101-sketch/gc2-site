import { webkit, devices } from "playwright";
const b = await webkit.launch();
const ctx = await b.newContext({ ...devices["iPhone 15 Pro"], reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto("http://localhost:3106/insights/capacity-is-a-research-problem", { waitUntil: "load", timeout: 60000 });
await p.waitForTimeout(500);

const checks = [
  ["footnote ref [1]", "a#fnref1"],
  ["back-link ↩", "a[aria-label='Back to text']"],
  ["marginalia summary", "details summary"],
];

for (const [label, sel] of checks) {
  const box = await p.locator(sel).first().boundingBox();
  console.log(`${label}: ${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : "NOT FOUND"}`);
}
await b.close();
