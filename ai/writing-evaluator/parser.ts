// Parse Gemini API response into structured WritingEvaluationResult
import type { WritingEvaluationResult } from "@/lib/scoring/writing-score";
import { validateWritingBandScores, calculateWritingBand } from "@/lib/scoring/writing-score";

export function parseWritingEvaluation(rawResponse: string): WritingEvaluationResult {
  try {
    const parsed = JSON.parse(rawResponse);

    const criteria = {
      taskAchievement: parsed.taskAchievement ?? parsed.task_achievement,
      coherenceCohesion: parsed.coherenceCohesion ?? parsed.coherence_cohesion,
      lexicalResource: parsed.lexicalResource ?? parsed.lexical_resource,
      grammaticalRange: parsed.grammaticalRange ?? parsed.grammatical_range,
    };

    if (!validateWritingBandScores(criteria)) {
      throw new Error("Invalid band scores: must be 0-9 in 0.5 increments");
    }

    return {
      criteria,
      overallBand: calculateWritingBand(criteria),
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      corrections: parsed.corrections ?? [],
      vocabularySuggestions: parsed.vocabularySuggestions ?? parsed.vocabulary_suggestions ?? [],
      sampleRewrite: parsed.sampleRewrite ?? parsed.sample_rewrite ?? "",
      examinerSummary: parsed.examinerSummary ?? parsed.examiner_summary ?? "",
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response as JSON");
    }
    throw error;
  }
}
