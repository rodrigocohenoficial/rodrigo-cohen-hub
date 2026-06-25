import Link from "next/link";
import PilarCard from "@/components/PilarCard";
import Newsletter from "@/components/Newsletter";
import ImageWithFallback from "@/components/ImageWithFallback";
import { PILARES } from "@/lib/pilares";
import { AUTHOR } from "@/lib/author";

const PORTAS = [
  {
    numero: "01",
    titulo: "Tô começando agora",
    descricao:
      "Você quer organizar o dinheiro e dar o primeiro passo sem se enrolar. Começa do zero, no seu ritmo.",
    href: "/primeiro-passo",
  },
  {
    numero: "02",
    titulo: "Eu opero day trade",
    descricao:
      "WIN, WDO, risco e automação. O que funciona de verdade e o que só promete. Direto ao ponto.",
    href: "/day-trade",
  },
  {
    numero: "03",
    titulo: "Invisto no longo prazo",
    descricao:
      "Ações, fundos imobiliários, renda fixa e dividendos. Construir patrimônio sem ansiedade.",
    href: "/investir",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="py-[78px] pb-16 border-b border-line">
        <div className="max-w-[1180px] mx-auto px-7">
          <h1 className="font-serif font-semibold text-evergreen text-[clamp(34px,5.4vw,62px)] leading-[1.04] tracking-[-0.015em] max-w-[16ch]">
            O mercado não paga quem fica mais tempo na tela. Paga quem{" "}
            <em className="italic text-brass">entende</em> o que faz.
          </h1>
          <p className="mt-6 text-[clamp(17px,2vw,20px)] text-muted max-w-[48ch]">
            Day trade, automação, investimento de verdade e cabeça no lugar —
            sem economês e sem promessa fácil. Comece pelo seu momento.
          </p>
          <div className="mt-[34px] flex gap-3.5 flex-wrap items-center">
            <Link
              href="/primeiro-passo"
              className="bg-evergreen text-paper font-semibold text-[15px] px-[26px] py-3.5 rounded-lg border-none transition-colors hover:bg-evergreen-700 inline-flex gap-2 items-center"
            >
              Comece por aqui &rarr;
            </Link>
            <Link
              href="/sobre"
              className="bg-transparent text-evergreen font-semibold text-[15px] px-[26px] py-3.5 rounded-lg border border-line transition-colors hover:border-brass hover:bg-paper inline-flex gap-2 items-center"
            >
              Conheça o Rodrigo
            </Link>
          </div>
        </div>
      </section>

      {/* PORTAS */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="flex items-end justify-between mb-[34px] gap-5 flex-wrap">
            <div>
              <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
                Comece por aqui
              </span>
              <h2 className="font-serif font-semibold text-[clamp(24px,3vw,34px)] text-evergreen tracking-[-0.01em] mt-2">
                Qual é o seu momento?
              </h2>
            </div>
            <p className="text-muted text-[15px] max-w-[40ch]">
              Três portas de entrada. Escolha a sua e siga uma trilha pronta.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            {PORTAS.map((porta) => (
              <Link
                key={porta.numero}
                href={porta.href}
                className="bg-paper border border-line rounded-[14px] py-7 px-[26px] transition-all duration-250 relative overflow-hidden hover:-translate-y-1 hover:border-brass-soft hover:shadow-[0_14px_36px_-22px_rgba(18,46,36,0.45)]"
              >
                <span className="font-serif text-[15px] text-brass font-semibold">
                  {porta.numero}
                </span>
                <h3 className="font-serif text-[21px] text-evergreen font-semibold mt-3.5 mb-2">
                  {porta.titulo}
                </h3>
                <p className="text-[14.5px] text-muted">{porta.descricao}</p>
                <span className="mt-[18px] text-[13.5px] font-semibold text-evergreen inline-flex gap-1.5 items-center">
                  Ver a trilha &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="pt-[18px] pb-16">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="flex items-end justify-between mb-[34px] gap-5 flex-wrap">
            <div>
              <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
                Os 6 pilares
              </span>
              <h2 className="font-serif font-semibold text-[clamp(24px,3vw,34px)] text-evergreen tracking-[-0.01em] mt-2">
                Tudo que a gente cobre aqui
              </h2>
            </div>
            <p className="text-muted text-[15px] max-w-[40ch]">
              Cada pilar é um guia que cresce todo dia. Escolha por onde se
              aprofundar.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILARES.map((pilar) => (
              <PilarCard key={pilar.slug} pilar={pilar} />
            ))}
          </div>
        </div>
      </section>

      {/* AUTORIDADE */}
      <section className="bg-paper border-t border-b border-line py-16">
        <div className="max-w-[1180px] mx-auto px-7 flex items-center gap-[46px] flex-wrap">
          <ImageWithFallback
            src="/img/rodrigo-cohen.jpg"
            alt="Rodrigo Cohen"
            width={148}
            height={148}
            className="w-[148px] h-[148px] rounded-full flex-shrink-0 object-cover border-[3px] border-brass"
          />
          <div className="flex-1 min-w-[280px]">
            <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
              Quem está por trás
            </span>
            <h2 className="font-serif text-[clamp(22px,2.6vw,30px)] text-evergreen font-semibold mt-2.5 mb-2.5">
              17 anos de mercado. Nenhum atalho vendido.
            </h2>
            <p className="text-muted max-w-[52ch] text-[15.5px]">
              {AUTHOR.description} Aqui ele escreve do jeito que fala: reto,
              humano e sem firula.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-5">
              {AUTHOR.credentials.map((c) => (
                <span
                  key={c}
                  className="text-[12.5px] font-semibold text-evergreen bg-bone-2 border border-line py-[7px] px-[13px] rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-7">
          <Newsletter variante="faixa" />
        </div>
      </section>
    </>
  );
}
