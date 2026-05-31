import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { COLORS, fraunces, inter } from "../theme";

export const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phone = spring({ frame, fps, config: { damping: 14 } });
  const title = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 40, fps, config: { damping: 14 } });

  const float = Math.sin(frame / 20) * 12;

  return (
    <AbsoluteFill style={{ padding: 80, alignItems: "center" }}>
      <div
        style={{
          marginTop: 60,
          opacity: phone,
          transform: `translateY(${interpolate(phone, [0, 1], [60, float])}px) scale(${interpolate(phone, [0, 1], [0.85, 1])})`,
          width: 620,
        }}
      >
        <Img
          src={staticFile("images/phone-mockup.png")}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <div
        style={{
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [30, 0])}px)`,
          fontFamily: fraunces,
          fontSize: 96,
          color: COLORS.navy,
          fontWeight: 700,
          marginTop: 30,
          textAlign: "center",
        }}
      >
        BabyBaby
      </div>
      <div
        style={{
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [20, 0])}px)`,
          fontFamily: inter,
          fontSize: 38,
          color: COLORS.muted,
          marginTop: 12,
          textAlign: "center",
        }}
      >
        Tout en 1.{" "}
        <span style={{ color: COLORS.coral, fontWeight: 600 }}>
          100 % gratuit.
        </span>
      </div>
    </AbsoluteFill>
  );
};
