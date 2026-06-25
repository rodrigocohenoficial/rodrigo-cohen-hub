import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { authorSchema } from "@/lib/schema";
import { AUTHOR } from "@/lib/author";

const ROBOS_COHEN_URL = "https://robosb3.tradernation.com.br";
const TORO_URL =
  "https://mkt.toroinvestimentos.com.br/influencer/rodrigo-cohen";
const AMAZON_BOOK_URL =
  "https://www.amazon.com.br/vida-n%C3%A3o-tem-simulador-ensinar/dp/658848514X";
const QG_WHATSAPP_URL =
  "https://chat.whatsapp.com/Flt7YVYtMrY0JgXF6C1rA3?mode=gi_t";

export const metadata: Metadata = {
  title: "Sobre Rodrigo Cohen — Trader, CNPI, Embaixador B3 e Santander",
  description: AUTHOR.description,
};

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...authorSchema(),
          }),
        }}
      />

      <div className="pagina-sobre">
        {/* NAV */}
        <header className="nav-shell" aria-label="Navegação principal">
          <Link
            className="brand-mark"
            href="/"
            aria-label="Rodrigo Cohen — voltar ao hub"
          >
            <span>RC</span>
            <strong>Rodrigo Cohen</strong>
          </Link>
          <nav className="nav-links" aria-label="Links principais">
            <a href="#robos">Robôs Cohen</a>
            <a href="#toro">Toro</a>
            <a href="#qg">QG</a>
          </nav>
        </header>

        {/* HERO */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Rodrigo Cohen</p>
            <h1 id="hero-title">
              Em 26 anos no mercado, aprendi que o problema nunca é o gráfico. É
              quem está olhando pra ele.
            </h1>
            <div className="hero-bio" aria-label="Bio institucional">
              <p>
                Sou Rodrigo Cohen. Engenheiro, Analista CNPI-T, embaixador
                oficial da B3 e do Santander. Pioneiro em automação de trading
                no Brasil desde 2012. Fundador da Trader Nation, com 61 mil
                alunos.
              </p>
              <p>
                Milhares de robôs operando simultaneamente na minha base.
              </p>
            </div>
            <div className="hero-actions" aria-label="Ações principais">
              <a className="btn btn-primary" href="#qg">
                Entrar no meu QG
              </a>
              <a
                className="btn btn-secondary"
                href={ROBOS_COHEN_URL}
                target="_blank"
                rel="noreferrer"
              >
                Conhecer os Robôs Cohen
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure
            className="hero-portrait"
            aria-label="Foto profissional de Rodrigo Cohen"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/rodrigo-hero.jpg"
              alt="Rodrigo Cohen em retrato profissional"
            />
          </figure>
        </section>

        {/* CREDENCIAIS */}
        <section
          className="credential-strip"
          aria-label="Credenciais institucionais"
        >
          <span>26 anos de mercado</span>
          <span>61 mil alunos</span>
          <span>Analista CNPI-T EM-1409</span>
          <span>Embaixador B3 e Santander</span>
          <span>Eleito mais influente em 2020 (Anbima)</span>
          <span>Pioneiro em automação no Brasil</span>
        </section>

        {/* ROBÔS COHEN */}
        <section
          className="content-section split-section"
          id="robos"
          aria-labelledby="robos-title"
        >
          <div>
            <p className="eyebrow">Robôs Cohen</p>
            <h2 id="robos-title">
              O sistema que opera enquanto você vive.
            </h2>
          </div>
          <div className="section-body">
            <p>
              Carteira automatizada operando WIN, WDO, BTC e Ouro. Onboarding
              individual. Suporte humano. Sistema que eu uso na minha conta há 13
              anos.
            </p>
            <a
              className="btn btn-primary"
              href={ROBOS_COHEN_URL}
              target="_blank"
              rel="noreferrer"
            >
              Conhecer os Robôs Cohen
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* TORO */}
        <section
          className="content-section quiet-section"
          id="toro"
          aria-labelledby="toro-title"
        >
          <div className="quiet-card">
            <p className="eyebrow">Toro/Santander</p>
            <h2 id="toro-title">
              Pra operar com estrutura, escolhi a Toro.
            </h2>
            <p>
              Depois de 26 anos no mercado, sei que corretora importa. Custo,
              execução, plataforma e segurança definem se você opera com vantagem
              ou desvantagem. Indico a Toro/Santander — corretagem zero, Profit
              Pro grátis, segurança institucional.
            </p>
            <a
              className="text-link"
              href={TORO_URL}
              target="_blank"
              rel="noreferrer"
            >
              Abrir conta na Toro pelo meu link oficial
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* LIVRO */}
        <section
          className="content-section book-section"
          aria-labelledby="book-title"
        >
          <figure className="book-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/livro-capa.jpg"
              alt="Capa do livro A vida não tem simulador, de Rodrigo Cohen"
            />
          </figure>
          <div className="book-copy">
            <p className="eyebrow">Livro</p>
            <h2 id="book-title">
              A vida não tem simulador. O trade também não.
            </h2>
            <p>
              Meu livro não é sobre apertar botão e ficar rico. É sobre as
              decisões que moldam um homem — risco, família, fé, perdas,
              recomeços e responsabilidade. O mercado ensina. Mas cobra caro de
              quem não presta atenção.
            </p>
            <a
              className="text-link"
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noreferrer"
            >
              Comprar o livro na Amazon
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* QG */}
        <section
          className="content-section qg-section"
          id="qg"
          aria-labelledby="qg-title"
        >
          <div className="qg-copy">
            <p className="eyebrow">QG no WhatsApp</p>
            <h2 id="qg-title">Entra pro meu QG no WhatsApp.</h2>
            <p>
              Receba avisos quando eu tiver algo importante pra falar sobre
              mercado, oportunidades e bastidores. Sem agenda fixa. Quando eu
              mandar, é porque vale.
            </p>
          </div>
          <div
            className="qg-entry-card"
            aria-label="Entrada oficial no QG pelo WhatsApp"
          >
            <p>
              O acesso acontece direto pelo grupo oficial no WhatsApp. Sem
              formulário parado. Sem dado perdido.
            </p>
            <a
              className="btn btn-primary"
              href={QG_WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Entrar no QG no WhatsApp
              <ArrowUpRight aria-hidden="true" />
            </a>
            <small>
              Ao tocar no botão, o WhatsApp abre em nova aba para você solicitar
              a entrada no grupo.
            </small>
          </div>
        </section>

        {/* FOOTER INTERNO */}
        <footer
          className="sobre-footer"
          aria-label="Rodapé institucional Rodrigo Cohen"
        >
          <Link
            className="brand-mark footer-brand"
            href="/"
            aria-label="Rodrigo Cohen — voltar ao hub"
          >
            <span>RC</span>
            <strong>Rodrigo Cohen</strong>
          </Link>
          <div className="footer-copy">
            <p>Analista CNPI-T EM-1409</p>
            <small>
              Conteúdo educacional e institucional. Operações no mercado
              financeiro envolvem risco e resultados passados não garantem
              resultados futuros.
            </small>
          </div>
        </footer>

        {/* FLOATING WHATSAPP */}
        <a
          className="floating-whatsapp"
          href={QG_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Entrar no QG do Rodrigo Cohen pelo WhatsApp"
        >
          <MessageCircle aria-hidden="true" />
          <span>QG</span>
        </a>
      </div>
    </>
  );
}
