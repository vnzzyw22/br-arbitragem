import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { EmQuadra } from "@/components/EmQuadra";
import { Equipe } from "@/components/Equipe";
import { Qualidade } from "@/components/Qualidade";
import { Campeonatos } from "@/components/Campeonatos";
import { Faq } from "@/components/Faq";
import { Contato } from "@/components/Contato";
import { Rodape } from "@/components/Rodape";
import { CtaMobile } from "@/components/CtaMobile";
import { ProgressoBola } from "@/components/Motion";
import { Orla } from "@/components/Orla";

export default function Home() {
  return (
    <>
      <ProgressoBola />
      <Nav />
      <main id="conteudo">
        <Hero />
        <EmQuadra />
        {/* única linha d'água fora da hero: só no celular em pé, onde a faixa Em quadra (azul)
            separa a hero da areia. Daí em diante o fundo muda por gradiente (.fundo-* no CSS). */}
        <Orla de="oceano" para="areia" className="paisagem:hidden" />
        <Equipe />
        <Qualidade />
        <Campeonatos />
        <Faq />
        <Contato />
      </main>
      <Rodape />
      <CtaMobile />
    </>
  );
}
