import Image from "next/image";
import { EQUIPE } from "@/content/site";
import { Linha, Revela } from "./Motion";

export function Equipe() {
  return (
    <section id="equipe" className="bg-preto py-20 lg:py-32">
      <div className="wrap">
        <Linha />
        <div className="mt-12 grid gap-16 lg:mt-16 lg:grid-cols-12 lg:gap-x-12">
          <div className="relative pb-16 lg:col-span-7 lg:pb-24">
            <Revela>
              <Image
                src={EQUIPE.fotoGrande.src}
                alt={EQUIPE.fotoGrande.alt}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-square w-full object-cover"
              />
            </Revela>
            <div className="absolute bottom-0 right-3 w-[46%] border-[6px] border-preto sm:right-6 lg:-right-10 lg:w-[40%] lg:border-8">
              <Revela>
                <Image
                  src={EQUIPE.fotoPequena.src}
                  alt={EQUIPE.fotoPequena.alt}
                  sizes="(min-width: 1024px) 24vw, 46vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </Revela>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-16">
            <h2 className="display text-[clamp(2.6rem,10vw,4.2rem)] lg:text-[clamp(3rem,5vw,5rem)]">{EQUIPE.titulo}</h2>
            <p className="mt-6 max-w-[40ch] text-lg text-white/85">{EQUIPE.texto}</p>
            <ul className="mt-10 border-t border-white/15">
              {EQUIPE.principios.map((p) => (
                <li key={p} className="border-b border-white/15 py-4 text-lg font-medium">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
