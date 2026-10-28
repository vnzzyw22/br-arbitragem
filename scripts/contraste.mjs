// Contraste real dos botões de vidro sobre o vídeo, em vários instantes.
// node scripts/contraste.mjs [url]
// Para cada botão: lê a cor real do texto, esconde o texto, fotografa só o fundo (vidro + vídeo atrás)
// e compara com o pior pixel desse fundo: o 95º percentil mais claro para texto claro, o 5º mais
// escuro para texto escuro. Assim vale para o vidro de areia (texto escuro) e o vidro branco (texto branco).
import { chromium } from "playwright-core";
const url = process.argv[2] ?? "http://localhost:3000/";
const lum = ([r, g, b]) => {
  const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });
let pior = 99;
for (const [nome, vp, mobile] of [["desktop 1440", { width: 1440, height: 900 }, false], ["mobile 390", { width: 390, height: 844 }, true]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 15000 });
  await p.addStyleTag({ content: ".h-surge,.h-sobe,.h-estende{animation:none!important} .btn::after{display:none!important}" });
  for (const t of [0.8, 2.5, 4.5, 6.5]) {
    await p.evaluate((s) => {
      const v = document.getElementById("hero-video");
      v.pause();
      v.currentTime = s;
    }, t);
    await p.waitForTimeout(700);
    for (const sel of ["#topo a[href='#contato']", "#topo a[href='#equipe']"]) {
      const el = p.locator(sel);
      const texto = await el.evaluate((a) => {
        const c = document.createElement("canvas").getContext("2d");
        c.fillStyle = getComputedStyle(a).color;
        c.fillRect(0, 0, 1, 1);
        return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3);
      });
      await el.evaluate((a) => a.style.setProperty("color", "transparent", "important") || a.style.setProperty("text-shadow", "none", "important"));
      const png = await el.screenshot();
      await el.evaluate((a) => (a.style.removeProperty("color"), a.style.removeProperty("text-shadow")));
      const claro = lum(texto) > 0.4;
      const fundo = await p.evaluate(
        async ({ b64, claro }) => {
          const img = new Image();
          img.src = "data:image/png;base64," + b64;
          await img.decode();
          const c = document.createElement("canvas");
          c.width = img.width;
          c.height = img.height;
          const x = c.getContext("2d");
          x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, c.width, c.height).data;
          // ignora 3 px de borda (filete e sombra) para medir o miolo do botão
          const px = [];
          for (let y = 3; y < c.height - 3; y++)
            for (let xx = 3; xx < c.width - 3; xx++) {
              const i = (y * c.width + xx) * 4;
              const r = d[i], g = d[i + 1], bl = d[i + 2];
              px.push([r, g, bl, 0.2126 * r + 0.7152 * g + 0.0722 * bl]);
            }
          px.sort((m, n) => m[3] - n[3]);
          const q = px[Math.floor(px.length * (claro ? 0.95 : 0.05))];
          return q.slice(0, 3);
        },
        { b64: png.toString("base64"), claro },
      );
      const v = razao(texto, fundo);
      pior = Math.min(pior, v);
      console.log(`${nome} t=${t}s ${sel.includes("contato") ? "primário " : "secundário"} texto rgb(${texto.join(",")}) pior fundo rgb(${fundo.join(",")}) = ${v.toFixed(2)}:1`);
    }
  }
  await ctx.close();
}
console.log(`\nPIOR CASO: ${pior.toFixed(2)}:1 (mínimo WCAG para texto: 4.5:1)`);
await b.close();
process.exit(pior >= 4.5 ? 0 : 1);
