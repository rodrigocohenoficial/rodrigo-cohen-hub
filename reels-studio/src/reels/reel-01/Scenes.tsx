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
