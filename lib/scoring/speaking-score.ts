// Speaking evaluation scoring utilities
// Mirrors the SpeakingAiEvaluation DB model structure

export interface SpeakingCriteriaScores {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
}

export interface FillerWordEntry {
  word: string;
  count: number;
  timestamps?: number[];
}

export interface PauseAnalysis {
  totalPauses: number;
  averageDurationMs: number;
  longestPauseMs: number;
  pauseLocations?: number[];
}

export interface SpeakingEvaluationResult {
  criteria: SpeakingCriteriaScores;
  overallBand: number;
  fillerWordAnalysis: FillerWordEntry[];
  pauseAnalysis: PauseAnalysis;
  pronunciationFeedback: string[];
  vocabularyFeedback: string[];
  grammarFeedback: string[];
  suggestedStrategy: string;
}

export function calculateSpeakingBand(criteria: SpeakingCriteriaScores): number {
  const { fluencyCoherence, lexicalResource, grammaticalRange, pronunciation } = criteria;
  const average = (fluencyCoherence + lexicalResource + grammaticalRange + pronunciation) / 4;
  return Math.round(average * 2) / 2;
}

export function validateSpeakingBandScores(criteria: SpeakingCriteriaScores): boolean {
  return Object.values(criteria).every(
    (score) => score >= 0 && score <= 9 && score % 0.5 === 0
  );
}
