import Link from "next/link";

interface ArticleCardProps {
  pilar: string;
  pilarNome: string;
  slug: string;
  title: string;
}

export default function ArticleCard({
  pilar,
  pilarNome,
  slug,
  title,
}: ArticleCardProps) {
  return (
    <Link
      href={`/${pilar}/${slug}`}
      className="block bg-paper border border-line rounded-xl p-5 transition-all duration-200 hover:-translate-y-[3px] hover:border-brass-soft"
    >
      <span className="text-[11px] tracking-[0.12em] uppercase text-brass font-semibold">
        {pilarNome}
      </span>
      <h4 className="font-serif text-[17px] text-evergreen font-semibold mt-2 leading-tight">
        {title}
      </h4>
    </Link>
  );
}
