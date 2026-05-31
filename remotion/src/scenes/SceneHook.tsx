import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, fraunces, inter } from "../theme";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const line1 = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14 },
  });
  const line2 = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14 },
  });
  const accent = spring({
    frame: frame - 45,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        padding: 80,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          opacity: badgeSpring,
          transform: `translateY(${interpolate(badgeSpring, [0, 1], [20, 0])}px)`,
          padding: "12px 28px",
          background: COLORS.navy,
          color: COLORS.cream,
          borderRadius: 999,
          fontFamily: inter,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 1,
          marginBottom: 60,
        }}
      >
        BABYBABY.ORG
      </div>

      <div
        style={{
          fontFamily: fraunces,
          fontSize: 110,
          lineHeight: 1.05,
          color: COLORS.navy,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [40, 0])}px)`,
          }}
        >
          Et si{" "}
          <span
            style={{
              color: COLORS.coral,
              fontStyle: "italic",
              opacity: accent,
            }}
          >
            une seule
          </span>
        </div>
        <div
          style={{
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [40, 0])}px)`,
            marginTop: 20,
          }}
        >
          app remplaçait
          <br />
          vos 7 onglets
          <br />
          de jeune parent ?
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame, [60, 80], [0, 1], {
            extrapolateRight: "clamp",
          }),
          marginTop: 60,
          width: 120,
          height: 6,
          borderRadius: 3,
          background: COLORS.gold,
        }}
      />
    </AbsoluteFill>
  );
};
