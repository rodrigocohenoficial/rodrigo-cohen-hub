import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { FERRAMENTAS } from "@/lib/ferramentas";

export const metadata: Metadata = {
  title: "Calculadoras e Ferramentas Financeiras",
  description:
    "Calculadoras gratuitas para trader e investidor: position sizing, juros compostos, Monte Carlo, payoff, custo de operação e mais.",
};

export default function FerramentasPage() {
  const trader = FERRAMENTAS.filter((f) => f.categoria === "trader");
  const longoP = FERRAMENTAS.filter((f) => f.categoria === "longo-prazo");

  return (
    <div className="max-w-[1180px] mx-auto px-7 py-12">
      <Breadcrumb
        items={[
          { name: "Início", href: "/" },
          { name: "Ferramentas", href: "/ferramentas" },
        ]}
      />

      <h1 className="font-serif font-semibold text-evergreen text-[clamp(30px,4.4vw,46px)] leading-[1.08] tracking-[-0.015em] mb-3">
        Calculadoras e Ferramentas
      </h1>
      <p className="text-muted text-[17px] max-w-[52ch] mb-10">
        Todas client-side, gratuitas e sem cadastro. Use antes de operar ou investir.
      </p>

      {/* Trader */}
      <section className="mb-12">
        <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
          Para traders
        </span>
        <h2 className="font-serif text-[24px] text-evergreen font-semibold mt-2 mb-5">
          O fosso do trader
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trader.map((f) => (
            <Link
              key={f.slug}
              href={`/ferramentas/${f.slug}`}
              className="bg-paper border border-line rounded-xl p-6 transition-all hover:-translate-y-[3px] hover:border-brass-soft"
            >
              <h3 className="font-serif text-[18px] text-evergreen font-semibold">
                {f.nome}
              </h3>
              <p className="text-[14px] text-muted mt-2">{f.descricao}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Longo Prazo */}
      <section>
        <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
          Longo prazo
        </span>
        <h2 className="font-serif text-[24px] text-evergreen font-semibold mt-2 mb-5">
          Construir patrimônio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {longoP.map((f) => (
            <Link
              key={f.slug}
              href={`/ferramentas/${f.slug}`}
              className="bg-paper border border-line rounded-xl p-6 transition-all hover:-translate-y-[3px] hover:border-brass-soft"
            >
              <h3 className="font-serif text-[18px] text-evergreen font-semibold">
                {f.nome}
              </h3>
              <p className="text-[14px] text-muted mt-2">{f.descricao}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
