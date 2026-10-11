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
  /** Enquadramento do rosto na metade de baixo (CSS object-position). */
  facePosition?: string;
  /** Só para a demo: transcrição embutida e sem gravação. */
  demo?: { transcript: Transcript };
};
