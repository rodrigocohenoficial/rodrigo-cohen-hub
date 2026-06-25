interface RespostaRapidaProps {
  texto: string;
}

export default function RespostaRapida({ texto }: RespostaRapidaProps) {
  return (
    <div className="relative bg-paper border border-line border-l-4 border-l-brass rounded-r-xl py-6 px-7 pl-7 mt-[30px] mb-2">
      <span className="absolute -top-[11px] left-6 bg-brass text-[#1A1206] text-[10.5px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full">
        Resposta rápida
      </span>
      <p className="font-serif text-[19px] leading-[1.5] text-evergreen">
        {texto}
      </p>
    </div>
  );
}
