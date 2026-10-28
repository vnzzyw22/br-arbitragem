# Ferramentas e habilidades (skills) do projeto

## AI Website Cloner (`/clone-website`)

**O que é:** a habilidade do template [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) (licença MIT, cópia de `.agents/skills/clone-website` no commit `ee3f5a2`, 05/10/2026). Ela ensina um método em 4 passos para estudar um site: **mapear → observar → construir → comparar**.

**Onde está:** `.claude/skills/clone-website/` (SKILL.md, `references/inspection-guide.md`, `references/framer-and-motion.md` e LICENSE). Como está nessa pasta, o Claude Code a reconhece sozinho neste repositório.

**Como usar:**

1. Abra o Claude Code na pasta do repositório (terminal, desktop ou web).
2. Digite `/clone-website https://br-arbitragem-one.vercel.app/` (ou outra URL), **sempre** com uma frase dizendo o objetivo, por exemplo:
   > /clone-website https://br-arbitragem-one.vercel.app/ — use só para inspecionar a referência (cores, superfícies, cards, logo) e comparar com o nosso site. Não clone por cima do projeto.
3. Se o comando não aparecer, peça: "leia `.claude/skills/clone-website/SKILL.md` e siga o método para inspecionar <URL>".

**Regras deste projeto (pedido do Vinicius, 28/10) — valem sempre:**
- Usar **só para análise e comparação**. Não fazer clone integral, não copiar estrutura, dependências, configurações, textos, imagens nem código da referência para o BR Arbitragem.
- Não sobrescrever `CLAUDE.md`, configurações MCP nem outras skills.
- Não expor tokens, credenciais ou `.env`.

**Template completo (opcional, fora do repositório):** só se precisar das ferramentas do template inteiro:

```bash
git clone https://github.com/JCodesMore/ai-website-cloner-template ~/ferramentas/ai-website-cloner-template
cd ~/ferramentas/ai-website-cloner-template && git remote remove origin && npm install
```
(Pede Node 24; com Node 22 funciona com aviso.)

**O que já foi descoberto com ele (28/10):** ver `DESIGN.md` (estudo da referência) e `HANDOFF.md` (seção "Trabalho em andamento"). Resumo da logo: a referência **não usa a logo original**: escreve "B" e "R" na fonte Anton (condensada, sem serifa), põe um ícone genérico de bola depois do R e "ARBITRAGEM" em Manrope; o favicon é "BR" em Impact. **Não é mais fiel que o nosso arquivo**, então não serve de fonte para a logo.

## Outras skills

- Usadas na nuvem: `frontend-design` e `codemakers-design`.
- **Não existem no ambiente da nuvem:** Impeccable, ui-ux-pro-max, ui-styling, design-system, brand-guidelines e taste. Se estiverem instaladas no seu computador, rode-as daí. Não diga que usou uma skill que não rodou.
- **No computador do Vinicius (28/10):** as skills `impeccable`, `taste`, `frontend-design`, `ui-ux-pro-max`, `web-design-guidelines` e `quality-gate-visual` aparecem disponíveis no Claude Code. Os MCPs de navegador (`chrome-devtools`, `playwright`) estavam configurados mas não conectaram nessa sessão; as capturas foram feitas com os scripts Playwright do repositório e o Chrome local. Python não está instalado (por isso a vetorização em Node).

## Vetorização da logo (`scripts/ferramentas/logo/`) — usada em 28/10

Reconstrói a logo em SVG **a partir dos próprios pixels** (sem redesenhar), só com Node e o Chrome (o rascunho em Python que existia antes não chegava ao fim e foi removido; está no histórico do git). Gera `src/assets/identidade/logo-br.svg` **byte a byte idêntico** ao publicado (conferido em 28/10).

```bash
mkdir ~/logo-trabalho && cd ~/logo-trabalho          # pasta FORA do repositório
cp <repo>/src/assets/identidade/logo-br.jpg <repo>/scripts/ferramentas/logo/cores.json .
npm init -y && npm i potrace@2.1.8                    # potrace só aqui, não vira dependência do projeto
node <repo>/scripts/ferramentas/logo/camadas.mjs      # Chrome: amplia 8× e classifica cada pixel (classes.png para conferir)
node <repo>/scripts/ferramentas/logo/tracar.mjs       # máscaras por camada -> potrace; imprime a cor média de cada camada
node <repo>/scripts/ferramentas/logo/compor.mjs       # monta logo-br.svg e mede a fidelidade (par.png = original | SVG)
```

- **Camadas:** B azul (`b − r > 50`), R e ARBITRAGEM em cinza (luminância < 188; o texto tem limiar próprio, `LT=200`, escolhido pelo menor erro contra o original, porque os traços de ~1 px não chegam a 50% de cobertura), bola fantasma (cinzas claros, longe das letras para não pegar o halo do antialias e suavizada contra o ruído do JPEG).
- **Aro:** ajustado como círculo contra os pixels: centro (74,6; 74,5), raio 77,5, traço 1,5. Fica fora do corte circular (r = 75) que o site sempre usou, por isso não entra no SVG.
- **Fidelidade** (`compor.mjs`): erro médio 2,4/255 a 150 px (0,25% dos pixels com diferença > 40). Refazer a medição sempre que mexer nos limiares.
- Sem Chrome instalado: `CHROME_PATH=/caminho/do/chrome`.
