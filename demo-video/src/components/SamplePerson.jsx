import { Img, staticFile } from "remotion";

// Illustrated sample model (not a real person). 4:5 portrait, 400x500 units.
// With `garment` set, the product image is layered over the torso as an
// illustrative overlay — this is NOT an AI-generated try-on result.
export const SamplePerson = ({ width = 400, garment = null, id = "p" }) => {
  const skin = "#d9a988";
  const skinShade = "#c8946f";
  const hair = "#2b201b";
  return (
    <div
      style={{
        position: "relative",
        width,
        height: width * 1.25,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 400 500"
        width={width}
        height={width * 1.25}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id={`${id}-bg`} cx="50%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#f3eee7" />
            <stop offset="100%" stopColor="#d9d1c6" />
          </radialGradient>
          <linearGradient id={`${id}-tee`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e9e9e6" />
            <stop offset="50%" stopColor="#fbfbf9" />
            <stop offset="100%" stopColor="#e4e4e0" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id}-bg)`} />
        {/* floor shadow / backdrop sweep */}
        <ellipse cx="200" cy="520" rx="230" ry="60" fill="#cfc6ba" opacity="0.5" />

        {/* back hair */}
        <path
          d="M134 170 C126 110 160 86 200 86 C244 86 276 112 268 176 C266 214 262 240 256 262 C236 276 164 276 144 262 C138 240 134 214 134 170 Z"
          fill={hair}
        />
        {/* neck */}
        <path
          d="M178 238 L222 238 L226 300 C214 312 186 312 174 300 Z"
          fill={skinShade}
        />
        {/* torso in plain white tee */}
        <path
          d="M52 500 C56 392 78 338 128 318 C150 309 166 302 176 296 C188 308 212 308 224 296 C234 302 250 309 272 318 C322 338 344 392 348 500 Z"
          fill={`url(#${id}-tee)`}
        />
        <path
          d="M176 296 C188 312 212 312 224 296"
          stroke="#d4d4cf"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M116 402 C122 450 124 476 124 500" stroke="#dadad5" strokeWidth="3" fill="none" />
        <path d="M284 402 C278 450 276 476 276 500" stroke="#dadad5" strokeWidth="3" fill="none" />
        {/* ears */}
        <ellipse cx="146" cy="188" rx="9" ry="15" fill={skinShade} />
        <ellipse cx="254" cy="188" rx="9" ry="15" fill={skinShade} />
        {/* face */}
        <path
          d="M148 170 C148 120 172 104 200 104 C228 104 252 120 252 170 C252 214 232 252 200 254 C168 252 148 214 148 170 Z"
          fill={skin}
        />
        {/* front hair */}
        <path
          d="M140 166 C138 112 168 90 204 92 C240 94 264 118 260 164 C250 136 232 124 214 122 C196 132 168 140 150 150 C146 156 143 160 140 166 Z"
          fill={hair}
        />
        {/* brows */}
        <path d="M168 164 C176 159 186 159 192 162" stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M208 162 C214 159 224 159 232 164" stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* eyes */}
        <ellipse cx="180" cy="180" rx="5.5" ry="4" fill="#2a1d17" />
        <ellipse cx="220" cy="180" rx="5.5" ry="4" fill="#2a1d17" />
        {/* nose */}
        <path d="M200 186 C198 198 196 206 202 208" stroke={skinShade} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* lips */}
        <path d="M186 224 C194 230 206 230 214 224" stroke="#a8624f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </svg>

      {garment ? (
        <>
          {/* garment overlay sits over the torso */}
          <Img
            src={staticFile(garment)}
            style={{
              position: "absolute",
              left: `${(-50 / 400) * 100}%`,
              top: `${(134 / 500) * 100}%`,
              width: `${(500 / 400) * 100}%`,
            }}
          />
          {/* redraw neck + face above the hood so the hood sits behind the head */}
          <svg
            viewBox="0 0 400 500"
            width={width}
            height={width * 1.25}
            style={{ position: "absolute", inset: 0 }}
          >
            <path d="M178 238 L222 238 L224 276 C212 286 188 286 176 276 Z" fill={skinShade} />
            <ellipse cx="146" cy="188" rx="9" ry="15" fill={skinShade} />
            <ellipse cx="254" cy="188" rx="9" ry="15" fill={skinShade} />
            <path
              d="M148 170 C148 120 172 104 200 104 C228 104 252 120 252 170 C252 214 232 252 200 254 C168 252 148 214 148 170 Z"
              fill={skin}
            />
            <path
              d="M140 166 C138 112 168 90 204 92 C240 94 264 118 260 164 C250 136 232 124 214 122 C196 132 168 140 150 150 C146 156 143 160 140 166 Z"
              fill={hair}
            />
            <path d="M168 164 C176 159 186 159 192 162" stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M208 162 C214 159 224 159 232 164" stroke={hair} strokeWidth="4" fill="none" strokeLinecap="round" />
            <ellipse cx="180" cy="180" rx="5.5" ry="4" fill="#2a1d17" />
            <ellipse cx="220" cy="180" rx="5.5" ry="4" fill="#2a1d17" />
            <path d="M200 186 C198 198 196 206 202 208" stroke={skinShade} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M186 224 C194 230 206 230 214 224" stroke="#a8624f" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          </svg>
        </>
      ) : null}
    </div>
  );
};
