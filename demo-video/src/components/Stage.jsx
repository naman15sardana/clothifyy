import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, easeOut, fonts, tween } from "../theme";

// Warm studio backdrop shared by every scene.
export const Stage = ({ children, tone = "light" }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;
  const bg =
    tone === "dark"
      ? `radial-gradient(1200px 800px at ${70 + drift / 20}% 20%, #2a2725 0%, #121110 60%, #0b0a0a 100%)`
      : `radial-gradient(1400px 900px at ${75 + drift / 20}% 15%, #ffffff 0%, ${colors.stage} 45%, ${colors.stageDeep} 100%)`;
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: fonts.sans }}>
      {children}
    </AbsoluteFill>
  );
};

// Left-column step caption used on the product screens.
export const Caption = ({ step, title, body, enterAt = 0, exitAt = null }) => {
  const frame = useCurrentFrame();
  const local = frame - enterAt;
  const inP = tween(local, [0, 22], [0, 1], easeOut);
  const outP = exitAt === null ? 0 : tween(frame, [exitAt, exitAt + 14], [0, 1]);
  const opacity = inP * (1 - outP);
  const y = (1 - inP) * 30 - outP * 20;
  const lineW = tween(local, [6, 34], [0, 64], easeOut);

  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 330,
        width: 420,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {step ? (
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            color: colors.muted,
            textTransform: "uppercase",
          }}
        >
          Step {step}
        </div>
      ) : null}
      <div
        style={{
          height: 2,
          width: lineW,
          background: colors.ink,
          margin: "22px 0 26px",
        }}
      />
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 66,
          lineHeight: 1.05,
          fontWeight: 500,
          color: colors.ink,
          letterSpacing: -1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 27,
          lineHeight: 1.45,
          color: "#444",
          fontWeight: 400,
        }}
      >
        {body}
      </div>
    </div>
  );
};

// Small pill label, e.g. "Illustrative preview".
export const Tag = ({ children, dark = false, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 16px",
      borderRadius: 999,
      fontFamily: fonts.sans,
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: 0.3,
      background: dark ? "rgba(17,17,17,0.82)" : "rgba(255,255,255,0.92)",
      color: dark ? "#fff" : colors.ink,
      boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
      ...style,
    }}
  >
    {children}
  </div>
);

// Fades content in at the start of a scene and gently scales it.
export const SceneIn = ({ children, from = 0 }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame - from, [0, 40], [1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>
  );
};
