import type { Icone as NomeIcone } from "@/content/site";

// Ícones próprios dos compromissos (sem biblioteca): grade de 24 px, traço de 1,6 px,
// pontas arredondadas, sem preenchimento. Cor vem de currentColor. Decorativos (aria-hidden):
// o título do card já diz o que o ícone representa.
const desenhos: Record<NomeIcone, React.ReactNode> = {
  // apito de árbitro: bocal, câmara, furo e argola
  apito: (
    <>
      <circle cx="14.5" cy="13.5" r="5.5" />
      <path d="M9.4 10.4H4a1.2 1.2 0 0 0-1.2 1.2v1.8A1.2 1.2 0 0 0 4 14.6h5" />
      <circle cx="14.5" cy="13.5" r="1.4" />
      <circle cx="18.6" cy="5.4" r="1.9" />
      <path d="m17.3 6.8-1.2 1.4" />
    </>
  ),
  // livro de regras com marcação de conferido
  regras: (
    <>
      <path d="M5 5a2 2 0 0 1 2-2h12v15H7a2 2 0 0 0-2 2z" />
      <path d="M5 20a2 2 0 0 0 2 2h12v-4" />
      <path d="m9 10.2 2.1 2.1L15.3 8" />
    </>
  ),
  // camisa de uniforme
  camisa: (
    <>
      <path d="M8.6 3.5 4 5.6 2.6 9.8l3 1.3V20.5h12.8V11.1l3-1.3L20 5.6l-4.6-2.1c-.4 1.7-1.8 2.9-3.4 2.9s-3-1.2-3.4-2.9z" />
      <path d="M9.5 13h5" />
    </>
  ),
  // prancheta com a programação de jogos
  prancheta: (
    <>
      <rect x="5" y="4.5" width="14" height="17" rx="2" />
      <path d="M9 4.5V3.6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.9" />
      <path d="M8.6 10h6.8M8.6 13.5h6.8M8.6 17h4" />
    </>
  ),
  // balança: o mesmo peso para os dois lados da rede
  balanca: (
    <>
      <path d="M12 3.5v17M8 20.5h8M4.5 7h15" />
      <path d="m4.5 7-2.2 6M4.5 7l2.2 6M2.3 13a2.2 2.2 0 0 0 4.4 0z" />
      <path d="m19.5 7-2.2 6M19.5 7l2.2 6M17.3 13a2.2 2.2 0 0 0 4.4 0z" />
    </>
  ),
};

export function Icone({ nome, className = "" }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {desenhos[nome]}
    </svg>
  );
}
