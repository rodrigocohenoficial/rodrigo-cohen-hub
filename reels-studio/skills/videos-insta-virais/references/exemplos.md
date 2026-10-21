# Exemplos reais

Índice: [Registro](#registro) · [Design/split](#designsplit--reel-01-resultado-do-dia-reel-01) · [Raiz](#raiz--mesmo-vídeo-reel-01-raiz) · [Flávia](#flávia--promeno-flavia-01-tema-flavia-11x) · [Plano aprovado](#plano-aprovado-do-reel-01) · [Design 60/40](#design-6040--reel-02-quanto-dinheiro-pra-começar-reel-02-6040) · [Jornal longo](#jornal-longo--reel-03-resposta-de-caixinha-reel-03)

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

## Design 60/40 — Reel 02, quanto dinheiro pra começar (`reel-02-6040`)

Registro: `{ id: "reel-02-6040", media: "reel-02", Scenes: Reel02Scenes, velocidade: 1.1, divisao: 0.4, facePosition: "50% 40%" }`

```tsx
import React from "react";
import { Caixinha, Card, Checklist, Headline, Lupa, Scene, Stamp } from "../../kit";

// Tempos = segundos da fala depois de encurtar as pausas. Vídeo a 1,1x.

const Gap: React.FC<{ h?: number }> = ({ h = 40 }) => <div style={{ height: h }} />;
const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", gap: 30, justifyContent: "center" }}>{children}</div>
);

export const Reel02Scenes: React.FC = () => (
  <>
    {/* 1 · "Várias caixinhas me perguntando quanto dinheiro preciso pra começar… pra ser consistente" */}
    <Scene from={0} to={8.1}>
      <Headline at={0.05} text="Quanto dinheiro eu preciso pra *começar?*" size={84} />
      <Gap h={50} />
      <Caixinha at={0.5} pergunta="Quanto preciso pra começar?" rotate={-3} />
      <Gap h={24} />
      <Caixinha at={4.96} pergunta="E pra ser consistente?" rotate={2} />
    </Scene>

    {/* 2 · "o dinheiro não tem nada a ver com a consistência… com começar" */}
    <Scene from={8.1} to={12.95}>
      <Checklist
        title="O dinheiro não decide"
        titleAt={8.22}
        items={[
          { text: "Sua consistência", at: 9.1, ok: false },
          { text: "Seu começo", at: 11.12, ok: false },
        ]}
      />
    </Scene>

    {/* 3 · "o dinheiro é só uma lupa… aumenta quem a gente realmente é" */}
    <Scene from={12.95} to={20.15}>
      <Headline at={13.17} text="Dinheiro é só uma *lupa*" size={84} />
      <Gap h={30} />
      <Lupa at={14.39} texto={"quem você\nrealmente é"} aumentaAt={18.03} size={380} />
    </Scene>

    {/* 4 · "se você me fez essa pergunta: não tem conhecimento… não tem dinheiro" */}
    <Scene from={20.15} to={24.5}>
      <Headline at={20.37} text="Se você fez essa pergunta:" size={66} serif={false} />
      <Gap h={50} />
      <Row>
        <Card at={22.25} label="Falta" value="Conhecimento" width={440} valueSize={52} tone="loss" />
        <Card at={23.63} label="Falta" value="Dinheiro" width={440} valueSize={52} tone="loss" />
      </Row>
    </Scene>

    {/* 5 · sem dinheiro: junta aos poucos, renda fixa, não depender do dinheiro do trade, reserva de emergência */}
    <Scene from={24.5} to={37.5}>
      <Checklist
        title="Sem dinheiro?"
        titleAt={24.59}
        items={[
          { text: "Junte aos poucos", at: 26.16 },
          { text: "Tudo na renda fixa", at: 28.27 },
          { text: "Depender do trade", at: 31.71, ok: false },
          { text: "Reserva de emergência", at: 36.61 },
        ]}
      />
    </Scene>

    {/* 6 · sem conhecimento: siga quem vai te levar onde você quer chegar */}
    <Scene from={37.5} to={45.0}>
      <Headline at={37.61} text="Sem conhecimento?" size={66} serif={false} />
      <Gap h={40} />
      <Headline at={39.74} text="Siga quem *já chegou* onde você quer chegar" size={84} />
    </Scene>

    {/* 7 · "pessoas que já chegaram… comprovadamente" */}
    <Scene from={45.0} to={50.4}>
      <Headline at={45.13} text="Quem já chegou," size={84} />
      <Gap h={50} />
      <Stamp at={47.58} text="COM PROVA" tone="gain" rotate={-5} />
    </Scene>

    {/* 8 · "não pessoas exibindo um milhão de coisas pra enganar trouxa" */}
    <Scene from={50.4} to={54.8}>
      <Headline at={50.45} text="Não quem vive de *exibir*" size={84} />
      <Gap h={50} />
      <Stamp at={53.57} text="EXIBIR ≠ PROVAR" tone="loss" rotate={-4} size={84} />
    </Scene>

    {/* 9 · "Pensa nisso." + CTA de compartilhamento */}
    <Scene from={54.8} to={56.6}>
      <Headline at={54.86} text="Pensa *nisso*." size={110} />
      <Gap h={40} />
      <Headline at={55.3} text="Manda pra quem vive te perguntando isso" size={46} serif={false} />
    </Scene>
  </>
);

```

## Jornal longo — Reel 03, resposta de caixinha (`reel-03`)

Registro: `{ id: "reel-03", style: "jornal", Scenes: Reel03Scenes, zooms: reel03Zooms, velocidade: 1.1, videoY: 260, mancheteTop: 200, mancheteSize: 52, legendaY: 1380, manchetes: [{ from: 0, text: "*Como eu faço a transição de carreira corretamente?* Quero empreender no trade" }] }`

```tsx
import React from "react";
import { Capitulos } from "../../jornal/Capitulo";
import { Pop, StampRaiz } from "../../raiz/kit";
import type { Zoom } from "../../types";

// Vídeo longo (resposta à caixinha sobre transição de carreira), estilo jornal com a pergunta fixa.
// Tempos = segundos da fala depois de encurtar as pausas. Vídeo a 1,1x.

const Y = 1540; // frases estourando na altura do peito, abaixo da legenda
const destaques: { at: number; text: string; dur?: number; cor?: "white" | "yellow" | "green" }[] = [
  { at: 17.37, text: "O PROBLEMA É VOCÊ?" },
  { at: 37.77, text: "ASSESSOR", cor: "white" },
  { at: 45.21, text: "ANALISTA", cor: "white" },
  { at: 55.06, text: "PROFESSOR", cor: "white" },
  { at: 69.75, text: "ROBÔS E AUTOMAÇÃO", cor: "white" },
  { at: 80.89, text: "INFLUENCIADOR", cor: "white" },
  { at: 121.84, text: "\"NÃO TENHO PLANO B\"" },
  { at: 143.09, text: "TENHA UM LIMITE" },
  { at: 159.3, text: "1 · RESERVA", cor: "green" },
  { at: 173.79, text: "2 · PLANO DEFINIDO", cor: "green" },
  { at: 196.81, text: "HUMILDADE PRA AJUSTAR", cor: "white" },
  { at: 217.35, text: "3 · SEGUIR O PLANO", cor: "green" },
  { at: 229.85, text: "TI → MERCADO", cor: "white" },
  { at: 280.51, text: "PENSE EM LONGO PRAZO" },
  { at: 296.99, text: "DEFINA AS MÉTRICAS", cor: "white" },
  { at: 311.42, text: "CONSISTÊNCIA = PLANO + SEGUIR", dur: 3.5 },
  { at: 351.59, text: "METAS MENORES E MENSURÁVEIS", dur: 3.5 },
  { at: 364.55, text: "MUDA O AMBIENTE" },
  { at: 412.88, text: "A GENTE FALA, A GENTE FAZ" },
];

const carimbos: { at: number; text: string }[] = [
  { at: 60.33, text: "RESPONSABILIDADE" },
  { at: 152.43, text: "STOP DE CARREIRA" },
  { at: 235.17, text: "ERREI MUITO" },
  { at: 331.13, text: "SEM ALMOÇO GRÁTIS" },
];

// Zoom leve no rosto nos pontos fortes (rosto fica em ~28% do quadro deslocado).
export const reel03Zooms: Zoom[] = [...destaques, ...carimbos]
  .map(({ at }) => ({ from: at, to: at + 2.2, scale: 1.12, x: 50, y: 30 }))
  .sort((a, b) => a.from - b.from);

export const Reel03Scenes: React.FC = () => (
  <>
    <Capitulos
      capitulos={[
        { from: 22.1, to: 100.8, text: "1 · Jeitos de empreender no trade" },
        { from: 100.8, to: 155.6, text: "2 · O seu limite" },
        { from: 155.6, to: 227.4, text: "3 · Reserva, plano e disciplina" },
        { from: 227.4, to: 337.5, text: "4 · A minha transição" },
        { from: 337.5, to: 414.1, text: "5 · Fatia a meta, muda o ambiente" },
      ]}
      y={470}
    />
    {destaques.map((d) => (
      <Pop key={d.at} from={d.at} to={d.at + (d.dur ?? 2.6)} text={d.text} color={d.cor ?? "yellow"} y={Y} size={d.text.length > 14 ? 58 : 70} />
    ))}
    {carimbos.map((c) => (
      <StampRaiz key={c.at} from={c.at} to={c.at + 2.4} text={c.text} y={Y - 20} />
    ))}
    <Pop from={419.08} to={422.2} text="FICOU ATÉ O FINAL?" sub="COMENTA AQUI 👇" color="yellow" y={Y - 40} size={70} />
  </>
);

```
