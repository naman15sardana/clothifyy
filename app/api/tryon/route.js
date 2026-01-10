import { NextResponse } from "next/server";
import { getGemini, fileToGenerativePart } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop";

async function fileFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch product image (${response.status})`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());

  return { buffer, mimeType: contentType };
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const userImage = formData.get("userImage");
    const productImage = formData.get("productImage");
    const productImageUrl = formData.get("productImageUrl");
    const title = formData.get("title")?.toString() || "Product";
    const price = formData.get("price")?.toString() || "";
    const category = formData.get("category")?.toString() || "";

    if (!userImage || typeof userImage === "string") {
      return NextResponse.json(
        { error: "userImage file is required" },
        { status: 400 }
      );
    }

    let userBuffer = Buffer.from(await userImage.arrayBuffer());
    let userMimeType = userImage.type || "image/jpeg";

    let productBuffer;
    let productMimeType = "image/jpeg";

    if (productImage && typeof productImage !== "string") {
      productBuffer = Buffer.from(await productImage.arrayBuffer());
      productMimeType = productImage.type || "image/jpeg";
    } else {
      const candidates = [];
      if (productImageUrl) {
        candidates.push(productImageUrl.toString());
      }
      candidates.push(FALLBACK_PRODUCT_IMAGE);

      let lastError;
      for (const url of candidates) {
        try {
          const result = await fileFromUrl(url);
          productBuffer = result.buffer;
          productMimeType = result.mimeType;
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!productBuffer) {
        throw lastError || new Error("productImage or productImageUrl is required");
      }
    }

    const { visionModel, jsonModel } = getGemini();

    const tryOnPrompt = [
      "You are a virtual try-on assistant.",
      "First image: the user's full or upper-body photo.",
      "Second image: a clothing product photo (front view).",
      "Create a realistic composite showing the user wearing the product.",
      "Preserve the user's face, skin tone, pose, and background.",
      "Align the garment naturally on the torso without distortion.",
      "Do not change hair, face, or body shape.",
      "Output only the final try-on image.",
      `Product details: ${title} ${price ? `priced at ${price}` : ""} ${category}`,
    ].join(" ");

    const tryOnResponse = await visionModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                tryOnPrompt,
                "Return ONLY a single data URL string for a PNG image in the format:",
                "`data:image/png;base64,....`",
                "No explanations, no JSON, no markdown.",
              ].join(" "),
            },
            fileToGenerativePart(userBuffer, userMimeType),
            fileToGenerativePart(productBuffer, productMimeType),
          ],
        },
      ],
    });

    const tryOnText = tryOnResponse?.response?.text?.().trim() || "";
    const dataUrlMatch = tryOnText.match(
      /data:image\/png;base64,[A-Za-z0-9+/=]+/
    );
    const tryOnImage = dataUrlMatch ? dataUrlMatch[0] : null;

    if (!tryOnImage) {
      throw new Error("Gemini did not return an image data URL");
    }

    const jsonPrompt = [
      "You are a concise fit and style expert.",
      "Given the user's photo and the clothing product, return JSON only with keys:",
      `recommendedSize: one of ["XS","S","M","L","XL","XXL","Numeric"]`,
      'fitNotes: brief sentence about fit (tight/ok/loose),',
      "styleNotes: brief style guidance,",
      "confidence: integer 0-100 representing how confident the recommendation is.",
      `Product: ${title} ${price ? `priced at ${price}` : ""} ${category}`,
      "Respond with JSON only, no markdown, no code fences.",
    ].join(" ");

    const jsonResponse = await jsonModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: jsonPrompt },
            fileToGenerativePart(userBuffer, userMimeType),
            fileToGenerativePart(productBuffer, productMimeType),
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let insights = {
      recommendedSize: null,
      fitNotes: null,
      styleNotes: null,
      confidence: null,
    };

    try {
      const parsed = JSON.parse(jsonResponse.response.text() || "{}");
      insights = {
        recommendedSize: parsed.recommendedSize || null,
        fitNotes: parsed.fitNotes || null,
        styleNotes: parsed.styleNotes || null,
        confidence:
          parsed.confidence !== undefined
            ? Number(parsed.confidence)
            : null,
      };
    } catch (error) {
      console.error("Failed to parse Gemini JSON", error);
    }

    return NextResponse.json({
      tryOnImage,
      ...insights,
    });
  } catch (error) {
    console.error("tryon error", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate try-on" },
      { status: 500 }
    );
  }
}
