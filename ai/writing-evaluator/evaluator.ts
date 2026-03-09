// Writing evaluation using Google Gemini API
// TODO: Implement actual Gemini API call

import type { WritingTaskType } from "@/lib/generated/prisma/client";
import type { WritingEvaluationResult } from "@/lib/scoring/writing-score";

export async function evaluateWriting(
  _taskType: WritingTaskType,
  _promptText: string,
  _response: string
): Promise<WritingEvaluationResult> {
  // TODO: Call Gemini API with the appropriate evaluation prompt
  // 1. Select prompt template based on taskType
  // 2. Send to Gemini with rubric-based instructions
  // 3. Parse structured JSON response
  // 4. Validate band scores are on the 0.5 scale
  throw new Error("Not implemented");
}
