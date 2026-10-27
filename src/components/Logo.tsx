import Image from "next/image";
import logo from "@/assets/identidade/logo-br.jpg";

// Logo oficial sem alteração; o corte circular é o próprio contorno da marca.
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
