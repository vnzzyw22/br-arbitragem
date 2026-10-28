"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "./Logo";

const links = [
  { id: "equipe", rotulo: "Equipe" },
  { id: "qualidade", rotulo: "Compromissos" },
  { id: "campeonatos", rotulo: "Campeonatos" },
  { id: "duvidas", rotulo: "Dúvidas" },
];

// Menu em pílula de vidro (desktop). O marcador desliza até a seção que está no meio da tela,
// para o visitante saber onde está. No celular o menu fica só com a logo: a barra inferior
// leva ao orçamento.
export function Nav() {
  const reduzir = useReducedMotion();
  const [rolou, setRolou] = useState(false);
  const [ativo, setAtivo] = useState<string | null>(null);

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const secoes = links.map((l) => document.getElementById(l.id)).filter((s): s is HTMLElement => Boolean(s));
    const visiveis = new Set<string>();
    // Faixa no meio da tela: a seção que a atravessa é a atual.
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) visiveis.add(e.target.id);
          else visiveis.delete(e.target.id);
        }
        setAtivo(links.find((l) => visiveis.has(l.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secoes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        rolou ? "border-b border-white/10 bg-oceano-profundo/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Principal" className="wrap flex h-[4.75rem] items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <a href="#topo" aria-label="BR Arbitragem, voltar ao topo" className="shrink-0 justify-self-start rounded-full">
          <Logo size={64} eager className="h-[3.25rem] w-[3.25rem] shadow-[0_6px_20px_rgb(5_16_28/0.35)] lg:h-16 lg:w-16" />
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/[0.08] p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_30px_rgb(5_16_28/0.25)] backdrop-blur-xl lg:flex">
          {links.map((l) => {
            const atual = ativo === l.id;
            return (
              <li key={l.id} className="relative">
                {atual && (
                  <motion.span
                    layoutId="menu-ativo"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-white/[0.16] shadow-[inset_0_1px_0_rgb(255_255_255/0.32)]"
                    transition={reduzir ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <a
                  href={`#${l.id}`}
                  aria-current={atual ? "location" : undefined}
                  className={`relative flex min-h-10 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors ${
                    atual ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  {l.rotulo}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#contato"
          className={`btn ${rolou ? "btn-claro" : "btn-glass-claro"} hidden !min-h-11 justify-self-end !px-5 !py-2 !text-[0.95rem] lg:inline-flex`}
        >
          Solicitar orçamento
        </a>
      </nav>
    </header>
  );
}
