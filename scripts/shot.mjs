// Captura real do site: node scripts/shot.mjs <url> <largura> <saida.png> [alturaViewport] [--full]
// Rola a página inteira para disparar os reveals, depois fotografa. Registra erros de console.
import { chromium } from "playwright-core";

const [url = "http://localhost:3000/", largura = "1440", saida = "scripts/_shot.png", altura = "900"] = process.argv.slice(2);
const full = process.argv.includes("--full");
const mobile = Number(largura) < 700;
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width: Number(largura), height: Number(altura) },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
});
const page = await ctx.newPage();
const erros = [];
page.on("console", (m) => ["error", "warning"].includes(m.type()) && erros.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => erros.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "networkidle", timeout: 240000 });
await page.waitForTimeout(4500);
if (full) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Number(altura) * 0.6) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}
const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: document.documentElement.scrollHeight }));
await page.screenshot({ path: saida, fullPage: full });
console.log(JSON.stringify({ saida, dims, erros: erros.slice(0, 10) }));
await browser.close();
