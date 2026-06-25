"use client";

import { useState } from "react";

const INSTRUMENTOS = [
  { label: "WIN (Mini Índice)", valor: 0.2 },
  { label: "WDO (Mini Dólar)", valor: 10 },
];

export default function CustoOperacao() {
  const [contratos, setContratos] = useState(1);
  const [operacoes, setOperacoes] = useState(5);
  const [corretagem, setCorretagem] = useState(0);
  const [emolumentos, setEmolumentos] = useState(0.03);
  const [instrumento, setInstrumento] = useState(0);
  const [valorPontoCustom, setValorPontoCustom] = useState(1);
  const [useCustom, setUseCustom] = useState(false);

  const valorPonto = useCustom
    ? valorPontoCustom
    : INSTRUMENTOS[instrumento].valor;

  // Custo = (corretagem + emolumentos) * contratos * operacoes * 2 (entrada+saida)
  const custoTotal =
    (corretagem + emolumentos) * contratos * operacoes * 2;
  const custoPontos =
    contratos > 0 && valorPonto > 0
      ? custoTotal / (valorPonto * contratos) / operacoes
      : 0;

  return (
    <div className="bg-paper border border-line rounded-xl p-6 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Contratos
          </span>
          <input
            type="number"
            value={contratos}
            onChange={(e) => setContratos(Number(e.target.value))}
            min={1}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Operacoes (round trips)
          </span>
          <input
            type="number"
            value={operacoes}
            onChange={(e) => setOperacoes(Number(e.target.value))}
            min={1}
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Corretagem/contrato (R$)
          </span>
          <input
            type="number"
            value={corretagem}
            onChange={(e) => setCorretagem(Number(e.target.value))}
            step="0.01"
            className="mt-1 w-full px-3 py-2.5 border border-line rounded-lg bg-bone text-ink text-[15px]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-evergreen">
            Emolumentos+registro/contrato (R$)
          </span>
          <input
            type="number"
            value={emolumentos}
            onChange={(e) => setEmolumentos(Number(e.target.value))}
            step="0.01"
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
                {inst.label}
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

      <div className="border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Custo total no dia
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            R$ {custoTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-bone-2 rounded-xl p-4 text-center">
          <p className="text-[12px] uppercase tracking-wider text-muted font-semibold">
            Custo em pontos/operacao
          </p>
          <p className="font-serif text-[28px] text-evergreen font-semibold mt-1">
            {custoPontos.toFixed(2)} pts
          </p>
          <p className="text-[12px] text-muted mt-1">
            (quanto voce comeca perdendo)
          </p>
        </div>
      </div>

      <div className="bg-bone-2 border border-line rounded-xl p-4 text-[14px] text-muted">
        <strong className="text-evergreen">Nota:</strong> Corretoras com RLP
        costumam oferecer corretagem zero, mas a contrapartida e que a corretora
        fica do outro lado da sua ordem. Sem RLP, voce opera direto no mercado
        com total transparencia — mas pode haver custo de corretagem. Confirme
        os valores atualizados com a sua corretora.
      </div>
    </div>
  );
}
