// Congela o rali em instantes do ciclo e fotografa a quadra: node scripts/rali.mjs [url]
import { chromium } from "playwright-core";
const url = process.argv[2] ?? "http://localhost:3000/";
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 15000 }).catch(() => {});
await p.evaluate(() => document.querySelector("#equipe svg.mt-14").scrollIntoView({ behavior: "instant", block: "center" }));
await p.waitForTimeout(1500);
const svg = p.locator("#equipe svg.mt-14");
const passos = [0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2];
const pos = [];
for (const t of passos) {
  await p.evaluate((s) => {
    for (const a of document.getAnimations()) {
      if (String(a.animationName ?? "").startsWith("rali")) { a.pause(); a.currentTime = s * 1000 + (a.effect?.getTiming().delay ?? 0); }
    }
  }, t);
  await p.waitForTimeout(150);
  const info = await p.evaluate(() => {
    const g = document.querySelector("#equipe .rali-chao");
    const m = new DOMMatrix(getComputedStyle(g).transform);
    const alt = new DOMMatrix(getComputedStyle(document.querySelector("#equipe .rali-altura")).transform);
    return { x: Math.round(m.e), y: Math.round(m.f), escala: +alt.a.toFixed(2) };
  });
  pos.push({ t, ...info });
  await svg.screenshot({ path: `.shots/rali-${String(Math.round(t * 10)).padStart(2, "0")}.png` });
}
console.log(pos.map((q) => `t=${q.t}s bola(${q.x},${q.y}) altura×${q.escala}`).join("\n"));
await b.close();
