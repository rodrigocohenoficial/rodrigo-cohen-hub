import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  pilar: string;
  respostaRapida: string;
  resumoMeta: string;
  metaTitle: string;
  atualizadoEm: string;
  imagem?: string;
  imagemAlt?: string;
  unsplashFotografo?: string;
  unsplashFotografoUrl?: string;
  tags: string[];
  faq: { q: string; a: string }[];
  relacionados: string[];
  destaque?: boolean;
  destaqueHome?: boolean;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: number;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getArticleBySlug(
  pilar: string,
  slug: string
): Article | null {
  const filePath = path.join(CONTENT_DIR, pilar, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as ArticleFrontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

export function getArticlesByPilar(pilar: string): ArticleFrontmatter[] {
  const dir = path.join(CONTENT_DIR, pilar);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      return data as ArticleFrontmatter;
    })
    .sort(
      (a, b) =>
        new Date(b.atualizadoEm).getTime() -
        new Date(a.atualizadoEm).getTime()
    );
}

export function getAllArticles(): ArticleFrontmatter[] {
  const pilares = fs.readdirSync(CONTENT_DIR).filter((f) => {
    const stat = fs.statSync(path.join(CONTENT_DIR, f));
    return stat.isDirectory();
  });

  return pilares.flatMap((pilar) => getArticlesByPilar(pilar));
}

export function getAllArticlesSorted(): ArticleFrontmatter[] {
  return getAllArticles().sort(
    (a, b) =>
      new Date(b.atualizadoEm).getTime() -
      new Date(a.atualizadoEm).getTime()
  );
}

export function getAllSlugs(): { pilar: string; slug: string }[] {
  const pilares = fs.readdirSync(CONTENT_DIR).filter((f) => {
    const stat = fs.statSync(path.join(CONTENT_DIR, f));
    return stat.isDirectory();
  });

  return pilares.flatMap((pilar) => {
    const dir = path.join(CONTENT_DIR, pilar);
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({
        pilar,
        slug: f.replace(/\.mdx$/, ""),
      }));
  });
}
