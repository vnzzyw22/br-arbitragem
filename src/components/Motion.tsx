"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// A linha de quadra: o traço que abre cada seção. É o motivo de movimento da página.
export function Linha({ cor = "bg-ouro", className = "" }: { cor?: string; className?: string }) {
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

// Foto que entra por baixo, como uma cortina. Só nas imagens grandes.
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
