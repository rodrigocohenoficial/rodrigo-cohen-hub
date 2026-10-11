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
