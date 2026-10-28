# DESIGN.md — BR Arbitragem Futevôlei

Landing page única. Objetivo: transformar o organizador de campeonato em pedido de orçamento (WhatsApp).

## Conceito: "na linha", na praia

O árbitro trabalha na linha: na fita de demarcação da areia, colado na rede, com o apito. A página usa esse vocabulário real: um traço azul (a linha de quadra) abre cada seção, a bola de futevôlei corre por uma linha no topo conforme a página rola e a quadra de areia aparece vista de cima, com um rali em andamento. Desde 28/10 a paleta é a da praia, **areia clara, branco e azul**, a pedido do Vinicius: autoridade calma, com a energia do jogo e a luz da areia.

## Tipografia: exatamente duas famílias, nenhum itálico

Regra do cliente (28/10): duas famílias em todo o site, nenhum itálico em nenhum elemento, nenhuma fonte extra. A suíte de testes confere as três coisas.

| Papel | Família | Peso | Largura | Classe |
|---|---|---|---|---|
| Títulos (h1, h2), nomes dos campeonatos, marca no rodapé | **Mona Sans** | 500 | 116% (expandida) | `.display` |
| Subtítulos (itens de lista, perguntas do FAQ, apoiadores) | **Mona Sans** | 500 | 108% | `.subtitulo` |
| Texto, formulário, legendas | **Schibsted Grotesk** | 400 | — | padrão do `body` |
| Menu, rótulos, opções do formulário | Schibsted Grotesk | 500 | — | `font-medium` |
| Botões | Schibsted Grotesk | 600 | — | `.btn` |

- A largura expandida da Mona Sans dá o ar esportivo (placar, camisa de jogo) sem peso nem condensação; o peso 500 mantém a elegância. A Schibsted, estreita e de redação, contrasta com ela e lê bem no celular.
- Itálico bloqueado no CSS global (`font-style: normal !important` e `font-synthesis: none`) e nas fontes (`style: "normal"` no `next/font`).
- **Descartadas:** Cormorant, Hedvig Letters Serif, Gloock, Libre Caslon e Instrument Serif ("editorial de IA"); Archivo e Anton (pesadas/condensadas); Epilogue e Jost (genéricas); Hubot Sans (mecânica), Saira (automotiva), Encode Sans (neutra), Familjen e Funnel (informais). Comparadas renderizadas sobre o pôster real da hero.
- Sem eyebrow em caixa alta, sem destaque de uma palavra só, sem numeração.

## Cor

Medida nos materiais reais: o azul vem da logo (`#5888C8`) e a areia, do próprio vídeo (`#E1CFB9`). Todos os pares verificados com `contrast_check.py` (skill codemakers-design) e, na página renderizada, pelo auditor da suíte.

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `areia` | `#F2E8DC` | superfície clara (Quem somos, Contato) com grão de areia muito leve | tinta 12,7:1 |
| `areia-forte` | `#E1CFB9` | areia real: chão da quadra ilustrada | tinta 10,1:1 |
| `branco` | `#FFFFFF` | Campeonatos | tinta 15,4:1 |
| `tinta` | `#13263A` | texto sobre claro (secundário: 72–80% de opacidade, ≥ 5,6:1) | — |
| `oceano` | `#102B44` | seções escuras (Compromissos, Dúvidas, Em quadra) | branco 14,5:1; branco 75% 8,7:1 |
| `oceano-profundo` | `#0B1E31` | rodapé, carregamento, menu rolado e véu do vídeo | branco 16,9:1 |
| `azul` | `#5888C8` | azul da logo: linhas de quadra (só não-texto) | 3,0:1 na areia, 4,0:1 no oceano |
| `azul-acao` | `#2C5C99` | botões e links sobre claro, foco no claro | branco 6,8:1; na areia 5,6:1 |
| `ceu` | `#A8C8EE` | destaque e foco sobre escuro, barra de progresso | no oceano 8,4:1 |
| `erro` | `#8F1D1D` | erros sobre areia | 7,3:1 |
| `ouro` | `#D1A640` | só ilustrações (argola do apito, bola) | — |

Ritmo das seções: hero (vídeo) → Em quadra, só no celular (oceano) → Quem somos (areia) → Compromissos (oceano) → Campeonatos (branco) → Dúvidas (oceano) → Contato (areia) → rodapé (oceano-profundo). Seções claras usam a classe `.claro` (texto em tinta e foco em azul de ação).

## Hero

- Vídeo **em tela cheia** (`100svh`), sem moldura. Os reels do cliente são verticais (720×1280); por isso:
  - **Desktop** (largura > altura): tríptico 1920×1080 montado de 3 recortes verticais lado a lado, **sem ampliar nada**: Copa Gêmeos (ação), **árbitro ao centro** e vista aérea da arena à direita, para onde o árbitro olha, com cor casada.
  - **Mobile/retrato:** o reel vertical do árbitro preenche a tela como veio. (Tríptico vertical em painéis foi testado e rejeitado: painéis pequenos demais no celular.)
