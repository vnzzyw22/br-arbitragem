// Contraste real dos botões de vidro sobre o vídeo, em vários instantes.
// node scripts/contraste.mjs [url]   (texto branco; fundo = cor mediana atrás do botão)
import { chromium } from "playwright-core";
const url = process.argv[2] ?? "http://localhost:3000/";
const lum = ([r, g, b]) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const b = await chromium.launch({ channel: "chrome" });
let pior = 99;
for (const [nome, vp, mobile] of [["desktop 1440", { width: 1440, height: 900 }, false], ["mobile 390", { width: 390, height: 844 }, true]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 15000 });
  await p.addStyleTag({ content: ".h-surge,.h-sobe,.h-estende{animation:none!important}" });
  for (const t of [0.8, 2.5, 4.5, 6.5]) {
    await p.evaluate((s) => { const v = document.getElementById("hero-video"); v.pause(); v.currentTime = s; }, t);
    await p.waitForTimeout(700);
    for (const sel of ["#topo a[href='#contato']", "#topo a[href='#equipe']"]) {
      const el = p.locator(sel);
      const png = await el.screenshot();
      const medianas = await p.evaluate(async (b64) => {
        const img = new Image();
        img.src = "data:image/png;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const x = c.getContext("2d");
        x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        const ch = [[], [], []];
        for (let i = 0; i < d.length; i += 4) { ch[0].push(d[i]); ch[1].push(d[i + 1]); ch[2].push(d[i + 2]); }
        // texto branco é minoria dos pixels: a mediana vira o fundo; usa o percentil 75 por segurança (pior caso = fundo mais claro)
        return ch.map((a) => { a.sort((m, n) => m - n); return a[Math.floor(a.length * 0.75)]; });
      }, png.toString("base64"));
      const L = lum(medianas);
      const razao = (1 + 0.05) / (L + 0.05);
      pior = Math.min(pior, razao);
      console.log(`${nome} t=${t}s ${sel.includes("contato") ? "primário " : "secundário"} fundo rgb(${medianas.join(",")}) contraste com branco = ${razao.toFixed(2)}:1`);
    }
  }
  await ctx.close();
}
console.log(`\nPIOR CASO: ${pior.toFixed(2)}:1 (mínimo WCAG para texto: 4.5:1)`);
await b.close();
process.exit(pior >= 4.5 ? 0 : 1);
