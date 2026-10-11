import type { ReelDef } from "../types";
import { DemoScenes, demoTranscript } from "./demo/Scenes";
import { DemoFlaviaScenes, demoFlaviaTranscript } from "./demo-flavia/Scenes";

// Cada Reel novo entra aqui. Exemplos completos dos 3 estilos em references/exemplos.md da skill.
export const reels: ReelDef[] = [
  { id: "demo", Scenes: DemoScenes, tag: "Rodrigo Cohen · Automação híbrida", demo: { transcript: demoTranscript } },
  { id: "demo-flavia", tema: "flavia", Scenes: DemoFlaviaScenes, tag: "@flaviavcohen", demo: { transcript: demoFlaviaTranscript } },
];
