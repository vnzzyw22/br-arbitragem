"use client";

import { useId, useState } from "react";
import { FAQ } from "@/content/site";
import { Entrada, Linha, Titulo } from "./Motion";

export function Faq() {
  const [aberto, setAberto] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="duvidas" className="bg-grafite py-24 lg:py-36">
      <div className="wrap">
        <Linha />
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          <Titulo className="display text-[clamp(2.3rem,9.4vw,3.5rem)] lg:col-span-5 lg:text-[clamp(2.8rem,4.2vw,4.6rem)]">
            Perguntas frequentes
          </Titulo>
          <div className="lg:col-span-7">
            <ul className="border-t border-white/15">
              {FAQ.map((item, i) => {
                const idBotao = `${base}-b${i}`;
                const idPainel = `${base}-p${i}`;
                const expandido = aberto === i;
                return (
                  <li key={item.p} className="border-b border-white/15">
                    <Entrada atraso={0.07 * i}>
                    <h3>
                      <button
                        id={idBotao}
                        type="button"
                        aria-expanded={expandido}
                        aria-controls={idPainel}
                        onClick={() => setAberto(expandido ? null : i)}
                        className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-xl font-semibold transition-colors hover:text-ouro"
                      >
                        <span>{item.p}</span>
                        <span aria-hidden="true" className="relative block h-4 w-4 shrink-0">
                          <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
                          <span
                            className={`absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current transition-transform duration-300 ${
                              expandido ? "scale-y-0" : "scale-y-100"
                            }`}
                          />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={idPainel}
                      role="region"
                      aria-labelledby={idBotao}
                      inert={!expandido}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        expandido ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[58ch] pb-6 text-prata">{item.r}</p>
                      </div>
                    </div>
                    </Entrada>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
