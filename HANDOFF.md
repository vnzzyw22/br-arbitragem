# HANDOFF — retomar o projeto (inclusive pelo celular)

Landing page da **BR Arbitragem Futevôlei**. Prioridade: converter visitante em pedido de orçamento (WhatsApp).
Repositório: `github.com/vnzzyw22/br-arbitragem` · Site: https://br-arbitragem.vercel.app (cada push na `main` publica sozinho na Vercel).

Ler primeiro: [README.md](README.md) (como rodar/testar) · [docs/FERRAMENTAS.md](docs/FERRAMENTAS.md) (skill /clone-website e scripts) · [DESIGN.md](DESIGN.md) (direção de arte) · [MIDIA.md](MIDIA.md) (arquivos, auditoria, pendências).

## Regra de publicação (Vinicius, 28/10)

**Não publicar sem autorização.** Push na `main` publica o site e push em outro branch gera prévia na Vercel: os dois são deploy. Trabalhar em branch local, commitar e **pedir autorização** antes de qualquer push.

## Decisões do cliente — não reverter sem perguntar

- **Tipografia (28/10):** **exatamente duas famílias** — Mona Sans 500 expandida nos títulos (o h1 da hero em **800**, pedido de 28/10) e Schibsted Grotesk no texto, botões, menu e formulário. **Nenhum itálico** em nenhum elemento e nenhuma fonte extra. Antes: serifa (Cormorant) rejeitada como "manjada, com cara de IA"; Archivo condensada pesada, agressiva demais. A suíte confere as três regras.
- **Paleta (28/10):** praia — **areia clara, branco e tons de azul**, com aparência cinematográfica. Azul tirado da logo, areia tirada do vídeo. O preto e o dourado saíram da interface; ficam só nas ilustrações (bola, apito).
- **Hero:** vídeo de fundo em tela cheia (aprovado). Desktop = tríptico com o **árbitro no centro** e os outros dois clipes nas laterais. Mobile = reel vertical do árbitro. **Tríptico vertical em painéis foi publicado e rejeitado em 27/10: "tudo cortado, nem dá pra ver os vídeos". Não dividir a tela do celular em painéis.** No lugar, a faixa **Em quadra** (só celular) com os outros dois clipes inteiros, publicada em 27/10 para avaliação; se for recusada, remover `<EmQuadra />` de `src/app/page.tsx`.
- **Cards e fotografia (28/10, pedido do Vinicius):** menos texto corrido, mais cards e fotos reais. Compromissos em grade assimétrica de cards (não cinco caixas iguais), Campeonatos em cards, FAQ em acordeão de cards. Superfícies de areia, branco e água; transição de "orla" entre seções.
- **Campeonatos:** foto **só** quando a imagem é do próprio evento e a associação está visível (Arena Sun7 = faixa da rede; Torneio do Bosque = escudo nas camisas de árbitro; Queiróz Cup = quadro do vídeo do evento). Os demais só com o nome. **Sem descrições de procedência**, **sem bolas nas laterais**. (Antes, 27/10, a seção era só tipografia; mudou pelo pedido de 28/10.)
- **Fotos:** não publicar imagem de baixa qualidade; preferir seção simples a foto ruim. A foto do time (Sandhit) foi **retirada** em 28/10 (compressão e nitidez artificial). Pendências em [MIDIA.md](MIDIA.md).
- **Ilustrações:** apito preto de árbitro com argola dourada, bola de futevôlei amarela e preta, quadra de areia vista de cima com uma **jogada animada** (4 atletas + árbitro que apita).
- **Jogada (28/10, Vinicius):** **simples, em segundo plano, sem botão, em loop contínuo "como um vídeo"**. Não é o foco da página. Uma versão em vista lateral mais desenhada, com botão de pausa, foi feita e **rejeitada**: não voltar a ela.
- **Fundo (28/10):** composição contínua de praia (areia → água rasa → espuma → areia), com **uma única linha d'água** sobre o vídeo da hero. Não voltar à alternância azul-escuro/areia/branco com onda entre todas as seções.
- **Movimento:** o cliente quer mais movimento, sempre com função e coerente com o tema. Tudo respeita `prefers-reduced-motion`.
- **Botões:** pílula. **Vidro** só sobre o vídeo da hero (vidro de areia no principal, vidro branco no secundário, como no Lobeca); em fundo liso, sólidos (azul de ação no claro, areia no escuro).
- Não inventar estatísticas, certificações, depoimentos, datas, cidades nem relações comerciais.

## Refinamento visual e animação (28/10, parte 3) — pronto na branch, AGUARDANDO AUTORIZAÇÃO

**Branch:** `refinamento-visual-2026-10-28` (saiu da `main` em `d24056b`), salva no GitHub. **A `main` não foi alterada**: o site no ar continua na versão anterior. Para ver: `git checkout refinamento-visual-2026-10-28 && npm run dev`. Brief: [docs/brief/2026-10-28-refinamento-visual-e-animacao.md](docs/brief/2026-10-28-refinamento-visual-e-animacao.md).

