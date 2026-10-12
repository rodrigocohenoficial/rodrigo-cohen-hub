import React from "react";
import { Easing, interpolate, useVideoConfig } from "remotion";
import { color, font } from "../theme";
import { useSince } from "./time";

type Props = {
  at: number;
  /** Texto que a lupa aumenta. */
  texto: string;
  /** Segundo em que a lupa "aumenta" (lente cresce e o texto fica maior). */
  aumentaAt?: number;
  size?: number;
};

/** Lupa entrando e aumentando um texto (ex: "dinheiro é só uma lupa: aumenta quem você é"). */
export const Lupa: React.FC<Props> = ({ at, texto, aumentaAt = Infinity, size = 420 }) => {
  const { fps } = useVideoConfig();
  const since = useSince(at);
  const entra = interpolate(since, [0, 0.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
  const cresce = interpolate(useSince(aumentaAt), [0, 0.6 * fps], [1, 1.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const r = size / 2;
  return (
    <div style={{ position: "relative", width: size + 140, height: size + 140, opacity: since < 0 ? 0 : 1, transform: `scale(${entra * cresce})` }}>
      {/* cabo */}
      <div
        style={{
          position: "absolute",
          left: size * 0.86,
          top: size * 0.86,
          width: 40,
          height: 190,
          borderRadius: 20,
          background: color.brass,
          transform: "rotate(-45deg)",
          transformOrigin: "top center",
        }}
      />
      {/* lente */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          borderRadius: r,
          border: `26px solid ${color.brassLight}`,
          background: "rgba(242,237,226,0.10)",
          boxShadow: `0 0 80px ${color.glow}, inset 0 0 40px rgba(255,255,255,0.08)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: font.title, fontWeight: 800, fontSize: size * 0.12 * cresce, color: color.bone, textAlign: "center", lineHeight: 1.05 }}>
          {texto}
        </div>
      </div>
    </div>
  );
};
