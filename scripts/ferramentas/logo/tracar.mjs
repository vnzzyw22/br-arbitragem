// Vetorização da logo a partir dos pixels (ver docs/FERRAMENTAS.md). Roda numa pasta de trabalho
// fora do repositório (arquivos lidos/gravados no diretório atual); playwright-core vem do projeto.
// Traça as camadas da logo a partir dos pixels (sem redesenhar): máscaras -> potrace -> SVG.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
// potrace (e o jimp/pngjs que vêm com ele) ficam na pasta de trabalho: npm i potrace@2.1.8
const daqui = createRequire(path.join(process.cwd(), "_.js"));
const { PNG } = daqui("pngjs");
const potrace = daqui("potrace");
const Jimp = daqui("jimp");

const K = 8;
const { w, h, cls } = JSON.parse(fs.readFileSync("cls.json", "utf8"));
const lum = fs.readFileSync("lum.bin");
const LT = Number(process.env.LT ?? 200);
const C = 74.5 * K; // centro do aro (px ampliados)
const dist = (x, y) => Math.hypot(x - C, y - C) / K;

// dilatação quadrada por passagens separáveis
function dilatar(m, r) {
  const t = new Uint8Array(m.length);
  const o = new Uint8Array(m.length);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!m[y * w + x]) continue;
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx;
        if (xx >= 0 && xx < w) t[y * w + xx] = 1;
      }
    }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!t[y * w + x]) continue;
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy;
        if (yy >= 0 && yy < h) o[yy * w + x] = 1;
      }
    }
  return o;
}

const masc = {
  azul: new Uint8Array(w * h),
  escuro: new Uint8Array(w * h),
  bola: new Uint8Array(w * h),
};
const ocupado = new Uint8Array(w * h);
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    const i = y * w + x;
    const k = cls[i];
    if (k === 1) masc.azul[i] = 1;
    if (k === 2 && dist(x, y) < 73.6) masc.escuro[i] = 1;
    if (k === 1 || k === 2) ocupado[i] = 1;
  }
const BANDA_Y = 102 * K;
const texto = new Uint8Array(w * h);
for (let y = BANDA_Y; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (lum[i] < LT && cls[i] !== 1 && dist(x, y) < 73.6) texto[i] = 1; }
for (let y = BANDA_Y; y < h; y++) for (let x = 0; x < w; x++) masc.escuro[y * w + x] = 0;
const perto = dilatar(ocupado, 13);
for (let i = 0; i < w * h; i++) {
  const x = i % w, y = (i / w) | 0;
  if ((cls[i] === 3 || cls[i] === 4) && !perto[i] && dist(x, y) < 73.6) masc.bola[i] = 1;
}

// suaviza uma máscara (média em janela + limiar de 50%): tira o serrilhado do ruído JPEG
function suavizar(m, r) {
  const I = new Int32Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let lin = 0;
    for (let x = 0; x < w; x++) {
      lin += m[y * w + x];
      I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + lin;
    }
  }
  const o = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1), y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
      const s = I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0];
      o[y * w + x] = s * 2 > (x1 - x0) * (y1 - y0) ? 1 : 0;
    }
  return o;
}
const RS = Number(process.env.RS ?? 5);
masc.bola = suavizar(masc.bola, RS);
const RT = Number(process.env.RT ?? 2);
masc.texto = suavizar(texto, RT);

async function tracar(nome, m, opc) {
  const png = new PNG({ width: w, height: h });
  for (let i = 0; i < w * h; i++) {
    const v = m[i] ? 0 : 255;
    png.data.set([v, v, v, 255], i * 4);
  }
  const buf = PNG.sync.write(png);
  fs.writeFileSync(`mask-${nome}.png`, buf);
  const svg = await new Promise((res, rej) =>
    potrace.trace(buf, { threshold: 128, blackOnWhite: true, optCurve: true, ...opc }, (e, s) => (e ? rej(e) : res(s))),
  );
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(" ");
  return d;
}

const caminhos = {
  bola: await tracar("bola", masc.bola, { turdSize: 120, alphaMax: 1.2, optTolerance: 0.6 }),
  azul: await tracar("azul", masc.azul, { turdSize: 60, alphaMax: 1.0, optTolerance: 0.4 }),
  escuro: await tracar("escuro", masc.escuro, { turdSize: 20, alphaMax: 1.0, optTolerance: 0.3 }),
  texto: await tracar("texto", masc.texto, { turdSize: 8, alphaMax: 0.9, optTolerance: 0.2 }),
};

// cores medidas no original (pixels do miolo de cada classe)
const orig = await Jimp.read("logo-br.jpg");
const soma = { 1: [0, 0, 0, 0], 2: [0, 0, 0, 0], 3: [0, 0, 0, 0], 4: [0, 0, 0, 0] };
for (let y = 2; y < 148; y++)
  for (let x = 2; x < 148; x++) {
    const idx = (y * K + K / 2) * w + (x * K + K / 2);
    const k = cls[idx];
    if (!soma[k]) continue;
    // miolo: vizinhos (3x3 do original) todos da mesma classe
    let ok = true;
    for (let dy = -1; dy <= 1 && ok; dy++)
      for (let dx = -1; dx <= 1; dx++) if (cls[((y + dy) * K + K / 2) * w + ((x + dx) * K + K / 2)] !== k) { ok = false; break; }
    if (!ok) continue;
    if (k === 2 && dist(x * K, y * K) > 73) continue;
    const c = Jimp.intToRGBA(orig.getPixelColor(x, y));
    soma[k][0] += c.r; soma[k][1] += c.g; soma[k][2] += c.b; soma[k][3]++;
  }
const media = Object.fromEntries(
  Object.entries(soma).map(([k, s]) => [k, s[3] ? [Math.round(s[0] / s[3]), Math.round(s[1] / s[3]), Math.round(s[2] / s[3]), s[3]] : null]),
);
console.log("médias RGB (+n) por classe:", JSON.stringify(media));
fs.writeFileSync("caminhos.json", JSON.stringify({ caminhos, media }));
for (const [k, d] of Object.entries(caminhos)) console.log(k, "bytes:", d.length);
