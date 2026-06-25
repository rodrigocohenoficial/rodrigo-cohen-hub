import { faqSchema } from "@/lib/schema";

interface FAQProps {
  items: { q: string; a: string }[];
}

export default function FAQ({ items }: FAQProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="my-11">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(items)),
        }}
      />
      <h2 className="font-serif text-[27px] text-evergreen font-semibold mb-[18px]">
        Perguntas frequentes
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-line rounded-xl py-[18px] px-[22px] bg-paper"
          >
            <h4 className="text-[16px] text-evergreen font-semibold mb-1.5">
              {item.q}
            </h4>
            <p className="text-[15px] text-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
