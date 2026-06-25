"use client";

import { useState } from "react";

const INSTRUMENTOS = [
  { label: "WIN (Mini Índice)", valor: 0.2 },
  { label: "WDO (Mini Dólar)", valor: 10 },
];

export default function PositionSizing() {
  const [banca, setBanca] = useState(10000);
  const [riscoPct, setRiscoPct] = useState(2);
  const [stopPontos, setStopPontos] = useState(100);
  const [instrumento, setInstrumento] = useState(0);
  const [valorPontoCustom, setValorPontoCustom] = useState(1);
  const [useCustom, setUseCustom] = useState(false);

  const valorPonto = useCustom
    ? valorPontoCustom
    : INSTRUMENTOS[instrumento].valor;

  const riscoReais = banca * (riscoPct / 100);
  const contratos = Math.floor(riscoReais / (stopPontos * valorPonto));
  const perdaMaxima = contratos * stopPontos * valorPonto;
  const valorFinanceiroPorPonto = contratos * valorPonto;

  return (
    <div className="bg-paper border border-line rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Banca (R$)
          </span>
          <input
            type="number"
            value={banca}
            onChange={(e) => setBanca(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Risco por trade (%)
          </span>
          <input
            type="number"
            value={riscoPct}
            onChange={(e) => setRiscoPct(Number(e.target.value))}
            step="0.5"
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Stop (pontos)
          </span>
          <input
            type="number"
            value={stopPontos}
            onChange={(e) => setStopPontos(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <div>
          <span className="text-[13px] font-semibold text-evergreen block">
            Instrumento
          </span>
          <div className="mt-1 flex gap-2 flex-wrap">
            {INSTRUMENTOS.map((inst, i) => (
              <button
                key={i}
                onClick={() => {
                  setInstrumento(i);
                  setUseCustom(false);
                }}
                className={`px-3 py-2 text-[13px] font-semibold rounded-lg border transition-colors ${
                  !useCustom && instrumento === i
                    ? "bg-evergreen text-paper border-evergreen"
                    : "bg-bone text-ink border-line hover:border-brass"
                }`}
              >
                {inst.label} (R$ {inst.valor}/pt)
              </button>
            ))}
            <button
              onClick={() => setUseCustom(true)}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg border transition-colors ${
                useCustom
                  ? "bg-evergreen text-paper border-evergreen"
                  : "bg-bone text-ink border-line hover:border-brass"
              }`}
            >
              Custom
            </button>
          </div>
          {useCustom && (
            <input
              type="number"
              value={valorPontoCustom}
              onChange={(e) => setValorPontoCustom(Number(e.target.value))}
              step="0.01"
              placeholder="Valor do ponto (R$)"
              className="mt-2 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
            />
          )}
        </div>
      </div>

      <div className="border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Contratos
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            {contratos}
          </p>
        </div>
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Perda máxima
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            R$ {perdaMaxima.toFixed(2)}
          </p>
        </div>
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            R$/ponto
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            R$ {valorFinanceiroPorPonto.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
