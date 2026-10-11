import React from "react";
import { Composition, staticFile } from "remotion";
import { Reel } from "./layout/Reel";
import { reels } from "./reels";
import { FPS, HEIGHT, ritmo, WIDTH } from "./theme";
import type { Transcript } from "./types";

type Props = { reelId: string; transcript: Transcript };

const ReelById: React.FC<Props> = ({ reelId, transcript }) => {
  const def = reels.find((r) => r.id === reelId);
  if (!def) return null;
  ritmo.velocidade = def.velocidade ?? 1;
  return <Reel def={def} transcript={transcript} />;
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
            def.demo?.transcript ?? (await fetch(staticFile(`reels/${def.media ?? def.id}/transcript.json`)).then((r) => r.json()));
          const velocidade = def.velocidade ?? 1;
          return { durationInFrames: Math.ceil((transcript.duration / velocidade) * FPS), props: { ...props, transcript } };
        }}
      />
    ))}
  </>
);
