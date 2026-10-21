import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { useSince } from "./time";

type Props = {
  /** Segundo da fala em que o elemento entra. */
  at: number;
  from?: "up" | "down" | "left" | "right" | "scale" | "fade";
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Faz qualquer elemento entrar no segundo exato da fala. */
export const Appear: React.FC<Props> = ({ at, from = "up", style, children }) => {
  const { fps } = useVideoConfig();
  const since = useSince(at);
  const p = spring({ frame: since, fps, config: { damping: 14, mass: 0.6 } });
  const d = interpolate(p, [0, 1], [60, 0]);
  const transform = {
    up: `translateY(${d}px)`,
    down: `translateY(${-d}px)`,
    left: `translateX(${d}px)`,
    right: `translateX(${-d}px)`,
    scale: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
    fade: "none",
  }[from];
  return <div style={{ opacity: since < 0 ? 0 : p, transform, ...style }}>{children}</div>;
};
