import { AUTHOR } from "./author";
import { SITE_URL } from "./site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rodrigo Cohen",
    url: SITE_URL,
    logo: `${SITE_URL}/img/logo.png`,
    description:
      "Hub de autoridade de Rodrigo Cohen: trader profissional, engenheiro e analista CNPI, embaixador da B3 e do Santander.",
    founder: authorSchema(),
    sameAs: AUTHOR.sameAs,
  };
}

export function authorSchema() {
  return {
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.description,
    url: `${SITE_URL}${AUTHOR.url}`,
    sameAs: AUTHOR.sameAs,
    knowsAbout: [
      "Day Trade",
      "Mercado Financeiro",
      "Automação de Trading",
      "Análise Técnica",
      "Investimentos",
      "Renda Fixa",
      "Fundos Imobiliários",
      "Criptomoedas",
    ],
  };
}

export function articleSchema(article: {
  title: string;
  resumoMeta: string;
  respostaRapida: string;
  atualizadoEm: string;
  imagem?: string;
  slug: string;
  pilar: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.resumoMeta,
    abstract: article.respostaRapida,
    dateModified: `${article.atualizadoEm}T09:00:00-03:00`,
    datePublished: `${article.atualizadoEm}T09:00:00-03:00`,
    image: article.imagem
      ? `${SITE_URL}${article.imagem}`
      : undefined,
    url: `${SITE_URL}/${article.pilar}/${article.slug}`,
    author: authorSchema(),
    publisher: {
      "@type": "Organization",
      name: "Rodrigo Cohen",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${article.pilar}/${article.slug}`,
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function howToSchema(tool: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tool.name,
    description: tool.description,
    step: tool.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
