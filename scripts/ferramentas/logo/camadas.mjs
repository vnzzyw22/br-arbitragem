// Vetorização da logo a partir dos pixels (ver docs/FERRAMENTAS.md). Roda numa pasta de trabalho
// fora do repositório (arquivos lidos/gravados no diretório atual); playwright-core vem do projeto.
// Separa a logo (150x150 JPG) em camadas por cor, ampliadas, e grava PNGs preto/branco para o potrace.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const K = 8; // ampliação
const jpg = fs.readFileSync("logo-br.jpg").toString("base64");
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });
const page = await browser.newPage();
await page.setContent("<canvas id=c></canvas>");
const dados = await page.evaluate(
  async ({ jpg, K }) => {
    const img = new Image();
    img.src = "data:image/jpeg;base64," + jpg;
    await img.decode();
    const c = document.getElementById("c");
    c.width = img.width * K;
    c.height = img.height * K;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = "high";
    x.drawImage(img, 0, 0, c.width, c.height);
    const d = x.getImageData(0, 0, c.width, c.height);
    // camadas: cada pixel recebe uma classe. Limites no ponto de meia cobertura (aresta antialias).
    const n = c.width * c.height;
    const cls = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const r = d.data[i * 4], g = d.data[i * 4 + 1], b = d.data[i * 4 + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const azul = b - r;
      if (azul > 50) cls[i] = 1; // B azul (#5888c8: b-r=112; meia cobertura ~56)
      else if (lum < 188) cls[i] = 2; // R e texto, cinza escuro (#787878 sobre branco: meia cobertura ~188)
      else if (lum < 212) cls[i] = 3; // bola, cinza médio
      else if (lum < 240) cls[i] = 4; // bola, cinza claro
    }
    const lumA = new Uint8Array(n);
    for (let i = 0; i < n; i++) lumA[i] = Math.round(0.299 * d.data[i*4] + 0.587 * d.data[i*4+1] + 0.114 * d.data[i*4+2]);
    return { w: c.width, h: c.height, cls: Array.from(cls), lum: Array.from(lumA) };
  },
  { jpg, K },
);
fs.writeFileSync("lum.bin", Buffer.from(dados.lum));delete dados.lum;
fs.writeFileSync("cls.json", JSON.stringify(dados));
// pré-visualização colorida das classes
const cores = { 0: [255, 255, 255], 1: [88, 136, 200], 2: [90, 90, 90], 3: [160, 160, 160], 4: [215, 215, 215] };
const rgba = Buffer.alloc(dados.w * dados.h * 4);
dados.cls.forEach((k, i) => {
  rgba.set([...cores[k], 255], i * 4);
});
const out = await page.evaluate(
  async ({ w, h, b64 }) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const bin = Uint8ClampedArray.from(atob(b64), (ch) => ch.charCodeAt(0));
    c.getContext("2d").putImageData(new ImageData(bin, w, h), 0, 0);
    return c.toDataURL("image/png").split(",")[1];
  },
  { w: dados.w, h: dados.h, b64: rgba.toString("base64") },
);
fs.writeFileSync("classes.png", Buffer.from(out, "base64"));
console.log("ok", dados.w, dados.h);
await browser.close();
