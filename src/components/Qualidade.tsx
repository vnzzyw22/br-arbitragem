import Image from "next/image";
import { QUALIDADE } from "@/content/site";
import { Linha, Revela } from "./Motion";

export function Qualidade() {
  return (
    <section id="qualidade" className="bg-grafite py-20 lg:py-32">
      <div className="wrap">
        <Linha />
        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Revela>
                <Image
                  src={QUALIDADE.foto.src}
                  alt={QUALIDADE.foto.alt}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="aspect-[4/5] w-full object-cover object-[50%_40%]"
                />
              </Revela>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(2.6rem,10vw,4.2rem)] lg:text-[clamp(3rem,5.4vw,5.5rem)]">{QUALIDADE.titulo}</h2>
            <ul className="mt-10 border-t border-white/15 lg:mt-14">
              {QUALIDADE.itens.map((item) => (
                <li
                  key={item.titulo}
                  className="grid gap-2 border-b border-white/15 py-7 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:gap-8"
                >
                  <h3 className="display text-[1.85rem] leading-[0.95] sm:text-[2.1rem]">{item.titulo}</h3>
                  <p className="text-prata">{item.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
