import React from "react";
import { CandleChart, Counter, GateCard, Headline, Scene, Stamp } from "../../kit";
import type { Transcript } from "../../types";

// Demo sem gravação: texto e tempos simulados. Num Reel real os tempos vêm do Whisper.
const phrases: [number, number, string][] = [
  [0.0, 1.6, "Robô que opera sozinho?"],
  [1.8, 3.4, "Eu nunca deixei."],
  [3.6, 6.0, "Opero com automação desde 2012."],
  [6.2, 9.0, "O robô executa. Quem aprova sou eu."],
  [9.2, 12.6, "Entrada, stop e alvo definidos antes do clique."],
  [12.8, 15.2, "Se o plano não fecha, não tem ordem."],
];

export const demoTranscript: Transcript = {
  duration: 16,
  words: phrases.flatMap(([start, end, text]) => {
    const ws = text.split(" ");
    const step = (end - start) / ws.length;
    return ws.map((word, i) => ({ word, start: start + i * step, end: start + (i + 1) * step }));
  }),
};

const closes = [100, 101, 99.5, 100.5, 102, 101, 100, 101.5, 103, 102.5, 103.5, 104.2, 105, 104.5, 106, 107, 106.5, 108, 109, 108.5, 110, 111, 112, 112.5];

export const DemoScenes: React.FC = () => (
  <>
    <Scene from={0} to={3.5}>
      <Headline at={0.05} text="Robô que opera *sozinho?*" />
      <div style={{ height: 50 }} />
      <Stamp at={2.33} text="NUNCA" />
    </Scene>

    <Scene from={3.5} to={6.1}>
      <Counter at={4.5} from={1990} to={2012} plain duration={1} label="automação desde" labelPosition="above" />
    </Scene>

    <Scene from={6.1} to={9.1}>
      <GateCard at={6.2} question="Executar a ordem?" options={["Sim, aprovar", "Não, ajustar"]} choose={0} chooseAt={7.8} />
    </Scene>

    <Scene from={9.1} to={12.7}>
      <CandleChart
        at={9.0}
        drawFor={2}
        closes={closes}
        levels={[
          { label: "Entrada", price: 104, at: 9.2, tone: "brass" },
          { label: "Stop", price: 101, at: 9.62, tone: "loss" },
          { label: "Alvo", price: 112, at: 10.47, tone: "gain" },
        ]}
      />
    </Scene>

    <Scene from={12.7} to={16}>
      <Headline at={12.8} text="Plano não *fecha?*" size={100} />
      <div style={{ height: 50 }} />
      <Stamp at={14.3} text="SEM ORDEM" tone="brass" rotate={-5} />
    </Scene>
  </>
);
