// Teste de comportamento: node scripts/interacoes.mjs [url]
// Roda contra uma build de produção iniciada com NEXT_PUBLIC_WHATSAPP_NUMBER de teste (número fictício).
import { chromium } from "playwright-core";
import { auditarContraste } from "./contraste-texto.mjs";

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
  // Regra do cliente: exatamente duas famílias, nenhuma fonte extra e nenhum itálico.
  const tipo = await page.evaluate(async () => {
    await document.fonts.ready;
    const fams = new Set();
    const italicos = [];
    for (const el of document.querySelectorAll("body *")) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      fams.add(cs.fontFamily.split(",")[0].replace(/["']/g, "").trim());
      if (cs.fontStyle !== "normal") italicos.push(`${el.tagName}:${el.textContent.trim().slice(0, 20)}`);
    }
    const carregadas = [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "").replace(/ Fallback$/, "")))];
    const f = (sel) => getComputedStyle(document.querySelector(sel));
    return {
      fams: [...fams],
      italicos,
      carregadas,
      h1: f("h1").fontFamily,
      h1peso: f("h1").fontWeight,
      h2: f("#qualidade h2").fontFamily,
      h2peso: f("#qualidade h2").fontWeight,
      corpo: f("body").fontFamily,
      botao: f("#topo a[href='#contato']").fontFamily,
      campo: f("#campo-nome").fontFamily,
    };
  });
  const duas = (lista) => lista.every((x) => /^(Mona Sans|Schibsted Grotesk)/.test(x));
  ok("exatamente duas famílias no texto (Mona Sans e Schibsted Grotesk)", tipo.fams.length === 2 && duas(tipo.fams), JSON.stringify(tipo.fams));
  ok("nenhuma fonte extra carregada", duas(tipo.carregadas), JSON.stringify(tipo.carregadas));
  ok(
    "títulos em Mona Sans (h1 da hero 800, demais 500); texto, botões e campos em Schibsted",
    /Mona Sans/.test(tipo.h1) && /Mona Sans/.test(tipo.h2) && tipo.h1peso === "800" && tipo.h2peso === "500" && [tipo.corpo, tipo.botao, tipo.campo].every((x) => /Schibsted/.test(x)),
    JSON.stringify({ h1: tipo.h1.split(",")[0], peso: tipo.h1peso, h2peso: tipo.h2peso, botao: tipo.botao.split(",")[0] }),
  );
  ok("nenhum itálico na página", tipo.italicos.length === 0, tipo.italicos.slice(0, 4).join(" | "));

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

  // Campeonatos em cards: foto só nos eventos com registro (Arena Sun7, Queiróz Cup, Torneio do Bosque)
  await page.evaluate(() => document.querySelector("#campeonatos").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: "instant" }));
  await page.waitForTimeout(1800);
  const camp = await page.evaluate(() => {
    const s = document.querySelector("#campeonatos");
    const nomes = [...s.querySelectorAll("h3")].map((h) => ({ t: h.innerText, px: parseFloat(getComputedStyle(h).fontSize) }));
    const fotos = [...s.querySelectorAll("img")].map((i) => ({ evento: i.closest("li")?.querySelector("h3")?.innerText, alt: i.alt }));
    return {
      nomes,
      fotos,
      texto: s.innerText,
      bolas: s.querySelectorAll('svg[viewBox="0 0 200 200"]').length,
      videos: s.querySelectorAll("video").length,
      cards: s.querySelectorAll("li > div > article, li > div > a").length,
      link: s.querySelector("a[href*='instagram']")?.href,
    };
  });
  ok("6 campeonatos em cards, com nome em destaque (≥ 28px)", camp.nomes.length === 6 && camp.nomes.every((n) => n.px >= 28) && camp.cards === 7, camp.nomes.map((n) => `${n.t}:${Math.round(n.px)}px`).join(" | "));
  const comFoto = camp.fotos.map((f) => f.evento).sort().join(",");
  ok("fotos só nos eventos com registro (Arena Sun7, Queiróz Cup, Torneio do Bosque), todas com texto alternativo", comFoto === "Arena Sun7,Queiróz Cup,Torneio do Bosque" && camp.fotos.every((f) => f.alt.length > 20) && camp.videos === 0, comFoto);
  ok("sem descrições de procedência das fotos", !/foto|v[ií]deo|publica[cç][aã]o|registro/i.test(camp.texto.replace(/Ver mais no Instagram/, "")), JSON.stringify(camp.texto.slice(0, 120)));
  ok("sem bolas nas laterais dos campeonatos", camp.bolas === 0, `(${camp.bolas})`);
  ok("card do Instagram leva ao perfil da equipe", camp.link === "https://www.instagram.com/brarbitragem.ftv/", camp.link);

  // Quem somos e Compromissos: fotos reais com texto alternativo, compromissos em 5 cards (2 com foto)
  const cards = await page.evaluate(() => ({
    equipeFotos: [...document.querySelectorAll("#equipe img")].map((i) => i.alt.length),
    compromissos: document.querySelectorAll("#qualidade article").length,
    comFoto: [...document.querySelectorAll("#qualidade article")].filter((a) => a.querySelector("img")).map((a) => a.querySelector("h3").innerText),
    icones: document.querySelectorAll("#qualidade article h3").length === document.querySelectorAll("#qualidade article svg").length,
  }));
  ok("Quem somos com 2 fotos reais da equipe, com texto alternativo", cards.equipeFotos.length === 2 && cards.equipeFotos.every((n) => n > 20), JSON.stringify(cards.equipeFotos));
  ok("5 compromissos em cards, foto em Condução e em Postura, um ícone por card", cards.compromissos === 5 && cards.comFoto.join(",") === "Condução responsável,Postura profissional" && cards.icones, JSON.stringify(cards.comFoto));

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
  await page.locator("#contato label", { hasText: "Torneio" }).click();
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

  // jogada na quadra (Futevolei.tsx): primeiro, de verdade em movimento
  await page.evaluate(() => document.querySelector("#equipe .quadra-card svg").scrollIntoView({ behavior: "instant", block: "center" }));
  await page.waitForTimeout(800);
  const andando = await page.evaluate(async () => {
    const x = () => new DOMMatrix(getComputedStyle(document.querySelector("#equipe .fv-bola-chao")).transform).e;
    const a = x();
    await new Promise((r) => setTimeout(r, 600));
    return { antes: Math.round(a), depois: Math.round(x()), estado: document.querySelector("#equipe svg.fv").getAnimations({ subtree: true })[0]?.playState };
  });
  ok("jogada em loop contínuo enquanto visível", andando.antes !== andando.depois && andando.estado === "running", JSON.stringify(andando));

  // fora da tela a jogada para (CPU e bateria)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(700);
  const parada = await page.evaluate(() => {
    const svg = document.querySelector("#equipe svg.fv");
    return { classe: svg.classList.contains("fv-parado"), estados: [...new Set(svg.getAnimations({ subtree: true }).map((a) => a.playState))] };
  });
  ok("jogada para fora da tela", parada.classe && parada.estados.length === 1 && parada.estados[0] === "paused", JSON.stringify(parada));
  await page.evaluate(() => document.querySelector("#equipe .quadra-card svg").scrollIntoView({ behavior: "instant", block: "center" }));
  await page.waitForTimeout(800);

  // (play() da Web Animations tira o controle do CSS: por isso a pausa fora da tela é checada antes)
  // depois, o ciclo inteiro lido em instantes exatos (Web Animations: currentTime), sem depender do relógio do teste
  const jogada = await page.evaluate(() => {
    const svg = document.querySelector("#equipe svg.fv");
    const anims = svg.getAnimations({ subtree: true });
    const T = anims[0].effect.getComputedTiming().duration;
    const em = (t) => anims.forEach((a) => (a.pause(), (a.currentTime = t)));
    const m = (sel) => new DOMMatrix(getComputedStyle(svg.querySelector(sel)).transform);
    const op = (sel) => +getComputedStyle(svg.querySelector(sel)).opacity;
    const amostras = [];
    for (let t = 0; t < T; t += 20) {
      em(t);
      amostras.push({
        t,
        bx: m(".fv-bola-chao").e,
        alt: m(".fv-bola-altura").a,
        onda: op(".fv-onda-1"),
        braco: m(".fv-arb-braco").a,
        a: [m(".fv-a1").e, m(".fv-a2").e],
        b: [m(".fv-b1").e, m(".fv-b2").e],
      });
    }
    anims.forEach((a) => a.play());
    const rede = 180;
    const toque = amostras.find((p) => p.t > T * 0.4 && p.bx > rede && p.alt <= 1.001); // a bola chega à areia do lado B
    const apito = amostras.find((p) => p.onda > 0.05);
    return {
      T,
      atletas: svg.querySelectorAll(".fv-a1, .fv-a2, .fv-b1, .fv-b2").length,
      arbitro: !!svg.querySelector(".fv-arb-braco"),
      ladoCerto: amostras.every((p) => p.a.every((x) => x < rede) && p.b.every((x) => x > rede)),
      xs: [Math.round(Math.min(...amostras.map((p) => p.bx))), Math.round(Math.max(...amostras.map((p) => p.bx)))],
      alturas: [+Math.min(...amostras.map((p) => p.alt)).toFixed(2), +Math.max(...amostras.map((p) => p.alt)).toFixed(2)],
      toque: toque?.t,
      apito: apito?.t,
      ondaAntes: Math.max(...amostras.filter((p) => toque && p.t < toque.t).map((p) => p.onda)),
      bracoNoApito: apito && +apito.braco.toFixed(2),
    };
  });
  ok("jogada: 4 atletas (2 de cada lado, sempre no seu lado da rede) e 1 árbitro", jogada.atletas === 4 && jogada.arbitro && jogada.ladoCerto, JSON.stringify(jogada));
  ok("jogada: a bola cruza a rede e sobe e desce", jogada.xs[0] < 100 && jogada.xs[1] > 260 && jogada.alturas[1] > 1.8 && jogada.alturas[0] <= 1, JSON.stringify({ xs: jogada.xs, alturas: jogada.alturas }));
  ok(
    "jogada: o apito (ondas) só vem depois que a bola toca a areia, até 0,5 s depois, com o braço do árbitro estendido",
    jogada.toque > 0 && jogada.apito > jogada.toque && jogada.apito - jogada.toque <= 500 && jogada.ondaAntes === 0 && jogada.bracoNoApito > 0.8,
    JSON.stringify({ toque: jogada.toque, apito: jogada.apito, ondaAntes: jogada.ondaAntes, braco: jogada.bracoNoApito }),
  );


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

  // a quadra do celular é a segunda (a do desktop fica escondida abaixo de lg)
  const quadraMobile = await page.evaluate(() => Math.max(...[...document.querySelectorAll("#equipe svg")].map((s) => Math.round(s.getBoundingClientRect().width))));
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
  const rm = await page.evaluate(() => {
    const svg = document.querySelector("#equipe svg.fv");
    const onda = svg.querySelector(".fv-onda-1");
    return {
      estado: getComputedStyle(onda).animationPlayState,
      onda: +(+getComputedStyle(onda).opacity).toFixed(2),
      onda2: +(+getComputedStyle(svg.querySelector(".fv-onda-2")).opacity).toFixed(2),
      braco: +new DOMMatrix(getComputedStyle(svg.querySelector(".fv-arb-braco")).transform).a.toFixed(2),
      prog: document.querySelectorAll("[data-progresso]").length,
    };
  });
  ok("prefers-reduced-motion: jogada parada no quadro do apito (braço estendido, ondas visíveis) e sem bola de progresso", rm.estado === "paused" && rm.onda > 0.3 && rm.onda2 > 0.3 && rm.braco > 0.9 && rm.prog === 0, JSON.stringify(rm));
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

