import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import ArticleCardHome from "@/components/ArticleCardHome";
import PilarRow from "@/components/PilarRow";
import { PILARES, getPilarBySlug } from "@/lib/pilares";
import { getAllArticlesSorted, getArticlesByPilar } from "@/lib/content";
import { FERRAMENTAS } from "@/lib/ferramentas";
import { AUTHOR } from "@/lib/author";

const FERRAMENTAS_DESTAQUE_SLUGS = [
  "position-sizing",
  "payoff-expectativa",
  "juros-compostos",
  "viver-de-renda",
];

export default function Home() {
  const allArticles = getAllArticlesSorted();

  // Destaque: primeiro com destaque: true, senão o mais recente
  const destaque =
    allArticles.find((a) => a.destaque) || allArticles[0];

  // Últimos: próximos 4 excluindo o destaque
  const ultimos = allArticles
    .filter((a) => a.slug !== destaque?.slug)
    .slice(0, 4);

  // Mais lidos: com destaqueHome: true, senão 5 mais recentes
  const comDestaqueHome = allArticles.filter((a) => a.destaqueHome);
  const maisLidos =
    comDestaqueHome.length > 0
      ? comDestaqueHome.slice(0, 5)
      : allArticles.slice(0, 5);

  // Ferramentas em destaque
  const ferramentasDestaque = FERRAMENTAS_DESTAQUE_SLUGS.map((slug) =>
    FERRAMENTAS.find((f) => f.slug === slug)
  ).filter(Boolean);

  return (
    <>
      {/* 1 — HERO COMPACTO */}
      <section className="py-14 border-b border-line">
        <div className="max-w-[1180px] mx-auto px-7">
          <h1 className="font-serif font-semibold text-evergreen text-[clamp(30px,4.8vw,52px)] leading-[1.06] tracking-[-0.015em] max-w-[18ch]">
            O mercado não paga quem fica mais tempo na tela. Paga quem{" "}
            <em className="italic text-brass">entende</em> o que faz.
          </h1>
          <p className="mt-5 text-[clamp(16px,1.8vw,19px)] text-muted max-w-[50ch]">
            Day trade, automação, investimento de verdade e cabeça no lugar —
            sem economês e sem promessa fácil.
          </p>
          <div className="mt-7 flex gap-3.5 flex-wrap items-center">
            <Link
              href="/primeiro-passo"
              className="bg-evergreen text-paper font-semibold text-[15px] px-[26px] py-3.5 rounded-lg border-none transition-colors hover:bg-evergreen-700 inline-flex gap-2 items-center"
            >
              Comece por aqui &rarr;
            </Link>
            <Link
              href="/ferramentas"
              className="bg-transparent text-evergreen font-semibold text-[15px] px-[26px] py-3.5 rounded-lg border border-line transition-colors hover:border-brass hover:bg-paper inline-flex gap-2 items-center"
            >
              Ver ferramentas
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — DESTAQUE + ÚLTIMOS */}
      {destaque && (
        <section className="py-14">
          <div className="max-w-[1180px] mx-auto px-7">
            <div className="flex items-end justify-between mb-6 gap-4">
              <div>
                <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
                  Destaque
                </span>
                <h2 className="font-serif font-semibold text-[clamp(22px,2.6vw,28px)] text-evergreen tracking-[-0.01em] mt-1">
                  O que ler agora
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
              {/* Card grande */}
              <ArticleCardHome
                pilar={destaque.pilar}
                pilarNome={
                  getPilarBySlug(destaque.pilar)?.nome ?? destaque.pilar
                }
                slug={destaque.slug}
                title={destaque.title}
                resumoMeta={destaque.resumoMeta}
                imagem={destaque.imagem}
                size="grande"
              />

              {/* Lista lateral */}
              <div className="flex flex-col gap-3">
                {ultimos.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${a.pilar}/${a.slug}`}
                    className="flex gap-4 items-start bg-paper border border-line rounded-xl p-4 transition-all duration-200 hover:-translate-y-[2px] hover:border-brass-soft"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] tracking-[0.12em] uppercase text-brass font-semibold">
                        {getPilarBySlug(a.pilar)?.nome ?? a.pilar}
                      </span>
                      <h4 className="font-serif text-[16px] text-evergreen font-semibold mt-1 leading-tight line-clamp-2">
                        {a.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3 — FERRAMENTAS EM DESTAQUE */}
      <section className="py-14 bg-paper border-t border-b border-line">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
                Calculadoras gratuitas
              </span>
              <h2 className="font-serif font-semibold text-[clamp(22px,2.6vw,28px)] text-evergreen tracking-[-0.01em] mt-1">
                Ferramentas pra decidir melhor
              </h2>
            </div>
            <Link
              href="/ferramentas"
              className="text-[13.5px] font-semibold text-brass whitespace-nowrap hover:text-evergreen transition-colors"
            >
              Ver todas as 8 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ferramentasDestaque.map((f) => (
              <Link
                key={f!.slug}
                href={`/ferramentas/${f!.slug}`}
                className="relative bg-bone border border-line rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-[3px] hover:border-brass-soft hover:shadow-[0_14px_36px_-22px_rgba(18,46,36,0.25)]"
              >
                {f!.categoria === "trader" && (
                  <span className="absolute top-4 right-4 text-[10px] tracking-[0.1em] uppercase font-bold text-evergreen bg-bone-2 border border-line px-2.5 py-1 rounded-full">
                    Trader
                  </span>
                )}
                <h3 className="font-serif text-[17px] text-evergreen font-semibold leading-tight pr-14">
                  {f!.nome}
                </h3>
                <p className="text-[13.5px] text-muted mt-2.5 line-clamp-2">
                  {f!.descricao}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — BLOCOS POR PILAR */}
      <section className="py-14">
        <div className="max-w-[1180px] mx-auto px-7 space-y-14">
          {PILARES.map((pilar) => {
            const articles = getArticlesByPilar(pilar.slug).slice(0, 3);
            if (articles.length === 0) return null;
            return (
              <PilarRow
                key={pilar.slug}
                pilarSlug={pilar.slug}
                pilarNome={pilar.nome}
                articles={articles}
              />
            );
          })}
        </div>
      </section>

      {/* 5 — MAIS LIDOS */}
      <section className="py-14 bg-paper border-t border-b border-line">
        <div className="max-w-[720px] mx-auto px-7">
          <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
            Mais lidos
          </span>
          <h2 className="font-serif font-semibold text-[clamp(22px,2.6vw,28px)] text-evergreen tracking-[-0.01em] mt-1 mb-6">
            Os artigos que todo mundo lê
          </h2>
          <ol className="space-y-0 divide-y divide-line">
            {maisLidos.map((a, i) => (
              <li key={a.slug}>
                <Link
                  href={`/${a.pilar}/${a.slug}`}
                  className="flex items-baseline gap-5 py-4 transition-colors hover:text-brass"
                >
                  <span className="font-serif text-[28px] font-semibold text-line leading-none w-8 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] tracking-[0.12em] uppercase text-brass font-semibold">
                      {getPilarBySlug(a.pilar)?.nome ?? a.pilar}
                    </span>
                    <h4 className="font-serif text-[17px] text-evergreen font-semibold mt-0.5 leading-tight">
                      {a.title}
                    </h4>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — AUTORIDADE */}
      <section className="py-14">
        <div className="max-w-[1180px] mx-auto px-7 text-center">
          <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
            Quem está por trás
          </span>
          <h2 className="font-serif font-semibold text-[clamp(22px,2.6vw,28px)] text-evergreen tracking-[-0.01em] mt-1 mb-5">
            17 anos de mercado. Nenhum atalho vendido.
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5 mb-6">
            {AUTHOR.credentials.map((c) => (
              <span
                key={c}
                className="text-[12.5px] font-semibold text-evergreen bg-bone-2 border border-line py-[7px] px-[13px] rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
          <Link
            href="/sobre"
            className="bg-evergreen text-paper font-semibold text-[15px] px-[26px] py-3.5 rounded-lg border-none transition-colors hover:bg-evergreen-700 inline-flex gap-2 items-center"
          >
            Conheça o Rodrigo &rarr;
          </Link>
        </div>
      </section>

      {/* 7 — NEWSLETTER */}
      <section className="py-14">
        <div className="max-w-[1180px] mx-auto px-7">
          <Newsletter variante="faixa" />
        </div>
      </section>
    </>
  );
}
