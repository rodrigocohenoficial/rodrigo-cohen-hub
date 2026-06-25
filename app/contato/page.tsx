import type { Metadata } from "next";
import { MessageCircle, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com Rodrigo Cohen: redes sociais, comunidade QG WhatsApp, WhatsApp comercial e e-mail para parcerias.",
};

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}

const REDES = [
  {
    nome: "Instagram",
    descricao: "Bastidores, análises rápidas e dia a dia de trader.",
    href: "https://instagram.com/rodrigocohenoficial",
    icon: InstagramIcon,
  },
  {
    nome: "YouTube",
    descricao: "Lives, aulas e análises completas do mercado.",
    href: "https://www.youtube.com/@RodrigoCohenOficial",
    icon: YoutubeIcon,
  },
  {
    nome: "QG no WhatsApp",
    descricao: "Comunidade gratuita com alertas, ideias e troca entre traders.",
    href: "https://chat.whatsapp.com/Flt7YVYtMrY0JgXF6C1rA3?mode=gi_t",
    icon: MessageCircle,
  },
];

const COMERCIAL = [
  {
    nome: "WhatsApp comercial",
    descricao: "Parcerias, mídia, eventos e propostas comerciais.",
    href: "https://wa.me/5521996730588",
    icon: Phone,
  },
  {
    nome: "E-mail comercial",
    descricao: "cohen@rodrigocohen.com.br",
    href: "mailto:cohen@rodrigocohen.com.br",
    icon: Mail,
  },
];

export default function ContatoPage() {
  return (
    <div className="max-w-[720px] mx-auto px-7 py-14">
      <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
        Contato
      </span>
      <h1 className="font-serif font-semibold text-evergreen text-[clamp(30px,4.4vw,46px)] leading-[1.08] tracking-[-0.015em] mt-3 mb-4">
        Quer falar comigo ou com o time?
      </h1>
      <p className="text-[17px] text-muted max-w-[50ch] mb-12">
        Os caminhos estão aqui. Escolhe o canal que faz mais sentido pra você.
      </p>

      {/* Redes e comunidade */}
      <section className="mb-12">
        <h2 className="font-serif font-semibold text-evergreen text-[22px] mb-5">
          Acompanhe nas redes
        </h2>
        <div className="space-y-3">
          {REDES.map((canal) => (
            <a
              key={canal.nome}
              href={canal.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-paper border border-line rounded-xl p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-brass-soft hover:shadow-[0_8px_24px_-12px_rgba(18,46,36,0.15)]"
            >
              <div className="w-11 h-11 rounded-full bg-evergreen text-paper grid place-items-center flex-shrink-0">
                <canal.icon size={20} aria-hidden="true" />
              </div>
              <div>
                <span className="block font-semibold text-ink text-[15px]">
                  {canal.nome}
                </span>
                <span className="block text-[13.5px] text-muted mt-0.5">
                  {canal.descricao}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Comercial */}
      <section>
        <h2 className="font-serif font-semibold text-evergreen text-[22px] mb-5">
          Parcerias e negócios
        </h2>
        <div className="space-y-3">
          {COMERCIAL.map((canal) => (
            <a
              key={canal.nome}
              href={canal.href}
              target={canal.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={canal.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="flex items-center gap-5 bg-paper border border-line rounded-xl p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-brass-soft hover:shadow-[0_8px_24px_-12px_rgba(18,46,36,0.15)]"
            >
              <div className="w-11 h-11 rounded-full bg-brass text-paper grid place-items-center flex-shrink-0">
                <canal.icon size={20} aria-hidden="true" />
              </div>
              <div>
                <span className="block font-semibold text-ink text-[15px]">
                  {canal.nome}
                </span>
                <span className="block text-[13.5px] text-muted mt-0.5">
                  {canal.descricao}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
