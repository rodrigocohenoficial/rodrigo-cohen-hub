import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rodrigo Cohen — Trader, Analista CNPI, Embaixador B3 e Santander",
    template: "%s | Rodrigo Cohen",
  },
  description:
    "Hub de autoridade de Rodrigo Cohen: trader profissional, engenheiro e analista CNPI. Conteudo sobre investimentos, day trade, automacao e mentalidade.",
  metadataBase: new URL("https://rodrigocohen.com.br"),
};

const PILARES_NAV = [
  { slug: "day-trade", label: "Day Trade" },
  { slug: "investir", label: "Investir" },
  { slug: "primeiro-passo", label: "Primeiro Passo" },
  { slug: "mente", label: "Mente" },
  { slug: "macro-cripto-ia", label: "Macro & Cripto" },
  { slug: "vida", label: "Vida" },
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rodrigo Cohen",
  url: "https://rodrigocohen.com.br",
  logo: "https://rodrigocohen.com.br/img/logo.png",
  description:
    "Hub de autoridade de Rodrigo Cohen: trader profissional, engenheiro e analista CNPI, embaixador da B3 e do Santander.",
  founder: {
    "@type": "Person",
    name: "Rodrigo Cohen",
    jobTitle: "Trader profissional, analista CNPI",
  },
  sameAs: [
    "https://instagram.com/rodrigocohenoficial",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-bone/86 backdrop-blur-[10px] border-b border-line">
          <div className="max-w-[1180px] mx-auto px-7 flex items-center justify-between h-[68px]">
            <Link href="/" className="flex items-baseline gap-2.5">
              <span className="font-serif font-semibold text-[22px] text-evergreen">
                Rodrigo Cohen
              </span>
              <span className="text-[11px] tracking-[0.14em] uppercase text-muted hidden sm:inline">
                Menos tela. Mais vida.
              </span>
            </Link>

            <nav className="hidden lg:flex gap-[26px] text-[14.5px] font-medium text-ink">
              {PILARES_NAV.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="py-1.5 border-b-2 border-transparent transition-colors duration-200 hover:text-evergreen hover:border-brass"
                >
                  {p.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="w-[34px] h-[34px] border border-line rounded-full grid place-items-center text-muted bg-paper">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="py-[46px] border-t border-line text-muted text-[13.5px] text-center">
          <div className="max-w-[1180px] mx-auto px-7">
            &copy; {new Date().getFullYear()} Rodrigo Cohen &middot; Menos tela.
            Mais vida.
          </div>
        </footer>
      </body>
    </html>
  );
}
