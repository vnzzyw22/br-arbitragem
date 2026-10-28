"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Bola } from "./Ornamentos";
import { economiaDeDados } from "@/lib/economia";
import { HERO_MIDIA } from "@/lib/midia";

const POSTERS = { paisagem: HERO_MIDIA.paisagem.poster, retrato: HERO_MIDIA.retrato.poster };
const TOTAL = 3; // fontes, pôster da hero, primeiro quadro do vídeo
const MINIMO_MS = 900; // tempo para a marca ser vista, não para segurar o visitante
const LIMITE_MS = 3500; // se algo não chegar, a página abre mesmo assim

// Carregamento de verdade: cada passo só conta quando o recurso realmente chegou.
// O progresso avança em três degraus reais, nunca por tempo. A bola corre pela linha de quadra.
export function Loader() {
  const [feitos, setFeitos] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const lembrar = () => {
      try {
        sessionStorage.setItem("br-loader", "1");
      } catch {}
    };
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.documentElement.dataset.loader === "visto" || reduz) {
      timers.push(setTimeout(() => setPronto(true), 0));
      lembrar();
      return () => timers.forEach(clearTimeout);
    }

    const inicio = Date.now();
    let contados = 0;
    let fim = false;
    const encerrar = () => {
      if (fim) return;
      fim = true;
      const espera = Math.max(0, MINIMO_MS - (Date.now() - inicio)) + 250;
      timers.push(
        setTimeout(() => {
          setPronto(true);
          lembrar();
        }, espera),
      );
    };
    const marca = () => {
      contados += 1;
      setFeitos(contados);
      if (contados >= TOTAL) encerrar();
    };

    document.fonts.ready.then(marca, marca);

    const paisagem = window.matchMedia("(min-aspect-ratio: 1/1)").matches;
    const poster = new Image();
    poster.src = paisagem ? POSTERS.paisagem : POSTERS.retrato;
    poster.decode().then(marca, marca);

    let tentativas = 0;
    const aguardarVideo = () => {
      const v = document.getElementById("hero-video") as HTMLVideoElement | null;
      if (!v) {
        if (tentativas++ < 40) timers.push(setTimeout(aguardarVideo, 50));
        else marca();
        return;
      }
      if (v.readyState >= 3) marca();
      else {
        v.addEventListener("canplay", marca, { once: true });
        v.addEventListener("error", marca, { once: true });
      }
    };
    // Em economia de dados a hero não carrega vídeo: esse degrau conta na hora.
    if (economiaDeDados()) marca();
    else aguardarVideo();

    timers.push(setTimeout(encerrar, LIMITE_MS));
    return () => timers.forEach(clearTimeout);
  }, []);

  const progresso = feitos / TOTAL;

  return (
    <div className="loader" data-pronto={pronto} role="status" aria-live="polite" aria-hidden={pronto}>
      <span className="sr-only">{pronto ? "Página carregada" : "Carregando a página"}</span>
      <div className="flex w-[min(78vw,260px)] flex-col items-center gap-9">
        <Logo size={96} eager />
        <div className="relative h-px w-full bg-white/20">
          <div className="absolute inset-y-0 left-0 w-full origin-left bg-ceu transition-transform duration-500 ease-out" style={{ transform: `scaleX(${progresso})` }} />
          <div className="absolute top-1/2 transition-[left] duration-500 ease-out" style={{ left: `${progresso * 100}%` }}>
            <Bola className="h-5 w-5 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out" />
          </div>
        </div>
      </div>
    </div>
  );
}
