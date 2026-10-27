// Visitante pediu economia de dados (Android "Economia de dados", Chrome Lite) ou está em 2G:
// a hero fica só com o pôster e não baixa o vídeo.
type Conexao = { saveData?: boolean; effectiveType?: string };

export function economiaDeDados(): boolean {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: Conexao }).connection;
  return Boolean(c?.saveData) || c?.effectiveType === "slow-2g" || c?.effectiveType === "2g";
}
