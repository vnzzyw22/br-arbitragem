"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EVENTOS, INSTAGRAM_URL } from "@/content/site";
import { Linha, Titulo } from "./Motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Uma linha do cartaz. Observa o <li> (que não se move), nunca o texto escondido pela máscara:
// um alvo recortado por overflow nunca "entra" na tela. O nome sobe pela máscara; no hover o nome
// avança e acende no azul de ação, e a linha de cima se desenha.
function Item({ nome, recuo }: { nome: string; recuo: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduzir = useReducedMotion();
  const visto = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const aberto = visto || reduzir;

  return (
    <li ref={ref} className="group relative border-t border-tinta/15">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-[2px] origin-left scale-x-0 bg-azul-acao transition-transform duration-700 ease-out group-hover:scale-x-100"
      />
      <div className={`py-6 lg:py-9 ${recuo ? "lg:pl-[9%]" : ""}`}>
        <h3 className="display -mb-[0.1em] overflow-hidden pb-[0.1em] text-[clamp(1.9rem,8.2vw,3.2rem)] lg:text-[clamp(2.6rem,5.2vw,5.2rem)]">
          <motion.span
            className="block"
            initial={{ y: reduzir ? 0 : "105%" }}
            animate={{ y: aberto ? 0 : "105%" }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="inline-block transition-[transform,color] duration-500 ease-out group-hover:translate-x-4 group-hover:text-azul-acao">
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
    <section id="campeonatos" className="claro bg-branco py-24 lg:py-36">
      <div className="wrap">
        <Linha cor="bg-azul" />
        <Titulo className="display mt-14 text-[clamp(2rem,8vw,3rem)] lg:mt-20 lg:text-[clamp(2.4rem,3.9vw,4.2rem)]">
          Campeonatos atendidos
        </Titulo>
        <p className="mt-5 max-w-[34ch] text-lg text-tinta/75">Eventos em que a equipe atuou.</p>

        <ol className="mt-14 border-b border-tinta/15 lg:mt-20">
          {EVENTOS.map((e, i) => (
            <Item key={e.id} nome={e.nome} recuo={i % 2 === 1} />
          ))}
        </ol>

        <div className="mt-12">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-azul">
            Ver mais no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
