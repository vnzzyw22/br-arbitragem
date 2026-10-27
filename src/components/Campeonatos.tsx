"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EVENTOS, INSTAGRAM_URL } from "@/content/site";
import { Linha, Titulo } from "./Motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Uma linha do cartaz. Observa o <li> (que não se move), nunca o texto escondido pela máscara:
// um alvo recortado por overflow nunca "entra" na tela. O nome sobe pela máscara; no hover o nome
// avança e acende em ouro, e a linha de cima também.
function Item({ nome, recuo }: { nome: string; recuo: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduzir = useReducedMotion();
  const visto = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const aberto = visto || reduzir;

  return (
    <li ref={ref} className="group relative border-t border-white/15">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-[2px] origin-left scale-x-0 bg-ouro transition-transform duration-700 ease-out group-hover:scale-x-100"
      />
      <div className={`py-6 lg:py-9 ${recuo ? "lg:pl-[9%]" : ""}`}>
        <h3 className="display -mb-[0.1em] overflow-hidden pb-[0.1em] text-[clamp(2.2rem,9.6vw,3.7rem)] lg:text-[clamp(3rem,6.1vw,6.2rem)]">
          <motion.span
            className="block"
            initial={{ y: reduzir ? 0 : "105%" }}
            animate={{ y: aberto ? 0 : "105%" }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="inline-block transition-[transform,color] duration-500 ease-out group-hover:translate-x-4 group-hover:text-ouro">
              {nome}
            </span>
          </motion.span>
        </h3>
      </div>
    </li>
  );
}

// Cartaz de escalação: só tipografia, sem fotos. Os nomes dos eventos são a imagem.
export function Campeonatos() {
  return (
    <section id="campeonatos" className="bg-preto py-24 lg:py-36">
      <div className="wrap">
        <Linha />
        <Titulo className="display mt-14 text-[clamp(2.3rem,9.4vw,3.5rem)] lg:mt-20 lg:text-[clamp(2.8rem,4.6vw,5rem)]">
          Campeonatos atendidos
        </Titulo>
        <p className="mt-5 max-w-[34ch] text-lg text-prata">Eventos em que a equipe atuou.</p>

        <ol className="mt-14 border-b border-white/15 lg:mt-20">
          {EVENTOS.map((e, i) => (
            <Item key={e.id} nome={e.nome} recuo={i % 2 === 1} />
          ))}
        </ol>

        <div className="mt-12">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ouro">
            Ver mais no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
