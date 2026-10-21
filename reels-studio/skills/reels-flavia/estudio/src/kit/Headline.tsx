import React from "react";
import { color, font } from "../theme";
import { Appear } from "./Appear";

type Props = {
  at: number;
  /** Use *asteriscos* para pintar palavras de dourado. */
  text: string;
  size?: number;
  serif?: boolean;
};

/** Frase grande de impacto. */
export const Headline: React.FC<Props> = ({ at, text, size = 110, serif = true }) => {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <Appear at={at} from="up">
      <div
        style={{
          fontFamily: serif ? font.title : font.body,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.02,
          letterSpacing: -2,
          color: color.bone,
          textAlign: "center",
          padding: "0 70px",
        }}
      >
        {parts.map((p, i) =>
          p.startsWith("*") ? (
            <span key={i} style={{ color: color.brassLight, fontStyle: serif ? "italic" : "normal" }}>
              {p.slice(1, -1)}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </Appear>
  );
};
