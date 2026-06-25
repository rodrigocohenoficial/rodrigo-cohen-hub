"use client";

import Link from "next/link";
import { useState } from "react";

interface ArticleCardProps {
  pilar: string;
  pilarNome: string;
  slug: string;
  title: string;
  imagem?: string;
}

export default function ArticleCard({
  pilar,
  pilarNome,
  slug,
  title,
  imagem,
}: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const src = imagem || `/${pilar}/${slug}/opengraph-image`;

  return (
    <Link
      href={`/${pilar}/${slug}`}
      className="group block bg-paper border border-line rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-[3px] hover:border-brass-soft hover:shadow-[0_14px_36px_-22px_rgba(18,46,36,0.25)]"
    >
      {/* Image area */}
      <div className="relative w-full overflow-hidden bg-bone-2 aspect-[16/10]">
        {imgError ? (
          <span className="absolute inset-0 flex items-center justify-center bg-bone-2 text-muted text-[13px] font-semibold tracking-[0.1em] uppercase select-none">
            {pilarNome}
          </span>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Text */}
      <div className="p-5">
        <span className="text-[11px] tracking-[0.12em] uppercase text-brass font-semibold">
          {pilarNome}
        </span>
        <h4 className="font-serif text-[17px] text-evergreen font-semibold mt-2 leading-tight">
          {title}
        </h4>
      </div>
    </Link>
  );
}
