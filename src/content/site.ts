import { QUADRA_MIDIA } from "@/lib/midia";
// Substituir fotos: trocar o arquivo na pasta indicada mantendo o nome (ver MIDIA.md).
import equipeTime from "@/assets/equipe/time-sandhit.webp";
import arbitroSorrindo from "@/assets/equipe/arbitro-sorrindo.jpg";
import arbitroApito from "@/assets/equipe/arbitro-apito.jpg";

export const INSTAGRAM_URL = "https://www.instagram.com/brarbitragem.ftv/";
export const INSTAGRAM_HANDLE = "@brarbitragem.ftv";

export const HERO = {
  titulo: ["A excelência", "da arbitragem", "dentro de", "cada jogo."],
  texto: "Equipe de arbitragem para campeonatos, torneios e circuitos de futevôlei.",
};

// Só no celular, logo abaixo da hero. Textos descritivos do que aparece nos vídeos:
// sem nome de evento (procedência não confirmada para exibir) — ver HANDOFF.
export const EM_QUADRA = {
  titulo: "Em quadra",
  texto: "Dia de jogo, visto da areia e do alto.",
  videos: [
    { ...QUADRA_MIDIA.jogada, alt: "Jogador de futevôlei em ação na areia" },
    { ...QUADRA_MIDIA.arena, alt: "Vista aérea de uma arena de futevôlei com jogo em andamento" },
  ],
};

export const EQUIPE = {
  titulo: "Quem está na linha em cada partida.",
  texto:
    "A BR Arbitragem Futevôlei é uma equipe de arbitragem dedicada ao futevôlei, presente em campeonatos, torneios e circuitos.",
  principios: ["Imparcialidade", "Compromisso com as regras", "Respeito a atletas e organizadores"],
  fotoGrande: {
    src: equipeTime,
    alt: "Cinco integrantes da equipe de braços cruzados na areia, de uniforme preto, diante de uma tenda da Sandhit.",
  },
  fotoPequena: {
    src: arbitroSorrindo,
    alt: "Árbitro da BR Arbitragem sorrindo, de camisa branca com o selo BR e o apito na boca.",
  },
};

export const QUALIDADE = {
  titulo: "Compromissos em cada partida.",
  foto: {
    src: arbitroApito,
    alt: "Árbitro de camisa branca com o apito na boca e o rádio na cintura, em pé na areia ao lado da cadeira de arbitragem.",
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

export type Evento = { id: string; nome: string };

// Para incluir um evento confirmado pelo cliente: acrescentar uma linha aqui (não precisa de foto).
// A confirmar com o cliente: SPFC Futevôlei e Desafio ao Galo (vieram dos materiais enviados).
// Fora até confirmação (sem registro encontrado): Selva Cup, AD's Cup e Rio Open.
export const EVENTOS: Evento[] = [
  { id: "arena-sun7", nome: "Arena Sun7" },
  { id: "queiroz-cup", nome: "Queiróz Cup" },
  { id: "torneio-do-bosque", nome: "Torneio do Bosque" },
  { id: "spfc-futevolei", nome: "SPFC Futevôlei" },
  { id: "desafio-ao-galo", nome: "Desafio ao Galo" },
  { id: "amsterdam-cup", nome: "Amsterdam Cup" },
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

export const TIPOS_EVENTO = ["Campeonato", "Torneio", "Etapa de circuito", "Evento em arena ou clube", "Outro"];

export const PATROCINADOR = {
  nome: "DRG Consultoria",
  href: "https://www.instagram.com/drgconsultoria/",
};

// Sem logos nem perfis confirmados: apenas os nomes, sem links.
export const APOIADORES = ["Sandhit Sportwear", "Evolud Distribuidora", "Redução Saúde", "Auttotag"];
