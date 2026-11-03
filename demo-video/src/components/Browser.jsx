import { useCurrentFrame } from "remotion";
import { colors, easeOut, fonts, tween } from "../theme";

export const BROWSER = { x: 600, y: 96, w: 1220, h: 888, bar: 56 };
export const VIEWPORT = { w: BROWSER.w, h: BROWSER.h - BROWSER.bar };

// Desktop browser chrome with a "camera" that can zoom into the page.
// `zoom` = { scale, x, y } where x/y is the viewport point kept in focus.
export const Browser = ({ url, children, zoom = { scale: 1, x: 0, y: 0 } }) => {
  const frame = useCurrentFrame();
  const enter = tween(frame, [0, 28], [0, 1], easeOut);
  return (
    <div
      style={{
        position: "absolute",
        left: BROWSER.x,
        top: BROWSER.y,
        width: BROWSER.w,
        height: BROWSER.h,
        borderRadius: 22,
        overflow: "hidden",
        background: "#fff",
        boxShadow:
          "0 50px 120px rgba(40,30,20,0.22), 0 12px 30px rgba(40,30,20,0.10)",
        border: "1px solid rgba(0,0,0,0.06)",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 40}px)`,
      }}
    >
      <div
        style={{
          height: BROWSER.bar,
          background: "#f6f6f6",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 10,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div
            key={c}
            style={{ width: 14, height: 14, borderRadius: 7, background: c }}
          />
        ))}
        <div
          style={{
            marginLeft: 26,
            flex: 1,
            maxWidth: 620,
            height: 34,
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #e4e4e4",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 10,
            fontFamily: fonts.sans,
            fontSize: 17,
            color: "#555",
          }}
        >
          <LockIcon />
          {url}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: VIEWPORT.w,
          height: VIEWPORT.h,
          overflow: "hidden",
          background: colors.gray50,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${zoom.x}px ${zoom.y}px`,
            transform: `scale(${zoom.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const LockIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16">
    <rect x="1" y="7" width="12" height="8.5" rx="2" fill="#8a8a8a" />
    <path
      d="M4 7V5a3 3 0 0 1 6 0v2"
      stroke="#8a8a8a"
      strokeWidth="1.8"
      fill="none"
    />
  </svg>
);

// Scrollable page inside the viewport.
export const Page = ({ scroll = 0, height, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: -scroll,
      width: VIEWPORT.w,
      height,
      fontFamily: fonts.app,
      color: colors.gray900,
    }}
  >
    {children}
  </div>
);

// Animated pointer with click ripples. `clicks` are frame numbers.
export const Cursor = ({ x, y, clicks = [], opacity = 1 }) => {
  const frame = useCurrentFrame();
  let press = 0;
  const ripples = [];
  for (const c of clicks) {
    const d = frame - c;
    if (d >= -4 && d <= 6) press = Math.max(press, 1 - Math.abs(d - 1) / 5);
    if (d >= 0 && d < 24) ripples.push({ c, d });
  }
  const s = 1 - press * 0.16;
  return (
    <>
      {ripples.map(({ c, d }) => (
        <div
          key={c}
          style={{
            position: "absolute",
            left: x - 30,
            top: y - 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            border: "3px solid rgba(17,17,17,0.55)",
            background: "rgba(17,17,17,0.08)",
            transform: `scale(${tween(d, [0, 24], [0.3, 1.5], easeOut)})`,
            opacity: tween(d, [0, 24], [1, 0]),
            pointerEvents: "none",
          }}
        />
      ))}
      <svg
        width="34"
        height="40"
        viewBox="0 0 34 40"
        style={{
          position: "absolute",
          left: x - 6,
          top: y - 3,
          transform: `scale(${s})`,
          transformOrigin: "6px 3px",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
          opacity,
          zIndex: 50,
        }}
      >
        <path
          d="M6 3 L6 33 L13.5 25.5 L18.5 37 L23.5 34.8 L18.6 23.6 L29 23.6 Z"
          fill="#111"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
