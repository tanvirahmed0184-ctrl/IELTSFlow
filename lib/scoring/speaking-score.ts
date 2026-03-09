// Speaking evaluation scoring utilities

export interface SpeakingEvaluation {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
  overallBand: number;
  fillerWordAnalysis: { word: string; count: number }[];
  pauseAnalysis: { totalPauses: number; averageDuration: number };
  pronunciationFeedback: string[];
  vocabularyFeedback: string[];
  grammarFeedback: string[];
  suggestedStrategy: string;
}

export function calculateSpeakingBand(criteria: {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
}): number {
  const { fluencyCoherence, lexicalResource, grammaticalRange, pronunciation } = criteria;
  const average = (fluencyCoherence + lexicalResource + grammaticalRange + pronunciation) / 4;
  return Math.round(average * 2) / 2;
}
