import React from "react";
import { CaixasGancho } from "../../flavia/CaixasGancho";
import { Frase, Ingrediente } from "../../flavia/kit";
import { Publicidade } from "../../flavia/Publicidade";
import { Checklist, Headline, Scene } from "../../kit";
import type { Transcript } from "../../types";

// Demo sem gravação, só para testar a instalação e ver o estilo. Num Reel real os tempos vêm do Whisper.
const frases: [number, number, string][] = [
  [0.0, 2.4, "Creatina não é só para homem."],
  [2.6, 5.4, "Depois dos 30 a gente perde massa muscular."],
  [5.6, 8.6, "Treino de força, proteína e sono vêm primeiro."],
  [8.8, 11.6, "A creatina pode somar nessa estratégia."],
  [11.8, 14.6, "Você já usa? Me conta aqui nos comentários."],
];

export const demoTranscript: Transcript = {
  duration: 15,
  words: frases.flatMap(([start, end, text]) => {
    const ws = text.split(" ");
    const step = (end - start) / ws.length;
    return ws.map((word, i) => ({ word, start: start + i * step, end: start + (i + 1) * step }));
  }),
};

export const DemoScenes: React.FC = () => (
  <>
    <Publicidade />
    <Scene from={0} to={2.5}>
      <CaixasGancho from={0.05} to={2.5} amarela="Creatina não é só para homem" branca="e eu te explico por quê" y={300} />
    </Scene>
    <Scene from={2.5} to={5.5}>
      <Headline at={2.6} text="Depois dos 30, *perdemos* massa muscular" size={80} />
    </Scene>
    <Scene from={5.5} to={8.7}>
      <Checklist
        title="A base vem primeiro"
        titleAt={5.6}
        items={[
          { text: "Treino de força", at: 6.0 },
          { text: "Proteína", at: 7.0 },
          { text: "Sono", at: 7.9 },
        ]}
      />
    </Scene>
    <Scene from={8.7} to={11.7}>
      <Ingrediente at={8.8} id="capsula" nome="Creatina" size={220} />
      <div style={{ height: 30 }} />
      <Frase at={9.6} text="pode somar nessa estratégia 🤍" />
    </Scene>
    <Scene from={11.7} to={15}>
      <CaixasGancho from={11.8} to={15} amarela="Você já usa creatina?" branca="Me conta aqui nos comentários" y={300} />
    </Scene>
  </>
);
