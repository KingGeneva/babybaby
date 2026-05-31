import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  TransitionSeries,
  springTiming,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { COLORS, inter } from "./theme";
import { SceneHook } from "./scenes/SceneHook";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneSolution } from "./scenes/SceneSolution";
import { SceneProof } from "./scenes/SceneProof";
import { SceneCTA } from "./scenes/SceneCTA";

const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 750], [0, 60]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 20%, ${COLORS.creamDeep} 0%, ${COLORS.cream} 60%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -200 + drift,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.gold}22 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150 - drift,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.coral}22 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: inter, background: COLORS.cream }}>
      <PersistentBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <SceneHook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={160}>
          <SceneProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: 20,
          })}
        />
        <TransitionSeries.Sequence durationInFrames={170}>
          <SceneSolution />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={160}>
          <SceneProof />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: 20,
          })}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
