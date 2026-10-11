import type { ReelDef } from "../types";
import { DemoScenes, demoTranscript } from "./demo/Scenes";
import { Reel01Scenes } from "./reel-01/Scenes";

// Cada Reel novo entra aqui.
export const reels: ReelDef[] = [
  { id: "demo", Scenes: DemoScenes, tag: "Rodrigo Cohen · Automação híbrida", demo: { transcript: demoTranscript } },
  {
    id: "reel-01",
    Scenes: Reel01Scenes,
    tag: "Rodrigo Cohen · Resultado do dia",
    faceSegments: [
      { from: 0, position: "50% 45%" }, // tela da plataforma
      { from: 47.37, position: "50% 26%" }, // rosto
    ],
  },
];
