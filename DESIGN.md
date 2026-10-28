# DESIGN.md — BR Arbitragem Futevôlei

Landing page única. Objetivo: transformar o organizador de campeonato em pedido de orçamento (WhatsApp).

## Conceito: "na linha", na praia

O árbitro trabalha na linha: na fita de demarcação da areia, colado na rede, com o apito. A página usa esse vocabulário real: um traço azul (a linha de quadra) abre cada seção, a bola de futevôlei corre por uma linha no topo conforme a página rola e a quadra de areia aparece vista de cima, com uma jogada completa que termina no apito do árbitro. Desde 28/10 a paleta é a da praia, **areia clara, branco e azul**, a pedido do Vinicius: autoridade calma, com a energia do jogo e a luz da areia.

## Tipografia: exatamente duas famílias, nenhum itálico

Regra do cliente (28/10): duas famílias em todo o site, nenhum itálico em nenhum elemento, nenhuma fonte extra. A suíte de testes confere as três coisas.

| Papel | Família | Peso | Largura | Classe |
|---|---|---|---|---|
| Título da hero (só o h1) | **Mona Sans** | 800 | 116% (expandida) | `.display .display-hero` |
| Títulos (h2), nomes dos campeonatos, marca no rodapé | **Mona Sans** | 500 | 116% (expandida) | `.display` |
| Subtítulos (itens de lista, perguntas do FAQ, apoiadores) | **Mona Sans** | 500 | 108% | `.subtitulo` |
| Texto, formulário, legendas | **Schibsted Grotesk** | 400 | — | padrão do `body` |
| Menu, rótulos, opções do formulário | Schibsted Grotesk | 500 | — | `font-medium` |
| Botões | Schibsted Grotesk | 600 | — | `.btn` |

- **Título da hero (28/10):** pedido de mais força só no h1, sem terceira família. Comparadas sobre o vídeo real, em 1440×900 e 390×844: Mona 700 a 112%, Mona 800 a 120% (letras encostavam), Mona 800 a 100% (perdia a largura que é a assinatura dos títulos) e Schibsted 800 (limpa, mas genérica e sem ligação com os outros títulos). Escolhida: **Mona 800 a 116%, tracking −0,032em, entrelinha 1,0** — a mesma família e a mesma largura dos demais títulos, só com mais peso. No desktop o tamanho voltou a 4,5vw (máx. 4,5rem) para não encostar no árbitro do vídeo.
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
| `agua-clara` | `#DCEAF4` | card claro sobre branco (SPFC) | tinta 12,5:1 |
| `agua` | `#1D5A84` | (reserva; saiu dos cards em 28/10, ver `mar`) | branco 7,4:1 |
| `agua-rasa` | `#E3EFEE` | fundo: fim de Quem somos, começo de Compromissos, Dúvidas | tinta 13,1:1 |
| `agua-media` | `#D3E6E6` | fundo: miolo de Compromissos (cor-base medida pelo auditor) | tinta 11,9:1 |
| `agua-funda` | `#BCD9DD` | card de água sobre a água média (Postura) | tinta 10,3:1 |
| `espuma` | `#F7FAF9` | fundo: fim de Compromissos, começo de Campeonatos | tinta 14,6:1 |
| `areia-umida` | `#E8D8C3` | fundo: fim do Contato | tinta 11:1 |
| `mar` | `#256069` | azul-esverdeado: cards de destaque com texto branco (Integridade, Instagram, fecho do FAQ) | branco 7,1:1; branco 80% 5,2:1 |
| `erro` | `#8F1D1D` | erros sobre areia | 7,3:1 |
| `ouro` | `#D1A640` | só ilustrações (argola do apito, bola) | — |

**Maré: fundo contínuo (28/10, parte 3).** O brief recusou a alternância mecânica azul-escuro / areia / branco com uma onda entre todas as seções. Agora a página é uma composição só, que desce da areia à água rasa e volta à areia:

hero (vídeo, véu azul) → **uma única linha d'água** (a areia de Quem somos lava sobre o vídeo; no celular em pé fica depois da faixa Em quadra) → Quem somos em areia clara com luz suave, virando água rasa → Compromissos em água rasa → espuma → Campeonatos em espuma/branco → água rasa → Dúvidas em água rasa → areia → Contato em areia → areia úmida → rodapé azul-profundo.

