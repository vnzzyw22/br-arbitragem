// Arquivos da hero. Ao trocar qualquer um deles (mesmo nome, ver MIDIA.md), aumente VERSAO:
// o endereço muda e celulares/CDN não continuam mostrando a cópia antiga em cache.
const VERSAO = "3";
const url = (arquivo: string, pasta = "hero") => `/video/${pasta}/${arquivo}?v=${VERSAO}`;

export const HERO_MIDIA = {
  paisagem: { video: url("desktop.mp4"), poster: url("desktop-poster.webp") },
  retrato: { video: url("mobile.mp4"), poster: url("mobile-poster.webp") },
};

// Faixa "Em quadra" (só celular): os dois clipes laterais do tríptico, inteiros.
export const QUADRA_MIDIA = {
  jogada: { video: url("jogada.mp4", "quadra"), poster: url("jogada-poster.webp", "quadra") },
  arena: { video: url("arena.mp4", "quadra"), poster: url("arena-poster.webp", "quadra") },
};
