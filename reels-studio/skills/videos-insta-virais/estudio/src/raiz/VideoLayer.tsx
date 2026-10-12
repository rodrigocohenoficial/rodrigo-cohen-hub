import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ritmo } from "../theme";
import type { Zoom } from "../types";

/**
 * Vídeo em tela cheia. Zooms podem congelar o quadro enquanto o áudio segue.
 * `offsetY` desce o vídeo (px) e deixa uma faixa escura em cima (ex: espaço para a manchete do jornal).
 */
export const VideoLayer: React.FC<{ src: string; zooms: Zoom[]; offsetY?: number }> = ({ src, zooms, offsetY = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = ritmo.velocidade;
  // Tempo em segundos da fala (com velocidade 1,1x, 1s de vídeo = 1,1s de fala).
  const t = (frame / fps) * v;
  const z = zooms.find((zz) => t >= zz.from && t < zz.to);

  let scale = 1;
  if (z) {
    const ramp = z.slow ? z.to - z.from : 0.18;
    scale = interpolate(t, [z.from, z.from + ramp], [1, z.scale], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: z.slow ? Easing.inOut(Easing.quad) : Easing.out(Easing.cubic),
    });
  }

  const video = (
    <OffthreadVideo src={staticFile(src)} muted playbackRate={v} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  );
  return (
    <AbsoluteFill style={{ background: offsetY ? "linear-gradient(#0B0B0B, #1A1A1A)" : "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ top: offsetY, transform: `scale(${scale})`, transformOrigin: z ? `${z.x}% ${z.y}%` : "50% 50%" }}>
        {z?.freeze ? <Freeze frame={Math.round((z.from / v) * fps)}>{video}</Freeze> : video}
      </AbsoluteFill>
      <Audio src={staticFile(src)} playbackRate={v} />
    </AbsoluteFill>
  );
};
