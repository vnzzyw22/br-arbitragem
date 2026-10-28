// Elementos de praia (pedido do Vinicius, 28/10): o mar chegando na areia e coqueiros.
// Decorativos (aria-hidden); a espuma vai e volta devagar e fica parada com movimento reduzido.

const AREIA = "#f2e8dc";
const AREIA_UMIDA = "#e8d8c3";
const AGUA = "#e3efee";
const AGUA_FUNDA = "#b9d6da";

/**
 * Beira-mar na base de uma seção. `para="agua"`: a areia de cima encontra o mar (que continua na
 * seção seguinte). `para="areia"`: a água de cima chega na areia da seção seguinte.
 */
export function BeiraMar({ para }: { para: "agua" | "areia" }) {
  const agua = para === "agua";
  return (
    <div aria-hidden="true" data-beira-mar={para} className="pointer-events-none absolute inset-x-0 bottom-0 h-20 overflow-hidden sm:h-24 lg:h-28">
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {agua ? (
          <>
            {/* areia molhada logo antes da água */}
            <path d="M0 40C180 30 360 46 560 38S940 26 1140 36 1360 46 1440 38V96H0Z" fill={AREIA_UMIDA} opacity="0.55" />
            <path d="M0 52C200 42 380 60 590 50S960 38 1160 48 1370 58 1440 50V96H0Z" fill={AGUA_FUNDA} />
            <path d="M0 62C210 54 400 70 610 62S980 50 1180 60 1380 70 1440 62V96H0Z" fill={AGUA} />
          </>
        ) : (
          <>
            <path d="M0 44C190 56 380 38 590 48S960 60 1160 50 1370 40 1440 48V96H0Z" fill={AREIA_UMIDA} />
            <path d="M0 58C200 68 390 52 600 62S970 72 1170 62 1380 54 1440 60V96H0Z" fill={AREIA} />
          </>
        )}
      </svg>
      {/* espuma: duas linhas que vão e voltam como a maré na areia */}
      <svg viewBox="0 0 1600 96" preserveAspectRatio="none" className="mar-espuma absolute inset-y-0 -left-[5%] h-full w-[110%]">
        <path
          d={agua ? "M0 52C220 42 400 60 620 50S1000 38 1220 48 1460 58 1600 50" : "M0 58C220 68 410 52 630 62S1010 72 1230 62 1470 54 1600 60"}
          fill="none"
          stroke="#fff"
          strokeWidth="3.5"
          strokeOpacity="0.95"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg viewBox="0 0 1600 96" preserveAspectRatio="none" className="mar-espuma mar-espuma-2 absolute inset-y-0 -left-[5%] h-full w-[110%]">
        <path
          d={agua ? "M0 64C240 56 420 72 650 62S1020 52 1250 62 1480 70 1600 62" : "M0 46C240 56 430 40 660 50S1030 60 1260 50 1490 42 1600 48"}
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeOpacity="0.75"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/** Coqueiro em silhueta simples: tronco curvo e folhas em azul-esverdeado (o `mar` da paleta).
 *  Fica sempre na areia (base em y = 170, com sombra), nunca sobre a água. */
export function Coqueiro({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 176" aria-hidden="true" data-coqueiro="" className={className}>
      {/* sombra na areia, para o coqueiro ficar plantado */}
      <ellipse cx="58" cy="171" rx="20" ry="3.2" fill="#5f4b37" opacity="0.18" />
      {/* tronco */}
      <path d="M52 170C55 130 60 92 68 50l7 1C69 92 64 132 63 170Z" fill="#7a6248" />
      <path d="M56 150h7M57 132h7M59 114h7M61 96h7M63 78h7M65 62h6" stroke="#5f4b37" strokeWidth="1.4" strokeLinecap="round" />
      {/* folhas */}
      <g fill="#256069">
        <path d="M72 48C56 30 32 28 6 44c22-6 42-2 60 10Z" />
        <path d="M71 47C58 22 40 10 18 8c20 10 36 24 46 44Z" />
        <path d="M72 46C74 24 70 10 60 0c12 16 14 32 10 48Z" opacity="0.92" />
        <path d="M73 47C86 24 102 14 118 14c-18 6-32 20-40 38Z" />
        <path d="M74 49C92 40 108 44 120 62c-14-10-30-12-44-6Z" />
        <path d="M72 50C60 54 48 68 44 88c8-18 18-28 30-32Z" opacity="0.85" />
      </g>
      {/* cocos */}
      <circle cx="68" cy="53" r="3.6" fill="#5f4b37" />
      <circle cx="75" cy="54" r="3.4" fill="#6f583f" />
    </svg>
  );
}
