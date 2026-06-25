import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import RespostaRapida from "./RespostaRapida";
import Toc from "./Toc";
import FAQ from "./FAQ";
import AuthorBox from "./AuthorBox";
import ArticleCard from "./ArticleCard";
import Newsletter from "./Newsletter";
import ImageWithFallback from "./ImageWithFallback";
import { getPilarBySlug } from "@/lib/pilares";
import { articleSchema, authorSchema } from "@/lib/schema";
import type { ArticleFrontmatter } from "@/lib/content";

interface ArticleLayoutProps {
  frontmatter: ArticleFrontmatter;
  readingTime: number;
  headings: { id: string; text: string }[];
  children: React.ReactNode;
  relacionados?: {
    pilar: string;
    pilarNome: string;
    slug: string;
    title: string;
  }[];
}

export default function ArticleLayout({
  frontmatter,
  readingTime,
  headings,
  children,
  relacionados,
}: ArticleLayoutProps) {
  const pilar = getPilarBySlug(frontmatter.pilar);
  const pilarNome = pilar?.nome ?? frontmatter.pilar;

  const dataFormatada = new Date(
    frontmatter.atualizadoEm + "T00:00:00"
  ).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema(frontmatter)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...authorSchema(),
          }),
        }}
      />

      <div className="pt-[46px]">
        <div className="max-w-[720px] mx-auto px-7">
          {/* 1. Breadcrumb */}
          <Breadcrumb
            items={[
              { name: "Início", href: "/" },
              { name: pilarNome, href: `/${frontmatter.pilar}` },
              {
                name: frontmatter.title,
                href: `/${frontmatter.pilar}/${frontmatter.slug}`,
              },
            ]}
          />

          {/* 2. Capa OG */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${frontmatter.pilar}/${frontmatter.slug}/opengraph-image`}
            alt={frontmatter.title}
            className="w-full rounded-xl mb-7 border border-line"
            style={{ aspectRatio: "1200/630" }}
          />

          {/* 3. Eyebrow */}
          <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
            {pilarNome}
          </span>

          {/* 4. H1 */}
          <h1 className="font-serif font-semibold text-evergreen text-[clamp(30px,4.4vw,46px)] leading-[1.08] tracking-[-0.015em] mt-3.5">
            {frontmatter.title}
          </h1>

          {/* 4. Resposta Rápida */}
          <RespostaRapida texto={frontmatter.respostaRapida} />

          {/* 5. Meta */}
          <div className="flex gap-[18px] flex-wrap items-center mt-[22px] mb-[30px] pb-6 border-b border-line text-[13.5px] text-muted">
            <Link
              href="/sobre"
              className="flex items-center gap-[9px] font-semibold text-ink"
            >
              <ImageWithFallback
                src="/img/rodrigo-cohen.jpg"
                alt="Rodrigo Cohen"
                width={30}
                height={30}
                className="w-[30px] h-[30px] rounded-full object-cover border border-brass"
              />
              Rodrigo Cohen
            </Link>
            <span>&middot; Analista CNPI</span>
            <span>&middot; {readingTime} min de leitura</span>
            <span>&middot; Atualizado em {dataFormatada}</span>
          </div>

          {/* 6. Toc */}
          <Toc headings={headings} />

          {/* 7. Corpo MDX */}
          <div className="art-body">{children}</div>

          {/* 8+9. FAQ */}
          {frontmatter.faq && frontmatter.faq.length > 0 && (
            <FAQ items={frontmatter.faq} />
          )}

          {/* 10. AuthorBox */}
          <AuthorBox />

          {/* 11. Relacionados */}
          {relacionados && relacionados.length > 0 && (
            <div className="mt-9 mb-2.5">
              <span className="block text-[12px] tracking-[0.16em] uppercase font-semibold text-brass mb-4">
                Leia depois
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {relacionados.map((r) => (
                  <ArticleCard key={r.slug} {...r} />
                ))}
              </div>
            </div>
          )}

          {/* 12. Newsletter */}
          <Newsletter variante="rodape" />
        </div>
      </div>
    </>
  );
}
