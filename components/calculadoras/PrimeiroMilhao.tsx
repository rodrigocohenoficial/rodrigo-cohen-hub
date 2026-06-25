"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function PrimeiroMilhao() {
  const [aporteInicial, setAporteInicial] = useState(1000);
  const [aporteMensal, setAporteMensal] = useState(1000);
  const [taxaMensal, setTaxaMensal] = useState(1);
  const [meta, setMeta] = useState(1000000);

  const resultado = useMemo(() => {
    const i = taxaMensal / 100;
    let saldo = aporteInicial;
    let mes = 0;
    const data = [{ mes: 0, saldo: Math.round(saldo) }];
    const maxMeses = 1200; // safety limit (100 years)

    while (saldo < meta && mes < maxMeses) {
      mes++;
      saldo = saldo * (1 + i) + aporteMensal;
      if (mes % Math.max(1, Math.floor(mes / 120)) === 0 || saldo >= meta) {
        data.push({ mes, saldo: Math.round(saldo) });
      }
    }

    const anos = Math.floor(mes / 12);
    const mesesResto = mes % 12;

    return { data, mes, anos, mesesResto, saldoFinal: saldo };
  }, [aporteInicial, aporteMensal, taxaMensal, meta]);

  return (
    <div className="bg-paper border border-line rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Aporte inicial (R$)
          </span>
          <input
            type="number"
            value={aporteInicial}
            onChange={(e) => setAporteInicial(Number(e.target.value))}
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
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Taxa mensal (%)
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
            Meta (R$)
          </span>
          <input
            type="number"
            value={meta}
            onChange={(e) => setMeta(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
      </div>

      <div className="border-t border-line pt-5">
        <div className="bg-bone-2 rounded-xl p-5 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Tempo para atingir R${" "}
            {meta.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
          </p>
          <p className="font-serif text-[32px] text-evergreen font-semibold mt-2">
            {resultado.anos > 0 && `${resultado.anos} ano${resultado.anos > 1 ? "s" : ""}`}
            {resultado.anos > 0 && resultado.mesesResto > 0 && " e "}
            {resultado.mesesResto > 0 &&
              `${resultado.mesesResto} ${resultado.mesesResto > 1 ? "meses" : "mês"}`}
          </p>
          <p className="text-[14px] text-muted mt-1">
            ({resultado.mes} meses)
          </p>
        </div>
      </div>

      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={resultado.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DAD2C2" />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 12, fill: "#6E6A5E" }}
              label={{
                value: "Meses",
                position: "insideBottom",
                offset: -5,
                fontSize: 12,
                fill: "#6E6A5E",
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6E6A5E" }}
              tickFormatter={(v) => {
                const n = Number(v);
                return n >= 1000000
                  ? `R$ ${(n / 1000000).toFixed(1)}M`
                  : `R$ ${(n / 1000).toFixed(0)}k`;
              }}
            />
            <Tooltip
              formatter={(v) => [
                `R$ ${Number(v).toLocaleString("pt-BR")}`,
                "Saldo",
              ]}
            />
            <ReferenceLine
              y={meta}
              stroke="#B0843B"
              strokeDasharray="5 5"
              label={{
                value: "Meta",
                fill: "#B0843B",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="#122E24"
              fill="#122E24"
              fillOpacity={0.15}
              name="Saldo"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
