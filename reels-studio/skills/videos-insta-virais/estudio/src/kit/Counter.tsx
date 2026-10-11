import React from "react";
import { Easing, interpolate, useVideoConfig } from "remotion";
import { color, font } from "../theme";
import { useSince } from "./time";

type Props = {
  at: number;
  from?: number;
  to: number;
  /** Duração da contagem em segundos. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Ano (2012) não leva separador de milhar. */
  plain?: boolean;
  label?: string;
  labelPosition?: "above" | "below";
  size?: number;
};

/** Número contando até o valor final (R$, %, anos, alunos...). */
export const Counter: React.FC<Props> = ({
  at,
  from = 0,
  to,
  duration = 1.2,
  prefix = "",
  suffix = "",
  decimals = 0,
  plain = false,
  label,
  labelPosition = "below",
  size = 200,
}) => {
  const { fps } = useVideoConfig();
  const since = useSince(at);
  const v = interpolate(since, [0, duration * fps], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shown = plain
    ? v.toFixed(decimals)
    : v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const labelEl = label && (
    <div
      style={{
        fontFamily: font.body,
        fontWeight: 700,
        fontSize: 42,
        color: color.bone,
        letterSpacing: 4,
        margin: labelPosition === "above" ? "0 0 16px" : "16px 0 0",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
  return (
    <div style={{ opacity: since < 0 ? 0 : 1, textAlign: "center" }}>
      {labelPosition === "above" && labelEl}
      <div style={{ fontFamily: font.title, fontWeight: 800, fontSize: size, color: color.brassLight, lineHeight: 1 }}>
        {prefix}
        {shown}
        {suffix}
      </div>
      {labelPosition === "below" && labelEl}
    </div>
  );
};