// ---------- faixa "Em quadra" (só celular) ----------
{
  // desktop: seção oculta e nada da pasta quadra é baixado
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dp = await dctx.newPage();
  const dq = [];
  dp.on("request", (r) => r.url().includes("/video/quadra/") && dq.push(r.url()));
  await dp.goto(url, { waitUntil: "networkidle", timeout: 240000 });
  await dp.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await dp.waitForTimeout(800);
  const dVis = await dp.evaluate(() => getComputedStyle(document.querySelector("#quadra")).display);
  ok("Em quadra: oculta no desktop e sem download", dVis === "none" && dq.length === 0, `display=${dVis} req=${dq.length}`);
  await dctx.close();

  const { ctx, page, erros } = await nova({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp4 = [];
  page.on("request", (r) => r.url().includes("/video/quadra/") && r.url().includes(".mp4") && mp4.push(r.url()));
  await page.waitForTimeout(500);
  ok("Em quadra: vídeos não baixam antes de chegar à seção", mp4.length === 0, `req=${mp4.length}`);
  await page.evaluate(() => document.querySelector("#quadra figure").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(2500);
  const m = await page.evaluate(() => {
    const figs = [...document.querySelectorAll("#quadra figure")];
    const v = figs.map((f) => f.querySelector("video"));
    const r = figs[0].getBoundingClientRect();
    return { n: figs.length, w: Math.round(r.width), h: Math.round(r.height), tocando: v.map((x) => x && !x.paused), largura: v.map((x) => x?.videoWidth), sw: document.documentElement.scrollWidth };
  });
  ok("Em quadra: 2 vídeos inteiros (proporção 5:9) no celular", m.n === 2 && Math.abs(m.w / m.h - 5 / 9) < 0.02, JSON.stringify(m));
  ok("Em quadra: só o vídeo da frente toca", m.tocando[0] === true && m.tocando[1] === false, JSON.stringify(m.tocando));
  ok("Em quadra: trilho não cria rolagem horizontal na página", m.sw === 390, `sw=${m.sw}`);
  await page.evaluate(() => { const t = document.querySelector("#quadra .sem-barra"); t.scrollTo({ left: t.scrollWidth, behavior: "instant" }); });
  await page.waitForTimeout(1500);
  const m2 = await page.evaluate(() => ({
    tocando: [...document.querySelectorAll("#quadra video")].map((x) => !x.paused),
    ativo: [...document.querySelectorAll("#quadra [aria-hidden=true].wrap span")].map((s) => s.className.includes("bg-ceu")),
  }));
  ok("Em quadra: ao arrastar, o segundo toca e o indicador acompanha", m2.tocando[0] === false && m2.tocando[1] === true && m2.ativo[1] === true, JSON.stringify(m2));
  await page.click("#quadra button");
  await page.waitForTimeout(300);
  const pausado = await page.evaluate(() => [...document.querySelectorAll("#quadra video")].every((x) => x.paused));
  ok("Em quadra: botão pausa os vídeos", pausado);
  ok("Em quadra: sem erros de console", erros.length === 0, erros.slice(0, 2).join(" | "));
  await ctx.close();
}

// ---------- paleta praia: contraste real de todo texto contra o fundo da sua seção ----------
{
  const { ctx, page } = await nova();
  const a = await auditarContraste(page);
  // fundo contínuo (maré): cor-base de cada seção (é nela que o texto é medido) + gradiente que costura as bordas
  const costura = await page.evaluate(() => {
    const ids = ["equipe", "qualidade", "campeonatos", "duvidas", "contato"];
    const gradiente = ids.map((id) => getComputedStyle(document.getElementById(id)).backgroundImage.includes("linear-gradient"));
    // linhas d'água (Orla) visíveis entre as seções: no desktop nenhuma; a única fica sobre o vídeo da hero
    const orlas = [...document.querySelectorAll("main > div[aria-hidden=true]")].filter((e) => getComputedStyle(e).display !== "none").length;
    const onda = document.querySelector("#topo > div[aria-hidden=true] > svg");
    const orlaHero = !!onda && getComputedStyle(onda.parentElement).display !== "none";
    return { gradiente, orlas, orlaHero };
  });
  ok(
    "fundo contínuo: areia → água rasa → espuma → água rasa → areia, cada seção com gradiente",
    a.fundos.equipe === "rgb(242, 232, 220)" && a.fundos.qualidade === "rgb(211, 230, 230)" && a.fundos.campeonatos === "rgb(255, 255, 255)" && a.fundos.duvidas === "rgb(227, 239, 238)" && a.fundos.contato === "rgb(242, 232, 220)" && costura.gradiente.every(Boolean),
    JSON.stringify({ ...a.fundos, gradiente: costura.gradiente }),
  );
  ok("uma única linha d'água no desktop (sobre o vídeo da hero), sem ondas entre as seções", costura.orlas === 0 && costura.orlaHero, JSON.stringify(costura));
  ok(`contraste ≥ 4,5:1 (3:1 em texto grande) em todo texto fora da hero (desktop, ${a.medidos} elementos)`, a.falhas.length === 0, a.falhas.slice(0, 4).join(" | "));

  // menu: a seção no meio da tela fica marcada
  await page.evaluate(() => document.getElementById("campeonatos").scrollIntoView({ behavior: "instant", block: "center" }));
  await page.waitForTimeout(900);
  const atual = await page.evaluate(() => document.querySelector("header a[aria-current=location]")?.textContent);
  ok("menu marca a seção atual (aria-current)", atual === "Campeonatos", atual);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(700);
  const noTopo = await page.evaluate(() => document.querySelectorAll("header a[aria-current]").length);
  ok("sobre a hero nenhuma seção fica marcada", noTopo === 0, `(${noTopo})`);
  await ctx.close();
}

{
  const { ctx, page } = await nova({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const a = await auditarContraste(page);
  ok(`contraste ≥ 4,5:1 em todo texto fora da hero (celular, ${a.medidos} elementos)`, a.falhas.length === 0, a.falhas.slice(0, 4).join(" | "));
  const alvo = await page.evaluate(() => Math.min(...[...document.querySelectorAll("#contato fieldset label")].map((l) => l.getBoundingClientRect().height)));
  ok("botões de tipo de evento com alvo de toque ≥ 44px", alvo >= 44, `${alvo}px`);
  await ctx.close();
}

// ---------- tipo de evento em botões: teclado, foco e validação ----------
{
  const { ctx, page } = await nova();
  await page.evaluate(() => document.querySelector("#contato").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.fill("#campo-nome", "Ana Teste");
  await page.fill("#campo-whatsapp", "41988887777");
  await page.fill("#campo-cidade", "Maringá, PR");
  await page.getByRole("button", { name: "Enviar pelo WhatsApp" }).click();
  await page.waitForTimeout(300);
  const st = await page.evaluate(() => ({
    foco: document.activeElement?.id,
    erro: document.getElementById("erro-tipo")?.textContent,
    grupo: document.querySelector("[role=radiogroup]")?.getAttribute("aria-invalid"),
  }));
  ok("sem tipo escolhido: erro aparece e o foco vai ao grupo de botões", st.foco === "campo-tipo" && !!st.erro && st.grupo === "true", JSON.stringify(st));
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const st2 = await page.evaluate(() => {
    const marcado = document.querySelector("input[name=tipo]:checked");
    const rotulo = marcado?.closest("label");
    return { valor: marcado?.value, contorno: rotulo ? getComputedStyle(rotulo).outlineStyle : null, erro: !!document.getElementById("erro-tipo") };
  });
  ok("seta do teclado escolhe a próxima opção, com foco visível, e limpa o erro", st2.valor === "Torneio" && st2.contorno !== "none" && st2.erro === false, JSON.stringify(st2));
  await ctx.close();
}

// ---------- nitidez em tela 2×: nenhuma foto entregue com menos de 90% dos pixels necessários ----------
for (const [nome, vp, movel] of [["desktop", { width: 1440, height: 900 }, false], ["celular", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: movel, hasTouch: movel });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 240000 });
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await page.waitForTimeout(2500);
  // naturalWidth de imagem com srcset vem dividido pela densidade: baixa o arquivo entregue (currentSrc)
  // de novo, sem srcset, para contar os pixels reais.
  const fotos = await page.evaluate(async () => {
    const lista = [...document.querySelectorAll("main section:not(#topo) img")].filter((i) => i.getBoundingClientRect().width > 0 && i.currentSrc && !i.closest("#quadra"));
    return Promise.all(
      lista.map(async (i) => {
        const real = new Image();
        real.src = i.currentSrc;
        await real.decode();
        const r = i.getBoundingClientRect();
        // object-fit: cover precisa cobrir largura e altura da caixa (inclui o zoom da paralaxe)
        const precisa = Math.max(r.width, r.height * (real.naturalWidth / real.naturalHeight)) * devicePixelRatio;
        return { alt: i.alt.slice(0, 26), entregue: real.naturalWidth, precisa: Math.round(precisa), razao: +(real.naturalWidth / precisa).toFixed(2) };
      }),
    );
  });
  const ruins = fotos.filter((f) => f.razao < 0.9);
  ok(`fotos nítidas em tela 2× (${nome}, ${fotos.length} fotos, menor razão ${Math.min(...fotos.map((f) => f.razao))})`, fotos.length >= 7 && ruins.length === 0, JSON.stringify(ruins.slice(0, 3)));
  await ctx.close();
}

await browser.close();
const falhas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações passaram`);
if (falhas.length) console.log("FALHAS:\n" + falhas.map((f) => " - " + f.nome + " " + f.extra).join("\n"));
process.exit(falhas.length ? 1 : 0);
