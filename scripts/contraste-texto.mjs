// Contraste real de todo texto fora da hero contra o fundo efetivo da sua seção (camadas
// translúcidas compostas). Lê qualquer formato de cor (rgb, oklab do Tailwind 4) via canvas.
// Usado por interacoes.mjs; provado por autoteste-contraste.mjs (precisa reprovar o caso ruim).

export const medirContraste = () => {
    // Lê qualquer formato de cor (rgb, oklab do Tailwind 4, color-mix) pintando 1 px num canvas.
    const tela = document.createElement("canvas");
    tela.width = tela.height = 1;
    const ctx2d = tela.getContext("2d", { willReadFrequently: true });
    const ler = (c) => {
      if (!c || c === "transparent" || c === "rgba(0, 0, 0, 0)") return { r: 0, g: 0, b: 0, a: 0 };
      ctx2d.clearRect(0, 0, 1, 1);
      ctx2d.fillStyle = "#000";
      ctx2d.fillStyle = c;
      ctx2d.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx2d.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    };
    const sobre = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
    const lum = ({ r, g, b }) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const razao = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };
    const fundo = (el) => {
      const camadas = [];
      for (let e = el; e; e = e.parentElement) {
        const c = ler(getComputedStyle(e).backgroundColor);
        if (c && c.a > 0) {
          camadas.push(c);
          if (c.a >= 1) break;
        }
      }
      return camadas.reverse().reduce((b, c) => sobre(c, b), { r: 255, g: 255, b: 255, a: 1 });
    };
    const falhas = [];
    let medidos = 0;
    for (const el of document.querySelectorAll("main *, footer *")) {
      if (el.closest("#topo, [aria-hidden=true], .sr-only, svg")) continue;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (cs.visibility === "hidden" || cs.display === "none" || !r.width || !r.height) continue;
      const bg = fundo(el);
      const cor = sobre(ler(cs.color), bg);
      const px = parseFloat(cs.fontSize);
      const grande = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700);
      const min = grande ? 3 : 4.5;
      const v = razao(cor, bg);
      medidos++;
      if (v < min) falhas.push(`${el.tagName}"${el.textContent.trim().slice(0, 24)}" ${v.toFixed(2)}:1`);
    }
    const secao = (id) => getComputedStyle(document.getElementById(id)).backgroundColor;
    return { medidos, falhas, fundos: { equipe: secao("equipe"), qualidade: secao("qualidade"), campeonatos: secao("campeonatos"), duvidas: secao("duvidas"), contato: secao("contato") } };
  };

export async function auditarContraste(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await page.waitForTimeout(1500);
  return page.evaluate(medirContraste);
}
