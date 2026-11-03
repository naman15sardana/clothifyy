import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Easing, interpolate } from "remotion";

const playfair = loadPlayfair("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const playfairItalic = loadPlayfair("italic", {
  weights: ["400", "500"],
  subsets: ["latin"],
});
const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const fonts = {
  display: playfair.fontFamily,
  displayItalic: playfairItalic.fontFamily,
  sans: inter.fontFamily,
  // The production app renders with Arial (see app/globals.css), so the
  // recreated screens use it too.
  app: "Arial, Helvetica, sans-serif",
};

export const colors = {
  stage: "#f4f1ec",
  stageDeep: "#e9e3da",
  ink: "#111111",
  muted: "#6b6b6b",
  line: "#e5e7eb",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray900: "#111827",
  emerald50: "#ecfdf5",
  emerald700: "#047857",
};

export const FPS = 30;

export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Interpolate with clamping and a smooth default easing.
export const tween = (frame, input, output, easing = ease) =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Piecewise keyframes: [[frame, value], ...] -> eased value at `frame`.
export const keyframes = (frame, points, easing = ease) => {
  if (frame <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [f0, v0] = points[i];
    const [f1, v1] = points[i + 1];
    if (frame <= f1) return tween(frame, [f0, f1], [v0, v1], easing);
  }
  return points[points.length - 1][1];
};

// Same as keyframes but for {x, y} points.
export const path2d = (frame, points, easing = ease) => ({
  x: keyframes(frame, points.map(([f, p]) => [f, p.x]), easing),
  y: keyframes(frame, points.map(([f, p]) => [f, p.y]), easing),
});
