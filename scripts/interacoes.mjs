// Teste de comportamento: node scripts/interacoes.mjs [url]
// Roda contra uma build de produção iniciada com NEXT_PUBLIC_WHATSAPP_NUMBER de teste (número fictício).
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3300/";
const resultados = [];
const ok = (nome, cond, extra = "") => {
  resultados.push({ nome, ok: Boolean(cond), extra });
  console.log(`${cond ? "OK   " : "FALHA"} ${nome} ${extra}`);
};

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" });

// abre a página e espera o carregamento inicial terminar
async function nova(opts = {}, esperarLoader = true) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const erros = [];
  page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  page.on("pageerror", (e) => erros.push(e.message));
  await page.goto(url, { waitUntil: "networkidle", timeout: 240000 });
  if (esperarLoader) await page.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);
  return { ctx, page, erros };
}

// ---------- carregamento ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route("**/*.mp4*", async (r) => {
    await new Promise((res) => setTimeout(res, 1800));
    r.continue().catch(() => {});
  });
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "commit" });
  await page.waitForSelector(".loader");
  const visivel = await page.evaluate(() => ({ pronto: document.querySelector(".loader").getAttribute("data-pronto"), z: getComputedStyle(document.querySelector(".loader")).zIndex }));
  ok("carregamento aparece na primeira visita", visivel.pronto === "false");
  const barra0 = await page.evaluate(() => document.querySelector(".loader .origin-left").style.transform);
  await page.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 8000 });
  const dur = Date.now() - t0;
  ok("carregamento termina sozinho mesmo com vídeo lento (< 6 s)", dur < 6000, `(${dur} ms)`);
  ok("progresso parte de zero (não é fictício)", /scaleX\(0\)|scaleX\(0\.3|scaleX\(0\.6/.test(barra0), barra0);
  await page.reload({ waitUntil: "networkidle" });
  const oculto = await page.evaluate(() => getComputedStyle(document.querySelector(".loader")).display);
  ok("não reaparece na mesma sessão", oculto === "none", oculto);
  await ctx.close();

  // vídeo que falha: a página abre mesmo assim
  const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await c2.newPage();
  await p2.route("**/*.mp4*", (r) => r.abort());
  await p2.goto(url, { waitUntil: "commit" });
  await p2.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 8000 }).then(
    () => ok("vídeo bloqueado: o carregamento libera a página", true),
    () => ok("vídeo bloqueado: o carregamento libera a página", false),
  );
  const posterOk = await p2.evaluate(() => [...document.querySelectorAll("#topo img")].some((i) => i.complete && i.naturalWidth > 0));
  ok("vídeo bloqueado: pôster de fallback aparece", posterOk);
  await c2.close();
}

