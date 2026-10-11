import type { ReelDef } from "../types";
import { DemoScenes, demoTranscript } from "./demo/Scenes";

// Cada Reel novo entra aqui.
export const reels: ReelDef[] = [
  { id: "demo", Scenes: DemoScenes, tag: "Rodrigo Cohen · Automação híbrida", demo: { transcript: demoTranscript } },
];
