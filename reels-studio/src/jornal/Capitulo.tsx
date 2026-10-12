import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font, ritmo } from "../theme";

type Cap = { from: number; to: number; text: string };

/** Etiqueta de capítulo logo abaixo da manchete: quem chega no meio sabe em que parte do vídeo está. */
export const Capitulos: React.FC<{ capitulos: Cap[]; y?: number }> = ({ capitulos, y = 600 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * ritmo.velocidade;
  const c = capitulos.find((k) => t >= k.from && t < k.to);
  if (!c) return null;
  const p = spring({ frame: Math.round(((t - c.from) / ritmo.velocidade) * fps), fps, config: { damping: 14, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `translateY(${(1 - p) * -20}px)`,
          opacity: p,
          background: "#F7E35B",
          color: "#111",
          fontFamily: font.body,
          fontWeight: 800,
          fontSize: 34,
          padding: "10px 26px",
          borderRadius: 40,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        {c.text}
      </div>
    </div>
  );
};
