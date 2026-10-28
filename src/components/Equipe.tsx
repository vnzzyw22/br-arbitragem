import Image from "next/image";
import { EQUIPE } from "@/content/site";
import { Entrada, FotoParallax, Linha, Revela, Titulo } from "./Motion";
import { QuadraEmJogo } from "./Ornamentos";

// Composição editorial: a equipe em quadra é a imagem principal; o retrato de um árbitro entra por
// cima, com moldura branca, como uma foto impressa. Texto curto, princípios em etiquetas e a quadra
// em jogo num card. Fotos limitadas à resolução nativa (equipe 1128 px → até 520 px com a paralaxe;
// retrato 1080 px → até 230 px). Um só desenho da quadra: a grade o reposiciona no desktop.
export function Equipe() {
  return (
    <section id="equipe" className="claro textura-areia relative overflow-hidden bg-areia pb-24 pt-14 lg:pb-32 lg:pt-20">
      <div className="wrap relative">
        <Linha cor="bg-azul" />
        <div className="mt-12 grid items-start gap-x-14 gap-y-12 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pt-4">
            <Titulo className="display max-w-[15ch] text-[clamp(1.85rem,7.4vw,2.7rem)] lg:text-[clamp(2.1rem,3.2vw,3.4rem)]">
              {EQUIPE.titulo}
            </Titulo>
            <Entrada atraso={0.1}>
              <p className="mt-6 max-w-[40ch] text-lg text-tinta/80">{EQUIPE.texto}</p>
            </Entrada>
            <ul aria-label="Princípios da equipe" className="mt-8 flex flex-wrap gap-2.5">
              {EQUIPE.principios.map((p, i) => (
                <li key={p}>
                  <Entrada atraso={0.15 + 0.08 * i}>
                    <span className="inline-flex min-h-10 items-center gap-2.5 rounded-full border border-tinta/10 bg-white/75 px-4 text-[0.95rem] font-medium text-tinta shadow-[0_10px_24px_-18px_rgb(11_30_49/0.6)]">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-azul-acao" />
                      {p}
                    </span>
                  </Entrada>
                </li>
              ))}
            </ul>
          </div>

          <figure className="relative ml-auto w-full max-w-[600px] pb-14 sm:pb-20 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-2">
            <Revela className="cartao ml-auto w-[88%]">
              <FotoParallax className="aspect-[5/4] w-full">
                <Image
                  src={EQUIPE.fotoPrincipal.src}
                  alt={EQUIPE.fotoPrincipal.alt}
                  sizes="(min-width: 1024px) 530px, 82vw"
                  className="h-full w-full object-cover object-[50%_40%]"
                />
              </FotoParallax>
              <figcaption className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-medium text-tinta shadow-sm">
                {EQUIPE.legenda}
              </figcaption>
            </Revela>
            <div className="absolute bottom-0 left-0 w-[36%] max-w-[220px] rounded-[1.1rem] bg-white p-1.5 shadow-[0_28px_50px_-26px_rgb(11_30_49/0.6)]">
              <Image
                src={EQUIPE.fotoDetalhe.src}
                alt={EQUIPE.fotoDetalhe.alt}
                sizes="220px"
                className="aspect-[4/5] w-full rounded-[0.8rem] object-cover object-[50%_25%]"
              />
            </div>
          </figure>

          {/* quadra de areia vista de cima, com um rali em andamento, num card de "prancheta" */}
          <div className="quadra-card cartao bg-white/60 p-3 sm:p-4 lg:col-span-5 lg:row-start-2">
            <QuadraEmJogo className="block w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
