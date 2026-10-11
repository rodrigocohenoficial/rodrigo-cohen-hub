import React from "react";
import { spring, useVideoConfig } from "remotion";
import { color, font } from "../theme";
import { useSince } from "./time";

type Props = {
  at: number;
  count: number;
  /** Posições (0 = primeira) das operações com loss. */
  losses?: number[];
  /** Intervalo em segundos entre uma bolinha e a próxima. */
  stagger?: number;
  size?: number;
};

/** Uma bolinha por operação, acendendo em sequência: verde = gain, vermelha = loss. */
export const TradeDots: React.FC<Props> = ({ at, count, losses = [], stagger = 0.08, size = 52 }) => (
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, width: 880 }}>
    {Array.from({ length: count }, (_, i) => (
      <Dot key={i} at={at + i * stagger} loss={losses.includes(i)} size={size} />
    ))}
  </div>
);

const Dot: React.FC<{ at: number; loss: boolean; size: number }> = ({ at, loss, size }) => {
  const { fps } = useVideoConfig();
  const since = useSince(at);
  const p = spring({ frame: since, fps, config: { damping: 10, mass: 0.5 } });
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: loss ? color.loss : color.gain,
        opacity: since < 0 ? 0 : 1,
        transform: `scale(${p})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: font.body,
        fontWeight: 800,
        fontSize: size * 0.5,
        color: color.ink,
        boxShadow: `0 0 ${size / 2}px ${loss ? "rgba(196,85,63,0.45)" : "rgba(95,163,122,0.45)"}`,
      }}
    >
      {loss ? "✕" : "✓"}
    </div>
  );
};
