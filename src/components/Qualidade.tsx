import Image from "next/image";
import { QUALIDADE } from "@/content/site";
import { Entrada, FotoParallax, Linha, Revela, Titulo } from "./Motion";

export function Qualidade() {
  return (
    <section id="qualidade" className="relative overflow-hidden bg-grafite py-24 lg:py-36">
      <div className="wrap relative">
        <Linha />
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Revela>
                <FotoParallax className="aspect-[4/5] w-full">
                  <Image
                    src={QUALIDADE.foto.src}
                    alt={QUALIDADE.foto.alt}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="h-full w-full object-cover object-[50%_30%]"
                  />
                </FotoParallax>
              </Revela>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Titulo className="display text-[clamp(2.1rem,8.4vw,3.1rem)] lg:text-[clamp(2.4rem,3.9vw,4.3rem)]">{QUALIDADE.titulo}</Titulo>
            <ul className="mt-10 border-t border-white/15 lg:mt-14">
              {QUALIDADE.itens.map((item, i) => (
                <li key={item.titulo} className="border-b border-white/15">
                  <Entrada atraso={0.06 * i} className="grid gap-2 py-7 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:gap-10">
                    <h3 className="display text-[1.45rem] leading-[1.12] sm:text-[1.6rem]">{item.titulo}</h3>
                    <p className="text-prata">{item.texto}</p>
                  </Entrada>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
