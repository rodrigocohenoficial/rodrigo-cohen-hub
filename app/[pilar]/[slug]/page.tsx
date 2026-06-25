import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import ArticleLayout from "@/components/ArticleLayout";
import DefinitionBox from "@/components/DefinitionBox";
import {
  getArticleBySlug,
  getAllSlugs,
  getArticlesByPilar,
} from "@/lib/content";
import { getPilarBySlug, PILARES } from "@/lib/pilares";

interface PageProps {
  params: Promise<{ pilar: string; slug: string }>;
}

const mdxComponents = {
  DefinitionBox,
};

function extractHeadings(content: string): { id: string; text: string }[] {
  const regex = /^## (.+)$/gm;
  const headings: { id: string; text: string }[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, text });
  }
  return headings;
}

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { pilar, slug } = await params;
  const article = getArticleBySlug(pilar, slug);
  if (!article) return {};

  return {
    title: article.frontmatter.metaTitle || article.frontmatter.title,
    description: article.frontmatter.resumoMeta,
    openGraph: {
      title: article.frontmatter.metaTitle || article.frontmatter.title,
      description: article.frontmatter.resumoMeta,
      type: "article",
      images: article.frontmatter.imagem
        ? [{ url: article.frontmatter.imagem }]
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { pilar, slug } = await params;

  // Validate pilar exists
  if (!PILARES.some((p) => p.slug === pilar)) {
    notFound();
  }

  const article = getArticleBySlug(pilar, slug);
  if (!article) notFound();

  const headings = extractHeadings(article.content);

  // Build relacionados from frontmatter
  const allInPilar = getArticlesByPilar(pilar);
  const relacionados = (article.frontmatter.relacionados || [])
    .map((relSlug) => {
      const found = allInPilar.find((a) => a.slug === relSlug);
      if (found) {
        const p = getPilarBySlug(found.pilar);
        return {
          pilar: found.pilar,
          pilarNome: p?.nome ?? found.pilar,
          slug: found.slug,
          title: found.title,
        };
      }
      // If not found in same pilar, return a placeholder
      return null;
    })
    .filter(Boolean) as {
    pilar: string;
    pilarNome: string;
    slug: string;
    title: string;
  }[];

  return (
    <ArticleLayout
      frontmatter={article.frontmatter}
      readingTime={article.readingTime}
      headings={headings}
      relacionados={relacionados}
    >
      <MDXRemote source={article.content} components={mdxComponents} />
    </ArticleLayout>
  );
}
