import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { color, font, HEIGHT, ritmo, STAGE_HEIGHT } from "../theme";

type Props = { src?: string; position?: string; segments?: { from: number; position: string }[] };

/** Metade de baixo: a sua gravação (com o áudio). */
export const Face: React.FC<Props> = ({ src, position = "50% 30%", segments = [] }) => {
  const t = (useCurrentFrame() / useVideoConfig().fps) * ritmo.velocidade;
  const current = [...segments].reverse().find((s) => t >= s.from)?.position ?? position;
  return (
    <AbsoluteFill style={{ top: STAGE_HEIGHT, height: HEIGHT - STAGE_HEIGHT, overflow: "hidden", background: color.ink }}>
      {src ? (
        <OffthreadVideo src={staticFile(src)} playbackRate={ritmo.velocidade} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: current }} />
      ) : (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `linear-gradient(${color.evergreenDeep}, ${color.brass})` }}>
          <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: color.textDim }}>
            SUA GRAVAÇÃO AQUI
          </div>
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: color.brass }} />
    </AbsoluteFill>
  );
};
