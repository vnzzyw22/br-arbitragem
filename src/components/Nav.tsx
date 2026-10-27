"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#equipe", rotulo: "Equipe" },
  { href: "#campeonatos", rotulo: "Campeonatos" },
  { href: "#duvidas", rotulo: "Dúvidas" },
];

export function Nav() {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        rolou ? "border-b border-white/10 bg-preto" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Principal" className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <a href="#topo" aria-label="BR Arbitragem, voltar ao topo" className="shrink-0 rounded-full">
          <Logo size={52} eager />
        </a>
        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="py-3 text-[0.95rem] font-medium text-white/85 transition-colors hover:text-ouro">
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contato"
          className="hidden min-h-11 items-center bg-ouro lg:inline-flex px-5 text-[0.95rem] font-bold text-preto transition-colors hover:bg-white active:scale-[0.98]"
        >
          Solicitar orçamento
        </a>
      </nav>
    </header>
  );
}
