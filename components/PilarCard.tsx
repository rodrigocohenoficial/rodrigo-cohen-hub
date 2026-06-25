import Link from "next/link";
import type { Pilar } from "@/lib/pilares";

interface PilarCardProps {
  pilar: Pilar;
}

export default function PilarCard({ pilar }: PilarCardProps) {
  const isFosso = pilar.slug === "vida";

  return (
    <Link
      href={`/${pilar.slug}`}
      className={`flex flex-col justify-between rounded-[14px] p-[26px] min-h-[158px] transition-transform duration-250 hover:-translate-y-1 ${
        isFosso
          ? "bg-[linear-gradient(150deg,#1B4234,#0E251D)] text-bone"
          : "bg-evergreen text-bone"
      }`}
    >
      <span
        className={`text-[12px] tracking-[0.14em] uppercase font-semibold ${
          isFosso ? "text-[#E4C98C]" : "text-brass-soft"
        }`}
      >
        {pilar.numero} &middot; {pilar.categoria}
      </span>
      <div className="mt-auto">
        <h3 className="font-serif text-[23px] font-semibold leading-[1.1]">
          {pilar.nome}
        </h3>
        <p className="text-[13px] text-[#C5D1C9] mt-2">{pilar.descricao}</p>
      </div>
    </Link>
  );
}
