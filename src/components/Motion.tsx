"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Bola } from "./Ornamentos";

const ease = [0.22, 1, 0.36, 1] as const;

// A linha de quadra: o traço que abre cada seção.
export function Linha({ cor = "bg-azul", className = "" }: { cor?: string; className?: string }) {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`h-[3px] w-full origin-left ${cor} ${className}`}
      initial={reduzir ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease }}
    />
  );
}

// Foto que entra por baixo, como uma cortina.
export function Revela({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduzir ? false : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease }}
    >
      {children}
    </motion.div>
  );
}

// Foto com paralaxe discreta: a imagem anda mais devagar que a página dentro da moldura.
export function FotoParallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div className="h-full w-full" style={reduzir ? undefined : { y, scale: 1.08 }}>
        {children}
      </motion.div>
    </div>
  );
}

// Título que sobe por uma máscara quando entra na tela (mesmo gesto da hero).
// Observa o contêiner, nunca o texto escondido pela máscara.
export function Titulo({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduzir = useReducedMotion();
  const visto = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const aberto = visto || reduzir;
  return (
    <h2 ref={ref} className={`${className} -mb-[0.12em] overflow-hidden pb-[0.12em]`}>
      <motion.span
        className="block"
        initial={{ y: reduzir ? 0 : "105%" }}
        animate={{ y: aberto ? 0 : "105%" }}
        transition={{ duration: 0.95, ease }}
      >
        {children}
      </motion.span>
    </h2>
  );
}

// Entrada de itens de lista: sobe e aparece com atraso escalonado.
export function Entrada({ children, atraso = 0, className = "" }: { children: ReactNode; atraso?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();
  const visto = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const aberto = visto || reduzir;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: reduzir ? 1 : 0, y: reduzir ? 0 : 22 }}
      animate={{ opacity: aberto ? 1 : 0, y: aberto ? 0 : 22 }}
      transition={{ duration: 0.8, ease, delay: atraso }}
    >
      {children}
    </motion.div>
  );
}

// A bola corre pela linha de quadra no topo da tela conforme a página rola: é o progresso de leitura.
export function ProgressoBola() {
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const esquerda = useTransform(p, (v) => `calc((100% - 22px) * ${v})`);
  const giro = useTransform(p, [0, 1], [0, 2160]);
  if (reduzir) return null;
  return (
    <div aria-hidden="true" data-progresso="" className="pointer-events-none fixed inset-x-0 top-[calc(4.75rem+1px)] z-[60] h-[3px]">
      <motion.div className="h-full origin-left bg-ceu" style={{ scaleX: p }} />
      <motion.div className="absolute top-[3px]" style={{ left: esquerda }}>
        <motion.div style={{ rotate: giro }}>
          <Bola className="h-[22px] w-[22px] drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" />
        </motion.div>
      </motion.div>
    </div>
  );
}
