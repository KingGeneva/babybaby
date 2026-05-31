import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: fraunces } = loadFraunces("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
export const { fontFamily: inter } = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const COLORS = {
  cream: "#FAF7F2",
  creamDeep: "#F0E9DD",
  navy: "#1B2A4E",
  coral: "#E76F51",
  gold: "#D4A574",
  muted: "#6B7280",
};
