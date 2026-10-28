import { useId } from "react";

// Ornamentos ilustrados: o vocabulário da quadra de areia (apito, bola de futevôlei). A jogada
// animada, com os quatro atletas e o árbitro, fica em Futevolei.tsx.
type P = { className?: string };

/** Apito preto de árbitro com argola dourada, em vista lateral. */
export function Apito({ className = "" }: P) {
  const id = useId();
  const camara = `${id}-c`;
  const tubo = `${id}-t`;
  return (
    <svg viewBox="0 0 250 160" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id={camara} cx="34%" cy="26%" r="85%">
          <stop offset="0" stopColor="#4d4d4d" />
          <stop offset="0.45" stopColor="#181818" />
          <stop offset="1" stopColor="#070707" />
        </radialGradient>
        <linearGradient id={tubo} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d3d3d" />
          <stop offset="0.4" stopColor="#161616" />
          <stop offset="1" stopColor="#080808" />
        </linearGradient>
      </defs>
      {/* argola e olhal */}
      <circle cx="196" cy="34" r="22" fill="none" stroke="#a8802a" strokeWidth="8" />
      <circle cx="196" cy="34" r="22" fill="none" stroke="#efd078" strokeWidth="2.4" strokeDasharray="64 80" transform="rotate(-150 196 34)" />
      <path d="M182 46h28v16h-28z" fill="#0b0b0b" />
      {/* bocal */}
      <path d="M14 68h110v50H14q-10 0-10-10V78q0-10 10-10z" fill={`url(#${tubo})`} stroke="#2f2f2f" strokeWidth="2.2" />
      <path d="M4 80q0-8 8-8h8v42h-8q-8 0-8-8z" fill="#2a2a2a" />
      <path d="M10 84h8v18h-8z" fill="#020202" />
      {/* câmara */}
      <circle cx="166" cy="98" r="56" fill={`url(#${camara})`} stroke="#2f2f2f" strokeWidth="2.2" />
      <circle cx="166" cy="98" r="52.6" fill="none" stroke="#8a8a8a" strokeWidth="1.4" opacity="0.5" />
      {/* janela de som */}
      <path d="M76 68h42l-18 18H76z" fill="#050505" stroke="#6b6b6b" strokeWidth="1.4" strokeLinejoin="round" />
      {/* furo da bolinha */}
      <circle cx="166" cy="98" r="17" fill="#060606" stroke="#555" strokeWidth="3" />
      <path d="M132 70a44 44 0 0 1 36-16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

/** Miolo da bola de futevôlei (coordenadas 0–200), reutilizável dentro de outros SVGs. */
export function BolaCorpo({ id }: { id: string }) {
  const corte = `${id}-k`;
  const brilho = `${id}-b`;
  return (
    <>
      <defs>
        <clipPath id={corte}>
          <circle cx="100" cy="100" r="94" />
        </clipPath>
        <radialGradient id={brilho} cx="35%" cy="27%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.34" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="94" fill="#f6d11a" />
      <g clipPath={`url(#${corte})`} fill="#090909">
        <path d="M60 92q40-10 80 0l-34 80q-6 8-12 0z" />
        <path d="M-10 18 78-4q-8 42-20 80Q30 78-10 68z" />
        <path d="M210 18 122-4q8 42 20 80 28 2 68-8z" />
        <path d="M-10 128q32 10 50 24 16 30 36 62h-86z" />
        <path d="M210 128q-32 10-50 24-16 30-36 62h86z" />
      </g>
      <g fill="none" stroke="#8d6f00" strokeWidth="1.7" opacity="0.6" clipPath={`url(#${corte})`}>
        <path d="M54 80q46-16 92 0" />
        <path d="M58 94q-20 30-20 60" />
        <path d="M142 94q20 30 20 60" />
        <path d="M30 40q20 20 26 38" />
        <path d="M170 40q-20 20-26 38" />
        <path d="M60 190q20-30 34-16" />
        <path d="M140 190q-20-30-34-16" />
      </g>
      <circle cx="100" cy="100" r="94" fill={`url(#${brilho})`} />
      <circle cx="100" cy="100" r="94" fill="none" stroke="#090909" strokeWidth="3" />
    </>
  );
}

/** Bola de futevôlei amarela e preta. */
export function Bola({ className = "" }: P) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <BolaCorpo id={id} />
    </svg>
  );
}
