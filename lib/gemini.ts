import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 1000,
    temperature: 0.7,
  },
});

export const visionModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
