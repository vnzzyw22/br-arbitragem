# O que falta — BR Arbitragem Futevôlei

Atualizado em 28/10/2026. Estado completo e decisões do cliente: [HANDOFF.md](../HANDOFF.md). Direção de arte: [DESIGN.md](../DESIGN.md). Materiais: [MIDIA.md](../MIDIA.md).

## Onde está o trabalho

- **Branch:** `refinamento-visual-2026-10-28`, salva no GitHub. **A `main` não foi alterada**: o site no ar (https://br-arbitragem.vercel.app) continua na versão anterior.
- **Ver no computador:** `git fetch && git checkout refinamento-visual-2026-10-28 && npm install && npm run dev` → http://localhost:3000
- **Prévia online:** o push da branch pode gerar uma prévia na Vercel (o link aparece na página da branch no GitHub ou no painel da Vercel).
- **Publicar de verdade:** só com autorização do Vinicius: merge da branch na `main` e push (a Vercel publica sozinha).

## 1. Em andamento (faltam minutos)

**Elementos de praia (pedido de 28/10):** coqueiros e o mar chegando na areia, como na referência.

- [x] `src/components/Praia.tsx`: `BeiraMar` (água chegando na areia, com espuma que vai e volta) e `Coqueiro` (silhueta simples na paleta).
- [x] Beira-mar no fim de Quem somos (areia → mar) e no fim de Dúvidas (mar → areia do Contato); coqueiro ao lado do título de Compromissos e na coluna esquerda de Dúvidas (só desktop).
- [x] Ajuste de 28/10: a areia de Quem somos segue até a beira e a onda faz a passagem para o mar (e o inverso no fim de Dúvidas); água e espuma mais fortes; coqueiro maior no desktop. **Este último ajuste ainda não foi conferido em captura.**
- [ ] Conferir em desktop e celular (capturas) e ajustar posição e tamanho dos coqueiros.
- [ ] Rodar `tsc`, `lint` e a suíte (`scripts/interacoes.mjs`) contra a build de produção.
- [ ] Atualizar o DESIGN.md: a referência tinha palmeiras e elas tinham ficado de fora; agora entram por pedido do Vinicius.

## 2. Pronto na branch, falta só aprovar e publicar

| Item | O que mudou | Verificado |
|---|---|---|
| Logo | SVG traçado dos pixels do JPG original; maior no cabeçalho (52 px celular / 64 px desktop), nítida em telas 2×/3× | erro médio 2,4/255 contra o original |
| Título da hero | Mona Sans 800 só no h1 (comparado com 4 alternativas) | desktop, celular e 360×640 |
| Fundo praia | areia → água rasa → espuma → areia, por gradiente; uma só onda (sobre o vídeo) | contraste de todo o texto |
| Jogada | quadra vista de cima, 4 jogadores + árbitro que estende o braço e apita; simples, em segundo plano, sem botão | suíte: apito 0,28 s depois da bola tocar a areia |

Última verificação completa (antes dos elementos de praia): `tsc` e `lint` limpos, **88/88** na suíte, vidro sobre o vídeo 6,50:1, sem erros de console e sem rolagem horizontal em 1440/390/360 px.

## 3. Pendências técnicas (não bloqueiam a publicação)

- **Crítica formal da versão nova:** rodar a skill `impeccable` (crítica de design) e a `web-design-guidelines` (auditoria de acessibilidade/UX). Não foram rodadas nesta versão.
- **Movimento repetido:** todas as seções usam a mesma entrada escalonada dos cards e o mesmo "título sobe por máscara". Discreto, mas repetitivo; avaliar na crítica.
- **Teste intermitente:** "Em quadra: só o vídeo da frente toca" falhou uma vez com a máquina carregada e passou ao repetir. Se voltar a falhar, aumentar a espera do teste.
- **Desempenho real:** medir a URL publicada com PageSpeed/Lighthouse depois de publicar.
- **Celular de verdade:** testar a barra de CTA e o formulário com o teclado aberto num aparelho real.

## 4. Depende do cliente

1. **Número de WhatsApp** comercial → variável `NEXT_PUBLIC_WHATSAPP_NUMBER` na Vercel e redeploy. Sem ele o formulário fica desativado (de propósito).
2. **Logo vetorial oficial** (SVG, PDF ou AI): o SVG atual é fiel em tamanho pequeno, mas a palavra ARBITRAGEM não aguenta ampliação grande.
3. **Retorno sobre esta versão:** fundo praia, título mais forte, jogada, coqueiros.
4. **Materiais melhores:** vídeos horizontal e vertical, foto original da equipe em alta, fotos dos eventos sem imagem (SPFC Futevôlei, Desafio ao Galo, Amsterdam Cup) e da Queiróz Cup em alta. Lista em [MIDIA.md](../MIDIA.md).
5. **Confirmar eventos:** SPFC Futevôlei e Desafio ao Galo (estão no site); Selva Cup, AD's Cup e Rio Open (fora até confirmar). Se "Jogo limpo. Grande espetáculo." é lema da BR.
6. **Logos e perfis** de DRG Consultoria, Sandhit, Evolud, Redução Saúde e Auttotag.
7. **Cidades atendidas, e-mail e textos institucionais** confirmados.
8. **Autorização de uso** das imagens e vídeos de eventos de terceiros.
