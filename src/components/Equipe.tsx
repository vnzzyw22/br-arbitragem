import Image from "next/image";
import { EQUIPE } from "@/content/site";
import { Entrada, FotoParallax, Linha, Revela, Titulo } from "./Motion";
import { QuadraEmJogo } from "./Ornamentos";

export function Equipe() {
  return (
    <section id="equipe" className="relative overflow-hidden bg-preto py-24 lg:py-36">
      <div className="wrap relative">
        <Linha />
        <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-x-14">
          <div className="relative pb-20 lg:col-span-7 lg:pb-28">
            <Revela>
              <FotoParallax className="aspect-square w-full">
                <Image
                  src={EQUIPE.fotoGrande.src}
                  alt={EQUIPE.fotoGrande.alt}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </FotoParallax>
            </Revela>
            <div className="absolute bottom-0 right-3 w-[42%] border-[6px] border-preto sm:right-6 lg:-right-8 lg:w-[34%] lg:border-8">
              <Revela>
                <FotoParallax className="aspect-[4/5] w-full">
                  <Image
                    src={EQUIPE.fotoPequena.src}
                    alt={EQUIPE.fotoPequena.alt}
                    sizes="(min-width: 1024px) 20vw, 42vw"
                    className="h-full w-full object-cover object-[50%_25%]"
                  />
                </FotoParallax>
              </Revela>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-14">
            <Titulo className="display text-[clamp(2.1rem,8.4vw,3.1rem)] lg:text-[clamp(2.4rem,3.5vw,3.9rem)]">{EQUIPE.titulo}</Titulo>
            <Entrada atraso={0.1}>
              <p className="mt-7 max-w-[40ch] text-lg text-white/85">{EQUIPE.texto}</p>
            </Entrada>
            <ul className="mt-10 border-t border-white/15">
              {EQUIPE.principios.map((p, i) => (
                <li key={p} className="border-b border-white/15">
                  <Entrada atraso={0.12 * i}>
                    <p className="py-4 text-lg font-medium">{p}</p>
                  </Entrada>
                </li>
              ))}
            </ul>
            {/* quadra de areia vista de cima, com um rali em andamento */}
            <QuadraEmJogo className="mt-14 w-full max-w-[30rem] text-white/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
