import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

// Uma família só: wdth 62 nos títulos (condensada esportiva), wdth 100 no texto.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body>
        <a href="#conteudo" className="pular">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
