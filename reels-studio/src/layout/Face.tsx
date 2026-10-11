import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { color, font, HEIGHT, STAGE_HEIGHT } from "../theme";

/** Metade de baixo: a sua gravação (com o áudio). */
export const Face: React.FC<{ src?: string; position?: string }> = ({ src, position = "50% 30%" }) => (
  <AbsoluteFill style={{ top: STAGE_HEIGHT, height: HEIGHT - STAGE_HEIGHT, overflow: "hidden", background: color.ink }}>
    {src ? (
      <OffthreadVideo src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position }} />
    ) : (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `linear-gradient(${color.ink}, #2A2822)` }}>
        <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: "rgba(242,237,226,0.35)" }}>
          SUA GRAVAÇÃO AQUI
        </div>
      </AbsoluteFill>
    )}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: color.brass }} />
  </AbsoluteFill>
);
