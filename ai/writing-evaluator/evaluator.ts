// Writing evaluation using Google Gemini API
// TODO: Implement actual Gemini API call

import type { WritingEvaluation } from "@/lib/scoring/writing-score";

export async function evaluateWriting(
  taskType: "task1" | "task2",
  prompt: string,
  response: string
): Promise<WritingEvaluation> {
  // TODO: Call Gemini API with the appropriate evaluation prompt
  throw new Error("Not implemented");
}
