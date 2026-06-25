import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleCard from "@/components/ArticleCard";
import { PILARES, getPilarBySlug } from "@/lib/pilares";
import { getArticlesByPilar } from "@/lib/content";

interface PageProps {
  params: Promise<{ pilar: string }>;
}

export function generateStaticParams() {
  return PILARES.map((p) => ({ pilar: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { pilar: pilarSlug } = await params;
  const pilar = getPilarBySlug(pilarSlug);
  if (!pilar) return {};

  return {
    title: `${pilar.nome} — Rodrigo Cohen`,
    description: `Guia completo sobre ${pilar.nome.toLowerCase()}: ${pilar.descricao}`,
  };
}

export default async function PilarPage({ params }: PageProps) {
  const { pilar: pilarSlug } = await params;
  const pilar = getPilarBySlug(pilarSlug);
  if (!pilar) notFound();

  const artigos = getArticlesByPilar(pilarSlug);

  return (
    <div className="max-w-[1180px] mx-auto px-7 py-12">
      <Breadcrumb
        items={[
          { name: "Início", href: "/" },
          { name: pilar.nome, href: `/${pilar.slug}` },
        ]}
      />

      <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
        {pilar.numero} &middot; {pilar.categoria}
      </span>
      <h1 className="font-serif font-semibold text-evergreen text-[clamp(30px,4.4vw,46px)] leading-[1.08] tracking-[-0.015em] mt-3 mb-2">
        {pilar.nome}
      </h1>
      <p className="text-muted text-[17px] max-w-[52ch] mb-10">
        {pilar.descricao}
      </p>

      {artigos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artigos.map((a) => (
            <ArticleCard
              key={a.slug}
              pilar={a.pilar}
              pilarNome={pilar.nome}
              slug={a.slug}
              title={a.title}
              imagem={a.imagem}
            />
          ))}
        </div>
      ) : (
        <div className="bg-paper border border-line rounded-xl p-8 text-center">
          <p className="text-muted text-[15px]">
            Os artigos deste pilar estão sendo preparados. Volte em breve.
          </p>
        </div>
      )}
    </div>
  );
}
