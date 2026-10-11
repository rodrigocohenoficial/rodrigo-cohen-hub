import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color, font, legenda, ritmo, STAGE_HEIGHT } from "../theme";
import type { Word } from "../types";

type Chunk = { words: Word[]; start: number; end: number };

const MAX_WORDS = 3;
const MAX_CHARS = 20;

const toChunks = (words: Word[]): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    // Tema com quebraAntes: palavra longa que estouraria a linha começa um bloco novo.
    if (legenda.quebraAntes && cur.length && [...cur, w].map((c) => c.word).join(" ").length > MAX_CHARS + 4) flush();
    cur.push(w);
    const next = words[i + 1];
    const chars = cur.map((c) => c.word).join(" ").length;
    const pause = next ? next.start - w.end > 0.35 : true;
    if (cur.length >= MAX_WORDS || chars >= MAX_CHARS || /[.,!?;:]$/.test(w.word) || pause) flush();
  });
  flush();
  return chunks;
};

// Tira pontuação só das pontas: "R$2.823," vira "R$2.823" e "96,3%" fica intacto.
const clean = (w: string) => {
  const s = w.replace(/^["“]+|[.,!?;:"”]+$/g, "");
  return legenda.maiuscula ? s.toUpperCase() : s;
};

/** Legenda palavra por palavra na divisa entre animação e rosto. A palavra falada acende em dourado. */
export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * ritmo.velocidade;
  const chunks = useMemo(() => toChunks(words), [words]);
  const idx = chunks.findIndex((c, i) => t >= c.start && t < (chunks[i + 1]?.start ?? c.end + 0.4));
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const pop = spring({ frame: Math.round((t - chunk.start) * fps), fps, config: { damping: 12, mass: 0.5 } });

  return (
    <div
      style={{
        position: "absolute",
        top: STAGE_HEIGHT - 62,
        left: 40,
        right: 40,
        display: "flex",
        justifyContent: "center",
        gap: 16,
        transform: `scale(${0.85 + pop * 0.15})`,
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start && t < (chunk.words[i + 1]?.start ?? chunk.end + 0.4);
        return (
          <span
            key={`${w.start}-${i}`}
            style={{
              fontFamily: font.body,
              fontWeight: 800,
              fontSize: 64,
              padding: "6px 16px",
              borderRadius: 14,
              color: active ? color.captionActiveText : color.captionText,
              background: active ? color.captionActiveBg : color.captionBg,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            {clean(w.word)}
          </span>
        );
      })}
    </div>
  );
};
