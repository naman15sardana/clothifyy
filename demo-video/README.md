# Clothifyy demo video

Editable [Remotion](https://www.remotion.dev) source for the ~56 s, 1920×1080 Clothifyy demo.
It recreates the app's screens from `app/page.js` and `app/try-on/page.js` using the real
catalog images, and calls **no** paid APIs (no Gemini requests).

## Output

| File | What |
| --- | --- |
| `media/clothifyy-demo.mp4` | Final video, 1920×1080, 30 fps, H.264 (~7 MB) |
| `media/preview.gif` | Lightweight README preview, 720 px wide, 8 fps |

## Commands

Run from this folder:

```bash
npm install
```

```bash
npm run preview
```

Opens Remotion Studio to scrub and edit the video live.

```bash
npm run render
```

Renders `out/clothifyy-demo-raw.mp4` (high quality). Then produce the publishable files:

```bash
ffmpeg -y -i out/clothifyy-demo-raw.mp4 -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -an media/clothifyy-demo.mp4
```

```bash
rm -rf out/gif && mkdir -p out/gif && ffmpeg -i media/clothifyy-demo.mp4 -vf "fps=8,scale=720:-1:flags=lanczos" out/gif/f%04d.png && gifski --fps 8 --width 720 --quality 70 -o media/preview.gif out/gif/f*.png
```

(`ffmpeg` and `gifski` are available via `brew install ffmpeg gifski`.)

## Structure

- `src/Demo.jsx` — scene order, durations and transitions
- `src/Scenes.jsx` — the seven scenes (intro, catalog, upload + generate, before/after, product URL, features, outro)
- `src/components/AppScreens.jsx` — recreated Clothifyy screens
- `src/components/SamplePerson.jsx` — illustrated sample model (not a real person)
- `src/components/Browser.jsx` — browser frame, camera zoom and animated cursor
- `public/clothes/` — resized copies of the app's catalog images

## Honesty note

The repository has no saved Gemini try-on outputs, so the "After" panel is an
**illustrative preview**: the catalog's Red Hoodie image layered over the sample
illustration. It is labelled as such in the video and is not an AI-generated result.
