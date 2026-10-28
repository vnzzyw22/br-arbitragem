// Prova do auditor de contraste: node scripts/autoteste-contraste.mjs [url]
// Injeta um texto ruim em rgb, um ruim em oklab e um bom; o auditor precisa reprovar os dois ruins e só eles.
import { chromium } from "playwright-core";
import { medirContraste } from "./contraste-texto.mjs";

const url = process.argv[2] ?? "http://localhost:3300/";
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: "networkidle", timeout: 240000 });
await p.waitForTimeout(2500);
const antes = await p.evaluate(medirContraste);
await p.evaluate(() => {
  const add = (sel, txt, css) => {
    const x = document.createElement("p");
    x.textContent = txt;
    x.style.cssText = css;
    document.querySelector(sel).appendChild(x);
  };
  add("#campeonatos .wrap", "Ruim rgb", "color:#cfcfcf;font-size:16px");
  add("#qualidade .wrap", "Ruim oklab", "color:oklab(0.32 -0.01 -0.05 / 0.9);font-size:16px");
  add("#campeonatos .wrap", "Bom", "color:#13263a;font-size:16px");
});
const depois = await p.evaluate(medirContraste);
const novas = depois.falhas.filter((f) => !antes.falhas.includes(f));
const ok = novas.length === 2 && novas.some((f) => f.includes("Ruim rgb")) && novas.some((f) => f.includes("Ruim oklab")) && depois.medidos === antes.medidos + 3;
console.log(JSON.stringify({ medidosAntes: antes.medidos, medidosDepois: depois.medidos, novas }));
console.log(ok ? "OK    auditor reprova os dois casos ruins e aprova o bom" : "FALHA auditor não se comportou como esperado");
await b.close();
process.exit(ok ? 0 : 1);
