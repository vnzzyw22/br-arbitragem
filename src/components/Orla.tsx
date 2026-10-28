// A linha d'água na areia: a seção de baixo entra na de cima numa onda baixa e irregular, com um
// filete de espuma. Só existe uma vez na página (a areia lavando sobre o vídeo da hero, ou entre a
// faixa Em quadra e Quem somos no celular em pé); o resto da página muda de cor por gradiente
// (ver .fundo-* em globals.css). Estática (não anima) e decorativa.
const CORES = {
  areia: "#f2e8dc",
  oceano: "#102b44",
} as const;

const ONDA = "M0 34C150 18 300 44 470 32S820 12 1010 28S1300 46 1440 26";

/** `de` transparente: a onda fica sobre o que estiver atrás (o vídeo da hero). */
export function Orla({ de, para, className = "" }: { de: keyof typeof CORES | "transparente"; para: keyof typeof CORES; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-10 sm:h-12 lg:h-14 ${className}`}
      style={{ background: de === "transparente" ? "transparent" : CORES[de] }}
    >
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={`${ONDA}V56H0Z`} fill={CORES[para]} />
        <path d={ONDA} fill="none" stroke="rgb(255 255 255 / 0.55)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
