import { ImageResponse } from "next/og";
import { getArticleBySlug, getAllSlugs } from "@/lib/content";
import { getPilarBySlug } from "@/lib/pilares";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRASS = "#B0843B";

const frauncesFontPromise = fetch(
  "https://fonts.googleapis.com/css2?family=Fraunces:wght@600&display=swap"
)
  .then((res) => res.text())
  .then((css) => {
    const match = css.match(/src: url\((.+?)\)/);
    if (!match) throw new Error("Font URL not found");
    return fetch(match[1]).then((res) => res.arrayBuffer());
  });

export function generateStaticParams() {
  return getAllSlugs();
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ pilar: string; slug: string }>;
}) {
  const { pilar, slug } = await params;
  const article = getArticleBySlug(pilar, slug);
  const pilarData = getPilarBySlug(pilar);

  const title = article?.frontmatter.title ?? slug;
  const pilarNome = pilarData?.nome ?? pilar;
  const bg = pilarData?.ogBg ?? "#122E24";
  const text = pilarData?.ogText ?? "#F2EDE2";
  const footerColor =
    bg === "#F2EDE2" || bg === "#FBF8F1"
      ? "rgba(28, 27, 23, 0.4)"
      : "rgba(242, 237, 226, 0.4)";

  let fraunces: ArrayBuffer | undefined;
  try {
    fraunces = await frauncesFontPromise;
  } catch {
    // Fallback to system serif if font fetch fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: bg,
          padding: 0,
        }}
      >
        {/* Brass filete */}
        <div
          style={{
            width: "100%",
            height: 5,
            background: BRASS,
            flexShrink: 0,
          }}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            gap: 0,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: BRASS,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {pilarNome}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 60 ? 44 : title.length > 40 ? 52 : 58,
              fontFamily: fraunces ? "Fraunces" : "Georgia",
              fontWeight: 600,
              color: text,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "90%",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 72px 36px",
            fontSize: 16,
            fontWeight: 600,
            color: footerColor,
            letterSpacing: "0.06em",
          }}
        >
          <span>rodrigocohen.com.br</span>
          <span>Menos tela. Mais vida.</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fraunces
        ? [
            {
              name: "Fraunces",
              data: fraunces,
              style: "normal" as const,
              weight: 600 as const,
            },
          ]
        : [],
    }
  );
}
