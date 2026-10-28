# BR Arbitragem Futevôlei — landing page

Next 16 + React 19 + Tailwind 4 + framer-motion. Página única e estática.
- Direção de arte, tipografia e movimento: [DESIGN.md](DESIGN.md)
- Materiais, auditoria e pendências: [MIDIA.md](MIDIA.md)

## Rodar

```bash
npm install
cp .env.example .env.local   # preencher NEXT_PUBLIC_WHATSAPP_NUMBER
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## Formulário de orçamento

Envia por **WhatsApp**: valida os campos, monta a mensagem e abre `wa.me/<número>?text=...`. Não há backend nem credenciais. A página nunca diz "enviado": pede para o visitante tocar em enviar na conversa.

O número vem de `NEXT_PUBLIC_WHATSAPP_NUMBER` (só dígitos, DDI+DDD, ex.: `5541999999999`). **Sem ele o botão fica desativado**, com aviso e link para o Instagram. A variável é lida no build: depois de definir, rebuild/redeploy.

## Conteúdo

Textos, eventos, FAQ, patrocinador e apoiadores em `src/content/site.ts`. Eventos só entram com registro (ou confirmação do cliente) e **não precisam de foto**: basta uma linha. Vídeos e fotos: ver [MIDIA.md](MIDIA.md).

## Verificação (`scripts/`, exigem Chrome)

Os testes rodam contra uma **build de produção em outra pasta**, para não pisar no servidor de desenvolvimento:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=5541900000000 NEXT_DIST_DIR=.next-test npx next build   # número FICTÍCIO, só para testar
NEXT_PUBLIC_WHATSAPP_NUMBER=5541900000000 NEXT_DIST_DIR=.next-test npx next start -p 3300
node scripts/interacoes.mjs          # 88 verificações: carregamento, hero, vídeo, tipografia (2 famílias, sem itálico), contraste, fundo contínuo, nitidez das fotos em tela 2×, cards, menu, formulário, jogada (4 atletas + árbitro, apito depois do toque), mobile, movimento reduzido
```

Sem Chrome instalado (ex.: nuvem), aponte para outro Chromium: `CHROME_PATH=/caminho/do/chrome node scripts/interacoes.mjs`.

### Build sem internet (Google Fonts bloqueada)

O `next/font/google` baixa as fontes no build. Num ambiente sem acesso a `fonts.googleapis.com`, para **testar** localmente: baixe as duas fontes pelo npm (`npm pack @fontsource-variable/schibsted-grotesk @fontsource-variable/mona-sans`), crie um módulo que devolva o `@font-face` de cada família (a da Mona Sans com `font-stretch: 75% 125%`) apontando para o `.woff2` local, escolhendo pela URL pedida e rode o build com `NEXT_FONT_GOOGLE_MOCKED_RESPONSES=/caminho/mock.js ... npx next build --webpack` (o Turbopack não aceita o mock). Não muda nada em produção; a Vercel baixa a fonte normalmente.

| Script | O que faz |
|---|---|
| `interacoes.mjs [url]` | suíte de comportamento (porta 3300 por padrão) |
| `contraste.mjs [url]` | contraste real dos botões de vidro sobre o vídeo, em vários instantes (lê a cor real do texto: vale para texto claro e escuro) |
| `contraste-texto.mjs` | módulo usado pela suíte: contraste de todo texto fora da hero contra o fundo efetivo da seção |
| `autoteste-contraste.mjs [url]` | prova do auditor: injeta texto ruim (rgb e oklab) e um bom; precisa reprovar só os ruins |
| `prod.mjs <url> [largura]` | peso de carga inicial, LCP e estado sem WhatsApp configurado |
| `shot.mjs`, `secoes.mjs`, `rolagem.mjs` | capturas (hero, cada seção, posições de rolagem) |
| `loader.mjs`, `rali.mjs` | capturam o carregamento e congelam a jogada da quadra em instantes do ciclo (`.shots/jogada-NN.png`; para vídeo: `ffmpeg -framerate 25 -i q%04d.png …` sobre quadros a 25 qps) |
| `ferramentas/logo/*.mjs` | reconstroem a logo em SVG a partir do JPG e medem a fidelidade (ver [docs/FERRAMENTAS.md](docs/FERRAMENTAS.md)) |

## Pendências que dependem do cliente

- [ ] Número de WhatsApp comercial (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
- [ ] Materiais de melhor qualidade (vídeos horizontal e vertical, foto da equipe, logo vetorial): lista completa em [MIDIA.md](MIDIA.md).
- [ ] Confirmar **SPFC Futevôlei** e **Desafio ao Galo** (vieram dos materiais enviados) e **Selva Cup, AD's Cup e Rio Open** (sem registro encontrado, ficaram fora).
- [ ] Logos oficiais da DRG Consultoria e dos apoiadores; confirmar perfis para linkar.
- [ ] Cidades/regiões atendidas, canal de e-mail e textos institucionais confirmados.
- [ ] Autorização de uso das imagens e vídeos de eventos de terceiros.
