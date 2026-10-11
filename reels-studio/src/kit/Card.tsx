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
};

/** Cartão com rótulo e valor (ex: "STOP" / "150 pts"). */
export const Card: React.FC<Props> = ({ at, label, value, tone = "brass", from = "up", width = 420 }) => {
  const accent = { brass: color.brassLight, gain: color.gain, loss: color.loss }[tone];
  return (
    <Appear at={at} from={from}>
      <div
        style={{
          width,
          background: "rgba(242,237,226,0.06)",
          border: `2px solid rgba(242,237,226,0.14)`,
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
          <div style={{ fontFamily: font.title, fontWeight: 800, fontSize: 64, color: color.bone, marginTop: 6 }}>
            {value}
          </div>
        )}
      </div>
    </Appear>
  );
};
