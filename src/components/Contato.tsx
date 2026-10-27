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

const campo =
  "block w-full border-0 border-b-2 border-preto bg-transparent px-0 py-3 text-lg text-preto placeholder:text-preto/65";
const rotulo = "block text-base font-semibold text-preto";

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
    <section id="contato" className="on-areia relative overflow-hidden bg-areia py-24 text-preto lg:py-36">
      <div className="wrap relative">
        <Linha cor="bg-preto" />
        <div className="mt-14 lg:mt-20 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <Titulo className="display max-w-[20ch] text-[clamp(2.4rem,10.2vw,3.9rem)] lg:text-[clamp(3rem,5.6vw,6.2rem)]">
            Vamos conversar sobre seu próximo campeonato?
          </Titulo>
          <ApitoApitando />
        </div>

        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4">
            <p className="max-w-[34ch] text-xl leading-snug">
              Conte um pouco sobre seu evento e entre em contato com a BR Arbitragem para solicitar uma proposta.
            </p>
            <p className="mt-8 max-w-[34ch] text-base text-preto/80">
              Ao enviar, o WhatsApp abre com a mensagem pronta. A conversa só começa quando você toca em enviar lá.
            </p>
            <p className="mt-8 text-base">
              Prefere o Instagram?{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-3 inline-block py-3 font-semibold underline decoration-2 underline-offset-4"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </p>
          </div>

          <form onSubmit={enviar} noValidate className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:col-span-8">
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

            <div>
              <label htmlFor="campo-tipo" className={rotulo}>
                Tipo de evento
              </label>
              <select
                id="campo-tipo"
                name="tipo"
                required
                value={c.tipo}
                onChange={mudar("tipo")}
                aria-invalid={Boolean(erros.tipo)}
                aria-describedby={erros.tipo ? "erro-tipo" : undefined}
                className={`${campo} cursor-pointer`}
              >
                <option value="">Selecione</option>
                {TIPOS_EVENTO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <Mensagem id="erro-tipo" texto={erros.tipo} />
            </div>

            <div>
              <label htmlFor="campo-data" className={rotulo}>
                Data prevista <span className="font-normal text-preto/70">(opcional)</span>
              </label>
              <input id="campo-data" name="data" type="date" value={c.data} onChange={mudar("data")} className={campo} />
            </div>

            <div className="sm:col-span-2">
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

            <div className="sm:col-span-2">
              <label htmlFor="campo-info" className={rotulo}>
                Informações adicionais <span className="font-normal text-preto/70">(opcional)</span>
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
                className="inline-flex min-h-16 w-full items-center justify-center bg-preto px-10 text-xl font-bold text-areia transition-colors hover:bg-grafite active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-preto/40 sm:w-auto"
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
