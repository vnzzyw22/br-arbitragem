import type { StaticImageData } from "next/image";
import equipeQuadra from "@/assets/fotos/equipe-quadra.jpg";
import equipeCortaVento from "@/assets/fotos/equipe-corta-vento.webp";
import arbitroChuva from "@/assets/fotos/arbitro-chuva.jpg";
import arenaSun7 from "@/assets/fotos/arena-sun7.jpg";
import trioNoite from "@/assets/fotos/trio-noite.webp";
import arbitroApito from "@/assets/fotos/arbitro-apito.webp";
import equipeBranca from "@/assets/fotos/equipe-branca.webp";
import equipeTrio from "@/assets/fotos/equipe-trio.jpg";

export const INSTAGRAM_URL = "https://www.instagram.com/brarbitragem.ftv/";
export const INSTAGRAM_HANDLE = "@brarbitragem.ftv";

export const HERO = {
  titulo: ["A excelência", "da arbitragem", "dentro de", "cada jogo."],
  texto:
    "Equipe de arbitragem para campeonatos, torneios e circuitos de futevôlei.",
};

export const EQUIPE = {
  titulo: "Quem está na linha em cada partida.",
  texto:
    "A BR Arbitragem Futevôlei é uma equipe de arbitragem dedicada ao futevôlei, presente em campeonatos, torneios e circuitos.",
  principios: [
    "Imparcialidade",
    "Compromisso com as regras",
    "Respeito a atletas e organizadores",
  ],
  fotoGrande: {
    src: equipeQuadra,
    alt: "Seis integrantes da equipe BR Arbitragem lado a lado na areia, de uniforme preto e amarelo.",
  },
  fotoPequena: {
    src: equipeCortaVento,
    alt: "Quatro árbitros da BR Arbitragem de corta-vento preto com o selo BR, em quadra à noite.",
  },
};

export const QUALIDADE = {
  titulo: "Compromissos em cada partida.",
  foto: {
    src: arbitroChuva,
    alt: "Árbitro da BR Arbitragem com o apito na boca, atrás da rede, durante uma partida sob chuva.",
  },
  itens: [
    {
      titulo: "Condução responsável",
      texto: "O jogo sob controle do primeiro ao último ponto, com decisões tomadas em quadra.",
    },
    {
      titulo: "Regras aplicadas com consistência",
      texto: "O mesmo critério para todas as duplas, em todas as partidas do campeonato.",
    },
    {
      titulo: "Postura profissional",
      texto: "Uniforme, presença e conduta de quem representa o seu evento.",
    },
    {
      titulo: "Organização operacional",
      texto: "Alinhamento com a organização para que a rotina de jogos aconteça como planejada.",
    },
    {
      titulo: "Integridade esportiva",
      texto: "A decisão é sobre o lance, nunca sobre quem está jogando.",
    },
  ],
};

export type Midia =
  | { tipo: "foto"; src: StaticImageData; alt: string; posicao?: string }
  | { tipo: "video"; src: string; poster: string; alt: string };

export type Evento = {
  id: string;
  nome: string;
  descricao: string;
  midia: Midia | null;
  fonte?: { rotulo: string; href: string };
};

// Só entram eventos com registro verificado (foto, vídeo ou publicação do próprio evento).
// Selva Cup, AD's Cup e Rio Open: sem registro encontrado — aguardam confirmação do cliente.
export const EVENTOS: Evento[] = [
  {
    id: "arena-sun7",
    nome: "Arena Sun7",
    descricao: "A equipe em quadra, diante da rede da Arena Sun7.",
    midia: {
      tipo: "foto",
      src: arenaSun7,
      alt: "Quatro árbitros posam em frente à rede da Arena Sun7, segurando uma camisa preta da BR Arbitragem.",
      posicao: "50% 40%",
    },
  },
  {
    id: "queiroz-cup",
    nome: "Queiróz Cup",
    descricao: "Fotos e vídeo do evento.",
    midia: {
      tipo: "video",
      src: "/video/queiroz-cup.mp4",
      poster: "/video/queiroz-cup-poster.webp",
      alt: "Cenas de partidas de futevôlei no Queiróz Cup, com vista aérea da arena.",
    },
  },
  {
    id: "torneio-do-bosque",
    nome: "Torneio do Bosque",
    descricao: "Equipe com o uniforme do torneio.",
    midia: {
      tipo: "foto",
      src: trioNoite,
      alt: "Três árbitros da BR Arbitragem com camisas amarelas do Torneio do Bosque, à noite, com a bola nas mãos.",
      posicao: "50% 30%",
    },
  },
  {
    id: "amsterdam-cup",
    nome: "Amsterdam Cup",
    descricao: "Arbitragem confirmada em publicação do próprio torneio.",
    midia: null,
    fonte: {
      rotulo: "Ver o Instagram do torneio",
      href: "https://www.instagram.com/amsterdamcup.ftv/",
    },
  },
];

export const BASTIDORES = [
  {
    src: arbitroApito,
    alt: "Árbitro de boné e apito na boca, em pé ao lado do poste da rede.",
  },
  {
    src: equipeBranca,
    alt: "Cinco árbitros enfileirados na areia, de camisa branca com o selo BR e apito no pescoço.",
  },
  {
    src: equipeTrio,
    alt: "Três integrantes da equipe de uniforme preto e amarelo diante de um muro verde, com a bola de futevôlei no chão.",
  },
];

export const FAQ = [
  {
    p: "Como contratar a equipe de arbitragem?",
    r: "Preencha o formulário desta página com os dados do seu evento. A conversa segue pelo WhatsApp, onde os detalhes da contratação são combinados diretamente com a equipe.",
  },
  {
    p: "Quais tipos de campeonatos são atendidos?",
    r: "A BR Arbitragem atua em campeonatos, torneios e circuitos de futevôlei. Descreva o formato do seu evento no formulário para a equipe avaliar o atendimento.",
  },
  {
    p: "Quais cidades e regiões são atendidas?",
    r: "Informe a cidade e o estado do evento no formulário. A possibilidade de atendimento em cada local é confirmada diretamente com a equipe.",
  },
  {
    p: "Como consultar disponibilidade para uma data?",
    r: "Preencha a data prevista no formulário. O campo é opcional, e a disponibilidade é confirmada pela equipe no WhatsApp.",
  },
  {
    p: "Como solicitar um orçamento?",
    r: "Informe nome, WhatsApp, tipo de evento e cidade. Ao enviar, abrimos o WhatsApp com a mensagem pronta, e basta tocar em enviar para falar com a equipe.",
  },
];

export const TIPOS_EVENTO = [
  "Campeonato",
  "Torneio",
  "Etapa de circuito",
  "Evento em arena ou clube",
  "Outro",
];

export const PATROCINADOR = {
  nome: "DRG Consultoria",
  href: "https://www.instagram.com/drgconsultoria/",
};

// Sem logos nem perfis confirmados: apenas os nomes, sem links.
export const APOIADORES = [
  "Sandhit Sportwear",
  "Evolud Distribuidora",
  "Redução Saúde",
  "Auttotag",
];
