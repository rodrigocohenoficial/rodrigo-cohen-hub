import React from "react";
import { Easing, interpolate, useVideoConfig } from "remotion";
import { color, font } from "../theme";
import { useSince } from "./time";

type Props = {
  at: number;
  drawFor?: number;
  /** Saldo acumulado ponto a ponto. */
  values: number[];
  label?: string;
  width?: number;
  height?: number;
};

/** Curva de patrimônio em degraus sendo desenhada da esquerda para a direita. */
export const EquityCurve: React.FC<Props> = ({ at, drawFor = 2, values, label, width = 880, height = 460 }) => {
  const { fps } = useVideoConfig();
  const since = useSince(at);
  const p = interpolate(since, [0, drawFor * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const min = Math.min(...values);
  const max = Math.max(...values);
  const x = (i: number) => (i / (values.length - 1)) * width;
  const y = (v: number) => interpolate(v, [min, max], [height - 10, 10]);
  const line = values.map((v, i) => (i === 0 ? `M0 ${y(v)}` : `H${x(i)} V${y(v)}`)).join(" ");
  const area = `${line} V${height} H0 Z`;

  return (
    <div style={{ opacity: since < 0 ? 0 : 1, textAlign: "center" }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="eq-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color.gain} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color.gain} stopOpacity={0} />
          </linearGradient>
          <clipPath id="eq-reveal">
            <rect x={0} y={-20} width={width * p} height={height + 40} />
          </clipPath>
        </defs>
        <g clipPath="url(#eq-reveal)">
          <path d={area} fill="url(#eq-fill)" />
          <path d={line} fill="none" stroke={color.gain} strokeWidth={8} strokeLinejoin="round" />
        </g>
      </svg>
      {label && (
        <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: color.bone, marginTop: 24 }}>
          {label.toUpperCase()}
        </div>
      )}
    </div>
  );
};
