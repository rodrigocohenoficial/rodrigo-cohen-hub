import React from "react";
import { Composition, staticFile } from "remotion";
import { Reel } from "./layout/Reel";
import { reels } from "./reels";
import { FPS, HEIGHT, WIDTH } from "./theme";
import type { Transcript } from "./types";

type Props = { reelId: string; transcript: Transcript };

const ReelById: React.FC<Props> = ({ reelId, transcript }) => {
  const def = reels.find((r) => r.id === reelId);
  return def ? <Reel def={def} transcript={transcript} /> : null;
};

export const Root: React.FC = () => (
  <>
    {reels.map((def) => (
      <Composition
        key={def.id}
        id={def.id}
        component={ReelById}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={FPS}
        defaultProps={{ reelId: def.id, transcript: def.demo?.transcript ?? { duration: 1, words: [] } }}
        calculateMetadata={async ({ props }) => {
          const transcript: Transcript =
            def.demo?.transcript ?? (await fetch(staticFile(`reels/${def.id}/transcript.json`)).then((r) => r.json()));
          return { durationInFrames: Math.ceil(transcript.duration * FPS), props: { ...props, transcript } };
        }}
      />
    ))}
  </>
);
