import { APOIADORES, INSTAGRAM_HANDLE, INSTAGRAM_URL, PATROCINADOR } from "@/content/site";
import { WHATSAPP_NUMERO } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { Bola } from "./Ornamentos";

export function Rodape() {
  return (
    <footer className="bg-preto pb-28 pt-20 lg:pb-10 lg:pt-28">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4">
            <Logo size={88} />
            <p className="display mt-6 text-[1.9rem]">BR Arbitragem Futevôlei</p>
            <ul className="mt-6 space-y-1 text-lg">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 hover:text-ouro"
                >
                  Instagram {INSTAGRAM_HANDLE}
                </a>
              </li>
              {WHATSAPP_NUMERO && (
                <li>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMERO}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-4 hover:text-ouro"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-base text-prata">Patrocínio</p>
            <a
              href={PATROCINADOR.href}
              target="_blank"
              rel="noopener noreferrer"
              className="display mt-1 inline-block py-2 text-[2.2rem] transition-colors hover:text-ouro lg:text-[2.7rem]"
            >
              {PATROCINADOR.nome}
            </a>
          </div>

          <div className="lg:col-span-4">
            <p className="text-base text-prata">Apoio</p>
            <ul className="mt-3 space-y-2 text-xl font-medium">
              {APOIADORES.map((nome) => (
                <li key={nome}>{nome}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between gap-6 border-t border-white/15 pt-6 text-sm text-prata">
          <p>© 2026 BR Arbitragem Futevôlei.</p>
          <Bola className="quica h-9 w-9" />
        </div>
      </div>
    </footer>
  );
}
