import type { Metadata } from "next";
import Image from "next/image";
import FormItera from "./FormItera";

export const metadata: Metadata = {
  title: "Abra sua conta na ITERA",
  description: "Deixe seu nome e WhatsApp e abra sua conta no site da ITERA.",
  robots: { index: false, follow: false },
};

export default function IteraPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="flex items-center gap-3 mb-7">
          <Image
            src="/img/rodrigo-cohen.jpg"
            alt="Rodrigo Cohen"
            width={52}
            height={52}
            className="w-[52px] h-[52px] rounded-full object-cover object-top border-2 border-brass"
            priority
          />
          <div className="leading-tight">
            <span className="block font-serif font-semibold text-[18px] text-evergreen">
              Rodrigo Cohen
            </span>
            <span className="block text-[13px] text-muted">
              Analista CNPI · 26 anos de mercado
            </span>
          </div>
        </div>

        <div className="bg-paper border border-line rounded-[20px] p-7 sm:p-8 shadow-[0_18px_40px_-28px_rgba(18,46,36,0.45)]">
          <FormItera />
        </div>
      </div>
    </main>
  );
}