1. **Logo:** SVG traçado dos pixels do único arquivo existente (JPG 150×150), sem redesenhar; erro médio 2,4/255 a 150 px. Cabeçalho 52 px (celular) / 64 px (desktop), nítido em 2×/3×; rodapé e carregamento também. Detalhes em [MIDIA.md](MIDIA.md); método reproduzível em [docs/FERRAMENTAS.md](docs/FERRAMENTAS.md).
2. **Título da hero:** Mona Sans 800 a 116%, tracking −0,032em, só no h1 (comparado com 4 alternativas sobre o vídeo real; ver [DESIGN.md](DESIGN.md)).
3. **Fundo praia:** cor-base sólida por seção + gradiente que costura as vizinhas; Compromissos e Dúvidas saíram do azul-escuro para água rasa; cards em branco, areia, água funda e azul-esverdeado (`--color-mar`); uma só onda (sobre o vídeo).
5. **Beira-mar e coqueiros (pedido do Vinicius):** `src/components/Praia.tsx`. Água chegando na areia no fim de Quem somos e no fim de Dúvidas; coqueiros plantados na areia da beira-mar de Quem somos (fechado na nuvem às 19h: antes estavam boiando nas seções de água).
6. **Crítica de design (skill `frontend-design`, 28/10 à noite):** saiu a entrada genérica "sobe e aparece" de cards, etiquetas e parágrafos (era igual em todas as seções); corrigida uma emenda reta entre seções causada pelos brilhos radiais do fundo.
4. **Jogada:** `src/components/Futevolei.tsx`, vista de cima, 7 s: B2 saca → A1 levanta → A2 ataca → bola na areia (anel) → árbitro estende o braço para o lado A e apita (duas ondas 0,28 s depois do toque). Para fora da tela; movimento reduzido = quadro do apito. Vídeo de demonstração local: `.shots/jogada-demo.mp4`.

Verificado nesta etapa: `tsc` e `lint` limpos; **90/90** na suíte (inclui coqueiros só na areia e cards sem entrada genérica; última rodada 28/10 à noite) (build de produção); contraste do vidro sobre o vídeo, pior caso **6,50:1**; contraste de todo texto fora da hero; sem erros de console e sem rolagem horizontal em 1440, 390 e 360 px. Capturas em `.shots/depois/` (fora do git). Uma rodada da suíte teve uma falha intermitente em "Em quadra: só o vídeo da frente toca" (seção não alterada); passou na repetição.

**Falta:** autorização do Vinicius para publicar (prévia ou `main`); retorno do cliente sobre fundo, título e jogada; crítica formal com `impeccable` e auditoria `web-design-guidelines` desta versão (não existem na nuvem; rodar no computador do Vinicius). A crítica com `frontend-design` foi feita.

## Estado atual

Todas as seções prontas: hero, Em quadra (celular), quem somos, compromissos, campeonatos, FAQ, contato (WhatsApp), rodapé, carregamento com progresso real e barra de CTA mobile.

**Sessão de 28/10/2026, parte 2 (publicada na `main` em 28/10 à tarde, depois da prévia `br-arbitragem-git-cards-fotografia-vnzzyw.vercel.app` aprovada pelo Vinicius):**
- Redesenho orientado a cards e fotografia: Quem somos editorial (equipe em quadra + retrato + princípios em etiquetas + quadra em card), Compromissos em bento com 2 fotos e ícones próprios, Campeonatos em cards com fotos dos próprios eventos, FAQ em cards, Contato com passos e formulário em painel, orla entre seções, grão de areia nos cards cor de areia.
- 5 fotos recuperadas do histórico do git e reauditadas no tamanho de uso (ver [MIDIA.md](MIDIA.md)); nenhuma ampliada além do nativo em tela 2× (teste novo; pior caso 95%).
- Verificado: **86/86**; contraste de todo texto fora da hero (78 elementos no desktop, 80 no celular); vidro sobre o vídeo 6,89:1; carga inicial igual (fotos novas só baixam ao rolar: +280 KB desktop, +680 KB celular 3×).
- Comparação lado a lado com a referência em 1440×773 e 390×844: `.shots/cards-comparacao-*.png` (pasta fora do git).

