import React from "react";
import { spring, useVideoConfig } from "remotion";
import { useSeconds } from "../kit/time";
import { AMARELO_FLAVIA, font } from "../theme";

type Props = { from: number; to: number; amarela: string; branca?: string; y?: number };

/** Assinatura da Flávia: caixa amarela em cima, branca embaixo, letra preta grossa. */
export const CaixasGancho: React.FC<Props> = ({ from, to, amarela, branca, y = 900 }) => {
  // Segundo global da fala (funciona dentro ou fora de uma Scene).
  const t = useSeconds();
  const { fps } = useVideoConfig();
  if (t < from || t >= to) return null;
  const p1 = spring({ frame: Math.round((t - from) * fps), fps, config: { damping: 14, mass: 0.5 } });
  const p2 = spring({ frame: Math.round((t - from - 0.15) * fps), fps, config: { damping: 14, mass: 0.5 } });
  const box: React.CSSProperties = {
    fontFamily: font.body,
    fontWeight: 800,
    fontSize: 58,
    lineHeight: 1.15,
    color: "#111",
    textAlign: "center",
    padding: "14px 30px",
    borderRadius: 8,
    maxWidth: 900,
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  };
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...box, background: AMARELO_FLAVIA, transform: `scale(${p1})` }}>{amarela}</div>
      {branca && <div style={{ ...box, background: "#FFFFFF", fontWeight: 700, marginTop: 10, transform: `scale(${p2})` }}>{branca}</div>}
    </div>
  );
};
