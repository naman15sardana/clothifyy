import { AbsoluteFill } from "remotion";

// Fade-through transition: the outgoing scene fades out, then the incoming
// scene fades in, so text from two scenes never overlaps.
const DipPresentation = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  const entering = presentationDirection === "entering";
  const opacity = entering ? Math.max(0, p * 2 - 1) : 1 - Math.min(1, p * 2);
  const scale = entering ? 1.015 - 0.015 * p : 1 - 0.01 * p;
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>{children}</AbsoluteFill>
  );
};

export const dip = () => ({ component: DipPresentation, props: {} });
