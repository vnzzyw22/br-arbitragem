import Image from "next/image";
import logo from "@/assets/identidade/logo-br.svg";

// Logo reconstruída em SVG a partir dos pixels do JPG 150×150 enviado pelo cliente (ver MIDIA.md):
// mesmo desenho, sem redesenhar letras. O disco branco é o corte circular da marca. Nítida em
// qualquer tamanho, mas a palavra ARBITRAGEM (≈5 px no original) só é fiel em tamanho pequeno:
// para ampliar muito, usar o vetor oficial do cliente.
export function Logo({ size = 56, className = "", eager = false }: { size?: number; className?: string; eager?: boolean }) {
  return (
    <Image
      src={logo}
      alt="BR Arbitragem"
      width={size}
      height={size}
      loading={eager ? "eager" : undefined}
      className={`rounded-full ${className}`}
    />
  );
}
