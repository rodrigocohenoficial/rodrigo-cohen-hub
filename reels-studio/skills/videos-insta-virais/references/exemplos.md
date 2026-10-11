# Exemplos reais

Índice: [Registro](#registro) · [Design/split](#designsplit--reel-01-resultado-do-dia-reel-01) · [Raiz](#raiz--mesmo-vídeo-reel-01-raiz) · [Flávia](#flávia--promeno-flavia-01-tema-flavia-11x) · [Plano aprovado](#plano-aprovado-do-reel-01)

Os tempos são segundos da fala depois dos cortes de cada vídeo; servem de modelo de estrutura, não de valores.

<a id="registro"></a>

Registro completo (de `src/reels/index.ts` do estúdio original):

```ts
import type { ReelDef } from "../types";
import { DemoScenes, demoTranscript } from "./demo/Scenes";
import { Flavia01Scenes } from "./flavia-01/Scenes";
import { Reel01Scenes } from "./reel-01/Scenes";
import { Reel01RaizScenes, reel01RaizZooms } from "./reel-01-raiz/Scenes";

// Cada Reel novo entra aqui.
export const reels: ReelDef[] = [
  { id: "demo", Scenes: DemoScenes, tag: "Rodrigo Cohen · Automação híbrida", demo: { transcript: demoTranscript } },
  {
    id: "reel-01",
    Scenes: Reel01Scenes,
    tag: "Rodrigo Cohen · Resultado do dia",
    faceSegments: [
      { from: 0, position: "50% 45%" }, // tela da plataforma
      { from: 47.37, position: "50% 26%" }, // rosto
    ],
  },
  { id: "reel-01-raiz", style: "raiz", media: "reel-01", Scenes: Reel01RaizScenes, zooms: reel01RaizZooms },
  // Exemplo do estilo jornal com a gravação do reel-01 (só para ver o visual).
  {
    id: "exemplo-jornal",
    style: "jornal",
    media: "reel-01",
    Scenes: () => null,
    manchetes: [
      { from: 0, text: "*8 operações, 8 acertos:* o que realmente importa no resultado do dia?" },
      { from: 47.37, text: "*Mentoria Trader 360* começa semana que vem: como participar?" },
    ],
  },
  {
    id: "flavia-01",
    tema: "flavia",
    velocidade: 1.1,
    Scenes: Flavia01Scenes,
    tag: "@flaviavcohen",
    faceSegments: [
      { from: 0, position: "50% 0%" }, // em pé, andando
      { from: 20.45, position: "50% 8%" }, // sentada à mesa
    ],
  },
];

```

## Design/split — Reel 01, resultado do dia (`reel-01`)

```tsx
import React from "react";
import { Card, Checklist, Counter, Disclaimer, EquityCurve, Headline, Scene, Stamp, TradeDots } from "../../kit";

// Tempos = segundos da fala já cortada (ver plano.md). 0–47,4s tela da plataforma · 47,4s em diante rosto.

const Gap: React.FC<{ h?: number }> = ({ h = 44 }) => <div style={{ height: h }} />;

export const Reel01Scenes: React.FC = () => (
  <>
    {/* 1 · "R$ 2 mil, não importa o valor… só se botar muito, é mole" */}
    <Scene from={0} to={5.3}>
      <Headline at={0.45} text="O valor *não importa.*" />
      <Gap />
      <Headline at={3.25} text="Contrato a mais, qualquer um bota." size={52} serif={false} />
    </Scene>

    {/* 2 · "operações curtas, 2 minutos… tradear curtinho" */}
    <Scene from={5.3} to={12.9}>
      <Headline at={7.6} text="Operações *curtas*" size={90} />
      <Gap />
      <Counter at={9.19} from={0} to={2} duration={0.5} suffix=" min" label="tempo médio por operação" size={170} />
    </Scene>

    {/* 3 · "100% de acerto, 8 operações" */}
    <Scene from={12.9} to={16.8}>
      <Counter at={13.15} to={100} duration={0.8} suffix="%" label="de acerto" />
      <Gap h={56} />
      <TradeDots at={15.65} count={8} size={64} />
      <Disclaimer />
    </Scene>

    {/* 4 · "deram R$ 2.823, majoritariamente com 20 contratos" */}
    <Scene from={16.8} to={25.2}>
      <Counter at={18.21} to={2823} duration={1.1} prefix="R$ " label="no dia" size={170} />
      <Gap h={56} />
      <Card at={21.23} label="Contratos" value="20" width={360} />
      <Disclaimer />
    </Scene>

    {/* 5 · "resultado semanal… quase R$ 20 mil… 27 operações" */}
    <Scene from={25.2} to={33.8}>
      <Headline at={25.9} text="Na *semana*" size={80} />
      <Gap />
      <Counter at={30.81} to={19757} duration={1.1} prefix="R$ " label="líquido" size={150} />
      <Gap />
      <TradeDots at={31.77} count={27} losses={[17]} stagger={0.04} size={46} />
      <Disclaimer />
    </Scene>

    {/* 6 · "96,3% de acerto… sem fazer preço médio" */}
    <Scene from={33.8} to={41.7}>
      <Counter at={33.93} to={96.3} decimals={1} duration={0.9} suffix="%" label="de acerto na semana" />
      <Gap h={70} />
      <Stamp at={40.19} text="SEM PREÇO MÉDIO" tone="brass" rotate={-4} size={68} />
      <Disclaimer />
    </Scene>

    {/* 7 · "curva de ganhos, achei razoável" */}
    <Scene from={41.7} to={47.4}>
      <EquityCurve
        at={43.4}
        drawFor={2.2}
        values={[0, 0, 2.8, 2.8, 5.1, 5.1, 7.9, 7.9, 7.1, 7.1, 10.4, 10.4, 13.2, 13.2, 16.6, 16.6, 19.8]}
        label="Curva de ganhos da semana"
      />
      <Disclaimer />
    </Scene>

    {/* 8 · "começa a mentoria Trader 360… digita aqui embaixo 360" */}
    <Scene from={47.4} to={55.8}>
      <Headline at={47.6} text="Semana que vem:" size={60} serif={false} />
      <Gap h={20} />
      <Headline at={49.49} text="Mentoria *Trader 360*" size={84} />
      <Gap h={70} />
      <Stamp at={52.41} text="COMENTA 360" tone="brass" rotate={-3} />
    </Scene>

    {/* 9 · "turma pequena… um mês de aula à noite, ao vivo… meu operacional e do meu time" */}
    <Scene from={55.8} to={66.2}>
      <Checklist
        title="Trader 360"
        titleAt={55.85}
        items={[
          { text: "Turma pequena", at: 55.97 },
          { text: "Atenção para todos", at: 57.69 },
          { text: "1 mês de aula", at: 59.07 },
          { text: "À noite e ao vivo", at: 61.63 },
          { text: "Meu operacional + do time", at: 63.83 },
        ]}
      />
    </Scene>

    {/* 10a · "tenho certeza que vocês vão gostar" */}
    <Scene from={66.2} to={68.6}>
      <Headline at={66.35} text="Vocês vão *gostar.*" />
    </Scene>

    {/* 10b · "para quem se dedicar… tua chance aumenta muito" */}
    <Scene from={68.6} to={72.3}>
      <Headline at={68.75} text="Quem se *dedica* aumenta a chance." size={96} />
    </Scene>

    {/* 11 · "só tu ver o resultado… 100% de acerto, não é possível" */}
    <Scene from={72.3} to={77.5}>
      <TradeDots at={72.85} count={8} size={64} />
      <Gap h={50} />
      <Counter at={75.79} to={100} duration={0.6} suffix="%" label="de acerto hoje" size={180} />
      <Gap h={40} />
      <Stamp at={76.69} text="8 DE 8" tone="gain" rotate={-5} />
    </Scene>

    {/* 12 · "alguma coisa eu sei fazer… bora, estou te esperando" */}
    <Scene from={77.5} to={82.56}>
      <Headline at={77.65} text="Alguma coisa eu *sei fazer.*" size={96} />
      <Gap h={70} />
      <Stamp at={81.07} text="COMENTA 360" tone="brass" rotate={-3} />
    </Scene>
  </>
);

```

## Raiz — mesmo vídeo (`reel-01-raiz`)

```tsx
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

```

## Flávia — Promeno (`flavia-01`, tema flavia, 1,1x)

```tsx
import React from "react";
import { CaixasGancho } from "../../flavia/CaixasGancho";
import { Fases, Frase, Ingrediente, ProdutoCard } from "../../flavia/kit";
import { Publicidade } from "../../flavia/Publicidade";
import { Card, Checklist, Headline, Scene } from "../../kit";

// Tempos = segundos da fala já cortada (sem silêncio inicial, sem "Tchau!" e com as pausas encurtadas).

const Gap: React.FC<{ h?: number }> = ({ h = 40 }) => <div style={{ height: h }} />;
const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => (
  <div style={{ display: "flex", gap, justifyContent: "center", alignItems: "flex-start" }}>{children}</div>
);

export const Flavia01Scenes: React.FC = () => (
  <>
    <Publicidade />

    {/* 1 · Gancho, nas caixas amarela/branca dela */}
    <Scene from={0.0} to={7.07}>
      <CaixasGancho from={0.1} to={7.07} amarela="Nem toda mulher pode fazer reposição hormonal" branca="e não precisa sofrer nessa fase" y={300} />
    </Scene>

    {/* 2 · "dúvida muito comum no consultório" */}
    <Scene from={7.07} to={9.46}>
      <Headline at={7.08} text="A dúvida *mais comum* do meu consultório" size={86} />
    </Scene>

    {/* 3 · "pode ou quer… contraindicações… não desejam… tá tudo bem" */}
    <Scene from={9.46} to={18.66}>
      <Headline at={9.51} text="Nem toda mulher *pode* ou *quer*" size={70} />
      <Gap h={50} />
      <Row>
        <Card at={13.42} label="Algumas têm" value="Contraindicação" width={440} valueSize={46} />
        <Card at={15.24} label="Outras" value="Não desejam" width={440} valueSize={46} />
      </Row>
      <Gap h={50} />
      <Frase at={17.81} text="E tá tudo bem 🤍" size={60} />
    </Scene>

    {/* 4 · "outras estratégias… perimenopausa e menopausa… qualidade de vida" */}
    <Scene from={18.66} to={27.58}>
      <Headline at={20.42} text="Outras *estratégias*" size={96} />
      <Gap h={50} />
      <Fases
        fases={[
          { nome: "Perimenopausa", at: 24.45 },
          { nome: "Menopausa", at: 25.59 },
        ]}
      />
      <Gap h={44} />
      <Frase at={26.53} text="com mais qualidade de vida" size={48} />
    </Scene>

    {/* 5 · a base: alimentação, atividade, sono, estresse */}
    <Scene from={27.58} to={32.77}>
      <Checklist
        title="A base de tudo"
        titleAt={27.63}
        items={[
          { text: "Alimentação equilibrada", at: 28.07 },
          { text: "Atividade física", at: 29.45 },
          { text: "Sono de qualidade", at: 30.57 },
          { text: "Controle do estresse", at: 31.84 },
        ]}
      />
    </Scene>

    {/* 6 · "alguns suplementos também podem fazer parte" */}
    <Scene from={32.77} to={36.05}>
      <Headline at={32.98} text="E alguns *suplementos* podem somar" size={86} />
    </Scene>

    {/* 7 · Promeno da Always Fit */}
    <Scene from={36.05} to={45.18}>
      <ProdutoCard at={36.4} src="reels/flavia-01/produto.png" nome="Promeno" marca="Always Fit" />
      <Gap h={50} />
      <Frase at={40.49} text="Ingredientes conhecidos da saúde feminina" size={46} />
    </Scene>

    {/* 8 · óleo de linhaça, borragem, prímula */}
    <Scene from={45.18} to={55.18}>
      <Frase at={45.28} text="Óleos de" size={44} dim />
      <Gap h={30} />
      <Row gap={10}>
        <Ingrediente at={45.71} id="linhaca" nome="Linhaça" />
        <Ingrediente at={46.97} id="borragem" nome="Borragem" />
        <Ingrediente at={48.73} id="primula" nome="Prímula" />
      </Row>
      <Gap h={50} />
      <Frase at={49.49} text="Compostos naturais cada vez mais estudados" size={44} />
    </Scene>

    {/* 9 · ácido gama-linolênico */}
    <Scene from={55.18} to={58.09}>
      <Card at={55.27} label="Ricos em" value="Ácido gama-linolênico" width={820} />
    </Scene>

    {/* 10 · vitamina E, antioxidante */}
    <Scene from={58.09} to={65.2}>
      <Frase at={58.15} text="O Promeno também tem" size={46} />
      <Gap h={24} />
      <Ingrediente at={59.98} id="vitaminaE" nome="Vitamina E" size={230} />
      <Gap h={40} />
      <Frase at={61.16} text="Antioxidante" size={64} />
      <Gap h={16} />
      <Frase at={62.58} text="ajuda a proteger as células contra o estresse oxidativo" size={40} dim />
    </Scene>

    {/* 11 · não existe milagre */}
    <Scene from={65.2} to={75.67}>
      <Headline at={67.56} text="Não existe suplemento que faça *milagre*." size={88} />
      <Gap h={50} />
      <Frase at={70.04} text="Nenhuma cápsula substitui um estilo de vida saudável." size={46} />
      <Gap h={44} />
      <Card at={73.34} label="Suplemento é" value="uma ferramenta" width={600} />
    </Scene>

    {/* 12 · pergunta final, nas caixas dela */}
    <Scene from={75.67} to={84.88}>
      <CaixasGancho from={76.19} to={84.88} amarela="Qual sintoma mais te incomoda nessa fase?" branca="Me conta aqui nos comentários" y={300} />
    </Scene>
  </>
);

```

## Plano aprovado do Reel 01

# Reel 01 · Resultado do dia + Mentoria Trader 360

- **Avatar-alvo:** Frustrado (quer ver resultado real antes de acreditar)
- **Métrica-alvo:** comentário ("360")
- **Bruto:** 93,7s (Vídeo 1 = tela da plataforma, 0–53s · Vídeo 2 = rosto, 53–93s)

## Cortes propostos

| Trecho | Fala | Por quê |
|---|---|---|
| 0,0–6,1s | "Bom, vamos para o resultado do dia da sala… vamos que vamos" | Gancho fraco. O vídeo passa a abrir em "R$ 2 mil, não importa o valor" |
| 76,1–80,2s | "eu quero ver tu não ganhar dinheiro, não estou prometendo, mas cara" | Promessa de ganho junto de venda de mentoria. Risco CNPI/CVM. A frase seguinte ("se tu se dedicar, tua chance aumenta muito") segura a ideia sem o risco |

Resultado: cerca de 83s.

## Layout

- **0–53s (tela):** animação em cima com os números limpos; embaixo, a gravação da plataforma como prova.
- **53–93s (rosto):** animação em cima, você embaixo.
- Nas cenas de resultado, rodapé discreto: "Resultado passado não garante resultado futuro."

## Cenas (segundos do bruto)

| # | Tempo | Fala | Animação |
|---|---|---|---|
| 1 | 6,2–11,3 | "R$ 2 mil, não importa o valor… só se botar muito, é mole" | **"O valor *não importa*."** · depois: "Contrato a mais, qualquer um bota." |
| 2 | 11,4–18,6 | "operações curtas, 2 minutos… tradear curtinho" | Relógio contando **2min** · "tempo médio por operação" |
| 3 | 19,2–23,0 | "100% de acerto, 8 operações" | **100%** contando · 8 bolinhas verdes acendendo uma a uma |
| 4 | 23,2–31,3 | "deram R$ 2.823, majoritariamente com 20 contratos" | **R$ 2.823** contando · cartão "20 contratos" |
| 5 | 31,4–39,9 | "resultado semanal… quase R$ 20 mil… 27 operações" | **R$ 19.757** "na semana" · 27 bolinhas (26 verdes, 1 vermelha) |
| 6 | 40,0–47,6 | "96,3% de acerto… sem fazer preço médio" | **96,3%** · carimbo **SEM PREÇO MÉDIO** |
| 7 | 47,9–53,6 | "curva de ganhos, achei razoável" | Curva de patrimônio subindo em degraus |
| 8 | 53,6–59,6 | "começa a mentoria Trader 360… digita aqui embaixo 360" | **Mentoria *Trader 360*** · "Comenta **360**" |
| 9 | 59,9–72,1 | "link na bio, turma pequena… um mês de aula à noite, ao vivo… meu operacional e do meu time" | Checklist: turma pequena · atenção para todos · 1 mês de aula · à noite e ao vivo · meu operacional + do time |
| 10 | 72,4–83,4 | "para quem se dedicar… tua chance aumenta muito" | **"Quem se *dedica* aumenta a chance."** |
| 11 | 83,5–88,5 | "100% de acerto, não é possível, mano" | **100%** de volta · carimbo **8 DE 8** |
| 12 | 88,8–93,1 | "alguma coisa eu sei fazer… bora, estou te esperando" | CTA final: **Comenta 360** |

## A confirmar

- Nome da mentoria: "Trader 360"?
- Legenda "digita aqui embaixo 360" (você falou "dita")
