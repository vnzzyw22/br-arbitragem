# MIDIA.md — materiais, auditoria e pendências

## Onde fica cada arquivo (trocar mantendo o nome)

| Finalidade | Arquivo | Formato atual |
|---|---|---|
| Hero desktop | `public/video/hero/desktop.mp4` + `desktop-poster.webp` | 1920×1080, 7,8 s, sem áudio, 2,3 MB (tríptico) |
| Hero mobile | `public/video/hero/mobile.mp4` + `mobile-poster.webp` | 720×1280, 7,8 s, sem áudio, 1,5 MB (**tríptico vertical**: árbitro em cima, Copa Gêmeos e arena embaixo) |
| Logo | `src/assets/identidade/logo-br.jpg` | 150×150 (foto de perfil do Instagram) |
| Quem somos | `src/assets/equipe/time-sandhit.webp`, `arbitro-sorrindo.jpg` | 1080×1080 · 1080×1311 |
| Compromissos | `src/assets/equipe/arbitro-apito.jpg` | 1080×1350 |

**Depois de trocar qualquer arquivo da hero, aumente `VERSAO` em `src/lib/midia.ts`**: o nome continua o mesmo, então sem isso celulares e a CDN podem seguir mostrando a versão antiga.

O código escolhe o vídeo da hero pela orientação da tela (`min-aspect-ratio: 1/1`). **Quando chegar um vídeo horizontal de verdade**, basta gerar os dois arquivos (comandos abaixo); não precisa mexer no código.

```bash
# desktop: vídeo horizontal 16:9 -> 1920x1080, sem áudio, leve, com fade de 0,4 s nas pontas para o loop
ffmpeg -i novo-horizontal.mp4 -an -t 12 -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,fade=t=in:st=0:d=0.4:color=#0a0a0a,fade=t=out:st=11.55:d=0.45:color=#0a0a0a" -c:v libx264 -preset slow -crf 27 -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -movflags +faststart public/video/hero/desktop.mp4
ffmpeg -ss 3 -i public/video/hero/desktop.mp4 -frames:v 1 -c:v libwebp -quality 70 public/video/hero/desktop-poster.webp

# mobile: vídeo vertical 9:16 -> 720x1280
ffmpeg -i novo-vertical.mp4 -an -t 10 -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30" -c:v libx264 -preset slow -crf 27 -maxrate 1400k -bufsize 2800k -pix_fmt yuv420p -movflags +faststart public/video/hero/mobile.mp4
ffmpeg -ss 2 -i public/video/hero/mobile.mp4 -frames:v 1 -c:v libwebp -quality 82 public/video/hero/mobile-poster.webp
```

Se o novo vídeo horizontal não precisar do fade, retirar `fade=...` do filtro.

### Tríptico vertical do mobile (versão atual)

Mesma ideia do desktop, reorganizada para tela em pé, **sem ampliar nada**: o árbitro vem do reel original em resolução nativa (faixa 720×500, cabeça e tronco) e os dois clipes laterais vêm dos painéis do `desktop.mp4`, **reduzidos** (600×1080 → 430×774, recorte de 357 px de largura). Divisórias escuras de 6 px, como no desktop. A divisória horizontal fica a 39% da altura para ficar sempre acima do título (conferido em 360×640, 390×844 e 412×915).

```bash
# reel-arbitro.mp4 = brarbitragem.ftv.mp4 já em 720x1280 (o mobile.mp4 antigo)
ffmpeg -t 7.8 -i reel-arbitro.mp4 -t 7.8 -i public/video/hero/desktop.mp4 -filter_complex "
[0:v]trim=0:7.8,setpts=PTS-STARTPTS,crop=720:500:0:230,fps=30,fade=t=in:st=0:d=0.4:color=#0a0a0a,fade=t=out:st=7.35:d=0.45:color=#0a0a0a[top];
[1:v]split[a][b];
[a]crop=600:1080:0:0,scale=-2:774:flags=lanczos,crop=357:774,fps=30[bl];
[b]crop=600:1080:1320:0,scale=-2:774:flags=lanczos,crop=357:774,fps=30[br];
color=c=0x0a0a0a:s=6x774:r=30:d=7.8[sv];color=c=0x0a0a0a:s=720x6:r=30:d=7.8[sh];
[bl][sv][br]hstack=3[bot];[top][sh][bot]vstack=3,format=yuv420p[out]" -map "[out]" -an -c:v libx264 -preset slow -crf 28 -maxrate 1400k -bufsize 2800k -movflags +faststart public/video/hero/mobile.mp4
ffmpeg -ss 2 -i public/video/hero/mobile.mp4 -frames:v 1 -c:v libwebp -quality 82 public/video/hero/mobile-poster.webp
```

