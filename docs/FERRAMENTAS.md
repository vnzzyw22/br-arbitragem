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

## Vetorização da logo (`scripts/ferramentas/tracar_logo.py`) — RASCUNHO

Tenta reconstruir a logo em SVG **a partir dos próprios pixels** (sem redesenhar): separa as camadas de cor (B azul `#5888c8`, R e "ARBITRAGEM" cinza `#787878`, bola em três cinzas claros), amplia 10×, contorna com `potrace` e ajusta o aro como círculo.

```bash
sudo apt-get install -y potrace      # ou: brew install potrace
pip install numpy pillow scipy
python3 scripts/ferramentas/tracar_logo.py src/assets/identidade/logo-br.jpg /tmp/logo
```

**Estado:** ainda não funciona até o fim. O aro não é detectado porque ele fica **na borda da imagem** (centro ≈ 74,5, raio ≈ 77 px, cinza ≈ 145 no ponto mais escuro), e o script procura um componente escuro grande. Corrigir assim: detectar o aro pela distância ao centro (pixels com luminância < 230 e distância entre 75,5 e 79 px do centro 74,5/74,5) ou desenhá-lo direto com esses valores. Depois, **medir a fidelidade** (renderizar o SVG a 150 px e comparar pixel a pixel com o original) antes de usar. A palavra "ARBITRAGEM" tem só ~5 px de altura no original: o contorno dela só é fiel no tamanho pequeno em que aparece; para ampliar, só com o vetor oficial do cliente.
