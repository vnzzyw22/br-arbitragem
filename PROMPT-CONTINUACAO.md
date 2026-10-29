# Prompt para continuar o projeto

Cole isto numa nova sessão do Claude (celular, web ou terminal) aberta neste repositório:

```
Continue o projeto da landing page da BR Arbitragem Futevôlei. Leia primeiro HANDOFF.md
(estado, decisões do cliente que NÃO podem ser revertidas, pendências), depois DESIGN.md,
MIDIA.md e README.md. Em seguida siga o PROMPT-CONTINUACAO.md a partir da "Etapa 1".
Antes de dar qualquer etapa por pronta: tsc, lint, testes e prova visual (screenshot)
em desktop e mobile. Ao fim de cada etapa: commit em branch local; push (na main ou em
branch de prévia) SÓ com autorização do Vinicius.
```

**O refinamento de 28/10 (logo, fundo praia, título da hero, jogada com 4 jogadores e árbitro) foi publicado na `main` em 29/10** (ver HANDOFF.md); a branch `refinamento-visual-2026-10-28` fica igual à `main`. Para revisar ou ajustar, use este:

```
Continue o projeto da BR Arbitragem Futevôlei na branch refinamento-visual-2026-10-28.
Leia HANDOFF.md (seção "Refinamento visual e animação") e DESIGN.md. Antes de dar por
pronto: tsc, lint, suíte de testes e screenshots em desktop e celular. Commit na branch;
push (prévia ou main) SÓ com autorização do Vinicius.
```

---

## Contexto em 5 linhas

Site de uma equipe de arbitragem de futevôlei, feito para um concurso entre desenvolvedores. Objetivo nº 1: o organizador de campeonato pedir orçamento (formulário → WhatsApp). Stack: Next 16, React 19, Tailwind 4, framer-motion. Está no ar em https://br-arbitragem.vercel.app (push na `main` publica sozinho). O cliente quer algo cinematográfico, autêntico, sem cara de IA e **sem imagem de baixa qualidade**.

## Regras de trabalho (valem para toda etapa)

1. **Processo:** direção → implementação → inspeção → crítica → auditoria → correção → validação. "Pronto" nunca é só "compila": é renderizado, visto no navegador em desktop **e** mobile, sem erro de console, e comparado com o [DESIGN.md](DESIGN.md).
2. **Tipografia e cor (regras de 28/10):** exatamente duas famílias (Mona Sans nos títulos, Schibsted Grotesk no resto), **nenhum itálico**, nenhuma fonte extra; paleta areia clara, branco e azul (ver [DESIGN.md](DESIGN.md)). A suíte confere.
3. **Anti-genérico:** sem serifa de IA (Cormorant/Playfair/Fraunces/Instrument Serif…), sem fonte pesada/condensada nos títulos, sem eyebrow em caixa alta, sem numeração falsa, sem três cards iguais, sem `→` em todo CTA, sem fade-slide-up genérico em tudo, sem glassmorphism fora da hero.
4. **Conteúdo:** nunca inventar estatística, certificação, depoimento, data, cidade ou relação comercial. O que faltar vira pendência explícita, não texto fictício.
5. **Mídia:** auditar cada arquivo individualmente (resolução nativa, nitidez, compressão, exposição, composição, tamanho de exibição). **Se não tem qualidade, não publica.** Registrar em [MIDIA.md](MIDIA.md) o que foi mantido, o que foi rejeitado e por quê.
6. **Movimento:** com função e coerente com o tema (quadra, bola, apito, linha). Sempre respeitar `prefers-reduced-motion`.
7. **Next 16 ≠ o que você conhece:** ler `node_modules/next/dist/docs/` antes de usar API nova (já pegou: `priority` → `preload`).
8. **Verificação:** os testes rodam contra uma build de produção separada (ver [README.md](README.md)). Número de WhatsApp usado em teste é **fictício**; nunca commitar número real nem credenciais.
9. **Não declarar nada testado sem ter rodado.** Se uma ferramenta não existe no ambiente (ex.: Chrome na nuvem), dizer isso; para instalar o navegador: `npx playwright-core install chromium` e trocar `channel: "chrome"` nos scripts.
10. **Publicação:** push na `main` publica o site e push em outro branch gera prévia na Vercel; os dois só com autorização.
11. Ao fechar, perguntar ao usuário: **"o que ficou clichê aqui que eu não vi?"**

