import React from "react";
import { CaixasGancho } from "../../flavia/CaixasGancho";
import { Fases, Frase, Ingrediente, ProdutoCard } from "../../flavia/kit";
import { Publicidade } from "../../flavia/Publicidade";
import { Card, Checklist, Headline, Scene } from "../../kit";

// Tempos = segundos da fala já cortada (sem o silêncio inicial e sem o "Tchau!").

const Gap: React.FC<{ h?: number }> = ({ h = 40 }) => <div style={{ height: h }} />;
const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 30 }) => (
  <div style={{ display: "flex", gap, justifyContent: "center", alignItems: "flex-start" }}>{children}</div>
);

export const Flavia01Scenes: React.FC = () => (
  <>
    <Publicidade />

    {/* 1 · Gancho, nas caixas amarela/branca dela */}
    <Scene from={0} to={7.6}>
      <CaixasGancho from={0.1} to={7.6} amarela="Nem toda mulher pode fazer reposição hormonal" branca="e não precisa sofrer nessa fase" y={300} />
    </Scene>

    {/* 2 · "dúvida muito comum no consultório" */}
    <Scene from={7.6} to={10.2}>
      <Headline at={7.7} text="A dúvida *mais comum* do meu consultório" size={86} />
    </Scene>

    {/* 3 · "pode ou quer… contraindicações… não desejam… tá tudo bem" */}
    <Scene from={10.2} to={20.2}>
      <Headline at={10.31} text="Nem toda mulher *pode* ou *quer*" size={70} />
      <Gap h={50} />
      <Row>
        <Card at={14.45} label="Algumas têm" value="Contraindicação" width={440} valueSize={46} />
        <Card at={16.27} label="Outras" value="Não desejam" width={440} valueSize={46} />
      </Row>
      <Gap h={50} />
      <Frase at={19.07} text="E tá tudo bem 🤍" size={60} />
    </Scene>

    {/* 4 · "outras estratégias… perimenopausa e menopausa… qualidade de vida" */}
    <Scene from={20.2} to={29.6}>
      <Headline at={21.97} text="Outras *estratégias*" size={96} />
      <Gap h={50} />
      <Fases
        fases={[
          { nome: "Perimenopausa", at: 26.19 },
          { nome: "Menopausa", at: 27.33 },
        ]}
      />
      <Gap h={44} />
      <Frase at={28.27} text="com mais qualidade de vida" size={48} />
    </Scene>

    {/* 5 · a base: alimentação, atividade, sono, estresse */}
    <Scene from={29.6} to={35.0}>
      <Checklist
        title="A base de tudo"
        titleAt={29.65}
        items={[
          { text: "Alimentação equilibrada", at: 30.09 },
          { text: "Atividade física", at: 31.47 },
          { text: "Sono de qualidade", at: 32.59 },
          { text: "Controle do estresse", at: 34.07 },
        ]}
      />
    </Scene>

    {/* 6 · "alguns suplementos também podem fazer parte" */}
    <Scene from={35.0} to={38.6}>
      <Headline at={35.21} text="E alguns *suplementos* podem somar" size={86} />
    </Scene>

    {/* 7 · Promeno da Always Fit */}
    <Scene from={38.6} to={47.9}>
      <ProdutoCard at={38.95} src="reels/flavia-01/produto.png" nome="Promeno" marca="Always Fit" />
      <Gap h={50} />
      <Frase at={43.21} text="Ingredientes conhecidos da saúde feminina" size={46} />
    </Scene>

    {/* 8 · óleo de linhaça, borragem, prímula */}
    <Scene from={47.9} to={58.9}>
      <Frase at={48.0} text="Óleos de" size={44} dim />
      <Gap h={30} />
      <Row gap={10}>
        <Ingrediente at={48.43} id="linhaca" nome="Linhaça" />
        <Ingrediente at={49.89} id="borragem" nome="Borragem" />
        <Ingrediente at={51.65} id="primula" nome="Prímula" />
      </Row>
      <Gap h={50} />
      <Frase at={52.41} text="Compostos naturais cada vez mais estudados" size={44} />
    </Scene>

    {/* 9 · ácido gama-linolênico */}
    <Scene from={58.9} to={62.1}>
      <Card at={59.25} label="Ricos em" value="Ácido gama-linolênico" width={820} />
    </Scene>

    {/* 10 · vitamina E, antioxidante */}
    <Scene from={62.1} to={69.6}>
      <Ingrediente at={64.35} id="vitaminaE" nome="Vitamina E" size={230} />
      <Gap h={40} />
      <Frase at={65.53} text="Antioxidante" size={64} />
      <Gap h={16} />
      <Frase at={66.95} text="ajuda a proteger as células contra o estresse oxidativo" size={40} dim />
    </Scene>

    {/* 11 · não existe milagre */}
    <Scene from={69.6} to={80.9}>
      <Headline at={72.31} text="Não existe suplemento que faça *milagre*." size={88} />
      <Gap h={50} />
      <Frase at={75.03} text="Nenhuma cápsula substitui um estilo de vida saudável." size={46} />
      <Gap h={44} />
      <Card at={78.57} label="Suplemento é" value="uma ferramenta" width={600} />
    </Scene>

    {/* 12 · pergunta final, nas caixas dela */}
    <Scene from={80.9} to={90.5}>
      <CaixasGancho from={81.6} to={90.5} amarela="Qual sintoma mais te incomoda nessa fase?" branca="Me conta aqui nos comentários" y={300} />
    </Scene>
  </>
);
