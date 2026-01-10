import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const imageModel =
    process.env.GEMINI_IMAGE_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-2.0-flash-exp";
  const jsonModel =
    process.env.GEMINI_JSON_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-1.5-flash";

  return {
    visionModel: client.getGenerativeModel({ model: imageModel }),
    jsonModel: client.getGenerativeModel({ model: jsonModel }),
  };
}

export function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}