## Etapa 1 — Conferir o que está no ar

- Abrir https://br-arbitragem.vercel.app, conferir a hero (tríptico no desktop, vertical no mobile), o carregamento, as seções e o formulário (deve aparecer desativado com aviso enquanto não houver número).
- Rodar `npm install`, `npx tsc --noEmit`, `npm run lint` e a suíte de testes. Corrigir qualquer regressão antes de seguir.

## Etapa 2 — Se o usuário mandou o número de WhatsApp

Cadastrar `NEXT_PUBLIC_WHATSAPP_NUMBER` (só dígitos, DDI+DDD, ex.: `5541999999999`) na Vercel (Project Settings → Environment Variables, ambientes Production e Preview) e fazer redeploy (a variável é lida no build). Testar o fluxo inteiro: validação, URL `wa.me` com a mensagem correta, aviso pós-clique ("toque em enviar na conversa", nunca "enviado").

## Etapa 3 — Se o usuário mandou novos materiais (vídeos, fotos, logo)

Seguir [MIDIA.md](MIDIA.md): auditar um a um, recusar o que for ruim, gerar `desktop.mp4`/`mobile.mp4` e os pôsteres com os comandos `ffmpeg` do arquivo, trocar fotos mantendo os nomes, atualizar a tabela de mantidos/rejeitados/pendências. Se vier um vídeo **horizontal** bom, ele substitui o tríptico (não precisa mexer no código). Se vier logo vetorial, usar `<Logo>` com SVG. Refazer a medição de contraste dos botões de vidro (`scripts/contraste.mjs`) e do peso (`scripts/prod.mjs`).

## Etapa 4 — Polimento que ficou aberto (sem material novo)

Em ordem de valor:
1. **Rodar uma crítica de design formal** da versão nova (hero em tríptico, carregamento, movimento, cartaz de campeonatos): skills `impeccable` (critique) e `web-design-guidelines` (auditoria), se disponíveis; senão, revisar manualmente contra o [DESIGN.md](DESIGN.md). A 1ª crítica foi feita sobre a versão anterior.
2. **Ver no celular de verdade** (ou emulação com toque): barra de CTA inferior e formulário com teclado aberto. *(Feito em 27/10: título em 360×640 não cobre mais o rosto — variante `baixo:`.)*
3. **Medir desempenho real** da URL pública (PageSpeed/Lighthouse): a medição local de LCP variou muito e não é confiável. Se o peso do hero desktop (2,3 MB) incomodar, reduzir a taxa do vídeo. *(Feito em 27/10: em economia de dados/2G só o pôster.)*
4. **Bola de futevôlei:** o vetor próprio tem imperfeições em tamanho grande; manter pequena. Se o cliente mandar um arquivo vetorial oficial, trocar o miolo em `BolaCorpo` (`src/components/Ornamentos.tsx`).
5. **Acessibilidade:** testar com leitor de tela e só teclado (o formulário e o FAQ já foram testados por teclado em automação).
6. **Mais movimento** com função, se o cliente pedir (ele já pediu mais movimento no geral): candidatos — cursor/hover com a bola, transição entre seções, microinterações no formulário. Nunca animar o formulário de modo que esconda campos.

## Etapa 5 — Conteúdo a confirmar com o cliente

Perguntar e, com a resposta, atualizar `src/content/site.ts`: **SPFC Futevôlei** e **Desafio ao Galo** (estão na lista, vieram dos materiais); **Selva Cup, AD's Cup, Rio Open** (sem registro, fora da lista; incluir = uma linha); logos e perfis de DRG Consultoria, Sandhit, Evolud, Redução Saúde, Auttotag; cidades atendidas; e-mail; textos institucionais.

## Ao terminar qualquer etapa

`npx tsc --noEmit` · `npm run lint` · suíte de testes · screenshot desktop e mobile · atualizar [HANDOFF.md](HANDOFF.md) (estado e pendências) · `git add -A` · commit descritivo · **pedir autorização** antes de `git push`. Informar ao usuário, em português e em poucas linhas: o que mudou, o que foi testado de verdade e o que ficou pendente.
