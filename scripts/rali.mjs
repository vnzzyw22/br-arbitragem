// Congela a jogada da quadra em instantes do ciclo e fotografa: node scripts/rali.mjs [url]
// Gera .shots/jogada-NN.png (NN = % do ciclo de 7 s). Com ffmpeg, os quadros viram vídeo (ver README).
import { chromium } from "playwright-core";
const url = process.argv[2] ?? "http://localhost:3000/";
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 15000 }).catch(() => {});
await p.evaluate(() => document.querySelector("#equipe svg.fv").scrollIntoView({ behavior: "instant", block: "center" }));
await p.waitForTimeout(1500);
const svg = p.locator("#equipe svg.fv");
const passos = [0, 0.11, 0.22, 0.31, 0.4, 0.44, 0.48, 0.52, 0.56, 0.62, 0.8, 0.92];
const pos = [];
for (const f of passos) {
  const info = await p.evaluate((f) => {
    const raiz = document.querySelector("#equipe svg.fv");
    const anims = raiz.getAnimations({ subtree: true });
    const T = anims[0].effect.getComputedTiming().duration;
    anims.forEach((a) => (a.pause(), (a.currentTime = f * T)));
    const m = new DOMMatrix(getComputedStyle(raiz.querySelector(".fv-bola-chao")).transform);
    const alt = new DOMMatrix(getComputedStyle(raiz.querySelector(".fv-bola-altura")).transform);
    return { x: Math.round(m.e), y: Math.round(m.f), escala: +alt.a.toFixed(2), onda: +getComputedStyle(raiz.querySelector(".fv-onda-1")).opacity };
  }, f);
  await p.waitForTimeout(120);
  pos.push({ f, ...info });
  await svg.screenshot({ path: `.shots/jogada-${String(Math.round(f * 100)).padStart(2, "0")}.png` });
}
console.log(pos.map((q) => `${Math.round(q.f * 100)}% bola(${q.x},${q.y}) altura×${q.escala} onda ${q.onda.toFixed(2)}`).join("\n"));
await b.close();
