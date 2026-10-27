import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { Loader } from "@/components/Loader";
import "./globals.css";

// Uma família só (grotesca de redação): 600 nos títulos, 400/500 no texto.
// A única serifa da página é a da própria logo.
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
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
  themeColor: "#0a0a0a",
};

// Marca a sessão antes da pintura para o carregamento não reaparecer a cada visita.
const marcaSessao = `try{if(sessionStorage.getItem("br-loader"))document.documentElement.dataset.loader="visto"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={schibsted.variable}>
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
