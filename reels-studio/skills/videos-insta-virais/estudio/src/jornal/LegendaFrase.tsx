import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../theme";
import type { Word } from "../types";

type Frase = { text: string; start: number; end: number };

const toFrases = (words: Word[]): Frase[] => {
  const out: Frase[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ text: cur.map((w) => w.word).join(" "), start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const chars = cur.map((c) => c.word).join(" ").length;
    const pause = next ? next.start - w.end > 0.5 : true;
    const virgula = /,$/.test(w.word) && cur.length >= 4;
    if (/[.!?]$/.test(w.word) || virgula || cur.length >= 7 || chars >= 34 || pause) flush();
  });
  flush();
  return out;
};

/** Legenda em frase (jeito "jornal"): amarela, contorno preto, frase inteira de uma vez. */
export const LegendaFrase: React.FC<{ words: Word[]; y?: number }> = ({ words, y = 1330 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const frases = useMemo(() => toFrases(words), [words]);
  const atual = frases.find((f, i) => t >= f.start && t < (frases[i + 1]?.start ?? f.end + 0.5));
  if (!atual) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: font.body,
        fontWeight: 800,
        fontSize: 62,
        lineHeight: 1.2,
        color: "#FFD84D",
        WebkitTextStroke: "11px #000",
        paintOrder: "stroke fill",
        textShadow: "0 6px 18px rgba(0,0,0,0.45)",
      }}
    >
      {atual.text}
    </div>
  );
};
