import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { color, font } from "../theme";
import { useSince } from "./time";

/** Carimbo batendo na tela (ex: "NÃO", "PROIBIDO", "APROVADO"). */
type Props = { at: number; text: string; tone?: "loss" | "gain" | "brass"; rotate?: number; size?: number };

export const Stamp: React.FC<Props> = ({ at, text, tone = "loss", rotate = -8, size = 96 }) => {
  const { fps } = useVideoConfig();
  const since = useSince(at);
  const p = spring({ frame: since, fps, config: { damping: 9, stiffness: 180 } });
  const c = { loss: color.loss, gain: color.gain, brass: color.brassLight }[tone];
  return (
    <div
      style={{
        opacity: since < 0 ? 0 : 1,
        transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`,
        border: `10px solid ${c}`,
        color: c,
        borderRadius: 18,
        padding: "10px 40px",
        fontFamily: font.body,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 6,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
