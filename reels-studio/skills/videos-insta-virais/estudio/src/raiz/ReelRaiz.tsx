import React from "react";
import { AbsoluteFill } from "remotion";
import type { ReelDef, Transcript } from "../types";
import { CaptionsRaiz } from "./CaptionsRaiz";
import { VideoLayer } from "./VideoLayer";

export const ReelRaiz: React.FC<{ def: ReelDef; transcript: Transcript }> = ({ def, transcript }) => {
  const { Scenes } = def;
  return (
    <AbsoluteFill>
      <VideoLayer src={`reels/${def.media ?? def.id}/video.mp4`} zooms={def.zooms ?? []} />
      <Scenes />
      <CaptionsRaiz words={transcript.words} />
    </AbsoluteFill>
  );
};
