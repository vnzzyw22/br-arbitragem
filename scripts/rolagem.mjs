// Fotografa a viewport em posições de rolagem: node scripts/rolagem.mjs <largura> <altura> <prefixo> y1,y2,...
import { chromium } from "playwright-core";
const [w = "1440", h = "900", pre = "r", ys = "0,500,3400"] = process.argv.slice(2);
const mobile = Number(w) < 700;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: Number(w), height: Number(h) }, isMobile: mobile, hasTouch: mobile });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await p.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 15000 }).catch(() => {});
await p.waitForTimeout(1800);
for (const y of ys.split(",").map(Number)) {
  await p.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), y);
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `.shots/${pre}-${y}.png` });
  console.log(`${pre}-${y}`);
}
await b.close();
