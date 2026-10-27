// Arquivos da hero. Ao trocar qualquer um deles (mesmo nome, ver MIDIA.md), aumente VERSAO:
// o endereço muda e celulares/CDN não continuam mostrando a cópia antiga em cache.
const VERSAO = "2";
const url = (arquivo: string) => `/video/hero/${arquivo}?v=${VERSAO}`;

export const HERO_MIDIA = {
  paisagem: { video: url("desktop.mp4"), poster: url("desktop-poster.webp") },
  retrato: { video: url("mobile.mp4"), poster: url("mobile-poster.webp") },
};
