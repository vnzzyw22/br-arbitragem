// Verificações em produção: estado sem WhatsApp configurado + peso de carregamento no mobile.
import { chromium } from "playwright-core";
const url = process.argv[2] ?? "http://localhost:3201/";
const b = await chromium.launch({ channel: "chrome" });

const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const bytes = { total: 0, imagens: 0, video: 0, js: 0, css: 0, fontes: 0 };
const itens = [];
p.on("response", async (r) => {
  try {
    const len = Number((await r.allHeaders())["content-length"] ?? 0) || (await r.body()).length;
    const t = r.request().resourceType();
    bytes.total += len;
    if (t === "image") bytes.imagens += len;
    else if (t === "media") bytes.video += len;
    else if (t === "script") bytes.js += len;
    else if (t === "stylesheet") bytes.css += len;
    else if (t === "font") bytes.fontes += len;
    itens.push([len, t, r.url().split("/").slice(-1)[0].slice(0, 50)]);
  } catch {}
});
const erros = [];
p.on("console", (m) => m.type() === "error" && erros.push(m.text()));
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const kb = (n) => Math.round(n / 1024) + " KB";
console.log("Carga inicial (390px, sem rolar):", Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, kb(v)])));
console.log("Maiores:", itens.sort((a, b) => b[0] - a[0]).slice(0, 5).map((i) => `${kb(i[0])} ${i[2]}`).join(" | "));

const lcp = await p.evaluate(() => new Promise((res) => {
  new PerformanceObserver((l) => { const e = l.getEntries().at(-1); res(Math.round(e.startTime) + " ms, elemento: " + (e.element ? e.element.tagName + (e.element.className && typeof e.element.className === "string" ? "." + e.element.className.slice(0, 30) : "") : "?") + (e.url ? " " + e.url.split("/").pop().slice(0, 40) : "")); }).observe({ type: "largest-contentful-paint", buffered: true });
  setTimeout(() => res(null), 1500);
}));
console.log("LCP (máquina local, sem throttling):", lcp);

await p.locator("#contato").scrollIntoViewIfNeeded();
const btn = p.getByRole("button", { name: "Enviar pelo WhatsApp" });
console.log("sem número: botão desabilitado =", await btn.isDisabled());
console.log("sem número: aviso visível =", await p.getByText("ainda não foi configurado").isVisible());
console.log("sem número: link do Instagram no aviso =", (await p.locator("#contato [role=status] a").getAttribute("href")));
console.log("rodapé sem link de WhatsApp =", (await p.locator("footer a[href*='wa.me']").count()) === 0);
console.log("erros de console:", erros.length ? erros : "nenhum");
await b.close();
