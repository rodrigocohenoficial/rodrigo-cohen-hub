"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function runSimulation(
  bancaInicial: number,
  riscoPct: number,
  payoff: number,
  acertoPct: number,
  nTrades: number
) {
  const risco = riscoPct / 100;
  const acerto = acertoPct / 100;
  const equity: number[] = [bancaInicial];
  let maxEquity = bancaInicial;
  let maxDrawdown = 0;
  let current = bancaInicial;

  for (let i = 0; i < nTrades; i++) {
    if (current <= 0) {
      equity.push(0);
      continue;
    }
    const riscoReais = current * risco;
    if (Math.random() < acerto) {
      current += riscoReais * payoff;
    } else {
      current -= riscoReais;
    }
    current = Math.max(0, current);
    equity.push(current);

    if (current > maxEquity) maxEquity = current;
    const dd = maxEquity > 0 ? (maxEquity - current) / maxEquity : 0;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  return { equity, maxDrawdown, busted: current <= 0 };
}

export default function MonteCarlo() {
  const [bancaInicial, setBancaInicial] = useState(10000);
  const [riscoPct, setRiscoPct] = useState(2);
  const [payoff, setPayoff] = useState(2);
  const [acertoPct, setAcertoPct] = useState(50);
  const [nTrades, setNTrades] = useState(100);
  const [nSims, setNSims] = useState(500);
  const [ran, setRan] = useState(false);

  const results = useMemo(() => {
    if (!ran) return null;

    const sims = Array.from({ length: nSims }, () =>
      runSimulation(bancaInicial, riscoPct, payoff, acertoPct, nTrades)
    );

    const finalEquities = sims.map(
      (s) => s.equity[s.equity.length - 1]
    );
    finalEquities.sort((a, b) => a - b);

    const medianIdx = Math.floor(finalEquities.length / 2);
    const bustedCount = sims.filter((s) => s.busted).length;
    const maxDDs = sims.map((s) => s.maxDrawdown);
    const avgMaxDD =
      maxDDs.reduce((a, b) => a + b, 0) / maxDDs.length;

    // Get percentile curves
    const worstSim = sims.reduce((a, b) =>
      a.equity[a.equity.length - 1] < b.equity[b.equity.length - 1]
        ? a
        : b
    );
    const bestSim = sims.reduce((a, b) =>
      a.equity[a.equity.length - 1] > b.equity[b.equity.length - 1]
        ? a
        : b
    );
    // Median: sort sims by final equity, pick middle
    const sortedSims = [...sims].sort(
      (a, b) =>
        a.equity[a.equity.length - 1] - b.equity[b.equity.length - 1]
    );
    const medianSim = sortedSims[medianIdx];

    // Build chart data (sample every N points if too many)
    const step = Math.max(1, Math.floor(nTrades / 100));
    const chartData = [];
    for (let i = 0; i <= nTrades; i += step) {
      chartData.push({
        trade: i,
        mediana: Math.round(medianSim.equity[i] ?? 0),
        melhor: Math.round(bestSim.equity[i] ?? 0),
        pior: Math.round(worstSim.equity[i] ?? 0),
      });
    }

    return {
      chartData,
      medianFinal: finalEquities[medianIdx],
      bustedPct: (bustedCount / nSims) * 100,
      avgMaxDD: avgMaxDD * 100,
    };
  }, [ran, bancaInicial, riscoPct, payoff, acertoPct, nTrades, nSims]);

  return (
    <div className="bg-paper border border-line rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Banca (R$)
          </span>
          <input
            type="number"
            value={bancaInicial}
            onChange={(e) => setBancaInicial(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Risco/trade (%)
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
            Payoff (R:R)
          </span>
          <input
            type="number"
            value={payoff}
            onChange={(e) => setPayoff(Number(e.target.value))}
            step="0.1"
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Acerto (%)
          </span>
          <input
            type="number"
            value={acertoPct}
            onChange={(e) => setAcertoPct(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Trades
          </span>
          <input
            type="number"
            value={nTrades}
            onChange={(e) => setNTrades(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Simulacoes
          </span>
          <input
            type="number"
            value={nSims}
            onChange={(e) => setNSims(Number(e.target.value))}
            max={5000}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
      </div>

      <button
        onClick={() => {
          setRan(false);
          setTimeout(() => setRan(true), 10);
        }}
        className="bg-evergreen text-paper font-semibold text-[15px] px-6 py-3 rounded-lg transition-colors hover:bg-evergreen-700"
      >
        Simular
      </button>

      {results && (
        <>
          <div className="border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-bone-2 rounded-xl p-4 text-center">
              <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
                Mediana final
              </p>
              <p className="font-serif text-[24px] text-evergreen font-semibold mt-1">
                R$ {results.medianFinal.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-bone-2 rounded-xl p-4 text-center">
              <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
                Drawdown max medio
              </p>
              <p className="font-serif text-[24px] text-evergreen font-semibold mt-1">
                {results.avgMaxDD.toFixed(1)}%
              </p>
            </div>
            <div className="bg-bone-2 rounded-xl p-4 text-center">
              <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
                Risco de ruina
              </p>
              <p
                className={`font-serif text-[24px] font-semibold mt-1 ${
                  results.bustedPct > 10 ? "text-red-700" : "text-evergreen"
                }`}
              >
                {results.bustedPct.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DAD2C2" />
                <XAxis
                  dataKey="trade"
                  tick={{ fontSize: 12, fill: "#6E6A5E" }}
                  label={{
                    value: "Trades",
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
                <Line
                  type="monotone"
                  dataKey="melhor"
                  stroke="#B0843B"
                  dot={false}
                  strokeWidth={1.5}
                  name="Melhor caso"
                />
                <Line
                  type="monotone"
                  dataKey="mediana"
                  stroke="#122E24"
                  dot={false}
                  strokeWidth={2}
                  name="Mediana"
                />
                <Line
                  type="monotone"
                  dataKey="pior"
                  stroke="#9B1C1C"
                  dot={false}
                  strokeWidth={1.5}
                  name="Pior caso"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
