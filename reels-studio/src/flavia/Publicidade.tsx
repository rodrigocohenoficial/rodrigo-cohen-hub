import React from "react";
import { font } from "../theme";

/** Marcação de publicidade (CONAR), pequena e discreta. */
export const Publicidade: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 70,
      right: 50,
      fontFamily: font.body,
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: 1,
      color: "rgba(46,34,38,0.6)",
      background: "rgba(255,255,255,0.6)",
      padding: "6px 14px",
      borderRadius: 20,
    }}
  >
    Publicidade
  </div>
);
