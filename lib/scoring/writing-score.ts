// Writing evaluation scoring utilities

export interface WritingEvaluation {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  overallBand: number;
  strengths: string[];
  weaknesses: string[];
  corrections: { original: string; corrected: string; explanation: string }[];
  vocabularySuggestions: string[];
  sampleRewrite: string;
  examinerSummary: string;
}

export function calculateWritingBand(criteria: {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
}): number {
  const { taskAchievement, coherenceCohesion, lexicalResource, grammaticalRange } = criteria;
  const average = (taskAchievement + coherenceCohesion + lexicalResource + grammaticalRange) / 4;
  return Math.round(average * 2) / 2;
}
