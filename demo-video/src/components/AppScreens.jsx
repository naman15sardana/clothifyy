// Faithful recreations of the Clothifyy screens (app/page.js, app/try-on/page.js)
// laid out with fixed coordinates so the cursor can target controls precisely.
import { Img, staticFile } from "remotion";
import { colors, fonts } from "../theme";
import { VIEWPORT } from "./Browser";
import { SamplePerson } from "./SamplePerson";

// Same items, names and prices as data/clothes.js
export const catalog = [
  { id: 1, name: "Red Hoodie", image: "clothes/red_hoodie.png", price: "$68" },
  { id: 2, name: "Black Hoodie", image: "clothes/black_hoodie.png", price: "$74" },
  { id: 3, name: "Green Hoodie", image: "clothes/green_hoodie.png", price: "$69" },
  { id: 4, name: "Beige T-Shirt", image: "clothes/beige_t-shirt.png", price: "$59" },
  { id: 5, name: "White T-Shirt", image: "clothes/white_tshirt.png", price: "$64" },
  { id: 6, name: "Blue Shirt", image: "clothes/blue_shirt.png", price: "$73" },
  { id: 7, name: "Grey Shirt", image: "clothes/gray_shirt.png", price: "$66" },
  { id: 8, name: "Denim Jacket", image: "clothes/jacket.png", price: "$80" },
  { id: 9, name: "Black Jacket", image: "clothes/jacket_2.png", price: "$76" },
];

/* ---------------------------------- Home ---------------------------------- */

const W = VIEWPORT.w;
export const HOME = (() => {
  const gridW = 1092;
  const gap = 33;
  const cardW = (gridW - gap * 2) / 3;
  const imgW = cardW - 32;
  const imgH = imgW * 1.25;
  const cardH = 16 + imgH + 12 + 44 + 16;
  const gridX = (W - gridW) / 2;
  const gridY = 268;
  const urlCard = { x: (W - 768) / 2, y: 128, w: 768, h: 104 };
  const gridBottom = gridY + cardH * 3 + gap * 2;
  const tryBtn = { w: 236, h: 50, x: (W - 236) / 2, y: gridBottom + 40 };
  const card = (i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = gridX + col * (cardW + gap);
    const y = gridY + row * (cardH + gap);
    return {
      x,
      y,
      // center of the Select button
      select: { x: x + cardW - 16 - 44, y: y + 16 + imgH + 12 + 22 },
    };
  };
  return {
    cardW,
    imgW,
    imgH,
    cardH,
    urlCard,
    tryBtn,
    card,
    input: { x: urlCard.x + 16 + 230, y: urlCard.y + 52 },
    loadBtn: { x: urlCard.x + 768 - 16 - 60, y: urlCard.y + 52 },
    height: tryBtn.y + tryBtn.h + 40,
  };
})();

const pill = (dark) => ({
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 500,
  padding: "8px 16px",
  background: dark ? "#000" : colors.gray200,
  color: dark ? "#fff" : colors.gray900,
  whiteSpace: "nowrap",
});

