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
  Legend,
} from "recharts";

export default function JurosCompostos() {
  const [aporteInicial, setAporteInicial] = useState(1000);
  const [aporteMensal, setAporteMensal] = useState(500);
  const [taxaMensal, setTaxaMensal] = useState(1);
  const [prazo, setPrazo] = useState(120);

  const resultado = useMemo(() => {
    const i = taxaMensal / 100;
    const data = [];
    let saldo = aporteInicial;
    let totalAportado = aporteInicial;

    for (let m = 0; m <= prazo; m++) {
      if (m > 0) {
        saldo = saldo * (1 + i) + aporteMensal;
        totalAportado += aporteMensal;
      }
      if (m % Math.max(1, Math.floor(prazo / 60)) === 0 || m === prazo) {
        data.push({
          mes: m,
          saldo: Math.round(saldo),
          aportado: Math.round(totalAportado),
          juros: Math.round(saldo - totalAportado),
        });
      }
    }

    return {
      data,
      valorFinal: saldo,
      totalAportado,
      totalJuros: saldo - totalAportado,
    };
  }, [aporteInicial, aporteMensal, taxaMensal, prazo]);

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
            Prazo (meses)
          </span>
          <input
            type="number"
            value={prazo}
            onChange={(e) => setPrazo(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
      </div>

      <div className="border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Valor final
          </p>
          <p className="font-serif text-[24px] text-evergreen font-semibold mt-1">
            R${" "}
            {resultado.valorFinal.toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Total aportado
          </p>
          <p className="font-serif text-[24px] text-evergreen font-semibold mt-1">
            R${" "}
            {resultado.totalAportado.toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Total em juros
          </p>
          <p className="font-serif text-[24px] text-brass font-semibold mt-1">
            R${" "}
            {resultado.totalJuros.toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
            })}
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
              tickFormatter={(v) =>
                `R$ ${(Number(v) / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              formatter={(v) => [
                `R$ ${Number(v).toLocaleString("pt-BR")}`,
                "",
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="aportado"
              stackId="1"
              stroke="#1B4234"
              fill="#1B4234"
              fillOpacity={0.3}
              name="Aportado"
            />
            <Area
              type="monotone"
              dataKey="juros"
              stackId="1"
              stroke="#B0843B"
              fill="#B0843B"
              fillOpacity={0.4}
              name="Juros"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
