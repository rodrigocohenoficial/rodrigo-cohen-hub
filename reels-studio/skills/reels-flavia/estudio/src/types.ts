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
  /** Etiqueta pequena no topo, ex: "@flaviavcohen". */
  tag?: string;
  /** Enquadramento do rosto na metade de baixo (CSS object-position). */
  facePosition?: string;
  /** Enquadramentos diferentes ao longo do vídeo (ex: em pé e depois sentada). */
  faceSegments?: { from: number; position: string }[];
  /** Aceleração do vídeo (ex: 1.1). Os tempos das cenas continuam em segundos da fala. */
  velocidade?: number;
  /** Pasta da gravação em public/reels, quando difere do id. */
  media?: string;
  /** Só para teste: transcrição embutida e sem gravação. */
  demo?: { transcript: Transcript };
};
