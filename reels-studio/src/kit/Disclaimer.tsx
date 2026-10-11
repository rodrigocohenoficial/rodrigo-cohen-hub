import React from "react";
import { font } from "../theme";

/** Aviso discreto no pé da animação (compliance). */
export const Disclaimer: React.FC<{ text?: string }> = ({ text = "Resultado passado não garante resultado futuro." }) => (
  <div
    style={{
      position: "absolute",
      bottom: 120,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: font.body,
      fontWeight: 500,
      fontSize: 24,
      letterSpacing: 1,
      color: "rgba(242,237,226,0.5)",
    }}
  >
    {text}
  </div>
);
