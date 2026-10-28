# HANDOFF — retomar o projeto (inclusive pelo celular)

Landing page da **BR Arbitragem Futevôlei**. Prioridade: converter visitante em pedido de orçamento (WhatsApp).
Repositório: `github.com/vnzzyw22/br-arbitragem` · Site: https://br-arbitragem.vercel.app (cada push na `main` publica sozinho na Vercel).

Ler primeiro: [README.md](README.md) (como rodar/testar) · [DESIGN.md](DESIGN.md) (direção de arte) · [MIDIA.md](MIDIA.md) (arquivos, auditoria, pendências).

## Regra de publicação (Vinicius, 28/10)

**Não publicar sem autorização.** Push na `main` publica o site e push em outro branch gera prévia na Vercel: os dois são deploy. Trabalhar em branch local, commitar e **pedir autorização** antes de qualquer push.

## Decisões do cliente — não reverter sem perguntar

- **Tipografia (28/10):** **exatamente duas famílias** — Mona Sans 500 expandida nos títulos e Schibsted Grotesk no texto, botões, menu e formulário. **Nenhum itálico** em nenhum elemento e nenhuma fonte extra. Antes: serifa (Cormorant) rejeitada como "manjada, com cara de IA"; Archivo condensada pesada, agressiva demais. A suíte confere as três regras.
- **Paleta (28/10):** praia — **areia clara, branco e tons de azul**, com aparência cinematográfica. Azul tirado da logo, areia tirada do vídeo. O preto e o dourado saíram da interface; ficam só nas ilustrações (bola, apito).
- **Hero:** vídeo de fundo em tela cheia (aprovado). Desktop = tríptico com o **árbitro no centro** e os outros dois clipes nas laterais. Mobile = reel vertical do árbitro. **Tríptico vertical em painéis foi publicado e rejeitado em 27/10: "tudo cortado, nem dá pra ver os vídeos". Não dividir a tela do celular em painéis.** No lugar, a faixa **Em quadra** (só celular) com os outros dois clipes inteiros, publicada em 27/10 para avaliação; se for recusada, remover `<EmQuadra />` de `src/app/page.tsx`.
- **Campeonatos:** só tipografia (cartaz de escalação). **Sem fotos**, **sem descrições de procedência**, **sem bolas nas laterais**.
- **Fotos:** não publicar imagem de baixa qualidade; preferir seção simples a foto ruim. A foto do time (Sandhit) foi **retirada** em 28/10 (compressão e nitidez artificial). Pendências em [MIDIA.md](MIDIA.md).
- **Ilustrações:** apito preto de árbitro com argola dourada, bola de futevôlei amarela e preta, quadra de areia com **rali animado**.
- **Movimento:** o cliente quer mais movimento, sempre com função e coerente com o tema. Tudo respeita `prefers-reduced-motion`.
- **Botões:** pílula. **Vidro** só sobre o vídeo da hero (vidro de areia no principal, vidro branco no secundário, como no Lobeca); em fundo liso, sólidos (azul de ação no claro, areia no escuro).
- Não inventar estatísticas, certificações, depoimentos, datas, cidades nem relações comerciais.

## Estado atual

Todas as seções prontas: hero, Em quadra (celular), quem somos, compromissos, campeonatos, FAQ, contato (WhatsApp), rodapé, carregamento com progresso real e barra de CTA mobile.

**Sessão de 28/10/2026 (branch `revisao-visual`, ainda NÃO publicado):**
- Revisão visual completa: duas famílias tipográficas sem itálico; paleta areia, branco e azul; véu azul-profundo na hero; botões de vidro em pílula; menu de vidro central que marca a seção atual; tipo de evento em botões no formulário (mesma validação e mesma mensagem); quadra ilustrada em areia real; foto do time retirada e as outras duas limitadas à resolução nativa.
- Investigação da referência `br-arbitragem-one.vercel.app` com o método do **AI Website Cloner** (instalado fora do repo, em `/home/claude/ferramentas/ai-website-cloner-template`, que some quando o ambiente da nuvem é reciclado; para reinstalar: clonar `JCodesMore/ai-website-cloner-template` numa pasta separada, `git remote remove origin`, `npm install`). Resumo do que foi e do que não foi aproveitado no [DESIGN.md](DESIGN.md).
- Verificado: **81/81** checagens automáticas; contraste de todo texto fora da hero (66 elementos no desktop, 68 no celular) ≥ 4,5:1; auditor de contraste provado com caso ruim (`scripts/autoteste-contraste.mjs`); botões de vidro sobre o vídeo, pior caso **6,89:1**; sem erros de console; sem rolagem horizontal.
- Medido no Chrome do Vinicius (mesma máquina e conexão): referência ≈1 MB e LCP 2,9 s; nosso site publicado 2,5 MB (vídeo 2,3 MB) e LCP 1,6 s. A Mona Sans acrescenta ≈96 KB de fonte.

**Sessão de 27/10/2026:** hero compacta em celular baixo (variante `baixo:`), economia de dados sem vídeo (`src/lib/economia.ts`), scripts com `CHROME_PATH`, versão no endereço dos vídeos (`src/lib/midia.ts`).

## Pendências

1. **Autorização para publicar** a revisão de 28/10 (prévia no branch ou direto na `main`).
2. **Número de WhatsApp** → `NEXT_PUBLIC_WHATSAPP_NUMBER` na Vercel (Project Settings → Environment Variables, depois redeploy). Sem ele o formulário fica desativado, de propósito.
3. Materiais melhores (vídeos horizontal e vertical, **foto da equipe original** para repor a retirada, logo vetorial): tabela em [MIDIA.md](MIDIA.md).
4. Confirmar com o cliente: SPFC Futevôlei e Desafio ao Galo (estão na lista); Selva Cup, AD's Cup e Rio Open (fora). Se "Jogo limpo. Grande espetáculo." é lema da BR (aparece na referência; não usado sem confirmação).
5. Logos de DRG Consultoria e apoiadores; cidades atendidas; e-mail; textos institucionais.
6. Skills Impeccable, ui-ux-pro-max, ui-styling, design-system, brand-guidelines e taste não existem no ambiente da nuvem (só no computador do Vinicius, se estiverem lá); nesta sessão foram usadas frontend-design e codemakers-design.

## Armadilhas já resolvidas (para não refazer)

- `whileInView` num elemento escondido por `overflow-hidden` **nunca dispara**: observe o contêiner, não o texto mascarado (ver `Titulo` em `Motion.tsx`).
- Next 16: `priority` virou `preload`; fonte com eixo extra exige `axes` (a Mona Sans usa `axes: ["wdth"]`); ler `node_modules/next/dist/docs/` antes de usar API nova.
- Reels do cliente são 720×1280: não ampliar para tela cheia horizontal (fica borrado); por isso o tríptico.
- `autoplay` ignora `preload="none"`: vídeo fora da primeira dobra não deve ter `autoplay`.
- Arquivo de mídia trocado com o mesmo nome fica em cache: aumentar `VERSAO` em `src/lib/midia.ts`.
- Tailwind 4 devolve cores com transparência em `oklab()`: para medir contraste, ler a cor por canvas (`scripts/contraste-texto.mjs`).
- `aria-invalid` não vale em `input type=radio`: vai no `role="radiogroup"`.
- Build em ambiente sem acesso à Google Fonts (nuvem): ver README, seção "Build sem internet" (o mock precisa ter Mona Sans e Schibsted).
- Depois de recriar um arquivo com `rm` + escrita, o Tailwind em dev pode ficar com CSS defasado: salvar o `globals.css` ou reiniciar o `next dev`.
