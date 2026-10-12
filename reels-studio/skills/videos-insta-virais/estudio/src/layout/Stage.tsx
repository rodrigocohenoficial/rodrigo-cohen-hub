import React from "react";
import { AbsoluteFill } from "remotion";
import { color, font, layout, STAGE_HEIGHT, WIDTH } from "../theme";

/** Fundo da metade de cima: verde profundo, grade sutil e brilho dourado. */
export const Stage: React.FC<{ tag?: string; children: React.ReactNode }> = ({
  tag,
  children,
}) => {
  // As cenas são desenhadas numa tela de 1080x960 e reduzidas quando a área de animação é menor (ex: 60/40).
  const k = Math.min(1, layout.stageHeight / STAGE_HEIGHT);
  return (
    <AbsoluteFill
      style={{
        height: layout.stageHeight,
        overflow: "hidden",
        background: color.evergreenDeep,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${color.evergreen} 0%, ${color.evergreenDeep} 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${color.grid} 2px, transparent 2px), linear-gradient(90deg, ${color.grid} 2px, transparent 2px)`,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: STAGE_HEIGHT,
          transform: k < 1 ? `scale(${k})` : undefined,
          transformOrigin: "top center",
        }}
      >
        {tag && (
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 5,
              color: color.textDim,
            }}
          >
            {tag.toUpperCase()}
          </div>
        )}
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 60,
          }}
        >
          {children}
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
