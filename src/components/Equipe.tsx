import Image from "next/image";
import { EQUIPE } from "@/content/site";
import { Entrada, FotoParallax, Linha, Revela, Titulo } from "./Motion";
import { QuadraEmJogo } from "./Ornamentos";

// Retrato limitado a 440 px de largura: o original tem 1080 px, então nunca é ampliado
// nem em tela de alta densidade (ver MIDIA.md). A foto do time foi retirada (qualidade).
export function Equipe() {
  return (
    <section id="equipe" className="claro textura-areia relative overflow-hidden bg-areia py-24 lg:py-36">
      <div className="wrap relative">
        <Linha cor="bg-azul" />
        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-6">
            <Titulo className="display max-w-[16ch] text-[clamp(1.85rem,7.4vw,2.7rem)] lg:text-[clamp(2.1rem,3.2vw,3.4rem)]">{EQUIPE.titulo}</Titulo>
            <Entrada atraso={0.1}>
              <p className="mt-7 max-w-[42ch] text-lg text-tinta/80">{EQUIPE.texto}</p>
            </Entrada>
            <ul className="mt-10 border-t border-tinta/15">
              {EQUIPE.principios.map((p, i) => (
                <li key={p} className="border-b border-tinta/15">
                  <Entrada atraso={0.12 * i}>
                    <p className="subtitulo py-4 text-[1.1rem]">{p}</p>
                  </Entrada>
                </li>
              ))}
            </ul>
            {/* quadra de areia vista de cima, com um rali em andamento */}
            <QuadraEmJogo className="mt-14 hidden w-full lg:block" />
          </div>

          <figure className="lg:col-span-5 lg:col-start-8">
            <Revela className="max-w-[440px] lg:ml-auto">
              <FotoParallax className="aspect-[4/5] w-full">
                <Image
                  src={EQUIPE.foto.src}
                  alt={EQUIPE.foto.alt}
                  sizes="(min-width: 1024px) 440px, min(440px, 92vw)"
                  className="h-full w-full object-cover object-[50%_25%]"
                />
              </FotoParallax>
            </Revela>
          </figure>

          <QuadraEmJogo className="w-full lg:hidden" />
        </div>
      </div>
    </section>
  );
}
