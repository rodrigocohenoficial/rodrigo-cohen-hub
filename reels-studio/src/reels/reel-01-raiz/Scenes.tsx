import React from "react";
import { DisclaimerRaiz, Pop, Scribble, StampRaiz, TopText } from "../../raiz/kit";
import type { Zoom } from "../../types";

// Mesmo vídeo e transcrição do reel-01, versão raiz: tela cheia + intervenções pontuais.
// Pontos dos zooms (em % do quadro) marcados nos quadros congelados da gravação da tela.

export const reel01RaizZooms: Zoom[] = [
  { from: 13.15, to: 14.8, scale: 1.8, x: 43.5, y: 16, freeze: true }, // Vencedoras 100,00%
  { from: 18.21, to: 19.85, scale: 1.8, x: 66, y: 38.5, freeze: true }, // R$ 2.823,00
  { from: 33.93, to: 35.55, scale: 1.8, x: 34.5, y: 18, freeze: true }, // Vencedoras 96,30%
  { from: 43.4, to: 47.37, scale: 1.18, x: 60, y: 45, slow: true }, // curva de ganhos
  { from: 49.49, to: 51.6, scale: 1.15, x: 50, y: 40 }, // "mentoria Trader 360"
  { from: 68.75, to: 72.2, scale: 1.2, x: 50, y: 40 }, // "quem se dedicar"
];

export const Reel01RaizScenes: React.FC = () => (
  <>
    <TopText from={0} to={5.3} text={"8 OPERAÇÕES.\n8 ACERTOS."} />

    <Scribble from={13.3} to={14.8} x={470} y={307} w={700} h={170} />
    <Scribble from={18.35} to={19.85} x={713} y={739} w={440} h={150} />
    <Pop from={30.81} to={32.4} text="R$ 19.757" sub="NA SEMANA" y={620} size={170} />
    <Scribble from={34.05} to={35.55} x={373} y={346} w={680} h={170} />
    <StampRaiz from={40.19} to={41.8} text="SEM PREÇO MÉDIO" />
    <DisclaimerRaiz from={16.8} to={47.37} />

    <TopText from={49.49} to={52.4} text="MENTORIA TRADER 360" />
    <Pop from={52.41} to={54.6} text="COMENTA 360" color="white" y={250} size={120} />
    <Pop from={75.79} to={77.5} text="100%" sub="DE ACERTO HOJE" color="green" y={220} size={160} />
    <Pop from={81.07} to={82.56} text="COMENTA 360" color="yellow" y={250} size={120} />
  </>
);
