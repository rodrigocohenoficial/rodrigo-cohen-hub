import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../theme";
import type { Word } from "../types";

type Chunk = { words: Word[]; start: number; end: number };

const toChunks = (words: Word[]): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const chars = cur.map((c) => c.word).join(" ").length;
    const pause = next ? next.start - w.end > 0.35 : true;
    if (cur.length >= 3 || chars >= 16 || /[.,!?;:]$/.test(w.word) || pause) flush();
  });
  flush();
  return chunks;
};

const clean = (w: string) => w.replace(/^["“]+|[.,!?;:"”]+$/g, "").toUpperCase();

export const YELLOW = "#FFD400";

/** Legenda raiz: branca, contorno preto grosso, palavra falada em amarelo. */
export const CaptionsRaiz: React.FC<{ words: Word[]; y?: number }> = ({ words, y = 1300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => toChunks(words), [words]);
  const idx = chunks.findIndex((c, i) => t >= c.start && t < (chunks[i + 1]?.start ?? c.end + 0.4));
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const pop = spring({ frame: Math.round((t - chunk.start) * fps), fps, config: { damping: 11, mass: 0.4 } });

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 50,
        right: 50,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 22px",
        transform: `scale(${0.8 + pop * 0.2})`,
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start && t < (chunk.words[i + 1]?.start ?? chunk.end + 0.4);
        return (
          <span
            key={`${w.start}-${i}`}
            style={{
              fontFamily: font.body,
              fontWeight: 900,
              fontSize: 92,
              lineHeight: 1.1,
              color: active ? YELLOW : "#FFFFFF",
              WebkitTextStroke: "14px #000",
              paintOrder: "stroke fill",
              textShadow: "0 8px 20px rgba(0,0,0,0.5)",
            }}
          >
            {clean(w.word)}
          </span>
        );
      })}
    </div>
  );
};
