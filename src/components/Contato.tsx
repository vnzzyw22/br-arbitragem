"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, TIPOS_EVENTO } from "@/content/site";
import {
  WHATSAPP_NUMERO,
  linkWhatsApp,
  mascaraTelefone,
  montarMensagem,
  validar,
  type Campos,
  type Erros,
} from "@/lib/whatsapp";
import { motion, useReducedMotion } from "framer-motion";
import { Linha, Titulo } from "./Motion";
import { Apito } from "./Ornamentos";

const vazio: Campos = { nome: "", whatsapp: "", tipo: "", cidade: "", data: "", info: "" };

// Passos tirados do próprio fluxo do formulário e das respostas do FAQ (nada além do que o site faz).
const PASSOS = [
  { titulo: "Preencha os dados do evento", texto: "Nome, WhatsApp, tipo de evento e cidade. Data e detalhes são opcionais." },
  { titulo: "O WhatsApp abre com a mensagem pronta", texto: "Você confere o texto antes de mandar." },
  { titulo: "Toque em enviar na conversa", texto: "Os detalhes são combinados diretamente com a equipe." },
];

// Campos em caixa (mais claros no celular que só a linha inferior): borda fina, foco em azul de
// ação (o contorno global de foco continua), borda vermelha quando inválido.
const campo =
  "mt-2 block w-full rounded-xl border border-tinta/20 bg-white px-4 py-3 text-lg text-tinta placeholder:text-tinta/65 " +
  "transition-colors hover:border-tinta/40 focus:border-azul-acao aria-[invalid=true]:border-erro";
const rotulo = "block text-base font-medium text-tinta";

// Opção do tipo de evento em botão (um toque no celular, em vez da lista suspensa). O rádio real
// fica por baixo: setas do teclado, leitor de tela e validação continuam os do navegador.
const opcao =
  "relative inline-flex min-h-12 cursor-pointer select-none items-center rounded-full border px-5 text-base font-medium transition-colors " +
  "border-tinta/25 bg-areia/60 text-tinta hover:border-tinta " +
  "has-[:checked]:border-tinta has-[:checked]:bg-tinta has-[:checked]:text-areia " +
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azul-acao";

function Mensagem({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="mt-2 text-[0.95rem] font-medium text-erro">
      {texto}
    </p>
  );
}

// O apito dá um apitaço ao entrar na tela e depois balança pendurado pela argola.
function ApitoApitando() {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      className="hidden shrink-0 lg:block"
      whileInView={reduzir ? undefined : { rotate: [0, -7, 6, -5, 3, 0] }}
      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
      transition={{ duration: 0.9, ease: "easeInOut", delay: 0.3 }}
    >
      <Apito className="apito-balanco w-[21rem]" />
    </motion.div>
  );
}

