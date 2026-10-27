// Teste de comportamento: node scripts/interacoes.mjs [url]
// Exige o servidor iniciado com NEXT_PUBLIC_WHATSAPP_NUMBER (número fictício de teste).
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3200/";
const resultados = [];
const ok = (nome, cond, extra = "") => {
  resultados.push({ nome, ok: Boolean(cond), extra });
  console.log(`${cond ? "OK   " : "FALHA"} ${nome} ${extra}`);
};

const browser = await chromium.launch({ channel: "chrome" });

async function nova(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const erros = [];
  page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  page.on("pageerror", (e) => erros.push(e.message));
  await page.goto(url, { waitUntil: "networkidle", timeout: 240000 });
  await page.waitForTimeout(1500);
  return { ctx, page, erros };
}

// ---------- desktop ----------
{
  const { ctx, page, erros } = await nova();

  // CTAs rolam para as seções certas
  await page.locator("section#topo a[href='#contato']").click();
  await page.waitForTimeout(1500);
  let top = await page.evaluate(() => document.querySelector("#contato").getBoundingClientRect().top);
  ok("CTA principal da hero leva ao #contato", Math.abs(top) < 120, `(top=${Math.round(top)})`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.locator("section#topo a[href='#equipe']").click();
  await page.waitForTimeout(1500);
  top = await page.evaluate(() => document.querySelector("#equipe").getBoundingClientRect().top);
  ok("CTA secundário da hero leva ao #equipe", Math.abs(top) < 120, `(top=${Math.round(top)})`);

  // vídeo da hero realmente tocando
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const v = await page.evaluate(async () => {
    const el = document.querySelector("#topo video");
    const t0 = el.currentTime;
    await new Promise((r) => setTimeout(r, 1200));
    return { t0, t1: el.currentTime, paused: el.paused, rs: el.readyState, w: el.videoWidth };
  });
  ok("vídeo da hero toca (currentTime avança)", !v.paused && v.t1 > v.t0 && v.w === 720, JSON.stringify(v));

  // FAQ: teclado
  const botoes = page.locator("#duvidas button[aria-expanded]");
  await botoes.nth(1).focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  ok("FAQ abre com Enter", (await botoes.nth(1).getAttribute("aria-expanded")) === "true");
  ok("FAQ fecha o anterior (um aberto por vez)", (await botoes.nth(0).getAttribute("aria-expanded")) === "false");
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
  ok("FAQ fecha com Espaço", (await botoes.nth(1).getAttribute("aria-expanded")) === "false");

  // Campeonatos: painel troca ao focar uma linha
  await page.locator("#campeonatos").scrollIntoViewIfNeeded();
  await page.locator("#campeonatos ul button", { hasText: "Queiróz Cup" }).hover();
  await page.waitForTimeout(800);
  ok("painel de campeonatos troca para vídeo ao passar o mouse", (await page.locator("#campeonatos video").count()) === 1);
  const sel = await page.locator("#campeonatos ul button[aria-pressed='true']").innerText();
  ok("linha ativa marcada com aria-pressed", sel.toLowerCase().includes("queiróz"), sel.split("\n")[0]);

  // Formulário: validação com campos vazios
  await page.locator("#contato").scrollIntoViewIfNeeded();
  const enviar = page.getByRole("button", { name: "Enviar pelo WhatsApp" });
  ok("botão de envio habilitado com número configurado", await enviar.isEnabled());
  await enviar.click();
  await page.waitForTimeout(300);
  const nErros = await page.locator("[id^='erro-']").count();
  const foco = await page.evaluate(() => document.activeElement?.id);
  ok("campos vazios mostram 4 erros", nErros === 4, `(${nErros})`);
  ok("foco vai ao primeiro campo inválido", foco === "campo-nome", `(${foco})`);
  ok("campo inválido expõe aria-invalid", (await page.locator("#campo-nome").getAttribute("aria-invalid")) === "true");

  // Máscara + WhatsApp inválido
  await page.fill("#campo-nome", "Carlos Teste");
  await page.fill("#campo-whatsapp", "4199");
  await page.selectOption("#campo-tipo", "Torneio");
  await page.fill("#campo-cidade", "Curitiba, PR");
  await enviar.click();
  ok("WhatsApp incompleto é rejeitado", (await page.locator("#erro-whatsapp").count()) === 1);

  // Preenchido: intercepta window.open e confere a URL wa.me
  await page.fill("#campo-whatsapp", "41988887777");
  ok("máscara de telefone aplicada", (await page.inputValue("#campo-whatsapp")) === "(41) 98888-7777", await page.inputValue("#campo-whatsapp"));
  await page.fill("#campo-data", "2026-12-05");
  await page.fill("#campo-info", "4 quadras, categorias masculino e feminino.");
  await page.evaluate(() => {
    window.__aberto = null;
    window.open = (u) => ((window.__aberto = u), null);
  });
  await enviar.click();
  await page.waitForTimeout(400);
  const aberto = await page.evaluate(() => window.__aberto);
  ok("abre wa.me com o número configurado", aberto?.startsWith("https://wa.me/5541900000000?text="), aberto?.slice(0, 40));
  const msg = decodeURIComponent(aberto?.split("text=")[1] ?? "");
  console.log("--- mensagem gerada ---\n" + msg + "\n-----------------------");
  ok("mensagem contém todos os campos", ["Carlos Teste", "(41) 98888-7777", "Torneio", "Curitiba, PR", "05/12/2026", "4 quadras"].every((s) => msg.includes(s)));
  const aviso = await page.locator("#contato [aria-live]").innerText();
  ok("aviso pede para tocar em enviar (não diz 'enviado')", aviso.includes("toque em enviar") && !/enviado com sucesso/i.test(aviso));

  ok("sem erros de console (desktop)", erros.length === 0, erros.slice(0, 2).join(" | "));
  await ctx.close();
}

// ---------- mobile ----------
{
  const { ctx, page, erros } = await nova({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok("360px sem rolagem horizontal", dims.sw === dims.cw, JSON.stringify(dims));
  const alvos = await page.evaluate(() =>
    [...document.querySelectorAll("a, button")]
      .filter((e) => e.offsetParent !== null && !e.closest("[inert]"))
      .map((e) => ({ t: e.innerText.trim().slice(0, 28) || e.getAttribute("aria-label"), h: Math.round(e.getBoundingClientRect().height) }))
      .filter((e) => e.h < 40),
  );
  ok("alvos de toque ≥ 40px (360px)", alvos.length === 0, JSON.stringify(alvos.slice(0, 6)));
  const fonte = await page.evaluate(() => getComputedStyle(document.querySelector("h1")).fontVariationSettings);
  ok("título usa eixo wdth condensado", fonte.includes("62"), fonte);
  // barra de CTA inferior (mobile)
  const barra = page.locator("div.fixed.bottom-0 a[href='#contato']");
  const visivelBarra = async () => (await barra.evaluate((a) => a.closest("div").getBoundingClientRect().top)) < (await page.evaluate(() => innerHeight));
  ok("barra mobile oculta sobre a hero", !(await visivelBarra()));
  await page.evaluate(() => document.querySelector("#qualidade").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(700);
  ok("barra mobile aparece depois da hero", await visivelBarra());
  const ba = await barra.boundingBox();
  ok("barra mobile tem alvo de toque ≥ 44px", ba && ba.height >= 44, JSON.stringify(ba && { h: Math.round(ba.height) }));
  await page.evaluate(() => document.querySelector("#contato").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(900);
  ok("barra mobile some quando o formulário está na tela", !(await visivelBarra()));
  await barra.evaluate((a) => a.click()).catch(() => {});
  const navCta = await page.locator("header a[href='#contato']").evaluate((a) => getComputedStyle(a).display);
  ok("menu mobile não duplica o CTA (barra assume)", navCta === "none", navCta);

  // pular para o conteúdo + pausa do vídeo
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  ok("link 'Pular para o conteúdo' existe e aponta para o main", (await page.locator("a.pular").getAttribute("href")) === "#conteudo" && (await page.locator("main#conteudo").count()) === 1);
  const pausa = page.getByRole("button", { name: "Pausar vídeo" });
  ok("botão de pausa do vídeo presente e ≥ 44px", (await pausa.count()) === 1 && (await pausa.boundingBox()).height >= 44);
  await pausa.click();
  await page.waitForTimeout(500);
  const pausou = await page.evaluate(() => document.querySelector("#topo video").paused);
  ok("clicar em pausar interrompe o vídeo", pausou === true);
  await page.getByRole("button", { name: "Reproduzir vídeo" }).click();
  await page.waitForTimeout(900);
  ok("clicar em reproduzir retoma o vídeo", (await page.evaluate(() => document.querySelector("#topo video").paused)) === false);
  ok("sem erros de console (mobile)", erros.length === 0, erros.slice(0, 2).join(" | "));
  await ctx.close();
}

// ---------- movimento reduzido ----------
{
  const { ctx, page } = await nova({ reducedMotion: "reduce" });
  const temVideo = await page.locator("#topo video").count();
  const poster = await page.locator("#topo img[src*='hero-poster']").count();
  ok("prefers-reduced-motion: sem vídeo, pôster no lugar", temVideo === 0 && poster >= 1, `video=${temVideo} poster=${poster}`);
  const clip = await page.evaluate(() => getComputedStyle(document.querySelector("#topo h1 span span")).transform);
  ok("prefers-reduced-motion: título sem deslocamento", clip === "none" || clip === "matrix(1, 0, 0, 1, 0, 0)", clip);
  await ctx.close();
}

await browser.close();
const falhas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações passaram`);
process.exit(falhas.length ? 1 : 0);
