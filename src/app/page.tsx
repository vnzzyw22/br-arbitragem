import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Equipe } from "@/components/Equipe";
import { Qualidade } from "@/components/Qualidade";
import { Campeonatos } from "@/components/Campeonatos";
import { Faq } from "@/components/Faq";
import { Contato } from "@/components/Contato";
import { Rodape } from "@/components/Rodape";
import { CtaMobile } from "@/components/CtaMobile";
import { ProgressoBola } from "@/components/Motion";

export default function Home() {
  return (
    <>
      <ProgressoBola />
      <Nav />
      <main id="conteudo">
        <Hero />
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
