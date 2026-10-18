import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
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
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
