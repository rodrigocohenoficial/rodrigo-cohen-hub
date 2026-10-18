"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const ITERA_URL = "https://iterainvestimentos.com.br/cohen";

function mascararWhatsapp(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Leva os UTMs da visita adiante pra ITERA
function destinoItera(params: URLSearchParams) {
  const destino = new URL(ITERA_URL);
  params.forEach((valor, chave) => {
    if (chave.startsWith("utm_")) destino.searchParams.set(chave, valor);
  });
  return destino.toString();
}

export default function FormItera() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [aceite, setAceite] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [destino, setDestino] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    if (nome.trim().length < 2) {
      setErro("Escreva seu nome.");
      return;
    }
    const digitos = whatsapp.replace(/\D/g, "");
    if (digitos.length < 10) {
      setErro("Confira seu WhatsApp com DDD.");
      return;
    }
    if (!aceite) {
      setErro("Marque a autorização pra continuar.");
      return;
    }

    setEnviando(true);
    const params = new URLSearchParams(window.location.search);
    const empresa = new FormData(e.currentTarget).get("empresa");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          whatsapp: digitos,
          aceite,
          empresa,
          origem: params.get("utm_source") ?? "",
          campanha: params.get("utm_campaign") ?? "",
          conteudo: params.get("utm_content") ?? "",
        }),
        signal: AbortSignal.timeout(6000),
      });
    } catch {
      // Se a planilha falhar, a pessoa segue pra ITERA do mesmo jeito
    }

    setDestino(destinoItera(params));
    setEnviando(false);
    window.scrollTo({ top: 0 });
  }

  if (destino) {
    const primeiroNome = nome.trim().split(/\s+/)[0];
    return (
      <>
        <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
          Passo 2 de 2
        </span>
        <h1 className="font-serif font-semibold text-evergreen text-[clamp(28px,7vw,36px)] leading-[1.08] tracking-[-0.015em] mt-2.5 mb-3">
          Falta pouco, {primeiroNome}.
        </h1>
        <p className="text-[16px] text-muted mb-6">
          Agora você vai pra página da ITERA. Lá, toque no botão abaixo e
          preencha o cadastro pra abrir sua conta.
        </p>

        <div className="rounded-xl bg-[#0B0B0B] py-5 mb-7 flex flex-col items-center gap-2">
          <span className="text-[12px] tracking-[0.12em] uppercase text-[#9A9A9A]">
            Procure este botão
          </span>
          <span className="inline-block bg-[#FBF26A] text-[#111111] font-semibold text-[15px] px-5 py-2.5 rounded-lg">
            Abrir minha conta
          </span>
        </div>

        <a
          href={destino}
          className="w-full bg-evergreen text-bone font-semibold text-[16px] py-4 rounded-lg transition-colors hover:bg-evergreen-700 inline-flex gap-2 items-center justify-center"
        >
          Ir para a ITERA
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </>
    );
  }

  return (
    <>
      <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass">
        Passo 1 de 2
      </span>
      <h1 className="font-serif font-semibold text-evergreen text-[clamp(28px,7vw,36px)] leading-[1.08] tracking-[-0.015em] mt-2.5 mb-3">
        Sua conta na ITERA começa aqui.
      </h1>
      <p className="text-[16px] text-muted mb-7">
        Deixe seu nome e WhatsApp. No próximo passo você abre sua conta no site
        da ITERA.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-[14px] font-medium text-ink mb-1.5"
          >
            Nome
          </label>
          <input
            id="nome"
            type="text"
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome e sobrenome"
            className="w-full py-3.5 px-4 rounded-lg border border-line bg-white text-[16px] text-ink placeholder:text-[#9C978A] focus:border-evergreen focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="whatsapp"
            className="block text-[14px] font-medium text-ink mb-1.5"
          >
            WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={whatsapp}
            onChange={(e) => setWhatsapp(mascararWhatsapp(e.target.value))}
            placeholder="(21) 99999-9999"
            className="w-full py-3.5 px-4 rounded-lg border border-line bg-white text-[16px] text-ink placeholder:text-[#9C978A] focus:border-evergreen focus:outline-none"
          />
        </div>

        {/* Campo invisível contra robôs */}
        <input
          type="text"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <label className="flex gap-3 items-start text-[13.5px] text-muted leading-snug cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={aceite}
            onChange={(e) => {
              setAceite(e.target.checked);
              setErro("");
            }}
            className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-evergreen"
          />
          <span>
            Autorizo Rodrigo Cohen a guardar meu nome e WhatsApp e a falar
            comigo sobre investimentos. Veja a{" "}
            <a
              href="/privacidade"
              target="_blank"
              rel="noopener"
              className="text-evergreen underline underline-offset-2"
            >
              política de privacidade
            </a>
            .
          </span>
        </label>

        {erro && (
          <p role="alert" className="text-[14px] font-medium text-[#A33A2B]">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-evergreen text-bone font-semibold text-[16px] py-4 rounded-lg transition-colors hover:bg-evergreen-700 disabled:opacity-70 inline-flex gap-2 items-center justify-center"
        >
          {enviando ? "Um instante..." : "Continuar para a ITERA"}
          {!enviando && <ArrowRight size={18} aria-hidden="true" />}
        </button>
      </form>
    </>
  );
}
