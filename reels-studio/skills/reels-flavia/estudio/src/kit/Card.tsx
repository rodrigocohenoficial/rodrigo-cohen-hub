import React from "react";
import { color, font } from "../theme";
import { Appear } from "./Appear";

type Props = {
  at: number;
  label: string;
  value?: string;
  tone?: "brass" | "gain" | "loss";
  from?: "up" | "left" | "right" | "scale";
  width?: number;
  valueSize?: number;
};

/** Cartão com rótulo e valor (ex: "STOP" / "150 pts"). */
export const Card: React.FC<Props> = ({ at, label, value, tone = "brass", from = "up", width = 420, valueSize = 64 }) => {
  const accent = { brass: color.brassLight, gain: color.gain, loss: color.loss }[tone];
  return (
    <Appear at={at} from={from}>
      <div
        style={{
          width,
          background: color.surface,
          border: `2px solid ${color.line}`,
          borderTop: `6px solid ${accent}`,
          borderRadius: 24,
          padding: "26px 32px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: accent }}>
          {label.toUpperCase()}
        </div>
        {value && (
          <div style={{ fontFamily: font.title, fontWeight: 800, fontSize: valueSize, color: color.bone, marginTop: 6 }}>
            {value}
          </div>
        )}
      </div>
    </Appear>
  );
};
