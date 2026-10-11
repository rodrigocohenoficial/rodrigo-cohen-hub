import React from "react";
import { AbsoluteFill } from "remotion";
import type { ReelDef, Transcript } from "../types";
import { Captions } from "./Captions";
import { Face } from "./Face";
import { Stage } from "./Stage";

export const Reel: React.FC<{ def: ReelDef; transcript: Transcript }> = ({ def, transcript }) => {
  const { Scenes } = def;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Stage tag={def.tag}>
        <Scenes />
      </Stage>
      <Face src={def.demo ? undefined : `reels/${def.media ?? def.id}/video.mp4`} position={def.facePosition} segments={def.faceSegments} />
      <Captions words={transcript.words} />
    </AbsoluteFill>
  );
};