- Cada seção tem uma **cor-base sólida** (é nela que o auditor mede o texto) e um gradiente que a costura às vizinhas: o fim de uma é exatamente o começo da seguinte (`.fundo-equipe`, `.fundo-agua`, `.fundo-espuma`, `.fundo-duvidas`, `.fundo-contato` em `globals.css`).
- Profundidade só com manchas de luz muito suaves (gradientes radiais brancos). Sem ondas repetidas, sem textura fotográfica, sem vidro fora da hero. O grão de areia some onde Quem somos vira água (`.textura-fade`).
- Os únicos blocos escuros são a hero e o rodapé; o azul-marinho e o azul-esverdeado entram como acento nos cards (Amsterdam Cup em `oceano`; Integridade, Instagram e fecho do FAQ em `mar`).
- Estudo da referência (método do `/clone-website`, só observação): ela usa base de areia `#F4ECDF` e mar `#2F5D66` com texturas fotográficas. Aproveitado o princípio (dois humores, areia e mar, cards que pertencem à superfície); não aproveitadas as texturas, o sol e as ondas recortadas. **Coqueiros entraram depois, por pedido do Vinicius (28/10)**, junto com a beira-mar.
- **Beira-mar e coqueiros (`Praia.tsx`):** a água chega na areia no fim de Quem somos (areia → mar de Compromissos) e no fim de Dúvidas (mar → areia do Contato), com espuma que vai e volta devagar. Os coqueiros ficam **sempre na areia**, plantados na beira-mar de Quem somos (par no desktop, um pequeno no celular), com sombra no chão; nunca sobre seção de água (a suíte confere). Os brilhos radiais do fundo não encostam no topo das seções, para não marcar emenda reta entre elas.

Seções claras usam a classe `.claro` (texto em tinta e foco em azul de ação); desde 28/10 são todas, menos hero, Em quadra e rodapé.

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
- **Jogada na quadra (Quem somos, `Futevolei.tsx`):** loop contínuo de 7 s, vista de cima, no mesmo traço simples do rali anterior (areia real, fita branca, rede, jogadores em ombros + cabeça). Quatro atletas, dois de cada lado, e o **árbitro na cadeira junto ao poste** (camisa preta com mangas amarelas, como o uniforme real). B2 saca → A1 recebe e levanta → A2 ataca por cima da rede (salto = escala leve) → a bola cai entre B1 e B2, com anel na areia → o árbitro **estende o braço para o lado que pontuou e apita: duas ondas saem dele 0,28 s depois do toque** → todos voltam e a bola reaparece com B2. A altura da bola é escala, com sombra no chão. É um detalhe da seção, não o foco (pedido do Vinicius: simples, em segundo plano, sem botão, como um vídeo contínuo). Para fora da tela; com movimento reduzido fica parada no quadro do apito (55,5% do ciclo). Uma versão em vista lateral, mais desenhada e com botão de pausa, foi feita e **descartada** pelo Vinicius em 28/10.
- **Bola de progresso:** corre pela linha azul-céu na base do menu.
- **Cards, etiquetas e parágrafos:** **sem entrada animada** (o "sobe e aparece" escalonado saiu em 28/10 na crítica de design: era o mesmo efeito em todas as seções, o padrão genérico que a regra 3 proíbe). O movimento fica no que é do tema: linha de quadra, título, fotos, jogada, espuma, bola de progresso, apito e bola quicando. A suíte confere que os cards já estão inteiros antes de a página rolar até eles. Sem hover onde não há clique.
- **Apito (Contato):** apitaço ao entrar na tela e balanço pela argola. **Bola (rodapé):** quica.

## Cards e fotografia (28/10)

Pedido do Vinicius: menos texto corrido, mais cards e fotos reais. Base `.cartao`: raio de 20 px, filete fino, reflexo de 1 px e sombra longa e macia (`.cartao-escuro` sobre azul). Cards que não levam a lugar nenhum **não têm hover** (só o card do Instagram, que é link). Ícones próprios em SVG (`src/components/Icones.tsx`): grade de 24 px, traço de 1,6, sem biblioteca nova.

