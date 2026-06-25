"use client";

import { useState } from "react";

interface NewsletterProps {
  variante?: "faixa" | "rodape";
}

export default function Newsletter({ variante = "faixa" }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // TODO: integrar com provedor de e-mail (modulo isolado)
    // Por ora, simula sucesso
    await new Promise((r) => setTimeout(r, 500));
    setStatus("success");
    setEmail("");
  }

  if (variante === "rodape") {
    return (
      <div className="border-t border-line pt-10 mt-10">
        <div className="bg-evergreen text-bone rounded-2xl p-8 text-center">
          <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass-soft">
            Menos Tela, Mais Vida
          </span>
          <h3 className="font-serif text-[22px] font-semibold mt-2 mb-2">
            Um e-mail por semana. Clareza, não barulho.
          </h3>
          <p className="text-[14px] text-[#C5D1C9] max-w-md mx-auto mb-5">
            O essencial sobre mercado e dinheiro com cabeça no lugar.
          </p>
          {status === "success" ? (
            <p className="text-brass-soft font-semibold">Pronto! Você está na lista.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2.5 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu melhor e-mail"
                aria-label="e-mail"
                required
                className="flex-1 py-3 px-4 rounded-lg border border-[#2E5848] bg-[#0E251D] text-bone text-[15px] placeholder:text-[#7E9389]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-brass text-[#1A1206] font-semibold text-[15px] px-6 py-3 rounded-lg border-none transition-colors hover:bg-brass-soft disabled:opacity-60"
              >
                Quero receber
              </button>
            </form>
          )}
          <small className="block mt-3.5 text-[#7E9389] text-[12.5px]">
            Sem spam. Sai quando quiser.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-evergreen text-bone rounded-[20px] py-[52px] px-[46px] text-center max-sm:py-[38px] max-sm:px-[22px]">
      <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-brass-soft">
        Menos Tela, Mais Vida
      </span>
      <h2 className="font-serif text-[clamp(26px,3.4vw,38px)] font-semibold mt-3.5 mb-3 max-w-[18ch] mx-auto leading-[1.08]">
        Um e-mail por semana. Clareza, não barulho.
      </h2>
      <p className="text-[#C5D1C9] max-w-[46ch] mx-auto mb-[26px] text-[15.5px]">
        O essencial sobre mercado e dinheiro com cabeça no lugar — pra você
        decidir melhor e viver mais.
      </p>
      {status === "success" ? (
        <p className="text-brass-soft font-semibold text-lg">
          Pronto! Você está na lista.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2.5 max-w-[440px] mx-auto max-sm:flex-col"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu melhor e-mail"
            aria-label="e-mail"
            required
            className="flex-1 py-3.5 px-[18px] rounded-lg border border-[#2E5848] bg-[#0E251D] text-bone text-[15px] placeholder:text-[#7E9389]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-brass text-[#1A1206] font-semibold text-[15px] px-[26px] py-3.5 rounded-lg border-none transition-colors hover:bg-brass-soft disabled:opacity-60 inline-flex gap-2 items-center justify-center"
          >
            Quero receber
          </button>
        </form>
      )}
      <small className="block mt-3.5 text-[#7E9389] text-[12.5px]">
        Sem spam. Sai quando quiser.
      </small>
    </div>
  );
}
