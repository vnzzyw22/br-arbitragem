// Transição entre seções como a linha d'água na areia: a seção de baixo entra na de cima numa
// onda baixa e irregular, com um filete de espuma. Estática (não anima) e decorativa.
const CORES = {
  areia: "#f2e8dc",
  branco: "#ffffff",
  oceano: "#102b44",
  "oceano-profundo": "#0b1e31",
} as const;
type Cor = keyof typeof CORES;

const ONDA = "M0 34C150 18 300 44 470 32S820 12 1010 28S1300 46 1440 26";

export function Orla({ de, para, className = "" }: { de: Cor; para: Cor; className?: string }) {
  // espuma branca sobre a água; azul suave quando a seção de baixo é branca
  const espuma = para === "branco" ? "rgb(29 90 132 / 0.22)" : "rgb(255 255 255 / 0.4)";
  return (
    <div aria-hidden="true" className={`relative h-10 sm:h-12 lg:h-14 ${className}`} style={{ background: CORES[de] }}>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={`${ONDA}V56H0Z`} fill={CORES[para]} />
        <path d={ONDA} fill="none" stroke={espuma} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
