"use client";

import { useEffect, useState } from "react";

// Barra de ação na zona do polegar (só mobile). Aparece depois da hero e some
// quando o formulário já está na tela, para nunca cobrir o que importa.
export function CtaMobile() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("topo");
    const contato = document.getElementById("contato");
    if (!hero || !contato) return;
    const estado = { hero: true, contato: false };
    const atualizar = () => setVisivel(!estado.hero && !estado.contato);
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === hero) estado.hero = e.isIntersecting;
        if (e.target === contato) estado.contato = e.isIntersecting;
      }
      atualizar();
    });
    io.observe(hero);
    io.observe(contato);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visivel}
      inert={!visivel}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-oceano-profundo/80 px-5 pt-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visivel ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <a href="#contato" className="btn btn-claro w-full">
        Solicitar orçamento
      </a>
    </div>
  );
}
