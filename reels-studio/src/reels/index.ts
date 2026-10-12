import type { ReelDef } from "../types";
import { DemoScenes, demoTranscript } from "./demo/Scenes";
import { Flavia01Scenes } from "./flavia-01/Scenes";
import { Reel01Scenes } from "./reel-01/Scenes";
import { Reel02Scenes } from "./reel-02/Scenes";
import { Reel03Scenes, reel03Zooms } from "./reel-03/Scenes";
import { Reel01RaizScenes, reel01RaizZooms } from "./reel-01-raiz/Scenes";

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
  { id: "reel-01-raiz", style: "raiz", media: "reel-01", Scenes: Reel01RaizScenes, zooms: reel01RaizZooms },
  // Exemplo do estilo jornal com a gravação do reel-01 (só para ver o visual).
  {
    id: "exemplo-jornal",
    style: "jornal",
    media: "reel-01",
    Scenes: () => null,
    manchetes: [
      { from: 0, text: "*8 operações, 8 acertos:* o que realmente importa no resultado do dia?" },
      { from: 47.37, text: "*Mentoria Trader 360* começa semana que vem: como participar?" },
    ],
  },
  {
    id: "flavia-01",
    tema: "flavia",
    velocidade: 1.1,
    Scenes: Flavia01Scenes,
    tag: "@flaviavcohen",
    faceSegments: [
      { from: 0, position: "50% 0%" }, // em pé, andando
      { from: 20.45, position: "50% 8%" }, // sentada à mesa
    ],
  },
  {
    id: "reel-02",
    Scenes: Reel02Scenes,
    tag: "Rodrigo Cohen · Primeiro passo",
    velocidade: 1.1,
    facePosition: "50% 42%",
  },
  // Mesmo Reel 02 em 60/40 (rosto maior).
  {
    id: "reel-02-6040",
    media: "reel-02",
    Scenes: Reel02Scenes,
    tag: "Rodrigo Cohen · Primeiro passo",
    velocidade: 1.1,
    divisao: 0.4,
    facePosition: "50% 40%",
  },
  // Vídeo longo: resposta à caixinha sobre transição de carreira (jornal com a pergunta fixa).
  {
    id: "reel-03",
    style: "jornal",
    Scenes: Reel03Scenes,
    zooms: reel03Zooms,
    velocidade: 1.1,
    videoY: 260,
    mancheteTop: 200,
    mancheteSize: 52,
    legendaY: 1380,
    manchetes: [{ from: 0, text: "*Como eu faço a transição de carreira corretamente?* Quero empreender no trade" }],
  },
];
