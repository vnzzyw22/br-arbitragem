"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { EM_QUADRA } from "@/content/site";
import { economiaDeDados } from "@/lib/economia";
import { Linha, Titulo } from "./Motion";

// Só no celular em pé: no desktop esses dois clipes já estão nas laterais do tríptico da hero.
// Cada vídeo aparece inteiro (sem recorte), só baixa quando entra na tela e só toca quando
// está pelo menos 60% visível. Com movimento reduzido ou economia de dados, só os pôsteres.
export function EmQuadra() {
  const reduzir = useReducedMotion() ?? false;
  const [economia] = useState(economiaDeDados);
  const [pausado, setPausado] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const [tocando, setTocando] = useState<boolean[]>(() => EM_QUADRA.videos.map(() => false));
  const trilho = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const animar = !reduzir && !economia;

  useEffect(() => {
    if (!animar) return;
    const els = videos.current.filter((v): v is HTMLVideoElement => Boolean(v));
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const v = e.target as HTMLVideoElement;
          if (e.intersectionRatio >= 0.6 && !pausado && !document.hidden) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: [0, 0.6] },
    );
    els.forEach((v) => {
      v.muted = true;
      if (pausado) v.pause();
      io.observe(v);
    });
    return () => io.disconnect();
  }, [animar, pausado]);

  // Marca no indicador qual vídeo está na frente enquanto o visitante arrasta.
  useEffect(() => {
    const t = trilho.current;
    if (!t) return;
    const aoRolar = () => {
      const cards = Array.from(t.children) as HTMLElement[];
      const centro = t.scrollLeft + t.clientWidth / 2;
      let melhor = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro) < Math.abs(cards[melhor].offsetLeft + cards[melhor].offsetWidth / 2 - centro)) melhor = i;
      });
      setAtivo(melhor);
    };
    t.addEventListener("scroll", aoRolar, { passive: true });
    return () => t.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <section id="quadra" aria-labelledby="quadra-titulo" className="bg-oceano py-20 paisagem:hidden">
      <div className="wrap">
        <Linha />
        <div className="mt-12 flex items-end justify-between gap-6">
          <div>
            <Titulo className="display text-[clamp(1.85rem,7.4vw,2.7rem)]">
              <span id="quadra-titulo">{EM_QUADRA.titulo}</span>
            </Titulo>
            <p className="mt-3 text-white/75">{EM_QUADRA.texto}</p>
          </div>
          {animar && (
            <button
              type="button"
              onClick={() => setPausado((p) => !p)}
              aria-label={pausado ? "Reproduzir vídeos" : "Pausar vídeos"}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
                {pausado ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M3.5 2h3.2v12H3.5zM9.3 2h3.2v12H9.3z" />}
              </svg>
            </button>
          )}
        </div>
      </div>

      <div
        ref={trilho}
        className="sem-barra mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 scroll-px-5 sm:px-8 sm:scroll-px-8"
      >
        {EM_QUADRA.videos.map((item, i) => (
          <figure
            key={item.video}
            role="img"
            aria-label={item.alt}
            className="relative aspect-[5/9] w-[min(78%,calc(68svh*5/9))] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[4px] bg-oceano-profundo"
          >
            {/* Pôster local, já no tamanho certo; <img> com lazy para não baixar no desktop (seção oculta). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            {animar && (
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${tocando[i] ? "opacity-100" : "opacity-0"}`}
                src={item.video}
                muted
                loop
                playsInline
                preload="none"
                disablePictureInPicture
                aria-hidden="true"
                onPlaying={() => setTocando((t) => t.map((v, j) => (j === i ? true : v)))}
              />
            )}
          </figure>
        ))}
      </div>

      {/* Indicador em linha de quadra: o traço do vídeo da frente acende em azul-céu. */}
      <div aria-hidden="true" className="wrap mt-5 flex gap-2">
        {EM_QUADRA.videos.map((item, i) => (
          <span key={item.video} className={`h-[3px] w-8 transition-colors duration-300 ${ativo === i ? "bg-ceu" : "bg-white/20"}`} />
        ))}
      </div>
    </section>
  );
}
