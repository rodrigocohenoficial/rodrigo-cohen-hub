import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { PILARES } from "@/lib/pilares";

const SITE_URL = "https://rodrigocohen.com.br";

const FERRAMENTAS = [
  "juros-compostos",
  "primeiro-milhao",
  "viver-de-renda",
  "reserva-de-emergencia",
  "position-sizing",
  "payoff-expectativa",
  "monte-carlo",
  "custo-operacao",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Paginas estaticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/ferramentas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Pilares
  const pilarPages: MetadataRoute.Sitemap = PILARES.map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Artigos
  const artigos = getAllArticles();
  const articlePages: MetadataRoute.Sitemap = artigos.map((a) => ({
    url: `${SITE_URL}/${a.pilar}/${a.slug}`,
    lastModified: a.atualizadoEm,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Ferramentas
  const toolPages: MetadataRoute.Sitemap = FERRAMENTAS.map((tool) => ({
    url: `${SITE_URL}/ferramentas/${tool}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...pilarPages, ...articlePages, ...toolPages];
}
