import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Browser, Cursor, Page, VIEWPORT } from "./components/Browser";
import { Caption, SceneIn, Stage, Tag } from "./components/Stage";
import {
  HOME,
  HomePage,
  TRY,
  TryOnPage,
  catalog,
  tryOnGenerateX,
  tryOnGenerateY,
} from "./components/AppScreens";
import { SamplePerson } from "./components/SamplePerson";
import { colors, easeOut, fonts, keyframes, path2d, tween } from "./theme";

const APP_URL = "clothifyy-ivory.vercel.app";

/* --------------------------------- 1. Intro -------------------------------- */

const floaters = [
  { img: "clothes/black_hoodie.png", x: 120, y: 120, r: -7, d: 0 },
  { img: "clothes/beige_t-shirt.png", x: 300, y: 600, r: 5, d: 6 },
  { img: "clothes/red_hoodie.png", x: 1520, y: 110, r: 6, d: 3 },
  { img: "clothes/jacket.png", x: 1350, y: 590, r: -4, d: 9 },
];

const GarmentCard = ({ img, w = 250, style }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: w * 1.25,
      borderRadius: 18,
      background: "#fff",
      boxShadow: "0 30px 60px rgba(40,30,20,0.16)",
      overflow: "hidden",
      ...style,
    }}
  >
    <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

