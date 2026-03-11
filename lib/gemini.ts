import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (_client) return _client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  _client = new GoogleGenAI({ apiKey });
  return _client;
}

export const GEMINI_TEXT_MODEL = "gemini-2.0-flash";
export const GEMINI_EMBEDDING_MODEL = "text-embedding-005";
