import type React from "react";
import type { TemaId } from "./theme";

export type Word = { word: string; start: number; end: number };

export type Transcript = {
  duration: number;
  words: Word[];
};

/** Zoom no vídeo (modo raiz). x/y = ponto em % do quadro que fica parado na tela. */
export type Zoom = { from: number; to: number; scale: number; x: number; y: number; freeze?: boolean; slow?: boolean };

export type ReelDef = {
  id: string;
  /** Paleta e fontes (padrão "rodrigo"). */
  tema?: TemaId;
  /** Split: fração da altura para a animação em cima (padrão 0.5; 0.4 = 40% animação / 60% rosto). */
  divisao?: number;
  /** Aceleração do vídeo (ex: 1.1). Os tempos das cenas continuam em segundos da fala. Vale nos 3 estilos. */
  velocidade?: number;
  /**
   * "split" = animação em cima + vídeo embaixo (padrão).
   * "raiz" = vídeo em tela cheia com intervenções.
   * "jornal" = vídeo em tela cheia + cartão de manchete fixo + legenda em frase.
   */
  style?: "split" | "raiz" | "jornal";
  /** Raiz/jornal: desce o vídeo N px e deixa faixa escura em cima (rosto não fica atrás da manchete). */
  videoY?: number;
  /** Modo jornal: manchete(s) do cartão. `*trecho*` sai marcado de amarelo. Várias = troca no segundo `from`. */
  manchetes?: { from: number; text: string }[];
  /** Jornal: posição (px do topo) e tamanho da fonte da manchete (padrão 250 / 66). */
  mancheteTop?: number;
  mancheteSize?: number;
  /** Jornal: altura da legenda em frase (padrão 1330). */
  legendaY?: number;
  /** Pasta da gravação em public/reels, quando difere do id (ex: versão raiz do mesmo vídeo). */
  media?: string;
  /** Modo raiz: zooms e congelamentos do vídeo. */
  zooms?: Zoom[];
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