export function Contato() {
  const [c, setC] = useState<Campos>(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [aberto, setAberto] = useState<string | null>(null);
  const configurado = WHATSAPP_NUMERO.length > 0;

  const mudar = (k: keyof Campos) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const valor = k === "whatsapp" ? mascaraTelefone(e.target.value) : e.target.value;
    setC((atual) => ({ ...atual, [k]: valor }));
    if (k in erros) setErros((atual) => ({ ...atual, [k]: undefined }));
    setAberto(null);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!configurado) return;
    const encontrados = validar(c);
    setErros(encontrados);
    const primeiro = (["nome", "whatsapp", "tipo", "cidade"] as const).find((k) => encontrados[k]);
    if (primeiro) {
      document.getElementById(`campo-${primeiro}`)?.focus();
      return;
    }
    const url = linkWhatsApp(montarMensagem(c));
    window.open(url, "_blank", "noopener,noreferrer");
    setAberto(url);
  };

  return (
    <section id="contato" className="claro textura-areia fundo-contato relative overflow-hidden pb-24 pt-14 lg:pb-32 lg:pt-20">
      <div className="wrap relative">
        <Linha cor="bg-azul" />
        <div className="mt-12 lg:mt-16 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <Titulo className="display max-w-[20ch] text-[clamp(2rem,8.6vw,3.3rem)] lg:text-[clamp(2.6rem,4.6vw,5rem)]">
            Vamos conversar sobre seu próximo campeonato?
          </Titulo>
          <ApitoApitando />
        </div>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-5">
            <p className="max-w-[34ch] text-xl leading-snug">
              Conte um pouco sobre seu evento e entre em contato com a BR Arbitragem para solicitar uma proposta.
            </p>
            {/* Como funciona: é uma sequência real (formulário → WhatsApp → conversa), por isso numerada. */}
            <ol className="mt-8 space-y-4">
              {PASSOS.map((p, i) => (
                <li key={p.titulo} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tinta text-[0.95rem] font-semibold text-areia"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="subtitulo block text-[1.1rem]">{p.titulo}</span>
                    <span className="mt-0.5 block text-tinta/75">{p.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-base">
              Prefere o Instagram?{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-3 inline-block py-3 font-medium underline decoration-2 underline-offset-4"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </p>
          </div>

          <form onSubmit={enviar} noValidate className="cartao grid gap-x-6 gap-y-7 bg-white p-5 sm:grid-cols-2 sm:p-8 lg:col-span-7">
            <div>
              <label htmlFor="campo-nome" className={rotulo}>
                Nome do organizador
              </label>
              <input
                id="campo-nome"
                name="nome"
                type="text"
                autoComplete="name"
                required
                value={c.nome}
                onChange={mudar("nome")}
                aria-invalid={Boolean(erros.nome)}
                aria-describedby={erros.nome ? "erro-nome" : undefined}
                className={campo}
              />
              <Mensagem id="erro-nome" texto={erros.nome} />
            </div>

            <div>
              <label htmlFor="campo-whatsapp" className={rotulo}>
                Seu WhatsApp
              </label>
              <input
                id="campo-whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(00) 00000-0000"
                required
                value={c.whatsapp}
                onChange={mudar("whatsapp")}
                aria-invalid={Boolean(erros.whatsapp)}
                aria-describedby={erros.whatsapp ? "erro-whatsapp" : undefined}
                className={campo}
              />
              <Mensagem id="erro-whatsapp" texto={erros.whatsapp} />
            </div>

            <fieldset className="sm:col-span-2">
              <legend id="rotulo-tipo" className={rotulo}>
                Tipo de evento
              </legend>
              <div
                role="radiogroup"
                aria-labelledby="rotulo-tipo"
                aria-invalid={Boolean(erros.tipo)}
                aria-describedby={erros.tipo ? "erro-tipo" : undefined}
                className="mt-4 flex flex-wrap gap-2.5"
              >
                {TIPOS_EVENTO.map((t, i) => (
                  <label key={t} className={`${opcao} ${erros.tipo ? "!border-erro/70" : ""}`}>
                    <input
                      id={i === 0 ? "campo-tipo" : undefined}
                      type="radio"
                      name="tipo"
                      value={t}
                      required
                      checked={c.tipo === t}
                      onChange={mudar("tipo")}
                      className="sr-only"
                    />
                    {t}
                  </label>
                ))}
              </div>
              <Mensagem id="erro-tipo" texto={erros.tipo} />
            </fieldset>

            <div>
              <label htmlFor="campo-cidade" className={rotulo}>
                Cidade e estado
              </label>
              <input
                id="campo-cidade"
                name="cidade"
                type="text"
                autoComplete="address-level2"
                placeholder="Ex.: Curitiba, PR"
                required
                value={c.cidade}
                onChange={mudar("cidade")}
                aria-invalid={Boolean(erros.cidade)}
                aria-describedby={erros.cidade ? "erro-cidade" : undefined}
                className={campo}
              />
              <Mensagem id="erro-cidade" texto={erros.cidade} />
            </div>

            <div>
              <label htmlFor="campo-data" className={rotulo}>
                Data prevista <span className="font-normal text-tinta/70">(opcional)</span>
              </label>
              <input id="campo-data" name="data" type="date" value={c.data} onChange={mudar("data")} className={campo} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="campo-info" className={rotulo}>
                Informações adicionais <span className="font-normal text-tinta/70">(opcional)</span>
              </label>
              <textarea
                id="campo-info"
                name="info"
                rows={3}
                maxLength={500}
                placeholder="Formato do evento, número de quadras, categorias..."
                value={c.info}
                onChange={mudar("info")}
                className={`${campo} resize-y`}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={!configurado}
                className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-azul-acao px-10 text-lg font-semibold text-white transition-colors hover:bg-tinta active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-tinta/40 sm:w-auto"
              >
                Enviar pelo WhatsApp
              </button>

              {!configurado && (
                <p role="status" className="mt-4 max-w-[52ch] text-base font-medium">
                  O número de WhatsApp da equipe ainda não foi configurado neste site. Enquanto isso, chame pelo Instagram{" "}
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="-my-3 inline-block py-3 underline decoration-2 underline-offset-4">
                    {INSTAGRAM_HANDLE}
                  </a>
                  .
                </p>
              )}

              <div aria-live="polite">
                {aberto && (
                  <p className="mt-4 max-w-[52ch] text-base font-medium">
                    Abrimos o WhatsApp com a sua mensagem. Para concluir, toque em enviar na conversa. Se ele não abriu,{" "}
                    <a href={aberto} target="_blank" rel="noopener noreferrer" className="-my-3 inline-block py-3 underline decoration-2 underline-offset-4">
                      abra o WhatsApp por aqui
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
