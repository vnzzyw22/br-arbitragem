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
node scripts/interacoes.mjs          # 59 verificações: carregamento, hero, vídeo, formulário, rali, mobile, movimento reduzido
```

| Script | O que faz |
|---|---|
| `interacoes.mjs [url]` | suíte de comportamento (porta 3300 por padrão) |
| `contraste.mjs [url]` | contraste real dos botões de vidro sobre o vídeo, em vários instantes |
| `prod.mjs <url> [largura]` | peso de carga inicial, LCP e estado sem WhatsApp configurado |
| `shot.mjs`, `secoes.mjs`, `rolagem.mjs` | capturas (hero, cada seção, posições de rolagem) |
| `loader.mjs`, `rali.mjs` | capturam o carregamento e congelam o rali da quadra em instantes do ciclo |

## Pendências que dependem do cliente

- [ ] Número de WhatsApp comercial (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
- [ ] Materiais de melhor qualidade (vídeos horizontal e vertical, foto da equipe, logo vetorial): lista completa em [MIDIA.md](MIDIA.md).
- [ ] Confirmar **SPFC Futevôlei** e **Desafio ao Galo** (vieram dos materiais enviados) e **Selva Cup, AD's Cup e Rio Open** (sem registro encontrado, ficaram fora).
- [ ] Logos oficiais da DRG Consultoria e dos apoiadores; confirmar perfis para linkar.
- [ ] Cidades/regiões atendidas, canal de e-mail e textos institucionais confirmados.
- [ ] Autorização de uso das imagens e vídeos de eventos de terceiros.
