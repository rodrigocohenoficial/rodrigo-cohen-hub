import React from "react";
import { DisclaimerRaiz, Pop, Scribble, StampRaiz, TopText } from "../../raiz/kit";
import type { Zoom } from "../../types";

// Resultado do dia + robô + Mentoria Trader 360. Raiz, 1,1x, pausas encurtadas, frase de promessa cortada.
// Tempos = segundos da fala já cortada. 0–53,6s tela da plataforma · 53,6s em diante rosto.

export const reel04Zooms: Zoom[] = [
  { from: 23.3, to: 25.2, scale: 1.6, x: 45, y: 39, freeze: true }, // coluna 6 / 6 / 0
  { from: 25.6, to: 27.2, scale: 1.7, x: 54.6, y: 24, freeze: true }, // R$ 4.320,00
  { from: 33.7, to: 35.6, scale: 1.15, x: 50, y: 50, slow: true }, // gráfico
  { from: 47.4, to: 49.0, scale: 1.8, x: 46, y: 49.8, freeze: true }, // robô 1 220.00
  { from: 53.7, to: 55.5, scale: 1.15, x: 50, y: 40 }, // "tá surreal esse placar"
  { from: 72.5, to: 74.1, scale: 1.15, x: 50, y: 40 }, // "aqui a gente fala a verdade"
];

export const Reel04Scenes: React.FC = () => (
  <>
    <TopText from={0} to={5.7} text={"6 OPERAÇÕES.\n6 ACERTOS."} />

    {/* sala da Trader Nation */}
    <Pop from={8.3} to={10.6} text="SALA AO VIVO" sub="LINK NA BIO" color="white" y={700} size={110} />
    <Pop from={15.5} to={17.9} text="ANÁLISES COM IA" color="yellow" y={700} size={100} />

    {/* prova: 6 de 6 e o valor do dia */}
    <Scribble from={23.4} to={25.2} x={486} y={749} w={230} h={400} />
    <Scribble from={25.7} to={27.2} x={590} y={464} w={400} h={140} />
    <Pop from={31.6} to={33.5} text="VOLTA AO AJUSTE" color="white" y={700} size={100} />
    <Pop from={36.4} to={38.4} text="100% DE ACERTO" color="green" y={700} size={110} />

    {/* robô */}
    <Pop from={39.6} to={41.4} text="ROBÔ: 10 OPERAÇÕES" color="white" y={700} size={90} />
    <Pop from={45.6} to={47.3} text="R$ 1.220" sub="ROBÔ HOJE" color="yellow" y={700} size={140} />
    <Scribble from={47.5} to={49.0} x={500} y={956} w={320} h={120} />
    <Pop from={49.6} to={50.9} text="3 TRADES CURTOS" color="white" y={700} size={90} />
    <Pop from={51.0} to={53.5} text="100% DE ACERTO" color="green" y={700} size={110} />
    <DisclaimerRaiz from={22.0} to={53.6} />

    {/* rosto: oferta */}
    <Pop from={57.0} to={59.7} text="COMENTA 360" color="yellow" y={250} size={120} />
    <TopText from={61.1} to={64.0} text="MENTORIA TRADER 360" />
    <StampRaiz from={72.6} to={74.2} text="A VERDADE" y={250} />
  </>
);
