import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const client = new GoogleGenerativeAI(apiKey);

  return {
    visionModel: client.getGenerativeModel({ model: "gemini-1.5-flash" }),
    jsonModel: client.getGenerativeModel({ model: "gemini-1.5-flash" }),
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
