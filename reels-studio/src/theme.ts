import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes locais em public/fonts: o render funciona offline e sai sempre igual.
loadFont({ family: "Fraunces", url: staticFile("fonts/fraunces-latin-wght-normal.woff2"), weight: "100 900" });
loadFont({ family: "Fraunces", url: staticFile("fonts/fraunces-latin-wght-italic.woff2"), weight: "100 900", style: "italic" });
loadFont({ family: "Inter", url: staticFile("fonts/inter-latin-wght-normal.woff2"), weight: "100 900" });
loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-display-latin-wght-normal.woff2"), weight: "400 900" });
loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-display-latin-wght-italic.woff2"), weight: "400 900", style: "italic" });
loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-latin-wght-normal.woff2"), weight: "100 900" });

type Palette = {
  /** Fundo da metade de cima (centro e borda). */
  evergreen: string;
  evergreenDeep: string;
  /** Texto principal. */
  bone: string;
  paper: string;
  /** Linha de destaque e destaque forte (palavras *marcadas*, números). */
  brass: string;
  brassLight: string;
  /** Texto em cima do destaque. */
  ink: string;
  loss: string;
  gain: string;
  /** Fundo de cartões, linhas finas, texto apagado, brilho. */
  surface: string;
  line: string;
  grid: string;
  textDim: string;
  glow: string;
  /** Legenda: fundo e texto normais, fundo e texto da palavra falada. */
  captionBg: string;
  captionText: string;
  captionActiveBg: string;
  captionActiveText: string;
};

const rodrigo: Palette = {
  evergreen: "#122E24",
  evergreenDeep: "#0A1C15",
  bone: "#F2EDE2",
  paper: "#FBF8F1",
  brass: "#B0843B",
  brassLight: "#D9AE5F",
  ink: "#1C1B17",
  loss: "#C4553F",
  gain: "#5FA37A",
  surface: "rgba(242,237,226,0.06)",
  line: "rgba(242,237,226,0.14)",
  grid: "rgba(242,237,226,0.045)",
  textDim: "rgba(242,237,226,0.55)",
  glow: "rgba(176,132,59,0.25)",
  captionBg: "rgba(10,28,21,0.82)",
  captionText: "#F2EDE2",
  captionActiveBg: "#D9AE5F",
  captionActiveText: "#1C1B17",
};

// Dra. Flávia Cohen (@flaviavcohen): rosé claro, texto vinho, e as caixas amarela/branca de gancho dela.
export const AMARELO_FLAVIA = "#FFE14A";
const flavia: Palette = {
  evergreen: "#FBEFF0",
  evergreenDeep: "#F1D9DC",
  bone: "#2E2226",
  paper: "#FFFFFF",
  brass: "#C99AA3",
  brassLight: "#9E4F66",
  ink: "#FFFFFF",
  loss: "#C4553F",
  gain: "#6FA287",
  surface: "rgba(255,255,255,0.75)",
  line: "rgba(46,34,38,0.10)",
  grid: "rgba(158,79,102,0.07)",
  textDim: "rgba(46,34,38,0.55)",
  glow: "rgba(158,79,102,0.18)",
  captionBg: "#FFFFFF",
  captionText: "#111111",
  captionActiveBg: AMARELO_FLAVIA,
  captionActiveText: "#111111",
};

export const temas = {
  rodrigo: { color: rodrigo, font: { title: "Fraunces", body: "Inter" }, legenda: { maiuscula: true } },
  flavia: { color: flavia, font: { title: "Playfair Display", body: "Montserrat" }, legenda: { maiuscula: false } },
};
export type TemaId = keyof typeof temas;

// Cor e fonte ativas. Cada render desenha um Reel só, e o Reel aplica o tema dele antes de desenhar a tela.
export const color: Palette = { ...rodrigo };
export const font = { ...temas.rodrigo.font };
export const legenda = { ...temas.rodrigo.legenda };

export const aplicarTema = (id: TemaId = "rodrigo") => {
  Object.assign(color, temas[id].color);
  Object.assign(font, temas[id].font);
  Object.assign(legenda, temas[id].legenda);
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Metade de cima = animação. Metade de baixo = vídeo.
export const STAGE_HEIGHT = 960;
