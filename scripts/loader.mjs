// Captura o carregamento: node scripts/loader.mjs <url> <saida.png> [largura] [altura]
import { chromium } from "playwright-core";
const [url = "http://localhost:3000/", saida = ".shots/loader.png", w = "1440", h = "900"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: Number(w), height: Number(h) } });
const p = await ctx.newPage();
await p.route("**/*.mp4", async (r) => { await new Promise((res) => setTimeout(res, 2500)); r.continue().catch(() => {}); });
await p.goto(url, { waitUntil: "commit" });
await p.waitForSelector(".loader");
await p.waitForTimeout(650);
const dentro = await p.evaluate(() => ({ pronto: document.querySelector(".loader")?.getAttribute("data-pronto"), barra: document.querySelector(".loader .origin-left")?.getAttribute("style") }));
await p.screenshot({ path: saida });
console.log(JSON.stringify(dentro));
await b.close();
