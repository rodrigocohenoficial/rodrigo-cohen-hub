import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Zoom } from "../types";

/** Vídeo em tela cheia. Zooms podem congelar o quadro enquanto o áudio segue. */
export const VideoLayer: React.FC<{ src: string; zooms: Zoom[] }> = ({ src, zooms }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
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

  const video = <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: z ? `${z.x}% ${z.y}%` : "50% 50%" }}>
        {z?.freeze ? <Freeze frame={Math.round(z.from * fps)}>{video}</Freeze> : video}
      </AbsoluteFill>
      <Audio src={staticFile(src)} />
    </AbsoluteFill>
  );
};
