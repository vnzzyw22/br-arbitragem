// Vetorização da logo a partir dos pixels (ver docs/FERRAMENTAS.md). Roda numa pasta de trabalho
// fora do repositório (arquivos lidos/gravados no diretório atual); playwright-core vem do projeto.
// Compõe o SVG da logo e mede a fidelidade contra o JPG original (renderizando no Chrome).
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const { caminhos } = JSON.parse(fs.readFileSync("caminhos.json", "utf8"));
const cor = JSON.parse(fs.readFileSync("cores.json", "utf8")); // {bola, azul, escuro}

const arredonda = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10));
const g = (d, fill) => `<path fill="${fill}" fill-rule="evenodd" d="${arredonda(d)}"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="75" fill="#fff"/><g transform="scale(.125)">${g(caminhos.bola, cor.bola)}${g(caminhos.azul, cor.azul)}${g(caminhos.escuro, cor.escuro)}${g(caminhos.texto, cor.escuro)}</g></svg>`;
fs.writeFileSync("logo-br.svg", svg);
console.log("svg bytes", svg.length);

const jpg = fs.readFileSync("logo-br.jpg").toString("base64");
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1000, height: 600 } });
await page.setContent("<body style='margin:0;background:#888'></body>");
const r = await page.evaluate(
  async ({ jpg, svg }) => {
    const carregar = (src) =>
      new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = src;
      });
    const a = await carregar("data:image/jpeg;base64," + jpg);
    const b = await carregar("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
    const med = (S) => {
      const mk = () => {
        const c = document.createElement("canvas");
        c.width = c.height = S;
        const x = c.getContext("2d", { willReadFrequently: true });
        x.imageSmoothingQuality = "high";
        return [c, x];
      };
      const [, xa] = mk(), [, xb] = mk();
      xa.drawImage(a, 0, 0, S, S);
      xb.fillStyle = "#fff";
      xb.fillRect(0, 0, S, S);
      xb.drawImage(b, 0, 0, S, S);
      const da = xa.getImageData(0, 0, S, S).data, db = xb.getImageData(0, 0, S, S).data;
      let soma = 0, n = 0, ruim = 0;
      for (let y = 0; y < S; y++)
        for (let x = 0; x < S; x++) {
          if (Math.hypot(x - S / 2, y - S / 2) > S * 0.485) continue; // dentro do disco (sem o aro cortado)
          const i = (y * S + x) * 4;
          const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3;
          soma += d; n++;
          if (d > 40) ruim++;
        }
      return { S, mae: +(soma / n).toFixed(2), pctRuim: +((100 * ruim) / n).toFixed(2) };
    };
    // lado a lado: original ampliado | svg
    const c = document.createElement("canvas");
    c.width = 960; c.height = 480;
    const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, 960, 480);
    x.imageSmoothingQuality = "high";
    x.drawImage(a, 0, 0, 480, 480);
    x.drawImage(b, 480, 0, 480, 480);
    return { m150: med(150), m300: med(300), par: c.toDataURL("image/png").split(",")[1] };
  },
  { jpg, svg },
);
fs.writeFileSync("par.png", Buffer.from(r.par, "base64"));
console.log(JSON.stringify({ m150: r.m150, m300: r.m300 }));
await browser.close();
