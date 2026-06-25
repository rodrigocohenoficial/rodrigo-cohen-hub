import type { Metadata } from "next";
import Link from "next/link";
import { AUTHOR } from "@/lib/author";
import { authorSchema } from "@/lib/schema";
import { PILARES } from "@/lib/pilares";
import Breadcrumb from "@/components/Breadcrumb";
import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata: Metadata = {
  title: "Sobre Rodrigo Cohen — Trader, CNPI, Embaixador B3 e Santander",
  description: AUTHOR.description,
};

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...authorSchema(),
          }),
        }}
      />

      <div className="max-w-[720px] mx-auto px-7 py-12">
        <Breadcrumb
          items={[
            { name: "Início", href: "/" },
            { name: "Sobre", href: "/sobre" },
          ]}
        />

        {/* Header */}
        <div className="flex items-center gap-6 mb-10 flex-wrap">
          <ImageWithFallback
            src="/img/rodrigo-cohen.jpg"
            alt="Rodrigo Cohen"
            width={120}
            height={120}
            className="w-[120px] h-[120px] rounded-full flex-shrink-0 object-cover border-[3px] border-brass"
          />
          <div>
            <h1 className="font-serif font-semibold text-evergreen text-[clamp(28px,4vw,40px)] leading-[1.1]">
              {AUTHOR.name}
            </h1>
            <p className="text-muted text-[16px] mt-1">{AUTHOR.jobTitle}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="art-body">
          <p>
            {AUTHOR.description} Aqui ele escreve do jeito que fala: reto,
            humano e sem firula.
          </p>
          <p>
            O mercado financeiro foi sua escola desde cedo. Engenheiro de
            formação, entendeu que a lógica do mercado era parecida com a
            lógica de sistemas: regras claras, gestão de risco e disciplina
            vencem no longo prazo.
          </p>
          <p>
            Em 2012, quando quase ninguém falava disso no Brasil, começou a
            automatizar estratégias de trading. Hoje é referência em automação
            para o mercado de varejo.
          </p>
          <p>
            Como embaixador da B3 e do Santander, trabalha para que o mercado
            financeiro seja mais transparente e acessível. Corretagem zero sem
            RLP, plataforma profissional gratuita e suporte de verdade — é
            isso que ele defende e pratica.
          </p>
        </div>

        {/* Credenciais */}
        <div className="mt-10 mb-10">
          <h2 className="font-serif text-[24px] text-evergreen font-semibold mb-4">
            Credenciais
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {AUTHOR.credentials.map((c) => (
              <span
                key={c}
                className="text-[13px] font-semibold text-evergreen bg-bone-2 border border-line py-2 px-4 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Pilares */}
        <div className="mt-10">
          <h2 className="font-serif text-[24px] text-evergreen font-semibold mb-4">
            O que você encontra aqui
          </h2>
          <div className="space-y-3">
            {PILARES.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="block bg-paper border border-line rounded-xl p-5 transition-all hover:-translate-y-[2px] hover:border-brass-soft"
              >
                <span className="text-[11px] tracking-[0.12em] uppercase text-brass font-semibold">
                  {p.numero} &middot; {p.categoria}
                </span>
                <h3 className="font-serif text-[18px] text-evergreen font-semibold mt-1">
                  {p.nome}
                </h3>
                <p className="text-[14px] text-muted mt-1">{p.descricao}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
