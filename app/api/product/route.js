import { NextResponse } from "next/server";

const META_REGEX_CACHE = new Map();

function extractMeta(html, key) {
  const cacheKey = `meta-${key}`;
  if (!META_REGEX_CACHE.has(cacheKey)) {
    META_REGEX_CACHE.set(
      cacheKey,
      new RegExp(
        `<meta[^>]+(?:property|name|itemprop)=[\"']${key}[\"'][^>]+content=[\"']([^\"']+)[\"']`,
        "i"
      )
    );
  }
  const regex = META_REGEX_CACHE.get(cacheKey);
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractPrice(html) {
  const amount =
    extractMeta(html, "product:price:amount") ||
    extractMeta(html, "og:price:amount") ||
    extractMeta(html, "price");
  const currency =
    extractMeta(html, "product:price:currency") ||
    extractMeta(html, "og:price:currency");

  if (!amount) return null;
  return currency ? `${amount} ${currency}` : amount;
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product page (${response.status})`);
    }

    const html = await response.text();

    const title =
      extractMeta(html, "og:title") ||
      extractMeta(html, "twitter:title") ||
      extractTitle(html);
    const image =
      extractMeta(html, "og:image") || extractMeta(html, "twitter:image");
    const price = extractPrice(html);
    const category =
      extractMeta(html, "product:category") ||
      extractMeta(html, "og:category") ||
      null;

    return NextResponse.json({
      title: title || null,
      image: image || null,
      price: price || null,
      category,
      url: parsedUrl.toString(),
    });
  } catch (error) {
    console.error("product resolve error", error);
    return NextResponse.json(
      { error: error.message || "Failed to resolve product" },
      { status: 500 }
    );
  }
}
