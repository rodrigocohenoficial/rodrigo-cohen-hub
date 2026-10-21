import React from "react";
import { color, font } from "../theme";
import { Appear } from "./Appear";
import { useSince } from "./time";

type Props = {
  at: number;
  question: string;
  options: string[];
  /** Índice da opção escolhida e o segundo da escolha. */
  choose?: number;
  chooseAt?: number;
};

/** Caixa de decisão estilo terminal: "Aprovar? 1. Sim 2. Ajustar". */
export const GateCard: React.FC<Props> = ({ at, question, options, choose, chooseAt = Infinity }) => {
  const chosen = useSince(chooseAt) >= 0;
  return (
    <Appear at={at} from="scale">
      <div
        style={{
          width: 860,
          background: color.evergreenDeep,
          border: `2px solid ${color.brass}`,
          borderRadius: 28,
          padding: "40px 46px",
          boxShadow: `0 0 80px ${color.glow}`,
        }}
      >
        <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: 30, color: color.brassLight, letterSpacing: 4 }}>
          ● DECISÃO
        </div>
        <div style={{ fontFamily: font.title, fontWeight: 800, fontSize: 60, color: color.bone, margin: "14px 0 30px" }}>
          {question}
        </div>
        {options.map((o, i) => {
          const active = chosen && i === choose;
          return (
            <div
              key={o}
              style={{
                fontFamily: font.body,
                fontWeight: 700,
                fontSize: 44,
                padding: "18px 26px",
                borderRadius: 16,
                marginTop: 12,
                color: active ? color.ink : color.bone,
                background: active ? color.brassLight : color.surface,
                opacity: chosen && !active ? 0.4 : 1,
              }}
            >
              {active ? "✓" : `${i + 1}.`} {o}
            </div>
          );
        })}
      </div>
    </Appear>
  );
};
