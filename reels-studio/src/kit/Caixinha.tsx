import React from "react";
import { font } from "../theme";
import { Appear } from "./Appear";

/** Caixinha de pergunta do Instagram (sticker), com a pergunta do seguidor. */
export const Caixinha: React.FC<{ at: number; pergunta: string; rotate?: number; width?: number }> = ({
  at,
  pergunta,
  rotate = 0,
  width = 640,
}) => (
  <Appear at={at} from="scale">
    <div
      style={{
        width,
        transform: `rotate(${rotate}deg)`,
        borderRadius: 32,
        overflow: "hidden",
        boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #F58529, #DD2A7B, #8134AF)",
          color: "#fff",
          fontFamily: font.body,
          fontWeight: 700,
          fontSize: 30,
          textAlign: "center",
          padding: "16px 20px",
        }}
      >
        Faça uma pergunta
      </div>
      <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: 44, color: "#1C1B17", textAlign: "center", padding: "30px 34px" }}>
        {pergunta}
      </div>
    </div>
  </Appear>
);
