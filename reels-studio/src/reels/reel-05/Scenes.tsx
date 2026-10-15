import React from "react";
import { DisclaimerRaiz, Pop, Scribble, StampRaiz, TopText } from "../../raiz/kit";
import type { Zoom } from "../../types";

// Resultado de hoje, de ontem, do mês e do robô + Mentoria Trader 360. Raiz, 1,1x, pausas encurtadas.
// Tempos = segundos da fala já cortada. 0–31,3s tela da plataforma · 31,3s em diante rosto.
// Nos congelamentos a origem do zoom fica no número, então o círculo fica no mesmo ponto.

export const reel05Zooms: Zoom[] = [
  { from: 5.2, to: 6.8, scale: 1.6, x: 43.5, y: 39, freeze: true }, // hoje: R$ 1.240,00
  { from: 7.9, to: 9.0, scale: 1.6, x: 40.2, y: 25.8, freeze: true }, // ontem: R$ 2.040,00
  { from: 13.0, to: 14.3, scale: 1.5, x: 75, y: 14.7, freeze: true }, // ontem: R$ -1.600,00 na notícia
  { from: 19.7, to: 21.2, scale: 1.7, x: 52, y: 26.6, freeze: true }, // mês: 89,09%
  { from: 26.4, to: 27.6, scale: 1.6, x: 58.3, y: 47.65, freeze: true }, // robô: 1 550.00
  { from: 28.3, to: 29.5, scale: 1.6, x: 55.6, y: 43.75, freeze: true }, // robô: -10.00
  { from: 31.4, to: 32.8, scale: 1.15, x: 50, y: 40 }, // "tamo junto"
  { from: 42.7, to: 44.5, scale: 1.12, x: 50, y: 40 }, // "com responsabilidade"
];

export const Reel05Scenes: React.FC = () => (
  <>
    <TopText from={0} to={3.0} text={"ONTEM EU ERREI UMA.\nHOJE: 5 DE 5."} />

    {/* hoje */}
    <Pop from={3.0} to={4.1} text="100% DE ACERTO" color="green" y={700} size={110} />
    <Pop from={4.1} to={5.1} text="20 CONTRATOS" color="white" y={700} size={100} />
    <Scribble from={5.25} to={6.8} x={470} y={748} w={420} h={130} />

    {/* ontem */}
    <Pop from={7.0} to={7.85} text="ONTEM" color="yellow" y={700} size={130} />
    <Scribble from={7.95} to={9.0} x={434} y={496} w={420} h={130} />
    <Pop from={10.2} to={12.6} text="5 DE 6" sub="ONTEM · 1 STOP" color="white" y={700} size={130} />
    <Scribble from={13.05} to={14.3} x={810} y={282} w={400} h={120} />
    <Pop from={13.05} to={14.3} text="NA HORA DA NOTÍCIA" color="yellow" y={760} size={90} />

    {/* mês */}
    <Pop from={14.4} to={17.6} text="E O MÊS?" color="yellow" y={700} size={140} />
    <Pop from={17.7} to={19.6} text="55 OPERAÇÕES" sub="NO MÊS" color="white" y={700} size={110} />
    <Scribble from={19.75} to={21.2} x={562} y={510} w={340} h={120} />

    {/* robô */}
    <Pop from={21.3} to={23.6} text="E O ROBÔ?" color="yellow" y={700} size={140} />
    <Pop from={23.7} to={26.2} text="MELHOR QUE EU" sub="O ROBÔ" color="white" y={700} size={110} />
    <Scribble from={26.45} to={27.6} x={615} y={905} w={480} h={150} />
    <Pop from={26.45} to={27.6} text="R$ 1.550" sub="ROBÔ HOJE" color="yellow" y={420} size={130} />
    <Scribble from={28.35} to={29.5} x={600} y={840} w={300} h={110} />
    <DisclaimerRaiz from={0} to={31.3} />

    {/* rosto: oferta */}
    <TopText from={32.8} to={35.1} text="MENTORIA TRADER 360" />
    <Pop from={35.2} to={37.8} text="COMENTA 360" color="yellow" y={250} size={120} />
    <StampRaiz from={42.7} to={44.5} text="RESPONSABILIDADE" y={250} />
    <Pop from={44.6} to={46} text="VIRAR A CHAVE" color="yellow" y={250} size={110} />
  </>
);
