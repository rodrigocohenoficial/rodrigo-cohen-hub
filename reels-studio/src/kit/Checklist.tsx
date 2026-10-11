import React from "react";
import { color, font } from "../theme";
import { Appear } from "./Appear";

type Item = { text: string; at: number; ok?: boolean };

/** Lista em que cada item entra (com ✓ ou ✕) no segundo em que você fala dele. */
export const Checklist: React.FC<{ items: Item[]; title?: string; titleAt?: number }> = ({ items, title, titleAt }) => (
  <div style={{ width: 860 }}>
    {title && (
      <Appear at={titleAt ?? items[0]?.at ?? 0}>
        <div style={{ fontFamily: font.body, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: color.brassLight, marginBottom: 24 }}>
          {title.toUpperCase()}
        </div>
      </Appear>
    )}
    {items.map((it) => {
      const ok = it.ok ?? true;
      return (
        <Appear key={it.text} at={it.at} from="left">
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 22 }}>
            <div
              style={{
                width: 72,
                height: 72,
                flexShrink: 0,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
                fontWeight: 800,
                fontFamily: font.body,
                color: color.ink,
                background: ok ? color.gain : color.loss,
              }}
            >
              {ok ? "✓" : "✕"}
            </div>
            <div style={{ fontFamily: font.body, fontWeight: 700, fontSize: 54, color: color.bone, lineHeight: 1.1 }}>{it.text}</div>
          </div>
        </Appear>
      );
    })}
  </div>
);
