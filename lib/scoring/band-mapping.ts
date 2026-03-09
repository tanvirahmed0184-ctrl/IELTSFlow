// IELTS band score mapping utilities

export const BAND_SCORES = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9] as const;

export type BandScore = (typeof BAND_SCORES)[number];

export function rawToListeningBand(correctAnswers: number): BandScore {
  // TODO: Implement official IELTS listening band mapping
  if (correctAnswers >= 39) return 9;
  if (correctAnswers >= 37) return 8.5;
  if (correctAnswers >= 35) return 8;
  if (correctAnswers >= 33) return 7.5;
  if (correctAnswers >= 30) return 7;
  if (correctAnswers >= 27) return 6.5;
  if (correctAnswers >= 23) return 6;
  if (correctAnswers >= 20) return 5.5;
  if (correctAnswers >= 16) return 5;
  if (correctAnswers >= 13) return 4.5;
  if (correctAnswers >= 10) return 4;
  return 3.5;
}

export function rawToReadingBand(correctAnswers: number, isAcademic: boolean = true): BandScore {
  // TODO: Implement reading band mapping (different for Academic vs General)
  if (correctAnswers >= 39) return 9;
  if (correctAnswers >= 37) return 8.5;
  if (correctAnswers >= 35) return 8;
  if (correctAnswers >= 33) return 7.5;
  if (correctAnswers >= 30) return 7;
  if (correctAnswers >= 27) return 6.5;
  if (correctAnswers >= 23) return 6;
  if (correctAnswers >= 19) return 5.5;
  if (correctAnswers >= 15) return 5;
  if (correctAnswers >= 13) return 4.5;
  if (correctAnswers >= 10) return 4;
  return 3.5;
}

export function calculateOverallBand(scores: number[]): BandScore {
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const rounded = Math.round(average * 2) / 2;
  return rounded as BandScore;
}
