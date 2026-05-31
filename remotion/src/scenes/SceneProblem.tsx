import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, fraunces, inter } from "../theme";

const items = [
  { emoji: "🍼", label: "Dernière tétée ?" },
  { emoji: "💉", label: "Prochain vaccin ?" },
  { emoji: "😴", label: "Bruit blanc ?" },
  { emoji: "🔄", label: "À qui le tour ?" },
];

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ padding: 80, justifyContent: "center" }}>
      <div
        style={{
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [30, 0])}px)`,
          fontFamily: fraunces,
          fontSize: 72,
          color: COLORS.navy,
          fontWeight: 600,
          marginBottom: 60,
          lineHeight: 1.1,
        }}
      >
        3h du matin.
        <br />
        <span style={{ color: COLORS.coral, fontStyle: "italic" }}>
          Trop de questions.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map((it, i) => {
          const appear = spring({
            frame: frame - 20 - i * 18,
            fps,
            config: { damping: 14 },
          });
          return (
            <div
              key={it.label}
              style={{
                opacity: appear,
                transform: `translateX(${interpolate(appear, [0, 1], [-60, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "28px 36px",
                background: "#FFFFFF",
                borderRadius: 28,
                boxShadow: "0 10px 30px rgba(27,42,78,0.08)",
                fontFamily: inter,
                fontSize: 48,
                color: COLORS.navy,
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 60 }}>{it.emoji}</span>
              <span>{it.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
