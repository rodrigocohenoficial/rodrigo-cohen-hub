import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font, ritmo } from "../theme";
import { YELLOW } from "./CaptionsRaiz";

// Segundo da fala (considera a velocidade do Reel).
const useT = () => (useCurrentFrame() / useVideoConfig().fps) * ritmo.velocidade;

/** Faixa de texto no topo (gancho): caixa branca, letra preta. */
export const TopText: React.FC<{ from: number; to: number; text: string }> = ({ from, to, text }) => {
  const t = useT();
  const { fps } = useVideoConfig();
  if (t < from || t >= to) return null;
  const p = spring({ frame: Math.round((t - from) * fps), fps, config: { damping: 13, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${0.7 + p * 0.3})`,
          background: "#FFFFFF",
          color: "#000",
          fontFamily: font.body,
          fontWeight: 900,
          fontSize: 66,
          lineHeight: 1.15,
          textAlign: "center",
          padding: "18px 34px",
          borderRadius: 18,
          whiteSpace: "pre-line",
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Texto/número estourando no centro da tela. */
export const Pop: React.FC<{ from: number; to: number; text: string; sub?: string; color?: "white" | "yellow" | "green"; y?: number; size?: number }> = ({
  from,
  to,
  text,
  sub,
  color = "yellow",
  y = 700,
  size = 190,
}) => {
  const t = useT();
  const { fps } = useVideoConfig();
  if (t < from || t >= to) return null;
  const p = spring({ frame: Math.round((t - from) * fps), fps, config: { damping: 8, stiffness: 200 } });
  const c = { white: "#FFFFFF", yellow: YELLOW, green: "#3DDC84" }[color];
  return (
    <div style={{ position: "absolute", top: y, left: 60, right: 60, textAlign: "center", transform: `scale(${p}) rotate(-3deg)` }}>
      <div
        style={{
          fontFamily: font.body,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1,
          color: c,
          WebkitTextStroke: "18px #000",
          paintOrder: "stroke fill",
          textShadow: "0 14px 40px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: font.body,
            fontWeight: 900,
            fontSize: 64,
            color: "#FFFFFF",
            WebkitTextStroke: "10px #000",
            paintOrder: "stroke fill",
            marginTop: 10,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/** Círculo vermelho riscado à mão em volta de um ponto (px no quadro 1080x1920). */
export const Scribble: React.FC<{ from: number; to: number; x: number; y: number; w: number; h: number }> = ({ from, to, x, y, w, h }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const draw = interpolate(t, [from, from + 0.35], [0, 1], { extrapolateRight: "clamp" });
  const rx = w / 2;
  const ry = h / 2;
  // Elipse com uma volta e pouco, levemente torta, como caneta.
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = -Math.PI * 0.6 + (i / 64) * Math.PI * 2.25;
    const wobble = 1 + 0.05 * Math.sin(i * 0.9);
    pts.push(`${(x + Math.cos(a) * rx * wobble).toFixed(1)},${(y + Math.sin(a) * ry * (wobble + i / 640)).toFixed(1)}`);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#FF2D2D"
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        transform={`rotate(-4 ${x} ${y})`}
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}
      />
    </svg>
  );
};

/** Carimbo raiz, centralizado. */
export const StampRaiz: React.FC<{ from: number; to: number; text: string; y?: number }> = ({ from, to, text, y = 760 }) => {
  const t = useT();
  const { fps } = useVideoConfig();
  if (t < from || t >= to) return null;
  const p = spring({ frame: Math.round((t - from) * fps), fps, config: { damping: 9, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `rotate(-6deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`,
          border: "12px solid #FF2D2D",
          background: "rgba(0,0,0,0.55)",
          color: "#FF2D2D",
          borderRadius: 20,
          padding: "12px 40px",
          fontFamily: font.body,
          fontWeight: 900,
          fontSize: 92,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Aviso pequeno no topo. */
export const DisclaimerRaiz: React.FC<{ from: number; to: number; top?: number }> = ({ from, to, top = 150 }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: font.body,
        fontWeight: 600,
        fontSize: 28,
        color: "rgba(255,255,255,0.9)",
      }}
    >
      <span style={{ background: "rgba(0,0,0,0.6)", padding: "6px 16px", borderRadius: 10 }}>
        Resultado passado não garante resultado futuro.
      </span>
    </div>
  );
};