// ---------- desktop ----------
{
  const { ctx, page, erros } = await nova();

  // hero em tela cheia
  const hero = await page.evaluate(() => {
    const s = document.querySelector("#topo").getBoundingClientRect();
    const v = document.getElementById("hero-video").getBoundingClientRect();
    return { sw: Math.round(s.width), sh: Math.round(s.height), vw: Math.round(v.width), vh: Math.round(v.height), iw: innerWidth, ih: innerHeight };
  });
  ok("hero ocupa a primeira dobra inteira", hero.sw === hero.iw && hero.sh >= hero.ih, JSON.stringify(hero));
  ok("vídeo preenche a hero (sem moldura)", hero.vw === hero.iw && hero.vh >= hero.ih, `${hero.vw}x${hero.vh}`);

  // CTAs rolam para as seções certas
  await page.locator("section#topo a[href='#contato']").click();
  await page.waitForTimeout(1500);
  let top = await page.evaluate(() => document.querySelector("#contato").getBoundingClientRect().top);
  ok("CTA principal da hero leva ao #contato", Math.abs(top) < 120, `(top=${Math.round(top)})`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(800);
  await page.locator("section#topo a[href='#equipe']").click();
  await page.waitForTimeout(1500);
  top = await page.evaluate(() => document.querySelector("#equipe").getBoundingClientRect().top);
  ok("CTA secundário da hero leva ao #equipe", Math.abs(top) < 120, `(top=${Math.round(top)})`);

  // vídeo tocando (tríptico 1920x1080 no desktop)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1200);
  const v = await page.evaluate(async () => {
    const el = document.getElementById("hero-video");
    const amostras = [];
    for (let i = 0; i < 4; i++) {
      amostras.push(+el.currentTime.toFixed(2));
      await new Promise((r) => setTimeout(r, 350));
    }
    return { amostras, paused: el.paused, w: el.videoWidth, h: el.videoHeight, src: el.currentSrc.split("/").pop().split("?")[0] };
  });
  // o vídeo dá a volta (loop de 7,8 s): basta o tempo mudar a cada leitura
  ok("vídeo da hero toca (currentTime muda a cada leitura)", !v.paused && new Set(v.amostras).size === v.amostras.length, JSON.stringify(v));
  ok("desktop usa o tríptico 1920×1080", v.w === 1920 && v.h === 1080 && v.src === "desktop.mp4");

  // botões de vidro
  const vidro = await page.evaluate(() => {
    const a = getComputedStyle(document.querySelector("#topo a[href='#contato']"));
    return { filtro: a.backdropFilter || a.webkitBackdropFilter, fundo: a.backgroundColor, borda: a.borderTopWidth };
  });
  ok("botão principal da hero é de vidro (backdrop-filter)", vidro.filtro && vidro.filtro !== "none", JSON.stringify(vidro));
  const css = await page.evaluate(async () => {
    const hrefs = [...document.querySelectorAll("link[rel=stylesheet]")].map((l) => l.href);
    return (await Promise.all(hrefs.map((h) => fetch(h).then((r) => r.text())))).join("\n");
  });
  ok("existe fallback sólido quando não há backdrop-filter (@supports not)", /@supports not/.test(css));

  // pausa do vídeo
  await page.getByRole("button", { name: "Pausar vídeo" }).click();
  await page.waitForTimeout(500);
  ok("pausar interrompe o vídeo", (await page.evaluate(() => document.getElementById("hero-video").paused)) === true);
  await page.getByRole("button", { name: "Reproduzir vídeo" }).click();
  await page.waitForTimeout(900);
  ok("reproduzir retoma o vídeo", (await page.evaluate(() => document.getElementById("hero-video").paused)) === false);

  // tipografia
  const fonte = await page.evaluate(() => ({ h1: getComputedStyle(document.querySelector("h1")).fontFamily, corpo: getComputedStyle(document.body).fontFamily, peso: getComputedStyle(document.querySelector("h1")).fontWeight }));
  ok("títulos e texto usam a grotesca (sem serifa de IA)", /schibsted/i.test(fonte.h1) && /schibsted/i.test(fonte.corpo) && !/cormorant|playfair/i.test(fonte.h1), JSON.stringify(fonte));
  ok("peso dos títulos é 600 (nem pesado, nem frágil)", fonte.peso === "600");

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

  // Campeonatos: só nomes, sem descrições de procedência
  await page.evaluate(() => document.querySelector("#campeonatos").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: "instant" }));
  await page.waitForTimeout(1800);
  const camp = await page.evaluate(() => {
    const s = document.querySelector("#campeonatos");
    const nomes = [...s.querySelectorAll("h3")].map((h) => ({ t: h.innerText, px: parseFloat(getComputedStyle(h).fontSize), r: Math.round(h.getBoundingClientRect().height) }));
    return { nomes, texto: s.innerText, bolas: s.querySelectorAll("li svg").length, imgs: s.querySelectorAll("img, video, picture").length, link: s.querySelector("a")?.href };
  });
  ok("6 campeonatos listados, com nome grande (≥ 48px)", camp.nomes.length === 6 && camp.nomes.every((n) => n.px >= 48 && n.r > 40), camp.nomes.map((n) => `${n.t}:${Math.round(n.px)}px`).join(" | "));
  ok("sem descrições de procedência das fotos", !/foto|v[ií]deo|publica[cç][aã]o|registro/i.test(camp.texto.replace(/Ver mais no Instagram/, "")), JSON.stringify(camp.texto.slice(0, 120)));
  ok("sem fotos nem vídeos na seção de campeonatos", camp.imgs === 0);
  ok("sem bolas nas laterais dos campeonatos", camp.bolas === 0, `(${camp.bolas})`);
  ok("botão leva ao Instagram da equipe", camp.link === "https://www.instagram.com/brarbitragem.ftv/", camp.link);

  // Formulário: validação com campos vazios
  await page.evaluate(() => document.querySelector("#contato").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(600);
  const enviar = page.getByRole("button", { name: "Enviar pelo WhatsApp" });
  ok("botão de envio habilitado com número configurado", await enviar.isEnabled());
  await enviar.click();
  await page.waitForTimeout(300);
  const nErros = await page.locator("[id^='erro-']").count();
  const foco = await page.evaluate(() => document.activeElement?.id);
  ok("campos vazios mostram 4 erros", nErros === 4, `(${nErros})`);
  ok("foco vai ao primeiro campo inválido", foco === "campo-nome", `(${foco})`);
  ok("campo inválido expõe aria-invalid", (await page.locator("#campo-nome").getAttribute("aria-invalid")) === "true");

  await page.fill("#campo-nome", "Carlos Teste");
  await page.fill("#campo-whatsapp", "4199");
  await page.selectOption("#campo-tipo", "Torneio");
  await page.fill("#campo-cidade", "Curitiba, PR");
  await enviar.click();
  ok("WhatsApp incompleto é rejeitado", (await page.locator("#erro-whatsapp").count()) === 1);

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
  ok("mensagem contém todos os campos", ["Carlos Teste", "(41) 98888-7777", "Torneio", "Curitiba, PR", "05/12/2026", "4 quadras"].every((s) => msg.includes(s)));
  const aviso = await page.locator("#contato [aria-live]").innerText();
  ok("aviso pede para tocar em enviar (não diz 'enviado')", aviso.includes("toque em enviar") && !/enviado com sucesso/i.test(aviso));

  // ornamentos ilustrados presentes
  const orn = await page.evaluate(() => ({ apitoContato: document.querySelectorAll("#contato svg").length, bolaRodape: document.querySelectorAll("footer svg").length }));
  ok("apito ilustrado no contato e bola no rodapé", orn.apitoContato >= 1 && orn.bolaRodape >= 1, JSON.stringify(orn));

  // rali na quadra: a bola realmente se move, sobe e desce, e os jogadores acompanham
  await page.evaluate(() => document.querySelector("#equipe svg.mt-14").scrollIntoView({ behavior: "instant", block: "center" }));
  await page.waitForTimeout(800);
  const rali = await page.evaluate(async () => {
    const pos = [];
    for (let i = 0; i < 40; i++) {
      const m = new DOMMatrix(getComputedStyle(document.querySelector("#equipe .rali-chao")).transform);
      const a = new DOMMatrix(getComputedStyle(document.querySelector("#equipe .rali-altura")).transform);
      const j = new DOMMatrix(getComputedStyle(document.querySelector("#equipe .rali-j1")).transform);
      pos.push({ x: Math.round(m.e), esc: +a.a.toFixed(2), j1: Math.round(j.e) });
      await new Promise((r) => setTimeout(r, 140));
    }
    return pos;
  });
  const xs = rali.map((p) => p.x);
  const esc = rali.map((p) => p.esc);
  const j1 = rali.map((p) => p.j1);
  ok("bola da quadra cruza de um lado ao outro (rali)", Math.max(...xs) - Math.min(...xs) > 120, JSON.stringify(xs));
  // 40 leituras x 140 ms = 5,6 s: cobre o ciclo de 4,8 s com passo fino (400 ms caía sempre nas mesmas fases e às vezes pulava o ponto mais baixo)
  ok("bola sobe e desce (altura varia)", Math.max(...esc) > 1.7 && Math.min(...esc) < 1.35, JSON.stringify(esc));
  ok("jogador se desloca junto com a bola", Math.max(...j1) - Math.min(...j1) > 8, JSON.stringify(j1));

  // bola de progresso correndo pela linha e paralaxe da hero
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(700);
  const p0 = await page.evaluate(() => document.querySelector("[data-progresso] svg").getBoundingClientRect().left);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: "instant" }));
  await page.waitForTimeout(1200);
  const p1 = await page.evaluate(() => document.querySelector("[data-progresso] svg").getBoundingClientRect().left);
  ok("bola de progresso anda pela linha conforme a página rola", p1 - p0 > 300, `(${Math.round(p0)} → ${Math.round(p1)})`);
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
  await page.waitForTimeout(900);
  const par = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector("#topo > div.absolute")).transform));
  ok("hero tem paralaxe ao rolar (vídeo desloca e amplia)", par.a > 1.01 && par.f > 5, `escala ${par.a.toFixed(3)} y ${Math.round(par.f)}px`);

  ok("sem erros de console (desktop)", erros.length === 0, erros.slice(0, 2).join(" | "));
  await ctx.close();
}

