import React from "react";
import { Capitulos } from "../../jornal/Capitulo";
import { Pop, StampRaiz } from "../../raiz/kit";
import type { Zoom } from "../../types";

// Vídeo longo (resposta à caixinha sobre transição de carreira), estilo jornal com a pergunta fixa.
// Tempos = segundos da fala depois de encurtar as pausas. Vídeo a 1,1x.

const Y = 1540; // frases estourando na altura do peito, abaixo da legenda
const destaques: { at: number; text: string; dur?: number; cor?: "white" | "yellow" | "green" }[] = [
  { at: 17.37, text: "O PROBLEMA É VOCÊ?" },
  { at: 37.77, text: "ASSESSOR", cor: "white" },
  { at: 45.21, text: "ANALISTA", cor: "white" },
  { at: 55.06, text: "PROFESSOR", cor: "white" },
  { at: 69.75, text: "ROBÔS E AUTOMAÇÃO", cor: "white" },
  { at: 80.89, text: "INFLUENCIADOR", cor: "white" },
  { at: 121.84, text: "\"NÃO TENHO PLANO B\"" },
  { at: 143.09, text: "TENHA UM LIMITE" },
  { at: 159.3, text: "1 · RESERVA", cor: "green" },
  { at: 173.79, text: "2 · PLANO DEFINIDO", cor: "green" },
  { at: 196.81, text: "HUMILDADE PRA AJUSTAR", cor: "white" },
  { at: 217.35, text: "3 · SEGUIR O PLANO", cor: "green" },
  { at: 229.85, text: "TI → MERCADO", cor: "white" },
  { at: 280.51, text: "PENSE EM LONGO PRAZO" },
  { at: 296.99, text: "DEFINA AS MÉTRICAS", cor: "white" },
  { at: 311.42, text: "CONSISTÊNCIA = PLANO + SEGUIR", dur: 3.5 },
  { at: 351.59, text: "METAS MENORES E MENSURÁVEIS", dur: 3.5 },
  { at: 364.55, text: "MUDA O AMBIENTE" },
  { at: 412.88, text: "A GENTE FALA, A GENTE FAZ" },
];

const carimbos: { at: number; text: string }[] = [
  { at: 60.33, text: "RESPONSABILIDADE" },
  { at: 152.43, text: "STOP DE CARREIRA" },
  { at: 235.17, text: "ERREI MUITO" },
  { at: 331.13, text: "SEM ALMOÇO GRÁTIS" },
];

// Zoom leve no rosto nos pontos fortes (rosto fica em ~28% do quadro deslocado).
export const reel03Zooms: Zoom[] = [...destaques, ...carimbos]
  .map(({ at }) => ({ from: at, to: at + 2.2, scale: 1.12, x: 50, y: 30 }))
  .sort((a, b) => a.from - b.from);

export const Reel03Scenes: React.FC = () => (
  <>
    <Capitulos
      capitulos={[
        { from: 22.1, to: 100.8, text: "1 · Jeitos de empreender no trade" },
        { from: 100.8, to: 155.6, text: "2 · O seu limite" },
        { from: 155.6, to: 227.4, text: "3 · Reserva, plano e disciplina" },
        { from: 227.4, to: 337.5, text: "4 · A minha transição" },
        { from: 337.5, to: 414.1, text: "5 · Fatia a meta, muda o ambiente" },
      ]}
      y={470}
    />
    {destaques.map((d) => (
      <Pop key={d.at} from={d.at} to={d.at + (d.dur ?? 2.6)} text={d.text} color={d.cor ?? "yellow"} y={Y} size={d.text.length > 14 ? 58 : 70} />
    ))}
    {carimbos.map((c) => (
      <StampRaiz key={c.at} from={c.at} to={c.at + 2.4} text={c.text} y={Y - 20} />
    ))}
    <Pop from={419.08} to={422.2} text="FICOU ATÉ O FINAL?" sub="COMENTA AQUI 👇" color="yellow" y={Y - 40} size={70} />
  </>
);
