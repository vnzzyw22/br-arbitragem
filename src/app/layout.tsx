import type { Metadata, Viewport } from "next";
import { Mona_Sans, Schibsted_Grotesk } from "next/font/google";
import { Loader } from "@/components/Loader";
import "./globals.css";

// Exatamente duas famílias (ver DESIGN.md > Tipografia), sem itálico em lugar nenhum:
// - Schibsted Grotesk: texto, formulário, menu e botões (400 texto, 500 rótulos, 600 botões).
// - Mona Sans expandida: títulos e destaques (500, largura 108–116%).
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-schibsted",
  display: "swap",
});

const mona = Mona_Sans({
  subsets: ["latin"],
  style: "normal",
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

const descricao =
  "Equipe de arbitragem para campeonatos, torneios e circuitos de futevôlei. Conte sobre o seu evento e solicite uma proposta.";

export const metadata: Metadata = {
  title: "BR Arbitragem Futevôlei | Arbitragem para campeonatos e torneios",
  description: descricao,
  openGraph: {
    title: "BR Arbitragem Futevôlei",
    description: descricao,
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1e31",
};

// Marca a sessão antes da pintura para o carregamento não reaparecer a cada visita.
const marcaSessao = `try{if(sessionStorage.getItem("br-loader"))document.documentElement.dataset.loader="visto"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${schibsted.variable} ${mona.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: marcaSessao }} />
        <Loader />
        <a href="#conteudo" className="pular">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
