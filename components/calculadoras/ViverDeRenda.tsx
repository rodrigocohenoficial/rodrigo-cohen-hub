"use client";

import { useState } from "react";

export default function ViverDeRenda() {
  const [rendaMensal, setRendaMensal] = useState(5000);
  const [taxaMensal, setTaxaMensal] = useState(0.8);
  const [aporteAtual, setAporteAtual] = useState(0);
  const [aporteMensal, setAporteMensal] = useState(1000);

  const i = taxaMensal / 100;
  const capitalNecessario = i > 0 ? rendaMensal / i : 0;

  // Calcular tempo para chegar la (se aporte informado)
  let tempoMeses: number | null = null;
  if (aporteAtual < capitalNecessario && aporteMensal > 0 && i > 0) {
    let saldo = aporteAtual;
    let mes = 0;
    const maxMeses = 1200;
    while (saldo < capitalNecessario && mes < maxMeses) {
      mes++;
      saldo = saldo * (1 + i) + aporteMensal;
    }
    tempoMeses = mes;
  }

  const tempoAnos = tempoMeses ? Math.floor(tempoMeses / 12) : null;
  const tempoMesesResto = tempoMeses ? tempoMeses % 12 : null;

  return (
    <div className="bg-paper border border-line rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Renda mensal desejada (R$)
          </span>
          <input
            type="number"
            value={rendaMensal}
            onChange={(e) => setRendaMensal(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Taxa de retorno mensal (%)
          </span>
          <input
            type="number"
            value={taxaMensal}
            onChange={(e) => setTaxaMensal(Number(e.target.value))}
            step="0.01"
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Quanto voce tem hoje (R$)
          </span>
          <input
            type="number"
            value={aporteAtual}
            onChange={(e) => setAporteAtual(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Aporte mensal (R$)
          </span>
          <input
            type="number"
            value={aporteMensal}
            onChange={(e) => setAporteMensal(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
      </div>

      <div className="border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-bone-2 rounded-xl p-5 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Capital necessario
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            R${" "}
            {capitalNecessario.toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-[13px] text-muted mt-1">
            Para gerar R${" "}
            {rendaMensal.toLocaleString("pt-BR")} por mes
          </p>
        </div>
        {tempoMeses !== null && tempoMeses < 1200 && (
          <div className="bg-bone-2 rounded-xl p-5 text-center">
            <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
              Tempo para chegar la
            </p>
            <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
              {tempoAnos !== null && tempoAnos > 0 && `${tempoAnos} ano${tempoAnos > 1 ? "s" : ""}`}
              {tempoAnos !== null && tempoAnos > 0 && tempoMesesResto !== null && tempoMesesResto > 0 && " e "}
              {tempoMesesResto !== null && tempoMesesResto > 0 &&
                `${tempoMesesResto} ${tempoMesesResto > 1 ? "meses" : "mês"}`}
            </p>
            <p className="text-[13px] text-muted mt-1">
              Aportando R${" "}
              {aporteMensal.toLocaleString("pt-BR")} por mes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
