"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster: string;
  className?: string;
  preload?: "auto" | "none" | "metadata";
  posicao?: string;
  pausado?: boolean;
};

// Vídeo mudo em loop que só roda enquanto está na tela.
// Com prefers-reduced-motion mostra apenas o pôster.
export function VideoLoop({ src, poster, className = "", preload = "auto", posicao = "50% 50%", pausado = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduzir = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduzir) return;
    v.muted = true;
    if (pausado) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduzir, pausado]);

  if (reduzir) {
    return (
      <Image src={poster} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className={`object-cover ${className}`} style={{ objectPosition: posicao }} />
    );
  }

  return (
    <video
      ref={ref}
      className={`object-cover ${className}`}
      style={{ objectPosition: posicao }}
      poster={poster}
      autoPlay={preload === "auto"}
      muted
      loop
      playsInline
      preload={preload}
      aria-hidden="true"
      disablePictureInPicture
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
