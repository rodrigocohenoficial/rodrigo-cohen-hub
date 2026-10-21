import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font, ritmo } from "../theme";

const MARKER = "#F7E35B";

/** Cartão de manchete fixo no topo. `*trecho*` sai marcado como marca-texto. */
export const Manchete: React.FC<{ manchetes: { from: number; text: string }[]; top?: number; size?: number }> = ({ manchetes, top = 250, size = 66 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * ritmo.velocidade;
  const current = [...manchetes].reverse().find((m) => t >= m.from);
  if (!current) return null;

  const p = spring({ frame: Math.round((t - current.from) * fps), fps, config: { damping: 14, mass: 0.6 } });
  const parts = current.text.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, transform: `translateY(${(1 - p) * -40}px)`, opacity: p }}>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 36,
          padding: "30px 40px 34px",
          boxShadow: "0 16px 50px rgba(0,0,0,0.35)",
          fontFamily: font.body,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.18,
          letterSpacing: -1.5,
          color: "#111111",
        }}
      >
        {parts.map((part, i) =>
          part.startsWith("*") ? (
            <span
              key={i}
              style={{
                background: `linear-gradient(transparent 12%, ${MARKER} 12%, ${MARKER} 92%, transparent 92%)`,
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
                padding: "0 4px",
              }}
            >
              {part.slice(1, -1)}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </div>
    </div>
  );
};
