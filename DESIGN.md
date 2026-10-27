# DESIGN.md — BR Arbitragem Futevôlei

Landing page única. Objetivo: transformar o organizador de campeonato em pedido de orçamento (WhatsApp).

## Conceito: "na linha"

O árbitro trabalha na linha: na fita de demarcação da areia, colado na rede, com o apito. A página usa esse vocabulário real. Um traço horizontal (a linha de quadra) abre cada seção e, na hero, atravessa a página inteira por cima do vídeo: o texto fica acima da linha, a ação abaixo. Autoridade calma, não euforia de torcida.

## Cor

| Token | Valor | Uso |
|---|---|---|
| `preto` | `#0A0A0A` | base (brief); é o preto do uniforme |
| `grafite` | `#17191C` | seções alternadas (Qualidade, FAQ) |
| `prata` | `#A6A9AE` | texto secundário, descrições |
| `ouro` | `#D1A640` | CTA principal e a linha de quadra. Brief sugeria `#C5A059`; calibrado para perto do amarelo saturado real do uniforme |
| `areia` | `#E9DCC6` | única superfície clara: o Contato. Amostrada da areia das fotos |
| `erro` | `#8F1D1D` | mensagens de erro sobre areia (≥ 4,5:1) |

O azul-aço da logo fica só na logo. Ouro nunca vira fundo de seção.

## Tipografia

Uma família, **Archivo** variável com eixo `wdth`:
- Títulos: `wdth 62`, peso 800, caixa alta, `line-height .9`, `text-wrap: balance` (classe `.display`).
- Texto e formulário: `wdth 100`, peso 400–600, 17 px / 1,55.
- Sem eyebrow, sem acento em uma palavra só do título, sem numeração.

Exceção consciente ao teto de 6rem de display: a hero (até 9rem) e o título do Contato (até 9rem) são os dois momentos altos, pedidos pelo brief ("imponente").

## Layout

- Container `.wrap`: máx. 1440 px, gutter 16 / 24 / 40 px.
- Grid de 12 colunas, alinhado à esquerda, assimétrico. Fotos sangram a margem em vez de ficarem em cards.
- Ritmo: preto → grafite → preto → grafite → **areia**. O Contato é o ponto de maior contraste da página.
- Hero ≥ 1024 px: texto à esquerda, painel vertical do vídeo (40vw) à direita. Abaixo disso: vídeo em tela cheia com texto na base.

## Imagem e vídeo

- Só material real do Instagram da equipe e dos eventos. Nenhuma imagem de banco ou gerada.
- Vídeos do cliente são verticais 720×1280, por isso a hero é um painel vertical no desktop e tela cheia no mobile.
- Hero: 12 s, sem áudio, H.264 `faststart`, ~1,1 MB, fade de 0,4 s nas pontas para o loop não "pular". Pôster WebP.
- Queiróz Cup: 3 trechos (~16 s), 540 px, ~1,6 MB, `preload="none"`.
- Vídeos só rodam enquanto visíveis e têm botão de pausa (WCAG 2.2.2). Com `prefers-reduced-motion` vira o pôster.

## Motion (framer-motion)

Um momento orquestrado: na hero, o título sobe por máscara, a linha de quadra se estende e o painel do vídeo abre de baixo para cima. No resto da página só dois gestos, ambos ligados ao motivo "linha": o traço dourado que se desenha ao abrir cada seção e a "cortina" nas fotos grandes. O restante só responde a ação: troca de mídia em Campeonatos, accordion do FAQ, botões. Sem fade-up por seção. `prefers-reduced-motion` desliga tudo.

## Componentes

- Botão principal: retângulo ouro, texto preto, sem pill, sem `→`. No Contato: preto sobre areia.
- Link secundário: sublinhado de 2 px.
- Campos: só linha inferior, rótulo sempre visível, erro inline e foco no primeiro inválido.
- Listas por linhas com filete (Qualidade, Campeonatos, FAQ), sem cards.
- Campeonatos: linhas de nome grande; no desktop a mídia fica fixa à direita e troca com hover/foco/clique; a linha ativa ganha o traço dourado em cima.
- CTA persistente no mobile: barra inferior (zona do polegar) que aparece depois da hero e some quando o formulário está na tela.

## Conteúdo: o que é verificado e o que não é

Publicado só com registro: Arena Sun7, Queiróz Cup, Torneio do Bosque (fotos/vídeo) e Amsterdam Cup (publicação do próprio torneio). **Fora até confirmação do cliente:** Selva Cup, AD's Cup, Rio Open. Textos institucionais são neutros: sem números, certificações, prazos, preços ou cobertura geográfica.