- **Quem somos:** composição editorial — a equipe em quadra como foto principal (com legenda), o retrato de um árbitro sobreposto no canto com moldura branca, texto de uma frase, princípios em etiquetas e a quadra em jogo num card de "prancheta".
- **Compromissos:** grade assimétrica de 5 cards; o tamanho segue o conteúdo — Condução (foto do árbitro em ação, card alto), Regras (areia com grão), Postura (água clara com a foto da equipe uniformizada), Organização (branco) e Integridade (água, frase grande). Ordem visual = ordem do código.
- **Campeonatos:** cards; foto **só** quando a imagem é do próprio evento (Arena Sun7 e Torneio do Bosque em capa com véu azul na base; Queiróz Cup com a vista aérea como selo). SPFC, Desafio ao Galo e Amsterdam Cup são cartazes tipográficos com a quadra desenhada como selo. Fecha com o card do Instagram.
- **Dúvidas:** acordeão em cards compactos, uma pergunta aberta por vez, "+/−" num círculo; card final leva ao formulário.
- **Contato:** passos numerados (sequência real: formulário → WhatsApp → conversa) e o formulário num painel branco com campos em caixa.

## Componentes

- **Logo (28/10):** SVG reconstruído a partir dos pixels do único arquivo existente (JPG 150×150), sem redesenhar: B azul, R cinza, bola fantasma e ARBITRAGEM, no disco branco. 52 px no celular e 64 px no desktop, alinhada ao centro da pílula do menu; no rodapé (88 px) e no carregamento (96 px) agora fica nítida em tela 2×. Detalhes e fidelidade em [MIDIA.md](MIDIA.md).
- **Menu (desktop):** logo à esquerda, pílula de vidro central com Equipe, Compromissos, Campeonatos e Dúvidas, e o CTA à direita. A seção visível fica marcada (`aria-current="location"`). Ao rolar, a barra vira vidro azul-profundo. No celular só a logo (a barra inferior leva ao orçamento).
- **Botões:** pílula, sem `→`.
- **Campos:** em caixa (borda fina, branco), rótulo sempre visível, borda vermelha e erro inline quando inválido, foco no primeiro inválido.
- **Tipo de evento:** opções em botões de pílula (rádios reais por baixo, `role="radiogroup"` com `aria-invalid`), 48 px de altura, setas do teclado funcionam, foco visível. Substituiu a lista suspensa: um toque no celular. A mensagem do WhatsApp é a mesma.
- Princípios em etiquetas; Compromissos, Campeonatos e FAQ em cards (ver acima). Nada de cinco caixas iguais: tamanho e superfície variam com o conteúdo.
- **Campeonatos:** incluir um evento = uma linha em `src/content/site.ts`; foto opcional, só com associação visível ao evento. Sem descrições de procedência no texto.
- **Em quadra (só celular em pé):** abaixo da hero, os dois clipes laterais do tríptico **inteiros**, em cards 5:9 que rolam para o lado; indicador em linha acende em azul-céu o vídeo da frente. Só o da frente toca; baixa só ao chegar na tela; pausa; pôsteres com movimento reduzido ou economia de dados.
- CTA persistente no mobile: barra inferior de vidro azul-profundo com botão de areia; aparece depois da hero e some quando o formulário está na tela.

## Ilustrações

Apito preto de árbitro com argola dourada, bola de futevôlei amarela e preta e quadra de areia: vetores próprios em `src/components/Ornamentos.tsx`. O amarelo e o preto ficam só aqui, como na bola e no uniforme reais. Se houver um vetor oficial da bola, trocar o miolo em `BolaCorpo`.

## Referência br-arbitragem-one (estudada em 28/10 com o método do AI Website Cloner)

Aproveitado como princípio, sem copiar texto, imagem ou código: a paleta de praia, a alternância de seções claras e escuras, o menu em pílula com a seção atual e as opções do formulário em botões. **Não aproveitado:** três famílias tipográficas (Anton, Manrope, Instrument Serif) e itálico, títulos condensados pesados em caixa alta, palavra destacada em outra cor, rótulos em caixa alta, quatro cartões iguais com ícone, quadros vazios "FOTO DE EVENTO/FOTO DA EQUIPE", sol e palmeiras decorativos, links "Contato" sem destino, "Selva Cup" sem confirmação e uma foto de hero que não é da BR. Capturas lado a lado em `.shots/comparacao-*.png` (pasta ignorada pelo git).

## Conteúdo: o que é verificado e o que não é

Publicado só com registro: Arena Sun7, Queiróz Cup, Torneio do Bosque, Amsterdam Cup. **SPFC Futevôlei** e **Desafio ao Galo** vieram dos materiais enviados: nomes a confirmar. **Fora até confirmação:** Selva Cup, AD's Cup, Rio Open. Textos institucionais neutros: sem números, certificações, prazos, preços ou cobertura geográfica.
