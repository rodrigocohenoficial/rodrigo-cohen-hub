import Link from "next/link";
import ArticleCardHome from "./ArticleCardHome";
import type { ArticleFrontmatter } from "@/lib/content";

interface PilarRowProps {
  pilarSlug: string;
  pilarNome: string;
  articles: ArticleFrontmatter[];
}

export default function PilarRow({
  pilarSlug,
  pilarNome,
  articles,
}: PilarRowProps) {
  return (
    <section>
      <div className="flex items-end justify-between mb-5 gap-4">
        <h2 className="font-serif font-semibold text-[clamp(22px,2.6vw,28px)] text-evergreen tracking-[-0.01em]">
          {pilarNome}
        </h2>
        <Link
          href={`/${pilarSlug}`}
          className="text-[13.5px] font-semibold text-brass whitespace-nowrap hover:text-evergreen transition-colors"
        >
          Ver pilar &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((a) => (
          <ArticleCardHome
            key={a.slug}
            pilar={a.pilar}
            pilarNome={pilarNome}
            slug={a.slug}
            title={a.title}
            resumoMeta={a.resumoMeta}
            imagem={a.imagem}
          />
        ))}
      </div>
    </section>
  );
}
