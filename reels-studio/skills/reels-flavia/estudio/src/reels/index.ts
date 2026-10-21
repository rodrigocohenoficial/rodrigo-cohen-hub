import type { ReelDef } from "../types";
import { DemoScenes, demoTranscript } from "./demo/Scenes";

// Cada Reel novo entra aqui. Exemplo de Reel real em references/exemplo-reel.md da skill.
export const reels: ReelDef[] = [
  { id: "demo", Scenes: DemoScenes, tag: "@flaviavcohen", demo: { transcript: demoTranscript } },
];
