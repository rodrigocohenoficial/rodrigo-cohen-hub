import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import AuthorBox from "@/components/AuthorBox";
import Newsletter from "@/components/Newsletter";
import { FERRAMENTAS, getFerramentaBySlug } from "@/lib/ferramentas";

// Dynamic imports for client components (calculadoras)
const calculadoraMap: Record<
  string,
  React.ComponentType
> = {
  "position-sizing": dynamic(
    () => import("@/components/calculadoras/PositionSizing")
  ),
  "payoff-expectativa": dynamic(
    () => import("@/components/calculadoras/PayoffExpectativa")
  ),
  "monte-carlo": dynamic(
    () => import("@/components/calculadoras/MonteCarlo")
  ),
  "custo-operacao": dynamic(
    () => import("@/components/calculadoras/CustoOperacao")
  ),
  "juros-compostos": dynamic(
    () => import("@/components/calculadoras/JurosCompostos")
  ),
  "primeiro-milhao": dynamic(
    () => import("@/components/calculadoras/PrimeiroMilhao")
  ),
  "viver-de-renda": dynamic(
    () => import("@/components/calculadoras/ViverDeRenda")
  ),
  "reserva-de-emergencia": dynamic(
    () => import("@/components/calculadoras/ReservaEmergencia")
  ),
};

interface PageProps {
  params: Promise<{ tool: string }>;
}

export function generateStaticParams() {
  return FERRAMENTAS.map((f) => ({ tool: f.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tool } = await params;
  const ferramenta = getFerramentaBySlug(tool);
  if (!ferramenta) return {};

  return {
    title: `${ferramenta.nome} — Calculadora Gratuita`,
    description: ferramenta.descricao,
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { tool } = await params;
  const ferramenta = getFerramentaBySlug(tool);
  if (!ferramenta) notFound();

  const Calculadora = calculadoraMap[tool];
  if (!Calculadora) notFound();

  const paragrafos = ferramenta.textoExplicativo.split("\n\n");

  return (
    <div className="max-w-[720px] mx-auto px-7 py-12">
      <Breadcrumb
        items={[
          { name: "Início", href: "/" },
          { name: "Ferramentas", href: "/ferramentas" },
          { name: ferramenta.nome, href: `/ferramentas/${tool}` },
        ]}
      />

      <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
        {ferramenta.categoria === "trader" ? "Trader" : "Longo prazo"}
      </span>
      <h1 className="font-serif font-semibold text-evergreen text-[clamp(28px,4vw,40px)] leading-[1.08] tracking-[-0.015em] mt-3 mb-6">
        {ferramenta.nome}
      </h1>
      <p className="text-muted text-[17px] mb-8">{ferramenta.descricao}</p>

      {/* Calculadora */}
      <Calculadora />

      {/* Texto explicativo */}
      <div className="art-body mt-10">
        <h2>Como funciona</h2>
        {paragrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* FAQ */}
      <FAQ items={ferramenta.faq} />

      {/* AuthorBox */}
      <AuthorBox />

      {/* Newsletter */}
      <Newsletter variante="rodape" />
    </div>
  );
}
