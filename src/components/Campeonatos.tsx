import Image from "next/image";
import { EVENTOS, INSTAGRAM_HANDLE, INSTAGRAM_URL, type Evento } from "@/content/site";
import { Entrada, Linha, Titulo } from "./Motion";

// Eventos atendidos em cards. Foto só quando a imagem é do próprio evento (associação visível
// e registrada em site.ts/MIDIA.md): Arena Sun7 e Torneio do Bosque em capa; Queiróz Cup em
// miniatura (a fonte tem 540 px). Os demais são cartazes tipográficos com o desenho da quadra.
// Os cards não levam a lugar nenhum, então não têm hover; o único clicável é o do Instagram.
// Ordem do código = ordem visual.

// Largura de cada card na grade: celular (2 colunas) e desktop (3 colunas).
// Celular: com foto e o Amsterdam ocupam a linha toda; os cartazes simples ficam lado a lado.
// Desktop: Arena Sun7 (foto em alta) e Amsterdam Cup (fecha a grade) ocupam duas colunas.
function largura(e: Evento) {
  // cartazes simples ficam lado a lado só a partir de 440 px (abaixo disso os nomes não cabem)
  const celular = e.foto || e.id === "amsterdam-cup" ? "col-span-2" : "col-span-2 min-[440px]:col-span-1";
  const desktop = e.id === "arena-sun7" || e.id === "amsterdam-cup" ? "lg:col-span-2" : "lg:col-span-1";
  return `${celular} ${desktop}`;
}

// superfícies dos cartazes sem foto, alternando areia e água
const SUPERFICIE: Record<string, string> = {
  "queiroz-cup": "textura-areia bg-areia text-tinta",
  "spfc-futevolei": "bg-agua-clara text-tinta",
  "desafio-ao-galo": "textura-areia bg-areia text-tinta",
  "amsterdam-cup": "bg-oceano text-white cartao-escuro",
};

// quadra vista de cima em linha (fita e rede), grande ao fundo dos cartazes sem foto
function QuadraLinha({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true" fill="none" stroke="currentColor" className={className}>
      <rect x="2" y="2" width="156" height="96" rx="3" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M80 0v100" strokeWidth="3.5" vectorEffect="non-scaling-stroke" />
      <circle cx="80" cy="2" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="80" cy="98" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Nome({ texto, claro = false }: { texto: string; claro?: boolean }) {
  return (
    <h3 className={`display text-[clamp(1.6rem,6.4vw,2.1rem)] lg:text-[clamp(1.8rem,2.4vw,2.4rem)] ${claro ? "text-white" : ""}`}>
      {texto}
    </h3>
  );
}

function Cartao({ e }: { e: Evento }) {
  // capa: a foto ocupa o card e o nome entra sobre um véu azul-profundo na base
  if (e.foto?.modo === "capa") {
    return (
      <article className="cartao cartao-escuro relative flex min-h-[19rem] items-end bg-oceano-profundo sm:min-h-[21rem] lg:min-h-[24rem]">
        <Image
          src={e.foto.src}
          alt={e.foto.alt}
          fill
          sizes={e.id === "arena-sun7" ? "(min-width: 1024px) 900px, 92vw" : "(min-width: 1024px) 440px, 92vw"}
          className="object-cover"
          style={{ objectPosition: e.foto.posicao }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-oceano-profundo/85 via-oceano-profundo/25 to-transparent" />
        <div className="relative p-6 sm:p-7">
          <Nome texto={e.nome} claro />
        </div>
      </article>
    );
  }

  // miniatura: cartaz com a foto pequena do evento ao lado
  if (e.foto?.modo === "miniatura") {
    return (
      <article className={`cartao flex min-h-[13rem] items-end p-6 sm:p-7 lg:min-h-[24rem] ${SUPERFICIE[e.id]}`}>
        {/* a foto do evento entra como um selo no canto (a fonte tem 540 px) */}
        <div className="absolute right-5 top-5 aspect-[4/5] w-24 overflow-hidden rounded-xl border-4 border-white shadow-[0_18px_34px_-18px_rgb(11_30_49/0.65)] sm:right-6 sm:top-6 sm:w-28 lg:w-40">
          <Image src={e.foto.src} alt={e.foto.alt} fill sizes="160px" className="object-cover" />
        </div>
        <div className="relative max-w-[60%] lg:max-w-none">
          <Nome texto={e.nome} />
        </div>
      </article>
    );
  }

  // cartaz tipográfico
  const escuro = e.id === "amsterdam-cup";
  return (
    <article className={`cartao flex min-h-[11rem] flex-col justify-end p-6 sm:p-7 lg:min-h-[21rem] ${SUPERFICIE[e.id]}`}>
      {/* quadra inteira, vista de cima, como um selo no canto do cartaz */}
      <QuadraLinha
        className={`pointer-events-none absolute right-5 top-5 w-[42%] max-w-[9.5rem] sm:right-6 sm:top-6 ${escuro ? "text-ceu/45" : "text-azul-acao/35"}`}
      />
      <div className="relative">
        <Nome texto={e.nome} claro={escuro} />
      </div>
    </article>
  );
}

export function Campeonatos() {
  return (
    <section id="campeonatos" className="claro fundo-espuma pb-24 pt-14 lg:pb-32 lg:pt-20">
      <div className="wrap">
        <Linha cor="bg-azul" />
        <div className="mt-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 lg:mt-16">
          <Titulo className="display text-[clamp(2rem,8vw,3rem)] lg:text-[clamp(2.4rem,3.9vw,4.2rem)]">Campeonatos atendidos</Titulo>
          <p className="max-w-[34ch] text-lg text-tinta/75">Eventos em que a equipe atuou.</p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {EVENTOS.map((e, i) => (
            <li key={e.id} className={`flex ${largura(e)}`}>
              <Entrada atraso={0.05 * i} className="flex w-full [&>article]:w-full">
                <Cartao e={e} />
              </Entrada>
            </li>
          ))}
          <li className="col-span-2 flex lg:col-span-1">
            <Entrada atraso={0.3} className="flex w-full">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cartao cartao-escuro group flex w-full flex-col justify-between gap-8 bg-mar p-6 text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#1c4e56] sm:p-7 lg:min-h-[21rem]"
              >
                <span className="text-white/80">Acompanhe a equipe</span>
                <span>
                  <span className="display block text-[clamp(1.5rem,5.6vw,1.9rem)]">Ver mais no Instagram</span>
                  <span className="mt-2 block font-medium text-white/85 underline decoration-white/40 underline-offset-4 group-hover:decoration-white">
                    {INSTAGRAM_HANDLE}
                  </span>
                </span>
              </a>
            </Entrada>
          </li>
        </ul>
      </div>
    </section>
  );
}