- **Véu azul-profundo** (`oceano-profundo`) só onde o texto pede: base, lateral do título e topo do menu. Tinge o filme de fim de tarde na praia sem apagá-lo. Sem caixas opacas atrás do texto.
- Botões de **vidro em pílula** (referência: Lobeca): o principal é vidro de areia quase opaco com texto em tinta (`.btn-glass-claro`); o secundário é vidro branco fosco com texto branco (`.btn-glass`). Reflexo de 1 px no topo, sombra macia, brilho discreto no hover e fallback sólido em `@supports not`. Contraste medido sobre o vídeo em 8 instantes, desktop e celular: **pior caso 6,89:1**. Fora do vídeo, botões sólidos: `.btn-azul` (azul de ação, no claro) e `.btn-claro` (areia, no escuro).
- Ao rolar: o filme se afasta (paralaxe + zoom) e o texto sai antes dele. Botão de pausa (WCAG 2.2.2). Com `prefers-reduced-motion` ou economia de dados, só o pôster.

## Carregamento

Tela azul-profunda com a logo e a bola correndo pela linha de quadra (azul-céu). O progresso é **real**, em 3 degraus que só contam quando o recurso chega: fontes, pôster da hero e primeiro quadro do vídeo. Mínimo de 0,9 s, limite de 3,5 s, rede de segurança em CSS de 5 s sem JS, não reaparece na mesma sessão e é pulado com movimento reduzido.

## Movimento

Tudo respeita `prefers-reduced-motion` (fica parado).
- **Hero:** entrada orquestrada em CSS (título sobe por máscara, linha de quadra se estende) + paralaxe ao rolar.
- **Menu:** o marcador de vidro desliza até a seção que está no meio da tela.
- **Títulos:** sobem por máscara ao entrar na tela.
- **Fotos:** cortina de entrada + paralaxe discreta (zoom máx. 1,08).
- **Listas:** entrada escalonada (Quem somos, Compromissos, FAQ).
- **Quadra em jogo (Quem somos):** rali em loop de 4,8 s, vista de cima, na areia real com fita branca e rede. A bola cruza a rede, sobe e desce com sombra no chão; dois jogadores (azul e tinta) vão ao encontro dela.
- **Bola de progresso:** corre pela linha azul-céu na base do menu.
- **Campeonatos:** nome sobe por máscara; no hover avança e acende no azul de ação, e a linha de cima se desenha.
- **Apito (Contato):** apitaço ao entrar na tela e balanço pela argola. **Bola (rodapé):** quica.

## Componentes

- **Menu (desktop):** logo à esquerda, pílula de vidro central com Equipe, Compromissos, Campeonatos e Dúvidas, e o CTA à direita. A seção visível fica marcada (`aria-current="location"`). Ao rolar, a barra vira vidro azul-profundo. No celular só a logo (a barra inferior leva ao orçamento).
- **Botões:** pílula, sem `→`.
- **Campos:** só linha inferior, rótulo sempre visível, erro inline e foco no primeiro inválido.
- **Tipo de evento:** opções em botões de pílula (rádios reais por baixo, `role="radiogroup"` com `aria-invalid`), 48 px de altura, setas do teclado funcionam, foco visível. Substituiu a lista suspensa: um toque no celular. A mensagem do WhatsApp é a mesma.
- Listas por filetes (Compromissos, Campeonatos, FAQ), sem cards.
- **Campeonatos = cartaz de escalação só de tipografia**: nomes grandes, escalonados. Sem fotos e sem descrições de procedência. Incluir um evento = uma linha em `src/content/site.ts`.
- **Em quadra (só celular em pé):** abaixo da hero, os dois clipes laterais do tríptico **inteiros**, em cards 5:9 que rolam para o lado; indicador em linha acende em azul-céu o vídeo da frente. Só o da frente toca; baixa só ao chegar na tela; pausa; pôsteres com movimento reduzido ou economia de dados.
- CTA persistente no mobile: barra inferior de vidro azul-profundo com botão de areia; aparece depois da hero e some quando o formulário está na tela.

## Ilustrações

Apito preto de árbitro com argola dourada, bola de futevôlei amarela e preta e quadra de areia: vetores próprios em `src/components/Ornamentos.tsx`. O amarelo e o preto ficam só aqui, como na bola e no uniforme reais. Se houver um vetor oficial da bola, trocar o miolo em `BolaCorpo`.

## Referência br-arbitragem-one (estudada em 28/10 com o método do AI Website Cloner)

Aproveitado como princípio, sem copiar texto, imagem ou código: a paleta de praia, a alternância de seções claras e escuras, o menu em pílula com a seção atual e as opções do formulário em botões. **Não aproveitado:** três famílias tipográficas (Anton, Manrope, Instrument Serif) e itálico, títulos condensados pesados em caixa alta, palavra destacada em outra cor, rótulos em caixa alta, quatro cartões iguais com ícone, quadros vazios "FOTO DE EVENTO/FOTO DA EQUIPE", sol e palmeiras decorativos, links "Contato" sem destino, "Selva Cup" sem confirmação e uma foto de hero que não é da BR. Capturas lado a lado em `.shots/comparacao-*.png` (pasta ignorada pelo git).

## Conteúdo: o que é verificado e o que não é

Publicado só com registro: Arena Sun7, Queiróz Cup, Torneio do Bosque, Amsterdam Cup. **SPFC Futevôlei** e **Desafio ao Galo** vieram dos materiais enviados: nomes a confirmar. **Fora até confirmação:** Selva Cup, AD's Cup, Rio Open. Textos institucionais neutros: sem números, certificações, prazos, preços ou cobertura geográfica.
