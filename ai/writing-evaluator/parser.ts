// Parse Gemini API response into structured WritingEvaluation
import type { WritingEvaluation } from "@/lib/scoring/writing-score";

export function parseWritingEvaluation(rawResponse: string): WritingEvaluation {
  // TODO: Parse and validate the AI response
  try {
    const parsed = JSON.parse(rawResponse);
    return parsed as WritingEvaluation;
  } catch {
    throw new Error("Failed to parse writing evaluation response");
  }
}
