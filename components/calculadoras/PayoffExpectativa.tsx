"use client";

import { useState } from "react";

export default function PayoffExpectativa() {
  const [alvo, setAlvo] = useState(200);
  const [stop, setStop] = useState(100);
  const [acerto, setAcerto] = useState(50);
  const [usarAcerto, setUsarAcerto] = useState(true);

  const payoff = stop > 0 ? alvo / stop : 0;
  const winrateEquilibrio = payoff > 0 ? (1 / (1 + payoff)) * 100 : 0;

  const acertoDecimal = acerto / 100;
  const expectativaPontos = usarAcerto
    ? acertoDecimal * alvo - (1 - acertoDecimal) * stop
    : null;

  const veredito =
    expectativaPontos !== null
      ? expectativaPontos > 0
        ? "Positiva"
        : expectativaPontos === 0
          ? "Neutra"
          : "Negativa"
      : null;

  return (
    <div className="bg-paper border border-line rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Alvo (pontos)
          </span>
          <input
            type="number"
            value={alvo}
            onChange={(e) => setAlvo(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Stop (pontos)
          </span>
          <input
            type="number"
            value={stop}
            onChange={(e) => setStop(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Taxa de acerto (%)
            <button
              onClick={() => setUsarAcerto(!usarAcerto)}
              className="ml-2 text-[11px] text-brass underline"
            >
              {usarAcerto ? "ocultar" : "informar"}
            </button>
          </span>
          {usarAcerto && (
            <input
              type="number"
              value={acerto}
              onChange={(e) => setAcerto(Number(e.target.value))}
              step="1"
              className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
            />
          )}
        </label>
      </div>

      <div className="border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Payoff (R:R)
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            {payoff.toFixed(2)}
          </p>
        </div>
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Win rate equilíbrio
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            {winrateEquilibrio.toFixed(1)}%
          </p>
        </div>
        {expectativaPontos !== null && (
          <>
            <div className="bg-bone-2 rounded-xl p-4 text-center">
              <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
                Expectativa/trade
              </p>
              <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
                {expectativaPontos.toFixed(1)} pts
              </p>
            </div>
            <div className="bg-bone-2 rounded-xl p-4 text-center">
              <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
                Veredito
              </p>
              <p
                className={`font-serif text-[28px] font-semibold mt-1 ${
                  veredito === "Positiva"
                    ? "text-evergreen"
                    : veredito === "Negativa"
                      ? "text-red-700"
                      : "text-muted"
                }`}
              >
                {veredito}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
