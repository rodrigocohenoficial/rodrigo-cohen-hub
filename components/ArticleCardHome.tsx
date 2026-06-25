"use client";

import Link from "next/link";
import { useState } from "react";

interface ArticleCardHomeProps {
  pilar: string;
  pilarNome: string;
  slug: string;
  title: string;
  resumoMeta?: string;
  imagem?: string;
  size?: "grande" | "normal";
}

function ImagePlaceholder({ pilarNome }: { pilarNome: string }) {
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-bone-2 text-muted text-[13px] font-semibold tracking-[0.1em] uppercase select-none">
      {pilarNome}
    </span>
  );
}

export default function ArticleCardHome({
  pilar,
  pilarNome,
  slug,
  title,
  resumoMeta,
  imagem,
  size = "normal",
}: ArticleCardHomeProps) {
  const [imgError, setImgError] = useState(false);
  const src = imagem || `/${pilar}/${slug}/opengraph-image`;
  const isGrande = size === "grande";

  return (
    <Link
      href={`/${pilar}/${slug}`}
      className={`group block bg-paper border border-line rounded-[14px] overflow-hidden transition-all duration-200 hover:-translate-y-[3px] hover:border-brass-soft hover:shadow-[0_14px_36px_-22px_rgba(18,46,36,0.25)]`}
    >
      {/* Image area */}
      <div
        className={`relative w-full overflow-hidden bg-bone-2 ${
          isGrande ? "aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        {imgError ? (
          <ImagePlaceholder pilarNome={pilarNome} />
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
      <div className={isGrande ? "p-6" : "p-5"}>
        <span className="text-[11px] tracking-[0.12em] uppercase text-brass font-semibold">
          {pilarNome}
        </span>
        <h3
          className={`font-serif font-semibold text-evergreen leading-tight mt-2 ${
            isGrande ? "text-[22px]" : "text-[17px]"
          }`}
        >
          {title}
        </h3>
        {resumoMeta && (
          <p className="text-[14px] text-muted mt-2 line-clamp-2">
            {resumoMeta}
          </p>
        )}
      </div>
    </Link>
  );
}
