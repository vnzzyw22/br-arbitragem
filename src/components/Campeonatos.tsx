"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BASTIDORES, EVENTOS, INSTAGRAM_URL, type Evento, type Midia } from "@/content/site";
import { Linha, Revela } from "./Motion";
import { VideoLoop } from "./VideoLoop";

const MQ = "(min-width: 1024px)";
function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(MQ);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(MQ).matches,
    () => false,
  );
}

function Quadro({ midia, sizes, className = "" }: { midia: Midia; sizes: string; className?: string }) {
  if (midia.tipo === "video") {
    return (
      <div className={`relative ${className}`} role="img" aria-label={midia.alt}>
        <VideoLoop src={midia.src} poster={midia.poster} preload="none" className="absolute inset-0 h-full w-full" />
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <Image
        src={midia.src}
        alt={midia.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: midia.posicao ?? "50% 50%" }}
      />
    </div>
  );
}

function SemFoto({ evento }: { evento: Evento }) {
  return (
    <div className="flex h-full flex-col justify-end bg-grafite p-8">
      <p className="display text-4xl text-prata">Registro no Instagram do torneio.</p>
      {evento.fonte && (
        <a
          href={evento.fonte.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center self-start text-lg font-medium underline decoration-2 underline-offset-8 hover:text-ouro"
        >
          {evento.fonte.rotulo}
        </a>
      )}
    </div>
  );
}

export function Campeonatos() {
  const [ativo, setAtivo] = useState(EVENTOS[0].id);
  const reduzir = useReducedMotion();
  const desktop = useDesktop();
  const atual = EVENTOS.find((e) => e.id === ativo) ?? EVENTOS[0];

  return (
    <section id="campeonatos" className="bg-preto py-20 lg:py-32">
      <div className="wrap">
        <Linha />
        <h2 className="display mt-12 text-[clamp(2.8rem,11vw,4.6rem)] lg:mt-16 lg:text-[clamp(3.4rem,7vw,7.5rem)]">
          Campeonatos atendidos
        </h2>

        <div className="mt-12 grid gap-x-12 lg:mt-16 lg:grid-cols-12">
          <ul className="lg:col-span-7">
            {EVENTOS.map((e) => {
              const selecionado = e.id === ativo;
              return (
                <li key={e.id} className="border-t border-white/15 last:border-b">
                  <button
                    type="button"
                    aria-pressed={selecionado}
                    onMouseEnter={() => setAtivo(e.id)}
                    onFocus={() => setAtivo(e.id)}
                    onClick={() => setAtivo(e.id)}
                    className={`group relative block w-full py-6 text-left transition-colors lg:py-8 ${
                      selecionado ? "text-white" : "text-prata hover:text-white"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -top-px hidden h-[3px] origin-left bg-ouro transition-transform duration-500 lg:block ${
                        selecionado ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                    <span className="display block text-[clamp(2.6rem,10.5vw,4.4rem)] lg:pl-6 lg:text-[clamp(3.2rem,6vw,6rem)]">
                      {e.nome}
                    </span>
                    <span className="mt-2 block max-w-[44ch] text-base text-prata lg:pl-6">{e.descricao}</span>
                  </button>

                  {/* mobile: a mídia vem junto de cada evento */}
                  {!desktop && (
                  <div className="pb-8">
                    {e.midia ? (
                      <Quadro midia={e.midia} sizes="100vw" className="aspect-[4/5] w-full" />
                    ) : (
                      e.fonte && (
                        <a
                          href={e.fonte.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center text-lg font-medium underline decoration-2 underline-offset-8"
                        >
                          {e.fonte.rotulo}
                        </a>
                      )
                    )}
                  </div>
                  )}
                </li>
              );
            })}
          </ul>

          {desktop && (
          <div className="lg:col-span-5">
            <div className="sticky top-24 aspect-[4/5] overflow-hidden bg-grafite" aria-live="polite">
              <AnimatePresence initial={false}>
                <motion.div
                  key={atual.id}
                  className="absolute inset-0"
                  initial={reduzir ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduzir ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {atual.midia ? (
                    <Quadro midia={atual.midia} sizes="40vw" className="h-full w-full" />
                  ) : (
                    <SemFoto evento={atual} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          )}
        </div>

        <div className="mt-20 grid grid-cols-2 items-start gap-3 sm:gap-5 lg:mt-32 lg:grid-cols-12 lg:gap-8">
          <Revela className="col-span-2 lg:col-span-5">
            <Image
              src={BASTIDORES[0].src}
              alt={BASTIDORES[0].alt}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </Revela>
          <Revela className="lg:col-span-4 lg:mt-24">
            <Image
              src={BASTIDORES[1].src}
              alt={BASTIDORES[1].alt}
              sizes="(min-width: 1024px) 30vw, 50vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </Revela>
          <Revela className="lg:col-span-3 lg:mt-8">
            <Image
              src={BASTIDORES[2].src}
              alt={BASTIDORES[2].alt}
              sizes="(min-width: 1024px) 24vw, 50vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </Revela>
        </div>
        <p className="mt-8 text-prata">
          Mais registros no Instagram{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="-my-3 inline-block py-3 font-medium text-white underline decoration-2 underline-offset-4 hover:text-ouro"
          >
            @brarbitragem.ftv
          </a>
          .
        </p>
      </div>
    </section>
  );
}