## Auditoria individual

### Mantidos

| Arquivo (origem) | Uso | Observação |
|---|---|---|
| `brarbitragem.ftv.mp4` (720×1280, 12 s) | hero mobile e painel central do tríptico | único com árbitro em foco e espaço para texto; sol aberto; 720p é o limite |
| `ortizz.fotos.mp4` (720×1280, 23 s) | painel esquerdo do tríptico | ação de futevôlei nítida (Copa Gêmeos) |
| `queirozcup.mp4` (720×1280, 65 s) | painel direito do tríptico | vista aérea da arena + ação; gradação sépia casada com os outros |
| foto do time (`683605514`, 1080²) | Quem somos | **compressão e realce visíveis**; mantida por falta de alternativa melhor (ver pendências) |
| `527634017` (1080×1311) | Quem somos (menor) | árbitro sorrindo, boa luz |
| `488548770` (1080×1350) | Compromissos | árbitro com apito, boa luz e composição |

### Rejeitados

| Arquivo | Motivo |
|---|---|
| `brarbitragem.ftv (1).mp4` | compilação cheia de legendas sobrepostas ("Grande Final"…); 720p |
| `spfcfutevolei.mp4` | montagem com cortes rápidos, muito motion blur e marcas de terceiros em destaque |
| `656101782` (árbitro com apito, lateral) | macio/borrado já em 1080 px |
| `657679605` (equipe de corta-vento, noite) | ruído de celular, foco macio |
| `656727906` (equipe de camisa branca) | luz chapada e compressão |
| `694122933` (equipe com jogadores do SPFC) | ruído, faixas de terceiros |
| `489…`, `490…`, `522…` (arbitragemftv) | 720–776 px de largura: perdem nitidez acima de ~400 px |

### Removidos da página a pedido do cliente (baixa qualidade)

As fotos da seção **Campeonatos** (Arena Sun7, Torneio do Bosque, SPFC Futevôlei, Desafio ao Galo, faixa de bastidores) e o vídeo do Queiróz Cup. A seção agora é só tipografia. Os arquivos originais continuam em `Downloads`; não estão no projeto.

## Pendências — materiais a baixar

| Seção | Material necessário | Resolução / proporção | Por que o atual não serve |
|---|---|---|---|
| Hero desktop | vídeo **horizontal** de árbitros em quadra, câmera estável, espaço livre à esquerda | 16:9, 1920×1080 ou mais, 8–15 s | hoje é um tríptico montado de reels verticais 720p |
| Hero mobile | vídeo **vertical** do árbitro em ação | 9:16, 1080×1920 | o atual tem 720×1280 |
| Quem somos | foto da equipe uniformizada, **arquivo original** (não do Instagram) | ≥ 2000 px no lado maior, quadrada ou 4:3 | a atual tem 1080 px, compressão e realce visíveis |
| Compromissos | retrato do árbitro em ação (apito, sinalização) | 4:5, ≥ 1600×2000 | a atual tem 1080×1350 |
| Identidade | logo em **vetor (SVG)** ou PNG transparente | ≥ 1000 px | hoje é a foto de perfil 150×150 com fundo branco |
| Campeonatos (opcional) | fotos originais de cada evento, se quiserem voltar a mostrá-las | ≥ 2000 px | as disponíveis eram de 720–1080 px |
| Rodapé | logos de DRG Consultoria, Sandhit, Evolud, Redução Saúde e Auttotag (SVG) | — | hoje só os nomes |
