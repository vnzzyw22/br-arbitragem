# HANDOFF — retomar o projeto (inclusive pelo celular)

Landing page da **BR Arbitragem Futevôlei**. Prioridade: converter visitante em pedido de orçamento (WhatsApp).
Repositório: `github.com/vnzzyw22/br-arbitragem` · Site: https://br-arbitragem.vercel.app (cada push na `main` publica sozinho na Vercel).

Ler primeiro: [README.md](README.md) (como rodar/testar) · [DESIGN.md](DESIGN.md) (direção de arte) · [MIDIA.md](MIDIA.md) (arquivos, auditoria, pendências).

## Decisões do cliente — não reverter sem perguntar

- **Tipografia:** Schibsted Grotesk, peso 600 nos títulos. O cliente achou a serifa (Cormorant) "manjada, com cara de IA" e a 1ª versão (Archivo condensada pesada) agressiva demais. **Não voltar a serifa nem condensada pesada nos títulos.**
- **Hero:** vídeo de fundo em tela cheia (aprovado). Desktop = tríptico com o **árbitro no centro** e os outros dois clipes nas laterais, com cor casada. Mobile = reel vertical do árbitro. **Tríptico vertical em painéis (árbitro em cima, dois clipes embaixo) foi publicado e rejeitado em 27/10: "tudo cortado, nem dá pra ver os vídeos". Não dividir a tela do celular em painéis.**
- **Campeonatos:** só tipografia (cartaz de escalação). **Sem fotos** (baixa qualidade), **sem descrições de procedência**, **sem bolas nas laterais**.
- **Fotos:** não publicar imagem de baixa qualidade; preferir seção simples a foto ruim. Pendências em [MIDIA.md](MIDIA.md).
- **Ilustrações:** apito preto de árbitro com argola dourada (o de contorno foi rejeitado por feio), bola de futevôlei amarela e preta, quadra de areia com **rali animado** (a bola joga de um lado ao outro).
- **Movimento:** o cliente quer mais movimento no site em geral, sempre com função e coerente com o tema. Tudo respeita `prefers-reduced-motion`.
- **Botões de vidro** só sobre o vídeo da hero; em fundo liso, ouro sólido.
- Não inventar estatísticas, certificações, depoimentos, datas, cidades nem relações comerciais.

## Estado atual

Todas as seções prontas: hero, quem somos, compromissos, campeonatos, FAQ, contato (WhatsApp), rodapé, carregamento com progresso real e barra de CTA mobile. Verificado: 63 checagens automáticas, contraste dos botões de vidro 5,65:1 no pior caso, sem rolagem horizontal de 360 a 1440 px.

**Sessão de 27/10/2026 (pelo celular, ambiente na nuvem):**
- Hero compacta em celular baixo em pé (variante `baixo:` = altura ≤ 700 px e retrato): título menor, espaçamentos menores e só o CTA principal. Em 360×640 o título agora começa em 51% da altura, abaixo do rosto do árbitro.
- Economia de dados (`saveData` ou 2G): a hero fica só no pôster e não baixa o vídeo; o carregamento não espera o vídeo (`src/lib/economia.ts`).
- Scripts de teste aceitam `CHROME_PATH` (Chromium da nuvem) e continuam usando o Chrome do sistema sem ela.
- Não verificado nesta sessão: a URL pública (bloqueada no ambiente da nuvem) e o PageSpeed real.

## Pendências

1. **Número de WhatsApp** → variável `NEXT_PUBLIC_WHATSAPP_NUMBER` (na Vercel: Project Settings → Environment Variables, depois redeploy). Sem ele o formulário fica desativado, de propósito.
2. Materiais melhores (vídeos horizontal e vertical, foto da equipe original, logo vetorial): tabela em [MIDIA.md](MIDIA.md), com os comandos `ffmpeg` para trocar a hero.
3. Confirmar com o cliente: SPFC Futevôlei e Desafio ao Galo (estão na lista); Selva Cup, AD's Cup e Rio Open (ficaram de fora). Incluir um evento = uma linha em `src/content/site.ts`.
4. Logos de DRG Consultoria e apoiadores; cidades atendidas; e-mail; textos institucionais.

## Armadilhas já resolvidas (para não refazer)

- `whileInView` num elemento escondido por `overflow-hidden` **nunca dispara**: observe o contêiner, não o texto mascarado (ver `Titulo` em `Motion.tsx`).
- Next 16: `priority` virou `preload`; fonte com eixo extra exige `axes`; ler `node_modules/next/dist/docs/` antes de usar API nova.
- Reels do cliente são 720×1280: não ampliar para tela cheia horizontal (fica borrado); por isso o tríptico.
- `autoplay` ignora `preload="none"`: vídeo fora da primeira dobra não deve ter `autoplay`.
- Build em ambiente sem acesso à Google Fonts (nuvem): ver README, seção "Build sem internet".
- Depois de recriar um arquivo com `rm` + escrita, o Tailwind em dev pode ficar com CSS defasado: salvar o `globals.css` ou reiniciar o `next dev`.
