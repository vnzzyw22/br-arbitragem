"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HERO } from "@/content/site";
import { economiaDeDados } from "@/lib/economia";
import { HERO_MIDIA } from "@/lib/midia";
import { Orla } from "./Orla";

// Substituir o filme: trocar os arquivos em public/video/hero e aumentar VERSAO em src/lib/midia.ts (ver MIDIA.md).
// Os reels do cliente são verticais: no desktop entra um tríptico 1920×1080 (3 recortes lado
// a lado, sem ampliar nada); no retrato, o vertical 720×1280 preenche a tela como veio.
const PAISAGEM = "(min-aspect-ratio: 1/1)";
const FONTES = HERO_MIDIA;

const atraso = (s: number): CSSProperties => ({ "--d": `${s}s` }) as CSSProperties;

function HeroMidia({ pausado, reduzir }: { pausado: boolean; reduzir: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [orientacao, setOrientacao] = useState<"paisagem" | "retrato" | null>(null);
  const [tocando, setTocando] = useState(false);
  // Seguro na hidratação: só afeta o <video>, que não existe antes de `orientacao` ser definida.
  const [economia] = useState(economiaDeDados);

  useEffect(() => {
    const mq = window.matchMedia(PAISAGEM);
    const escolher = () => {
      setTocando(false);
      setOrientacao(mq.matches ? "paisagem" : "retrato");
    };
    escolher();
    mq.addEventListener("change", escolher);
    return () => mq.removeEventListener("change", escolher);
  }, []);

  // Só toca com a hero visível, a aba ativa e sem pausa do visitante.
  useEffect(() => {
    const v = ref.current;
    if (!v || !orientacao) return;
    v.muted = true;
    if (pausado) {
      v.pause();
      return;
    }
    const tocar = () => v.play().catch(() => setTocando(false));
    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? tocar() : v.pause()), { threshold: 0.05 });
    io.observe(v);
    const visibilidade = () => (document.hidden ? v.pause() : tocar());
    document.addEventListener("visibilitychange", visibilidade);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", visibilidade);
    };
  }, [orientacao, pausado]);

  return (
    <div aria-hidden="true" className="absolute inset-0 bg-oceano-profundo">
      <picture>
        <source media={PAISAGEM} srcSet={FONTES.paisagem.poster} />
        <img src={FONTES.retrato.poster} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {orientacao && !reduzir && !economia && (
        <video
          ref={ref}
          id="hero-video"
          key={orientacao}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${tocando ? "opacity-100" : "opacity-0"}`}
          src={FONTES[orientacao].video}
          poster={FONTES[orientacao].poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setTocando(true)}
        />
      )}
    </div>
  );
}

export function Hero() {
  const reduzir = useReducedMotion() ?? false;
  const [pausado, setPausado] = useState(false);
  const secao = useRef<HTMLElement>(null);

  // Ao rolar: o filme se afasta devagar (paralaxe + zoom) e o texto sai antes dele.
  const { scrollYProgress } = useScroll({ target: secao, offset: ["start start", "end start"] });
  const midiaY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const midiaEscala = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const textoY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textoOpacidade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={secao}
      id="topo"
      aria-labelledby="hero-titulo"
      className="relative isolate flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden bg-oceano-profundo text-white"
    >
      <motion.div className="absolute inset-0 -z-10" style={reduzir ? undefined : { y: midiaY, scale: midiaEscala }}>
        <HeroMidia pausado={pausado} reduzir={reduzir} />
      </motion.div>

      {/* Véu azul-profundo (o azul da marca), só onde o texto pede: base, lateral do título e topo
          do menu. Tinge o filme de fim de tarde na praia sem apagá-lo; nada de caixa atrás do texto. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-oceano-profundo/20" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(11,30,49,0.88) 0%, rgba(11,30,49,0.52) 34%, rgba(11,30,49,0) 66%), linear-gradient(to right, rgba(11,30,49,0.52) 0%, rgba(11,30,49,0) 58%), linear-gradient(to bottom, rgba(11,30,49,0.6) 0%, rgba(11,30,49,0) 18%)",
        }}
      />

      {!reduzir && (
        <button
          type="button"
          onClick={() => setPausado((p) => !p)}
          aria-label={pausado ? "Reproduzir vídeo" : "Pausar vídeo"}
          className="absolute right-5 top-[5.5rem] z-20 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-oceano-profundo/40 text-white backdrop-blur-md transition-colors hover:bg-oceano-profundo/70 sm:right-8 lg:right-12"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            {pausado ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M3.5 2h3.2v12H3.5zM9.3 2h3.2v12H9.3z" />}
          </svg>
        </button>
      )}

      <motion.div style={reduzir ? undefined : { y: textoY, opacity: textoOpacidade }}>
        <div className="wrap pb-10 pt-32 baixo:pb-6 lg:pb-16">
          <h1 id="hero-titulo" className="display display-hero text-[clamp(2.3rem,9.9vw,3.8rem)] baixo:text-[clamp(1.8rem,8.2vw,2.3rem)] md:text-[clamp(2.8rem,4.5vw,4.5rem)]">
            {HERO.titulo.map((linha, i) => (
              <span key={linha} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <span className="h-sobe block" style={atraso(0.15 + i * 0.1)}>
                  {linha}
                </span>
              </span>
            ))}
          </h1>

          <div aria-hidden="true" className="h-estende mt-7 h-[2px] baixo:mt-4 w-20 bg-ceu" style={atraso(0.55)} />

          <div className="h-surge mt-7 flex flex-col gap-8 baixo:mt-4 baixo:gap-4 lg:flex-row lg:items-center lg:gap-12" style={atraso(0.8)}>
            <p className="max-w-[34ch] text-lg leading-snug text-white/90 baixo:text-base lg:text-xl">{HERO.texto}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#contato" className="btn btn-glass-claro">
                Solicitar orçamento
              </a>
              {/* Em tela baixa só fica o CTA principal; a equipe vem logo abaixo, na rolagem. */}
              <a href="#equipe" className="btn btn-glass baixo:hidden">
                Conhecer a equipe
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* A linha d'água: a areia de Quem somos lava sobre o vídeo. Só no desktop (no celular em pé
          vem a faixa Em quadra, e a onda fica depois dela). Abaixo do texto: não cobre nada. */}
      <Orla de="transparente" para="areia" className="absolute inset-x-0 bottom-0 z-10 hidden !h-12 paisagem:block lg:!h-14" />
    </section>
  );
}
