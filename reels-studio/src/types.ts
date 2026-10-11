import type React from "react";

export type Word = { word: string; start: number; end: number };

export type Transcript = {
  duration: number;
  words: Word[];
};

export type ReelDef = {
  id: string;
  /** Camada de animação (metade de cima). Os tempos dentro dela são os segundos da fala. */
  Scenes: React.FC;
  /** Etiqueta no topo, ex: "RODRIGO COHEN · AUTOMAÇÃO 01/05" */
  tag?: string;
  /** Enquadramento da metade de baixo (CSS object-position). */
  facePosition?: string;
  /** Enquadramentos diferentes ao longo do vídeo, ex: tela da plataforma e depois o rosto. */
  faceSegments?: { from: number; position: string }[];
  /** Só para a demo: transcrição embutida e sem gravação. */
  demo?: { transcript: Transcript };
};
