// Número comercial só vem do ambiente: nunca fica no código.
export const WHATSAPP_NUMERO = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export type Campos = {
  nome: string;
  whatsapp: string;
  tipo: string;
  cidade: string;
  data: string;
  info: string;
};

export type Erros = Partial<Record<"nome" | "whatsapp" | "tipo" | "cidade", string>>;

export function mascaraTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function validar(c: Campos): Erros {
  const erros: Erros = {};
  if (c.nome.trim().length < 2) erros.nome = "Informe o nome do organizador.";
  const tel = c.whatsapp.replace(/\D/g, "");
  if (tel.length < 10 || tel.length > 11) erros.whatsapp = "Informe o WhatsApp com DDD, por exemplo (41) 99999-9999.";
  if (!c.tipo) erros.tipo = "Escolha o tipo de evento.";
  if (c.cidade.trim().length < 3) erros.cidade = "Informe a cidade e o estado, por exemplo Curitiba, PR.";
  return erros;
}

function dataBR(iso: string) {
  const [a, m, d] = iso.split("-");
  return a && m && d ? `${d}/${m}/${a}` : iso;
}

export function montarMensagem(c: Campos) {
  const linhas = [
    "Olá, BR Arbitragem! Gostaria de solicitar um orçamento de arbitragem.",
    "",
    `*Organizador:* ${c.nome.trim()}`,
    `*WhatsApp:* ${c.whatsapp}`,
    `*Tipo de evento:* ${c.tipo}`,
    `*Cidade e estado:* ${c.cidade.trim()}`,
  ];
  if (c.data) linhas.push(`*Data prevista:* ${dataBR(c.data)}`);
  if (c.info.trim()) linhas.push(`*Informações adicionais:* ${c.info.trim()}`);
  return linhas.join("\n");
}

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}
