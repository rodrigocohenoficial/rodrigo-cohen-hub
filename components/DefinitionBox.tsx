interface DefinitionBoxProps {
  termo: string;
  children: React.ReactNode;
}

export default function DefinitionBox({ termo, children }: DefinitionBoxProps) {
  return (
    <div className="bg-paper border border-line rounded-xl py-[22px] px-6 my-[26px]">
      <span className="block text-[12px] tracking-[0.16em] uppercase font-semibold text-brass mb-2">
        Definição
      </span>
      <div className="text-[15.5px] leading-relaxed">
        <strong className="text-evergreen font-bold">{termo}:</strong>{" "}
        {children}
      </div>
    </div>
  );
}
