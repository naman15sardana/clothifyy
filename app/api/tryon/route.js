import { NextResponse } from "next/server";
import { getGemini, fileToGenerativePart } from "@/lib/gemini";
import { Jimp } from "jimp";

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

    const tryGenerateWithGemini = async () => {
      try {
        const prompt = [
          "Task: Virtual Try-On.",
          "Image 1 is a person.",
          "Image 2 is a clothing item (front view).",
          "Generate a realistic photo of the person wearing the clothing.",
          "Maintain the person's identity, pose, and background.",
          "Ensure the garment fits naturally on their body.",
          `Product details: ${title} ${price ? `priced at ${price}` : ""} ${category}`,
        ].join(" ");

        const response = await visionModel.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                fileToGenerativePart(userBuffer, userMimeType),
                fileToGenerativePart(productBuffer, productMimeType),
              ],
            },
          ],
        });

        const inlinePart =
          response?.response?.candidates?.[0]?.content?.parts?.find(
            (part) => part.inlineData?.data
          );
        if (inlinePart?.inlineData?.data) {
          const mime = inlinePart.inlineData.mimeType || "image/png";
          return `data:${mime};base64,${inlinePart.inlineData.data}`;
        }

        const text = response?.response?.text?.().trim() || "";
        const dataUrlMatch = text.match(
          /data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+/
        );
        if (dataUrlMatch) {
          return dataUrlMatch[0];
        }
      } catch (error) {
        console.error("Gemini image generation failed", error);
      }
      return null;
    };

    const createOverlay = async () => {
      try {
        const userJimp = await Jimp.read(userBuffer);
        const productJimp = await Jimp.read(productBuffer);

        const targetWidth = Math.floor(userJimp.getWidth() * 0.6);
        const resizedProduct = productJimp.resize(targetWidth, Jimp.AUTO);

        const x = Math.floor(
          (userJimp.getWidth() - resizedProduct.getWidth()) / 2
        );
        const y = Math.floor(userJimp.getHeight() * 0.25);

        userJimp.composite(resizedProduct, x, y, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 0.9,
        });

        const resultBuffer = await userJimp.getBufferAsync(Jimp.MIME_PNG);
        return `data:image/png;base64,${resultBuffer.toString("base64")}`;
      } catch (error) {
        console.error("Failed to create overlay preview", error);
        return null;
      }
    };

    const transparentFallback = async () => {
      const blank = new Jimp(1, 1, 0x00000000);
      const buffer = await blank.getBufferAsync(Jimp.MIME_PNG);
      return `data:image/png;base64,${buffer.toString("base64")}`;
    };

    let tryOnImage = await tryGenerateWithGemini();
    if (!tryOnImage) {
      tryOnImage = await createOverlay();
    }
    if (!tryOnImage) {
      tryOnImage = await transparentFallback();
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
          parsed.confidence !== undefined ? Number(parsed.confidence) : null,
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
