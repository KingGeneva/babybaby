import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, fraunces, inter } from "../theme";

const stats = [
  { value: "15 000", label: "familles" },
  { value: "4,9/5", label: "satisfaction" },
  { value: "OMS", label: "courbes officielles" },
  { value: "0 €", label: "pour toujours" },
];

export const SceneProof: React.FC = () => {
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
          fontSize: 80,
          color: COLORS.navy,
          fontWeight: 600,
          marginBottom: 60,
          lineHeight: 1.05,
        }}
      >
        Déjà{" "}
        <span style={{ color: COLORS.coral, fontStyle: "italic" }}>
          adopté
        </span>{" "}
        par&nbsp;:
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        {stats.map((s, i) => {
          const appear = spring({
            frame: frame - 20 - i * 12,
            fps,
            config: { damping: 14 },
          });
          return (
            <div
              key={s.label}
              style={{
                opacity: appear,
                transform: `scale(${interpolate(appear, [0, 1], [0.7, 1])})`,
                padding: "40px 28px",
                background: i % 2 === 0 ? COLORS.navy : "#FFFFFF",
                color: i % 2 === 0 ? COLORS.cream : COLORS.navy,
                borderRadius: 32,
                boxShadow: "0 12px 40px rgba(27,42,78,0.10)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 240,
              }}
            >
              <div
                style={{
                  fontFamily: fraunces,
                  fontSize: 76,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: i % 2 === 0 ? COLORS.gold : COLORS.coral,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: inter,
                  fontSize: 28,
                  marginTop: 14,
                  textAlign: "center",
                  opacity: 0.85,
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