const ClothingCard = ({ item, selected, x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: HOME.cardW,
      height: HOME.cardH,
      boxSizing: "border-box",
      borderRadius: 12,
      padding: 16,
      background: colors.gray50,
      border: `1px solid ${selected ? "#000" : colors.gray200}`,
      boxShadow: selected
        ? "0 0 0 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.05)"
        : "0 1px 2px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        width: HOME.imgW,
        height: HOME.imgH,
        borderRadius: 8,
        overflow: "hidden",
        background: colors.gray100,
      }}
    >
      <Img
        src={staticFile(item.image)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
    <div
      style={{
        marginTop: 12,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{item.name}</div>
        <div style={{ fontSize: 14, color: colors.gray600, marginTop: 2 }}>
          {item.price}
        </div>
      </div>
      <div style={pill(selected)}>{selected ? "Selected" : "Select"}</div>
    </div>
  </div>
);

export const HomePage = ({
  selectedId = null,
  urlText = "",
  urlFocused = false,
  loading = false,
  caretOn = true,
}) => (
  <div style={{ position: "absolute", inset: 0, height: HOME.height }}>
    <div
      style={{
        position: "absolute",
        top: 32,
        width: W,
        textAlign: "center",
        fontSize: 30,
        fontWeight: 700,
      }}
    >
      AI Virtual Try-On
    </div>
    <div
      style={{
        position: "absolute",
        top: 84,
        width: W,
        textAlign: "center",
        fontSize: 16,
        color: colors.gray600,
      }}
    >
      Select an outfit to try on
    </div>

    <div
      style={{
        position: "absolute",
        left: HOME.urlCard.x,
        top: HOME.urlCard.y,
        width: HOME.urlCard.w,
        height: HOME.urlCard.h,
        boxSizing: "border-box",
        borderRadius: 16,
        border: `1px solid ${colors.gray200}`,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        padding: 16,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 0.6,
            color: colors.gray500,
            textTransform: "uppercase",
          }}
        >
          Try any product URL
        </div>
        <div
          style={{
            marginTop: 6,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${urlFocused ? "#000" : colors.gray200}`,
            boxShadow: urlFocused ? "0 0 0 1px #000" : "0 1px 2px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontSize: 14,
            color: urlText ? colors.gray900 : colors.gray400,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {urlText || (urlFocused ? "" : "Paste a product link (e.g. H&M product page)")}
          {urlFocused && caretOn ? (
            <span style={{ width: 1.5, height: 18, background: "#000", marginLeft: 1 }} />
          ) : null}
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: colors.gray500 }}>
          We’ll fetch the title and image and take you to Try-On.
        </div>
      </div>
      <div
        style={{
          ...pill(true),
          marginTop: 22,
          fontWeight: 700,
          padding: "9px 20px",
          background: loading ? colors.gray400 : "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        {loading ? "Loading…" : "Load & Try"}
      </div>
    </div>

    {catalog.map((item, i) => {
      const { x, y } = HOME.card(i);
      return (
        <ClothingCard key={item.id} item={item} x={x} y={y} selected={selectedId === item.id} />
      );
    })}

    <div
      style={{
        position: "absolute",
        left: HOME.tryBtn.x,
        top: HOME.tryBtn.y,
        width: HOME.tryBtn.w,
        height: HOME.tryBtn.h,
        borderRadius: 12,
        background: selectedId ? "#000" : colors.gray400,
        color: "#fff",
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Try Selected ({selectedId ? 1 : 0})
    </div>
  </div>
);

/* --------------------------------- Try-On --------------------------------- */

export const TRY = (() => {
  const maxW = 1024;
  const x0 = (W - maxW) / 2;
  const colGap = 16;
  const leftW = ((maxW - colGap) * 1.1) / 2.1;
  const rightW = maxW - colGap - leftW;
  const rightX = x0 + leftW + colGap;
  return {
    x0,
    maxW,
    leftW,
    rightW,
    rightX,
    headerH: 100,
    statusH: 40,
    uploadBtn: { x: rightX + rightW - 16 - 122 - 8 - 40, y: 0 },
    cameraBtn: { x: rightX + rightW - 16 - 61, y: 0 },
  };
})();

const Card = ({ children, style }) => (
  <div
    style={{
      boxSizing: "border-box",
      borderRadius: 12,
      border: `1px solid ${colors.gray200}`,
      background: "#fff",
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 12, letterSpacing: 0.6, color: colors.gray500, textTransform: "uppercase" }}>
    {children}
  </div>
);

// photoP: 0..1 reveal of uploaded photo; statusP: 0..1 status pill reveal;
// generating: bool; shimmer: frame-based phase for the loading panel.
export const TryOnPage = ({
  photoP = 0,
  statusP = 0,
  generating = false,
  shimmer = 0,
  cameraHover = false,
}) => {
  const product = catalog[0];
  const photoAreaH = 280 + photoP * 96; // grows from h-64 to fit the photo
  const topShift = statusP * TRY.statusH;
  const hasPhoto = photoP > 0.5;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: TRY.x0, top: 24, width: TRY.maxW }}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>Virtual Try-On</div>
        <div style={{ marginTop: 8, fontSize: 16, color: colors.gray600 }}>
          Upload your photo and let Gemini visualize the product on you.
        </div>
        {statusP > 0 ? (
          <div
            style={{
              marginTop: 10,
              display: "inline-flex",
              padding: "4px 12px",
              borderRadius: 999,
              background: colors.emerald50,
              color: colors.emerald700,
              fontSize: 14,
              opacity: statusP,
            }}
          >
            Generating with Gemini…
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: TRY.x0,
          top: TRY.headerH + topShift,
          width: TRY.maxW,
          display: "flex",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <Card style={{ width: TRY.leftW }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Label>Product</Label>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{product.name}</div>
              <div style={{ color: "#374151", marginTop: 2 }}>{product.price}</div>
              <div style={{ marginTop: 16 }}>
                <Label>Product URL</Label>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <div
                    style={{
                      width: 300,
                      height: 36,
                      borderRadius: 8,
                      border: `1px solid ${colors.gray200}`,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 12px",
                      fontSize: 13,
                      color: colors.gray400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    Paste a product link (e.g. H&M product page)
                  </div>
                  <div style={{ ...pill(true), fontWeight: 700 }}>Load</div>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: colors.gray500 }}>
                  Fetch product title and image from a store URL.
                </div>
              </div>
            </div>
            <div style={{ width: 96, height: 128, borderRadius: 8, overflow: "hidden", background: colors.gray100 }}>
              <Img src={staticFile(product.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </Card>

        <Card style={{ width: TRY.rightW }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Your photo</div>
              <div style={{ fontSize: 14, color: colors.gray600, marginTop: 2 }}>
                Upload a clear, front-facing photo.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={pill(true)}>Upload</div>
              <div
                style={{
                  ...pill(false),
                  background: cameraHover ? colors.gray100 : "#fff",
                  border: "1px solid #d1d5db",
                  padding: "7px 15px",
                }}
              >
                Use Camera
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              height: photoAreaH,
              boxSizing: "border-box",
              borderRadius: 8,
              border: `1px dashed ${colors.gray200}`,
              background: colors.gray50,
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: colors.gray500,
              position: "relative",
            }}
          >
            {photoP < 0.3 ? <span style={{ opacity: 1 - photoP / 0.3 }}>No photo selected</span> : null}
            {photoP > 0 ? (
              <div
                style={{
                  position: "absolute",
                  opacity: Math.min(1, photoP * 1.4),
                  transform: `scale(${0.94 + photoP * 0.06})`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <SamplePerson width={281} id="upload" />
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <TryOnLower
        top={TRY.headerH + topShift + 16 + 44 + 16 + photoAreaH + 16 + 24}
        enabled={hasPhoto}
        generating={generating}
        shimmer={shimmer}
      />
    </div>
  );
};

export const tryOnGenerateY = (photoP, statusP) =>
  TRY.headerH + statusP * TRY.statusH + 16 + 44 + 16 + (280 + photoP * 96) + 16 + 24 + 22;
export const tryOnGenerateX = TRY.x0 + TRY.maxW - 88;

const TryOnLower = ({ top, enabled, generating, shimmer }) => (
  <div style={{ position: "absolute", left: TRY.x0, top, width: TRY.maxW }}>
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          ...pill(true),
          fontWeight: 700,
          padding: "13px 24px",
          background: enabled && !generating ? "#000" : colors.gray400,
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        {generating ? "Generating…" : "Generate Try-On"}
      </div>
    </div>
    <Card style={{ marginTop: 24 }}>
      <div style={{ fontWeight: 700 }}>Try-On Result</div>
      <div style={{ fontSize: 14, color: colors.gray600, marginTop: 2 }}>
        Generated by Gemini based on your photo and the product.
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <div
          style={{
            flex: 1,
            height: 280,
            borderRadius: 8,
            border: `1px dashed ${colors.gray200}`,
            background: colors.gray50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: colors.gray500,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {generating ? (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(100deg, transparent ${shimmer - 30}%, rgba(0,0,0,0.075) ${shimmer}%, transparent ${shimmer + 30}%)`,
                }}
              />
              Generating preview…
            </>
          ) : (
            "No preview yet"
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["Recommended Size", "—"],
            ["Fit Notes", "No fit notes yet"],
            ["Style Notes", "No style notes yet"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                borderRadius: 8,
                border: `1px solid ${colors.gray200}`,
                background: colors.gray50,
                padding: 12,
              }}
            >
              <Label>{k}</Label>
              <div style={{ fontSize: k === "Recommended Size" ? 18 : 14, fontWeight: k === "Recommended Size" ? 700 : 400, marginTop: 4, color: "#1f2937" }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

export const appFont = fonts.app;
