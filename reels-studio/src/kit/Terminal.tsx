import React from "react";
import { useVideoConfig } from "remotion";
import { color, font } from "../theme";
import { Appear } from "./Appear";
import { useSince } from "./time";

type Line = { text: string; at: number; tone?: "dim" | "brass" | "gain" | "loss" };

/** Janela de terminal/plataforma com linhas sendo digitadas no ritmo da fala. */
export const Terminal: React.FC<{ title?: string; at: number; lines: Line[] }> = ({ title = "robo.log", at, lines }) => (
  <Appear at={at} from="scale">
    <div
      style={{
        width: 900,
        background: "#07130E",
        border: "2px solid rgba(242,237,226,0.14)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", background: "rgba(242,237,226,0.05)" }}>
        {[color.loss, color.brassLight, color.gain].map((c) => (
          <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
        ))}
        <div style={{ fontFamily: font.body, fontWeight: 600, fontSize: 26, color: "rgba(242,237,226,0.5)", marginLeft: 12 }}>{title}</div>
      </div>
      <div style={{ padding: "26px 30px", minHeight: 200 }}>
        {lines.map((l, i) => (
          <TypedLine key={i} line={l} />
        ))}
      </div>
    </div>
  </Appear>
);

const TypedLine: React.FC<{ line: Line }> = ({ line }) => {
  const { fps } = useVideoConfig();
  const since = useSince(line.at);
  if (since < 0) return null;
  const chars = Math.floor((since / (0.6 * fps)) * line.text.length);
  const c = { dim: "rgba(242,237,226,0.55)", brass: color.brassLight, gain: color.gain, loss: color.loss }[line.tone ?? "dim"];
  return (
    <div style={{ fontFamily: "'DejaVu Sans Mono', Menlo, monospace", fontSize: 34, lineHeight: 1.6, color: c, whiteSpace: "pre" }}>
      {line.text.slice(0, chars)}
    </div>
  );
};
