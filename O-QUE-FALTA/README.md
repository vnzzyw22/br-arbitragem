# O que falta — BR Arbitragem Futevôlei

Atualizado em 28/10/2026. Estado completo e decisões do cliente: [HANDOFF.md](../HANDOFF.md). Direção de arte: [DESIGN.md](../DESIGN.md). Materiais: [MIDIA.md](../MIDIA.md).

## Onde está o trabalho

- **Branch:** `refinamento-visual-2026-10-28`, salva no GitHub. **A `main` não foi alterada**: o site no ar (https://br-arbitragem.vercel.app) continua na versão anterior.
- **Ver no computador:** `git fetch && git checkout refinamento-visual-2026-10-28 && npm install && npm run dev` → http://localhost:3000
- **Prévia online:** o push da branch pode gerar uma prévia na Vercel (o link aparece na página da branch no GitHub ou no painel da Vercel).
- **Publicar de verdade:** só com autorização do Vinicius: merge da branch na `main` e push (a Vercel publica sozinha).

## 1. Elementos de praia — concluído (28/10, 19h)

- [x] `src/components/Praia.tsx`: `BeiraMar` (água chegando na areia, espuma que vai e volta) e `Coqueiro`.
- [x] Coqueiros **plantados na areia** da beira-mar de Quem somos (par no desktop, um no celular), com sombra; saíram de Compromissos e Dúvidas, onde boiavam sobre a água.
- [x] Emenda reta entre seções corrigida (brilhos radiais do fundo afastados do topo).
- [x] Conferido em capturas: 1440, 1280, 1024, 390 e 360 px.
- [x] `tsc`, `lint` e suíte: **90/90** contra a build de produção.
- [x] DESIGN.md atualizado (coqueiros por pedido do Vinicius; movimento).

## 2. Pronto na branch, falta só aprovar e publicar

| Item | O que mudou | Verificado |
|---|---|---|
| Logo | SVG traçado dos pixels do JPG original; maior no cabeçalho (52 px celular / 64 px desktop), nítida em telas 2×/3× | erro médio 2,4/255 contra o original |
| Título da hero | Mona Sans 800 só no h1 (comparado com 4 alternativas) | desktop, celular e 360×640 |
| Fundo praia | areia → água rasa → espuma → areia, por gradiente; uma só onda (sobre o vídeo) | contraste de todo o texto |
| Beira-mar e coqueiros | água chegando na areia; coqueiros só na areia | suíte: base dos coqueiros na beira-mar de Quem somos |
| Movimento | sem "sobe e aparece" genérico nos cards (crítica com `frontend-design`) | suíte: 20 cards inteiros antes de rolar |
| Jogada | quadra vista de cima, 4 jogadores + árbitro que estende o braço e apita; simples, em segundo plano, sem botão | suíte: apito 0,28 s depois da bola tocar a areia |

Última verificação completa (28/10, 19h, com tudo acima): `tsc` e `lint` limpos, **90/90** na suíte, vidro sobre o vídeo 6,49:1 (pior caso, medido de novo), sem erros de console e sem rolagem horizontal em 1440/390/360 px.

## 3. Pendências técnicas (não bloqueiam a publicação)

- **Crítica formal da versão nova:** feita com `frontend-design` (resultado acima). Falta rodar `impeccable` e `web-design-guidelines`, que só existem no computador do Vinicius.
- **Movimento:** a entrada escalonada dos cards saiu. Continua em todas as seções o "título sobe por máscara" com a linha de quadra; é discreto e marca o início de cada seção, mas pode ser reavaliado na crítica com `impeccable`.
- **Teste intermitente:** "Em quadra: só o vídeo da frente toca" falhou uma vez com a máquina carregada e passou ao repetir (nas duas rodadas de 28/10 à noite passou). Se voltar a falhar, aumentar a espera do teste.
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
