"use client";

import { useId, useState } from "react";
import { FAQ } from "@/content/site";
import { Entrada, Linha, Titulo } from "./Motion";

// Acordeão em cards compactos: uma pergunta aberta por vez (a primeira começa aberta), o card
// aberto clareia e o "+" vira "−" num círculo. Fecha com um card que leva ao formulário.
export function Faq() {
  const [aberto, setAberto] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="duvidas" className="bg-oceano pb-24 pt-14 lg:pb-32 lg:pt-20">
      <div className="wrap">
        <Linha />
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4">
            <Titulo className="display text-[clamp(2rem,8vw,3rem)] lg:text-[clamp(2.4rem,3.6vw,3.9rem)]">Perguntas frequentes</Titulo>
            <p className="mt-5 max-w-[30ch] text-lg text-white/75">O que os organizadores costumam perguntar antes de pedir o orçamento.</p>
          </div>
          <div className="lg:col-span-8">
            <ul className="space-y-2.5">
              {FAQ.map((item, i) => {
                const idBotao = `${base}-b${i}`;
                const idPainel = `${base}-p${i}`;
                const expandido = aberto === i;
                return (
                  <li key={item.p}>
                    <Entrada atraso={0.06 * i}>
                      <div
                        className={`rounded-2xl border transition-colors duration-300 ${
                          expandido ? "border-white/20 bg-white/[0.09]" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                        }`}
                      >
                        <h3>
                          <button
                            id={idBotao}
                            type="button"
                            aria-expanded={expandido}
                            aria-controls={idPainel}
                            onClick={() => setAberto(expandido ? null : i)}
                            className="flex min-h-16 w-full items-center justify-between gap-5 rounded-2xl px-5 py-4 text-left subtitulo text-[1.1rem] sm:px-6 sm:text-[1.2rem]"
                          >
                            <span>{item.p}</span>
                            <span
                              aria-hidden="true"
                              className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                                expandido ? "border-ceu bg-ceu text-oceano" : "border-white/30 text-white"
                              }`}
                            >
                              <span className="absolute h-[2px] w-3.5 bg-current" />
                              <span
                                className={`absolute h-3.5 w-[2px] bg-current transition-transform duration-300 ${expandido ? "scale-y-0" : "scale-y-100"}`}
                              />
                            </span>
                          </button>
                        </h3>
                        <div
                          id={idPainel}
                          role="region"
                          aria-labelledby={idBotao}
                          inert={!expandido}
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${expandido ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                        >
                          <div className="overflow-hidden">
                            <p className="max-w-[60ch] px-5 pb-5 text-white/80 sm:px-6">{item.r}</p>
                          </div>
                        </div>
                      </div>
                    </Entrada>
                  </li>
                );
              })}
            </ul>

            <Entrada atraso={0.3}>
              <div className="cartao cartao-escuro mt-6 flex flex-col gap-5 bg-agua p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="subtitulo text-[1.2rem] text-white">Sua dúvida não está aqui?</p>
                  <p className="mt-1 text-white/80">Conte sobre o evento no formulário e pergunte direto à equipe.</p>
                </div>
                <a href="#contato" className="btn btn-claro shrink-0">
                  Ir para o orçamento
                </a>
              </div>
            </Entrada>
          </div>
        </div>
      </div>
    </section>
  );
}
