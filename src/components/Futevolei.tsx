"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BolaCorpo } from "./Ornamentos";

// Quadra de areia vista de cima com uma jogada completa em loop (CSS puro, ver "Jogada" em
// globals.css): B2 saca, A1 recebe e levanta, A2 ataca por cima da rede, a bola cai entre B1 e B2
// e o árbitro, na cadeira junto ao poste, estende o braço para o lado que pontuou e apita (ondas
// saem dele no mesmo instante). Mesmo traço simples da quadra anterior: é um detalhe da seção, não
// o foco. Fora da tela a jogada para; com movimento reduzido fica no quadro do apito.

// Jogador visto de cima: ombros e cabeça, de frente para a rede.
function Jogador({ cor, lado }: { cor: string; lado: 1 | -1 }) {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="5.2" ry="10" fill={cor} />
      <circle cx={1.6 * lado} cy="0" r="4.3" fill="#0a0a0a" stroke={cor} strokeWidth="1.5" />
    </g>
  );
}

export function JogadaFutevolei({ className = "" }: { className?: string }) {
  const id = useId();
  const ref = useRef<SVGSVGElement>(null);
  const [fora, setFora] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFora(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 360 196"
      fill="none"
      aria-hidden="true"
      className={`fv block w-full ${fora ? "fv-parado" : ""} ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* areia (a cor medida no vídeo) e fita branca de demarcação */}
      <rect x="0" y="0" width="360" height="196" rx="4" fill="#e1cfb9" />
      <rect x="10" y="10" width="340" height="156" fill="none" stroke="#fff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      {/* rede e postes */}
      <path d="M180 4v168" stroke="#13263a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      <circle cx="180" cy="5" r="3.2" fill="#13263a" />
      <circle cx="180" cy="171" r="3.2" fill="#13263a" />

      {/* anel onde a bola toca a areia */}
      <circle className="fv-anel" cx="264" cy="138" r="11" stroke="#2c5c99" strokeWidth="2" />

      {/* árbitro na cadeira, junto ao poste: camisa preta com mangas amarelas */}
      <rect x="168" y="177" width="24" height="16" rx="3" fill="#c9d3da" stroke="#7a8896" strokeWidth="1.2" />
      <g transform="translate(173 185)">
        <path className="fv-arb-braco" d="M0 0-15-7" stroke="#9b6644" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <ellipse cx="180" cy="185" rx="8.6" ry="4.8" fill="#141414" />
      <circle cx="172.6" cy="185" r="2.4" fill="#f6d11a" />
      <circle cx="187.4" cy="185" r="2.4" fill="#f6d11a" />
      <circle cx="180" cy="184" r="3.8" fill="#0a0a0a" stroke="#f6d11a" strokeWidth="1.2" />
      {/* o apito: duas ondas saem do árbitro no instante da decisão */}
      <circle className="fv-onda-1" cx="180" cy="184" r="13" stroke="#2c5c99" strokeWidth="2.2" />
      <circle className="fv-onda-2" cx="180" cy="184" r="13" stroke="#2c5c99" strokeWidth="2.2" />

      {/* dupla A (azul) e dupla B (tinta) */}
      <g className="fv-a1">
        <Jogador cor="#2c5c99" lado={1} />
      </g>
      <g className="fv-a2">
        <Jogador cor="#2c5c99" lado={1} />
      </g>
      <g className="fv-b1">
        <Jogador cor="#13263a" lado={-1} />
      </g>
      <g className="fv-b2">
        <Jogador cor="#13263a" lado={-1} />
      </g>

      {/* bola: percurso no chão > altura > giro; a sombra fica no chão */}
      <g className="fv-bola">
        <g className="fv-bola-chao">
          <g className="fv-bola-sombra">
            <ellipse cx="6" cy="9" rx="9" ry="4.2" fill="#5a4630" />
          </g>
          <g className="fv-bola-altura">
            <g className="fv-bola-giro">
              <g transform="translate(-9 -9) scale(0.09)">
                <BolaCorpo id={id} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