**Sessão de 28/10/2026, parte 1 (publicada às 14:32):**
- Revisão visual completa: duas famílias tipográficas sem itálico; paleta areia, branco e azul; véu azul-profundo na hero; botões de vidro em pílula; menu de vidro central que marca a seção atual; tipo de evento em botões no formulário (mesma validação e mesma mensagem); quadra ilustrada em areia real; foto do time retirada e as outras duas limitadas à resolução nativa.
- Investigação da referência `br-arbitragem-one.vercel.app` com o método do **AI Website Cloner** (instalado fora do repo, em `/home/claude/ferramentas/ai-website-cloner-template`, que some quando o ambiente da nuvem é reciclado; para reinstalar: clonar `JCodesMore/ai-website-cloner-template` numa pasta separada, `git remote remove origin`, `npm install`). Resumo do que foi e do que não foi aproveitado no [DESIGN.md](DESIGN.md).
- Verificado: **81/81** checagens automáticas; contraste de todo texto fora da hero (66 elementos no desktop, 68 no celular) ≥ 4,5:1; auditor de contraste provado com caso ruim (`scripts/autoteste-contraste.mjs`); botões de vidro sobre o vídeo, pior caso **6,89:1**; sem erros de console; sem rolagem horizontal.
- Medido no Chrome do Vinicius (mesma máquina e conexão): referência ≈1 MB e LCP 2,9 s; nosso site publicado 2,5 MB (vídeo 2,3 MB) e LCP 1,6 s. A Mona Sans acrescenta ≈96 KB de fonte.

**Sessão de 27/10/2026:** hero compacta em celular baixo (variante `baixo:`), economia de dados sem vídeo (`src/lib/economia.ts`), scripts com `CHROME_PATH`, versão no endereço dos vídeos (`src/lib/midia.ts`).

## Pendências

1. **Retorno do cliente** sobre a versão com cards e fotos (publicada em 28/10), principalmente as fotos de evento que tinham saído em 27/10 (Arena Sun7, Torneio do Bosque).
2. **Número de WhatsApp** → `NEXT_PUBLIC_WHATSAPP_NUMBER` na Vercel (Project Settings → Environment Variables, depois redeploy). Sem ele o formulário fica desativado, de propósito.
3. Materiais melhores (vídeos horizontal e vertical, foto original da equipe em alta, fotos originais dos eventos sem imagem — SPFC Futevôlei, Desafio ao Galo, Amsterdam Cup — e da Queiróz Cup em alta, logo vetorial): tabela em [MIDIA.md](MIDIA.md).
4. Confirmar com o cliente: SPFC Futevôlei e Desafio ao Galo (estão na lista); Selva Cup, AD's Cup e Rio Open (fora). Se "Jogo limpo. Grande espetáculo." é lema da BR (aparece na referência; não usado sem confirmação).
5. Logos de DRG Consultoria e apoiadores; cidades atendidas; e-mail; textos institucionais.
6. Skills Impeccable, ui-ux-pro-max, ui-styling, design-system, brand-guidelines e taste não existem no ambiente da nuvem; no computador do Vinicius estão disponíveis (ver [docs/FERRAMENTAS.md](docs/FERRAMENTAS.md)). A skill do AI Website Cloner está no repositório (`.claude/skills/clone-website/`).
7. **Logo vetorial oficial** (SVG, PDF ou AI) com o cliente: o SVG traçado é fiel em tamanho pequeno, mas a palavra ARBITRAGEM (≈5 px no original) não aguenta ampliação grande.

## Armadilhas já resolvidas (para não refazer)

- `whileInView` num elemento escondido por `overflow-hidden` **nunca dispara**: observe o contêiner, não o texto mascarado (ver `Titulo` em `Motion.tsx`).
- Next 16: `priority` virou `preload`; fonte com eixo extra exige `axes` (a Mona Sans usa `axes: ["wdth"]`); ler `node_modules/next/dist/docs/` antes de usar API nova.
- Reels do cliente são 720×1280: não ampliar para tela cheia horizontal (fica borrado); por isso o tríptico.
- `autoplay` ignora `preload="none"`: vídeo fora da primeira dobra não deve ter `autoplay`.
- Arquivo de mídia trocado com o mesmo nome fica em cache: aumentar `VERSAO` em `src/lib/midia.ts`.
- Tailwind 4 devolve cores com transparência em `oklab()`: para medir contraste, ler a cor por canvas (`scripts/contraste-texto.mjs`).
- `aria-invalid` não vale em `input type=radio`: vai no `role="radiogroup"`.
- Build em ambiente sem acesso à Google Fonts (nuvem): ver README, seção "Build sem internet" (o mock precisa ter Mona Sans e Schibsted).
- Build de teste com `NEXT_DIST_DIR=.next-test` faz o Next reescrever o `tsconfig.json` (inclui `.next-test/types`): não commitar essa mudança (`git checkout tsconfig.json`).
- Web Animations: chamar `play()`/`pause()` numa animação CSS tira o controle do `animation-play-state` do CSS daí em diante. Nos testes, checar a pausa fora da tela **antes** de congelar quadros com `currentTime`.
- Windows: o servidor de teste (`next start`) trava a `.next-test`; encerrar o processo da porta 3300 antes de refazer a build.
- Depois de recriar um arquivo com `rm` + escrita, o Tailwind em dev pode ficar com CSS defasado: salvar o `globals.css` ou reiniciar o `next dev`.
