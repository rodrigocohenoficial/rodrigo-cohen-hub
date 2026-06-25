interface TocProps {
  headings: { id: string; text: string }[];
}

export default function Toc({ headings }: TocProps) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav className="bg-bone-2 border border-line rounded-xl py-5 px-6 mb-9">
      <span className="block text-[12px] tracking-[0.16em] uppercase font-semibold text-brass mb-3">
        Neste artigo
      </span>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className="block py-[5px] text-[14.5px] text-ink border-b border-dashed border-transparent hover:text-brass hover:border-brass-soft transition-colors"
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
