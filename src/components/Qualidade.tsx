import Image from "next/image";
import { QUALIDADE, type Compromisso } from "@/content/site";
import { Icone } from "./Icones";
import { Linha, Titulo } from "./Motion";

// Compromissos em grade assimétrica (bento). O tamanho de cada card segue o conteúdo: os dois com
// foto real são os maiores (árbitro em ação na condução; equipe uniformizada na postura) e a
// integridade fecha como frase de destaque. Superfícies variam entre branco, areia e água.
// Ordem do código = ordem visual (1 a 5), também no celular. Cards não são clicáveis: sem hover.
// Fotos de 1080 px: no máximo ~540 px de largura na tela.
const LAYOUT = [
  { superficie: "bg-white text-tinta", grade: "lg:col-span-5 lg:row-span-2", escuro: false },
  { superficie: "textura-areia bg-areia text-tinta", grade: "lg:col-span-7", escuro: false },
  { superficie: "bg-agua-funda text-tinta", grade: "lg:col-span-7", escuro: false },
  { superficie: "bg-white text-tinta", grade: "lg:col-span-5", escuro: false },
  { superficie: "bg-mar text-white", grade: "lg:col-span-7", escuro: true },
];

function Cabecalho({ item, escuro }: { item: Compromisso; escuro: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
          escuro ? "bg-white/12 text-ceu" : "bg-tinta/[0.06] text-azul-acao"
        }`}
      >
        <Icone nome={item.icone} className="h-[22px] w-[22px]" />
      </span>
      <h3 className="subtitulo text-[1.2rem] sm:text-[1.3rem]">{item.titulo}</h3>
    </div>
  );
}

function Cartao({ item, i }: { item: Compromisso; i: number }) {
  const { superficie, escuro } = LAYOUT[i];
  const corTexto = escuro ? "text-white/80" : "text-tinta/75";

  // 1: foto em cima, texto embaixo (card alto)
  if (i === 0 && item.foto) {
    return (
      <article className={`cartao flex flex-col ${superficie}`}>
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[19rem] lg:flex-1">
          <Image
            src={item.foto.src}
            alt={item.foto.alt}
            fill
            sizes="(min-width: 1024px) 540px, 92vw"
            className="object-cover"
            style={{ objectPosition: item.foto.posicao }}
          />
        </div>
        <div className="p-6 sm:p-7">
          <Cabecalho item={item} escuro={escuro} />
          <p className={`mt-3 max-w-[42ch] ${corTexto}`}>{item.texto}</p>
        </div>
      </article>
    );
  }

  // 3: foto ao lado do texto
  if (item.foto) {
    return (
      <article className={`cartao grid sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${superficie}`}>
        <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[15rem]">
          <Image
            src={item.foto.src}
            alt={item.foto.alt}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 92vw"
            className="object-cover"
            style={{ objectPosition: item.foto.posicao }}
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-7">
          <Cabecalho item={item} escuro={escuro} />
          <p className={`mt-3 max-w-[38ch] ${corTexto}`}>{item.texto}</p>
        </div>
      </article>
    );
  }

  // 5: frase de destaque
  if (escuro) {
    return (
      <article className={`cartao cartao-escuro flex flex-col justify-between gap-8 p-6 sm:p-8 ${superficie}`}>
        <Cabecalho item={item} escuro />
        <p className="display max-w-[24ch] text-[clamp(1.45rem,5.6vw,1.8rem)] lg:text-[clamp(1.6rem,2.1vw,2rem)]">{item.texto}</p>
      </article>
    );
  }

  return (
    <article className={`cartao flex flex-col justify-between gap-6 p-6 sm:p-7 ${superficie}`}>
      <Cabecalho item={item} escuro={false} />
      <p className={`max-w-[40ch] ${corTexto}`}>{item.texto}</p>
    </article>
  );
}

export function Qualidade() {
  return (
    <section id="qualidade" className="claro fundo-agua relative overflow-hidden pb-24 pt-14 lg:pb-32 lg:pt-20">
      <div className="wrap relative">
        <Linha cor="bg-azul" />
        <Titulo className="display mt-12 max-w-[18ch] text-[clamp(1.85rem,7.4vw,2.7rem)] lg:mt-16 lg:text-[clamp(2.1rem,3.4vw,3.7rem)]">
          {QUALIDADE.titulo}
        </Titulo>
        <ul className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-12 lg:gap-5">
          {QUALIDADE.itens.map((item, i) => (
            <li key={item.titulo} className={`flex ${LAYOUT[i].grade}`}>
              <div className="flex w-full [&>article]:w-full">
                <Cartao item={item} i={i} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
