"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  initials?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = "",
  initials = "RC",
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span
        aria-label={alt}
        role="img"
        className={`inline-flex items-center justify-center bg-evergreen text-bone font-serif font-semibold select-none ${className}`}
        style={{ width, height, fontSize: Math.round(width * 0.36) }}
      >
        {initials}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}
