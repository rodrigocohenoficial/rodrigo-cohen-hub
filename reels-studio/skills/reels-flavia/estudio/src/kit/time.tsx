import React, { createContext, useContext } from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ritmo } from "../theme";

const SceneStart = createContext(0);

/** Segundo atual da fala (global), mesmo dentro de uma cena. Com velocidade 1,1x, 1s de vídeo = 1,1s de fala. */
export const useSeconds = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return useContext(SceneStart) + (frame / fps) * ritmo.velocidade;
};

/** Frames decorridos desde o segundo `at` da fala (negativo = ainda não chegou). */
export const useSince = (at: number) => {
  const { fps } = useVideoConfig();
  return Math.round((useSeconds() - at) * fps);
};

type SceneProps = { from: number; to: number; children: React.ReactNode };

/** Uma cena da metade de cima, do segundo `from` ao `to` da fala. Entra e sai com fade. */
export const Scene: React.FC<SceneProps> = ({ from, to, children }) => {
  const { fps } = useVideoConfig();
  const v = ritmo.velocidade;
  const start = Math.round((from / v) * fps);
  const length = Math.max(1, Math.round(((to - from) / v) * fps));
  return (
    <Sequence from={start} durationInFrames={length} layout="none">
      <SceneStart.Provider value={(start / fps) * v}>
        <SceneFade length={length}>{children}</SceneFade>
      </SceneStart.Provider>
    </Sequence>
  );
};

const SceneFade: React.FC<{ length: number; children: React.ReactNode }> = ({ length, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, length - 6, length], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity, alignItems: "center", justifyContent: "center", paddingTop: 60 }}>{children}</AbsoluteFill>
  );
};
