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
