import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { dip } from "./components/dip";
import { colors } from "./theme";
import { Catalog, Compare, Features, Intro, Outro, ProductUrl, TryOn } from "./Scenes";

export const TRANSITION = 16;

export const scenes = [
  { id: "intro", component: Intro, duration: 150 },
  { id: "catalog", component: Catalog, duration: 300 },
  { id: "tryon", component: TryOn, duration: 420 },
  { id: "compare", component: Compare, duration: 290 },
  { id: "product-url", component: ProductUrl, duration: 230 },
  { id: "features", component: Features, duration: 200 },
  { id: "outro", component: Outro, duration: 180 },
];

export const DEMO_DURATION =
  scenes.reduce((sum, s) => sum + s.duration, 0) - TRANSITION * (scenes.length - 1);

export const Demo = () => (
  <AbsoluteFill style={{ background: colors.stage }}>
  <TransitionSeries>
    {scenes.flatMap(({ id, component: Scene, duration }, i) => {
      const items = [
        <TransitionSeries.Sequence key={id} durationInFrames={duration}>
          <Scene />
        </TransitionSeries.Sequence>,
      ];
      if (i < scenes.length - 1) {
        items.push(
          <TransitionSeries.Transition
            key={`${id}-t`}
            presentation={dip()}
            timing={linearTiming({ durationInFrames: TRANSITION })}
          />
        );
      }
      return items;
    })}
  </TransitionSeries>
  </AbsoluteFill>
);
