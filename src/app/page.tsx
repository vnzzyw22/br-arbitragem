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
        {/* linha d'água entre areia e mar (a faixa Em quadra só existe no celular em pé) */}
        <Orla de="oceano" para="areia" className="paisagem:hidden" />
        <Equipe />
        <Orla de="areia" para="oceano" />
        <Qualidade />
        <Orla de="oceano" para="branco" />
        <Campeonatos />
        <Orla de="branco" para="oceano" />
        <Faq />
        <Orla de="oceano" para="areia" />
        <Contato />
        <Orla de="areia" para="oceano-profundo" />
      </main>
      <Rodape />
      <CtaMobile />
    </>
  );
}
