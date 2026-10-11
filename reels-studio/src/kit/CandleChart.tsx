import React, { useMemo } from "react";
import { interpolate, random, useVideoConfig } from "remotion";
import { color, font } from "../theme";
import { useSince } from "./time";

type Level = { label: string; price: number; at: number; tone?: "brass" | "gain" | "loss" };

type Props = {
  /** Segundo em que os candles começam a ser desenhados. */
  at: number;
  /** Quanto tempo (s) leva para desenhar todos os candles. */
  drawFor?: number;
  /** Fechamentos em ordem. Sem isso, gera um gráfico com a tendência pedida. */
  closes?: number[];
  trend?: "up" | "down" | "side";
  count?: number;
  seed?: string;
  /** Linhas de entrada, stop, alvo... cada uma entra no seu segundo. */
  levels?: Level[];
  width?: number;
  height?: number;
};

const makeCloses = (count: number, trend: Props["trend"], seed: string) => {
  const drift = trend === "up" ? 0.35 : trend === "down" ? -0.35 : 0;
  const out: number[] = [];
  let p = 100;
  for (let i = 0; i < count; i++) {
    p += drift + (random(`${seed}-${i}`) - 0.5) * 3;
    out.push(p);
  }
  return out;
};

/** Gráfico de candles sendo desenhado, com níveis que aparecem sincronizados com a fala. */
export const CandleChart: React.FC<Props> = ({
  at,
  drawFor = 2.5,
  closes,
  trend = "up",
  count = 26,
  seed = "cohen",
  levels = [],
  width = 920,
  height = 640,
}) => {
  const { fps } = useVideoConfig();
  const since = useSince(at);
  const data = useMemo(() => {
    const c = closes ?? makeCloses(count, trend, seed);
    return c.map((close, i) => {
      const open = i === 0 ? close - (random(`${seed}-o`) - 0.5) * 2 : c[i - 1];
      const wick = (k: string) => random(`${seed}-w${k}-${i}`) * 1.4;
      return { open, close, high: Math.max(open, close) + wick("h"), low: Math.min(open, close) - wick("l") };
    });
  }, [closes, count, trend, seed]);

  const prices = [...data.flatMap((d) => [d.high, d.low]), ...levels.map((l) => l.price)];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = (max - min) * 0.08;
  const plotW = width - 170;
  const y = (p: number) => interpolate(p, [min - pad, max + pad], [height, 0]);
  const slot = plotW / data.length;
  const shown = interpolate(since, [0, drawFor * fps], [0, data.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={width} height={height} style={{ overflow: "visible", opacity: since < 0 ? 0 : 1 }}>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={plotW} y1={height * f} y2={height * f} stroke={color.line} strokeWidth={2} />
      ))}
      {data.map((d, i) => {
        const grow = Math.min(1, Math.max(0, shown - i));
        if (grow <= 0) return null;
        const up = d.close >= d.open;
        const c = up ? color.gain : color.loss;
        const close = d.open + (d.close - d.open) * grow;
        const top = y(Math.max(d.open, close));
        const bottom = y(Math.min(d.open, close));
        const cx = i * slot + slot / 2;
        return (
          <g key={i} opacity={Math.min(1, grow * 2)}>
            <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} stroke={c} strokeWidth={4} />
            <rect x={cx - slot * 0.32} y={top} width={slot * 0.64} height={Math.max(4, bottom - top)} fill={c} rx={3} />
          </g>
        );
      })}
      {levels.map((l) => (
        <LevelLine key={l.label} level={l} y={y(l.price)} plotW={plotW} />
      ))}
    </svg>
  );
};

const LevelLine: React.FC<{ level: Level; y: number; plotW: number }> = ({ level, y, plotW }) => {
  const { fps } = useVideoConfig();
  const since = useSince(level.at);
  if (since < 0) return null;
  const draw = interpolate(since, [0, 0.5 * fps], [0, 1], { extrapolateRight: "clamp" });
  const c = { brass: color.brassLight, gain: color.gain, loss: color.loss }[level.tone ?? "brass"];
  return (
    <g>
      <line x1={0} x2={plotW * draw} y1={y} y2={y} stroke={c} strokeWidth={4} strokeDasharray="16 12" />
      <g opacity={draw} transform={`translate(${plotW + 14}, ${y})`}>
        <rect x={0} y={-30} width={170} height={60} rx={12} fill={c} />
        <text
          x={85}
          y={10}
          textAnchor="middle"
          fontFamily={font.body}
          fontWeight={800}
          fontSize={26}
          fill={color.ink}
          letterSpacing={1}
        >
          {level.label.toUpperCase()}
        </text>
      </g>
    </g>
  );
};
