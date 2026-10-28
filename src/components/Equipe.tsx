import Image from "next/image";
import { EQUIPE } from "@/content/site";
import { FotoParallax, Linha, Revela, Titulo } from "./Motion";
import { JogadaFutevolei } from "./Futevolei";
import { BeiraMar, Coqueiro } from "./Praia";

// Composição editorial: a equipe em quadra é a imagem principal; o retrato de um árbitro entra por
// cima, com moldura branca, como uma foto impressa. Texto curto, princípios em etiquetas e a quadra
// em jogo num card. Fotos limitadas à resolução nativa (equipe 1128 px → até 520 px com a paralaxe;
// retrato 1080 px → até 230 px). Um só desenho da jogada: a grade o reposiciona no desktop.
export function Equipe() {
  return (
    <section id="equipe" className="claro textura-areia textura-fade fundo-equipe relative overflow-hidden pb-32 pt-14 sm:pb-36 lg:pb-32 lg:pt-20">
      <div className="wrap relative">
        <Linha cor="bg-azul" />
        <div className="mt-12 grid items-start gap-x-14 gap-y-12 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pt-4">
            <Titulo className="display max-w-[15ch] text-[clamp(1.85rem,7.4vw,2.7rem)] lg:text-[clamp(2.1rem,3.2vw,3.4rem)]">
              {EQUIPE.titulo}
            </Titulo>
            <p className="mt-6 max-w-[40ch] text-lg text-tinta/80">{EQUIPE.texto}</p>
            <ul aria-label="Princípios da equipe" className="mt-8 flex flex-wrap gap-2.5">
              {EQUIPE.principios.map((p) => (
                <li key={p}>
                  <span className="inline-flex min-h-10 items-center gap-2.5 rounded-full border border-tinta/10 bg-white/75 px-4 text-[0.95rem] font-medium text-tinta shadow-[0_10px_24px_-18px_rgb(11_30_49/0.6)]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-azul-acao" />
                    {p}
                  </span>
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

          {/* jogada de futevôlei com os quatro atletas e o árbitro, num card de "prancheta" */}
          <div className="quadra-card cartao bg-white/60 p-3 sm:p-4 lg:col-span-5 lg:row-start-2">
            <JogadaFutevolei />
          </div>
        </div>
      </div>
      {/* a areia termina na água: o mar chega aqui e continua em Compromissos */}
      <BeiraMar para="agua" />
      {/* coqueiros plantados na areia molhada, logo acima de onde a água chega */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[2.6rem] right-[4%] flex items-end sm:bottom-[3.1rem] lg:bottom-[3.6rem] lg:right-[7%]">
        <Coqueiro className="w-12 sm:w-16 lg:w-36" />
        <Coqueiro className="-ml-6 hidden w-24 -scale-x-100 lg:block" />
      </div>
    </section>
  );
}
