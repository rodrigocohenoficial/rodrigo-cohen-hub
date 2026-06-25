import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { organizationSchema } from "@/lib/schema";
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
  metadataBase: new URL(SITE_URL),
};

const PILARES_NAV = [
  { slug: "day-trade", label: "Day Trade" },
  { slug: "investir", label: "Investir" },
  { slug: "primeiro-passo", label: "Primeiro Passo" },
  { slug: "mente", label: "Mente" },
  { slug: "macro-cripto-ia", label: "Macro & Cripto" },
  { slug: "vida", label: "Vida" },
];

const organizationJsonLd = organizationSchema();

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
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4" aria-label="Links parceiros">
              <a href="https://robosb3.tradernation.com.br" target="_blank" rel="noreferrer" className="hover:text-evergreen transition-colors">Robôs Cohen</a>
              <a href="https://mkt.toroinvestimentos.com.br/influencer/rodrigo-cohen" target="_blank" rel="noreferrer" className="hover:text-evergreen transition-colors">Toro/Santander</a>
              <a href="https://www.amazon.com.br/vida-n%C3%A3o-tem-simulador-ensinar/dp/658848514X" target="_blank" rel="noreferrer" className="hover:text-evergreen transition-colors">Livro</a>
              <a href="https://chat.whatsapp.com/Flt7YVYtMrY0JgXF6C1rA3?mode=gi_t" target="_blank" rel="noreferrer" className="hover:text-evergreen transition-colors">QG WhatsApp</a>
            </nav>
            &copy; {new Date().getFullYear()} Rodrigo Cohen &middot; Menos tela.
            Mais vida.
          </div>
        </footer>
      </body>
    </html>
  );
}
