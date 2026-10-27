// Captura cada seção: node scripts/secoes.mjs <largura> <prefixo> [url]
// Rola até a seção (dispara as revelações), espera, fotografa o elemento.
import { chromium } from "playwright-core";

const [largura = "1440", prefixo = "d", url = "http://localhost:3200/"] = process.argv.slice(2);
const mobile = Number(largura) < 700;
const alturaVp = mobile ? 844 : 900;
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width: Number(largura), height: alturaVp },
  deviceScaleFactor: 1,
  isMobile: mobile,
  hasTouch: mobile,
});
const page = await ctx.newPage();
const erros = [];
page.on("console", (m) => ["error", "warning"].includes(m.type()) && erros.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => erros.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "networkidle", timeout: 240000 });
await page.waitForTimeout(1500);
await page.addStyleTag({ content: "header{visibility:hidden!important}" });

for (const sel of ["#equipe", "#qualidade", "#campeonatos", "#duvidas", "#contato", "footer"]) {
  const el = page.locator(sel).first();
  const box = await el.boundingBox();
  const y = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY, sel);
  // passo a passo para disparar os whileInView
  for (let p = Math.max(0, y - alturaVp); p < y + (box?.height ?? 0); p += alturaVp * 0.5) {
    await page.evaluate((v) => window.scrollTo(0, v), p);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(1400);
  const nome = `.shots/${prefixo}-${sel.replace("#", "")}.png`;
  await el.screenshot({ path: nome });
  console.log(nome, Math.round(box?.height ?? 0));
}
const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
console.log(JSON.stringify({ dims, erros: erros.slice(0, 10) }));
await browser.close();
