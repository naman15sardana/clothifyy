import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  // Use v1 by default; allow overrides via env.
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";
  const jsonModelName = process.env.GEMINI_JSON_MODEL || modelName;
  const apiVersion = process.env.GEMINI_API_VERSION || "v1";
  const apiEndpoint = `https://generativelanguage.googleapis.com/${apiVersion}`;

  const client = new GoogleGenerativeAI(apiKey, {
    apiVersion,
    apiEndpoint,
  });

  return {
    visionModel: client.getGenerativeModel({ model: modelName }),
    jsonModel: client.getGenerativeModel({ model: jsonModelName }),
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
