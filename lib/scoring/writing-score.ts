// Writing evaluation scoring utilities
// Mirrors the WritingEvaluation DB model structure

export interface WritingCriteriaScores {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularySuggestion {
  original: string;
  suggested: string;
  context: string;
}

export interface WritingEvaluationResult {
  criteria: WritingCriteriaScores;
  overallBand: number;
  strengths: string[];
  weaknesses: string[];
  corrections: WritingCorrection[];
  vocabularySuggestions: VocabularySuggestion[];
  sampleRewrite: string;
  examinerSummary: string;
}

export function calculateWritingBand(criteria: WritingCriteriaScores): number {
  const { taskAchievement, coherenceCohesion, lexicalResource, grammaticalRange } = criteria;
  const average = (taskAchievement + coherenceCohesion + lexicalResource + grammaticalRange) / 4;
  return Math.round(average * 2) / 2;
}

export function validateWritingBandScores(criteria: WritingCriteriaScores): boolean {
  return Object.values(criteria).every(
    (score) => score >= 0 && score <= 9 && score % 0.5 === 0
  );
}
