import React from "react";
import { AbsoluteFill } from "remotion";
import { VideoLayer } from "../raiz/VideoLayer";
import type { ReelDef, Transcript } from "../types";
import { LegendaFrase } from "./LegendaFrase";
import { Manchete } from "./Manchete";

export const ReelJornal: React.FC<{ def: ReelDef; transcript: Transcript }> = ({ def, transcript }) => {
  const { Scenes } = def;
  return (
    <AbsoluteFill>
      <VideoLayer src={`reels/${def.media ?? def.id}/video.mp4`} zooms={def.zooms ?? []} offsetY={def.videoY ?? 0} />
      <Manchete manchetes={def.manchetes ?? []} top={def.mancheteTop} size={def.mancheteSize} />
      <Scenes />
      <LegendaFrase words={transcript.words} y={def.legendaY} />
    </AbsoluteFill>
  );
};
