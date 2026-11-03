# Clothifyy

**Try your next look.** Clothifyy is an AI virtual try-on app: pick a piece from the catalog (or paste a product URL), upload or capture your photo, and preview the outfit on yourself.

Live app: [clothifyy-ivory.vercel.app](https://clothifyy-ivory.vercel.app)

## Video Demo

[![Clothifyy demo — click to watch the full video](demo-video/media/preview.gif)](demo-video/media/clothifyy-demo.mp4)

▶️ **[Watch the full demo (MP4, 56 s)](demo-video/media/clothifyy-demo.mp4)**

> **Note:** The before/after comparison in the demo is an *illustrative preview* — the catalog's Red Hoodie layered over a sample illustration — not an AI-generated try-on result. The app screens are recreated in [Remotion](https://www.remotion.dev); source and render commands are in [`demo-video/`](demo-video/README.md).

*Built at a hackathon.*

## How it works

1. **Choose an item:** pick one from the built-in catalog (hoodies, t-shirts, shirts, jackets), or **paste a product link** from an online store. The app pulls the product's title, price, and image from the page.
2. **Add your photo:** upload or capture a picture of yourself.
3. **See the result:** the Gemini API generates an image of you wearing the selected item, shown next to the product details.

## Built with

Next.js (App Router) · React · Tailwind CSS · Google Gemini API · deployed on Vercel

- `app/api/product`: extracts product details from a store link
- `app/api/tryon`: sends your photo and the product image to Gemini and returns the try-on image
- `data/clothes.js`: the built-in catalog

## Run it locally

```bash
npm install
npm run dev
```

Create a `.env.local` file with your own key:

```
GEMINI_API_KEY=...
```

Then open [http://localhost:3000](http://localhost:3000).
