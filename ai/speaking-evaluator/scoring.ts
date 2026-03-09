// Speaking score calculation using Gemini AI
import type { SpeakingEvaluation } from "@/lib/scoring/speaking-score";

export async function evaluateSpeaking(
  transcript: string,
  part: 1 | 2 | 3,
  topic: string
): Promise<SpeakingEvaluation> {
  // TODO: Call Gemini API to evaluate speaking performance
  throw new Error("Not implemented");
}
