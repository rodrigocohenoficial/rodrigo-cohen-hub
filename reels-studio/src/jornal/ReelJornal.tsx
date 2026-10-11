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
      <VideoLayer src={`reels/${def.media ?? def.id}/video.mp4`} zooms={def.zooms ?? []} />
      <Manchete manchetes={def.manchetes ?? []} />
      <Scenes />
      <LegendaFrase words={transcript.words} />
    </AbsoluteFill>
  );
};
