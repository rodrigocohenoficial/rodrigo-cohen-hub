import React from "react";
import { DisclaimerRaiz, Pop, Scribble, StampRaiz } from "../../raiz/kit";
import type { Zoom } from "../../types";

// Topo de funil: "meu resultado não muda nada na sua vida" → resultado da semana com o erro do CPI → QG gratuito.
// Estilo jornal, 1,1x, pausas encurtadas. Tempos = segundos da fala já cortada.
// 0–30,9s tela da plataforma · 30,9s em diante rosto. Nos congelamentos a origem do zoom fica no número.

export const reel06Zooms: Zoom[] = [
  { from: 4.9, to: 6.4, scale: 1.6, x: 38, y: 36, freeze: true }, // hoje: R$ 1.000,00
  { from: 7.5, to: 8.9, scale: 1.6, x: 66.3, y: 34.7, freeze: true }, // 100,00%
  { from: 17.3, to: 18.9, scale: 1.6, x: 56.8, y: 56.8, freeze: true }, // R$ -1.600,00 do CPI
  { from: 21.0, to: 22.6, scale: 1.7, x: 78.7, y: 35, freeze: true }, // fator de lucro 4,93
  { from: 24.0, to: 26.2, scale: 1.7, x: 67.5, y: 28.4, freeze: true }, // 89,66%
  { from: 28.3, to: 30.4, scale: 1.15, x: 60, y: 60, slow: true }, // curva de ganhos
  { from: 41.9, to: 43.4, scale: 1.12, x: 50, y: 35 }, // "QG do Cohen"
  { from: 45.2, to: 47.0, scale: 1.12, x: 50, y: 35 }, // "digita aqui embaixo QG"
];

const Y = 1560; // destaques abaixo da legenda

export const Reel06Scenes: React.FC = () => (
  <>
    {/* tela */}
    <Scribble from={4.95} to={6.4} x={410} y={691} w={420} h={130} />
    <Scribble from={7.55} to={8.9} x={716} y={667} w={360} h={120} />
    <Pop from={12.1} to={12.9} text="20 OPERAÇÕES" sub="NA SEMANA" color="white" y={Y} size={90} />
    <Pop from={12.9} to={14.3} text="95% DE ACERTO" color="green" y={Y} size={100} />
    <StampRaiz from={15.5} to={17.2} text="1 ERRO" y={Y} />
    <Scribble from={17.35} to={18.9} x={613} y={1091} w={420} h={120} />
    <Pop from={17.35} to={18.9} text="NA HORA DO CPI" color="yellow" y={Y} size={90} />
    <Scribble from={21.05} to={22.6} x={850} y={672} w={240} h={110} />
    <Pop from={21.05} to={22.6} text="FATOR DE LUCRO" color="white" y={Y} size={90} />
    <Scribble from={24.05} to={26.2} x={729} y={545} w={360} h={120} />
    <Pop from={24.05} to={26.2} text="ACERTO NO MÊS" color="green" y={Y} size={90} />
    <DisclaimerRaiz from={0} to={30.9} top={1780} />

    {/* rosto: comunidade gratuita */}
    <Pop from={33.3} to={35.6} text="SALA AO VIVO" sub="EM TEMPO REAL" color="white" y={Y} size={100} />
    <Pop from={36.4} to={38.3} text="ANALISTA" color="yellow" y={Y} size={110} />
    <Pop from={39.8} to={41.2} text="LINK NA BIO" color="white" y={Y} size={100} />
    <Pop from={41.9} to={44.1} text="QG DO COHEN" color="yellow" y={Y} size={110} />
    <StampRaiz from={44.2} to={45.1} text="GRATUITA" y={Y} />
    <Pop from={45.2} to={47.8} text="COMENTA QG" color="yellow" y={Y} size={120} />
    <StampRaiz from={48.9} to={50.3} text="SEXTOU" y={Y} />
  </>
);
