import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes locais em public/fonts: o render funciona offline e sai sempre igual.
loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-display-latin-wght-normal.woff2"), weight: "400 900" });
loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-display-latin-wght-italic.woff2"), weight: "400 900", style: "italic" });
loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-latin-wght-normal.woff2"), weight: "100 900" });

// Identidade da Dra. Flávia Cohen (@flaviavcohen): rosé claro, texto vinho e as caixas amarela/branca de gancho.
export const AMARELO_FLAVIA = "#FFE14A";

export const color = {
  /** Fundo da metade de cima (centro e borda). */
  evergreen: "#FBEFF0",
  evergreenDeep: "#F1D9DC",
  /** Texto principal. */
  bone: "#2E2226",
  paper: "#FFFFFF",
  /** Linha de destaque e destaque forte (palavras *marcadas*, números). */
  brass: "#C99AA3",
  brassLight: "#9E4F66",
  /** Texto em cima do destaque. */
  ink: "#FFFFFF",
  loss: "#C4553F",
  gain: "#6FA287",
  surface: "rgba(255,255,255,0.75)",
  line: "rgba(46,34,38,0.10)",
  grid: "rgba(158,79,102,0.07)",
  textDim: "rgba(46,34,38,0.55)",
  glow: "rgba(158,79,102,0.18)",
  /** Legenda: caixa branca, palavra falada em amarelo. */
  captionBg: "#FFFFFF",
  captionText: "#111111",
  captionActiveBg: AMARELO_FLAVIA,
  captionActiveText: "#111111",
};

export const font = { title: "Playfair Display", body: "Montserrat" };

/** Legenda em letra normal; palavra longa que estouraria a linha abre bloco novo. */
export const legenda = { maiuscula: false, quebraAntes: true };

/** Velocidade do Reel ativo (1 = normal). Definida por Reel em src/reels/index.ts. */
export const ritmo = { velocidade: 1 };

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Metade de cima = animação. Metade de baixo = vídeo.
export const STAGE_HEIGHT = 960;