// ---------- mobile ----------
{
  const { ctx, page, erros } = await nova({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  ok("360px sem rolagem horizontal", dims.sw === dims.cw, JSON.stringify(dims));

  const m = await page.evaluate(() => {
    const v = document.getElementById("hero-video");
    const s = document.querySelector("#topo").getBoundingClientRect();
    const r = v.getBoundingClientRect();
    return { src: v.currentSrc.split("/").pop().split("?")[0], w: v.videoWidth, h: v.videoHeight, cobre: Math.round(r.width) === innerWidth && r.height >= innerHeight - 1, sh: Math.round(s.height), ih: innerHeight };
  });
  ok("mobile usa o vertical 720×1280 em tela cheia", m.src === "mobile.mp4" && m.w === 720 && m.h === 1280 && m.cobre, JSON.stringify(m));

  const alvos = await page.evaluate(() =>
    [...document.querySelectorAll("a, button")]
      .filter((e) => e.offsetParent !== null && !e.closest("[inert]"))
      .map((e) => ({ t: e.innerText.trim().slice(0, 28) || e.getAttribute("aria-label"), h: Math.round(e.getBoundingClientRect().height) }))
      .filter((e) => e.h < 40),
  );
  ok("alvos de toque ≥ 40px (360px)", alvos.length === 0, JSON.stringify(alvos.slice(0, 6)));

  const quadraMobile = await page.evaluate(() => { const r = document.querySelector("#equipe svg.mt-14").getBoundingClientRect(); return Math.round(r.width); });
  ok("quadra em jogo aparece também no mobile", quadraMobile > 250, `(${quadraMobile}px)`);
  const nomes = await page.evaluate(() => [...document.querySelectorAll("#campeonatos h3")].map((h) => h.scrollWidth <= h.clientWidth + 1));
  ok("nomes dos campeonatos cabem em 360px sem estourar", nomes.length === 6 && nomes.every(Boolean));

  // barra de CTA inferior
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
  const navCta = await page.locator("header a[href='#contato']").evaluate((a) => a.offsetParent === null);
  ok("menu mobile não duplica o CTA (barra assume)", navCta === true, String(navCta));

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  ok("link 'Pular para o conteúdo' existe e aponta para o main", (await page.locator("a.pular").getAttribute("href")) === "#conteudo" && (await page.locator("main#conteudo").count()) === 1);
  const oculto = await page.locator("a.pular").evaluate((a) => getComputedStyle(a).opacity);
  ok("link de pular fica invisível fora do foco", oculto === "0", oculto);
  ok("sem erros de console (mobile)", erros.length === 0, erros.slice(0, 2).join(" | "));
  await ctx.close();
}

// ---------- movimento reduzido ----------
{
  const { ctx, page } = await nova({ reducedMotion: "reduce" }, false);
  await page.waitForTimeout(600);
  const loader = await page.evaluate(() => document.querySelector(".loader")?.getAttribute("data-pronto"));
  ok("prefers-reduced-motion: carregamento é pulado", loader === "true", loader);
  const temVideo = await page.locator("#topo video").count();
  const poster = await page.locator("#topo img").count();
  ok("prefers-reduced-motion: sem vídeo, pôster no lugar", temVideo === 0 && poster >= 1, `video=${temVideo} poster=${poster}`);
  const rm = await page.evaluate(() => ({ anim: getComputedStyle(document.querySelector("#equipe .rali-chao")).animationName, prog: document.querySelectorAll("[data-progresso]").length }));
  ok("prefers-reduced-motion: rali parado e sem bola de progresso", rm.anim === "none" && rm.prog === 0, JSON.stringify(rm));
  const transform = await page.evaluate(() => getComputedStyle(document.querySelector("#topo h1 span span")).transform);
  ok("prefers-reduced-motion: título sem deslocamento", transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)", transform);
  await ctx.close();
}

// ---------- celular baixo (360×640): título não cobre o rosto do árbitro ----------
{
  const { ctx, page } = await nova({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true });
  const m = await page.evaluate(() => {
    const h = document.querySelector("#topo").getBoundingClientRect().height;
    const t = document.querySelector("#hero-titulo").getBoundingClientRect().top;
    const cta = document.querySelector('#topo a[href="#contato"]').getBoundingClientRect();
    return { h, t: Math.round(t), pct: Math.round((t / h) * 100), ctaBase: Math.round(cta.bottom), ctaAlt: Math.round(cta.height) };
  });
  // rosto do árbitro ocupa ~23%–45% da altura do reel vertical
  ok("360×640: título começa abaixo do rosto do árbitro (≥ 46% da altura)", m.pct >= 46, JSON.stringify(m));
  ok("360×640: CTA principal inteiro na primeira dobra e ≥ 44px", m.ctaBase <= 640 && m.ctaAlt >= 44, JSON.stringify(m));
  await ctx.close();
}

// ---------- economia de dados: hero só com pôster ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true, effectiveType: "4g" }, configurable: true }));
  const page = await ctx.newPage();
  const mp4 = [];
  page.on("request", (r) => r.url().includes(".mp4") && mp4.push(r.url()));
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "networkidle", timeout: 240000 });
  await page.waitForFunction(() => document.querySelector(".loader")?.getAttribute("data-pronto") === "true", null, { timeout: 15000 }).catch(() => {});
  const ms = Date.now() - t0;
  const v = await page.locator("#topo video").count();
  ok("economia de dados: nenhum vídeo baixado, pôster no lugar", v === 0 && mp4.length === 0, `video=${v} mp4=${mp4.length}`);
  ok("economia de dados: carregamento não espera o vídeo (< 3 s)", ms < 3000, `${ms} ms`);
  await ctx.close();
}

await browser.close();
const falhas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações passaram`);
if (falhas.length) console.log("FALHAS:\n" + falhas.map((f) => " - " + f.nome + " " + f.extra).join("\n"));
process.exit(falhas.length ? 1 : 0);
