import { Composition } from "remotion";
import { DEMO_DURATION, Demo } from "./Demo";
import { FPS } from "./theme";

export const RemotionRoot = () => (
  <Composition
    id="ClothifyyDemo"
    component={Demo}
    durationInFrames={DEMO_DURATION}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
