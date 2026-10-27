# BR Arbitragem Futevôlei — landing page

Next 16 + React 19 + Tailwind 4 + framer-motion. Página única e estática. Direção de arte em [DESIGN.md](DESIGN.md).

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

Tudo editável em `src/content/site.ts` (textos, eventos, FAQ, patrocinador e apoiadores). Eventos só entram com registro verificado.

## Scripts de verificação (`scripts/`, exigem Chrome + servidor rodando)

- `shot.mjs <url> <largura> <saida.png> [altura]`: screenshot, erros de console e rolagem horizontal.
- `secoes.mjs <largura> <prefixo>`: screenshot de cada seção.
- `interacoes.mjs`: 33 verificações (CTAs, vídeo, FAQ por teclado, formulário e URL do WhatsApp, barra mobile, pausa, reduced-motion). Rodar com o servidor iniciado com `NEXT_PUBLIC_WHATSAPP_NUMBER` de teste.
- `prod.mjs <url>`: estado sem WhatsApp configurado, peso de carga e LCP (rodar contra `npm start`).

## Pendências que dependem do cliente

- [ ] Número de WhatsApp comercial (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
- [ ] Logo em alta resolução ou vetor. Hoje é a foto de perfil do Instagram (150×150), usada pequena e sem alteração.
- [ ] Confirmar **Selva Cup, AD's Cup e Rio Open** (sem registro encontrado, ficaram fora) e enviar fotos da **Amsterdam Cup**.
- [ ] Logos oficiais da DRG Consultoria e dos apoiadores (Sandhit Sportwear, Evolud Distribuidora, Redução Saúde, Auttotag). Hoje só os nomes, sem links. Confirmar também os perfis para linkar.
- [ ] Cidades/regiões atendidas, canal de e-mail e textos institucionais confirmados (hoje as respostas do FAQ são neutras).
- [ ] Autorização de uso das fotos/vídeos dos eventos de terceiros (Queiróz Cup, Arena Sun7, Torneio do Bosque).
