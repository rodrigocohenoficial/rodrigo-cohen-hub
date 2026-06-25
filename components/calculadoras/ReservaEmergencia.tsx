"use client";

import { useState } from "react";

const PERFIS = [
  { label: "CLT estavel", meses: 6 },
  { label: "CLT instavel", meses: 9 },
  { label: "Autonomo / PJ", meses: 12 },
];

export default function ReservaEmergencia() {
  const [custoMensal, setCustoMensal] = useState(3000);
  const [meses, setMeses] = useState(6);

  const reserva = custoMensal * meses;

  return (
    <div className="bg-paper border border-line rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Custo mensal essencial (R$)
          </span>
          <input
            type="number"
            value={custoMensal}
            onChange={(e) => setCustoMensal(Number(e.target.value))}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Meses de seguranca
          </span>
          <input
            type="number"
            value={meses}
            onChange={(e) => setMeses(Number(e.target.value))}
            min={1}
            max={24}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
      </div>

      <div className="border-t border-line pt-5">
        <div className="bg-bone-2 rounded-xl p-5 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Sua reserva de emergencia
          </p>
          <p className="font-serif text-[32px] text-evergreen font-semibold mt-2">
            R${" "}
            {reserva.toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-[14px] text-muted mt-2">
            {meses} meses &times; R${" "}
            {custoMensal.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div>
        <p className="text-[13px] font-semibold text-evergreen mb-3">
          Sugestao por perfil
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PERFIS.map((p) => (
            <button
              key={p.label}
              onClick={() => setMeses(p.meses)}
              className={`border rounded-xl p-4 text-center transition-colors ${
                meses === p.meses
                  ? "bg-evergreen text-paper border-evergreen"
                  : "bg-bone border-line hover:border-brass"
              }`}
            >
              <p className="font-semibold text-[14px]">{p.label}</p>
              <p
                className={`text-[13px] mt-1 ${
                  meses === p.meses ? "text-bone/80" : "text-muted"
                }`}
              >
                ~{p.meses} meses
              </p>
              <p
                className={`font-serif text-[18px] font-semibold mt-1 ${
                  meses === p.meses ? "text-brass-soft" : "text-evergreen"
                }`}
              >
                R${" "}
                {(custoMensal * p.meses).toLocaleString("pt-BR", {
                  maximumFractionDigits: 0,
                })}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
