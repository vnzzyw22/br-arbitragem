"use client";

import { useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { HERO } from "@/content/site";
import { VideoLoop } from "./VideoLoop";

const atraso = (s: number): CSSProperties => ({ "--d": `${s}s` }) as CSSProperties;

// Único momento orquestrado da página: título sobe por máscara, a linha de quadra
// se estende pela largura toda e o painel do vídeo abre de baixo para cima.
// A entrada é CSS puro (ver globals.css): roda antes do JS hidratar e não adia o LCP.
export function Hero() {
  const reduzir = useReducedMotion();
  const [pausado, setPausado] = useState(false);

  return (
    <section id="topo" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-preto text-white">
      <div className="h-abre absolute inset-0 -z-10 lg:left-auto lg:w-[40vw]" style={atraso(0)}>
        <VideoLoop src="/video/hero.mp4" poster="/video/hero-poster.webp" className="h-full w-full" posicao="38% 50%" pausado={pausado} />
        {/* escurece para o texto ler no mobile; no desktop só um ajuste de tom */}
        <div className="absolute inset-0 bg-gradient-to-t from-preto via-preto/60 to-preto/20 lg:bg-preto/15 lg:bg-none" />
      </div>

      {!reduzir && (
        <button
          type="button"
          onClick={() => setPausado((p) => !p)}
          aria-label={pausado ? "Reproduzir vídeo" : "Pausar vídeo"}
          className="absolute right-4 top-[5.25rem] z-20 grid h-11 w-11 place-items-center rounded-full bg-preto/70 text-white transition-colors hover:bg-preto lg:right-10"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            {pausado ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M3.5 2h3.2v12H3.5zM9.3 2h3.2v12H9.3z" />}
          </svg>
        </button>
      )}

      <div className="wrap pt-28">
        <h1 className="display text-[clamp(3.1rem,15.2vw,5.5rem)] lg:max-w-[56vw] lg:text-[clamp(3.5rem,min(8.6vw,15vh),9rem)]">
          {HERO.titulo.map((linha, i) => (
            <span key={linha} className="block overflow-hidden pb-[0.07em]">
              <span className="h-sobe block" style={atraso(0.15 + i * 0.08)}>
                {linha}
              </span>
            </span>
          ))}
        </h1>
      </div>

      <div aria-hidden="true" className="h-estende relative z-10 my-6 h-[3px] w-full bg-ouro lg:my-8" style={atraso(0.5)} />

      <div className="h-surge wrap pb-8 lg:pb-12" style={atraso(0.75)}>
        <div className="flex flex-col gap-7 lg:max-w-[56vw] xl:flex-row xl:items-end xl:justify-between xl:gap-12">
          <p className="max-w-[30ch] text-lg leading-snug text-white/90 lg:text-xl xl:max-w-[22ch]">{HERO.texto}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <a
              href="#contato"
              className="inline-flex min-h-14 items-center justify-center whitespace-nowrap bg-ouro px-8 text-lg font-bold text-preto transition-colors hover:bg-white active:scale-[0.98]"
            >
              Solicitar orçamento
            </a>
            <a
              href="#equipe"
              className="inline-flex min-h-11 items-center justify-center whitespace-nowrap text-lg font-medium underline decoration-2 underline-offset-8 transition-colors hover:text-ouro"
            >
              Conhecer a equipe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
