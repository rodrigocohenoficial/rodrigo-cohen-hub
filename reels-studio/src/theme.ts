import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Mesma paleta do rodrigocohen.com.br
export const color = {
  evergreen: "#122E24",
  evergreenDeep: "#0A1C15",
  bone: "#F2EDE2",
  paper: "#FBF8F1",
  brass: "#B0843B",
  brassLight: "#D9AE5F",
  ink: "#1C1B17",
  loss: "#C4553F",
  gain: "#5FA37A",
};

// Fontes do site guardadas em public/fonts: o render funciona offline e sai sempre igual.
loadFont({ family: "Fraunces", url: staticFile("fonts/fraunces-latin-wght-normal.woff2"), weight: "100 900" });
loadFont({ family: "Fraunces", url: staticFile("fonts/fraunces-latin-wght-italic.woff2"), weight: "100 900", style: "italic" });
loadFont({ family: "Inter", url: staticFile("fonts/inter-latin-wght-normal.woff2"), weight: "100 900" });

export const font = {
  title: "Fraunces",
  body: "Inter",
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Metade de cima = animação. Metade de baixo = você na câmera.
export const STAGE_HEIGHT = 960;
