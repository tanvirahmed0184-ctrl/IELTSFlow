import { getGeminiClient, GEMINI_TEXT_MODEL } from "@/lib/gemini";
import { buildWritingEvaluationPrompt } from "./prompt";
import { parseWritingEvaluation } from "./parser";
import type { WritingEvaluationResult } from "@/lib/scoring/writing-score";

export async function evaluateWriting(
  taskType: string,
  promptText: string,
  response: string
): Promise<WritingEvaluationResult & { rawResponse: string; model: string }> {
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  const systemPrompt = buildWritingEvaluationPrompt(
    taskType,
    promptText,
    response,
    wordCount
  );

  const client = getGeminiClient();
  const result = await client.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: systemPrompt,
    config: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

  const rawText = result.text ?? "";

  // Strip potential markdown code fences from the response
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const evaluation = parseWritingEvaluation(cleaned);

  return {
    ...evaluation,
    rawResponse: rawText,
    model: GEMINI_TEXT_MODEL,
  };
}
