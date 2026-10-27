# MIDIA.md — materiais, auditoria e pendências

## Onde fica cada arquivo (trocar mantendo o nome)

| Finalidade | Arquivo | Formato atual |
|---|---|---|
| Hero desktop | `public/video/hero/desktop.mp4` + `desktop-poster.webp` | 1920×1080, 7,8 s, sem áudio, 2,3 MB (tríptico) |
| Hero mobile | `public/video/hero/mobile.mp4` + `mobile-poster.webp` | 720×1280, 10 s, sem áudio, 1 MB |
| Logo | `src/assets/identidade/logo-br.jpg` | 150×150 (foto de perfil do Instagram) |
| Quem somos | `src/assets/equipe/time-sandhit.webp`, `arbitro-sorrindo.jpg` | 1080×1080 · 1080×1311 |
| Compromissos | `src/assets/equipe/arbitro-apito.jpg` | 1080×1350 |

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
