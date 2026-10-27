# DESIGN.md — BR Arbitragem Futevôlei

Landing page única. Objetivo: transformar o organizador de campeonato em pedido de orçamento (WhatsApp).

## Conceito: "na linha"

O árbitro trabalha na linha: na fita de demarcação da areia, colado na rede, com o apito. A página usa esse vocabulário real: um traço dourado (a linha de quadra) abre cada seção, a bola de futevôlei corre por essa linha no topo conforme a página rola e a quadra de areia aparece vista de cima, com um rali em andamento. Autoridade calma, com a energia do jogo.

## Tipografia

Uma família só: **Schibsted Grotesk** (grotesca nascida em redação de jornal).
- Títulos: peso 600, caixa normal, tracking −0.03em, `line-height 1.04` (classe `.display`).
- Texto, navegação, botões e formulário: 400–600.
- **Sem serifa nos títulos.** Testadas e descartadas: Cormorant, Hedvig Letters Serif, Gloock e Libre Caslon (leitura de "editorial de IA"); Epilogue e Jost (genéricas); Archivo (usada na 1ª versão, pesada e condensada demais). A única serifa da página é a da própria logo.
- Sem eyebrow, sem acento em uma palavra só do título, sem numeração.

## Cor

| Token | Valor | Uso |
|---|---|---|
| `preto` | `#0A0A0A` | base (brief) |
| `grafite` | `#17191C` | seções alternadas |
| `prata` | `#A6A9AE` | texto secundário |
| `ouro` | `#D1A640` | CTAs e a linha de quadra. Brief sugeria `#C5A059`; calibrado para o amarelo saturado do uniforme |
| `areia` | `#E9DCC6` | única superfície clara: o Contato |
| `erro` | `#8F1D1D` | erros sobre areia (≥ 4,5:1) |

O azul-aço da logo fica só na logo. Amarelo/preto aparecem nas ilustrações (bola, apito).

## Hero

- Vídeo **em tela cheia** (`100svh`), sem moldura. Os reels do cliente são verticais (720×1280); por isso:
  - **Desktop** (largura > altura): tríptico 1920×1080 montado de 3 recortes verticais lado a lado, **sem ampliar nada**: Copa Gêmeos (ação), **árbitro ao centro (painel 18% mais largo, quase na resolução nativa)** e vista aérea da arena à direita, para onde o árbitro olha. Os três têm **cor casada** (luminância ≈120–131, mesmo tom quente leve, saturação 12–14).
  - **Mobile/retrato:** o reel vertical do árbitro preenche a tela como veio. (Tríptico vertical em painéis foi testado e rejeitado: painéis pequenos demais no celular.)
- Escurecimento só no necessário (base, lateral do título e topo do menu). Sem caixas opacas atrás do texto.
- Botões de **vidro** (`.btn-glass-ouro` e `.btn-glass`): fundo translúcido, `backdrop-filter`, filete claro, brilho que cruza no hover e fallback sólido em `@supports not`. Contraste medido sobre o vídeo: **pior caso 5,65:1** (mínimo 4,5:1). Fora do vídeo (fundos lisos) o botão é **ouro sólido** (`.btn-ouro`), porque vidro sem imagem atrás fica barrento.
- Ao rolar: o filme se afasta (paralaxe + zoom) e o texto sai antes dele. Botão de pausa (WCAG 2.2.2). Com `prefers-reduced-motion`, só o pôster.

## Carregamento

Tela preta com a logo e a bola correndo pela linha de quadra. O progresso é **real**, em 3 degraus que só contam quando o recurso chega: fontes, pôster da hero e primeiro quadro do vídeo. Mínimo de 0,9 s (para a marca ser vista), limite de 3,5 s (a página abre mesmo se algo falhar), rede de segurança em CSS de 5 s sem JS, não reaparece na mesma sessão e é pulado com movimento reduzido.

## Movimento

Tudo respeita `prefers-reduced-motion` (fica parado).
- **Hero:** entrada orquestrada em CSS (título sobe por máscara, linha de quadra se estende) + paralaxe ao rolar.
- **Títulos:** sobem por máscara ao entrar na tela (mesmo gesto da hero).
- **Fotos:** cortina de entrada + paralaxe discreta (zoom máx. 1,08, para não amolecer fotos de 1080 px).
- **Listas:** entrada escalonada (Quem somos, Compromissos, FAQ).
- **Quadra em jogo (Quem somos):** rali em loop de 4,8 s vista de cima. A bola cruza a rede, sobe e desce (escala) com sombra no chão e giro; dois jogadores se deslocam ao encontro dela; uma onda marca cada contato.
- **Bola de progresso:** corre pela linha dourada na base do menu conforme a página rola.
- **Campeonatos:** nome sobe por máscara; no hover avança e acende em ouro, e a linha de cima se desenha.
- **Apito (Contato):** dá um apitaço ao entrar na tela e depois balança pendurado pela argola.
- **Bola (rodapé):** quica.

## Componentes

- Botão principal: retângulo de canto leve (4 px), sem pill, sem `→`.
- Campos: só linha inferior, rótulo sempre visível, erro inline e foco no primeiro inválido.
- Listas por filetes (Compromissos, Campeonatos, FAQ), sem cards.
- **Campeonatos = cartaz de escalação só de tipografia**: nomes em corpo grande, escalonados. Sem fotos e sem descrições de procedência. Para incluir um evento, acrescentar uma linha em `src/content/site.ts`.
- CTA persistente no mobile: barra inferior (zona do polegar) que aparece depois da hero e some quando o formulário está na tela.

## Ilustrações

Apito preto de árbitro com argola dourada, bola de futevôlei amarela e preta e quadra de areia: vetores próprios em `src/components/Ornamentos.tsx`. A bola usa as cores da bola de referência do cliente, sem logotipos de terceiros; se houver um arquivo vetorial oficial, é só trocar o miolo em `BolaCorpo`.

## Conteúdo: o que é verificado e o que não é

Publicado só com registro: Arena Sun7, Queiróz Cup, Torneio do Bosque, Amsterdam Cup. **SPFC Futevôlei** e **Desafio ao Galo** vieram dos materiais enviados: nomes a confirmar. **Fora até confirmação:** Selva Cup, AD's Cup, Rio Open. Textos institucionais neutros: sem números, certificações, prazos, preços ou cobertura geográfica.
