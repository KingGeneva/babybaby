import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, fraunces, inter } from "../theme";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 14 } });
  const t2 = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  const accent = spring({
    frame: frame - 40,
    fps,
    config: { damping: 10, stiffness: 120 },
  });
  const url = spring({ frame: frame - 55, fps, config: { damping: 14 } });
  const pulse = 1 + Math.sin(frame / 8) * 0.02;

  return (
    <AbsoluteFill
      style={{
        padding: 80,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          fontFamily: fraunces,
          fontSize: 88,
          color: COLORS.navy,
          fontWeight: 600,
          lineHeight: 1.1,
        }}
      >
        Vos premiers
      </div>
      <div
        style={{
          opacity: t2,
          transform: `scale(${interpolate(t2, [0, 1], [0.7, 1])})`,
          fontFamily: fraunces,
          fontSize: 180,
          color: COLORS.coral,
          fontWeight: 700,
          fontStyle: "italic",
          lineHeight: 1,
          margin: "20px 0",
        }}
      >
        1000 jours
      </div>
      <div
        style={{
          opacity: accent,
          fontFamily: fraunces,
          fontSize: 88,
          color: COLORS.navy,
          fontWeight: 600,
          lineHeight: 1.1,
        }}
      >
        sereinement.
      </div>

      <div
        style={{
          opacity: url,
          transform: `scale(${pulse})`,
          marginTop: 80,
          padding: "32px 60px",
          background: COLORS.navy,
          color: COLORS.cream,
          borderRadius: 999,
          fontFamily: inter,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: 1,
          boxShadow: `0 20px 60px ${COLORS.navy}44`,
        }}
      >
        babybaby.org
      </div>

      <div
        style={{
          opacity: interpolate(frame, [70, 90], [0, 1], {
            extrapolateRight: "clamp",
          }),
          marginTop: 40,
          fontFamily: inter,
          fontSize: 28,
          color: COLORS.muted,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Gratuit · Sans pub · Sans carte
      </div>
    </AbsoluteFill>
  );
};