export const Intro = () => {
  const frame = useCurrentFrame();
  const word = "Clothifyy";
  return (
    <Stage>
      {floaters.map((f, i) => {
        const p = tween(frame - 8 - f.d * 2, [0, 36], [0, 1], easeOut);
        return (
          <GarmentCard
            key={i}
            img={f.img}
            style={{
              left: f.x,
              top: f.y - frame * 0.35 + (1 - p) * 80,
              opacity: p * 0.95,
              transform: `rotate(${f.r + Math.sin((frame + i * 20) / 40) * 1.2}deg)`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", fontFamily: fonts.display, fontSize: 190, fontWeight: 500, color: colors.ink, letterSpacing: -4 }}>
          {word.split("").map((ch, i) => {
            const p = tween(frame - 14 - i * 3, [0, 26], [0, 1], easeOut);
            return (
              <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "inline-block" }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            fontFamily: fonts.displayItalic,
            fontStyle: "italic",
            fontSize: 62,
            color: "#2a2a2a",
            marginTop: 4,
            opacity: tween(frame, [52, 76], [0, 1]),
            transform: `translateY(${tween(frame, [52, 80], [20, 0], easeOut)}px)`,
          }}
        >
          Try your next look.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: colors.muted,
            fontWeight: 500,
            opacity: tween(frame, [78, 100], [0, 1]),
          }}
        >
          AI virtual try-on · in your browser
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/* -------------------------------- 2. Catalog ------------------------------- */

export const Catalog = () => {
  const frame = useCurrentFrame();
  const maxScroll = HOME.height - VIEWPORT.h;
  const SCROLL_A = 110;
  const scroll = keyframes(frame, [
    [0, 0],
    [24, 0],
    [66, SCROLL_A],
    [140, SCROLL_A],
    [210, maxScroll],
  ]);
  const sel = HOME.card(0).select;
  const selView = { x: sel.x, y: sel.y - SCROLL_A };
  const tryView = {
    x: HOME.tryBtn.x + HOME.tryBtn.w / 2,
    y: HOME.tryBtn.y + HOME.tryBtn.h / 2 - maxScroll,
  };
  const zoomScale = keyframes(frame, [
    [0, 1],
    [40, 1],
    [78, 1.3],
    [118, 1.3],
    [146, 1],
    [214, 1],
    [244, 1.2],
  ]);
  const card0 = HOME.card(0);
  const zoomFocus = frame < 180 ? { x: card0.x + HOME.cardW / 2, y: selView.y - 120 } : tryView;
  const cursor = path2d(frame, [
    [0, { x: 820, y: 640 }],
    [20, { x: 820, y: 640 }],
    [76, selView],
    [128, selView],
    [168, { x: 700, y: 520 }],
    [214, { x: 700, y: 520 }],
    [250, tryView],
  ]);
  const clicks = [86, 262];
  return (
    <Stage>
      <SceneIn>
        <Caption step="01" title="Browse the catalog" body="Pick a piece from the curated collection — one outfit at a time." />
        <Browser url={APP_URL} zoom={{ scale: zoomScale, ...zoomFocus }}>
          <Page scroll={scroll} height={HOME.height}>
            <HomePage selectedId={frame >= 88 ? 1 : null} />
          </Page>
          <Cursor x={cursor.x} y={cursor.y} clicks={clicks} />
        </Browser>
      </SceneIn>
    </Stage>
  );
};

/* ---------------------------- 3. Upload + Generate --------------------------- */

const UPLOAD_CLICK = 56;
const GEN_CLICK = 262;

export const TryOn = () => {
  const frame = useCurrentFrame();
  const photoP = tween(frame, [UPLOAD_CLICK + 34, UPLOAD_CLICK + 64], [0, 1], easeOut);
  const generating = frame >= GEN_CLICK + 2;
  const statusP = tween(frame, [GEN_CLICK + 4, GEN_CLICK + 22], [0, 1], easeOut);
  const scroll = keyframes(frame, [
    [0, 0],
    [GEN_CLICK + 26, 0],
    [GEN_CLICK + 80, 300],
  ]);

  const cardTop = TRY.headerH;
  const btnRight = TRY.rightX + TRY.rightW - 16;
  const cameraBtn = { x: btnRight - 57, y: cardTop + 16 + 22 };
  const uploadBtn = { x: btnRight - 114 - 8 - 39, y: cardTop + 16 + 22 };
  const genBtn = { x: tryOnGenerateX, y: tryOnGenerateY(1, 0) };

  const zoomScale = keyframes(frame, [
    [0, 1],
    [22, 1],
    [52, 1.18],
    [176, 1.18],
    [206, 1],
    [GEN_CLICK + 30, 1],
    [GEN_CLICK + 140, 1.08],
  ]);
  const zoomFocus = frame < 210 ? { x: 610, y: 110 } : { x: 610, y: 560 };

  const cursor = path2d(frame, [
    [0, { x: 560, y: 520 }],
    [14, { x: 560, y: 520 }],
    [48, uploadBtn],
    [118, uploadBtn],
    [138, cameraBtn],
    [190, cameraBtn],
    [250, genBtn],
    [GEN_CLICK + 20, genBtn],
    [GEN_CLICK + 60, { x: genBtn.x - 140, y: genBtn.y - 40 }],
  ]);
  const cameraHover = frame >= 136 && frame < 196;
  const tipP = tween(frame, [140, 152], [0, 1], easeOut) * (1 - tween(frame, [188, 198], [0, 1]));

  // file chip flying into the drop area
  const chipP = tween(frame, [UPLOAD_CLICK + 6, UPLOAD_CLICK + 40], [0, 1], easeOut);
  const chipOpacity = tween(frame, [UPLOAD_CLICK + 4, UPLOAD_CLICK + 10], [0, 1]) * (1 - tween(frame, [UPLOAD_CLICK + 38, UPLOAD_CLICK + 48], [0, 1]));
  const chipPos = {
    x: uploadBtn.x - 120 + (TRY.rightX + TRY.rightW / 2 - uploadBtn.x + 40) * chipP,
    y: uploadBtn.y + 30 + 170 * chipP,
  };

  const shimmer = ((frame * 2.4) % 170) - 35;

  return (
    <Stage>
      <SceneIn>
        <Caption step="02" title="Upload your photo" body="Add a clear, front-facing photo — or capture one with your camera." exitAt={214} />
        <Caption step="03" title="Generate the try-on" body="Your photo and the garment go to Gemini, which returns the try-on image plus size & fit notes." enterAt={228} />
        <Browser url={`${APP_URL}/try-on`} zoom={{ scale: zoomScale, ...zoomFocus }}>
          <Page scroll={scroll} height={1400}>
            <TryOnPage photoP={photoP} statusP={statusP} generating={generating} shimmer={shimmer} cameraHover={cameraHover} />
            {photoP > 0 ? (
              <Tag dark style={{ position: "absolute", left: TRY.rightX + 28, top: cardTop + 16 + 44 + 16 + 14 + statusP * TRY.statusH, fontSize: 13, padding: "5px 11px", opacity: photoP }}>
                Sample illustration
              </Tag>
            ) : null}
          </Page>
          {chipOpacity > 0 ? (
            <div
              style={{
                position: "absolute",
                left: chipPos.x,
                top: chipPos.y,
                opacity: chipOpacity,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                fontFamily: fonts.sans,
                fontSize: 15,
                fontWeight: 600,
                transform: `scale(${1 - chipP * 0.25})`,
              }}
            >
              <ImageIcon /> sample-photo.png
            </div>
          ) : null}
          {tipP > 0 ? (
            <div
              style={{
                position: "absolute",
                left: cameraBtn.x + 66 - 280,
                top: cameraBtn.y + 40,
                width: 280,
                boxSizing: "border-box",
                textAlign: "center",
                opacity: tipP,
                transform: `translateY(${(1 - tipP) * 8}px)`,
                padding: "9px 14px",
                borderRadius: 10,
                background: "#111",
                color: "#fff",
                fontFamily: fonts.sans,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Webcam capture built in
            </div>
          ) : null}
          <Cursor x={cursor.x} y={cursor.y} clicks={[UPLOAD_CLICK, GEN_CLICK]} />
        </Browser>
      </SceneIn>
    </Stage>
  );
};

const ImageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

/* -------------------------------- 4. Compare ------------------------------- */

const PANEL_W = 470;

export const Compare = () => {
  const frame = useCurrentFrame();
  const beforeP = tween(frame, [0, 26], [0, 1], easeOut);
  const afterIn = tween(frame, [14, 40], [0, 1], easeOut);
  const wipe = tween(frame, [48, 104], [0, 1]);
  const panelY = 220;
  const zoom = tween(frame, [0, 300], [1, 1.035]);
  const panel = (x, label, sub, child, p, extra) => (
    <div style={{ position: "absolute", left: x, top: panelY, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 20, color: colors.muted }}>{sub}</div>
      </div>
      <div style={{ position: "relative", width: PANEL_W, height: PANEL_W * 1.25, borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 80px rgba(40,30,20,0.2)" }}>
        {child}
        {extra}
      </div>
    </div>
  );
  return (
    <Stage>
      <Caption step="04" title="See the look" body="Compare the before and after side by side." />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "1240px 560px" }}>
        {panel(640, "Before", "Sample photo", <SamplePerson width={PANEL_W} id="before" />, beforeP)}
        {panel(
          1210,
          "After",
          "Illustrative preview",
          <>
            <SamplePerson width={PANEL_W} id="after-base" />
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
              <SamplePerson width={PANEL_W} id="after" garment="clothes/red_hoodie.png" />
            </div>
            {wipe > 0 && wipe < 1 ? (
              <div style={{ position: "absolute", top: 0, bottom: 0, left: `${wipe * 100}%`, width: 4, marginLeft: -2, background: "#fff", boxShadow: "0 0 24px rgba(255,255,255,0.9)" }} />
            ) : null}
          </>,
          afterIn,
          <Tag dark style={{ position: "absolute", left: 18, top: 18, opacity: tween(frame, [100, 116], [0, 1]) }}>
            Illustrative preview
          </Tag>
        )}
        <div
          style={{
            position: "absolute",
            left: 1210 - 30 - 46,
            top: panelY + 58 + (PANEL_W * 1.25) / 2 - 46,
            width: 92,
            height: 92,
            borderRadius: 46,
            background: "#fff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
            overflow: "hidden",
            opacity: afterIn,
          }}
        >
          <Img src={staticFile("clothes/red_hoodie.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 640,
          width: 1040,
          top: 908,
          fontSize: 21,
          lineHeight: 1.5,
          color: "#555",
          opacity: tween(frame, [110, 130], [0, 1]),
        }}
      >
        <b style={{ color: colors.ink }}>Illustrative preview:</b> the catalog’s Red Hoodie layered over a sample illustration
        for this demo — not an AI-generated result.
      </div>
    </Stage>
  );
};

/* ------------------------------ 5. Product URL ----------------------------- */

const DEMO_URL = "https://shop.example.com/products/red-hoodie";

export const ProductUrl = () => {
  const frame = useCurrentFrame();
  const INPUT_CLICK = 40;
  const LOAD_CLICK = 146;
  const typed = Math.floor(tween(frame, [50, 118], [0, DEMO_URL.length], (t) => t));
  const urlCardCenter = { x: HOME.urlCard.x + HOME.urlCard.w / 2, y: HOME.urlCard.y + HOME.urlCard.h / 2 };
  const zoomScale = keyframes(frame, [
    [0, 1],
    [10, 1],
    [42, 1.35],
  ]);
  const cursor = path2d(frame, [
    [0, { x: 760, y: 560 }],
    [8, { x: 760, y: 560 }],
    [36, HOME.input],
    [124, HOME.input],
    [142, HOME.loadBtn],
  ]);
  const infoP = tween(frame, [158, 180], [0, 1], easeOut);
  const rows = [
    ["og:title", "Product title"],
    ["og:image", "Product image"],
    ["product:price:amount", "Price"],
  ];
  return (
    <Stage>
      <SceneIn>
        <Caption step="05" title="Bring any product link" body="Paste a store URL — Clothifyy reads the page’s title, image and price, then opens Try-On." />
        <Browser url={APP_URL} zoom={{ scale: zoomScale, x: urlCardCenter.x, y: 60 }}>
          <Page height={HOME.height}>
            <HomePage
              urlFocused={frame >= INPUT_CLICK + 2}
              urlText={DEMO_URL.slice(0, typed)}
              caretOn={Math.floor(frame / 15) % 2 === 0 || (frame > 50 && frame < 120)}
              loading={frame >= LOAD_CLICK + 2}
            />
          </Page>
          <Cursor x={cursor.x} y={cursor.y} clicks={[INPUT_CLICK, LOAD_CLICK]} />
        </Browser>
        <div
          style={{
            position: "absolute",
            left: 1000,
            top: 640,
            width: 640,
            boxSizing: "border-box",
            padding: "26px 30px",
            borderRadius: 20,
            background: "rgba(17,17,17,0.93)",
            color: "#fff",
            opacity: infoP,
            transform: `translateY(${(1 - infoP) * 24}px)`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontSize: 17, letterSpacing: 3, textTransform: "uppercase", color: "#bdbdbd", fontWeight: 600 }}>
            Reads the page’s meta tags
          </div>
          {rows.map(([k, v], i) => {
            const p = tween(frame, [170 + i * 7, 186 + i * 7], [0, 1], easeOut);
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 22, opacity: p }}>
                <span style={{ fontFamily: "Menlo, monospace", color: "#f5d0c5" }}>{k}</span>
                <span>→ {v}</span>
              </div>
            );
          })}
        </div>
      </SceneIn>
    </Stage>
  );
};

/* ------------------------------- 6. Features ------------------------------- */

const features = [
  ["catalog", "Curated catalog", "Nine ready-to-try hoodies, tees, shirts and jackets."],
  ["link", "Product URL import", "Pulls title, image and price from a store page."],
  ["camera", "Camera capture", "Snap a photo with your webcam instead of uploading."],
  ["spark", "Gemini try-on", "Requests an image of the outfit on your photo."],
  ["ruler", "Fit insights", "Recommended size, fit & style notes, confidence score."],
  ["expand", "Full-size view", "Open the try-on result in a larger lightbox."],
];

const FeatureIcon = ({ kind }) => {
  const p = { fill: "none", stroke: "#111", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    catalog: (<><path {...p} d="M9 4l3 2 3-2 5 3-2 4-2-1v10H8V10l-2 1-2-4z" /></>),
    link: (<><path {...p} d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path {...p} d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>),
    camera: (<><path {...p} d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle {...p} cx="12" cy="13" r="3.5" /></>),
    spark: (<><path {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path {...p} d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></>),
    ruler: (<><rect {...p} x="3" y="8" width="18" height="8" rx="1.5" /><path {...p} d="M7 8v3M11 8v4M15 8v3M19 8v2" /></>),
    expand: (<><path {...p} d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></>),
  };
  return <svg width="40" height="40" viewBox="0 0 24 24">{icons[kind]}</svg>;
};

export const Features = () => {
  const frame = useCurrentFrame();
  return (
    <Stage>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", opacity: tween(frame, [0, 20], [0, 1]), transform: `translateY(${tween(frame, [0, 26], [20, 0], easeOut)}px)` }}>
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: colors.muted, fontWeight: 600 }}>What’s inside</div>
        <div style={{ fontFamily: fonts.display, fontSize: 76, fontWeight: 500, marginTop: 12, letterSpacing: -1 }}>Built for trying on</div>
      </div>
      <div style={{ position: "absolute", left: 180, top: 370, width: 1560, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 30 }}>
        {features.map(([icon, title, body], i) => {
          const p = tween(frame - 18 - i * 7, [0, 26], [0, 1], easeOut);
          return (
            <div
              key={title}
              style={{
                height: 230,
                boxSizing: "border-box",
                padding: "34px 36px",
                borderRadius: 24,
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 20px 50px rgba(40,30,20,0.10)",
                border: "1px solid rgba(0,0,0,0.05)",
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px) scale(${0.97 + p * 0.03})`,
              }}
            >
              <FeatureIcon kind={icon} />
              <div style={{ fontSize: 32, fontWeight: 600, marginTop: 18, color: colors.ink }}>{title}</div>
              <div style={{ fontSize: 23, lineHeight: 1.4, marginTop: 10, color: "#555" }}>{body}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/* -------------------------------- 7. Outro --------------------------------- */

export const Outro = () => {
  const frame = useCurrentFrame();
  const p = tween(frame, [0, 30], [0, 1], easeOut);
  const fan = ["clothes/green_hoodie.png", "clothes/red_hoodie.png", "clothes/blue_shirt.png"];
  return (
    <Stage tone="dark">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 360, height: 230, marginBottom: 40 }}>
          {fan.map((img, i) => {
            const q = tween(frame - 4 - i * 5, [0, 30], [0, 1], easeOut);
            const r = (i - 1) * 12 * q;
            return (
              <GarmentCard
                key={img}
                img={img}
                w={150}
                style={{
                  left: 105 + (i - 1) * 90 * q,
                  top: 20 + Math.abs(i - 1) * 16 * q,
                  opacity: q,
                  transform: `rotate(${r}deg)`,
                  zIndex: i === 1 ? 2 : 1,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                }}
              />
            );
          })}
        </div>
        <div style={{ fontFamily: fonts.display, fontSize: 150, fontWeight: 500, color: "#fff", letterSpacing: -3, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
          Clothifyy
        </div>
        <div style={{ fontFamily: fonts.displayItalic, fontStyle: "italic", fontSize: 50, color: "#d8d2ca", marginTop: 2, opacity: tween(frame, [18, 40], [0, 1]) }}>
          Try your next look.
        </div>
        <div
          style={{
            marginTop: 44,
            padding: "18px 36px",
            borderRadius: 999,
            background: "#fff",
            color: "#111",
            fontSize: 36,
            fontWeight: 600,
            opacity: tween(frame, [34, 54], [0, 1]),
            transform: `scale(${tween(frame, [34, 60], [0.92, 1], easeOut)})`,
          }}
        >
          {APP_URL}
        </div>
        <div style={{ marginTop: 34, fontSize: 24, color: "#a9a39b", letterSpacing: 1, opacity: tween(frame, [50, 70], [0, 1]) }}>
          github.com/naman15sardana/clothifyy · Next.js · React · Tailwind CSS · Gemini API
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
