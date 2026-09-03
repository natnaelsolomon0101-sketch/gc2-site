import { webkit, devices } from "playwright";
const b = await webkit.launch();
for (const [name, opts] of [["393", { ...devices["iPhone 15 Pro"] }], ["320", { viewport:{width:320,height:568}, deviceScaleFactor:2, isMobile:true, hasTouch:true }]]) {
  const ctx = await b.newContext({ ...opts, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const btn = p.locator('button[aria-label*="enu"], button[aria-expanded]').first();
  await btn.click(); await p.waitForTimeout(600);
  const links = await p.evaluate(() => [...document.querySelectorAll('[role=dialog] a, nav a')].filter(a=>{const r=a.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(a).opacity!=='0'&&getComputedStyle(a).visibility!=='hidden';}).map(a=>a.textContent.trim()+':'+Math.round(a.getBoundingClientRect().height)));
  console.log(name, "visible links after open:", links.join(" | "));
  await p.screenshot({ path: `docs/v4/shots/conductor/menu--${name}.png` });
  await ctx.close();
}
await b.close();
